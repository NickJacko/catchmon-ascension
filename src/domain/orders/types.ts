/**
 * Design owner: Document 05 §84-93 (Everyday Order); Document 15 Task
 * 04.12 (Simple Everyday Order).
 *
 * Type-only module: the Everyday Order commands/queries retired for
 * Catchmon Ascension (docs/rebuild/15 Phase R5 retirement batch — no
 * KEEP/ADAPT dependents; see docs/rebuild/R1_DEPENDENCY_AUDIT.md §5
 * update). `EverydayOrderDefinition` itself stays because two things
 * still reference it structurally: `GameCatalog`'s `everydayOrders`
 * registry category (always empty for Ascension content, but still part
 * of the generic catalog surface) and `content/scale-fixture/shop.ts`'s
 * separate, still-active synthetic scale-validation content (not live
 * gameplay — see that module's own doc).
 */
import { type OrderId, type ProductId } from "../../core/ids/index.ts";
import { type Coins } from "../../core/math/index.ts";
import { type QualityGrade } from "../crafting/index.ts";

export interface EverydayOrderDefinition {
  readonly orderId: OrderId;
  readonly displayName: string;
  readonly productId: ProductId;
  readonly quality: QualityGrade;
  readonly quantity: number;
  readonly rewardCoins: Coins;
}
