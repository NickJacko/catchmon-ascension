// @vitest-environment node
//
// Design owner: docs/rebuild/15 Phase R5 — proves ASSIGN_LEAD_CATCHMON/
// ASSIGN_BOND_SUPPORT keep exactly one role per Catchmon at all times
// (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.3's "no hybrid assignment state"
// requirement), verified via `validateGameState` after every step, against
// the real production catalog.
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import {
  createAscensionTestCatalog,
  FakeClock,
} from "../../../test/helpers/index.ts";
import {
  createInitialGameState,
  validateGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../engine/index.ts";
import { assignBondSupportHandler } from "./assign-bond-support.ts";
import { assignLeadCatchmonHandler } from "./assign-lead-catchmon.ts";
import { selectBattlePathHandler } from "./select-battle-path.ts";
import { createSetSkillLoadoutHandler } from "./set-skill-loadout.ts";
import { COMBAT_SLICE_SKILLS } from "../../../content/combat-slice/skills.ts";

const catalog = createAscensionTestCatalog();

function freshState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(21));
}

describe("ASSIGN_LEAD_CATCHMON / ASSIGN_BOND_SUPPORT — exactly one role at a time", () => {
  it("assigning a new Lead demotes the previous Lead to UNASSIGNED, never leaving two Leads", () => {
    const state = freshState();
    const [firstId, secondId] = state.catchmons.ownedCatchmonIds;
    expect(firstId).toBeDefined();
    expect(secondId).toBeDefined();
    if (!firstId || !secondId) return;

    const afterFirst = assignLeadCatchmonHandler(
      state,
      createCommand(
        CommandId.from("c1"),
        "ASSIGN_LEAD_CATCHMON",
        { ownedCatchmonId: firstId },
        new FakeClock(0),
      ),
    );
    expect(afterFirst.ok).toBe(true);
    if (!afterFirst.ok) return;
    expect(validateGameState(afterFirst.value.nextState).ok).toBe(true);

    const afterSecond = assignLeadCatchmonHandler(
      afterFirst.value.nextState,
      createCommand(
        CommandId.from("c2"),
        "ASSIGN_LEAD_CATCHMON",
        { ownedCatchmonId: secondId },
        new FakeClock(0),
      ),
    );
    expect(afterSecond.ok).toBe(true);
    if (!afterSecond.ok) return;
    const nextState = afterSecond.value.nextState;

    expect(nextState.loadout.leadCatchmonId).toBe(secondId);
    expect(
      nextState.catchmons.ownedCatchmons[firstId]!.currentAssignment,
    ).toEqual({ kind: "UNASSIGNED" });
    expect(
      nextState.catchmons.ownedCatchmons[secondId]!.currentAssignment,
    ).toEqual({ kind: "LEAD" });
    expect(validateGameState(nextState).ok).toBe(true);
  });

  it("assigning a Bond Support into an occupied slot replaces the previous occupant, and assigning the current Lead as Bond Support clears leadCatchmonId", () => {
    const state = freshState();
    const [firstId, secondId, thirdId] = state.catchmons.ownedCatchmonIds;
    expect(firstId).toBeDefined();
    expect(secondId).toBeDefined();
    expect(thirdId).toBeDefined();
    if (!firstId || !secondId || !thirdId) return;

    let current = state;
    const lead = assignLeadCatchmonHandler(
      current,
      createCommand(
        CommandId.from("lead-1"),
        "ASSIGN_LEAD_CATCHMON",
        { ownedCatchmonId: firstId },
        new FakeClock(0),
      ),
    );
    expect(lead.ok).toBe(true);
    if (!lead.ok) return;
    current = lead.value.nextState;

    const support1 = assignBondSupportHandler(
      current,
      createCommand(
        CommandId.from("bs-1"),
        "ASSIGN_BOND_SUPPORT",
        { ownedCatchmonId: secondId, slotIndex: 0 },
        new FakeClock(0),
      ),
    );
    expect(support1.ok).toBe(true);
    if (!support1.ok) return;
    current = support1.value.nextState;
    expect(current.loadout.bondSupportCatchmonIds).toEqual([secondId]);
    expect(validateGameState(current).ok).toBe(true);

    // Replace slot 0's occupant.
    const support2 = assignBondSupportHandler(
      current,
      createCommand(
        CommandId.from("bs-2"),
        "ASSIGN_BOND_SUPPORT",
        { ownedCatchmonId: thirdId, slotIndex: 0 },
        new FakeClock(0),
      ),
    );
    expect(support2.ok).toBe(true);
    if (!support2.ok) return;
    current = support2.value.nextState;
    expect(current.loadout.bondSupportCatchmonIds).toEqual([thirdId]);
    expect(
      current.catchmons.ownedCatchmons[secondId]!.currentAssignment,
    ).toEqual({ kind: "UNASSIGNED" });
    expect(validateGameState(current).ok).toBe(true);

    // Assign the current Lead (firstId) as Bond Support in slot 1 — must
    // clear loadout.leadCatchmonId, never leaving a stale reference.
    const leadToSupport = assignBondSupportHandler(
      current,
      createCommand(
        CommandId.from("bs-3"),
        "ASSIGN_BOND_SUPPORT",
        { ownedCatchmonId: firstId, slotIndex: 1 },
        new FakeClock(0),
      ),
    );
    expect(leadToSupport.ok).toBe(true);
    if (!leadToSupport.ok) return;
    current = leadToSupport.value.nextState;
    expect(current.loadout.leadCatchmonId).toBeUndefined();
    expect(
      current.catchmons.ownedCatchmons[firstId]!.currentAssignment,
    ).toEqual({ kind: "BOND_SUPPORT", slotIndex: 1 });
    expect(validateGameState(current).ok).toBe(true);
  });
});

describe("SELECT_BATTLE_PATH / SET_SKILL_LOADOUT", () => {
  it("selects a Battle Path", () => {
    const result = selectBattlePathHandler(
      freshState(),
      createCommand(
        CommandId.from("path-1"),
        "SELECT_BATTLE_PATH",
        { battlePathId: "WEAVER" },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.value.nextState.loadout.battlePathId).toBe("WEAVER");
  });

  it("equips unlocked skills and rejects unknown ones", () => {
    const setSkillLoadout = createSetSkillLoadoutHandler(3);
    const state = freshState();
    const skillId = COMBAT_SLICE_SKILLS[0]!.skillId;

    const ok1 = setSkillLoadout(
      state,
      createCommand(
        CommandId.from("skill-1"),
        "SET_SKILL_LOADOUT",
        { skillIds: [skillId] },
        new FakeClock(0),
      ),
    );
    expect(ok1.ok).toBe(true);
    if (ok1.ok)
      expect(ok1.value.nextState.loadout.equippedSkillIds).toEqual([skillId]);

    const bad = setSkillLoadout(
      state,
      createCommand(
        CommandId.from("skill-2"),
        "SET_SKILL_LOADOUT",
        {
          skillIds: [
            ...state.skills.unlockedSkillIds,
            "nonexistent-skill" as never,
          ],
        },
        new FakeClock(0),
      ),
    );
    expect(bad.ok).toBe(false);
  });
});
