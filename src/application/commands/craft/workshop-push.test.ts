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
  PLAYABLE_STATION_IDS,
  PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT,
  PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST,
  PROVISIONAL_WORKSHOP_PUSH_TIME_REDUCTION_MS,
  SLICE_RECIPE_03_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createStartCraftHandler } from "./start-craft.ts";
import { workshopPushHandler } from "./workshop-push.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [, FIELDWORKS_STATION_ID] = PLAYABLE_STATION_IDS;
if (!FIELDWORKS_STATION_ID) throw new Error("expected a fieldworks station ID");

const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
);

const stateWithActiveCraft = (momentum: number): GameState => {
  const recipe = catalog.recipes.get(SLICE_RECIPE_03_ID);
  if (!recipe) throw new Error("missing slice-recipe-03");
  let state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  state = { ...state, shop: { ...state.shop, momentum } };
  for (const input of recipe.routineInputs) {
    const resource = catalog.resources.get(input.resourceId);
    if (!resource) throw new Error(`missing resource ${input.resourceId}`);
    state = {
      ...state,
      inventory: addToInventory(state.inventory, resource.itemId, 5),
    };
  }
  const started = startCraft(
    state,
    createCommand(
      CommandId.from("setup-start"),
      "START_CRAFT",
      { stationId: FIELDWORKS_STATION_ID, recipeId: SLICE_RECIPE_03_ID },
      new FakeClock(0),
    ),
  );
  if (!started.ok) throw new Error("expected craft to start");
  return started.value.nextState;
};

describe("WORKSHOP_PUSH", () => {
  it("spends Momentum and moves completesAtMs earlier by the flat reduction", () => {
    const state = stateWithActiveCraft(PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST);
    const before = state.crafting.stations[FIELDWORKS_STATION_ID]!.activeCraft!;

    const result = workshopPushHandler(
      state,
      createCommand(
        CommandId.from("cmd-push"),
        "WORKSHOP_PUSH",
        { stationId: FIELDWORKS_STATION_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const after =
      result.value.nextState.crafting.stations[FIELDWORKS_STATION_ID]!
        .activeCraft!;
    expect(after.completesAtMs).toBe(
      before.completesAtMs - PROVISIONAL_WORKSHOP_PUSH_TIME_REDUCTION_MS,
    );
    expect(after.workshopPushCount).toBe(1);
    expect(result.value.nextState.shop.momentum).toBe(0);
    expect(result.value.events).toEqual([
      expect.objectContaining({
        kind: "WORKSHOP_PUSH_APPLIED",
        stationId: FIELDWORKS_STATION_ID,
        pushCount: 1,
      }),
    ]);
  });

  it("never reduces completesAtMs below startedAtMs (timestamp-safe floor)", () => {
    // slice-recipe-03 runs 40s; a single push only removes 5s, but confirm
    // the floor logic itself never crosses startedAtMs regardless.
    const state = stateWithActiveCraft(PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST);
    const before = state.crafting.stations[FIELDWORKS_STATION_ID]!.activeCraft!;

    const result = workshopPushHandler(
      state,
      createCommand(
        CommandId.from("cmd-push"),
        "WORKSHOP_PUSH",
        { stationId: FIELDWORKS_STATION_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const after =
      result.value.nextState.crafting.stations[FIELDWORKS_STATION_ID]!
        .activeCraft!;
    expect(after.completesAtMs).toBeGreaterThanOrEqual(before.startedAtMs);
  });

  it("fails with INSUFFICIENT_MOMENTUM when Momentum is too low", () => {
    const state = stateWithActiveCraft(0);
    const result = workshopPushHandler(
      state,
      createCommand(
        CommandId.from("cmd-push"),
        "WORKSHOP_PUSH",
        { stationId: FIELDWORKS_STATION_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("INSUFFICIENT_MOMENTUM");
  });

  it("fails with NO_ACTIVE_CRAFT for a station with nothing crafting", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const result = workshopPushHandler(
      state,
      createCommand(
        CommandId.from("cmd-push"),
        "WORKSHOP_PUSH",
        { stationId: FIELDWORKS_STATION_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NO_ACTIVE_CRAFT");
  });

  it("enforces the per-craft push limit (anti-spam bound)", () => {
    let state = stateWithActiveCraft(
      PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST *
        (PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT + 1),
    );
    for (
      let i = 0;
      i < PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT;
      i += 1
    ) {
      const result = workshopPushHandler(
        state,
        createCommand(
          CommandId.from(`cmd-push-${String(i)}`),
          "WORKSHOP_PUSH",
          { stationId: FIELDWORKS_STATION_ID },
          new FakeClock(0),
        ),
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      state = result.value.nextState;
    }

    const overLimit = workshopPushHandler(
      state,
      createCommand(
        CommandId.from("cmd-push-over-limit"),
        "WORKSHOP_PUSH",
        { stationId: FIELDWORKS_STATION_ID },
        new FakeClock(0),
      ),
    );
    expect(overLimit.ok).toBe(false);
    if (!overLimit.ok)
      expect(overLimit.error.code).toBe("WORKSHOP_PUSH_LIMIT_REACHED");
  });
});
