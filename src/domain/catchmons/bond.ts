/**
 * Design owner: docs/rebuild/06_CATCHMON_COLLECTION_BOND_AND_EVOLUTION.md
 * §7 Bond ("grows through active use, bosses, expeditions... unlocks
 * support behavior, evolution requirements"); docs/rebuild/15 Phase R5.
 * Mirrors `xp-ledger.ts`'s `applyXp`/`levelForXp` shape exactly — same
 * flat centralized curve, config supplied by caller, never hardcoded.
 */
import { type OwnedCatchmonState } from "../game-state/index.ts";

export function bondLevelForProgress(
  bondProgress: number,
  progressPerBondLevel: number,
  bondLevelCap: number,
): number {
  const uncapped = Math.floor(bondProgress / progressPerBondLevel) + 1;
  return Math.min(uncapped, bondLevelCap);
}

/** `bondLevel`/`bondProgress` are absent-means-0, matching this codebase's sparse-map/optional-field convention for a Catchmon that has never been used in battle. */
export function applyBondProgress(
  owned: OwnedCatchmonState,
  progressGained: number,
  progressPerBondLevel: number,
  bondLevelCap: number,
): OwnedCatchmonState {
  const bondProgress = (owned.bondProgress ?? 0) + progressGained;
  return {
    ...owned,
    bondProgress,
    bondLevel: bondLevelForProgress(
      bondProgress,
      progressPerBondLevel,
      bondLevelCap,
    ),
  };
}
