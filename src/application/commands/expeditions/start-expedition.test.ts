// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId, type OwnedCatchmonId } from "../../../core/ids/index.ts";
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
import {
  AQUILOR_SPECIES_ID,
  DISCOVERY_SURVEY_ROUTE_ID,
  FLAMAROX_SPECIES_ID,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  SLICE_PRODUCT_04_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../../domain/journey/index.ts";
import { createCommand } from "../../engine/index.ts";
import { createStartExpeditionHandler } from "./start-expedition.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const startExpedition = createStartExpeditionHandler(
  catalog,
  SLICE_PRODUCT_04_ID,
  SLICE_ROUTE_DURATION_MS,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
);

function baseState(): GameState {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  // Phase R6: the Expeditions-unlocked milestone gate is orthogonal to
  // what this file tests (route/Lead/slot/aid validation) — given as
  // already-unlocked here so existing scenarios aren't affected; the gate
  // itself is asserted below.
  return {
    ...state,
    progression: {
      ...state.progression,
      unlockedSystemIds: [EXPEDITIONS_SYSTEM_MILESTONE],
    },
  };
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

describe("START_EXPEDITION", () => {
  it("starts an expedition, assigns the Lead, and computes completesAtMs from the route duration", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const clock = new FakeClock(1000);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: false,
      },
      clock,
    );

    const result = startExpedition(state, command);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const { nextState, events } = result.value;
    expect(nextState.expeditions.activeExpeditionIds).toHaveLength(1);
    const expeditionId = nextState.expeditions.activeExpeditionIds[0]!;
    const expedition = nextState.expeditions.expeditions[expeditionId]!;
    expect(expedition.routeId).toBe(SUPPLY_RUN_ROUTE_ID);
    expect(expedition.leadCatchmonId).toBe(aquilorId);
    expect(expedition.supportCatchmonIds).toEqual([]);
    expect(expedition.startedAtMs).toBe(1000);
    expect(expedition.completesAtMs).toBe(
      1000 + SLICE_ROUTE_DURATION_MS[SUPPLY_RUN_ROUTE_ID]!,
    );
    expect(expedition.loadoutReservationId).toBeUndefined();

    expect(
      nextState.catchmons.ownedCatchmons[aquilorId]!.currentAssignment,
    ).toEqual({ kind: "EXPEDITION", expeditionId });

    expect(events).toEqual([
      expect.objectContaining({
        kind: "EXPEDITION_STARTED",
        expeditionId,
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: aquilorId,
      }),
    ]);
  });

  it("snapshots the Lead's discovery-boost bonus at start", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: DISCOVERY_SURVEY_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: false,
      },
      new FakeClock(0),
    );
    const result = startExpedition(state, command);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const expeditionId =
      result.value.nextState.expeditions.activeExpeditionIds[0]!;
    expect(
      result.value.nextState.expeditions.expeditions[expeditionId]!
        .leadDiscoveryBoostBonus,
    ).toBeGreaterThan(0);
  });

  it("snapshots zero discovery-boost bonus for a Lead with no matching capability", () => {
    const state = baseState();
    const flamaroxId = ownedCatchmonIdFor(state, FLAMAROX_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: flamaroxId,
        bringCaptureAid: false,
      },
      new FakeClock(0),
    );
    const result = startExpedition(state, command);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const expeditionId =
      result.value.nextState.expeditions.activeExpeditionIds[0]!;
    expect(
      result.value.nextState.expeditions.expeditions[expeditionId]!
        .leadDiscoveryBoostBonus,
    ).toBe(0);
  });

  it("reserves the Capture Aid when requested and applicable, reducing available quantity", () => {
    const fresh = baseState();
    const state: GameState = {
      ...fresh,
      inventory: addToInventory(
        fresh.inventory,
        productItemId(SLICE_PRODUCT_04_ID, "STANDARD"),
        1,
      ),
    };
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: DISCOVERY_SURVEY_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: true,
      },
      new FakeClock(0),
    );
    const result = startExpedition(state, command);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const expeditionId =
      result.value.nextState.expeditions.activeExpeditionIds[0]!;
    const expedition =
      result.value.nextState.expeditions.expeditions[expeditionId]!;
    expect(expedition.loadoutReservationId).toBeDefined();
    const reservation =
      result.value.nextState.inventory.reservations[
        expedition.loadoutReservationId!
      ];
    expect(reservation?.ownerType).toBe("EXPEDITION");
  });

  it("rejects bringing a Capture Aid on a route with no encounter pool", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: true,
      },
      new FakeClock(0),
    );
    const result = startExpedition(state, command);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("CAPTURE_AID_NOT_APPLICABLE");
  });

  it("rejects requesting a Capture Aid with insufficient stock", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: DISCOVERY_SURVEY_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: true,
      },
      new FakeClock(0),
    );
    const result = startExpedition(state, command);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INSUFFICIENT_AVAILABLE");
  });

  it("rejects a Lead that is already assigned elsewhere", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const busyState: GameState = {
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
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: false,
      },
      new FakeClock(0),
    );
    const result = startExpedition(busyState, command);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("LEAD_NOT_AVAILABLE");
  });

  it("rejects a second concurrent expedition beyond the configured slot limit", () => {
    const state = baseState();
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const flamaroxId = ownedCatchmonIdFor(state, FLAMAROX_SPECIES_ID);
    const first = startExpedition(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "START_EXPEDITION",
        {
          routeId: SUPPLY_RUN_ROUTE_ID,
          leadCatchmonId: aquilorId,
          bringCaptureAid: false,
        },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = startExpedition(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "START_EXPEDITION",
        {
          routeId: SUPPLY_RUN_ROUTE_ID,
          leadCatchmonId: flamaroxId,
          bringCaptureAid: false,
        },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("EXPEDITION_SLOT_FULL");
  });

  it("rejects a route in a locked region", () => {
    const state = baseState();
    const lockedState: GameState = {
      ...state,
      world: { ...state.world, unlockedRegionIds: [] },
    };
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: false,
      },
      new FakeClock(0),
    );
    const result = startExpedition(lockedState, command);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ROUTE_REGION_LOCKED");
  });

  it("rejects starting an expedition before Expeditions are unlocked (Phase R6)", () => {
    const state = baseState();
    const notYetUnlockedState: GameState = {
      ...state,
      progression: { ...state.progression, unlockedSystemIds: [] },
    };
    const aquilorId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
    const command = createCommand(
      CommandId.from("cmd-1"),
      "START_EXPEDITION",
      {
        routeId: SUPPLY_RUN_ROUTE_ID,
        leadCatchmonId: aquilorId,
        bringCaptureAid: false,
      },
      new FakeClock(0),
    );
    const result = startExpedition(notYetUnlockedState, command);
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("EXPEDITIONS_NOT_YET_UNLOCKED");
  });
});
