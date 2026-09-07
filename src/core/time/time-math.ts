/**
 * Safe arithmetic between `TimestampMs` and `DurationMs` (Document 15
 * Task 01.3). `addDurationToTimestamp` previously lived in
 * core/math/duration.ts as a plain-`number` operation, written before
 * `TimestampMs` existed (Task 01.2) — it now lives here, branded, as the
 * one canonical version. It was moved, not duplicated.
 */
import { invariant } from "../assertions/invariant.ts";
import { err, ok, type Result } from "../result/result.ts";
import { type DurationMs } from "../math/duration.ts";
import { type TimestampMs } from "./timestamp.ts";

/**
 * `TimestampMs + DurationMs -> TimestampMs`, guarded against overflowing
 * `Number.MAX_SAFE_INTEGER`. Overflow is a programming error here (this
 * project does not target astronomical values, Document 14 §32) — it
 * throws, consistent with every other Core overflow guard.
 */
export function addDurationToTimestamp(
  timestamp: TimestampMs,
  duration: DurationMs,
): TimestampMs {
  const result = timestamp + duration;
  invariant(
    Number.isSafeInteger(result),
    `addDurationToTimestamp(${String(timestamp)}, ${String(duration)}) would exceed Number.MAX_SAFE_INTEGER`,
  );
  return result as TimestampMs;
}

export type NegativeElapsedError = "NEGATIVE_ELAPSED";

/**
 * The duration between two timestamps: `later - earlier`. If `later` is
 * before `earlier` (e.g. a wall clock that moved backwards), this returns
 * `err('NEGATIVE_ELAPSED')` rather than silently fabricating an invalid
 * negative `DurationMs` or throwing — Document 14 notes that
 * reconciliation must later handle a clock moving backwards safely, which
 * means the caller is expected to check for and react to this case as a
 * normal code path, not an exceptional one. Reconciliation itself is not
 * part of this task; this primitive only refuses to hand back an invalid
 * duration.
 */
export function elapsedBetween(
  earlier: TimestampMs,
  later: TimestampMs,
): Result<DurationMs, NegativeElapsedError> {
  if (later < earlier) {
    return err("NEGATIVE_ELAPSED");
  }
  return ok((later - earlier) as DurationMs);
}
