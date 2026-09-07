/**
 * Design owner: docs/rebuild/15 Phases R2-R5. A shared test-only catalog +
 * config builder for R2-R5 tests that want to exercise real production
 * content (`content/vertical-slice` + `content/combat-slice`) rather than
 * a synthetic fixture — mirrors `app/ascension-catalog-content.ts` and the
 * combat-relevant slice of `app/game-config.ts`, but lives here (not
 * `app/`) because `src/application/**` test files are not permitted to
 * import the `app/` composition layer (CLAUDE.md's layering rule; ESLint's
 * `no-restricted-imports` enforces it) — only `src/test/**` is a shared
 * exception layer every other layer's *.test.ts files may import from.
 * Kept intentionally scoped to what R2-R5 tests actually need, not a full
 * re-implementation of `buildGameConfig`'s ~30 unrelated Shop config
 * fields.
 */
import {
  createGameCatalog,
  type GameCatalog,
} from "../../domain/catalog/index.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "../../content/vertical-slice/index.ts";
import {
  COMBAT_SLICE_BOND_SUPPORT_BEHAVIORS,
  COMBAT_SLICE_ENEMIES,
  COMBAT_SLICE_PRODUCTION_ASSETS,
  COMBAT_SLICE_RELIC_ARCHETYPES,
  COMBAT_SLICE_SKILLS,
  COMBAT_SLICE_STAGES,
  PROVISIONAL_BASE_STATS_CONFIG,
  PROVISIONAL_BATTLE_PATH_BONUSES,
  PROVISIONAL_BOND_LEVEL_CAP,
  PROVISIONAL_BOND_PROGRESS_PER_BATTLE,
  PROVISIONAL_BOND_PROGRESS_PER_BOND_LEVEL,
  PROVISIONAL_BOND_SUPPORT_BONUS_PER_LEVEL,
  PROVISIONAL_EVOLUTION_STAGE_ATTACK_BONUS,
  PROVISIONAL_EVOLUTION_STAGE_DEFENSE_BONUS,
  PROVISIONAL_EVOLUTION_STAGE_HP_BONUS,
  PROVISIONAL_FORGES_PER_FORGE_LEVEL,
  PROVISIONAL_FORGE_LEVEL_CAP,
  PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST,
  PROVISIONAL_INSIGHT_GAIN_PER_RECYCLE,
  PROVISIONAL_INSIGHT_GUARANTEED_MINIMUM_RARITY,
  PROVISIONAL_INSIGHT_GUARANTEE_THRESHOLD,
  PROVISIONAL_MAX_ROUNDS,
  PROVISIONAL_RECYCLE_COINS_BY_RARITY,
  PROVISIONAL_RELIC_GENERATION_CONFIG,
  PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_NORMAL_WIN,
  PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_BOSS_WIN,
  PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_RANK,
  PROVISIONAL_JOURNEY_RANK_CAP,
} from "../../content/combat-slice/index.ts";
import { type LeadStatsConfig } from "../../application/queries/combat/lead-stats-query.ts";
import { type AttemptStageConfig } from "../../application/commands/journey/attempt-stage.ts";
import { type ForgeRelicConfig } from "../../application/commands/forge/forge-relic.ts";
import { type RecycleRelicConfig } from "../../application/commands/forge/recycle-relic.ts";

export function createAscensionTestCatalog(): GameCatalog {
  return createGameCatalog({
    ...VERTICAL_SLICE_CATALOG_CONTENT,
    enemies: COMBAT_SLICE_ENEMIES,
    stages: COMBAT_SLICE_STAGES,
    relicArchetypes: COMBAT_SLICE_RELIC_ARCHETYPES,
    skills: COMBAT_SLICE_SKILLS,
    startingUnlockedSkillIds: COMBAT_SLICE_SKILLS.map((skill) => skill.skillId),
    assets: [
      ...VERTICAL_SLICE_CATALOG_CONTENT.assets,
      ...COMBAT_SLICE_PRODUCTION_ASSETS,
    ],
  });
}

export const TEST_LEAD_STATS_CONFIG: LeadStatsConfig = {
  baseStatsConfig: PROVISIONAL_BASE_STATS_CONFIG,
  battlePathBonuses: PROVISIONAL_BATTLE_PATH_BONUSES,
  bondSupportBehaviors: COMBAT_SLICE_BOND_SUPPORT_BEHAVIORS,
  bondSupportBonusPerLevel: PROVISIONAL_BOND_SUPPORT_BONUS_PER_LEVEL,
  evolutionStageAttackBonus: PROVISIONAL_EVOLUTION_STAGE_ATTACK_BONUS,
  evolutionStageHpBonus: PROVISIONAL_EVOLUTION_STAGE_HP_BONUS,
  evolutionStageDefenseBonus: PROVISIONAL_EVOLUTION_STAGE_DEFENSE_BONUS,
};

export const TEST_ATTEMPT_STAGE_CONFIG: AttemptStageConfig = {
  leadStatsConfig: TEST_LEAD_STATS_CONFIG,
  maxRounds: PROVISIONAL_MAX_ROUNDS,
  bondProgressPerBattle: PROVISIONAL_BOND_PROGRESS_PER_BATTLE,
  bondProgressPerBondLevel: PROVISIONAL_BOND_PROGRESS_PER_BOND_LEVEL,
  bondLevelCap: PROVISIONAL_BOND_LEVEL_CAP,
  journeyRankProgressPerNormalWin:
    PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_NORMAL_WIN,
  journeyRankProgressPerBossWin: PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_BOSS_WIN,
  journeyRankProgressPerRank: PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_RANK,
  journeyRankCap: PROVISIONAL_JOURNEY_RANK_CAP,
};

export const TEST_FORGE_RELIC_CONFIG: ForgeRelicConfig = {
  echoChargeCost: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST,
  forgesPerLevel: PROVISIONAL_FORGES_PER_FORGE_LEVEL,
  forgeLevelCap: PROVISIONAL_FORGE_LEVEL_CAP,
  insightGuaranteeThreshold: PROVISIONAL_INSIGHT_GUARANTEE_THRESHOLD,
  insightGuaranteedMinimumRarity: PROVISIONAL_INSIGHT_GUARANTEED_MINIMUM_RARITY,
  relicGenerationConfig: PROVISIONAL_RELIC_GENERATION_CONFIG,
};

export const TEST_RECYCLE_RELIC_CONFIG: RecycleRelicConfig = {
  coinsByRarity: PROVISIONAL_RECYCLE_COINS_BY_RARITY,
  insightGainPerRecycle: PROVISIONAL_INSIGHT_GAIN_PER_RECYCLE,
};
