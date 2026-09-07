/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §3;
 * docs/rebuild/15 Phase R2. PROVISIONAL: no canonical per-species combat
 * profile exists yet (Document 06's canonical species data has no
 * attack/defense/hp fields) — every Catchmon shares the same flat,
 * level-scaled base curve for now (mirrors `xp-ledger.ts`'s own "flat
 * centralized curve, config supplied by caller, never hardcoded" shape).
 * A real per-species combat identity is later content-authoring work, not
 * invented here (CLAUDE.md's primary rule).
 */
import { toBasisPoints, toProbabilityBps } from "../../core/math/index.ts";
import { type CombatStats, type StatDelta } from "./types.ts";

export interface BaseStatsConfig {
  readonly baseHp: number;
  readonly hpPerLevel: number;
  readonly baseAttack: number;
  readonly attackPerLevel: number;
  readonly baseDefense: number;
  readonly defensePerLevel: number;
  readonly baseAttackSpeed: number;
  readonly baseSkillPower: number;
  readonly skillPowerPerLevel: number;
  readonly baseElementalPower: number;
  readonly baseElementalResistance: number;
  readonly baseCritChanceBps: number;
  readonly baseCritDamageBps: number;
  readonly baseEvasionBps: number;
  readonly baseAccuracyBps: number;
}

/** A Catchmon's un-modified combat profile from level alone — Battle Path, skills, Relics and Bond Support all layer on top of this in `domain/loadout` (docs/rebuild/05). */
export function baseStatsForLevel(
  level: number,
  config: BaseStatsConfig,
): CombatStats {
  return {
    hp: config.baseHp + config.hpPerLevel * level,
    attack: config.baseAttack + config.attackPerLevel * level,
    defense: config.baseDefense + config.defensePerLevel * level,
    attackSpeed: config.baseAttackSpeed,
    critChanceBps: toProbabilityBps(config.baseCritChanceBps),
    critDamageBps: toBasisPoints(config.baseCritDamageBps),
    comboChanceBps: toProbabilityBps(0),
    counterChanceBps: toProbabilityBps(0),
    guardBps: toBasisPoints(0),
    evasionBps: toProbabilityBps(config.baseEvasionBps),
    accuracyBps: toProbabilityBps(config.baseAccuracyBps),
    skillPower: config.baseSkillPower + config.skillPowerPerLevel * level,
    skillHasteBps: toBasisPoints(0),
    elementalPower: config.baseElementalPower,
    elementalResistance: config.baseElementalResistance,
  };
}

/** Adds two stat blocks — the shared building block `domain/loadout`'s Battle Path/skill/Relic/Bond-Support layering functions use to stack flat bonuses onto a base profile. */
export function addStats(a: CombatStats, b: StatDelta): CombatStats {
  return {
    hp: a.hp + (b.hp ?? 0),
    attack: a.attack + (b.attack ?? 0),
    defense: a.defense + (b.defense ?? 0),
    attackSpeed: a.attackSpeed + (b.attackSpeed ?? 0),
    critChanceBps: toProbabilityBps(
      Math.min(10_000, a.critChanceBps + (b.critChanceBps ?? 0)),
    ),
    critDamageBps: toBasisPoints(a.critDamageBps + (b.critDamageBps ?? 0)),
    comboChanceBps: toProbabilityBps(
      Math.min(10_000, a.comboChanceBps + (b.comboChanceBps ?? 0)),
    ),
    counterChanceBps: toProbabilityBps(
      Math.min(10_000, a.counterChanceBps + (b.counterChanceBps ?? 0)),
    ),
    guardBps: toBasisPoints(Math.max(0, a.guardBps + (b.guardBps ?? 0))),
    evasionBps: toProbabilityBps(
      Math.min(10_000, a.evasionBps + (b.evasionBps ?? 0)),
    ),
    accuracyBps: toProbabilityBps(
      Math.min(10_000, a.accuracyBps + (b.accuracyBps ?? 0)),
    ),
    skillPower: a.skillPower + (b.skillPower ?? 0),
    skillHasteBps: toBasisPoints(
      Math.max(0, a.skillHasteBps + (b.skillHasteBps ?? 0)),
    ),
    elementalPower: a.elementalPower + (b.elementalPower ?? 0),
    elementalResistance: a.elementalResistance + (b.elementalResistance ?? 0),
  };
}
