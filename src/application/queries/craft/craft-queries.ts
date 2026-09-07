/**
 * Design owner: Document 15 Task 03.7 (Recipe/Craft Queries); 04 Crafting
 * & Product System §124-126 (Recipe Preview, Crafting UI Information
 * Hierarchy, "Can Craft" Clarity), §59-64 Recipe Mastery.
 *
 * Pure, read-only queries over `GameState`/`GameCatalog` — never mutate
 * state, never go through the command engine (Document 14 §160-161:
 * React reads via selectors/queries, writes only via commands). Reuses
 * the same station-capability/input-resolution helpers the craft commands
 * use (Task 03.4's `craft-helpers.ts`) rather than duplicating that logic
 * for a second, read-only code path.
 */
import { addDurationToTimestamp } from "../../../core/time/time-math.ts";
import { toDurationMs } from "../../../core/math/duration.ts";
import { type TimestampMs } from "../../../core/time/index.ts";
import {
  type ItemId,
  type RecipeId,
  type StationId,
} from "../../../core/ids/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type StationArchetype } from "../../../domain/crafting/index.ts";
import { getAvailableQuantity } from "../../../domain/inventory/index.ts";
import {
  type CraftActivitySnapshot,
  type GameState,
  type QueuedCraftSnapshot,
} from "../../../domain/game-state/index.ts";
import { resolveRecipeInputItems } from "../../commands/craft/craft-helpers.ts";

export interface MissingIngredient {
  readonly itemId: ItemId;
  readonly required: number;
  readonly available: number;
}

export interface CurrentQueueView {
  readonly active: CraftActivitySnapshot | null;
  readonly queued: readonly QueuedCraftSnapshot[];
}

export interface ProductOutputPreview {
  readonly outputProductId: string;
  readonly displayName: string;
  readonly stationType: StationArchetype;
  readonly craftDurationMs: number;
  readonly outputQuantity: number;
  readonly baseTransactionValue: number;
  readonly routineInputCount: number;
  readonly specialInputCount: number;
}

/** Document 04 §60: KNOWN/PRACTICED/REFINED/MASTERED. Nothing beyond KNOWN is tracked anywhere in GameState yet — a real hook, honestly reporting no progression exists. */
export interface MasteryPlaceholder {
  readonly recipeId: RecipeId;
  readonly milestone: "KNOWN";
  readonly masteryProfile: string;
}

export interface CraftQueries {
  canCraft(state: GameState, stationId: StationId, recipeId: RecipeId): boolean;
  missingIngredients(
    state: GameState,
    recipeId: RecipeId,
  ): readonly MissingIngredient[];
  estimatedCompletion(
    state: GameState,
    stationId: StationId,
    recipeId: RecipeId,
    now: TimestampMs,
  ): TimestampMs | null;
  currentQueue(state: GameState, stationId: StationId): CurrentQueueView;
  productOutputPreview(recipeId: RecipeId): ProductOutputPreview | null;
  masteryPlaceholder(recipeId: RecipeId): MasteryPlaceholder | null;
  /**
   * Ozean Batch A closure (Care Atelier foundation check): whether this
   * station's archetype has at least one real recipe targeting it yet.
   * Care Atelier is a genuinely registered archetype with zero recipes
   * until Batch B — this lets presentation code keep a content-less
   * station out of the normal "Idle, tap to craft" surface without
   * inventing a placeholder recipe or a new lock/unlock mechanism.
   */
  stationHasAvailableRecipes(state: GameState, stationId: StationId): boolean;
}

export function createCraftQueries(
  catalog: GameCatalog,
  stationArchetypes: Readonly<Record<StationId, StationArchetype>>,
  maxQueueSize: number,
): CraftQueries {
  function resolveArchetype(
    state: GameState,
    stationId: StationId,
  ): StationArchetype | undefined {
    return (
      state.crafting.stations[stationId]?.archetype ??
      stationArchetypes[stationId]
    );
  }

  function missingIngredients(
    state: GameState,
    recipeId: RecipeId,
  ): readonly MissingIngredient[] {
    const recipe = catalog.recipes.get(recipeId);
    if (!recipe) return [];
    return resolveRecipeInputItems(recipe, catalog)
      .map((line) => ({
        itemId: line.itemId,
        required: line.quantity,
        available: getAvailableQuantity(state.inventory, line.itemId),
      }))
      .filter((line) => line.available < line.required);
  }

  function hasFreeSlot(state: GameState, stationId: StationId): boolean {
    const station = state.crafting.stations[stationId];
    if (!station) return true;
    return (
      station.activeCraft === undefined ||
      station.queuedCrafts.length < maxQueueSize
    );
  }

  function canCraft(
    state: GameState,
    stationId: StationId,
    recipeId: RecipeId,
  ): boolean {
    const recipe = catalog.recipes.get(recipeId);
    if (!recipe) return false;

    const archetype = resolveArchetype(state, stationId);
    if (archetype !== recipe.stationType) return false;

    if (!hasFreeSlot(state, stationId)) return false;

    return missingIngredients(state, recipeId).length === 0;
  }

  function estimatedCompletion(
    state: GameState,
    stationId: StationId,
    recipeId: RecipeId,
    now: TimestampMs,
  ): TimestampMs | null {
    const recipe = catalog.recipes.get(recipeId);
    if (!recipe) return null;

    const archetype = resolveArchetype(state, stationId);
    if (archetype !== recipe.stationType) return null;
    if (!hasFreeSlot(state, stationId)) return null;

    const station = state.crafting.stations[stationId];
    let aheadCompletionMs: TimestampMs =
      station?.activeCraft?.completesAtMs ?? now;

    for (const queued of station?.queuedCrafts ?? []) {
      const queuedRecipe = catalog.recipes.get(queued.recipeId);
      if (!queuedRecipe) continue;
      aheadCompletionMs = addDurationToTimestamp(
        aheadCompletionMs,
        toDurationMs(queuedRecipe.craftDuration),
      );
    }

    return addDurationToTimestamp(
      aheadCompletionMs,
      toDurationMs(recipe.craftDuration),
    );
  }

  function currentQueue(
    state: GameState,
    stationId: StationId,
  ): CurrentQueueView {
    const station = state.crafting.stations[stationId];
    return {
      active: station?.activeCraft ?? null,
      queued: station?.queuedCrafts ?? [],
    };
  }

  function productOutputPreview(
    recipeId: RecipeId,
  ): ProductOutputPreview | null {
    const recipe = catalog.recipes.get(recipeId);
    if (!recipe) return null;
    const product = catalog.products.get(recipe.outputProductId);
    if (!product) return null;

    return {
      outputProductId: product.productId,
      displayName: product.displayName,
      stationType: recipe.stationType,
      craftDurationMs: recipe.craftDuration,
      outputQuantity: product.outputQuantity,
      baseTransactionValue: product.baseTransactionValue,
      routineInputCount: recipe.routineInputs.length,
      specialInputCount: recipe.specialInputs.length,
    };
  }

  function masteryPlaceholder(recipeId: RecipeId): MasteryPlaceholder | null {
    const product = catalog.recipes.get(recipeId);
    if (!product) return null;
    const outputProduct = catalog.products.get(product.outputProductId);
    if (!outputProduct) return null;
    return {
      recipeId,
      milestone: "KNOWN",
      masteryProfile: outputProduct.masteryProfile,
    };
  }

  function stationHasAvailableRecipes(
    state: GameState,
    stationId: StationId,
  ): boolean {
    const archetype = resolveArchetype(state, stationId);
    if (!archetype) return false;
    for (const recipe of catalog.recipes.values()) {
      if (recipe.stationType === archetype) return true;
    }
    return false;
  }

  return {
    canCraft,
    missingIngredients,
    estimatedCompletion,
    currentQueue,
    productOutputPreview,
    masteryPlaceholder,
    stationHasAvailableRecipes,
  };
}
