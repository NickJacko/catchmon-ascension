import { describe, expect, it } from "vitest";
import {
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_PRODUCT_IDS,
  PLAYABLE_ROUTE_IDS,
  PLAYABLE_STATION_IDS,
  PREVIEW_REGION_ID,
  SELECTED_CATCHMON_SPECIES_IDS,
  START_REGION_ID,
  UNRESOLVED_CATCHMON_GAMEPLAY_METADATA,
  UNRESOLVED_CATCHMON_METADATA_FIELDS,
  VERTICAL_SLICE_MANIFEST,
} from "./verticalSliceManifest.ts";

// Vite's own build-time glob (Document 14 §191) rather than `node:fs` — this
// keeps the check inside the app's browser-safe project (tsconfig.app.json
// deliberately excludes Node types) while still verifying against the real
// files on disk, not an assumption about what exists.
const catchmonAssetModules = import.meta.glob(
  "../../../reference/catchmons/*/*.png",
);
const catchmonAssetPaths = Object.keys(catchmonAssetModules);

function canonicalAssetExists(speciesId: string): boolean {
  // Exact filename match only (not a prefix match), so e.g. "Aquilor"
  // does not spuriously match "Aquilor_200.png".
  return catchmonAssetPaths.some((path) => path.endsWith(`/${speciesId}.png`));
}

describe("VERTICAL_SLICE_MANIFEST (Document 15 Task 01.7)", () => {
  it("found real Catchmon assets to check against (sanity check on the glob itself)", () => {
    expect(catchmonAssetPaths.length).toBeGreaterThan(50);
  });

  it("selects between 4 and 8 Catchmons (CLAUDE.md §33)", () => {
    expect(SELECTED_CATCHMON_SPECIES_IDS.length).toBeGreaterThanOrEqual(4);
    expect(SELECTED_CATCHMON_SPECIES_IDS.length).toBeLessThanOrEqual(8);
  });

  it("selects only Catchmons that genuinely exist in reference/catchmons/", () => {
    for (const speciesId of SELECTED_CATCHMON_SPECIES_IDS) {
      expect(canonicalAssetExists(speciesId)).toBe(true);
    }
  });

  it("selects Catchmons with no duplicate IDs", () => {
    expect(new Set(SELECTED_CATCHMON_SPECIES_IDS).size).toBe(
      SELECTED_CATCHMON_SPECIES_IDS.length,
    );
  });

  it("reserves exactly 3 playable stations (CLAUDE.md §33's original '2 visually represented station families' plus Care Atelier, an explicit approved Ozean Batch A extension)", () => {
    expect(PLAYABLE_STATION_IDS).toHaveLength(3);
  });

  it("reserves exactly 1 playable route (CLAUDE.md §33: '1 Expedition slot')", () => {
    expect(PLAYABLE_ROUTE_IDS).toHaveLength(1);
  });

  it("reserves at least 1 playable product", () => {
    expect(PLAYABLE_PRODUCT_IDS.length).toBeGreaterThan(0);
  });

  it("reserves exactly 3 display slots (CLAUDE.md §33: '3 Displays')", () => {
    expect(PLAYABLE_DISPLAY_SLOT_IDS).toHaveLength(3);
  });

  it("uses the canonical start/preview region IDs (Document 10 §1: grasland='Vulkankrater'/Fire, ozean='Ozean'/Water)", () => {
    expect(START_REGION_ID).toBe("grasland");
    expect(PREVIEW_REGION_ID).toBe("ozean");
  });

  it("marks canonical gameplay metadata as unresolved for every selected Catchmon, with no guessed values", () => {
    const unresolvedIds = UNRESOLVED_CATCHMON_GAMEPLAY_METADATA.map(
      (entry) => entry.catchmonSpeciesId,
    );
    expect(new Set(unresolvedIds)).toEqual(
      new Set(SELECTED_CATCHMON_SPECIES_IDS),
    );

    for (const entry of UNRESOLVED_CATCHMON_GAMEPLAY_METADATA) {
      expect(entry.unresolvedFields).toEqual(
        UNRESOLVED_CATCHMON_METADATA_FIELDS,
      );
      // No "value"/"guess"-shaped key exists anywhere on the entry — it
      // records only which fields are unresolved, never a guessed value.
      expect(Object.keys(entry).sort()).toEqual([
        "catchmonSpeciesId",
        "unresolvedFields",
      ]);
    }
  });

  it("assembles VERTICAL_SLICE_MANIFEST from the same exported constants (single source of truth)", () => {
    expect(VERTICAL_SLICE_MANIFEST.selectedCatchmonSpeciesIds).toBe(
      SELECTED_CATCHMON_SPECIES_IDS,
    );
    expect(VERTICAL_SLICE_MANIFEST.startRegionId).toBe(START_REGION_ID);
  });
});
