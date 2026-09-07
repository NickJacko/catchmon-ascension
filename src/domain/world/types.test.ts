// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  AssetId,
  CatchmonLineId,
  RecipeId,
  RegionId,
  RouteId,
  UnlockRuleId,
} from "../../core/ids/index.ts";
import {
  ELEMENT_IDS,
  type ElementDefinition,
  type RegionDefinition,
  type RouteDefinition,
} from "./types.ts";

describe("ElementId (canonical 17-element set)", () => {
  it("contains exactly the 17 canonical elements from CLAUDE.md §9, no Bug", () => {
    expect(ELEMENT_IDS).toHaveLength(17);
    expect(ELEMENT_IDS).not.toContain("bug");
    expect(new Set(ELEMENT_IDS).size).toBe(17); // no duplicates
  });
});

describe("ElementDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable", () => {
    const example = {
      elementId: "fire",
      displayName: "Fire",
      colorTokenRef: "--color-element-fire",
      iconAssetId: AssetId.from("element-icon-fire"),
      economicIdentityId: "example-economic-identity",
      resourceTendencies: ["heat-sources"],
      craftingTendencies: ["elemental-craft"],
      commerceTendencies: [],
      expeditionTendencies: [],
      capabilityTendencies: [],
    } satisfies ElementDefinition;

    expect(example.elementId).toBe("fire");
  });
});

describe("RegionDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with one home element and empty collections", () => {
    const example = {
      regionId: RegionId.from("example-region"),
      displayName: "Example Region",
      elementId: "water",
      progressionBand: "early",
      economicIdentityId: "example-economic-identity",
      resourceProfileId: "example-resource-profile",
      productEmphasis: [],
      customerDemandProfileId: "example-demand-profile",
      expeditionProfileId: "example-expedition-profile",
      regionalHookId: "example-hook",
      homeCatchmonLineIds: [CatchmonLineId.from("example-line")],
      secondaryCatchmonLineIds: [],
      routeIds: [RouteId.from("example-route")],
      recipeIds: [RecipeId.from("example-recipe")],
      unlockRuleId: UnlockRuleId.from("example-unlock-rule"),
      visualThemeId: "example-visual-theme",
    } satisfies RegionDefinition;

    expect(example.elementId).toBe("water");
    expect(example.recipeIds).toHaveLength(1);
  });
});

describe("RouteDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with a soft-preference-only route (no access requirements)", () => {
    const example = {
      routeId: RouteId.from("example-route"),
      displayName: "Example Route",
      regionId: RegionId.from("example-region"),
      expeditionIntent: "SUPPLY_RUN",
      durationBand: "short",
      accessRequirements: [],
      preferredCapabilities: [],
      preferredElements: ["water"],
      preferredSynergyTags: ["scout"],
      teamProfile: "example-team-profile",
      preparationProfile: "example-preparation-profile",
      guaranteedRewards: [],
      bonusRewardPools: [],
      specialComponentPool: [],
      encounterPool: [],
      discoveryProfile: "example-discovery-profile",
      protectionProfile: "example-protection-profile",
      unlockRequirements: [{ type: "REGION_STATE", state: "unlocked" }],
      visualEnvironmentId: AssetId.from("example-route-environment"),
    } satisfies RouteDefinition;

    expect(example.accessRequirements).toEqual([]); // no hard gate: soft preferences only
    expect(example.unlockRequirements[0]?.type).toBe("REGION_STATE");
  });
});
