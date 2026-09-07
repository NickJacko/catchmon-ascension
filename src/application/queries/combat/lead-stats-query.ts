/**
 * Design owner: docs/rebuild/15 Phases R2-R5. Composes the Lead Catchmon's
 * final `CombatStats` from every layer: level base -> Battle Path -> Skills
 * -> Relic Matrix -> Bond Support — the one place these layers are stacked,
 * reused by both the `ATTEMPT_STAGE` command and (later) any preview/UI
 * query, matching this codebase's existing "one canonical composition,
 * reused by command and query" pattern (`transaction-quote-engine.ts`).
 */
import { type CatchmonLineId } from "../../../core/ids/index.ts";
import {
  addStats,
  baseStatsForLevel,
  type BaseStatsConfig,
  type CombatStats,
} from "../../../domain/combat/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import {
  computeBondSupportBonus,
  type BondSupportBehaviorId,
} from "../../../domain/catchmons/index.ts";
import { applyRelicMatrixBonuses } from "../../../domain/forge/index.ts";
import {
  type GameState,
  type RelicInstanceState,
} from "../../../domain/game-state/index.ts";
import {
  applyBattlePathBonus,
  applySkillBonuses,
  type BattlePathBonusConfig,
} from "../../../domain/loadout/index.ts";

export interface LeadStatsConfig {
  readonly baseStatsConfig: BaseStatsConfig;
  readonly battlePathBonuses: BattlePathBonusConfig;
  readonly bondSupportBehaviors: Readonly<
    Record<CatchmonLineId, BondSupportBehaviorId>
  >;
  readonly bondSupportBonusPerLevel: number;
  /**
   * docs/rebuild/06 §6 Evolution Benefits ("evolution can improve base
   * profile"). PROVISIONAL: no real per-species canonical combat profile
   * exists yet (`domain/combat/catchmon-stats.ts`'s own doc comment), so
   * evolution's combat effect is this flat per-stage bonus (scaled by the
   * Lead's current `CatchmonSpeciesDefinition.stageIndex`) rather than a
   * bespoke per-species profile — evolving still concretely changes combat
   * output, just via a simple, honestly-labeled placeholder formula.
   */
  readonly evolutionStageAttackBonus: number;
  readonly evolutionStageHpBonus: number;
  readonly evolutionStageDefenseBonus: number;
}

/** `null` when no Lead is assigned, or the assigned Lead no longer exists (defensive — should be impossible given `validateGameState`'s sync check). */
export function deriveLeadCombatStats(
  state: GameState,
  catalog: GameCatalog,
  config: LeadStatsConfig,
): CombatStats | null {
  const leadId = state.loadout.leadCatchmonId;
  if (!leadId) return null;
  const owned = state.catchmons.ownedCatchmons[leadId];
  if (!owned) return null;

  let stats = baseStatsForLevel(owned.level, config.baseStatsConfig);

  const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
  const stageIndex = species?.stageIndex ?? 0;
  if (stageIndex > 0) {
    stats = addStats(stats, {
      attack: stageIndex * config.evolutionStageAttackBonus,
      hp: stageIndex * config.evolutionStageHpBonus,
      defense: stageIndex * config.evolutionStageDefenseBonus,
    });
  }

  stats = applyBattlePathBonus(
    stats,
    state.loadout.battlePathId,
    config.battlePathBonuses,
  );
  stats = applySkillBonuses(
    stats,
    state.loadout.equippedSkillIds,
    catalog.skills,
  );

  const equippedRelics: {
    readonly relic: RelicInstanceState;
    readonly mainStatKey: keyof CombatStats;
  }[] = [];
  for (const relicInstanceId of Object.values(state.loadout.relicMatrix)) {
    if (!relicInstanceId) continue;
    const relic = state.relicInventory.relics[relicInstanceId];
    if (!relic) continue;
    const archetype = catalog.relicArchetypes.get(relic.relicArchetypeId);
    if (!archetype) continue;
    equippedRelics.push({ relic, mainStatKey: archetype.mainStatKey });
  }
  stats = applyRelicMatrixBonuses(stats, equippedRelics);

  for (const supportId of state.loadout.bondSupportCatchmonIds) {
    const support = state.catchmons.ownedCatchmons[supportId];
    if (!support) continue;
    const behaviorId = config.bondSupportBehaviors[support.lineId];
    if (!behaviorId) continue;
    stats = addStats(
      stats,
      computeBondSupportBonus(
        behaviorId,
        support.bondLevel,
        config.bondSupportBonusPerLevel,
      ),
    );
  }

  return stats;
}
