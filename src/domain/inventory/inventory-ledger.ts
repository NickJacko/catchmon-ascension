/**
 * Design owner: 14 Technical Architecture §72 Inventory Architecture ("one
 * canonical system... Do not let each feature maintain its own quantity
 * copy"), §74-77 Reservation Ledger / Owner Types / Why A Central
 * Reservation Ledger / Availability Query, §78 Atomic Inventory
 * Transactions; 04 Crafting & Product System §37 Material Reservation,
 * §38 Cancellation Rule.
 *
 * Pure state-transition functions over `InventoryState` — no command
 * envelope, no I/O, no catalog lookups (a plain `ItemId -> quantity`
 * ledger is agnostic to what an item *is*; resolving a `ProductId`/
 * `ResourceId` to an `ItemId` is the caller's job, see
 * `product-item-id.ts` for the one product-specific case that needs
 * derivation).
 */
import { type ItemId, type ReservationId } from "../../core/ids/index.ts";
import { err, ok, type Result } from "../../core/result/index.ts";
import { type TimestampMs } from "../../core/time/index.ts";
import { type QualityGrade } from "../crafting/index.ts";
import {
  type InventoryState,
  type Reservation,
  type ReservationOwnerType,
} from "../game-state/index.ts";

export interface ReservationItemInput {
  readonly itemId: ItemId;
  readonly quantity: number;
}

export type InventoryError =
  | {
      readonly code: "INSUFFICIENT_AVAILABLE";
      readonly shortfalls: readonly {
        readonly itemId: ItemId;
        readonly requested: number;
        readonly available: number;
      }[];
    }
  | {
      readonly code: "DUPLICATE_RESERVATION_ID";
      readonly reservationId: ReservationId;
    }
  | {
      readonly code: "RESERVATION_NOT_FOUND";
      readonly reservationId: ReservationId;
    };

/** Document 14 §77: `available = total - reserved`, summed across every reservation holding this item. */
export function getTotalQuantity(
  state: InventoryState,
  itemId: ItemId,
): number {
  return state.stacks[itemId]?.quantity ?? 0;
}

export function getReservedQuantity(
  state: InventoryState,
  itemId: ItemId,
): number {
  let reserved = 0;
  for (const reservation of Object.values(state.reservations)) {
    for (const line of reservation.items) {
      if (line.itemId === itemId) {
        reserved += line.quantity;
      }
    }
  }
  return reserved;
}

export function getAvailableQuantity(
  state: InventoryState,
  itemId: ItemId,
): number {
  return getTotalQuantity(state, itemId) - getReservedQuantity(state, itemId);
}

/**
 * Batch form of `getReservedQuantity`, one pass over every reservation
 * regardless of how many items the caller ultimately looks up. Phase 11
 * scale-audit finding: a caller listing every product/resource/component
 * (as the Inventory/Display sheets do) and calling `getReservedQuantity`
 * per item turns an O(reservations) scan into O(items x reservations) —
 * invisible at slice scale (a handful of reservations), real at a ~100+
 * product catalog. Use this once per render/batch instead of looping the
 * single-item queries above.
 */
export function getReservedQuantitiesByItem(
  state: InventoryState,
): Readonly<Record<ItemId, number>> {
  const reserved: Record<ItemId, number> = {};
  for (const reservation of Object.values(state.reservations)) {
    for (const line of reservation.items) {
      reserved[line.itemId] = (reserved[line.itemId] ?? 0) + line.quantity;
    }
  }
  return reserved;
}

/**
 * Adds `quantity` of `itemId` to inventory — always succeeds (Document 14
 * §78: additive stock changes have no failure mode; capacity/storage caps
 * are a later, undesigned system — Document 03 §29 defers exact caps).
 * `quality` is stored on the stack for display/query convenience only;
 * for quality-eligible products the caller is expected to have already
 * derived `itemId` via `productItemId` so it need not double as a lookup key.
 */
export function addToInventory(
  state: InventoryState,
  itemId: ItemId,
  quantity: number,
  quality?: QualityGrade,
): InventoryState {
  const existing = state.stacks[itemId];
  const nextQuantity = (existing?.quantity ?? 0) + quantity;
  return {
    ...state,
    stacks: {
      ...state.stacks,
      [itemId]: { itemId, quantity: nextQuantity, quality },
    },
  };
}

/**
 * Atomically reserves every line in `items`, or none of them (Document 14
 * §78). Fails with every insufficient line reported together, not just
 * the first, so a caller can show the player the full picture at once.
 */
export function reserveInventory(
  state: InventoryState,
  reservationId: ReservationId,
  ownerType: ReservationOwnerType,
  ownerId: string,
  items: readonly ReservationItemInput[],
  createdAtMs: TimestampMs,
): Result<InventoryState, InventoryError> {
  if (reservationId in state.reservations) {
    return err({ code: "DUPLICATE_RESERVATION_ID", reservationId });
  }

  const shortfalls = items
    .map((line) => ({
      itemId: line.itemId,
      requested: line.quantity,
      available: getAvailableQuantity(state, line.itemId),
    }))
    .filter((line) => line.requested > line.available);

  if (shortfalls.length > 0) {
    return err({ code: "INSUFFICIENT_AVAILABLE", shortfalls });
  }

  const reservation: Reservation = {
    reservationId,
    ownerType,
    ownerId,
    items,
    createdAtMs,
  };

  return ok({
    ...state,
    reservations: { ...state.reservations, [reservationId]: reservation },
  });
}

/**
 * Cancels a reservation without touching stock (Document 04 §38: reserved
 * inputs are returned — since a reservation never deducted stock, "return"
 * means simply deleting the reservation record so the items count as
 * available again).
 */
export function releaseReservation(
  state: InventoryState,
  reservationId: ReservationId,
): Result<InventoryState, InventoryError> {
  if (!(reservationId in state.reservations)) {
    return err({ code: "RESERVATION_NOT_FOUND", reservationId });
  }
  return ok({
    ...state,
    reservations: withoutReservation(state.reservations, reservationId),
  });
}

/**
 * Actually deducts a reservation's items from stock and removes the
 * reservation, atomically. Used when the activity the reservation was
 * held for actually happens (e.g. a craft starts consuming its inputs).
 */
export function consumeReservation(
  state: InventoryState,
  reservationId: ReservationId,
): Result<InventoryState, InventoryError> {
  const reservation = state.reservations[reservationId];
  if (!reservation) {
    return err({ code: "RESERVATION_NOT_FOUND", reservationId });
  }

  const nextStacks = { ...state.stacks };
  for (const line of reservation.items) {
    const existing = nextStacks[line.itemId];
    const remaining = (existing?.quantity ?? 0) - line.quantity;
    nextStacks[line.itemId] =
      existing?.quality === undefined
        ? { itemId: line.itemId, quantity: remaining }
        : {
            itemId: line.itemId,
            quantity: remaining,
            quality: existing.quality,
          };
  }

  return ok({
    ...state,
    stacks: nextStacks,
    reservations: withoutReservation(state.reservations, reservationId),
  });
}

/** Immutably removes one key from a reservations record (Task 01.8 §43 normalized-Record shape). */
function withoutReservation(
  reservations: Readonly<Record<ReservationId, Reservation>>,
  reservationId: ReservationId,
): Readonly<Record<ReservationId, Reservation>> {
  const next = { ...reservations };
  delete next[reservationId];
  return next;
}
