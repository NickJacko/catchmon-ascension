/**
 * Design owner: Document 15 Task 05.8 (Catchmon XP); Document 06 §55-60
 * (Catchmon Development, Experience Sources, No XP Currency, Level Power
 * Shape, Level Cap — Open); Document 14 §97 ("XP is awarded by domain
 * events/use cases... do not calculate XP inside UI animations").
 *
 * A flat, centralized XP curve (`xpPerLevel`, `levelCap` — both
 * PROVISIONAL, supplied by the caller, never hardcoded here) satisfies
 * Document 06 §59 "small, bounded steps" without asserting a real curve
 * (§60: "Document 09 will determine the curve/cap," not read for this
 * task). "Use Catchmon -> Catchmon develops" (§58, no XP currency): this
 * function only ever accepts an XP amount from a real completed activity,
 * never a spend/purchase.
 */
import { type OwnedCatchmonState } from "../game-state/index.ts";

/** Pure recompute: total XP -> level, capped at `levelCap` (Document 06 §59 "small, bounded steps"). */
export function levelForXp(
  xp: number,
  xpPerLevel: number,
  levelCap: number,
): number {
  const uncapped = Math.floor(xp / xpPerLevel) + 1;
  return Math.min(uncapped, levelCap);
}

/**
 * Adds XP from one completed activity and recomputes level. XP itself is
 * never capped/discarded once the level cap is reached (Document 06 §59
 * treats Level as the bounded thing, not XP accrual) — only the derived
 * `level` field is clamped.
 */
export function applyXp(
  owned: OwnedCatchmonState,
  xpGained: number,
  xpPerLevel: number,
  levelCap: number,
): OwnedCatchmonState {
  const xp = owned.xp + xpGained;
  return { ...owned, xp, level: levelForXp(xp, xpPerLevel, levelCap) };
}
