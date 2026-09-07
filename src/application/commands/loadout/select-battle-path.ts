/** Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §2, §9 Respec ("early respec free... no restriction"); docs/rebuild/15 Phase R4. */
import { ok } from "../../../core/result/index.ts";
import { type BattlePathId } from "../../../domain/combat/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type LoadoutEvent } from "./loadout-events.ts";

export interface SelectBattlePathPayload {
  readonly battlePathId: BattlePathId;
}

export const selectBattlePathHandler: CommandHandler<
  GameState,
  SelectBattlePathPayload,
  LoadoutEvent
> = (state, command) => {
  const nextState: GameState = {
    ...state,
    loadout: { ...state.loadout, battlePathId: command.payload.battlePathId },
  };
  return ok({
    nextState,
    events: [
      {
        kind: "BATTLE_PATH_SELECTED",
        battlePathId: command.payload.battlePathId,
      },
    ],
  });
};
