/**
 * Absolute time representation (Document 14 §35): Unix epoch milliseconds
 * UTC. `TimestampMs` is deliberately a *different* branded type from
 * `DurationMs` (core/math/duration.ts) — an absolute "when" must never be
 * confused with a relative "how long", even though both are non-negative
 * safe integers at runtime (e.g. `duration === timestamp` must not
 * typecheck as a meaningful comparison).
 *
 * No `Date` object, no timezone, no locale formatting — the domain stores
 * milliseconds only.
 */
import { type Brand } from "../ids/brand.ts";
import { assertSafeNonNegativeInteger } from "../math/integer.ts";

export type TimestampMs = Brand<number, "TimestampMs">;

/**
 * The single trusted boundary for turning a plain number into a
 * `TimestampMs`. Validates a finite, non-negative safe integer. Zero
 * remains representable (the Unix epoch itself).
 */
export function toTimestampMs(value: number): TimestampMs {
  assertSafeNonNegativeInteger(value, "TimestampMs");
  return value as TimestampMs;
}

export const EPOCH_ZERO_MS: TimestampMs = toTimestampMs(0);
