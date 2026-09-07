/**
 * The technical primitive behind Document 14 §130's future random-event
 * model ("root seed + monotonic random event counter + event context ->
 * deterministic sub-seed"). This module owns only the counter *value*
 * type and its increment rule — GameState ownership, persistence, and
 * actual gameplay event types are explicitly out of scope for this task.
 */
import { type Brand } from "../ids/brand.ts";
import { assertSafeNonNegativeInteger } from "../math/integer.ts";
import { invariant } from "../assertions/invariant.ts";

export type RandomEventCounter = Brand<number, "RandomEventCounter">;

/**
 * The single trusted boundary for turning a plain number into a
 * `RandomEventCounter`. Validates a finite, non-negative safe integer.
 */
export function toRandomEventCounter(value: number): RandomEventCounter {
  assertSafeNonNegativeInteger(value, "RandomEventCounter");
  return value as RandomEventCounter;
}

export const INITIAL_RANDOM_EVENT_COUNTER: RandomEventCounter =
  toRandomEventCounter(0);

/**
 * Deterministically advances the counter by one. Throws (invariant)
 * rather than silently overflowing past `Number.MAX_SAFE_INTEGER`.
 */
export function nextRandomEventCounter(
  counter: RandomEventCounter,
): RandomEventCounter {
  const next = counter + 1;
  invariant(
    Number.isSafeInteger(next),
    `nextRandomEventCounter(${String(counter)}) would exceed Number.MAX_SAFE_INTEGER`,
  );
  return next as RandomEventCounter;
}
