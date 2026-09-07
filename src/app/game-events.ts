/**
 * Design owner: Document 15 Task 08.1 (Application Providers / Stores).
 *
 * The one place every feature's domain-event union is combined into the
 * single `TEvent` type parameter `GameEngine<GameState, AppGameEvent>`
 * needs — mirrors `application/reconciliation/reconcile-game-state.ts`'s
 * own `ReconciliationEvent` union (which already combines `CraftEvent |
 * ExpeditionEvent | InfrastructureEvent`), extended with the event unions
 * every other command family emits.
 */
import { type CatchmonEvent } from "../application/commands/catchmons/index.ts";
import {
  type CraftEvent,
  type WorkshopPushAppliedEvent,
} from "../application/commands/craft/index.ts";
import { type CustomerEvent } from "../application/commands/customer/index.ts";
import { type DisplayEvent } from "../application/commands/display/index.ts";
import { type ExpeditionEvent } from "../application/commands/expeditions/index.ts";
import { type ForgeEvent } from "../application/commands/forge/index.ts";
import { type JourneyEvent } from "../application/commands/journey/index.ts";
import { type LoadoutEvent } from "../application/commands/loadout/index.ts";
import { type SaleEvent } from "../application/commands/sale/index.ts";
import { type InfrastructureEvent } from "../application/commands/shop-infrastructure/index.ts";

export type AppGameEvent =
  | CatchmonEvent
  | CraftEvent
  | WorkshopPushAppliedEvent
  | CustomerEvent
  | DisplayEvent
  | ExpeditionEvent
  | ForgeEvent
  | JourneyEvent
  | LoadoutEvent
  | SaleEvent
  | InfrastructureEvent;
