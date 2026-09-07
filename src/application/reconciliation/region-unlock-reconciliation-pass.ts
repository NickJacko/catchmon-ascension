/**
 * Design owner: Document 09 §50-54 Region Progression Model (Global
 * Readiness + World Readiness), §106 Region Progression — World Readiness;
 * Ozean Batch A.
 *
 * For every catalog region NOT already in `world.unlockedRegionIds`:
 * resolves its `unlockRuleId` against `catalog.unlockRules` and, if now
 * satisfied (`isUnlockRuleSatisfied`), adds it. Fully generic — no region-
 * specific branch — so it is the same mechanism any future Region 3-17
 * unlock rule uses, not something built only for Ozean. Mirrors
 * `infrastructure-construction-reconciliation-pass.ts`'s shape (a plain
 * "promote once satisfied" scan, exactly-once by construction: a region
 * added to `unlockedRegionIds` is no longer in the "not yet unlocked" set
 * for a later pass to find again).
 *
 * Runs after `createExpeditionReconciliationPass` in
 * `app/reconciliation-passes.ts` so a route completed this same
 * reconciliation cycle can immediately satisfy an `EXPEDITION_MILESTONE`
 * condition (Document 14 §117-118 deterministic pass order).
 */
import { invariant } from "../../core/assertions/index.ts";
import { type GameState } from "../../domain/game-state/index.ts";
import { isUnlockRuleSatisfied } from "../../domain/progression/index.ts";
import { type WorldEvent } from "./world-events.ts";
import {
  type ReconciliationPass,
  type ReconciliationPassOutcome,
} from "./reconcile-game-state.ts";

export const regionUnlockReconciliationPass: ReconciliationPass = (
  state,
  _elapsedMs,
  _now,
  catalog,
): ReconciliationPassOutcome => {
  let nextUnlockedRegionIds = state.world.unlockedRegionIds;
  const events: WorldEvent[] = [];

  for (const region of catalog.regions.values()) {
    if (nextUnlockedRegionIds.includes(region.regionId)) continue;
    const rule = catalog.unlockRules.get(region.unlockRuleId);
    invariant(
      rule !== undefined,
      `Region "${region.regionId}" references unknown unlock rule "${region.unlockRuleId}" — should have been caught by createGameCatalog`,
    );
    if (isUnlockRuleSatisfied(rule, state)) {
      nextUnlockedRegionIds = [...nextUnlockedRegionIds, region.regionId];
      events.push({ kind: "REGION_UNLOCKED", regionId: region.regionId });
    }
  }

  if (events.length === 0) {
    return { nextState: state, events: [] };
  }

  const nextState: GameState = {
    ...state,
    world: { ...state.world, unlockedRegionIds: nextUnlockedRegionIds },
  };

  return { nextState, events };
};
