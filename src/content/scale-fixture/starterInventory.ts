/**
 * Mirrors `content/vertical-slice/starterPackage.ts`'s role — grants
 * enough routine material AND special component stock for the scale
 * harness to run a real command workload across every station/recipe
 * rank without an artificial cold-start deadlock. Unlike the Vertical
 * Slice (where components are deliberately expedition-only), this
 * harness also seeds components directly: Phase 11 is proving the
 * crafting/reservation/reconciliation architecture handles a ~100-recipe
 * catalog with real rank-2/3 special-input recipes, not re-proving the
 * Vertical Slice's own component-acquisition loop. Applied once, to a
 * brand-new state only.
 */
import { type GameCatalog } from "../../domain/catalog/index.ts";
import { type GameState } from "../../domain/game-state/index.ts";
import { addToInventory } from "../../domain/inventory/index.ts";
import { SCALE_COMPONENTS, SCALE_RESOURCES } from "./crafting.ts";

const STARTER_QUANTITY_PER_RESOURCE = 500;
const STARTER_QUANTITY_PER_COMPONENT = 100;

export function applyScaleStarterInventory(
  state: GameState,
  catalog: GameCatalog,
): GameState {
  let inventory = state.inventory;
  for (const resource of SCALE_RESOURCES) {
    const resolved = catalog.resources.get(resource.resourceId);
    if (!resolved) {
      throw new Error(
        `scale-fixture starter package references unknown resource "${resource.resourceId}"`,
      );
    }
    inventory = addToInventory(
      inventory,
      resolved.itemId,
      STARTER_QUANTITY_PER_RESOURCE,
    );
  }
  for (const component of SCALE_COMPONENTS) {
    const resolved = catalog.components.get(component.componentId);
    if (!resolved) {
      throw new Error(
        `scale-fixture starter package references unknown component "${component.componentId}"`,
      );
    }
    inventory = addToInventory(
      inventory,
      resolved.itemId,
      STARTER_QUANTITY_PER_COMPONENT,
    );
  }
  return { ...state, inventory };
}
