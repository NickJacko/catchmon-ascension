// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  InvariantViolationError,
  assertNever,
  invariant,
} from "./invariant.ts";

describe("invariant", () => {
  it("does not throw when the condition holds", () => {
    expect(() => {
      invariant(1 + 1 === 2, "math should still work");
    }).not.toThrow();
  });

  it("throws a useful, typed error when the condition fails", () => {
    expect(() => {
      invariant(false, "reservation ledger must never go negative");
    }).toThrow(InvariantViolationError);

    try {
      invariant(false, "reservation ledger must never go negative");
      expect.unreachable("invariant should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(InvariantViolationError);
      expect((error as Error).message).toBe(
        "reservation ledger must never go negative",
      );
    }
  });
});

describe("assertNever", () => {
  type Sale = { kind: "standard" } | { kind: "favorable" };

  function describeSale(sale: Sale): string {
    switch (sale.kind) {
      case "standard":
        return "Standard Sale";
      case "favorable":
        return "Favorable Deal";
      default:
        return assertNever(sale);
    }
  }

  it("handles every known branch normally", () => {
    expect(describeSale({ kind: "standard" })).toBe("Standard Sale");
    expect(describeSale({ kind: "favorable" })).toBe("Favorable Deal");
  });

  it("throws if an unreachable branch is somehow reached at runtime", () => {
    const impossibleSale = { kind: "premium" } as unknown as Sale;
    expect(() => {
      describeSale(impossibleSale);
    }).toThrow(InvariantViolationError);
  });
});
