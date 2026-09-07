/**
 * Design owner: Document 15 Task 03.4; 04 Crafting & Product System §36
 * Craft Queue Model, §37 Material Reservation, §39 Queue Reordering (not
 * implemented here — reordering is not part of this task's scope).
 *
 * Appends a craft to a station's bounded queue (Document 04 §36: "one
 * active craft, a limited number of queued crafts behind it"). Materials
 * are reserved immediately on queueing, not when the craft later becomes
 * active (Document 04 §37: "when a craft is placed into a queue, its
 * required materials are reserved" — this is exactly what prevents a
 * queued plan from silently becoming invalid).
 */
import {
  ReservationId,
  type RecipeId,
  type StationId,
} from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type StationArchetype } from "../../../domain/crafting/index.ts";
import { reserveInventory } from "../../../domain/inventory/index.ts";
import {
  type GameState,
  type QueuedCraftSnapshot,
  type StationState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type CraftEvent } from "./craft-events.ts";
import {
  getOrInitStation,
  inventoryErrorToCommandError,
  resolveRecipeInputItems,
  validateStationCapability,
} from "./craft-helpers.ts";

export interface QueueCraftPayload {
  readonly stationId: StationId;
  readonly recipeId: RecipeId;
}

export function createQueueCraftHandler(
  catalog: GameCatalog,
  stationArchetypes: Readonly<Record<StationId, StationArchetype>>,
  maxQueueSize: number,
): CommandHandler<GameState, QueueCraftPayload, CraftEvent> {
  return (state, command) => {
    const { stationId, recipeId } = command.payload;

    const recipe = catalog.recipes.get(recipeId);
    if (!recipe) {
      return err({
        code: "RECIPE_NOT_FOUND",
        message: `No recipe "${recipeId}" in the catalog`,
      });
    }

    const archetype = stationArchetypes[stationId];
    if (!archetype) {
      return err({
        code: "STATION_NOT_RECOGNIZED",
        message: `Station "${stationId}" is not a recognized station`,
      });
    }

    const station = getOrInitStation(
      state.crafting.stations,
      stationId,
      archetype,
    );

    const capability = validateStationCapability(recipe, station);
    if (!capability.ok) {
      return capability;
    }

    if (station.queuedCrafts.length >= maxQueueSize) {
      return err({
        code: "QUEUE_FULL",
        message: `Station "${stationId}" queue is full (max ${String(maxQueueSize)})`,
      });
    }

    const reservationId = ReservationId.from(`craft-${command.commandId}`);
    const items = resolveRecipeInputItems(recipe, catalog);
    const reserved = reserveInventory(
      state.inventory,
      reservationId,
      "CRAFT_QUEUE",
      stationId,
      items,
      command.issuedAtMs,
    );
    if (!reserved.ok) {
      return err(inventoryErrorToCommandError(reserved.error));
    }

    const queuedCraft: QueuedCraftSnapshot = {
      craftId: reservationId,
      recipeId,
      reservationId,
      queuedAtMs: command.issuedAtMs,
    };
    const nextStation: StationState = {
      ...station,
      queuedCrafts: [...station.queuedCrafts, queuedCraft],
    };

    const nextState: GameState = {
      ...state,
      inventory: reserved.value,
      crafting: {
        stations: { ...state.crafting.stations, [stationId]: nextStation },
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "CRAFT_QUEUED",
          stationId,
          recipeId,
          craftId: queuedCraft.craftId,
          queuedAtMs: command.issuedAtMs,
        },
      ],
    });
  };
}
