// @vitest-environment node
//
// Document 15 §31/§39: Phase 1's exit gate proved the pieces in
// isolation; this proves the whole Phase 2 pipeline end-to-end:
//   create save -> persist -> reload -> validate -> reconcile
//   -> expose identical logical state
// with no React dependency in the save/reconciliation engine.
import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import reconcileEngineSource from "../../application/reconciliation/reconcile-game-state.ts?raw";
import dexieRepositorySource from "./dexie-save-repository.ts?raw";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  validateGameState,
  GAME_STATE_SCHEMA_VERSION,
} from "../../domain/game-state/index.ts";
import { reconcileGameState } from "../../application/reconciliation/index.ts";
import { CatchmonAscensionDatabase } from "./catchmon-ascension-database.ts";
import { createDexieSaveRepository } from "./dexie-save-repository.ts";
import { runMigrations } from "./migrations/migration-pipeline.ts";
import { APP_VERSION, type SaveEnvelope } from "./save-envelope.ts";

const EMPTY_CATALOG_CONTENT: GameCatalogContent = {
  products: [],
  recipes: [],
  resources: [],
  components: [],
  catchmonSpecies: [],
  catchmonLines: [],
  capabilities: [],
  elements: [],
  regions: [],
  routes: [],
  customerArchetypes: [],
  infrastructure: [],
  unlockRules: [],
  assets: [],
};

describe("Phase 2 Exit Gate", () => {
  it("create save -> persist -> reload -> validate -> reconcile -> identical logical state", async () => {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);

    // 1. create save
    const state = createInitialGameState(
      catalog,
      new FakeClock(1_000_000),
      toSeed(7),
    );

    // 2. persist
    const db = new CatchmonAscensionDatabase("phase-2-exit-gate");
    const repository = createDexieSaveRepository(db);
    await repository.commit({
      saveId: state.meta.saveId,
      schemaVersion: state.meta.schemaVersion,
      revision: state.meta.revision,
      savedAtMs: toTimestampMs(1_000_000),
      state,
    });

    // 3. reload
    const loaded = await repository.load(state.meta.saveId);
    if (!loaded) {
      throw new Error("expected a save to be found after commit");
    }

    // 4. validate (envelope-level migration dispatch, then GameState invariants)
    const envelope: SaveEnvelope = {
      saveId: loaded.saveId,
      schemaVersion: loaded.schemaVersion,
      appVersion: APP_VERSION,
      contentVersion: loaded.state.meta.contentVersion,
      revision: loaded.revision,
      savedAtMs: loaded.savedAtMs,
      gameState: loaded.state,
    };
    const migrated = runMigrations(envelope, GAME_STATE_SCHEMA_VERSION);
    if (!migrated.ok) {
      throw new Error(
        `expected migration to succeed, got: ${JSON.stringify(migrated.error)}`,
      );
    }
    expect(validateGameState(migrated.value.gameState)).toEqual({
      ok: true,
      value: true,
    });

    // 5. reconcile
    const now = toTimestampMs(1_050_000);
    const report = reconcileGameState(migrated.value.gameState, now, catalog);

    // 6. expose identical logical state — reconciliation legitimately
    // advances `meta.lastActiveAtMs` (Document 14 §117); nothing else
    // should differ from the originally created save.
    expect(report.nextState).toEqual({
      ...state,
      meta: { ...state.meta, lastActiveAtMs: now },
    });
  });

  it("has no React dependency in the reconciliation engine or the Dexie save repository", () => {
    expect(reconcileEngineSource).not.toMatch(/from ["']react/);
    expect(dexieRepositorySource).not.toMatch(/from ["']react/);
  });
});
