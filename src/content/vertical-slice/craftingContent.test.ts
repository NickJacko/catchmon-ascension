import { describe, expect, it } from "vitest";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  PLAYABLE_PRODUCT_IDS,
  PLAYABLE_STATION_IDS,
} from "./verticalSliceManifest.ts";
import { VERTICAL_SLICE_STATION_ARCHETYPES } from "./stations.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "./catalogContent.ts";
import { SLICE_PRODUCTS, SLICE_RECIPES } from "./craftingContent.ts";

describe("VERTICAL_SLICE_CATALOG_CONTENT (Document 15 Task 03.3)", () => {
  it("builds a valid GameCatalog with no dangling cross-references", () => {
    expect(() =>
      createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT),
    ).not.toThrow();
  });

  it("contains exactly 4 routine materials (2 Vulkankrater + Ozean's Reef Kelp/Cleansing Brine, Ozean Batch A)", () => {
    expect(VERTICAL_SLICE_CATALOG_CONTENT.resources).toHaveLength(4);
  });

  it("contains exactly 2 special components (Vulkankrater's + Ozean's Luminous Pearl, Ozean Batch A)", () => {
    expect(VERTICAL_SLICE_CATALOG_CONTENT.components).toHaveLength(2);
  });

  it("contains exactly 5 products and 5 recipes", () => {
    expect(SLICE_PRODUCTS).toHaveLength(5);
    expect(SLICE_RECIPES).toHaveLength(5);
  });

  it("every product's productId matches the manifest's PLAYABLE_PRODUCT_IDS exactly", () => {
    const productIds = SLICE_PRODUCTS.map((p) => p.productId);
    expect(new Set(productIds)).toEqual(new Set(PLAYABLE_PRODUCT_IDS));
  });

  it("every recipe outputs a product that exists in SLICE_PRODUCTS", () => {
    const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
    for (const recipe of SLICE_RECIPES) {
      expect(catalog.products.get(recipe.outputProductId)).toBeDefined();
    }
  });

  it("every recipe/product's stationType is one of the 2 reserved slice stations' archetypes", () => {
    const reservedArchetypes = new Set(
      PLAYABLE_STATION_IDS.map((id) => VERTICAL_SLICE_STATION_ARCHETYPES[id]),
    );
    for (const recipe of SLICE_RECIPES) {
      expect(reservedArchetypes.has(recipe.stationType)).toBe(true);
    }
  });

  it("includes at least one dual-use product (playerUse set) — Document 04 §10/§12", () => {
    expect(SLICE_PRODUCTS.some((p) => p.playerUse !== undefined)).toBe(true);
  });

  it("includes at least one advanced recipe using the special component — Document 04 §21.2", () => {
    expect(SLICE_RECIPES.some((r) => r.specialInputs.length > 0)).toBe(true);
  });

  it("no product/recipe claims crafting never fails or destroys inputs beyond reservation — no failure-chance field exists on the type", () => {
    for (const product of SLICE_PRODUCTS) {
      expect(Object.keys(product)).not.toContain("failureChance");
      expect(Object.keys(product)).not.toContain("destructionChance");
    }
  });
});
