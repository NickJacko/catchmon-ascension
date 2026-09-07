// @vitest-environment node
//
// Design owner: Document 15 Task 03.5 (Craft Timestamp Model); 14
// Technical Architecture §81-82 ("Crafting time is not a countdown
// variable... store timestamps, compute remaining = completeAt - now").
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import { createInitialGameState } from "../../../domain/game-state/index.ts";
import { addToInventory } from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PLAYABLE_STATION_IDS,
  SLICE_RECIPE_01_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createStartCraftHandler } from "./start-craft.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID) throw new Error("expected a playable station id");

const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
);

function stockedState() {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID);
  if (!recipe) throw new Error("missing recipe");
  const resource = catalog.resources.get(recipe.routineInputs[0]!.resourceId);
  if (!resource) throw new Error("missing resource");
  return {
    ...state,
    inventory: addToInventory(state.inventory, resource.itemId, 5),
  };
}

describe("CraftActivitySnapshot (Craft Timestamp Model)", () => {
  it("has no countdown/remaining-seconds field — only absolute timestamps and a snapshotted duration", () => {
    const result = startCraft(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(5000),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const snapshot =
      result.value.nextState.crafting.stations[PROVISION_STATION_ID]
        ?.activeCraft;
    expect(snapshot).toBeDefined();
    if (!snapshot) return;

    const keys = Object.keys(snapshot);
    expect(keys).not.toContain("remainingMs");
    expect(keys).not.toContain("remainingSeconds");
    expect(keys).toEqual(
      expect.arrayContaining([
        "recipeId",
        "startedAtMs",
        "completesAtMs",
        "durationMs",
        "qualityRollSeed",
        "reservationId",
      ]),
    );
  });

  it("completesAtMs always equals startedAtMs + durationMs (no drift, no separate stored countdown)", () => {
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID);
    if (!recipe) throw new Error("missing recipe");

    const result = startCraft(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(2000),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const snapshot =
      result.value.nextState.crafting.stations[PROVISION_STATION_ID]
        ?.activeCraft;
    expect(snapshot?.durationMs).toBe(recipe.craftDuration);
    expect(snapshot?.completesAtMs).toBe(2000 + recipe.craftDuration);
    expect(snapshot?.completesAtMs).toBe(
      (snapshot?.startedAtMs ?? 0) + (snapshot?.durationMs ?? 0),
    );
  });

  it("remaining time is always computed from timestamps at read time, never stored/decremented", () => {
    const result = startCraft(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(1000),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const snapshot =
      result.value.nextState.crafting.stations[PROVISION_STATION_ID]
        ?.activeCraft;
    if (!snapshot) throw new Error("expected an active craft");

    // "remaining" is derived, not read from a field — Document 14 §82.
    const remainingAtStart = snapshot.completesAtMs - 1000;
    const remainingLater = snapshot.completesAtMs - 3000;
    expect(remainingAtStart).toBe(snapshot.durationMs);
    expect(remainingLater).toBe(snapshot.durationMs - 2000);
  });

  it("supportEffectSnapshot is a placeholder, absent in Phase 3 (no Catchmon support-effect system exists yet)", () => {
    const result = startCraft(
      stockedState(),
      createCommand(
        CommandId.from("cmd-1"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const snapshot =
      result.value.nextState.crafting.stations[PROVISION_STATION_ID]
        ?.activeCraft;
    expect(snapshot?.supportEffectSnapshot).toBeUndefined();
  });
});
