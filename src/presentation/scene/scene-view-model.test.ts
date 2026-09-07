import { describe, expect, it } from "vitest";
import { type CustomerId } from "../../core/ids/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { toDurationMs } from "../../core/math/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import {
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_STATION_IDS,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { buildShopSceneViewModel } from "./scene-view-model.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID) throw new Error("expected a playable station id");

function buildOptions() {
  return {
    stationIds: PLAYABLE_STATION_IDS,
    stationArchetypes: VERTICAL_SLICE_STATION_ARCHETYPES,
    displaySlotIds: PLAYABLE_DISPLAY_SLOT_IDS,
    displaySlotUnlockRequirements: SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
    expeditionHubInfrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID,
  };
}

function freshState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

describe("buildShopSceneViewModel", () => {
  it("is a pure function of state+catalog — same input, same output, no side effects", () => {
    const state = freshState();
    const first = buildShopSceneViewModel(state, catalog, buildOptions());
    const second = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(second).toEqual(first);
  });

  it("represents every configured station, idle by default", () => {
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.stations).toHaveLength(PLAYABLE_STATION_IDS.length);
    for (const station of view.stations) {
      expect(station.isCrafting).toBe(false);
      expect(station.queuedCount).toBe(0);
      expect(station.assignedCatchmonIds).toEqual([]);
    }
  });

  it("reflects an active craft's real timestamps", () => {
    const state: GameState = {
      ...freshState(),
      crafting: {
        stations: {
          [PROVISION_STATION_ID]: {
            stationId: PROVISION_STATION_ID,
            archetype: VERTICAL_SLICE_STATION_ARCHETYPES[PROVISION_STATION_ID]!,
            activeCraft: {
              recipeId: "slice-recipe-01" as never,
              reservationId: "res-1" as never,
              startedAtMs: toTimestampMs(0),
              completesAtMs: toTimestampMs(15_000),
              durationMs: toDurationMs(15_000),
              qualityRollSeed: toSeed(1),
            },
            queuedCrafts: [],
            supportCatchmonIds: [],
          },
        },
      },
    };
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    const station = view.stations.find(
      (s) => s.stationId === PROVISION_STATION_ID,
    )!;
    expect(station.isCrafting).toBe(true);
    expect(station.craftStartedAtMs).toBe(toTimestampMs(0));
    expect(station.craftCompletesAtMs).toBe(toTimestampMs(15_000));
  });

  it("marks a display slot locked only when its required infrastructure is unowned", () => {
    const thirdSlot = PLAYABLE_DISPLAY_SLOT_IDS[2]!;
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    const locked = view.displays.find((d) => d.displaySlotId === thirdSlot)!;
    expect(locked.locked).toBe(true);

    const firstSlot = PLAYABLE_DISPLAY_SLOT_IDS[0]!;
    const unlocked = view.displays.find((d) => d.displaySlotId === firstSlot)!;
    expect(unlocked.locked).toBe(false);
  });

  it("only places WORKSHOP/SHOP_FLOOR-assigned Catchmons on the scene, never Supply/Unassigned", () => {
    const state = freshState();
    const [firstOwnedId] = state.catchmons.ownedCatchmonIds;
    if (!firstOwnedId)
      throw new Error("expected at least one starting Catchmon");
    const assigned: GameState = {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [firstOwnedId]: {
            ...state.catchmons.ownedCatchmons[firstOwnedId]!,
            currentAssignment: { kind: "SUPPLY", slotId: "slice-supply" },
          },
        },
      },
    };
    const view = buildShopSceneViewModel(assigned, catalog, buildOptions());
    expect(view.catchmons.some((c) => c.ownedCatchmonId === firstOwnedId)).toBe(
      false,
    );
  });

  it("reports the Expedition Hub as LOCKED on a fresh save (rank 1 < unlock threshold)", () => {
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.expeditionHub.state).toBe("LOCKED");
    expect(view.expeditionHub.hasActiveExpedition).toBe(false);
    expect(view.expeditionHub.hasUnviewedResult).toBe(false);
  });

  it("reports the Expedition Hub as OWNED once purchased", () => {
    const state: GameState = {
      ...freshState(),
      infrastructure: {
        ownedInfrastructureIds: [EXPEDITION_HUB_INFRASTRUCTURE_ID],
        upgradeLevels: {},
        activeConstructions: [],
      },
    };
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.expeditionHub.state).toBe("OWNED");
  });

  it("derives the macro stage from owned infrastructure, matching the domain rule directly", () => {
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.macroStage).toBe("STARTER");
  });
});

describe("buildShopSceneViewModel — Phase 10 real production art resolution", () => {
  it("resolves the environment wall/floor URLs from the catalog's real asset registry", () => {
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.environment.wallUrl).toMatch(/shop-environment_wall/);
    expect(view.environment.floorUrl).toMatch(/shop-environment_floor/);
  });

  it("resolves idle station art with its idle pivot, and switches to active art/pivot once crafting", () => {
    const state = freshState();
    const idleView = buildShopSceneViewModel(state, catalog, buildOptions());
    const idleStation = idleView.stations.find(
      (s) => s.stationId === PROVISION_STATION_ID,
    )!;
    expect(idleStation.art?.baseUrl).toMatch(/provision-station_idle_base/);
    expect(idleStation.art?.shadowUrl).toMatch(/provision-station_idle_shadow/);
    expect(idleStation.art?.pivot).toEqual({ x: 0.497, y: 0.699 });

    const craftingState: GameState = {
      ...state,
      crafting: {
        stations: {
          [PROVISION_STATION_ID]: {
            stationId: PROVISION_STATION_ID,
            archetype: VERTICAL_SLICE_STATION_ARCHETYPES[PROVISION_STATION_ID]!,
            activeCraft: {
              recipeId: "slice-recipe-01" as never,
              reservationId: "res-1" as never,
              startedAtMs: toTimestampMs(0),
              completesAtMs: toTimestampMs(15_000),
              durationMs: toDurationMs(15_000),
              qualityRollSeed: toSeed(1),
            },
            queuedCrafts: [],
            supportCatchmonIds: [],
          },
        },
      },
    };
    const activeView = buildShopSceneViewModel(
      craftingState,
      catalog,
      buildOptions(),
    );
    const activeStation = activeView.stations.find(
      (s) => s.stationId === PROVISION_STATION_ID,
    )!;
    expect(activeStation.art?.baseUrl).toMatch(/provision-station_active_base/);
    expect(activeStation.art?.pivot).toEqual({ x: 0.493, y: 0.758 });
  });

  it("resolves display furniture art on every display, and a product icon URL only once a product is assigned", () => {
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    for (const display of view.displays) {
      expect(display.art?.baseUrl).toMatch(/display-furniture_base/);
      expect(display.art?.pivot).toEqual({ x: 0.518, y: 0.701 });
      expect(display.productImageUrl).toBeUndefined();
    }
  });

  it("resolves Expedition Hub art regardless of lock state", () => {
    const state = freshState();
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.expeditionHub.state).toBe("LOCKED");
    expect(view.expeditionHub.art?.baseUrl).toMatch(/expedition-hub_base/);
    expect(view.expeditionHub.art?.pivot).toEqual({ x: 0.499, y: 0.668 });
  });

  it("resolves a real portrait URL for every active customer's archetype", () => {
    const archetype = SLICE_CUSTOMER_ARCHETYPES[0]!;
    const customerId = "test-customer-1" as CustomerId;
    const state: GameState = {
      ...freshState(),
      customers: {
        activeCustomerIds: [customerId],
        customers: {
          [customerId]: {
            customerId,
            archetypeId: archetype.customerArchetypeId,
            arrivedAtMs: toTimestampMs(0),
            status: "BROWSING",
            generationSeed: toSeed(1),
          },
        },
      },
    };
    const view = buildShopSceneViewModel(state, catalog, buildOptions());
    expect(view.customers).toHaveLength(1);
    expect(view.customers[0]!.portraitUrl).toMatch(/customer-/);
  });
});
