// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId, CustomerId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  addToInventory,
  getTotalQuantity,
  productItemId,
} from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PLAYABLE_DISPLAY_SLOT_IDS,
  PROVISIONAL_RECOMMEND_MOMENTUM_COST,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_02_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createAssignDisplayProductHandler } from "../display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../customer/arrive-customer.ts";
import { getCustomerTransactionOptions } from "../../queries/customer/index.ts";
import { createRecommendHandler } from "./recommend.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [SLOT_1, SLOT_2] = PLAYABLE_DISPLAY_SLOT_IDS;
if (!SLOT_1 || !SLOT_2)
  throw new Error("expected at least two playable display slots");

const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
const arriveCustomer = createArriveCustomerHandler(
  catalog,
  SLICE_CUSTOMER_ARCHETYPES,
  PLAYABLE_DISPLAY_SLOT_IDS,
  10,
);
const recommend = createRecommendHandler(catalog, PLAYABLE_DISPLAY_SLOT_IDS);

// Both slice products are PROVISIONS family, and every slice archetype has
// PROVISIONS in its preferred or secondary families (customerContent.ts) —
// so displaying both guarantees a compatible Recommend candidate exists
// regardless of which archetype the arrival RNG picks.
const stateWithRequestingCustomerAndAlternative = (
  momentum: number,
): {
  readonly state: GameState;
  readonly customerId: CustomerId;
} => {
  for (let seed = 1; seed < 50; seed += 1) {
    let state = createInitialGameState(catalog, new FakeClock(0), toSeed(seed));
    state = {
      ...state,
      inventory: addToInventory(
        addToInventory(
          state.inventory,
          productItemId(SLICE_PRODUCT_01_ID, "STANDARD"),
          10,
        ),
        productItemId(SLICE_PRODUCT_02_ID, "STANDARD"),
        10,
      ),
      shop: { ...state.shop, momentum },
    };
    for (const [slotId, productId] of [
      [SLOT_1, SLICE_PRODUCT_01_ID],
      [SLOT_2, SLICE_PRODUCT_02_ID],
    ] as const) {
      const assigned = assignDisplayProduct(
        state,
        createCommand(
          CommandId.from(`setup-assign-${slotId}`),
          "ASSIGN_DISPLAY_PRODUCT",
          { displaySlotId: slotId, productId },
          new FakeClock(0),
        ),
      );
      if (!assigned.ok) throw new Error("expected assignment to succeed");
      state = assigned.value.nextState;
    }

    const arrived = arriveCustomer(
      state,
      createCommand(
        CommandId.from(`setup-arrive-${String(seed)}`),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(0),
      ),
    );
    if (!arrived.ok) throw new Error("expected arrival to succeed");
    const customerId = arrived.value.nextState.customers.activeCustomerIds[0]!;
    const customer = arrived.value.nextState.customers.customers[customerId]!;
    if (customer.requestedProductId !== undefined) {
      return { state: arrived.value.nextState, customerId };
    }
  }
  throw new Error(
    "expected at least one seed to produce a requesting customer",
  );
};

describe("RECOMMEND", () => {
  it("sells the recommended displayed alternative, spends Momentum, and resolves the customer", () => {
    const { state, customerId } = stateWithRequestingCustomerAndAlternative(
      PROVISIONAL_RECOMMEND_MOMENTUM_COST,
    );
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    const candidate = options.recommendCandidates.find(
      (c) => c.outcome.eligible,
    );
    if (!candidate)
      throw new Error("expected at least one eligible recommend candidate");

    const alternativeItemId = productItemId(
      candidate.productId,
      candidate.quality,
    );
    const stockBefore = getTotalQuantity(state.inventory, alternativeItemId);
    const customer = state.customers.customers[customerId]!;
    const requestedItemId = productItemId(
      customer.requestedProductId!,
      customer.requestedQuality!,
    );
    const requestedStockBefore = getTotalQuantity(
      state.inventory,
      requestedItemId,
    );

    const result = recommend(
      state,
      createCommand(
        CommandId.from("cmd-recommend"),
        "RECOMMEND",
        {
          customerId,
          productId: candidate.productId,
          quality: candidate.quality,
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.nextState.economy.coins).toBe(
      state.economy.coins + candidate.outcome.finalCoins,
    );
    expect(candidate.outcome.momentumDelta).toBeLessThan(0);
    expect(result.value.nextState.shop.momentum).toBe(
      state.shop.momentum - PROVISIONAL_RECOMMEND_MOMENTUM_COST,
    );
    expect(
      getTotalQuantity(result.value.nextState.inventory, alternativeItemId),
    ).toBe(stockBefore - 1);
    // The customer's originally requested item is untouched — Recommend
    // only ever draws from the displayed alternative (Document 05 §55).
    expect(
      getTotalQuantity(result.value.nextState.inventory, requestedItemId),
    ).toBe(
      requestedItemId === alternativeItemId
        ? stockBefore - 1
        : requestedStockBefore,
    );
    expect(
      result.value.nextState.customers.customers[customerId],
    ).toBeUndefined();
    expect(result.value.events).toEqual([
      expect.objectContaining({
        kind: "RECOMMEND_RESOLVED",
        customerId,
        productId: candidate.productId,
        quality: candidate.quality,
      }),
    ]);
  });

  it("fails with INSUFFICIENT_MOMENTUM when Momentum is too low", () => {
    const { state, customerId } = stateWithRequestingCustomerAndAlternative(0);
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    const candidate = options.recommendCandidates[0];
    if (!candidate)
      throw new Error("expected at least one recommend candidate shape");

    const result = recommend(
      state,
      createCommand(
        CommandId.from("cmd-recommend"),
        "RECOMMEND",
        {
          customerId,
          productId: candidate.productId,
          quality: candidate.quality,
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("INSUFFICIENT_MOMENTUM");
  });

  it("rejects a product that is not a compatible displayed candidate", () => {
    const { state, customerId } = stateWithRequestingCustomerAndAlternative(
      PROVISIONAL_RECOMMEND_MOMENTUM_COST,
    );
    const customer = state.customers.customers[customerId]!;

    const result = recommend(
      state,
      createCommand(
        CommandId.from("cmd-recommend"),
        "RECOMMEND",
        {
          customerId,
          productId: customer.requestedProductId!,
          quality: customer.requestedQuality!,
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NOT_A_RECOMMEND_CANDIDATE");
  });

  it("fails with a typed error for an unknown customer", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const result = recommend(
      state,
      createCommand(
        CommandId.from("cmd-recommend"),
        "RECOMMEND",
        {
          customerId: CustomerId.from("does-not-exist"),
          productId: SLICE_PRODUCT_01_ID,
          quality: "STANDARD",
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NOT_A_RECOMMEND_CANDIDATE");
  });
});
