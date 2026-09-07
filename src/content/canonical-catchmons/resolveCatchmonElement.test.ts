import { describe, expect, it } from "vitest";
import { ELEMENT_IDS } from "../../domain/world/index.ts";
import { CANONICAL_SPECIES_IDS } from "./canonicalCatchmonGraph.ts";
import { resolvePrimaryElementForSpecies } from "./resolveCatchmonElement.ts";

describe("resolvePrimaryElementForSpecies (speciesId -> primaryElementId)", () => {
  it("resolves every one of the 104 canonical species to a valid ElementId", () => {
    for (const speciesId of CANONICAL_SPECIES_IDS) {
      const elementId = resolvePrimaryElementForSpecies(speciesId);
      expect(
        elementId,
        `"${speciesId}" did not resolve an element`,
      ).toBeDefined();
      expect(ELEMENT_IDS).toContain(elementId);
    }
  });

  it("resolves the four corrected identities to their real Element", () => {
    expect(resolvePrimaryElementForSpecies("Glacivernox")).toBe("ice");
    expect(resolvePrimaryElementForSpecies("Driftoss")).toBe("water");
    expect(resolvePrimaryElementForSpecies("Koivya")).toBe("water");
    expect(resolvePrimaryElementForSpecies("Rhyrok")).toBe("earth");
  });

  it("resolves a spread of ordinary species to their approved Element", () => {
    expect(resolvePrimaryElementForSpecies("Flamarox")).toBe("fire");
    expect(resolvePrimaryElementForSpecies("Aquilor")).toBe("water");
    expect(resolvePrimaryElementForSpecies("Geckon")).toBe("dragon");
    expect(resolvePrimaryElementForSpecies("Xandryth")).toBe("light");
    expect(resolvePrimaryElementForSpecies("Voidalon")).toBe("cosmic");
  });

  it("does not resolve the obsolete pre-correction identities to anything", () => {
    expect(resolvePrimaryElementForSpecies("Driftos")).toBeUndefined();
    expect(resolvePrimaryElementForSpecies("Koiva")).toBeUndefined();
    expect(resolvePrimaryElementForSpecies("Rhynok")).toBeUndefined();
  });

  it("does not resolve an unknown species", () => {
    expect(resolvePrimaryElementForSpecies("NotACatchmon")).toBeUndefined();
  });
});
