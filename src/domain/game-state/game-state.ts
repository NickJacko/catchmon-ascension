/**
 * Design owner: 14 Technical Architecture — §38 Canonical Game State
 * (the conceptual `meta/economy/inventory/shop/crafting/customers/
 * orders/catchmons/expeditions/world/progression/infrastructure` root),
 * §43 State Normalization (`Record<Id, EntityState>` + ID arrays).
 *
 * `GameState` is the one serializable root. `createInitialGameState`
 * produces a brand-new game's state — no starter content is hardcoded
 * here (Document 15 Task 01.8's own rule: "do not hardcode starter
 * content inside React" applies equally to hardcoding it in this
 * factory instead — starting Catchmons/regions/etc. must flow through
 * the same command/content path as everything else, not be baked into
 * this function). `validateGameState` checks a handful of genuinely
 * verifiable structural invariants — not exhaustive, v1 only.
 */
import { type GameCatalog } from "../catalog/index.ts";
import { type Clock } from "../../core/time/index.ts";
import { toCoins } from "../../core/math/index.ts";
import { invariant } from "../../core/assertions/index.ts";
import {
  INITIAL_RANDOM_EVENT_COUNTER,
  type Seed,
} from "../../core/random/index.ts";
import {
  OwnedCatchmonId,
  SaveId,
  type CatchmonLineId,
  type ItemId,
  type OrderId,
  type RegionId,
} from "../../core/ids/index.ts";
import { type DiscoveryStatus } from "../world/discovery.ts";
import { isUnlockRuleSatisfied } from "../progression/unlock-evaluator.ts";
import { err, ok, type Result } from "../../core/result/index.ts";
import {
  GAME_STATE_SCHEMA_VERSION,
  INITIAL_CONTENT_VERSION,
  type GameStateMeta,
} from "./meta.ts";
import {
  type CatchmonsState,
  type CraftingState,
  type CustomersState,
  type EconomyState,
  type EverydayOrderSnapshot,
  type ExpeditionsState,
  type ForgeState,
  type InfrastructureRuntimeState,
  type InventoryState,
  type JourneyState,
  type LoadoutState,
  type OrdersState,
  type OwnedCatchmonState,
  type ProgressionState,
  type RelicInventoryState,
  type ShopState,
  type SkillsState,
  type WorldState,
} from "./slices.ts";

export interface GameState {
  readonly meta: GameStateMeta;
  readonly economy: EconomyState;
  readonly inventory: InventoryState;
  readonly shop: ShopState;
  readonly crafting: CraftingState;
  readonly customers: CustomersState;
  readonly orders: OrdersState;
  readonly catchmons: CatchmonsState;
  readonly expeditions: ExpeditionsState;
  readonly world: WorldState;
  readonly progression: ProgressionState;
  readonly infrastructure: InfrastructureRuntimeState;
  /** docs/rebuild/15 Phases R2-R5 (docs/rebuild/14 §8's proposed Ascension GameState areas) — new, additive; `shop`/`crafting`/`customers`/`orders`/`infrastructure` above stay for now (see docs/rebuild/R1_DEPENDENCY_AUDIT.md §5 for the retirement plan). */
  readonly journey: JourneyState;
  readonly loadout: LoadoutState;
  readonly forge: ForgeState;
  readonly relicInventory: RelicInventoryState;
  readonly skills: SkillsState;
}

/**
 * PROVISIONAL: a v1 `SaveId` derived deterministically from the root
 * seed (`save-<seed>`), not a separately generated identifier — Task
 * 01.8's factory signature takes exactly `(catalog, clock, rootSeed)`,
 * with no fourth `saveId` parameter, and no UUID/crypto dependency is
 * introduced (consistent with ADR 0001's stance that nondeterministic
 * ID generation is future platform-adapter work, not this layer's job).
 * A real save-identity scheme may need to change this later.
 */
function deriveInitialSaveId(rootSeed: Seed): SaveId {
  return SaveId.from(`save-${String(rootSeed)}`);
}

/**
 * Seeds one `AVAILABLE` snapshot per catalog `EverydayOrderDefinition`
 * (Document 05 §85-93; Document 15 Task 04.12). This is the first thing
 * `createInitialGameState` actually reads `catalog` for — every earlier
 * slice's empty starting shape needed no canonical content.
 */
function buildInitialOrderSnapshots(
  catalog: GameCatalog,
): Readonly<Record<OrderId, EverydayOrderSnapshot>> {
  const snapshots: Record<OrderId, EverydayOrderSnapshot> = {};
  for (const order of catalog.everydayOrders.values()) {
    snapshots[order.orderId] = {
      orderId: order.orderId,
      requestedProductId: order.productId,
      requestedQuality: order.quality,
      requestedQuantity: order.quantity,
      status: "AVAILABLE",
      rewardCoins: order.rewardCoins,
    };
  }
  return snapshots;
}

/**
 * The deterministic starting `OwnedCatchmonId` for a given species'
 * seeded instance — exported so callers (tests, dev harnesses) never need
 * to hand-construct this string themselves.
 */
export function deriveInitialOwnedCatchmonId(
  catchmonSpeciesId: string,
): OwnedCatchmonId {
  return OwnedCatchmonId.from(`owned-${catchmonSpeciesId.toLowerCase()}`);
}

/**
 * Seeds one owned instance per `catalog.starterCatchmonSpeciesIds` entry
 * (Document 15 Task 05.3, extended by Task 06.2; all starting
 * `UNASSIGNED`/Document 06 §47 Unassigned/Roaming, level 1, 0 XP).
 *
 * `starterCatchmonSpeciesIds` is an explicit, content-authored fact
 * (`GameCatalogContent`, populated by `catalogContent.ts`) rather than
 * something inferred from catalog/stage structure. An earlier version of
 * this function inferred starters as "the earliest-`stageIndex` species
 * per `CatchmonLineId`" — that broke the moment a genuinely wild,
 * capturable, single-stage species (Aquaril, Task 06.2, registered only
 * so a Discovery Survey route can offer it as an encounter target) was
 * added to the shared `catchmonSpecies` catalog: being the sole/earliest
 * stage of its own line trivially satisfied that old rule, silently
 * auto-owning a species that must start as a wild target instead. Explicit
 * authorship avoids this whole class of bug — a species is owned at game
 * start if and only if it is listed here, independent of how many stages
 * exist in its line or whether it is a line's entry species. Matches this
 * module's own "no starter content baked into React/commands" rule
 * (applied here to the domain factory itself, same as Task 04.12's order
 * seeding): the player starts owning exactly the listed roster, but must
 * issue `ASSIGN_CATCHMON`/`EVOLVE_CATCHMON` to develop any of them
 * further, exactly like every other command-driven state change in this
 * codebase.
 */
function buildInitialOwnedCatchmons(
  catalog: GameCatalog,
): Readonly<Record<OwnedCatchmonId, OwnedCatchmonState>> {
  const owned: Record<OwnedCatchmonId, OwnedCatchmonState> = {};
  for (const speciesId of catalog.starterCatchmonSpeciesIds) {
    const species = catalog.catchmonSpecies.get(speciesId);
    invariant(species !== undefined, `Unknown starter species: ${speciesId}`);
    const ownedCatchmonId = deriveInitialOwnedCatchmonId(
      species.catchmonSpeciesId,
    );
    owned[ownedCatchmonId] = {
      ownedCatchmonId,
      lineId: species.catchmonLineId,
      currentSpeciesId: species.catchmonSpeciesId,
      level: 1,
      xp: 0,
      // Document 06 §65-69 / Task 05.9: a species with no further
      // `evolvesToSpeciesId` is a terminal stage ("EVOLVED" = fully
      // evolved, nothing further to reach) — a freshly-owned level-1
      // Catchmon on an evolvable line is simply not ready yet.
      evolutionReadiness:
        species.evolvesToSpeciesId === undefined ? "EVOLVED" : "NOT_READY",
      currentAssignment: { kind: "UNASSIGNED" },
    };
  }
  return owned;
}

/**
 * Document 15 Task 06.7/06.8 (Phase 6): every starter Catchmon's line must
 * start as `discoveryStates`-"OWNED", not the sparse-map default
 * `"UNKNOWN"` — otherwise a starter line (e.g. Geckon) would look
 * undiscovered to `selectEncounterTarget`'s "bias toward unowned" rule the
 * very first time a Discovery Survey completes, incorrectly treating an
 * already-owned Catchmon as a fresh capture target. Self-caught while
 * building the expedition reconciliation pass: `buildInitialOwnedCatchmons`
 * populated `catchmons.ownedCatchmons` but nothing populated
 * `world.discoveryStates` to match, leaving the two states inconsistent at
 * game start.
 */
function buildInitialDiscoveryStates(
  initialOwnedCatchmons: Readonly<Record<OwnedCatchmonId, OwnedCatchmonState>>,
): Readonly<Record<CatchmonLineId, DiscoveryStatus>> {
  const discoveryStates: Record<CatchmonLineId, DiscoveryStatus> = {};
  for (const owned of Object.values(initialOwnedCatchmons)) {
    discoveryStates[owned.lineId] = "OWNED";
  }
  return discoveryStates;
}

/**
 * A region is unlocked from game start if and only if its own
 * `unlockRuleId` (resolved against `catalog.unlockRules`) is already
 * satisfied against a brand-new game's state — evaluated the same way
 * `regionUnlockReconciliationPass` evaluates it later, so "unlocked at
 * creation" and "unlocked by later reconciliation" are one mechanism, not
 * two (Ozean Batch A). Vulkankrater's `SLICE_ALWAYS_UNLOCKED_RULE_ID`
 * (`SHOP_RANK >= 1`) is trivially true at creation since rank starts at 1;
 * Ozean's real two-signal rule (Shop Rank + a Vulkankrater route
 * completion) is not — it starts locked, exactly like every future
 * region's own rule will.
 */
function buildInitialUnlockedRegionIds(
  catalog: GameCatalog,
  draftState: GameState,
): readonly RegionId[] {
  const unlocked: RegionId[] = [];
  for (const region of catalog.regions.values()) {
    const rule = catalog.unlockRules.get(region.unlockRuleId);
    invariant(
      rule !== undefined,
      `Region "${region.regionId}" references unknown unlock rule "${region.unlockRuleId}" — should have been caught by createGameCatalog`,
    );
    if (isUnlockRuleSatisfied(rule, draftState)) {
      unlocked.push(region.regionId);
    }
  }
  return unlocked;
}

/**
 * Builds a brand-new game's `GameState` from the given `catalog` (Task
 * 04.12 first started reading it, to seed Everyday Orders; Task 05.3 adds
 * seeding the starting owned-Catchmon roster the same way).
 */
export function createInitialGameState(
  catalog: GameCatalog,
  clock: Clock,
  rootSeed: Seed,
): GameState {
  const nowMs = clock.nowMs();
  const initialOwnedCatchmons = buildInitialOwnedCatchmons(catalog);
  const initialDiscoveryStates = buildInitialDiscoveryStates(
    initialOwnedCatchmons,
  );

  const meta: GameStateMeta = {
    saveId: deriveInitialSaveId(rootSeed),
    schemaVersion: GAME_STATE_SCHEMA_VERSION,
    createdAtMs: nowMs,
    updatedAtMs: nowMs,
    lastActiveAtMs: nowMs,
    revision: 0,
    rootRandomSeed: rootSeed,
    randomEventCounter: INITIAL_RANDOM_EVENT_COUNTER,
    contentVersion: INITIAL_CONTENT_VERSION,
  };

  const draftState: GameState = {
    meta,
    economy: { coins: toCoins(0) },
    inventory: { stacks: {}, reservations: {} },
    shop: { momentum: 0, displaySlots: {}, shopFloorSupportCatchmonIds: [] },
    crafting: { stations: {} },
    customers: { activeCustomerIds: [], customers: {} },
    orders: {
      activeOrderIds: [],
      orders: buildInitialOrderSnapshots(catalog),
    },
    catchmons: {
      ownedCatchmonIds: Object.keys(initialOwnedCatchmons) as OwnedCatchmonId[],
      ownedCatchmons: initialOwnedCatchmons,
    },
    expeditions: { activeExpeditionIds: [], expeditions: {} },
    world: {
      // Resolved below, once the rest of a fresh game's state exists to
      // evaluate unlock rules against — see `buildInitialUnlockedRegionIds`.
      unlockedRegionIds: [],
      routeStates: {},
      discoveryStates: initialDiscoveryStates,
      traceProgress: {},
      encounterProtection: {},
      captureProtection: {},
      regionMilestones: {},
      encounterOpportunities: {},
      componentHuntBonusProtection: {},
    },
    progression: {
      rank: 1, // PROVISIONAL: starting Shop Rank number is not locked by any read doc.
      rankProgress: 0,
      journeyRank: 1, // PROVISIONAL: starting Journey Rank number is not locked by any read doc — same starting-value convention as Shop Rank above.
      journeyRankProgress: 0,
      earnedMilestoneIds: [],
      unlockedSystemIds: [],
    },
    infrastructure: {
      ownedInfrastructureIds: [],
      upgradeLevels: {},
      activeConstructions: [],
    },
    journey: {
      currentStageIndex: 0,
      clearedStageIds: [],
      stableFarmStageIndex: -1,
    },
    loadout: {
      bondSupportCatchmonIds: [],
      equippedSkillIds: [],
      relicMatrix: {},
    },
    forge: { echoCharges: 0, totalRelicsForged: 0, forgeInsight: 0 },
    relicInventory: { ownedRelicInstanceIds: [], relics: {} },
    skills: { unlockedSkillIds: catalog.startingUnlockedSkillIds },
  };

  return {
    ...draftState,
    world: {
      ...draftState.world,
      unlockedRegionIds: buildInitialUnlockedRegionIds(catalog, draftState),
    },
  };
}

/**
 * Checks a small set of genuinely verifiable structural invariants —
 * not exhaustive (v1). Collects every violation found rather than
 * failing fast on the first, since this is a diagnostic tool (tests,
 * save-load integrity checks), not a content boot gate (contrast
 * `createGameCatalog`, which does fail fast — Document 14 §62 is about
 * canonical *content*, not save state).
 */
export function validateGameState(
  state: GameState,
): Result<true, readonly string[]> {
  const violations: string[] = [];

  if (!Number.isSafeInteger(state.meta.revision) || state.meta.revision < 0) {
    violations.push(
      `meta.revision must be a non-negative safe integer, received ${String(state.meta.revision)}`,
    );
  }
  if (
    !Number.isSafeInteger(state.meta.schemaVersion) ||
    state.meta.schemaVersion < 1
  ) {
    violations.push(
      `meta.schemaVersion must be a positive integer, received ${String(state.meta.schemaVersion)}`,
    );
  }

  // Document 14 §77: available = total - reserved must never go negative.
  const reservedByItem = new Map<ItemId, number>();
  for (const reservation of Object.values(state.inventory.reservations)) {
    for (const line of reservation.items) {
      reservedByItem.set(
        line.itemId,
        (reservedByItem.get(line.itemId) ?? 0) + line.quantity,
      );
    }
  }
  for (const [itemId, reservedQuantity] of reservedByItem) {
    const totalQuantity = state.inventory.stacks[itemId]?.quantity ?? 0;
    if (reservedQuantity > totalQuantity) {
      violations.push(
        `inventory item "${itemId}" is over-reserved: reserved ${String(reservedQuantity)} > total ${String(totalQuantity)}`,
      );
    }
  }

  // Document 14 §43: an ID array and its backing Record must stay in sync.
  for (const ownedCatchmonId of state.catchmons.ownedCatchmonIds) {
    if (!(ownedCatchmonId in state.catchmons.ownedCatchmons)) {
      violations.push(
        `catchmons.ownedCatchmonIds references "${ownedCatchmonId}" with no matching entry in ownedCatchmons`,
      );
    }
  }
  // Document 06 §49/Task 05.5: Shop Floor support is a synced cache of
  // OwnedCatchmonState.currentAssignment (the single source of truth,
  // Document 14 §94) — every listed Catchmon must actually be assigned
  // SHOP_FLOOR right now.
  for (const ownedCatchmonId of state.shop.shopFloorSupportCatchmonIds) {
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned || owned.currentAssignment.kind !== "SHOP_FLOOR") {
      violations.push(
        `shop.shopFloorSupportCatchmonIds references "${ownedCatchmonId}" which is not currently assigned SHOP_FLOOR`,
      );
    }
  }
  for (const station of Object.values(state.crafting.stations)) {
    for (const ownedCatchmonId of station.supportCatchmonIds) {
      const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
      if (
        !owned ||
        owned.currentAssignment.kind !== "WORKSHOP" ||
        owned.currentAssignment.stationId !== station.stationId
      ) {
        violations.push(
          `crafting.stations["${station.stationId}"].supportCatchmonIds references "${ownedCatchmonId}" which is not currently assigned WORKSHOP at this station`,
        );
      }
    }
  }
  for (const customerId of state.customers.activeCustomerIds) {
    if (!(customerId in state.customers.customers)) {
      violations.push(
        `customers.activeCustomerIds references "${customerId}" with no matching entry in customers`,
      );
    }
  }
  for (const expeditionId of state.expeditions.activeExpeditionIds) {
    if (!(expeditionId in state.expeditions.expeditions)) {
      violations.push(
        `expeditions.activeExpeditionIds references "${expeditionId}" with no matching entry in expeditions`,
      );
    }
  }
  for (const orderId of state.orders.activeOrderIds) {
    if (!(orderId in state.orders.orders)) {
      violations.push(
        `orders.activeOrderIds references "${orderId}" with no matching entry in orders`,
      );
    }
  }

  // docs/rebuild/15 Phase R5: loadout.leadCatchmonId/bondSupportCatchmonIds
  // are a synced cache of currentAssignment (Document 14 §94) — same
  // pattern/check as shop.shopFloorSupportCatchmonIds above.
  if (state.loadout.leadCatchmonId) {
    const lead = state.catchmons.ownedCatchmons[state.loadout.leadCatchmonId];
    if (!lead || lead.currentAssignment.kind !== "LEAD") {
      violations.push(
        `loadout.leadCatchmonId references "${state.loadout.leadCatchmonId}" which is not currently assigned LEAD`,
      );
    }
  }
  for (const ownedCatchmonId of state.loadout.bondSupportCatchmonIds) {
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned || owned.currentAssignment.kind !== "BOND_SUPPORT") {
      violations.push(
        `loadout.bondSupportCatchmonIds references "${ownedCatchmonId}" which is not currently assigned BOND_SUPPORT`,
      );
    }
  }
  if (state.loadout.bondSupportCatchmonIds.length > 3) {
    violations.push(
      `loadout.bondSupportCatchmonIds has ${String(state.loadout.bondSupportCatchmonIds.length)} entries, exceeding the 3-slot maximum (docs/rebuild/03 §2)`,
    );
  }
  for (const relicInstanceId of Object.values(state.loadout.relicMatrix)) {
    if (relicInstanceId && !(relicInstanceId in state.relicInventory.relics)) {
      violations.push(
        `loadout.relicMatrix references "${relicInstanceId}" with no matching entry in relicInventory.relics`,
      );
    }
  }
  for (const relicInstanceId of state.relicInventory.ownedRelicInstanceIds) {
    if (!(relicInstanceId in state.relicInventory.relics)) {
      violations.push(
        `relicInventory.ownedRelicInstanceIds references "${relicInstanceId}" with no matching entry in relics`,
      );
    }
  }

  return violations.length === 0 ? ok(true) : err(violations);
}
