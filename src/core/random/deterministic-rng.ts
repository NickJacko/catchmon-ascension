/**
 * The one production deterministic `RandomSource` (Document 14 §128-129;
 * ADR 0001 — docs/architecture/adr/0001-deterministic-prng.md). A
 * 32-bit SplitMix-style generator: single 32-bit integer state, a fixed
 * odd increment added each call, then run through the shared `mix32`
 * avalanche step. No JS built-in "random" API of any kind, no crypto
 * API, no browser dependency — pure integer/bitwise arithmetic.
 *
 * The exact output sequence for a given seed is a compatibility contract
 * once real saves depend on it (see the ADR) — this is why
 * deterministic-rng.test.ts hardcodes fixed-vector expected sequences.
 */
import { BASIS_POINTS_PER_WHOLE } from "../math/basis-points.ts";
import { mix32 } from "./mix32.ts";
import {
  toProbabilityRollBps,
  type ProbabilityRollBps,
} from "./probability-roll.ts";
import { nextIntExclusive } from "./random-range.ts";
import { type RandomSource } from "./random-source.ts";
import { type Seed } from "./seed.ts";

/** A fixed odd 32-bit constant, following the SplitMix increment pattern (ADR 0001). */
const SPLITMIX32_INCREMENT = 0x9e3779b9;

/**
 * The size of `nextProbabilityRollBps`'s roll space — deliberately the
 * same `10000` as `BASIS_POINTS_PER_WHOLE` (basis-points.ts), reused
 * rather than redeclared, since a roll in `[0, 9999]` is what makes
 * `roll < chance` behave correctly for a `ProbabilityBps` chance in
 * `[0, 10000]` (see probability-roll.ts).
 */
const PROBABILITY_ROLL_SPACE = BASIS_POINTS_PER_WHOLE;

export class DeterministicRandomSource implements RandomSource {
  #state: number;

  constructor(seed: Seed) {
    this.#state = seed >>> 0;
  }

  nextUint32(): number {
    this.#state = (this.#state + SPLITMIX32_INCREMENT) >>> 0;
    return mix32(this.#state);
  }

  nextProbabilityRollBps(): ProbabilityRollBps {
    return toProbabilityRollBps(nextIntExclusive(this, PROBABILITY_ROLL_SPACE));
  }
}

export function createRandomSource(seed: Seed): RandomSource {
  return new DeterministicRandomSource(seed);
}
