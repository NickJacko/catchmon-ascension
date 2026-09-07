import { describe, expect, it } from "vitest";
import { toBasisPoints, toProbabilityBps } from "../../core/math/index.ts";
import { type CombatStats } from "../combat/types.ts";
import {
  computeBuildFit,
  computePowerScore,
  type PowerWeights,
} from "./build-fit.ts";

function stats(overrides: Partial<CombatStats> = {}): CombatStats {
  return {
    hp: 100,
    attack: 10,
    defense: 10,
    attackSpeed: 100,
    critChanceBps: toProbabilityBps(0),
    critDamageBps: toBasisPoints(15_000),
    comboChanceBps: toProbabilityBps(0),
    counterChanceBps: toProbabilityBps(0),
    guardBps: toBasisPoints(0),
    evasionBps: toProbabilityBps(0),
    accuracyBps: toProbabilityBps(10_000),
    skillPower: 0,
    skillHasteBps: toBasisPoints(0),
    elementalPower: 0,
    elementalResistance: 0,
    ...overrides,
  };
}

const WEIGHTS: PowerWeights = {
  hp: 0.05,
  attack: 1,
  defense: 1,
  attackSpeed: 0.2,
  critChanceBps: 0.01,
  critDamageBps: 0.01,
  comboChanceBps: 0.01,
  counterChanceBps: 0.01,
  guardBps: 0.01,
  evasionBps: 0.005,
  accuracyBps: 0.005,
  skillPower: 1,
  skillHasteBps: 0.01,
  elementalPower: 1,
  elementalResistance: 0.5,
};

describe("computeBuildFit", () => {
  it("a higher-Power loadout invested off-Path scores LOWER Build Fit than a lower-Power loadout concentrated on-Path", () => {
    // Huge HP/Defense investment — high Power, but off-Path for Breaker
    // (whose primary stats are attackSpeed/crit/critDamage/combo).
    const offPathHighPower = stats({ hp: 5_000, defense: 400 });
    // Modest attackSpeed/crit investment — lower Power, fully on-Path.
    const onPathLowerPower = stats({
      attackSpeed: 300,
      critChanceBps: toProbabilityBps(5_000),
      comboChanceBps: toProbabilityBps(4_000),
    });

    const offPathPower = computePowerScore(offPathHighPower, WEIGHTS);
    const onPathPower = computePowerScore(onPathLowerPower, WEIGHTS);
    expect(offPathPower).toBeGreaterThan(onPathPower);

    const offPathFit = computeBuildFit(offPathHighPower, "BREAKER", WEIGHTS);
    const onPathFit = computeBuildFit(onPathLowerPower, "BREAKER", WEIGHTS);

    // The explicit exit test: higher Power did NOT buy higher Build Fit.
    expect(offPathFit.scoreBps).toBeLessThan(onPathFit.scoreBps);
  });

  it("scores differently for the same stats under different Paths", () => {
    const skillFocused = stats({
      skillPower: 40,
      skillHasteBps: toBasisPoints(3_000),
    });

    const weaverFit = computeBuildFit(skillFocused, "WEAVER", WEIGHTS);
    const wardenFit = computeBuildFit(skillFocused, "WARDEN", WEIGHTS);

    expect(weaverFit.scoreBps).toBeGreaterThan(wardenFit.scoreBps);
  });
});
