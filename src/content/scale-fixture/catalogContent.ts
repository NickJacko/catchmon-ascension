/**
 * Design owner: Document 15 Phase 11 — the one `GameCatalogContent`
 * assembled from every scale-fixture module, mirroring
 * `content/vertical-slice/catalogContent.ts`'s role exactly.
 */
import { type GameCatalogContent } from "../../domain/catalog/index.ts";
import { SCALE_PLACEHOLDER_ASSET } from "./assets.ts";
import {
  SCALE_COMPONENTS,
  SCALE_PRODUCTS,
  SCALE_RECIPES,
  SCALE_RESOURCES,
} from "./crafting.ts";
import {
  SCALE_CAPABILITIES,
  SCALE_CATCHMON_LINES,
  SCALE_CATCHMON_SPECIES,
  SCALE_STARTER_SPECIES_IDS,
} from "./catchmons.ts";
import {
  SCALE_ELEMENTS,
  SCALE_REGIONS,
  SCALE_ROUTES,
  SCALE_UNLOCK_RULES,
} from "./world.ts";
import {
  SCALE_CUSTOMER_ARCHETYPES,
  SCALE_EVERYDAY_ORDERS,
  SCALE_INFRASTRUCTURE,
  SCALE_PROGRESSION_UNLOCK_RULES,
} from "./shop.ts";

export const SCALE_CATALOG_CONTENT: GameCatalogContent = {
  products: SCALE_PRODUCTS,
  recipes: SCALE_RECIPES,
  resources: SCALE_RESOURCES,
  components: SCALE_COMPONENTS,
  catchmonSpecies: SCALE_CATCHMON_SPECIES,
  catchmonLines: SCALE_CATCHMON_LINES,
  capabilities: SCALE_CAPABILITIES,
  elements: SCALE_ELEMENTS,
  regions: SCALE_REGIONS,
  routes: SCALE_ROUTES,
  customerArchetypes: SCALE_CUSTOMER_ARCHETYPES,
  infrastructure: SCALE_INFRASTRUCTURE,
  unlockRules: [...SCALE_UNLOCK_RULES, ...SCALE_PROGRESSION_UNLOCK_RULES],
  assets: [SCALE_PLACEHOLDER_ASSET],
  everydayOrders: SCALE_EVERYDAY_ORDERS,
  starterCatchmonSpeciesIds: SCALE_STARTER_SPECIES_IDS,
};
