import { describe, expect, it } from "vitest";
import { getAvailableQuantity } from "../../domain/inventory/index.ts";
import {
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PROVISIONAL_STARTER_RESOURCE_A_QUANTITY,
  PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO,
  SLICE_RECIPE_02_ID,
  SLICE_PRODUCT_02_ID,
  SLICE_RESOURCE_A_ID,
} from "../../content/vertical-slice/index.ts";
import { runFreshSaveBootstrapSimulation } from "./fresh-save-bootstrap.ts";

function assertReachedHub(
  result: ReturnType<typeof runFreshSaveBootstrapSimulation>,
) {
  const { finalState, catalog, log } = result;
  expect(finalState.infrastructure.ownedInfrastructureIds).toContain(
    EXPEDITION_HUB_INFRASTRUCTURE_ID,
  );
  expect(finalState.progression.rank).toBeGreaterThanOrEqual(
    PROVISIONAL_UNLOCK_THRESHOLD_EXPEDITION_HUB_INTRO,
  );
  expect(finalState.economy.coins).toBeGreaterThanOrEqual(0);

  const resourceA = catalog.resources.get(SLICE_RESOURCE_A_ID)!;
  const remaining = getAvailableQuantity(
    finalState.inventory,
    resourceA.itemId,
  );
  // Never went negative (a real inventory ledger can't go negative — this
  // is a sanity check that the run didn't exceed the seeded budget).
  expect(remaining).toBeGreaterThanOrEqual(0);
  expect(remaining).toBeLessThanOrEqual(
    PROVISIONAL_STARTER_RESOURCE_A_QUANTITY,
  );

  expect(log.some((entry) => entry.step === "PURCHASE_EXPEDITION_HUB")).toBe(
    true,
  );
  expect(
    log.some((entry) => entry.step === "FRESH_SAVE_BOOTSTRAP_COMPLETE"),
  ).toBe(true);
}

describe("fresh-save bootstrap simulation (Phase 8 exit-gate fix)", () => {
  it("reaches and purchases the Expedition Hub via the intended Recipe 01 path", () => {
    assertReachedHub(runFreshSaveBootstrapSimulation({ rootSeed: 4242 }));
  });

  it("also reaches the Hub via the worst-case reasonable single-recipe choice (Recipe 02) — proves the safety margin", () => {
    assertReachedHub(
      runFreshSaveBootstrapSimulation({
        rootSeed: 4242,
        recipeId: SLICE_RECIPE_02_ID,
        productId: SLICE_PRODUCT_02_ID,
      }),
    );
  });

  it("is deterministic: the same seed produces the same outcome", () => {
    const first = runFreshSaveBootstrapSimulation({ rootSeed: 4242 });
    const second = runFreshSaveBootstrapSimulation({ rootSeed: 4242 });

    expect(second.finalState.progression.rank).toBe(
      first.finalState.progression.rank,
    );
    expect(second.finalState.economy.coins).toBe(
      first.finalState.economy.coins,
    );
    expect(second.log.length).toBe(first.log.length);
  });
});
