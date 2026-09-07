/**
 * Design owner: Document 15 Task 07.3 (Infrastructure Purchase Engine),
 * Task 07.4 (Construction Timestamp Support); Document 08 §85-90
 * Construction Timing, §93-95 Infrastructure Cost Shape; Document 09 §66
 * Shop Rank Gate, §187 Unlock Condition Model.
 *
 * Atomic: validates the infrastructure exists, is not already owned or
 * under construction, its `unlockRule` is satisfied (Document 09 §75
 * "Shop Rank should not fully auto-unlock" — the player must still
 * purchase it), and Coins are sufficient — then either grants it
 * immediately (`constructionDurationMs` absent, Task 07.4's "instant
 * provisional slice upgrade" branch) or starts a real, timestamped
 * `ConstructionActivity` (Document 08 §88 "shop remains usable during
 * construction" — nothing else in the shop is disabled by a pending
 * construction; only the new capacity itself waits).
 *
 * This module lives at `commands/shop-infrastructure/`, not `commands/
 * infrastructure/`: the same ESLint import-boundary glob collision
 * `domain/shop-infrastructure/types.ts` already documents
 * (`"**\/infrastructure/**"` matches any path containing that literal
 * segment, not just the top-level `src/infrastructure/` layer) blocked
 * `application/reconciliation` from importing a `commands/infrastructure/`
 * module — this name avoids the collision the same way.
 */
import { type InfrastructureId } from "../../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../../core/time/time-math.ts";
import { toDurationMs } from "../../../core/math/duration.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { debitCoins } from "../../../domain/economy/index.ts";
import { isUnlockRuleSatisfied } from "../../../domain/progression/index.ts";
import {
  type ConstructionActivity,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type InfrastructureEvent } from "./infrastructure-events.ts";

export interface PurchaseInfrastructurePayload {
  readonly infrastructureId: InfrastructureId;
}

export function createPurchaseInfrastructureHandler(
  catalog: GameCatalog,
): CommandHandler<
  GameState,
  PurchaseInfrastructurePayload,
  InfrastructureEvent
> {
  return (state, command) => {
    const { infrastructureId } = command.payload;

    const definition = catalog.infrastructure.get(infrastructureId);
    if (!definition) {
      return err({
        code: "INFRASTRUCTURE_NOT_FOUND",
        message: `No infrastructure "${infrastructureId}" in the catalog`,
      });
    }
    if (
      state.infrastructure.ownedInfrastructureIds.includes(infrastructureId)
    ) {
      return err({
        code: "ALREADY_OWNED",
        message: `Infrastructure "${infrastructureId}" is already owned`,
      });
    }
    if (
      state.infrastructure.activeConstructions.some(
        (activity) => activity.infrastructureId === infrastructureId,
      )
    ) {
      return err({
        code: "ALREADY_UNDER_CONSTRUCTION",
        message: `Infrastructure "${infrastructureId}" is already under construction`,
      });
    }
    if (!isUnlockRuleSatisfied(definition.unlockRule, state)) {
      return err({
        code: "UNLOCK_RULE_NOT_SATISFIED",
        message: `Infrastructure "${infrastructureId}" is not yet unlock-eligible`,
      });
    }

    const debited = debitCoins(state.economy, definition.coinCost);
    if (!debited.ok) {
      return err({
        code: debited.error.code,
        message: JSON.stringify(debited.error),
      });
    }

    if (definition.constructionDurationMs === undefined) {
      const nextState: GameState = {
        ...state,
        economy: debited.value,
        infrastructure: {
          ...state.infrastructure,
          ownedInfrastructureIds: [
            ...state.infrastructure.ownedInfrastructureIds,
            infrastructureId,
          ],
        },
      };
      return ok({
        nextState,
        events: [{ kind: "INFRASTRUCTURE_PURCHASED", infrastructureId }],
      });
    }

    const startedAtMs = command.issuedAtMs;
    const completesAtMs = addDurationToTimestamp(
      startedAtMs,
      toDurationMs(definition.constructionDurationMs),
    );
    const activity: ConstructionActivity = {
      infrastructureId,
      startedAtMs,
      completesAtMs,
    };
    const nextState: GameState = {
      ...state,
      economy: debited.value,
      infrastructure: {
        ...state.infrastructure,
        activeConstructions: [
          ...state.infrastructure.activeConstructions,
          activity,
        ],
      },
    };
    return ok({
      nextState,
      events: [
        {
          kind: "INFRASTRUCTURE_CONSTRUCTION_STARTED",
          infrastructureId,
          startedAtMs,
          completesAtMs,
        },
      ],
    });
  };
}
