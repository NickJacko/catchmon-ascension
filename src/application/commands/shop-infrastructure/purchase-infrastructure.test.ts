// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId, InfrastructureId } from "../../../core/ids/index.ts";
import { toCoins } from "../../../core/math/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { creditCoins } from "../../../domain/economy/index.ts";
import {
  DISPLAY_EXPANSION_INFRASTRUCTURE_ID,
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PROVISIONAL_DISPLAY_EXPANSION_COIN_COST,
  PROVISIONAL_EXPEDITION_HUB_COIN_COST,
  PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createCommand } from "../../engine/index.ts";
import { createPurchaseInfrastructureHandler } from "./purchase-infrastructure.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const purchaseInfrastructure = createPurchaseInfrastructureHandler(catalog);

function stateAtRankWithCoins(rank: number, coins: number): GameState {
  const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  return {
    ...base,
    progression: { ...base.progression, rank },
    economy: creditCoins(base.economy, toCoins(coins)),
  };
}

describe("PURCHASE_INFRASTRUCTURE — instant (Display Expansion)", () => {
  it("grants the infrastructure immediately and debits Coins", () => {
    const state = stateAtRankWithCoins(
      10,
      PROVISIONAL_DISPLAY_EXPANSION_COIN_COST,
    );
    const result = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.value.nextState.infrastructure.ownedInfrastructureIds,
    ).toContain(DISPLAY_EXPANSION_INFRASTRUCTURE_ID);
    expect(result.value.nextState.economy.coins).toBe(0);
    expect(result.value.events).toEqual([
      {
        kind: "INFRASTRUCTURE_PURCHASED",
        infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID,
      },
    ]);
  });

  it("rejects when the unlock rule is not satisfied", () => {
    const state = stateAtRankWithCoins(
      1,
      PROVISIONAL_DISPLAY_EXPANSION_COIN_COST,
    );
    const result = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("UNLOCK_RULE_NOT_SATISFIED");
  });

  it("rejects with insufficient Coins", () => {
    const state = stateAtRankWithCoins(10, 0);
    const result = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INSUFFICIENT_FUNDS");
  });

  it("rejects purchasing something already owned", () => {
    const base = stateAtRankWithCoins(
      10,
      PROVISIONAL_DISPLAY_EXPANSION_COIN_COST * 2,
    );
    const state: GameState = {
      ...base,
      infrastructure: {
        ...base.infrastructure,
        ownedInfrastructureIds: [DISPLAY_EXPANSION_INFRASTRUCTURE_ID],
      },
    };
    const result = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: DISPLAY_EXPANSION_INFRASTRUCTURE_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("ALREADY_OWNED");
  });
});

describe("PURCHASE_INFRASTRUCTURE — construction (Expedition Hub)", () => {
  it("starts a timestamped construction rather than granting immediately", () => {
    const state = stateAtRankWithCoins(
      10,
      PROVISIONAL_EXPEDITION_HUB_COIN_COST,
    );
    const clock = new FakeClock(1000);
    const result = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID },
        clock,
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      result.value.nextState.infrastructure.ownedInfrastructureIds,
    ).not.toContain(EXPEDITION_HUB_INFRASTRUCTURE_ID);
    expect(result.value.nextState.infrastructure.activeConstructions).toEqual([
      {
        infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID,
        startedAtMs: 1000,
        completesAtMs:
          1000 + PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
      },
    ]);
    expect(result.value.nextState.economy.coins).toBe(0);
  });

  it("rejects starting a second construction of the same infrastructure", () => {
    const state = stateAtRankWithCoins(
      10,
      PROVISIONAL_EXPEDITION_HUB_COIN_COST * 2,
    );
    const first = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    const second = purchaseInfrastructure(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-2"),
        "PURCHASE_INFRASTRUCTURE",
        { infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(false);
    if (second.ok) return;
    expect(second.error.code).toBe("ALREADY_UNDER_CONSTRUCTION");
  });
});

describe("PURCHASE_INFRASTRUCTURE — general", () => {
  it("rejects an unknown infrastructure id", () => {
    const state = stateAtRankWithCoins(10, 1000);
    const result = purchaseInfrastructure(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "PURCHASE_INFRASTRUCTURE",
        {
          infrastructureId: InfrastructureId.from(
            "slice-nonexistent-infrastructure",
          ),
        },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.code).toBe("INFRASTRUCTURE_NOT_FOUND");
  });
});
