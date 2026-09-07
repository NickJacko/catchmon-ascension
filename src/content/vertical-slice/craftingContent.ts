/**
 * Design owner: Document 15 Task 03.3 (Early Slice Resource/Product
 * Content); 04 Crafting & Product System.
 *
 * The minimal headless product dataset needed to exercise crafting for
 * the vertical slice: 2 routine materials, 1 special component, 5
 * product/recipe pairs, all producible at the 2 stations already reserved
 * in `verticalSliceManifest.ts`. Deliberately provisional (Document 15
 * Task 03.3: "no claim of final product naming, no mass content") — every
 * display name below is a working label, not a final one.
 *
 * All 5 recipes here consume exactly `PROVISIONAL_SLICE_INPUT_QUANTITY`
 * (1) unit of each listed routine/special input line — see `balance.ts`'s
 * header for why.
 */
import {
  AssetId,
  ComponentId,
  ItemId,
  ProductId,
  RecipeId,
  ResourceId,
} from "../../core/ids/index.ts";
import {
  type ComponentDefinition,
  type ProductDefinition,
  type RecipeDefinition,
  type ResourceDefinition,
} from "../../domain/crafting/index.ts";
import { type AssetMetadata } from "../../domain/assets/index.ts";
import {
  PROVISIONAL_MASTERY_PROFILE,
  PROVISIONAL_SLICE_INPUT_QUANTITY,
  getSliceRecipeBalance,
} from "./balance.ts";
import {
  COMPONENT_A_BASE_ASSET_ID,
  MATERIAL_RESOURCE_A_BASE_ASSET_ID,
  MATERIAL_RESOURCE_B_BASE_ASSET_ID,
  PRODUCT_01_BASE_ASSET_ID,
  PRODUCT_02_BASE_ASSET_ID,
  PRODUCT_03_BASE_ASSET_ID,
  PRODUCT_04_BASE_ASSET_ID,
  PRODUCT_05_BASE_ASSET_ID,
} from "./productionAssets.ts";

/** One shared placeholder icon for every slice item (CLAUDE.md §25: use the canonical placeholder, report the missing real asset). */
export const SLICE_PLACEHOLDER_ITEM_ASSET_ID: AssetId = AssetId.from(
  "slice-placeholder-item-icon",
);

export const SLICE_PLACEHOLDER_ITEM_ASSET: AssetMetadata = {
  assetId: SLICE_PLACEHOLDER_ITEM_ASSET_ID,
  category: "item",
  sourcePath: "placeholder/item-icon.png",
  runtimePath: "/assets/placeholder/item-icon.png",
  status: "PLACEHOLDER",
  version: 1,
  width: 128,
  height: 128,
  format: "png",
  hasAlpha: true,
  tags: ["placeholder"],
  preloadClass: "ON_DEMAND",
};

// ---- Resources (Document 04 §21.1: routine materials) ----

export const SLICE_RESOURCE_A_ID: ResourceId =
  ResourceId.from("slice-resource-a");
export const SLICE_RESOURCE_B_ID: ResourceId =
  ResourceId.from("slice-resource-b");

/**
 * Ozean Batch A (approved Ozean content proposal §4): Reef Kelp and
 * Cleansing Brine, Ozean's own routine materials (Document 10 §24 Water
 * Resource Ecology: "fluid/organic inputs... cleaning/preservation
 * resources"). Working names, not final (same discipline as the two
 * Vulkankrater resources above). No new art yet — reuses the shared
 * placeholder icon, the established intentional placeholder/fallback path
 * (`resolveAssetImageUrl` renders its own placeholder box for anything
 * that isn't `FINAL`-status, so this is inert-but-valid, not a broken
 * reference).
 *
 * Genuinely obtainable (Batch A closure): `ExpeditionRewardConfig` was
 * generalized from one resource shared by every route to one resource PER
 * ROUTE (`app/game-config.ts`) — Ozean Tidal Shallows and Reef Survey
 * grant Reef Kelp, Ozean Tidepool Hunt grants Cleansing Brine. No Batch B
 * recipes exist yet to consume them, but the player can genuinely earn
 * both today.
 */
export const OZEAN_RESOURCE_REEF_KELP_ID: ResourceId = ResourceId.from(
  "ozean-resource-reef-kelp",
);
export const OZEAN_RESOURCE_CLEANSING_BRINE_ID: ResourceId = ResourceId.from(
  "ozean-resource-cleansing-brine",
);

export const SLICE_RESOURCES: readonly ResourceDefinition[] = [
  {
    resourceId: SLICE_RESOURCE_A_ID,
    displayName: "Slice Routine Material A",
    // Phase 10 §8: provisional visual mapping only — routine-material-01
    // art stands in for Resource A. Not a rename; domain identity unchanged.
    visualAssetId: MATERIAL_RESOURCE_A_BASE_ASSET_ID,
    itemId: ItemId.from("slice-resource-a-item"),
  },
  {
    resourceId: SLICE_RESOURCE_B_ID,
    displayName: "Slice Routine Material B",
    visualAssetId: MATERIAL_RESOURCE_B_BASE_ASSET_ID,
    itemId: ItemId.from("slice-resource-b-item"),
  },
  {
    resourceId: OZEAN_RESOURCE_REEF_KELP_ID,
    displayName: "Reef Kelp (Provisional)",
    visualAssetId: SLICE_PLACEHOLDER_ITEM_ASSET_ID,
    itemId: ItemId.from("ozean-resource-reef-kelp-item"),
  },
  {
    resourceId: OZEAN_RESOURCE_CLEANSING_BRINE_ID,
    displayName: "Cleansing Brine (Provisional)",
    visualAssetId: SLICE_PLACEHOLDER_ITEM_ASSET_ID,
    itemId: ItemId.from("ozean-resource-cleansing-brine-item"),
  },
];

// ---- Special component (Document 04 §25/§10.2: scarcer, gates advanced crafts) ----

export const SLICE_COMPONENT_A_ID: ComponentId =
  ComponentId.from("slice-component-a");

/**
 * Ozean Batch A: Luminous Pearl, the Ozean Tidepool Hunt route's special
 * component (approved Ozean content proposal §4). Unlike the two routine
 * materials above, this one IS already functionally live: it slots
 * directly into `OZEAN_TIDEPOOL_HUNT_ROUTE.specialComponentPool`
 * (`worldContent.ts`), which the existing, fully-generic per-route
 * Component Hunt bonus-roll mechanism already supports with zero
 * architecture changes.
 */
export const OZEAN_COMPONENT_LUMINOUS_PEARL_ID: ComponentId = ComponentId.from(
  "ozean-component-luminous-pearl",
);

export const SLICE_COMPONENTS: readonly ComponentDefinition[] = [
  {
    componentId: SLICE_COMPONENT_A_ID,
    displayName: "Slice Special Component A",
    visualAssetId: COMPONENT_A_BASE_ASSET_ID,
    itemId: ItemId.from("slice-component-a-item"),
  },
  {
    componentId: OZEAN_COMPONENT_LUMINOUS_PEARL_ID,
    displayName: "Luminous Pearl (Provisional)",
    visualAssetId: SLICE_PLACEHOLDER_ITEM_ASSET_ID,
    itemId: ItemId.from("ozean-component-luminous-pearl-item"),
  },
];

// ---- Products + recipes ----
// Five roles, matching Document 04 §137's prototype set as closely as the
// slice's 2 stations allow (Document 04 §138 explicitly lets FIELDWORKS_
// BENCH stand in for later Care/Field/Element station functionality in a
// prototype): fast turnover, a slower/higher-value branch of the same
// family, a balanced Field Gear product, a dual-use Field/Capture product,
// and an advanced special-component conversion.

export const SLICE_PRODUCT_01_ID: ProductId =
  ProductId.from("slice-product-01");
export const SLICE_PRODUCT_02_ID: ProductId =
  ProductId.from("slice-product-02");
export const SLICE_PRODUCT_03_ID: ProductId =
  ProductId.from("slice-product-03");
export const SLICE_PRODUCT_04_ID: ProductId =
  ProductId.from("slice-product-04");
export const SLICE_PRODUCT_05_ID: ProductId =
  ProductId.from("slice-product-05");

export const SLICE_RECIPE_01_ID: RecipeId = RecipeId.from("slice-recipe-01");
export const SLICE_RECIPE_02_ID: RecipeId = RecipeId.from("slice-recipe-02");
export const SLICE_RECIPE_03_ID: RecipeId = RecipeId.from("slice-recipe-03");
export const SLICE_RECIPE_04_ID: RecipeId = RecipeId.from("slice-recipe-04");
export const SLICE_RECIPE_05_ID: RecipeId = RecipeId.from("slice-recipe-05");

const balance01 = getSliceRecipeBalance(SLICE_RECIPE_01_ID);
const balance02 = getSliceRecipeBalance(SLICE_RECIPE_02_ID);
const balance03 = getSliceRecipeBalance(SLICE_RECIPE_03_ID);
const balance04 = getSliceRecipeBalance(SLICE_RECIPE_04_ID);
const balance05 = getSliceRecipeBalance(SLICE_RECIPE_05_ID);

export const SLICE_PRODUCTS: readonly ProductDefinition[] = [
  {
    productId: SLICE_PRODUCT_01_ID,
    displayName: "Slice Provisions A (Turnover)",
    family: "PROVISIONS",
    recipeRank: 1,
    stationType: "PROVISION_STATION",
    routineInputs: [SLICE_RESOURCE_A_ID],
    specialInputs: [],
    craftDuration: balance01.craftDurationMs,
    outputQuantity: balance01.outputQuantity,
    baseTransactionValue: balance01.baseTransactionValue,
    displayCategory: "provisions",
    demandTags: ["everyday"],
    masteryProfile: PROVISIONAL_MASTERY_PROFILE,
    qualityEligible: false,
    unlockRequirements: [],
    catchmonHooks: [],
    visualAssetId: PRODUCT_01_BASE_ASSET_ID,
  },
  {
    productId: SLICE_PRODUCT_02_ID,
    displayName: "Slice Provisions B (Higher Value)",
    family: "PROVISIONS",
    recipeRank: 1,
    stationType: "PROVISION_STATION",
    routineInputs: [SLICE_RESOURCE_A_ID],
    specialInputs: [],
    craftDuration: balance02.craftDurationMs,
    outputQuantity: balance02.outputQuantity,
    baseTransactionValue: balance02.baseTransactionValue,
    displayCategory: "provisions",
    demandTags: ["everyday"],
    masteryProfile: PROVISIONAL_MASTERY_PROFILE,
    qualityEligible: true,
    unlockRequirements: [],
    catchmonHooks: [],
    visualAssetId: PRODUCT_02_BASE_ASSET_ID,
  },
  {
    productId: SLICE_PRODUCT_03_ID,
    displayName: "Slice Field Gear A (Balanced)",
    family: "FIELD_GEAR",
    recipeRank: 1,
    stationType: "FIELDWORKS_BENCH",
    routineInputs: [SLICE_RESOURCE_B_ID],
    specialInputs: [],
    craftDuration: balance03.craftDurationMs,
    outputQuantity: balance03.outputQuantity,
    baseTransactionValue: balance03.baseTransactionValue,
    displayCategory: "field-gear",
    demandTags: ["everyday"],
    masteryProfile: PROVISIONAL_MASTERY_PROFILE,
    qualityEligible: true,
    unlockRequirements: [],
    catchmonHooks: [],
    visualAssetId: PRODUCT_03_BASE_ASSET_ID,
  },
  {
    productId: SLICE_PRODUCT_04_ID,
    displayName: "Slice Field Gear B (Dual-Use)",
    family: "CAPTURE_AND_DISCOVERY_GEAR",
    recipeRank: 1,
    stationType: "FIELDWORKS_BENCH",
    routineInputs: [SLICE_RESOURCE_B_ID],
    specialInputs: [],
    craftDuration: balance04.craftDurationMs,
    outputQuantity: balance04.outputQuantity,
    baseTransactionValue: balance04.baseTransactionValue,
    displayCategory: "capture-gear",
    demandTags: ["explorer"],
    playerUse: "expedition-preparation",
    masteryProfile: PROVISIONAL_MASTERY_PROFILE,
    qualityEligible: false,
    unlockRequirements: [],
    catchmonHooks: [],
    visualAssetId: PRODUCT_04_BASE_ASSET_ID,
  },
  {
    productId: SLICE_PRODUCT_05_ID,
    displayName: "Slice Elemental Craft A (Special-Component Conversion)",
    family: "ELEMENTAL_CRAFT",
    recipeRank: 2,
    stationType: "FIELDWORKS_BENCH",
    routineInputs: [SLICE_RESOURCE_B_ID],
    specialInputs: [SLICE_COMPONENT_A_ID],
    craftDuration: balance05.craftDurationMs,
    outputQuantity: balance05.outputQuantity,
    baseTransactionValue: balance05.baseTransactionValue,
    displayCategory: "elemental-craft",
    demandTags: ["premium"],
    masteryProfile: PROVISIONAL_MASTERY_PROFILE,
    qualityEligible: true,
    unlockRequirements: [],
    catchmonHooks: [],
    visualAssetId: PRODUCT_05_BASE_ASSET_ID,
  },
];

export const SLICE_RECIPES: readonly RecipeDefinition[] = [
  {
    recipeId: SLICE_RECIPE_01_ID,
    displayName: "Craft Slice Provisions A",
    outputProductId: SLICE_PRODUCT_01_ID,
    stationType: "PROVISION_STATION",
    recipeRank: 1,
    routineInputs: [
      {
        resourceId: SLICE_RESOURCE_A_ID,
        quantity: PROVISIONAL_SLICE_INPUT_QUANTITY,
      },
    ],
    specialInputs: [],
    craftDuration: balance01.craftDurationMs,
    unlockRequirements: [],
  },
  {
    recipeId: SLICE_RECIPE_02_ID,
    displayName: "Craft Slice Provisions B",
    outputProductId: SLICE_PRODUCT_02_ID,
    stationType: "PROVISION_STATION",
    recipeRank: 1,
    routineInputs: [
      {
        resourceId: SLICE_RESOURCE_A_ID,
        quantity: PROVISIONAL_SLICE_INPUT_QUANTITY,
      },
    ],
    specialInputs: [],
    craftDuration: balance02.craftDurationMs,
    unlockRequirements: [],
  },
  {
    recipeId: SLICE_RECIPE_03_ID,
    displayName: "Craft Slice Field Gear A",
    outputProductId: SLICE_PRODUCT_03_ID,
    stationType: "FIELDWORKS_BENCH",
    recipeRank: 1,
    routineInputs: [
      {
        resourceId: SLICE_RESOURCE_B_ID,
        quantity: PROVISIONAL_SLICE_INPUT_QUANTITY,
      },
    ],
    specialInputs: [],
    craftDuration: balance03.craftDurationMs,
    unlockRequirements: [],
  },
  {
    recipeId: SLICE_RECIPE_04_ID,
    displayName: "Craft Slice Field Gear B",
    outputProductId: SLICE_PRODUCT_04_ID,
    stationType: "FIELDWORKS_BENCH",
    recipeRank: 1,
    routineInputs: [
      {
        resourceId: SLICE_RESOURCE_B_ID,
        quantity: PROVISIONAL_SLICE_INPUT_QUANTITY,
      },
    ],
    specialInputs: [],
    craftDuration: balance04.craftDurationMs,
    unlockRequirements: [],
  },
  {
    recipeId: SLICE_RECIPE_05_ID,
    displayName: "Craft Slice Elemental Craft A",
    outputProductId: SLICE_PRODUCT_05_ID,
    stationType: "FIELDWORKS_BENCH",
    recipeRank: 2,
    routineInputs: [
      {
        resourceId: SLICE_RESOURCE_B_ID,
        quantity: PROVISIONAL_SLICE_INPUT_QUANTITY,
      },
    ],
    specialInputs: [
      {
        componentId: SLICE_COMPONENT_A_ID,
        quantity: PROVISIONAL_SLICE_INPUT_QUANTITY,
      },
    ],
    craftDuration: balance05.craftDurationMs,
    unlockRequirements: [],
  },
];
