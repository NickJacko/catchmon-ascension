/**
 * Design owner: Document 15 Task 07.2 (Slice Unlock Rules); Document 09
 * §187-188 Unlock Condition Model, §65-66 Shop Rank Gate ("best for broad
 * system unlocks... new complexity layers").
 *
 * Data-drives the slice's feature introduction order with ascending
 * `SHOP_RANK` thresholds — "Exact thresholds: provisional central config"
 * (Task 07.2's own instruction), all centralized in `balance.ts`. These
 * records make the introduction order queryable/testable
 * (`isUnlockRuleSatisfied`); they deliberately do NOT hard-gate any
 * existing command (STANDARD_SALE, FAVORABLE_DEAL, ASSIGN_CATCHMON, ...)
 * — enforcing progressive UI/command disclosure is Phase 8 React UX
 * territory, not this task's. The one rule that DOES get real command-
 * level enforcement in this phase is `EXPEDITION_HUB` infrastructure's own
 * `unlockRule` (Task 07.3's actual purchase gate), which is separate
 * infrastructure-purchase content, not one of these 9.
 */
import { UnlockRuleId } from "../../core/ids/index.ts";
import { type UnlockRuleDefinition } from "../../domain/progression/index.ts";
import {
  PROVISIONAL_UNLOCK_THRESHOLD_STANDARD_SALE,
  PROVISIONAL_UNLOCK_THRESHOLD_MOMENTUM,
  PROVISIONAL_UNLOCK_THRESHOLD_FAVORABLE_DEAL,
  PROVISIONAL_UNLOCK_THRESHOLD_PREMIUM_PITCH,
  PROVISIONAL_UNLOCK_THRESHOLD_RECOMMEND,
  PROVISIONAL_UNLOCK_THRESHOLD_FIRST_ORDER,
  PROVISIONAL_UNLOCK_THRESHOLD_CATCHMON_ASSIGNMENT,
  PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO,
  PROVISIONAL_UNLOCK_THRESHOLD_FIRST_WORLD_ROUTE,
} from "./balance.ts";

export const UNLOCK_RULE_STANDARD_SALE_ID = UnlockRuleId.from(
  "slice-unlock-standard-sale",
);
export const UNLOCK_RULE_MOMENTUM_ID = UnlockRuleId.from(
  "slice-unlock-momentum",
);
export const UNLOCK_RULE_FAVORABLE_DEAL_ID = UnlockRuleId.from(
  "slice-unlock-favorable-deal",
);
export const UNLOCK_RULE_PREMIUM_PITCH_ID = UnlockRuleId.from(
  "slice-unlock-premium-pitch",
);
export const UNLOCK_RULE_RECOMMEND_ID = UnlockRuleId.from(
  "slice-unlock-recommend",
);
export const UNLOCK_RULE_FIRST_ORDER_ID = UnlockRuleId.from(
  "slice-unlock-first-order",
);
export const UNLOCK_RULE_CATCHMON_ASSIGNMENT_ID = UnlockRuleId.from(
  "slice-unlock-catchmon-assignment",
);
export const UNLOCK_RULE_EXPEDITION_HUB_INTRO_ID = UnlockRuleId.from(
  "slice-unlock-expedition-hub-intro",
);
export const UNLOCK_RULE_FIRST_WORLD_ROUTE_ID = UnlockRuleId.from(
  "slice-unlock-first-world-route",
);

/**
 * The single canonical `UnlockRuleDefinition` for Expedition Hub
 * introduction — exported by name (not just by ID) so
 * `infrastructureContent.ts`'s `EXPEDITION_HUB_INFRASTRUCTURE.unlockRule`
 * can reuse this exact object instead of re-declaring a second literal
 * with its own threshold constant. Before this fix, two independent
 * `UnlockRuleDefinition` object literals shared one `UnlockRuleId` but
 * were sourced from two different balance constants
 * (`PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO` here vs. the
 * now-removed `PROVISIONAL_EXPEDITION_HUB_UNLOCK_RANK` there) that only
 * happened to be equal — a genuine drift risk (Phase 7 report), closed by
 * making this the one owner both content files reference.
 */
export const EXPEDITION_HUB_INTRO_UNLOCK_RULE: UnlockRuleDefinition = {
  unlockRuleId: UNLOCK_RULE_EXPEDITION_HUB_INTRO_ID,
  displayName: "Expedition Hub (Provisional)",
  primaryCondition: {
    type: "SHOP_RANK",
    threshold: PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO,
  },
};

/**
 * Ascending introduction order, exactly as Task 07.2 lists it: Standard
 * Sale, Momentum, Favorable Deal, Premium Pitch, Recommend, first Order,
 * Catchmon assignment, Expedition Hub (introduction), first World route.
 */
export const SLICE_INTRODUCTION_UNLOCK_RULES: readonly UnlockRuleDefinition[] =
  [
    {
      unlockRuleId: UNLOCK_RULE_STANDARD_SALE_ID,
      displayName: "Standard Sale (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_STANDARD_SALE,
      },
    },
    {
      unlockRuleId: UNLOCK_RULE_MOMENTUM_ID,
      displayName: "Shop Momentum (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_MOMENTUM,
      },
    },
    {
      unlockRuleId: UNLOCK_RULE_FAVORABLE_DEAL_ID,
      displayName: "Favorable Deal (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_FAVORABLE_DEAL,
      },
    },
    {
      unlockRuleId: UNLOCK_RULE_PREMIUM_PITCH_ID,
      displayName: "Premium Pitch (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_PREMIUM_PITCH,
      },
    },
    {
      // Document 09 §20: Recommend comes after Premium Pitch — the
      // threshold ordering below enforces that directly.
      unlockRuleId: UNLOCK_RULE_RECOMMEND_ID,
      displayName: "Recommend (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_RECOMMEND,
      },
    },
    {
      unlockRuleId: UNLOCK_RULE_FIRST_ORDER_ID,
      displayName: "First Order (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_FIRST_ORDER,
      },
    },
    {
      unlockRuleId: UNLOCK_RULE_CATCHMON_ASSIGNMENT_ID,
      displayName: "Catchmon Assignment (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_CATCHMON_ASSIGNMENT,
      },
    },
    EXPEDITION_HUB_INTRO_UNLOCK_RULE,
    {
      unlockRuleId: UNLOCK_RULE_FIRST_WORLD_ROUTE_ID,
      displayName: "First World Route (Provisional)",
      primaryCondition: {
        type: "SHOP_RANK",
        threshold: PROVISIONAL_UNLOCK_THRESHOLD_FIRST_WORLD_ROUTE,
      },
    },
  ];
