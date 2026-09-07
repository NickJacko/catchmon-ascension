/**
 * Design owner: Document 15 Task 07.6 (Contextual Goal Query).
 *
 * "One selector exposing: current primary goal, next meaningful milestone.
 * No giant quest system." Composes two already-built Phase 7 pieces
 * rather than inventing new tracking: Task 07.2's ordered introduction-
 * order unlock rules (the first not-yet-satisfied one IS the next
 * meaningful milestone while any remain) and Task 07.1's `getNearbyMilestone`
 * (once every introduction-order rule is satisfied, the goal falls back to
 * "grow Shop Rank further"). `orderedUnlockRules` and `rankConfig` are
 * injected rather than imported directly, matching every other Phase 6/7
 * query's content-agnostic-function precedent (`createExpeditionPlanningQueries`,
 * etc.).
 */
import { type UnlockRuleId } from "../../../core/ids/index.ts";
import {
  getNearbyMilestone,
  isUnlockRuleSatisfied,
  type UnlockRuleDefinition,
} from "../../../domain/progression/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";

export type NextMilestone =
  | {
      readonly kind: "UNLOCK_RULE";
      readonly unlockRuleId: UnlockRuleId;
      readonly displayName: string;
    }
  | { readonly kind: "SHOP_RANK"; readonly progressRemaining: number }
  | { readonly kind: "NONE" };

export interface ContextualGoal {
  readonly currentPrimaryGoal: string;
  readonly nextMilestone: NextMilestone;
}

export interface ContextualGoalRankConfig {
  readonly progressPerRank: number;
  readonly rankCap: number;
}

export function getContextualGoal(
  state: GameState,
  orderedUnlockRules: readonly UnlockRuleDefinition[],
  rankConfig: ContextualGoalRankConfig,
): ContextualGoal {
  const nextUnsatisfied = orderedUnlockRules.find(
    (rule) => !isUnlockRuleSatisfied(rule, state),
  );
  if (nextUnsatisfied) {
    return {
      currentPrimaryGoal: `Unlock: ${nextUnsatisfied.displayName}`,
      nextMilestone: {
        kind: "UNLOCK_RULE",
        unlockRuleId: nextUnsatisfied.unlockRuleId,
        displayName: nextUnsatisfied.displayName,
      },
    };
  }

  const milestone = getNearbyMilestone(
    state.progression,
    rankConfig.progressPerRank,
    rankConfig.rankCap,
  );
  if (
    milestone.progressRequiredForNextRank === null ||
    milestone.progressRemaining === null
  ) {
    return {
      currentPrimaryGoal: "Keep growing your shop",
      nextMilestone: { kind: "NONE" },
    };
  }
  return {
    currentPrimaryGoal: `Reach Shop Rank ${String(milestone.currentRank + 1)}`,
    nextMilestone: {
      kind: "SHOP_RANK",
      progressRemaining: milestone.progressRemaining,
    },
  };
}
