// @vitest-environment node
import { describe, expect, it } from "vitest";
import { CommandId } from "../../core/ids/index.ts";
import { toCoins } from "../../core/math/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import { creditCoins } from "../../domain/economy/index.ts";
import {
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PROVISIONAL_EXPEDITION_HUB_COIN_COST,
  PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../content/vertical-slice/index.ts";
import { createCommand } from "../engine/index.ts";
import { createPurchaseInfrastructureHandler } from "../commands/shop-infrastructure/purchase-infrastructure.ts";
import { reconcileGameState } from "./reconcile-game-state.ts";
import { infrastructureConstructionReconciliationPass } from "./infrastructure-construction-reconciliation-pass.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const purchaseInfrastructure = createPurchaseInfrastructureHandler(catalog);

function underConstructionState(): GameState {
  const base = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const state: GameState = {
    ...base,
    progression: { ...base.progression, rank: 10 },
    economy: creditCoins(
      base.economy,
      toCoins(PROVISIONAL_EXPEDITION_HUB_COIN_COST),
    ),
  };
  const purchased = purchaseInfrastructure(
    state,
    createCommand(
      CommandId.from("cmd-purchase"),
      "PURCHASE_INFRASTRUCTURE",
      { infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID },
      new FakeClock(0),
    ),
  );
  if (!purchased.ok) throw new Error(JSON.stringify(purchased.error));
  return purchased.value.nextState;
}

describe("infrastructure construction reconciliation", () => {
  it("moves a completed construction into ownedInfrastructureIds", () => {
    const state = underConstructionState();
    const now = toTimestampMs(
      state.meta.createdAtMs +
        PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
    );
    const report = reconcileGameState(state, now, catalog, [
      infrastructureConstructionReconciliationPass,
    ]);
    expect(report.nextState.infrastructure.ownedInfrastructureIds).toContain(
      EXPEDITION_HUB_INFRASTRUCTURE_ID,
    );
    expect(report.nextState.infrastructure.activeConstructions).toEqual([]);
    expect(report.events).toEqual([
      {
        kind: "INFRASTRUCTURE_CONSTRUCTION_COMPLETED",
        infrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID,
      },
    ]);
  });

  it("does nothing before completion", () => {
    const state = underConstructionState();
    const notYet = toTimestampMs(state.meta.createdAtMs + 1);
    const report = reconcileGameState(state, notYet, catalog, [
      infrastructureConstructionReconciliationPass,
    ]);
    expect(report.nextState.infrastructure.activeConstructions).toHaveLength(1);
    expect(report.events).toEqual([]);
  });

  it("is exactly-once: reconciling again does not re-add the infrastructure or duplicate events", () => {
    const state = underConstructionState();
    const now = toTimestampMs(
      state.meta.createdAtMs +
        PROVISIONAL_EXPEDITION_HUB_CONSTRUCTION_DURATION_MS,
    );
    const first = reconcileGameState(state, now, catalog, [
      infrastructureConstructionReconciliationPass,
    ]);
    const second = reconcileGameState(
      first.nextState,
      toTimestampMs(now + 60_000),
      catalog,
      [infrastructureConstructionReconciliationPass],
    );
    expect(second.nextState.infrastructure.ownedInfrastructureIds).toEqual(
      first.nextState.infrastructure.ownedInfrastructureIds,
    );
    expect(second.events).toEqual([]);
  });
});
