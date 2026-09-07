// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../../core/assertions/invariant.ts";
import { toDurationMs } from "../../core/math/duration.ts";
import { FakeClock } from "./fake-clock.ts";

describe("FakeClock", () => {
  it("starts exactly at the configured timestamp", () => {
    const clock = new FakeClock(1_000);
    expect(clock.nowMs()).toBe(1_000);
  });

  it("nowMs() is stable when the clock is not advanced", () => {
    const clock = new FakeClock(1_000);
    expect(clock.nowMs()).toBe(1_000);
    expect(clock.nowMs()).toBe(1_000);
  });

  it("advance(...) produces the exact expected timestamp", () => {
    const clock = new FakeClock(1_000);
    clock.advance(toDurationMs(500));
    expect(clock.nowMs()).toBe(1_500);
  });

  it("multiple advances accumulate deterministically", () => {
    const clock = new FakeClock(0);
    clock.advance(toDurationMs(100));
    clock.advance(toDurationMs(250));
    clock.advance(toDurationMs(1));
    expect(clock.nowMs()).toBe(351);
  });

  it("set(...) moves the clock to an explicit timestamp", () => {
    const clock = new FakeClock(1_000);
    clock.set(50_000);
    expect(clock.nowMs()).toBe(50_000);
  });

  it("advance(...) throws rather than overflow past MAX_SAFE_INTEGER", () => {
    const clock = new FakeClock(Number.MAX_SAFE_INTEGER - 1);
    expect(() => clock.advance(toDurationMs(10))).toThrow(
      InvariantViolationError,
    );
  });

  it("rejects an invalid (negative) timestamp at construction", () => {
    expect(() => new FakeClock(-1)).toThrow(InvariantViolationError);
  });

  it("rejects an invalid (negative) timestamp via set(...)", () => {
    const clock = new FakeClock(0);
    expect(() => clock.set(-1)).toThrow(InvariantViolationError);
  });

  it("rejects a raw non-integer timestamp at construction", () => {
    expect(() => new FakeClock(1.5)).toThrow(InvariantViolationError);
  });
});
