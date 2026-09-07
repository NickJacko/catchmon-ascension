import {
  type CustomerArchetypeId,
  type CustomerId,
  type ProductId,
} from "../../../core/ids/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";

export type CustomerEvent = {
  readonly kind: "CUSTOMER_ARRIVED";
  readonly customerId: CustomerId;
  readonly archetypeId: CustomerArchetypeId;
  readonly requestedProductId?: ProductId;
  readonly requestedQuality?: QualityGrade;
};
