/**
 * Design owner: Document 15 Task 04.10 (Decline / Customer Exit); 05
 * Customer & Selling System §56 Decline ("yield no Coins, yield no
 * Momentum, free customer capacity, create no severe penalty"), §57
 * Decline Penalty Boundary ("normal declines should not destroy
 * reputation").
 *
 * Unlike Standard Sale/Favorable Deal/Premium Pitch/Recommend, Decline
 * never touches inventory, Coins, or Momentum, so it does not go through
 * the quote engine or `applyRequestSaleEffect` — it is always available
 * for any active customer (there is no eligibility gate to fail), and its
 * only effect is freeing customer capacity via the shared
 * `resolveCustomer` helper. No reputation/soft-metric system exists yet
 * (§57 leaves that "not part of the core system"), so none is invented
 * here.
 */
import { type CustomerId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { resolveCustomer } from "./sale-helpers.ts";
import { type SaleEvent } from "./sale-events.ts";

export interface DeclinePayload {
  readonly customerId: CustomerId;
}

export const declineHandler: CommandHandler<
  GameState,
  DeclinePayload,
  SaleEvent
> = (state, command) => {
  const { customerId } = command.payload;
  const customer = state.customers.customers[customerId];
  if (!customer) {
    return err({
      code: "CUSTOMER_NOT_FOUND",
      message: `No active customer "${customerId}"`,
    });
  }

  const nextState: GameState = {
    ...state,
    customers: resolveCustomer(state.customers, customerId),
  };

  return ok({
    nextState,
    events: [
      {
        kind: "CUSTOMER_DECLINED",
        customerId,
        ...(customer.requestedProductId !== undefined &&
        customer.requestedQuality !== undefined
          ? {
              requestedProductId: customer.requestedProductId,
              requestedQuality: customer.requestedQuality,
            }
          : {}),
      },
    ],
  });
};
