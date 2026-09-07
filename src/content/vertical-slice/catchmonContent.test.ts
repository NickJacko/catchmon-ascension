import { describe, expect, it } from "vitest";
import { toSeed } from "../../core/random/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import { createInitialGameState } from "../../domain/game-state/index.ts";
import {
  PLAYABLE_ROUTE_IDS,
  SELECTED_CATCHMON_SPECIES_IDS,
} from "./verticalSliceManifest.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "./catalogContent.ts";
import { AQUARIL_SPECIES_ID } from "./expeditionEncounterContent.ts";
import { SLICE_ROUTES } from "./worldContent.ts";
import { resolvePrimaryElementForSpecies } from "../canonical-catchmons/index.ts";
import {
  AERORION_SPECIES_ID,
  AQUILOR_SPECIES_ID,
  DRACOGOLD_SPECIES_ID,
  EMBERYNN_SPECIES_ID,
  FLAMAROX_SPECIES_ID,
  FLAMERON_SPECIES_ID,
  GECKON_SPECIES_ID,
  HYDRAVIAN_SPECIES_ID,
  HYDROSCYTHE_SPECIES_ID,
  PYROCORE_SPECIES_ID,
  REPTORAX_SPECIES_ID,
  SLICE_CATCHMON_CAPABILITIES,
  SLICE_CATCHMON_LINES,
  SLICE_CATCHMON_SPECIES,
} from "./catchmonContent.ts";

describe("SLICE_CATCHMON_SPECIES/LINES/CAPABILITIES (Document 15 Task 05.2/05.4, post-evolution-integration)", () => {
  it("includes the 6 selected species plus their real evolution-target companions, no more", () => {
    const expectedIds = [
      ...SELECTED_CATCHMON_SPECIES_IDS,
      FLAMERON_SPECIES_ID,
      PYROCORE_SPECIES_ID,
      HYDRAVIAN_SPECIES_ID,
      REPTORAX_SPECIES_ID,
      DRACOGOLD_SPECIES_ID,
    ];
    expect(
      SLICE_CATCHMON_SPECIES.map((s) => s.catchmonSpeciesId).sort(),
    ).toEqual([...expectedIds].sort());
    // Ozean Batch A: every species now resolves its real canonical
    // Element via `resolvePrimaryElementForSpecies` — never undefined for
    // a real registered species, and every companion stage matches its
    // selected predecessor's element (lines are element-stable).
    for (const species of SLICE_CATCHMON_SPECIES) {
      expect(species.elementId).toBe(
        resolvePrimaryElementForSpecies(species.catchmonSpeciesId),
      );
      expect(species.elementId).toBeDefined();
    }
  });

  it("gives every line a unique primary domain, and its real canonical element", () => {
    for (const line of SLICE_CATCHMON_LINES) {
      expect(line.elementId).toBeDefined();
    }
    expect(SLICE_CATCHMON_LINES.map((l) => l.elementId).sort()).toEqual(
      ["dragon", "fire", "fire", "water", "water", "wind"].sort(),
    );
    const domains = new Set(SLICE_CATCHMON_LINES.map((l) => l.primaryDomain));
    expect(domains).toEqual(
      new Set(["WORKSHOP", "SHOP_FLOOR", "EXPEDITION", "SUPPLY"]),
    );
  });

  it("never leaves a stale placeholder RouteId in a capability's target (regression: Aquilor's DISCOVERY_BOOST target once pointed at Task 01.7's pre-Phase-6 reserved-ID placeholder)", () => {
    const placeholderRouteIds = new Set<string>(PLAYABLE_ROUTE_IDS);
    const realRouteIds = new Set<string>(
      SLICE_ROUTES.map((route) => route.routeId),
    );
    for (const capability of SLICE_CATCHMON_CAPABILITIES) {
      expect(placeholderRouteIds.has(capability.target)).toBe(false);
      // No capability in this slice's content has an effect family that
      // actually consumes `target` as a route reference (confirmed against
      // every evaluator in `domain/catchmons/effects.ts`) — so `target`
      // coinciding with a real RouteId would itself be a sign of stale/
      // leftover content, not a legitimate reference.
      expect(realRouteIds.has(capability.target)).toBe(false);
    }
  });

  it("resolves real, unambiguous multi-stage chains for Flamarox/Emberynn/Aquilor/Geckon", () => {
    const byId = new Map(
      SLICE_CATCHMON_SPECIES.map((s) => [s.catchmonSpeciesId, s]),
    );
    const flamarox = byId.get(FLAMAROX_SPECIES_ID)!;
    const flameron = byId.get(FLAMERON_SPECIES_ID)!;
    expect(flamarox.stageIndex).toBe(1);
    expect(flamarox.evolvesToSpeciesId).toBe(FLAMERON_SPECIES_ID);
    expect(flameron.stageIndex).toBe(2);
    expect(flameron.evolvesToSpeciesId).toBeUndefined();
    expect(flameron.capabilityIds).toEqual(flamarox.capabilityIds);

    const emberynn = byId.get(EMBERYNN_SPECIES_ID)!;
    const pyrocore = byId.get(PYROCORE_SPECIES_ID)!;
    expect(emberynn.stageIndex).toBe(1);
    expect(emberynn.evolvesToSpeciesId).toBe(PYROCORE_SPECIES_ID);
    expect(pyrocore.evolvesToSpeciesId).toBeUndefined();

    const aquilor = byId.get(AQUILOR_SPECIES_ID)!;
    const hydravian = byId.get(HYDRAVIAN_SPECIES_ID)!;
    expect(aquilor.stageIndex).toBe(1);
    expect(aquilor.evolvesToSpeciesId).toBe(HYDRAVIAN_SPECIES_ID);
    expect(hydravian.evolvesToSpeciesId).toBeUndefined();

    // Geckon's line has 2 real hops: Geckon -> Reptorax -> Dracogold.
    const geckon = byId.get(GECKON_SPECIES_ID)!;
    const reptorax = byId.get(REPTORAX_SPECIES_ID)!;
    const dracogold = byId.get(DRACOGOLD_SPECIES_ID)!;
    expect(geckon.stageIndex).toBe(0);
    expect(geckon.evolvesToSpeciesId).toBe(REPTORAX_SPECIES_ID);
    expect(reptorax.stageIndex).toBe(1);
    expect(reptorax.evolvesToSpeciesId).toBe(DRACOGOLD_SPECIES_ID);
    expect(dracogold.stageIndex).toBe(2);
    expect(dracogold.evolvesToSpeciesId).toBeUndefined();
  });

  it("leaves Hydroscythe and Aerorion terminal (real predecessor stages not registered)", () => {
    const byId = new Map(
      SLICE_CATCHMON_SPECIES.map((s) => [s.catchmonSpeciesId, s]),
    );
    const hydroscythe = byId.get(HYDROSCYTHE_SPECIES_ID)!;
    const aerorion = byId.get(AERORION_SPECIES_ID)!;
    expect(hydroscythe.stageIndex).toBe(1);
    expect(hydroscythe.evolvesToSpeciesId).toBeUndefined();
    expect(aerorion.stageIndex).toBe(1);
    expect(aerorion.evolvesToSpeciesId).toBeUndefined();
  });

  it("represents both Workshop lines targeting different stations (the 'strategic contrast')", () => {
    const workshopCapabilities = SLICE_CATCHMON_CAPABILITIES.filter(
      (c) => c.validDomain === "WORKSHOP",
    );
    expect(workshopCapabilities).toHaveLength(2);
    expect(new Set(workshopCapabilities.map((c) => c.target)).size).toBe(2);
  });

  it("gives every species exactly one capability whose validDomain matches its line's primary domain", () => {
    const capabilitiesById = new Map(
      SLICE_CATCHMON_CAPABILITIES.map((c) => [c.capabilityId, c]),
    );
    const linesById = new Map(
      SLICE_CATCHMON_LINES.map((l) => [l.catchmonLineId, l]),
    );
    for (const species of SLICE_CATCHMON_SPECIES) {
      expect(species.capabilityIds).toHaveLength(1);
      const capability = capabilitiesById.get(species.capabilityIds[0]!);
      const line = linesById.get(species.catchmonLineId);
      expect(capability).toBeDefined();
      expect(line).toBeDefined();
      expect(capability!.validDomain).toBe(line!.primaryDomain);
    }
  });

  it("builds into a valid catalog with no dangling cross-references", () => {
    expect(() =>
      createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT),
    ).not.toThrow();
    const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
    for (const species of SLICE_CATCHMON_SPECIES) {
      expect(
        catalog.catchmonSpecies.get(species.catchmonSpeciesId),
      ).toBeDefined();
    }
  });

  it("seeds exactly the 6 selected species as owned at game start, never their evolution-target companions or wild/capturable species", () => {
    // Regression guard #1: once a line has more than one registered stage
    // (Flameron/Pyrocore/Hydravian/Reptorax/Dracogold), naively seeding
    // "one owned instance per catalog species" would incorrectly hand the
    // player 11 starting Catchmons instead of 6.
    //
    // Regression guard #2 (Task 06.2): once a genuinely wild, capturable,
    // single-stage species is registered in the shared catalog (Aquaril —
    // needed as a Discovery Survey encounter target), "one owned instance
    // per line's earliest stage" would ALSO incorrectly auto-own it, since
    // being single-stage trivially makes it its own line's earliest stage.
    // `createInitialGameState` must seed starters from the catalog's
    // explicit `starterCatchmonSpeciesIds` list, not from stage inference.
    const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    expect(state.catchmons.ownedCatchmonIds).toHaveLength(6);
    const ownedSpeciesIds = Object.values(state.catchmons.ownedCatchmons).map(
      (owned) => owned.currentSpeciesId,
    );
    expect(new Set(ownedSpeciesIds)).toEqual(
      new Set(SELECTED_CATCHMON_SPECIES_IDS),
    );
    expect(ownedSpeciesIds).not.toContain(AQUARIL_SPECIES_ID);
  });
});
