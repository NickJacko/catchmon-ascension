import { describe, expect, it } from "vitest";
import {
  DISPLAY_EXPANSION_INFRASTRUCTURE,
  EXPEDITION_HUB_INFRASTRUCTURE,
  SLICE_INFRASTRUCTURE,
} from "./infrastructureContent.ts";
import { EXPEDITION_HUB_INTRO_UNLOCK_RULE } from "./progressionContent.ts";

describe("SLICE_INFRASTRUCTURE (Document 15 Task 07.3)", () => {
  it("declares exactly the 2 approved slice upgrades", () => {
    expect(SLICE_INFRASTRUCTURE).toHaveLength(2);
    expect(SLICE_INFRASTRUCTURE).toContain(EXPEDITION_HUB_INFRASTRUCTURE);
    expect(SLICE_INFRASTRUCTURE).toContain(DISPLAY_EXPANSION_INFRASTRUCTURE);
  });

  it("reuses the canonical Expedition Hub introduction unlock rule by identity, never a re-declared duplicate (regression: closes the Phase 7 drift risk)", () => {
    expect(EXPEDITION_HUB_INFRASTRUCTURE.unlockRule).toBe(
      EXPEDITION_HUB_INTRO_UNLOCK_RULE,
    );
  });

  it("gives Expedition Hub a construction timer and Display Expansion an instant purchase", () => {
    expect(
      EXPEDITION_HUB_INFRASTRUCTURE.constructionDurationMs,
    ).toBeGreaterThan(0);
    expect(
      DISPLAY_EXPANSION_INFRASTRUCTURE.constructionDurationMs,
    ).toBeUndefined();
  });
});
