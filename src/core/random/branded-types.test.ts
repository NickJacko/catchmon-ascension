// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  toRandomEventCounter,
  type RandomEventCounter,
} from "./event-counter.ts";
import {
  toProbabilityRollBps,
  type ProbabilityRollBps,
} from "./probability-roll.ts";
import { toSeed, type Seed } from "./seed.ts";
import { toProbabilityBps, type ProbabilityBps } from "../math/probability.ts";

describe("branded random types (compile-time)", () => {
  it("proves Seed and RandomEventCounter are not interchangeable", () => {
    const seed = toSeed(42);
    const counter = toRandomEventCounter(42);

    // Positive controls: same-branded assignments must typecheck cleanly.
    const sameSeed: Seed = seed;
    const sameCounter: RandomEventCounter = counter;
    expect(sameSeed).toBe(seed);
    expect(sameCounter).toBe(counter);

    // @ts-expect-error — Seed must not be assignable to RandomEventCounter,
    // even though both are `number` at runtime and may share a numeric
    // value (both are 42 above).
    const seedAsCounter: RandomEventCounter = seed;
    // @ts-expect-error — RandomEventCounter must not be assignable to Seed.
    const counterAsSeed: Seed = counter;
    // @ts-expect-error — a raw number literal must not satisfy Seed
    // without going through toSeed(...).
    const rawNumberAsSeed: Seed = 42;

    expect(seedAsCounter).toBe(seed);
    expect(counterAsSeed).toBe(counter);
    expect(rawNumberAsSeed).toBe(42);
  });

  it("proves ProbabilityRollBps and ProbabilityBps are not interchangeable", () => {
    const roll = toProbabilityRollBps(9999);
    const chance = toProbabilityBps(9999);

    // Positive controls: same-branded assignments must typecheck cleanly.
    const sameRoll: ProbabilityRollBps = roll;
    const sameChance: ProbabilityBps = chance;
    expect(sameRoll).toBe(roll);
    expect(sameChance).toBe(chance);

    // @ts-expect-error — a random-roll draw (ProbabilityRollBps) must not
    // be assignable to a chance/probability (ProbabilityBps): a roll is
    // not itself a probability, even though both share the same numeric
    // value (9999) and the same runtime type (`number`).
    const rollAsChance: ProbabilityBps = roll;
    // @ts-expect-error — a chance/probability must not be assignable to a
    // roll: ProbabilityBps additionally permits 10000 (100%), which is
    // never a valid ProbabilityRollBps value.
    const chanceAsRoll: ProbabilityRollBps = chance;

    expect(rollAsChance).toBe(roll);
    expect(chanceAsRoll).toBe(chance);
  });
});
