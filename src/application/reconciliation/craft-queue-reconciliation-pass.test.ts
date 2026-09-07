// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId } from "../../core/ids/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import {
  addToInventory,
  getTotalQuantity,
  productItemId,
} from "../../domain/inventory/index.ts";
import { createCommand } from "../engine/index.ts";
import {
  PLAYABLE_STATION_IDS,
  SLICE_RECIPE_01_ID,
  SLICE_RECIPE_02_ID,
  SLICE_RECIPE_BALANCE,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { createQueueCraftHandler } from "../commands/craft/queue-craft.ts";
import { createStartCraftHandler } from "../commands/craft/start-craft.ts";
import { reconcileGameState } from "./reconcile-game-state.ts";
import { createCraftQueueReconciliationPass } from "./craft-queue-reconciliation-pass.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID) throw new Error("expected a playable station id");

const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
);
const queueCraft = createQueueCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  5,
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

function stockRecipe02(state: GameState, units = 5): GameState {
  const recipe = catalog.recipes.get(SLICE_RECIPE_02_ID);
  const resource =
    recipe && catalog.resources.get(recipe.routineInputs[0]!.resourceId);
  if (!resource) throw new Error("missing resource");
  return {
    ...state,
    inventory: addToInventory(state.inventory, resource.itemId, units),
  };
}

const defaultPass = createCraftQueueReconciliationPass();

describe("craft queue reconciliation — one craft", () => {
  it("completes an active craft whose completesAtMs has passed and delivers output to inventory", () => {
    let state = stockRecipe01(baseState());
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    state = started.value.nextState;

    const now = toTimestampMs(recipe01Duration + 5000);
    const report = reconcileGameState(state, now, catalog, [defaultPass]);

    const station = report.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.activeCraft).toBeUndefined();
    expect(station?.completedOutput).toBeUndefined();

    const product = catalog.products.get(
      catalog.recipes.get(SLICE_RECIPE_01_ID)!.outputProductId,
    )!;
    const outputItemId = productItemId(product.productId, "STANDARD");
    expect(getTotalQuantity(report.nextState.inventory, outputItemId)).toBe(
      product.outputQuantity,
    );
    expect(report.events).toEqual([
      expect.objectContaining({
        kind: "CRAFT_COMPLETED",
        stationId: PROVISION_STATION_ID,
      }),
    ]);
  });

  it("does nothing when completesAtMs has not yet passed", () => {
    let state = stockRecipe01(baseState());
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    state = started.value.nextState;

    const report = reconcileGameState(
      state,
      toTimestampMs(recipe01Duration - 1),
      catalog,
      [defaultPass],
    );
    expect(
      report.nextState.crafting.stations[PROVISION_STATION_ID]?.activeCraft,
    ).toBeDefined();
    expect(report.events).toEqual([]);
  });

  it("completes exactly at the boundary timestamp (completesAtMs === now)", () => {
    let state = stockRecipe01(baseState());
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    state = started.value.nextState;

    const report = reconcileGameState(
      state,
      toTimestampMs(recipe01Duration),
      catalog,
      [defaultPass],
    );
    expect(
      report.nextState.crafting.stations[PROVISION_STATION_ID]?.activeCraft,
    ).toBeUndefined();
  });
});

describe("craft queue reconciliation — multiple queue entries (historical progression)", () => {
  it("promotes and completes every queued craft that could have finished in the elapsed window", () => {
    let state = stockRecipe02(stockRecipe01(baseState(), 10), 10);
    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(started.ok).toBe(true);
    if (!started.ok) return;
    state = started.value.nextState;

    const queued1 = queueCraft(
      state,
      createCommand(
        CommandId.from("cmd-2"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_02_ID },
        new FakeClock(0),
      ),
    );
    expect(queued1.ok).toBe(true);
    if (!queued1.ok) return;
    state = queued1.value.nextState;

    const queued2 = queueCraft(
      state,
      createCommand(
        CommandId.from("cmd-3"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(queued2.ok).toBe(true);
    if (!queued2.ok) return;
    state = queued2.value.nextState;

    const totalDuration =
      recipe01Duration + recipe02Duration + recipe01Duration;
    const report = reconcileGameState(
      state,
      toTimestampMs(totalDuration + 1000),
      catalog,
      [defaultPass],
    );

    const station = report.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.activeCraft).toBeUndefined();
    expect(station?.queuedCrafts).toHaveLength(0);

    const completedEvents = report.events.filter(
      (e) => e.kind === "CRAFT_COMPLETED",
    );
    expect(completedEvents).toHaveLength(3);

    const product01 = catalog.products.get(
      catalog.recipes.get(SLICE_RECIPE_01_ID)!.outputProductId,
    )!;
    const product02 = catalog.products.get(
      catalog.recipes.get(SLICE_RECIPE_02_ID)!.outputProductId,
    )!;
    const item01 = productItemId(product01.productId, "STANDARD");
    const item02 = productItemId(product02.productId, "STANDARD");
    expect(getTotalQuantity(report.nextState.inventory, item01)).toBe(
      product01.outputQuantity * 2,
    );
    expect(getTotalQuantity(report.nextState.inventory, item02)).toBe(
      product02.outputQuantity,
    );
  });

  it("stops at the historical eligible time when the elapsed window only covers part of the queue", () => {
    let state = stockRecipe02(stockRecipe01(baseState(), 10), 10);
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

    const queued = queueCraft(
      state,
      createCommand(
        CommandId.from("cmd-2"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_02_ID },
        new FakeClock(0),
      ),
    );
    if (!queued.ok) throw new Error("expected queue to succeed");
    state = queued.value.nextState;

    // Only enough elapsed time for the first craft, not the queued second one.
    const report = reconcileGameState(
      state,
      toTimestampMs(recipe01Duration + 1),
      catalog,
      [defaultPass],
    );
    const station = report.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.activeCraft?.recipeId).toBe(SLICE_RECIPE_02_ID);
    expect(station?.activeCraft?.startedAtMs).toBe(recipe01Duration);
    expect(station?.queuedCrafts).toHaveLength(0);
  });
});

describe("craft queue reconciliation — storage blocked", () => {
  it("protects the output and pauses the station instead of promoting the next queued craft", () => {
    let state = stockRecipe02(stockRecipe01(baseState(), 10), 10);
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

    const queued = queueCraft(
      state,
      createCommand(
        CommandId.from("cmd-2"),
        "QUEUE_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_02_ID },
        new FakeClock(0),
      ),
    );
    if (!queued.ok) throw new Error("expected queue to succeed");
    state = queued.value.nextState;

    const product01 = catalog.products.get(
      catalog.recipes.get(SLICE_RECIPE_01_ID)!.outputProductId,
    )!;
    const blockedItemId = productItemId(product01.productId, "STANDARD");
    const blockingPass = createCraftQueueReconciliationPass(
      (_state, itemId) => itemId !== blockedItemId,
    );

    const report = reconcileGameState(
      state,
      toTimestampMs(recipe01Duration + recipe02Duration + 1000),
      catalog,
      [blockingPass],
    );

    const station = report.nextState.crafting.stations[PROVISION_STATION_ID];
    expect(station?.activeCraft).toBeUndefined();
    expect(station?.completedOutput).toEqual({
      productId: product01.productId,
      quantity: product01.outputQuantity,
    });
    // The queued second craft must not have been promoted while blocked.
    expect(station?.queuedCrafts).toHaveLength(1);
    expect(getTotalQuantity(report.nextState.inventory, blockedItemId)).toBe(0);
  });
});

describe("craft queue reconciliation — idempotency", () => {
  it("produces no duplicate output or events when reconciled again at the same now", () => {
    let state = stockRecipe01(baseState());
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

    const now = toTimestampMs(recipe01Duration + 1000);
    const first = reconcileGameState(state, now, catalog, [defaultPass]);
    expect(first.events).toHaveLength(1);

    const second = reconcileGameState(first.nextState, now, catalog, [
      defaultPass,
    ]);
    expect(second.events).toHaveLength(0);
    expect(second.nextState).toEqual(first.nextState);
  });
});
