/**
 * A generic, game-feature-agnostic typed registry (Document 14 §56-57,
 * §60 Registry Integrity Validation). Wraps a `ReadonlyMap<Id, T>` built
 * from an authored array, rejecting duplicate IDs immediately — invalid
 * canonical content must fail fast (Document 14 §62 Content Boot
 * Failure), not be silently skipped or resolved by "last one wins".
 *
 * No knowledge of Product/Recipe/Catchmon/etc. lives here — those are
 * domain-owned content shapes (Task 01.5); this module only knows how to
 * index *any* array of `{ id }`-shaped items.
 */
import { invariant } from "../assertions/invariant.ts";

export interface Registry<Id extends string, T> {
  readonly label: string;
  readonly size: number;
  get(id: Id): T | undefined;
  has(id: Id): boolean;
  values(): readonly T[];
  ids(): readonly Id[];
}

/**
 * Builds a `Registry` from an authored array. Throws (invariant) if two
 * items share the same ID — a duplicate canonical content ID is always a
 * content-authoring bug, never an expected runtime outcome.
 */
export function createRegistry<Id extends string, T>(
  items: readonly T[],
  getId: (item: T) => Id,
  label: string,
): Registry<Id, T> {
  const map = new Map<Id, T>();

  for (const item of items) {
    const id = getId(item);
    invariant(!map.has(id), `${label} registry has a duplicate ID: "${id}"`);
    map.set(id, item);
  }

  return {
    label,
    size: map.size,
    get(id: Id): T | undefined {
      return map.get(id);
    },
    has(id: Id): boolean {
      return map.has(id);
    },
    values(): readonly T[] {
      return Array.from(map.values());
    },
    ids(): readonly Id[] {
      return Array.from(map.keys());
    },
  };
}
