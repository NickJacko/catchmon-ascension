/**
 * Design owner: Document 15 Task 08.1; Document 14 §117-118 Reconciliation
 * Triggers ("app foreground, screen focus, explicit player action... not
 * only offline resume").
 *
 * `reconcileGameState` is a pure function, not a `CommandHandler` — this
 * is the one thin wrapper that lets the SAME atomic execute/persist/
 * notify pipeline every other command already goes through
 * (`GameEngine.execute`) also drive reconciliation, instead of inventing
 * a second, parallel state-update path. `command.issuedAtMs` (stamped
 * from the injected `Clock` by `createCommand`, same as every other
 * command) is reconciliation's "now" — this handler never reads a clock
 * itself.
 */
import { type GameCatalog } from "../domain/catalog/index.ts";
import { type GameState } from "../domain/game-state/index.ts";
import {
  reconcileGameState,
  type ReconciliationPass,
} from "../application/reconciliation/index.ts";
import { type CommandHandler } from "../application/engine/index.ts";
import { ok } from "../core/result/index.ts";
import { type AppGameEvent } from "./game-events.ts";

export interface ReconcilePayload {
  readonly reason: "TICK" | "FOCUS" | "MANUAL";
}

export function createReconcileHandler(
  catalog: GameCatalog,
  passes: readonly ReconciliationPass[],
): CommandHandler<GameState, ReconcilePayload, AppGameEvent> {
  return (state, command) => {
    const report = reconcileGameState(
      state,
      command.issuedAtMs,
      catalog,
      passes,
    );
    // ReconciliationEvent's one extra member beyond AppGameEvent's own
    // union (CLOCK_MOVED_BACKWARDS) is presentation-irrelevant here — no
    // screen renders it — so it is filtered rather than widening
    // AppGameEvent for a UI-facing event no one displays. Every remaining
    // member is a real member of AppGameEvent (reconcile-game-state.ts's
    // own union is `CLOCK_MOVED_BACKWARDS | CraftEvent | ExpeditionEvent |
    // InfrastructureEvent`, each already part of AppGameEvent), so the
    // cast after filtering is safe, not a type-system workaround.
    const events = report.events.filter(
      (event) => event.kind !== "CLOCK_MOVED_BACKWARDS",
    ) as readonly AppGameEvent[];
    return ok({ nextState: report.nextState, events });
  };
}
