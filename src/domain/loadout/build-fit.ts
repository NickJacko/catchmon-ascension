/**
 * Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §8
 * Build Fit ("advisory, not a hidden authority"); docs/rebuild/15 Phase R4
 * ("A higher raw Power loadout must not automatically have higher Build
 * Fit" — the explicit exit test this module is built to satisfy).
 *
 * `computePowerScore` is a generic, Path-agnostic "how strong overall"
 * number: every stat contributes via a fixed weight, regardless of Path.
 * `computeBuildFit` instead asks a narrower question — of that same
 * weighted total, what fraction comes from stats the *current Path*
 * actually cares about (Document 05 §2's per-Path primary-stat lists)?
 * A loadout that dumps its investment into off-Path stats scores high
 * Power but low Build Fit; a modest loadout concentrated in on-Path stats
 * scores lower Power but high Build Fit — the ratio is independent of
 * total magnitude by construction (see `build-fit.test.ts`).
 */
import { type BattlePathId, type CombatStats } from "../combat/types.ts";
import { type BuildFitResult } from "./types.ts";

/** PROVISIONAL: every weight is a rough, unbalanced placeholder (CLAUDE.md §13). */
export interface PowerWeights {
  readonly hp: number;
  readonly attack: number;
  readonly defense: number;
  readonly attackSpeed: number;
  readonly critChanceBps: number;
  readonly critDamageBps: number;
  readonly comboChanceBps: number;
  readonly counterChanceBps: number;
  readonly guardBps: number;
  readonly evasionBps: number;
  readonly accuracyBps: number;
  readonly skillPower: number;
  readonly skillHasteBps: number;
  readonly elementalPower: number;
  readonly elementalResistance: number;
}

function weightedContributions(
  stats: CombatStats,
  weights: PowerWeights,
): Readonly<Record<keyof CombatStats, number>> {
  return {
    hp: stats.hp * weights.hp,
    attack: stats.attack * weights.attack,
    defense: stats.defense * weights.defense,
    attackSpeed: stats.attackSpeed * weights.attackSpeed,
    critChanceBps: stats.critChanceBps * weights.critChanceBps,
    critDamageBps: stats.critDamageBps * weights.critDamageBps,
    comboChanceBps: stats.comboChanceBps * weights.comboChanceBps,
    counterChanceBps: stats.counterChanceBps * weights.counterChanceBps,
    guardBps: stats.guardBps * weights.guardBps,
    evasionBps: stats.evasionBps * weights.evasionBps,
    accuracyBps: stats.accuracyBps * weights.accuracyBps,
    skillPower: stats.skillPower * weights.skillPower,
    skillHasteBps: stats.skillHasteBps * weights.skillHasteBps,
    elementalPower: stats.elementalPower * weights.elementalPower,
    elementalResistance:
      stats.elementalResistance * weights.elementalResistance,
  };
}

/** Generic, Path-agnostic total strength — "Power" (Document 03 §12). */
export function computePowerScore(
  stats: CombatStats,
  weights: PowerWeights,
): number {
  const contributions = weightedContributions(stats, weights);
  return Object.values(contributions).reduce((sum, v) => sum + v, 0);
}

const PATH_PRIMARY_STATS: Readonly<
  Record<BattlePathId, readonly (keyof CombatStats)[]>
> = {
  BREAKER: ["attackSpeed", "critChanceBps", "critDamageBps", "comboChanceBps"],
  WARDEN: ["defense", "guardBps", "counterChanceBps", "hp"],
  WEAVER: ["skillPower", "skillHasteBps", "elementalPower"],
};

export function computeBuildFit(
  stats: CombatStats,
  pathId: BattlePathId,
  weights: PowerWeights,
): BuildFitResult {
  const contributions = weightedContributions(stats, weights);
  const totalPower = Object.values(contributions).reduce(
    (sum, v) => sum + v,
    0,
  );
  if (totalPower <= 0) {
    return { scoreBps: 0, notes: ["No combat stats to evaluate."] };
  }

  const primaryStats = PATH_PRIMARY_STATS[pathId];
  const onPathPower = primaryStats.reduce(
    (sum, key) => sum + contributions[key],
    0,
  );
  const scoreBps = Math.round(
    Math.min(1, Math.max(0, onPathPower / totalPower)) * 10_000,
  );

  const notes: string[] = [];
  if (scoreBps >= 6_000) {
    notes.push(`Strong ${pathId} concentration.`);
  } else if (scoreBps < 3_000) {
    notes.push(`Low ${pathId} support — most stats are off-Path.`);
  }

  return { scoreBps, notes };
}
