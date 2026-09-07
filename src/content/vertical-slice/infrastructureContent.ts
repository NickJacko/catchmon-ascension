/**
 * Design owner: Document 15 Task 07.3 (Infrastructure Purchase Engine),
 * Task 07.4 (Construction Timestamp Support); Document 08 §10-14 Display
 * Capacity, §45-51 Zone 5 Expedition Hub, §66 (Document 09) "Shop Rank
 * qualifies player to build Expedition Hub" (the document's own literal
 * example, reused directly), §85-90 Construction Timing.
 *
 * Exactly 2 slice upgrades (not the full infrastructure catalog, per Task
 * 07.3's explicit instruction):
 *
 * - EXPEDITION_HUB: gates the entire Document 07 loop (§45 "supports the
 *   entire Document 07 loop") — before purchase, `START_EXPEDITION` is
 *   rejected outright (see `start-expedition.ts`). A "major capacity
 *   growth" upgrade (§86), so it uses a real construction timer, proving
 *   the offline-completion architecture Task 07.4 asks for.
 * - DISPLAY_EXPANSION: unlocks the slice's 3rd Display Unit (§10-14) —
 *   the "small functional upgrade" that does NOT need a construction
 *   timer (Task 07.4's explicit "instant provisional slice upgrade"
 *   branch), instant purchase.
 *
 * Both gate a boolean capability rather than a numeric capacity curve —
 * Document 08 leaves exact capacity formulas open, so this slice proves
 * the mechanism (own it or don't) without inventing a curve.
 */
import {
  type DisplaySlotId,
  InfrastructureId,
  UnlockRuleId,
} from "../../core/ids/index.ts";
import { toCoins } from "../../core/math/index.ts";
import { type InfrastructureDefinition } from "../../domain/shop-infrastructure/index.ts";
import {
  PROVISIONAL_DISPLAY_EXPANSION_COIN_COST,
  PROVISIONAL_DISPLAY_EXPANSION_UNLOCK_RANK,
  PROVISIONAL_EXPEDITION_HUB_COIN_COST,
  PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
} from "./balance.ts";
import { EXPEDITION_HUB_INTRO_UNLOCK_RULE } from "./progressionContent.ts";
import { PLAYABLE_DISPLAY_SLOT_IDS } from "./verticalSliceManifest.ts";

/**
 * A dedicated rule, NOT a reuse of any Task 07.2 introduction-order rule:
 * `PROVISIONAL_DISPLAY_EXPANSION_UNLOCK_RANK` is a genuinely different
 * threshold from every one of those 9 (see `balance.ts`) — reusing
 * another rule's `UnlockRuleId` here while giving it a different
 * `threshold` would silently create two inconsistent definitions sharing
 * one ID (a single-source-of-truth violation CLAUDE.md §14 forbids), even
 * though this embedded copy never enters the shared `unlockRules`
 * registry (an `InfrastructureDefinition.unlockRule` is inline content,
 * not a registry cross-reference).
 */
const DISPLAY_EXPANSION_UNLOCK_RULE_ID = UnlockRuleId.from(
  "slice-unlock-display-expansion",
);

export const EXPEDITION_HUB_INFRASTRUCTURE_ID = InfrastructureId.from(
  "slice-expedition-hub",
);
export const DISPLAY_EXPANSION_INFRASTRUCTURE_ID = InfrastructureId.from(
  "slice-display-expansion",
);

/**
 * Reuses the Task 07.2 introduction-order unlock rule OBJECT directly
 * (§66's own example: Shop Rank qualifies the player to build it) — not
 * just its ID with a re-declared condition. `EXPEDITION_HUB_INTRO_UNLOCK_
 * RULE` is the one canonical owner of this threshold; an earlier version
 * of this file re-declared the same rule ID with its own separate
 * `PROVISIONAL_EXPEDITION_HUB_UNLOCK_RANK` constant, which only
 * coincidentally matched `progressionContent.ts`'s value — a real drift
 * risk (flagged in the Phase 7 report), closed by importing the object
 * instead of duplicating it.
 */
export const EXPEDITION_HUB_INFRASTRUCTURE: InfrastructureDefinition = {
  infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID,
  displayName: "Expedition Hub (Provisional)",
  unlockRule: EXPEDITION_HUB_INTRO_UNLOCK_RULE,
  coinCost: toCoins(PROVISIONAL_EXPEDITION_HUB_COIN_COST),
  constructionDurationMs: PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
};

export const DISPLAY_EXPANSION_INFRASTRUCTURE: InfrastructureDefinition = {
  infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID,
  displayName: "Display Expansion (Provisional)",
  unlockRule: {
    unlockRuleId: DISPLAY_EXPANSION_UNLOCK_RULE_ID,
    displayName: "Display Expansion (Provisional)",
    primaryCondition: {
      type: "SHOP_RANK",
      threshold: PROVISIONAL_DISPLAY_EXPANSION_UNLOCK_RANK,
    },
  },
  coinCost: toCoins(PROVISIONAL_DISPLAY_EXPANSION_COIN_COST),
};

export const SLICE_INFRASTRUCTURE: readonly InfrastructureDefinition[] = [
  EXPEDITION_HUB_INFRASTRUCTURE,
  DISPLAY_EXPANSION_INFRASTRUCTURE,
];

const THIRD_DISPLAY_SLOT_ID = PLAYABLE_DISPLAY_SLOT_IDS[2];
if (!THIRD_DISPLAY_SLOT_ID) {
  throw new Error(
    "PLAYABLE_DISPLAY_SLOT_IDS must contain at least 3 reserved slice display slot IDs",
  );
}

/**
 * Wired into `createAssignDisplayProductHandler`'s optional
 * `slotUnlockRequirements` param — the 3rd of the slice's 3 reserved
 * display slots requires Display Expansion; the first 2 remain free from
 * game start (Document 08 §10-14: capacity grows through upgrades, but a
 * fresh shop still needs a usable starting display).
 */
export const SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS: Readonly<
  Record<DisplaySlotId, InfrastructureId>
> = {
  [THIRD_DISPLAY_SLOT_ID]: DISPLAY_EXPANSION_INFRASTRUCTURE_ID,
};
