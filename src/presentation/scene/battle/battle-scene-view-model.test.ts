import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import {
  createAscensionTestCatalog,
  FakeClock,
  TEST_LEAD_STATS_CONFIG,
} from "../../../test/helpers/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../../application/engine/index.ts";
import { assignLeadCatchmonHandler } from "../../../application/commands/loadout/assign-lead-catchmon.ts";
import {
  buildBattleSceneViewModel,
  collectBattleSceneImageUrls,
} from "./battle-scene-view-model.ts";

const catalog = createAscensionTestCatalog();
const OPTIONS = { leadStatsConfig: TEST_LEAD_STATS_CONFIG };

function freshState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(1));
}

function stateWithLead(): GameState {
  const state = freshState();
  const [firstOwnedId] = state.catchmons.ownedCatchmonIds;
  if (!firstOwnedId) throw new Error("expected at least one starting Catchmon");
  const assigned = assignLeadCatchmonHandler(
    state,
    createCommand(
      CommandId.from("cmd-assign-lead"),
      "ASSIGN_LEAD_CATCHMON",
      { ownedCatchmonId: firstOwnedId },
      new FakeClock(0),
    ),
  );
  if (!assigned.ok) throw new Error("failed to assign lead in test fixture");
  return assigned.value.nextState;
}

describe("buildBattleSceneViewModel", () => {
  it("is a pure function of state+catalog — same input, same output", () => {
    const state = stateWithLead();
    const first = buildBattleSceneViewModel(state, catalog, OPTIONS);
    const second = buildBattleSceneViewModel(state, catalog, OPTIONS);
    expect(second).toEqual(first);
  });

  it("reports lead: null when no Lead is assigned", () => {
    const viewModel = buildBattleSceneViewModel(freshState(), catalog, OPTIONS);
    expect(viewModel.lead).toBeNull();
  });

  it("reports the assigned Lead's derived stats/identity once assigned", () => {
    const viewModel = buildBattleSceneViewModel(
      stateWithLead(),
      catalog,
      OPTIONS,
    );
    expect(viewModel.lead).not.toBeNull();
    expect(viewModel.lead?.role).toBe("LEAD");
    expect(viewModel.lead?.hpMax).toBeGreaterThan(0);
    expect(viewModel.lead?.isBoss).toBe(false);
  });

  it("reports the current stage's real enemy identity, generically (not hardcoded)", () => {
    const state = stateWithLead();
    const viewModel = buildBattleSceneViewModel(state, catalog, OPTIONS);
    const expectedStageOrder = 0;
    const expectedStage = [...catalog.stages.values()].find(
      (stage) => stage.order === expectedStageOrder,
    );
    const expectedEnemy = expectedStage
      ? catalog.enemies.get(expectedStage.enemyId)
      : undefined;
    expect(viewModel.enemy?.id).toBe(expectedEnemy?.enemyId);
    expect(viewModel.enemy?.displayName).toBe(expectedEnemy?.displayName);
    expect(viewModel.enemy?.isBoss).toBe(expectedEnemy?.isBoss);
    expect(viewModel.enemy?.hpMax).toBe(expectedEnemy?.stats.hp);
  });

  it("reports enemy: null once every authored stage is cleared", () => {
    const state: GameState = {
      ...stateWithLead(),
      journey: {
        currentStageIndex: 999,
        clearedStageIds: [],
        stableFarmStageIndex: -1,
      },
    };
    const viewModel = buildBattleSceneViewModel(state, catalog, OPTIONS);
    expect(viewModel.enemy).toBeNull();
  });
});

describe("collectBattleSceneImageUrls", () => {
  it("excludes the Lead's portrait when no Lead is assigned, but still includes real enemy/background art (Wave 0A: Vulkankrater's stage 1 enemy + arena)", () => {
    const viewModel = buildBattleSceneViewModel(freshState(), catalog, OPTIONS);
    const urls = collectBattleSceneImageUrls(viewModel);
    expect(urls).not.toContain(undefined);
    expect(urls.length).toBeGreaterThan(0);
  });

  it("includes the Lead's real battle-idle art once assigned (Wave 0A: Flamarox)", () => {
    const viewModel = buildBattleSceneViewModel(
      stateWithLead(),
      catalog,
      OPTIONS,
    );
    expect(viewModel.lead?.portraitUrl).toBeDefined();
    expect(collectBattleSceneImageUrls(viewModel)).toContain(
      viewModel.lead?.portraitUrl,
    );
  });
});

describe("Wave 0A production battle art", () => {
  it("resolves the current stage's real enemy battle-idle art and pivot generically (no hardcoded enemy-id branch)", () => {
    const viewModel = buildBattleSceneViewModel(
      stateWithLead(),
      catalog,
      OPTIONS,
    );
    expect(viewModel.enemy?.portraitUrl).toMatch(/ember-wisp\/idle\.webp$/);
    expect(viewModel.enemy?.pivot).toEqual({ x: 0.5, y: 0.9 });
  });

  it("resolves the current region's real battle background art", () => {
    const viewModel = buildBattleSceneViewModel(
      stateWithLead(),
      catalog,
      OPTIONS,
    );
    expect(viewModel.backgroundUrl).toMatch(/vulkankrater\/background\.webp$/);
  });

  it("resolves the Lead's dedicated battle-idle art (not the canonical roster portrait) when one is registered", () => {
    const viewModel = buildBattleSceneViewModel(
      stateWithLead(),
      catalog,
      OPTIONS,
    );
    expect(viewModel.lead?.portraitUrl).toMatch(/flamarox\/idle\.webp$/);
    expect(viewModel.lead?.pivot).toEqual({ x: 0.5, y: 0.8929 });
  });

  it("resolves undefined background for a region with no registered battle art (Ozean)", () => {
    const state: GameState = {
      ...stateWithLead(),
      journey: {
        currentStageIndex: 4,
        clearedStageIds: [],
        stableFarmStageIndex: 3,
      },
    };
    const viewModel = buildBattleSceneViewModel(state, catalog, OPTIONS);
    expect(viewModel.regionDisplayName).toBe("Ozean");
    expect(viewModel.backgroundUrl).toBeUndefined();
    expect(viewModel.enemy?.portraitUrl).toBeUndefined();
  });
});
