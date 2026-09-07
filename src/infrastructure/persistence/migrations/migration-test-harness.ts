/**
 * Design owner: 14 Technical Architecture — §150 Save Fixtures, §147 Save
 * Validation step 4-5 (validate migrated state, run invariant checks).
 *
 * The reusable check every fixture test (this v1 one, and any future v2,
 * v3, ... fixture) runs: migrate to the target version, then confirm the
 * result actually satisfies `validateGameState`'s invariants — not just
 * "the migration function didn't throw." Kept here, not duplicated per
 * fixture test file (Document 15 Task 02.3: "migration test harness").
 */
import { err, ok, type Result } from "../../../core/result/index.ts";
import { validateGameState } from "../../../domain/game-state/index.ts";
import { type SaveEnvelope } from "../save-envelope.ts";
import { runMigrations, type MigrationError } from "./migration-pipeline.ts";

export type MigrationFixtureCheckFailure =
  | { readonly stage: "MIGRATION"; readonly detail: MigrationError }
  | { readonly stage: "INVARIANTS"; readonly detail: readonly string[] };

export function migrateFixtureToCurrentVersion(
  fixture: SaveEnvelope,
  targetVersion?: number,
): Result<SaveEnvelope, MigrationFixtureCheckFailure> {
  const migrated = runMigrations(fixture, targetVersion);
  if (!migrated.ok) {
    return err({ stage: "MIGRATION", detail: migrated.error });
  }

  const invariants = validateGameState(migrated.value.gameState);
  if (!invariants.ok) {
    return err({ stage: "INVARIANTS", detail: invariants.error });
  }

  return ok(migrated.value);
}
