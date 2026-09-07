// @vitest-environment node
//
// Design owner: Document 15 Phase 5 Exit Gate ("Catchmons are canonical
// entities, one can be assigned, shop strategy changes, XP develops
// through use, assignment is not duplicated, no old team system exists").
//
// Run this file directly (`pnpm exec vitest run src/application/dev-harness`)
// to both prove and *see* the complete Phase 5 Catchmon integration loop.
import { describe, expect, it } from "vitest";
import { runCatchmonDevHarness } from "./catchmon-dev-harness.ts";

describe("Phase 5 Exit Gate — M3 Catchmon Shop", () => {
  it("proves Catchmons are canonical entities, assignable, strategy-changing, XP-developing, and not duplicated", () => {
    const result = runCatchmonDevHarness();

    for (const entry of result.log) {
      console.log(`[${entry.step}] ${entry.detail}`);
    }

    expect(result.log.map((entry) => entry.step)).toEqual([
      "CANONICAL_ENTITIES",
      "ASSIGN_CATCHMON",
      "ASSIGNMENT_NOT_DUPLICATED",
      "WORKSHOP_STRATEGY_CHANGE",
      "WORKSHOP_XP_DEVELOPS",
      "SHOP_FLOOR_STRATEGY_CHANGE",
      "NO_OLD_TEAM_SYSTEM",
      "REAL_EVOLUTION",
    ]);
  });

  it("builds a valid catalog and never throws", () => {
    expect(() => runCatchmonDevHarness()).not.toThrow();
  });
});
