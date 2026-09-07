// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toRandomEventCounter } from "./event-counter.ts";
import { deriveSubSeed, hashEventContext } from "./seed-derivation.ts";
import { toSeed } from "./seed.ts";

describe("hashEventContext (FNV-1a 32-bit)", () => {
  // Cross-checked against FNV-1a's own published reference vectors — this
  // proves the implementation is a correct, standard FNV-1a, not just
  // self-consistent.
  it("matches the published FNV-1a 32-bit vector for the empty string", () => {
    expect(hashEventContext("")).toBe(0x811c9dc5);
  });

  it("matches the published FNV-1a 32-bit vector for 'a'", () => {
    expect(hashEventContext("a")).toBe(0xe40c292c);
  });

  it("matches the published FNV-1a 32-bit vector for 'foobar'", () => {
    expect(hashEventContext("foobar")).toBe(0xbf9cf968);
  });
});

describe("deriveSubSeed", () => {
  const root1 = toSeed(1);
  const root2 = toSeed(2);
  const counter0 = toRandomEventCounter(0);
  const counter1 = toRandomEventCounter(1);

  it("identical inputs produce an identical sub-seed", () => {
    expect(deriveSubSeed(root1, counter0, "a")).toBe(
      deriveSubSeed(root1, counter0, "a"),
    );
  });

  it("a changed root seed changes the sub-seed", () => {
    expect(deriveSubSeed(root1, counter0, "a")).not.toBe(
      deriveSubSeed(root2, counter0, "a"),
    );
  });

  it("a changed event counter changes the sub-seed", () => {
    expect(deriveSubSeed(root1, counter0, "a")).not.toBe(
      deriveSubSeed(root1, counter1, "a"),
    );
  });

  it("a changed event context changes the sub-seed", () => {
    expect(deriveSubSeed(root1, counter0, "a")).not.toBe(
      deriveSubSeed(root1, counter0, "b"),
    );
  });

  it("always produces a valid Seed (within the uint32 range)", () => {
    const subSeed = deriveSubSeed(root1, counter0, "expedition:route-1");
    expect(Number.isInteger(subSeed)).toBe(true);
    expect(subSeed).toBeGreaterThanOrEqual(0);
    expect(subSeed).toBeLessThanOrEqual(0xffffffff);
  });
});
