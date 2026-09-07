// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toCoins, type Coins } from "./integer.ts";
import { toBasisPoints, type BasisPoints } from "./basis-points.ts";
import { toProbabilityBps, type ProbabilityBps } from "./probability.ts";

describe("branded numeric types (compile-time)", () => {
  it("proves Coins, BasisPoints, and ProbabilityBps are not interchangeable", () => {
    const coins = toCoins(100);
    const basisPoints = toBasisPoints(10000);
    const probability = toProbabilityBps(10000);

    // Positive controls: same-branded assignments must typecheck cleanly.
    const sameCoins: Coins = coins;
    const sameBasisPoints: BasisPoints = basisPoints;
    const sameProbability: ProbabilityBps = probability;
    expect(sameCoins).toBe(coins);
    expect(sameBasisPoints).toBe(basisPoints);
    expect(sameProbability).toBe(probability);

    // @ts-expect-error — Coins must not be assignable to BasisPoints, even
    // though both are `number` at runtime.
    const coinsAsBasisPoints: BasisPoints = coins;
    // @ts-expect-error — BasisPoints must not be assignable to Coins.
    const basisPointsAsCoins: Coins = basisPoints;
    // @ts-expect-error — BasisPoints must not be assignable to
    // ProbabilityBps: a >100% modifier must never be usable as a
    // probability.
    const basisPointsAsProbability: ProbabilityBps = basisPoints;
    // @ts-expect-error — ProbabilityBps must not be assignable to
    // BasisPoints.
    const probabilityAsBasisPoints: BasisPoints = probability;
    // @ts-expect-error — a raw number literal must not satisfy a branded
    // numeric type without going through its constructor.
    const rawNumberAsCoins: Coins = 100;

    expect(coinsAsBasisPoints).toBe(coins);
    expect(basisPointsAsCoins).toBe(basisPoints);
    expect(basisPointsAsProbability).toBe(basisPoints);
    expect(probabilityAsBasisPoints).toBe(probability);
    expect(rawNumberAsCoins).toBe(100);
  });
});
