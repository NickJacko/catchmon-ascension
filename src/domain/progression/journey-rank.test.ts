// @vitest-environment node
import { describe, expect, it } from "vitest";
import { type ProgressionState } from "../game-state/index.ts";
import { applyJourneyRankProgress } from "./journey-rank.ts";

function baseProgression(): ProgressionState {
  return {
    rank: 5,
    rankProgress: 500,
    journeyRank: 1,
    journeyRankProgress: 0,
    earnedMilestoneIds: [],
    unlockedSystemIds: [],
  };
}

describe("applyJourneyRankProgress", () => {
  it("accumulates journeyRankProgress and advances journeyRank without touching Shop's rank/rankProgress", () => {
    const progression = baseProgression();
    const next = applyJourneyRankProgress(progression, 5, 20, 999);
    expect(next.journeyRankProgress).toBe(5);
    expect(next.journeyRank).toBe(1);
    expect(next.rank).toBe(progression.rank);
    expect(next.rankProgress).toBe(progression.rankProgress);
  });

  it("advances journeyRank exactly when cumulative progress crosses a threshold", () => {
    let progression = baseProgression();
    for (let i = 0; i < 19; i++) {
      progression = applyJourneyRankProgress(progression, 1, 20, 999);
    }
    expect(progression.journeyRank).toBe(1);
    progression = applyJourneyRankProgress(progression, 1, 20, 999);
    expect(progression.journeyRank).toBe(2);
  });

  it("clamps journeyRank at the configured cap even with far more progress", () => {
    const progression = baseProgression();
    const next = applyJourneyRankProgress(progression, 100_000, 20, 10);
    expect(next.journeyRank).toBe(10);
  });

  it("preserves other ProgressionState fields untouched", () => {
    const progression: ProgressionState = {
      ...baseProgression(),
      earnedMilestoneIds: ["milestone-a"],
      unlockedSystemIds: ["system-a"],
    };
    const next = applyJourneyRankProgress(progression, 5, 20, 999);
    expect(next.earnedMilestoneIds).toEqual(["milestone-a"]);
    expect(next.unlockedSystemIds).toEqual(["system-a"]);
  });
});
