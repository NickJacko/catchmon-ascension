/**
 * Design owner: Phase 10 Asset Integration — the one centralized place
 * every real Vertical Slice production `AssetId`/`AssetMetadata` is
 * registered (CLAUDE.md §1 "Keep canonical mapping centralized"). No
 * presentation component or Pixi entity hardcodes a
 * `reference/design-production/` or `/assets/vertical-slice/` path
 * directly — everything goes through an `AssetId` resolved from here.
 *
 * Provenance chain per asset (see `reference/design-production/
 * normalized-v1/FINAL_ASSET_INTAKE_REPORT.md` for the full intake):
 * `generated-v1` (art-production source master, untouched) ->
 * `normalized-v1` (runtime-ready, dimension/canvas-normalized copy,
 * still source-controlled provenance, untouched by the app) -> this
 * file's `sourcePath` (points at the normalized-v1 file that is the
 * *direct* input) -> `runtimePath` (the same file, copied byte-for-byte
 * into `public/assets/vertical-slice/`, served by Vite's standard
 * `public/` convention — no `import.meta.glob`, so none of this adds a
 * single byte to the JS bundle; the browser only fetches a file the
 * moment a real `<img>`/`Sprite` actually requests it).
 *
 * Pivots are the exact per-state values computed in the intake report's
 * "Proposed spatial metadata" section (an artwork-derived alpha-weighted
 * centroid of each object's own shadow layer) — not re-derived here, not
 * inferred from transparent canvas bounds at runtime.
 *
 * The Shop Key Environment Golden Sample (2048x1536) is deliberately
 * NOT registered here: it is a style-lock reference image only, never
 * resolved or rendered by any runtime code (Phase 10 §3's explicit
 * instruction) — registering an `AssetId` nothing ever queries would be
 * dead content, not provenance.
 */
import { AssetId } from "../../core/ids/index.ts";
import {
  type AssetMetadata,
  type AssetPivot,
} from "../../domain/assets/index.ts";

const NORMALIZED_ROOT = "reference/design-production/normalized-v1";
const RUNTIME_ROOT = "/assets/vertical-slice";

function spatialAsset(
  assetId: AssetId,
  category: string,
  relPath: string,
  tags: readonly string[],
  pivot?: AssetPivot,
): AssetMetadata {
  return {
    assetId,
    category,
    sourcePath: `${NORMALIZED_ROOT}/${relPath}`,
    runtimePath: `${RUNTIME_ROOT}/${relPath}`,
    status: "FINAL",
    version: 1,
    width: 1024,
    height: 1024,
    format: "png",
    hasAlpha: true,
    tags,
    preloadClass: "CURRENT_CONTEXT",
    ...(pivot ? { pivot } : {}),
  };
}

// ---- Environment (Task 09.3 layers, now real art) ----

export const ENV_SHOP_KEY_WALL_ASSET_ID: AssetId =
  AssetId.from("env-shop-key-wall");
export const ENV_SHOP_KEY_FLOOR_ASSET_ID: AssetId =
  AssetId.from("env-shop-key-floor");

export const ENV_SHOP_KEY_WALL_ASSET: AssetMetadata = {
  assetId: ENV_SHOP_KEY_WALL_ASSET_ID,
  category: "environment",
  sourcePath: `${NORMALIZED_ROOT}/environments/shop-environment_wall_2400x1600.png`,
  runtimePath: `${RUNTIME_ROOT}/environments/shop-environment_wall_2400x1600.png`,
  status: "FINAL",
  version: 1,
  width: 2400,
  height: 1600,
  format: "png",
  hasAlpha: false,
  tags: ["environment", "wall", "shop-key"],
  preloadClass: "CURRENT_CONTEXT",
};

export const ENV_SHOP_KEY_FLOOR_ASSET: AssetMetadata = {
  assetId: ENV_SHOP_KEY_FLOOR_ASSET_ID,
  category: "environment",
  sourcePath: `${NORMALIZED_ROOT}/environments/shop-environment_floor_2400x1600.png`,
  runtimePath: `${RUNTIME_ROOT}/environments/shop-environment_floor_2400x1600.png`,
  status: "FINAL",
  version: 1,
  width: 2400,
  height: 1600,
  format: "png",
  hasAlpha: false,
  tags: ["environment", "floor", "shop-key"],
  preloadClass: "CURRENT_CONTEXT",
};

// ---- Stations (Task 09.4) ----

export const STATION_PROVISION_IDLE_BASE_ID = AssetId.from(
  "station-provision-station-idle-base",
);
export const STATION_PROVISION_IDLE_SHADOW_ID = AssetId.from(
  "station-provision-station-idle-shadow",
);
export const STATION_PROVISION_ACTIVE_BASE_ID = AssetId.from(
  "station-provision-station-active-base",
);
export const STATION_PROVISION_ACTIVE_SHADOW_ID = AssetId.from(
  "station-provision-station-active-shadow",
);
export const STATION_FIELDWORKS_IDLE_BASE_ID = AssetId.from(
  "station-fieldworks-bench-idle-base",
);
export const STATION_FIELDWORKS_IDLE_SHADOW_ID = AssetId.from(
  "station-fieldworks-bench-idle-shadow",
);
export const STATION_FIELDWORKS_ACTIVE_BASE_ID = AssetId.from(
  "station-fieldworks-bench-active-base",
);
export const STATION_FIELDWORKS_ACTIVE_SHADOW_ID = AssetId.from(
  "station-fieldworks-bench-active-shadow",
);

const PROVISION_IDLE_PIVOT: AssetPivot = { x: 0.497, y: 0.699 };
const PROVISION_ACTIVE_PIVOT: AssetPivot = { x: 0.493, y: 0.758 };
const FIELDWORKS_IDLE_PIVOT: AssetPivot = { x: 0.525, y: 0.733 };
const FIELDWORKS_ACTIVE_PIVOT: AssetPivot = { x: 0.489, y: 0.709 };

export const STATION_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  spatialAsset(
    STATION_PROVISION_IDLE_BASE_ID,
    "station",
    "stations/provision-station_idle_base_1024.png",
    ["station", "provision-station", "idle", "base"],
    PROVISION_IDLE_PIVOT,
  ),
  spatialAsset(
    STATION_PROVISION_IDLE_SHADOW_ID,
    "station-shadow",
    "stations/provision-station_idle_shadow_1024.png",
    ["station", "provision-station", "idle", "shadow"],
  ),
  spatialAsset(
    STATION_PROVISION_ACTIVE_BASE_ID,
    "station",
    "stations/provision-station_active_base_1024.png",
    ["station", "provision-station", "active", "base"],
    PROVISION_ACTIVE_PIVOT,
  ),
  spatialAsset(
    STATION_PROVISION_ACTIVE_SHADOW_ID,
    "station-shadow",
    "stations/provision-station_active_shadow_1024.png",
    ["station", "provision-station", "active", "shadow"],
  ),
  spatialAsset(
    STATION_FIELDWORKS_IDLE_BASE_ID,
    "station",
    "stations/fieldworks-bench_idle_base_1024.png",
    ["station", "fieldworks-bench", "idle", "base"],
    FIELDWORKS_IDLE_PIVOT,
  ),
  spatialAsset(
    STATION_FIELDWORKS_IDLE_SHADOW_ID,
    "station-shadow",
    "stations/fieldworks-bench_idle_shadow_1024.png",
    ["station", "fieldworks-bench", "idle", "shadow"],
  ),
  spatialAsset(
    STATION_FIELDWORKS_ACTIVE_BASE_ID,
    "station",
    "stations/fieldworks-bench_active_base_1024.png",
    ["station", "fieldworks-bench", "active", "base"],
    FIELDWORKS_ACTIVE_PIVOT,
  ),
  spatialAsset(
    STATION_FIELDWORKS_ACTIVE_SHADOW_ID,
    "station-shadow",
    "stations/fieldworks-bench_active_shadow_1024.png",
    ["station", "fieldworks-bench", "active", "shadow"],
  ),
];

/** Per-station, per-state AssetId lookup — the one place `scene-view-model.ts` looks up which AssetIds belong to which station archetype/state. */
export interface StationStateAssetIds {
  readonly base: AssetId;
  readonly shadow: AssetId;
}
export interface StationAssetIds {
  readonly idle: StationStateAssetIds;
  readonly active: StationStateAssetIds;
}

export const STATION_ASSET_IDS_BY_ARCHETYPE: Readonly<
  Record<"PROVISION_STATION" | "FIELDWORKS_BENCH", StationAssetIds>
> = {
  PROVISION_STATION: {
    idle: {
      base: STATION_PROVISION_IDLE_BASE_ID,
      shadow: STATION_PROVISION_IDLE_SHADOW_ID,
    },
    active: {
      base: STATION_PROVISION_ACTIVE_BASE_ID,
      shadow: STATION_PROVISION_ACTIVE_SHADOW_ID,
    },
  },
  FIELDWORKS_BENCH: {
    idle: {
      base: STATION_FIELDWORKS_IDLE_BASE_ID,
      shadow: STATION_FIELDWORKS_IDLE_SHADOW_ID,
    },
    active: {
      base: STATION_FIELDWORKS_ACTIVE_BASE_ID,
      shadow: STATION_FIELDWORKS_ACTIVE_SHADOW_ID,
    },
  },
};

// ---- Display Furniture (Task 09.5) ----

export const DISPLAY_FURNITURE_BASE_ID = AssetId.from(
  "display-slot-furniture-base",
);
export const DISPLAY_FURNITURE_SHADOW_ID = AssetId.from(
  "display-slot-furniture-shadow",
);

export const DISPLAY_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  spatialAsset(
    DISPLAY_FURNITURE_BASE_ID,
    "display",
    "displays/display-furniture_base_1024.png",
    ["display", "furniture", "base"],
    { x: 0.518, y: 0.701 },
  ),
  spatialAsset(
    DISPLAY_FURNITURE_SHADOW_ID,
    "display-shadow",
    "displays/display-furniture_shadow_1024.png",
    ["display", "furniture", "shadow"],
  ),
];

// ---- Expedition Hub (Task 09.8) ----

export const EXPEDITION_HUB_BASE_ASSET_ID = AssetId.from(
  "infrastructure-expedition-hub-base",
);
export const EXPEDITION_HUB_SHADOW_ASSET_ID = AssetId.from(
  "infrastructure-expedition-hub-shadow",
);

export const EXPEDITION_HUB_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  spatialAsset(
    EXPEDITION_HUB_BASE_ASSET_ID,
    "infrastructure",
    "infrastructure/expedition-hub_base_1024.png",
    ["infrastructure", "expedition-hub", "base"],
    { x: 0.499, y: 0.668 },
  ),
  spatialAsset(
    EXPEDITION_HUB_SHADOW_ASSET_ID,
    "infrastructure-shadow",
    "infrastructure/expedition-hub_shadow_1024.png",
    ["infrastructure", "expedition-hub", "shadow"],
  ),
];

// ---- Products (Task 10.7) — real art replacing the shared placeholder ----

export const PRODUCT_01_BASE_ASSET_ID = AssetId.from(
  "product-slice-product-01-base",
);
export const PRODUCT_01_SHADOW_ASSET_ID = AssetId.from(
  "product-slice-product-01-shadow",
);
export const PRODUCT_02_BASE_ASSET_ID = AssetId.from(
  "product-slice-product-02-base",
);
export const PRODUCT_02_SHADOW_ASSET_ID = AssetId.from(
  "product-slice-product-02-shadow",
);
export const PRODUCT_03_BASE_ASSET_ID = AssetId.from(
  "product-slice-product-03-base",
);
export const PRODUCT_03_SHADOW_ASSET_ID = AssetId.from(
  "product-slice-product-03-shadow",
);
export const PRODUCT_04_BASE_ASSET_ID = AssetId.from(
  "product-slice-product-04-base",
);
export const PRODUCT_04_SHADOW_ASSET_ID = AssetId.from(
  "product-slice-product-04-shadow",
);
export const PRODUCT_05_BASE_ASSET_ID = AssetId.from(
  "product-slice-product-05-base",
);
export const PRODUCT_05_SHADOW_ASSET_ID = AssetId.from(
  "product-slice-product-05-shadow",
);

/** `visualAssetId` on `ProductDefinition` takes exactly one AssetId — the base render (Product Card art). The shadow is a scene-presentation detail, not part of the DOM icon. */
export const PRODUCT_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  spatialAsset(
    PRODUCT_01_BASE_ASSET_ID,
    "product",
    "products/product-01_base_1024.png",
    ["product", "slice-product-01", "base"],
  ),
  spatialAsset(
    PRODUCT_01_SHADOW_ASSET_ID,
    "product-shadow",
    "products/product-01_shadow_1024.png",
    ["product", "slice-product-01", "shadow"],
  ),
  spatialAsset(
    PRODUCT_02_BASE_ASSET_ID,
    "product",
    "products/product-02_base_1024.png",
    ["product", "slice-product-02", "base"],
  ),
  spatialAsset(
    PRODUCT_02_SHADOW_ASSET_ID,
    "product-shadow",
    "products/product-02_shadow_1024.png",
    ["product", "slice-product-02", "shadow"],
  ),
  spatialAsset(
    PRODUCT_03_BASE_ASSET_ID,
    "product",
    "products/product-03_base_1024.png",
    ["product", "slice-product-03", "field-gear", "base"],
  ),
  spatialAsset(
    PRODUCT_03_SHADOW_ASSET_ID,
    "product-shadow",
    "products/product-03_shadow_1024.png",
    ["product", "slice-product-03", "shadow"],
  ),
  spatialAsset(
    PRODUCT_04_BASE_ASSET_ID,
    "product",
    "products/product-04_base_1024.png",
    ["product", "slice-product-04", "capture-aid", "base"],
  ),
  spatialAsset(
    PRODUCT_04_SHADOW_ASSET_ID,
    "product-shadow",
    "products/product-04_shadow_1024.png",
    ["product", "slice-product-04", "shadow"],
  ),
  spatialAsset(
    PRODUCT_05_BASE_ASSET_ID,
    "product",
    "products/product-05_base_1024.png",
    ["product", "slice-product-05", "base"],
  ),
  spatialAsset(
    PRODUCT_05_SHADOW_ASSET_ID,
    "product-shadow",
    "products/product-05_shadow_1024.png",
    ["product", "slice-product-05", "shadow"],
  ),
];

export const PRODUCT_SHADOW_ASSET_ID_BY_BASE: ReadonlyMap<AssetId, AssetId> =
  new Map([
    [PRODUCT_01_BASE_ASSET_ID, PRODUCT_01_SHADOW_ASSET_ID],
    [PRODUCT_02_BASE_ASSET_ID, PRODUCT_02_SHADOW_ASSET_ID],
    [PRODUCT_03_BASE_ASSET_ID, PRODUCT_03_SHADOW_ASSET_ID],
    [PRODUCT_04_BASE_ASSET_ID, PRODUCT_04_SHADOW_ASSET_ID],
    [PRODUCT_05_BASE_ASSET_ID, PRODUCT_05_SHADOW_ASSET_ID],
  ]);

// ---- Routine materials + Special component (Task 10.7) ----
// PROVISIONAL VISUAL MAPPING ONLY (producer decision, asset-normalization
// pass) — routine-material-01 <-> Resource A, -02 <-> Resource B. This is
// not a canonical rename: the domain resources keep their existing IDs
// and display names ("Slice Routine Material A/B"), never "Wood"/"Crystal".

export const MATERIAL_RESOURCE_A_BASE_ASSET_ID = AssetId.from(
  "material-slice-resource-a-base",
);
export const MATERIAL_RESOURCE_A_SHADOW_ASSET_ID = AssetId.from(
  "material-slice-resource-a-shadow",
);
export const MATERIAL_RESOURCE_B_BASE_ASSET_ID = AssetId.from(
  "material-slice-resource-b-base",
);
export const MATERIAL_RESOURCE_B_SHADOW_ASSET_ID = AssetId.from(
  "material-slice-resource-b-shadow",
);
export const COMPONENT_A_BASE_ASSET_ID = AssetId.from(
  "component-slice-component-a-base",
);
export const COMPONENT_A_SHADOW_ASSET_ID = AssetId.from(
  "component-slice-component-a-shadow",
);

export const MATERIAL_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  spatialAsset(
    MATERIAL_RESOURCE_A_BASE_ASSET_ID,
    "resource",
    "materials/routine-material-01_base_1024.png",
    ["material", "resource-a", "base"],
  ),
  spatialAsset(
    MATERIAL_RESOURCE_A_SHADOW_ASSET_ID,
    "resource-shadow",
    "materials/routine-material-01_shadow_1024.png",
    ["material", "resource-a", "shadow"],
  ),
  spatialAsset(
    MATERIAL_RESOURCE_B_BASE_ASSET_ID,
    "resource",
    "materials/routine-material-02_base_1024.png",
    ["material", "resource-b", "base"],
  ),
  spatialAsset(
    MATERIAL_RESOURCE_B_SHADOW_ASSET_ID,
    "resource-shadow",
    "materials/routine-material-02_shadow_1024.png",
    ["material", "resource-b", "shadow"],
  ),
];

export const COMPONENT_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  spatialAsset(
    COMPONENT_A_BASE_ASSET_ID,
    "component",
    "components/special-component-01_base_1024.png",
    ["component", "special-component-a", "base"],
  ),
  spatialAsset(
    COMPONENT_A_SHADOW_ASSET_ID,
    "component-shadow",
    "components/special-component-01_shadow_1024.png",
    ["component", "special-component-a", "shadow"],
  ),
];

// ---- Customers (Task 10.9 / Phase 9 Task 09.6) — full-body, no separate shadow (producer decision: code-driven Pixi shadow instead) ----

export const CUSTOMER_EVERYDAY_BUYER_ASSET_ID = AssetId.from(
  "customer-portrait-everyday-buyer",
);
export const CUSTOMER_EXPLORER_BUYER_ASSET_ID = AssetId.from(
  "customer-portrait-explorer-buyer",
);
export const CUSTOMER_SPECIAL_VISITOR_ASSET_ID = AssetId.from(
  "customer-portrait-special-visitor",
);

function customerAsset(
  assetId: AssetId,
  relPath: string,
  tags: readonly string[],
): AssetMetadata {
  return {
    assetId,
    category: "customer-portrait",
    sourcePath: `${NORMALIZED_ROOT}/${relPath}`,
    runtimePath: `${RUNTIME_ROOT}/${relPath}`,
    status: "FINAL",
    version: 1,
    width: 1024,
    height: 1280,
    format: "png",
    hasAlpha: true,
    tags,
    preloadClass: "CURRENT_CONTEXT",
  };
}

export const CUSTOMER_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  customerAsset(
    CUSTOMER_EVERYDAY_BUYER_ASSET_ID,
    "customers/customer-everyday-buyer_1024x1280.png",
    ["customer", "everyday-buyer"],
  ),
  customerAsset(
    CUSTOMER_EXPLORER_BUYER_ASSET_ID,
    "customers/customer-explorer-buyer_1024x1280.png",
    ["customer", "explorer-buyer"],
  ),
  customerAsset(
    CUSTOMER_SPECIAL_VISITOR_ASSET_ID,
    "customers/customer-special-visitor_1024x1280.png",
    ["customer", "special-visitor"],
  ),
];

// ---- Aggregate ----

export const VERTICAL_SLICE_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  ENV_SHOP_KEY_WALL_ASSET,
  ENV_SHOP_KEY_FLOOR_ASSET,
  ...STATION_PRODUCTION_ASSETS,
  ...DISPLAY_PRODUCTION_ASSETS,
  ...EXPEDITION_HUB_PRODUCTION_ASSETS,
  ...PRODUCT_PRODUCTION_ASSETS,
  ...MATERIAL_PRODUCTION_ASSETS,
  ...COMPONENT_PRODUCTION_ASSETS,
  ...CUSTOMER_PRODUCTION_ASSETS,
];
