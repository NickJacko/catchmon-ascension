// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { toDurationMs } from "../math/duration.ts";
import { addDurationToTimestamp, elapsedBetween } from "./time-math.ts";
import { toTimestampMs } from "./timestamp.ts";

describe("addDurationToTimestamp", () => {
  it("adding a zero duration is a no-op", () => {
    const timestamp = toTimestampMs(1_000_000);
    expect(addDurationToTimestamp(timestamp, toDurationMs(0))).toBe(1_000_000);
  });

  it("adds a positive duration to a timestamp", () => {
    const timestamp = toTimestampMs(1_000_000);
    expect(addDurationToTimestamp(timestamp, toDurationMs(500))).toBe(
      1_000_500,
    );
  });

  it("throws rather than overflow past MAX_SAFE_INTEGER", () => {
    const almostMax = toTimestampMs(Number.MAX_SAFE_INTEGER - 1);
    expect(() => addDurationToTimestamp(almostMax, toDurationMs(10))).toThrow(
      InvariantViolationError,
    );
  });
});

describe("elapsedBetween", () => {
  it("returns ok(...) with the correct duration when later >= earlier", () => {
    const earlier = toTimestampMs(1_000);
    const later = toTimestampMs(1_500);
    expect(elapsedBetween(earlier, later)).toEqual({ ok: true, value: 500 });
  });

  it("returns a zero duration for two equal timestamps", () => {
    const timestamp = toTimestampMs(1_000);
    expect(elapsedBetween(timestamp, timestamp)).toEqual({
      ok: true,
      value: 0,
    });
  });

  it("returns err('NEGATIVE_ELAPSED') instead of a negative DurationMs when later < earlier", () => {
    const earlier = toTimestampMs(1_500);
    const later = toTimestampMs(1_000);
    expect(elapsedBetween(earlier, later)).toEqual({
      ok: false,
      error: "NEGATIVE_ELAPSED",
    });
  });
});
