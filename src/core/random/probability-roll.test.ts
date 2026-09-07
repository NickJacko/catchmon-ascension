import { describe, expect, it } from "vitest";
import { toProbabilityBps } from "../math/probability.ts";
import { createRandomSource } from "./deterministic-rng.ts";
import { toSeed } from "./seed.ts";
import { rollSucceeds } from "./probability-roll.ts";

describe("rollSucceeds", () => {
  it("never succeeds at 0% chance", () => {
    const rng = createRandomSource(toSeed(1));
    for (let i = 0; i < 50; i++) {
      expect(rollSucceeds(rng, toProbabilityBps(0))).toBe(false);
    }
  });

  it("always succeeds at 100% chance", () => {
    const rng = createRandomSource(toSeed(1));
    for (let i = 0; i < 50; i++) {
      expect(rollSucceeds(rng, toProbabilityBps(10000))).toBe(true);
    }
  });

  it("is deterministic for a fixed seed", () => {
    const chance = toProbabilityBps(5000);
    const first = createRandomSource(toSeed(42));
    const second = createRandomSource(toSeed(42));
    const firstResults = Array.from({ length: 10 }, () =>
      rollSucceeds(first, chance),
    );
    const secondResults = Array.from({ length: 10 }, () =>
      rollSucceeds(second, chance),
    );
    expect(firstResults).toEqual(secondResults);
  });

  it("produces a roughly plausible success rate at 50% over many draws", () => {
    const rng = createRandomSource(toSeed(7));
    const chance = toProbabilityBps(5000);
    let successes = 0;
    const trials = 2000;
    for (let i = 0; i < trials; i++) {
      if (rollSucceeds(rng, chance)) successes++;
    }
    const rate = successes / trials;
    expect(rate).toBeGreaterThan(0.4);
    expect(rate).toBeLessThan(0.6);
  });
});
