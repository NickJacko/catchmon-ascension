/**
 * Design owner: Document 15 Phase 11 — "multiple customer archetypes,
 * multiple infrastructure/progression unlocks." Generated, not
 * hand-authored, mirroring `content/vertical-slice/{customerContent,
 * infrastructureContent,progressionContent,orderContent}.ts`'s combined
 * shape at scale.
 */
import { type CustomerArchetypeDefinition } from "../../domain/customers/index.ts";
import { type InfrastructureDefinition } from "../../domain/shop-infrastructure/index.ts";
import { type UnlockRuleDefinition } from "../../domain/progression/index.ts";
import { type EverydayOrderDefinition } from "../../domain/orders/index.ts";
import { toCoins } from "../../core/math/index.ts";
import { InfrastructureId } from "../../core/ids/index.ts";
import { SCALE_PLACEHOLDER_ASSET_ID } from "./assets.ts";
import { SCALE_PRODUCTS } from "./crafting.ts";
import {
  customerArchetypeIdForIndex,
  infrastructureIdForIndex,
  orderIdForIndex,
  pad,
  progressionUnlockRuleIdForIndex,
  SCALE_CUSTOMER_ARCHETYPE_COUNT,
  SCALE_INFRASTRUCTURE_COUNT,
  SCALE_ORDER_COUNT,
  SCALE_PRODUCT_FAMILIES,
  SCALE_PROGRESSION_UNLOCK_COUNT,
} from "./manifest.ts";

const CUSTOMER_LAYERS = [
  "WALK_IN",
  "FOCUSED",
  "SPECIAL_VISITOR",
  "COMMISSION_CLIENT",
] as const;

export const SCALE_CUSTOMER_ARCHETYPES: readonly CustomerArchetypeDefinition[] =
  Array.from(
    { length: SCALE_CUSTOMER_ARCHETYPE_COUNT },
    (_, i): CustomerArchetypeDefinition => {
      const n = i + 1;
      const preferred =
        SCALE_PRODUCT_FAMILIES[i % SCALE_PRODUCT_FAMILIES.length]!;
      const secondary =
        SCALE_PRODUCT_FAMILIES[(i + 1) % SCALE_PRODUCT_FAMILIES.length]!;
      return {
        customerArchetypeId: customerArchetypeIdForIndex(n),
        displayName: `Scale Fixture Customer ${pad(n)}`,
        customerLayer: CUSTOMER_LAYERS[i % CUSTOMER_LAYERS.length]!,
        preferredFamilies: [preferred],
        secondaryFamilies: [secondary],
        portraitAssetId: SCALE_PLACEHOLDER_ASSET_ID,
      };
    },
  );

export const SCALE_INFRASTRUCTURE: readonly InfrastructureDefinition[] =
  Array.from(
    { length: SCALE_INFRASTRUCTURE_COUNT },
    (_, i): InfrastructureDefinition => {
      const n = i + 1;
      const hasConstruction = n % 2 === 0;
      return {
        infrastructureId: infrastructureIdForIndex(n),
        displayName: `Scale Fixture Infrastructure ${pad(n)}`,
        unlockRule: {
          unlockRuleId: progressionUnlockRuleIdForIndex(100 + n),
          displayName: `Scale Fixture Infrastructure Unlock ${pad(n)}`,
          primaryCondition: { type: "SHOP_RANK", threshold: n },
        },
        coinCost: toCoins(50 * n),
        ...(hasConstruction ? { constructionDurationMs: 5_000 * n } : {}),
      };
    },
  );

/** One arbitrary scale infrastructure entry the harness can purchase to exercise `PURCHASE_INFRASTRUCTURE` + construction reconciliation end to end. */
export const SCALE_PRIMARY_INFRASTRUCTURE_ID: InfrastructureId =
  infrastructureIdForIndex(1);

/**
 * A pure "introduction order" ladder, same role as the Vertical Slice's
 * `SLICE_INTRODUCTION_UNLOCK_RULES` — registered in the catalog's
 * `unlockRules` array, not hard-enforced by any command. A couple of
 * entries deliberately use condition types `evaluateUnlockCondition` does
 * NOT implement yet (`REGION_STATE`, `CATCHMON_OWNED`) to prove — per the
 * Phase 11 architecture audit — that an unresolved condition type builds
 * and evaluates (conservatively `false`) rather than crashing the catalog
 * or the evaluator at scale.
 */
export const SCALE_PROGRESSION_UNLOCK_RULES: readonly UnlockRuleDefinition[] =
  Array.from(
    { length: SCALE_PROGRESSION_UNLOCK_COUNT },
    (_, i): UnlockRuleDefinition => {
      const n = i + 1;
      const useUnimplementedConditionType = n % 5 === 0;
      return {
        unlockRuleId: progressionUnlockRuleIdForIndex(n),
        displayName: `Scale Fixture Progression Unlock ${pad(n)}`,
        primaryCondition: useUnimplementedConditionType
          ? {
              type: "REGION_STATE",
              subjectId: `scale-region-${pad((i % 17) + 1)}`,
              state: "DISCOVERED",
            }
          : { type: "SHOP_RANK", threshold: n },
      };
    },
  );

export const SCALE_EVERYDAY_ORDERS: readonly EverydayOrderDefinition[] =
  Array.from({ length: SCALE_ORDER_COUNT }, (_, i): EverydayOrderDefinition => {
    const n = i + 1;
    const product = SCALE_PRODUCTS[(n * 7) % SCALE_PRODUCTS.length]!;
    return {
      orderId: orderIdForIndex(n),
      displayName: `Scale Fixture Order ${pad(n)}`,
      productId: product.productId,
      quality: "STANDARD",
      quantity: 1,
      rewardCoins: toCoins(product.baseTransactionValue * 2),
    };
  });
