import { describe, expect, it } from "vitest";
import { CatchmonSpeciesId } from "../../core/ids/index.ts";
import { createRandomSource, toSeed } from "../../core/random/index.ts";
import { selectEncounterTarget } from "./encounter-selection.ts";

const OWNED = CatchmonSpeciesId.from("Geckon");
const UNOWNED = CatchmonSpeciesId.from("Aquaril");

describe("selectEncounterTarget", () => {
  it("deterministically picks the sole unowned candidate without consuming an RNG draw", () => {
    const rng = createRandomSource(toSeed(1));
    const result = selectEncounterTarget(
      rng,
      [OWNED, UNOWNED],
      (id) => id === OWNED,
    );
    expect(result).toBe(UNOWNED);
  });

  it("falls back to the full pool once every candidate's line is already owned", () => {
    const rng = createRandomSource(toSeed(1));
    const result = selectEncounterTarget(rng, [OWNED], () => true);
    expect(result).toBe(OWNED);
  });

  it("draws from the RNG when multiple unowned candidates exist, deterministically for a fixed seed", () => {
    const other = CatchmonSpeciesId.from("Other");
    const first = selectEncounterTarget(
      createRandomSource(toSeed(5)),
      [UNOWNED, other],
      () => false,
    );
    const second = selectEncounterTarget(
      createRandomSource(toSeed(5)),
      [UNOWNED, other],
      () => false,
    );
    expect(first).toBe(second);
    expect([UNOWNED, other]).toContain(first);
  });
});
