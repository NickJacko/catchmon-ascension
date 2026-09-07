// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  CommandId,
  EncounterId,
  ExpeditionId,
} from "../../../core/ids/index.ts";
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
  addToInventory,
  getAvailableQuantity,
  productItemId,
} from "../../../domain/inventory/index.ts";
import {
  DISCOVERY_SURVEY_ROUTE_ID,
  GECKON_SPECIES_ID,
  SLICE_PRODUCT_04_ID,
  SLICE_RESOURCE_A_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createCommand } from "../../engine/index.ts";
import { createObserveEncounterHandler } from "./observe-encounter.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const observeRewardItemId = catalog.resources.get(SLICE_RESOURCE_A_ID)!.itemId;
const observeEncounter = createObserveEncounterHandler(observeRewardItemId, 1);

const ENCOUNTER_ID = EncounterId.from("encounter-owned-test");
const GECKON_LINE_ID =
  catalog.catchmonSpecies.get(GECKON_SPECIES_ID)!.catchmonLineId;

function stateWithOwnedLineEncounter(bringCaptureAid = false): {
  state: GameState;
  reservationId?: string;
} {
  let state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const encounter: EncounterOpportunityState = {
    encounterId: ENCOUNTER_ID,
    expeditionId: ExpeditionId.from("expedition-owned-test"),
    routeId: DISCOVERY_SURVEY_ROUTE_ID,
    targetLineId: GECKON_LINE_ID,
    targetSpeciesId: GECKON_SPECIES_ID,
    discoveryBoostBonus: 0,
    status: "PENDING",
    createdAtMs: toTimestampMs(0),
  };
  state = {
    ...state,
    world: {
      ...state.world,
      encounterOpportunities: { [ENCOUNTER_ID]: encounter },
    },
  };
  if (bringCaptureAid) {
    state = {
      ...state,
      inventory: addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_04_ID, "STANDARD"),
        1,
      ),
    };
  }
  return { state };
}

describe("OBSERVE_ENCOUNTER", () => {
  it("grants a deterministic small reward and resolves the encounter as OBSERVED without a capture roll", () => {
    const { state } = stateWithOwnedLineEncounter();
    const before = getAvailableQuantity(state.inventory, observeRewardItemId);

    const result = observeEncounter(
      state,
      createCommand(
        CommandId.from("cmd-observe"),
        "OBSERVE_ENCOUNTER",
        { encounterId: ENCOUNTER_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(
      getAvailableQuantity(
        result.value.nextState.inventory,
        observeRewardItemId,
      ),
    ).toBe(before + 1);
    const resolved =
      result.value.nextState.world.encounterOpportunities[ENCOUNTER_ID]!;
    expect(resolved.status).toBe("RESOLVED");
    expect(resolved.resolution).toBe("OBSERVED");
    expect(result.value.events).toEqual([
      {
        kind: "ENCOUNTER_OBSERVED",
        encounterId: ENCOUNTER_ID,
        targetSpeciesId: GECKON_SPECIES_ID,
      },
    ]);
  });

  it("never creates a duplicate owned Catchmon for an already-owned line", () => {
    const { state } = stateWithOwnedLineEncounter();
    const ownedCountBefore = state.catchmons.ownedCatchmonIds.length;

    const result = observeEncounter(
      state,
      createCommand(
        CommandId.from("cmd-observe"),
        "OBSERVE_ENCOUNTER",
        { encounterId: ENCOUNTER_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.nextState.catchmons.ownedCatchmonIds).toHaveLength(
      ownedCountBefore,
    );
  });

  it("does not error when the encounter's expedition has no reservation to release", () => {
    // No expedition record exists for this synthetic encounter's
    // `expeditionId`, so there is no `loadoutReservationId` to release —
    // this proves the command doesn't blow up when there's nothing to
    // release, matching the "not an error" path in its own implementation.
    const { state } = stateWithOwnedLineEncounter(true);
    const result = observeEncounter(
      state,
      createCommand(
        CommandId.from("cmd-observe"),
        "OBSERVE_ENCOUNTER",
        { encounterId: ENCOUNTER_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      getAvailableQuantity(
        result.value.nextState.inventory,
        productItemId(SLICE_PRODUCT_04_ID, "STANDARD"),
      ),
    ).toBe(1);
  });

  it("rejects observing a line that is not yet owned", () => {
    const { state } = stateWithOwnedLineEncounter();
    const unownedState: GameState = {
      ...state,
      world: {
        ...state.world,
        discoveryStates: {
          ...state.world.discoveryStates,
          [GECKON_LINE_ID]: "ENCOUNTERED",
        },
      },
    };
    const result = observeEncounter(
      unownedState,
      createCommand(
        CommandId.from("cmd-observe"),
        "OBSERVE_ENCOUNTER",
        { encounterId: ENCOUNTER_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("TARGET_NOT_OWNED");
  });

  it("rejects observing an already-resolved encounter", () => {
    const { state } = stateWithOwnedLineEncounter();
    const first = observeEncounter(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "OBSERVE_ENCOUNTER",
        { encounterId: ENCOUNTER_ID },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = observeEncounter(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "OBSERVE_ENCOUNTER",
        { encounterId: ENCOUNTER_ID },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("ENCOUNTER_ALREADY_RESOLVED");
  });
});
