// @vitest-environment node
import { describe, expect, it } from "vitest";
import { UnlockRuleId } from "../../core/ids/index.ts";
import { type UnlockRuleDefinition } from "./types.ts";

describe("UnlockRuleDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with one primary condition and no secondary condition", () => {
    const example = {
      unlockRuleId: UnlockRuleId.from("example-unlock-rule"),
      displayName: "Example Unlock Rule",
      primaryCondition: { type: "SHOP_RANK", threshold: 3 },
    } satisfies UnlockRuleDefinition;

    expect(example.primaryCondition.type).toBe("SHOP_RANK");
    // `secondaryCondition` is intentionally omitted above — `satisfies`
    // proves that's valid (the field is optional) without widening
    // `example`'s type to include it.
  });

  it("is satisfiable with a composed primary + secondary condition", () => {
    const example = {
      unlockRuleId: UnlockRuleId.from("example-unlock-rule-composed"),
      displayName: "Example Composed Unlock Rule",
      primaryCondition: { type: "REGION_STATE", state: "unlocked" },
      secondaryCondition: { type: "CATCHMON_LEVEL", threshold: 5 },
    } satisfies UnlockRuleDefinition;

    expect(example.secondaryCondition?.type).toBe("CATCHMON_LEVEL");
  });
});
