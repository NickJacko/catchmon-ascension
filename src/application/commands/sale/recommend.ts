/**
 * Design owner: Document 15 Task 04.9 (Recommend); 05 Customer & Selling
 * System §51 Recommend, §52 Recommend Compatibility, §53 Recommend Cost,
 * §54 Recommend Preview ("do not make recommendation a blind reroll"), §55
 * Recommend Does Not Create Inventory.
 *
 * The player picks one of the quote engine's already-computed
 * `recommendCandidates` (Task 04.4) — this command does not accept an
 * arbitrary product, it only re-validates that the requested
 * (productId, quality) pair is still a live candidate at execution time
 * (§54's "final quote before command", satisfied by re-deriving the quote
 * here rather than trusting whatever the caller last saw) and then sells
 * that displayed product through the same shared
 * `applyRequestSaleEffect` used by Standard Sale/Favorable Deal/Premium
 * Pitch (Task 04.7) — Recommend only ever draws from displayed stock
 * (§55), never from the customer's original request.
 */
import { type CustomerId, type ProductId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type DisplaySlotId } from "../../../core/ids/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type MagnitudeTable } from "../../../domain/catchmons/index.ts";
import { PROVISIONAL_MOMENTUM_CAP } from "../../../content/vertical-slice/index.ts";
import { getCustomerTransactionOptions } from "../../queries/customer/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { applyRequestSaleEffect, type SaleXpConfig } from "./sale-helpers.ts";
import { type SaleEvent } from "./sale-events.ts";

export interface RecommendPayload {
  readonly customerId: CustomerId;
  readonly productId: ProductId;
  readonly quality: QualityGrade;
}

export function createRecommendHandler(
  catalog: GameCatalog,
  displaySlotIds: readonly DisplaySlotId[],
  catchmonCapabilityMagnitudes: MagnitudeTable = {},
  xpConfig?: SaleXpConfig,
): CommandHandler<GameState, RecommendPayload, SaleEvent> {
  return (state, command) => {
    const { customerId, productId, quality } = command.payload;
    const options = getCustomerTransactionOptions(
      state,
      customerId,
      catalog,
      displaySlotIds,
      catchmonCapabilityMagnitudes,
    );

    const candidate = options.recommendCandidates.find(
      (c) => c.productId === productId && c.quality === quality,
    );
    if (!candidate) {
      return err({
        code: "NOT_A_RECOMMEND_CANDIDATE",
        message: `Product "${productId}" (${quality}) is not a compatible displayed alternative for customer "${customerId}"`,
      });
    }
    if (!candidate.outcome.eligible) {
      return err({
        code: candidate.outcome.disabledReason ?? "NOT_ELIGIBLE",
        message: `Recommend is not eligible for customer "${customerId}"`,
      });
    }

    const effect = applyRequestSaleEffect(
      state,
      command,
      customerId,
      productId,
      quality,
      candidate.outcome,
      PROVISIONAL_MOMENTUM_CAP,
      xpConfig,
    );

    return ok({
      nextState: effect.nextState,
      events: [
        {
          kind: "RECOMMEND_RESOLVED",
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
