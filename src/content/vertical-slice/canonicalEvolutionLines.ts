/**
 * Design owner: Post-Phase-5 integration of the newly provided canonical
 * evolution reference `reference/catchmons/evolution_lines.json`; Document
 * 06 §65-69 (Evolution), §7 (Single-Stage Catchmon Rule); Document 15
 * Task 05.1 (Canonical Catchmon Reference Audit Adapter — "evolution
 * line/stage if known").
 *
 * Only the lines that contain one of the 6 slice-selected Catchmons, plus
 * the wild capturable lines real Discovery Survey routes encounter
 * (`Aquaril`, single-stage per Document 06 §7; `Aqualume`, two-stage, the
 * Ozean Reef Survey route's new capture — Ozean Batch A), are modeled
 * here — this is not a normalization of all 104 Catchmons
 * (Document 15 §32 Vertical Slice Scope: "do not scale prematurely to all
 * 104 Catchmon gameplay roles"). Each line's `stages` array is the real,
 * full canonical chain from the reference file, in order; `catchmonContent
 * .ts` decides which of those stages actually get a `CatchmonSpeciesDefinition`
 * registered in the slice catalog (a stage's REAL `stageIndex` is recorded
 * here even for stages that are not registered, since stage position is a
 * fact independent of whether this slice's catalog happens to include
 * that particular predecessor).
 *
 * This file's own test (`canonicalEvolutionLines.test.ts`) re-verifies
 * every line below against the live JSON file (`?raw` + `JSON.parse`, the
 * same "declared content, checked against the real source" pattern
 * `catchmonReferenceAudit.test.ts` already uses for asset folders) — so
 * this can never silently drift out of sync with the canonical reference.
 *
 * IDENTITY CORRECTIONS (applied to `evolution_lines.json` as approved
 * canon — see the Canonical Catchmon Identity Reconciliation):
 * previously "Driftos" (no matching asset under that exact spelling) is
 * now "Driftoss" (the real, correctly-spelled asset), matching this
 * file's `DRIFTOSS_LINE` below. The former "one genuine species-membership
 * collision" — "Glacelyra" claimed by both the Crylette and Friggleaf
 * lines — is also resolved: the Friggleaf line's real third stage is
 * "Glacivernox" (a real, previously-unclaimed asset the source file had
 * never mentioned), not a second Glacelyra. Both findings are gone from
 * the graph, not merely hidden; see `canonicalEvolutionLines.test.ts`'s
 * "graph integrity" block, which now asserts zero collisions and exact
 * resolution for all four corrected identities.
 */

export interface CanonicalEvolutionStage {
  readonly speciesName: string;
  readonly stageIndex: number;
}

export interface CanonicalEvolutionLine {
  /** Matches `evolution_lines.json`'s own object key for this line (its stage-0 species name). */
  readonly lineKey: string;
  readonly stages: readonly CanonicalEvolutionStage[];
}

function line(
  lineKey: string,
  speciesNames: readonly string[],
): CanonicalEvolutionLine {
  return {
    lineKey,
    stages: speciesNames.map((speciesName, stageIndex) => ({
      speciesName,
      stageIndex,
    })),
  };
}

export const FLAUMI_LINE = line("Flaumi", ["Flaumi", "Flamarox", "Flameron"]);
export const MAGMAROCK_LINE = line("Magmarock", [
  "Magmarock",
  "Emberynn",
  "Pyrocore",
]);
export const PLIPSY_LINE = line("Plipsy", ["Plipsy", "Aquilor", "Hydravian"]);
export const DRIFTOSS_LINE = line("Driftoss", ["Driftoss", "Hydroscythe"]);
export const GECKON_LINE = line("Geckon", ["Geckon", "Reptorax", "Dracogold"]);
export const SKYRION_LINE = line("Skyrion", ["Skyrion", "Aerorion"]);
export const AQUARIL_LINE = line("Aquaril", ["Aquaril"]);
export const AQUALUME_LINE = line("Aqualume", ["Aqualume", "Nairowisp"]);

/** The lines relevant to the Vertical Slice: the 6 selected Catchmons' lines, plus the wild capturable lines a real route can encounter (Aquaril, Aqualume). */
export const SLICE_RELEVANT_CANONICAL_LINES: readonly CanonicalEvolutionLine[] =
  [
    FLAUMI_LINE,
    MAGMAROCK_LINE,
    PLIPSY_LINE,
    DRIFTOSS_LINE,
    GECKON_LINE,
    SKYRION_LINE,
    AQUARIL_LINE,
    AQUALUME_LINE,
  ];

export function findCanonicalStage(speciesName: string):
  | {
      readonly line: CanonicalEvolutionLine;
      readonly stage: CanonicalEvolutionStage;
    }
  | undefined {
  for (const canonicalLine of SLICE_RELEVANT_CANONICAL_LINES) {
    const stage = canonicalLine.stages.find(
      (s) => s.speciesName === speciesName,
    );
    if (stage) return { line: canonicalLine, stage };
  }
  return undefined;
}

/** The next stage after `speciesName` in its line, if any (undefined = terminal stage). */
export function nextCanonicalStage(
  speciesName: string,
): CanonicalEvolutionStage | undefined {
  const found = findCanonicalStage(speciesName);
  if (!found) return undefined;
  return found.line.stages.find(
    (s) => s.stageIndex === found.stage.stageIndex + 1,
  );
}
