/**
 * Design owner: docs/rebuild/07_META_PROGRESSION_AND_ACCOUNT_SYSTEMS.md §3
 * Journey Rank ("broad account progression... sources: stages, bosses,
 * region milestones, collection milestones... not a spendable currency");
 * docs/rebuild/15 Phase R6.
 *
 * Reuses `shop-rank.ts`'s `rankForProgress` curve formula directly (the
 * same flat centralized curve already reused for Bond,
 * `domain/catchmons/bond.ts`) — this is NOT a duplicate/renamed copy of
 * Shop Rank's mechanism, it is the same generic formula applied to a
 * distinct meter (`ProgressionState.journeyRank`/`journeyRankProgress`),
 * fed only by real Journey milestones, never by Shop transactions.
 */
import { rankForProgress, type NearbyMilestone } from "./shop-rank.ts";
import { type ProgressionState } from "../game-state/index.ts";

/** Mirrors `applyRankProgress`'s shape exactly, targeting `journeyRank`/`journeyRankProgress` instead of Shop's `rank`/`rankProgress`. */
export function applyJourneyRankProgress(
  progression: ProgressionState,
  progressGained: number,
  progressPerRank: number,
  rankCap: number,
): ProgressionState {
  const journeyRankProgress = progression.journeyRankProgress + progressGained;
  return {
    ...progression,
    journeyRankProgress,
    journeyRank: rankForProgress(journeyRankProgress, progressPerRank, rankCap),
  };
}

/**
 * `getNearbyMilestone`'s (`shop-rank.ts`) exact shape, targeting
 * `journeyRank`/`journeyRankProgress` instead — R8's Journey screen needs
 * the same "how close to the next rank" preview Shop Rank already had, and
 * duplicating the small formula here (rather than reshaping
 * `ProgressionState` into a fake Shop-Rank-shaped object to satisfy the
 * other function's signature) keeps each meter's query honestly typed
 * against the field it actually reads.
 */
export function getNearbyJourneyMilestone(
  progression: ProgressionState,
  progressPerRank: number,
  rankCap: number,
): NearbyMilestone {
  if (progression.journeyRank >= rankCap) {
    return {
      currentRank: progression.journeyRank,
      rankProgress: progression.journeyRankProgress,
      progressRequiredForNextRank: null,
      progressRemaining: null,
    };
  }
  const progressRequiredForNextRank = progression.journeyRank * progressPerRank;
  return {
    currentRank: progression.journeyRank,
    rankProgress: progression.journeyRankProgress,
    progressRequiredForNextRank,
    progressRemaining: Math.max(
      progressRequiredForNextRank - progression.journeyRankProgress,
      0,
    ),
  };
}
