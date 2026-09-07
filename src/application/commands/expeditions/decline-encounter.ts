/**
 * Design owner: Document 15 Task 06.11 (Capture Resolution); Document 07
 * §27 Unused Aid Release.
 *
 * Declining leaves discovery status and capture protection untouched
 * (Document 07: discovery is forward-only and never regresses just
 * because the player chose not to pursue an attempt) — only the pending
 * Capture Aid reservation, if any, is released back to available
 * inventory (never consumed, since it was never used).
 */
import { type EncounterId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { releaseReservation } from "../../../domain/inventory/index.ts";
import {
  type EncounterOpportunityState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ExpeditionEvent } from "./expedition-events.ts";

export interface DeclineEncounterPayload {
  readonly encounterId: EncounterId;
}

export function createDeclineEncounterHandler(): CommandHandler<
  GameState,
  DeclineEncounterPayload,
  ExpeditionEvent
> {
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
      // A missing reservation here would mean it was already
      // consumed/released by a prior command — nothing to do, not an error.
    }

    const resolvedEncounter: EncounterOpportunityState = {
      ...encounter,
      status: "RESOLVED",
      resolution: "DECLINED",
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
      events: [{ kind: "ENCOUNTER_DECLINED", encounterId }],
    });
  };
}
