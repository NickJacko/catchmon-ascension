// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import {
  MAX_PROBABILITY_BPS,
  MIN_PROBABILITY_BPS,
  clampProbability,
  toPercentageNumber,
  toProbabilityBps,
} from "./probability.ts";

describe("toProbabilityBps (strict boundary)", () => {
  it("accepts the 0% boundary", () => {
    expect(toProbabilityBps(0)).toBe(0);
  });

  it("accepts the 100% boundary", () => {
    expect(toProbabilityBps(10000)).toBe(10000);
  });

  it("rejects a value below 0%", () => {
    expect(() => toProbabilityBps(-1)).toThrow(InvariantViolationError);
  });

  it("rejects a value above 100% — unlike general BasisPoints", () => {
    expect(() => toProbabilityBps(10001)).toThrow(InvariantViolationError);
  });
});

describe("clampProbability (forgiving normalization)", () => {
  it("clamps a negative value to the 0% boundary", () => {
    expect(clampProbability(-500)).toBe(MIN_PROBABILITY_BPS);
  });

  it("clamps a value above 100% to the 100% boundary", () => {
    expect(clampProbability(12000)).toBe(MAX_PROBABILITY_BPS);
  });

  it("rounds a fractional value to the nearest whole basis point", () => {
    expect(clampProbability(4999.6)).toBe(5000);
  });

  it("never throws for an out-of-range input", () => {
    expect(() => clampProbability(-999999)).not.toThrow();
    expect(() => clampProbability(999999)).not.toThrow();
  });
});

describe("toPercentageNumber", () => {
  it("converts 0 bps to 0", () => {
    expect(toPercentageNumber(toProbabilityBps(0))).toBe(0);
  });

  it("converts 10000 bps to 100", () => {
    expect(toPercentageNumber(toProbabilityBps(10000))).toBe(100);
  });

  it("converts 7350 bps to 73.5, without formatting a string", () => {
    const value = toPercentageNumber(toProbabilityBps(7350));
    expect(value).toBe(73.5);
    expect(typeof value).toBe("number");
  });
});
