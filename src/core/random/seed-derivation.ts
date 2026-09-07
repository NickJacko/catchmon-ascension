/**
 * Deterministic sub-seed derivation (Document 14 §130-132): the reusable
 * technical primitive behind the future
 * `rootSeed + eventCounter + eventContext -> sub-seed` model. Does not
 * create GameState, persist the counter, or define any gameplay event
 * type — that is for later domain/application tasks to build on top of
 * this.
 *
 * The event-context string is folded in via FNV-1a (32-bit), a standard,
 * well-documented, non-cryptographic string hash (verified in tests
 * against its own published reference vectors) — chosen so context
 * mixing is an explicit, stable algorithm rather than anything
 * JS-runtime-dependent (object hashing, iteration order, etc.).
 */
import { mix32 } from "./mix32.ts";
import { type RandomEventCounter } from "./event-counter.ts";
import { toSeed, type Seed } from "./seed.ts";

const FNV_OFFSET_BASIS_32 = 0x811c9dc5;
const FNV_PRIME_32 = 0x01000193;

/** FNV-1a, 32-bit. Exported so its correctness can be verified directly
 * against FNV's own published test vectors, independent of seed derivation. */
export function hashEventContext(context: string): number {
  let hash = FNV_OFFSET_BASIS_32;
  for (let i = 0; i < context.length; i += 1) {
    hash ^= context.charCodeAt(i);
    hash = Math.imul(hash, FNV_PRIME_32);
  }
  return hash >>> 0;
}

/**
 * Derives a deterministic sub-seed from a root seed, a monotonic event
 * counter, and a stable event-context identifier. Same inputs always
 * produce the same sub-seed; changing any one of the three inputs
 * changes the result (see seed-derivation.test.ts).
 */
export function deriveSubSeed(
  rootSeed: Seed,
  counter: RandomEventCounter,
  eventContext: string,
): Seed {
  const contextHash = hashEventContext(eventContext);
  const rootAndCounter = mix32((rootSeed >>> 0) ^ (counter >>> 0));
  const mixed = mix32(rootAndCounter ^ contextHash);
  return toSeed(mixed);
}
