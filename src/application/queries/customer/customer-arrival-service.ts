/**
 * Design owner: Document 15 Task 04.3 (Active Customer Arrival Service);
 * 05 Customer & Selling System §64-68 (Customer Arrival Architecture,
 * Active Customer Capacity, Arrival Rate vs Capacity), §122-123 (Offline
 * Customer Behavior — "customer traffic effectively pauses/abstracts");
 * 14 Technical Architecture §86 Customer Arrival Is Active-Play Biased.
 *
 * A pure, stateless eligibility check: "is now a valid moment for a new
 * customer to arrive?" — timestamp-based, no ticking/countdown state.
 * Deliberately NOT a reconciliation pass: this is meant to be consulted
 * only from an *active session* loop (the presentation/app layer, while
 * the shop screen is open), never from `reconcileGameState`'s offline
 * catch-up. That is what makes "no offline backlog generation" true —
 * there is no code path that calls this (or `ARRIVE_CUSTOMER`) for
 * elapsed offline time, only for real active-session ticks. Bounded
 * capacity itself is already enforced inside `ARRIVE_CUSTOMER` (Task
 * 04.2); this only adds the minimum-interval pacing between arrivals.
 */
import { type DurationMs } from "../../../core/math/duration.ts";
import { type TimestampMs } from "../../../core/time/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";

export function isCustomerArrivalEligible(
  state: GameState,
  now: TimestampMs,
  minArrivalIntervalMs: DurationMs,
): boolean {
  const last = state.customers.lastArrivalAtMs;
  if (last === undefined) {
    return true;
  }
  return now - last >= minArrivalIntervalMs;
}
