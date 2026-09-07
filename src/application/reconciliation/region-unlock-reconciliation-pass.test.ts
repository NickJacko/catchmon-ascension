// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toSeed } from "../../core/random/index.ts";
import { ZERO_DURATION_MS } from "../../core/math/duration.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import {
  PREVIEW_REGION_ID,
  START_REGION_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../content/vertical-slice/index.ts";
import { REGION_COMPLETED_MILESTONE } from "../../domain/journey/index.ts";
import { regionUnlockReconciliationPass } from "./region-unlock-reconciliation-pass.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);

function freshState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

describe("regionUnlockReconciliationPass (Ozean Batch A)", () => {
  it("is a no-op when no additional region's unlock rule is yet satisfied", () => {
    const state = freshState();
    // Vulkankrater is already unlocked at creation; Ozean's Phase R6 rule
    // is not satisfied yet (Journey Rank too low, Vulkankrater not
    // completed).
    expect(state.world.unlockedRegionIds).toEqual([START_REGION_ID]);
    const outcome = regionUnlockReconciliationPass(
      state,
      ZERO_DURATION_MS,
      toTimestampMs(0),
      catalog,
    );
    expect(outcome.nextState).toBe(state);
    expect(outcome.events).toEqual([]);
  });

  it("unlocks Ozean once BOTH its Journey Rank threshold and Vulkankrater's completion milestone are met (Phase R6)", () => {
    const state = freshState();
    // Journey Rank alone is not enough.
    const journeyRankOnly: GameState = {
      ...state,
      progression: { ...state.progression, journeyRank: 100 },
    };
    const journeyRankOnlyOutcome = regionUnlockReconciliationPass(
      journeyRankOnly,
      ZERO_DURATION_MS,
      toTimestampMs(0),
      catalog,
    );
    expect(journeyRankOnlyOutcome.nextState.world.unlockedRegionIds).toEqual([
      START_REGION_ID,
    ]);

    // Vulkankrater's completion milestone alone is not enough either.
    const milestoneOnly: GameState = {
      ...state,
      world: {
        ...state.world,
        regionMilestones: {
          ...state.world.regionMilestones,
          [START_REGION_ID]: [REGION_COMPLETED_MILESTONE],
        },
      },
    };
    const milestoneOnlyOutcome = regionUnlockReconciliationPass(
      milestoneOnly,
      ZERO_DURATION_MS,
      toTimestampMs(0),
      catalog,
    );
    expect(milestoneOnlyOutcome.nextState.world.unlockedRegionIds).toEqual([
      START_REGION_ID,
    ]);

    // Both together: Ozean unlocks.
    const bothSignals: GameState = {
      ...state,
      progression: { ...state.progression, journeyRank: 100 },
      world: {
        ...state.world,
        regionMilestones: {
          ...state.world.regionMilestones,
          [START_REGION_ID]: [REGION_COMPLETED_MILESTONE],
        },
      },
    };
    const outcome = regionUnlockReconciliationPass(
      bothSignals,
      ZERO_DURATION_MS,
      toTimestampMs(0),
      catalog,
    );
    expect([...outcome.nextState.world.unlockedRegionIds].sort()).toEqual(
      [START_REGION_ID, PREVIEW_REGION_ID].sort(),
    );
    expect(outcome.events).toEqual([
      { kind: "REGION_UNLOCKED", regionId: PREVIEW_REGION_ID },
    ]);
  });

  it("never re-adds an already-unlocked region (exactly-once)", () => {
    const state = freshState();
    const alreadyUnlocked: GameState = {
      ...state,
      world: {
        ...state.world,
        unlockedRegionIds: [START_REGION_ID, PREVIEW_REGION_ID],
      },
    };
    const outcome = regionUnlockReconciliationPass(
      alreadyUnlocked,
      ZERO_DURATION_MS,
      toTimestampMs(0),
      catalog,
    );
    expect(outcome.nextState).toBe(alreadyUnlocked);
    expect(outcome.events).toEqual([]);
  });
});
