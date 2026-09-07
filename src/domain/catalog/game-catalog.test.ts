// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../../core/assertions/invariant.ts";
import { toCoins } from "../../core/math/index.ts";
import {
  AssetId,
  CapabilityId,
  CatchmonLineId,
  CatchmonSpeciesId,
  ComponentId,
  CustomerArchetypeId,
  InfrastructureId,
  ItemId,
  ProductId,
  RecipeId,
  RegionId,
  ResourceId,
  RouteId,
  UnlockRuleId,
} from "../../core/ids/index.ts";
import { createGameCatalog, type GameCatalogContent } from "./game-catalog.ts";

/**
 * A minimal, internally-consistent synthetic fixture — not canonical
 * content — exercising every cross-reference check `createGameCatalog`
 * performs.
 */
function buildValidContent(): GameCatalogContent {
  const assetId = AssetId.from("example-asset");
  const resourceId = ResourceId.from("example-resource");
  const componentId = ComponentId.from("example-component");
  const productId = ProductId.from("example-product");
  const recipeId = RecipeId.from("example-recipe");
  const capabilityId = CapabilityId.from("example-capability");
  const catchmonLineId = CatchmonLineId.from("example-line");
  const catchmonSpeciesId = CatchmonSpeciesId.from("example-species");
  const regionId = RegionId.from("example-region");
  const routeId = RouteId.from("example-route");
  const unlockRuleId = UnlockRuleId.from("example-unlock-rule");
  const customerArchetypeId = CustomerArchetypeId.from(
    "example-customer-archetype",
  );
  const infrastructureId = InfrastructureId.from("example-infrastructure");

  return {
    assets: [
      {
        assetId,
        category: "example",
        sourcePath: "example/source.png",
        runtimePath: "/assets/example.png",
        status: "PLACEHOLDER",
        version: 1,
        width: 1,
        height: 1,
        format: "png",
        hasAlpha: false,
        tags: [],
        preloadClass: "BOOT",
      },
    ],
    resources: [
      {
        resourceId,
        displayName: "Example Resource",
        visualAssetId: assetId,
        itemId: ItemId.from("example-resource-item"),
      },
    ],
    components: [
      {
        componentId,
        displayName: "Example Component",
        visualAssetId: assetId,
        itemId: ItemId.from("example-component-item"),
      },
    ],
    products: [
      {
        productId,
        displayName: "Example Product",
        family: "PROVISIONS",
        recipeRank: 1,
        stationType: "PROVISION_STATION",
        routineInputs: [resourceId],
        specialInputs: [componentId],
        craftDuration: 1000,
        outputQuantity: 1,
        baseTransactionValue: 1,
        displayCategory: "example",
        demandTags: [],
        masteryProfile: "example",
        qualityEligible: false,
        unlockRequirements: [],
        catchmonHooks: [],
        visualAssetId: assetId,
      },
    ],
    recipes: [
      {
        recipeId,
        displayName: "Example Recipe",
        outputProductId: productId,
        stationType: "PROVISION_STATION",
        recipeRank: 1,
        routineInputs: [{ resourceId, quantity: 1 }],
        specialInputs: [{ componentId, quantity: 1 }],
        craftDuration: 1000,
        unlockRequirements: [],
      },
    ],
    capabilities: [
      {
        capabilityId,
        displayName: "Example Capability",
        strengthClass: "CORE",
        effectFamily: "CRAFT_SPEED_TARGETED",
        validDomain: "WORKSHOP",
        target: "example",
        magnitudeConfigRef: "example",
        presentationTextKey: "example",
      },
    ],
    catchmonLines: [
      {
        catchmonLineId,
        displayName: "Example Line",
        primaryDomain: "WORKSHOP",
        elementId: "fire",
        homeRegionId: regionId,
        specializationIdentity: "example",
        synergyTags: [],
        speciesIds: [catchmonSpeciesId],
      },
    ],
    catchmonSpecies: [
      {
        catchmonSpeciesId,
        catchmonLineId,
        displayName: "Example Species",
        stageIndex: 0,
        rarity: "COMMON",
        elementId: "fire",
        capabilityIds: [capabilityId],
        portraitAssetId: assetId,
      },
    ],
    elements: [
      {
        elementId: "fire",
        displayName: "Fire",
        colorTokenRef: "--color-element-fire",
        iconAssetId: assetId,
        economicIdentityId: "example",
        resourceTendencies: [],
        craftingTendencies: [],
        commerceTendencies: [],
        expeditionTendencies: [],
        capabilityTendencies: [],
      },
    ],
    regions: [
      {
        regionId,
        displayName: "Example Region",
        elementId: "fire",
        progressionBand: "early",
        economicIdentityId: "example",
        resourceProfileId: "example",
        productEmphasis: [],
        customerDemandProfileId: "example",
        expeditionProfileId: "example",
        regionalHookId: "example",
        homeCatchmonLineIds: [catchmonLineId],
        secondaryCatchmonLineIds: [],
        routeIds: [routeId],
        recipeIds: [recipeId],
        unlockRuleId,
        visualThemeId: "example",
      },
    ],
    routes: [
      {
        routeId,
        displayName: "Example Route",
        regionId,
        expeditionIntent: "SUPPLY_RUN",
        durationBand: "short",
        accessRequirements: [],
        preferredCapabilities: [capabilityId],
        preferredElements: ["fire"],
        preferredSynergyTags: [],
        teamProfile: "example",
        preparationProfile: "example",
        guaranteedRewards: [],
        bonusRewardPools: [],
        specialComponentPool: [componentId],
        encounterPool: [catchmonSpeciesId],
        discoveryProfile: "example",
        protectionProfile: "example",
        unlockRequirements: [],
        visualEnvironmentId: assetId,
      },
    ],
    customerArchetypes: [
      {
        customerArchetypeId,
        displayName: "Example Customer Archetype",
        customerLayer: "WALK_IN",
        preferredFamilies: ["PROVISIONS"],
        secondaryFamilies: [],
        portraitAssetId: assetId,
      },
    ],
    infrastructure: [
      {
        infrastructureId,
        displayName: "Example Infrastructure",
        unlockRule: {
          unlockRuleId,
          displayName: "Example Unlock Rule",
          primaryCondition: { type: "SHOP_RANK", threshold: 1 },
        },
        coinCost: toCoins(100),
      },
    ],
    unlockRules: [
      {
        unlockRuleId,
        displayName: "Example Unlock Rule",
        primaryCondition: { type: "SHOP_RANK", threshold: 1 },
      },
    ],
  };
}

describe("createGameCatalog (happy path)", () => {
  it("builds a catalog from fully cross-referenced synthetic content", () => {
    const catalog = createGameCatalog(buildValidContent());
    expect(catalog.products.size).toBe(1);
    expect(
      catalog.regions.get(RegionId.from("example-region"))?.displayName,
    ).toBe("Example Region");
  });
});

describe("createGameCatalog (duplicate rejected)", () => {
  it("throws when two products share the same productId", () => {
    const content = buildValidContent();
    const duplicated = {
      ...content,
      products: [...content.products, content.products[0]!],
    };

    expect(() => createGameCatalog(duplicated)).toThrow(
      InvariantViolationError,
    );
  });
});

describe("createGameCatalog (unknown reference rejected)", () => {
  it("throws when a recipe references a product that does not exist", () => {
    const content = buildValidContent();
    const broken = {
      ...content,
      recipes: [
        {
          ...content.recipes[0]!,
          outputProductId: ProductId.from("does-not-exist"),
        },
      ],
    };

    expect(() => createGameCatalog(broken)).toThrow(InvariantViolationError);
  });

  it("throws when a region references a route that does not exist", () => {
    const content = buildValidContent();
    const broken = {
      ...content,
      regions: [
        { ...content.regions[0]!, routeIds: [RouteId.from("does-not-exist")] },
      ],
    };

    expect(() => createGameCatalog(broken)).toThrow(InvariantViolationError);
  });
});
