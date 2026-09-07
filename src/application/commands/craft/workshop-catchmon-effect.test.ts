// @vitest-environment node
//
// Design owner: Document 15 Task 05.6 (Workshop Catchmon Effect).
// Acceptance: "same recipe produces different derived duration/
// opportunity when eligible Catchmon is assigned, base recipe definition
// remains unchanged."
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
} from "../../../domain/game-state/index.ts";
import { addToInventory } from "../../../domain/inventory/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  FLAMAROX_CAPABILITY_ID,
  FLAMAROX_SPECIES_ID,
  PLAYABLE_STATION_IDS,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_RECIPE_01_ID,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createAssignCatchmonHandler } from "../catchmons/assign-catchmon.ts";
import { createStartCraftHandler } from "./start-craft.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID) throw new Error("expected a provision station id");

const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
);
const assignCatchmon = createAssignCatchmonHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
);

function stockedState() {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID)!;
  const resource = catalog.resources.get(recipe.routineInputs[0]!.resourceId)!;
  return {
    ...state,
    inventory: addToInventory(state.inventory, resource.itemId, 20),
  };
}

describe("Workshop Catchmon Effect (Task 05.6)", () => {
  it("produces a shorter derived duration for the same recipe when an eligible Catchmon is assigned, without changing the recipe definition", () => {
    const recipeBefore = catalog.recipes.get(SLICE_RECIPE_01_ID)!;

    const withoutCatchmon = startCraft(
      stockedState(),
      createCommand(
        CommandId.from("cmd-start-plain"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    if (!withoutCatchmon.ok) throw new Error("expected plain craft to start");
    const plainDurationMs =
      withoutCatchmon.value.nextState.crafting.stations[PROVISION_STATION_ID]!
        .activeCraft!.durationMs;

    const flamaroxOwnedId = deriveInitialOwnedCatchmonId(FLAMAROX_SPECIES_ID);
    const assigned = assignCatchmon(
      stockedState(),
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: flamaroxOwnedId,
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok)
      throw new Error("expected Flamarox assignment to succeed");

    const withCatchmon = startCraft(
      assigned.value.nextState,
      createCommand(
        CommandId.from("cmd-start-supported"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    if (!withCatchmon.ok) throw new Error("expected supported craft to start");
    const activeCraft =
      withCatchmon.value.nextState.crafting.stations[PROVISION_STATION_ID]!
        .activeCraft!;

    expect(activeCraft.durationMs).toBeLessThan(plainDurationMs);
    expect(activeCraft.supportEffectSnapshot).toEqual({
      capabilityId: FLAMAROX_CAPABILITY_ID,
      durationMultiplier:
        1 -
        PROVISIONAL_CAPABILITY_MAGNITUDES[
          "slice-craft-speed-provision-station"
        ]!,
      baseDurationMs: plainDurationMs,
    });

    // Base recipe definition is untouched.
    expect(catalog.recipes.get(SLICE_RECIPE_01_ID)).toEqual(recipeBefore);
  });

  it("applies no effect (identical duration) when no eligible Catchmon is assigned to the station", () => {
    const result = startCraft(
      stockedState(),
      createCommand(
        CommandId.from("cmd-start"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    if (!result.ok) throw new Error("expected craft to start");
    const activeCraft =
      result.value.nextState.crafting.stations[PROVISION_STATION_ID]!
        .activeCraft!;
    expect(activeCraft.supportEffectSnapshot).toBeUndefined();
  });
});
