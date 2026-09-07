// @vitest-environment node
//
// Design owner: Document 15 Task 05.8 (Catchmon XP) — Shop Floor side:
// "completed customer interactions" (Document 06 §57).
import { describe, expect, it } from "vitest";
import { CommandId, type CustomerId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
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
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  PROVISIONAL_XP_PER_LEVEL,
  PROVISIONAL_XP_PER_SALE_RESOLUTION,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createAssignDisplayProductHandler } from "../display/assign-display-product.ts";
import { createAssignCatchmonHandler } from "../catchmons/assign-catchmon.ts";
import { createArriveCustomerHandler } from "../customer/arrive-customer.ts";
import { createStandardSaleHandler } from "./standard-sale.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [SLOT_1] = PLAYABLE_DISPLAY_SLOT_IDS;
if (!SLOT_1) throw new Error("expected a display slot");

const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
const assignCatchmon = createAssignCatchmonHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
);
const arriveCustomer = createArriveCustomerHandler(
  catalog,
  SLICE_CUSTOMER_ARCHETYPES,
  PLAYABLE_DISPLAY_SLOT_IDS,
  10,
);
const standardSale = createStandardSaleHandler(
  catalog,
  PLAYABLE_DISPLAY_SLOT_IDS,
  {
    xpPerSaleResolution: PROVISIONAL_XP_PER_SALE_RESOLUTION,
    xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
    levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
  },
);

const EMBERYNN_OWNED_ID = deriveInitialOwnedCatchmonId(EMBERYNN_SPECIES_ID);

const stateWithEmberynnOnDutyAndRequestingCustomer = (): {
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
    const assignedDisplay = assignDisplayProduct(
      state,
      createCommand(
        CommandId.from("setup-display"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    if (!assignedDisplay.ok)
      throw new Error("expected display assignment to succeed");
    state = assignedDisplay.value.nextState;

    const assignedCatchmon = assignCatchmon(
      state,
      createCommand(
        CommandId.from("setup-assign-catchmon"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: EMBERYNN_OWNED_ID,
          assignment: {
            kind: "SHOP_FLOOR",
            slotId: SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
          },
        },
        new FakeClock(0),
      ),
    );
    if (!assignedCatchmon.ok)
      throw new Error("expected Emberynn assignment to succeed");
    state = assignedCatchmon.value.nextState;

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

describe("Shop Floor Catchmon XP on sale resolution (Task 05.8)", () => {
  it("awards configured XP to the Catchmon on Shop Floor duty when a sale resolves", () => {
    const { state, customerId } =
      stateWithEmberynnOnDutyAndRequestingCustomer();
    expect(state.catchmons.ownedCatchmons[EMBERYNN_OWNED_ID]!.xp).toBe(0);

    const result = standardSale(
      state,
      createCommand(
        CommandId.from("cmd-sale"),
        "STANDARD_SALE",
        { customerId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(
      result.value.nextState.catchmons.ownedCatchmons[EMBERYNN_OWNED_ID]!.xp,
    ).toBe(PROVISIONAL_XP_PER_SALE_RESOLUTION);
  });
});
