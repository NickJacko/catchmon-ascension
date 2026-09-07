// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InfrastructureId, UnlockRuleId } from "../../core/ids/index.ts";
import { toCoins } from "../../core/math/index.ts";
import { type InfrastructureDefinition } from "./types.ts";

describe("InfrastructureDefinition (type-shape fixture, not canonical content)", () => {
  it("is satisfiable with its deliberately minimal field set", () => {
    const example = {
      infrastructureId: InfrastructureId.from("example-infrastructure"),
      displayName: "Example Infrastructure",
      unlockRule: {
        unlockRuleId: UnlockRuleId.from("example-unlock-rule"),
        displayName: "Example Unlock Rule",
        primaryCondition: { type: "SHOP_RANK", threshold: 2 },
      },
      coinCost: toCoins(100),
    } satisfies InfrastructureDefinition;

    expect(example.unlockRule.primaryCondition.type).toBe("SHOP_RANK");
  });

  it("supports an optional constructionDurationMs — absent means instant (Task 07.4)", () => {
    const instant: InfrastructureDefinition = {
      infrastructureId: InfrastructureId.from("example-instant"),
      displayName: "Example Instant Infrastructure",
      unlockRule: {
        unlockRuleId: UnlockRuleId.from("example-unlock-rule-2"),
        displayName: "Example Unlock Rule 2",
        primaryCondition: { type: "SHOP_RANK", threshold: 1 },
      },
      coinCost: toCoins(50),
    };
    expect(instant.constructionDurationMs).toBeUndefined();

    const withConstruction: InfrastructureDefinition = {
      ...instant,
      infrastructureId: InfrastructureId.from("example-construction"),
      constructionDurationMs: 30_000,
    };
    expect(withConstruction.constructionDurationMs).toBe(30_000);
  });
});
