/**
 * Design owner: Document 15 Task 03.6 (Offline Craft Queue
 * Reconciliation); 14 Technical Architecture §83 Craft Queue Offline
 * Reconciliation, §84 Storage-Blocked Craft; 04 Crafting & Product System
 * §40 Automatic Queue Continuation, §41 Craft Completion Feedback, §42
 * Full Inventory Protection, §43 Crafting Failure (none — no destruction
 * path exists here).
 *
 * For every station with an active craft whose `completesAtMs <= now`:
 * consumes its reservation, delivers output, and — historical time
 * permitting — promotes and completes as many queued crafts as actually
 * elapsed (Document 14 §83 step 4: "start next queued craft at the
 * historical eligible time", i.e. the *previous* craft's completion
 * timestamp, not `now`). Stops per station on an empty queue or a
 * blocked delivery (§84).
 *
 * `canAcceptOutput` defaults to "always has room" — no storage-cap system
 * exists yet in Phase 3 (Document 03 §29 defers exact capacities), so
 * normal play never actually blocks. It is injectable so tests can prove
 * the protection framework itself is correct without needing a real cap
 * system to exist first.
 */
import { addDurationToTimestamp } from "../../core/time/time-math.ts";
import { toDurationMs } from "../../core/math/duration.ts";
import {
  deriveSubSeed,
  nextRandomEventCounter,
  type RandomEventCounter,
} from "../../core/random/index.ts";
import {
  type ItemId,
  type OwnedCatchmonId,
  type StationId,
} from "../../core/ids/index.ts";
import { invariant } from "../../core/assertions/invariant.ts";
import { applyXp } from "../../domain/catchmons/index.ts";
import { applyRankProgress } from "../../domain/progression/index.ts";
import {
  type CraftActivitySnapshot,
  type GameState,
  type InventoryState,
  type OwnedCatchmonState,
  type StationState,
} from "../../domain/game-state/index.ts";
import {
  addToInventory,
  consumeReservation,
  productItemId,
} from "../../domain/inventory/index.ts";
import { type CraftEvent } from "../commands/craft/craft-events.ts";
import {
  type ReconciliationPass,
  type ReconciliationPassOutcome,
} from "./reconcile-game-state.ts";

export type CanAcceptOutput = (
  state: GameState,
  itemId: ItemId,
  quantity: number,
) => boolean;

const alwaysHasRoom: CanAcceptOutput = () => true;

/** Document 15 Task 05.8: Workshop XP is awarded to whichever Catchmon supported the station when its craft completes (Document 06 §57 "completed supported crafts"). Defaults to 0/no-op for callers that don't configure XP. */
export interface CraftXpConfig {
  readonly xpPerCraftCompletion: number;
  readonly xpPerLevel: number;
  readonly levelCap: number;
}

const NO_XP: CraftXpConfig = {
  xpPerCraftCompletion: 0,
  xpPerLevel: 1,
  levelCap: 1,
};

/** Document 15 Task 07.1: Craftsmanship is one of Document 09 §7's five Shop Rank source classes. Defaults to a no-op for callers that don't configure it. */
export interface CraftRankProgressConfig {
  readonly progressPerCraftCompletion: number;
  readonly progressPerRank: number;
  readonly rankCap: number;
}

const NO_RANK_PROGRESS: CraftRankProgressConfig = {
  progressPerCraftCompletion: 0,
  progressPerRank: 1,
  rankCap: 1,
};

export function createCraftQueueReconciliationPass(
  canAcceptOutput: CanAcceptOutput = alwaysHasRoom,
  xpConfig: CraftXpConfig = NO_XP,
  rankProgressConfig: CraftRankProgressConfig = NO_RANK_PROGRESS,
): ReconciliationPass {
  return (state, _elapsedMs, now, catalog): ReconciliationPassOutcome => {
    let inventory: InventoryState = state.inventory;
    let progression = state.progression;
    let randomEventCounter: RandomEventCounter = state.meta.randomEventCounter;
    const events: CraftEvent[] = [];
    const nextStations: Record<StationId, StationState> = {
      ...state.crafting.stations,
    };
    const nextOwnedCatchmons: Record<OwnedCatchmonId, OwnedCatchmonState> = {
      ...state.catchmons.ownedCatchmons,
    };
    let changed = false;

    const stationEntries = Object.entries(state.crafting.stations) as [
      StationId,
      StationState,
    ][];
    for (const [stationId, originalStation] of stationEntries) {
      let station = originalStation;

      while (station.activeCraft && station.activeCraft.completesAtMs <= now) {
        const craft = station.activeCraft;
        const recipe = catalog.recipes.get(craft.recipeId);
        invariant(
          recipe !== undefined,
          `Active craft references unknown recipe "${craft.recipeId}" — should have been caught by createGameCatalog`,
        );
        const product = catalog.products.get(recipe.outputProductId);
        invariant(
          product !== undefined,
          `Recipe "${recipe.recipeId}" references unknown product "${recipe.outputProductId}" — should have been caught by createGameCatalog`,
        );

        const consumed = consumeReservation(inventory, craft.reservationId);
        invariant(
          consumed.ok,
          `Active craft's reservation "${craft.reservationId}" was missing at completion time — reservations must outlive the craft they back`,
        );
        inventory = consumed.value;
        changed = true;

        // Phase 3 does not roll quality (Document 04 §68: "exact formula
        // is deferred") — output always lands as STANDARD.
        const outputItemId = productItemId(product.productId, "STANDARD");

        events.push({
          kind: "CRAFT_COMPLETED",
          stationId: station.stationId,
          recipeId: craft.recipeId,
          outputProductId: product.productId,
          outputQuantity: product.outputQuantity,
          completesAtMs: craft.completesAtMs,
        });

        if (!canAcceptOutput(state, outputItemId, product.outputQuantity)) {
          // Document 14 §84: protect the result at the station and pause
          // — do not promote the next queued craft while blocked.
          station = {
            stationId: station.stationId,
            archetype: station.archetype,
            queuedCrafts: station.queuedCrafts,
            supportCatchmonIds: station.supportCatchmonIds,
            completedOutput: {
              productId: product.productId,
              quantity: product.outputQuantity,
            },
          };
          break;
        }

        inventory = addToInventory(
          inventory,
          outputItemId,
          product.outputQuantity,
        );
        progression = applyRankProgress(
          progression,
          rankProgressConfig.progressPerCraftCompletion,
          rankProgressConfig.progressPerRank,
          rankProgressConfig.rankCap,
        );

        for (const supportId of station.supportCatchmonIds) {
          const supportOwned = nextOwnedCatchmons[supportId];
          if (supportOwned) {
            nextOwnedCatchmons[supportId] = applyXp(
              supportOwned,
              xpConfig.xpPerCraftCompletion,
              xpConfig.xpPerLevel,
              xpConfig.levelCap,
            );
          }
        }

        const [nextQueued, ...remainingQueue] = station.queuedCrafts;
        if (!nextQueued) {
          station = {
            stationId: station.stationId,
            archetype: station.archetype,
            queuedCrafts: station.queuedCrafts,
            supportCatchmonIds: station.supportCatchmonIds,
          };
          break;
        }

        const nextRecipe = catalog.recipes.get(nextQueued.recipeId);
        invariant(
          nextRecipe !== undefined,
          `Queued craft references unknown recipe "${nextQueued.recipeId}" — should have been caught by createGameCatalog`,
        );
        const startedAtMs = craft.completesAtMs; // Document 14 §83: historical eligible time, not `now`.
        const durationMs = toDurationMs(nextRecipe.craftDuration);
        const completesAtMs = addDurationToTimestamp(startedAtMs, durationMs);
        const qualityRollSeed = deriveSubSeed(
          state.meta.rootRandomSeed,
          randomEventCounter,
          `RECONCILE_PROMOTE:${nextQueued.craftId}`,
        );
        randomEventCounter = nextRandomEventCounter(randomEventCounter);

        const promoted: CraftActivitySnapshot = {
          recipeId: nextQueued.recipeId,
          startedAtMs,
          completesAtMs,
          durationMs,
          qualityRollSeed,
          reservationId: nextQueued.reservationId,
        };
        station = {
          stationId: station.stationId,
          archetype: station.archetype,
          activeCraft: promoted,
          queuedCrafts: remainingQueue,
          supportCatchmonIds: station.supportCatchmonIds,
        };
      }

      nextStations[stationId] = station;
    }

    if (!changed) {
      return { nextState: state, events: [] };
    }

    return {
      nextState: {
        ...state,
        meta: { ...state.meta, randomEventCounter },
        inventory,
        progression,
        crafting: { stations: nextStations },
        catchmons: {
          ...state.catchmons,
          ownedCatchmons: nextOwnedCatchmons,
        },
      },
      events,
    };
  };
}

/** Production default: no storage-cap system exists yet, so output is always accepted. */
export const craftQueueReconciliationPass: ReconciliationPass =
  createCraftQueueReconciliationPass();
