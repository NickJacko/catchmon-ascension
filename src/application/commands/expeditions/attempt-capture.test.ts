// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  CommandId,
  EncounterId,
  type OwnedCatchmonId,
} from "../../../core/ids/index.ts";
import { toBasisPoints } from "../../../core/math/basis-points.ts";
import { toProbabilityBps } from "../../../core/math/probability.ts";
import { toSeed } from "../../../core/random/index.ts";
import { toTimestampMs } from "../../../core/time/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  addToInventory,
  getAvailableQuantity,
  productItemId,
} from "../../../domain/inventory/index.ts";
import {
  AQUARIL_LINE_ID,
  AQUARIL_SPECIES_ID,
  AQUILOR_SPECIES_ID,
  DISCOVERY_SURVEY_ROUTE_ID,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
  PROVISIONAL_COMPONENT_HUNT_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_DISCOVERY_SURVEY_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_XP_PER_EXPEDITION_COMPLETION,
  PROVISIONAL_XP_PER_LEVEL,
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  COMPONENT_HUNT_ROUTE_ID,
  SLICE_PRODUCT_04_ID,
  SLICE_RESOURCE_A_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../../domain/journey/index.ts";
import { type CaptureChanceConfig } from "../../queries/expeditions/capture-queries.ts";
import { createCommand } from "../../engine/index.ts";
import {
  createExpeditionReconciliationPass,
  type ExpeditionRewardConfig,
} from "../../reconciliation/expedition-reconciliation-pass.ts";
import { reconcileGameState } from "../../reconciliation/reconcile-game-state.ts";
import { createStartExpeditionHandler } from "./start-expedition.ts";
import { createAttemptCaptureHandler } from "./attempt-capture.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const startExpedition = createStartExpeditionHandler(
  catalog,
  SLICE_PRODUCT_04_ID,
  SLICE_ROUTE_DURATION_MS,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
);
const rewardConfig: ExpeditionRewardConfig = {
  routineRewardResourceIdByRouteId: {
    [SUPPLY_RUN_ROUTE_ID]: SLICE_RESOURCE_A_ID,
    [DISCOVERY_SURVEY_ROUTE_ID]: SLICE_RESOURCE_A_ID,
    [COMPONENT_HUNT_ROUTE_ID]: SLICE_RESOURCE_A_ID,
  },
  routineRewardQuantityByRouteId: {
    [SUPPLY_RUN_ROUTE_ID]: PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY,
    [DISCOVERY_SURVEY_ROUTE_ID]:
      PROVISIONAL_DISCOVERY_SURVEY_ROUTINE_REWARD_QUANTITY,
    [COMPONENT_HUNT_ROUTE_ID]:
      PROVISIONAL_COMPONENT_HUNT_ROUTINE_REWARD_QUANTITY,
  },
  componentHuntBonusChance: toProbabilityBps(3500),
  componentHuntProtectionThreshold:
    PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
  echoChargeRewardPerCompletion: 15,
};
const xpConfig = {
  xpPerExpeditionCompletion: PROVISIONAL_XP_PER_EXPEDITION_COMPLETION,
  xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
  levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
};
const reconciliationPass = createExpeditionReconciliationPass(
  rewardConfig,
  xpConfig,
);

const guaranteedSuccess: CaptureChanceConfig = {
  base: toProbabilityBps(10000),
  aidBonus: toBasisPoints(0),
  protectionBonusPerFailure: toBasisPoints(0),
  floor: toProbabilityBps(10000),
  ceiling: toProbabilityBps(10000),
};
const guaranteedFailure: CaptureChanceConfig = {
  base: toProbabilityBps(0),
  aidBonus: toBasisPoints(0),
  protectionBonusPerFailure: toBasisPoints(0),
  floor: toProbabilityBps(0),
  ceiling: toProbabilityBps(0),
};

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

/** Runs a full Discovery Survey to completion and returns its (always Aquaril-targeting) pending encounter. */
function statePendingAquarilEncounter(bringCaptureAid = false): GameState {
  let state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  state = {
    ...state,
    progression: {
      ...state.progression,
      unlockedSystemIds: [EXPEDITIONS_SYSTEM_MILESTONE],
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
  const leadCatchmonId = ownedCatchmonIdFor(state, AQUILOR_SPECIES_ID);
  const started = startExpedition(
    state,
    createCommand(
      CommandId.from("cmd-start"),
      "START_EXPEDITION",
      {
        routeId: DISCOVERY_SURVEY_ROUTE_ID,
        leadCatchmonId,
        bringCaptureAid,
      },
      new FakeClock(0),
    ),
  );
  if (!started.ok) throw new Error(JSON.stringify(started.error));

  const durationMs = SLICE_ROUTE_DURATION_MS[DISCOVERY_SURVEY_ROUTE_ID]!;
  const now = toTimestampMs(
    started.value.nextState.meta.createdAtMs + durationMs,
  );
  const report = reconcileGameState(started.value.nextState, now, catalog, [
    reconciliationPass,
  ]);
  return report.nextState;
}

function pendingEncounterId(state: GameState) {
  const encounter = Object.values(state.world.encounterOpportunities)[0];
  if (!encounter) throw new Error("expected a pending encounter");
  return encounter.encounterId;
}

describe("ATTEMPT_CAPTURE", () => {
  it("on success: creates a new owned Catchmon, advances the line to OWNED, resets protection, and resolves the encounter", () => {
    const state = statePendingAquarilEncounter();
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedSuccess,
    );

    const result = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-capture"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: false },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const { nextState, events } = result.value;
    expect(nextState.world.discoveryStates[AQUARIL_LINE_ID]).toBe("OWNED");
    expect(nextState.world.captureProtection[AQUARIL_LINE_ID] ?? 0).toBe(0);
    expect(nextState.world.encounterOpportunities[encounterId]?.status).toBe(
      "RESOLVED",
    );
    expect(
      nextState.world.encounterOpportunities[encounterId]?.resolution,
    ).toBe("CAPTURED");

    const newOwned = Object.values(nextState.catchmons.ownedCatchmons).find(
      (owned) => owned.currentSpeciesId === AQUARIL_SPECIES_ID,
    );
    expect(newOwned).toBeDefined();
    expect(newOwned?.currentAssignment).toEqual({ kind: "UNASSIGNED" });

    expect(events).toEqual([
      expect.objectContaining({
        kind: "CAPTURE_ATTEMPTED",
        succeeded: true,
        newOwnedCatchmonId: newOwned?.ownedCatchmonId,
      }),
    ]);
  });

  it("on failure: increments capture protection, does not own the species, and resolves the encounter", () => {
    const state = statePendingAquarilEncounter();
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedFailure,
    );

    const result = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-capture"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: false },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const { nextState, events } = result.value;
    expect(nextState.world.discoveryStates[AQUARIL_LINE_ID]).toBe(
      "ENCOUNTERED",
    );
    expect(nextState.world.captureProtection[AQUARIL_LINE_ID]).toBe(1);
    expect(
      nextState.world.encounterOpportunities[encounterId]?.resolution,
    ).toBe("FAILED");
    expect(
      Object.values(nextState.catchmons.ownedCatchmons).some(
        (owned) => owned.currentSpeciesId === AQUARIL_SPECIES_ID,
      ),
    ).toBe(false);
    expect(events).toEqual([
      expect.objectContaining({ kind: "CAPTURE_ATTEMPTED", succeeded: false }),
    ]);
  });

  it("consumes the Capture Aid reservation when useAid is true, regardless of outcome", () => {
    const state = statePendingAquarilEncounter(true);
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedFailure,
    );

    const result = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-capture"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: true },
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
    ).toBe(0);
    expect(
      result.value.nextState.world.encounterOpportunities[encounterId]
        ?.captureAidUsed,
    ).toBe(true);
  });

  it("releases a reserved-but-unused Capture Aid back to available inventory once the encounter resolves (regression: it must never strand the reservation)", () => {
    const state = statePendingAquarilEncounter(true);
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedFailure,
    );

    const result = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-capture"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: false },
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
    expect(
      result.value.nextState.world.encounterOpportunities[encounterId]
        ?.captureAidUsed,
    ).toBe(false);
  });

  it("rejects useAid when no Capture Aid was reserved for the expedition", () => {
    const state = statePendingAquarilEncounter(false);
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedSuccess,
    );

    const result = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-capture"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: true },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("NO_CAPTURE_AID_RESERVED");
  });

  it("rejects a second attempt against an already-resolved encounter (exactly-once)", () => {
    const state = statePendingAquarilEncounter();
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedFailure,
    );

    const first = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: false },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = attemptCapture(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: false },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("ENCOUNTER_ALREADY_RESOLVED");
  });

  it("rejects capturing a line that is already owned", () => {
    const state = statePendingAquarilEncounter();
    const encounterId = pendingEncounterId(state);
    const attemptCapture = createAttemptCaptureHandler(
      catalog,
      guaranteedSuccess,
    );
    const captured = attemptCapture(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "ATTEMPT_CAPTURE",
        { encounterId, useAid: false },
        new FakeClock(0),
      ),
    );
    expect(captured.ok).toBe(true);
    if (!captured.ok) return;

    // Simulate a second Discovery Survey producing a fresh encounter that
    // happens to (still) target the now-owned Aquaril line — should be
    // rejected for ATTEMPT_CAPTURE regardless of its own pending status.
    const secondEncounterId = EncounterId.from("encounter-second");
    const priorEncounter =
      captured.value.nextState.world.encounterOpportunities[encounterId]!;
    const stateWithSecondEncounter: GameState = {
      ...captured.value.nextState,
      world: {
        ...captured.value.nextState.world,
        encounterOpportunities: {
          ...captured.value.nextState.world.encounterOpportunities,
          [secondEncounterId]: {
            encounterId: secondEncounterId,
            expeditionId: priorEncounter.expeditionId,
            routeId: priorEncounter.routeId,
            targetLineId: priorEncounter.targetLineId,
            targetSpeciesId: priorEncounter.targetSpeciesId,
            discoveryBoostBonus: priorEncounter.discoveryBoostBonus,
            status: "PENDING",
            createdAtMs: priorEncounter.createdAtMs,
          },
        },
      },
    };
    const result = attemptCapture(
      stateWithSecondEncounter,
      createCommand(
        CommandId.from("cmd-2"),
        "ATTEMPT_CAPTURE",
        { encounterId: secondEncounterId, useAid: false },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("TARGET_ALREADY_OWNED");
  });
});
