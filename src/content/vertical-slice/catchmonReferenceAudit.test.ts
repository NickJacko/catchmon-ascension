import { describe, expect, it } from "vitest";
import { SELECTED_CATCHMON_SPECIES_IDS } from "./verticalSliceManifest.ts";
import {
  AUDIT_UNRESOLVED_FIELDS,
  CATCHMON_PORTRAIT_ASSETS,
  CATCHMON_REFERENCE_AUDIT,
} from "./catchmonReferenceAudit.ts";

// Vite's own build-time glob (same technique verticalSliceManifest.test.ts
// uses) rather than `node:fs` — verifies against the real files on disk.
const catchmonAssetModules = import.meta.glob(
  "../../../reference/catchmons/*/*.png",
);
const catchmonAssetPaths = Object.keys(catchmonAssetModules);

describe("CATCHMON_REFERENCE_AUDIT (Document 15 Task 05.1)", () => {
  it("covers exactly the locked slice selection, one record each", () => {
    expect(
      CATCHMON_REFERENCE_AUDIT.map((r) => r.catchmonSpeciesId).sort(),
    ).toEqual([...SELECTED_CATCHMON_SPECIES_IDS].sort());
  });

  it("records a sourceFolder that genuinely matches the real file on disk", () => {
    for (const record of CATCHMON_REFERENCE_AUDIT) {
      const expectedPath = `/${record.sourceFolder}/${record.catchmonSpeciesId}.png`;
      expect(catchmonAssetPaths.some((p) => p.endsWith(expectedPath))).toBe(
        true,
      );
    }
  });

  it("resolves rarity only for folders with a real Rarity counterpart (not Starter)", () => {
    for (const record of CATCHMON_REFERENCE_AUDIT) {
      if (record.sourceFolder === "Starter") {
        expect(record.rarity).toBeUndefined();
      } else {
        expect(record.rarity).toBeDefined();
      }
    }
  });

  it("never guesses element — every record names it as unresolved", () => {
    for (const record of CATCHMON_REFERENCE_AUDIT) {
      expect(record.unresolvedFields).toBe(AUDIT_UNRESOLVED_FIELDS);
      expect(record.unresolvedFields).toEqual(["elementId"]);
      expect(Object.keys(record)).not.toContain("elementId");
    }
  });

  it("resolves canonical evolution line/stage for every record from evolution_lines.json", () => {
    const expected: Readonly<Record<string, number>> = {
      Flamarox: 1,
      Emberynn: 1,
      Aquilor: 1,
      Hydroscythe: 1,
      Geckon: 0,
      Aerorion: 1,
    };
    for (const record of CATCHMON_REFERENCE_AUDIT) {
      expect(record.canonicalLineKey).toBeTypeOf("string");
      expect(record.canonicalStageIndex).toBe(
        expected[record.catchmonSpeciesId],
      );
    }
  });

  it("produces one FINAL-status portrait AssetMetadata per audited species, sized from the real file", () => {
    expect(CATCHMON_PORTRAIT_ASSETS).toHaveLength(
      CATCHMON_REFERENCE_AUDIT.length,
    );
    for (const asset of CATCHMON_PORTRAIT_ASSETS) {
      expect(asset.status).toBe("FINAL");
      expect(asset.width).toBe(1024);
      expect(asset.height).toBe(1024);
    }
  });
});
