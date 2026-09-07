/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §2 Combat
 * Formation; docs/rebuild/14 §7's representative `ASSIGN_LEAD_CATCHMON`;
 * docs/rebuild/15 Phase R5. Widens assignment usage additively (docs/
 * rebuild/R1_DEPENDENCY_AUDIT.md §7.3) — does not touch `ASSIGN_CATCHMON`
 * (Shop's WORKSHOP/SHOP_FLOOR/SUPPLY/EXPEDITION handler, untouched).
 * Exactly one Catchmon may be LEAD at a time: assigning a new one demotes
 * the previous Lead to UNASSIGNED; assigning a current Bond Support as
 * Lead removes it from `bondSupportCatchmonIds` first, so no Catchmon can
 * ever hold two roles at once.
 */
import { type OwnedCatchmonId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import {
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type LoadoutEvent } from "./loadout-events.ts";

export interface AssignLeadCatchmonPayload {
  readonly ownedCatchmonId: OwnedCatchmonId;
}

export const assignLeadCatchmonHandler: CommandHandler<
  GameState,
  AssignLeadCatchmonPayload,
  LoadoutEvent
> = (state, command) => {
  const { ownedCatchmonId } = command.payload;
  const target = state.catchmons.ownedCatchmons[ownedCatchmonId];
  if (!target) {
    return err({
      code: "CATCHMON_NOT_FOUND",
      message: `No owned Catchmon "${ownedCatchmonId}"`,
    });
  }

  let ownedCatchmons = state.catchmons.ownedCatchmons;
  let bondSupportCatchmonIds = state.loadout.bondSupportCatchmonIds;

  const previousLeadId = state.loadout.leadCatchmonId;
  if (previousLeadId && previousLeadId !== ownedCatchmonId) {
    const previous = ownedCatchmons[previousLeadId];
    if (previous) {
      ownedCatchmons = {
        ...ownedCatchmons,
        [previousLeadId]: {
          ...previous,
          currentAssignment: { kind: "UNASSIGNED" },
        },
      };
    }
  }

  if (target.currentAssignment.kind === "BOND_SUPPORT") {
    bondSupportCatchmonIds = bondSupportCatchmonIds.filter(
      (id) => id !== ownedCatchmonId,
    );
  }

  const nextTarget: OwnedCatchmonState = {
    ...(ownedCatchmons[ownedCatchmonId] ?? target),
    currentAssignment: { kind: "LEAD" },
  };
  ownedCatchmons = { ...ownedCatchmons, [ownedCatchmonId]: nextTarget };

  const nextState: GameState = {
    ...state,
    catchmons: { ...state.catchmons, ownedCatchmons },
    loadout: {
      ...state.loadout,
      leadCatchmonId: ownedCatchmonId,
      bondSupportCatchmonIds,
    },
  };

  return ok({
    nextState,
    events: [{ kind: "LEAD_ASSIGNED", ownedCatchmonId }],
  });
};
