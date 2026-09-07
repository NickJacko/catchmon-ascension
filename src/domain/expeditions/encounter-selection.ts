/**
 * Design owner: Document 15 Task 06.8 (Encounter Creation); Document 07
 * §63 Standard Acquisition Unit, §89 already-owned encounter path.
 *
 * Pure target-species selection for a newly-created Encounter Opportunity.
 * Deliberately takes an `isOwnedLine` predicate rather than `WorldState`/
 * `CatchmonLineId` lookups directly — resolving species-to-line ownership
 * is the caller's job (mirrors `domain/catchmons/effects.ts`'s own rule).
 */
import { type CatchmonSpeciesId } from "../../core/ids/index.ts";
import { invariant } from "../../core/assertions/index.ts";
import {
  nextIntExclusive,
  type RandomSource,
} from "../../core/random/index.ts";

/**
 * Biases toward a species whose line is not yet owned (this slice's
 * documented simplified encounter-generation policy: a completed Discovery
 * Survey always produces exactly one encounter, biased toward unowned pool
 * candidates when any exist). Falls back to the full pool once every
 * candidate's line is already owned (Document 07 §89: the survey still
 * finds *something*, it just becomes an already-owned observation rather
 * than a new capture). A single remaining candidate is picked
 * deterministically without consuming an RNG draw; `rng` is only drawn
 * from when a genuine choice exists, so a single-candidate pool never
 * perturbs the expedition's random-event sequence.
 */
export function selectEncounterTarget(
  rng: RandomSource,
  encounterPool: readonly CatchmonSpeciesId[],
  isOwnedLine: (speciesId: CatchmonSpeciesId) => boolean,
): CatchmonSpeciesId {
  invariant(
    encounterPool.length > 0,
    "selectEncounterTarget requires a non-empty encounterPool — should have been caught by route content validation",
  );
  const unowned = encounterPool.filter((speciesId) => !isOwnedLine(speciesId));
  const candidates = unowned.length > 0 ? unowned : encounterPool;
  if (candidates.length === 1) {
    return candidates[0]!;
  }
  const index = nextIntExclusive(rng, candidates.length);
  return candidates[index]!;
}
