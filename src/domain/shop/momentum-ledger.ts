/**
 * Design owner: Document 15 Task 04.6 (Shop Momentum); 05 Customer &
 * Selling System §59-63 Shop Momentum — Customer-Side Rules, Momentum Cap,
 * No Passive Momentum Farm, Momentum Visibility; 14 Technical Architecture
 * §90 Shop Momentum ("durable game state... persists across reload...
 * not reset merely because the player closed the app").
 *
 * Pure state-transition functions over `ShopState` — no `EconomyState`
 * parameter exists anywhere in this module, which is what makes "no Coin
 * conversion" true structurally rather than by convention: there is
 * simply no code path here that could touch Coins. "No close-app reset"
 * is likewise structural — Momentum lives in the same serializable
 * `GameState` as everything else durable; nothing resets it on load
 * (Task 02.2's save round-trip already proves plain `GameState` fields
 * survive a save/reload cycle unchanged).
 */
import { err, ok, type Result } from "../../core/result/index.ts";
import { type ShopState } from "../game-state/index.ts";

export interface InsufficientMomentumError {
  readonly code: "INSUFFICIENT_MOMENTUM";
  readonly required: number;
  readonly available: number;
}

/** Document 05 §61: capped — always clamped to `[0, cap]`, never exceeding it regardless of how large `amount` is. */
export function gainMomentum(
  shop: ShopState,
  amount: number,
  cap: number,
): ShopState {
  return { ...shop, momentum: Math.min(shop.momentum + amount, cap) };
}

/** Atomic: on insufficient Momentum, returns a typed error and `shop` is never touched. */
export function spendMomentum(
  shop: ShopState,
  amount: number,
): Result<ShopState, InsufficientMomentumError> {
  if (shop.momentum < amount) {
    return err({
      code: "INSUFFICIENT_MOMENTUM",
      required: amount,
      available: shop.momentum,
    });
  }
  return ok({ ...shop, momentum: shop.momentum - amount });
}
