/**
 * Design owner: Document 15 Phase 6 Exit Gate ("prepare -> expedition ->
 * offline time -> result exactly once -> trace/encounter -> capture ->
 * collection update -> new Catchmon available", reload tested "at every
 * major boundary").
 *
 * A dev-only, headless proof that the full Phase 6 world/expedition/
 * discovery/capture loop works end-to-end through actual Game Engine
 * commands and the real expedition reconciliation pass — no React, no
 * Pixi. Mirrors `catchmon-dev-harness.ts`'s mutable-clock/step-logging
 * pattern.
 *
 * RELOAD PROOF: `simulateReload` performs a real `JSON.parse(JSON.
 * stringify(state))` round-trip — GameState must remain plain serializable
 * data (CLAUDE.md §23), and branded IDs are plain strings/numbers at
 * runtime (`core/ids/brand.ts`), so this is a faithful proxy for "close
 * the app, reopen it" without needing the full Dexie/IndexedDB stack this
 * headless harness doesn't otherwise touch. Applied after every major
 * boundary the Phase 6 Exit Gate names, with an assertion immediately
 * after each reload that nothing observable changed — proving "reload
 * must never reroll" for the route outcome, the Encounter's target
 * species, and the capture attempt's own inputs.
 *
 * HARNESS-ONLY CAPTURE CHANCE: this harness's capture-chance config sets
 * base/floor/ceiling to a guaranteed 100% specifically so the exit gate
 * deterministically demonstrates the SUCCESS path end-to-end (same
 * "harness setup data" precedent as `catchmon-dev-harness.ts` directly
 * setting a Catchmon's level to the evolution threshold rather than
 * grinding XP naturally). The FAILURE path is already proven separately
 * and thoroughly by `attempt-capture.test.ts`'s `guaranteedFailure`
 * config — this harness does not need to re-prove it.
 */
import { CommandId } from "../../core/ids/index.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../../core/time/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { toBasisPoints } from "../../core/math/basis-points.ts";
import { toProbabilityBps } from "../../core/math/probability.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
  type GameState,
} from "../../domain/game-state/index.ts";
import { addToInventory, productItemId } from "../../domain/inventory/index.ts";
import {
  AQUARIL_LINE_ID,
  AQUARIL_SPECIES_ID,
  AQUILOR_SPECIES_ID,
  COMPONENT_HUNT_ROUTE_ID,
  DISCOVERY_SURVEY_ROUTE_ID,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
  PROVISIONAL_COMPONENT_HUNT_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_DISCOVERY_SURVEY_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY,
  PROVISIONAL_XP_PER_EXPEDITION_COMPLETION,
  PROVISIONAL_XP_PER_LEVEL,
  SLICE_PRODUCT_04_ID,
  SLICE_RESOURCE_A_ID,
  SLICE_ROUTE_DURATION_MS,
  SUPPLY_RUN_ROUTE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../content/vertical-slice/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../domain/journey/index.ts";
import { createCommand } from "../engine/index.ts";
import { createStartExpeditionHandler } from "../commands/expeditions/start-expedition.ts";
import { createAttemptCaptureHandler } from "../commands/expeditions/attempt-capture.ts";
import {
  createExpeditionPlanningQueries,
  previewCaptureChance,
  type CaptureChanceConfig,
} from "../queries/expeditions/index.ts";
import {
  createExpeditionReconciliationPass,
  reconcileGameState,
  type ExpeditionRewardConfig,
} from "../reconciliation/index.ts";
import {
  type DevHarnessLogEntry,
  type DevHarnessResult,
} from "./crafting-dev-harness.ts";

function createMutableClock(startMs: number): {
  clock: Clock;
  set(ms: number): void;
} {
  let current: TimestampMs = toTimestampMs(startMs);
  return {
    clock: { nowMs: () => current },
    set(ms: number) {
      current = toTimestampMs(ms);
    },
  };
}

/** A real serialization round-trip — see module doc "RELOAD PROOF". */
function simulateReload(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

const HARNESS_GUARANTEED_CAPTURE_CHANCE: CaptureChanceConfig = {
  base: toProbabilityBps(10000),
  aidBonus: toBasisPoints(0),
  protectionBonusPerFailure: toBasisPoints(0),
  floor: toProbabilityBps(10000),
  ceiling: toProbabilityBps(10000),
};

export function runExpeditionDevHarness(): DevHarnessResult {
  const log: DevHarnessLogEntry[] = [];
  const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
  const { clock, set: setClock } = createMutableClock(0);
  let cmdCounter = 0;
  const nextCommandId = (label: string) => {
    cmdCounter += 1;
    return CommandId.from(`expedition-harness-${label}-${String(cmdCounter)}`);
  };

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
  const startExpedition = createStartExpeditionHandler(
    catalog,
    SLICE_PRODUCT_04_ID,
    SLICE_ROUTE_DURATION_MS,
    PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
    PROVISIONAL_CAPABILITY_MAGNITUDES,
  );
  const attemptCapture = createAttemptCaptureHandler(
    catalog,
    HARNESS_GUARANTEED_CAPTURE_CHANCE,
  );
  const planningQueries = createExpeditionPlanningQueries(
    catalog,
    SLICE_PRODUCT_04_ID,
    SLICE_ROUTE_DURATION_MS,
    PROVISIONAL_CAPABILITY_MAGNITUDES,
  );

  // 1. PREPARE: fresh state, stock a Capture Aid, confirm the Lead is
  // eligible/unassigned and the Discovery Survey route is available.
  // The Expeditions-unlocked milestone is given as already-satisfied
  // harness setup data here (Phase R6's own Journey-completion flow that
  // sets this milestone is proven separately by `attempt-stage.test.ts`)
  // — this Phase 6 harness's job is proving the expedition/discovery/
  // capture loop, not re-proving Phase R6's unlock mechanism.
  let state = createInitialGameState(catalog, clock, toSeed(1));
  state = {
    ...state,
    inventory: addToInventory(
      state.inventory,
      productItemId(SLICE_PRODUCT_04_ID, "STANDARD"),
      1,
    ),
    progression: {
      ...state.progression,
      unlockedSystemIds: [EXPEDITIONS_SYSTEM_MILESTONE],
    },
  };
  const leadCatchmonId = deriveInitialOwnedCatchmonId(AQUILOR_SPECIES_ID);
  const eligibility = planningQueries.leadEligibility(state, leadCatchmonId);
  if (!eligibility.eligible) {
    throw new Error(
      `expected Aquilor to be eligible as Lead: ${JSON.stringify(eligibility)}`,
    );
  }
  const routeAvailable = planningQueries
    .availableRoutes(state)
    .find((r) => r.routeId === DISCOVERY_SURVEY_ROUTE_ID);
  if (!routeAvailable?.available) {
    throw new Error("expected the Discovery Survey route to be available");
  }
  const loadout = planningQueries.loadoutCompatibility(
    state,
    DISCOVERY_SURVEY_ROUTE_ID,
  );
  if (!loadout?.canBringCaptureAid) {
    throw new Error("expected the Capture Aid to be bringable");
  }
  log.push({
    step: "PREPARE",
    detail: `leadEligible=true, routeAvailable=true, canBringCaptureAid=true`,
  });

  // 2. EXPEDITION: start it with the Capture Aid.
  const started = startExpedition(
    state,
    createCommand(
      nextCommandId("start"),
      "START_EXPEDITION",
      {
        routeId: DISCOVERY_SURVEY_ROUTE_ID,
        leadCatchmonId,
        bringCaptureAid: true,
      },
      clock,
    ),
  );
  if (!started.ok) {
    throw new Error(
      `expected expedition to start: ${JSON.stringify(started.error)}`,
    );
  }
  state = started.value.nextState;
  const startedExpeditionSnapshot = Object.values(
    state.expeditions.expeditions,
  )[0]!;
  const expeditionId = startedExpeditionSnapshot.expeditionId;
  log.push({
    step: "EXPEDITION_STARTED",
    detail: `expeditionId=${expeditionId}, leadDiscoveryBoostBonus=${String(startedExpeditionSnapshot.leadDiscoveryBoostBonus)}, completesAtMs=${String(startedExpeditionSnapshot.completesAtMs)}`,
  });

  // RELOAD BOUNDARY #1: after start, before offline time passes.
  state = simulateReload(state);
  const reloadedExpedition = state.expeditions.expeditions[expeditionId]!;
  if (
    reloadedExpedition.completesAtMs !==
      startedExpeditionSnapshot.completesAtMs ||
    reloadedExpedition.resultSeed !== startedExpeditionSnapshot.resultSeed ||
    reloadedExpedition.leadDiscoveryBoostBonus !==
      startedExpeditionSnapshot.leadDiscoveryBoostBonus
  ) {
    throw new Error(
      "expected the expedition snapshot to survive a reload unchanged",
    );
  }
  log.push({
    step: "RELOAD_AFTER_START",
    detail:
      "expedition snapshot (completesAtMs/resultSeed/leadDiscoveryBoostBonus) identical after reload",
  });

  // 3. OFFLINE TIME: advance the clock past completion and reconcile.
  setClock(reloadedExpedition.completesAtMs);
  const completionReport = reconcileGameState(
    state,
    reloadedExpedition.completesAtMs,
    catalog,
    [reconciliationPass],
  );
  state = completionReport.nextState;
  if (state.expeditions.activeExpeditionIds.length !== 0) {
    throw new Error("expected the expedition to leave activeExpeditionIds");
  }
  log.push({
    step: "OFFLINE_TIME_RECONCILED",
    detail: `events=${JSON.stringify(completionReport.events.map((e) => e.kind))}`,
  });

  // 4. RESULT EXACTLY ONCE: reconciling again must be a genuine no-op.
  const secondReconcile = reconcileGameState(
    state,
    toTimestampMs(reloadedExpedition.completesAtMs + 60_000),
    catalog,
    [reconciliationPass],
  );
  if (secondReconcile.events.length !== 0) {
    throw new Error(
      "expected reconciling an already-completed expedition to produce no events",
    );
  }
  if (
    JSON.stringify(secondReconcile.nextState.inventory) !==
    JSON.stringify(state.inventory)
  ) {
    throw new Error(
      "expected a second reconciliation pass to leave inventory unchanged (exactly-once)",
    );
  }
  log.push({
    step: "RESULT_EXACTLY_ONCE",
    detail:
      "a second reconciliation pass produced zero events and no inventory change",
  });

  // 5. TRACE/ENCOUNTER: exactly one Encounter Opportunity, targeting
  // Aquaril (the only unowned candidate in this route's pool), line
  // advanced to ENCOUNTERED.
  const encounters = Object.values(state.world.encounterOpportunities);
  if (encounters.length !== 1) {
    throw new Error(
      `expected exactly one encounter, got ${String(encounters.length)}`,
    );
  }
  const encounter = encounters[0]!;
  if (encounter.targetSpeciesId !== AQUARIL_SPECIES_ID) {
    throw new Error(
      `expected the encounter to target Aquaril, got ${encounter.targetSpeciesId}`,
    );
  }
  if (state.world.discoveryStates[AQUARIL_LINE_ID] !== "ENCOUNTERED") {
    throw new Error("expected Aquaril's line to be ENCOUNTERED");
  }
  log.push({
    step: "TRACE_ENCOUNTER",
    detail: `encounterId=${encounter.encounterId}, targetSpeciesId=${encounter.targetSpeciesId}, discoveryStatus=ENCOUNTERED`,
  });

  // RELOAD BOUNDARY #2: after completion/encounter creation, before capture.
  const chanceBeforeReload = previewCaptureChance(
    state,
    encounter.encounterId,
    true,
    HARNESS_GUARANTEED_CAPTURE_CHANCE,
  );
  state = simulateReload(state);
  const reloadedEncounter =
    state.world.encounterOpportunities[encounter.encounterId]!;
  if (
    reloadedEncounter.targetSpeciesId !== encounter.targetSpeciesId ||
    reloadedEncounter.discoveryBoostBonus !== encounter.discoveryBoostBonus
  ) {
    throw new Error(
      "expected the encounter's target species/discoveryBoostBonus to survive a reload unchanged",
    );
  }
  const chanceAfterReload = previewCaptureChance(
    state,
    encounter.encounterId,
    true,
    HARNESS_GUARANTEED_CAPTURE_CHANCE,
  );
  if (chanceBeforeReload !== chanceAfterReload) {
    throw new Error(
      "expected the previewed capture chance (a capture attempt's own inputs) to be identical before/after reload",
    );
  }
  log.push({
    step: "RELOAD_AFTER_ENCOUNTER",
    detail: `encounter target/discoveryBoost identical after reload; capture chance preview unchanged (${String(chanceBeforeReload)} bps)`,
  });

  // 6. CAPTURE: guaranteed-success harness config resolves it now.
  const captured = attemptCapture(
    state,
    createCommand(
      nextCommandId("capture"),
      "ATTEMPT_CAPTURE",
      { encounterId: encounter.encounterId, useAid: true },
      clock,
    ),
  );
  if (!captured.ok) {
    throw new Error(
      `expected the capture to succeed: ${JSON.stringify(captured.error)}`,
    );
  }
  state = captured.value.nextState;
  if (state.world.discoveryStates[AQUARIL_LINE_ID] !== "OWNED") {
    throw new Error("expected Aquaril's line to become OWNED");
  }
  log.push({
    step: "CAPTURE",
    detail: `resolution=${state.world.encounterOpportunities[encounter.encounterId]!.resolution}, discoveryStatus=OWNED`,
  });

  // RELOAD BOUNDARY #3: after capture, before the final assertions.
  state = simulateReload(state);

  // 7. COLLECTION UPDATE / NEW CATCHMON AVAILABLE.
  const newOwned = Object.values(state.catchmons.ownedCatchmons).find(
    (owned) => owned.currentSpeciesId === AQUARIL_SPECIES_ID,
  );
  if (!newOwned) {
    throw new Error("expected a new owned Catchmon for Aquaril after capture");
  }
  if (newOwned.currentAssignment.kind !== "UNASSIGNED") {
    throw new Error(
      "expected the newly captured Catchmon to be available (UNASSIGNED)",
    );
  }
  if (!state.catchmons.ownedCatchmonIds.includes(newOwned.ownedCatchmonId)) {
    throw new Error(
      "expected the new owned Catchmon to appear in the collection's ownedCatchmonIds",
    );
  }
  log.push({
    step: "COLLECTION_UPDATE_NEW_CATCHMON_AVAILABLE",
    detail: `ownedCatchmonId=${newOwned.ownedCatchmonId}, currentAssignment=UNASSIGNED, survived reload`,
  });

  return { log, finalState: state, catalog };
}
