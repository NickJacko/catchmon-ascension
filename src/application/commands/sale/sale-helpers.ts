/**
 * Design owner: Document 05 §22 Transaction Resolution, §24 LEAVE ("after
 * resolution, the customer leaves and frees active capacity"). Shared by
 * every transaction command that sells the customer's own requested stock
 * (Standard Sale, Favorable Deal, Premium Pitch — Tasks 04.5/04.7/04.8) so
 * "resolve a request-based transaction" is defined exactly once rather
 * than re-implemented per command.
 */
import {
  ReservationId,
  type CustomerId,
  type ProductId,
} from "../../../core/ids/index.ts";
import { type Coins, toCoins } from "../../../core/math/index.ts";
import { invariant } from "../../../core/assertions/invariant.ts";
import { type Command } from "../../engine/index.ts";
import { creditCoins } from "../../../domain/economy/index.ts";
import { gainMomentum, spendMomentum } from "../../../domain/shop/index.ts";
import {
  consumeReservation,
  productItemId,
  reserveInventory,
} from "../../../domain/inventory/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";
import { applyXp } from "../../../domain/catchmons/index.ts";
import { applyRankProgress } from "../../../domain/progression/index.ts";
import {
  type CustomersState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  PROVISIONAL_RANK_PROGRESS_PER_RANK,
  PROVISIONAL_RANK_PROGRESS_PER_SALE,
  PROVISIONAL_SHOP_RANK_CAP,
} from "../../../content/vertical-slice/index.ts";
import { type TransactionOutcome } from "../../queries/customer/index.ts";

/** Document 15 Task 05.8: Shop Floor XP is awarded to whichever Catchmon is on Shop Floor duty when a sale/deal/pitch/recommend resolves (Document 06 §57 "completed customer interactions"). Defaults to a no-op for callers that don't configure XP. */
export interface SaleXpConfig {
  readonly xpPerSaleResolution: number;
  readonly xpPerLevel: number;
  readonly levelCap: number;
}

const NO_XP: SaleXpConfig = {
  xpPerSaleResolution: 0,
  xpPerLevel: 1,
  levelCap: 1,
};

/**
 * Removes the customer outright rather than transitioning through a
 * transient "LEAVING" status: this is a headless engine with no
 * presentation layer yet to animate a leave sequence, and "frees active
 * capacity" is the concrete, testable effect Document 05 actually
 * requires. A later presentation-layer task may reintroduce a transient
 * visual "LEAVING" state without needing to change this.
 */
export function resolveCustomer(
  customers: CustomersState,
  customerId: CustomerId,
): CustomersState {
  const remainingCustomers = { ...customers.customers };
  delete remainingCustomers[customerId];
  return {
    ...customers,
    activeCustomerIds: customers.activeCustomerIds.filter(
      (id) => id !== customerId,
    ),
    customers: remainingCustomers,
  };
}

export interface ResolvedSaleEffect {
  readonly nextState: GameState;
  readonly coinsEarned: Coins;
  readonly momentumDelta: number;
}

/**
 * Applies the common effect of any request-based sale transaction: reserve-
 * then-immediately-consume the sold stock (Task 03.2's ledger — both calls
 * happen inside this one function, so no other command observes the
 * intermediate reserved-but-not-yet-consumed state), credit/adjust Coins
 * and Momentum via the canonical domain ledgers (Tasks 03.1/04.6), award
 * the Task 04.5 rank-progress hook, and resolve the customer. Callers
 * must have already confirmed `outcome.eligible` via
 * `getCustomerTransactionOptions` — this function trusts that.
 */
export function applyRequestSaleEffect(
  state: GameState,
  command: Command<string, unknown>,
  customerId: CustomerId,
  productId: ProductId,
  quality: QualityGrade,
  outcome: TransactionOutcome,
  momentumCap: number,
  xpConfig: SaleXpConfig = NO_XP,
): ResolvedSaleEffect {
  const itemId = productItemId(productId, quality);
  const reservationId = ReservationId.from(`sale-${command.commandId}`);
  const reserved = reserveInventory(
    state.inventory,
    reservationId,
    "MANUAL",
    customerId,
    [{ itemId, quantity: 1 }],
    command.issuedAtMs,
  );
  invariant(
    reserved.ok,
    "Reservation must succeed immediately after the quote confirmed availability",
  );
  const consumed = consumeReservation(reserved.value, reservationId);
  invariant(
    consumed.ok,
    "Consuming a reservation just created must always succeed",
  );

  let nextShop = state.shop;
  if (outcome.momentumDelta >= 0) {
    nextShop = gainMomentum(nextShop, outcome.momentumDelta, momentumCap);
  } else {
    const spent = spendMomentum(nextShop, -outcome.momentumDelta);
    invariant(
      spent.ok,
      "Spending Momentum must always succeed immediately after the quote confirmed sufficiency",
    );
    nextShop = spent.value;
  }

  let ownedCatchmons = state.catchmons.ownedCatchmons;
  for (const supportId of state.shop.shopFloorSupportCatchmonIds) {
    const supportOwned = ownedCatchmons[supportId];
    if (supportOwned) {
      ownedCatchmons = {
        ...ownedCatchmons,
        [supportId]: applyXp(
          supportOwned,
          xpConfig.xpPerSaleResolution,
          xpConfig.xpPerLevel,
          xpConfig.levelCap,
        ),
      };
    }
  }

  const nextState: GameState = {
    ...state,
    economy: creditCoins(state.economy, outcome.finalCoins),
    inventory: consumed.value,
    shop: nextShop,
    catchmons: { ...state.catchmons, ownedCatchmons },
    progression: applyRankProgress(
      state.progression,
      PROVISIONAL_RANK_PROGRESS_PER_SALE,
      PROVISIONAL_RANK_PROGRESS_PER_RANK,
      PROVISIONAL_SHOP_RANK_CAP,
    ),
    customers: resolveCustomer(state.customers, customerId),
  };

  return {
    nextState,
    coinsEarned: toCoins(outcome.finalCoins),
    momentumDelta: outcome.momentumDelta,
  };
}
