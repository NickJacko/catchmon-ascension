// @vitest-environment node
import { describe, expect, it } from "vitest";
import { AssetId, CustomerArchetypeId } from "../../core/ids/index.ts";
import { type CustomerArchetypeDefinition } from "./types.ts";

describe("CustomerArchetypeDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with a Walk-In shape (Document 05 §5)", () => {
    const example = {
      customerArchetypeId: CustomerArchetypeId.from(
        "example-customer-archetype",
      ),
      displayName: "Example Customer Archetype",
      customerLayer: "WALK_IN",
      preferredFamilies: ["PROVISIONS"],
      secondaryFamilies: ["CARE_AND_COMFORT"],
      portraitAssetId: AssetId.from("example-customer-portrait"),
    } satisfies CustomerArchetypeDefinition;

    expect(example.customerArchetypeId).toBe("example-customer-archetype");
  });

  it("is satisfiable with an optional qualityPreference (Document 05 §35)", () => {
    const example = {
      customerArchetypeId: CustomerArchetypeId.from("example-special-visitor"),
      displayName: "Example Special Visitor",
      customerLayer: "SPECIAL_VISITOR",
      preferredFamilies: ["ELEMENTAL_CRAFT"],
      secondaryFamilies: [],
      qualityPreference: "MASTERWORK",
      portraitAssetId: AssetId.from("example-visitor-portrait"),
    } satisfies CustomerArchetypeDefinition;

    expect(example.qualityPreference).toBe("MASTERWORK");
  });
});
