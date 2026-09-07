// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  addToInventory,
  productItemId,
} from "../../../domain/inventory/index.ts";
import { PROVISIONAL_CAPABILITY_MAGNITUDES } from "../../../content/vertical-slice/balance.ts";
import {
  AQUILOR_SPECIES_ID,
  COMPONENT_HUNT_ROUTE_ID,
  DISCOVERY_SURVEY_ROUTE_ID,
  FLAMAROX_SPECIES_ID,
  OZEAN_REEF_SURVEY_ROUTE_ID,
  OZEAN_TIDAL_SHALLOWS_ROUTE_ID,
  OZEAN_TIDEPOOL_HUNT_ROUTE_ID,
  SLICE_PRODUCT_04_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { type OwnedCatchmonId, RouteId } from "../../../core/ids/index.ts";
import { createExpeditionPlanningQueries } from "./expedition-queries.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const queries = createExpeditionPlanningQueries(
  catalog,
  SLICE_PRODUCT_04_ID,
  SLICE_ROUTE_DURATION_MS,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
);

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

function ownedCatchmonIdFor(
  state: GameState,
  speciesId: string,
): OwnedCatchmonId {
  const found = Object.values(state.catchmons.ownedCatchmons).find(
    (owned) => owned.currentSpeciesId === speciesId,
  );
  if (!found) throw new Error(`no owned Catchmon for species ${speciesId}`);
  return found.ownedCatchmonId;
}

describe("availableRoutes", () => {
  it("reports Vulkankrater's 3 routes available from a fresh game (region unlocked, no access requirements)", () => {
    const state = baseState();
    const availabilities = queries.availableRoutes(state);
    // 6 total now that Ozean's own 3 routes exist (Ozean Batch A) —
    // returned for every catalog route regardless of lock status, with
    // `available`/`reason` reflecting each one's real accessibility.
    expect(availabilities).toHaveLength(6);
    const vulkankraterRouteIds = new Set([
      SUPPLY_RUN_ROUTE_ID,
      DISCOVERY_SURVEY_ROUTE_ID,
      COMPONENT_HUNT_ROUTE_ID,
    ]);
    for (const availability of availabilities) {
      if (vulkankraterRouteIds.has(availability.routeId)) {
        expect(availability.available).toBe(true);
        expect(availability.reason).toBeUndefined();
      }
    }
  });

  it("reports Ozean's 3 routes as REGION_LOCKED from a fresh game (Ozean Batch A: no longer preview-unlocked, gated behind its real two-signal unlock rule)", () => {
    const state = baseState();
    const availabilities = queries.availableRoutes(state);
    const ozeanRouteIds = new Set([
      OZEAN_TIDAL_SHALLOWS_ROUTE_ID,
      OZEAN_REEF_SURVEY_ROUTE_ID,
      OZEAN_TIDEPOOL_HUNT_ROUTE_ID,
    ]);
    const ozeanAvailabilities = availabilities.filter((a) =>
      ozeanRouteIds.has(a.routeId),
    );
    expect(ozeanAvailabilities).toHaveLength(3);
    for (const availability of ozeanAvailabilities) {
      expect(availability.available).toBe(false);
      expect(availability.reason).toBe("REGION_LOCKED");
    }
  });

  it("reports a route in a locked region as unavailable", () => {
    const state = baseState();
    const lockedState: GameState = {
      ...state,
      world: { ...state.world, unlockedRegionIds: [] },
    };
    for (const availability of queries.availableRoutes(lockedState)) {
      expect(availability.available).toBe(false);
      expect(availability.reason).toBe("REGION_LOCKED");
    }
  });
});

describe("leadEligibility / supportEligibility", () => {
  it("is eligible for an unassigned owned Catchmon, with expedition domain fit reported informationally", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const result = queries.leadEligibility(state, aquilorId);
    expect(result.eligible).toBe(true);
    expect(result.reason).toBeUndefined();
    expect(result.hasExpeditionDomainFit).toBe(true);
  });

  it("reports no expedition domain fit for a non-expedition-domain Catchmon, but still eligible (informational only, not a hard gate)", () => {
    const state = baseState();
    const flamaroxId = ownedCatchmonIdFor(state, FLAMAROX_SPECIES_ID);
    const result = queries.leadEligibility(state, flamaroxId);
    expect(result.eligible).toBe(true);
    expect(result.hasExpeditionDomainFit).toBe(false);
  });

  it("is ineligible once already assigned elsewhere", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const assignedState: GameState = {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [aquilorId]: {
            ...state.catchmons.ownedCatchmons[aquilorId]!,
            currentAssignment: {
              kind: "SHOP_FLOOR",
              slotId: "slice-display-01",
            },
          },
        },
      },
    };
    const result = queries.leadEligibility(assignedState, aquilorId);
    expect(result.eligible).toBe(false);
    expect(result.reason).toBe("ALREADY_ASSIGNED");
  });

  it("reports unknown for a nonexistent owned Catchmon id, identically for supportEligibility", () => {
    const state = baseState();
    const bogusId = "owned-does-not-exist" as OwnedCatchmonId;
    expect(queries.leadEligibility(state, bogusId)).toEqual(
      queries.supportEligibility(state, bogusId),
    );
    expect(queries.leadEligibility(state, bogusId).reason).toBe(
      "UNKNOWN_CATCHMON",
    );
  });
});

describe("routeFit", () => {
  it("reports the Lead's discovery-boost bonus when it has one", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const fit = queries.routeFit(state, DISCOVERY_SURVEY_ROUTE_ID, aquilorId);
    expect(fit).not.toBeNull();
    expect(fit!.discoveryBoostBonus).toBeGreaterThan(0);
  });

  it("reports zero discovery-boost bonus for a Lead with no matching capability", () => {
    const state = baseState();
    const flamaroxId = ownedCatchmonIdFor(state, FLAMAROX_SPECIES_ID);
    const fit = queries.routeFit(state, DISCOVERY_SURVEY_ROUTE_ID, flamaroxId);
    expect(fit).not.toBeNull();
    expect(fit!.discoveryBoostBonus).toBe(0);
  });

  it("reports no matched preferred capabilities, honestly reflecting this slice's empty preferredCapabilities on every route", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const fit = queries.routeFit(state, SUPPLY_RUN_ROUTE_ID, aquilorId);
    expect(fit!.matchedPreferredCapabilityIds).toEqual([]);
  });

  it("returns null for an unknown route", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    expect(
      queries.routeFit(state, RouteId.from("no-such-route"), aquilorId),
    ).toBeNull();
  });
});

describe("loadoutCompatibility", () => {
  it("marks the Capture Aid inapplicable on a route with no encounterPool", () => {
    const state = baseState();
    const compat = queries.loadoutCompatibility(state, SUPPLY_RUN_ROUTE_ID);
    expect(compat!.captureAidApplicable).toBe(false);
    expect(compat!.canBringCaptureAid).toBe(false);
  });

  it("marks the Capture Aid applicable but unavailable with 0 stock on the Discovery Survey route", () => {
    const state = baseState();
    const compat = queries.loadoutCompatibility(
      state,
      DISCOVERY_SURVEY_ROUTE_ID,
    );
    expect(compat!.captureAidApplicable).toBe(true);
    expect(compat!.captureAidAvailableQuantity).toBe(0);
    expect(compat!.canBringCaptureAid).toBe(false);
  });

  it("allows bringing the Capture Aid once stocked", () => {
    const state = baseState();
    const stockedState: GameState = {
      ...state,
      inventory: addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_04_ID, "STANDARD"),
        1,
      ),
    };
    const compat = queries.loadoutCompatibility(
      stockedState,
      DISCOVERY_SURVEY_ROUTE_ID,
    );
    expect(compat!.captureAidAvailableQuantity).toBe(1);
    expect(compat!.canBringCaptureAid).toBe(true);
  });
});

describe("preparationSlots", () => {
  it("returns an honest empty placeholder, not fabricated slots", () => {
    const preview = queries.preparationSlots(COMPONENT_HUNT_ROUTE_ID);
    expect(preview!.slots).toEqual([]);
    expect(preview!.note.length).toBeGreaterThan(0);
  });
});

describe("expeditionPreview", () => {
  it("reports the correct numeric duration per route from the injected balance map", () => {
    expect(queries.expeditionPreview(SUPPLY_RUN_ROUTE_ID)!.durationMs).toBe(
      SLICE_ROUTE_DURATION_MS[SUPPLY_RUN_ROUTE_ID],
    );
    expect(
      queries.expeditionPreview(DISCOVERY_SURVEY_ROUTE_ID)!.durationMs,
    ).toBe(SLICE_ROUTE_DURATION_MS[DISCOVERY_SURVEY_ROUTE_ID]);
  });

  it("reports encounter/special-component chance flags matching each route's declared pools", () => {
    expect(
      queries.expeditionPreview(DISCOVERY_SURVEY_ROUTE_ID)!.hasEncounterChance,
    ).toBe(true);
    expect(
      queries.expeditionPreview(SUPPLY_RUN_ROUTE_ID)!.hasEncounterChance,
    ).toBe(false);
    expect(
      queries.expeditionPreview(COMPONENT_HUNT_ROUTE_ID)!
        .hasSpecialComponentChance,
    ).toBe(true);
  });

  it("never previews a Coins reward tag (Document 07: expeditions are not a second Coin economy)", () => {
    for (const routeId of [
      SUPPLY_RUN_ROUTE_ID,
      DISCOVERY_SURVEY_ROUTE_ID,
      COMPONENT_HUNT_ROUTE_ID,
    ]) {
      const preview = queries.expeditionPreview(routeId)!;
      expect(preview.guaranteedRewardTags.join(" ")).not.toMatch(/coin/i);
      expect(preview.bonusRewardPoolTags.join(" ")).not.toMatch(/coin/i);
    }
  });
});
