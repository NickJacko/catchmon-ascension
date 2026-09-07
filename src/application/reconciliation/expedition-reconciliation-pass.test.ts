// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  CommandId,
  type OwnedCatchmonId,
  type RouteId,
} from "../../core/ids/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { toProbabilityBps } from "../../core/math/probability.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import { getAvailableQuantity } from "../../domain/inventory/index.ts";
import {
  AQUARIL_SPECIES_ID,
  AQUILOR_SPECIES_ID,
  COMPONENT_HUNT_ROUTE_ID,
  DISCOVERY_SURVEY_ROUTE_ID,
  GECKON_SPECIES_ID,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
  PROVISIONAL_COMPONENT_HUNT_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_DISCOVERY_SURVEY_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_XP_PER_EXPEDITION_COMPLETION,
  PROVISIONAL_XP_PER_LEVEL,
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  SLICE_COMPONENT_A_ID,
  SLICE_PRODUCT_04_ID,
  SLICE_RESOURCE_A_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../content/vertical-slice/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../domain/journey/index.ts";
import { createCommand } from "../engine/index.ts";
import { createStartExpeditionHandler } from "../commands/expeditions/start-expedition.ts";
import { reconcileGameState } from "./reconcile-game-state.ts";
import {
  createExpeditionReconciliationPass,
  type ExpeditionRewardConfig,
} from "./expedition-reconciliation-pass.ts";

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

function baseState(): GameState {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
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

function startedState(
  routeId: RouteId,
  leadSpeciesId: string,
  commandId = "cmd-1",
): { state: GameState; leadCatchmonId: OwnedCatchmonId } {
  const state = baseState();
  const leadCatchmonId = ownedCatchmonIdFor(state, leadSpeciesId);
  const result = startExpedition(
    state,
    createCommand(
      CommandId.from(commandId),
      "START_EXPEDITION",
      { routeId, leadCatchmonId, bringCaptureAid: false },
      new FakeClock(0),
    ),
  );
  if (!result.ok) throw new Error(JSON.stringify(result.error));
  return { state: result.value.nextState, leadCatchmonId };
}

describe("expedition reconciliation — Supply Run", () => {
  it("delivers the routine reward, releases the Lead, and awards XP once the route completes", () => {
    const { state, leadCatchmonId } = startedState(
      SUPPLY_RUN_ROUTE_ID,
      AQUILOR_SPECIES_ID,
    );
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[SUPPLY_RUN_ROUTE_ID]!;
    const now = toTimestampMs(state.meta.createdAtMs + durationMs);

    const report = reconcileGameState(state, now, catalog, [pass]);

    expect(
      getAvailableQuantity(
        report.nextState.inventory,
        catalog.resources.get(SLICE_RESOURCE_A_ID)!.itemId,
      ),
    ).toBe(PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY);

    expect(report.nextState.expeditions.activeExpeditionIds).toEqual([]);
    const completed = Object.values(
      report.nextState.expeditions.expeditions,
    )[0]!;
    const expeditionId = completed.expeditionId;
    expect(completed.status).toBe("COMPLETED");
    expect(completed.result?.routineRewards).toEqual([
      {
        itemId: catalog.resources.get(SLICE_RESOURCE_A_ID)!.itemId,
        quantity: 4,
      },
    ]);
    expect(completed.result?.encounterId).toBeUndefined();

    const lead = report.nextState.catchmons.ownedCatchmons[leadCatchmonId]!;
    expect(lead.currentAssignment).toEqual({ kind: "UNASSIGNED" });
    expect(lead.xp).toBe(PROVISIONAL_XP_PER_EXPEDITION_COMPLETION);

    expect(report.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: "EXPEDITION_COMPLETED", expeditionId }),
      ]),
    );
  });

  it("does nothing while the expedition is still in progress", () => {
    const { state } = startedState(SUPPLY_RUN_ROUTE_ID, AQUILOR_SPECIES_ID);
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const notYet = toTimestampMs(state.meta.createdAtMs + 1);

    const report = reconcileGameState(state, notYet, catalog, [pass]);
    expect(report.nextState.expeditions.activeExpeditionIds).toHaveLength(1);
    expect(report.events).toEqual([]);
  });

  it("is exactly-once: reconciling again after completion does not re-grant the reward", () => {
    const { state } = startedState(SUPPLY_RUN_ROUTE_ID, AQUILOR_SPECIES_ID);
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[SUPPLY_RUN_ROUTE_ID]!;
    const completesAtMs = toTimestampMs(state.meta.createdAtMs + durationMs);

    const first = reconcileGameState(state, completesAtMs, catalog, [pass]);
    const second = reconcileGameState(
      first.nextState,
      toTimestampMs(completesAtMs + 5000),
      catalog,
      [pass],
    );

    expect(
      getAvailableQuantity(
        second.nextState.inventory,
        catalog.resources.get(SLICE_RESOURCE_A_ID)!.itemId,
      ),
    ).toBe(PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY);
    expect(second.events).toEqual([]);
  });
});

describe("expedition reconciliation — Discovery Survey", () => {
  it("creates exactly one Encounter Opportunity targeting the unowned candidate (Aquaril), advancing its discovery status", () => {
    const { state } = startedState(
      DISCOVERY_SURVEY_ROUTE_ID,
      AQUILOR_SPECIES_ID,
    );
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[DISCOVERY_SURVEY_ROUTE_ID]!;
    const now = toTimestampMs(state.meta.createdAtMs + durationMs);

    const report = reconcileGameState(state, now, catalog, [pass]);

    const encounters = Object.values(
      report.nextState.world.encounterOpportunities,
    );
    expect(encounters).toHaveLength(1);
    const encounter = encounters[0]!;
    expect(encounter.targetSpeciesId).toBe(AQUARIL_SPECIES_ID);
    expect(encounter.status).toBe("PENDING");
    expect(encounter.discoveryBoostBonus).toBeGreaterThan(0);

    expect(report.nextState.world.discoveryStates[encounter.targetLineId]).toBe(
      "ENCOUNTERED",
    );

    const completed = Object.values(
      report.nextState.expeditions.expeditions,
    )[0]!;
    expect(completed.result?.encounterId).toBe(encounter.encounterId);
    expect(completed.pendingEncounterId).toBe(encounter.encounterId);
  });

  it("never targets the already-owned Geckon while Aquaril remains uncaptured", () => {
    const { state } = startedState(
      DISCOVERY_SURVEY_ROUTE_ID,
      AQUILOR_SPECIES_ID,
      "cmd-a",
    );
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[DISCOVERY_SURVEY_ROUTE_ID]!;
    const now = toTimestampMs(state.meta.createdAtMs + durationMs);
    const report = reconcileGameState(state, now, catalog, [pass]);
    const encounter = Object.values(
      report.nextState.world.encounterOpportunities,
    )[0]!;
    expect(encounter.targetSpeciesId).not.toBe(GECKON_SPECIES_ID);
  });

  it("is deterministic: the same resultSeed always creates an encounter for the same target species, regardless of when reconciliation runs", () => {
    const { state } = startedState(
      DISCOVERY_SURVEY_ROUTE_ID,
      AQUILOR_SPECIES_ID,
    );
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[DISCOVERY_SURVEY_ROUTE_ID]!;

    const early = reconcileGameState(
      state,
      toTimestampMs(state.meta.createdAtMs + durationMs),
      catalog,
      [pass],
    );
    const late = reconcileGameState(
      state,
      toTimestampMs(state.meta.createdAtMs + durationMs + 60_000),
      catalog,
      [pass],
    );

    const earlyTarget = Object.values(
      early.nextState.world.encounterOpportunities,
    )[0]!.targetSpeciesId;
    const lateTarget = Object.values(
      late.nextState.world.encounterOpportunities,
    )[0]!.targetSpeciesId;
    expect(earlyTarget).toBe(lateTarget);
  });
});

describe("expedition reconciliation — Component Hunt", () => {
  it("guarantees the special-component bonus once the protection threshold is met, even at a low chance", () => {
    const { state } = startedState(COMPONENT_HUNT_ROUTE_ID, AQUILOR_SPECIES_ID);
    const zeroChanceConfig: ExpeditionRewardConfig = {
      ...rewardConfig,
      componentHuntBonusChance: toProbabilityBps(0),
    };
    const guaranteedState: GameState = {
      ...state,
      world: {
        ...state.world,
        componentHuntBonusProtection: {
          [COMPONENT_HUNT_ROUTE_ID]:
            PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
        },
      },
    };
    const pass = createExpeditionReconciliationPass(zeroChanceConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[COMPONENT_HUNT_ROUTE_ID]!;
    const now = toTimestampMs(guaranteedState.meta.createdAtMs + durationMs);

    const report = reconcileGameState(guaranteedState, now, catalog, [pass]);

    expect(
      getAvailableQuantity(
        report.nextState.inventory,
        catalog.components.get(SLICE_COMPONENT_A_ID)!.itemId,
      ),
    ).toBe(1);
    expect(
      report.nextState.world.componentHuntBonusProtection[
        COMPONENT_HUNT_ROUTE_ID
      ],
    ).toBe(0);
  });

  it("never grants the bonus at 0% chance below the protection threshold", () => {
    const { state } = startedState(COMPONENT_HUNT_ROUTE_ID, AQUILOR_SPECIES_ID);
    const zeroChanceConfig: ExpeditionRewardConfig = {
      ...rewardConfig,
      componentHuntBonusChance: toProbabilityBps(0),
    };
    const pass = createExpeditionReconciliationPass(zeroChanceConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[COMPONENT_HUNT_ROUTE_ID]!;
    const now = toTimestampMs(state.meta.createdAtMs + durationMs);

    const report = reconcileGameState(state, now, catalog, [pass]);

    expect(
      getAvailableQuantity(
        report.nextState.inventory,
        catalog.components.get(SLICE_COMPONENT_A_ID)!.itemId,
      ),
    ).toBe(0);
    expect(
      report.nextState.world.componentHuntBonusProtection[
        COMPONENT_HUNT_ROUTE_ID
      ],
    ).toBe(1);
  });

  it("never creates an encounter (Component Hunt has no encounterPool)", () => {
    const { state } = startedState(COMPONENT_HUNT_ROUTE_ID, AQUILOR_SPECIES_ID);
    const pass = createExpeditionReconciliationPass(rewardConfig, xpConfig);
    const durationMs = SLICE_ROUTE_DURATION_MS[COMPONENT_HUNT_ROUTE_ID]!;
    const now = toTimestampMs(state.meta.createdAtMs + durationMs);

    const report = reconcileGameState(state, now, catalog, [pass]);
    expect(report.nextState.world.encounterOpportunities).toEqual({});
  });
});
