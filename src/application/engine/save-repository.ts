/**
 * Design owner: 14 Technical Architecture — §140 Save Repository Port.
 *
 * `SaveRepository` is the port; `createInMemorySaveRepository` is the one
 * concrete implementation this task provides. It is a genuine (if
 * non-durable) adapter — not a test-only fake — because Phase 2 (Document
 * 15 §32) is where real Dexie/IndexedDB persistence is introduced; until
 * then the command engine needs *something* satisfying this port to
 * exercise "schedule persistence" (§46 step 6) without pulling forward
 * Phase-2 infrastructure work.
 */
import { type SaveId } from "../../core/ids/index.ts";
import { type TimestampMs } from "../../core/time/index.ts";

/** Document 14 §141 Save Envelope, v1 subset actually needed by this port. */
export interface StoredSave<TState> {
  readonly saveId: SaveId;
  readonly schemaVersion: number;
  readonly revision: number;
  readonly savedAtMs: TimestampMs;
  readonly state: TState;
}

/** Document 14 §140. */
export interface SaveRepository<TState> {
  load(saveId: SaveId): Promise<StoredSave<TState> | null>;
  commit(snapshot: StoredSave<TState>): Promise<void>;
  createBackup(snapshot: StoredSave<TState>): Promise<void>;
}

export function createInMemorySaveRepository<TState>(): SaveRepository<TState> {
  const committed = new Map<SaveId, StoredSave<TState>>();
  const backups = new Map<SaveId, StoredSave<TState>[]>();

  return {
    load(saveId) {
      return Promise.resolve(committed.get(saveId) ?? null);
    },
    commit(snapshot) {
      committed.set(snapshot.saveId, snapshot);
      return Promise.resolve();
    },
    createBackup(snapshot) {
      const existing = backups.get(snapshot.saveId) ?? [];
      backups.set(snapshot.saveId, [...existing, snapshot]);
      return Promise.resolve();
    },
  };
}
