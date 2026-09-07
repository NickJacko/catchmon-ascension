/**
 * Design owner: Document 15 Task 06.3 (Expedition Planning Queries);
 * Document 07 §13 Route Architecture, §15 Route Access vs. Preference,
 * §23 Expedition Start Snapshot, §161 Minimum Expedition Prototype.
 *
 * Pure, read-only queries over `GameState`/`GameCatalog` — never mutate
 * state, never go through the command engine (same rule `craft-queries.ts`
 * follows: React/preview UI reads via these, writes only via Task 06.4's
 * `START_EXPEDITION` command). Every numeric/config value this module
 * needs (capture-aid product, route duration, capability magnitudes) is
 * injected by the caller at composition time rather than imported from
 * `content/vertical-slice` directly, matching `createCraftQueries`'s
 * `stationArchetypes`/`maxQueueSize` precedent — this module stays
 * content-agnostic.
 *
 * Explicitly out of scope (per the Task 06.3 instruction and CLAUDE.md
 * §10/§11): no universal "Team Power" score anywhere below. Every fit/
 * eligibility signal is either a hard boolean gate (already assigned?) or
 * an honestly-scoped informational preview (domain fit, capability match,
 * discovery-boost bonus) — never combined into one aggregate number.
 */
import {
  type CapabilityId,
  type OwnedCatchmonId,
  type ProductId,
  type RouteId,
} from "../../../core/ids/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import {
  checkRouteAccess,
  type RouteAccessBlockedReason,
  type RouteDefinition,
} from "../../../domain/world/index.ts";
import { type MagnitudeTable } from "../../../domain/catchmons/index.ts";
import { productItemId } from "../../../domain/inventory/product-item-id.ts";
import { getAvailableQuantity } from "../../../domain/inventory/inventory-ledger.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { isEligibleForDomain } from "../catchmons/catchmon-queries.ts";
import { getExpeditionDiscoveryBoostEffect } from "../catchmons/catchmon-effect-queries.ts";

export type RouteUnavailableReason = RouteAccessBlockedReason;

export interface RouteAvailability {
  readonly routeId: RouteId;
  readonly available: boolean;
  readonly reason?: RouteUnavailableReason;
}

export type CatchmonAssignmentIneligibleReason =
  "UNKNOWN_CATCHMON" | "ALREADY_ASSIGNED";

/**
 * Document 07 §20-22: a Catchmon may hold only one functional duty at a
 * time (Workshop/Shop Floor/Supply/Expedition), so the one hard gate for
 * either Expedition role is "currently unassigned." `hasExpeditionDomainFit`
 * is informational only (Task 06.3: "no hard gate") — a Catchmon with no
 * EXPEDITION-domain capability can still be sent, it simply contributes no
 * known effect.
 */
export interface CatchmonAssignmentEligibility {
  readonly ownedCatchmonId: OwnedCatchmonId;
  readonly eligible: boolean;
  readonly reason?: CatchmonAssignmentIneligibleReason;
  readonly hasExpeditionDomainFit: boolean;
}

export interface RouteFitPreview {
  readonly routeId: RouteId;
  readonly leadCatchmonId: OwnedCatchmonId;
  /** Document 07 §15: soft preferences only — empty on every slice route today, so this is always `[]` for this content, honestly reflecting that. */
  readonly matchedPreferredCapabilityIds: readonly CapabilityId[];
  /** Document 07 §23: what `leadDiscoveryBoostBonus` Task 06.4 would snapshot if this Catchmon led this route right now. 0 when the Lead has no matching capability. */
  readonly discoveryBoostBonus: number;
}

export interface LoadoutCompatibility {
  readonly routeId: RouteId;
  /** False for a route with no `encounterPool` (Document 07 §26: the Capture Aid only matters where a capture can occur) — Supply Run/Component Hunt in this slice. */
  readonly captureAidApplicable: boolean;
  readonly captureAidProductId: ProductId;
  readonly captureAidAvailableQuantity: number;
  readonly canBringCaptureAid: boolean;
}

/**
 * Document 15 Task 06.3 "preparation slots" — explicitly deferred, not
 * fabricated (CLAUDE.md primary rule). No Provisions/Field Gear system
 * exists in this slice (only the single reservable Capture Aid, already
 * covered by `loadoutCompatibility`); this mirrors `craft-queries.ts`'s
 * `masteryPlaceholder` pattern: an honest "nothing here yet" shape rather
 * than silently omitting the query the task asks for.
 */
export interface PreparationSlotsPreview {
  readonly routeId: RouteId;
  readonly slots: readonly never[];
  readonly note: string;
}

export interface ExpeditionPreview {
  readonly routeId: RouteId;
  readonly durationMs: number;
  /**
   * Document 07 §45-48 reward categories as declared on the route's own
   * `guaranteedRewards`/`bonusRewardPools` string tags — NOT resolved
   * item/quantity numbers. Concrete reward resolution happens at
   * completion time (Task 06.6, `domain/expeditions/rewards.ts`, wired
   * into `expedition-reconciliation-pass.ts`); this pre-attempt preview
   * stays tag-level on purpose — a route's actual guaranteed quantity can
   * be read from the injected balance config directly if a caller needs
   * it, but rolling the *bonus* component here before the expedition even
   * starts would let a player "peek" a result Document 07 treats as
   * resolved only at completion.
   */
  readonly guaranteedRewardTags: readonly string[];
  readonly bonusRewardPoolTags: readonly string[];
  readonly hasSpecialComponentChance: boolean;
  readonly hasEncounterChance: boolean;
}

export interface ExpeditionPlanningQueries {
  availableRoutes(state: GameState): readonly RouteAvailability[];
  leadEligibility(
    state: GameState,
    ownedCatchmonId: OwnedCatchmonId,
  ): CatchmonAssignmentEligibility;
  /**
   * Document 07 §161 "optional simulated Support" — this slice's Phase 6
   * implementation deliberately omits Support entirely (Lead-only
   * expeditions; `ExpeditionState.supportCatchmonIds` always stays `[]`,
   * see Task 06.4). The eligibility rule is identical to Lead's (must be
   * unassigned), so this reuses the exact same check rather than
   * duplicating it — provided for Task 06.3's literal required query
   * surface, even though no command in this slice currently calls it.
   */
  supportEligibility(
    state: GameState,
    ownedCatchmonId: OwnedCatchmonId,
  ): CatchmonAssignmentEligibility;
  routeFit(
    state: GameState,
    routeId: RouteId,
    leadCatchmonId: OwnedCatchmonId,
  ): RouteFitPreview | null;
  loadoutCompatibility(
    state: GameState,
    routeId: RouteId,
  ): LoadoutCompatibility | null;
  preparationSlots(routeId: RouteId): PreparationSlotsPreview | null;
  expeditionPreview(routeId: RouteId): ExpeditionPreview | null;
}

export function createExpeditionPlanningQueries(
  catalog: GameCatalog,
  captureAidProductId: ProductId,
  routeDurationMsByRouteId: Readonly<Record<RouteId, number>>,
  magnitudes: MagnitudeTable,
): ExpeditionPlanningQueries {
  function isRouteAvailable(
    state: GameState,
    route: RouteDefinition,
  ): RouteAvailability {
    const blockedReason = checkRouteAccess(
      route,
      state.world.unlockedRegionIds,
    );
    if (blockedReason) {
      return {
        routeId: route.routeId,
        available: false,
        reason: blockedReason,
      };
    }
    return { routeId: route.routeId, available: true };
  }

  function availableRoutes(state: GameState): readonly RouteAvailability[] {
    return Array.from(catalog.routes.values()).map((route) =>
      isRouteAvailable(state, route),
    );
  }

  function catchmonEligibility(
    state: GameState,
    ownedCatchmonId: OwnedCatchmonId,
  ): CatchmonAssignmentEligibility {
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned) {
      return {
        ownedCatchmonId,
        eligible: false,
        reason: "UNKNOWN_CATCHMON",
        hasExpeditionDomainFit: false,
      };
    }
    const hasExpeditionDomainFit = isEligibleForDomain(
      catalog,
      owned.currentSpeciesId,
      "EXPEDITION",
    );
    if (owned.currentAssignment.kind !== "UNASSIGNED") {
      return {
        ownedCatchmonId,
        eligible: false,
        reason: "ALREADY_ASSIGNED",
        hasExpeditionDomainFit,
      };
    }
    return { ownedCatchmonId, eligible: true, hasExpeditionDomainFit };
  }

  function routeFit(
    state: GameState,
    routeId: RouteId,
    leadCatchmonId: OwnedCatchmonId,
  ): RouteFitPreview | null {
    const route = catalog.routes.get(routeId);
    if (!route) return null;
    const owned = state.catchmons.ownedCatchmons[leadCatchmonId];
    if (!owned) return null;
    const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
    const matchedPreferredCapabilityIds = species
      ? species.capabilityIds.filter((capabilityId) =>
          route.preferredCapabilities.includes(capabilityId),
        )
      : [];
    const discoveryBoostEffect = getExpeditionDiscoveryBoostEffect(
      state,
      catalog,
      leadCatchmonId,
      magnitudes,
    );
    return {
      routeId,
      leadCatchmonId,
      matchedPreferredCapabilityIds,
      discoveryBoostBonus: discoveryBoostEffect?.boostMagnitude ?? 0,
    };
  }

  function loadoutCompatibility(
    state: GameState,
    routeId: RouteId,
  ): LoadoutCompatibility | null {
    const route = catalog.routes.get(routeId);
    if (!route) return null;
    const captureAidItemId = productItemId(captureAidProductId, "STANDARD");
    const captureAidAvailableQuantity = getAvailableQuantity(
      state.inventory,
      captureAidItemId,
    );
    return {
      routeId,
      captureAidApplicable: route.encounterPool.length > 0,
      captureAidProductId,
      captureAidAvailableQuantity,
      canBringCaptureAid:
        route.encounterPool.length > 0 && captureAidAvailableQuantity > 0,
    };
  }

  function preparationSlots(routeId: RouteId): PreparationSlotsPreview | null {
    const route = catalog.routes.get(routeId);
    if (!route) return null;
    return {
      routeId,
      slots: [],
      note: "Not implemented in this slice — no Provisions/Field Gear system exists yet (Document 08 territory). The Capture Aid is the only reservable loadout item; see loadoutCompatibility.",
    };
  }

  function expeditionPreview(routeId: RouteId): ExpeditionPreview | null {
    const route = catalog.routes.get(routeId);
    if (!route) return null;
    const durationMs = routeDurationMsByRouteId[routeId];
    if (durationMs === undefined) return null;
    return {
      routeId,
      durationMs,
      guaranteedRewardTags: route.guaranteedRewards,
      bonusRewardPoolTags: route.bonusRewardPools,
      hasSpecialComponentChance: route.specialComponentPool.length > 0,
      hasEncounterChance: route.encounterPool.length > 0,
    };
  }

  return {
    availableRoutes,
    leadEligibility: catchmonEligibility,
    supportEligibility: catchmonEligibility,
    routeFit,
    loadoutCompatibility,
    preparationSlots,
    expeditionPreview,
  };
}
