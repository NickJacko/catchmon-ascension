/**
 * Design owner: Document 15 Task 04.1 (Display Allocation), extended by
 * Task 07.3 (Infrastructure Purchase Engine — Display Expansion gate); 14
 * Technical Architecture §79 Display Stock Model; 04 Crafting & Product
 * System §70 Quality Inventory Handling; 08 §10-14 Display Capacity.
 *
 * Assigns (or re-assigns — "change product" is the same operation
 * overwriting the slot) a product+quality to a display slot. Pure
 * metadata write — no reservation (see `DisplaySlotState`'s doc comment
 * in slices.ts for why); validates that some stock of that exact
 * product+quality actually exists to show, and — if `slotUnlockRequirements`
 * names this slot — that the required infrastructure is owned first.
 * `slotUnlockRequirements` defaults to empty (no gate) so existing callers
 * that don't configure it are unaffected.
 */
import {
  type DisplaySlotId,
  type InfrastructureId,
  type ProductId,
} from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";
import {
  getAvailableQuantity,
  productItemId,
} from "../../../domain/inventory/index.ts";
import {
  type DisplaySlotState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type DisplayEvent } from "./display-events.ts";

export interface AssignDisplayProductPayload {
  readonly displaySlotId: DisplaySlotId;
  readonly productId: ProductId;
  readonly quality?: QualityGrade;
}

export function createAssignDisplayProductHandler(
  catalog: GameCatalog,
  slotUnlockRequirements: Readonly<
    Record<DisplaySlotId, InfrastructureId>
  > = {},
): CommandHandler<GameState, AssignDisplayProductPayload, DisplayEvent> {
  return (state, command) => {
    const { displaySlotId, productId } = command.payload;
    const quality: QualityGrade = command.payload.quality ?? "STANDARD";

    const requiredInfrastructureId = slotUnlockRequirements[displaySlotId];
    if (
      requiredInfrastructureId &&
      !state.infrastructure.ownedInfrastructureIds.includes(
        requiredInfrastructureId,
      )
    ) {
      return err({
        code: "DISPLAY_SLOT_LOCKED",
        message: `Display slot "${displaySlotId}" requires "${requiredInfrastructureId}" to be purchased first`,
      });
    }

    const product = catalog.products.get(productId);
    if (!product) {
      return err({
        code: "PRODUCT_NOT_FOUND",
        message: `No product "${productId}" in the catalog`,
      });
    }
    if (!product.qualityEligible && quality !== "STANDARD") {
      return err({
        code: "QUALITY_NOT_ELIGIBLE",
        message: `Product "${productId}" is not quality-eligible; only STANDARD may be displayed`,
      });
    }

    const itemId = productItemId(productId, quality);
    const available = getAvailableQuantity(state.inventory, itemId);
    if (available <= 0) {
      return err({
        code: "NO_STOCK_AVAILABLE",
        message: `No available stock of "${productId}" (${quality}) to display`,
      });
    }

    const nextSlot: DisplaySlotState = {
      displaySlotId,
      assignedProductId: productId,
      assignedQuality: quality,
    };

    const nextState: GameState = {
      ...state,
      shop: {
        ...state.shop,
        displaySlots: { ...state.shop.displaySlots, [displaySlotId]: nextSlot },
      },
    };

    return ok({
      nextState,
      events: [
        { kind: "DISPLAY_PRODUCT_ASSIGNED", displaySlotId, productId, quality },
      ],
    });
  };
}
