/**
 * Design owner: Document 15 Phase 7 Exit Gate ("Player state can
 * meaningfully move from starter shop to expanded shop with Catchmon +
 * World capability").
 *
 * A dev-only, headless proof that the full Phase 7 progression/
 * infrastructure loop works end-to-end through actual Game Engine
 * commands. Mirrors `expedition-dev-harness.ts`'s mutable-clock/step-
 * logging pattern.
 *
 * RANK GROWTH AS HARNESS SETUP DATA: this harness applies Shop Rank
 * progress directly via the same normalized `applyRankProgress` hook
 * every real command already uses (Task 07.1) rather than re-running many
 * real sales/crafts/orders to grind it up — each of those 5 source
 * classes' individual wiring is already proven at the command/
 * reconciliation-pass level (`sale-helpers`'s tests, `complete-order.
 * test.ts`, `craft-queue-reconciliation-pass.test.ts`, `attempt-capture.
 * test.ts`, `expedition-reconciliation-pass.test.ts`). This harness's job
 * is the Phase 7-specific consequence chain: rank growth -> unlock-rule
 * satisfaction -> infrastructure purchase (both instant and construction)
 * -> macro-stage transition -> newly-available World capability. Same
 * "harness setup data" precedent as `catchmon-dev-harness.ts` directly
 * setting a Catchmon's level to the evolution threshold.
 */
import { CommandId } from "../../core/ids/index.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../../core/time/index.ts";
import { toCoins } from "../../core/math/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
} from "../../domain/game-state/index.ts";
import { creditCoins } from "../../domain/economy/index.ts";
import {
  applyRankProgress,
  isUnlockRuleSatisfied,
} from "../../domain/progression/index.ts";
import { deriveShopMacroStage } from "../../domain/shop-infrastructure/index.ts";
import {
  AQUILOR_SPECIES_ID,
  DISPLAY_EXPANSION_INFRASTRUCTURE_ID,
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_DISPLAY_EXPANSION_COIN_COST,
  PROVISIONAL_EXPEDITION_HUB_COIN_COST,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PROVISIONAL_RANK_PROGRESS_PER_RANK,
  PROVISIONAL_SHOP_RANK_CAP,
  SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  SLICE_INTRODUCTION_UNLOCK_RULES,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_04_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  UNLOCK_RULE_CATCHMON_ASSIGNMENT_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../content/vertical-slice/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../domain/journey/index.ts";
import { createCommand } from "../engine/index.ts";
import { createStartExpeditionHandler } from "../commands/expeditions/start-expedition.ts";
import { createAssignDisplayProductHandler } from "../commands/display/assign-display-product.ts";
import { createPurchaseInfrastructureHandler } from "../commands/shop-infrastructure/purchase-infrastructure.ts";
import { getContextualGoal } from "../queries/progression/index.ts";
import {
  infrastructureConstructionReconciliationPass,
  reconcileGameState,
} from "../reconciliation/index.ts";
import {
  type DevHarnessLogEntry,
  type DevHarnessResult,
} from "./crafting-dev-harness.ts";

function createMutableClock(startMs: number): {
  clock: Clock;
  set(ms: number): void;
} {
  let current: TimestampMs = toTimestampMs(startMs);
  return {
    clock: { nowMs: () => current },
    set(ms: number) {
      current = toTimestampMs(ms);
    },
  };
}

export function runProgressionDevHarness(): DevHarnessResult {
  const log: DevHarnessLogEntry[] = [];
  const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
  const { clock, set: setClock } = createMutableClock(0);
  let cmdCounter = 0;
  const nextCommandId = (label: string) => {
    cmdCounter += 1;
    return CommandId.from(`progression-harness-${label}-${String(cmdCounter)}`);
  };

  const assignDisplayProduct = createAssignDisplayProductHandler(
    catalog,
    SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  );
  const purchaseInfrastructure = createPurchaseInfrastructureHandler(catalog);
  const startExpedition = createStartExpeditionHandler(
    catalog,
    SLICE_PRODUCT_04_ID,
    SLICE_ROUTE_DURATION_MS,
    PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
    PROVISIONAL_CAPABILITY_MAGNITUDES,
  );

  // 1. PREPARE (starter shop): rank 1, STARTER macro stage, Expedition Hub
  // not owned, World capability (starting an expedition) rejected.
  let state = createInitialGameState(catalog, clock, toSeed(1));
  if (state.progression.rank !== 1) {
    throw new Error("expected a fresh game to start at Shop Rank 1");
  }
  if (deriveShopMacroStage(state) !== "STARTER") {
    throw new Error("expected a fresh game to be in the STARTER macro stage");
  }
  const leadCatchmonId = deriveInitialOwnedCatchmonId(AQUILOR_SPECIES_ID);
  const blockedExpedition = startExpedition(
    state,
    createCommand(
      nextCommandId("blocked-expedition"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId,
        bringCaptureAid: false,
      },
      clock,
    ),
  );
  if (
    blockedExpedition.ok ||
    blockedExpedition.error.code !== "EXPEDITIONS_NOT_YET_UNLOCKED"
  ) {
    throw new Error(
      "expected a starter shop to reject starting an expedition (Expeditions not yet unlocked)",
    );
  }
  const goalAtStart = getContextualGoal(
    state,
    SLICE_INTRODUCTION_UNLOCK_RULES,
    {
      progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
      rankCap: PROVISIONAL_SHOP_RANK_CAP,
    },
  );
  log.push({
    step: "PREPARE_STARTER_SHOP",
    detail: `rank=1, macroStage=STARTER, expeditionBlocked=true, currentPrimaryGoal="${goalAtStart.currentPrimaryGoal}"`,
  });

  // 2. RANK GROWTH: apply enough normalized rank progress (Task 07.1's
  // shared hook) to reach both infrastructure upgrades' unlock rank. Coins
  // are likewise given directly as harness setup data, standing in for the
  // many real commerce transactions that would have both earned rank
  // progress AND accumulated Coins along the way (Task 07.3's purchase
  // command needs real funds; this harness's job is the Phase 7 chain
  // that follows purchase, not re-earning Coins through Phase 4 commands
  // already covered by their own tests).
  state = {
    ...state,
    progression: applyRankProgress(
      state.progression,
      PROVISIONAL_RANK_PROGRESS_PER_RANK * 4,
      PROVISIONAL_RANK_PROGRESS_PER_RANK,
      PROVISIONAL_SHOP_RANK_CAP,
    ),
    economy: creditCoins(
      state.economy,
      toCoins(
        PROVISIONAL_DISPLAY_EXPANSION_COIN_COST +
          PROVISIONAL_EXPEDITION_HUB_COIN_COST,
      ),
    ),
  };
  if (state.progression.rank < 5) {
    throw new Error("expected rank growth to reach at least Shop Rank 5");
  }
  const catchmonAssignmentRule = SLICE_INTRODUCTION_UNLOCK_RULES.find(
    (rule) => rule.unlockRuleId === UNLOCK_RULE_CATCHMON_ASSIGNMENT_ID,
  );
  if (
    !catchmonAssignmentRule ||
    !isUnlockRuleSatisfied(catchmonAssignmentRule, state)
  ) {
    throw new Error(
      "expected the Catchmon Assignment introduction rule to be satisfied by Shop Rank 5",
    );
  }
  log.push({
    step: "RANK_GROWTH_UNLOCKS_CATCHMON_CAPABILITY",
    detail: `rank=${String(state.progression.rank)}, catchmonAssignmentUnlockRuleSatisfied=true`,
  });

  // 3. INSTANT INFRASTRUCTURE PURCHASE: Display Expansion, no construction.
  const displayPurchase = purchaseInfrastructure(
    state,
    createCommand(
      nextCommandId("purchase-display"),
      "PURCHASE_INFRASTRUCTURE",
      { infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID },
      clock,
    ),
  );
  if (!displayPurchase.ok) {
    throw new Error(
      `expected Display Expansion to purchase instantly: ${JSON.stringify(displayPurchase.error)}`,
    );
  }
  state = displayPurchase.value.nextState;
  if (deriveShopMacroStage(state) !== "EXPANDED") {
    throw new Error(
      "expected the shop macro stage to flip to EXPANDED once infrastructure is owned",
    );
  }
  log.push({
    step: "INSTANT_INFRASTRUCTURE_PURCHASE",
    detail: "Display Expansion purchased immediately; macroStage=EXPANDED",
  });

  // 4. The previously-locked 3rd display slot is now usable.
  const thirdDisplaySlotId = PLAYABLE_DISPLAY_SLOT_IDS[2]!;
  const thirdSlotAssignment = assignDisplayProduct(
    state,
    createCommand(
      nextCommandId("assign-slot-3"),
      "ASSIGN_DISPLAY_PRODUCT",
      { displaySlotId: thirdDisplaySlotId, productId: SLICE_PRODUCT_01_ID },
      clock,
    ),
  );
  // Stock is intentionally not set up here — only the *gate* itself is
  // being proven (DISPLAY_SLOT_LOCKED must never fire once owned); a
  // missing-stock rejection is an unrelated, already-covered concern
  // (`display-commands.test.ts`).
  if (
    !thirdSlotAssignment.ok &&
    thirdSlotAssignment.error.code === "DISPLAY_SLOT_LOCKED"
  ) {
    throw new Error(
      "expected the 3rd display slot to no longer be locked after purchasing Display Expansion",
    );
  }
  log.push({
    step: "DISPLAY_SLOT_UNLOCKED",
    detail: "3rd display slot no longer rejects with DISPLAY_SLOT_LOCKED",
  });

  // 5. CONSTRUCTION-BASED INFRASTRUCTURE PURCHASE: Expedition Hub.
  const hubPurchase = purchaseInfrastructure(
    state,
    createCommand(
      nextCommandId("purchase-hub"),
      "PURCHASE_INFRASTRUCTURE",
      { infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID },
      clock,
    ),
  );
  if (!hubPurchase.ok) {
    throw new Error(
      `expected Expedition Hub construction to start: ${JSON.stringify(hubPurchase.error)}`,
    );
  }
  state = hubPurchase.value.nextState;
  if (
    state.infrastructure.ownedInfrastructureIds.includes(
      EXPEDITION_HUB_INFRASTRUCTURE_ID,
    )
  ) {
    throw new Error(
      "expected the Expedition Hub to NOT be owned yet — it is under construction",
    );
  }
  log.push({
    step: "CONSTRUCTION_STARTED",
    detail: `Expedition Hub construction started, completesAtMs=${String(state.infrastructure.activeConstructions[0]!.completesAtMs)}`,
  });

  // 6. OFFLINE COMPLETION: advance the clock past construction, reconcile.
  const completesAtMs =
    state.infrastructure.activeConstructions[0]!.completesAtMs;
  setClock(completesAtMs);
  const constructionReport = reconcileGameState(state, completesAtMs, catalog, [
    infrastructureConstructionReconciliationPass,
  ]);
  state = constructionReport.nextState;
  if (
    !state.infrastructure.ownedInfrastructureIds.includes(
      EXPEDITION_HUB_INFRASTRUCTURE_ID,
    )
  ) {
    throw new Error(
      "expected the Expedition Hub to become owned once construction completes",
    );
  }
  log.push({
    step: "CONSTRUCTION_COMPLETED_OFFLINE",
    detail: "Expedition Hub owned after offline reconciliation",
  });

  // 7. WORLD CAPABILITY NEWLY AVAILABLE: the exact same expedition that was
  // rejected in step 1 now succeeds. Phase R6 migrated START_EXPEDITION off
  // Shop Infrastructure ownership onto the generic Journey system-milestone
  // gate (`EXPEDITIONS_SYSTEM_MILESTONE`, set by a Region's first
  // completion — `attempt-stage.ts`). This Shop-progression harness's job
  // is proving the rank/infrastructure chain, not re-proving Phase R6's
  // Journey/Region-completion flow (covered by `attempt-stage.test.ts`),
  // so the milestone is granted directly as harness setup data here, the
  // same pattern step 2's rank progress/Coins already use.
  state = {
    ...state,
    progression: {
      ...state.progression,
      unlockedSystemIds: [
        ...state.progression.unlockedSystemIds,
        EXPEDITIONS_SYSTEM_MILESTONE,
      ],
    },
  };
  const unblockedExpedition = startExpedition(
    state,
    createCommand(
      nextCommandId("unblocked-expedition"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId,
        bringCaptureAid: false,
      },
      clock,
    ),
  );
  if (!unblockedExpedition.ok) {
    throw new Error(
      `expected the expedition to start now that Expeditions are unlocked: ${JSON.stringify(unblockedExpedition.error)}`,
    );
  }
  state = unblockedExpedition.value.nextState;
  log.push({
    step: "WORLD_CAPABILITY_UNLOCKED",
    detail: "the previously-rejected expedition now starts successfully",
  });

  const goalAtEnd = getContextualGoal(state, SLICE_INTRODUCTION_UNLOCK_RULES, {
    progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
    rankCap: PROVISIONAL_SHOP_RANK_CAP,
  });
  log.push({
    step: "EXPANDED_SHOP_STATE",
    detail: `macroStage=${deriveShopMacroStage(state)}, rank=${String(state.progression.rank)}, currentPrimaryGoal="${goalAtEnd.currentPrimaryGoal}"`,
  });

  return { log, finalState: state, catalog };
}
