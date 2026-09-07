/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §5
 * ("Rarity controls affix count/range"), §11 Affixes; docs/rebuild/15
 * Phase R3. PROVISIONAL affix counts/magnitudes (CLAUDE.md §13).
 */
import {
  nextIntExclusive,
  type RandomSource,
} from "../../core/random/index.ts";
import {
  AFFIX_TYPES,
  RELIC_RARITY_ORDER,
  type AffixType,
  type RelicAffix,
  type RelicRarity,
} from "./types.ts";

export type AffixCountByRarity = Readonly<Record<RelicRarity, number>>;
export type AffixBaseValues = Readonly<Record<AffixType, number>>;

/** PROVISIONAL: each rarity tier above COMMON adds 15% to every rolled affix's magnitude. */
const AFFIX_VALUE_GROWTH_PER_TIER_BPS = 1_500;

/** Picks `count` distinct affix types (no duplicates) via seeded partial Fisher-Yates, then rolls each one's magnitude for `rarity`. */
export function rollAffixes(
  rng: RandomSource,
  rarity: RelicRarity,
  countByRarity: AffixCountByRarity,
  baseValues: AffixBaseValues,
): readonly RelicAffix[] {
  const count = Math.min(countByRarity[rarity], AFFIX_TYPES.length);
  if (count <= 0) return [];

  const pool = [...AFFIX_TYPES];
  const chosen: AffixType[] = [];
  for (let i = 0; i < count; i += 1) {
    const pickIndex = nextIntExclusive(rng, pool.length);
    chosen.push(pool[pickIndex]!);
    pool.splice(pickIndex, 1);
  }

  const tierIndex = RELIC_RARITY_ORDER.indexOf(rarity);
  const growthMultiplier =
    1 + (tierIndex * AFFIX_VALUE_GROWTH_PER_TIER_BPS) / 10_000;

  return chosen.map((type) => ({
    type,
    value: Math.round(baseValues[type] * growthMultiplier),
  }));
}
