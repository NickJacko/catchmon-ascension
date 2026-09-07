// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  InfrastructureId,
  RegionId,
  RouteId,
  UnlockRuleId,
} from "../../core/ids/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../catalog/index.ts";
import { createInitialGameState, type GameState } from "../game-state/index.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "../../content/vertical-slice/index.ts";
import { type UnlockRuleDefinition } from "./types.ts";
import {
  evaluateUnlockCondition,
  isUnlockRuleSatisfied,
} from "./unlock-evaluator.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);

function stateAtRank(
  rank: number,
  ownedInfrastructureIds: string[] = [],
): GameState {
  const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  return {
    ...base,
    progression: { ...base.progression, rank },
    infrastructure: {
      ...base.infrastructure,
      ownedInfrastructureIds: ownedInfrastructureIds.map((id) =>
        InfrastructureId.from(id),
      ),
    },
  };
}

describe("evaluateUnlockCondition", () => {
  it("SHOP_RANK is satisfied once rank meets or exceeds the threshold", () => {
    expect(
      evaluateUnlockCondition(
        { type: "SHOP_RANK", threshold: 5 },
        stateAtRank(4),
      ),
    ).toBe(false);
    expect(
      evaluateUnlockCondition(
        { type: "SHOP_RANK", threshold: 5 },
        stateAtRank(5),
      ),
    ).toBe(true);
    expect(
      evaluateUnlockCondition(
        { type: "SHOP_RANK", threshold: 5 },
        stateAtRank(6),
      ),
    ).toBe(true);
  });

  it("INFRASTRUCTURE_STATE is satisfied once the referenced infrastructure is owned", () => {
    const condition = {
      type: "INFRASTRUCTURE_STATE" as const,
      subjectId: InfrastructureId.from("expedition-hub"),
    };
    expect(evaluateUnlockCondition(condition, stateAtRank(1))).toBe(false);
    expect(
      evaluateUnlockCondition(condition, stateAtRank(1, ["expedition-hub"])),
    ).toBe(true);
  });

  it("conservatively returns false for condition types with no real Phase 7 content yet", () => {
    expect(
      evaluateUnlockCondition(
        { type: "COLLECTION_MILESTONE", threshold: 1 },
        stateAtRank(999),
      ),
    ).toBe(false);
  });

  it("EXPEDITION_MILESTONE (Ozean Batch A) is satisfied once the referenced route has been completed at least once", () => {
    const routeId = RouteId.from("some-route");
    const condition = {
      type: "EXPEDITION_MILESTONE" as const,
      subjectId: routeId,
    };
    const notCompleted = stateAtRank(1);
    expect(evaluateUnlockCondition(condition, notCompleted)).toBe(false);
    const completed: GameState = {
      ...notCompleted,
      world: {
        ...notCompleted.world,
        routeStates: {
          ...notCompleted.world.routeStates,
          [routeId]: "COMPLETED",
        },
      },
    };
    expect(evaluateUnlockCondition(condition, completed)).toBe(true);
    // A different route's completion must not satisfy this one's condition.
    const otherRouteId = RouteId.from("a-different-route");
    const otherCompleted: GameState = {
      ...notCompleted,
      world: {
        ...notCompleted.world,
        routeStates: {
          ...notCompleted.world.routeStates,
          [otherRouteId]: "COMPLETED",
        },
      },
    };
    expect(evaluateUnlockCondition(condition, otherCompleted)).toBe(false);
  });

  it("JOURNEY_RANK (Phase R6) is satisfied once journeyRank meets or exceeds the threshold, independent of Shop Rank", () => {
    const condition = { type: "JOURNEY_RANK" as const, threshold: 2 };
    const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const belowThreshold: GameState = {
      ...base,
      progression: {
        ...base.progression,
        rank: 100,
        journeyRank: 1,
      },
    };
    expect(evaluateUnlockCondition(condition, belowThreshold)).toBe(false);
    const atThreshold: GameState = {
      ...base,
      progression: {
        ...base.progression,
        rank: 1,
        journeyRank: 2,
      },
    };
    expect(evaluateUnlockCondition(condition, atThreshold)).toBe(true);
  });

  it("REGION_STATE (Phase R6) is satisfied once the named milestone appears in the referenced Region's regionMilestones entry", () => {
    const regionId = RegionId.from("some-region");
    const condition = {
      type: "REGION_STATE" as const,
      subjectId: regionId,
      state: "REGION_COMPLETED",
    };
    const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    expect(evaluateUnlockCondition(condition, base)).toBe(false);
    const withMilestone: GameState = {
      ...base,
      world: {
        ...base.world,
        regionMilestones: {
          ...base.world.regionMilestones,
          [regionId]: ["REGION_COMPLETED"],
        },
      },
    };
    expect(evaluateUnlockCondition(condition, withMilestone)).toBe(true);
    // A different region's milestone must not satisfy this one's condition.
    const otherRegionId = RegionId.from("a-different-region");
    const otherRegionMilestone: GameState = {
      ...base,
      world: {
        ...base.world,
        regionMilestones: {
          ...base.world.regionMilestones,
          [otherRegionId]: ["REGION_COMPLETED"],
        },
      },
    };
    expect(evaluateUnlockCondition(condition, otherRegionMilestone)).toBe(
      false,
    );
  });
});

describe("isUnlockRuleSatisfied", () => {
  it("is satisfied when only a primary condition exists and it holds", () => {
    const rule: UnlockRuleDefinition = {
      unlockRuleId: UnlockRuleId.from("test-rule"),
      displayName: "Test Rule",
      primaryCondition: { type: "SHOP_RANK", threshold: 3 },
    };
    expect(isUnlockRuleSatisfied(rule, stateAtRank(3))).toBe(true);
    expect(isUnlockRuleSatisfied(rule, stateAtRank(2))).toBe(false);
  });

  it("requires both primary AND secondary conditions (Document 09 §188 composition)", () => {
    const rule: UnlockRuleDefinition = {
      unlockRuleId: UnlockRuleId.from("test-rule-composed"),
      displayName: "Test Rule Composed",
      primaryCondition: { type: "SHOP_RANK", threshold: 3 },
      secondaryCondition: {
        type: "INFRASTRUCTURE_STATE",
        subjectId: InfrastructureId.from("expedition-hub"),
      },
    };
    expect(isUnlockRuleSatisfied(rule, stateAtRank(3))).toBe(false);
    expect(
      isUnlockRuleSatisfied(rule, stateAtRank(3, ["expedition-hub"])),
    ).toBe(true);
    expect(
      isUnlockRuleSatisfied(rule, stateAtRank(2, ["expedition-hub"])),
    ).toBe(false);
  });
});
