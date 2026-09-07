// @vitest-environment node
//
// Design owner: Document 15 Task 05.9 (Evolution Shell). Tested entirely
// against a synthetic two-stage fixture — none of the 6 real slice
// Catchmons has real evolution data (see module doc).
import { describe, expect, it } from "vitest";
import {
  AssetId,
  CapabilityId,
  CatchmonLineId,
  CatchmonSpeciesId,
  OwnedCatchmonId,
} from "../../core/ids/index.ts";
import { type CatchmonSpeciesDefinition } from "./types.ts";
import {
  checkEvolutionRequirement,
  computeEvolutionReadiness,
} from "./evolution.ts";
import { type OwnedCatchmonState } from "../game-state/index.ts";

const LEVEL_REQUIREMENT = 5;
const LINE_ID = CatchmonLineId.from("fixture-line");
const BASE_SPECIES_ID = CatchmonSpeciesId.from("fixture-species-base");
const EVOLVED_SPECIES_ID = CatchmonSpeciesId.from("fixture-species-evolved");

const baseSpecies: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: BASE_SPECIES_ID,
  catchmonLineId: LINE_ID,
  displayName: "Fixture Species (Base)",
  stageIndex: 0,
  capabilityIds: [CapabilityId.from("fixture-capability")],
  evolvesToSpeciesId: EVOLVED_SPECIES_ID,
  portraitAssetId: AssetId.from("fixture-portrait-base"),
};

const evolvedSpecies: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: EVOLVED_SPECIES_ID,
  catchmonLineId: LINE_ID,
  displayName: "Fixture Species (Evolved)",
  stageIndex: 1,
  capabilityIds: [CapabilityId.from("fixture-capability")],
  portraitAssetId: AssetId.from("fixture-portrait-evolved"),
};

function fixtureOwned(level: number): OwnedCatchmonState {
  return {
    ownedCatchmonId: OwnedCatchmonId.from("fixture-owned"),
    lineId: LINE_ID,
    currentSpeciesId: BASE_SPECIES_ID,
    level,
    xp: 0,
    evolutionReadiness: "NOT_READY",
    currentAssignment: { kind: "UNASSIGNED" },
  };
}

describe("checkEvolutionRequirement", () => {
  it("fails with LEVEL_REQUIREMENT_NOT_MET below the level threshold", () => {
    const result = checkEvolutionRequirement(
      fixtureOwned(1),
      baseSpecies,
      LEVEL_REQUIREMENT,
    );
    expect(result).toEqual({ ok: false, error: "LEVEL_REQUIREMENT_NOT_MET" });
  });

  it("succeeds at or above the level threshold", () => {
    const result = checkEvolutionRequirement(
      fixtureOwned(LEVEL_REQUIREMENT),
      baseSpecies,
      LEVEL_REQUIREMENT,
    );
    expect(result).toEqual({ ok: true, value: true });
  });

  it("fails with NO_EVOLUTION_TARGET for a terminal (single-stage) species", () => {
    const result = checkEvolutionRequirement(
      fixtureOwned(99),
      evolvedSpecies,
      LEVEL_REQUIREMENT,
    );
    expect(result).toEqual({ ok: false, error: "NO_EVOLUTION_TARGET" });
  });

  it("fails with SPECIES_NOT_FOUND when the species is undefined", () => {
    const result = checkEvolutionRequirement(
      fixtureOwned(99),
      undefined,
      LEVEL_REQUIREMENT,
    );
    expect(result).toEqual({ ok: false, error: "SPECIES_NOT_FOUND" });
  });
});

describe("computeEvolutionReadiness", () => {
  it("is EVOLVED for a terminal-stage species regardless of level", () => {
    expect(
      computeEvolutionReadiness(evolvedSpecies, 1, LEVEL_REQUIREMENT),
    ).toBe("EVOLVED");
  });

  it("is NOT_READY below the level threshold on an evolvable species", () => {
    expect(computeEvolutionReadiness(baseSpecies, 1, LEVEL_REQUIREMENT)).toBe(
      "NOT_READY",
    );
  });

  it("is READY at or above the level threshold on an evolvable species", () => {
    expect(
      computeEvolutionReadiness(
        baseSpecies,
        LEVEL_REQUIREMENT,
        LEVEL_REQUIREMENT,
      ),
    ).toBe("READY");
  });
});
