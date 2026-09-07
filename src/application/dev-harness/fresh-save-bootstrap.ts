/**
 * Design owner: Phase 8 exit-gate fix — Document 15's exit gate requires
 * "a tester must be able to complete the entire slice loop... craft ->
 * display -> sell -> earn Coins + Shop Rank -> ... -> Expedition Hub
 * unlock -> purchase/build the Hub" starting from a genuinely fresh save.
 *
 * A dev-only, headless, DETERMINISTIC proof that `NEW GAME` (real
 * `createInitialGameState` + the real `applyStarterInventory` starter
 * package, exactly as `app/boot.ts` applies it) can reach and purchase
 * the Expedition Hub using only real Game Engine commands/reconciliation
 * and "normal shop decisions" — no steering of RNG, no direct state
 * injection beyond the one real starter package. Mirrors
 * `shop-loop-dev-harness.ts`'s mutable-clock/command pattern.
 *
 * Strategy modeled here (a "normal player" reading their own Shop
 * screen): keep the Provision Station busy crafting Recipe 01 ("Turnover"
 * — its own name and "everyday" demand tag mark it as the intended
 * starter loop) whenever material is available; whenever a customer's
 * own request can be satisfied, sell it via Standard Sale (the always-
 * available, no-Momentum-needed action); once Shop Rank 5 and enough
 * Coins are both reached, purchase the Expedition Hub and wait out its
 * construction timer. Recipe choice is NOT randomized — this proves the
 * *intended* path is reachable; `PROVISIONAL_STARTER_RESOURCE_A_QUANTITY`'s
 * own derivation (see `balance.ts`) separately covers the worst-case
 * *reasonable* recipe choice with a margin.
 */
import { CommandId } from "../../core/ids/index.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../../core/time/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import {
  getAvailableQuantity,
  productItemId,
} from "../../domain/inventory/index.ts";
import { isUnlockRuleSatisfied } from "../../domain/progression/index.ts";
import {
  applyStarterInventory,
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_STATION_IDS,
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  PROVISIONAL_RANK_PROGRESS_PER_CRAFT_COMPLETION,
  PROVISIONAL_RANK_PROGRESS_PER_RANK,
  PROVISIONAL_SHOP_RANK_CAP,
  SLICE_CUSTOMER_ARCHETYPES,
  SLICE_PRODUCT_01_ID,
  SLICE_RECIPE_01_ID,
  SLICE_RESOURCE_A_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { type ProductId, type RecipeId } from "../../core/ids/index.ts";
import { createCommand, type CommandHandler } from "../engine/index.ts";
import { createStartCraftHandler } from "../commands/craft/start-craft.ts";
import { createAssignDisplayProductHandler } from "../commands/display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../commands/customer/arrive-customer.ts";
import { createStandardSaleHandler } from "../commands/sale/standard-sale.ts";
import { createRecommendHandler } from "../commands/sale/recommend.ts";
import { declineHandler } from "../commands/sale/decline.ts";
import { createPurchaseInfrastructureHandler } from "../commands/shop-infrastructure/purchase-infrastructure.ts";
import { getCustomerTransactionOptions } from "../queries/customer/index.ts";
import {
  createCraftQueueReconciliationPass,
  infrastructureConstructionReconciliationPass,
  reconcileGameState,
} from "../reconciliation/index.ts";
import {
  type DevHarnessLogEntry,
  type DevHarnessResult,
} from "./crafting-dev-harness.ts";

function createMutableClock(startMs: number): {
  clock: Clock;
  set(ms: number): void;
} {
  let current: TimestampMs = toTimestampMs(startMs);
  return {
    clock: { nowMs: () => current },
    set(ms: number) {
      current = toTimestampMs(ms);
    },
  };
}

/** Hard bound on loop iterations — this is a determinism/termination proof, not an open-ended simulation; hitting this is a test failure, not a valid outcome. */
const MAX_ITERATIONS = 200;

export interface FreshSaveBootstrapOptions {
  readonly rootSeed?: number;
  /** Which Provision Station recipe/product to run exclusively — defaults to Recipe 01, the intended "Turnover" starter loop. Passing Recipe 02 proves the worst-case *reasonable* single-recipe choice (`balance.ts`'s derivation) also reaches the Hub within the seeded budget. */
  readonly recipeId?: RecipeId;
  readonly productId?: ProductId;
}

export function runFreshSaveBootstrapSimulation(
  options: FreshSaveBootstrapOptions = {},
): DevHarnessResult {
  const {
    rootSeed = 4242,
    recipeId = SLICE_RECIPE_01_ID,
    productId = SLICE_PRODUCT_01_ID,
  } = options;
  const log: DevHarnessLogEntry[] = [];
  const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
  const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
  const [DISPLAY_SLOT_ID] = PLAYABLE_DISPLAY_SLOT_IDS;
  if (!PROVISION_STATION_ID) throw new Error("expected a Provision Station");
  if (!DISPLAY_SLOT_ID) throw new Error("expected a display slot");

  const resourceA = catalog.resources.get(SLICE_RESOURCE_A_ID);
  if (!resourceA) throw new Error("expected SLICE_RESOURCE_A to exist");
  const productItemA = productItemId(productId, "STANDARD");

  const { clock, set: setClock } = createMutableClock(0);

  // The exact "new save" path `app/boot.ts` takes: the generic domain
  // factory, then the real starter package — not a harness-only shortcut.
  let state = applyStarterInventory(
    createInitialGameState(catalog, clock, toSeed(rootSeed)),
    catalog,
  );

  let cmdCounter = 0;
  const nextCommandId = (label: string) => {
    cmdCounter += 1;
    return CommandId.from(`fresh-save-${label}-${String(cmdCounter)}`);
  };

  const startCraft = createStartCraftHandler(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
  );
  const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
  const arriveCustomer = createArriveCustomerHandler(
    catalog,
    SLICE_CUSTOMER_ARCHETYPES,
    PLAYABLE_DISPLAY_SLOT_IDS,
    PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  );
  const standardSale = createStandardSaleHandler(
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
  );
  const recommend = createRecommendHandler(catalog, PLAYABLE_DISPLAY_SLOT_IDS);
  const purchaseInfrastructure = createPurchaseInfrastructureHandler(catalog);
  const craftQueuePass = createCraftQueueReconciliationPass(
    undefined,
    undefined,
    {
      progressPerCraftCompletion:
        PROVISIONAL_RANK_PROGRESS_PER_CRAFT_COMPLETION,
      progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
      rankCap: PROVISIONAL_SHOP_RANK_CAP,
    },
  );

  const reconcileTo = (nowMs: number) => {
    setClock(nowMs);
    const report = reconcileGameState(state, toTimestampMs(nowMs), catalog, [
      craftQueuePass,
      infrastructureConstructionReconciliationPass,
    ]);
    state = report.nextState;
  };

  const dispatch = <TPayload>(
    label: string,
    type: string,
    handler: CommandHandler<GameState, TPayload, unknown>,
    payload: TPayload,
  ) => {
    const result = handler(
      state,
      createCommand(nextCommandId(label), type, payload, clock),
    );
    if (!result.ok) {
      throw new Error(
        `expected ${type} to succeed: ${JSON.stringify(result.error)}`,
      );
    }
    state = result.value.nextState;
  };

  // `ASSIGN_DISPLAY_PRODUCT` requires stock to already exist (Document 14
  // §79 Display Stock Model) — a normal player crafts first, then puts the
  // first batch on display; this cannot happen before the first craft
  // completes, so it is done lazily inside the loop below, once.
  let displayAssigned = false;

  const hubOwned = () =>
    state.infrastructure.ownedInfrastructureIds.includes(
      EXPEDITION_HUB_INFRASTRUCTURE_ID,
    );

  let iterations = 0;
  while (!hubOwned()) {
    iterations += 1;
    if (iterations > MAX_ITERATIONS) {
      throw new Error(
        `fresh-save bootstrap did not reach the Expedition Hub within ${String(MAX_ITERATIONS)} iterations ` +
          `(rank=${String(state.progression.rank)}, coins=${String(state.economy.coins)}, ` +
          `resourceA=${String(getAvailableQuantity(state.inventory, resourceA.itemId))})`,
      );
    }

    const hub = catalog.infrastructure.get(EXPEDITION_HUB_INFRASTRUCTURE_ID);
    if (!hub) throw new Error("expected the Expedition Hub in the catalog");
    const construction = state.infrastructure.activeConstructions.find(
      (activity) =>
        activity.infrastructureId === EXPEDITION_HUB_INFRASTRUCTURE_ID,
    );

    if (construction) {
      reconcileTo(construction.completesAtMs + 1);
      log.push({
        step: "HUB_CONSTRUCTION_COMPLETE",
        detail: `rank=${String(state.progression.rank)}`,
      });
      continue;
    }

    if (
      isUnlockRuleSatisfied(hub.unlockRule, state) &&
      state.economy.coins >= hub.coinCost
    ) {
      dispatch(
        "purchase-hub",
        "PURCHASE_INFRASTRUCTURE",
        purchaseInfrastructure,
        { infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID },
      );
      log.push({
        step: "PURCHASE_EXPEDITION_HUB",
        detail: `rank=${String(state.progression.rank)}, coins=${String(state.economy.coins)}`,
      });
      continue;
    }

    // Keep the Provision Station busy on Recipe 01 whenever material allows.
    const station = state.crafting.stations[PROVISION_STATION_ID];
    if (!station?.activeCraft) {
      const available = getAvailableQuantity(state.inventory, resourceA.itemId);
      if (available < 1) {
        throw new Error(
          `ran out of the starter Resource A before reaching the Expedition Hub ` +
            `(rank=${String(state.progression.rank)}, coins=${String(state.economy.coins)})`,
        );
      }
      dispatch("start-craft", "START_CRAFT", startCraft, {
        stationId: PROVISION_STATION_ID,
        recipeId,
      });
      const activeCraft =
        state.crafting.stations[PROVISION_STATION_ID]!.activeCraft!;
      reconcileTo(activeCraft.completesAtMs + 1);
      log.push({
        step: "CRAFT_COMPLETE",
        detail: `stock=${String(getAvailableQuantity(state.inventory, productItemA))}, rank=${String(state.progression.rank)}`,
      });
    }

    // Sell down whatever stock exists via real customer arrivals.
    if (getAvailableQuantity(state.inventory, productItemA) < 1) {
      continue;
    }
    if (!displayAssigned) {
      dispatch(
        "assign-display",
        "ASSIGN_DISPLAY_PRODUCT",
        assignDisplayProduct,
        {
          displaySlotId: DISPLAY_SLOT_ID,
          productId,
        },
      );
      displayAssigned = true;
      log.push({ step: "ASSIGN_DISPLAY", detail: `slot=${DISPLAY_SLOT_ID}` });
    }
    // Serve as many customers as the current stock/capacity allow this
    // cycle — a real player with 2 freshly-crafted units on the shelf
    // does not artificially wait for a customer to arrive, sell, and
    // leave before letting the next one in; up to
    // `PROVISIONAL_MAX_ACTIVE_CUSTOMERS` may browse at once.
    while (
      getAvailableQuantity(state.inventory, productItemA) >= 1 &&
      state.customers.activeCustomerIds.length <
        PROVISIONAL_MAX_ACTIVE_CUSTOMERS
    ) {
      dispatch("arrive", "ARRIVE_CUSTOMER", arriveCustomer, {});
      const ids = state.customers.activeCustomerIds;
      const customerId = ids[ids.length - 1]!;
      const options = getCustomerTransactionOptions(
        state,
        customerId,
        catalog,
        PLAYABLE_DISPLAY_SLOT_IDS,
      );
      if (options.standardSale.eligible) {
        dispatch("standard-sale", "STANDARD_SALE", standardSale, {
          customerId,
        });
      } else {
        const candidate = options.recommendCandidates.find(
          (c) => c.outcome.eligible,
        );
        if (candidate) {
          dispatch("recommend", "RECOMMEND", recommend, {
            customerId,
            productId: candidate.productId,
            quality: candidate.quality,
          });
        } else {
          dispatch("decline", "DECLINE", declineHandler, { customerId });
          break; // avoid spinning forever if a customer can never be resolved
        }
      }
    }
    log.push({
      step: "SALES_CYCLE",
      detail: `coins=${String(state.economy.coins)}, rank=${String(state.progression.rank)}, rankProgress=${String(state.progression.rankProgress)}`,
    });
  }

  log.push({
    step: "FRESH_SAVE_BOOTSTRAP_COMPLETE",
    detail: `iterations=${String(iterations)}, rank=${String(state.progression.rank)}, coins=${String(state.economy.coins)}, resourceA remaining=${String(getAvailableQuantity(state.inventory, resourceA.itemId))}`,
  });

  return { log, finalState: state, catalog };
}
