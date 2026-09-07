// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { toDurationMs } from "./duration.ts";

describe("toDurationMs", () => {
  it("accepts zero and positive integer milliseconds", () => {
    expect(toDurationMs(0)).toBe(0);
    expect(toDurationMs(1500)).toBe(1500);
  });

  it("rejects negative durations", () => {
    expect(() => toDurationMs(-1)).toThrow(InvariantViolationError);
  });

  it("rejects non-integer millisecond values", () => {
    expect(() => toDurationMs(1.5)).toThrow(InvariantViolationError);
  });
});
