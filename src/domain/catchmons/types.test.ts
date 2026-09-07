// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  AssetId,
  CapabilityId,
  CatchmonLineId,
  CatchmonSpeciesId,
} from "../../core/ids/index.ts";
import {
  type CapabilityDefinition,
  type CatchmonSpeciesDefinition,
  type EvolutionLineDefinition,
} from "./types.ts";

describe("CapabilityDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable for a Core capability", () => {
    const example = {
      capabilityId: CapabilityId.from("example-capability"),
      displayName: "Example Capability",
      strengthClass: "CORE",
      effectFamily: "CRAFT_SPEED_TARGETED",
      validDomain: "WORKSHOP",
      target: "example-target",
      magnitudeConfigRef: "example-magnitude-config",
      presentationTextKey: "example.capability.text",
    } satisfies CapabilityDefinition;

    expect(example.strengthClass).toBe("CORE");
  });

  it("is satisfiable for a Signature capability with a condition", () => {
    const example = {
      capabilityId: CapabilityId.from("example-signature-capability"),
      displayName: "Example Signature Capability",
      strengthClass: "SIGNATURE",
      effectFamily: "RECIPE_UNLOCK",
      validDomain: "WORKSHOP",
      target: "example-target",
      condition: "example-condition",
      magnitudeConfigRef: "example-magnitude-config",
      presentationTextKey: "example.signature.text",
    } satisfies CapabilityDefinition;

    expect(example.condition).toBe("example-condition");
  });
});

describe("EvolutionLineDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with only a primary domain (no secondary)", () => {
    const example = {
      catchmonLineId: CatchmonLineId.from("example-line"),
      displayName: "Example Line",
      primaryDomain: "SUPPLY",
      elementId: "earth",
      specializationIdentity: "example-specialization",
      synergyTags: ["example-tag"],
      speciesIds: [CatchmonSpeciesId.from("example-species-stage-1")],
    } satisfies EvolutionLineDefinition;

    // `secondaryDomain` is intentionally omitted above — `satisfies`
    // proves a line needs only a primary domain (Document 06 §11).
    expect(example.primaryDomain).toBe("SUPPLY");
  });
});

describe("CatchmonSpeciesDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable for a base-stage species with a further evolution", () => {
    const example = {
      catchmonSpeciesId: CatchmonSpeciesId.from("example-species-stage-1"),
      catchmonLineId: CatchmonLineId.from("example-line"),
      displayName: "Example Species (Stage 1)",
      stageIndex: 0,
      rarity: "COMMON",
      elementId: "earth",
      capabilityIds: [CapabilityId.from("example-capability")],
      evolvesToSpeciesId: CatchmonSpeciesId.from("example-species-stage-2"),
      portraitAssetId: AssetId.from("example-species-portrait"),
    } satisfies CatchmonSpeciesDefinition;

    expect(example.stageIndex).toBe(0);
    expect(example.evolvesToSpeciesId).toBe("example-species-stage-2");
  });
});
