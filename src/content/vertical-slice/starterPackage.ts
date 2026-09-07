/**
 * Design owner: Phase 8 exit-gate fix — closes the cold-start progression
 * deadlock (a fresh save had 0 Coins/materials, every recipe needs a
 * material only an Expedition grants, and Expeditions require the
 * Expedition Hub, which requires Shop Rank 5 — reachable only via
 * crafting/selling). See `balance.ts`'s `PROVISIONAL_STARTER_RESOURCE_*`
 * doc comment for the full derivation.
 *
 * `applyStarterInventory` is deliberately NOT folded into
 * `createInitialGameState` (a generic, content-agnostic domain factory —
 * CLAUDE.md §16 Domain Rule) — it is applied once, at the app boot
 * composition point, only on the branch that creates a brand-new save
 * (`app/boot.ts`), so an existing player's save is never retroactively
 * granted materials it didn't earn.
 */
import { type GameCatalog } from "../../domain/catalog/index.ts";
import { type GameState } from "../../domain/game-state/index.ts";
import { addToInventory } from "../../domain/inventory/index.ts";
import { type ResourceId } from "../../core/ids/index.ts";
import {
  PROVISIONAL_STARTER_RESOURCE_A_QUANTITY,
  PROVISIONAL_STARTER_RESOURCE_B_QUANTITY,
} from "./balance.ts";
import { SLICE_RESOURCE_A_ID, SLICE_RESOURCE_B_ID } from "./craftingContent.ts";

export interface StarterResourceGrant {
  readonly resourceId: ResourceId;
  readonly quantity: number;
}

export const SLICE_STARTER_RESOURCES: readonly StarterResourceGrant[] = [
  {
    resourceId: SLICE_RESOURCE_A_ID,
    quantity: PROVISIONAL_STARTER_RESOURCE_A_QUANTITY,
  },
  {
    resourceId: SLICE_RESOURCE_B_ID,
    quantity: PROVISIONAL_STARTER_RESOURCE_B_QUANTITY,
  },
];

/** Applied once, to a brand-new `GameState` only — see module doc. */
export function applyStarterInventory(
  state: GameState,
  catalog: GameCatalog,
): GameState {
  let inventory = state.inventory;
  for (const grant of SLICE_STARTER_RESOURCES) {
    const resource = catalog.resources.get(grant.resourceId);
    if (!resource) {
      throw new Error(
        `Starter package references unknown resource "${grant.resourceId}"`,
      );
    }
    inventory = addToInventory(inventory, resource.itemId, grant.quantity);
  }
  return { ...state, inventory };
}
