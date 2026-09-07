// @vitest-environment node
import { describe, expect, it } from "vitest";
import { toSeed } from "../../core/random/index.ts";
import { RegionId, UnlockRuleId } from "../../core/ids/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../catalog/index.ts";
import { type RegionDefinition } from "../world/index.ts";
import {
  createInitialGameState,
  validateGameState,
  type GameState,
} from "./game-state.ts";

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

describe("createInitialGameState", () => {
  it("produces a valid, fully-empty new-game state", () => {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
    const clock = new FakeClock(1_000_000);
    const state = createInitialGameState(catalog, clock, toSeed(42));

    expect(state.meta.revision).toBe(0);
    expect(state.meta.rootRandomSeed).toBe(42);
    expect(state.meta.createdAtMs).toBe(1_000_000);
    expect(state.meta.updatedAtMs).toBe(1_000_000);
    expect(state.economy.coins).toBe(0);
    expect(state.catchmons.ownedCatchmonIds).toEqual([]);
    expect(state.world.unlockedRegionIds).toEqual([]);
  });

  it("does not hardcode any starter Catchmon/region/product content", () => {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));

    expect(Object.keys(state.catchmons.ownedCatchmons)).toHaveLength(0);
    expect(Object.keys(state.inventory.stacks)).toHaveLength(0);
    expect(Object.keys(state.crafting.stations)).toHaveLength(0);
  });

  it("derives a deterministic saveId from the root seed (same seed -> same saveId)", () => {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
    const a = createInitialGameState(catalog, new FakeClock(0), toSeed(7));
    const b = createInitialGameState(catalog, new FakeClock(999), toSeed(7));
    expect(a.meta.saveId).toBe(b.meta.saveId);
  });

  it("passes its own invariant validator", () => {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    expect(validateGameState(state)).toEqual({ ok: true, value: true });
  });

  it("survives a JSON round-trip with no data loss (Phase 1 Exit Gate: GameState serializes)", () => {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
    const state = createInitialGameState(
      catalog,
      new FakeClock(1_000_000),
      toSeed(42),
    );
    const roundTripped: GameState = JSON.parse(JSON.stringify(state));
    expect(roundTripped).toEqual(state);
    expect(validateGameState(roundTripped)).toEqual({ ok: true, value: true });
  });

  describe("region unlock evaluation (Ozean Batch A)", () => {
    const minimalRegion = (
      regionId: string,
      unlockRuleId: string,
    ): RegionDefinition => ({
      regionId: RegionId.from(regionId),
      displayName: regionId,
      elementId: "fire",
      progressionBand: "test-band",
      economicIdentityId: "test-economic-identity",
      resourceProfileId: "test-resource-profile",
      productEmphasis: [],
      customerDemandProfileId: "test-demand-profile",
      expeditionProfileId: "test-expedition-profile",
      regionalHookId: "test-regional-hook",
      homeCatchmonLineIds: [],
      secondaryCatchmonLineIds: [],
      routeIds: [],
      recipeIds: [],
      unlockRuleId: UnlockRuleId.from(unlockRuleId),
      visualThemeId: "test-visual-theme",
    });

    it("only unlocks a region at creation whose own unlock rule is already satisfied — not every catalog region unconditionally", () => {
      const content: GameCatalogContent = {
        ...EMPTY_CATALOG_CONTENT,
        regions: [
          minimalRegion("always-region", "always-rule"),
          minimalRegion("never-region", "never-rule"),
        ],
        unlockRules: [
          {
            unlockRuleId: UnlockRuleId.from("always-rule"),
            displayName: "Always",
            primaryCondition: { type: "SHOP_RANK", threshold: 1 },
          },
          {
            unlockRuleId: UnlockRuleId.from("never-rule"),
            displayName: "Never (rank starts at 1)",
            primaryCondition: { type: "SHOP_RANK", threshold: 999 },
          },
        ],
      };
      const catalog = createGameCatalog(content);
      const state = createInitialGameState(
        catalog,
        new FakeClock(0),
        toSeed(1),
      );
      expect(state.world.unlockedRegionIds).toEqual([
        RegionId.from("always-region"),
      ]);
    });
  });
});

describe("validateGameState", () => {
  function baseState(): GameState {
    const catalog = createGameCatalog(EMPTY_CATALOG_CONTENT);
    return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  }

  it("rejects a negative revision", () => {
    const state: GameState = {
      ...baseState(),
      meta: { ...baseState().meta, revision: -1 },
    };
    const result = validateGameState(state);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.some((message) => message.includes("revision"))).toBe(
        true,
      );
    }
  });

  it("rejects an over-reserved inventory item (Document 14 §77)", () => {
    const state: GameState = {
      ...baseState(),
      inventory: {
        stacks: { "item-1": { itemId: "item-1", quantity: 5 } } as never,
        reservations: {
          "reservation-1": {
            reservationId: "reservation-1",
            ownerType: "MANUAL",
            ownerId: "test",
            items: [{ itemId: "item-1", quantity: 10 }],
            createdAtMs: 0,
          },
        } as never,
      },
    };
    const result = validateGameState(state);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.error.some((message) => message.includes("over-reserved")),
      ).toBe(true);
    }
  });

  it("accepts a fully-reserved item (reserved === total is not a violation)", () => {
    const state: GameState = {
      ...baseState(),
      inventory: {
        stacks: { "item-1": { itemId: "item-1", quantity: 10 } } as never,
        reservations: {
          "reservation-1": {
            reservationId: "reservation-1",
            ownerType: "MANUAL",
            ownerId: "test",
            items: [{ itemId: "item-1", quantity: 10 }],
            createdAtMs: 0,
          },
        } as never,
      },
    };
    expect(validateGameState(state)).toEqual({ ok: true, value: true });
  });

  it("rejects an active Catchmon ID with no matching owned-Catchmon entry", () => {
    const state: GameState = {
      ...baseState(),
      catchmons: {
        ownedCatchmonIds: ["missing-catchmon"] as never,
        ownedCatchmons: {},
      },
    };
    const result = validateGameState(state);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.error.some((message) => message.includes("missing-catchmon")),
      ).toBe(true);
    }
  });
});
