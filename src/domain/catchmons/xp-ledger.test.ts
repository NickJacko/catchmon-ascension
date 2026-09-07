// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  CatchmonLineId,
  CatchmonSpeciesId,
  OwnedCatchmonId,
} from "../../core/ids/index.ts";
import { type OwnedCatchmonState } from "../game-state/index.ts";
import { applyXp, levelForXp } from "./xp-ledger.ts";

const XP_PER_LEVEL = 20;
const LEVEL_CAP = 10;

function fixtureOwned(xp: number, level: number): OwnedCatchmonState {
  return {
    ownedCatchmonId: OwnedCatchmonId.from("example-owned"),
    lineId: CatchmonLineId.from("example-line"),
    currentSpeciesId: CatchmonSpeciesId.from("example-species"),
    level,
    xp,
    evolutionReadiness: "NOT_READY",
    currentAssignment: { kind: "UNASSIGNED" },
  };
}

describe("levelForXp", () => {
  it("starts at level 1 with 0 xp", () => {
    expect(levelForXp(0, XP_PER_LEVEL, LEVEL_CAP)).toBe(1);
  });

  it("advances one level per full xpPerLevel threshold crossed", () => {
    expect(levelForXp(19, XP_PER_LEVEL, LEVEL_CAP)).toBe(1);
    expect(levelForXp(20, XP_PER_LEVEL, LEVEL_CAP)).toBe(2);
    expect(levelForXp(39, XP_PER_LEVEL, LEVEL_CAP)).toBe(2);
  });

  it("never exceeds the level cap", () => {
    expect(levelForXp(XP_PER_LEVEL * 1000, XP_PER_LEVEL, LEVEL_CAP)).toBe(
      LEVEL_CAP,
    );
  });
});

describe("applyXp", () => {
  it("adds xp and recomputes level without mutating the input", () => {
    const owned = fixtureOwned(0, 1);
    const next = applyXp(owned, 25, XP_PER_LEVEL, LEVEL_CAP);
    expect(next.xp).toBe(25);
    expect(next.level).toBe(2);
    expect(owned.xp).toBe(0);
    expect(owned.level).toBe(1);
  });

  it("keeps accruing xp past the level cap without discarding it", () => {
    const owned = fixtureOwned(XP_PER_LEVEL * (LEVEL_CAP - 1), LEVEL_CAP);
    const next = applyXp(owned, 100, XP_PER_LEVEL, LEVEL_CAP);
    expect(next.xp).toBe(XP_PER_LEVEL * (LEVEL_CAP - 1) + 100);
    expect(next.level).toBe(LEVEL_CAP);
  });
});
