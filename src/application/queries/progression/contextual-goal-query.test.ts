// @vitest-environment node
import { describe, expect, it } from "vitest";
import { UnlockRuleId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { type UnlockRuleDefinition } from "../../../domain/progression/index.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "../../../content/vertical-slice/index.ts";
import { getContextualGoal } from "./contextual-goal-query.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const rankConfig = { progressPerRank: 20, rankCap: 10 };

const rules: readonly UnlockRuleDefinition[] = [
  {
    unlockRuleId: UnlockRuleId.from("rule-1"),
    displayName: "Rule One",
    primaryCondition: { type: "SHOP_RANK", threshold: 2 },
  },
  {
    unlockRuleId: UnlockRuleId.from("rule-2"),
    displayName: "Rule Two",
    primaryCondition: { type: "SHOP_RANK", threshold: 4 },
  },
];

function stateAtRank(rank: number): GameState {
  const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  return { ...base, progression: { ...base.progression, rank } };
}

describe("getContextualGoal", () => {
  it("surfaces the first unsatisfied unlock rule as the next milestone", () => {
    const goal = getContextualGoal(stateAtRank(1), rules, rankConfig);
    expect(goal.nextMilestone).toEqual({
      kind: "UNLOCK_RULE",
      unlockRuleId: UnlockRuleId.from("rule-1"),
      displayName: "Rule One",
    });
    expect(goal.currentPrimaryGoal).toContain("Rule One");
  });

  it("moves to the next rule once the current one is satisfied", () => {
    const goal = getContextualGoal(stateAtRank(2), rules, rankConfig);
    expect(goal.nextMilestone).toEqual({
      kind: "UNLOCK_RULE",
      unlockRuleId: UnlockRuleId.from("rule-2"),
      displayName: "Rule Two",
    });
  });

  it("falls back to the Shop Rank milestone once every unlock rule is satisfied", () => {
    const goal = getContextualGoal(stateAtRank(4), rules, rankConfig);
    expect(goal.nextMilestone.kind).toBe("SHOP_RANK");
  });

  it("reports NONE once the rank cap is also reached", () => {
    const goal = getContextualGoal(stateAtRank(10), rules, rankConfig);
    expect(goal.nextMilestone).toEqual({ kind: "NONE" });
  });
});
