/** Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §4 Skill Loadout; docs/rebuild/15 Phase R4. Replaces the entire equipped-skill set atomically — every skill must be unlocked (`skills.unlockedSkillIds`), and the count is capped (`maxEquippedSkills`, PROVISIONAL — this slice only has 3 total Signature Skills, not the full "4 Active + 1 Signature + 2 Passive" target shape). */
import { type SkillId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type LoadoutEvent } from "./loadout-events.ts";

export interface SetSkillLoadoutPayload {
  readonly skillIds: readonly SkillId[];
}

export function createSetSkillLoadoutHandler(
  maxEquippedSkills: number,
): CommandHandler<GameState, SetSkillLoadoutPayload, LoadoutEvent> {
  return (state, command) => {
    const { skillIds } = command.payload;
    if (skillIds.length > maxEquippedSkills) {
      return err({
        code: "TOO_MANY_SKILLS",
        message: `Cannot equip ${String(skillIds.length)} skills, maximum is ${String(maxEquippedSkills)}`,
      });
    }
    const unknown = skillIds.find(
      (id) => !state.skills.unlockedSkillIds.includes(id),
    );
    if (unknown) {
      return err({
        code: "SKILL_NOT_UNLOCKED",
        message: `Skill "${unknown}" is not unlocked`,
      });
    }

    const nextState: GameState = {
      ...state,
      loadout: { ...state.loadout, equippedSkillIds: skillIds },
    };
    return ok({
      nextState,
      events: [{ kind: "SKILL_LOADOUT_SET", skillIds }],
    });
  };
}
