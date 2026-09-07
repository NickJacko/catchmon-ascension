/**
 * The canonical randomness port (Document 14 §128). Domain/Application
 * code depends on this interface, never on `Math.random()` directly —
 * see deterministic-rng.ts for the one deterministic, seeded
 * implementation.
 *
 * Deliberately minimal: two methods only, no convenience-method sprawl.
 */
import { type ProbabilityRollBps } from "./probability-roll.ts";

export interface RandomSource {
  /** An integer in `[0, 4294967295]` (`2^32 - 1`). Advances internal state. */
  nextUint32(): number;

  /**
   * A `ProbabilityRollBps` value uniformly distributed over the "roll
   * space" `[0, 9999]` — deliberately never `10000` (see
   * probability-roll.ts for why: it must support `roll < chance` giving
   * correct 0%-never / 100%-always boundary behavior with no off-by-one
   * gap). Not itself a `ProbabilityBps` chance value — see
   * probability-roll.ts for the distinction.
   */
  nextProbabilityRollBps(): ProbabilityRollBps;
}
