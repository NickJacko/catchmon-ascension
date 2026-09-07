// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toDurationMs } from "../../core/math/duration.ts";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import {
  createAscensionTestCatalog,
  FakeClock,
} from "../../test/helpers/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import { createJourneyOfflineReconciliationPass } from "./journey-offline-reconciliation-pass.ts";
import { reconcileGameState } from "./reconcile-game-state.ts";

const catalog = createAscensionTestCatalog();

const CONFIG = {
  clearsPerHour: 20,
  efficiencyBps: 5_000,
  maxHours: 8,
};
const pass = createJourneyOfflineReconciliationPass(CONFIG);

const MS_PER_HOUR = 3_600_000;

// Stage 1 (`vulkankrater-stage-1`, order 0): coinReward 20, echoChargeReward 10.
const STAGE_1_COIN_REWARD = 20;
const STAGE_1_ECHO_CHARGE_REWARD = 10;

function freshState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

function stateAtStableCheckpoint(stageIndex: number): GameState {
  const base = freshState();
  return {
    ...base,
    journey: { ...base.journey, stableFarmStageIndex: stageIndex },
  };
}

describe("createJourneyOfflineReconciliationPass", () => {
  it("is a no-op when no normal stage has ever been cleared (stableFarmStageIndex is -1)", () => {
    const state = freshState();
    expect(state.journey.stableFarmStageIndex).toBe(-1);
    const outcome = pass(
      state,
      toDurationMs(4 * MS_PER_HOUR),
      toTimestampMs(4 * MS_PER_HOUR),
      catalog,
    );
    expect(outcome.nextState).toBe(state);
    expect(outcome.events).toEqual([]);
  });

  it("is a no-op for a sub-clear elapsed duration (fewer than 1 clear)", () => {
    const state = stateAtStableCheckpoint(0);
    // 1 minute offline, at 20 clears/hour * 50% efficiency = 10 clears/hour
    // -> far less than one clear.
    const outcome = pass(
      state,
      toDurationMs(60_000),
      toTimestampMs(60_000),
      catalog,
    );
    expect(outcome.nextState).toBe(state);
    expect(outcome.events).toEqual([]);
  });

  it("grants Coins and Echo Charges for each computed clear at the stable farm checkpoint stage", () => {
    const state = stateAtStableCheckpoint(0);
    // 1 hour offline: 20 clears/hour * 50% efficiency = 10 clears.
    const outcome = pass(
      state,
      toDurationMs(MS_PER_HOUR),
      toTimestampMs(MS_PER_HOUR),
      catalog,
    );
    const expectedClears = 10;
    expect(outcome.nextState.economy.coins).toBe(
      state.economy.coins + expectedClears * STAGE_1_COIN_REWARD,
    );
    expect(outcome.nextState.forge.echoCharges).toBe(
      state.forge.echoCharges + expectedClears * STAGE_1_ECHO_CHARGE_REWARD,
    );
    expect(outcome.events).toEqual([
      {
        kind: "JOURNEY_OFFLINE_PROGRESS",
        stageId: expect.stringContaining("vulkankrater-stage-1"),
        clears: expectedClears,
        coinsGained: expectedClears * STAGE_1_COIN_REWARD,
        echoChargesGained: expectedClears * STAGE_1_ECHO_CHARGE_REWARD,
      },
    ]);
  });

  it("caps elapsed offline time at maxHours regardless of how long the player was actually away", () => {
    const state = stateAtStableCheckpoint(0);
    const cappedOutcome = pass(
      state,
      toDurationMs(CONFIG.maxHours * MS_PER_HOUR),
      toTimestampMs(CONFIG.maxHours * MS_PER_HOUR),
      catalog,
    );
    // 30 days offline must yield exactly the same result as maxHours offline.
    const farOutcome = pass(
      state,
      toDurationMs(30 * 24 * MS_PER_HOUR),
      toTimestampMs(30 * 24 * MS_PER_HOUR),
      catalog,
    );
    expect(farOutcome.nextState.economy.coins).toBe(
      cappedOutcome.nextState.economy.coins,
    );
    expect(farOutcome.nextState.forge.echoCharges).toBe(
      cappedOutcome.nextState.forge.echoCharges,
    );
  });

  it("is exactly-once under reconcileGameState: reconciling twice at the same timestamp does not double-grant", () => {
    const state = stateAtStableCheckpoint(0);
    const now = toTimestampMs(MS_PER_HOUR);
    const first = reconcileGameState(state, now, catalog, [pass]);
    const second = reconcileGameState(first.nextState, now, catalog, [pass]);
    expect(second.nextState.economy.coins).toBe(first.nextState.economy.coins);
    expect(second.nextState.forge.echoCharges).toBe(
      first.nextState.forge.echoCharges,
    );
    expect(second.events).toEqual([]);
  });
});
