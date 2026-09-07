/**
 * Design owner: Document 15 Task 06.5 (Expedition Reconciliation), Task
 * 06.6 (Routine + Special Rewards), Task 06.7 (Discovery State Machine
 * wiring), Task 06.8 (Encounter Creation); Document 07 §20-27, §45-50,
 * §58-72, §89, §23 Expedition Start Snapshot.
 *
 * For every active expedition whose `completesAtMs <= now`: resolves its
 * guaranteed routine reward, its route-specific bonus (Component Hunt's
 * special-component roll), and — for a Discovery Survey — creates exactly
 * one durable Encounter Opportunity, advances that line's discovery
 * status, releases the Lead back to `UNASSIGNED`, and awards XP once.
 * Mirrors `craft-queue-reconciliation-pass.ts`'s shape: pure, exactly-once
 * (an expedition leaves `activeExpeditionIds` the moment it completes, so
 * a second reconciliation call over the same state finds nothing left to
 * do), no `Date.now()`/`Math.random()`.
 *
 * All of this expedition's randomness (bonus-component roll, encounter
 * target selection) is drawn from `expedition.resultSeed` — snapshotted
 * once at `START_EXPEDITION` time (Task 06.4), never from
 * `state.meta.randomEventCounter` here. This is *why* `resultSeed` exists:
 * reconciliation may run at an arbitrary later time (or be recomputed
 * across a reload) and must still reproduce the exact same outcome
 * (Document 07: "reload must never reroll route outcome / encounter
 * species / capture outcome inputs") — no `randomEventCounter` bump
 * happens in this pass.
 *
 * SIMPLIFIED ENCOUNTER-GENERATION POLICY (a deliberate, documented scope
 * reduction beyond what Document 07 strictly requires): a completed
 * Discovery Survey ALWAYS produces exactly one Encounter Opportunity —
 * never a "trace only, no encounter" outcome. This makes `WorldState.
 * encounterProtection` structurally present but functionally unused/inert
 * in this slice — intentional, not a bug (Document 07's "encounter
 * protection" concept only matters once a survey can plausibly whiff
 * entirely, which this simplified policy never allows).
 *
 * ROUTE COMPLETION SIGNAL (Ozean Batch A): every completing expedition,
 * for ANY route in ANY region, now also records `world.routeStates[routeId]
 * = "COMPLETED"` — a generic, previously-unwritten placeholder field
 * (Document 09 §106 "possible world-readiness signals: complete key
 * route..."). This is not Ozean-specific: it is the one reusable World
 * Readiness fact `EXPEDITION_MILESTONE` unlock conditions read
 * (`unlock-evaluator.ts`), usable by any future region's own two-signal
 * unlock rule the same way.
 */
import {
  EncounterId,
  type CatchmonLineId,
  type ResourceId,
  type RouteId,
} from "../../core/ids/index.ts";
import { invariant } from "../../core/assertions/index.ts";
import { type ProbabilityBps } from "../../core/math/probability.ts";
import {
  createRandomSource,
  nextIntExclusive,
} from "../../core/random/index.ts";
import { applyXp } from "../../domain/catchmons/index.ts";
import { applyRankProgress } from "../../domain/progression/index.ts";
import {
  resolveRoutineReward,
  resolveSpecialComponentBonus,
  selectEncounterTarget,
} from "../../domain/expeditions/index.ts";
import { advanceDiscoveryStatus } from "../../domain/world/index.ts";
import {
  type EncounterOpportunityState,
  type ExpeditionResult,
  type ExpeditionState,
  type OwnedCatchmonState,
} from "../../domain/game-state/index.ts";
import { addToInventory } from "../../domain/inventory/index.ts";
import { type ExpeditionEvent } from "../commands/expeditions/expedition-events.ts";
import {
  type ReconciliationPass,
  type ReconciliationPassOutcome,
} from "./reconcile-game-state.ts";

export interface ExpeditionRewardConfig {
  /**
   * Ozean Batch A: generalized from a single shared resource to one
   * resource PER ROUTE (Document 07 §198 leaves the exact item undecided
   * per route — this is still content configuration, not a new
   * mechanism). Vulkankrater's 3 routes all still map to the same
   * resource as before (`game-config.ts`), so its behavior is unchanged;
   * Ozean's routes can now each grant their own real Water resource. The
   * reconciliation pass below does a plain per-route config lookup, the
   * same shape as the pre-existing `routineRewardQuantityByRouteId` — no
   * route-ID-specific branching in the pass itself.
   */
  readonly routineRewardResourceIdByRouteId: Readonly<
    Record<RouteId, ResourceId>
  >;
  readonly routineRewardQuantityByRouteId: Readonly<Record<RouteId, number>>;
  readonly componentHuntBonusChance: ProbabilityBps;
  readonly componentHuntProtectionThreshold: number;
  /**
   * docs/rebuild/09 §2 Echo Charges; docs/rebuild/15 Phase R6 §6 ("adapt
   * rewards to Ascension-relevant progression such as ... Echo Charges" —
   * not the legacy Shop-product/crafting reward this pass otherwise still
   * reuses). Flat per-completion grant, same for every route in this
   * slice — Document 09 doesn't yet differentiate Echo Charge yield by
   * route.
   */
  readonly echoChargeRewardPerCompletion: number;
}

/** Document 15 Task 05.8's `CraftXpConfig` precedent, applied to expeditions. */
export interface ExpeditionXpConfig {
  readonly xpPerExpeditionCompletion: number;
  readonly xpPerLevel: number;
  readonly levelCap: number;
}

const NO_XP: ExpeditionXpConfig = {
  xpPerExpeditionCompletion: 0,
  xpPerLevel: 1,
  levelCap: 1,
};

/** Document 15 Task 07.1: World ("first route completion") is one of Document 09 §7's five Shop Rank source classes. Defaults to a no-op for callers that don't configure it. */
export interface ExpeditionRankProgressConfig {
  readonly progressPerExpeditionCompletion: number;
  readonly progressPerRank: number;
  readonly rankCap: number;
}

const NO_RANK_PROGRESS: ExpeditionRankProgressConfig = {
  progressPerExpeditionCompletion: 0,
  progressPerRank: 1,
  rankCap: 1,
};

export function createExpeditionReconciliationPass(
  rewardConfig: ExpeditionRewardConfig,
  xpConfig: ExpeditionXpConfig = NO_XP,
  rankProgressConfig: ExpeditionRankProgressConfig = NO_RANK_PROGRESS,
): ReconciliationPass {
  return (state, _elapsedMs, now, catalog): ReconciliationPassOutcome => {
    const events: ExpeditionEvent[] = [];
    let inventory = state.inventory;
    let progression = state.progression;
    let nextOwnedCatchmons = state.catchmons.ownedCatchmons;
    let nextExpeditions = state.expeditions.expeditions;
    let nextActiveExpeditionIds = state.expeditions.activeExpeditionIds;
    let nextDiscoveryStates = state.world.discoveryStates;
    let nextEncounterOpportunities = state.world.encounterOpportunities;
    let nextComponentHuntBonusProtection =
      state.world.componentHuntBonusProtection;
    let nextRouteStates = state.world.routeStates;
    let echoCharges = state.forge.echoCharges;
    let changed = false;

    for (const expeditionId of state.expeditions.activeExpeditionIds) {
      const expedition = state.expeditions.expeditions[expeditionId];
      invariant(
        expedition !== undefined,
        `activeExpeditionIds references unknown expedition "${expeditionId}"`,
      );
      if (expedition.status !== "IN_PROGRESS") continue;
      if (expedition.completesAtMs > now) continue;

      const route = catalog.routes.get(expedition.routeId);
      invariant(
        route !== undefined,
        `Expedition "${expeditionId}" references unknown route "${expedition.routeId}" — should have been caught by createGameCatalog`,
      );

      changed = true;
      const rng = createRandomSource(expedition.resultSeed);

      // --- Task 06.6: guaranteed routine reward (Ozean Batch A: resource
      // AND quantity are both resolved per-route — a plain config lookup,
      // not a route-ID branch) ---
      const routineRewardResourceId =
        rewardConfig.routineRewardResourceIdByRouteId[expedition.routeId];
      invariant(
        routineRewardResourceId !== undefined,
        `No configured routine reward resource for route "${expedition.routeId}"`,
      );
      const routineRewardItemId = catalog.resources.get(
        routineRewardResourceId,
      )?.itemId;
      invariant(
        routineRewardItemId !== undefined,
        `Unknown routine reward resource "${routineRewardResourceId}" — should have been caught by createGameCatalog`,
      );
      const routineRewardQuantity =
        rewardConfig.routineRewardQuantityByRouteId[expedition.routeId];
      invariant(
        routineRewardQuantity !== undefined,
        `No configured routine reward quantity for route "${expedition.routeId}"`,
      );
      const routineRewards = resolveRoutineReward(
        routineRewardItemId,
        routineRewardQuantity,
      );
      for (const line of routineRewards) {
        inventory = addToInventory(inventory, line.itemId, line.quantity);
      }

      // --- Task 06.6: Component Hunt's special-component bonus ---
      // Phase 11 scale-audit fix: a route's `specialComponentPool` is a
      // pool of eligible components, not a single value with extra dead
      // entries — always taking index 0 silently made every entry past
      // the first unreachable content. A deterministic, seeded pick keeps
      // the same reload-safety guarantee (same `resultSeed` -> same
      // outcome) while actually using the whole pool.
      let bonusComponentGranted: ExpeditionResult["bonusComponentGranted"];
      const specialComponentId =
        route.specialComponentPool.length > 0
          ? route.specialComponentPool[
              nextIntExclusive(rng, route.specialComponentPool.length)
            ]
          : undefined;
      if (specialComponentId) {
        const consecutiveMisses =
          nextComponentHuntBonusProtection[expedition.routeId] ?? 0;
        const bonusResult = resolveSpecialComponentBonus(
          rng,
          rewardConfig.componentHuntBonusChance,
          rewardConfig.componentHuntProtectionThreshold,
          consecutiveMisses,
        );
        nextComponentHuntBonusProtection = {
          ...nextComponentHuntBonusProtection,
          [expedition.routeId]: bonusResult.nextConsecutiveMisses,
        };
        if (bonusResult.granted) {
          bonusComponentGranted = specialComponentId;
          const component = catalog.components.get(specialComponentId);
          invariant(
            component !== undefined,
            `Route "${expedition.routeId}" references unknown component "${specialComponentId}" — should have been caught by createGameCatalog`,
          );
          inventory = addToInventory(inventory, component.itemId, 1);
        }
      }

      // --- Task 06.7/06.8: Discovery Survey always yields one encounter ---
      let pendingEncounterId: EncounterId | undefined;
      if (route.encounterPool.length > 0) {
        const isOwnedLine = (
          speciesId: (typeof route.encounterPool)[number],
        ) => {
          const species = catalog.catchmonSpecies.get(speciesId);
          if (!species) return false;
          return nextDiscoveryStates[species.catchmonLineId] === "OWNED";
        };
        const targetSpeciesId = selectEncounterTarget(
          rng,
          route.encounterPool,
          isOwnedLine,
        );
        const targetSpecies = catalog.catchmonSpecies.get(targetSpeciesId);
        invariant(
          targetSpecies !== undefined,
          `Route "${expedition.routeId}" encounterPool references unknown species "${targetSpeciesId}"`,
        );
        const targetLineId: CatchmonLineId = targetSpecies.catchmonLineId;
        const currentStatus = nextDiscoveryStates[targetLineId] ?? "UNKNOWN";
        const nextStatusTarget =
          currentStatus === "OWNED" ? "OWNED" : "ENCOUNTERED";
        const advanced = advanceDiscoveryStatus(
          currentStatus,
          nextStatusTarget,
        );
        invariant(
          advanced.ok,
          `Illegal discovery transition ${currentStatus} -> ${nextStatusTarget} for line "${targetLineId}" — should be unreachable (only forward targets are ever requested here)`,
        );
        nextDiscoveryStates = {
          ...nextDiscoveryStates,
          [targetLineId]: advanced.value,
        };

        const encounterId = EncounterId.from(`encounter-${expeditionId}`);
        const encounter: EncounterOpportunityState = {
          encounterId,
          expeditionId,
          routeId: expedition.routeId,
          targetLineId,
          targetSpeciesId,
          discoveryBoostBonus: expedition.leadDiscoveryBoostBonus,
          status: "PENDING",
          createdAtMs: now,
        };
        nextEncounterOpportunities = {
          ...nextEncounterOpportunities,
          [encounterId]: encounter,
        };
        pendingEncounterId = encounterId;
        events.push({
          kind: "ENCOUNTER_CREATED",
          encounterId,
          expeditionId,
          targetLineId,
          targetSpeciesId,
        });
      }

      // --- Task 06.5: release the Lead, award XP once ---
      const lead = nextOwnedCatchmons[expedition.leadCatchmonId];
      if (lead) {
        const releasedLead: OwnedCatchmonState = {
          ...lead,
          currentAssignment: { kind: "UNASSIGNED" },
        };
        nextOwnedCatchmons = {
          ...nextOwnedCatchmons,
          [expedition.leadCatchmonId]: applyXp(
            releasedLead,
            xpConfig.xpPerExpeditionCompletion,
            xpConfig.xpPerLevel,
            xpConfig.levelCap,
          ),
        };
      }

      // --- Ozean Batch A: generic route-completion signal ---
      nextRouteStates = {
        ...nextRouteStates,
        [expedition.routeId]: "COMPLETED",
      };

      // --- Phase R6 §6: Echo Charges as an Ascension-relevant expedition reward ---
      echoCharges += rewardConfig.echoChargeRewardPerCompletion;

      // --- Task 07.1: World Shop Rank contribution, once per completion ---
      progression = applyRankProgress(
        progression,
        rankProgressConfig.progressPerExpeditionCompletion,
        rankProgressConfig.progressPerRank,
        rankProgressConfig.rankCap,
      );

      // --- Task 06.5: durable, exactly-once result ---
      const result: ExpeditionResult = {
        routineRewards,
        ...(bonusComponentGranted ? { bonusComponentGranted } : {}),
        ...(pendingEncounterId ? { encounterId: pendingEncounterId } : {}),
        resolvedAtMs: now,
      };
      const completedExpedition: ExpeditionState = {
        ...expedition,
        status: "COMPLETED",
        ...(pendingEncounterId ? { pendingEncounterId } : {}),
        result,
      };
      nextExpeditions = {
        ...nextExpeditions,
        [expeditionId]: completedExpedition,
      };
      nextActiveExpeditionIds = nextActiveExpeditionIds.filter(
        (id) => id !== expeditionId,
      );

      events.push({
        kind: "EXPEDITION_COMPLETED",
        expeditionId,
        routeId: expedition.routeId,
        leadCatchmonId: expedition.leadCatchmonId,
        result,
      });
    }

    if (!changed) {
      return { nextState: state, events: [] };
    }

    return {
      nextState: {
        ...state,
        inventory,
        progression,
        catchmons: { ...state.catchmons, ownedCatchmons: nextOwnedCatchmons },
        expeditions: {
          activeExpeditionIds: nextActiveExpeditionIds,
          expeditions: nextExpeditions,
        },
        world: {
          ...state.world,
          discoveryStates: nextDiscoveryStates,
          encounterOpportunities: nextEncounterOpportunities,
          componentHuntBonusProtection: nextComponentHuntBonusProtection,
          routeStates: nextRouteStates,
        },
        forge: { ...state.forge, echoCharges },
      },
      events,
    };
  };
}
