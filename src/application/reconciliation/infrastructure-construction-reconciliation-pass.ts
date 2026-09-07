/**
 * Design owner: Document 15 Task 07.4 (Construction Timestamp Support);
 * Document 08 §85-88 Construction Timing / Shop Remains Usable During
 * Construction.
 *
 * For every active construction whose `completesAtMs <= now`: moves it
 * from `activeConstructions` into `ownedInfrastructureIds`. Exactly-once
 * by construction (mirrors `craft-queue-reconciliation-pass.ts`'s shape):
 * once moved, it is no longer in `activeConstructions` for a later pass to
 * find again. Purely a timestamp comparison — no RNG, so "reload must
 * never reroll" is trivially satisfied (there is nothing to reroll).
 */
import { type GameState } from "../../domain/game-state/index.ts";
import { type ReconciliationEvent } from "./reconcile-game-state.ts";
import {
  type ReconciliationPass,
  type ReconciliationPassOutcome,
} from "./reconcile-game-state.ts";

export const infrastructureConstructionReconciliationPass: ReconciliationPass =
  (state, _elapsedMs, now): ReconciliationPassOutcome => {
    const completed = state.infrastructure.activeConstructions.filter(
      (activity) => activity.completesAtMs <= now,
    );
    if (completed.length === 0) {
      return { nextState: state, events: [] };
    }

    const stillActive = state.infrastructure.activeConstructions.filter(
      (activity) => activity.completesAtMs > now,
    );
    const nextOwnedInfrastructureIds = [
      ...state.infrastructure.ownedInfrastructureIds,
      ...completed.map((activity) => activity.infrastructureId),
    ];

    const nextState: GameState = {
      ...state,
      infrastructure: {
        ...state.infrastructure,
        ownedInfrastructureIds: nextOwnedInfrastructureIds,
        activeConstructions: stillActive,
      },
    };

    const events: ReconciliationEvent[] = completed.map((activity) => ({
      kind: "INFRASTRUCTURE_CONSTRUCTION_COMPLETED",
      infrastructureId: activity.infrastructureId,
    }));

    return { nextState, events };
  };
