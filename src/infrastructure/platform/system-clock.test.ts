// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createSystemClock, SystemClock } from "./system-clock.ts";

describe("SystemClock", () => {
  it("returns a finite, safe, non-negative integer timestamp", () => {
    const value = SystemClock.nowMs();
    expect(Number.isFinite(value)).toBe(true);
    expect(Number.isInteger(value)).toBe(true);
    expect(Number.isSafeInteger(value)).toBe(true);
    expect(value).toBeGreaterThanOrEqual(0);
  });

  it("tracks the real wall clock without an exact-time assertion", () => {
    // Bracket the adapter's reading between two Date.now() samples rather
    // than asserting an exact value, which would be inherently flaky.
    const before = Date.now();
    const value = createSystemClock().nowMs();
    const after = Date.now();

    expect(value).toBeGreaterThanOrEqual(before);
    expect(value).toBeLessThanOrEqual(after);
  });
});
