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
  PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createAssignDisplayProductHandler } from "../display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../customer/arrive-customer.ts";
import { getCustomerTransactionOptions } from "../../queries/customer/index.ts";
import { createPremiumPitchHandler } from "./premium-pitch.ts";

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
const premiumPitch = createPremiumPitchHandler(
  catalog,
  PLAYABLE_DISPLAY_SLOT_IDS,
);

const stateWithRequestingCustomer = (
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
        state.inventory,
        productItemId(SLICE_PRODUCT_01_ID, "STANDARD"),
        10,
      ),
      shop: { ...state.shop, momentum },
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

describe("PREMIUM_PITCH", () => {
  it("fails with INSUFFICIENT_MOMENTUM and leaves the customer active when Momentum is too low", () => {
    const { state, customerId } = stateWithRequestingCustomer(0);
    const result = premiumPitch(
      state,
      createCommand(
        CommandId.from("cmd-pitch"),
        "PREMIUM_PITCH",
        { customerId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("INSUFFICIENT_MOMENTUM");
    expect(state.customers.customers[customerId]).toBeDefined();
  });

  it("credits more Coins than Standard Sale, spends (not gains) Momentum, and resolves the customer once eligible", () => {
    const { state, customerId } = stateWithRequestingCustomer(
      PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
    );
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

    const result = premiumPitch(
      state,
      createCommand(
        CommandId.from("cmd-pitch"),
        "PREMIUM_PITCH",
        { customerId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(options.premiumPitch.finalCoins).toBeGreaterThan(
      options.standardSale.finalCoins,
    );
    expect(options.premiumPitch.momentumDelta).toBeLessThan(0);
    expect(result.value.nextState.economy.coins).toBe(
      state.economy.coins + options.premiumPitch.finalCoins,
    );
    expect(result.value.nextState.shop.momentum).toBe(
      state.shop.momentum - PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
    );
    expect(getTotalQuantity(result.value.nextState.inventory, itemId)).toBe(
      stockBefore - 1,
    );
    expect(
      result.value.nextState.customers.customers[customerId],
    ).toBeUndefined();
    expect(result.value.events).toEqual([
      expect.objectContaining({ kind: "PREMIUM_PITCH_RESOLVED", customerId }),
    ]);
  });

  it("fails with a typed error for an unknown customer", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const result = premiumPitch(
      state,
      createCommand(
        CommandId.from("cmd-pitch"),
        "PREMIUM_PITCH",
        { customerId: CustomerId.from("does-not-exist") },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CUSTOMER_NOT_FOUND");
  });
});
