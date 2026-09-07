/**
 * Design owner: docs/rebuild/06_CATCHMON_COLLECTION_BOND_AND_EVOLUTION.md
 * §8 Bond Support Design ("avoid generic '+3% Attack to all'"); docs/
 * rebuild/15 Phase R5.
 *
 * A deliberate PROVISIONAL simplification: each behavior is a flat stat
 * bonus (scaled by the supporting Catchmon's own Bond level) applied to
 * the Lead's stats, rather than a live mid-battle trigger — the same
 * "stat-modifier, not bespoke event logic" simplification already used
 * for Skills (`domain/loadout/skills.ts`) and Battle Path bonuses. What
 * keeps this "not merely a generic flat stat card" (the Phase R5 explicit
 * requirement) is that each of the eight behaviors targets a genuinely
 * different `CombatStats` field — a support Catchmon's *identity*
 * (which behavior it has) changes *what kind* of help it gives, not just
 * a magnitude.
 */
import { type CombatStats, type StatDelta } from "../combat/types.ts";

export type BondSupportBehaviorId =
  | "ASSIST_STRIKE"
  | "BARRIER"
  | "RESCUE"
  | "ECHO_GENERATION"
  | "COOLDOWN_PUSH"
  | "CRIT_MARK"
  | "ELEMENTAL_PRIMER"
  | "COUNTER_TRIGGER";

const BEHAVIOR_STAT_KEY: Readonly<
  Record<BondSupportBehaviorId, keyof CombatStats>
> = {
  ASSIST_STRIKE: "attack",
  BARRIER: "guardBps",
  RESCUE: "hp",
  ECHO_GENERATION: "skillHasteBps",
  COOLDOWN_PUSH: "attackSpeed",
  CRIT_MARK: "critChanceBps",
  ELEMENTAL_PRIMER: "elementalPower",
  COUNTER_TRIGGER: "counterChanceBps",
};

/** One assigned Bond Support Catchmon's contribution to the Lead's stats — `bondLevel` is the supporting Catchmon's own Bond level (0/absent treated as 1, a fresh assignment still helps a little). */
export function computeBondSupportBonus(
  behaviorId: BondSupportBehaviorId,
  bondLevel: number | undefined,
  bonusPerBondLevel: number,
): StatDelta {
  const effectiveLevel = Math.max(1, bondLevel ?? 1);
  return {
    [BEHAVIOR_STAT_KEY[behaviorId]]: bonusPerBondLevel * effectiveLevel,
  };
}
