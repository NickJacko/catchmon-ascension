/**
 * Design owner: 04 Crafting & Product System — §18 Product Family
 * Economic Matrix, §20 Product Data Model, §21 Recipe Input Architecture,
 * §25 Crafted Components, §26-32 Production Station Architecture, §54-55
 * Recipe Ranks, §3067 (quality grades).
 *
 * Content-domain types only — no products/recipes/resources/components
 * are created here (that is later content-authoring work).
 */
import {
  type AssetId,
  type CatchmonLineId,
  type ComponentId,
  type ItemId,
  type ProductId,
  type RecipeId,
  type RegionId,
  type ResourceId,
} from "../../core/ids/index.ts";
import { type ElementId } from "../world/types.ts";
import { type UnlockCondition } from "../progression/index.ts";

/** The seven top-level product families (Document 04 §4-18). Fixed set. */
export type ProductFamily =
  | "PROVISIONS"
  | "CARE_AND_COMFORT"
  | "WEARABLES"
  | "FIELD_GEAR"
  | "CAPTURE_AND_DISCOVERY_GEAR"
  | "ELEMENTAL_CRAFT"
  | "HABITAT_AND_ENRICHMENT";

/**
 * The five functional production-station archetypes (Document 04 §26-32).
 * Deliberately fewer than the seven product families — a station can
 * support related families.
 */
export type StationArchetype =
  | "PROVISION_STATION"
  | "CARE_ATELIER"
  | "FIELDWORKS_BENCH"
  | "RESONANCE_LAB"
  | "HABITAT_WORKSHOP";

/** Working quality grades (Document 04, item 39: "lightweight: Standard / Fine / Masterwork"). */
export type QualityGrade = "STANDARD" | "FINE" | "MASTERWORK";

/**
 * Document 04 §20 Product Data Model. Recipe Rank is an open-ended
 * progression indicator, not a fixed enum ("exact rank count is not
 * locked", Document 04 §54) — modeled as a plain positive integer.
 */
export interface ProductDefinition {
  readonly productId: ProductId;
  readonly displayName: string;
  readonly family: ProductFamily;
  readonly subfamily?: string;
  readonly recipeRank: number;
  readonly stationType: StationArchetype;
  readonly routineInputs: readonly ResourceId[];
  readonly specialInputs: readonly ComponentId[];
  readonly craftedInput?: ProductId;
  readonly craftDuration: number;
  readonly outputQuantity: number;
  readonly baseTransactionValue: number;
  readonly displayCategory: string;
  readonly demandTags: readonly string[];
  readonly elementAffinity?: ElementId;
  readonly regionAffinity?: RegionId;
  readonly playerUse?: string;
  readonly utilityEffectId?: string;
  readonly masteryProfile: string;
  readonly qualityEligible: boolean;
  readonly unlockRequirements: readonly UnlockCondition[];
  readonly catchmonHooks: readonly CatchmonLineId[];
  readonly visualAssetId: AssetId;
}

/**
 * One routine-material line in a recipe's input list, with an explicit
 * quantity (Phase 3 schema cleanup, post-Task 03.3: the original bare
 * `readonly ResourceId[]` shape had no way to say "2 of resource A" —
 * every Phase 3 slice recipe silently consumed exactly 1 unit per listed
 * input, which was reported as a known gap in the Task 03.3 completion
 * report, not a locked design decision).
 */
export interface RecipeRoutineInput {
  readonly resourceId: ResourceId;
  readonly quantity: number;
}

/** The special-component equivalent of `RecipeRoutineInput`. */
export interface RecipeSpecialInput {
  readonly componentId: ComponentId;
  readonly quantity: number;
}

/**
 * A recipe is the *process* that produces a `ProductDefinition` at a
 * station. Document 04 keeps recipe complexity bounded (§21-22): normal
 * recipes should show no more than 3 input rows, advanced ones no more
 * than 4 — this type does not itself enforce that (a content-validation
 * concern for later), only represents the shape.
 */
export interface RecipeDefinition {
  readonly recipeId: RecipeId;
  readonly displayName: string;
  readonly outputProductId: ProductId;
  readonly stationType: StationArchetype;
  readonly recipeRank: number;
  readonly routineInputs: readonly RecipeRoutineInput[];
  readonly specialInputs: readonly RecipeSpecialInput[];
  readonly craftedInput?: ProductId;
  readonly craftDuration: number;
  readonly unlockRequirements: readonly UnlockCondition[];
}

/**
 * A routine material (Document 14 §56 registry #3; Document 04 §21.1
 * "routine material types"). Kept intentionally minimal — no drop
 * rates/sources, which belong to acquisition/economy design not yet read
 * for this task.
 */
export interface ResourceDefinition {
  readonly resourceId: ResourceId;
  readonly displayName: string;
  readonly elementAffinity?: ElementId;
  readonly visualAssetId: AssetId;
  /** The generic inventory-stack item this resource occupies (Task 01.6+ inventory domain). */
  readonly itemId: ItemId;
}

/**
 * A special component (Document 14 §56 registry #4; Document 04 §25
 * "Crafted Components" — if crafted, a component is an item, not a
 * currency). Kept intentionally minimal for the same reason as
 * `ResourceDefinition`.
 */
export interface ComponentDefinition {
  readonly componentId: ComponentId;
  readonly displayName: string;
  readonly elementAffinity?: ElementId;
  readonly craftedFromRecipeId?: RecipeId;
  readonly visualAssetId: AssetId;
  readonly itemId: ItemId;
}
