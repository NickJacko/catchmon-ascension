/**
 * Design owner: Document 15 Task 06.11 (Capture Resolution); Document 07
 * §89 already-owned encounter path — "deterministic small reward, no
 * capture roll, no duplicate owned instance."
 *
 * The counterpart to `ATTEMPT_CAPTURE` for a target whose line is already
 * `OWNED`: no random roll, no new `OwnedCatchmonState` (Document 07 §89 /
 * CLAUDE.md's user constraint "already-owned encounters must not create
 * duplicate functional Catchmons"). Any reserved Capture Aid is released
 * unused — observing never needed it.
 */
import { type EncounterId, type ItemId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import {
  addToInventory,
  releaseReservation,
} from "../../../domain/inventory/index.ts";
import {
  type EncounterOpportunityState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ExpeditionEvent } from "./expedition-events.ts";

export interface ObserveEncounterPayload {
  readonly encounterId: EncounterId;
}

export function createObserveEncounterHandler(
  observeRewardItemId: ItemId,
  observeRewardQuantity: number,
): CommandHandler<GameState, ObserveEncounterPayload, ExpeditionEvent> {
  return (state, command) => {
    const { encounterId } = command.payload;
    const encounter = state.world.encounterOpportunities[encounterId];
    if (!encounter) {
      return err({
        code: "ENCOUNTER_NOT_FOUND",
        message: `No Encounter Opportunity "${encounterId}"`,
      });
    }
    if (encounter.status !== "PENDING") {
      return err({
        code: "ENCOUNTER_ALREADY_RESOLVED",
        message: `Encounter "${encounterId}" is already resolved (${encounter.resolution ?? "unknown"})`,
      });
    }
    if (state.world.discoveryStates[encounter.targetLineId] !== "OWNED") {
      return err({
        code: "TARGET_NOT_OWNED",
        message: `Line "${encounter.targetLineId}" is not yet owned — use ATTEMPT_CAPTURE or DECLINE_ENCOUNTER instead`,
      });
    }

    let inventory = state.inventory;
    const expedition = state.expeditions.expeditions[encounter.expeditionId];
    if (expedition?.loadoutReservationId) {
      const released = releaseReservation(
        inventory,
        expedition.loadoutReservationId,
      );
      if (released.ok) {
        inventory = released.value;
      }
    }
    inventory = addToInventory(
      inventory,
      observeRewardItemId,
      observeRewardQuantity,
    );

    const resolvedEncounter: EncounterOpportunityState = {
      ...encounter,
      status: "RESOLVED",
      resolution: "OBSERVED",
      resolvedAtMs: command.issuedAtMs,
    };

    const nextState: GameState = {
      ...state,
      inventory,
      world: {
        ...state.world,
        encounterOpportunities: {
          ...state.world.encounterOpportunities,
          [encounterId]: resolvedEncounter,
        },
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "ENCOUNTER_OBSERVED",
          encounterId,
          targetSpeciesId: encounter.targetSpeciesId,
        },
      ],
    });
  };
}
