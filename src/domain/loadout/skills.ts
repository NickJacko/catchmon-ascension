/**
 * Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §4
 * Skill Loadout; docs/rebuild/15 Phase R4. Pure — stacks each equipped
 * skill's flat `statBonus` onto a base stat block; unknown skill IDs are
 * skipped rather than throwing (a stale/removed skill in an old loadout
 * must not brick the whole stat computation).
 */
import { type SkillId } from "../../core/ids/index.ts";
import { type Registry } from "../../core/registry/index.ts";
import { addStats } from "../combat/catchmon-stats.ts";
import { type CombatStats } from "../combat/types.ts";
import { type SkillDefinition } from "./types.ts";

export function applySkillBonuses(
  stats: CombatStats,
  equippedSkillIds: readonly SkillId[],
  skillDefinitions: Registry<SkillId, SkillDefinition>,
): CombatStats {
  return equippedSkillIds.reduce((acc, skillId) => {
    const skill = skillDefinitions.get(skillId);
    return skill ? addStats(acc, skill.statBonus) : acc;
  }, stats);
}
