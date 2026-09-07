/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §3 Relic
 * Matrix, §6 Result Decision (Equip); docs/rebuild/15 Phase R3. A slot
 * holds at most one Relic — equipping into an occupied slot replaces
 * (never stacks) whatever was there; the replaced Relic stays owned,
 * simply unequipped.
 */
import { type RelicInstanceId } from "../../../core/ids/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ForgeEvent } from "./forge-events.ts";

export interface EquipRelicPayload {
  readonly relicInstanceId: RelicInstanceId;
}

export const equipRelicHandler: CommandHandler<
  GameState,
  EquipRelicPayload,
  ForgeEvent
> = (state, command) => {
  const { relicInstanceId } = command.payload;
  const relic = state.relicInventory.relics[relicInstanceId];
  if (!relic) {
    return err({
      code: "RELIC_NOT_FOUND",
      message: `No owned Relic "${relicInstanceId}"`,
    });
  }

  const replacedRelicInstanceId = state.loadout.relicMatrix[relic.slot];

  const nextState: GameState = {
    ...state,
    loadout: {
      ...state.loadout,
      relicMatrix: {
        ...state.loadout.relicMatrix,
        [relic.slot]: relicInstanceId,
      },
    },
  };

  return ok({
    nextState,
    events: [
      {
        kind: "RELIC_EQUIPPED",
        relicInstanceId,
        slot: relic.slot,
        ...(replacedRelicInstanceId ? { replacedRelicInstanceId } : {}),
      },
    ],
  });
};
