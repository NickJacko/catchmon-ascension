import { describe, expect, it } from "vitest";
import { toBasisPoints, toProbabilityBps } from "../../core/math/index.ts";
import { createRandomSource, toSeed } from "../../core/random/index.ts";
import { simulateBattle } from "./battle-simulation.ts";
import { type CombatStats } from "./types.ts";

function stats(overrides: Partial<CombatStats> = {}): CombatStats {
  return {
    hp: 100,
    attack: 20,
    defense: 5,
    attackSpeed: 100,
    critChanceBps: toProbabilityBps(0),
    critDamageBps: toBasisPoints(15_000),
    comboChanceBps: toProbabilityBps(0),
    counterChanceBps: toProbabilityBps(0),
    guardBps: toBasisPoints(0),
    evasionBps: toProbabilityBps(0),
    accuracyBps: toProbabilityBps(10_000),
    skillPower: 5,
    skillHasteBps: toBasisPoints(0),
    elementalPower: 0,
    elementalResistance: 0,
    ...overrides,
  };
}

const CONFIG = { maxRounds: 100 };

describe("simulateBattle", () => {
  it("is deterministic: the same lead/enemy/seed/config always produces the same result", () => {
    const lead = stats({ attack: 25 });
    const enemy = stats({ hp: 150, attack: 12 });
    const seed = toSeed(12345);

    const first = simulateBattle(lead, enemy, createRandomSource(seed), CONFIG);
    const second = simulateBattle(
      lead,
      enemy,
      createRandomSource(seed),
      CONFIG,
    );

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(first).toEqual(second);
  });

  it("a normal encounter resolves to WIN when the Lead heavily outmatches the enemy", () => {
    const lead = stats({ attack: 200, hp: 500 });
    const enemy = stats({ attack: 5, hp: 40, defense: 0 });

    const result = simulateBattle(
      lead,
      enemy,
      createRandomSource(toSeed(1)),
      CONFIG,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.outcome).toBe("WIN");
      expect(result.value.enemyHpRemaining).toBe(0);
    }
  });

  it("a boss battle resolves to LOSS when the Lead is heavily outmatched", () => {
    const lead = stats({ attack: 5, hp: 40, defense: 0 });
    const boss = stats({ attack: 200, hp: 500 });

    const result = simulateBattle(
      lead,
      boss,
      createRandomSource(toSeed(2)),
      CONFIG,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.outcome).toBe("LOSS");
      expect(result.value.leadHpRemaining).toBe(0);
    }
  });

  it("changing stats changes the outcome (higher attack turns a LOSS into a WIN)", () => {
    const enemy = stats({ hp: 300, attack: 30, defense: 10 });
    const weakLead = stats({ attack: 15, hp: 80 });
    const strongLead = stats({ attack: 90, hp: 80 });
    const seed = toSeed(999);

    const weakResult = simulateBattle(
      weakLead,
      enemy,
      createRandomSource(seed),
      CONFIG,
    );
    const strongResult = simulateBattle(
      strongLead,
      enemy,
      createRandomSource(seed),
      CONFIG,
    );

    expect(weakResult.ok && weakResult.value.outcome).toBe("LOSS");
    expect(strongResult.ok && strongResult.value.outcome).toBe("WIN");
  });

  it("a drawn-out grind that can't finish within the round cap fails clearly as TIMEOUT, not an infinite loop", () => {
    // Damage is floored at 1 per landed hit by design (never truly zero,
    // so a real "nobody can ever win" state is impossible) — but with high
    // HP relative to maxRounds, neither side can finish the other off in
    // time, which must still fail clearly rather than loop forever.
    const lead = stats({ attack: 5, defense: 100, hp: 1_000 });
    const enemy = stats({ attack: 5, defense: 100, hp: 1_000 });

    const result = simulateBattle(lead, enemy, createRandomSource(toSeed(3)), {
      maxRounds: 50,
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.outcome).toBe("TIMEOUT");
      expect(result.value.rounds).toBe(50);
    }
  });

  it("rejects an invalid starting state (non-positive HP) with a clear error instead of simulating nonsense", () => {
    const lead = stats({ hp: 0 });
    const enemy = stats();

    const result = simulateBattle(
      lead,
      enemy,
      createRandomSource(toSeed(4)),
      CONFIG,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("LEAD_HP_NOT_POSITIVE");
    }
  });

  it("rejects a non-positive attack speed with a clear error", () => {
    const lead = stats();
    const enemy = stats({ attackSpeed: 0 });

    const result = simulateBattle(
      lead,
      enemy,
      createRandomSource(toSeed(5)),
      CONFIG,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NEGATIVE_STAT");
    }
  });
});
