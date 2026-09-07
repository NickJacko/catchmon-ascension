/**
 * Design owner: 14 Technical Architecture — §141 Save Envelope, §147 Save
 * Validation (step 2: validate outer schema).
 *
 * The on-disk envelope is a superset of the generic `StoredSave<GameState>`
 * port shape from application/engine — it adds `appVersion` (which build
 * produced this save) alongside fields that already exist inside
 * `gameState.meta` (`schemaVersion`, `contentVersion`, `revision`,
 * `saveId`). That duplication is deliberate, not a Single-Source-of-Truth
 * violation (CLAUDE.md §14): the envelope's own `schemaVersion` must be
 * readable *before* trusting `gameState`'s internal shape at all, since an
 * older save's `meta` may predate the current `GameStateMeta` interface —
 * this is exactly what makes picking a migration function possible
 * (Document 14 §147 step 3 runs before step 4's deep state validation).
 *
 * Zod here validates the envelope's own fields plus the presence/shape of
 * `gameState.meta` (small, load-bearing, and needed for migration
 * dispatch). The rest of `gameState`'s slices are checked only for "is a
 * plain object" — a full duplicate Zod schema tree mirroring all 11
 * domain slice interfaces is not built here; TypeScript already owns that
 * shape at write time, and `validateGameState` (Task 01.8) owns runtime
 * invariant checking after migration (Document 14 §147 step 5).
 */
import { z } from "zod";
import { type GameState } from "../../domain/game-state/index.ts";

/**
 * PROVISIONAL: no build-time version-injection mechanism exists yet (Vite
 * is not configured to read package.json's version). Wiring one up is a
 * tooling decision outside this task's scope.
 */
export const APP_VERSION = "0.0.0-vertical-slice";

export interface SaveEnvelope {
  readonly saveId: string;
  readonly schemaVersion: number;
  readonly appVersion: string;
  readonly contentVersion: number;
  readonly revision: number;
  readonly savedAtMs: number;
  readonly gameState: GameState;
}

const gameStateMetaShapeSchema = z.object({
  saveId: z.string().min(1),
  schemaVersion: z.number().int().positive(),
  createdAtMs: z.number().int().nonnegative(),
  updatedAtMs: z.number().int().nonnegative(),
  lastActiveAtMs: z.number().int().nonnegative(),
  revision: z.number().int().nonnegative(),
  rootRandomSeed: z.number().int().nonnegative(),
  randomEventCounter: z.number().int().nonnegative(),
  contentVersion: z.number().int().positive(),
});

const gameStateShapeSchema = z.object({
  meta: gameStateMetaShapeSchema,
  economy: z.record(z.string(), z.unknown()),
  inventory: z.record(z.string(), z.unknown()),
  shop: z.record(z.string(), z.unknown()),
  crafting: z.record(z.string(), z.unknown()),
  customers: z.record(z.string(), z.unknown()),
  orders: z.record(z.string(), z.unknown()),
  catchmons: z.record(z.string(), z.unknown()),
  expeditions: z.record(z.string(), z.unknown()),
  world: z.record(z.string(), z.unknown()),
  progression: z.record(z.string(), z.unknown()),
  infrastructure: z.record(z.string(), z.unknown()),
  // docs/rebuild/15 Phases R2-R5 (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.5:
  // this schema's field list must be updated in the same change as any
  // GameState top-level slice addition/rename/removal).
  journey: z.record(z.string(), z.unknown()),
  loadout: z.record(z.string(), z.unknown()),
  forge: z.record(z.string(), z.unknown()),
  relicInventory: z.record(z.string(), z.unknown()),
  skills: z.record(z.string(), z.unknown()),
});

/** Document 14 §141/§147 step 2: the outer, on-disk envelope shape. */
export const saveEnvelopeSchema = z.object({
  saveId: z.string().min(1),
  schemaVersion: z.number().int().positive(),
  appVersion: z.string().min(1),
  contentVersion: z.number().int().positive(),
  revision: z.number().int().nonnegative(),
  savedAtMs: z.number().int().nonnegative(),
  gameState: gameStateShapeSchema,
});
