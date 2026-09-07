/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §5 Stage
 * Structure; docs/rebuild/12_UX_INFORMATION_ARCHITECTURE_AND_MOBILE_FLOW.md
 * §3 Journey Screen; docs/rebuild/15 Phase R8. The first query-layer
 * wrapper over `domain/journey` — R2-R7 only needed `orderedStages`/
 * `currentStage` inside `ATTEMPT_STAGE` itself; a real Journey screen also
 * needs a read-only preview of the whole stage list and "what should I do
 * next," which is what this file adds, matching the established
 * `create*Queries(catalog)` planning-queries shape
 * (`expedition-queries.ts`).
 */
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type EnemyDefinition } from "../../../domain/combat/index.ts";
import {
  currentStage,
  orderedStages,
  type StageDefinition,
} from "../../../domain/journey/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type RegionDefinition } from "../../../domain/world/index.ts";

export type StageStatus = "CLEARED" | "CURRENT" | "LOCKED";

export interface StageListEntry {
  readonly stage: StageDefinition;
  readonly enemy: EnemyDefinition | undefined;
  readonly status: StageStatus;
}

export interface CurrentStagePreview {
  readonly stage: StageDefinition;
  readonly enemy: EnemyDefinition;
  readonly region: RegionDefinition;
}

export interface JourneyQueries {
  /** Every authored stage, globally ordered, each labeled against `state.journey` — the Journey screen's stage/boss progress list. */
  stageList(state: GameState): readonly StageListEntry[];
  /** `null` once every authored stage has been cleared (Document 03 §5 — running out is a valid state, not an error). */
  currentStagePreview(state: GameState): CurrentStagePreview | null;
  /** A single short, human-readable line for "what should I do next" — Document 12 §3's "current short objective." */
  nextObjective(state: GameState): string;
  /** `undefined` when `journey.stableFarmStageIndex` is -1 (no normal stage cleared yet, Phase R7) — the stage offline reconciliation actually farms. */
  stableFarmStagePreview(state: GameState): StageDefinition | undefined;
}

export function createJourneyQueries(catalog: GameCatalog): JourneyQueries {
  const stages = orderedStages(catalog.stages.values());

  return {
    stageList(state) {
      return stages.map((stage, index) => ({
        stage,
        enemy: catalog.enemies.get(stage.enemyId),
        status: state.journey.clearedStageIds.includes(stage.stageId)
          ? "CLEARED"
          : index === state.journey.currentStageIndex
            ? "CURRENT"
            : "LOCKED",
      }));
    },

    currentStagePreview(state) {
      const stage = currentStage(stages, state.journey.currentStageIndex);
      if (!stage) return null;
      const enemy = catalog.enemies.get(stage.enemyId);
      const region = catalog.regions.get(stage.regionId);
      if (!enemy || !region) return null;
      return { stage, enemy, region };
    },

    nextObjective(state) {
      const stage = currentStage(stages, state.journey.currentStageIndex);
      if (!stage) {
        return "Every authored stage is cleared — more of the Journey is on the way.";
      }
      if (!state.loadout.leadCatchmonId) {
        return "Assign a Lead Catchmon to begin your Journey.";
      }
      const enemy = catalog.enemies.get(stage.enemyId);
      if (enemy?.isBoss) {
        return `Defeat ${stage.displayName} to complete this Region.`;
      }
      return `Clear ${stage.displayName}.`;
    },

    stableFarmStagePreview(state) {
      if (state.journey.stableFarmStageIndex < 0) return undefined;
      return currentStage(stages, state.journey.stableFarmStageIndex);
    },
  };
}
