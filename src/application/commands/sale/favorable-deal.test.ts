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
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createAssignDisplayProductHandler } from "../display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../customer/arrive-customer.ts";
import { getCustomerTransactionOptions } from "../../queries/customer/index.ts";
import { createFavorableDealHandler } from "./favorable-deal.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [SLOT_1] = PLAYABLE_DISPLAY_SLOT_IDS;
if (!SLOT_1) throw new Error("expected a playable display slot");

const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
const arriveCustomer = createArriveCustomerHandler(
  catalog,
  SLICE_CUSTOMER_ARCHETYPES,
  PLAYABLE_DISPLAY_SLOT_IDS,
  10,
);
const favorableDeal = createFavorableDealHandler(
  catalog,
  PLAYABLE_DISPLAY_SLOT_IDS,
);

const stateWithRequestingCustomer = (): {
  readonly state: GameState;
  readonly customerId: CustomerId;
} => {
  for (let seed = 1; seed < 50; seed += 1) {
    let state = createInitialGameState(catalog, new FakeClock(0), toSeed(seed));
    state = {
      ...state,
      inventory: addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_01_ID, "STANDARD"),
        10,
      ),
    };
    const assigned = assignDisplayProduct(
      state,
      createCommand(
        CommandId.from("setup-assign"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok) throw new Error("expected assignment to succeed");
    state = assigned.value.nextState;

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

describe("FAVORABLE_DEAL", () => {
  it("credits fewer Coins but more Momentum than Standard Sale would, and resolves the customer", () => {
    const { state, customerId } = stateWithRequestingCustomer();
    const customer = state.customers.customers[customerId]!;
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    const itemId = productItemId(
      customer.requestedProductId!,
      customer.requestedQuality!,
    );
    const stockBefore = getTotalQuantity(state.inventory, itemId);

    const result = favorableDeal(
      state,
      createCommand(
        CommandId.from("cmd-deal"),
        "FAVORABLE_DEAL",
        { customerId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.nextState.economy.coins).toBe(
      state.economy.coins + options.favorableDeal.finalCoins,
    );
    expect(options.favorableDeal.finalCoins).toBeLessThan(
      options.standardSale.finalCoins,
    );
    expect(options.favorableDeal.momentumDelta).toBeGreaterThan(
      options.standardSale.momentumDelta,
    );
    expect(getTotalQuantity(result.value.nextState.inventory, itemId)).toBe(
      stockBefore - 1,
    );
    expect(result.value.nextState.shop.momentum).toBe(
      state.shop.momentum + options.favorableDeal.momentumDelta,
    );
    expect(
      result.value.nextState.customers.customers[customerId],
    ).toBeUndefined();
    expect(result.value.events).toEqual([
      expect.objectContaining({ kind: "FAVORABLE_DEAL_RESOLVED", customerId }),
    ]);
  });

  it("fails with a typed error for an unknown customer", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const result = favorableDeal(
      state,
      createCommand(
        CommandId.from("cmd-deal"),
        "FAVORABLE_DEAL",
        { customerId: CustomerId.from("does-not-exist") },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CUSTOMER_NOT_FOUND");
  });
});
