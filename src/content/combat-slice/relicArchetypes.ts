/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §3-4;
 * docs/rebuild/15 Phase R3. One archetype per Relic Matrix slot — a small
 * synthetic pool, not final Relic content (Phase R3 instruction: "Use only
 * a small synthetic/vertical-slice Relic pool. Do NOT create final large
 * Relic content.").
 */
import { RelicArchetypeId } from "../../core/ids/index.ts";
import { type RelicArchetypeDefinition } from "../../domain/forge/index.ts";

export const RELIC_ARCHETYPE_CORE_ID =
  RelicArchetypeId.from("relic-core-ember");
export const RELIC_ARCHETYPE_CREST_ID = RelicArchetypeId.from(
  "relic-crest-vanguard",
);
export const RELIC_ARCHETYPE_FANG_ID = RelicArchetypeId.from("relic-fang-ash");
export const RELIC_ARCHETYPE_SHELL_ID =
  RelicArchetypeId.from("relic-shell-basalt");
export const RELIC_ARCHETYPE_STEP_ID =
  RelicArchetypeId.from("relic-step-cinder");
export const RELIC_ARCHETYPE_FOCUS_ID =
  RelicArchetypeId.from("relic-focus-rift");
export const RELIC_ARCHETYPE_CHARM_ID =
  RelicArchetypeId.from("relic-charm-ember");
export const RELIC_ARCHETYPE_ECHO_ID = RelicArchetypeId.from(
  "relic-echo-resonant",
);

export const COMBAT_SLICE_RELIC_ARCHETYPES: readonly RelicArchetypeDefinition[] =
  [
    {
      relicArchetypeId: RELIC_ARCHETYPE_CORE_ID,
      displayName: "Ember Core",
      slot: "CORE",
      mainStatKey: "attack",
      baseMainStatValue: 8,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_CREST_ID,
      displayName: "Vanguard Crest",
      slot: "CREST",
      mainStatKey: "hp",
      baseMainStatValue: 40,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_FANG_ID,
      displayName: "Ashfang",
      slot: "FANG",
      mainStatKey: "critChanceBps",
      baseMainStatValue: 600,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_SHELL_ID,
      displayName: "Basalt Shell",
      slot: "SHELL",
      mainStatKey: "defense",
      baseMainStatValue: 6,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_STEP_ID,
      displayName: "Cinder Step",
      slot: "STEP",
      mainStatKey: "attackSpeed",
      baseMainStatValue: 12,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_FOCUS_ID,
      displayName: "Rift Focus",
      slot: "FOCUS",
      mainStatKey: "skillPower",
      baseMainStatValue: 6,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_CHARM_ID,
      displayName: "Ember Charm",
      slot: "CHARM",
      mainStatKey: "elementalPower",
      baseMainStatValue: 5,
    },
    {
      relicArchetypeId: RELIC_ARCHETYPE_ECHO_ID,
      displayName: "Resonant Echo",
      slot: "ECHO",
      mainStatKey: "skillHasteBps",
      baseMainStatValue: 500,
    },
  ];
