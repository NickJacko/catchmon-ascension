// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId, type OwnedCatchmonId } from "../../../core/ids/index.ts";
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
  AQUILOR_SPECIES_ID,
  COMPONENT_HUNT_ROUTE_ID,
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
  SLICE_PRODUCT_04_ID,
  SLICE_RESOURCE_A_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../../domain/journey/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  createExpeditionReconciliationPass,
  type ExpeditionRewardConfig,
} from "../../reconciliation/expedition-reconciliation-pass.ts";
import { reconcileGameState } from "../../reconciliation/reconcile-game-state.ts";
import { createStartExpeditionHandler } from "./start-expedition.ts";
import { createDeclineEncounterHandler } from "./decline-encounter.ts";

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
const declineEncounter = createDeclineEncounterHandler();

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

function statePendingEncounter(bringCaptureAid: boolean): GameState {
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
      { routeId: DISCOVERY_SURVEY_ROUTE_ID, leadCatchmonId, bringCaptureAid },
      new FakeClock(0),
    ),
  );
  if (!started.ok) throw new Error(JSON.stringify(started.error));
  const durationMs = SLICE_ROUTE_DURATION_MS[DISCOVERY_SURVEY_ROUTE_ID]!;
  const now = toTimestampMs(
    started.value.nextState.meta.createdAtMs + durationMs,
  );
  return reconcileGameState(started.value.nextState, now, catalog, [
    reconciliationPass,
  ]).nextState;
}

describe("DECLINE_ENCOUNTER", () => {
  it("resolves the encounter as DECLINED without changing discovery status or capture protection", () => {
    const state = statePendingEncounter(false);
    const encounter = Object.values(state.world.encounterOpportunities)[0]!;

    const result = declineEncounter(
      state,
      createCommand(
        CommandId.from("cmd-decline"),
        "DECLINE_ENCOUNTER",
        { encounterId: encounter.encounterId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const resolved =
      result.value.nextState.world.encounterOpportunities[
        encounter.encounterId
      ]!;
    expect(resolved.status).toBe("RESOLVED");
    expect(resolved.resolution).toBe("DECLINED");
    expect(
      result.value.nextState.world.discoveryStates[encounter.targetLineId],
    ).toBe(state.world.discoveryStates[encounter.targetLineId]);
    expect(result.value.events).toEqual([
      { kind: "ENCOUNTER_DECLINED", encounterId: encounter.encounterId },
    ]);
  });

  it("releases an unused reserved Capture Aid back to available inventory", () => {
    const state = statePendingEncounter(true);
    const encounter = Object.values(state.world.encounterOpportunities)[0]!;
    expect(
      getAvailableQuantity(
        state.inventory,
        productItemId(SLICE_PRODUCT_04_ID, "STANDARD"),
      ),
    ).toBe(0);

    const result = declineEncounter(
      state,
      createCommand(
        CommandId.from("cmd-decline"),
        "DECLINE_ENCOUNTER",
        { encounterId: encounter.encounterId },
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

  it("rejects declining an already-resolved encounter", () => {
    const state = statePendingEncounter(false);
    const encounter = Object.values(state.world.encounterOpportunities)[0]!;
    const first = declineEncounter(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "DECLINE_ENCOUNTER",
        { encounterId: encounter.encounterId },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = declineEncounter(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "DECLINE_ENCOUNTER",
        { encounterId: encounter.encounterId },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("ENCOUNTER_ALREADY_RESOLVED");
  });
});
