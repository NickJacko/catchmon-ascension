/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §6 Normal
 * Encounters ("stage auto-advances until: boss reached, player loses, ...");
 * docs/rebuild/15 Phase R2. Pure ordering helpers over a catalog-supplied
 * stage list — no `GameState` reads.
 */
import { type StageId } from "../../core/ids/index.ts";
import { type StageDefinition } from "./types.ts";

/** Stages sorted by their authored `order` — the one place stage sequencing is decided, so callers never re-sort ad hoc. */
export function orderedStages(
  stages: readonly StageDefinition[],
): readonly StageDefinition[] {
  return [...stages].sort((a, b) => a.order - b.order);
}

/** The stage at `currentIndex`, or `undefined` once every authored stage has been cleared (Document 03 §5: the architecture must not assume a fixed count — running out is a valid, checkable state, not an error). */
export function currentStage(
  stages: readonly StageDefinition[],
  currentIndex: number,
): StageDefinition | undefined {
  return orderedStages(stages)[currentIndex];
}

/** The next stage index after clearing `stageId` — advances only if `stageId` really is the stage at `currentIndex` (guards against advancing past a stage that was not actually the current one). */
export function nextStageIndex(
  stages: readonly StageDefinition[],
  currentIndex: number,
  clearedStageId: StageId,
): number | null {
  const stage = currentStage(stages, currentIndex);
  if (!stage || stage.stageId !== clearedStageId) return null;
  return currentIndex + 1;
}
