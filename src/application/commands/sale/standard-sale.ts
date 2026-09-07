/**
 * Design owner: Document 15 Task 04.5 (Standard Sale); 05 Customer &
 * Selling System §42-43 Standard Sale, §22 Transaction Resolution, §24
 * LEAVE.
 *
 * Re-derives eligibility through Task 04.4's canonical quote
 * (`getCustomerTransactionOptions`) rather than re-implementing the same
 * checks (Document 05 §54's "no blind reroll" principle applies equally
 * to commands trusting their own stale copy of eligibility). The actual
 * effect (consume stock, credit Coins, adjust Momentum, resolve customer)
 * is shared with Favorable Deal/Premium Pitch via `applyRequestSaleEffect`.
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

export interface StandardSalePayload {
  readonly customerId: CustomerId;
}

export function createStandardSaleHandler(
  catalog: GameCatalog,
  displaySlotIds: readonly DisplaySlotId[],
  xpConfig?: SaleXpConfig,
): CommandHandler<GameState, StandardSalePayload, SaleEvent> {
  return (state, command) => {
    const { customerId } = command.payload;
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      displaySlotIds,
    );

    if (!options.standardSale.eligible) {
      return err({
        code: options.standardSale.disabledReason ?? "NOT_ELIGIBLE",
        message: `Standard Sale is not eligible for customer "${customerId}"`,
      });
    }

    const customer = state.customers.customers[customerId];
    invariant(
      customer !== undefined &&
        customer.requestedProductId !== undefined &&
        customer.requestedQuality !== undefined,
      "An eligible Standard Sale quote implies the customer and its request both exist",
    );
    const { requestedProductId: productId, requestedQuality: quality } =
      customer;

    const effect = applyRequestSaleEffect(
      state,
      command,
      customerId,
      productId,
      quality,
      options.standardSale,
      PROVISIONAL_MOMENTUM_CAP,
      xpConfig,
    );

    return ok({
      nextState: effect.nextState,
      events: [
        {
          kind: "STANDARD_SALE_RESOLVED",
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
