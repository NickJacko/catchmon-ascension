/**
 * The canonical time port (Document 14 §115). Domain/Application code
 * depends on this interface, never on `Date.now()` directly — see
 * src/infrastructure/platform/system-clock.ts for the one production
 * adapter allowed to touch the wall clock, and
 * src/test/helpers/fake-clock.ts for the deterministic test double.
 *
 * Deliberately minimal: no setTimeout/setInterval/sleep/scheduler,
 * timezone, or date-formatting APIs. Those are not the game Clock's job.
 */
import { type TimestampMs } from "./timestamp.ts";

export interface Clock {
  nowMs(): TimestampMs;
}
