// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import {
  assertSafeNonNegativeInteger,
  isSafeNonNegativeInteger,
  multiplyAndRound,
  roundToInteger,
  safeAddCoins,
  safeSubtractCoins,
  toCoins,
} from "./integer.ts";

describe("isSafeNonNegativeInteger / assertSafeNonNegativeInteger", () => {
  it("accepts zero and positive safe integers", () => {
    expect(isSafeNonNegativeInteger(0)).toBe(true);
    expect(isSafeNonNegativeInteger(42)).toBe(true);
    expect(isSafeNonNegativeInteger(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it("rejects negative numbers, non-integers, and non-finite values", () => {
    expect(isSafeNonNegativeInteger(-1)).toBe(false);
    expect(isSafeNonNegativeInteger(1.5)).toBe(false);
    expect(isSafeNonNegativeInteger(Number.NaN)).toBe(false);
    expect(isSafeNonNegativeInteger(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isSafeNonNegativeInteger(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });

  it("assertSafeNonNegativeInteger throws only for invalid values", () => {
    expect(() => {
      assertSafeNonNegativeInteger(10);
    }).not.toThrow();
    expect(() => {
      assertSafeNonNegativeInteger(-1);
    }).toThrow(InvariantViolationError);
  });
});

describe("roundToInteger (canonical rounding policy)", () => {
  it("rounds half up", () => {
    expect(roundToInteger(2.5)).toBe(3);
    expect(roundToInteger(2.4)).toBe(2);
  });

  it("handles large safe integers without throwing", () => {
    expect(roundToInteger(Number.MAX_SAFE_INTEGER)).toBe(
      Number.MAX_SAFE_INTEGER,
    );
  });

  it("throws if the rounded result would be unsafe", () => {
    expect(() => roundToInteger(Number.MAX_SAFE_INTEGER + 2)).toThrow(
      InvariantViolationError,
    );
  });
});

describe("multiplyAndRound", () => {
  it("multiplies then rounds once at the boundary", () => {
    expect(multiplyAndRound(10, 0.5)).toBe(5);
    expect(multiplyAndRound(3, 0.5)).toBe(2); // 1.5 -> rounds up to 2
  });
});

describe("Coins", () => {
  it("toCoins accepts zero and positive safe integers", () => {
    expect(toCoins(0)).toBe(0);
    expect(toCoins(100)).toBe(100);
  });

  it("toCoins rejects negative amounts (safe negative rejection)", () => {
    expect(() => toCoins(-1)).toThrow(InvariantViolationError);
  });

  it("safeAddCoins adds two amounts", () => {
    expect(safeAddCoins(toCoins(10), toCoins(5))).toBe(15);
  });

  it("safeAddCoins throws rather than overflow past MAX_SAFE_INTEGER", () => {
    const almostMax = toCoins(Number.MAX_SAFE_INTEGER - 1);
    expect(() => safeAddCoins(almostMax, toCoins(10))).toThrow(
      InvariantViolationError,
    );
  });

  it("safeSubtractCoins returns ok(...) for a valid non-negative result", () => {
    const result = safeSubtractCoins(toCoins(10), toCoins(4));
    expect(result).toEqual({ ok: true, value: 6 });
  });

  it("safeSubtractCoins returns err('NEGATIVE_RESULT') instead of a negative amount", () => {
    const result = safeSubtractCoins(toCoins(4), toCoins(10));
    expect(result).toEqual({ ok: false, error: "NEGATIVE_RESULT" });
  });

  it("safeSubtractCoins reaching exactly zero is a valid ok(...) result", () => {
    const result = safeSubtractCoins(toCoins(10), toCoins(10));
    expect(result).toEqual({ ok: true, value: 0 });
  });
});
