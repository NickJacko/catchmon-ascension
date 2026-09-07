/**
 * Design owner: Canonical Element Assignment task (approved).
 *
 * The single canonical query for `speciesId -> primaryElementId`. Derived
 * purely from `canonicalCatchmonGraph.ts` (species -> line) composed with
 * `canonicalElementMap.ts` (line -> element) — the Element value itself
 * is never duplicated per species; it is looked up through the line, per
 * the task's explicit "line-level mapping, because all approved lines are
 * element-stable" instruction.
 */
import { type ElementId } from "../../domain/world/index.ts";
import { findPrimaryElementForLine } from "./canonicalElementMap.ts";
import { findCanonicalLineForSpecies } from "./canonicalCatchmonGraph.ts";

/**
 * Resolves a canonical species' PRIMARY Element identity, or `undefined`
 * if the species has no canonical evolution-line membership (unknown
 * species) or its line has no Element mapping (should not happen for any
 * of the 51 approved lines — see `canonicalElementMap.test.ts`).
 */
export function resolvePrimaryElementForSpecies(
  speciesId: string,
): ElementId | undefined {
  const found = findCanonicalLineForSpecies(speciesId);
  if (!found) return undefined;
  return findPrimaryElementForLine(found.line.evolutionLineId);
}
