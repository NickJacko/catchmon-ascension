// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toCoins } from "../../core/math/index.ts";
import { creditCoins, debitCoins } from "./coin-ledger.ts";

describe("creditCoins", () => {
  it("adds the amount to the current balance", () => {
    const state = { coins: toCoins(100) };
    expect(creditCoins(state, toCoins(50))).toEqual({ coins: 150 });
  });

  it("does not mutate the original state", () => {
    const state = { coins: toCoins(100) };
    creditCoins(state, toCoins(50));
    expect(state.coins).toBe(100);
  });
});

describe("debitCoins", () => {
  it("subtracts the amount when funds are sufficient", () => {
    const state = { coins: toCoins(100) };
    const result = debitCoins(state, toCoins(40));
    expect(result).toEqual({ ok: true, value: { coins: 60 } });
  });

  it("succeeds at the exact boundary (debit === balance)", () => {
    const state = { coins: toCoins(100) };
    const result = debitCoins(state, toCoins(100));
    expect(result).toEqual({ ok: true, value: { coins: 0 } });
  });

  it("returns a typed INSUFFICIENT_FUNDS error and leaves state untouched when funds are insufficient", () => {
    const state = { coins: toCoins(30) };
    const result = debitCoins(state, toCoins(50));

    expect(result).toEqual({
      ok: false,
      error: {
        code: "INSUFFICIENT_FUNDS",
        required: 50,
        available: 30,
      },
    });
    expect(state.coins).toBe(30);
  });

  it("never produces a negative Coins value", () => {
    const state = { coins: toCoins(0) };
    const result = debitCoins(state, toCoins(1));
    expect(result.ok).toBe(false);
  });
});
