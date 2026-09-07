export {
  AFFIX_TYPES,
  RELIC_MATRIX_SLOTS,
  RELIC_RARITY_ORDER,
  type AffixType,
  type RelicAffix,
  type RelicArchetypeDefinition,
  type RelicMatrixSlot,
  type RelicRarity,
} from "./types.ts";
export {
  effectiveRarityWeights,
  rollRarity,
  type RarityConfig,
  type RarityWeights,
} from "./rarity.ts";
export {
  rollAffixes,
  type AffixBaseValues,
  type AffixCountByRarity,
} from "./affixes.ts";
export {
  generateRelic,
  type RelicGenerationConfig,
} from "./relic-generation.ts";
export { forgeLevelForTotalForges } from "./forge-level.ts";
export {
  applyRecycleInsight,
  consumeInsightGuaranteeIfReady,
  type ForgeInsightResult,
} from "./forge-insight.ts";
export { applyRelicMatrixBonuses, relicStatBonus } from "./relic-effects.ts";
