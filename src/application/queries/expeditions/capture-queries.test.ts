// @vitest-environment node
import { describe, expect, it } from "vitest";
import { EncounterId, ExpeditionId } from "../../../core/ids/index.ts";
import { toBasisPoints } from "../../../core/math/basis-points.ts";
import { toProbabilityBps } from "../../../core/math/probability.ts";
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
import {
  previewCaptureChance,
  type CaptureChanceConfig,
} from "./capture-queries.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const config: CaptureChanceConfig = {
  base: toProbabilityBps(3500),
  aidBonus: toBasisPoints(2500),
  protectionBonusPerFailure: toBasisPoints(1000),
  floor: toProbabilityBps(1000),
  ceiling: toProbabilityBps(9500),
};

const ENCOUNTER_ID = EncounterId.from("encounter-test");

function stateWithEncounter(
  overrides: Partial<EncounterOpportunityState> = {},
  captureProtectionFailures = 0,
): GameState {
  const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const encounter: EncounterOpportunityState = {
    encounterId: ENCOUNTER_ID,
    expeditionId: ExpeditionId.from("expedition-test"),
    routeId: DISCOVERY_SURVEY_ROUTE_ID,
    targetLineId: AQUARIL_LINE_ID,
    targetSpeciesId: AQUARIL_SPECIES_ID,
    discoveryBoostBonus: 0,
    status: "PENDING",
    createdAtMs: toTimestampMs(0),
    ...overrides,
  };
  return {
    ...base,
    world: {
      ...base.world,
      encounterOpportunities: { [ENCOUNTER_ID]: encounter },
      captureProtection: { [AQUARIL_LINE_ID]: captureProtectionFailures },
    },
  };
}

describe("previewCaptureChance", () => {
  it("returns null for an unknown encounter", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    expect(
      previewCaptureChance(
        state,
        EncounterId.from("no-such-encounter"),
        false,
        config,
      ),
    ).toBeNull();
  });

  it("returns the base chance with no aid, no protection, no discovery boost", () => {
    const state = stateWithEncounter();
    expect(previewCaptureChance(state, ENCOUNTER_ID, false, config)).toBe(3500);
  });

  it("adds the aid bonus only when useAid is true", () => {
    const state = stateWithEncounter();
    expect(previewCaptureChance(state, ENCOUNTER_ID, true, config)).toBe(6000);
  });

  it("factors in the line's existing capture-protection failures", () => {
    const state = stateWithEncounter({}, 2);
    expect(previewCaptureChance(state, ENCOUNTER_ID, false, config)).toBe(5500);
  });

  it("factors in the encounter's snapshotted discovery-boost bonus", () => {
    const state = stateWithEncounter({ discoveryBoostBonus: 0.1 });
    expect(previewCaptureChance(state, ENCOUNTER_ID, false, config)).toBe(4500);
  });
});
