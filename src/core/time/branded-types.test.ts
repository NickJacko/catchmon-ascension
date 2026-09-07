// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toDurationMs, type DurationMs } from "../math/duration.ts";
import { toTimestampMs, type TimestampMs } from "./timestamp.ts";

describe("branded time types (compile-time)", () => {
  it("proves TimestampMs and DurationMs are not interchangeable", () => {
    const timestamp = toTimestampMs(1_000);
    const duration = toDurationMs(1_000);

    // Positive controls: same-branded assignments must typecheck cleanly.
    const sameTimestamp: TimestampMs = timestamp;
    const sameDuration: DurationMs = duration;
    expect(sameTimestamp).toBe(timestamp);
    expect(sameDuration).toBe(duration);

    // @ts-expect-error — TimestampMs must not be assignable to DurationMs,
    // even though both are `number` at runtime (an absolute "when" is not
    // interchangeable with a relative "how long": duration === timestamp
    // must not typecheck as a meaningful comparison of like kinds).
    const timestampAsDuration: DurationMs = timestamp;
    // @ts-expect-error — DurationMs must not be assignable to TimestampMs.
    const durationAsTimestamp: TimestampMs = duration;
    // @ts-expect-error — a raw number literal must not satisfy TimestampMs
    // without going through toTimestampMs(...).
    const rawNumberAsTimestamp: TimestampMs = 1000;

    expect(timestampAsDuration).toBe(timestamp);
    expect(durationAsTimestamp).toBe(duration);
    expect(rawNumberAsTimestamp).toBe(1000);
  });
});
