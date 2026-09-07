import { type DisplaySlotId, type ProductId } from "../../../core/ids/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";

export type DisplayEvent =
  | {
      readonly kind: "DISPLAY_PRODUCT_ASSIGNED";
      readonly displaySlotId: DisplaySlotId;
      readonly productId: ProductId;
      readonly quality: QualityGrade;
    }
  | {
      readonly kind: "DISPLAY_SLOT_CLEARED";
      readonly displaySlotId: DisplaySlotId;
    };
