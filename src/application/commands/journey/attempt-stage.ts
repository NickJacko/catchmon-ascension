/**
 * Design owner: docs/rebuild/02_CORE_GAMEPLAY_LOOP_AND_SESSION_DESIGN.md §1
 * Canonical Core Loop ("push stage/boss"); docs/rebuild/03 §9 Determinism;
 * docs/rebuild/07 §3 Journey Rank, §7 Unlock Philosophy ("Expeditions:
 * first region completion"); docs/rebuild/08 §3 Region Unlock ("prior-
 * region milestone"); docs/rebuild/15 Phases R2/R6.
 *
 * Resolves the player's current Journey stage against their Lead's
 * composed combat stats. On WIN:
 * - advances `journey` to the next stage, credits the stage's Echo
 *   Charge/Coin rewards, and grants Bond progress to the Lead/Bond
 *   Supports (Document 06 §7);
 * - credits real Journey Rank progress (`applyJourneyRankProgress` — a
 *   distinct meter from Shop Rank, see `slices.ts`'s `ProgressionState`
 *   doc comment), more for a boss than a normal stage;
 * - if the stage was NOT a boss, advances `journey.stableFarmStageIndex`
 *   (docs/rebuild/03 §10/§12 "stable farm checkpoint" — never points at a
 *   boss stage, by construction, so offline reconciliation can never
 *   auto-clear one);
 * - if the stage completes its Region (`isRegionCompletionBoss`), records
 *   `REGION_COMPLETED_MILESTONE` in that Region's `world.regionMilestones`
 *   entry, and — on the FIRST Region completion of any kind — adds
 *   `EXPEDITIONS_SYSTEM_MILESTONE` to `progression.unlockedSystemIds`
 *   (docs/rebuild/07 §7's unlock sequence; this is what
 *   `START_EXPEDITION` now gates on instead of Shop Infrastructure
 *   ownership — see that file's own doc comment).
 *
 * On LOSS/TIMEOUT: no progression, no rewards — only `journey.lastBattle`
 * is recorded, for failure-explanation UI (Document 02 §10) to read later.
 */
import { err, ok } from "../../../core/result/index.ts";
import {
  createRandomSource,
  deriveSubSeed,
  nextRandomEventCounter,
} from "../../../core/random/index.ts";
import { safeAddCoins, toCoins } from "../../../core/math/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { applyBondProgress } from "../../../domain/catchmons/index.ts";
import { simulateBattle } from "../../../domain/combat/index.ts";
import {
  currentStage,
  EXPEDITIONS_SYSTEM_MILESTONE,
  nextStageIndex,
  orderedStages,
  REGION_COMPLETED_MILESTONE,
} from "../../../domain/journey/index.ts";
import { applyJourneyRankProgress } from "../../../domain/progression/index.ts";
import {
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import {
  deriveLeadCombatStats,
  type LeadStatsConfig,
} from "../../queries/combat/lead-stats-query.ts";
import { type JourneyEvent } from "./journey-events.ts";

export interface AttemptStageConfig {
  readonly leadStatsConfig: LeadStatsConfig;
  readonly maxRounds: number;
  readonly bondProgressPerBattle: number;
  readonly bondProgressPerBondLevel: number;
  readonly bondLevelCap: number;
  readonly journeyRankProgressPerNormalWin: number;
  readonly journeyRankProgressPerBossWin: number;
  readonly journeyRankProgressPerRank: number;
  readonly journeyRankCap: number;
}

export type AttemptStagePayload = Record<string, never>;

export function createAttemptStageHandler(
  catalog: GameCatalog,
  config: AttemptStageConfig,
): CommandHandler<GameState, AttemptStagePayload, JourneyEvent> {
  return (state, command) => {
    const stages = orderedStages(catalog.stages.values());
    const stage = currentStage(stages, state.journey.currentStageIndex);
    if (!stage) {
      return err({
        code: "NO_STAGE_AVAILABLE",
        message: "No further Journey stage is available.",
      });
    }

    const enemy = catalog.enemies.get(stage.enemyId);
    if (!enemy) {
      return err({
        code: "ENEMY_NOT_FOUND",
        message: `Stage "${stage.stageId}" references unknown enemy "${stage.enemyId}"`,
      });
    }

    const leadStats = deriveLeadCombatStats(
      state,
      catalog,
      config.leadStatsConfig,
    );
    if (!leadStats) {
      return err({
        code: "NO_LEAD_ASSIGNED",
        message:
          "No Lead Catchmon is assigned — assign one before attempting a stage.",
      });
    }

    const rollSeed = deriveSubSeed(
      state.meta.rootRandomSeed,
      state.meta.randomEventCounter,
      `ATTEMPT_STAGE:${command.commandId}`,
    );
    const battleResult = simulateBattle(
      leadStats,
      enemy.stats,
      createRandomSource(rollSeed),
      { maxRounds: config.maxRounds },
    );
    if (!battleResult.ok) {
      return err({
        code: battleResult.error.code,
        message: battleResult.error.message,
      });
    }
    const { outcome } = battleResult.value;

    let nextJourney = {
      ...state.journey,
      lastBattle: {
        stageId: stage.stageId,
        outcome,
        resolvedAtMs: command.issuedAtMs,
      },
    };
    let nextEconomy = state.economy;
    let nextOwnedCatchmons = state.catchmons.ownedCatchmons;
    let nextProgression = state.progression;
    let nextWorld = state.world;

    if (outcome === "WIN") {
      const advancedIndex = nextStageIndex(
        stages,
        state.journey.currentStageIndex,
        stage.stageId,
      );
      nextJourney = {
        ...nextJourney,
        currentStageIndex: advancedIndex ?? state.journey.currentStageIndex,
        clearedStageIds: state.journey.clearedStageIds.includes(stage.stageId)
          ? state.journey.clearedStageIds
          : [...state.journey.clearedStageIds, stage.stageId],
        stableFarmStageIndex: enemy.isBoss
          ? state.journey.stableFarmStageIndex
          : Math.max(
              state.journey.stableFarmStageIndex,
              state.journey.currentStageIndex,
            ),
      };
      nextEconomy = {
        coins: safeAddCoins(state.economy.coins, toCoins(stage.coinReward)),
      };
      nextProgression = applyJourneyRankProgress(
        nextProgression,
        enemy.isBoss
          ? config.journeyRankProgressPerBossWin
          : config.journeyRankProgressPerNormalWin,
        config.journeyRankProgressPerRank,
        config.journeyRankCap,
      );

      if (stage.isRegionCompletionBoss) {
        const existingMilestones =
          nextWorld.regionMilestones[stage.regionId] ?? [];
        if (!existingMilestones.includes(REGION_COMPLETED_MILESTONE)) {
          nextWorld = {
            ...nextWorld,
            regionMilestones: {
              ...nextWorld.regionMilestones,
              [stage.regionId]: [
                ...existingMilestones,
                REGION_COMPLETED_MILESTONE,
              ],
            },
          };
        }
        if (
          !nextProgression.unlockedSystemIds.includes(
            EXPEDITIONS_SYSTEM_MILESTONE,
          )
        ) {
          nextProgression = {
            ...nextProgression,
            unlockedSystemIds: [
              ...nextProgression.unlockedSystemIds,
              EXPEDITIONS_SYSTEM_MILESTONE,
            ],
          };
        }
      }

      const bondedIds = [
        ...(state.loadout.leadCatchmonId ? [state.loadout.leadCatchmonId] : []),
        ...state.loadout.bondSupportCatchmonIds,
      ];
      const updates: Record<string, OwnedCatchmonState> = {};
      for (const id of bondedIds) {
        const owned = nextOwnedCatchmons[id];
        if (!owned) continue;
        updates[id] = applyBondProgress(
          owned,
          config.bondProgressPerBattle,
          config.bondProgressPerBondLevel,
          config.bondLevelCap,
        );
      }
      nextOwnedCatchmons = { ...nextOwnedCatchmons, ...updates };
    }

    const nextState: GameState = {
      ...state,
      meta: {
        ...state.meta,
        randomEventCounter: nextRandomEventCounter(
          state.meta.randomEventCounter,
        ),
      },
      economy: nextEconomy,
      journey: nextJourney,
      progression: nextProgression,
      world: nextWorld,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: nextOwnedCatchmons,
      },
      forge:
        outcome === "WIN"
          ? {
              ...state.forge,
              echoCharges: state.forge.echoCharges + stage.echoChargeReward,
            }
          : state.forge,
    };

    return ok({
      nextState,
      events: [
        {
          kind: "STAGE_ATTEMPTED",
          stageId: stage.stageId,
          outcome,
          leadHpRemaining: battleResult.value.leadHpRemaining,
          enemyHpRemaining: battleResult.value.enemyHpRemaining,
        },
      ],
    });
  };
}
