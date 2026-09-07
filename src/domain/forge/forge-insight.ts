/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §9
 * Forge Insight / Safety Net ("non-kept rolls add Forge Insight... at
 * thresholds it may guarantee a minimum rarity"); docs/rebuild/15 Phase
 * R3. Mirrors `domain/expeditions/rewards.ts`'s
 * `resolveSpecialComponentBonus` pity-counter shape: a deterministic,
 * always-on floor, not a random second roll.
 */
import { type RelicRarity } from "./types.ts";

export interface ForgeInsightResult {
  readonly nextInsight: number;
  readonly guaranteedMinimumRarity?: RelicRarity;
}

/** Called once per `RECYCLE_RELIC` (Document 04 §9 "non-kept rolls add Forge Insight"). */
export function applyRecycleInsight(
  currentInsight: number,
  gainPerRecycle: number,
): number {
  return currentInsight + gainPerRecycle;
}

/**
 * Called once per `FORGE_RELIC`, before rolling: if `currentInsight` has
 * reached `threshold`, this roll is guaranteed at least `minimumRarity`
 * and Insight resets to 0 (consumed) — otherwise Insight carries over
 * unchanged and no guarantee applies.
 */
export function consumeInsightGuaranteeIfReady(
  currentInsight: number,
  threshold: number,
  minimumRarity: RelicRarity,
): ForgeInsightResult {
  if (currentInsight < threshold) {
    return { nextInsight: currentInsight };
  }
  return { nextInsight: 0, guaranteedMinimumRarity: minimumRarity };
}
