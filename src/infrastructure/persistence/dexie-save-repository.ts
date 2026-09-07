/**
 * Design owner: 14 Technical Architecture — §140 Save Repository Port,
 * §142 Save Revision (stale-write rejection), §145-146 Crash Resilience /
 * Backup Rotation, §147 Save Validation.
 *
 * Implements the generic `SaveRepository<GameState>` port from
 * application/engine (Task 01.9) — that port's shape is unchanged by this
 * task. Internally this adapter stores a richer `SaveEnvelope` (adding
 * `appVersion`) and Zod-validates it on load; the extra envelope fields
 * are not part of the port's return value, since `contentVersion` already
 * lives in `state.meta` and `appVersion` is a persistence-format concern
 * the generic command engine has no reason to see.
 */
import {
  type SaveRepository,
  type StoredSave,
} from "../../application/engine/index.ts";
import { SaveId } from "../../core/ids/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { type GameState } from "../../domain/game-state/index.ts";
import { type CatchmonAscensionDatabase } from "./catchmon-ascension-database.ts";
import {
  APP_VERSION,
  saveEnvelopeSchema,
  type SaveEnvelope,
} from "./save-envelope.ts";

function toEnvelope(snapshot: StoredSave<GameState>): SaveEnvelope {
  return {
    saveId: snapshot.saveId,
    schemaVersion: snapshot.schemaVersion,
    appVersion: APP_VERSION,
    contentVersion: snapshot.state.meta.contentVersion,
    revision: snapshot.revision,
    savedAtMs: snapshot.savedAtMs,
    gameState: snapshot.state,
  };
}

function toStoredSave(envelope: SaveEnvelope): StoredSave<GameState> {
  return {
    saveId: SaveId.from(envelope.saveId),
    schemaVersion: envelope.schemaVersion,
    revision: envelope.revision,
    savedAtMs: toTimestampMs(envelope.savedAtMs),
    state: envelope.gameState,
  };
}

/**
 * Reads one row and returns a validated `SaveEnvelope`, or `null` if the
 * row is absent or fails Zod validation (Document 14 §147 step 2) —
 * "corrupted" and "missing" are treated identically by `load()`'s
 * backup-fallback logic below.
 */
async function readValidEnvelope(
  table: { get(key: string): Promise<SaveEnvelope | undefined> },
  saveId: string,
): Promise<SaveEnvelope | null> {
  const row = await table.get(saveId);
  if (row === undefined) {
    return null;
  }
  const parsed = saveEnvelopeSchema.safeParse(row);
  // The Zod schema validates structural shape only (see save-envelope.ts's
  // header); the branded domain types it can't express (SaveId, Seed, ...)
  // are trusted once the shape checks pass, matching the `unsafeBrand`
  // boundary pattern in core/ids/brand.ts.
  return parsed.success ? (parsed.data as unknown as SaveEnvelope) : null;
}

export function createDexieSaveRepository(
  db: CatchmonAscensionDatabase,
): SaveRepository<GameState> {
  return {
    async load(saveId): Promise<StoredSave<GameState> | null> {
      const current = await readValidEnvelope(db.saves, saveId);
      if (current) {
        return toStoredSave(current);
      }
      // Document 14 §145: a corrupted/missing current snapshot falls back
      // to the previous known-good backup.
      const backup = await readValidEnvelope(db.saveBackups, saveId);
      return backup ? toStoredSave(backup) : null;
    },

    async commit(snapshot): Promise<void> {
      const existing = await db.saves.get(snapshot.saveId);
      if (existing && existing.revision > snapshot.revision) {
        // Document 14 §142: never let a stale async write overwrite a
        // newer committed revision. Silently no-op rather than throwing —
        // the caller already has the newer state in memory; this is a
        // defense-in-depth guard against out-of-order persistence, not a
        // user-facing failure. Strictly greater-than, not `>=`: a write at
        // the *same* revision is a legitimate re-persist (e.g. `boot.ts`'s
        // post-reconciliation safety commit, which runs before any command
        // has bumped the engine's revision past what was just loaded) —
        // rejecting it as "stale" would silently drop reconciled offline
        // progress if the player closed the tab before their first command.
        return;
      }
      if (existing) {
        // Document 14 §145-146: rotate the outgoing current snapshot into
        // the backup slot before it's overwritten, so a future corrupted
        // write still has one known-good snapshot to fall back to (the
        // `load()` fallback above was previously unreachable in the real
        // app — nothing ever populated `saveBackups`). Only rotate a
        // snapshot that itself passes validation; never let a corrupt
        // outgoing row overwrite a still-good backup.
        const validExisting = saveEnvelopeSchema.safeParse(existing);
        if (validExisting.success) {
          await db.saveBackups.put(
            validExisting.data as unknown as SaveEnvelope,
          );
        }
      }
      await db.saves.put(toEnvelope(snapshot));
    },

    async createBackup(snapshot): Promise<void> {
      await db.saveBackups.put(toEnvelope(snapshot));
    },
  };
}
