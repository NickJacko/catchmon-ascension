// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { nextIntExclusive } from "./random-range.ts";
import { type RandomSource } from "./random-source.ts";
import { toProbabilityRollBps } from "./probability-roll.ts";

function fakeSourceFromSequence(values: readonly number[]): RandomSource {
  let index = 0;
  return {
    nextUint32(): number {
      const value = values[index];
      index += 1;
      if (value === undefined) {
        throw new Error("fakeSourceFromSequence exhausted");
      }
      return value;
    },
    nextProbabilityRollBps() {
      return toProbabilityRollBps(0);
    },
  };
}

describe("nextIntExclusive", () => {
  it("maps a draw into the requested range via modulo", () => {
    const rng = fakeSourceFromSequence([12345]);
    expect(nextIntExclusive(rng, 100)).toBe(12345 % 100);
  });

  it("rejects a non-positive maxExclusive", () => {
    const rng = fakeSourceFromSequence([0]);
    expect(() => nextIntExclusive(rng, 0)).toThrow(InvariantViolationError);
    expect(() => nextIntExclusive(rng, -5)).toThrow(InvariantViolationError);
  });

  it("rejects a non-integer maxExclusive", () => {
    const rng = fakeSourceFromSequence([0]);
    expect(() => nextIntExclusive(rng, 1.5)).toThrow(InvariantViolationError);
  });

  it("rejects a maxExclusive larger than the 32-bit draw range", () => {
    const rng = fakeSourceFromSequence([0]);
    expect(() => nextIntExclusive(rng, 2 ** 32 + 1)).toThrow(
      InvariantViolationError,
    );
  });

  it("re-draws (rejection sampling) when the first draw lands in the biased leftover region", () => {
    // UINT32_RANGE = 4294967296; for maxExclusive = 10000, the largest
    // exact multiple is 4294960000, so the "leftover" region is
    // [4294960000, 4294967295]. A draw landing there must be rejected and
    // redrawn, not naively modulo'd (which is what would introduce bias).
    const rejectedDraw = 4294960000; // in the leftover region
    const acceptedDraw = 4294959999; // just below the leftover region
    const rng = fakeSourceFromSequence([rejectedDraw, acceptedDraw]);
    expect(nextIntExclusive(rng, 10000)).toBe(acceptedDraw % 10000);
  });

  it("produces only values within [0, maxExclusive) across many draws", () => {
    // Every value is kept within the real uint32 range via `>>> 0`, so none
    // of them can be spuriously rejected as "out of range" by the helper.
    const values = Array.from(
      { length: 5000 },
      (_, i) => Math.imul(i, 2654435761) >>> 0,
    );
    const rng = fakeSourceFromSequence(values);
    for (let i = 0; i < values.length; i += 1) {
      const result = nextIntExclusive(rng, 37);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(37);
    }
  });
});
