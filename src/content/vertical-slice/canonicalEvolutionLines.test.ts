import { describe, expect, it } from "vitest";
import evolutionLinesRaw from "../../../reference/catchmons/evolution_lines.json?raw";
import {
  SLICE_RELEVANT_CANONICAL_LINES,
  findCanonicalStage,
  nextCanonicalStage,
} from "./canonicalEvolutionLines.ts";

const REAL_EVOLUTION_LINES: Readonly<Record<string, readonly string[]>> =
  JSON.parse(evolutionLinesRaw) as Record<string, readonly string[]>;

describe("SLICE_RELEVANT_CANONICAL_LINES (post-Phase-5 evolution integration)", () => {
  it("matches the live evolution_lines.json exactly for every modeled line", () => {
    for (const canonicalLine of SLICE_RELEVANT_CANONICAL_LINES) {
      const real = REAL_EVOLUTION_LINES[canonicalLine.lineKey];
      expect(
        real,
        `expected a "${canonicalLine.lineKey}" entry in evolution_lines.json`,
      ).toBeDefined();
      expect(canonicalLine.stages.map((s) => s.speciesName)).toEqual(real);
      canonicalLine.stages.forEach((stage, index) => {
        expect(stage.stageIndex).toBe(index);
      });
    }
  });

  it("resolves the exact real stage for each of the 6 slice-selected species", () => {
    expect(findCanonicalStage("Flamarox")).toEqual({
      line: expect.objectContaining({ lineKey: "Flaumi" }),
      stage: { speciesName: "Flamarox", stageIndex: 1 },
    });
    expect(findCanonicalStage("Emberynn")?.stage).toEqual({
      speciesName: "Emberynn",
      stageIndex: 1,
    });
    expect(findCanonicalStage("Aquilor")?.stage).toEqual({
      speciesName: "Aquilor",
      stageIndex: 1,
    });
    expect(findCanonicalStage("Hydroscythe")?.stage).toEqual({
      speciesName: "Hydroscythe",
      stageIndex: 1,
    });
    expect(findCanonicalStage("Geckon")?.stage).toEqual({
      speciesName: "Geckon",
      stageIndex: 0,
    });
    expect(findCanonicalStage("Aerorion")?.stage).toEqual({
      speciesName: "Aerorion",
      stageIndex: 1,
    });
    expect(findCanonicalStage("Aquaril")).toEqual({
      line: expect.objectContaining({ lineKey: "Aquaril" }),
      stage: { speciesName: "Aquaril", stageIndex: 0 },
    });
    // Ozean Batch A's new capturable line.
    expect(findCanonicalStage("Aqualume")).toEqual({
      line: expect.objectContaining({ lineKey: "Aqualume" }),
      stage: { speciesName: "Aqualume", stageIndex: 0 },
    });
    expect(findCanonicalStage("Nairowisp")?.stage).toEqual({
      speciesName: "Nairowisp",
      stageIndex: 1,
    });
  });

  it("resolves the correct next stage (or none, for a terminal stage)", () => {
    expect(nextCanonicalStage("Flamarox")).toEqual({
      speciesName: "Flameron",
      stageIndex: 2,
    });
    expect(nextCanonicalStage("Emberynn")).toEqual({
      speciesName: "Pyrocore",
      stageIndex: 2,
    });
    expect(nextCanonicalStage("Aquilor")).toEqual({
      speciesName: "Hydravian",
      stageIndex: 2,
    });
    expect(nextCanonicalStage("Geckon")).toEqual({
      speciesName: "Reptorax",
      stageIndex: 1,
    });
    expect(
      nextCanonicalStage(
        "Reptorax" /* not itself slice-selected, but modeled */,
      ),
    ).toEqual({
      speciesName: "Dracogold",
      stageIndex: 2,
    });
    // Terminal stages within their real lines — no further evolution exists.
    expect(nextCanonicalStage("Hydroscythe")).toBeUndefined();
    expect(nextCanonicalStage("Aerorion")).toBeUndefined();
    expect(nextCanonicalStage("Flameron")).toBeUndefined();
    expect(nextCanonicalStage("Pyrocore")).toBeUndefined();
    expect(nextCanonicalStage("Hydravian")).toBeUndefined();
    expect(nextCanonicalStage("Dracogold")).toBeUndefined();
    expect(nextCanonicalStage("Aquaril")).toBeUndefined();
    expect(nextCanonicalStage("Aqualume")).toEqual({
      speciesName: "Nairowisp",
      stageIndex: 1,
    });
    expect(nextCanonicalStage("Nairowisp")).toBeUndefined();
  });
});

describe("evolution_lines.json graph integrity (whole-file audit)", () => {
  it("has zero species-membership collisions (the former Glacelyra collision is resolved: Friggleaf's real third stage is Glacivernox)", () => {
    const membership = new Map<string, string[]>();
    for (const [lineKey, species] of Object.entries(REAL_EVOLUTION_LINES)) {
      for (const speciesName of species) {
        const lines = membership.get(speciesName) ?? [];
        lines.push(lineKey);
        membership.set(speciesName, lines);
      }
    }
    const collisions = [...membership.entries()].filter(
      ([, lines]) => lines.length > 1,
    );
    expect(collisions).toEqual([]);

    // Glacelyra now belongs to exactly the Crylette line, and Glacivernox
    // now belongs to exactly the Friggleaf line.
    expect(membership.get("Glacelyra")).toEqual(["Crylette"]);
    expect(membership.get("Glacivernox")).toEqual(["Friggleaf"]);
    // The obsolete pre-correction identities are not present anywhere.
    expect(membership.has("Driftos")).toBe(false);
    expect(membership.has("Koiva")).toBe(false);
    expect(membership.has("Rhynok")).toBe(false);
  });

  it("every line's own key matches its own stage-0 species name (no key/stage-0 mismatches)", () => {
    for (const [lineKey, species] of Object.entries(REAL_EVOLUTION_LINES)) {
      expect(species[0]).toBe(lineKey);
    }
  });
});
