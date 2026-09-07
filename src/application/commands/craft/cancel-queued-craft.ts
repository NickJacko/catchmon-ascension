/**
 * Design owner: Document 15 Task 03.4; 04 Crafting & Product System §38
 * Cancellation Rule ("reserved/material inputs are returned... no
 * additional punishment is applied").
 *
 * Only cancels a *queued* (not yet active) craft — cancelling the active
 * craft is a different concern (mid-production cancellation, snapshot
 * rollback) not requested by this task. No catalog/context dependency:
 * cancelling only needs to find the queued entry and release its
 * reservation, so this handler is exported directly rather than through a
 * factory.
 */
import { type StationId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { releaseReservation } from "../../../domain/inventory/index.ts";
import {
  type GameState,
  type StationState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type CraftEvent } from "./craft-events.ts";
import { inventoryErrorToCommandError } from "./craft-helpers.ts";

export interface CancelQueuedCraftPayload {
  readonly stationId: StationId;
  readonly craftId: string;
}

export const cancelQueuedCraftHandler: CommandHandler<
  GameState,
  CancelQueuedCraftPayload,
  CraftEvent
> = (state, command) => {
  const { stationId, craftId } = command.payload;

  const station = state.crafting.stations[stationId];
  if (!station) {
    return err({
      code: "STATION_NOT_FOUND",
      message: `No station "${stationId}"`,
    });
  }

  const target = station.queuedCrafts.find(
    (craft) => craft.craftId === craftId,
  );
  if (!target) {
    return err({
      code: "QUEUED_CRAFT_NOT_FOUND",
      message: `No queued craft "${craftId}" at station "${stationId}"`,
    });
  }

  const released = releaseReservation(state.inventory, target.reservationId);
  if (!released.ok) {
    return err(inventoryErrorToCommandError(released.error));
  }

  const nextStation: StationState = {
    ...station,
    queuedCrafts: station.queuedCrafts.filter(
      (craft) => craft.craftId !== craftId,
    ),
  };

  const nextState: GameState = {
    ...state,
    inventory: released.value,
    crafting: {
      stations: { ...state.crafting.stations, [stationId]: nextStation },
    },
  };

  return ok({
    nextState,
    events: [{ kind: "CRAFT_QUEUE_CANCELLED", stationId, craftId }],
  });
};
