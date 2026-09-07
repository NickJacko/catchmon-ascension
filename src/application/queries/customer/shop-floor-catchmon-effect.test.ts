// @vitest-environment node
//
// Design owner: Document 15 Task 05.7 (Shop Floor Catchmon Effect).
// Acceptance: "strategic effect is visible in quote/query output, not a
// passive free-money printer."
import { describe, expect, it } from "vitest";
import { CommandId, CustomerId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { toTimestampMs } from "../../../core/time/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  addToInventory,
  productItemId,
} from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  EMBERYNN_SPECIES_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_05_ID,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  SLICE_WALK_IN_ARCHETYPE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createAssignDisplayProductHandler } from "../../commands/display/assign-display-product.ts";
import { createAssignCatchmonHandler } from "../../commands/catchmons/assign-catchmon.ts";
import { getCustomerTransactionOptions } from "./transaction-quote-engine.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [SLOT_1, SLOT_2] = PLAYABLE_DISPLAY_SLOT_IDS;
if (!SLOT_1 || !SLOT_2) throw new Error("expected 2+ display slots");

const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
const assignCatchmon = createAssignCatchmonHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
);

const stateWithWalkInCustomerAndBothProductsDisplayed = (): {
  readonly state: GameState;
  readonly customerId: CustomerId;
} => {
  let state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  state = {
    ...state,
    inventory: addToInventory(
      addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_01_ID, "STANDARD"),
        5,
      ),
      productItemId(SLICE_PRODUCT_05_ID, "STANDARD"),
      5,
    ),
  };
  for (const [slotId, productId] of [
    [SLOT_1, SLICE_PRODUCT_01_ID],
    [SLOT_2, SLICE_PRODUCT_05_ID],
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

  const customerId = CustomerId.from("customer-walk-in");
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
          requestedProductId: SLICE_PRODUCT_01_ID,
          requestedQuality: "STANDARD",
        },
      },
    },
  };
  return { state, customerId };
};

describe("Shop Floor Catchmon Effect (Task 05.7)", () => {
  it("Elemental Craft is not a Recommend candidate for a Walk-In customer without Shop Floor support", () => {
    const { state, customerId } =
      stateWithWalkInCustomerAndBothProductsDisplayed();
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
      PROVISIONAL_CAPABILITY_MAGNITUDES,
    );
    expect(
      options.recommendCandidates.some(
        (c) => c.productId === SLICE_PRODUCT_05_ID,
      ),
    ).toBe(false);
  });

  it("Elemental Craft becomes a Recommend candidate once Emberynn is assigned to Shop Floor support", () => {
    const { state, customerId } =
      stateWithWalkInCustomerAndBothProductsDisplayed();
    const assigned = assignCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: deriveInitialOwnedCatchmonId(EMBERYNN_SPECIES_ID),
          assignment: {
            kind: "SHOP_FLOOR",
            slotId: SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
          },
        },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok)
      throw new Error("expected Emberynn assignment to succeed");

    const options = getCustomerTransactionOptions(
      assigned.value.nextState,
      customerId,
      catalog,
      PLAYABLE_DISPLAY_SLOT_IDS,
      PROVISIONAL_CAPABILITY_MAGNITUDES,
    );
    const candidate = options.recommendCandidates.find(
      (c) => c.productId === SLICE_PRODUCT_05_ID,
    );
    expect(candidate).toBeDefined();
    // Still a strategic Momentum-gated action, not free Coins.
    expect(candidate!.outcome.momentumDelta).toBeLessThan(0);
  });
});
