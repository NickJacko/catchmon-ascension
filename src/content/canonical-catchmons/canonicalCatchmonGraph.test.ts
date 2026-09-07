import { describe, expect, it } from "vitest";
import evolutionLinesRaw from "../../../reference/catchmons/evolution_lines.json?raw";
import {
  CANONICAL_EVOLUTION_LINES,
  CANONICAL_LINES,
  CANONICAL_SPECIES_IDS,
  findCanonicalLineForSpecies,
} from "./canonicalCatchmonGraph.ts";

const REAL_EVOLUTION_LINES: Readonly<Record<string, readonly string[]>> =
  JSON.parse(evolutionLinesRaw) as Record<string, readonly string[]>;

// Same technique catchmonReferenceAudit.test.ts already uses: verify
// against the real files on disk, not an assumption.
const catchmonAssetModules = import.meta.glob(
  "../../../reference/catchmons/*/*.png",
);
const catchmonAssetPaths = Object.keys(catchmonAssetModules);
const BASE_PORTRAIT_SUFFIX_PATTERN = /_(80|200|400)\.png$/;

function hasRealBasePortrait(speciesId: string): boolean {
  return catchmonAssetPaths.some(
    (p) =>
      p.endsWith(`/${speciesId}.png`) && !BASE_PORTRAIT_SUFFIX_PATTERN.test(p),
  );
}

describe("CANONICAL_EVOLUTION_LINES (full 104-species graph)", () => {
  it("matches the live evolution_lines.json exactly", () => {
    expect(CANONICAL_EVOLUTION_LINES).toEqual(REAL_EVOLUTION_LINES);
  });

  it("has exactly 51 canonical evolution lines", () => {
    expect(CANONICAL_LINES).toHaveLength(51);
  });

  it("covers exactly 104 canonical species", () => {
    expect(CANONICAL_SPECIES_IDS).toHaveLength(104);
  });

  it("contains no duplicate species across the whole graph (no membership collisions)", () => {
    const membership = new Map<string, string[]>();
    for (const canonicalLine of CANONICAL_LINES) {
      for (const stage of canonicalLine.stages) {
        const lines = membership.get(stage.speciesId) ?? [];
        lines.push(canonicalLine.evolutionLineId);
        membership.set(stage.speciesId, lines);
      }
    }
    expect(membership.size).toBe(104);
    const collisions = [...membership.entries()].filter(
      ([, lines]) => lines.length > 1,
    );
    expect(collisions).toEqual([]);
  });

  it("gives every canonical species a resolvable real portrait asset", () => {
    const missing = CANONICAL_SPECIES_IDS.filter(
      (speciesId) => !hasRealBasePortrait(speciesId),
    );
    expect(missing).toEqual([]);
  });

  it("claims Glacivernox exactly once, as the Friggleaf line's real third stage", () => {
    const found = findCanonicalLineForSpecies("Glacivernox");
    expect(found?.line.evolutionLineId).toBe("Friggleaf");
    expect(found?.stage).toEqual({ speciesId: "Glacivernox", stageIndex: 2 });
    const owners = CANONICAL_LINES.filter((l) =>
      l.stages.some((s) => s.speciesId === "Glacivernox"),
    );
    expect(owners).toHaveLength(1);
  });

  it("keeps Glacelyra as only the Crylette line's real second stage", () => {
    const found = findCanonicalLineForSpecies("Glacelyra");
    expect(found?.line.evolutionLineId).toBe("Crylette");
    expect(found?.stage).toEqual({ speciesId: "Glacelyra", stageIndex: 1 });
    const owners = CANONICAL_LINES.filter((l) =>
      l.stages.some((s) => s.speciesId === "Glacelyra"),
    );
    expect(owners).toHaveLength(1);
  });

  it("resolves Driftoss / Koivya / Rhyrok at their corrected positions", () => {
    expect(findCanonicalLineForSpecies("Driftoss")?.stage).toEqual({
      speciesId: "Driftoss",
      stageIndex: 0,
    });
    expect(findCanonicalLineForSpecies("Koivya")?.stage).toEqual({
      speciesId: "Koivya",
      stageIndex: 0,
    });
    expect(findCanonicalLineForSpecies("Rhyrok")?.stage).toEqual({
      speciesId: "Rhyrok",
      stageIndex: 1,
    });
  });

  it("does not retain the obsolete pre-correction identities anywhere in the graph", () => {
    expect(findCanonicalLineForSpecies("Driftos")).toBeUndefined();
    expect(findCanonicalLineForSpecies("Koiva")).toBeUndefined();
    expect(findCanonicalLineForSpecies("Rhynok")).toBeUndefined();
    expect(CANONICAL_SPECIES_IDS).not.toContain("Driftos");
    expect(CANONICAL_SPECIES_IDS).not.toContain("Koiva");
    expect(CANONICAL_SPECIES_IDS).not.toContain("Rhynok");
    expect(Object.keys(CANONICAL_EVOLUTION_LINES)).not.toContain("Driftos");
    expect(Object.keys(CANONICAL_EVOLUTION_LINES)).not.toContain("Koiva");
  });
});
