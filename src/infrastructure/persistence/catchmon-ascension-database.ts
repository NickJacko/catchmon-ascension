/**
 * Design owner: 14 Technical Architecture — §137 Persistence Technology
 * (Dexie/IndexedDB, not localStorage), §140 Save Repository Port, §145-146
 * Crash Resilience / Backup Rotation.
 *
 * One `saves` table (current snapshot) + one `saveBackups` table (the
 * single previous known-good snapshot per save, per §146's "simple
 * rolling strategy... more elaborate history is not required initially").
 * No `preferences` table: Document 15 Task 02.1 says "preferences only if
 * needed," and no preference-persistence feature has been requested yet.
 * Document 14 §137 explicitly forbids splitting canonical state across
 * multiple domain-specific tables — the full `GameState` is stored as one
 * envelope value per row, not decomposed.
 *
 * Renamed from Catchmon Shop's `CatchmonShopDatabase` during the R0
 * rebuild clone (docs/rebuild/15 Phase R0, docs/rebuild/14 §9 Save
 * Isolation) — a Catchmon Ascension database must never share a name with
 * a Catchmon Shop one, so it can never accidentally open/overwrite a Shop
 * save. The caller supplies the database name (see `app/boot.ts`).
 */
import Dexie, { type Table } from "dexie";
import { type SaveEnvelope } from "./save-envelope.ts";

export type SaveRow = SaveEnvelope;
export type SaveBackupRow = SaveEnvelope;

export class CatchmonAscensionDatabase extends Dexie {
  readonly saves!: Table<SaveRow, string>;
  readonly saveBackups!: Table<SaveBackupRow, string>;

  constructor(name: string) {
    super(name);
    this.version(1).stores({
      saves: "saveId",
      saveBackups: "saveId",
    });
  }
}
