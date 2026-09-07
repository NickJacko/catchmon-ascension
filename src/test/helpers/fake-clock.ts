/**
 * A deterministic `Clock` test double (Document 14 §116; Document 15
 * Task 01.3) — no real waiting, no `Date.now()`. Lets tests/simulations
 * control time explicitly: start at a known timestamp, read it, set it,
 * or advance it by a `DurationMs`.
 *
 * Lives under src/test/, not src/core/ or src/infrastructure/, precisely
 * so production game code cannot accidentally depend on a test helper.
 */
import { addDurationToTimestamp } from "../../core/time/time-math.ts";
import { toTimestampMs, type TimestampMs } from "../../core/time/timestamp.ts";
import { type Clock } from "../../core/time/clock.ts";
import { type DurationMs } from "../../core/math/duration.ts";

export class FakeClock implements Clock {
  #current: TimestampMs;

  constructor(initialMs: number) {
    this.#current = toTimestampMs(initialMs);
  }

  nowMs(): TimestampMs {
    return this.#current;
  }

  /** Sets the clock to an explicit timestamp. */
  set(timestampMs: number): void {
    this.#current = toTimestampMs(timestampMs);
  }

  /** Advances the clock by a duration, using the canonical safe-add rule. */
  advance(duration: DurationMs): void {
    this.#current = addDurationToTimestamp(this.#current, duration);
  }
}
