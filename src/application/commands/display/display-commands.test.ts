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
import {
  addToInventory,
  productItemId,
} from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  DISPLAY_EXPANSION_INFRASTRUCTURE_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_02_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import {
  getDisplaySlotView,
  getDisplayedProducts,
} from "../../queries/display/index.ts";
import { clearDisplaySlotHandler } from "./clear-display-slot.ts";
import { createAssignDisplayProductHandler } from "./assign-display-product.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [SLOT_1, SLOT_2] = PLAYABLE_DISPLAY_SLOT_IDS;
if (!SLOT_1 || !SLOT_2) throw new Error("expected 2+ playable display slots");

const assignDisplayProduct = createAssignDisplayProductHandler(catalog);

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

function stockedState(): GameState {
  const state = baseState();
  const itemId = productItemId(SLICE_PRODUCT_01_ID, "STANDARD");
  return { ...state, inventory: addToInventory(state.inventory, itemId, 5) };
}

describe("ASSIGN_DISPLAY_PRODUCT", () => {
  it("assigns a product to a slot when stock is available", () => {
    const result = assignDisplayProduct(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.nextState.shop.displaySlots[SLOT_1]).toEqual({
      displaySlotId: SLOT_1,
      assignedProductId: SLICE_PRODUCT_01_ID,
      assignedQuality: "STANDARD",
    });
  });

  it("fails with NO_STOCK_AVAILABLE when nothing is in inventory", () => {
    const result = assignDisplayProduct(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NO_STOCK_AVAILABLE");
  });

  it("fails with a typed error for an unknown product", () => {
    const result = assignDisplayProduct(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: "does-not-exist" as never },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("PRODUCT_NOT_FOUND");
  });

  it("changing the product on an already-assigned slot overwrites it", () => {
    const state = { ...stockedState() };
    const stockedBoth = {
      ...state,
      inventory: addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_02_ID, "STANDARD"),
        5,
      ),
    };
    const first = assignDisplayProduct(
      stockedBoth,
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = assignDisplayProduct(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_02_ID },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    expect(
      second.value.nextState.shop.displaySlots[SLOT_1]?.assignedProductId,
    ).toBe(SLICE_PRODUCT_02_ID);
  });
});

describe("CLEAR_DISPLAY_SLOT", () => {
  it("removes the assignment from a slot", () => {
    const assigned = assignDisplayProduct(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(assigned.ok).toBe(true);
    if (!assigned.ok) return;

    const cleared = clearDisplaySlotHandler(
      assigned.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "CLEAR_DISPLAY_SLOT",
        { displaySlotId: SLOT_1 },
        new FakeClock(0),
      ),
    );
    expect(cleared.ok).toBe(true);
    if (!cleared.ok) return;
    expect(cleared.value.nextState.shop.displaySlots[SLOT_1]).toEqual({
      displaySlotId: SLOT_1,
    });
  });
});

describe("display queries", () => {
  it("getDisplaySlotView returns null for an unassigned slot", () => {
    expect(getDisplaySlotView(baseState(), SLOT_1)).toBeNull();
  });

  it("getDisplaySlotView reports the assigned product and its available quantity", () => {
    const assigned = assignDisplayProduct(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok) throw new Error("expected assignment to succeed");

    const view = getDisplaySlotView(assigned.value.nextState, SLOT_1);
    expect(view).toEqual({
      displaySlotId: SLOT_1,
      productId: SLICE_PRODUCT_01_ID,
      quality: "STANDARD",
      availableQuantity: 5,
    });
  });

  it("getDisplayedProducts only returns assigned slots (Document 05 §26 primary request pool)", () => {
    const assigned = assignDisplayProduct(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok) throw new Error("expected assignment to succeed");

    const views = getDisplayedProducts(
      assigned.value.nextState,
      PLAYABLE_DISPLAY_SLOT_IDS,
    );
    expect(views).toHaveLength(1);
    expect(views[0]?.productId).toBe(SLICE_PRODUCT_01_ID);
  });
});

describe("ASSIGN_DISPLAY_PRODUCT — Display Expansion gate (Task 07.3)", () => {
  const [, , SLOT_3] = PLAYABLE_DISPLAY_SLOT_IDS;
  if (!SLOT_3) throw new Error("expected a 3rd playable display slot");

  const gatedAssignDisplayProduct = createAssignDisplayProductHandler(
    catalog,
    SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  );

  it("rejects assigning to the gated slot when the required infrastructure is not owned", () => {
    const result = gatedAssignDisplayProduct(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_3, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("DISPLAY_SLOT_LOCKED");
  });

  it("allows assigning to the gated slot once the required infrastructure is owned", () => {
    const state = stockedState();
    const ownedState: GameState = {
      ...state,
      infrastructure: {
        ...state.infrastructure,
        ownedInfrastructureIds: [DISPLAY_EXPANSION_INFRASTRUCTURE_ID],
      },
    };
    const result = gatedAssignDisplayProduct(
      ownedState,
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_3, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
  });

  it("never gates the first 2 slots", () => {
    const result = gatedAssignDisplayProduct(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: SLOT_1, productId: SLICE_PRODUCT_01_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
  });
});
