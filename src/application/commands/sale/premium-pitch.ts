/**
 * Design owner: Document 15 Task 04.8 (Premium Pitch); 05 Customer &
 * Selling System §47-50 Premium Pitch ("normal Premium Pitch should be
 * deterministic or clearly guaranteed when available... avoid: spend
 * Momentum -> random negotiation failure").
 *
 * Structurally identical to Standard Sale/Favorable Deal — the quote
 * engine (Task 04.4) already computes a deterministic improved Coin value
 * and a flat Momentum cost, with eligibility (including
 * `INSUFFICIENT_MOMENTUM`) checked up front. There is no hidden
 * failure-chance roll anywhere in this file, matching §49 exactly.
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

export interface PremiumPitchPayload {
  readonly customerId: CustomerId;
}

export function createPremiumPitchHandler(
  catalog: GameCatalog,
  displaySlotIds: readonly DisplaySlotId[],
  xpConfig?: SaleXpConfig,
): CommandHandler<GameState, PremiumPitchPayload, SaleEvent> {
  return (state, command) => {
    const { customerId } = command.payload;
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      displaySlotIds,
    );

    if (!options.premiumPitch.eligible) {
      return err({
        code: options.premiumPitch.disabledReason ?? "NOT_ELIGIBLE",
        message: `Premium Pitch is not eligible for customer "${customerId}"`,
      });
    }

    const customer = state.customers.customers[customerId];
    invariant(
      customer !== undefined &&
        customer.requestedProductId !== undefined &&
        customer.requestedQuality !== undefined,
      "An eligible Premium Pitch quote implies the customer and its request both exist",
    );
    const { requestedProductId: productId, requestedQuality: quality } =
      customer;

    const effect = applyRequestSaleEffect(
      state,
      command,
      customerId,
      productId,
      quality,
      options.premiumPitch,
      PROVISIONAL_MOMENTUM_CAP,
      xpConfig,
    );

    return ok({
      nextState: effect.nextState,
      events: [
        {
          kind: "PREMIUM_PITCH_RESOLVED",
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
