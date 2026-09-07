/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §3 Core
 * Combat Stats, §4 Battle Paths, §9 Determinism; docs/rebuild/15 Phase R2.
 *
 * Content-domain types only — no enemy/stage records are created here.
 * All percentages use basis points internally (CLAUDE.md/Doc 03 §3), via
 * the existing `ProbabilityBps` (bounded [0,10000], used for chance-type
 * fields) and `BasisPoints` (unbounded multiplier/modifier, used for
 * crit-damage/guard/skill-haste, which can legitimately exceed 100%).
 */
import { type EnemyId } from "../../core/ids/index.ts";
import {
  type BasisPoints,
  type ProbabilityBps,
} from "../../core/math/index.ts";
import { type ElementId } from "../world/types.ts";

/**
 * Document 03 §3's 15-stat initial model. Only a meaningful subset is
 * wired into `simulateBattle`'s formulas (see that module's doc comment)
 * — the rest exist as real, typed fields so Relics/Skills/Battle Paths
 * have something concrete to modify, per "keep formulas intentionally
 * simple and provisional" (docs/rebuild/15 Phase R2 instruction).
 */
export interface CombatStats {
  readonly hp: number;
  readonly attack: number;
  readonly defense: number;
  /** Higher = acts more often. Baseline 100 (see `battle-simulation.ts`'s `BASE_ATTACK_SPEED`). */
  readonly attackSpeed: number;
  readonly critChanceBps: ProbabilityBps;
  /** Total damage multiplier on a crit, e.g. 15000 = x1.5. */
  readonly critDamageBps: BasisPoints;
  readonly comboChanceBps: ProbabilityBps;
  readonly counterChanceBps: ProbabilityBps;
  /** Incoming physical-hit damage reduction, clamped [0, 9000] bps by `clampGuardBps`. */
  readonly guardBps: BasisPoints;
  readonly evasionBps: ProbabilityBps;
  readonly accuracyBps: ProbabilityBps;
  readonly skillPower: number;
  /** Increases skill-charge gain rate per landed hit. */
  readonly skillHasteBps: BasisPoints;
  readonly elementalPower: number;
  readonly elementalResistance: number;
}

/**
 * Document 03 §4: species are not permanently locked to a Path — this is
 * a loadout choice, not a content-authored property of a Catchmon.
 */
export type BattlePathId = "BREAKER" | "WARDEN" | "WEAVER";

/**
 * Document 03 §7 Boss Archetypes — a closed vocabulary of "what kind of
 * check is this boss," kept for presentation/design traceability. Not
 * read by `simulateBattle` itself (Document 03 §7: "each boss should
 * support more than one viable response" — the simulator does not special-
 * case archetypes, real stat differences are what create the check).
 */
export type BossArchetype =
  | "BURST_CHECK"
  | "SUSTAIN_CHECK"
  | "SKILL_CHECK"
  | "MULTI_HIT_COUNTER_CHECK"
  | "ACCURACY_EVASION_CHECK"
  | "ELEMENTAL_RESISTANCE_CHECK"
  | "TEMPO_CHECK";

/** Document 03 §6-7: a normal enemy or a boss (`isBoss: true`), same shape. */
export interface EnemyDefinition {
  readonly enemyId: EnemyId;
  readonly displayName: string;
  readonly stats: CombatStats;
  readonly isBoss: boolean;
  readonly bossArchetype?: BossArchetype;
  readonly elementId?: ElementId;
}

export type BattleOutcome = "WIN" | "LOSS" | "TIMEOUT";

/** One resolved attack/skill/combo/counter action, for failure-explanation UI (Document 02 §10) — not persisted, returned alongside `BattleResult` for the calling command to summarize/discard. */
export interface BattleLogEntry {
  readonly actor: "LEAD" | "ENEMY";
  readonly kind: "ATTACK" | "SKILL" | "COMBO" | "COUNTER";
  readonly damage: number;
  readonly wasCrit: boolean;
  readonly targetHpAfter: number;
}

export interface BattleResult {
  readonly outcome: BattleOutcome;
  readonly leadHpRemaining: number;
  readonly enemyHpRemaining: number;
  readonly totalDamageDealt: number;
  readonly totalDamageTaken: number;
  readonly rounds: number;
  readonly log: readonly BattleLogEntry[];
}

export interface BattleSimulationConfig {
  /** Hard round cap so a stalemate (both sides' net damage per hit is ~0) fails clearly instead of looping forever (Document 03 §9 determinism / this task's "invalid combat state fails clearly" requirement). */
  readonly maxRounds: number;
}

/**
 * A flat stat bonus expressed as plain numbers, not branded `ProbabilityBps`/
 * `BasisPoints` values — the type every Battle Path/Skill/Relic/Bond-Support
 * bonus is authored/composed as (`catchmon-stats.ts`'s `addStats` re-derives
 * the correctly-branded result). Content authors a bonus the same way
 * regardless of which underlying `CombatStats` field it targets; only the
 * final composed `CombatStats` needs to satisfy the branded invariants.
 */
export type StatDelta = Readonly<Partial<Record<keyof CombatStats, number>>>;
