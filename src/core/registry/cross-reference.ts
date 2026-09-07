/**
 * Generic cross-registry reference validation (Document 14 §61
 * Cross-Registry Validation). No knowledge of *which* content categories
 * reference each other — that wiring belongs to `GameCatalog`
 * (src/domain/catalog/); this module only knows how to check that a list
 * of referenced IDs all exist in a target registry.
 */
import { invariant } from "../assertions/invariant.ts";
import { type Registry } from "./registry.ts";

/**
 * Throws (invariant) listing every referenced ID that does not exist in
 * `target`. An unknown reference in canonical content is always a
 * content-authoring bug (Document 14 §62 Content Boot Failure) — it must
 * fail fast, not be silently dropped or resolved to `undefined` later at
 * some unrelated call site.
 */
export function assertReferencesExist<Id extends string>(
  sourceLabel: string,
  referencedIds: readonly Id[],
  target: Registry<Id, unknown>,
): void {
  const unknownIds = referencedIds.filter((id) => !target.has(id));
  invariant(
    unknownIds.length === 0,
    `${sourceLabel} references unknown ${target.label} ID(s): ${unknownIds.join(", ")}`,
  );
}
