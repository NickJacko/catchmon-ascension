// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId, CustomerId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { toTimestampMs } from "../../../core/time/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  addToInventory,
  productItemId,
} from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PLAYABLE_DISPLAY_SLOT_IDS,
  PROVISIONAL_FAVORABLE_DEAL_COIN_FACTOR,
  PROVISIONAL_PREMIUM_PITCH_COIN_FACTOR,
  PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_03_ID,
  SLICE_PRODUCT_05_ID,
  SLICE_WALK_IN_ARCHETYPE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createAssignDisplayProductHandler } from "../../commands/display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../../commands/customer/arrive-customer.ts";
import { getCustomerTransactionOptions } from "./transaction-quote-engine.ts";

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

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

const stateWithArrivedCustomer = (
  momentum = 0,
): {
  readonly state: GameState;
  readonly customerId: CustomerId;
} => {
  let state = baseState();
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
  state = { ...state, shop: { ...state.shop, momentum } };

  const arrived = arriveCustomer(
    state,
    createCommand(
      CommandId.from("setup-arrive"),
      "ARRIVE_CUSTOMER",
      {},
      new FakeClock(0),
    ),
  );
  if (!arrived.ok) throw new Error("expected arrival to succeed");
  const customerId = arrived.value.nextState.customers.activeCustomerIds[0]!;
  return { state: arrived.value.nextState, customerId };
};

describe("getCustomerTransactionOptions", () => {
  it("returns a fully-disabled quote for an unknown customer", () => {
    const options = getCustomerTransactionOptions(
      baseState(),
      CustomerId.from("does-not-exist"),
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    expect(options.standardSale).toEqual({
      eligible: false,
      disabledReason: "CUSTOMER_NOT_FOUND",
      finalCoins: 0,
      momentumDelta: 0,
    });
    expect(options.recommendCandidates).toEqual([]);
  });

  it("Standard Sale is eligible at the product's base value when stocked and requested", () => {
    const { state, customerId } = stateWithArrivedCustomer();
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    const product = catalog.products.get(SLICE_PRODUCT_01_ID)!;

    if (options.standardSale.eligible) {
      expect(options.standardSale.finalCoins).toBe(
        product.baseTransactionValue,
      );
    } else {
      // Whichever slice archetype was rolled may have no request at all
      // for this single displayed product — still a valid, typed outcome.
      expect(options.standardSale.disabledReason).toBe("NO_REQUEST");
    }
  });

  it("Favorable Deal quotes strictly less than Standard Sale's Coins when both are eligible", () => {
    const { state, customerId } = stateWithArrivedCustomer();
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    if (options.standardSale.eligible && options.favorableDeal.eligible) {
      expect(options.favorableDeal.finalCoins).toBeLessThan(
        options.standardSale.finalCoins,
      );
      expect(options.favorableDeal.finalCoins).toBe(
        Math.round(
          options.standardSale.finalCoins *
            PROVISIONAL_FAVORABLE_DEAL_COIN_FACTOR,
        ),
      );
      expect(options.favorableDeal.momentumDelta).toBeGreaterThan(
        options.standardSale.momentumDelta,
      );
    }
  });

  it("Premium Pitch is disabled with INSUFFICIENT_MOMENTUM when Momentum is too low", () => {
    const { state, customerId } = stateWithArrivedCustomer(0);
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    if (options.standardSale.eligible) {
      expect(options.premiumPitch.eligible).toBe(false);
      expect(options.premiumPitch.disabledReason).toBe("INSUFFICIENT_MOMENTUM");
    }
  });

  it("Premium Pitch is eligible and quotes more than Standard Sale once enough Momentum is available", () => {
    const { state, customerId } = stateWithArrivedCustomer(
      PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
    );
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    if (options.standardSale.eligible) {
      expect(options.premiumPitch.eligible).toBe(true);
      expect(options.premiumPitch.finalCoins).toBe(
        Math.round(
          options.standardSale.finalCoins *
            PROVISIONAL_PREMIUM_PITCH_COIN_FACTOR,
        ),
      );
      expect(options.premiumPitch.momentumDelta).toBeLessThan(0);
    }
  });

  it("Recommend never includes the customer's currently requested product (Document 05 §51)", () => {
    const { state, customerId } = stateWithArrivedCustomer(10);
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    const customer = state.customers.customers[customerId]!;
    for (const candidate of options.recommendCandidates) {
      expect(
        candidate.productId === customer.requestedProductId &&
          candidate.quality === customer.requestedQuality,
      ).toBe(false);
    }
  });

  it("Recommend only includes displayed products, never undisplayed inventory (Document 05 §55)", () => {
    const initial = stateWithArrivedCustomer(10);
    const { customerId } = initial;
    let state = initial.state;
    // Stock (but never display) a second, unrelated product.
    state = {
      ...state,
      inventory: addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_03_ID, "STANDARD"),
        5,
      ),
    };
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    expect(
      options.recommendCandidates.every(
        (c) => c.productId !== SLICE_PRODUCT_03_ID,
      ),
    ).toBe(true);
  });
});

describe("Favorable Deal — value-aware anti-cheap-item exploit scaling (Document 05 §46, Task 04.7)", () => {
  function stateRequesting(productId: typeof SLICE_PRODUCT_01_ID): {
    readonly state: GameState;
    readonly customerId: CustomerId;
  } {
    let state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    state = {
      ...state,
      inventory: addToInventory(
        state.inventory,
        productItemId(productId, "STANDARD"),
        5,
      ),
    };
    const customerId = CustomerId.from(`customer-${productId}`);
    state = {
      ...state,
      customers: {
        activeCustomerIds: [customerId],
        customers: {
          [customerId]: {
            customerId,
            archetypeId: SLICE_WALK_IN_ARCHETYPE_ID,
            arrivedAtMs: toTimestampMs(0),
            status: "AWAITING_DECISION",
            generationSeed: toSeed(1),
            requestedProductId: productId,
            requestedQuality: "STANDARD",
          },
        },
      },
    };
    return { state, customerId };
  }

  it("yields strictly less Momentum for a cheap product than an expensive one", () => {
    const cheap = stateRequesting(SLICE_PRODUCT_01_ID);
    const expensive = stateRequesting(SLICE_PRODUCT_05_ID);

    const cheapOptions = getCustomerTransactionOptions(
      cheap.state,
      cheap.customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    const expensiveOptions = getCustomerTransactionOptions(
      expensive.state,
      expensive.customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );

    expect(cheapOptions.favorableDeal.eligible).toBe(true);
    expect(expensiveOptions.favorableDeal.eligible).toBe(true);
    expect(cheapOptions.favorableDeal.momentumDelta).toBeLessThan(
      expensiveOptions.favorableDeal.momentumDelta,
    );
  });
});
