// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { toTimestampMs } from "../../../core/time/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { addToInventory } from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PLAYABLE_STATION_IDS,
  SLICE_RECIPE_01_ID,
  SLICE_RECIPE_02_ID,
  SLICE_RECIPE_03_ID,
  SLICE_RECIPE_BALANCE,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createQueueCraftHandler } from "../../commands/craft/queue-craft.ts";
import { createStartCraftHandler } from "../../commands/craft/start-craft.ts";
import { createCraftQueries } from "./craft-queries.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID) throw new Error("expected a playable station id");

const MAX_QUEUE_SIZE = 2;
const queries = createCraftQueries(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  MAX_QUEUE_SIZE,
);
const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
);
const queueCraft = createQueueCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  MAX_QUEUE_SIZE,
);
const recipe01Duration =
  SLICE_RECIPE_BALANCE["slice-recipe-01"]!.craftDurationMs;
const recipe02Duration =
  SLICE_RECIPE_BALANCE["slice-recipe-02"]!.craftDurationMs;

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

function stockRecipe01(state: GameState, units = 5): GameState {
  const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID);
  const resource =
    recipe && catalog.resources.get(recipe.routineInputs[0]!.resourceId);
  if (!resource) throw new Error("missing resource");
  return {
    ...state,
    inventory: addToInventory(state.inventory, resource.itemId, units),
  };
}

describe("canCraft", () => {
  it("is true when materials are stocked, station matches, and a slot is free", () => {
    const state = stockRecipe01(baseState());
    expect(
      queries.canCraft(state, PROVISION_STATION_ID, SLICE_RECIPE_01_ID),
    ).toBe(true);
  });

  it("is false when the recipe requires a different station archetype", () => {
    const state = stockRecipe01(baseState());
    expect(
      queries.canCraft(state, PROVISION_STATION_ID, SLICE_RECIPE_03_ID),
    ).toBe(false);
  });

  it("is false when materials are missing", () => {
    const state = baseState();
    expect(
      queries.canCraft(state, PROVISION_STATION_ID, SLICE_RECIPE_01_ID),
    ).toBe(false);
  });

  it("is false for an unknown recipe", () => {
    const state = baseState();
    expect(
      queries.canCraft(state, PROVISION_STATION_ID, "does-not-exist" as never),
    ).toBe(false);
  });

  it("is false when the station is busy and the queue is full", () => {
    let state = stockRecipe01(baseState(), 20);
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    if (!started.ok) throw new Error("expected start to succeed");
    state = started.value.nextState;

    for (let i = 0; i < MAX_QUEUE_SIZE; i += 1) {
      const queued = queueCraft(
        state,
        createCommand(
          CommandId.from(`cmd-q-${String(i)}`),
          "QUEUE_CRAFT",
          { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
          new FakeClock(0),
        ),
      );
      if (!queued.ok) throw new Error("expected queue to succeed");
      state = queued.value.nextState;
    }

    expect(
      queries.canCraft(state, PROVISION_STATION_ID, SLICE_RECIPE_01_ID),
    ).toBe(false);
  });
});

describe("missingIngredients", () => {
  it("is empty when every input is fully available", () => {
    const state = stockRecipe01(baseState());
    expect(queries.missingIngredients(state, SLICE_RECIPE_01_ID)).toEqual([]);
  });

  it("lists each shortfall with required vs available", () => {
    const state = baseState();
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID)!;
    const resource = catalog.resources.get(
      recipe.routineInputs[0]!.resourceId,
    )!;

    const shortfalls = queries.missingIngredients(state, SLICE_RECIPE_01_ID);
    expect(shortfalls).toEqual([
      { itemId: resource.itemId, required: 1, available: 0 },
    ]);
  });

  it("is empty for an unknown recipe (nothing to report)", () => {
    const state = baseState();
    expect(
      queries.missingIngredients(state, "does-not-exist" as never),
    ).toEqual([]);
  });
});

describe("estimatedCompletion", () => {
  it("estimates now + duration when the station is free", () => {
    const state = stockRecipe01(baseState());
    const estimate = queries.estimatedCompletion(
      state,
      PROVISION_STATION_ID,
      SLICE_RECIPE_01_ID,
      toTimestampMs(1000),
    );
    expect(estimate).toBe(1000 + recipe01Duration);
  });

  it("estimates after the active craft and everything already queued ahead of it", () => {
    let state = stockRecipe01(baseState(), 20);
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(1000),
      ),
    );
    if (!started.ok) throw new Error("expected start to succeed");
    state = started.value.nextState;

    const queued = queueCraft(
      state,
      createCommand(
        CommandId.from("cmd-2"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_02_ID },
        new FakeClock(1000),
      ),
    );
    if (!queued.ok) throw new Error("expected queue to succeed");
    state = queued.value.nextState;

    const estimate = queries.estimatedCompletion(
      state,
      PROVISION_STATION_ID,
      SLICE_RECIPE_01_ID,
      toTimestampMs(1000),
    );
    expect(estimate).toBe(
      1000 + recipe01Duration + recipe02Duration + recipe01Duration,
    );
  });

  it("returns null for a station-capability mismatch", () => {
    const state = stockRecipe01(baseState());
    expect(
      queries.estimatedCompletion(
        state,
        PROVISION_STATION_ID,
        SLICE_RECIPE_03_ID,
        toTimestampMs(0),
      ),
    ).toBeNull();
  });
});

describe("currentQueue", () => {
  it("reports null active and an empty queue for an untouched station", () => {
    const state = baseState();
    expect(queries.currentQueue(state, PROVISION_STATION_ID)).toEqual({
      active: null,
      queued: [],
    });
  });

  it("reflects the active craft and queued entries", () => {
    let state = stockRecipe01(baseState(), 20);
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    if (!started.ok) throw new Error("expected start to succeed");
    state = started.value.nextState;

    const view = queries.currentQueue(state, PROVISION_STATION_ID);
    expect(view.active?.recipeId).toBe(SLICE_RECIPE_01_ID);
    expect(view.queued).toEqual([]);
  });
});

describe("productOutputPreview", () => {
  it("returns the recipe's output preview", () => {
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID)!;
    const product = catalog.products.get(recipe.outputProductId)!;
    expect(queries.productOutputPreview(SLICE_RECIPE_01_ID)).toEqual({
      outputProductId: product.productId,
      displayName: product.displayName,
      stationType: recipe.stationType,
      craftDurationMs: recipe.craftDuration,
      outputQuantity: product.outputQuantity,
      baseTransactionValue: product.baseTransactionValue,
      routineInputCount: recipe.routineInputs.length,
      specialInputCount: recipe.specialInputs.length,
    });
  });

  it("returns null for an unknown recipe", () => {
    expect(queries.productOutputPreview("does-not-exist" as never)).toBeNull();
  });
});

describe("masteryPlaceholder", () => {
  it("reports the KNOWN milestone with no invented progression", () => {
    const product = catalog.products.get(
      catalog.recipes.get(SLICE_RECIPE_01_ID)!.outputProductId,
    )!;
    expect(queries.masteryPlaceholder(SLICE_RECIPE_01_ID)).toEqual({
      recipeId: SLICE_RECIPE_01_ID,
      milestone: "KNOWN",
      masteryProfile: product.masteryProfile,
    });
  });

  it("returns null for an unknown recipe", () => {
    expect(queries.masteryPlaceholder("does-not-exist" as never)).toBeNull();
  });
});

describe("stationHasAvailableRecipes (Ozean Batch A: Care Atelier foundation check)", () => {
  it("is true for stations with real recipes (Provision Station, Fieldworks Bench)", () => {
    const [provisionStationId, fieldworksBenchId] = PLAYABLE_STATION_IDS;
    expect(
      queries.stationHasAvailableRecipes(baseState(), provisionStationId!),
    ).toBe(true);
    expect(
      queries.stationHasAvailableRecipes(baseState(), fieldworksBenchId!),
    ).toBe(true);
  });

  it("is false for a registered station archetype with zero recipes yet (Care Atelier)", () => {
    const careAtelierId = PLAYABLE_STATION_IDS[2];
    if (!careAtelierId) throw new Error("expected a 3rd playable station id");
    expect(queries.stationHasAvailableRecipes(baseState(), careAtelierId)).toBe(
      false,
    );
  });
});
