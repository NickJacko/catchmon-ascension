// @vitest-environment node
//
// Design owner: Document 15 Task 03.8 (Crafting Dev Harness) / Phase 3
// Exit Gate ("materials -> craft -> time advance -> product output,
// through actual Game Engine commands and reconciliation. No UI math.").
//
// Run this file directly (`pnpm exec vitest run src/application/dev-harness`)
// to both prove and *see* the crafting loop: it logs every step to the
// console for a developer to read.
import { describe, expect, it } from "vitest";
import { productItemId } from "../../domain/inventory/index.ts";
import {
  PLAYABLE_STATION_IDS,
  SLICE_RECIPE_01_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../content/vertical-slice/index.ts";
import { runCraftingDevHarness } from "./crafting-dev-harness.ts";

const [STATION_ID] = PLAYABLE_STATION_IDS;
if (!STATION_ID) throw new Error("expected a playable station id");

describe("crafting dev harness", () => {
  it("proves materials -> craft -> time advance -> product output headlessly, with no UI math", () => {
    const result = runCraftingDevHarness();

    for (const entry of result.log) {
      console.log(`[${entry.step}] ${entry.detail}`);
    }

    expect(result.log.map((entry) => entry.step)).toEqual([
      "STOCK_INVENTORY",
      "RECIPE_PREVIEW",
      "CAN_CRAFT",
      "START_CRAFT",
      "QUEUE_CRAFT",
      "CURRENT_QUEUE",
      "RECONCILE",
      "FINAL_QUEUE",
      "FINAL_INVENTORY",
    ]);

    const catalog = result.catalog;
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID)!;
    const product = catalog.products.get(recipe.outputProductId)!;
    const outputItemId = productItemId(product.productId, "STANDARD");

    // Both the started and queued craft completed: 2x the recipe's output quantity.
    expect(result.finalState.inventory.stacks[outputItemId]?.quantity).toBe(
      product.outputQuantity * 2,
    );

    const station = result.finalState.crafting.stations[STATION_ID];
    expect(station?.activeCraft).toBeUndefined();
    expect(station?.queuedCrafts).toHaveLength(0);
  });

  it("builds a valid catalog from the same real vertical-slice content used everywhere else", () => {
    expect(() => runCraftingDevHarness()).not.toThrow();
    expect(VERTICAL_SLICE_CATALOG_CONTENT.recipes.length).toBeGreaterThan(0);
  });
});
