/**
 * Design owner: Document 15 Task 04.4 (Transaction Quote Engine); 05
 * Customer & Selling System §42 Standard Sale, §44-46 Favorable Deal, §47-50
 * Premium Pitch, §51-55 Recommend, §56-58 Decline / Transaction Action
 * Summary; 14 Technical Architecture §89 Quote Query.
 *
 * One canonical read-only query — `getCustomerTransactionOptions` — used
 * by both React (to render options) and the sale/deal/pitch/recommend
 * commands (Tasks 04.5, 04.7-04.9) to validate before mutating (Document
 * 05 §54: "do not make recommendation a blind reroll" — a command should
 * re-derive/compare against this same quote, not trust stale UI state).
 * Most formulas here are intentionally simple/flat; Favorable Deal's
 * Momentum gain is value-aware (Task 04.7's anti-cheap-item exploit
 * scaling — Document 05 §46) — see `favorableDealMomentumGain` below and
 * `balance.ts`'s header. Task 04.9's Recommend compatibility rule is
 * still the simple family-match reused from Task 04.2.
 */
import {
  type Coins,
  multiplyAndRound,
  toCoins,
} from "../../../core/math/index.ts";
import {
  type CustomerId,
  type DisplaySlotId,
  type ProductId,
} from "../../../core/ids/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";
import { type MagnitudeTable } from "../../../domain/catchmons/index.ts";
import {
  getAvailableQuantity,
  productItemId,
} from "../../../domain/inventory/index.ts";
import {
  type CustomerRuntimeState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  PROVISIONAL_FAVORABLE_DEAL_COIN_FACTOR,
  PROVISIONAL_FAVORABLE_DEAL_MIN_MOMENTUM_GAIN,
  PROVISIONAL_FAVORABLE_DEAL_MOMENTUM_RATE,
  PROVISIONAL_PREMIUM_PITCH_COIN_FACTOR,
  PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
  PROVISIONAL_RECOMMEND_MOMENTUM_COST,
  PROVISIONAL_STANDARD_SALE_MOMENTUM_GAIN,
} from "../../../content/vertical-slice/balance.ts";
import { roundToInteger } from "../../../core/math/index.ts";

/**
 * Document 15 Task 04.7: "value-aware anti-cheap-item exploit scaling."
 * Momentum gain scales with the product's own value rather than being a
 * flat amount regardless of what was sold (Document 05 §46).
 */
function favorableDealMomentumGain(baseValue: number): number {
  return Math.max(
    PROVISIONAL_FAVORABLE_DEAL_MIN_MOMENTUM_GAIN,
    roundToInteger(baseValue * PROVISIONAL_FAVORABLE_DEAL_MOMENTUM_RATE),
  );
}
import {
  getDisplayedProducts,
  type DisplayedProductView,
} from "../display/index.ts";
import { getShopFloorRecommendCompatibilityEffect } from "../catchmons/index.ts";

export type TransactionDisabledReason =
  | "CUSTOMER_NOT_FOUND"
  | "NO_REQUEST"
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_MOMENTUM";

export interface TransactionOutcome {
  readonly eligible: boolean;
  readonly disabledReason?: TransactionDisabledReason;
  readonly finalCoins: Coins;
  readonly momentumDelta: number;
}

export interface RecommendCandidate {
  readonly productId: ProductId;
  readonly quality: QualityGrade;
  readonly outcome: TransactionOutcome;
}

export interface CustomerTransactionOptions {
  readonly customerId: CustomerId;
  readonly standardSale: TransactionOutcome;
  readonly favorableDeal: TransactionOutcome;
  readonly premiumPitch: TransactionOutcome;
  readonly recommendCandidates: readonly RecommendCandidate[];
}

const NOT_FOUND: TransactionOutcome = {
  eligible: false,
  disabledReason: "CUSTOMER_NOT_FOUND",
  finalCoins: toCoins(0),
  momentumDelta: 0,
};

/** Shared eligibility gate for Standard Sale / Favorable Deal / Premium Pitch — all three sell the customer's *own* request. */
function requestEligibility(
  state: GameState,
  productId: ProductId | undefined,
  quality: QualityGrade | undefined,
  requiresMomentum: number,
): TransactionDisabledReason | null {
  if (productId === undefined || quality === undefined) {
    return "NO_REQUEST";
  }
  const itemId = productItemId(productId, quality);
  if (getAvailableQuantity(state.inventory, itemId) < 1) {
    return "OUT_OF_STOCK";
  }
  if (state.shop.momentum < requiresMomentum) {
    return "INSUFFICIENT_MOMENTUM";
  }
  return null;
}

export function getCustomerTransactionOptions(
  state: GameState,
  customerId: CustomerId,
  catalog: GameCatalog,
  displaySlotIds: readonly DisplaySlotId[],
  catchmonCapabilityMagnitudes: MagnitudeTable = {},
): CustomerTransactionOptions {
  const customer = state.customers.customers[customerId];
  if (!customer) {
    return {
      customerId,
      standardSale: NOT_FOUND,
      favorableDeal: NOT_FOUND,
      premiumPitch: NOT_FOUND,
      recommendCandidates: [],
    };
  }

  const product =
    customer.requestedProductId !== undefined
      ? catalog.products.get(customer.requestedProductId)
      : undefined;
  const baseValue = product?.baseTransactionValue ?? 0;

  const standardReason = requestEligibility(
    state,
    customer.requestedProductId,
    customer.requestedQuality,
    0,
  );
  const standardSale: TransactionOutcome = standardReason
    ? {
        eligible: false,
        disabledReason: standardReason,
        finalCoins: toCoins(0),
        momentumDelta: PROVISIONAL_STANDARD_SALE_MOMENTUM_GAIN,
      }
    : {
        eligible: true,
        finalCoins: toCoins(baseValue),
        momentumDelta: PROVISIONAL_STANDARD_SALE_MOMENTUM_GAIN,
      };

  const favorableReason = requestEligibility(
    state,
    customer.requestedProductId,
    customer.requestedQuality,
    0,
  );
  const favorableDeal: TransactionOutcome = favorableReason
    ? {
        eligible: false,
        disabledReason: favorableReason,
        finalCoins: toCoins(0),
        momentumDelta: favorableDealMomentumGain(baseValue),
      }
    : {
        eligible: true,
        finalCoins: toCoins(
          multiplyAndRound(baseValue, PROVISIONAL_FAVORABLE_DEAL_COIN_FACTOR),
        ),
        momentumDelta: favorableDealMomentumGain(baseValue),
      };

  const premiumReason = requestEligibility(
    state,
    customer.requestedProductId,
    customer.requestedQuality,
    PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
  );
  const premiumPitch: TransactionOutcome = premiumReason
    ? {
        eligible: false,
        disabledReason: premiumReason,
        finalCoins: toCoins(0),
        momentumDelta: -PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
      }
    : {
        eligible: true,
        finalCoins: toCoins(
          multiplyAndRound(baseValue, PROVISIONAL_PREMIUM_PITCH_COIN_FACTOR),
        ),
        momentumDelta: -PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST,
      };

  const recommendCandidates = buildRecommendCandidates(
    state,
    customer,
    catalog,
    displaySlotIds,
    catchmonCapabilityMagnitudes,
  );

  return {
    customerId,
    standardSale,
    favorableDeal,
    premiumPitch,
    recommendCandidates,
  };
}

/**
 * Document 15 Task 05.7 Shop Floor Catchmon Effect: an assigned Shop
 * Floor Catchmon with a `RECOMMEND_COMPATIBILITY` capability widens which
 * families count as compatible beyond the customer archetype's own
 * preferred/secondary families (Document 05 §52's "customer special
 * rule" compatibility factor) — a real, visible change to this query's
 * output, not a Coin/Momentum shortcut (Task 05.7: "not a passive
 * free-money printer").
 */
function buildRecommendCandidates(
  state: GameState,
  customer: CustomerRuntimeState,
  catalog: GameCatalog,
  displaySlotIds: readonly DisplaySlotId[],
  catchmonCapabilityMagnitudes: MagnitudeTable,
): readonly RecommendCandidate[] {
  const archetype = catalog.customerArchetypes.get(customer.archetypeId);
  if (!archetype) {
    return [];
  }

  const compatibleFamilies = new Set([
    ...archetype.preferredFamilies,
    ...archetype.secondaryFamilies,
  ]);
  const shopFloorEffect = getShopFloorRecommendCompatibilityEffect(
    state,
    catalog,
    catchmonCapabilityMagnitudes,
  );
  if (shopFloorEffect) {
    compatibleFamilies.add(shopFloorEffect.extraCompatibleFamily);
  }

  const displayed: readonly DisplayedProductView[] = getDisplayedProducts(
    state,
    displaySlotIds,
  );

  const candidates: RecommendCandidate[] = [];
  for (const view of displayed) {
    if (
      view.productId === customer.requestedProductId &&
      view.quality === customer.requestedQuality
    ) {
      continue; // Document 05 §51: Recommend redirects toward a *different* product.
    }
    const product = catalog.products.get(view.productId);
    if (!product || !compatibleFamilies.has(product.family)) {
      continue; // Document 05 §52: must satisfy an understandable compatibility rule.
    }

    const eligible =
      view.availableQuantity >= 1 &&
      state.shop.momentum >= PROVISIONAL_RECOMMEND_MOMENTUM_COST;
    candidates.push({
      productId: view.productId,
      quality: view.quality,
      outcome: eligible
        ? {
            eligible: true,
            finalCoins: toCoins(product.baseTransactionValue),
            momentumDelta: -PROVISIONAL_RECOMMEND_MOMENTUM_COST,
          }
        : {
            eligible: false,
            disabledReason:
              view.availableQuantity < 1
                ? "OUT_OF_STOCK"
                : "INSUFFICIENT_MOMENTUM",
            finalCoins: toCoins(0),
            momentumDelta: -PROVISIONAL_RECOMMEND_MOMENTUM_COST,
          },
    });
  }
  return candidates;
}
