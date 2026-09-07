import { describe, expect, it } from "vitest";
import { type ProgressionState } from "../game-state/index.ts";
import {
  applyRankProgress,
  getNearbyMilestone,
  rankForProgress,
} from "./shop-rank.ts";

describe("rankForProgress", () => {
  it("starts at rank 1 with zero progress", () => {
    expect(rankForProgress(0, 20, 10)).toBe(1);
  });

  it("advances to the next rank once progress reaches the threshold", () => {
    expect(rankForProgress(19, 20, 10)).toBe(1);
    expect(rankForProgress(20, 20, 10)).toBe(2);
    expect(rankForProgress(39, 20, 10)).toBe(2);
    expect(rankForProgress(40, 20, 10)).toBe(3);
  });

  it("clamps at the rank cap even with far more progress", () => {
    expect(rankForProgress(100_000, 20, 10)).toBe(10);
  });
});

describe("applyRankProgress", () => {
  it("accumulates rankProgress and never discards it, even past the cap", () => {
    const progression = {
      rank: 1,
      rankProgress: 0,
      journeyRank: 1,
      journeyRankProgress: 0,
      earnedMilestoneIds: [],
      unlockedSystemIds: [],
    };
    const next = applyRankProgress(progression, 5, 20, 10);
    expect(next.rankProgress).toBe(5);
    expect(next.rank).toBe(1);

    const farPast = applyRankProgress(progression, 100_000, 20, 10);
    expect(farPast.rankProgress).toBe(100_000);
    expect(farPast.rank).toBe(10);
  });

  it("advances rank exactly when cumulative progress crosses a threshold", () => {
    let progression: ProgressionState = {
      rank: 1,
      rankProgress: 0,
      journeyRank: 1,
      journeyRankProgress: 0,
      earnedMilestoneIds: [],
      unlockedSystemIds: [],
    };
    for (let i = 0; i < 19; i++) {
      progression = applyRankProgress(progression, 1, 20, 10);
    }
    expect(progression.rank).toBe(1);
    progression = applyRankProgress(progression, 1, 20, 10);
    expect(progression.rank).toBe(2);
  });

  it("preserves other ProgressionState fields untouched", () => {
    const progression = {
      rank: 1,
      rankProgress: 0,
      journeyRank: 1,
      journeyRankProgress: 0,
      earnedMilestoneIds: ["milestone-a"],
      unlockedSystemIds: ["system-a"],
    };
    const next = applyRankProgress(progression, 5, 20, 10);
    expect(next.earnedMilestoneIds).toEqual(["milestone-a"]);
    expect(next.unlockedSystemIds).toEqual(["system-a"]);
  });
});

describe("getNearbyMilestone", () => {
  it("reports progress remaining toward the next rank", () => {
    const progression = {
      rank: 1,
      rankProgress: 12,
      journeyRank: 1,
      journeyRankProgress: 0,
      earnedMilestoneIds: [],
      unlockedSystemIds: [],
    };
    const milestone = getNearbyMilestone(progression, 20, 10);
    expect(milestone.currentRank).toBe(1);
    expect(milestone.progressRequiredForNextRank).toBe(20);
    expect(milestone.progressRemaining).toBe(8);
  });

  it("reports null (no next rank) once the rank cap is reached", () => {
    const progression = {
      rank: 10,
      rankProgress: 500,
      journeyRank: 1,
      journeyRankProgress: 0,
      earnedMilestoneIds: [],
      unlockedSystemIds: [],
    };
    const milestone = getNearbyMilestone(progression, 20, 10);
    expect(milestone.progressRequiredForNextRank).toBeNull();
    expect(milestone.progressRemaining).toBeNull();
  });

  it("never reports negative progress remaining", () => {
    const progression = {
      rank: 2,
      rankProgress: 45,
      journeyRank: 1,
      journeyRankProgress: 0,
      earnedMilestoneIds: [],
      unlockedSystemIds: [],
    };
    const milestone = getNearbyMilestone(progression, 20, 10);
    expect(milestone.progressRemaining).toBeGreaterThanOrEqual(0);
  });
});
