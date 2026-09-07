/**
 * General-purpose basis points (Document 14 §33, §37).
 *
 * `0 = 0%`, `100 = 1%`, `10000 = 100%` — 0.01% precision, avoiding
 * repeated floating-point percentage accumulation.
 *
 * `BasisPoints` is deliberately a *different* branded type from
 * `ProbabilityBps` (probability.ts): a general modifier/multiplier may
 * legitimately exceed 10000 (e.g. `15000` for a +50% multiplier), while a
 * probability must never exceed `10000`. Keeping them separate makes it a
 * compile error to accidentally use a multiplier where a probability is
 * expected, or vice versa.
 */
import { invariant } from "../assertions/invariant.ts";
import { type Brand } from "../ids/brand.ts";
import { assertSafeNonNegativeInteger, multiplyAndRound } from "./integer.ts";

/** `10000` basis points represents `100%`. */
export const BASIS_POINTS_PER_WHOLE = 10000;

export type BasisPoints = Brand<number, "BasisPoints">;

/**
 * The single trusted boundary for turning a plain number into
 * `BasisPoints`. Only guards against a non-negative safe-integer value —
 * general basis points are intentionally unbounded above (see module
 * doc), so no upper limit is enforced here.
 */
export function toBasisPoints(value: number): BasisPoints {
  assertSafeNonNegativeInteger(value, "BasisPoints");
  return value as BasisPoints;
}

/**
 * Applies a basis-point modifier to an integer amount, rounding once via
 * the canonical policy (Document 14 §37 `applyBasisPoints`). Equivalent
 * to `amount * (basisPoints / 10000)`, but expressed without an ad hoc
 * floating-point percentage literal anywhere in the calling code.
 */
export function applyBasisPoints(
  amount: number,
  basisPoints: BasisPoints,
): number {
  assertSafeNonNegativeInteger(amount, "amount");
  invariant(
    Number.isSafeInteger(basisPoints),
    `applyBasisPoints received an unsafe basisPoints value: ${String(basisPoints)}`,
  );
  return multiplyAndRound(amount, basisPoints / BASIS_POINTS_PER_WHOLE);
}
