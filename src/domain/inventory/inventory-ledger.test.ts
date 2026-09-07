// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ItemId, ReservationId } from "../../core/ids/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { type InventoryState } from "../game-state/index.ts";
import {
  addToInventory,
  consumeReservation,
  getAvailableQuantity,
  getReservedQuantity,
  getTotalQuantity,
  releaseReservation,
  reserveInventory,
} from "./inventory-ledger.ts";

const EMPTY_STATE: InventoryState = { stacks: {}, reservations: {} };
const ITEM_A = ItemId.from("test-item-a");
const ITEM_B = ItemId.from("test-item-b");
const NOW = toTimestampMs(1000);

describe("addToInventory", () => {
  it("creates a new stack when none exists", () => {
    const state = addToInventory(EMPTY_STATE, ITEM_A, 5);
    expect(getTotalQuantity(state, ITEM_A)).toBe(5);
  });

  it("accumulates onto an existing stack", () => {
    const state = addToInventory(
      addToInventory(EMPTY_STATE, ITEM_A, 5),
      ITEM_A,
      3,
    );
    expect(getTotalQuantity(state, ITEM_A)).toBe(8);
  });
});

describe("getAvailableQuantity", () => {
  it("equals total when nothing is reserved", () => {
    const state = addToInventory(EMPTY_STATE, ITEM_A, 10);
    expect(getAvailableQuantity(state, ITEM_A)).toBe(10);
  });

  it("subtracts reserved quantity from total (Document 14 §77)", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 10);
    const reserved = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "MANUAL",
      "owner-1",
      [{ itemId: ITEM_A, quantity: 4 }],
      NOW,
    );
    expect(reserved.ok).toBe(true);
    if (reserved.ok) {
      expect(getAvailableQuantity(reserved.value, ITEM_A)).toBe(6);
      expect(getReservedQuantity(reserved.value, ITEM_A)).toBe(4);
    }
  });
});

describe("reserveInventory", () => {
  it("reserves successfully when enough is available", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 5);
    const result = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "CRAFT_QUEUE",
      "station-1",
      [{ itemId: ITEM_A, quantity: 5 }],
      NOW,
    );
    expect(result.ok).toBe(true);
  });

  it("blocks a double reservation that would exceed availability", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 5);
    const first = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "CRAFT_QUEUE",
      "station-1",
      [{ itemId: ITEM_A, quantity: 5 }],
      NOW,
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = reserveInventory(
      first.value,
      ReservationId.from("r2"),
      "ORDER",
      "order-1",
      [{ itemId: ITEM_A, quantity: 1 }],
      NOW,
    );
    expect(second.ok).toBe(false);
    if (!second.ok) {
      expect(second.error).toEqual({
        code: "INSUFFICIENT_AVAILABLE",
        shortfalls: [{ itemId: ITEM_A, requested: 1, available: 0 }],
      });
    }
  });

  it("is atomic across multiple items: one shortfall blocks the whole reservation", () => {
    const stocked = addToInventory(
      addToInventory(EMPTY_STATE, ITEM_A, 5),
      ITEM_B,
      1,
    );
    const result = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "MANUAL",
      "owner-1",
      [
        { itemId: ITEM_A, quantity: 3 },
        { itemId: ITEM_B, quantity: 5 },
      ],
      NOW,
    );
    expect(result.ok).toBe(false);
    // Neither line should have been reserved — item A remains fully available.
    if (!result.ok) {
      expect(getAvailableQuantity(stocked, ITEM_A)).toBe(5);
    }
  });

  it("rejects a duplicate reservationId", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 10);
    const first = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "MANUAL",
      "owner-1",
      [{ itemId: ITEM_A, quantity: 1 }],
      NOW,
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const second = reserveInventory(
      first.value,
      ReservationId.from("r1"),
      "ORDER",
      "owner-2",
      [{ itemId: ITEM_A, quantity: 1 }],
      NOW,
    );
    expect(second).toEqual({
      ok: false,
      error: { code: "DUPLICATE_RESERVATION_ID", reservationId: "r1" },
    });
  });

  it("isolates reservations by owner: releasing one owner's reservation does not affect another's", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 10);
    const ownerA = reserveInventory(
      stocked,
      ReservationId.from("r-owner-a"),
      "CRAFT_QUEUE",
      "station-1",
      [{ itemId: ITEM_A, quantity: 4 }],
      NOW,
    );
    expect(ownerA.ok).toBe(true);
    if (!ownerA.ok) return;

    const ownerB = reserveInventory(
      ownerA.value,
      ReservationId.from("r-owner-b"),
      "ORDER",
      "order-1",
      [{ itemId: ITEM_A, quantity: 3 }],
      NOW,
    );
    expect(ownerB.ok).toBe(true);
    if (!ownerB.ok) return;

    const released = releaseReservation(
      ownerB.value,
      ReservationId.from("r-owner-a"),
    );
    expect(released.ok).toBe(true);
    if (!released.ok) return;

    // Owner B's reservation must still hold; only owner A's 4 came back.
    expect(getAvailableQuantity(released.value, ITEM_A)).toBe(7);
    expect(
      released.value.reservations["r-owner-b" as ReservationId],
    ).toBeDefined();
  });
});

describe("releaseReservation", () => {
  it("restores availability without changing total stock", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 10);
    const reserved = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "MANUAL",
      "owner-1",
      [{ itemId: ITEM_A, quantity: 6 }],
      NOW,
    );
    expect(reserved.ok).toBe(true);
    if (!reserved.ok) return;

    const released = releaseReservation(
      reserved.value,
      ReservationId.from("r1"),
    );
    expect(released.ok).toBe(true);
    if (!released.ok) return;

    expect(getAvailableQuantity(released.value, ITEM_A)).toBe(10);
    expect(getTotalQuantity(released.value, ITEM_A)).toBe(10);
  });

  it("returns a typed error for an unknown reservationId", () => {
    const result = releaseReservation(
      EMPTY_STATE,
      ReservationId.from("missing"),
    );
    expect(result).toEqual({
      ok: false,
      error: { code: "RESERVATION_NOT_FOUND", reservationId: "missing" },
    });
  });
});

describe("consumeReservation", () => {
  it("deducts stock and removes the reservation", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 10);
    const reserved = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "CRAFT_QUEUE",
      "station-1",
      [{ itemId: ITEM_A, quantity: 6 }],
      NOW,
    );
    expect(reserved.ok).toBe(true);
    if (!reserved.ok) return;

    const consumed = consumeReservation(
      reserved.value,
      ReservationId.from("r1"),
    );
    expect(consumed.ok).toBe(true);
    if (!consumed.ok) return;

    expect(getTotalQuantity(consumed.value, ITEM_A)).toBe(4);
    expect(getAvailableQuantity(consumed.value, ITEM_A)).toBe(4);
    expect(consumed.value.reservations["r1" as ReservationId]).toBeUndefined();
  });

  it("quantity never goes negative even after consumption", () => {
    const stocked = addToInventory(EMPTY_STATE, ITEM_A, 3);
    const reserved = reserveInventory(
      stocked,
      ReservationId.from("r1"),
      "CRAFT_QUEUE",
      "station-1",
      [{ itemId: ITEM_A, quantity: 3 }],
      NOW,
    );
    expect(reserved.ok).toBe(true);
    if (!reserved.ok) return;

    const consumed = consumeReservation(
      reserved.value,
      ReservationId.from("r1"),
    );
    expect(consumed.ok).toBe(true);
    if (!consumed.ok) return;
    expect(getTotalQuantity(consumed.value, ITEM_A)).toBe(0);
  });

  it("returns a typed error for an unknown reservationId", () => {
    const result = consumeReservation(
      EMPTY_STATE,
      ReservationId.from("missing"),
    );
    expect(result).toEqual({
      ok: false,
      error: { code: "RESERVATION_NOT_FOUND", reservationId: "missing" },
    });
  });
});
