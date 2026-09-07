/**
 * Design owner: Canonical Catchmon Identity Reconciliation + Canonical
 * Element Assignment tasks (post-Vertical-Slice-exit). Document 06 §65-69
 * (Evolution), Document 15 Task 05.1's "report gaps, never guess" rule.
 *
 * Full-roster counterpart to `vertical-slice/canonicalEvolutionLines.ts`,
 * which only models the 7 lines relevant to the 6 slice-selected
 * Catchmons. This module loads and indexes the ENTIRE canonical
 * `evolution_lines.json` (all 51 lines / 104 species) generically, rather
 * than hand-listing each line as a TS constant — hand-listing 51 lines
 * here would duplicate the same data `evolution_lines.json` already
 * holds (CLAUDE.md §14 Single Source of Truth).
 *
 * This does NOT integrate any of the 92 non-slice species into playable
 * content (no `CatchmonSpeciesDefinition`, no domain/capability, no
 * region/encounter assignment) — it only indexes canonical identity
 * (line membership + stage position), the same category of fact
 * `catchmonReferenceAudit.ts` already records for the 6 slice species.
 *
 * `evolution_lines.json` itself has been corrected (see this module's
 * test for the full audit trail): "Driftos" -> "Driftoss", "Koiva" ->
 * "Koivya", "Rhynok" -> "Rhyrok", and the Friggleaf line's real third
 * stage is "Glacivernox" (not a second "Glacelyra", which remains the
 * Crylette line's own real terminal stage).
 *
 * A plain typed JSON import (`resolveJsonModule`, enabled in both
 * `tsconfig.app.json` and `tsconfig.scale.json`) rather than Vite's
 * `?raw` + `JSON.parse` — the earlier `?raw` version only type-checked
 * under the browser/bundler config; once real content files (`catchmonContent
 * .ts`/`expeditionEncounterContent.ts`) started importing from this
 * module, `?raw`'s bundler-only ambient types broke the Node-only
 * `tsconfig.scale.json` headless check transitively. A plain `.json`
 * import needs no bundler-specific types at all, so this module (and
 * everything that imports it) is fully headless-checkable again.
 */
import evolutionLinesData from "../../../reference/catchmons/evolution_lines.json";

export interface CanonicalCatchmonStage {
  readonly speciesId: string;
  readonly stageIndex: number;
}

export interface CanonicalCatchmonLine {
  /** Matches `evolution_lines.json`'s own object key for this line (its stage-0 species name). */
  readonly evolutionLineId: string;
  readonly stages: readonly CanonicalCatchmonStage[];
}

/** The raw, parsed `evolution_lines.json` content — every canonical line, unfiltered. */
export const CANONICAL_EVOLUTION_LINES: Readonly<
  Record<string, readonly string[]>
> = evolutionLinesData;

export const CANONICAL_LINES: readonly CanonicalCatchmonLine[] = Object.entries(
  CANONICAL_EVOLUTION_LINES,
).map(([evolutionLineId, speciesIds]) => ({
  evolutionLineId,
  stages: speciesIds.map((speciesId, stageIndex) => ({
    speciesId,
    stageIndex,
  })),
}));

/** `speciesId -> { line, stage }`, built once at module load from `CANONICAL_LINES`. */
const SPECIES_INDEX: ReadonlyMap<
  string,
  {
    readonly line: CanonicalCatchmonLine;
    readonly stage: CanonicalCatchmonStage;
  }
> = new Map(
  CANONICAL_LINES.flatMap((canonicalLine) =>
    canonicalLine.stages.map(
      (stage) => [stage.speciesId, { line: canonicalLine, stage }] as const,
    ),
  ),
);

/** All 104 canonical species IDs, in `evolution_lines.json` file order. */
export const CANONICAL_SPECIES_IDS: readonly string[] = CANONICAL_LINES.flatMap(
  (canonicalLine) => canonicalLine.stages.map((s) => s.speciesId),
);

export function findCanonicalLineForSpecies(speciesId: string):
  | {
      readonly line: CanonicalCatchmonLine;
      readonly stage: CanonicalCatchmonStage;
    }
  | undefined {
  return SPECIES_INDEX.get(speciesId);
}
