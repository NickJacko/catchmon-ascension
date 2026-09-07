import { describe, expect, it } from "vitest";
import { toBasisPoints } from "../../core/math/basis-points.ts";
import { toProbabilityBps } from "../../core/math/probability.ts";
import { computeCaptureChance } from "./capture-chance.ts";

describe("computeCaptureChance", () => {
  it("returns the base chance with no modifiers", () => {
    const result = computeCaptureChance({
      base: toProbabilityBps(3500),
      captureProtectionFailures: 0,
      protectionBonusPerFailure: toBasisPoints(1000),
      leadDiscoveryBoostBonus: 0,
      floor: toProbabilityBps(1000),
      ceiling: toProbabilityBps(9500),
    });
    expect(result).toBe(3500);
  });

  it("adds the aid bonus when the aid is used", () => {
    const result = computeCaptureChance({
      base: toProbabilityBps(3500),
      aidBonus: toBasisPoints(2500),
      captureProtectionFailures: 0,
      protectionBonusPerFailure: toBasisPoints(1000),
      leadDiscoveryBoostBonus: 0,
      floor: toProbabilityBps(1000),
      ceiling: toProbabilityBps(9500),
    });
    expect(result).toBe(6000);
  });

  it("stacks the per-failure protection bonus additively", () => {
    const result = computeCaptureChance({
      base: toProbabilityBps(3500),
      captureProtectionFailures: 3,
      protectionBonusPerFailure: toBasisPoints(1000),
      leadDiscoveryBoostBonus: 0,
      floor: toProbabilityBps(1000),
      ceiling: toProbabilityBps(9500),
    });
    expect(result).toBe(6500);
  });

  it("converts the Lead's fraction-typed discovery-boost bonus into basis points", () => {
    const result = computeCaptureChance({
      base: toProbabilityBps(3500),
      captureProtectionFailures: 0,
      protectionBonusPerFailure: toBasisPoints(1000),
      leadDiscoveryBoostBonus: 0.1,
      floor: toProbabilityBps(1000),
      ceiling: toProbabilityBps(9500),
    });
    expect(result).toBe(4500);
  });

  it("clamps to the ceiling once stacked modifiers exceed it", () => {
    const result = computeCaptureChance({
      base: toProbabilityBps(3500),
      aidBonus: toBasisPoints(2500),
      captureProtectionFailures: 5,
      protectionBonusPerFailure: toBasisPoints(1000),
      leadDiscoveryBoostBonus: 0.1,
      floor: toProbabilityBps(1000),
      ceiling: toProbabilityBps(9500),
    });
    expect(result).toBe(9500);
  });

  it("clamps to the floor even at the base chance", () => {
    const result = computeCaptureChance({
      base: toProbabilityBps(0),
      captureProtectionFailures: 0,
      protectionBonusPerFailure: toBasisPoints(1000),
      leadDiscoveryBoostBonus: 0,
      floor: toProbabilityBps(1000),
      ceiling: toProbabilityBps(9500),
    });
    expect(result).toBe(1000);
  });
});
