// @vitest-environment node
import { describe, expect, it } from "vitest";
import source from "./deterministic-rng.ts?raw";
import {
  createRandomSource,
  DeterministicRandomSource,
} from "./deterministic-rng.ts";
import { toSeed } from "./seed.ts";

describe("DeterministicRandomSource — fixed vectors (ADR 0001)", () => {
  // Compatibility contract: these exact sequences must never change for
  // these seeds without an explicit new ADR (see ADR 0001 Consequences).
  it("seed 0 produces the exact recorded sequence", () => {
    const rng = new DeterministicRandomSource(toSeed(0));
    const sequence = Array.from({ length: 8 }, () => rng.nextUint32());
    expect(sequence).toEqual([
      1684164658, 3653269916, 2939563536, 2141751570, 3295091513, 4057132772,
      2256158761, 2742494325,
    ]);
  });

  it("seed 1 produces the exact recorded sequence", () => {
    const rng = new DeterministicRandomSource(toSeed(1));
    const sequence = Array.from({ length: 8 }, () => rng.nextUint32());
    expect(sequence).toEqual([
      1580013426, 350525680, 3524174333, 3011703609, 643872864, 2282937712,
      2300340400, 3453518249,
    ]);
  });

  it("seed 42 produces the exact recorded sequence", () => {
    const rng = new DeterministicRandomSource(toSeed(42));
    const sequence = Array.from({ length: 8 }, () => rng.nextUint32());
    expect(sequence).toEqual([
      551831576, 144025891, 322543647, 3034809370, 908029994, 2648427983,
      61750332, 1864543335,
    ]);
  });
});

describe("DeterministicRandomSource — reproducibility", () => {
  it("two sources with the same seed produce identical sequences", () => {
    const a = createRandomSource(toSeed(777));
    const b = createRandomSource(toSeed(777));
    for (let i = 0; i < 20; i += 1) {
      expect(a.nextUint32()).toBe(b.nextUint32());
    }
  });

  it("different seeds produce different sequences", () => {
    const a = createRandomSource(toSeed(1));
    const b = createRandomSource(toSeed(2));
    const sequenceA = Array.from({ length: 10 }, () => a.nextUint32());
    const sequenceB = Array.from({ length: 10 }, () => b.nextUint32());
    expect(sequenceA).not.toEqual(sequenceB);
  });
});

describe("DeterministicRandomSource — state advance", () => {
  it("repeated calls advance state deterministically (no two consecutive values are stuck/equal)", () => {
    const rng = createRandomSource(toSeed(9));
    const first = rng.nextUint32();
    const second = rng.nextUint32();
    const third = rng.nextUint32();
    expect(first).not.toBe(second);
    expect(second).not.toBe(third);
  });
});

describe("DeterministicRandomSource — nextUint32 boundary", () => {
  it("every returned value is an integer within [0, 4294967295]", () => {
    const rng = createRandomSource(toSeed(123));
    for (let i = 0; i < 500; i += 1) {
      const value = rng.nextUint32();
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(4294967295);
    }
  });
});

describe("DeterministicRandomSource — probability-roll space", () => {
  it("nextProbabilityRollBps always stays within [0, 9999] — never 10000", () => {
    const rng = createRandomSource(toSeed(456));
    for (let i = 0; i < 2000; i += 1) {
      const roll = rng.nextProbabilityRollBps();
      expect(roll).toBeGreaterThanOrEqual(0);
      expect(roll).toBeLessThanOrEqual(9999);
    }
  });

  it("boundary semantics: a 0 chance never succeeds, a 10000 chance always succeeds", () => {
    const rng = createRandomSource(toSeed(789));
    for (let i = 0; i < 2000; i += 1) {
      const roll = rng.nextProbabilityRollBps();
      expect(roll < 0).toBe(false); // chance = 0: `roll < 0` is never true.
      expect(roll < 10000).toBe(true); // chance = 10000: `roll < 10000` is always true.
    }
  });
});

describe("DeterministicRandomSource — no Math.random()", () => {
  it("the production implementation source contains no Math.random() call", () => {
    expect(source).not.toContain("Math.random(");
  });
});
