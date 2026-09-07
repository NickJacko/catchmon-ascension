/**
 * Design owner: Document 15 Task 04's Phase 4 Exit Gate ("craft -> stock
 * -> customer -> Standard/Favorable/Premium/Recommend -> Coins/Momentum
 * -> reinvest hook" must work, "through dev harness/tests").
 *
 * A dev-only, headless proof that the complete Phase 4 shop loop works
 * end-to-end through actual Game Engine commands and reconciliation — no
 * React, no Pixi, no final UI. Mirrors Task 03.8's
 * `crafting-dev-harness.ts` (same mutable-clock pattern, same
 * step-logging shape) but exercises every Phase 4 command: display
 * assignment, customer arrival, all four transaction actions plus
 * Decline and Workshop Push. (The Everyday Order step this harness
 * originally also proved was retired — docs/rebuild/15 Phase R5
 * retirement batch, docs/rebuild/R1_DEPENDENCY_AUDIT.md §5 update — Orders
 * had no KEEP/ADAPT dependents.)
 *
 * Momentum needed for Premium Pitch/Recommend/Workshop Push is topped up
 * directly on `state.shop.momentum` partway through (logged as
 * `SEED_MOMENTUM_FOR_HARNESS`) rather than earned via dozens more
 * preliminary sales in this same run — every unit test in this codebase
 * for those commands does the same (e.g. `premium-pitch.test.ts` injects
 * momentum directly). This is harness/test setup data, not an invented
 * balance value: the actual Coins/Momentum math that follows still runs
 * through the real command handlers.
 *
 * Customer requests are not steered toward a specific product: both
 * displayed products share the PROVISIONS family, which every slice
 * archetype lists in either its preferred or secondary families
 * (`customerContent.ts`), so every arrival is guaranteed a non-null
 * request without needing a seed-retry loop — whichever product a
 * customer asks for, the harness just acts on it.
 */
import { CommandId } from "../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../core/time/time-math.ts";
import { toDurationMs } from "../../core/math/duration.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../../core/time/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import { createInitialGameState } from "../../domain/game-state/index.ts";
import { addToInventory } from "../../domain/inventory/index.ts";
import {
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_STATION_IDS,
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_02_ID,
  SLICE_RECIPE_01_ID,
  SLICE_RECIPE_02_ID,
  SLICE_RECIPE_03_ID,
  SLICE_RESOURCE_A_ID,
  SLICE_RESOURCE_B_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { createCommand } from "../engine/index.ts";
import { createStartCraftHandler } from "../commands/craft/start-craft.ts";
import { workshopPushHandler } from "../commands/craft/workshop-push.ts";
import { createAssignDisplayProductHandler } from "../commands/display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../commands/customer/arrive-customer.ts";
import { createStandardSaleHandler } from "../commands/sale/standard-sale.ts";
import { createFavorableDealHandler } from "../commands/sale/favorable-deal.ts";
import { createPremiumPitchHandler } from "../commands/sale/premium-pitch.ts";
import { createRecommendHandler } from "../commands/sale/recommend.ts";
import { declineHandler } from "../commands/sale/decline.ts";
import { getCustomerTransactionOptions } from "../queries/customer/index.ts";
import {
  craftQueueReconciliationPass,
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

export function runShopLoopDevHarness(): DevHarnessResult {
  const log: DevHarnessLogEntry[] = [];
  const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
  const [PROVISION_STATION_ID, FIELDWORKS_STATION_ID] = PLAYABLE_STATION_IDS;
  const [SLOT_1, SLOT_2] = PLAYABLE_DISPLAY_SLOT_IDS;
  if (!PROVISION_STATION_ID || !FIELDWORKS_STATION_ID) {
    throw new Error("expected 2 playable station IDs");
  }
  if (!SLOT_1 || !SLOT_2) {
    throw new Error("expected 2+ playable display slot IDs");
  }

  const { clock, set: setClock } = createMutableClock(0);
  let state = createInitialGameState(catalog, clock, toSeed(7));
  let cmdCounter = 0;
  const nextCommandId = (label: string) => {
    cmdCounter += 1;
    return CommandId.from(`shop-loop-${label}-${String(cmdCounter)}`);
  };

  const startCraft = createStartCraftHandler(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
  );
  const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
  const arriveCustomer = createArriveCustomerHandler(
    catalog,
    SLICE_CUSTOMER_ARCHETYPES,
    PLAYABLE_DISPLAY_SLOT_IDS,
    PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  );
  const standardSale = createStandardSaleHandler(
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
  );
  const favorableDeal = createFavorableDealHandler(
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
  );
  const premiumPitch = createPremiumPitchHandler(
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
  );
  const recommend = createRecommendHandler(catalog, PLAYABLE_DISPLAY_SLOT_IDS);

  // 1. CRAFT + STOCK: stock enough routine materials, then run real
  // START_CRAFT -> time advance -> reconciliation cycles until enough of
  // each product exists, exactly like Task 03.8's crafting dev harness —
  // just repeated for three recipes/products.
  const resourceA = catalog.resources.get(SLICE_RESOURCE_A_ID);
  const resourceB = catalog.resources.get(SLICE_RESOURCE_B_ID);
  if (!resourceA || !resourceB) {
    throw new Error("expected both slice resources to exist");
  }
  state = {
    ...state,
    inventory: addToInventory(
      addToInventory(state.inventory, resourceA.itemId, 20),
      resourceB.itemId,
      20,
    ),
  };

  const craftOneUnit = (
    stationId: typeof PROVISION_STATION_ID,
    recipeId: typeof SLICE_RECIPE_01_ID,
  ) => {
    const started = startCraft(
      state,
      createCommand(
        nextCommandId("start-craft"),
        "START_CRAFT",
        { stationId, recipeId },
        clock,
      ),
    );
    if (!started.ok) {
      throw new Error(
        `expected START_CRAFT to succeed: ${JSON.stringify(started.error)}`,
      );
    }
    state = started.value.nextState;
    const activeCraft = state.crafting.stations[stationId]!.activeCraft!;
    const now = addDurationToTimestamp(
      activeCraft.completesAtMs,
      toDurationMs(1),
    );
    setClock(now);
    const report = reconcileGameState(state, now, catalog, [
      craftQueueReconciliationPass,
    ]);
    state = report.nextState;
  };

  for (let i = 0; i < 4; i += 1)
    craftOneUnit(PROVISION_STATION_ID, SLICE_RECIPE_01_ID);
  for (let i = 0; i < 4; i += 1)
    craftOneUnit(PROVISION_STATION_ID, SLICE_RECIPE_02_ID);
  for (let i = 0; i < 2; i += 1)
    craftOneUnit(FIELDWORKS_STATION_ID, SLICE_RECIPE_03_ID);
  log.push({
    step: "CRAFT_AND_STOCK",
    detail: `inventory=${JSON.stringify(state.inventory.stacks)}`,
  });

  // 2. STOCK ON DISPLAY: both are PROVISIONS family, so every slice
  // archetype's request pool matches at least one of them.
  for (const [slotId, productId] of [
    [SLOT_1, SLICE_PRODUCT_01_ID],
    [SLOT_2, SLICE_PRODUCT_02_ID],
  ] as const) {
    const assigned = assignDisplayProduct(
      state,
      createCommand(
        nextCommandId("assign-display"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: slotId, productId },
        clock,
      ),
    );
    if (!assigned.ok) {
      throw new Error(
        `expected ASSIGN_DISPLAY_PRODUCT to succeed: ${JSON.stringify(assigned.error)}`,
      );
    }
    state = assigned.value.nextState;
  }
  log.push({
    step: "ASSIGN_DISPLAY",
    detail: JSON.stringify(state.shop.displaySlots),
  });

  const arriveAndRequire = (label: string) => {
    const arrived = arriveCustomer(
      state,
      createCommand(nextCommandId(label), "ARRIVE_CUSTOMER", {}, clock),
    );
    if (!arrived.ok) {
      throw new Error(
        `expected ARRIVE_CUSTOMER to succeed: ${JSON.stringify(arrived.error)}`,
      );
    }
    state = arrived.value.nextState;
    const ids = state.customers.activeCustomerIds;
    const customerId = ids[ids.length - 1]!;
    const customer = state.customers.customers[customerId]!;
    if (customer.requestedProductId === undefined) {
      throw new Error(
        "expected every arrival to have a request while both displayed products are PROVISIONS",
      );
    }
    return customerId;
  };

  // 3. CUSTOMER + STANDARD SALE
  const customerA = arriveAndRequire("arrive-a");
  const standardResult = standardSale(
    state,
    createCommand(
      nextCommandId("standard-sale"),
      "STANDARD_SALE",
      { customerId: customerA },
      clock,
    ),
  );
  if (!standardResult.ok) {
    throw new Error(
      `expected STANDARD_SALE to succeed: ${JSON.stringify(standardResult.error)}`,
    );
  }
  state = standardResult.value.nextState;
  log.push({
    step: "STANDARD_SALE",
    detail: JSON.stringify(standardResult.value.events),
  });

  // 4. CUSTOMER + FAVORABLE DEAL
  const customerB = arriveAndRequire("arrive-b");
  const favorableResult = favorableDeal(
    state,
    createCommand(
      nextCommandId("favorable-deal"),
      "FAVORABLE_DEAL",
      { customerId: customerB },
      clock,
    ),
  );
  if (!favorableResult.ok) {
    throw new Error(
      `expected FAVORABLE_DEAL to succeed: ${JSON.stringify(favorableResult.error)}`,
    );
  }
  state = favorableResult.value.nextState;
  log.push({
    step: "FAVORABLE_DEAL",
    detail: JSON.stringify(favorableResult.value.events),
  });

  // Top up Momentum for the spend-side actions below (see module doc).
  state = {
    ...state,
    shop: { ...state.shop, momentum: state.shop.momentum + 20 },
  };
  log.push({
    step: "SEED_MOMENTUM_FOR_HARNESS",
    detail: `momentum=${String(state.shop.momentum)}`,
  });

  // 5. CUSTOMER + PREMIUM PITCH
  const customerC = arriveAndRequire("arrive-c");
  const premiumResult = premiumPitch(
    state,
    createCommand(
      nextCommandId("premium-pitch"),
      "PREMIUM_PITCH",
      { customerId: customerC },
      clock,
    ),
  );
  if (!premiumResult.ok) {
    throw new Error(
      `expected PREMIUM_PITCH to succeed: ${JSON.stringify(premiumResult.error)}`,
    );
  }
  state = premiumResult.value.nextState;
  log.push({
    step: "PREMIUM_PITCH",
    detail: JSON.stringify(premiumResult.value.events),
  });

  // 6. CUSTOMER + RECOMMEND (the other displayed product)
  const customerD = arriveAndRequire("arrive-d");
  const optionsForD = getCustomerTransactionOptions(
    state,
    customerD,
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
  );
  const recommendCandidate = optionsForD.recommendCandidates.find(
    (c) => c.outcome.eligible,
  );
  if (!recommendCandidate) {
    throw new Error(
      "expected an eligible Recommend candidate (the other displayed product)",
    );
  }
  const recommendResult = recommend(
    state,
    createCommand(
      nextCommandId("recommend"),
      "RECOMMEND",
      {
        customerId: customerD,
        productId: recommendCandidate.productId,
        quality: recommendCandidate.quality,
      },
      clock,
    ),
  );
  if (!recommendResult.ok) {
    throw new Error(
      `expected RECOMMEND to succeed: ${JSON.stringify(recommendResult.error)}`,
    );
  }
  state = recommendResult.value.nextState;
  log.push({
    step: "RECOMMEND",
    detail: JSON.stringify(recommendResult.value.events),
  });

  // 7. CUSTOMER + DECLINE
  const customerE = arriveAndRequire("arrive-e");
  const declineResult = declineHandler(
    state,
    createCommand(
      nextCommandId("decline"),
      "DECLINE",
      { customerId: customerE },
      clock,
    ),
  );
  if (!declineResult.ok) {
    throw new Error(
      `expected DECLINE to succeed: ${JSON.stringify(declineResult.error)}`,
    );
  }
  state = declineResult.value.nextState;
  log.push({
    step: "DECLINE",
    detail: JSON.stringify(declineResult.value.events),
  });

  log.push({
    step: "COINS_AND_MOMENTUM_AFTER_TRANSACTIONS",
    detail: `coins=${String(state.economy.coins)}, momentum=${String(state.shop.momentum)}`,
  });

  // 8. REINVEST HOOK: Workshop Push spends Momentum to accelerate a craft.
  const pushStarted = startCraft(
    state,
    createCommand(
      nextCommandId("start-craft-for-push"),
      "START_CRAFT",
      { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
      clock,
    ),
  );
  if (!pushStarted.ok) {
    throw new Error(
      `expected START_CRAFT to succeed: ${JSON.stringify(pushStarted.error)}`,
    );
  }
  state = pushStarted.value.nextState;
  const beforePush =
    state.crafting.stations[PROVISION_STATION_ID]!.activeCraft!;

  const pushResult = workshopPushHandler(
    state,
    createCommand(
      nextCommandId("workshop-push"),
      "WORKSHOP_PUSH",
      { stationId: PROVISION_STATION_ID },
      clock,
    ),
  );
  if (!pushResult.ok) {
    throw new Error(
      `expected WORKSHOP_PUSH to succeed: ${JSON.stringify(pushResult.error)}`,
    );
  }
  state = pushResult.value.nextState;
  const afterPush = state.crafting.stations[PROVISION_STATION_ID]!.activeCraft!;
  log.push({
    step: "WORKSHOP_PUSH",
    detail: `completesAtMs ${String(beforePush.completesAtMs)} -> ${String(afterPush.completesAtMs)}, momentum=${String(state.shop.momentum)}`,
  });

  const pushedNow = addDurationToTimestamp(
    afterPush.completesAtMs,
    toDurationMs(1),
  );
  setClock(pushedNow);
  const pushReport = reconcileGameState(state, pushedNow, catalog, [
    craftQueueReconciliationPass,
  ]);
  state = pushReport.nextState;
  log.push({
    step: "RECONCILE_AFTER_PUSH",
    detail: `stationActiveCraft=${JSON.stringify(state.crafting.stations[PROVISION_STATION_ID]!.activeCraft)}`,
  });

  // Step 9 (Everyday Order accept+complete) retired (docs/rebuild/15 Phase
  // R5 retirement batch — Everyday Orders had no KEEP/ADAPT dependents;
  // see docs/rebuild/R1_DEPENDENCY_AUDIT.md §5 update).

  log.push({
    step: "FINAL_STATE",
    detail: `coins=${String(state.economy.coins)}, momentum=${String(state.shop.momentum)}, inventory=${JSON.stringify(state.inventory.stacks)}`,
  });

  return { log, finalState: state, catalog };
}
