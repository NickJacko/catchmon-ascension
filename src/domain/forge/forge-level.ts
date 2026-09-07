/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §8 Forge
 * Level; docs/rebuild/15 Phase R3. Mirrors `xp-ledger.ts`'s
 * `levelForXp`/`applyXp` shape exactly: a flat, centralized curve driven
 * by total Relics forged (a deterministic, always-available upgrade
 * resource — Document 04 §8 "uses deterministic upgrade resources," no new
 * currency invented here), config supplied by the caller, never hardcoded.
 */
export function forgeLevelForTotalForges(
  totalRelicsForged: number,
  forgesPerLevel: number,
  levelCap: number,
): number {
  const uncapped = Math.floor(totalRelicsForged / forgesPerLevel) + 1;
  return Math.min(uncapped, levelCap);
}
