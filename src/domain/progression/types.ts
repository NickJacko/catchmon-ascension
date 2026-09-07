/**
 * Design owner: 09 Progression & Unlock Architecture — §186 Canonical
 * Progression Data, §187 Unlock Condition Model, §188 Condition
 * Composition.
 *
 * Content-domain type only: describes the *shape* of an unlock rule so
 * other content types (Product, Region, Route, Infrastructure, ...) can
 * reference `UnlockRuleId`/`UnlockCondition` consistently. No registry,
 * no evaluator, no actual unlock rules are created here — that is later
 * work (Task 01.6+).
 */
import {
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type InfrastructureId,
  type RecipeId,
  type RegionId,
  type UnlockRuleId,
} from "../../core/ids/index.ts";

/**
 * The generic unlock-condition vocabulary (Document 09 §187). Exhaustive
 * per the design doc — do not add ad hoc UI-owned condition branches.
 */
export type UnlockConditionType =
  | "SHOP_RANK"
  | "INFRASTRUCTURE_STATE"
  | "RECIPE_MASTERY"
  | "CATCHMON_OWNED"
  | "CATCHMON_LEVEL"
  | "REGION_STATE"
  | "EXPEDITION_MILESTONE"
  | "COLLECTION_MILESTONE"
  /**
   * docs/rebuild/15 Phase R6 (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.2's
   * locked target: "global/Journey readiness... → region unlock"). Reads
   * `state.progression.journeyRank` — a distinct field/mechanism from
   * Shop's `SHOP_RANK`/`state.progression.rank` (not a rename of it —
   * see `domain/game-state/slices.ts`'s `ProgressionState` doc comment),
   * fed only by real Ascension Journey milestones (stage/boss clears,
   * region completion), never by Shop transactions.
   */
  | "JOURNEY_RANK";

/**
 * One evaluable condition. `subjectId` is deliberately loose (the exact
 * referenced ID depends on `type`, e.g. an `InfrastructureId` for
 * `INFRASTRUCTURE_STATE` or a `CatchmonLineId` for `CATCHMON_OWNED`) —
 * `threshold`/`state` are likewise open until an evaluator (Task 01.6+)
 * defines exact per-type payload shapes.
 */
export interface UnlockCondition {
  readonly type: UnlockConditionType;
  readonly subjectId?:
    | InfrastructureId
    | RecipeId
    | CatchmonLineId
    | CatchmonSpeciesId
    | RegionId
    | string;
  readonly threshold?: number;
  readonly state?: string;
}

/**
 * An unlock rule composed of one primary condition and an optional
 * secondary condition (Document 09 §188 Condition Composition — normal
 * unlock definitions should avoid over-composition).
 */
export interface UnlockRuleDefinition {
  readonly unlockRuleId: UnlockRuleId;
  readonly displayName: string;
  readonly primaryCondition: UnlockCondition;
  readonly secondaryCondition?: UnlockCondition;
}
