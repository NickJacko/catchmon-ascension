/**
 * Design owner: Document 15 Task 04.2 (Customer Archetype + Instance
 * State); 05 Customer & Selling System §13-19 (Archetype Data Model,
 * Instance Model, State Machine, Form Interest, Request), §25-26 (Demand
 * Generation, Display As Primary Request Pool); 14 Technical Architecture
 * §85, §88 (Customer Architecture, Arrival Randomness — "reload does not
 * reroll").
 *
 * Generates one customer instance deterministically: picks an archetype,
 * then a request from currently *displayed* products matching that
 * archetype's preferred (falling back to secondary) family — using one
 * sub-seed derived from `state.meta.rootRandomSeed`/`randomEventCounter`,
 * the same pattern `START_CRAFT` uses for its quality-roll seed. If no
 * displayed product matches, the customer still arrives with no request
 * (Document 05 §38-39: an occasional unmet-demand signal is fine; it must
 * not dominate, which the family-match-first rule keeps true for Walk-Ins
 * since they preferentially match whatever is actually stocked).
 *
 * Scheduling *when* a customer arrives (timestamps, active-session bias,
 * no offline backlog) is Task 04.3's job — this command only answers
 * "generate one arrival now."
 */
import {
  CustomerId,
  type DisplaySlotId,
  type ProductId,
} from "../../../core/ids/index.ts";
import {
  deriveSubSeed,
  nextRandomEventCounter,
} from "../../../core/random/index.ts";
import {
  createRandomSource,
  nextIntExclusive,
} from "../../../core/random/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type CustomerArchetypeDefinition } from "../../../domain/customers/index.ts";
import { type QualityGrade } from "../../../domain/crafting/index.ts";
import {
  type CustomerRuntimeState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import {
  getDisplayedProducts,
  type DisplayedProductView,
} from "../../queries/display/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type CustomerEvent } from "./customer-events.ts";

export type ArriveCustomerPayload = Record<string, never>;

function pickRequest(
  archetype: CustomerArchetypeDefinition,
  displayed: readonly DisplayedProductView[],
  catalog: GameCatalog,
  rollIndex: (maxExclusive: number) => number,
): { readonly productId: ProductId; readonly quality: QualityGrade } | null {
  const matchesFamilies = (families: readonly string[]) =>
    displayed.filter((view) => {
      const product = catalog.products.get(view.productId);
      return product !== undefined && families.includes(product.family);
    });

  const preferred = matchesFamilies(archetype.preferredFamilies);
  const pool =
    preferred.length > 0
      ? preferred
      : matchesFamilies(archetype.secondaryFamilies);
  if (pool.length === 0) {
    return null;
  }
  const pick = pool[rollIndex(pool.length)]!;
  return { productId: pick.productId, quality: pick.quality };
}

export function createArriveCustomerHandler(
  catalog: GameCatalog,
  archetypes: readonly CustomerArchetypeDefinition[],
  displaySlotIds: readonly DisplaySlotId[],
  maxActiveCustomers: number,
): CommandHandler<GameState, ArriveCustomerPayload, CustomerEvent> {
  return (state, command) => {
    if (archetypes.length === 0) {
      return err({
        code: "NO_ARCHETYPES_CONFIGURED",
        message: "No customer archetypes are configured",
      });
    }
    if (state.customers.activeCustomerIds.length >= maxActiveCustomers) {
      return err({
        code: "CUSTOMER_CAPACITY_FULL",
        message: `Active customer capacity (${String(maxActiveCustomers)}) reached`,
      });
    }

    const seed = deriveSubSeed(
      state.meta.rootRandomSeed,
      state.meta.randomEventCounter,
      `ARRIVE_CUSTOMER:${command.commandId}`,
    );
    const rng = createRandomSource(seed);
    const archetype = archetypes[nextIntExclusive(rng, archetypes.length)]!;

    const displayed = getDisplayedProducts(state, displaySlotIds);
    const request = pickRequest(archetype, displayed, catalog, (max) =>
      nextIntExclusive(rng, max),
    );

    const customerId = CustomerId.from(`customer-${command.commandId}`);
    const customer: CustomerRuntimeState = {
      customerId,
      archetypeId: archetype.customerArchetypeId,
      arrivedAtMs: command.issuedAtMs,
      status: "AWAITING_DECISION",
      generationSeed: seed,
      ...(request
        ? {
            requestedProductId: request.productId,
            requestedQuality: request.quality,
          }
        : {}),
    };

    const nextState: GameState = {
      ...state,
      meta: {
        ...state.meta,
        randomEventCounter: nextRandomEventCounter(
          state.meta.randomEventCounter,
        ),
      },
      customers: {
        activeCustomerIds: [...state.customers.activeCustomerIds, customerId],
        customers: { ...state.customers.customers, [customerId]: customer },
        lastArrivalAtMs: command.issuedAtMs,
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "CUSTOMER_ARRIVED",
          customerId,
          archetypeId: archetype.customerArchetypeId,
          ...(request
            ? {
                requestedProductId: request.productId,
                requestedQuality: request.quality,
              }
            : {}),
        },
      ],
    });
  };
}
