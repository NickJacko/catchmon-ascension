/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §6
 * Result Decision, §15 Exit Gate; docs/rebuild/15 Phase R3. Pure: takes a
 * seeded `RandomSource` and returns a fully-formed relic instance draft —
 * the calling command supplies the `RelicInstanceId` and persists it,
 * exactly like `attempt-capture.ts` does for a newly-owned Catchmon.
 */
import { type RelicInstanceId } from "../../core/ids/index.ts";
import { type RandomSource } from "../../core/random/index.ts";
import { type TimestampMs } from "../../core/time/index.ts";
import { type RelicInstanceState } from "../game-state/index.ts";
import {
  rollAffixes,
  type AffixBaseValues,
  type AffixCountByRarity,
} from "./affixes.ts";
import { rollRarity, type RarityConfig } from "./rarity.ts";
import {
  RELIC_RARITY_ORDER,
  type RelicArchetypeDefinition,
  type RelicRarity,
} from "./types.ts";

export interface RelicGenerationConfig {
  readonly rarityConfig: RarityConfig;
  readonly affixCountByRarity: AffixCountByRarity;
  readonly affixBaseValues: AffixBaseValues;
  /** PROVISIONAL: the multiplier applied to `baseMainStatValue` per rarity tier, one entry per `RELIC_RARITY_ORDER` position. */
  readonly mainStatMultiplierByTier: readonly number[];
}

export function generateRelic(
  rng: RandomSource,
  relicInstanceId: RelicInstanceId,
  archetype: RelicArchetypeDefinition,
  forgeLevel: number,
  config: RelicGenerationConfig,
  nowMs: TimestampMs,
  guaranteedMinimumRarity?: RelicRarity,
): RelicInstanceState {
  const rarity = rollRarity(
    rng,
    forgeLevel,
    config.rarityConfig,
    guaranteedMinimumRarity,
  );
  const tierIndex = RELIC_RARITY_ORDER.indexOf(rarity);
  const multiplier = config.mainStatMultiplierByTier[tierIndex] ?? 1;
  const mainStatValue = Math.round(archetype.baseMainStatValue * multiplier);
  const affixes = rollAffixes(
    rng,
    rarity,
    config.affixCountByRarity,
    config.affixBaseValues,
  );

  return {
    relicInstanceId,
    relicArchetypeId: archetype.relicArchetypeId,
    slot: archetype.slot,
    rarity,
    mainStatValue,
    affixes,
    locked: false,
    forgedAtMs: nowMs,
  };
}
