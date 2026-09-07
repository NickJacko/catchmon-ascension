/**
 * Design owner: 14 Technical Architecture — §148 Save Migrations, §149
 * Migration Rules.
 *
 * Sequential migration framework: each `Migration` moves an envelope from
 * exactly one schema version to the next (`fromVersion -> fromVersion+1`,
 * per §148's `v1 -> v2 -> v3` shape) — never one giant "guess old save
 * shape" function. Only v1 exists today (Document 15 Task 02.3: "Even if
 * only v1 exists now, structure must exist before durable expansion"),
 * so `MIGRATIONS` is empty; `runMigrations` degenerates to an identity
 * pass-through for an envelope already at the target version, or a safe,
 * typed rejection otherwise (§149: "fail safely if impossible").
 */
import { err, ok, type Result } from "../../../core/result/index.ts";
import { GAME_STATE_SCHEMA_VERSION } from "../../../domain/game-state/index.ts";
import { type SaveEnvelope } from "../save-envelope.ts";

export interface Migration {
  readonly fromVersion: number;
  readonly toVersion: number;
  readonly migrate: (envelope: SaveEnvelope) => SaveEnvelope;
}

/** Registered in ascending `fromVersion` order. Empty until a v2 shape exists. */
export const MIGRATIONS: readonly Migration[] = [];

export type MigrationError =
  | {
      readonly code: "SAVE_FROM_NEWER_VERSION";
      readonly foundVersion: number;
      readonly targetVersion: number;
    }
  | {
      readonly code: "NO_MIGRATION_PATH";
      readonly fromVersion: number;
      readonly targetVersion: number;
    };

/**
 * Runs `envelope` through the registered migration chain until it reaches
 * `targetVersion` (defaulting to the current `GAME_STATE_SCHEMA_VERSION`).
 * Deterministic, no I/O, no React/UI state (Document 14 §149).
 */
export function runMigrations(
  envelope: SaveEnvelope,
  targetVersion: number = GAME_STATE_SCHEMA_VERSION,
): Result<SaveEnvelope, MigrationError> {
  if (envelope.schemaVersion > targetVersion) {
    return err({
      code: "SAVE_FROM_NEWER_VERSION",
      foundVersion: envelope.schemaVersion,
      targetVersion,
    });
  }

  let current = envelope;
  while (current.schemaVersion < targetVersion) {
    const step = MIGRATIONS.find(
      (migration) => migration.fromVersion === current.schemaVersion,
    );
    if (!step) {
      return err({
        code: "NO_MIGRATION_PATH",
        fromVersion: current.schemaVersion,
        targetVersion,
      });
    }
    current = step.migrate(current);
  }

  return ok(current);
}
