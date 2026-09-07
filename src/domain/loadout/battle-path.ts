/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §4 Battle
 * Paths; docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §2;
 * docs/rebuild/15 Phase R4.
 *
 * A Path applies a flat PROVISIONAL bonus to its own primary stats
 * (Document 05 §2's stat lists), so the three Paths behave materially
 * differently in `simulateBattle` against the same boss without needing
 * any path-specific branching in the simulator itself — the difference is
 * entirely in which stats got the bonus.
 */
import { addStats } from "../combat/catchmon-stats.ts";
import {
  type BattlePathId,
  type CombatStats,
  type StatDelta,
} from "../combat/types.ts";

export type BattlePathBonusConfig = Readonly<Record<BattlePathId, StatDelta>>;

export function applyBattlePathBonus(
  stats: CombatStats,
  pathId: BattlePathId | undefined,
  config: BattlePathBonusConfig,
): CombatStats {
  if (!pathId) return stats;
  return addStats(stats, config[pathId]);
}
