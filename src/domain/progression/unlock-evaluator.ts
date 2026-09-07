/**
 * Design owner: Document 15 Task 07.2 (Slice Unlock Rules); Document 09
 * §187-188 Unlock Condition Model / Condition Composition, §65-70 Primary
 * Progression Gates (Shop Rank Gate, Infrastructure Gate), §106 Region
 * Progression — World Readiness ("possible world-readiness signals:
 * complete key route...").
 *
 * The first real evaluator for `UnlockCondition`/`UnlockRuleDefinition`
 * (Task 05.1/06.1's own content repeatedly deferred this exact gap to
 * "Document 09/Phase 7 territory" — this is that territory). Evaluates the
 * condition types real content now uses (`SHOP_RANK` for the
 * introduction-order rules, `INFRASTRUCTURE_STATE` for infrastructure
 * purchase gating, `EXPEDITION_MILESTONE` for Ozean's now-superseded
 * route-completion gate — Document 15 Ozean Batch A; `JOURNEY_RANK` and
 * `REGION_STATE`, added Phase R6, for the migrated Ozean unlock rule —
 * docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.2's locked target) — the
 * remaining `UnlockConditionType` members (RECIPE_MASTERY/CATCHMON_OWNED/
 * CATCHMON_LEVEL/COLLECTION_MILESTONE) have no real content behind them
 * yet, so evaluating them would be inventing unspecified mechanics rather
 * than implementing approved design. They conservatively evaluate to
 * `false` (never silently "always unlocked").
 *
 * `EXPEDITION_MILESTONE`'s `subjectId` is a `RouteId`: it reads
 * `state.world.routeStates`, which `expedition-reconciliation-pass.ts`
 * now writes generically for every completing expedition of any route in
 * any region (not an Ozean-specific branch) — "has this route ever been
 * completed at least once" is a fully reusable World Readiness signal for
 * any future region's own two-signal unlock rule, matching the
 * Region-3-to-17 repeatable-template goal.
 */
import {
  type InfrastructureId,
  type RegionId,
  type RouteId,
} from "../../core/ids/index.ts";
import { invariant } from "../../core/assertions/index.ts";
import { type GameState } from "../game-state/index.ts";
import { type UnlockCondition, type UnlockRuleDefinition } from "./types.ts";

export function evaluateUnlockCondition(
  condition: UnlockCondition,
  state: GameState,
): boolean {
  switch (condition.type) {
    case "SHOP_RANK": {
      invariant(
        condition.threshold !== undefined,
        `SHOP_RANK unlock condition is missing its required threshold`,
      );
      return state.progression.rank >= condition.threshold;
    }
    case "INFRASTRUCTURE_STATE": {
      invariant(
        condition.subjectId !== undefined,
        `INFRASTRUCTURE_STATE unlock condition is missing its required subjectId`,
      );
      return state.infrastructure.ownedInfrastructureIds.includes(
        condition.subjectId as InfrastructureId,
      );
    }
    case "EXPEDITION_MILESTONE": {
      invariant(
        condition.subjectId !== undefined,
        `EXPEDITION_MILESTONE unlock condition is missing its required subjectId (a RouteId)`,
      );
      return (
        state.world.routeStates[condition.subjectId as RouteId] === "COMPLETED"
      );
    }
    // docs/rebuild/15 Phase R6 (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.2's
    // locked target): reads the distinct Journey Rank meter, never Shop's
    // SHOP_RANK/state.progression.rank.
    case "JOURNEY_RANK": {
      invariant(
        condition.threshold !== undefined,
        `JOURNEY_RANK unlock condition is missing its required threshold`,
      );
      return state.progression.journeyRank >= condition.threshold;
    }
    // docs/rebuild/15 Phase R6: Doc 08 §3's "prior-region milestone" signal
    // — subjectId is the prior RegionId, `state` names the specific
    // milestone string that must appear in that region's
    // `world.regionMilestones` entry (Document 09 §106 "world-readiness
    // signal"). Generic: any region may reference any other region's
    // milestone, nothing here branches on which region it is.
    case "REGION_STATE": {
      invariant(
        condition.subjectId !== undefined && condition.state !== undefined,
        `REGION_STATE unlock condition requires both subjectId (a RegionId) and state (a milestone id)`,
      );
      return (
        state.world.regionMilestones[condition.subjectId as RegionId]?.includes(
          condition.state,
        ) ?? false
      );
    }
    // Document 09 §187 declares these remaining condition types, but no
    // real content authors one yet (RECIPE_MASTERY/CATCHMON_OWNED/
    // CATCHMON_LEVEL/COLLECTION_MILESTONE) — evaluating them now would
    // mean guessing their exact per-type payload semantics, which
    // CLAUDE.md's primary rule forbids. Conservatively unsatisfied rather
    // than silently true.
    default:
      return false;
  }
}

/** Document 09 §188 Condition Composition: an optional secondary condition must ALSO hold — "avoid over-composition" reads as AND, not OR. */
export function isUnlockRuleSatisfied(
  rule: UnlockRuleDefinition,
  state: GameState,
): boolean {
  if (!evaluateUnlockCondition(rule.primaryCondition, state)) {
    return false;
  }
  if (rule.secondaryCondition) {
    return evaluateUnlockCondition(rule.secondaryCondition, state);
  }
  return true;
}
