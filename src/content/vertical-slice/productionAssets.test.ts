import { describe, expect, it } from "vitest";
import { validateAssetPivots } from "../../domain/assets/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "./catalogContent.ts";
import {
  COMPONENT_A_BASE_ASSET_ID,
  CUSTOMER_EVERYDAY_BUYER_ASSET_ID,
  CUSTOMER_EXPLORER_BUYER_ASSET_ID,
  CUSTOMER_SPECIAL_VISITOR_ASSET_ID,
  MATERIAL_RESOURCE_A_BASE_ASSET_ID,
  MATERIAL_RESOURCE_B_BASE_ASSET_ID,
  PRODUCT_01_BASE_ASSET_ID,
  PRODUCT_02_BASE_ASSET_ID,
  PRODUCT_03_BASE_ASSET_ID,
  PRODUCT_04_BASE_ASSET_ID,
  PRODUCT_05_BASE_ASSET_ID,
  VERTICAL_SLICE_PRODUCTION_ASSETS,
} from "./productionAssets.ts";
import {
  SLICE_COMPONENT_A_ID,
  SLICE_COMPONENTS,
  SLICE_PRODUCTS,
  SLICE_RESOURCE_A_ID,
  SLICE_RESOURCE_B_ID,
  SLICE_RESOURCES,
} from "./craftingContent.ts";
import { SLICE_CUSTOMER_ARCHETYPES } from "./customerContent.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);

describe("VERTICAL_SLICE_PRODUCTION_ASSETS (Phase 10 Task 10.1/10.2)", () => {
  it("registers every production asset as a real, resolvable FINAL asset with no duplicate AssetIds", () => {
    // createGameCatalog already throws on a duplicate AssetId (Registry
    // construction) — building it above is itself the duplicate-id proof.
    // This test asserts the complementary half: every one of these 33
    // records really did make it into the catalog's asset registry.
    for (const asset of VERTICAL_SLICE_PRODUCTION_ASSETS) {
      const registered = catalog.assets.get(asset.assetId);
      expect(registered).toBeDefined();
      expect(registered?.status).toBe("FINAL");
    }
  });

  it("has no invalid pivot/footprint metadata (Phase 10 §2: fail early on bad normalized spatial data)", () => {
    expect(validateAssetPivots(VERTICAL_SLICE_PRODUCTION_ASSETS)).toEqual([]);
  });

  it("gives every spatial station/display/hub base layer a real pivot", () => {
    const spatialBaseIds = new Set([
      "station-provision-station-idle-base",
      "station-provision-station-active-base",
      "station-fieldworks-bench-idle-base",
      "station-fieldworks-bench-active-base",
      "display-slot-furniture-base",
      "infrastructure-expedition-hub-base",
    ]);
    for (const asset of VERTICAL_SLICE_PRODUCTION_ASSETS) {
      if (spatialBaseIds.has(asset.assetId)) {
        expect(asset.pivot).toBeDefined();
      }
    }
  });
});

describe("Phase 10 content mapping — products/materials/components/customers no longer use the shared placeholder", () => {
  it("maps all 5 slice products to their own real product AssetId", () => {
    const expected: Record<string, string> = {
      "slice-product-01": PRODUCT_01_BASE_ASSET_ID,
      "slice-product-02": PRODUCT_02_BASE_ASSET_ID,
      "slice-product-03": PRODUCT_03_BASE_ASSET_ID,
      "slice-product-04": PRODUCT_04_BASE_ASSET_ID,
      "slice-product-05": PRODUCT_05_BASE_ASSET_ID,
    };
    for (const product of SLICE_PRODUCTS) {
      expect(product.visualAssetId).toBe(expected[product.productId]);
      expect(catalog.assets.get(product.visualAssetId)?.status).toBe("FINAL");
    }
  });

  it("maps routine-material-01/02 to Resource A/B respectively (provisional visual mapping)", () => {
    const byId = new Map(SLICE_RESOURCES.map((r) => [r.resourceId, r]));
    expect(byId.get(SLICE_RESOURCE_A_ID)?.visualAssetId).toBe(
      MATERIAL_RESOURCE_A_BASE_ASSET_ID,
    );
    expect(byId.get(SLICE_RESOURCE_B_ID)?.visualAssetId).toBe(
      MATERIAL_RESOURCE_B_BASE_ASSET_ID,
    );
  });

  it("maps the special component to a real component AssetId", () => {
    const component = SLICE_COMPONENTS.find(
      (c) => c.componentId === SLICE_COMPONENT_A_ID,
    );
    expect(component?.visualAssetId).toBe(COMPONENT_A_BASE_ASSET_ID);
    expect(catalog.assets.get(component!.visualAssetId)?.status).toBe("FINAL");
  });

  it("maps all 3 customer archetypes to their own real portrait AssetId", () => {
    const byDisplayName = new Map(
      SLICE_CUSTOMER_ARCHETYPES.map((a) => [a.displayName, a]),
    );
    expect(byDisplayName.get("Everyday Buyer")?.portraitAssetId).toBe(
      CUSTOMER_EVERYDAY_BUYER_ASSET_ID,
    );
    expect(byDisplayName.get("Explorer Buyer")?.portraitAssetId).toBe(
      CUSTOMER_EXPLORER_BUYER_ASSET_ID,
    );
    for (const archetype of SLICE_CUSTOMER_ARCHETYPES) {
      expect(catalog.assets.get(archetype.portraitAssetId)?.status).toBe(
        "FINAL",
      );
    }
    expect(
      byDisplayName.get("Special Visitor (Placeholder)")?.portraitAssetId,
    ).toBe(CUSTOMER_SPECIAL_VISITOR_ASSET_ID);
  });
});
