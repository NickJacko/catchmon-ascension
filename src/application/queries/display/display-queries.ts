/**
 * Design owner: Document 15 Task 04.1 ("stock visibility"); 14 Technical
 * Architecture §79 Display Stock Model, §26 Display As Primary Request
 * Pool (Document 05 §26) — this is also what Task 04.2's customer request
 * generation and Task 04.4's quote engine read to know what is sellable.
 */
import { type DisplaySlotId, type ProductId } from "../../../core/ids/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";
import {
  getAvailableQuantity,
  productItemId,
} from "../../../domain/inventory/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";

export interface DisplayedProductView {
  readonly displaySlotId: DisplaySlotId;
  readonly productId: ProductId;
  readonly quality: QualityGrade;
  readonly availableQuantity: number;
}

export function getDisplaySlotView(
  state: GameState,
  displaySlotId: DisplaySlotId,
): DisplayedProductView | null {
  const slot = state.shop.displaySlots[displaySlotId];
  if (
    !slot ||
    slot.assignedProductId === undefined ||
    slot.assignedQuality === undefined
  ) {
    return null;
  }
  const itemId = productItemId(slot.assignedProductId, slot.assignedQuality);
  return {
    displaySlotId,
    productId: slot.assignedProductId,
    quality: slot.assignedQuality,
    availableQuantity: getAvailableQuantity(state.inventory, itemId),
  };
}

/** Document 05 §26: "displayed inventory should form the primary request pool." */
export function getDisplayedProducts(
  state: GameState,
  displaySlotIds: readonly DisplaySlotId[],
): readonly DisplayedProductView[] {
  const views: DisplayedProductView[] = [];
  for (const displaySlotId of displaySlotIds) {
    const view = getDisplaySlotView(state, displaySlotId);
    if (view) {
      views.push(view);
    }
  }
  return views;
}
