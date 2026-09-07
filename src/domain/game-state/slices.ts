/**
 * Design owner: 14 Technical Architecture §72-114 (Inventory, Crafting,
 * Customer, Catchmon, Expedition, World, Progression, and Infrastructure
 * state models) — Document 14's own technical synthesis of Documents
 * 02-08's mutable-state needs (CLAUDE.md §4: "For software architecture:
 * Document 14 is authoritative").
 *
 * Every slice here is v1: a minimal, directly traceable shape, not a
 * final/complete model. Several sub-shapes are intentionally left as
 * `string`/generic where the read sections explicitly say "exact fields
 * adapt" or don't detail a sub-shape (Orders' state, in particular, is
 * not detailed anywhere in §72-114 beyond appearing in the registry
 * list — kept minimal rather than invented).
 *
 * No gameplay logic lives here — plain serializable data only.
 */
import {
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type ComponentId,
  type CustomerArchetypeId,
  type CustomerId,
  type DisplaySlotId,
  type EncounterId,
  type ExpeditionId,
  type InfrastructureId,
  type ItemId,
  type OrderId,
  type OwnedCatchmonId,
  type ProductId,
  type RecipeId,
  type RegionId,
  type RelicArchetypeId,
  type RelicInstanceId,
  type ReservationId,
  type RouteId,
  type SkillId,
  type StageId,
  type StationId,
} from "../../core/ids/index.ts";
import { type Coins, type DurationMs } from "../../core/math/index.ts";
import { type Seed } from "../../core/random/index.ts";
import { type TimestampMs } from "../../core/time/index.ts";
import { type BattlePathId } from "../combat/types.ts";
import { type QualityGrade, type StationArchetype } from "../crafting/index.ts";
import {
  type AffixType,
  type RelicMatrixSlot,
  type RelicRarity,
} from "../forge/types.ts";
import { type DiscoveryStatus } from "../world/discovery.ts";

// ---- Economy (Document 14 §32 Coins; no other economy state detailed) ----

export interface EconomyState {
  readonly coins: Coins;
}

// ---- Shop (Document 14 §90 Shop Momentum, §79 Display Stock Model) ----

/**
 * A shop-floor display slot (Document 15 Task 04.1). Pure metadata — no
 * inventory reservation is held here (Document 14 §79 explicitly allows
 * "metadata" as the implementation instead of a reservation): the display
 * only records *which* product/quality is being shown, and "how much is
 * available to sell" is answered live via the canonical inventory query
 * (`getAvailableQuantity`) against that assignment's derived `ItemId`, not
 * a separately-tracked reserved amount. This avoids a reservation model
 * that would need *partial* consumption (selling 1 of a 5-unit display
 * reservation) — `consumeReservation` (Task 03.2) only ever consumes a
 * reservation in full.
 */
export interface DisplaySlotState {
  readonly displaySlotId: DisplaySlotId;
  readonly assignedProductId?: ProductId;
  readonly assignedQuality?: QualityGrade;
}

/**
 * `shopFloorSupportCatchmonIds` is a Task 05.5 completion: Document 06
 * §49 "limited Shop Floor support slots" needs somewhere to live,
 * mirroring `StationState.supportCatchmonIds`'s existing Workshop-side
 * pattern. `OwnedCatchmonState.currentAssignment` stays the single
 * source of truth for *whether* a Catchmon is on Shop Floor duty
 * (Document 14 §94) — this is a synced lookup cache the assignment
 * command keeps in step with it, same relationship `StationState`
 * already has.
 */
export interface ShopState {
  readonly momentum: number;
  readonly displaySlots: Readonly<Record<DisplaySlotId, DisplaySlotState>>;
  readonly shopFloorSupportCatchmonIds: readonly OwnedCatchmonId[];
}

// ---- Inventory (Document 14 §72-79) ----

/** Document 14 §75. Exact classification may adapt. */
export type ReservationOwnerType =
  "CRAFT_QUEUE" | "ORDER" | "EXPEDITION" | "DISPLAY" | "MANUAL";

/** Document 14 §73. */
export interface InventoryStack {
  readonly itemId: ItemId;
  readonly quality?: QualityGrade;
  readonly quantity: number;
}

/** Document 14 §74. `ownerId` is a generic string: the concrete ID type depends on `ownerType`. */
export interface Reservation {
  readonly reservationId: ReservationId;
  readonly ownerType: ReservationOwnerType;
  readonly ownerId: string;
  readonly items: readonly {
    readonly itemId: ItemId;
    readonly quantity: number;
  }[];
  readonly createdAtMs: TimestampMs;
}

export interface InventoryState {
  readonly stacks: Readonly<Record<ItemId, InventoryStack>>;
  readonly reservations: Readonly<Record<ReservationId, Reservation>>;
}

// ---- Crafting (Document 14 §80-84) ----

/**
 * Document 14 §81, §152. `durationMs` is stored explicitly (Document 15
 * Task 03.5 "snapshotted duration") even though it equals
 * `completesAtMs - startedAtMs` — the point of a snapshot is that later
 * balance changes to the recipe's `craftDuration` must not retroactively
 * alter a craft already in progress (§152 "Active Activity Content
 * Snapshots"), which reading it back out of this fixed field guarantees
 * without recomputing anything from current content. `supportEffectSnapshot`
 * is a placeholder only (Task 03.5's other deliverable): no Catchmon
 * crafting-support-effect system exists yet (that is Phase 5+ /
 * Document 06 territory) — always absent in Phase 3, reserved for
 * whichever later task adds one, so an in-progress craft can snapshot
 * whatever was active at start rather than reading it live.
 */
/**
 * `workshopPushCount` is a Task 04.11 completion: Workshop Push (Document
 * 04 §80-81) needs a per-craft push counter to bound how many times a
 * single craft can be accelerated ("anti-spam" — a flat per-push time
 * reduction alone does not prevent unlimited repeated pushes). Absent
 * means zero — every existing construction site (`START_CRAFT`, queue
 * promotion) is unaffected and does not need updating.
 */
export interface CraftActivitySnapshot {
  readonly recipeId: RecipeId;
  readonly startedAtMs: TimestampMs;
  readonly completesAtMs: TimestampMs;
  readonly durationMs: DurationMs;
  readonly qualityRollSeed: Seed;
  readonly reservationId: ReservationId;
  readonly supportEffectSnapshot?: Readonly<Record<string, unknown>>;
  readonly workshopPushCount?: number;
}

/**
 * A craft waiting behind the active one (Document 14 §80 "queuedCraftIds[]").
 * Task 01.8's original `queuedCraftIds: readonly string[]` had no way to
 * recover which recipe/reservation a queued entry referred to once craft
 * commands (Task 03.4) needed to actually promote one to active — this is
 * that same conceptual field, completed with the detail a real queue
 * needs, not a new structural concept.
 */
export interface QueuedCraftSnapshot {
  readonly craftId: string;
  readonly recipeId: RecipeId;
  readonly reservationId: ReservationId;
  readonly queuedAtMs: TimestampMs;
}

/**
 * Document 14 §80. `archetype` is likewise a Task 03.4 completion: a craft
 * command must validate "station capability" (Document 15 Task 03.4) —
 * i.e. that the requested recipe's `stationType` matches this station —
 * which requires the station to know its own archetype.
 */
export interface StationState {
  readonly stationId: StationId;
  readonly archetype: StationArchetype;
  readonly activeCraft?: CraftActivitySnapshot;
  readonly queuedCrafts: readonly QueuedCraftSnapshot[];
  readonly completedOutput?: {
    readonly productId: ProductId;
    readonly quantity: number;
  };
  readonly supportCatchmonIds: readonly OwnedCatchmonId[];
}

export interface CraftingState {
  readonly stations: Readonly<Record<StationId, StationState>>;
}

// ---- Customers (Document 14 §85-89) ----

export type CustomerBrowseStatus =
  "ARRIVING" | "BROWSING" | "AWAITING_DECISION" | "LEAVING";

/**
 * Document 14 §85, §88: generated once from injected RNG; reload does not
 * reroll. `requestedProductId`/`requestedQuality` complete Document 05
 * §14's Customer Instance Model ("requestedProductId?, requestedQuality?")
 * and Document 14 §88 ("its request is stored") — Task 01.8's original
 * shape had generation identity but nowhere to persist the request
 * itself, which Task 04.2 ("persisted generated request") now needs.
 */
export interface CustomerRuntimeState {
  readonly customerId: CustomerId;
  readonly archetypeId: CustomerArchetypeId;
  readonly arrivedAtMs: TimestampMs;
  readonly status: CustomerBrowseStatus;
  readonly generationSeed: Seed;
  readonly requestedProductId?: ProductId;
  readonly requestedQuality?: QualityGrade;
}

/**
 * `lastArrivalAtMs` backs Document 15 Task 04.3's active-session arrival
 * scheduling (a minimum interval between arrivals) — it must survive a
 * customer leaving/being removed from `activeCustomerIds`, so it is
 * tracked here rather than derived from currently-active customers.
 */
export interface CustomersState {
  readonly activeCustomerIds: readonly CustomerId[];
  readonly customers: Readonly<Record<CustomerId, CustomerRuntimeState>>;
  readonly lastArrivalAtMs?: TimestampMs;
}

// ---- Orders (Document 05 §84-88; Document 15 Task 04.12 Simple Everyday Order) ----
// Not detailed in Document 14 §72-114 beyond appearing in the registry
// list (§56 item 9). `EverydayOrderSnapshot` is Task 04.12's own minimal
// shape ("one simple order layer... no complex commission system yet") —
// Specialized Orders/Commissions (Document 05 §87-88) are not modeled.

export type EverydayOrderStatus = "AVAILABLE" | "ACCEPTED" | "COMPLETED";

/**
 * Fields are snapshotted from the order's `EverydayOrderDefinition` at
 * game-start (not looked up live by `orderId` on every read) for the same
 * reason `CraftActivitySnapshot` snapshots its recipe's duration
 * (Document 14 §152): a later content change to an order's
 * reward/quantity must not retroactively alter an order the player has
 * already accepted or is currently offered.
 */
export interface EverydayOrderSnapshot {
  readonly orderId: OrderId;
  readonly requestedProductId: ProductId;
  readonly requestedQuality: QualityGrade;
  readonly requestedQuantity: number;
  readonly status: EverydayOrderStatus;
  readonly rewardCoins: Coins;
  readonly acceptedAtMs?: TimestampMs;
  readonly completedAtMs?: TimestampMs;
}

/** `activeOrderIds` is Document 05 §89's "active orders" (accepted, not yet completed) — a lookup subset of `orders`, not a separate source of truth. */
export interface OrdersState {
  readonly activeOrderIds: readonly OrderId[];
  readonly orders: Readonly<Record<OrderId, EverydayOrderSnapshot>>;
}

// ---- Catchmons (Document 14 §91-98) ----

/**
 * Document 14 §94, widened by docs/rebuild/15 Phase R5 (docs/rebuild/
 * R1_DEPENDENCY_AUDIT.md §7.3/§8.1): `LEAD`/`BOND_SUPPORT` are additive —
 * `WORKSHOP`/`SHOP_FLOOR`/`SUPPLY` are NOT removed, since Shop
 * crafting/display still assign them and have not been retired (R1's own
 * "widen, don't delete-then-add" instruction). A Catchmon can only ever
 * hold one `CatchmonAssignment` at a time, so a Catchmon assigned `LEAD`
 * or `BOND_SUPPORT` cannot simultaneously be `WORKSHOP`/`SHOP_FLOOR` —
 * the union itself makes a hybrid state structurally unrepresentable.
 */
export type CatchmonAssignment =
  | { readonly kind: "UNASSIGNED" }
  | { readonly kind: "WORKSHOP"; readonly stationId: StationId }
  | { readonly kind: "SHOP_FLOOR"; readonly slotId: string }
  | { readonly kind: "SUPPLY"; readonly slotId: string }
  | { readonly kind: "EXPEDITION"; readonly expeditionId: ExpeditionId }
  | { readonly kind: "LEAD" }
  | { readonly kind: "BOND_SUPPORT"; readonly slotIndex: 0 | 1 | 2 };

export type EvolutionReadiness = "NOT_READY" | "READY" | "EVOLVED";

/** Document 14 §92-93: stable IDs + mutable progression only, no duplicated canonical identity. */
export interface OwnedCatchmonState {
  readonly ownedCatchmonId: OwnedCatchmonId;
  readonly lineId: CatchmonLineId;
  readonly currentSpeciesId: CatchmonSpeciesId;
  readonly level: number;
  readonly xp: number;
  readonly evolutionReadiness: EvolutionReadiness;
  readonly currentAssignment: CatchmonAssignment;
  readonly shinyUnlocked?: boolean;
  readonly favorite?: boolean;
  /**
   * docs/rebuild/06 §7 Bond. Absent means 0/never-Bonded — same
   * sparse-map/optional-field convention as every other slice
   * (`domain/catchmons/bond.ts`'s `applyBondProgress` populates both
   * together once a Catchmon is first used in battle).
   */
  readonly bondProgress?: number;
  readonly bondLevel?: number;
}

export interface CatchmonsState {
  readonly ownedCatchmonIds: readonly OwnedCatchmonId[];
  readonly ownedCatchmons: Readonly<
    Record<OwnedCatchmonId, OwnedCatchmonState>
  >;
}

// ---- Expeditions (Document 14 §99-105; Document 15 Task 06.4-06.6) ----

export type ExpeditionStatus = "IN_PROGRESS" | "COMPLETED";

/**
 * One routine/bonus reward line delivered by a completed expedition
 * (Document 07 §45-48). Never a Coins line (Document 07 §128-129 "no raw
 * Coin reward" / Task 15 instruction: expeditions are not a second Coin
 * economy).
 */
export interface ExpeditionRewardLine {
  readonly itemId: ItemId;
  readonly quantity: number;
}

/**
 * Durable, protected expedition result (Document 07 §52 "result storage";
 * Document 14 §101-102 "result idempotency" — generated exactly once by
 * reconciliation and never regenerated on reload).
 */
export interface ExpeditionResult {
  readonly routineRewards: readonly ExpeditionRewardLine[];
  readonly bonusComponentGranted?: ComponentId;
  readonly encounterId?: EncounterId;
  readonly resolvedAtMs: TimestampMs;
}

/** Document 14 §99, extended by Task 06.4/06.6 with the fields Document 14's conceptual model named but Task 01.8 had not yet filled in (`result`), plus this slice's one real Lead-effect snapshot (Document 07 §23 Expedition Start Snapshot). */
export interface ExpeditionState {
  readonly expeditionId: ExpeditionId;
  readonly routeId: RouteId;
  readonly status: ExpeditionStatus;
  readonly startedAtMs: TimestampMs;
  readonly completesAtMs: TimestampMs;
  readonly leadCatchmonId: OwnedCatchmonId;
  readonly supportCatchmonIds: readonly OwnedCatchmonId[];
  /** Absent when the player brought no reservable Capture Aid (Document 07 §27 "preparation is optional"). */
  readonly loadoutReservationId?: ReservationId;
  readonly resultSeed: Seed;
  /**
   * Snapshotted at start from the Lead's `DISCOVERY_BOOST` capability, if
   * any (Document 07 §23: reassigning/evolving the Lead afterward must
   * not retroactively change this). Applied as a flat bonus to any
   * Encounter Opportunity this expedition creates.
   */
  readonly leadDiscoveryBoostBonus: number;
  readonly pendingEncounterId?: EncounterId;
  readonly result?: ExpeditionResult;
}

export interface ExpeditionsState {
  readonly activeExpeditionIds: readonly ExpeditionId[];
  readonly expeditions: Readonly<Record<ExpeditionId, ExpeditionState>>;
}

// ---- Discovery / Encounter (Document 07 §58-72; Document 15 Task 06.7/06.8) ----

/**
 * A durable Encounter Opportunity (Document 07 §70, Document 14 §103 —
 * persists until resolved, never expires, never rerolls its target on
 * reload). `resolution` distinguishes a capture *success* from a
 * *failure* from a *decline* from an *observation* (Document 07 §89's
 * already-owned-line path) — each a distinct terminal outcome, all
 * still "exactly-once resolved" (Document 15 Task 06.11/14 §105).
 *
 * `captureAidUsed` (Task 06.12 Failed-Capture Recovery Query) records
 * whether `ATTEMPT_CAPTURE` actually consumed a reserved Capture Aid for
 * THIS resolution — never inferable after the fact from the reservation
 * ledger alone, since both "consumed" and "released unused" remove the
 * reservation identically. Absent for `DECLINED`/`OBSERVED` resolutions
 * (capture aid usage is not a meaningful question there) and for a still-
 * `PENDING` encounter.
 */
export interface EncounterOpportunityState {
  readonly encounterId: EncounterId;
  readonly expeditionId: ExpeditionId;
  readonly routeId: RouteId;
  readonly targetLineId: CatchmonLineId;
  readonly targetSpeciesId: CatchmonSpeciesId;
  readonly discoveryBoostBonus: number;
  readonly status: "PENDING" | "RESOLVED";
  readonly resolution?: "CAPTURED" | "FAILED" | "DECLINED" | "OBSERVED";
  readonly captureAidUsed?: boolean;
  readonly createdAtMs: TimestampMs;
  readonly resolvedAtMs?: TimestampMs;
}

// ---- World (Document 14 §106-107) ----

/**
 * `discoveryStates`/`traceProgress`/`captureProtection` are keyed by
 * `CatchmonLineId` (Document 07 §63: discovery/capture apply to the
 * evolution line, not a specific stage) — Task 05.1-era `string` keys
 * completed to their real type now that Phase 6 actually writes to them.
 * Sparse: an absent `discoveryStates` entry means `UNKNOWN` (the default,
 * never stored explicitly — matches this codebase's existing sparse-map
 * convention for absence-as-default). `encounterProtection` stays typed
 * but genuinely unused by this slice's simplified encounter generation
 * (see `expedition-reconciliation-pass.ts`'s module doc) — a documented,
 * deliberate scope reduction, not a broken field. `routeStates`/
 * `regionMilestones` remain untouched Task 01.8 placeholders; nothing in
 * Phase 6 needs them yet.
 *
 * `componentHuntBonusProtection` (Task 06.6, keyed by `RouteId` — this
 * pity-counter is specific to a route's bonus-reward roll, not a per-line
 * concern like the fields above) tracks each route's consecutive-misses
 * count for `resolveSpecialComponentBonus`'s guaranteed-after-N-misses
 * floor. Sparse, same absence-as-default convention: an absent entry means
 * 0 consecutive misses.
 */
export interface WorldState {
  readonly unlockedRegionIds: readonly RegionId[];
  readonly routeStates: Readonly<Record<RouteId, string>>;
  readonly discoveryStates: Readonly<Record<CatchmonLineId, DiscoveryStatus>>;
  readonly traceProgress: Readonly<Record<CatchmonLineId, number>>;
  readonly encounterProtection: Readonly<Record<CatchmonLineId, number>>;
  readonly captureProtection: Readonly<Record<CatchmonLineId, number>>;
  readonly regionMilestones: Readonly<Record<RegionId, readonly string[]>>;
  readonly encounterOpportunities: Readonly<
    Record<EncounterId, EncounterOpportunityState>
  >;
  readonly componentHuntBonusProtection: Readonly<Record<RouteId, number>>;
}

// ---- Progression (Document 14 §108) ----

/**
 * `rank`/`rankProgress` are Shop Rank — Catchmon Shop's mechanism,
 * unchanged, fed only by Shop transactions (sales/orders/crafts),
 * evaluated by `SHOP_RANK` unlock conditions.
 *
 * `journeyRank`/`journeyRankProgress` (docs/rebuild/15 Phase R6) are a
 * distinct meter for Catchmon Ascension — NOT a rename of Shop Rank
 * (docs/rebuild/R1_DEPENDENCY_AUDIT.md §12.1's explicit instruction not
 * to recreate it under a different name). It reuses the same generic
 * curve math (`domain/progression/shop-rank.ts`'s `rankForProgress`/
 * `applyRankProgress`, parameterized by caller-supplied config — the same
 * function already reused for Bond, `domain/catchmons/bond.ts`), fed only
 * by real Ascension Journey milestones (stage/boss clears, region
 * completion — `ATTEMPT_STAGE`), evaluated by `JOURNEY_RANK` unlock
 * conditions. The two meters never read or credit each other.
 */
export interface ProgressionState {
  readonly rank: number;
  readonly rankProgress: number;
  readonly journeyRank: number;
  readonly journeyRankProgress: number;
  readonly earnedMilestoneIds: readonly string[];
  readonly unlockedSystemIds: readonly string[];
}

// ---- Infrastructure (Document 14 §113-114) ----

export interface ConstructionActivity {
  readonly infrastructureId: InfrastructureId;
  readonly startedAtMs: TimestampMs;
  readonly completesAtMs: TimestampMs;
}

export interface InfrastructureRuntimeState {
  readonly ownedInfrastructureIds: readonly InfrastructureId[];
  readonly upgradeLevels: Readonly<Record<InfrastructureId, number>>;
  readonly activeConstructions: readonly ConstructionActivity[];
}

// ---- Journey (docs/rebuild/03 §5 Stage Structure; docs/rebuild/15 Phase R2) ----

/** Document 02 §1 Canonical Core Loop's "push stage/boss" step, persisted. `currentStageIndex` is a position into the catalog's ordered stage list (`domain/journey/stage-progression.ts`'s `orderedStages`), not a `StageId` itself — "the architecture must not assume a fixed count" (Document 03 §5), so running past the last authored stage is just `currentStage(...) === undefined`, not an error. */
export interface JourneyState {
  readonly currentStageIndex: number;
  readonly clearedStageIds: readonly StageId[];
  /**
   * docs/rebuild/15 Phase R7 (docs/rebuild/03 §10 Offline Combat, §12
   * "stable farm checkpoint"). The index of the last **normal** (non-boss)
   * stage cleared — never a boss stage index, by construction (only
   * updated on a non-boss WIN). Offline reconciliation resolves rewards
   * against this stage only, so a boss the player has not defeated
   * manually can never be auto-cleared while the app is closed
   * (docs/rebuild/03 §10 "Bosses are not silently auto-cleared offline").
   * `-1` means no normal stage has been cleared yet.
   */
  readonly stableFarmStageIndex: number;
  readonly lastBattle?: {
    readonly stageId: StageId;
    readonly outcome: "WIN" | "LOSS" | "TIMEOUT";
    readonly resolvedAtMs: TimestampMs;
  };
}

// ---- Loadout (docs/rebuild/05; docs/rebuild/15 Phase R4/R5) ----

/**
 * Document 05 §7 Loadouts. `leadCatchmonId`/`bondSupportCatchmonIds` are a
 * synced lookup cache of `OwnedCatchmonState.currentAssignment` — the
 * single source of truth stays `currentAssignment` (Document 14 §94),
 * exactly the same relationship `ShopState.shopFloorSupportCatchmonIds`
 * already has to `SHOP_FLOOR` assignment (see that field's doc comment).
 * `relicMatrix` is sparse: an absent slot means empty, matching this
 * codebase's absence-as-default convention.
 */
export interface LoadoutState {
  readonly leadCatchmonId?: OwnedCatchmonId;
  readonly bondSupportCatchmonIds: readonly OwnedCatchmonId[];
  readonly battlePathId?: BattlePathId;
  readonly equippedSkillIds: readonly SkillId[];
  readonly relicMatrix: Readonly<
    Partial<Record<RelicMatrixSlot, RelicInstanceId>>
  >;
}

// ---- Forge (docs/rebuild/04; docs/rebuild/15 Phase R3) ----

/** Document 04 §2 Echo Charges, §8 Forge Level, §9 Forge Insight. `totalRelicsForged` is the deterministic upgrade resource Forge Level is derived from (`domain/forge/forge-level.ts`) — never spent/decremented, only ever counted up. */
export interface ForgeState {
  readonly echoCharges: number;
  readonly totalRelicsForged: number;
  readonly forgeInsight: number;
}

// ---- Relic Inventory (docs/rebuild/04 §4; docs/rebuild/15 Phase R3) ----

export interface RelicInstanceState {
  readonly relicInstanceId: RelicInstanceId;
  readonly relicArchetypeId: RelicArchetypeId;
  readonly slot: RelicMatrixSlot;
  readonly rarity: RelicRarity;
  readonly mainStatValue: number;
  readonly affixes: readonly {
    readonly type: AffixType;
    readonly value: number;
  }[];
  readonly locked: boolean;
  readonly forgedAtMs: TimestampMs;
}

export interface RelicInventoryState {
  readonly ownedRelicInstanceIds: readonly RelicInstanceId[];
  readonly relics: Readonly<Record<RelicInstanceId, RelicInstanceState>>;
}

// ---- Skills (docs/rebuild/05 §4-5; docs/rebuild/15 Phase R4) ----

/** Document 05 §4: acquisition (`unlockedSkillIds`, earned through progression) is distinct from selection (`LoadoutState.equippedSkillIds`, which of the unlocked skills are currently active). */
export interface SkillsState {
  readonly unlockedSkillIds: readonly SkillId[];
}
