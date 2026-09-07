import { type Coins } from "../../../core/math/index.ts";
import { type CustomerId, type ProductId } from "../../../core/ids/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";

interface ResolvedSaleEventBase {
  readonly customerId: CustomerId;
  readonly productId: ProductId;
  readonly quality: QualityGrade;
  readonly coinsEarned: Coins;
  readonly momentumDelta: number;
}

/**
 * No `coinsEarned`/`momentumDelta` — Document 05 §56: Decline yields no
 * Coins and no Momentum change. `requestedProductId`/`requestedQuality`
 * are optional since a customer can be declined even with no active
 * request (e.g. one who arrived with nothing compatible displayed).
 */
export interface CustomerDeclinedEvent {
  readonly kind: "CUSTOMER_DECLINED";
  readonly customerId: CustomerId;
  readonly requestedProductId?: ProductId;
  readonly requestedQuality?: QualityGrade;
}

export type SaleEvent =
  | ({ readonly kind: "STANDARD_SALE_RESOLVED" } & ResolvedSaleEventBase)
  | ({ readonly kind: "FAVORABLE_DEAL_RESOLVED" } & ResolvedSaleEventBase)
  | ({ readonly kind: "PREMIUM_PITCH_RESOLVED" } & ResolvedSaleEventBase)
  | ({ readonly kind: "RECOMMEND_RESOLVED" } & ResolvedSaleEventBase)
  | CustomerDeclinedEvent;
