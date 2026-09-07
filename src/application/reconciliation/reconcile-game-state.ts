/**
 * Design owner: 14 Technical Architecture — §117 Reconciliation Model,
 * §118 Reconciliation Triggers, §119 No Per-Second Save Loop, §127 System
 * Clock Manipulation.
 *
 * `RECONCILIATION_PASSES` was empty through Task 02.5 ("At first it may
 * have no feature-specific work"). Task 03.6 adds the first real one
 * (offline craft queue reconciliation) — `ReconciliationEvent` now also
 * includes `CraftEvent` so that pass can report what it did through the
 * same channel the framework already exposes, rather than each feature
 * pass needing its own separate report shape. Document 14 §49 already
 * envisions one shared domain-event vocabulary across features
 * (CRAFT_STARTED, CRAFT_COMPLETED, CUSTOMER_SALE_RESOLVED, ... all listed
 * together) — this extends that same shared vocabulary, it does not
 * invent a parallel one.
 */
import { type DurationMs, ZERO_DURATION_MS } from "../../core/math/duration.ts";
import { elapsedBetween } from "../../core/time/time-math.ts";
import { type TimestampMs } from "../../core/time/timestamp.ts";
import { type GameCatalog } from "../../domain/catalog/index.ts";
import { type GameState } from "../../domain/game-state/index.ts";
import { type CraftEvent } from "../commands/craft/craft-events.ts";
import { type ExpeditionEvent } from "../commands/expeditions/expedition-events.ts";
import { type JourneyEvent } from "../commands/journey/journey-events.ts";
import { type InfrastructureEvent } from "../commands/shop-infrastructure/infrastructure-events.ts";
import { type WorldEvent } from "./world-events.ts";

export type ReconciliationEvent =
  | {
      readonly kind: "CLOCK_MOVED_BACKWARDS";
      readonly lastActiveAtMs: TimestampMs;
      readonly now: TimestampMs;
    }
  | CraftEvent
  | ExpeditionEvent
  | JourneyEvent
  | InfrastructureEvent
  | WorldEvent;

export interface ReconciliationPassOutcome {
  readonly nextState: GameState;
  readonly events: readonly ReconciliationEvent[];
}

/**
 * A single reconciliation step. Pure and deterministic — no I/O, no
 * Date.now()/Math.random() (guarded by the application ESLint block).
 */
export type ReconciliationPass = (
  state: GameState,
  elapsedMs: DurationMs,
  now: TimestampMs,
  catalog: GameCatalog,
) => ReconciliationPassOutcome;

/** Deterministic pass order (Document 14 §117-118). Empty until a feature owns offline reconciliation. */
export const RECONCILIATION_PASSES: readonly ReconciliationPass[] = [];

export interface ReconciliationReport {
  readonly nextState: GameState;
  readonly elapsedMs: DurationMs;
  readonly events: readonly ReconciliationEvent[];
}

/**
 * `reconcileGameState(state, now, catalog)` (Document 14 §117). `passes`
 * defaults to the real `RECONCILIATION_PASSES` chain; tests may inject a
 * synthetic list to prove the pipeline's ordering/idempotency properties
 * without waiting for a real feature pass to exist.
 */
export function reconcileGameState(
  state: GameState,
  now: TimestampMs,
  catalog: GameCatalog,
  passes: readonly ReconciliationPass[] = RECONCILIATION_PASSES,
): ReconciliationReport {
  const elapsed = elapsedBetween(state.meta.lastActiveAtMs, now);

  if (!elapsed.ok) {
    // Document 14 §127: a local-first game cannot prevent the player
    // moving the device clock backwards, and does not require aggressive
    // anti-cheat. Treat it as zero elapsed time instead of crashing or
    // fabricating a negative duration, and report it rather than
    // silently swallowing it.
    return {
      nextState: state,
      elapsedMs: ZERO_DURATION_MS,
      events: [
        {
          kind: "CLOCK_MOVED_BACKWARDS",
          lastActiveAtMs: state.meta.lastActiveAtMs,
          now,
        },
      ],
    };
  }

  let nextState = state;
  const events: ReconciliationEvent[] = [];
  for (const pass of passes) {
    const outcome = pass(nextState, elapsed.value, now, catalog);
    nextState = outcome.nextState;
    events.push(...outcome.events);
  }

  return {
    nextState: {
      ...nextState,
      meta: { ...nextState.meta, lastActiveAtMs: now },
    },
    elapsedMs: elapsed.value,
    events,
  };
}
