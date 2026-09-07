/**
 * Deterministic PRNG seed/state representation (Document 14 §128-130;
 * ADR 0001). A `Seed` is a single unsigned 32-bit integer — serializable,
 * deterministic, and independent of JS object identity, so it is safe to
 * persist later (save persistence itself is not part of this task).
 */
import { type Brand } from "../ids/brand.ts";
import { invariant } from "../assertions/invariant.ts";

/** The number of distinct values a 32-bit unsigned integer can hold. */
export const UINT32_RANGE = 4294967296; // 2 ** 32
export const UINT32_MAX = UINT32_RANGE - 1; // 4294967295

export type Seed = Brand<number, "Seed">;

/**
 * The single trusted boundary for turning a plain number into a `Seed`.
 * Validates a finite integer within `[0, 4294967295]` — the full range a
 * 32-bit PRNG state can hold. Rejects out-of-range values explicitly
 * rather than silently wrapping them.
 */
export function toSeed(value: number): Seed {
  invariant(
    Number.isFinite(value) && Number.isInteger(value),
    `Seed must be a finite integer, received ${String(value)}`,
  );
  invariant(
    value >= 0 && value <= UINT32_MAX,
    `Seed must be within [0, ${String(UINT32_MAX)}], received ${String(value)}`,
  );
  return value as Seed;
}
