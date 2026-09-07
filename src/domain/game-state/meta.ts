/**
 * Design owner: 14 Technical Architecture — §39 Game State Meta.
 */
import { type RandomEventCounter, type Seed } from "../../core/random/index.ts";
import { type SaveId } from "../../core/ids/index.ts";
import { type TimestampMs } from "../../core/time/index.ts";

/** The current GameState schema version (Document 14 §39, §148 Save Migrations). */
export const GAME_STATE_SCHEMA_VERSION = 1;

/** The current canonical content version this GameState was built against (Document 14 §107). */
export const INITIAL_CONTENT_VERSION = 1;

export interface GameStateMeta {
  readonly saveId: SaveId;
  readonly schemaVersion: number;
  readonly createdAtMs: TimestampMs;
  readonly updatedAtMs: TimestampMs;
  readonly lastActiveAtMs: TimestampMs;
  readonly revision: number;
  readonly rootRandomSeed: Seed;
  readonly randomEventCounter: RandomEventCounter;
  readonly contentVersion: number;
}
