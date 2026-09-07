/**
 * A single random-roll draw in basis-point roll-space (Document 15
 * Task 01.4 semantic correction). Deliberately a *different* branded type
 * from `ProbabilityBps` (core/math/probability.ts):
 *
 * - `ProbabilityBps` represents an actual chance/probability, inclusive
 *   range `[0, 10000]` (0%-100%).
 * - `ProbabilityRollBps` represents one drawn threshold roll, range
 *   `[0, 9999]` — never `10000`.
 *
 * A roll is not itself a probability, so the two must not be
 * interchangeable at compile time. The intended future comparison
 * (`rollSucceeds`-style gameplay helper is not implemented yet):
 *
 *   success when roll < chance
 *
 * 0% chance: `roll < 0` is never true (never succeeds).
 * 100% chance: `roll < 10000` is always true, since `roll` never reaches
 * `10000` (always succeeds, with no off-by-one gap).
 */
import { invariant } from "../assertions/invariant.ts";
import { type Brand } from "../ids/brand.ts";
import { BASIS_POINTS_PER_WHOLE } from "../math/basis-points.ts";
import { type ProbabilityBps } from "../math/probability.ts";
import { type RandomSource } from "./random-source.ts";

export const MIN_PROBABILITY_ROLL_BPS = 0;
export const MAX_PROBABILITY_ROLL_BPS = BASIS_POINTS_PER_WHOLE - 1; // 9999

export type ProbabilityRollBps = Brand<number, "ProbabilityRollBps">;

/**
 * The single trusted boundary for turning a plain number into a
 * `ProbabilityRollBps`. Throws (invariant) if the value is outside
 * `[0, 9999]` — a roll of exactly `10000` would create the off-by-one
 * gap this type exists to prevent.
 */
export function toProbabilityRollBps(value: number): ProbabilityRollBps {
  invariant(
    Number.isFinite(value) && Number.isInteger(value),
    `ProbabilityRollBps must be a finite integer, received ${String(value)}`,
  );
  invariant(
    value >= MIN_PROBABILITY_ROLL_BPS && value <= MAX_PROBABILITY_ROLL_BPS,
    `ProbabilityRollBps must be within [${String(MIN_PROBABILITY_ROLL_BPS)}, ${String(MAX_PROBABILITY_ROLL_BPS)}], received ${String(value)}`,
  );
  return value as ProbabilityRollBps;
}

/**
 * The `rollSucceeds`-style gameplay helper this module's own doc comment
 * anticipated ("not implemented yet") — added by Document 15 Task 06.6
 * (Routine + Special Rewards), the first caller that actually needs to
 * roll against a `ProbabilityBps` chance. Reuses `RandomSource`'s own
 * `nextProbabilityRollBps()` (already the correct roll-space draw) rather
 * than re-deriving one. `success when roll < chance`, exactly as
 * documented above: a `0` chance never succeeds, a `10000` (100%) chance
 * always succeeds.
 */
export function rollSucceeds(
  rng: RandomSource,
  chance: ProbabilityBps,
): boolean {
  return rng.nextProbabilityRollBps() < chance;
}
