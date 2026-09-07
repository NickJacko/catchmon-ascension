// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  EMBERYNN_SPECIES_ID,
  FLAMAROX_SPECIES_ID,
  GECKON_SPECIES_ID,
  HYDROSCYTHE_SPECIES_ID,
  PLAYABLE_STATION_IDS,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../../content/vertical-slice/index.ts";
import { createAssignCatchmonHandler } from "./assign-catchmon.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID, FIELDWORKS_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID || !FIELDWORKS_STATION_ID) {
  throw new Error("expected 2 playable station IDs");
}

const assignCatchmon = createAssignCatchmonHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
);

function baseState() {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

const FLAMAROX_OWNED_ID = deriveInitialOwnedCatchmonId(FLAMAROX_SPECIES_ID);
const GECKON_OWNED_ID = deriveInitialOwnedCatchmonId(GECKON_SPECIES_ID);
const EMBERYNN_OWNED_ID = deriveInitialOwnedCatchmonId(EMBERYNN_SPECIES_ID);
const HYDROSCYTHE_OWNED_ID = deriveInitialOwnedCatchmonId(
  HYDROSCYTHE_SPECIES_ID,
);

describe("ASSIGN_CATCHMON", () => {
  it("assigns an eligible Catchmon to Workshop at a specific station", () => {
    const state = baseState();
    const result = assignCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: FLAMAROX_OWNED_ID,
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(
      result.value.nextState.catchmons.ownedCatchmons[FLAMAROX_OWNED_ID]!
        .currentAssignment,
    ).toEqual({ kind: "WORKSHOP", stationId: PROVISION_STATION_ID });
    expect(
      result.value.nextState.crafting.stations[PROVISION_STATION_ID]!
        .supportCatchmonIds,
    ).toEqual([FLAMAROX_OWNED_ID]);
    expect(result.value.events).toEqual([
      expect.objectContaining({
        kind: "CATCHMON_ASSIGNED",
        ownedCatchmonId: FLAMAROX_OWNED_ID,
      }),
    ]);
  });

  it("fails with CATCHMON_NOT_ELIGIBLE when the species has no capability for that domain", () => {
    const state = baseState();
    const result = assignCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: HYDROSCYTHE_OWNED_ID, // SUPPLY-domain species
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CATCHMON_NOT_ELIGIBLE");
  });

  it("fails with WORKSHOP_SUPPORT_FULL once a station's support capacity is reached", () => {
    const first = assignCatchmon(
      baseState(),
      createCommand(
        CommandId.from("cmd-assign-1"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: FLAMAROX_OWNED_ID,
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    if (!first.ok) throw new Error("expected first assignment to succeed");

    // Eligibility is domain-level (Document 06 §44 "may only be assigned to
    // a domain its capabilities support"), not station-specific — Geckon's
    // capability targets FIELDWORKS_BENCH but its `validDomain` is still
    // WORKSHOP, so it is eligible for a WORKSHOP assignment at any
    // station. That makes this the right pair to prove *capacity*
    // (PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION = 1) specifically,
    // independent of the Task 05.6 station-targeting check.
    const second = assignCatchmon(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-assign-2"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: GECKON_OWNED_ID,
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("WORKSHOP_SUPPORT_FULL");
  });

  it("safely reassigns: leaving a station frees its support slot", () => {
    const assigned = assignCatchmon(
      baseState(),
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: FLAMAROX_OWNED_ID,
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok) throw new Error("expected assignment to succeed");

    const unassigned = assignCatchmon(
      assigned.value.nextState,
      createCommand(
        CommandId.from("cmd-unassign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: FLAMAROX_OWNED_ID,
          assignment: { kind: "UNASSIGNED" },
        },
        new FakeClock(0),
      ),
    );
    expect(unassigned.ok).toBe(true);
    if (!unassigned.ok) return;
    expect(
      unassigned.value.nextState.crafting.stations[PROVISION_STATION_ID]!
        .supportCatchmonIds,
    ).toEqual([]);
    expect(
      unassigned.value.nextState.catchmons.ownedCatchmons[FLAMAROX_OWNED_ID]!
        .currentAssignment,
    ).toEqual({ kind: "UNASSIGNED" });
  });

  it("assigns an eligible Catchmon to the one Shop Floor support slot", () => {
    const result = assignCatchmon(
      baseState(),
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: EMBERYNN_OWNED_ID,
          assignment: {
            kind: "SHOP_FLOOR",
            slotId: SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
          },
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.nextState.shop.shopFloorSupportCatchmonIds).toEqual([
      EMBERYNN_OWNED_ID,
    ]);
  });

  it("fails with EXPEDITION_NOT_FOUND since no expedition exists yet (Phase 6)", () => {
    const result = assignCatchmon(
      baseState(),
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: deriveInitialOwnedCatchmonId("Aquilor"),
          assignment: {
            kind: "EXPEDITION",
            expeditionId: "does-not-exist" as never,
          },
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("EXPEDITION_NOT_FOUND");
  });

  it("fails with CATCHMON_NOT_FOUND for an unknown owned Catchmon", () => {
    const result = assignCatchmon(
      baseState(),
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: "does-not-exist" as never,
          assignment: { kind: "UNASSIGNED" },
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CATCHMON_NOT_FOUND");
  });
});
