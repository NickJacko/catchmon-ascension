// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { addToInventory } from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PLAYABLE_DISPLAY_SLOT_IDS,
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { productItemId } from "../../../domain/inventory/index.ts";
import { createAssignDisplayProductHandler } from "../display/assign-display-product.ts";
import { createArriveCustomerHandler } from "./arrive-customer.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [SLOT_1] = PLAYABLE_DISPLAY_SLOT_IDS;
if (!SLOT_1) throw new Error("expected a playable display slot");

const arriveCustomer = createArriveCustomerHandler(
  catalog,
  SLICE_CUSTOMER_ARCHETYPES,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
);
const assignDisplayProduct = createAssignDisplayProductHandler(catalog);

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

const stateWithDisplayedProduct = (): GameState => {
  const state = baseState();
  const stocked = {
    ...state,
    inventory: addToInventory(
      state.inventory,
      productItemId(SLICE_PRODUCT_01_ID, "STANDARD"),
      5,
    ),
  };
  const assigned = assignDisplayProduct(
    stocked,
    createCommand(
      CommandId.from("setup-assign"),
      "ASSIGN_DISPLAY_PRODUCT",
      { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
      new FakeClock(0),
    ),
  );
  if (!assigned.ok) throw new Error("expected setup assignment to succeed");
  return assigned.value.nextState;
};

describe("ARRIVE_CUSTOMER", () => {
  it("generates an active customer instance with a persisted archetype and generation seed", () => {
    const result = arriveCustomer(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(1000),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.nextState.customers.activeCustomerIds).toHaveLength(1);
    const customerId = result.value.nextState.customers.activeCustomerIds[0]!;
    const customer = result.value.nextState.customers.customers[customerId]!;
    expect(customer.arrivedAtMs).toBe(1000);
    expect(customer.status).toBe("AWAITING_DECISION");
    expect(typeof customer.generationSeed).toBe("number");
    expect(
      SLICE_CUSTOMER_ARCHETYPES.some(
        (a) => a.customerArchetypeId === customer.archetypeId,
      ),
    ).toBe(true);
  });

  it("is deterministic: the same commandId/state always produces the same archetype and request", () => {
    const state = stateWithDisplayedProduct();
    const command = createCommand(
      CommandId.from("cmd-deterministic"),
      "ARRIVE_CUSTOMER",
      {},
      new FakeClock(0),
    );
    const first = arriveCustomer(state, command);
    const second = arriveCustomer(state, command);
    expect(first).toEqual(second);
  });

  it("requests a displayed product matching the chosen archetype's family (Document 05 §26)", () => {
    const result = arriveCustomer(
      stateWithDisplayedProduct(),
      createCommand(
        CommandId.from("cmd-1"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const customerId = result.value.nextState.customers.activeCustomerIds[0]!;
    const customer = result.value.nextState.customers.customers[customerId]!;
    // The only displayed product is slice-product-01 (PROVISIONS); every
    // slice archetype has either PROVISIONS as preferred or secondary, so
    // a request should always be found here.
    expect(customer.requestedProductId).toBe(SLICE_PRODUCT_01_ID);
    expect(customer.requestedQuality).toBe("STANDARD");
  });

  it("arrives with no request when nothing displayed matches (no crash, deterministic no-match)", () => {
    const result = arriveCustomer(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const customerId = result.value.nextState.customers.activeCustomerIds[0]!;
    const customer = result.value.nextState.customers.customers[customerId]!;
    expect(customer.requestedProductId).toBeUndefined();
  });

  it("fails with CUSTOMER_CAPACITY_FULL once the active capacity is reached", () => {
    let state = baseState();
    for (let i = 0; i < PROVISIONAL_MAX_ACTIVE_CUSTOMERS; i += 1) {
      const result = arriveCustomer(
        state,
        createCommand(
          CommandId.from(`cmd-${String(i)}`),
          "ARRIVE_CUSTOMER",
          {},
          new FakeClock(i),
        ),
      );
      expect(result.ok).toBe(true);
      if (result.ok) state = result.value.nextState;
    }

    const overflow = arriveCustomer(
      state,
      createCommand(
        CommandId.from("cmd-overflow"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(999),
      ),
    );
    expect(overflow.ok).toBe(false);
    if (!overflow.ok)
      expect(overflow.error.code).toBe("CUSTOMER_CAPACITY_FULL");
  });
});
