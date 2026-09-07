// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId, CustomerId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import { createInitialGameState } from "../../../domain/game-state/index.ts";
import {
  PLAYABLE_DISPLAY_SLOT_IDS,
  SLICE_CUSTOMER_ARCHETYPES,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createCommand } from "../../engine/index.ts";
import { createArriveCustomerHandler } from "../customer/arrive-customer.ts";
import { declineHandler } from "./decline.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const arriveCustomer = createArriveCustomerHandler(
  catalog,
  SLICE_CUSTOMER_ARCHETYPES,
  PLAYABLE_DISPLAY_SLOT_IDS,
  10,
);

describe("DECLINE", () => {
  it("frees customer capacity with no Coins and no Momentum change, regardless of penalty", () => {
    const initial = createInitialGameState(
      catalog,
      new FakeClock(0),
      toSeed(1),
    );
    const arrived = arriveCustomer(
      initial,
      createCommand(
        CommandId.from("setup-arrive"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(0),
      ),
    );
    if (!arrived.ok) throw new Error("expected arrival to succeed");
    const state = arrived.value.nextState;
    const customerId = state.customers.activeCustomerIds[0]!;

    const result = declineHandler(
      state,
      createCommand(
        CommandId.from("cmd-decline"),
        "DECLINE",
        { customerId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.nextState.economy.coins).toBe(state.economy.coins);
    expect(result.value.nextState.shop.momentum).toBe(state.shop.momentum);
    expect(
      result.value.nextState.customers.customers[customerId],
    ).toBeUndefined();
    expect(result.value.nextState.customers.activeCustomerIds).not.toContain(
      customerId,
    );
    expect(result.value.nextState.inventory).toBe(state.inventory);
    expect(result.value.events).toEqual([
      expect.objectContaining({ kind: "CUSTOMER_DECLINED", customerId }),
    ]);
  });

  it("fails with a typed error for an unknown customer", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const result = declineHandler(
      state,
      createCommand(
        CommandId.from("cmd-decline"),
        "DECLINE",
        { customerId: CustomerId.from("does-not-exist") },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("CUSTOMER_NOT_FOUND");
  });
});
