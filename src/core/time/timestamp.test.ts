// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { EPOCH_ZERO_MS, toTimestampMs } from "./timestamp.ts";

describe("toTimestampMs", () => {
  it("accepts zero (the Unix epoch itself remains representable)", () => {
    expect(toTimestampMs(0)).toBe(0);
    expect(EPOCH_ZERO_MS).toBe(0);
  });

  it("accepts a positive integer timestamp", () => {
    expect(toTimestampMs(1_700_000_000_000)).toBe(1_700_000_000_000);
  });

  it("rejects a fractional timestamp", () => {
    expect(() => toTimestampMs(1.5)).toThrow(InvariantViolationError);
  });

  it("rejects NaN", () => {
    expect(() => toTimestampMs(Number.NaN)).toThrow(InvariantViolationError);
  });

  it("rejects Infinity", () => {
    expect(() => toTimestampMs(Number.POSITIVE_INFINITY)).toThrow(
      InvariantViolationError,
    );
  });

  it("rejects an unsafe integer", () => {
    expect(() => toTimestampMs(Number.MAX_SAFE_INTEGER + 1)).toThrow(
      InvariantViolationError,
    );
  });

  it("rejects a negative timestamp", () => {
    expect(() => toTimestampMs(-1)).toThrow(InvariantViolationError);
  });
});
