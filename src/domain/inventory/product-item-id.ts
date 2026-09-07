/**
 * Design owner: 04 Crafting & Product System §70 Quality Inventory
 * Handling ("Different quality grades are separate inventory sub-stacks
 * of the same product"); 14 Technical Architecture §72-73 Inventory
 * Architecture / Inventory Stack.
 *
 * `GameState.inventory.stacks` is `Record<ItemId, InventoryStack>` — one
 * stack per `ItemId` (Task 01.8, unchanged by this task). Document 04 §70
 * needs *multiple* stacks per product (one per quality grade). Rather
 * than changing that Record's key shape (a GameState schema change no
 * Phase 3 task authorizes), a quality-eligible product's inventory
 * identity is a *derived* `ItemId` combining its `ProductId` and
 * `QualityGrade` — this is the one canonical place that derivation
 * happens, so callers never hand-build the string themselves.
 *
 * Routine materials and special components do not need this (Document 04
 * §70: "Routine materials/components do not [require quality stacks]") —
 * they use the `itemId` already on their `ResourceDefinition`/
 * `ComponentDefinition` directly, unchanged.
 */
import { ItemId, type ProductId } from "../../core/ids/index.ts";
import { type QualityGrade } from "../crafting/index.ts";

export function productItemId(
  productId: ProductId,
  quality: QualityGrade,
): ItemId {
  return ItemId.from(`${productId}::${quality}`);
}
