/**
 * Duration representation/validation (Document 14 §35; Document 15
 * Task 01.2). Durations are integer milliseconds — never `Date` objects,
 * never locale-formatted strings.
 *
 * Timestamp semantics (`TimestampMs`) and Timestamp+Duration arithmetic
 * belong to core/time/ (Task 01.3) — see time-math.ts's
 * `addDurationToTimestamp`, which superseded an earlier plain-`number`
 * version that used to live in this file before `TimestampMs` existed.
 */
import { type Brand } from "../ids/brand.ts";
import { assertSafeNonNegativeInteger } from "./integer.ts";

/** A duration in integer milliseconds (Document 14 §35). */
export type DurationMs = Brand<number, "DurationMs">;

/**
 * The single trusted boundary for turning a plain number into
 * `DurationMs`. Validates a finite, non-negative safe integer.
 */
export function toDurationMs(value: number): DurationMs {
  assertSafeNonNegativeInteger(value, "DurationMs");
  return value as DurationMs;
}

export const ZERO_DURATION_MS: DurationMs = toDurationMs(0);
