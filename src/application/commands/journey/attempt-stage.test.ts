// @vitest-environment node
//
// Design owner: docs/rebuild/15 Phase R2 Exit Gate. Exercises real
// production content (`content/vertical-slice` + `content/combat-slice`)
// end-to-end, the same way this codebase's existing dev-harness tests do.
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import {
  createAscensionTestCatalog,
  FakeClock,
  TEST_ATTEMPT_STAGE_CONFIG,
} from "../../../test/helpers/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { START_REGION_ID } from "../../../content/vertical-slice/index.ts";
import {
  EXPEDITIONS_SYSTEM_MILESTONE,
  REGION_COMPLETED_MILESTONE,
} from "../../../domain/journey/index.ts";
import { createCommand } from "../../engine/index.ts";
import { assignLeadCatchmonHandler } from "../loadout/assign-lead-catchmon.ts";
import { createAttemptStageHandler } from "./attempt-stage.ts";

const catalog = createAscensionTestCatalog();
const attemptStage = createAttemptStageHandler(
  catalog,
  TEST_ATTEMPT_STAGE_CONFIG,
);

function freshStateWithLead(): GameState {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(7));
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

describe("ATTEMPT_STAGE", () => {
  it("fails clearly with NO_LEAD_ASSIGNED when no Lead is set", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const result = attemptStage(
      state,
      createCommand(
        CommandId.from("cmd-1"),
        "ATTEMPT_STAGE",
        {},
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NO_LEAD_ASSIGNED");
  });

  it("is deterministic — same seed, same command id, same result", () => {
    const state = freshStateWithLead();
    const clock = new FakeClock(1_000);
    const commandId = CommandId.from("cmd-deterministic");

    const first = attemptStage(
      state,
      createCommand(commandId, "ATTEMPT_STAGE", {}, clock),
    );
    const second = attemptStage(
      state,
      createCommand(commandId, "ATTEMPT_STAGE", {}, clock),
    );

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.value.events).toEqual(second.value.events);
      expect(first.value.nextState.journey).toEqual(
        second.value.nextState.journey,
      );
    }
  });

  it("on WIN: advances the journey, credits Echo Charges and Coins, grants Bond progress to the Lead", () => {
    const state = freshStateWithLead();
    const leadId = state.loadout.leadCatchmonId!;

    let current = state;
    let won = false;
    // A fresh level-1 Lead may not beat stage 1 on the first try depending
    // on the seed's RNG rolls — retry with different command ids (still
    // fully deterministic per command id, Document 03 §9) up to a small
    // bound, matching how a real player would just try again.
    for (let attempt = 0; attempt < 20 && !won; attempt += 1) {
      const result = attemptStage(
        current,
        createCommand(
          CommandId.from(`cmd-win-${String(attempt)}`),
          "ATTEMPT_STAGE",
          {},
          new FakeClock(attempt * 1000),
        ),
      );
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      current = result.value.nextState;
      if (
        result.value.events[0]?.kind === "STAGE_ATTEMPTED" &&
        result.value.events[0].outcome === "WIN"
      ) {
        won = true;
      }
      if (current.journey.currentStageIndex > state.journey.currentStageIndex) {
        break;
      }
    }

    expect(current.journey.currentStageIndex).toBeGreaterThan(
      state.journey.currentStageIndex,
    );
    expect(current.journey.clearedStageIds.length).toBeGreaterThan(0);
    expect(current.forge.echoCharges).toBeGreaterThan(state.forge.echoCharges);
    expect(current.economy.coins).toBeGreaterThan(state.economy.coins);
    expect(
      current.catchmons.ownedCatchmons[leadId]!.bondProgress ?? 0,
    ).toBeGreaterThan(0);
  });

  it("clears Vulkankrater end-to-end: stableFarmStageIndex tracks only normal-stage WINs (never the boss), and the boss WIN records the Region milestone + Expeditions system milestone (Phase R6)", () => {
    let state = freshStateWithLead();
    const leadId = state.loadout.leadCatchmonId!;
    // ATTEMPT_STAGE grants no XP (unlike expeditions), so a fresh Lead
    // would stay level 1 forever on this path alone — the level is given
    // directly as fixture setup here, standing in for the many real
    // battles that would otherwise raise it. This test's job is
    // stableFarmStageIndex/milestone bookkeeping on a real WIN, not
    // re-proving XP/leveling (covered elsewhere).
    state = {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [leadId]: { ...state.catchmons.ownedCatchmons[leadId]!, level: 10 },
        },
      },
    };
    expect(state.journey.stableFarmStageIndex).toBe(-1);

    function winStage(current: GameState, label: string): GameState {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const result = attemptStage(
          current,
          createCommand(
            CommandId.from(`cmd-${label}-${String(attempt)}`),
            "ATTEMPT_STAGE",
            {},
            new FakeClock(attempt * 1000),
          ),
        );
        if (!result.ok) {
          throw new Error(
            `ATTEMPT_STAGE failed: ${JSON.stringify(result.error)}`,
          );
        }
        if (
          result.value.events[0]?.kind === "STAGE_ATTEMPTED" &&
          result.value.events[0].outcome === "WIN"
        ) {
          return result.value.nextState;
        }
      }
      throw new Error(`stage "${label}" never won within the retry bound`);
    }

    state = winStage(state, "stage1");
    expect(state.journey.stableFarmStageIndex).toBe(0);
    state = winStage(state, "stage2");
    expect(state.journey.stableFarmStageIndex).toBe(1);
    state = winStage(state, "stage3");
    expect(state.journey.stableFarmStageIndex).toBe(2);
    expect(state.world.regionMilestones[START_REGION_ID]).toBeUndefined();
    expect(state.progression.unlockedSystemIds).not.toContain(
      EXPEDITIONS_SYSTEM_MILESTONE,
    );

    state = winStage(state, "boss");
    // A boss WIN advances the Journey but must NOT become the stable farm
    // checkpoint — offline reconciliation must never be able to auto-clear
    // a boss (`journey-offline-reconciliation-pass.ts`'s whole safety
    // argument rests on this).
    expect(state.journey.stableFarmStageIndex).toBe(2);
    expect(state.world.regionMilestones[START_REGION_ID]).toEqual([
      REGION_COMPLETED_MILESTONE,
    ]);
    expect(state.progression.unlockedSystemIds).toContain(
      EXPEDITIONS_SYSTEM_MILESTONE,
    );
    expect(state.progression.journeyRank).toBeGreaterThan(1);
  });
});
