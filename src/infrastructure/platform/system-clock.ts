/**
 * The one production `Clock` adapter permitted to touch the wall clock
 * (Document 14 §115): `Date.now()` is legitimate here — this module *is*
 * the wall-clock boundary Domain/Application must go through instead of
 * calling it directly. Converts immediately to an integer epoch
 * millisecond `TimestampMs`; no `Date` object is stored or exposed.
 *
 * Does not own browser lifecycle (visibility/focus) concerns — that is a
 * later task (Document 15 Task 02.6).
 */
import { type Clock } from "../../core/time/clock.ts";
import { toTimestampMs, type TimestampMs } from "../../core/time/timestamp.ts";

export function createSystemClock(): Clock {
  return {
    nowMs(): TimestampMs {
      return toTimestampMs(Date.now());
    },
  };
}

/** Ready-made singleton for the common case of a single production Clock. */
export const SystemClock: Clock = createSystemClock();
