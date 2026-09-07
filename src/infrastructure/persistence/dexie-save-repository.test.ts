// @vitest-environment node
import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { toSeed } from "../../core/random/index.ts";
import { SaveId } from "../../core/ids/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import { type StoredSave } from "../../application/engine/index.ts";
import { CatchmonAscensionDatabase } from "./catchmon-ascension-database.ts";
import { createDexieSaveRepository } from "./dexie-save-repository.ts";
import { type SaveEnvelope } from "./save-envelope.ts";

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

function makeState(seed: number, clockMs: number): GameState {
  const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
  return createInitialGameState(catalog, new FakeClock(clockMs), toSeed(seed));
}

function snapshotOf(
  state: GameState,
  revision: number,
  savedAtMs: number,
): StoredSave<GameState> {
  return {
    saveId: state.meta.saveId,
    schemaVersion: state.meta.schemaVersion,
    revision,
    savedAtMs: toTimestampMs(savedAtMs),
    state: { ...state, meta: { ...state.meta, revision } },
  };
}

let dbCounter = 0;

function freshDatabase(): CatchmonAscensionDatabase {
  dbCounter += 1;
  return new CatchmonAscensionDatabase(
    `test-catchmon-ascension-${String(dbCounter)}`,
  );
}

describe("DexieSaveRepository", () => {
  let db: CatchmonAscensionDatabase;

  beforeEach(() => {
    db = freshDatabase();
  });

  it("round-trips a committed save through load()", async () => {
    const repository = createDexieSaveRepository(db);
    const state = makeState(1, 1000);
    const snapshot = snapshotOf(state, 1, 1000);

    await repository.commit(snapshot);
    const loaded = await repository.load(state.meta.saveId);

    expect(loaded).toEqual(snapshot);
  });

  it("returns null for a saveId that was never committed", async () => {
    const repository = createDexieSaveRepository(db);
    const loaded = await repository.load(SaveId.from("never-saved"));
    expect(loaded).toBeNull();
  });

  it("rejects a stale write: an older revision does not overwrite a newer one (Document 14 §142)", async () => {
    const repository = createDexieSaveRepository(db);
    const state = makeState(2, 1000);
    const newer = snapshotOf(state, 5, 5000);
    const stale = snapshotOf(state, 3, 3000);

    await repository.commit(newer);
    await repository.commit(stale);

    const loaded = await repository.load(state.meta.saveId);
    expect(loaded).toEqual(newer);
  });

  it("accepts a re-commit at the *same* revision (not a stale write — e.g. boot.ts's post-reconciliation safety commit, which runs before any command has bumped revision past what was just loaded)", async () => {
    const repository = createDexieSaveRepository(db);
    const state = makeState(6, 1000);
    const first = snapshotOf(state, 4, 1000);
    const reconciledAtSameRevision = snapshotOf(state, 4, 2000);

    await repository.commit(first);
    await repository.commit(reconciledAtSameRevision);

    const loaded = await repository.load(state.meta.saveId);
    expect(loaded).toEqual(reconciledAtSameRevision);
  });

  it("accepts a strictly newer revision after an earlier commit", async () => {
    const repository = createDexieSaveRepository(db);
    const state = makeState(3, 1000);
    const first = snapshotOf(state, 1, 1000);
    const second = snapshotOf(state, 2, 2000);

    await repository.commit(first);
    await repository.commit(second);

    const loaded = await repository.load(state.meta.saveId);
    expect(loaded).toEqual(second);
  });

  it("falls back to the backup when the current row is corrupted (Document 14 §145)", async () => {
    const repository = createDexieSaveRepository(db);
    const state = makeState(4, 1000);
    const goodSnapshot = snapshotOf(state, 1, 1000);

    await repository.createBackup(goodSnapshot);
    // Simulate corruption of the "current" row directly at the storage
    // layer — something no code path through the repository would ever
    // write, e.g. a missing meta sub-object.
    const corrupted = {
      saveId: state.meta.saveId,
      schemaVersion: 1,
      appVersion: "0.0.0-vertical-slice",
      contentVersion: 1,
      revision: 1,
      savedAtMs: 1000,
      gameState: { notAValidGameState: true },
    } as unknown as SaveEnvelope;
    await db.saves.put(corrupted);

    const loaded = await repository.load(state.meta.saveId);
    expect(loaded).toEqual(goodSnapshot);
  });

  it("returns null when both the current row and the backup are corrupted or absent", async () => {
    const repository = createDexieSaveRepository(db);
    const saveId = SaveId.from("only-corrupted");
    const corrupted = {
      saveId,
      schemaVersion: 1,
      appVersion: "0.0.0-vertical-slice",
      contentVersion: 1,
      revision: 1,
      savedAtMs: 1000,
      gameState: { notAValidGameState: true },
    } as unknown as SaveEnvelope;
    await db.saves.put(corrupted);

    const loaded = await repository.load(saveId);
    expect(loaded).toBeNull();
  });
});
