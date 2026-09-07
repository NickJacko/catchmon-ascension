/**
 * Design owner: Document 15 Task 06.10 (Capture Aid Reservation /
 * Consumption), Task 06.11 (Capture Resolution); Document 07 §26-27
 * Capture Aid, §63 Standard Acquisition Unit, §82-83 Capture Protection,
 * §89 already-owned path.
 *
 * Atomic: validates the encounter is pending and its target not already
 * owned, consumes the Capture Aid reservation if the player chooses to use
 * it (Task 06.10: an aid is consumed once *used*, regardless of whether
 * the attempt then succeeds — Document 07 §26), rolls a fresh deterministic
 * random event (this is a live player action, not a value fixed at
 * expedition start — unlike the encounter's target species, a capture
 * attempt's own timing is a genuinely new random event, so it derives from
 * `state.meta.randomEventCounter` and bumps it once, exactly like
 * `start-craft.ts`'s quality roll), and resolves the encounter exactly
 * once (Document 15 Task 06.11 "no duplicate worker"). A failed attempt
 * still preserves meaningful progress: `captureProtection[lineId]`
 * increments (never resets to 0 on failure — CLAUDE.md's user constraint
 * "do not create harsh full-reset RNG"), and stays available to the next
 * encounter created for the same line.
 */
import { EncounterId, OwnedCatchmonId } from "../../../core/ids/index.ts";
import {
  createRandomSource,
  deriveSubSeed,
  nextRandomEventCounter,
  rollSucceeds,
} from "../../../core/random/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { applyRankProgress } from "../../../domain/progression/index.ts";
import { advanceDiscoveryStatus } from "../../../domain/world/index.ts";
import {
  consumeReservation,
  releaseReservation,
} from "../../../domain/inventory/index.ts";
import {
  type EncounterOpportunityState,
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import {
  previewCaptureChance,
  type CaptureChanceConfig,
} from "../../queries/expeditions/capture-queries.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ExpeditionEvent } from "./expedition-events.ts";

export interface AttemptCapturePayload {
  readonly encounterId: EncounterId;
  readonly useAid: boolean;
}

/** Document 15 Task 07.1: Collection ("first capture of a new line") is one of Document 09 §7's five Shop Rank source classes — a successful capture is naturally exactly-once per line (the target line becomes OWNED), so no separate "first-time" tracking is needed here. Defaults to a no-op for callers that don't configure it. */
export interface CaptureRankProgressConfig {
  readonly progressPerCapture: number;
  readonly progressPerRank: number;
  readonly rankCap: number;
}

const NO_RANK_PROGRESS: CaptureRankProgressConfig = {
  progressPerCapture: 0,
  progressPerRank: 1,
  rankCap: 1,
};

export function createAttemptCaptureHandler(
  catalog: GameCatalog,
  captureChanceConfig: CaptureChanceConfig,
  rankProgressConfig: CaptureRankProgressConfig = NO_RANK_PROGRESS,
): CommandHandler<GameState, AttemptCapturePayload, ExpeditionEvent> {
  return (state, command) => {
    const { encounterId, useAid } = command.payload;

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
    if (state.world.discoveryStates[encounter.targetLineId] === "OWNED") {
      return err({
        code: "TARGET_ALREADY_OWNED",
        message: `Line "${encounter.targetLineId}" is already owned — use OBSERVE_ENCOUNTER instead`,
      });
    }

    const expedition = state.expeditions.expeditions[encounter.expeditionId];
    if (useAid && !expedition?.loadoutReservationId) {
      return err({
        code: "NO_CAPTURE_AID_RESERVED",
        message: `No Capture Aid was reserved for expedition "${encounter.expeditionId}"`,
      });
    }

    let inventory = state.inventory;
    if (useAid && expedition?.loadoutReservationId) {
      const consumed = consumeReservation(
        inventory,
        expedition.loadoutReservationId,
      );
      if (!consumed.ok) {
        return err({
          code: consumed.error.code,
          message: JSON.stringify(consumed.error),
        });
      }
      inventory = consumed.value;
    } else if (expedition?.loadoutReservationId) {
      // Document 07 §27 "unused aid released": the encounter resolves
      // (terminally) below regardless of outcome, so a reserved-but-
      // unused aid must be released now — otherwise it would strand that
      // unit of inventory forever, since no future command ever revisits
      // this already-resolved encounter.
      const released = releaseReservation(
        inventory,
        expedition.loadoutReservationId,
      );
      if (released.ok) {
        inventory = released.value;
      }
    }

    const chance = previewCaptureChance(
      state,
      encounterId,
      useAid,
      captureChanceConfig,
    );
    // Unreachable: `encounter` was already confirmed to exist above.
    if (chance === null) {
      return err({
        code: "ENCOUNTER_NOT_FOUND",
        message: `No Encounter Opportunity "${encounterId}"`,
      });
    }

    const rollSeed = deriveSubSeed(
      state.meta.rootRandomSeed,
      state.meta.randomEventCounter,
      `ATTEMPT_CAPTURE:${command.commandId}`,
    );
    const succeeded = rollSucceeds(createRandomSource(rollSeed), chance);

    let nextOwnedCatchmons = state.catchmons.ownedCatchmons;
    let nextOwnedCatchmonIds = state.catchmons.ownedCatchmonIds;
    let nextDiscoveryStates = state.world.discoveryStates;
    let nextCaptureProtection = state.world.captureProtection;
    let nextProgression = state.progression;
    let newOwnedCatchmonId: OwnedCatchmonId | undefined;

    if (succeeded) {
      const species = catalog.catchmonSpecies.get(encounter.targetSpeciesId);
      if (!species) {
        return err({
          code: "SPECIES_NOT_FOUND",
          message: `Unknown target species "${encounter.targetSpeciesId}"`,
        });
      }
      const advanced = advanceDiscoveryStatus(
        state.world.discoveryStates[encounter.targetLineId] ?? "UNKNOWN",
        "OWNED",
      );
      if (!advanced.ok) {
        return err({
          code: "ILLEGAL_DISCOVERY_TRANSITION",
          message: `Cannot advance line "${encounter.targetLineId}" to OWNED: ${advanced.error}`,
        });
      }
      nextDiscoveryStates = {
        ...nextDiscoveryStates,
        [encounter.targetLineId]: advanced.value,
      };
      nextCaptureProtection = {
        ...nextCaptureProtection,
        [encounter.targetLineId]: 0,
      };
      newOwnedCatchmonId = OwnedCatchmonId.from(
        `owned-captured-${command.commandId}`,
      );
      const newOwned: OwnedCatchmonState = {
        ownedCatchmonId: newOwnedCatchmonId,
        lineId: species.catchmonLineId,
        currentSpeciesId: species.catchmonSpeciesId,
        level: 1,
        xp: 0,
        evolutionReadiness:
          species.evolvesToSpeciesId === undefined ? "EVOLVED" : "NOT_READY",
        currentAssignment: { kind: "UNASSIGNED" },
      };
      nextOwnedCatchmons = {
        ...nextOwnedCatchmons,
        [newOwnedCatchmonId]: newOwned,
      };
      nextOwnedCatchmonIds = [...nextOwnedCatchmonIds, newOwnedCatchmonId];
      nextProgression = applyRankProgress(
        nextProgression,
        rankProgressConfig.progressPerCapture,
        rankProgressConfig.progressPerRank,
        rankProgressConfig.rankCap,
      );
    } else {
      nextCaptureProtection = {
        ...nextCaptureProtection,
        [encounter.targetLineId]:
          (nextCaptureProtection[encounter.targetLineId] ?? 0) + 1,
      };
    }

    const resolvedEncounter: EncounterOpportunityState = {
      ...encounter,
      status: "RESOLVED",
      resolution: succeeded ? "CAPTURED" : "FAILED",
      captureAidUsed: useAid,
      resolvedAtMs: command.issuedAtMs,
    };

    const nextState: GameState = {
      ...state,
      meta: {
        ...state.meta,
        randomEventCounter: nextRandomEventCounter(
          state.meta.randomEventCounter,
        ),
      },
      inventory,
      progression: nextProgression,
      catchmons: {
        ownedCatchmonIds: nextOwnedCatchmonIds,
        ownedCatchmons: nextOwnedCatchmons,
      },
      world: {
        ...state.world,
        discoveryStates: nextDiscoveryStates,
        captureProtection: nextCaptureProtection,
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
          kind: "CAPTURE_ATTEMPTED",
          encounterId,
          succeeded,
          targetSpeciesId: encounter.targetSpeciesId,
          ...(newOwnedCatchmonId ? { newOwnedCatchmonId } : {}),
        },
      ],
    });
  };
}
