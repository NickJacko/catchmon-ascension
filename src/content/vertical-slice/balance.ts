/**
 * Design owner: Document 15 Task 03.3; CLAUDE.md §13 Balance Rule ("All
 * numeric tuning belongs in centralized balance/configuration... If a
 * value is temporary: PROVISIONAL must be visible in the central config
 * and reported").
 *
 * Every numeric value below is PROVISIONAL: chosen only to be internally
 * ordered (turnover product cheaper/faster than the premium one) and to
 * exercise the crafting engine end-to-end. None of it is real economic
 * balance — Document 03 §63 Economy Simulation Requirement and §82
 * Economic Balance Dashboard are explicitly future work, not this task's.
 *
 * Recipe inputs in this slice each consume exactly
 * `PROVISIONAL_SLICE_INPUT_QUANTITY` (1) unit of every listed
 * `routineInputs`/`specialInputs` line. `RecipeDefinition` gained an
 * explicit per-input `quantity` field in the post-Task-03.3 schema
 * cleanup (it previously had none — a real, reported gap, not a silent
 * assumption); this constant preserves that same effective value rather
 * than inventing new balance now that the field exists.
 */
import { type RecipeId } from "../../core/ids/index.ts";
import {
  type BasisPoints,
  toBasisPoints,
} from "../../core/math/basis-points.ts";
import {
  type ProbabilityBps,
  toProbabilityBps,
} from "../../core/math/probability.ts";

/** PROVISIONAL: no real mastery system exists yet (Task 03.7 only adds a placeholder hook). */
export const PROVISIONAL_MASTERY_PROFILE = "slice-no-mastery-tuning";

/** PROVISIONAL: Document 04 §36 "exact queue size is a balance/progression variable" — not locked anywhere. */
export const PROVISIONAL_MAX_QUEUE_SIZE = 3;

/** PROVISIONAL: preserves this slice's original (pre-cleanup) effective per-input quantity of 1 — not new balance. */
export const PROVISIONAL_SLICE_INPUT_QUANTITY = 1;

/** PROVISIONAL: Document 05 §65 Active Customer Capacity — "exact arrival equations are deferred," no count is locked. */
export const PROVISIONAL_MAX_ACTIVE_CUSTOMERS = 3;

/** PROVISIONAL: Document 05 §64 Customer Arrival Architecture / §66 Arrival Rate vs Capacity — "exact arrival equations are deferred." */
export const PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS = 10_000;

/** PROVISIONAL: Document 05 §61 Momentum Cap — "exact values remain open." */
export const PROVISIONAL_MOMENTUM_CAP = 100;

/**
 * PROVISIONAL transaction-quote constants (Document 15 Task 04.4; Document
 * 05 §42-58). Deliberately simple/flat except where a specific later task
 * owns a refinement (Task 04.9's Recommend "configurable compatibility
 * rules" reuse Task 04.2's existing family-match logic rather than
 * inventing a richer rule now). "Exact multipliers/costs remain a balance
 * variable" per Document 05 §48/§53/§58.
 */
export const PROVISIONAL_STANDARD_SALE_MOMENTUM_GAIN = 2;
export const PROVISIONAL_FAVORABLE_DEAL_COIN_FACTOR = 0.6;
export const PROVISIONAL_PREMIUM_PITCH_COIN_FACTOR = 1.5;
export const PROVISIONAL_PREMIUM_PITCH_MOMENTUM_COST = 8;

/**
 * PROVISIONAL: Document 15 Task 04.7 — "value-aware anti-cheap-item
 * exploit scaling" for Favorable Deal (Document 05 §46: "must not enable
 * buy/craft trivial item -> infinite cheap Momentum... potential
 * determinants: base transaction value..."). Momentum gain scales with
 * the product's `baseTransactionValue` rather than a flat amount, with a
 * floor kept comfortably above `PROVISIONAL_STANDARD_SALE_MOMENTUM_GAIN`
 * so Favorable Deal remains "meaningfully higher" Momentum than Standard
 * Sale even for the cheapest slice product.
 */
export const PROVISIONAL_FAVORABLE_DEAL_MOMENTUM_RATE = 0.5;
export const PROVISIONAL_FAVORABLE_DEAL_MIN_MOMENTUM_GAIN = 3;
export const PROVISIONAL_RECOMMEND_MOMENTUM_COST = 4;

/**
 * PROVISIONAL: Document 15 Task 04.5 "award initial Shop Rank hook,"
 * completed by Task 07.1 (Shop Rank Core) — Document 09 §7 Shop Rank
 * Progress Sources ("Commerce: completed customer transactions") is now
 * read; the actual rank-up formula/thresholds live in the Phase 7 balance
 * block below, alongside every other source class's contribution amount.
 */
export const PROVISIONAL_RANK_PROGRESS_PER_SALE = 1;

/**
 * PROVISIONAL: Document 15 Task 04.11 Workshop Push; Document 04 §80
 * ("exact Momentum cost and time reduction are balancing variables") and
 * §81 Anti-Spam ("the final formula is deferred" — a flat per-push time
 * reduction alone does not prevent unlimited repeated pushes, so a simple
 * per-craft push limit is the one anti-spam tool implemented now; cost
 * scaling/diminishing-effect formulas are explicitly left to later
 * balancing). The time reduction is kept well below the slice's shortest
 * recipe duration (15s) so a single push cannot make Workshop Push "the
 * main way products are manufactured" (§80).
 */
export const PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST = 5;
export const PROVISIONAL_WORKSHOP_PUSH_TIME_REDUCTION_MS = 5_000;
export const PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT = 3;

/** PROVISIONAL: Document 05 §89 Order Board Capacity — "exact capacity is a progression variable," not locked anywhere. */
export const PROVISIONAL_MAX_ACTIVE_ORDERS = 2;

/**
 * PROVISIONAL: Document 15 Task 05.4/05.6/05.7 Catchmon capability
 * magnitudes; Document 06 §119 ("magnitude/config reference, not an
 * embedded formula" — capabilities reference a key into this table, they
 * never carry a numeric value themselves). Keyed by each
 * `CapabilityDefinition.magnitudeConfigRef` in `catchmonContent.ts`.
 * Craft-speed values are fractional duration reductions (0.15 = 15%
 * faster); "presence" capabilities (Recommend Compatibility, Demand
 * Insight) use 1 as an on/off flag since Document 06 doesn't scale them
 * numerically at Core-capability tier. None of Document 06's exact
 * magnitude numbers are specified anywhere — these are prototype values
 * only, chosen to be clearly observable in a test/harness, not tuned.
 */
export const PROVISIONAL_CAPABILITY_MAGNITUDES: Readonly<
  Record<string, number>
> = {
  "slice-craft-speed-provision-station": 0.15,
  "slice-craft-speed-fieldworks-bench": 0.15,
  "slice-recommend-compatibility-elemental-craft": 1,
  "slice-demand-insight": 1,
  "slice-discovery-boost": 0.1,
  "slice-material-efficiency": 0.1,
};

/**
 * PROVISIONAL: Document 15 Task 05.7 Shop Floor Catchmon Effect; Document
 * 06 §49 "limited Shop Floor support slots" (no exact count is given —
 * Document 08 owns Shop Floor infrastructure capacity, not read for this
 * task). One slot is enough to prove the mechanism for the slice.
 */
export const PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS = 1;
export const SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID = "slice-shop-floor-slot-01";

/**
 * PROVISIONAL: Document 15 Task 05.5 Assignment Engine; Document 06 §49
 * "limited Workshop support slots" (exact count likewise deferred to
 * Document 08).
 */
export const PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION = 1;

/**
 * PROVISIONAL: Document 15 Task 05.8 Catchmon XP; Document 06 §57 ("exact
 * XP formulas are deferred") and §60 ("level cap intentionally not
 * defined here... Document 09 will determine the curve/cap" — Document 09
 * was not read for this task, so no real curve is used). A flat XP-per-
 * level threshold and a low level cap keep the "fast early progression
 * profile" Task 05.8 asks for observable within a handful of activities.
 */
export const PROVISIONAL_XP_PER_CRAFT_COMPLETION = 10;
export const PROVISIONAL_XP_PER_SALE_RESOLUTION = 5;
export const PROVISIONAL_XP_PER_LEVEL = 20;
export const PROVISIONAL_CATCHMON_LEVEL_CAP = 10;

/** Document 15 Task 06.5: the Lead earns XP once, exactly like Workshop/Shop Floor Catchmons do on their own completion events (Task 05.8's same "observable within a handful of activities" reasoning). */
export const PROVISIONAL_XP_PER_EXPEDITION_COMPLETION = 10;

/** Document 07 §89 already-owned encounter path: "deterministic small reward, no capture roll" — deliberately smaller than a route's own guaranteed routine reward, since observing costs the player nothing (no aid, no roll, no risk). */
export const PROVISIONAL_OBSERVE_ENCOUNTER_REWARD_QUANTITY = 1;

/**
 * PROVISIONAL: Document 15 Task 05.9 Evolution Shell; Document 06 §67
 * ("exact evolution requirements remain open... potential requirement
 * classes include: Catchmon Level milestone..."). Used only by the
 * evolution architecture's own synthetic-fixture tests (Task 05.9): none
 * of the 6 real slice species has real evolution data, so this constant
 * is never exercised against real canonical content.
 */
export const PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT = 5;

export interface SliceRecipeBalance {
  readonly craftDurationMs: number;
  readonly outputQuantity: number;
  readonly baseTransactionValue: number;
}

/** PROVISIONAL — see module header. Keyed by the recipe's own string ID (recipes.ts imports `RecipeId` values as keys). */
export const SLICE_RECIPE_BALANCE: Readonly<
  Record<string, SliceRecipeBalance>
> = {
  "slice-recipe-01": {
    craftDurationMs: 15_000,
    outputQuantity: 2,
    baseTransactionValue: 4,
  },
  "slice-recipe-02": {
    craftDurationMs: 25_000,
    outputQuantity: 1,
    baseTransactionValue: 7,
  },
  "slice-recipe-03": {
    craftDurationMs: 40_000,
    outputQuantity: 1,
    baseTransactionValue: 12,
  },
  "slice-recipe-04": {
    craftDurationMs: 45_000,
    outputQuantity: 1,
    baseTransactionValue: 14,
  },
  "slice-recipe-05": {
    craftDurationMs: 90_000,
    outputQuantity: 1,
    baseTransactionValue: 30,
  },
};

export function getSliceRecipeBalance(recipeId: RecipeId): SliceRecipeBalance {
  const balance = SLICE_RECIPE_BALANCE[recipeId];
  if (!balance) {
    throw new Error(`No SLICE_RECIPE_BALANCE entry for recipe "${recipeId}"`);
  }
  return balance;
}

/**
 * PROVISIONAL: Document 15 Task 06.1-06.12 (Phase 6 World/Expedition
 * loop); Document 07 §198 explicitly lists every one of these as "exact
 * ... deferred" (slot count, duration values, reward quantities, capture
 * chance formula/floor/ceiling, protection increments, encounter
 * threshold). None of these numbers are specified anywhere in the read
 * design documents — every one is a prototype value chosen only to make
 * the loop observable/testable, not tuned balance.
 */

/** Document 07 §108-110 "exact expedition slot count is deferred" — one concurrent expedition, matching the Task 05.1 "minimum expedition prototype" (§161: "1 expedition slot"). */
export const PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS = 1;

/** Document 07 §39-41 duration bands — deliberately short so a headless test/harness doesn't need to wait real time; Supply Run < Discovery Survey < Component Hunt. */
export const PROVISIONAL_SUPPLY_RUN_DURATION_MS = 20_000;
export const PROVISIONAL_DISCOVERY_SURVEY_DURATION_MS = 30_000;
export const PROVISIONAL_COMPONENT_HUNT_DURATION_MS = 45_000;

/** Document 07 §47 Guaranteed Core Reward quantities — routine materials/regional value, never Coins. */
export const PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY = 4;
export const PROVISIONAL_DISCOVERY_SURVEY_ROUTINE_REWARD_QUANTITY = 2;
export const PROVISIONAL_COMPONENT_HUNT_ROUTINE_REWARD_QUANTITY = 2;

/**
 * Document 07 §48-50 Bonus Reward Pool / Special Component Protection —
 * deterministic weighted roll (see `domain/expeditions/rewards.ts`) with a
 * guaranteed-after-N-misses floor. Basis points (Document 14 §34's
 * `ProbabilityBps`), not a raw `0-1` float — matching every other
 * probability in this codebase (`core/math/probability.ts`); an earlier
 * draft of this constant used a raw float, which was a real
 * unit-consistency bug caught before any reward-roll logic consumed it.
 */
export const PROVISIONAL_COMPONENT_HUNT_BONUS_CHANCE: ProbabilityBps =
  toProbabilityBps(3500);
export const PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD = 3;

/**
 * Document 07 §74/§135-138 Capture Chance inputs/floor/ceiling, all in
 * basis points (see the unit-consistency note above). `PROVISIONAL_BASE_
 * CAPTURE_CHANCE`/`_FLOOR`/`_CEILING` are themselves valid probabilities
 * (`ProbabilityBps`, bounded `[0, 10000]`); `PROVISIONAL_CAPTURE_AID_BONUS`
 * is an additive modifier stacked onto a probability before clamping, so
 * it is the more general `BasisPoints` (Document 14 §33: a modifier may
 * legitimately need headroom past what a bounded probability allows).
 */
export const PROVISIONAL_BASE_CAPTURE_CHANCE: ProbabilityBps =
  toProbabilityBps(3500);
export const PROVISIONAL_CAPTURE_AID_BONUS: BasisPoints = toBasisPoints(2500);
export const PROVISIONAL_CAPTURE_CHANCE_FLOOR: ProbabilityBps =
  toProbabilityBps(1000);
export const PROVISIONAL_CAPTURE_CHANCE_CEILING: ProbabilityBps =
  toProbabilityBps(9500);

/** Document 07 §82-83 Capture Protection — a flat additive bonus (basis points) per prior failed capture attempt against the same line, reset to 0 on success. Not spendable/transferable (§83) — purely a per-line counter. */
export const PROVISIONAL_CAPTURE_PROTECTION_BONUS_PER_FAILURE: BasisPoints =
  toBasisPoints(1000);

/**
 * PROVISIONAL: Document 15 Task 07.1 (Shop Rank Core); Document 09 §7
 * Shop Rank Progress Sources lists five source classes (Commerce, Orders,
 * Craftsmanship, Collection, World) and explicitly defers "exact
 * contribution values." `PROVISIONAL_RANK_PROGRESS_PER_SALE` (Commerce)
 * already existed from Task 04.5 — the four new constants below complete
 * the remaining source classes, each wired into its one natural existing
 * completion event rather than inventing new "first-time" tracking
 * Document 09 does not concretely specify (see `complete-order.ts`,
 * `craft-queue-reconciliation-pass.ts`, `attempt-capture.ts`,
 * `expedition-reconciliation-pass.ts`). Weighted so one-time-feeling
 * events (a new Catchmon line, a completed expedition) contribute more
 * than repeatable/grindable ones (a single sale, a single craft) — §8
 * "Shop Rank Should Not Be Farmed By One Trivial Action," approximated
 * without inventing diminishing-returns tracking the document doesn't
 * specify either.
 */
export const PROVISIONAL_RANK_PROGRESS_PER_ORDER_COMPLETION = 3;
export const PROVISIONAL_RANK_PROGRESS_PER_CRAFT_COMPLETION = 1;
export const PROVISIONAL_RANK_PROGRESS_PER_CAPTURE = 10;
export const PROVISIONAL_RANK_PROGRESS_PER_EXPEDITION_COMPLETION = 5;

/** Document 09 §6 "one primary meter is enough" / §59 (Catchmon Level's own precedent) — a flat progress-per-rank threshold and a bounded rank cap, mirroring `PROVISIONAL_XP_PER_LEVEL`/`PROVISIONAL_CATCHMON_LEVEL_CAP` exactly (see `domain/progression/shop-rank.ts`'s module doc for why reusing that shape is not an invented formula). */
export const PROVISIONAL_RANK_PROGRESS_PER_RANK = 20;
export const PROVISIONAL_SHOP_RANK_CAP = 10;

/**
 * PROVISIONAL: Document 15 Task 07.2 (Slice Unlock Rules) — "exact
 * thresholds: provisional central config." One ascending Shop Rank
 * threshold per introduction-order item; see
 * `content/vertical-slice/progressionContent.ts` for the `UnlockRuleDefinition`
 * records that consume these.
 */
export const PROVISIONAL_UNLOCK_THRESHOLD_STANDARD_SALE = 1;
export const PROVISIONAL_UNLOCK_THRESHOLD_MOMENTUM = 1;
export const PROVISIONAL_UNLOCK_THRESHOLD_FAVORABLE_DEAL = 2;
export const PROVISIONAL_UNLOCK_THRESHOLD_PREMIUM_PITCH = 2;
export const PROVISIONAL_UNLOCK_THRESHOLD_RECOMMEND = 3;
export const PROVISIONAL_UNLOCK_THRESHOLD_FIRST_ORDER = 3;
export const PROVISIONAL_UNLOCK_THRESHOLD_CATCHMON_ASSIGNMENT = 4;
export const PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO = 5;
export const PROVISIONAL_UNLOCK_THRESHOLD_FIRST_WORLD_ROUTE = 5;

/**
 * PROVISIONAL: Ozean Batch A — Document 09 §54 Region Progression Model,
 * "Global Readiness" half of Ozean's real two-signal unlock rule (the
 * "World Readiness" half is a `EXPEDITION_MILESTONE` condition on a
 * Vulkankrater route, not a Shop Rank number — see `worldContent.ts`'s
 * `OZEAN_UNLOCK_RULE`). Set one step past `FIRST_WORLD_ROUTE` so a second
 * region cannot become reachable before the first region's own basic loop
 * has been introduced.
 */
export const PROVISIONAL_UNLOCK_THRESHOLD_OZEAN_REGION = 6;

/**
 * PROVISIONAL: Document 15 Task 07.3 (Infrastructure Purchase Engine);
 * Document 08 §66 (Document 09) "Shop Rank qualifies player to build
 * Expedition Hub" — the document's own literal example, directly reused
 * rather than inventing a different gate. §85-86 "major
 * capacity growth" warrants a construction timer for the Expedition Hub;
 * Display Expansion is the "small functional upgrade" that does not
 * (Task 07.4: "architecture can exist with instant provisional slice
 * upgrade" for the one that doesn't need construction time proven).
 * The Expedition Hub's unlock RANK threshold is not duplicated here —
 * `PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO` below is its one
 * canonical value, reused directly by `progressionContent.ts`'s
 * `EXPEDITION_HUB_INTRO_UNLOCK_RULE` and, in turn, by
 * `infrastructureContent.ts`'s `EXPEDITION_HUB_INFRASTRUCTURE.unlockRule`
 * (fixing a drift risk the Phase 7 report flagged: a second, independent
 * `PROVISIONAL_EXPEDITION_HUB_UNLOCK_RANK` constant used to exist here and
 * only coincidentally matched).
 */
export const PROVISIONAL_EXPEDITION_HUB_COIN_COST = 200;
export const PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS = 30_000;
export const PROVISIONAL_DISPLAY_EXPANSION_UNLOCK_RANK = 2;
export const PROVISIONAL_DISPLAY_EXPANSION_COIN_COST = 50;

/**
 * PROVISIONAL starter package (Phase 8 exit-gate fix): a fresh save
 * starts with 0 Coins and empty inventory, and this slice has no
 * material-purchase command — the only other material source is an
 * Expedition, which itself requires the Expedition Hub, which requires
 * Shop Rank 5. Without a starter package, `NEW GAME` cannot craft
 * anything and is permanently soft-locked. Per the design decision that
 * closed this gap: do not lower the Hub's unlock threshold or Coin cost,
 * do not seed completed products/Special Components/Momentum/a large
 * Coin balance — seed only routine materials already consumed by the
 * existing starter recipes (`craftingContent.ts`'s recipes 01-04; recipe
 * 05 needs `SLICE_COMPONENT_A` and is NOT part of the guaranteed path —
 * see below).
 *
 * DERIVATION (every number traces to an existing constant above):
 * - Shop Rank formula (`domain/progression/shop-rank.ts`):
 *   `rank = floor(rankProgress / PROVISIONAL_RANK_PROGRESS_PER_RANK) + 1`.
 *   Reaching the Expedition Hub's rank threshold
 *   (`PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO` = 5) needs
 *   cumulative `rankProgress >= 4 * PROVISIONAL_RANK_PROGRESS_PER_RANK`
 *   = 4 * 20 = 80.
 * - Every craft completion grants `PROVISIONAL_RANK_PROGRESS_PER_CRAFT_
 *   COMPLETION` (1); every resolved sale (Standard/Favorable/Premium/
 *   Recommend all share `applyRequestSaleEffect`) grants
 *   `PROVISIONAL_RANK_PROGRESS_PER_SALE` (1). Recipe 01 ("Turnover")
 *   consumes 1 `SLICE_RESOURCE_A` and outputs 2 units (its
 *   `outputQuantity`), so ONE material unit routed through recipe 01
 *   yields 1 (craft) + 2 (two separate 1-unit sales) = 3 rankProgress —
 *   the *intended* path (its own name and "everyday" demand tag mark it
 *   as the designed starter loop). Recipes 02/03/04 output only 1 unit
 *   per material, yielding 2 rankProgress per material unit — the
 *   worst-case *reasonable* single-recipe choice (a player who only ever
 *   crafts the "Higher Value" or "Field Gear" recipe instead of the
 *   Turnover one). Everyday Orders (`orderContent.ts`) grant
 *   `PROVISIONAL_RANK_PROGRESS_PER_ORDER_COMPLETION` (3) per completed
 *   order using the SAME crafted stock, so a normal player who also uses
 *   the order board needs strictly *less* material than this bound —
 *   this derivation intentionally ignores that upside as extra headroom.
 * - Minimum material for the intended path (recipe 01 only):
 *   `ceil(80 / 3) = 27` units of `SLICE_RESOURCE_A`.
 * - Minimum material for the worst-case reasonable path (recipe 02/03/04
 *   only): `ceil(80 / 2) = 40` units.
 * - `PROVISIONAL_STARTER_RESOURCE_A_QUANTITY` (50) = the worst-case bound
 *   (40) plus a ~25% recovery margin (+10), so even a save that only
 *   ever used the least-efficient reasonable recipe still clears rank 5
 *   with 10 spare material units (20 spare rankProgress) rather than
 *   landing exactly on the threshold. `SLICE_RESOURCE_A`-based recipes
 *   also cover the Hub's Coin cost long before rank 5: recipe 01 alone
 *   nets 2 * `SLICE_RECIPE_BALANCE["slice-recipe-01"].baseTransactionValue`
 *   = 8 Coins per material unit via Standard Sale, so the minimum
 *   27-unit path already earns 216 Coins, comfortably above
 *   `PROVISIONAL_EXPEDITION_HUB_COIN_COST` (200) — no separate Coin
 *   seed is mathematically required (requirement: starting Coins stay 0).
 * - `PROVISIONAL_STARTER_RESOURCE_B_QUANTITY` (20) is NOT load-bearing
 *   for the guaranteed path above — `SLICE_RESOURCE_A` alone reaches
 *   rank 5 regardless of whether the player crafts recipe 01 or 02, and
 *   `PROVISIONS` (Product 01/02's family) is a preferred-or-secondary
 *   family for every slice customer archetype (`customerContent.ts`), so
 *   it can always be sold via Recommend even to a customer who requested
 *   something else. This second, smaller allowance exists only so the
 *   FIELDWORKS_BENCH station and its Field Gear recipes (03/04) and
 *   Everyday Order 02 are not completely unusable before the first
 *   Expedition restocks it — a normal player is expected to explore both
 *   station families (CLAUDE.md §33's "2 visually represented station
 *   families"), not because the math requires it.
 * - No Special Component is seeded: recipe 05 is the only starter recipe
 *   that needs one, and recipes 01-04 already provide a complete
 *   guaranteed path without it (requirement 6's "unavoidable" condition
 *   does not apply — this is not reported as a content-design problem).
 */
export const PROVISIONAL_STARTER_RESOURCE_A_QUANTITY = 50;
export const PROVISIONAL_STARTER_RESOURCE_B_QUANTITY = 20;
