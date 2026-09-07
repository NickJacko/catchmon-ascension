import { describe, expect, it } from "vitest";
import { ItemId } from "../../core/ids/index.ts";
import { toProbabilityBps } from "../../core/math/probability.ts";
import { createRandomSource, toSeed } from "../../core/random/index.ts";
import {
  resolveRoutineReward,
  resolveSpecialComponentBonus,
} from "./rewards.ts";

describe("resolveRoutineReward", () => {
  it("always returns exactly one guaranteed line, never a Coins reward", () => {
    const itemId = ItemId.from("slice-resource-a");
    const result = resolveRoutineReward(itemId, 4);
    expect(result).toEqual([{ itemId, quantity: 4 }]);
  });
});

describe("resolveSpecialComponentBonus", () => {
  it("is guaranteed once the protection threshold is met, without needing luck", () => {
    // A 0% chance would never succeed on a normal roll, proving this is the protection floor kicking in, not a lucky roll.
    const rng = createRandomSource(toSeed(1));
    const result = resolveSpecialComponentBonus(rng, toProbabilityBps(0), 3, 3);
    expect(result.granted).toBe(true);
    expect(result.nextConsecutiveMisses).toBe(0);
  });

  it("never succeeds below the threshold at 0% chance, and increments the miss counter", () => {
    const rng = createRandomSource(toSeed(1));
    const result = resolveSpecialComponentBonus(rng, toProbabilityBps(0), 3, 0);
    expect(result.granted).toBe(false);
    expect(result.nextConsecutiveMisses).toBe(1);
  });

  it("always succeeds at 100% chance and resets the miss counter", () => {
    const rng = createRandomSource(toSeed(1));
    const result = resolveSpecialComponentBonus(
      rng,
      toProbabilityBps(10000),
      3,
      2,
    );
    expect(result.granted).toBe(true);
    expect(result.nextConsecutiveMisses).toBe(0);
  });

  it("is deterministic for a fixed seed and counter state", () => {
    const chance = toProbabilityBps(3500);
    const first = resolveSpecialComponentBonus(
      createRandomSource(toSeed(99)),
      chance,
      3,
      0,
    );
    const second = resolveSpecialComponentBonus(
      createRandomSource(toSeed(99)),
      chance,
      3,
      0,
    );
    expect(first).toEqual(second);
  });
});
