// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import {
  INITIAL_RANDOM_EVENT_COUNTER,
  nextRandomEventCounter,
  toRandomEventCounter,
} from "./event-counter.ts";

describe("toRandomEventCounter", () => {
  it("accepts zero", () => {
    expect(toRandomEventCounter(0)).toBe(0);
    expect(INITIAL_RANDOM_EVENT_COUNTER).toBe(0);
  });

  it("rejects a negative counter", () => {
    expect(() => toRandomEventCounter(-1)).toThrow(InvariantViolationError);
  });

  it("rejects a fractional counter", () => {
    expect(() => toRandomEventCounter(1.5)).toThrow(InvariantViolationError);
  });
});

describe("nextRandomEventCounter", () => {
  it("increments deterministically", () => {
    const first = nextRandomEventCounter(INITIAL_RANDOM_EVENT_COUNTER);
    expect(first).toBe(1);
    const second = nextRandomEventCounter(first);
    expect(second).toBe(2);
  });

  it("throws rather than overflow past MAX_SAFE_INTEGER", () => {
    const almostMax = toRandomEventCounter(Number.MAX_SAFE_INTEGER);
    expect(() => nextRandomEventCounter(almostMax)).toThrow(
      InvariantViolationError,
    );
  });
});
