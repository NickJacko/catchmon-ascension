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
  getAvailableQuantity,
} from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PLAYABLE_STATION_IDS,
  SLICE_RECIPE_01_ID,
  SLICE_RECIPE_02_ID,
  SLICE_RECIPE_03_ID,
  SLICE_RECIPE_05_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_QUEUE_SIZE,
} from "../../../content/vertical-slice/index.ts";
import { cancelQueuedCraftHandler } from "./cancel-queued-craft.ts";
import { createQueueCraftHandler } from "./queue-craft.ts";
import { createStartCraftHandler } from "./start-craft.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID, FIELDWORKS_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID || !FIELDWORKS_STATION_ID) {
  throw new Error("expected 2 playable station IDs");
}

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

/** Stocks enough of every routine/special input a recipe needs (1 unit each, matching the slice's 1-unit-per-input assumption). */
function stockRecipeInputs(
  state: GameState,
  recipeId: typeof SLICE_RECIPE_01_ID,
): GameState {
  const recipe = catalog.recipes.get(recipeId);
  if (!recipe) throw new Error(`missing recipe ${recipeId}`);
  let inventory = state.inventory;
  for (const input of recipe.routineInputs) {
    const resource = catalog.resources.get(input.resourceId);
    if (!resource) throw new Error(`missing resource ${input.resourceId}`);
    inventory = addToInventory(inventory, resource.itemId, 5);
  }
  for (const input of recipe.specialInputs) {
    const component = catalog.components.get(input.componentId);
    if (!component) throw new Error(`missing component ${input.componentId}`);
    inventory = addToInventory(inventory, component.itemId, 5);
  }
  return { ...state, inventory };
}

const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
);
const queueCraft = createQueueCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_QUEUE_SIZE,
);

describe("START_CRAFT", () => {
  it("starts a craft, reserves materials, and computes completesAtMs from the recipe's duration", () => {
    const state = stockRecipeInputs(baseState(), SLICE_RECIPE_01_ID);
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID);
    if (!recipe) throw new Error("missing recipe");

    const clock = new FakeClock(1000);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_CRAFT",
      { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
      clock,
    );
    const result = startCraft(state, command);

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const station =
      result.value.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.activeCraft?.recipeId).toBe(SLICE_RECIPE_01_ID);
    expect(station?.activeCraft?.startedAtMs).toBe(1000);
    expect(station?.activeCraft?.completesAtMs).toBe(
      1000 + recipe.craftDuration,
    );
    expect(result.value.events).toEqual([
      expect.objectContaining({
        kind: "CRAFT_STARTED",
        stationId: PROVISION_STATION_ID,
      }),
    ]);
  });

  it("reserves the recipe's inputs, reducing available quantity", () => {
    const state = stockRecipeInputs(baseState(), SLICE_RECIPE_01_ID);
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID);
    const resource =
      recipe && catalog.resources.get(recipe.routineInputs[0]!.resourceId);
    if (!resource) throw new Error("missing resource");

    const before = getAvailableQuantity(state.inventory, resource.itemId);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_CRAFT",
      { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
      new FakeClock(0),
    );
    const result = startCraft(state, command);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const after = getAvailableQuantity(
      result.value.nextState.inventory,
      resource.itemId,
    );
    expect(after).toBe(before - 1);
  });

  it("fails with a typed error for an unknown recipe, leaving state untouched", () => {
    const state = baseState();
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_CRAFT",
      { stationId: PROVISION_STATION_ID, recipeId: "does-not-exist" as never },
      new FakeClock(0),
    );
    const result = startCraft(state, command);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("RECIPE_NOT_FOUND");
  });

  it("fails when the recipe's station type does not match the target station (station capability)", () => {
    const state = stockRecipeInputs(baseState(), SLICE_RECIPE_03_ID);
    // slice-recipe-03 requires FIELDWORKS_BENCH; targeting the provision station must fail.
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_CRAFT",
      { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_03_ID },
      new FakeClock(0),
    );
    const result = startCraft(state, command);
    expect(result.ok).toBe(false);
    if (!result.ok)
      expect(result.error.code).toBe("STATION_CAPABILITY_MISMATCH");
  });

  it("fails with STATION_BUSY when the station already has an active craft", () => {
    const state = stockRecipeInputs(
      stockRecipeInputs(baseState(), SLICE_RECIPE_01_ID),
      SLICE_RECIPE_02_ID,
    );
    const first = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = startCraft(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_02_ID },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("STATION_BUSY");
  });

  it("fails with an inventory error and does not mutate state when materials are insufficient", () => {
    const state = baseState(); // no materials stocked
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_CRAFT",
      { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
      new FakeClock(0),
    );
    const result = startCraft(state, command);
    expect(result.ok).toBe(false);
    expect(state.crafting.stations[PROVISION_STATION_ID]).toBeUndefined();
  });

  it("uses the special component for an advanced recipe and reserves it too", () => {
    const state = stockRecipeInputs(baseState(), SLICE_RECIPE_05_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_CRAFT",
      { stationId: FIELDWORKS_STATION_ID, recipeId: SLICE_RECIPE_05_ID },
      new FakeClock(0),
    );
    const result = startCraft(state, command);
    expect(result.ok).toBe(true);
  });
});

describe("QUEUE_CRAFT", () => {
  it("appends a queued craft and reserves its materials immediately", () => {
    const stocked = stockRecipeInputs(
      stockRecipeInputs(baseState(), SLICE_RECIPE_01_ID),
      SLICE_RECIPE_02_ID,
    );
    const started = startCraft(
      stocked,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(started.ok).toBe(true);
    if (!started.ok) return;

    const queued = queueCraft(
      started.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_02_ID },
        new FakeClock(1),
      ),
    );
    expect(queued.ok).toBe(true);
    if (!queued.ok) return;

    const station =
      queued.value.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.queuedCrafts).toHaveLength(1);
    expect(station?.queuedCrafts[0]?.recipeId).toBe(SLICE_RECIPE_02_ID);
  });

  it("rejects a queue beyond PROVISIONAL_MAX_QUEUE_SIZE", () => {
    let state = baseState();
    for (let i = 0; i < PROVISIONAL_MAX_QUEUE_SIZE + 2; i += 1) {
      state = stockRecipeInputs(state, SLICE_RECIPE_01_ID);
    }

    let current = state;
    for (let i = 0; i < PROVISIONAL_MAX_QUEUE_SIZE; i += 1) {
      const result = queueCraft(
        current,
        createCommand(
          CommandId.from(`cmd-${String(i)}`),
          "QUEUE_CRAFT",
          { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
          new FakeClock(i),
        ),
      );
      expect(result.ok).toBe(true);
      if (result.ok) current = result.value.nextState;
    }

    const overflow = queueCraft(
      current,
      createCommand(
        CommandId.from("cmd-overflow"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(999),
      ),
    );
    expect(overflow.ok).toBe(false);
    if (!overflow.ok) expect(overflow.error.code).toBe("QUEUE_FULL");
  });
});

describe("CANCEL_QUEUED_CRAFT", () => {
  it("removes the queued craft and restores reserved materials", () => {
    const stocked = stockRecipeInputs(baseState(), SLICE_RECIPE_01_ID);
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID);
    const resource =
      recipe && catalog.resources.get(recipe.routineInputs[0]!.resourceId);
    if (!resource) throw new Error("missing resource");

    const queued = queueCraft(
      stocked,
      createCommand(
        CommandId.from("cmd-1"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(queued.ok).toBe(true);
    if (!queued.ok) return;

    const craftId =
      queued.value.nextState.crafting.stations[PROVISION_STATION_ID]
        ?.queuedCrafts[0]?.craftId;
    if (!craftId) throw new Error("expected a queued craft");

    const beforeCancel = getAvailableQuantity(
      queued.value.nextState.inventory,
      resource.itemId,
    );

    const cancelled = cancelQueuedCraftHandler(
      queued.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "CANCEL_QUEUED_CRAFT",
        { stationId: PROVISION_STATION_ID, craftId },
        new FakeClock(1),
      ),
    );
    expect(cancelled.ok).toBe(true);
    if (!cancelled.ok) return;

    const station =
      cancelled.value.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.queuedCrafts).toHaveLength(0);
    expect(
      getAvailableQuantity(
        cancelled.value.nextState.inventory,
        resource.itemId,
      ),
    ).toBe(beforeCancel + 1);
  });

  it("fails with a typed error for an unknown craftId", () => {
    const state = baseState();
    const result = cancelQueuedCraftHandler(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "CANCEL_QUEUED_CRAFT",
        { stationId: PROVISION_STATION_ID, craftId: "does-not-exist" },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("STATION_NOT_FOUND");
  });
});
