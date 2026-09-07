// @vitest-environment node
import { describe, expect, it } from "vitest";
import { EncounterId, ExpeditionId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { toTimestampMs } from "../../../core/time/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type EncounterOpportunityState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  AQUARIL_LINE_ID,
  AQUARIL_SPECIES_ID,
  DISCOVERY_SURVEY_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { getFailedCaptureRecovery } from "./failed-capture-recovery-query.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const ENCOUNTER_ID = EncounterId.from("encounter-failed-test");

function stateWithResolvedEncounter(
  overrides: Partial<EncounterOpportunityState>,
  captureProtectionFailures: number,
  discoveryStatus:
    "UNKNOWN" | "TRACED" | "ENCOUNTERED" | "OWNED" = "ENCOUNTERED",
): GameState {
  const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const encounter: EncounterOpportunityState = {
    encounterId: ENCOUNTER_ID,
    expeditionId: ExpeditionId.from("expedition-test"),
    routeId: DISCOVERY_SURVEY_ROUTE_ID,
    targetLineId: AQUARIL_LINE_ID,
    targetSpeciesId: AQUARIL_SPECIES_ID,
    discoveryBoostBonus: 0,
    status: "RESOLVED",
    resolution: "FAILED",
    createdAtMs: toTimestampMs(0),
    resolvedAtMs: toTimestampMs(1000),
    ...overrides,
  };
  return {
    ...base,
    world: {
      ...base.world,
      encounterOpportunities: { [ENCOUNTER_ID]: encounter },
      captureProtection: { [AQUARIL_LINE_ID]: captureProtectionFailures },
      discoveryStates: {
        ...base.world.discoveryStates,
        [AQUARIL_LINE_ID]: discoveryStatus,
      },
    },
  };
}

describe("getFailedCaptureRecovery", () => {
  it("returns null for an unknown encounter", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    expect(
      getFailedCaptureRecovery(state, EncounterId.from("no-such")),
    ).toBeNull();
  });

  it("returns null for a still-pending encounter", () => {
    const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const pendingEncounter: EncounterOpportunityState = {
      encounterId: ENCOUNTER_ID,
      expeditionId: ExpeditionId.from("expedition-test"),
      routeId: DISCOVERY_SURVEY_ROUTE_ID,
      targetLineId: AQUARIL_LINE_ID,
      targetSpeciesId: AQUARIL_SPECIES_ID,
      discoveryBoostBonus: 0,
      status: "PENDING",
      createdAtMs: toTimestampMs(0),
    };
    const state: GameState = {
      ...base,
      world: {
        ...base.world,
        encounterOpportunities: { [ENCOUNTER_ID]: pendingEncounter },
      },
    };
    expect(getFailedCaptureRecovery(state, ENCOUNTER_ID)).toBeNull();
  });

  it("returns null for a resolved encounter that was not a failure", () => {
    const state = stateWithResolvedEncounter({ resolution: "CAPTURED" }, 0);
    expect(getFailedCaptureRecovery(state, ENCOUNTER_ID)).toBeNull();
  });

  it("reports the retained discovery status, consecutive failures, and that pursuit is always possible again", () => {
    const state = stateWithResolvedEncounter(
      { captureAidUsed: false },
      2,
      "ENCOUNTERED",
    );
    const recovery = getFailedCaptureRecovery(state, ENCOUNTER_ID);
    expect(recovery).not.toBeNull();
    expect(recovery!.retainedDiscoveryStatus).toBe("ENCOUNTERED");
    expect(recovery!.consecutiveFailures).toBe(2);
    expect(recovery!.captureAidConsumed).toBe(false);
    expect(recovery!.canPursueAgain).toBe(true);
  });

  it("reports whether the Capture Aid was consumed for this attempt", () => {
    const state = stateWithResolvedEncounter({ captureAidUsed: true }, 1);
    expect(
      getFailedCaptureRecovery(state, ENCOUNTER_ID)!.captureAidConsumed,
    ).toBe(true);
  });
});
