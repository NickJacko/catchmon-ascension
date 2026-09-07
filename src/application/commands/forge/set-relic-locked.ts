/** Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §4 "protected flag"; docs/rebuild/14 §7's representative `LOCK_RELIC`; docs/rebuild/15 Phase R3. */
import { err, ok } from "../../../core/result/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ForgeEvent } from "./forge-events.ts";
import { type RelicInstanceId } from "../../../core/ids/index.ts";

export interface SetRelicLockedPayload {
  readonly relicInstanceId: RelicInstanceId;
  readonly locked: boolean;
}

export const setRelicLockedHandler: CommandHandler<
  GameState,
  SetRelicLockedPayload,
  ForgeEvent
> = (state, command) => {
  const { relicInstanceId, locked } = command.payload;
  const relic = state.relicInventory.relics[relicInstanceId];
  if (!relic) {
    return err({
      code: "RELIC_NOT_FOUND",
      message: `No owned Relic "${relicInstanceId}"`,
    });
  }

  const nextState: GameState = {
    ...state,
    relicInventory: {
      ...state.relicInventory,
      relics: {
        ...state.relicInventory.relics,
        [relicInstanceId]: { ...relic, locked },
      },
    },
  };

  return ok({
    nextState,
    events: [{ kind: "RELIC_LOCK_SET", relicInstanceId, locked }],
  });
};
