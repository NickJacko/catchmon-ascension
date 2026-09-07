/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §2 Combat
 * Formation ("up to 3 Bond Support Catchmons"); docs/rebuild/14 §7's
 * representative `ASSIGN_BOND_SUPPORT`; docs/rebuild/15 Phase R5. Whoever
 * currently occupies `slotIndex` (if anyone) is demoted to UNASSIGNED
 * first; assigning the current Lead as a Bond Support clears
 * `loadout.leadCatchmonId` too — same "exactly one role at a time"
 * guarantee as `assign-lead-catchmon.ts`.
 */
import { type OwnedCatchmonId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import {
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type LoadoutEvent } from "./loadout-events.ts";

export interface AssignBondSupportPayload {
  readonly ownedCatchmonId: OwnedCatchmonId;
  readonly slotIndex: 0 | 1 | 2;
}

export const assignBondSupportHandler: CommandHandler<
  GameState,
  AssignBondSupportPayload,
  LoadoutEvent
> = (state, command) => {
  const { ownedCatchmonId, slotIndex } = command.payload;
  const target = state.catchmons.ownedCatchmons[ownedCatchmonId];
  if (!target) {
    return err({
      code: "CATCHMON_NOT_FOUND",
      message: `No owned Catchmon "${ownedCatchmonId}"`,
    });
  }

  let ownedCatchmons = state.catchmons.ownedCatchmons;
  let clearLead = false;

  const previousOccupantId = state.loadout.bondSupportCatchmonIds.find((id) => {
    const owned = ownedCatchmons[id];
    return (
      owned?.currentAssignment.kind === "BOND_SUPPORT" &&
      owned.currentAssignment.slotIndex === slotIndex
    );
  });
  let bondSupportCatchmonIds = state.loadout.bondSupportCatchmonIds.filter(
    (id) => id !== previousOccupantId && id !== ownedCatchmonId,
  );
  if (previousOccupantId && previousOccupantId !== ownedCatchmonId) {
    const previous = ownedCatchmons[previousOccupantId];
    if (previous) {
      ownedCatchmons = {
        ...ownedCatchmons,
        [previousOccupantId]: {
          ...previous,
          currentAssignment: { kind: "UNASSIGNED" },
        },
      };
    }
  }

  if (target.currentAssignment.kind === "LEAD") {
    clearLead = true;
  }

  const nextTarget: OwnedCatchmonState = {
    ...(ownedCatchmons[ownedCatchmonId] ?? target),
    currentAssignment: { kind: "BOND_SUPPORT", slotIndex },
  };
  ownedCatchmons = { ...ownedCatchmons, [ownedCatchmonId]: nextTarget };
  bondSupportCatchmonIds = [...bondSupportCatchmonIds, ownedCatchmonId];

  const { leadCatchmonId: previousLead, ...loadoutRest } = state.loadout;
  const nextState: GameState = {
    ...state,
    catchmons: { ...state.catchmons, ownedCatchmons },
    loadout: {
      ...loadoutRest,
      ...(!clearLead && previousLead ? { leadCatchmonId: previousLead } : {}),
      bondSupportCatchmonIds,
    },
  };

  return ok({
    nextState,
    events: [{ kind: "BOND_SUPPORT_ASSIGNED", ownedCatchmonId, slotIndex }],
  });
};
