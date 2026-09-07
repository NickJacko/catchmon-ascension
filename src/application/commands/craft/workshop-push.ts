/**
 * Design owner: Document 15 Task 04.11 (Workshop Push); Document 04 §79-81
 * Shop Momentum -> Workshop Push; Document 05 §59-60 Shop Momentum
 * Customer-Side Rules / Momentum Decision Triangle (Workshop Push as the
 * "PRODUCTION" leg alongside Premium Pitch/Recommend).
 *
 * Spends Momentum to advance one station's active craft by a flat,
 * timestamp-safe amount (`completesAtMs` moves earlier, floored at
 * `startedAtMs` so a duration can never go negative). Bounded per Document
 * 04 §80-81 by a per-craft push limit (`workshopPushCount`) — the anti-spam
 * formula itself is explicitly deferred by design, so only this one simple
 * bound is implemented, not a full cost-scaling/diminishing-effect system.
 */
import { type StationId } from "../../../core/ids/index.ts";
import { toTimestampMs, type TimestampMs } from "../../../core/time/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { spendMomentum } from "../../../domain/shop/index.ts";
import {
  type CraftActivitySnapshot,
  type GameState,
  type StationState,
} from "../../../domain/game-state/index.ts";
import {
  PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT,
  PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST,
  PROVISIONAL_WORKSHOP_PUSH_TIME_REDUCTION_MS,
} from "../../../content/vertical-slice/index.ts";
import { type CommandHandler } from "../../engine/index.ts";

export interface WorkshopPushPayload {
  readonly stationId: StationId;
}

export interface WorkshopPushAppliedEvent {
  readonly kind: "WORKSHOP_PUSH_APPLIED";
  readonly stationId: StationId;
  readonly newCompletesAtMs: TimestampMs;
  readonly pushCount: number;
}

export const workshopPushHandler: CommandHandler<
  GameState,
  WorkshopPushPayload,
  WorkshopPushAppliedEvent
> = (state, command) => {
  const { stationId } = command.payload;
  const station = state.crafting.stations[stationId];
  const activeCraft = station?.activeCraft;
  if (!station || !activeCraft) {
    return err({
      code: "NO_ACTIVE_CRAFT",
      message: `Station "${stationId}" has no active craft to push`,
    });
  }

  const pushCount = activeCraft.workshopPushCount ?? 0;
  if (pushCount >= PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT) {
    return err({
      code: "WORKSHOP_PUSH_LIMIT_REACHED",
      message: `Station "${stationId}"'s active craft has already been pushed the maximum ${String(PROVISIONAL_WORKSHOP_PUSH_MAX_PUSHES_PER_CRAFT)} times`,
    });
  }

  const spent = spendMomentum(
    state.shop,
    PROVISIONAL_WORKSHOP_PUSH_MOMENTUM_COST,
  );
  if (!spent.ok) {
    return err({
      code: "INSUFFICIENT_MOMENTUM",
      message: `Not enough Shop Momentum to push station "${stationId}"'s craft`,
    });
  }

  const newCompletesAtMs = toTimestampMs(
    Math.max(
      activeCraft.startedAtMs,
      activeCraft.completesAtMs - PROVISIONAL_WORKSHOP_PUSH_TIME_REDUCTION_MS,
    ),
  );

  const nextActiveCraft: CraftActivitySnapshot = {
    ...activeCraft,
    completesAtMs: newCompletesAtMs,
    workshopPushCount: pushCount + 1,
  };
  const nextStation: StationState = {
    ...station,
    activeCraft: nextActiveCraft,
  };

  const nextState: GameState = {
    ...state,
    shop: spent.value,
    crafting: {
      stations: { ...state.crafting.stations, [stationId]: nextStation },
    },
  };

  return ok({
    nextState,
    events: [
      {
        kind: "WORKSHOP_PUSH_APPLIED",
        stationId,
        newCompletesAtMs,
        pushCount: pushCount + 1,
      },
    ],
  });
};
