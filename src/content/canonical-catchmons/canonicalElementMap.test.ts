import { describe, expect, it } from "vitest";
import { ELEMENT_IDS } from "../../domain/world/index.ts";
import { CANONICAL_LINES } from "./canonicalCatchmonGraph.ts";
import { CANONICAL_ELEMENT_MAP } from "./canonicalElementMap.ts";

describe("CANONICAL_ELEMENT_MAP (line-level primary Element identity)", () => {
  it("maps exactly 51 canonical evolution lines", () => {
    expect(Object.keys(CANONICAL_ELEMENT_MAP)).toHaveLength(51);
  });

  it("maps every canonical line exactly once — no missing, no extra, no duplicate keys", () => {
    const mappedKeys = Object.keys(CANONICAL_ELEMENT_MAP).sort();
    const realLineIds = CANONICAL_LINES.map((l) => l.evolutionLineId).sort();
    expect(mappedKeys).toEqual(realLineIds);
  });

  it("uses only the 17 locked ElementIds", () => {
    for (const [lineId, elementId] of Object.entries(CANONICAL_ELEMENT_MAP)) {
      expect(
        ELEMENT_IDS,
        `line "${lineId}" has an invalid ElementId`,
      ).toContain(elementId);
    }
  });

  it("maps the Friggleaf line (post-correction) and never an obsolete line key", () => {
    expect(CANONICAL_ELEMENT_MAP["Friggleaf"]).toBe("ice");
    expect(CANONICAL_ELEMENT_MAP["Driftoss"]).toBe("water");
    expect(CANONICAL_ELEMENT_MAP["Koivya"]).toBe("water");
    expect(Object.keys(CANONICAL_ELEMENT_MAP)).not.toContain("Driftos");
    expect(Object.keys(CANONICAL_ELEMENT_MAP)).not.toContain("Koiva");
  });
});
