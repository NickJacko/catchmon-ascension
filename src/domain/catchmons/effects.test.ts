// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CapabilityId } from "../../core/ids/index.ts";
import { type CapabilityDefinition } from "./types.ts";
import {
  evaluateCraftSpeedEffect,
  evaluateDiscoveryBoostEffect,
  evaluateRecommendCompatibilityEffect,
} from "./effects.ts";

const craftSpeedCapability: CapabilityDefinition = {
  capabilityId: CapabilityId.from("example-craft-speed"),
  displayName: "Example Craft Speed",
  strengthClass: "CORE",
  effectFamily: "CRAFT_SPEED_TARGETED",
  validDomain: "WORKSHOP",
  target: "PROVISION_STATION",
  magnitudeConfigRef: "example-craft-speed-magnitude",
  presentationTextKey: "example.craft.speed",
};

const recommendCapability: CapabilityDefinition = {
  capabilityId: CapabilityId.from("example-recommend"),
  displayName: "Example Recommend",
  strengthClass: "CORE",
  effectFamily: "RECOMMEND_COMPATIBILITY",
  validDomain: "SHOP_FLOOR",
  target: "ELEMENTAL_CRAFT",
  magnitudeConfigRef: "example-recommend-magnitude",
  presentationTextKey: "example.recommend",
};

const discoveryCapability: CapabilityDefinition = {
  capabilityId: CapabilityId.from("example-discovery"),
  displayName: "Example Discovery",
  strengthClass: "CORE",
  effectFamily: "DISCOVERY_BOOST",
  validDomain: "EXPEDITION",
  target: "example-route",
  magnitudeConfigRef: "example-discovery-magnitude",
  presentationTextKey: "example.discovery",
};

describe("evaluateCraftSpeedEffect", () => {
  it("returns a duration multiplier when the capability targets the exact station archetype", () => {
    const effect = evaluateCraftSpeedEffect(
      craftSpeedCapability,
      "PROVISION_STATION",
      {
        "example-craft-speed-magnitude": 0.2,
      },
    );
    expect(effect).toEqual({
      capabilityId: craftSpeedCapability.capabilityId,
      durationMultiplier: 0.8,
    });
  });

  it("returns null for a different station archetype (Station Specialist targeting)", () => {
    const effect = evaluateCraftSpeedEffect(
      craftSpeedCapability,
      "FIELDWORKS_BENCH",
      {
        "example-craft-speed-magnitude": 0.2,
      },
    );
    expect(effect).toBeNull();
  });

  it("returns null for a non-craft-speed or non-Workshop capability", () => {
    expect(
      evaluateCraftSpeedEffect(recommendCapability, "PROVISION_STATION", {}),
    ).toBeNull();
  });

  it("returns null when no magnitude is configured", () => {
    expect(
      evaluateCraftSpeedEffect(craftSpeedCapability, "PROVISION_STATION", {}),
    ).toBeNull();
  });

  it("never accepts a >=100% or <=0% magnitude (base recipe must remain meaningfully unchanged, not free/negative)", () => {
    expect(
      evaluateCraftSpeedEffect(craftSpeedCapability, "PROVISION_STATION", {
        "example-craft-speed-magnitude": 1,
      }),
    ).toBeNull();
    expect(
      evaluateCraftSpeedEffect(craftSpeedCapability, "PROVISION_STATION", {
        "example-craft-speed-magnitude": 0,
      }),
    ).toBeNull();
  });
});

describe("evaluateRecommendCompatibilityEffect", () => {
  it("returns the extra compatible family from the capability's target", () => {
    const effect = evaluateRecommendCompatibilityEffect(recommendCapability, {
      "example-recommend-magnitude": 1,
    });
    expect(effect).toEqual({
      capabilityId: recommendCapability.capabilityId,
      extraCompatibleFamily: "ELEMENTAL_CRAFT",
    });
  });

  it("returns null for a non-matching effect family/domain", () => {
    expect(
      evaluateRecommendCompatibilityEffect(craftSpeedCapability, {}),
    ).toBeNull();
  });
});

describe("evaluateDiscoveryBoostEffect", () => {
  it("returns a boost magnitude for a matching Expedition capability", () => {
    const effect = evaluateDiscoveryBoostEffect(discoveryCapability, {
      "example-discovery-magnitude": 0.1,
    });
    expect(effect).toEqual({
      capabilityId: discoveryCapability.capabilityId,
      boostMagnitude: 0.1,
    });
  });

  it("returns null for a non-matching effect family/domain", () => {
    expect(evaluateDiscoveryBoostEffect(craftSpeedCapability, {})).toBeNull();
  });
});
