/**
 * Safe-integer and Coin arithmetic (Document 14 §32, §36-37).
 *
 * Coins (and other player-facing integer amounts) are finite, non-negative,
 * safe-integer `number`s — no fractional storage, no `bigint`. Overflowing
 * `Number.MAX_SAFE_INTEGER` is treated as a programming/invariant failure
 * (this project deliberately does not target astronomical idle-game
 * values, Document 14 §32) — it throws, it is never silently clamped or
 * wrapped. Going negative via subtraction is a normal, expected outcome of
 * pure arithmetic (e.g. spending more than is available), so it is
 * reported through `Result` instead — Core has no opinion on what a
 * negative outcome *means* in gameplay terms (that is the economy
 * domain's job later); it only refuses to hand back an invalid amount.
 */
import { invariant } from "../assertions/invariant.ts";
import { err, ok, type Result } from "../result/result.ts";
import { type Brand } from "../ids/brand.ts";

export function isSafeNonNegativeInteger(value: number): boolean {
  return (
    Number.isFinite(value) &&
    Number.isInteger(value) &&
    value >= 0 &&
    Number.isSafeInteger(value)
  );
}

/**
 * Asserts `value` is a valid non-negative safe-integer amount. Failure is
 * always a programming error: correctly-written domain code never hands
 * Core math an already-invalid amount.
 */
export function assertSafeNonNegativeInteger(
  value: number,
  label = "value",
): void {
  invariant(
    Number.isFinite(value) && Number.isInteger(value),
    `${label} must be a finite integer, received ${String(value)}`,
  );
  invariant(
    value >= 0,
    `${label} must be non-negative, received ${String(value)}`,
  );
  invariant(
    Number.isSafeInteger(value),
    `${label} exceeds Number.MAX_SAFE_INTEGER, received ${String(value)}`,
  );
}

/**
 * The one canonical rounding rule for economic integer outputs (Document
 * 14 §36): perform the fixed-point calculation, then round once, here —
 * never floor/ceil ad hoc elsewhere. Standard round-half-up (`Math.round`);
 * every value this project rounds is non-negative, so there is no
 * round-half-to-even/away-from-zero ambiguity to resolve.
 */
export function roundToInteger(value: number): number {
  invariant(
    Number.isFinite(value),
    `roundToInteger received a non-finite value: ${String(value)}`,
  );
  const rounded = Math.round(value);
  invariant(
    Number.isSafeInteger(rounded),
    `roundToInteger(${String(value)}) would exceed Number.MAX_SAFE_INTEGER`,
  );
  return rounded;
}

/**
 * Multiplies then rounds once via the canonical rounding policy
 * (Document 14 §37 `multiplyAndRound`). `factor` is a plain fraction
 * (e.g. `0.15`), not itself a safe-integer amount — `applyBasisPoints`
 * (basis-points.ts) is the canonical way to derive that fraction from a
 * `BasisPoints` value rather than writing `amount * 0.15` ad hoc.
 */
export function multiplyAndRound(amount: number, factor: number): number {
  invariant(
    Number.isFinite(amount),
    `multiplyAndRound received a non-finite amount: ${String(amount)}`,
  );
  invariant(
    Number.isFinite(factor),
    `multiplyAndRound received a non-finite factor: ${String(factor)}`,
  );
  return roundToInteger(amount * factor);
}

/** A player-facing Coin quantity (Document 14 §32). */
export type Coins = Brand<number, "Coins">;

/**
 * The single trusted boundary for turning a plain number into `Coins`.
 * Validates the value is a finite, non-negative safe integer.
 */
export function toCoins(value: number): Coins {
  assertSafeNonNegativeInteger(value, "Coins");
  return value as Coins;
}

export const ZERO_COINS: Coins = toCoins(0);

/**
 * Adds two Coin amounts. Throws (invariant) if the sum would exceed
 * `Number.MAX_SAFE_INTEGER` — see module doc.
 */
export function safeAddCoins(a: Coins, b: Coins): Coins {
  const sum = a + b;
  invariant(
    Number.isSafeInteger(sum),
    `safeAddCoins(${String(a)}, ${String(b)}) would exceed Number.MAX_SAFE_INTEGER`,
  );
  return sum as Coins;
}

export type NegativeResultError = "NEGATIVE_RESULT";

/**
 * Subtracts `b` from `a`. Returns `err('NEGATIVE_RESULT')` instead of an
 * invalid negative Coin amount if `b > a` — see module doc for why this
 * is a `Result`, not a thrown invariant, and not an economy-domain error.
 */
export function safeSubtractCoins(
  a: Coins,
  b: Coins,
): Result<Coins, NegativeResultError> {
  const difference = a - b;
  if (difference < 0) {
    return err("NEGATIVE_RESULT");
  }
  return ok(difference as Coins);
}
