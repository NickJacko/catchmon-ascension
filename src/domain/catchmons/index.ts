export type {
  CapabilityDefinition,
  CapabilityEffectFamily,
  CapabilityStrengthClass,
  CatchmonDomain,
  CatchmonSpeciesDefinition,
  EvolutionLineDefinition,
  Rarity,
} from "./types.ts";
export {
  evaluateCraftSpeedEffect,
  evaluateDiscoveryBoostEffect,
  evaluateRecommendCompatibilityEffect,
  type CraftSpeedEffect,
  type DiscoveryBoostEffect,
  type MagnitudeTable,
  type RecommendCompatibilityEffect,
} from "./effects.ts";
export { applyXp, levelForXp } from "./xp-ledger.ts";
export {
  checkEvolutionRequirement,
  computeEvolutionReadiness,
  type EvolutionBlockedReason,
} from "./evolution.ts";
export { applyBondProgress, bondLevelForProgress } from "./bond.ts";
export {
  computeBondSupportBonus,
  type BondSupportBehaviorId,
} from "./support-behavior.ts";
