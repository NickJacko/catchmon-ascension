/**
 * Design owner: 14 Technical Architecture §72-84 Inventory/Crafting
 * Architecture; 04 Crafting & Product System §36-38 Craft Queue Model /
 * Material Reservation / Cancellation Rule.
 *
 * Shared, pure helpers used by every craft command handler — kept out of
 * each command file so "resolve a recipe's inputs to reservable ItemIds"
 * and "lazily initialize a station" are each defined exactly once.
 */
import { type StationId } from "../../../core/ids/index.ts";
import { invariant } from "../../../core/assertions/invariant.ts";
import { err, ok, type Result } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import {
  type RecipeDefinition,
  type StationArchetype,
} from "../../../domain/crafting/index.ts";
import {
  type InventoryError,
  type ReservationItemInput,
} from "../../../domain/inventory/index.ts";
import { type StationState } from "../../../domain/game-state/index.ts";
import { type CommandError } from "../../engine/index.ts";

/**
 * Resolves each recipe input line's `ResourceId`/`ComponentId` to the
 * `ItemId` the inventory ledger actually tracks, carrying over its
 * explicit `quantity` (Phase 3 schema cleanup: `RecipeDefinition`'s
 * `routineInputs`/`specialInputs` are `{ resourceId/componentId, quantity
 * }` lines, not bare ID arrays). The resource/component itself is always
 * present once `recipe` came from a catalog built by `createGameCatalog`
 * (it fails fast on a dangling reference), so a missing lookup here is a
 * programming error, not a gameplay one.
 */
export function resolveRecipeInputItems(
  recipe: RecipeDefinition,
  catalog: GameCatalog,
): readonly ReservationItemInput[] {
  const routineItems = recipe.routineInputs.map((input) => {
    const resource = catalog.resources.get(input.resourceId);
    invariant(
      resource !== undefined,
      `Recipe "${recipe.recipeId}" references unknown resource "${input.resourceId}" — should have been caught by createGameCatalog`,
    );
    return { itemId: resource.itemId, quantity: input.quantity };
  });
  const specialItems = recipe.specialInputs.map((input) => {
    const component = catalog.components.get(input.componentId);
    invariant(
      component !== undefined,
      `Recipe "${recipe.recipeId}" references unknown component "${input.componentId}" — should have been caught by createGameCatalog`,
    );
    return { itemId: component.itemId, quantity: input.quantity };
  });
  return [...routineItems, ...specialItems];
}

/** Returns the station's current state, or a fresh empty one at `archetype` if it has never been touched before. */
export function getOrInitStation(
  stations: Readonly<Record<StationId, StationState>>,
  stationId: StationId,
  archetype: StationArchetype,
): StationState {
  return (
    stations[stationId] ?? {
      stationId,
      archetype,
      queuedCrafts: [],
      supportCatchmonIds: [],
    }
  );
}

/** Flattens the inventory ledger's typed error union into the engine's generic `CommandError` shape. */
export function inventoryErrorToCommandError(
  error: InventoryError,
): CommandError {
  return { code: error.code, message: JSON.stringify(error) };
}

/** Document 15 Task 03.4: "station capability validated." */
export function validateStationCapability(
  recipe: RecipeDefinition,
  station: StationState,
): Result<true, CommandError> {
  if (recipe.stationType !== station.archetype) {
    return err({
      code: "STATION_CAPABILITY_MISMATCH",
      message: `Recipe "${recipe.recipeId}" requires a ${recipe.stationType}, but station "${station.stationId}" is a ${station.archetype}`,
    });
  }
  return ok(true);
}
