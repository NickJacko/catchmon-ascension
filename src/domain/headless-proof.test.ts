// @vitest-environment node
//
// Forcing the "node" environment (overriding vitest.config.ts's default
// jsdom) proves this domain module needs no browser/DOM environment at all.
import { describe, expect, it } from "vitest";
import { sumNonNegativeIntegers } from "./headless-proof.ts";

describe("headless-proof (architecture scaffold check)", () => {
  it("computes a deterministic result with no browser environment", () => {
    expect(sumNonNegativeIntegers([1, 2, 3])).toBe(6);
  });

  it("rejects invalid input deterministically", () => {
    expect(() => sumNonNegativeIntegers([-1])).toThrow(RangeError);
  });
});
