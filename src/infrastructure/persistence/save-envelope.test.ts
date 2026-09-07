// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toSeed } from "../../core/random/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../../domain/catalog/index.ts";
import { createInitialGameState } from "../../domain/game-state/index.ts";
import {
  APP_VERSION,
  saveEnvelopeSchema,
  type SaveEnvelope,
} from "./save-envelope.ts";

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

function validEnvelope(): SaveEnvelope {
  const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
  const state = createInitialGameState(catalog, new FakeClock(1000), toSeed(1));
  return {
    saveId: state.meta.saveId,
    schemaVersion: state.meta.schemaVersion,
    appVersion: APP_VERSION,
    contentVersion: state.meta.contentVersion,
    revision: state.meta.revision,
    savedAtMs: 1000,
    gameState: state,
  };
}

describe("saveEnvelopeSchema", () => {
  it("accepts a valid envelope built from createInitialGameState", () => {
    const result = saveEnvelopeSchema.safeParse(validEnvelope());
    expect(result.success).toBe(true);
  });

  it("rejects a missing saveId", () => {
    const envelope: Record<string, unknown> = { ...validEnvelope() };
    delete envelope.saveId;
    expect(saveEnvelopeSchema.safeParse(envelope).success).toBe(false);
  });

  it("rejects a non-numeric revision", () => {
    const envelope = { ...validEnvelope(), revision: "not-a-number" };
    expect(saveEnvelopeSchema.safeParse(envelope).success).toBe(false);
  });

  it("rejects a negative schemaVersion", () => {
    const envelope = { ...validEnvelope(), schemaVersion: -1 };
    expect(saveEnvelopeSchema.safeParse(envelope).success).toBe(false);
  });

  it("rejects a gameState missing its meta sub-object", () => {
    const envelope = validEnvelope();
    const corrupted = {
      ...envelope,
      gameState: { ...envelope.gameState, meta: undefined },
    };
    expect(saveEnvelopeSchema.safeParse(corrupted).success).toBe(false);
  });

  it("rejects a gameState.meta with a malformed field", () => {
    const envelope = validEnvelope();
    const corrupted = {
      ...envelope,
      gameState: {
        ...envelope.gameState,
        meta: { ...envelope.gameState.meta, revision: -5 },
      },
    };
    expect(saveEnvelopeSchema.safeParse(corrupted).success).toBe(false);
  });

  it("rejects a gameState missing a top-level slice", () => {
    const envelope = validEnvelope();
    const corrupted: Record<string, unknown> = { ...envelope.gameState };
    delete corrupted.economy;
    expect(
      saveEnvelopeSchema.safeParse({ ...envelope, gameState: corrupted })
        .success,
    ).toBe(false);
  });
});
