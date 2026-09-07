// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { toSeed, UINT32_MAX } from "./seed.ts";

describe("toSeed", () => {
  it("accepts the minimum boundary (0)", () => {
    expect(toSeed(0)).toBe(0);
  });

  it("accepts a positive seed", () => {
    expect(toSeed(42)).toBe(42);
  });

  it("accepts the maximum uint32 boundary", () => {
    expect(toSeed(UINT32_MAX)).toBe(UINT32_MAX);
  });

  it("rejects a fractional seed", () => {
    expect(() => toSeed(1.5)).toThrow(InvariantViolationError);
  });

  it("rejects NaN", () => {
    expect(() => toSeed(Number.NaN)).toThrow(InvariantViolationError);
  });

  it("rejects Infinity", () => {
    expect(() => toSeed(Number.POSITIVE_INFINITY)).toThrow(
      InvariantViolationError,
    );
  });

  it("rejects a negative seed", () => {
    expect(() => toSeed(-1)).toThrow(InvariantViolationError);
  });

  it("rejects a value above the uint32 range", () => {
    expect(() => toSeed(UINT32_MAX + 1)).toThrow(InvariantViolationError);
  });
});
