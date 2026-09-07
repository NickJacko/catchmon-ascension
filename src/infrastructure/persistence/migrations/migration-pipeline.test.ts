// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createV1BaselineFixture } from "./fixtures/v1-baseline.ts";
import { migrateFixtureToCurrentVersion } from "./migration-test-harness.ts";
import { runMigrations } from "./migration-pipeline.ts";

describe("runMigrations", () => {
  it("passes an envelope already at the target version through unchanged (identity)", () => {
    const fixture = createV1BaselineFixture();
    const result = runMigrations(fixture, 1);
    expect(result).toEqual({ ok: true, value: fixture });
  });

  it("rejects an envelope from a newer schema version than the target (Document 14 §149: fail safely)", () => {
    const fixture = { ...createV1BaselineFixture(), schemaVersion: 2 };
    const result = runMigrations(fixture, 1);
    expect(result).toEqual({
      ok: false,
      error: {
        code: "SAVE_FROM_NEWER_VERSION",
        foundVersion: 2,
        targetVersion: 1,
      },
    });
  });

  it("rejects an envelope from an older version with no registered migration path", () => {
    const fixture = { ...createV1BaselineFixture(), schemaVersion: 0 };
    const result = runMigrations(fixture, 1);
    expect(result).toEqual({
      ok: false,
      error: {
        code: "NO_MIGRATION_PATH",
        fromVersion: 0,
        targetVersion: 1,
      },
    });
  });
});

describe("migration test harness — v1 baseline fixture", () => {
  it("migrates cleanly to the current version and passes GameState invariants", () => {
    const result = migrateFixtureToCurrentVersion(createV1BaselineFixture());
    expect(result.ok).toBe(true);
  });
});
