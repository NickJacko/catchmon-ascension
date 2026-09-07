/**
 * Design owner: Document 15 Task 08.1 (Application Providers / Stores);
 * Document 14 §200 App Boot Sequence, §201 Content Boot Before Save, §202
 * New Save Creation, §203 Default Content Boundary.
 *
 * The one App Boot Sequence this vertical slice needs. Follows §200's
 * numbered steps (a "session lease" step is not implemented — a genuine,
 * documented simplification: multi-tab coordination is out of scope for a
 * single-player vertical slice with no concurrent-tab requirement stated
 * anywhere in the read design docs; inventing a lease protocol here would
 * be exactly the kind of undefined-mechanic invention CLAUDE.md forbids).
 *
 * `createInitialGameState(catalog, clock, randomSeed)` remains the one
 * canonical new-save factory (§202) — this module never builds `GameState`
 * fields itself, only decides *when* to call that factory vs. load an
 * existing save.
 */
import { GameEngine } from "../application/engine/index.ts";
import { reconcileGameState } from "../application/reconciliation/index.ts";
import {
  createGameCatalog,
  type GameCatalog,
} from "../domain/catalog/index.ts";
import {
  createInitialGameState,
  validateGameState,
  GAME_STATE_SCHEMA_VERSION,
  type GameState,
} from "../domain/game-state/index.ts";
import { SaveId } from "../core/ids/index.ts";
import { toSeed } from "../core/random/index.ts";
import { type Clock } from "../core/time/index.ts";
import { createSystemClock } from "../infrastructure/platform/index.ts";
import {
  APP_VERSION,
  CatchmonAscensionDatabase,
  createDexieSaveRepository,
  runMigrations,
  type SaveEnvelope,
} from "../infrastructure/persistence/index.ts";
import { applyStarterInventory } from "../content/vertical-slice/index.ts";
import { ASCENSION_CATALOG_CONTENT } from "./ascension-catalog-content.ts";
import { buildGameConfig, type GameConfig } from "./game-config.ts";
import { registerAllCommands } from "./register-commands.ts";
import { buildReconciliationPasses } from "./reconciliation-passes.ts";
import { type AppGameEvent } from "./game-events.ts";

/** One fixed save slot — this slice never offers multiple save files (Document 14 §203 default-content boundary; no save-picker exists).
 *
 * Renamed from Shop's `catchshop-vertical-slice` during the R0 rebuild
 * clone (docs/rebuild/14 §9 Save Isolation) so this save id can never
 * collide with a Catchmon Shop save. */
export const SLICE_SAVE_ID: SaveId = SaveId.from(
  "catchmon-ascension-vertical-slice",
);

export interface BootResult {
  readonly engine: GameEngine<GameState, AppGameEvent>;
  readonly catalog: GameCatalog;
  readonly config: GameConfig;
  readonly clock: Clock;
}

function generateRootSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0]!;
}

interface LoadedOrCreatedState {
  readonly state: GameState;
  /** The revision already reflected by `state` — `0` for a brand-new save, otherwise the loaded save's real persisted revision. See `GameEngineOptions.initialRevision`'s doc comment for why this must not just default to `0`. */
  readonly revision: number;
}

async function loadOrCreateState(
  saveRepository: ReturnType<typeof createDexieSaveRepository>,
  catalog: GameCatalog,
  clock: Clock,
): Promise<LoadedOrCreatedState> {
  const existing = await saveRepository.load(SLICE_SAVE_ID);
  if (!existing) {
    const fresh = createInitialGameState(
      catalog,
      clock,
      toSeed(generateRootSeed()),
    );
    // Phase 8 exit-gate fix: a brand-new save otherwise has 0 Coins/
    // materials and no way to bootstrap the shop loop — see
    // `content/vertical-slice/starterPackage.ts`. Never applied to an
    // existing/loaded save (only this branch).
    return { state: applyStarterInventory(fresh, catalog), revision: 0 };
  }

  const envelope: SaveEnvelope = {
    saveId: existing.saveId,
    schemaVersion: existing.schemaVersion,
    appVersion: APP_VERSION,
    contentVersion: existing.state.meta.contentVersion,
    revision: existing.revision,
    savedAtMs: existing.savedAtMs,
    gameState: existing.state,
  };
  const migrated = runMigrations(envelope, GAME_STATE_SCHEMA_VERSION);
  if (!migrated.ok) {
    // Document 14 §201: content/save integrity failing in development
    // means stop boot, not silently fabricate a fresh game over a
    // player's real corrupted save.
    throw new Error(
      `Save migration failed for "${SLICE_SAVE_ID}": ${JSON.stringify(migrated.error)}`,
    );
  }
  const validation = validateGameState(migrated.value.gameState);
  if (!validation.ok) {
    throw new Error(
      `Save validation failed for "${SLICE_SAVE_ID}": ${JSON.stringify(validation.error)}`,
    );
  }
  return { state: migrated.value.gameState, revision: migrated.value.revision };
}

/** Runs the full App Boot Sequence (Document 14 §200) and returns a ready-to-use `GameEngine`. */
export async function bootGame(): Promise<BootResult> {
  // 1. platform services
  const clock = createSystemClock();

  // 2. content registries
  const catalog = createGameCatalog(ASCENSION_CATALOG_CONTENT);
  const config = buildGameConfig(catalog);

  // 3. save repository
  //
  // "catchmon-ascension" is a distinct IndexedDB database name from Shop's
  // "catchmon-shop" (docs/rebuild/14 §9 Save Isolation, R0) — this app can
  // never accidentally open or overwrite a Catchmon Shop save.
  const db = new CatchmonAscensionDatabase("catchmon-ascension");
  const saveRepository = createDexieSaveRepository(db);

  // 4-7. load/migrate/validate, or create new
  const loaded = await loadOrCreateState(saveRepository, catalog, clock);
  let state = loaded.state;

  // 8. reconcile to current time
  const now = clock.nowMs();
  const reconciled = reconcileGameState(
    state,
    now,
    catalog,
    buildReconciliationPasses(config),
  );
  state = reconciled.nextState;

  // 9. initialize Game Engine
  const engine = new GameEngine<GameState, AppGameEvent>(state, {
    saveId: SLICE_SAVE_ID,
    schemaVersion: GAME_STATE_SCHEMA_VERSION,
    saveRepository,
    clock,
    initialRevision: loaded.revision,
  });
  registerAllCommands(engine, catalog, config);

  // 12. background-persist the reconciled state immediately, so an
  // offline-time jump is never lost if the player closes before their
  // first command.
  await saveRepository.commit({
    saveId: SLICE_SAVE_ID,
    schemaVersion: GAME_STATE_SCHEMA_VERSION,
    revision: engine.getRevision(),
    savedAtMs: now,
    state,
  });

  return { engine, catalog, config, clock };
}
