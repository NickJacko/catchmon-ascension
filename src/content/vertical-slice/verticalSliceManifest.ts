/**
 * Design owner: Document 15 Task 01.7 (Slice Content Manifest); slice
 * shape locked by CLAUDE.md §33 "CURRENT PLAYABLE SLICE ASSUMPTIONS".
 *
 * The single explicit gate for which content the Vertical Slice may use.
 * "This prevents Claude from opportunistically using random Catchmons or
 * content" (Document 15 §28) — any later task adding Catchmons,
 * stations, products, or routes to the playable slice must add them
 * here first, not invent them ad hoc at the point of use.
 *
 * ------------------------------------------------------------------
 * CATCHMON SELECTION PROCESS (Document 15 §28 steps 1-4)
 * ------------------------------------------------------------------
 * 1. Inspected the canonical 104 reference directly: `reference/catchmons/`
 *    (Common: 75 species, God: 1, Legendary: 2, Mythic: 9, Rare: 8,
 *    Starter: 9 — counted from the actual file listing, not assumed).
 * 2. Selected 6 real species names (within the 4-8 range), verified to
 *    exist as real files in that directory (see the test suite, which
 *    checks this against the real files via Vite's `import.meta.glob`,
 *    not an assumption). Selection criteria were deliberately limited to
 *    objective, verifiable facts: the name exists as a real asset, and
 *    its rarity tier is the folder it was found in. Nothing about
 *    element, region fit, or gameplay role influenced the selection —
 *    see the "UNRESOLVED" note below for why.
 * 3. Rationale per Catchmon is recorded below, next to each ID.
 * 4. Canonical identity is not altered: nothing here renames a species,
 *    invents a replacement species, or creates/mutates a
 *    `CatchmonSpeciesDefinition`/evolution-line record. Each ID is a bare
 *    reference to an existing asset name via the branded `CatchmonSpeciesId`.
 *
 * ------------------------------------------------------------------
 * CANONICAL GAMEPLAY METADATA: UNRESOLVED (reported, not guessed)
 * ------------------------------------------------------------------
 * No metadata file anywhere in `reference/` maps these species names to
 * an element, evolution line, functional domain, or capability — only
 * the image assets and their rarity-tier folder exist. An earlier
 * version of this file filled that gap with name-etymology guesses
 * (e.g. "Flamarox" -> Fire); that approach was explicitly rejected:
 * do not infer or guess element/evolution/domain/capability data from
 * names or images. `UNRESOLVED_CATCHMON_GAMEPLAY_METADATA` below is the
 * honest record of what is missing, derived programmatically from the
 * selection above so it can never silently drift out of sync — it holds
 * no values, only the list of fields a future design task must resolve
 * before these Catchmons can be given real
 * `CatchmonSpeciesDefinition`/`EvolutionLineDefinition` records.
 * ------------------------------------------------------------------
 */
import {
  CatchmonSpeciesId,
  DisplaySlotId,
  ProductId,
  RegionId,
  RouteId,
  StationId,
} from "../../core/ids/index.ts";

export interface VerticalSliceManifest {
  readonly startRegionId: RegionId;
  readonly previewRegionId: RegionId;
  readonly selectedCatchmonSpeciesIds: readonly CatchmonSpeciesId[];
  readonly playableStationIds: readonly StationId[];
  readonly playableProductIds: readonly ProductId[];
  readonly playableRouteIds: readonly RouteId[];
  readonly playableDisplaySlotIds: readonly DisplaySlotId[];
  readonly featureFlags: Readonly<Record<string, boolean>>;
}

/**
 * CLAUDE.md §33: "Start Region: Vulkankrater / Fire, Contrast Preview:
 * Ozean / Water." These two region IDs were originally reserved as the
 * literal strings "vulkankrater"/"ozean" (Task 01.7, before Document 10
 * — the authoritative source for region identity — had been read for any
 * task). Document 15 Task 06.1 requires reading Document 10 for region
 * definitions; its §1 canonical region/element table gives the real
 * internal ID for the Fire/Vulkankrater region as `grasland`
 * ("Vulkankrater" is the display name; "`grasland` may remain the stable
 * internal ID"). `START_REGION_ID` is corrected here to that real
 * canonical value — `ozean` needed no correction, it already matched
 * Document 10's table exactly. `RegionDefinition` records now exist for
 * both (`worldContent.ts`, Task 06.1).
 */
export const START_REGION_ID: RegionId = RegionId.from("grasland");
export const PREVIEW_REGION_ID: RegionId = RegionId.from("ozean");

/**
 * CLAUDE.md §33: "4-8 canonical existing Catchmons." Six real species
 * names, verified present in `reference/catchmons/`:
 *
 * - Flamarox    (Starter)
 * - Emberynn    (Common)
 * - Aquilor     (Starter)
 * - Hydroscythe (Common)
 * - Geckon      (Starter)
 * - Aerorion    (Rare)
 *
 * Selection criteria: real name verified to exist in the reference
 * directory, and a spread across rarity tiers (Starter/Common/Rare) so
 * the slice roster is not exclusively one tier. No element, domain, or
 * gameplay-role judgment informed this list — see "UNRESOLVED" above.
 */
export const SELECTED_CATCHMON_SPECIES_IDS: readonly CatchmonSpeciesId[] = [
  CatchmonSpeciesId.from("Flamarox"),
  CatchmonSpeciesId.from("Emberynn"),
  CatchmonSpeciesId.from("Aquilor"),
  CatchmonSpeciesId.from("Hydroscythe"),
  CatchmonSpeciesId.from("Geckon"),
  CatchmonSpeciesId.from("Aerorion"),
] as const;

/** The canonical gameplay-metadata fields a future design task must resolve. */
export const UNRESOLVED_CATCHMON_METADATA_FIELDS = [
  "element",
  "evolutionLine",
  "domain",
  "capabilities",
] as const;

/**
 * Structural record of what is unresolved for each selected Catchmon —
 * see the module doc's "UNRESOLVED" section. Deliberately holds no
 * guessed values. Derived from `SELECTED_CATCHMON_SPECIES_IDS` rather
 * than hand-listed, so it cannot drift out of sync with the selection.
 */
export const UNRESOLVED_CATCHMON_GAMEPLAY_METADATA: readonly {
  readonly catchmonSpeciesId: CatchmonSpeciesId;
  readonly unresolvedFields: typeof UNRESOLVED_CATCHMON_METADATA_FIELDS;
}[] = SELECTED_CATCHMON_SPECIES_IDS.map((catchmonSpeciesId) => ({
  catchmonSpeciesId,
  unresolvedFields: UNRESOLVED_CATCHMON_METADATA_FIELDS,
}));

/**
 * CLAUDE.md §33: "2 visually represented station families" described the
 * original Vertical Slice's starting scope. Ozean Batch A adds a 3rd
 * reserved ID for Care Atelier — Document 04 §28's primary families
 * (Care & Comfort, Wearables) are exactly Water's own strong/secondary
 * crafting tendencies (Document 10 §25), an explicit, approved extension
 * of that original assumption as the game grows past the single-region
 * slice, not an unapproved scope drift. No `StationId`-keyed content
 * record exists yet for any of the three — a later content-authoring
 * task (Batch B for Care Atelier's own products/recipes) must create them
 * using exactly these IDs, not new ones. Chosen station archetypes
 * (Document 04 §27-32): PROVISION_STATION and FIELDWORKS_BENCH, picked
 * only because Document 04 describes them as commonly-early/dual-use
 * stations — not tied to any property of the selected Catchmons above.
 */
export const PLAYABLE_STATION_IDS: readonly StationId[] = [
  StationId.from("slice-provision-station-01"),
  StationId.from("slice-fieldworks-bench-01"),
  StationId.from("ozean-care-atelier-01"),
] as const;

/**
 * Reserved IDs, now backed by real content (Document 15 Task 03.3, see
 * `craftingContent.ts`). Count revised from 3 to 5 by Task 03.3 itself —
 * the original 3 was an explicitly-non-locked placeholder judgment call
 * ("three is the minimum needed..."); Document 15 Task 03.3 specifies
 * "5 product/recipe definitions" directly, so this list now matches that
 * exact requirement rather than the earlier placeholder guess.
 */
export const PLAYABLE_PRODUCT_IDS: readonly ProductId[] = [
  ProductId.from("slice-product-01"),
  ProductId.from("slice-product-02"),
  ProductId.from("slice-product-03"),
  ProductId.from("slice-product-04"),
  ProductId.from("slice-product-05"),
] as const;

/**
 * CLAUDE.md §33: "1 Expedition slot." One reserved `RouteId` — no
 * `RouteDefinition` content exists yet.
 */
export const PLAYABLE_ROUTE_IDS: readonly RouteId[] = [
  RouteId.from("slice-route-01"),
] as const;

/**
 * CLAUDE.md §33: "3 Displays." Reserved IDs only — Document 15 Task 04.1
 * lazily initializes each slot's `DisplaySlotState` on first assignment,
 * matching the same reserved-ID-then-lazy-init pattern already used for
 * `PLAYABLE_STATION_IDS`.
 */
export const PLAYABLE_DISPLAY_SLOT_IDS: readonly DisplaySlotId[] = [
  DisplaySlotId.from("slice-display-01"),
  DisplaySlotId.from("slice-display-02"),
  DisplaySlotId.from("slice-display-03"),
] as const;

/**
 * Intentionally empty: no slice-gating boolean has been needed by any
 * task through 01.7. Add flags here (not ad hoc in feature code) if a
 * later task needs one — this is the one place slice feature gating is
 * allowed to live.
 */
export const FEATURE_FLAGS: Readonly<Record<string, boolean>> = {};

export const VERTICAL_SLICE_MANIFEST: VerticalSliceManifest = {
  startRegionId: START_REGION_ID,
  previewRegionId: PREVIEW_REGION_ID,
  selectedCatchmonSpeciesIds: SELECTED_CATCHMON_SPECIES_IDS,
  playableStationIds: PLAYABLE_STATION_IDS,
  playableProductIds: PLAYABLE_PRODUCT_IDS,
  playableRouteIds: PLAYABLE_ROUTE_IDS,
  playableDisplaySlotIds: PLAYABLE_DISPLAY_SLOT_IDS,
  featureFlags: FEATURE_FLAGS,
};
