// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ZERO_DURATION_MS } from "../../core/math/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import {
  reconcileGameState,
  type ReconciliationPass,
} from "./reconcile-game-state.ts";

const EMPTY_CATALOG_CONTENT: GameCatalogContent = {
  products: [],
  recipes: [],
  resources: [],
  components: [],
  catchmonSpecies: [],
  catchmonLines: [],
  capabilities: [],
  elements: [],
  regions: [],
  routes: [],
  customerArchetypes: [],
  infrastructure: [],
  unlockRules: [],
  assets: [],
};

const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);

function baseState(startMs: number): GameState {
  return createInitialGameState(catalog, new FakeClock(startMs), toSeed(1));
}

const setMomentumTo10: ReconciliationPass = (state) => ({
  nextState: { ...state, shop: { ...state.shop, momentum: 10 } },
  events: [],
});

const doubleMomentum: ReconciliationPass = (state) => ({
  nextState: {
    ...state,
    shop: { ...state.shop, momentum: state.shop.momentum * 2 },
  },
  events: [],
});

const incrementMomentumOncePerElapsed: ReconciliationPass = (
  state,
  elapsedMs,
) => {
  if (elapsedMs === ZERO_DURATION_MS) {
    return { nextState: state, events: [] };
  }
  return {
    nextState: {
      ...state,
      shop: { ...state.shop, momentum: state.shop.momentum + 1 },
    },
    events: [],
  };
};

describe("reconcileGameState", () => {
  it("is a no-op when now equals lastActiveAtMs (zero elapsed time)", () => {
    const state = baseState(1000);
    const report = reconcileGameState(state, toTimestampMs(1000), catalog);

    expect(report.elapsedMs).toBe(0);
    expect(report.events).toEqual([]);
    expect(report.nextState).toEqual(state);
  });

  it("advances meta.lastActiveAtMs to now and reports the elapsed duration", () => {
    const state = baseState(1000);
    const report = reconcileGameState(state, toTimestampMs(5000), catalog);

    expect(report.elapsedMs).toBe(4000);
    expect(report.nextState.meta.lastActiveAtMs).toBe(5000);
    // Reconciliation is not a durable command: it must not touch revision.
    expect(report.nextState.meta.revision).toBe(state.meta.revision);
  });

  it("handles a clock moved backwards gracefully (Document 14 §127) instead of throwing", () => {
    const state = baseState(5000);
    const report = reconcileGameState(state, toTimestampMs(1000), catalog);

    expect(report.elapsedMs).toBe(0);
    expect(report.events).toEqual([
      { kind: "CLOCK_MOVED_BACKWARDS", lastActiveAtMs: 5000, now: 1000 },
    ]);
    expect(report.nextState).toEqual(state);
  });

  it("runs registered passes in deterministic array order", () => {
    const state = baseState(1000);

    const forward = reconcileGameState(state, toTimestampMs(2000), catalog, [
      setMomentumTo10,
      doubleMomentum,
    ]);
    expect(forward.nextState.shop.momentum).toBe(20);

    const reversed = reconcileGameState(state, toTimestampMs(2000), catalog, [
      doubleMomentum,
      setMomentumTo10,
    ]);
    expect(reversed.nextState.shop.momentum).toBe(10);
  });

  it("supports idempotent passes: reconciling again at the same `now` re-applies no effect", () => {
    const state = baseState(1000);

    const first = reconcileGameState(state, toTimestampMs(2000), catalog, [
      incrementMomentumOncePerElapsed,
    ]);
    expect(first.nextState.shop.momentum).toBe(1);
    expect(first.nextState.meta.lastActiveAtMs).toBe(2000);

    const second = reconcileGameState(
      first.nextState,
      toTimestampMs(2000),
      catalog,
      [incrementMomentumOncePerElapsed],
    );
    expect(second.nextState.shop.momentum).toBe(1);
    expect(second.elapsedMs).toBe(0);
  });

  it("defaults to the real RECONCILIATION_PASSES chain when none is supplied", () => {
    const state = baseState(1000);
    const report = reconcileGameState(state, toTimestampMs(1000), catalog);
    expect(report.nextState).toEqual(state);
  });
});
