/**
 * Design owner: Document 15 Task 06.4 (Expedition Start Command); Document
 * 07 §20-27 (Preparation, One Functional Duty, Loadout, Capture Aid
 * Reservation), §23 Expedition Start Snapshot; Document 14 §99-100.
 * Migrated docs/rebuild/15 Phase R6 (docs/rebuild/R1_DEPENDENCY_AUDIT.md
 * §7.1's locked target: "system/Journey milestone + region/route access →
 * expedition availability"): the legacy Expedition-Hub-ownership gate
 * (Shop Infrastructure) is replaced by a generic Journey-system-milestone
 * check (`EXPEDITIONS_SYSTEM_MILESTONE` in `progression.unlockedSystemIds`,
 * set by `ATTEMPT_STAGE` on the first Region completion — docs/rebuild/07
 * §7's unlock sequence) — this handler has zero dependency on Shop
 * Infrastructure ownership. `checkRouteAccess` below (unchanged, already
 * generic) supplies the "region unlocked + route available" half of the
 * target model.
 *
 * Atomic: validates the milestone, the route, Lead availability, reserves
 * the Capture Aid if requested, assigns the Lead to EXPEDITION duty,
 * snapshots the Lead's discovery-boost effect, and sets the completion
 * timestamp + result seed — all in one handler, so a failure at any step
 * leaves `state` completely untouched (Document 14 §227 "No Partial
 * Command Commit"). No Support Catchmon is ever assigned by this command
 * (Task 06.3's module doc: this slice deliberately omits Support —
 * `ExpeditionState.supportCatchmonIds` is always `[]` here).
 */
import {
  ExpeditionId,
  type OwnedCatchmonId,
  type ProductId,
  ReservationId,
  type RouteId,
} from "../../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../../core/time/time-math.ts";
import { toDurationMs } from "../../../core/math/duration.ts";
import {
  deriveSubSeed,
  nextRandomEventCounter,
} from "../../../core/random/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { checkRouteAccess } from "../../../domain/world/index.ts";
import { type MagnitudeTable } from "../../../domain/catchmons/index.ts";
import { reserveInventory } from "../../../domain/inventory/inventory-ledger.ts";
import { productItemId } from "../../../domain/inventory/product-item-id.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../../domain/journey/index.ts";
import {
  type ExpeditionState,
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import { getExpeditionDiscoveryBoostEffect } from "../../queries/catchmons/catchmon-effect-queries.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ExpeditionEvent } from "./expedition-events.ts";

export interface StartExpeditionPayload {
  readonly routeId: RouteId;
  readonly leadCatchmonId: OwnedCatchmonId;
  readonly bringCaptureAid: boolean;
}

export function createStartExpeditionHandler(
  catalog: GameCatalog,
  captureAidProductId: ProductId,
  routeDurationMsByRouteId: Readonly<Record<RouteId, number>>,
  maxConcurrentExpeditions: number,
  catchmonCapabilityMagnitudes: MagnitudeTable,
): CommandHandler<GameState, StartExpeditionPayload, ExpeditionEvent> {
  return (state, command) => {
    const { routeId, leadCatchmonId, bringCaptureAid } = command.payload;

    if (
      !state.progression.unlockedSystemIds.includes(
        EXPEDITIONS_SYSTEM_MILESTONE,
      )
    ) {
      return err({
        code: "EXPEDITIONS_NOT_YET_UNLOCKED",
        message:
          "Expeditions unlock after completing your first Region's Journey.",
      });
    }

    const route = catalog.routes.get(routeId);
    if (!route) {
      return err({
        code: "ROUTE_NOT_FOUND",
        message: `No route "${routeId}" in the catalog`,
      });
    }

    const blockedReason = checkRouteAccess(
      route,
      state.world.unlockedRegionIds,
    );
    if (blockedReason) {
      return err({
        code: `ROUTE_${blockedReason}`,
        message: `Route "${routeId}" is not currently accessible (${blockedReason})`,
      });
    }

    if (
      state.expeditions.activeExpeditionIds.length >= maxConcurrentExpeditions
    ) {
      return err({
        code: "EXPEDITION_SLOT_FULL",
        message: `Already at the maximum ${String(maxConcurrentExpeditions)} concurrent expedition(s)`,
      });
    }

    const lead = state.catchmons.ownedCatchmons[leadCatchmonId];
    if (!lead) {
      return err({
        code: "LEAD_NOT_FOUND",
        message: `No owned Catchmon "${leadCatchmonId}"`,
      });
    }
    if (lead.currentAssignment.kind !== "UNASSIGNED") {
      return err({
        code: "LEAD_NOT_AVAILABLE",
        message: `Owned Catchmon "${leadCatchmonId}" is already on ${lead.currentAssignment.kind} duty`,
      });
    }

    if (bringCaptureAid && route.encounterPool.length === 0) {
      return err({
        code: "CAPTURE_AID_NOT_APPLICABLE",
        message: `Route "${routeId}" has no encounter pool — a Capture Aid has nothing to do here`,
      });
    }

    const durationMs = routeDurationMsByRouteId[routeId];
    if (durationMs === undefined) {
      return err({
        code: "ROUTE_DURATION_NOT_CONFIGURED",
        message: `No configured duration for route "${routeId}"`,
      });
    }

    const expeditionId = ExpeditionId.from(`expedition-${command.commandId}`);

    let nextInventory = state.inventory;
    let loadoutReservationId: ReservationId | undefined;
    if (bringCaptureAid) {
      loadoutReservationId = ReservationId.from(
        `expedition-loadout-${command.commandId}`,
      );
      const reserved = reserveInventory(
        state.inventory,
        loadoutReservationId,
        "EXPEDITION",
        expeditionId,
        [
          {
            itemId: productItemId(captureAidProductId, "STANDARD"),
            quantity: 1,
          },
        ],
        command.issuedAtMs,
      );
      if (!reserved.ok) {
        return err({
          code: reserved.error.code,
          message: JSON.stringify(reserved.error),
        });
      }
      nextInventory = reserved.value;
    }

    const startedAtMs = command.issuedAtMs;
    const completesAtMs = addDurationToTimestamp(
      startedAtMs,
      toDurationMs(durationMs),
    );
    const resultSeed = deriveSubSeed(
      state.meta.rootRandomSeed,
      state.meta.randomEventCounter,
      `START_EXPEDITION:${command.commandId}`,
    );
    const discoveryBoostEffect = getExpeditionDiscoveryBoostEffect(
      state,
      catalog,
      leadCatchmonId,
      catchmonCapabilityMagnitudes,
    );

    const expedition: ExpeditionState = {
      expeditionId,
      routeId,
      status: "IN_PROGRESS",
      startedAtMs,
      completesAtMs,
      leadCatchmonId,
      supportCatchmonIds: [],
      resultSeed,
      leadDiscoveryBoostBonus: discoveryBoostEffect?.boostMagnitude ?? 0,
      ...(loadoutReservationId ? { loadoutReservationId } : {}),
    };

    const nextLead: OwnedCatchmonState = {
      ...lead,
      currentAssignment: { kind: "EXPEDITION", expeditionId },
    };

    const nextState: GameState = {
      ...state,
      meta: {
        ...state.meta,
        randomEventCounter: nextRandomEventCounter(
          state.meta.randomEventCounter,
        ),
      },
      inventory: nextInventory,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [leadCatchmonId]: nextLead,
        },
      },
      expeditions: {
        activeExpeditionIds: [
          ...state.expeditions.activeExpeditionIds,
          expeditionId,
        ],
        expeditions: {
          ...state.expeditions.expeditions,
          [expeditionId]: expedition,
        },
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "EXPEDITION_STARTED",
          expeditionId,
          routeId,
          leadCatchmonId,
          startedAtMs,
          completesAtMs,
        },
      ],
    });
  };
}
