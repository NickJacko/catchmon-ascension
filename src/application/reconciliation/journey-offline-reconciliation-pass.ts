/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §10 Offline
 * Combat, §12 Stable Farm Checkpoint; docs/rebuild/02 §5 Return/Offline
 * Loop ("generous cap ... work/sleep does not feel punitive"); Document 14
 * §119 No Per-Second Save Loop; docs/rebuild/15 Phase R7.
 *
 * Grants offline progress at the player's `journey.stableFarmStageIndex`
 * checkpoint — never their actual `journey.currentStageIndex`, which may
 * be sitting on an un-beaten boss. This is what makes "a boss never
 * auto-clears offline" a structural guarantee rather than a convention
 * this pass has to remember: `stableFarmStageIndex` only ever advances on
 * a non-boss WIN (`attempt-stage.ts`), so it can never itself reference a
 * boss stage. `stableFarmStageIndex < 0` (no normal stage cleared yet) is
 * a no-op, not an error.
 *
 * Deliberately NOT a per-second/per-battle simulation: the whole offline
 * window collapses into one integer `clears` count, computed once from
 * this pass's own supplied `elapsedMs` — never a stored "last offline
 * check" timestamp of its own. That is what makes this pass automatically
 * exactly-once and backwards-clock-safe under `reconcileGameState`'s
 * existing generic guarantee (it stamps `meta.lastActiveAtMs` once, after
 * every pass, from one elapsed value computed up front) — reconciling
 * twice at the same timestamp yields `clears = 0` the second time, not a
 * duplicate grant.
 *
 * Rewards per `clears` mirror EXACTLY what `ATTEMPT_STAGE` itself grants
 * on a real manual WIN of that same stage — `coinReward` and
 * `echoChargeReward` (`StageDefinition`, `../../domain/journey/types.ts`).
 * Per CLAUDE.md's "do not invent missing game design": `StageDefinition`
 * does not (yet) carry any routine-inventory-resource reward, so this
 * pass does not fabricate one — see the R6/R7 completion report's design
 * gaps section.
 */
import { BASIS_POINTS_PER_WHOLE } from "../../core/math/basis-points.ts";
import { safeAddCoins, toCoins } from "../../core/math/integer.ts";
import { currentStage, orderedStages } from "../../domain/journey/index.ts";
import {
  type ReconciliationPass,
  type ReconciliationPassOutcome,
} from "./reconcile-game-state.ts";

const MS_PER_HOUR = 3_600_000;

export interface JourneyOfflineConfig {
  /** Farm-clears-per-hour at the stable checkpoint before efficiency is applied. */
  readonly clearsPerHour: number;
  /** Offline yield as a fraction of active-play yield, in basis points (10000 = 100%). */
  readonly efficiencyBps: number;
  /** Elapsed offline time is capped here before computing clears — a bounded reconciliation cost regardless of how long the player was away. */
  readonly maxHours: number;
}

export function createJourneyOfflineReconciliationPass(
  config: JourneyOfflineConfig,
): ReconciliationPass {
  return (state, elapsedMs, _now, catalog): ReconciliationPassOutcome => {
    if (state.journey.stableFarmStageIndex < 0) {
      return { nextState: state, events: [] };
    }

    const stage = currentStage(
      orderedStages(catalog.stages.values()),
      state.journey.stableFarmStageIndex,
    );
    if (!stage) {
      return { nextState: state, events: [] };
    }

    const cappedElapsedMs = Math.min(elapsedMs, config.maxHours * MS_PER_HOUR);
    const elapsedHours = cappedElapsedMs / MS_PER_HOUR;
    const clears = Math.floor(
      elapsedHours *
        config.clearsPerHour *
        (config.efficiencyBps / BASIS_POINTS_PER_WHOLE),
    );
    if (clears <= 0) {
      return { nextState: state, events: [] };
    }

    const coinsGained = clears * stage.coinReward;
    const echoChargesGained = clears * stage.echoChargeReward;

    return {
      nextState: {
        ...state,
        economy: {
          coins: safeAddCoins(state.economy.coins, toCoins(coinsGained)),
        },
        forge: {
          ...state.forge,
          echoCharges: state.forge.echoCharges + echoChargesGained,
        },
      },
      events: [
        {
          kind: "JOURNEY_OFFLINE_PROGRESS",
          stageId: stage.stageId,
          clears,
          coinsGained,
          echoChargesGained,
        },
      ],
    };
  };
}
