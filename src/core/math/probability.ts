/**
 * Bounded probability representation in basis points (Document 14 §34).
 *
 * `ProbabilityBps` is deliberately a *different* branded type from the
 * general-purpose `BasisPoints` (basis-points.ts): a probability must
 * always stay within `[0, 10000]` (0% - 100%), while a general modifier
 * may legitimately exceed `10000`. Keeping them separate makes it a
 * compile error to pass a >100% multiplier where a probability is
 * expected.
 *
 * Rolling against a probability is TASK 01.4 (RNG), not this module.
 * Converting to a display string ("73.5%") is presentation's job, not
 * Core's — `toPercentageNumber` below returns a plain number only.
 */
import { invariant } from "../assertions/invariant.ts";
import { type Brand } from "../ids/brand.ts";
import { roundToInteger } from "./integer.ts";
import { BASIS_POINTS_PER_WHOLE } from "./basis-points.ts";

export const MIN_PROBABILITY_BPS = 0;
export const MAX_PROBABILITY_BPS = BASIS_POINTS_PER_WHOLE;

export type ProbabilityBps = Brand<number, "ProbabilityBps">;

/**
 * The strict trusted boundary for turning a plain number into
 * `ProbabilityBps`. Throws (invariant) if the value is outside
 * `[0, 10000]` — use this at content/authoring boundaries where an
 * out-of-range value is a data-authoring bug. For a computed probability
 * that may have legitimately drifted outside the range (e.g. after
 * stacking modifiers), use `clampProbability` instead.
 */
export function toProbabilityBps(value: number): ProbabilityBps {
  invariant(
    Number.isFinite(value) && Number.isInteger(value),
    `ProbabilityBps must be a finite integer, received ${String(value)}`,
  );
  invariant(
    value >= MIN_PROBABILITY_BPS && value <= MAX_PROBABILITY_BPS,
    `ProbabilityBps must be within [${String(MIN_PROBABILITY_BPS)}, ${String(MAX_PROBABILITY_BPS)}], received ${String(value)}`,
  );
  return value as ProbabilityBps;
}

/**
 * Normalizes an arbitrary number into a valid `ProbabilityBps` by
 * rounding to the nearest whole basis point and clamping into
 * `[0, 10000]`. Unlike `toProbabilityBps`, this never throws — a computed
 * probability drifting outside the valid range (e.g. from stacked
 * modifiers) is an expected, normal occurrence, not a bug.
 */
export function clampProbability(value: number): ProbabilityBps {
  invariant(
    Number.isFinite(value),
    `clampProbability received a non-finite value: ${String(value)}`,
  );
  const rounded = roundToInteger(
    Math.min(Math.max(value, MIN_PROBABILITY_BPS), MAX_PROBABILITY_BPS),
  );
  return rounded as ProbabilityBps;
}

/**
 * Pure numeric conversion to a presentation-friendly percentage (e.g.
 * `7350` bps -> `73.5`). Does not format a string — that is presentation's
 * job, not Core's.
 */
export function toPercentageNumber(probability: ProbabilityBps): number {
  return (probability / BASIS_POINTS_PER_WHOLE) * 100;
}
