/**
 * Design owner: Canonical Element Assignment task (approved). Document 10
 * World & Element Structure — the 17 locked `ElementId`s
 * (`src/domain/world/types.ts`).
 *
 * `reference/catchmons/element_mapping.json` is the new canonical
 * source-of-truth file, sibling to `evolution_lines.json`: it records
 * PRIMARY Element identity at the LINE level (`evolutionLineId ->
 * ElementId`), not per-species, because every approved line is
 * element-stable (Document 10's design-compass guidance plus direct
 * visual/naming review of all 104 portraits — see the Canonical Element
 * Assignment report for the per-line rationale and the handful of
 * genuinely close calls).
 *
 * This mapping is PRIMARY ELEMENT IDENTITY only. It does NOT mean a
 * Catchmon may spawn only in a matching Region, that encounter pools must
 * equal primary-element membership, or that dual types exist — those
 * remain separate, later content decisions (homeRegionId, encounter
 * pools, and the like are explicitly out of scope for this task).
 *
 * Plain typed JSON import (`resolveJsonModule`), not Vite's `?raw` — see
 * `canonicalCatchmonGraph.ts`'s doc comment for why (this module needs to
 * stay headless-checkable under `tsconfig.scale.json` now that real
 * content files import from it).
 */
import { type ElementId } from "../../domain/world/index.ts";
import elementMappingData from "../../../reference/catchmons/element_mapping.json";

/** The raw, parsed `element_mapping.json` content: `evolutionLineId -> ElementId`. */
export const CANONICAL_ELEMENT_MAP: Readonly<Record<string, ElementId>> =
  elementMappingData as Record<string, ElementId>;

export function findPrimaryElementForLine(
  evolutionLineId: string,
): ElementId | undefined {
  return CANONICAL_ELEMENT_MAP[evolutionLineId];
}
