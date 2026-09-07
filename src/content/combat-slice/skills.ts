/**
 * Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §4
 * Skill Loadout; docs/rebuild/15 Phase R4. One Signature Skill per Path —
 * "add only enough stats/effects/skills to make them genuinely behave
 * differently" (Phase R4 instruction), not the full "4 Active + 1
 * Signature + 2 Passive" target loadout shape (explicit future work).
 */
import { SkillId } from "../../core/ids/index.ts";
import { type SkillDefinition } from "../../domain/loadout/index.ts";

export const BREAKER_SIGNATURE_SKILL_ID = SkillId.from(
  "breaker-signature-rend",
);
export const WARDEN_SIGNATURE_SKILL_ID = SkillId.from(
  "warden-signature-bulwark",
);
export const WEAVER_SIGNATURE_SKILL_ID = SkillId.from(
  "weaver-signature-cinderweave",
);

export const COMBAT_SLICE_SKILLS: readonly SkillDefinition[] = [
  {
    skillId: BREAKER_SIGNATURE_SKILL_ID,
    displayName: "Rend",
    pathId: "BREAKER",
    isSignature: true,
    statBonus: { critDamageBps: 4_000, comboChanceBps: 1_000 },
  },
  {
    skillId: WARDEN_SIGNATURE_SKILL_ID,
    displayName: "Bulwark",
    pathId: "WARDEN",
    isSignature: true,
    statBonus: { guardBps: 1_500, hp: 40 },
  },
  {
    skillId: WEAVER_SIGNATURE_SKILL_ID,
    displayName: "Cinderweave",
    pathId: "WEAVER",
    isSignature: true,
    statBonus: { skillPower: 8, elementalPower: 6 },
  },
];
