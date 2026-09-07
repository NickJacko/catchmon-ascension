/**
 * Design owner: Document 15 Task 07.1 (Shop Rank Core); Document 09 §3-9
 * (The Progression Stack, Why Shop Rank Exists, Shop Rank Is Not
 * Shop Level + Reputation + XP As Three Systems, Shop Rank Is Not
 * Spendable), §7 Shop Rank Progress Sources (Commerce/Orders/
 * Craftsmanship/Collection/World).
 *
 * A flat, centralized rank curve (`progressPerRank`/`rankCap` — both
 * PROVISIONAL, supplied by the caller, never hardcoded here), mirroring
 * `domain/catchmons/xp-ledger.ts`'s `applyXp`/`levelForXp` precedent
 * exactly: Document 09 §7 explicitly defers "exact contribution values,"
 * the same way Document 06 §60 deferred the Catchmon XP curve to this
 * later phase — reusing the same shape avoids inventing a second, un­
 * justified progression formula. `rankProgress` is the single non-
 * spendable global meter (§9 "achievement state / access state," never a
 * currency) — it only ever grows, never resets or gets spent.
 */
import { type ProgressionState } from "../game-state/index.ts";

/** Pure recompute: cumulative rank progress -> current rank, capped at `rankCap`. */
export function rankForProgress(
  rankProgress: number,
  progressPerRank: number,
  rankCap: number,
): number {
  const uncapped = Math.floor(rankProgress / progressPerRank) + 1;
  return Math.min(uncapped, rankCap);
}

/**
 * The one normalized contribution hook every Shop-Rank source class
 * (Commerce, Orders, Craftsmanship, Collection, World — Document 09 §7)
 * calls, so no call site duplicates rank-up arithmetic. `rankProgress`
 * itself is never capped/discarded once `rankCap` is reached (same
 * "accrual vs. derived bounded value" split as Catchmon XP/Level) — only
 * the derived `rank` field is clamped.
 */
export function applyRankProgress(
  progression: ProgressionState,
  progressGained: number,
  progressPerRank: number,
  rankCap: number,
): ProgressionState {
  const rankProgress = progression.rankProgress + progressGained;
  return {
    ...progression,
    rankProgress,
    rank: rankForProgress(rankProgress, progressPerRank, rankCap),
  };
}

export interface NearbyMilestone {
  readonly currentRank: number;
  readonly rankProgress: number;
  /** `null` once `rank` has reached `rankCap` — there is no next rank to progress toward. */
  readonly progressRequiredForNextRank: number | null;
  readonly progressRemaining: number | null;
}

/**
 * Document 15 Task 07.1 "nearby milestone query" — Shop-Rank-tier progress
 * only (how close to the next rank number), distinct from Task 07.6's
 * broader Contextual Goal Query (which composes this with unlock-rule/
 * infrastructure state into one "what should I do next" selector).
 */
export function getNearbyMilestone(
  progression: ProgressionState,
  progressPerRank: number,
  rankCap: number,
): NearbyMilestone {
  if (progression.rank >= rankCap) {
    return {
      currentRank: progression.rank,
      rankProgress: progression.rankProgress,
      progressRequiredForNextRank: null,
      progressRemaining: null,
    };
  }
  const progressRequiredForNextRank = progression.rank * progressPerRank;
  return {
    currentRank: progression.rank,
    rankProgress: progression.rankProgress,
    progressRequiredForNextRank,
    progressRemaining: Math.max(
      progressRequiredForNextRank - progression.rankProgress,
      0,
    ),
  };
}
