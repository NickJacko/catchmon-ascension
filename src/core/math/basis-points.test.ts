// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { applyBasisPoints, toBasisPoints } from "./basis-points.ts";

describe("toBasisPoints", () => {
  it("accepts zero", () => {
    expect(toBasisPoints(0)).toBe(0);
  });

  it("accepts values above 10000 — general modifiers may exceed 100%", () => {
    expect(toBasisPoints(15000)).toBe(15000);
  });

  it("rejects negative values", () => {
    expect(() => toBasisPoints(-100)).toThrow(InvariantViolationError);
  });
});

describe("applyBasisPoints (canonical rounding policy)", () => {
  it("0% of an amount is 0", () => {
    expect(applyBasisPoints(1000, toBasisPoints(0))).toBe(0);
  });

  it("100% of an amount is the amount itself", () => {
    expect(applyBasisPoints(1000, toBasisPoints(10000))).toBe(1000);
  });

  it("150% (a general modifier above 10000 bps) scales up correctly", () => {
    expect(applyBasisPoints(200, toBasisPoints(15000))).toBe(300);
  });

  it("rounds once at the result boundary rather than truncating", () => {
    // 33% of 5 = 1.65 -> rounds to 2, not floored to 1.
    expect(applyBasisPoints(5, toBasisPoints(3300))).toBe(2);
  });
});
