// @vitest-environment node
//
// Design owner: Document 15 Task 05.9 (Evolution Shell). Tested against a
// synthetic two-stage catalog — none of the 6 real slice Catchmons has
// real evolution data (see domain/catchmons/evolution.ts's module doc).
import { describe, expect, it } from "vitest";
import {
  AssetId,
  CapabilityId,
  CatchmonLineId,
  CatchmonSpeciesId,
  CommandId,
  OwnedCatchmonId,
} from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../../../domain/catalog/index.ts";
import { type AssetMetadata } from "../../../domain/assets/index.ts";
import {
  type CapabilityDefinition,
  type CatchmonSpeciesDefinition,
  type EvolutionLineDefinition,
} from "../../../domain/catchmons/index.ts";
import {
  createInitialGameState,
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../engine/index.ts";
import { createEvolveCatchmonHandler } from "./evolve-catchmon.ts";

const LEVEL_REQUIREMENT = 5;
const LINE_ID = CatchmonLineId.from("fixture-line");
const BASE_SPECIES_ID = CatchmonSpeciesId.from("fixture-species-base");
const EVOLVED_SPECIES_ID = CatchmonSpeciesId.from("fixture-species-evolved");
const CAPABILITY_ID = CapabilityId.from("fixture-capability");
const OWNED_ID = OwnedCatchmonId.from("fixture-owned");

const fixtureLine: EvolutionLineDefinition = {
  catchmonLineId: LINE_ID,
  displayName: "Fixture Line",
  primaryDomain: "WORKSHOP",
  specializationIdentity: "Fixture Specialist",
  synergyTags: [],
  speciesIds: [BASE_SPECIES_ID, EVOLVED_SPECIES_ID],
};

const fixtureCapability: CapabilityDefinition = {
  capabilityId: CAPABILITY_ID,
  displayName: "Fixture Capability",
  strengthClass: "CORE",
  effectFamily: "CRAFT_SPEED_TARGETED",
  validDomain: "WORKSHOP",
  target: "PROVISION_STATION",
  magnitudeConfigRef: "fixture-magnitude",
  presentationTextKey: "fixture.capability",
};

const baseSpecies: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: BASE_SPECIES_ID,
  catchmonLineId: LINE_ID,
  displayName: "Fixture Species (Base)",
  stageIndex: 0,
  capabilityIds: [CAPABILITY_ID],
  evolvesToSpeciesId: EVOLVED_SPECIES_ID,
  portraitAssetId: AssetId.from("fixture-portrait-base"),
};

const evolvedSpecies: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: EVOLVED_SPECIES_ID,
  catchmonLineId: LINE_ID,
  displayName: "Fixture Species (Evolved)",
  stageIndex: 1,
  capabilityIds: [CAPABILITY_ID],
  portraitAssetId: AssetId.from("fixture-portrait-evolved"),
};

function fixtureAsset(assetId: AssetId): AssetMetadata {
  return {
    assetId,
    category: "catchmon-portrait",
    sourcePath: `fixture/${assetId}.png`,
    runtimePath: `/fixture/${assetId}.png`,
    status: "PLACEHOLDER",
    version: 1,
    width: 1,
    height: 1,
    format: "png",
    hasAlpha: false,
    tags: [],
    preloadClass: "ON_DEMAND",
  };
}

const FIXTURE_CONTENT: GameCatalogContent = {
  products: [],
  recipes: [],
  resources: [],
  components: [],
  catchmonSpecies: [baseSpecies, evolvedSpecies],
  catchmonLines: [fixtureLine],
  capabilities: [fixtureCapability],
  elements: [],
  regions: [],
  routes: [],
  customerArchetypes: [],
  infrastructure: [],
  unlockRules: [],
  assets: [
    fixtureAsset(baseSpecies.portraitAssetId),
    fixtureAsset(evolvedSpecies.portraitAssetId),
  ],
};

const catalog = createGameCatalog(FIXTURE_CONTENT);
const evolveCatchmon = createEvolveCatchmonHandler(catalog, LEVEL_REQUIREMENT);

function stateWithOwnedFixture(level: number): GameState {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const owned: OwnedCatchmonState = {
    ownedCatchmonId: OWNED_ID,
    lineId: LINE_ID,
    currentSpeciesId: BASE_SPECIES_ID,
    level,
    xp: 250,
    evolutionReadiness: "READY",
    currentAssignment: { kind: "UNASSIGNED" },
  };
  return {
    ...state,
    catchmons: {
      ownedCatchmonIds: [OWNED_ID],
      ownedCatchmons: { [OWNED_ID]: owned },
    },
  };
}

describe("EVOLVE_CATCHMON", () => {
  it("fails with LEVEL_REQUIREMENT_NOT_MET below the threshold", () => {
    const result = evolveCatchmon(
      stateWithOwnedFixture(1),
      createCommand(
        CommandId.from("cmd-evolve"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: OWNED_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("LEVEL_REQUIREMENT_NOT_MET");
  });

  it("evolves at/above the threshold, preserving level and xp, updating currentSpeciesId", () => {
    const state = stateWithOwnedFixture(LEVEL_REQUIREMENT);
    const result = evolveCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-evolve"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: OWNED_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const evolved = result.value.nextState.catchmons.ownedCatchmons[OWNED_ID]!;
    expect(evolved.currentSpeciesId).toBe(EVOLVED_SPECIES_ID);
    expect(evolved.level).toBe(LEVEL_REQUIREMENT);
    expect(evolved.xp).toBe(250);
    expect(evolved.evolutionReadiness).toBe("EVOLVED");
    expect(result.value.events).toEqual([
      {
        kind: "CATCHMON_EVOLVED",
        ownedCatchmonId: OWNED_ID,
        fromSpeciesId: BASE_SPECIES_ID,
        toSpeciesId: EVOLVED_SPECIES_ID,
      },
    ]);
  });

  it("is idempotent: evolving again after reaching the terminal stage fails cleanly instead of re-applying", () => {
    const state = stateWithOwnedFixture(LEVEL_REQUIREMENT);
    const first = evolveCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-evolve-1"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: OWNED_ID },
        new FakeClock(0),
      ),
    );
    if (!first.ok) throw new Error("expected first evolution to succeed");

    const beforeSecondAttempt =
      first.value.nextState.catchmons.ownedCatchmons[OWNED_ID];
    const second = evolveCatchmon(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-evolve-2"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: OWNED_ID },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("NO_EVOLUTION_TARGET");
    // The rejected second attempt returns no nextState to apply — the
    // caller simply keeps `first.value.nextState`, so this asserts that
    // state (the one a real caller would still be holding) is untouched.
    expect(first.value.nextState.catchmons.ownedCatchmons[OWNED_ID]).toBe(
      beforeSecondAttempt,
    );
  });

  it("fails with CATCHMON_NOT_FOUND for an unknown owned Catchmon", () => {
    const result = evolveCatchmon(
      stateWithOwnedFixture(1),
      createCommand(
        CommandId.from("cmd-evolve"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: OwnedCatchmonId.from("does-not-exist") },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CATCHMON_NOT_FOUND");
  });
});
