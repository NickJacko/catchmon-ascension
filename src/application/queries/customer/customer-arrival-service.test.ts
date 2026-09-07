// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toDurationMs } from "../../../core/math/duration.ts";
import { toSeed } from "../../../core/random/index.ts";
import { toTimestampMs } from "../../../core/time/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS,
  SLICE_CUSTOMER_ARCHETYPES,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createArriveCustomerHandler } from "../../commands/customer/arrive-customer.ts";
import { isCustomerArrivalEligible } from "./customer-arrival-service.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const minInterval = toDurationMs(PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS);
const arriveCustomer = createArriveCustomerHandler(
  catalog,
  SLICE_CUSTOMER_ARCHETYPES,
  [],
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
);

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

describe("isCustomerArrivalEligible", () => {
  it("is eligible immediately when no customer has ever arrived", () => {
    expect(
      isCustomerArrivalEligible(baseState(), toTimestampMs(0), minInterval),
    ).toBe(true);
  });

  it("is not eligible before the minimum interval has elapsed since the last arrival", () => {
    const arrived = arriveCustomer(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(1000),
      ),
    );
    if (!arrived.ok) throw new Error("expected arrival to succeed");

    const tooSoon = toTimestampMs(
      1000 + PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS - 1,
    );
    expect(
      isCustomerArrivalEligible(arrived.value.nextState, tooSoon, minInterval),
    ).toBe(false);
  });

  it("is eligible again once the minimum interval has elapsed", () => {
    const arrived = arriveCustomer(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(1000),
      ),
    );
    if (!arrived.ok) throw new Error("expected arrival to succeed");

    const later = toTimestampMs(1000 + PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS);
    expect(
      isCustomerArrivalEligible(arrived.value.nextState, later, minInterval),
    ).toBe(true);
  });

  it("does not produce duplicate/immediate arrivals right after a reload (persisted lastArrivalAtMs is respected)", () => {
    // Simulate: a customer arrived, the game was saved and reloaded, and
    // the very next active-session tick happens almost immediately after
    // reload. Reload must not reset the arrival clock.
    const arrived = arriveCustomer(
      baseState(),
      createCommand(
        CommandId.from("cmd-1"),
        "ARRIVE_CUSTOMER",
        {},
        new FakeClock(5000),
      ),
    );
    if (!arrived.ok) throw new Error("expected arrival to succeed");
    const reloadedState = arrived.value.nextState; // stands in for a save/reload round-trip

    const rightAfterReload = toTimestampMs(5001);
    expect(
      isCustomerArrivalEligible(reloadedState, rightAfterReload, minInterval),
    ).toBe(false);
  });

  it("a single huge time jump only ever admits one arrival at that instant (the interval gate, not just capacity, prevents bursts)", () => {
    const state = baseState();
    const farFuture = toTimestampMs(10_000_000);

    // Simulate an active-session loop hammering the same instant after a
    // long absence — even with capacity to spare, only the first attempt
    // at a given `now` may succeed; every later one at the *same* instant
    // is blocked by the minimum-interval gate, not merely by capacity.
    let spawned = 0;
    let current = state;
    for (let i = 0; i < 10; i += 1) {
      if (!isCustomerArrivalEligible(current, farFuture, minInterval)) {
        continue;
      }
      const result = arriveCustomer(
        current,
        createCommand(
          CommandId.from(`cmd-${String(i)}`),
          "ARRIVE_CUSTOMER",
          {},
          {
            nowMs: () => farFuture,
          },
        ),
      );
      if (result.ok) {
        current = result.value.nextState;
        spawned += 1;
      }
    }

    expect(spawned).toBe(1);
  });

  it("reaching active capacity requires that many separately-spaced eligible ticks, never one burst", () => {
    let state = baseState();
    let now = 0;
    let spawned = 0;

    for (let tick = 0; tick < PROVISIONAL_MAX_ACTIVE_CUSTOMERS + 5; tick += 1) {
      const timestamp = toTimestampMs(now);
      if (isCustomerArrivalEligible(state, timestamp, minInterval)) {
        const result = arriveCustomer(
          state,
          createCommand(
            CommandId.from(`cmd-${String(tick)}`),
            "ARRIVE_CUSTOMER",
            {},
            {
              nowMs: () => timestamp,
            },
          ),
        );
        if (result.ok) {
          state = result.value.nextState;
          spawned += 1;
        }
      }
      now += PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS;
    }

    expect(spawned).toBe(PROVISIONAL_MAX_ACTIVE_CUSTOMERS);
    expect(state.customers.activeCustomerIds).toHaveLength(
      PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
    );
  });
});
