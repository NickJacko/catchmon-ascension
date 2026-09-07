/**
 * Design owner: docs/rebuild/15 Phases R2-R5; CLAUDE.md §13 Balance Rule.
 *
 * Every value below is PROVISIONAL — chosen only to exercise the combat/
 * Forge/loadout/Bond engines end-to-end and to make the three Battle Paths
 * behave visibly differently against the same boss. None of it is real
 * balance (docs/rebuild/09 §11 Simulation is explicit future work).
 */
import { type BaseStatsConfig } from "../../domain/combat/index.ts";
import {
  type BattlePathBonusConfig,
  type PowerWeights,
} from "../../domain/loadout/index.ts";
import {
  type AffixBaseValues,
  type AffixCountByRarity,
  type RarityConfig,
  type RelicGenerationConfig,
  type RelicRarity,
} from "../../domain/forge/index.ts";

export const PROVISIONAL_MAX_ROUNDS = 100;

export const PROVISIONAL_BASE_STATS_CONFIG: BaseStatsConfig = {
  baseHp: 120,
  hpPerLevel: 18,
  baseAttack: 22,
  attackPerLevel: 4,
  baseDefense: 8,
  defensePerLevel: 2,
  baseAttackSpeed: 100,
  baseSkillPower: 10,
  skillPowerPerLevel: 2,
  baseElementalPower: 4,
  baseElementalResistance: 3,
  baseCritChanceBps: 500,
  baseCritDamageBps: 15_000,
  baseEvasionBps: 400,
  baseAccuracyBps: 9_500,
};

/** PROVISIONAL: every Path's primary stats get a flat +30%-equivalent bonus (Document 05 §2). */
export const PROVISIONAL_BATTLE_PATH_BONUSES: BattlePathBonusConfig = {
  BREAKER: {
    attackSpeed: 40,
    critChanceBps: 1_500,
    critDamageBps: 5_000,
    comboChanceBps: 2_000,
  },
  WARDEN: {
    defense: 10,
    guardBps: 2_500,
    counterChanceBps: 2_000,
    hp: 60,
  },
  WEAVER: {
    skillPower: 14,
    skillHasteBps: 3_000,
    elementalPower: 10,
  },
};

export const PROVISIONAL_POWER_WEIGHTS: PowerWeights = {
  hp: 0.05,
  attack: 1,
  defense: 1,
  attackSpeed: 0.2,
  critChanceBps: 0.01,
  critDamageBps: 0.01,
  comboChanceBps: 0.01,
  counterChanceBps: 0.01,
  guardBps: 0.01,
  evasionBps: 0.005,
  accuracyBps: 0.005,
  skillPower: 1,
  skillHasteBps: 0.01,
  elementalPower: 1,
  elementalResistance: 0.5,
};

/** PROVISIONAL: Document 04 §5 — a soft ladder, heavily weighted toward COMMON at Forge Level 1. */
export const PROVISIONAL_RARITY_CONFIG: RarityConfig = {
  baseWeights: {
    COMMON: 100,
    UNCOMMON: 60,
    RARE: 30,
    EPIC: 12,
    MYTHIC: 5,
    LEGENDARY: 2,
    ASCENDANT: 1,
  },
  weightGainPerForgeLevelPerTier: 3,
};

/** PROVISIONAL: Document 04 §5 "rarity controls affix count." */
export const PROVISIONAL_AFFIX_COUNT_BY_RARITY: AffixCountByRarity = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  MYTHIC: 4,
  LEGENDARY: 4,
  ASCENDANT: 5,
};

export const PROVISIONAL_AFFIX_BASE_VALUES: AffixBaseValues = {
  CRIT: 400,
  COMBO: 400,
  COUNTER: 400,
  GUARD: 600,
  SKILL_POWER: 4,
  SKILL_HASTE: 500,
  ATTACK_SPEED: 8,
  ELEMENTAL_POWER: 3,
  ACCURACY: 300,
  EVASION: 300,
};

export const PROVISIONAL_RELIC_GENERATION_CONFIG: RelicGenerationConfig = {
  rarityConfig: PROVISIONAL_RARITY_CONFIG,
  affixCountByRarity: PROVISIONAL_AFFIX_COUNT_BY_RARITY,
  affixBaseValues: PROVISIONAL_AFFIX_BASE_VALUES,
  mainStatMultiplierByTier: [1, 1.2, 1.5, 2, 2.75, 3.75, 5],
};

/** docs/rebuild/04 §8 Forge Level: PROVISIONAL "1 level per N Relics forged." */
export const PROVISIONAL_FORGES_PER_FORGE_LEVEL = 5;
export const PROVISIONAL_FORGE_LEVEL_CAP = 999;

/** docs/rebuild/04 §9 Forge Insight. */
export const PROVISIONAL_INSIGHT_GAIN_PER_RECYCLE = 10;
export const PROVISIONAL_INSIGHT_GUARANTEE_THRESHOLD = 100;
export const PROVISIONAL_INSIGHT_GUARANTEED_MINIMUM_RARITY: RelicRarity =
  "RARE";

/** docs/rebuild/04 §7 Recycling rewards. */
export const PROVISIONAL_RECYCLE_COINS_BY_RARITY: Readonly<
  Record<RelicRarity, number>
> = {
  COMMON: 5,
  UNCOMMON: 10,
  RARE: 20,
  EPIC: 40,
  MYTHIC: 80,
  LEGENDARY: 160,
  ASCENDANT: 320,
};

/** docs/rebuild/04 §2 Echo Charges — stage-win rewards (see `stages.ts`) and the Forge's own cost. */
export const PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST = 10;

/** docs/rebuild/06 §6 Evolution Benefits — flat per-evolution-stage combat bonus (see `lead-stats-query.ts`'s doc comment for why this is a stage-index formula, not a per-species profile). */
export const PROVISIONAL_EVOLUTION_STAGE_ATTACK_BONUS = 8;
export const PROVISIONAL_EVOLUTION_STAGE_HP_BONUS = 40;
export const PROVISIONAL_EVOLUTION_STAGE_DEFENSE_BONUS = 4;

/** docs/rebuild/06 §7 Bond. */
export const PROVISIONAL_BOND_PROGRESS_PER_BATTLE = 8;
export const PROVISIONAL_BOND_PROGRESS_PER_BOND_LEVEL = 40;
export const PROVISIONAL_BOND_LEVEL_CAP = 20;
export const PROVISIONAL_BOND_SUPPORT_BONUS_PER_LEVEL = 1;

/** docs/rebuild/06 §5 Evolution — reuses the same level requirement Shop's `EVOLVE_CATCHMON` already exposes as config (see `content/vertical-slice/balance.ts`'s `PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT`), not redeclared here.*/

/**
 * docs/rebuild/07 §3 Journey Rank; docs/rebuild/15 Phase R6. A distinct
 * curve from Shop Rank's own constants (`content/vertical-slice/
 * balance.ts`) — fed only by real Journey milestones. Clearing all of
 * Vulkankrater (3 normal wins + 1 boss win = 3*5 + 20 = 35 progress)
 * reaches Journey Rank 2 with `journeyRankProgressPerRank = 20`
 * (`floor(35/20)+1 = 2`) — `PROVISIONAL_JOURNEY_RANK_THRESHOLD_OZEAN`
 * below is set to exactly that, so Ozean's Journey-readiness signal
 * becomes true right around Vulkankrater's own completion, matching
 * docs/rebuild/08 §3's "global readiness" being a loose companion check
 * alongside the real gate (the region-completion milestone), not an
 * independent hard wall.
 */
export const PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_NORMAL_WIN = 5;
export const PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_BOSS_WIN = 20;
export const PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_RANK = 20;
export const PROVISIONAL_JOURNEY_RANK_CAP = 999;
export const PROVISIONAL_JOURNEY_RANK_THRESHOLD_OZEAN = 2;

/** docs/rebuild/09 §2 Echo Charges (expeditions as a source); docs/rebuild/15 Phase R6 expedition-reward adaptation. */
export const PROVISIONAL_EXPEDITION_ECHO_CHARGE_REWARD = 15;

/**
 * docs/rebuild/03 §10 Offline Combat, §12; docs/rebuild/02 §5 Return/
 * Offline Loop ("generous cap... work/sleep does not feel punitive");
 * docs/rebuild/15 Phase R7. All PROVISIONAL — real balance/simulation is
 * explicit future work (docs/rebuild/09 §11).
 */
export const PROVISIONAL_OFFLINE_CLEARS_PER_HOUR = 20;
export const PROVISIONAL_OFFLINE_EFFICIENCY_BPS = 5_000;
export const PROVISIONAL_OFFLINE_MAX_HOURS = 8;
