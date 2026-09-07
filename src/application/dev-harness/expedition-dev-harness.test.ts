// @vitest-environment node
//
// Design owner: Document 15 Phase 6 Exit Gate ("prepare -> expedition ->
// offline time -> result exactly once -> trace/encounter -> capture ->
// collection update -> new Catchmon available", reload tested at every
// major boundary).
//
// Run this file directly (`pnpm exec vitest run src/application/dev-harness`)
// to both prove and *see* the complete Phase 6 world/expedition loop.
import { describe, expect, it } from "vitest";
import { runExpeditionDevHarness } from "./expedition-dev-harness.ts";

describe("Phase 6 Exit Gate — M4 World Loop", () => {
  it("proves prepare -> expedition -> offline time -> result exactly once -> trace/encounter -> capture -> collection update -> new Catchmon available, with reload at every major boundary", () => {
    const result = runExpeditionDevHarness();

    for (const entry of result.log) {
      console.log(`[${entry.step}] ${entry.detail}`);
    }

    expect(result.log.map((entry) => entry.step)).toEqual([
      "PREPARE",
      "EXPEDITION_STARTED",
      "RELOAD_AFTER_START",
      "OFFLINE_TIME_RECONCILED",
      "RESULT_EXACTLY_ONCE",
      "TRACE_ENCOUNTER",
      "RELOAD_AFTER_ENCOUNTER",
      "CAPTURE",
      "COLLECTION_UPDATE_NEW_CATCHMON_AVAILABLE",
    ]);
  });

  it("builds a valid catalog and never throws", () => {
    expect(() => runExpeditionDevHarness()).not.toThrow();
  });
});
