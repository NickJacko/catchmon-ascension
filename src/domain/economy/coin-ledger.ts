/**
 * Design owner: 03 Economy Architecture §6 Main Currency — Coins, §33 No
 * Negative Debt Loop; 14 Technical Architecture §32 Numeric Representation
 * — Coins.
 *
 * Pure state-transition functions over `EconomyState` — no command
 * envelope, no I/O. Reuses the Core-layer safe arithmetic (`safeAddCoins`/
 * `safeSubtractCoins`, Task 01.2) rather than reimplementing it (Document
 * 14 §37: "UI and feature code must not reimplement the formula").
 * Nothing in Phase 3 actually spends/earns Coins yet (crafting consumes
 * materials, not Coins; selling is Phase 4) — this module exists so
 * Phase 4's commands (e.g. Task 04.5 Standard Sale: "credit Coins") have
 * a ready, tested primitive to call rather than inventing their own.
 */
import {
  safeAddCoins,
  safeSubtractCoins,
  type Coins,
} from "../../core/math/index.ts";
import { err, ok, type Result } from "../../core/result/index.ts";
import { type EconomyState } from "../game-state/index.ts";

/** Document 14 §53-54: an expected, typed gameplay failure — not thrown. */
export interface InsufficientFundsError {
  readonly code: "INSUFFICIENT_FUNDS";
  readonly required: Coins;
  readonly available: Coins;
}

/**
 * Always succeeds (crediting Coins has no failure mode short of exceeding
 * `Number.MAX_SAFE_INTEGER`, which `safeAddCoins` treats as a programming
 * error, not a gameplay one).
 */
export function creditCoins(state: EconomyState, amount: Coins): EconomyState {
  return { coins: safeAddCoins(state.coins, amount) };
}

/**
 * Atomic: on insufficient funds, returns a typed error and `state` is
 * never touched — there is nothing to partially undo (Document 14 §227).
 */
export function debitCoins(
  state: EconomyState,
  amount: Coins,
): Result<EconomyState, InsufficientFundsError> {
  const result = safeSubtractCoins(state.coins, amount);
  if (!result.ok) {
    return err({
      code: "INSUFFICIENT_FUNDS",
      required: amount,
      available: state.coins,
    });
  }
  return ok({ coins: result.value });
}
