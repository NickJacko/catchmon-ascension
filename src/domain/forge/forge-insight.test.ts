import { describe, expect, it } from "vitest";
import {
  applyRecycleInsight,
  consumeInsightGuaranteeIfReady,
} from "./forge-insight.ts";

describe("Forge Insight safety net", () => {
  it("accumulates on recycle and carries over below threshold", () => {
    let insight = 0;
    insight = applyRecycleInsight(insight, 10);
    insight = applyRecycleInsight(insight, 10);
    expect(insight).toBe(20);

    const result = consumeInsightGuaranteeIfReady(insight, 100, "RARE");
    expect(result.nextInsight).toBe(20);
    expect(result.guaranteedMinimumRarity).toBeUndefined();
  });

  it("guarantees a minimum rarity and resets once the threshold is reached — bad luck still produces deterministic progress", () => {
    const result = consumeInsightGuaranteeIfReady(100, 100, "RARE");
    expect(result.nextInsight).toBe(0);
    expect(result.guaranteedMinimumRarity).toBe("RARE");
  });

  it("never loses progress: repeated below-threshold recycling monotonically increases insight", () => {
    let insight = 0;
    for (let i = 0; i < 5; i += 1) {
      insight = applyRecycleInsight(insight, 10);
    }
    expect(insight).toBe(50);
  });
});
