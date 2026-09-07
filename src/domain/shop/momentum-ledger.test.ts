// @vitest-environment node
import { describe, expect, it } from "vitest";
import { gainMomentum, spendMomentum } from "./momentum-ledger.ts";

const CAP = 100;

describe("gainMomentum", () => {
  it("adds the amount when under the cap", () => {
    const shop = {
      momentum: 10,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    expect(gainMomentum(shop, 5, CAP)).toEqual({
      momentum: 15,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    });
  });

  it("clamps to the cap instead of exceeding it (Document 05 §61)", () => {
    const shop = {
      momentum: 95,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    expect(gainMomentum(shop, 50, CAP)).toEqual({
      momentum: CAP,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    });
  });

  it("does not mutate the original state", () => {
    const shop = {
      momentum: 10,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    gainMomentum(shop, 5, CAP);
    expect(shop.momentum).toBe(10);
  });
});

describe("spendMomentum", () => {
  it("subtracts the amount when sufficient", () => {
    const shop = {
      momentum: 20,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    expect(spendMomentum(shop, 8)).toEqual({
      ok: true,
      value: {
        momentum: 12,
        displaySlots: {},
        shopFloorSupportCatchmonIds: [],
      },
    });
  });

  it("succeeds at the exact boundary (spend === momentum)", () => {
    const shop = {
      momentum: 8,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    expect(spendMomentum(shop, 8)).toEqual({
      ok: true,
      value: { momentum: 0, displaySlots: {}, shopFloorSupportCatchmonIds: [] },
    });
  });

  it("returns a typed INSUFFICIENT_MOMENTUM error and leaves state untouched when insufficient", () => {
    const shop = {
      momentum: 3,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    const result = spendMomentum(shop, 8);
    expect(result).toEqual({
      ok: false,
      error: { code: "INSUFFICIENT_MOMENTUM", required: 8, available: 3 },
    });
    expect(shop.momentum).toBe(3);
  });

  it("never produces a negative momentum value", () => {
    const shop = {
      momentum: 0,
      displaySlots: {},
      shopFloorSupportCatchmonIds: [],
    };
    expect(spendMomentum(shop, 1).ok).toBe(false);
  });
});

// "No Coin conversion" is a type-level guarantee, not a runtime one worth
// string-matching for: gainMomentum/spendMomentum's own signatures above
// (visible in this file's imports and every call site) take no Coins or
// EconomyState parameter — the compiler enforces that, not a test.
