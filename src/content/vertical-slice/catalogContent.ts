/**
 * Design owner: Document 15 Task 03.3, extended by Task 04.2.
 *
 * The one `GameCatalogContent` the vertical slice actually boots from.
 * Crafting content (products/recipes/resources/components) and customer
 * archetypes are populated; every other category stays empty until
 * whichever later task authors it (Catchmon species/lines, regions,
 * routes, ... are still only reserved IDs in `verticalSliceManifest.ts`,
 * not full records).
 */
import { type GameCatalogContent } from "../../domain/catalog/index.ts";
import {
  SLICE_COMPONENTS,
  SLICE_PLACEHOLDER_ITEM_ASSET,
  SLICE_PRODUCTS,
  SLICE_RECIPES,
  SLICE_RESOURCES,
} from "./craftingContent.ts";
import { SLICE_CUSTOMER_ARCHETYPES } from "./customerContent.ts";
import {
  CATCHMON_EVOLUTION_TARGET_ASSETS,
  SLICE_CATCHMON_CAPABILITIES,
  SLICE_CATCHMON_LINES,
  SLICE_CATCHMON_SPECIES,
} from "./catchmonContent.ts";
import { CATCHMON_PORTRAIT_ASSETS } from "./catchmonReferenceAudit.ts";
import {
  AQUALUME_LINE,
  AQUALUME_LINE_SPECIES,
  AQUALUME_PORTRAIT_ASSETS,
  AQUARIL_LINE,
  AQUARIL_PORTRAIT_ASSET,
  AQUARIL_SPECIES,
} from "./expeditionEncounterContent.ts";
import {
  SLICE_REGIONS,
  SLICE_ROUTES,
  SLICE_UNLOCK_RULES,
} from "./worldContent.ts";
import { SELECTED_CATCHMON_SPECIES_IDS } from "./verticalSliceManifest.ts";
import { SLICE_INTRODUCTION_UNLOCK_RULES } from "./progressionContent.ts";
import { SLICE_INFRASTRUCTURE } from "./infrastructureContent.ts";
import { VERTICAL_SLICE_PRODUCTION_ASSETS } from "./productionAssets.ts";

export const VERTICAL_SLICE_CATALOG_CONTENT: GameCatalogContent = {
  products: SLICE_PRODUCTS,
  recipes: SLICE_RECIPES,
  resources: SLICE_RESOURCES,
  components: SLICE_COMPONENTS,
  catchmonSpecies: [
    ...SLICE_CATCHMON_SPECIES,
    AQUARIL_SPECIES,
    ...AQUALUME_LINE_SPECIES,
  ],
  catchmonLines: [...SLICE_CATCHMON_LINES, AQUARIL_LINE, AQUALUME_LINE],
  capabilities: SLICE_CATCHMON_CAPABILITIES,
  elements: [],
  regions: SLICE_REGIONS,
  routes: SLICE_ROUTES,
  customerArchetypes: SLICE_CUSTOMER_ARCHETYPES,
  infrastructure: SLICE_INFRASTRUCTURE,
  unlockRules: [...SLICE_UNLOCK_RULES, ...SLICE_INTRODUCTION_UNLOCK_RULES],
  assets: [
    SLICE_PLACEHOLDER_ITEM_ASSET,
    ...CATCHMON_PORTRAIT_ASSETS,
    ...CATCHMON_EVOLUTION_TARGET_ASSETS,
    AQUARIL_PORTRAIT_ASSET,
    ...AQUALUME_PORTRAIT_ASSETS,
    ...VERTICAL_SLICE_PRODUCTION_ASSETS,
  ],
  // Everyday Orders retired (docs/rebuild/15 Phase R5 retirement batch;
  // docs/rebuild/R1_DEPENDENCY_AUDIT.md §5 update) — no Ascension
  // equivalent; the field defaults to empty (optional in
  // `GameCatalogContent`).
  // Explicit, content-authored starting roster (Task 06.2 fix) — NOT
  // inferred from catalog/stage structure. Aquaril (a wild, capturable
  // single-stage species registered for the Discovery Survey encounter
  // pool) must never be silently owned at game start.
  starterCatchmonSpeciesIds: SELECTED_CATCHMON_SPECIES_IDS,
};
