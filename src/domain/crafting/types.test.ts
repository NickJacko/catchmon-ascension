// @vitest-environment node
import { describe, expect, it } from "vitest";
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
} from "./types.ts";

describe("ProductDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with a routine-only recipe (Document 04 §21.1 shape)", () => {
    const example = {
      productId: ProductId.from("example-product"),
      displayName: "Example Product",
      family: "PROVISIONS",
      recipeRank: 1,
      stationType: "PROVISION_STATION",
      routineInputs: [ResourceId.from("example-resource")],
      specialInputs: [],
      craftDuration: 30_000,
      outputQuantity: 1,
      baseTransactionValue: 10,
      displayCategory: "example-category",
      demandTags: ["everyday"],
      masteryProfile: "example-mastery-profile",
      qualityEligible: true,
      unlockRequirements: [],
      catchmonHooks: [],
      visualAssetId: AssetId.from("example-product-visual"),
    } satisfies ProductDefinition;

    expect(example.family).toBe("PROVISIONS");
    expect(example.specialInputs).toEqual([]);
  });

  it("is satisfiable with an advanced recipe using a special component (Document 04 §21.2 shape)", () => {
    const example = {
      productId: ProductId.from("example-advanced-product"),
      displayName: "Example Advanced Product",
      family: "ELEMENTAL_CRAFT",
      subfamily: "example-subfamily",
      recipeRank: 4,
      stationType: "RESONANCE_LAB",
      routineInputs: [ResourceId.from("r1"), ResourceId.from("r2")],
      specialInputs: [ComponentId.from("example-component")],
      craftDuration: 120_000,
      outputQuantity: 1,
      baseTransactionValue: 80,
      displayCategory: "example-category",
      demandTags: ["specialized"],
      elementAffinity: "fire",
      masteryProfile: "example-mastery-profile",
      qualityEligible: true,
      unlockRequirements: [{ type: "SHOP_RANK", threshold: 5 }],
      catchmonHooks: [],
      visualAssetId: AssetId.from("example-advanced-visual"),
    } satisfies ProductDefinition;

    expect(example.specialInputs).toHaveLength(1);
  });
});

describe("RecipeDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable", () => {
    const example = {
      recipeId: RecipeId.from("example-recipe"),
      displayName: "Example Recipe",
      outputProductId: ProductId.from("example-product"),
      stationType: "PROVISION_STATION",
      recipeRank: 1,
      routineInputs: [
        { resourceId: ResourceId.from("example-resource"), quantity: 1 },
      ],
      specialInputs: [],
      craftDuration: 30_000,
      unlockRequirements: [],
    } satisfies RecipeDefinition;

    expect(example.stationType).toBe("PROVISION_STATION");
  });
});

describe("ResourceDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable", () => {
    const example = {
      resourceId: ResourceId.from("example-resource"),
      displayName: "Example Resource",
      visualAssetId: AssetId.from("example-resource-visual"),
      itemId: ItemId.from("example-item"),
    } satisfies ResourceDefinition;

    expect(example.resourceId).toBe("example-resource");
  });
});

describe("ComponentDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable as an item, not a currency (Document 04 §25)", () => {
    const example = {
      componentId: ComponentId.from("example-component"),
      displayName: "Example Component",
      craftedFromRecipeId: RecipeId.from("example-crafting-recipe"),
      visualAssetId: AssetId.from("example-component-visual"),
      itemId: ItemId.from("example-component-item"),
    } satisfies ComponentDefinition;

    expect(example.craftedFromRecipeId).toBe("example-crafting-recipe");
  });
});
