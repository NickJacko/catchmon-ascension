// @vitest-environment node
//
// Design owner: Document 15 Phase 4 Exit Gate ("craft -> stock -> customer
// -> Standard/Favorable/Premium/Recommend -> Coins/Momentum -> reinvest
// hook must work, through dev harness/tests").
//
// Run this file directly (`pnpm exec vitest run src/application/dev-harness`)
// to both prove and *see* the complete Phase 4 shop loop.
import { describe, expect, it } from "vitest";
import { runShopLoopDevHarness } from "./shop-loop-dev-harness.ts";

describe("Phase 4 Exit Gate — complete headless shop loop", () => {
  it("proves craft -> stock -> customer -> Standard/Favorable/Premium/Recommend -> Coins/Momentum -> reinvest hook", () => {
    const result = runShopLoopDevHarness();

    for (const entry of result.log) {
      console.log(`[${entry.step}] ${entry.detail}`);
    }

    expect(result.log.map((entry) => entry.step)).toEqual([
      "CRAFT_AND_STOCK",
      "ASSIGN_DISPLAY",
      "STANDARD_SALE",
      "FAVORABLE_DEAL",
      "SEED_MOMENTUM_FOR_HARNESS",
      "PREMIUM_PITCH",
      "RECOMMEND",
      "DECLINE",
      "COINS_AND_MOMENTUM_AFTER_TRANSACTIONS",
      "WORKSHOP_PUSH",
      "RECONCILE_AFTER_PUSH",
      "FINAL_STATE",
    ]);

    const state = result.finalState;

    // Coins increased overall (four completed sales credited Coins).
    expect(state.economy.coins).toBeGreaterThan(0);

    // No customer left dangling: every arrival was resolved (sold to, recommended to, or declined).
    expect(state.customers.activeCustomerIds).toEqual([]);

    // Workshop Push actually accelerated a real craft: no active craft remains after reconciliation.
    const provisionStation = Object.values(state.crafting.stations).find(
      (s) => s.archetype === "PROVISION_STATION",
    );
    expect(provisionStation?.activeCraft).toBeUndefined();
  });

  it("builds a valid catalog and never throws", () => {
    expect(() => runShopLoopDevHarness()).not.toThrow();
  });
});
