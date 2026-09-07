import { type DisplaySlotId } from "../../../core/ids/index.ts";
import { ok } from "../../../core/result/index.ts";
import {
  type DisplaySlotState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type DisplayEvent } from "./display-events.ts";

export interface ClearDisplaySlotPayload {
  readonly displaySlotId: DisplaySlotId;
}

export const clearDisplaySlotHandler: CommandHandler<
  GameState,
  ClearDisplaySlotPayload,
  DisplayEvent
> = (state, command) => {
  const { displaySlotId } = command.payload;
  const nextSlot: DisplaySlotState = { displaySlotId };

  const nextState: GameState = {
    ...state,
    shop: {
      ...state.shop,
      displaySlots: { ...state.shop.displaySlots, [displaySlotId]: nextSlot },
    },
  };

  return ok({
    nextState,
    events: [{ kind: "DISPLAY_SLOT_CLEARED", displaySlotId }],
  });
};
