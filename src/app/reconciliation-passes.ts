/**
 * Design owner: Document 15 Task 08.1; Document 14 §117-118 Reconciliation
 * Model/Triggers.
 *
 * The real, non-empty `RECONCILIATION_PASSES` list `reconcileGameState`'s
 * own default was deliberately left empty for until a feature phase
 * needed one (Task 02.5) — this is that composition point, built from the
 * same shared `GameConfig`.
 */
import {
  createCraftQueueReconciliationPass,
  createExpeditionReconciliationPass,
  createJourneyOfflineReconciliationPass,
  infrastructureConstructionReconciliationPass,
  regionUnlockReconciliationPass,
  type ReconciliationPass,
} from "../application/reconciliation/index.ts";
import { type GameConfig } from "./game-config.ts";

export function buildReconciliationPasses(
  config: GameConfig,
): readonly ReconciliationPass[] {
  return [
    createCraftQueueReconciliationPass(
      undefined,
      config.craftXpConfig,
      config.craftRankProgressConfig,
    ),
    createExpeditionReconciliationPass(
      config.expeditionRewardConfig,
      config.expeditionXpConfig,
      config.expeditionRankProgressConfig,
    ),
    infrastructureConstructionReconciliationPass,
    // Ozean Batch A: must run after the expedition pass above so a route
    // completed this same cycle can immediately satisfy an
    // EXPEDITION_MILESTONE World Readiness condition (Document 14
    // §117-118 deterministic pass order).
    regionUnlockReconciliationPass,
    // Phase R7: offline Journey farming. Order doesn't interact with the
    // passes above (disjoint state slices — journey/economy/forge vs.
    // craft/expedition/infrastructure/world), placed last simply as "new
    // work appended after existing work."
    createJourneyOfflineReconciliationPass(config.journeyOfflineConfig),
  ];
}
