/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §9
 * Determinism ("Combat must be deterministic from: state, combat config,
 * seed. No hidden browser-timing dependency."); docs/rebuild/15 Phase R2.
 *
 * A deliberately simple, PROVISIONAL deterministic battle formula — real
 * balance/tuning is explicit future work (Phase R2 instruction: "Keep
 * formulas intentionally simple and provisional"). Pure function: no
 * `GameState`/`GameCatalog` reads, no `Date.now()`, no `Math.random()` —
 * all randomness flows through the injected seeded `RandomSource`
 * (`core/random`), so the exact same `(leadStats, enemyStats, seed,
 * config)` always produces the exact same `BattleResult`.
 *
 * Timing model: each side accumulates a "readiness meter" by its own
 * `attackSpeed` every round; whichever meter crosses `READY_THRESHOLD`
 * acts (Lead breaks ties, a documented, deterministic simplification —
 * Document 03 does not specify a tie-break rule). Bounded by
 * `config.maxRounds` so a stalemate (both sides' net damage per hit is
 * effectively zero) fails clearly as `"TIMEOUT"` instead of looping
 * forever — the explicit "invalid combat state fails clearly" requirement.
 *
 * Only a meaningful subset of Document 03 §3's 15 stats is wired into real
 * formulas here, chosen specifically so the three Battle Paths (Breaker:
 * attackSpeed/crit/combo; Warden: defense/guard/counter; Weaver: skillPower/
 * skillHaste/elementalPower — docs/rebuild/05) each have a distinct lever:
 * accuracy/evasion gate whether a hit lands at all; attack/defense/crit/
 * guard/combo/counter resolve normal-attack damage; skillPower/skillHaste/
 * elementalPower/elementalResistance resolve a separate periodic skill hit
 * that bypasses Guard (deliberately — it is what makes Weaver mechanically
 * distinct from Warden's guard-heavy sustain, not merely reskinned).
 */
import {
  applyBasisPoints,
  clampProbability,
  toBasisPoints,
  type BasisPoints,
  type ProbabilityBps,
} from "../../core/math/index.ts";
import { rollSucceeds, type RandomSource } from "../../core/random/index.ts";
import { err, ok, type Result } from "../../core/result/index.ts";
import {
  type BattleLogEntry,
  type BattleResult,
  type BattleSimulationConfig,
  type CombatStats,
} from "./types.ts";

/** PROVISIONAL: a round meter crossing this value acts once (see module doc's timing model) — deliberately the same order of magnitude as baseline `attackSpeed` (~100), so a baseline combatant acts roughly once per round and `maxRounds` translates directly into "roughly this many actions per side," not into hundreds of do-nothing rounds. */
const READY_THRESHOLD = 100;
/** PROVISIONAL: Guard is capped below 100% so an attack can never be reduced to zero by stacking Guard alone. */
const GUARD_CAP_BPS = 9_000;
/** PROVISIONAL: a combo hit deals half of the triggering hit's base (pre-crit/guard) damage. */
const COMBO_DAMAGE_FACTOR_BPS = toBasisPoints(5_000);
/** PROVISIONAL: skill-charge gained per landed normal hit, before Skill Haste. */
const SKILL_CHARGE_PER_HIT = 2_500;
/** PROVISIONAL: a skill fires once accumulated charge reaches this threshold — roughly every 4th unmodified hit. */
const SKILL_CHARGE_THRESHOLD = 10_000;

export type BattleSimulationErrorCode =
  "LEAD_HP_NOT_POSITIVE" | "ENEMY_HP_NOT_POSITIVE" | "NEGATIVE_STAT";

export interface BattleSimulationError {
  readonly code: BattleSimulationErrorCode;
  readonly message: string;
}

interface ParticipantRuntime {
  readonly stats: CombatStats;
  hp: number;
  skillCharge: number;
  meter: number;
}

function validateStats(
  label: "LEAD" | "ENEMY",
  stats: CombatStats,
): BattleSimulationError | null {
  if (stats.hp <= 0) {
    return {
      code: label === "LEAD" ? "LEAD_HP_NOT_POSITIVE" : "ENEMY_HP_NOT_POSITIVE",
      message: `${label} combat stats must have hp > 0, received ${String(stats.hp)}`,
    };
  }
  if (stats.attackSpeed <= 0) {
    return {
      code: "NEGATIVE_STAT",
      message: `${label} attackSpeed must be > 0, received ${String(stats.attackSpeed)}`,
    };
  }
  if (stats.attack < 0 || stats.defense < 0) {
    return {
      code: "NEGATIVE_STAT",
      message: `${label} attack/defense must be >= 0`,
    };
  }
  return null;
}

function guardMultiplierBps(guardBps: number): BasisPoints {
  const cappedGuard = Math.min(Math.max(guardBps, 0), GUARD_CAP_BPS);
  return toBasisPoints(10_000 - cappedGuard);
}

function hitChanceOf(
  attacker: CombatStats,
  defender: CombatStats,
): ProbabilityBps {
  const effectiveEvasion = clampProbability(
    defender.evasionBps - attacker.accuracyBps,
  );
  return clampProbability(10_000 - effectiveEvasion);
}

/**
 * Resolves one full "turn" for `actor` acting against `target`: hit/miss,
 * normal-attack damage (crit + Guard applied), an optional Combo follow-up,
 * an optional Counter from `target`, and skill-charge accrual/discharge.
 * Mutates the two runtime objects in place (function-local state only —
 * `CombatStats` itself is never mutated) and appends every resolved
 * sub-action to `log`.
 */
function resolveTurn(
  rng: RandomSource,
  actorLabel: "LEAD" | "ENEMY",
  actor: ParticipantRuntime,
  target: ParticipantRuntime,
  log: BattleLogEntry[],
): void {
  const targetLabel = actorLabel === "LEAD" ? "ENEMY" : "LEAD";

  if (!rollSucceeds(rng, hitChanceOf(actor.stats, target.stats))) {
    log.push({
      actor: actorLabel,
      kind: "ATTACK",
      damage: 0,
      wasCrit: false,
      targetHpAfter: target.hp,
    });
    return;
  }

  const isCrit = rollSucceeds(rng, actor.stats.critChanceBps);
  const baseDamage = Math.max(1, actor.stats.attack - target.stats.defense);
  const critAdjusted = isCrit
    ? applyBasisPoints(baseDamage, actor.stats.critDamageBps)
    : baseDamage;
  const guardAdjusted = applyBasisPoints(
    critAdjusted,
    guardMultiplierBps(target.stats.guardBps),
  );
  target.hp -= guardAdjusted;
  log.push({
    actor: actorLabel,
    kind: "ATTACK",
    damage: guardAdjusted,
    wasCrit: isCrit,
    targetHpAfter: target.hp,
  });

  if (target.hp > 0 && rollSucceeds(rng, actor.stats.comboChanceBps)) {
    const comboBase = applyBasisPoints(baseDamage, COMBO_DAMAGE_FACTOR_BPS);
    const comboDamage = applyBasisPoints(
      Math.max(1, comboBase),
      guardMultiplierBps(target.stats.guardBps),
    );
    target.hp -= comboDamage;
    log.push({
      actor: actorLabel,
      kind: "COMBO",
      damage: comboDamage,
      wasCrit: false,
      targetHpAfter: target.hp,
    });
  }

  if (target.hp > 0 && rollSucceeds(rng, target.stats.counterChanceBps)) {
    const counterDamage = applyBasisPoints(
      Math.max(1, target.stats.attack - actor.stats.defense),
      guardMultiplierBps(actor.stats.guardBps),
    );
    actor.hp -= counterDamage;
    log.push({
      actor: targetLabel,
      kind: "COUNTER",
      damage: counterDamage,
      wasCrit: false,
      targetHpAfter: actor.hp,
    });
  }

  if (target.hp > 0 && actor.hp > 0) {
    const chargeGain = applyBasisPoints(
      SKILL_CHARGE_PER_HIT,
      toBasisPoints(10_000 + actor.stats.skillHasteBps),
    );
    actor.skillCharge += chargeGain;
    if (actor.skillCharge >= SKILL_CHARGE_THRESHOLD) {
      actor.skillCharge -= SKILL_CHARGE_THRESHOLD;
      const skillDamage = Math.max(
        1,
        actor.stats.skillPower +
          actor.stats.elementalPower -
          target.stats.elementalResistance,
      );
      target.hp -= skillDamage;
      log.push({
        actor: actorLabel,
        kind: "SKILL",
        damage: skillDamage,
        wasCrit: false,
        targetHpAfter: target.hp,
      });
    }
  }
}

/**
 * Runs one deterministic battle: same `(leadStats, enemyStats, seed,
 * config)` always produces the same `BattleResult` (Document 03 §9,
 * verified in `battle-simulation.test.ts`). Returns `err` for a genuinely
 * invalid starting state (non-positive HP, non-positive attack speed,
 * negative attack/defense) rather than simulating nonsense.
 */
export function simulateBattle(
  leadStats: CombatStats,
  enemyStats: CombatStats,
  rng: RandomSource,
  config: BattleSimulationConfig,
): Result<BattleResult, BattleSimulationError> {
  const leadError = validateStats("LEAD", leadStats);
  if (leadError) return err(leadError);
  const enemyError = validateStats("ENEMY", enemyStats);
  if (enemyError) return err(enemyError);

  const lead: ParticipantRuntime = {
    stats: leadStats,
    hp: leadStats.hp,
    skillCharge: 0,
    meter: 0,
  };
  const enemy: ParticipantRuntime = {
    stats: enemyStats,
    hp: enemyStats.hp,
    skillCharge: 0,
    meter: 0,
  };
  const log: BattleLogEntry[] = [];

  let round = 0;
  while (round < config.maxRounds) {
    round += 1;
    lead.meter += lead.stats.attackSpeed;
    enemy.meter += enemy.stats.attackSpeed;

    while (lead.meter >= READY_THRESHOLD || enemy.meter >= READY_THRESHOLD) {
      if (lead.meter >= READY_THRESHOLD) {
        lead.meter -= READY_THRESHOLD;
        resolveTurn(rng, "LEAD", lead, enemy, log);
        if (enemy.hp <= 0) {
          return ok(buildResult("WIN", lead, enemy, round, log));
        }
        if (lead.hp <= 0) {
          return ok(buildResult("LOSS", lead, enemy, round, log));
        }
      }
      if (enemy.meter >= READY_THRESHOLD) {
        enemy.meter -= READY_THRESHOLD;
        resolveTurn(rng, "ENEMY", enemy, lead, log);
        if (lead.hp <= 0) {
          return ok(buildResult("LOSS", lead, enemy, round, log));
        }
        if (enemy.hp <= 0) {
          return ok(buildResult("WIN", lead, enemy, round, log));
        }
      }
    }
  }

  return ok(buildResult("TIMEOUT", lead, enemy, config.maxRounds, log));
}

function buildResult(
  outcome: BattleResult["outcome"],
  lead: ParticipantRuntime,
  enemy: ParticipantRuntime,
  rounds: number,
  log: readonly BattleLogEntry[],
): BattleResult {
  const totalDamageDealt = log
    .filter((entry) => entry.actor === "LEAD")
    .reduce((sum, entry) => sum + entry.damage, 0);
  const totalDamageTaken = log
    .filter((entry) => entry.actor === "ENEMY")
    .reduce((sum, entry) => sum + entry.damage, 0);
  return {
    outcome,
    leadHpRemaining: Math.max(0, lead.hp),
    enemyHpRemaining: Math.max(0, enemy.hp),
    totalDamageDealt,
    totalDamageTaken,
    rounds,
    log,
  };
}
