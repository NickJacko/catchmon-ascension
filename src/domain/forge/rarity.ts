/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §5
 * Rarity, §8 Forge Level ("Forge Level improves: rarity distribution...");
 * docs/rebuild/15 Phase R3.
 *
 * PROVISIONAL weighted table: every base weight and the per-level shift
 * are placeholders (CLAUDE.md §13) — only the *shape* (higher Forge Level
 * shifts weight mass toward higher rarities, deterministically) is real.
 */
import {
  nextIntExclusive,
  type RandomSource,
} from "../../core/random/index.ts";
import { RELIC_RARITY_ORDER, type RelicRarity } from "./types.ts";

export type RarityWeights = Readonly<Record<RelicRarity, number>>;

export interface RarityConfig {
  readonly baseWeights: RarityWeights;
  /** Added to a rarity's base weight, scaled by that rarity's position in `RELIC_RARITY_ORDER` (0 for COMMON) and the current Forge Level — so higher rarities gain weight faster than lower ones as Forge Level rises. */
  readonly weightGainPerForgeLevelPerTier: number;
}

/** Pure: the effective (unnormalized) weight table at a given Forge Level — exposed so tests/UI can inspect the shift directly without rolling. */
export function effectiveRarityWeights(
  forgeLevel: number,
  config: RarityConfig,
): RarityWeights {
  const weights: Record<RelicRarity, number> = { ...config.baseWeights };
  RELIC_RARITY_ORDER.forEach((rarity, tierIndex) => {
    weights[rarity] =
      config.baseWeights[rarity] +
      tierIndex * forgeLevel * config.weightGainPerForgeLevelPerTier;
  });
  return weights;
}

/**
 * Weighted roll over `RELIC_RARITY_ORDER`, optionally floored at
 * `guaranteedMinimumRarity` (Document 04 §9 Forge Insight's threshold
 * guarantee) — if the natural roll lands below the guaranteed floor, the
 * floor wins instead of re-rolling (keeps the function pure/single-roll).
 */
export function rollRarity(
  rng: RandomSource,
  forgeLevel: number,
  config: RarityConfig,
  guaranteedMinimumRarity?: RelicRarity,
): RelicRarity {
  const weights = effectiveRarityWeights(forgeLevel, config);
  const totalWeight = RELIC_RARITY_ORDER.reduce(
    (sum, rarity) => sum + weights[rarity],
    0,
  );
  const roll = nextIntExclusive(rng, Math.max(1, Math.round(totalWeight)));

  let cumulative = 0;
  let rolled: RelicRarity = "COMMON";
  for (const rarity of RELIC_RARITY_ORDER) {
    cumulative += weights[rarity];
    if (roll < cumulative) {
      rolled = rarity;
      break;
    }
  }

  if (!guaranteedMinimumRarity) return rolled;
  const rolledIndex = RELIC_RARITY_ORDER.indexOf(rolled);
  const floorIndex = RELIC_RARITY_ORDER.indexOf(guaranteedMinimumRarity);
  return rolledIndex >= floorIndex ? rolled : guaranteedMinimumRarity;
}
