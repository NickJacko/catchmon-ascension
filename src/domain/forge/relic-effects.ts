/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §4 Relic
 * Data; docs/rebuild/15 Phase R3/R4. Converts one equipped Relic instance
 * into a flat `CombatStats` bonus — the main stat plus every rolled affix,
 * each mapped 1:1 onto the `CombatStats` field it names (Document 04 §11:
 * affixes are "add this much to that stat," not bespoke formulas).
 */
import { addStats } from "../combat/catchmon-stats.ts";
import { type CombatStats, type StatDelta } from "../combat/types.ts";
import { type RelicInstanceState } from "../game-state/index.ts";
import { type AffixType } from "./types.ts";

const AFFIX_STAT_KEY: Readonly<Record<AffixType, keyof CombatStats>> = {
  CRIT: "critChanceBps",
  COMBO: "comboChanceBps",
  COUNTER: "counterChanceBps",
  GUARD: "guardBps",
  SKILL_POWER: "skillPower",
  SKILL_HASTE: "skillHasteBps",
  ATTACK_SPEED: "attackSpeed",
  ELEMENTAL_POWER: "elementalPower",
  ACCURACY: "accuracyBps",
  EVASION: "evasionBps",
};

/** The stat bonus one equipped Relic instance contributes, given its archetype's main-stat key. */
export function relicStatBonus(
  relic: RelicInstanceState,
  mainStatKey: keyof CombatStats,
): StatDelta {
  const bonus: Partial<Record<keyof CombatStats, number>> = {
    [mainStatKey]: relic.mainStatValue,
  };
  for (const affix of relic.affixes) {
    const key = AFFIX_STAT_KEY[affix.type];
    bonus[key] = (bonus[key] ?? 0) + affix.value;
  }
  return bonus;
}

/** Stacks every equipped Relic's stat bonus onto a base stat block. `relicsBySlot` supplies each equipped instance alongside the archetype-derived `mainStatKey` needed to interpret it (kept out of `RelicInstanceState` itself — see Document 04 §4 "GameState stores IDs/state, not duplicated full definitions"). */
export function applyRelicMatrixBonuses(
  stats: CombatStats,
  equippedRelics: readonly {
    readonly relic: RelicInstanceState;
    readonly mainStatKey: keyof CombatStats;
  }[],
): CombatStats {
  return equippedRelics.reduce(
    (acc, { relic, mainStatKey }) =>
      addStats(acc, relicStatBonus(relic, mainStatKey)),
    stats,
  );
}
