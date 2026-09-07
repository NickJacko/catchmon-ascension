/**
 * Design owner: 14 Technical Architecture §49 Domain Events.
 * Presentation-facing events only (VFX/sound/telemetry/tests) — not the
 * durable source of truth (§50-52). No React/UI code lives here.
 */
import {
  type ProductId,
  type RecipeId,
  type ReservationId,
  type StationId,
} from "../../../core/ids/index.ts";
import { type TimestampMs } from "../../../core/time/index.ts";

export type CraftEvent =
  | {
      readonly kind: "CRAFT_STARTED";
      readonly stationId: StationId;
      readonly recipeId: RecipeId;
      readonly reservationId: ReservationId;
      readonly startedAtMs: TimestampMs;
      readonly completesAtMs: TimestampMs;
    }
  | {
      readonly kind: "CRAFT_QUEUED";
      readonly stationId: StationId;
      readonly recipeId: RecipeId;
      readonly craftId: string;
      readonly queuedAtMs: TimestampMs;
    }
  | {
      readonly kind: "CRAFT_QUEUE_CANCELLED";
      readonly stationId: StationId;
      readonly craftId: string;
    }
  | {
      readonly kind: "CRAFT_COMPLETED";
      readonly stationId: StationId;
      readonly recipeId: RecipeId;
      readonly outputProductId: ProductId;
      readonly outputQuantity: number;
      readonly completesAtMs: TimestampMs;
    };
