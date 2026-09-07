// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InfrastructureId } from "../../core/ids/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../catalog/index.ts";
import { createInitialGameState, type GameState } from "../game-state/index.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "../../content/vertical-slice/index.ts";
import { deriveShopMacroStage } from "./shop-macro-stage.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);

describe("deriveShopMacroStage", () => {
  it("is STARTER at game start (no infrastructure owned)", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    expect(deriveShopMacroStage(state)).toBe("STARTER");
  });

  it("is EXPANDED once at least one infrastructure is owned", () => {
    const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const state: GameState = {
      ...base,
      infrastructure: {
        ...base.infrastructure,
        ownedInfrastructureIds: [InfrastructureId.from("any-infrastructure")],
      },
    };
    expect(deriveShopMacroStage(state)).toBe("EXPANDED");
  });
});
