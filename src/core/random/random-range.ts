/**
 * A generic, unbiased "integer in [0, maxExclusive)" draw from any
 * `RandomSource`. Added because `nextProbabilityRollBps`
 * (probability-roll.ts) needs exactly this operation, and future
 * deterministic weighted selection will too — not a general
 * shuffle/weighted-loot-table library.
 */
import { invariant } from "../assertions/invariant.ts";
import { type RandomSource } from "./random-source.ts";
import { UINT32_RANGE } from "./seed.ts";

/**
 * Draws an unbiased integer in `[0, maxExclusive)` using rejection
 * sampling: `nextUint32()` draws that fall in the "leftover" region past
 * the largest exact multiple of `maxExclusive` are discarded and redrawn,
 * so every one of the `maxExclusive` buckets gets exactly equal
 * probability (plain `% maxExclusive` would slightly favor low buckets
 * whenever `maxExclusive` does not evenly divide `2^32`).
 */
export function nextIntExclusive(
  rng: RandomSource,
  maxExclusive: number,
): number {
  invariant(
    Number.isSafeInteger(maxExclusive) && maxExclusive > 0,
    `nextIntExclusive requires a positive safe integer maxExclusive, received ${String(maxExclusive)}`,
  );
  invariant(
    maxExclusive <= UINT32_RANGE,
    `nextIntExclusive maxExclusive (${String(maxExclusive)}) exceeds the 32-bit draw range (${String(UINT32_RANGE)})`,
  );

  const limit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);
  let candidate: number;
  do {
    candidate = rng.nextUint32();
  } while (candidate >= limit);
  return candidate % maxExclusive;
}
