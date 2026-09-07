/**
 * Design owner: Document 15 Task 04.7 (Favorable Deal); 05 Customer &
 * Selling System §44-46 Favorable Deal.
 *
 * Structurally identical to Standard Sale (Task 04.5) — the only
 * difference is which quote outcome is used (`favorableDeal`, computed by
 * Task 04.4's quote engine with Task 04.7's value-aware Momentum scaling,
 * `favorableDealMomentumGain` in transaction-quote-engine.ts).
 */
import { type CustomerId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { invariant } from "../../../core/assertions/invariant.ts";
import { type DisplaySlotId } from "../../../core/ids/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { PROVISIONAL_MOMENTUM_CAP } from "../../../content/vertical-slice/index.ts";
import { getCustomerTransactionOptions } from "../../queries/customer/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { applyRequestSaleEffect, type SaleXpConfig } from "./sale-helpers.ts";
import { type SaleEvent } from "./sale-events.ts";

export interface FavorableDealPayload {
  readonly customerId: CustomerId;
}

export function createFavorableDealHandler(
  catalog: GameCatalog,
  displaySlotIds: readonly DisplaySlotId[],
  xpConfig?: SaleXpConfig,
): CommandHandler<GameState, FavorableDealPayload, SaleEvent> {
  return (state, command) => {
    const { customerId } = command.payload;
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      displaySlotIds,
    );

    if (!options.favorableDeal.eligible) {
      return err({
        code: options.favorableDeal.disabledReason ?? "NOT_ELIGIBLE",
        message: `Favorable Deal is not eligible for customer "${customerId}"`,
      });
    }

    const customer = state.customers.customers[customerId];
    invariant(
      customer !== undefined &&
        customer.requestedProductId !== undefined &&
        customer.requestedQuality !== undefined,
      "An eligible Favorable Deal quote implies the customer and its request both exist",
    );
    const { requestedProductId: productId, requestedQuality: quality } =
      customer;

    const effect = applyRequestSaleEffect(
      state,
      command,
      customerId,
      productId,
      quality,
      options.favorableDeal,
      PROVISIONAL_MOMENTUM_CAP,
      xpConfig,
    );

    return ok({
      nextState: effect.nextState,
      events: [
        {
          kind: "FAVORABLE_DEAL_RESOLVED",
          customerId,
          productId,
          quality,
          coinsEarned: effect.coinsEarned,
          momentumDelta: effect.momentumDelta,
        },
      ],
    });
  };
}
