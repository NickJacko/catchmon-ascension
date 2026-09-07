// @vitest-environment node
//
// Design owner: Document 15 Phase 7 Exit Gate ("Player state can
// meaningfully move from starter shop to expanded shop with Catchmon +
// World capability").
//
// Run this file directly (`pnpm exec vitest run src/application/dev-harness`)
// to both prove and *see* the complete Phase 7 progression/infrastructure loop.
import { describe, expect, it } from "vitest";
import { runProgressionDevHarness } from "./progression-dev-harness.ts";

describe("Phase 7 Exit Gate — Starter Shop to Expanded Shop", () => {
  it("proves rank growth -> unlock-rule satisfaction -> infrastructure purchase (instant + construction) -> macro-stage transition -> newly-available World capability", () => {
    const result = runProgressionDevHarness();

    for (const entry of result.log) {
      console.log(`[${entry.step}] ${entry.detail}`);
    }

    expect(result.log.map((entry) => entry.step)).toEqual([
      "PREPARE_STARTER_SHOP",
      "RANK_GROWTH_UNLOCKS_CATCHMON_CAPABILITY",
      "INSTANT_INFRASTRUCTURE_PURCHASE",
      "DISPLAY_SLOT_UNLOCKED",
      "CONSTRUCTION_STARTED",
      "CONSTRUCTION_COMPLETED_OFFLINE",
      "WORLD_CAPABILITY_UNLOCKED",
      "EXPANDED_SHOP_STATE",
    ]);
  });

  it("builds a valid catalog and never throws", () => {
    expect(() => runProgressionDevHarness()).not.toThrow();
  });
});
