/**
 * Design owner: Document 15 Task 03.4 (Station/Craft Commands), Task 03.5
 * (Craft Timestamp Model); 14 Technical Architecture §80-82; 04 Crafting &
 * Product System §36-38.
 *
 * Starts a craft immediately — only valid when the station has no active
 * craft (Document 04 §36: "one active craft" per slot). If the station is
 * busy, use `QUEUE_CRAFT` instead. A pure function of `(state, command)`:
 * "now" comes from `command.issuedAtMs` (Task 01.9's envelope, itself
 * stamped from a `Clock`), and the quality-roll seed is derived
 * deterministically from `state.meta.rootRandomSeed` +
 * `state.meta.randomEventCounter` (Document 14 §128-130) rather than
 * needing an injected `RandomSource` — no gameplay in this Phase actually
 * rolls quality yet (deferred, Document 04 §68: "exact formula is
 * deferred"), but the timestamp model (Task 03.5) still snapshots a real
 * seed for whichever later task adds the roll.
 */
import {
  ReservationId,
  type RecipeId,
  type StationId,
} from "../../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../../core/time/time-math.ts";
import { toDurationMs } from "../../../core/math/duration.ts";
import { roundToInteger } from "../../../core/math/integer.ts";
import {
  deriveSubSeed,
  nextRandomEventCounter,
} from "../../../core/random/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type StationArchetype } from "../../../domain/crafting/index.ts";
import { type MagnitudeTable } from "../../../domain/catchmons/index.ts";
import { reserveInventory } from "../../../domain/inventory/index.ts";
import { getWorkshopCraftSpeedEffect } from "../../queries/catchmons/index.ts";
import {
  type CraftActivitySnapshot,
  type GameState,
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

export interface StartCraftPayload {
  readonly stationId: StationId;
  readonly recipeId: RecipeId;
}

export function createStartCraftHandler(
  catalog: GameCatalog,
  stationArchetypes: Readonly<Record<StationId, StationArchetype>>,
  catchmonCapabilityMagnitudes: MagnitudeTable = {},
): CommandHandler<GameState, StartCraftPayload, CraftEvent> {
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

    if (station.activeCraft) {
      return err({
        code: "STATION_BUSY",
        message: `Station "${stationId}" already has an active craft — use QUEUE_CRAFT instead`,
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

    const qualityRollSeed = deriveSubSeed(
      state.meta.rootRandomSeed,
      state.meta.randomEventCounter,
      `START_CRAFT:${command.commandId}`,
    );
    const startedAtMs = command.issuedAtMs;
    const baseDurationMs = toDurationMs(recipe.craftDuration);

    // Document 15 Task 05.6 / Document 06 §14 Station Specialist: an
    // eligible Workshop Catchmon currently supporting this exact station
    // derives a shorter duration for THIS craft instance only — the
    // recipe's own `craftDuration` (read above) is never mutated. Effect
    // is snapshotted now (Document 06 §52 / Document 14 §96): reassigning
    // the Catchmon later does not retroactively change this craft.
    const workshopEffect = getWorkshopCraftSpeedEffect(
      state,
      catalog,
      stationId,
      catchmonCapabilityMagnitudes,
    );
    const durationMs = workshopEffect
      ? toDurationMs(
          roundToInteger(baseDurationMs * workshopEffect.durationMultiplier),
        )
      : baseDurationMs;
    const completesAtMs = addDurationToTimestamp(startedAtMs, durationMs);

    const activeCraft: CraftActivitySnapshot = {
      recipeId,
      startedAtMs,
      completesAtMs,
      durationMs,
      qualityRollSeed,
      reservationId,
      ...(workshopEffect
        ? {
            supportEffectSnapshot: {
              capabilityId: workshopEffect.capabilityId,
              durationMultiplier: workshopEffect.durationMultiplier,
              baseDurationMs,
            },
          }
        : {}),
    };
    const nextStation: StationState = { ...station, activeCraft };

    const nextState: GameState = {
      ...state,
      meta: {
        ...state.meta,
        randomEventCounter: nextRandomEventCounter(
          state.meta.randomEventCounter,
        ),
      },
      inventory: reserved.value,
      crafting: {
        stations: { ...state.crafting.stations, [stationId]: nextStation },
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "CRAFT_STARTED",
          stationId,
          recipeId,
          reservationId,
          startedAtMs,
          completesAtMs,
        },
      ],
    });
  };
}
