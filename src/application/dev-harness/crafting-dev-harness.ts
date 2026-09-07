/**
 * Design owner: Document 15 Task 03.8 (Crafting Dev Harness).
 *
 * A dev-only, headless proof that the crafting loop works end-to-end
 * through actual Game Engine commands and reconciliation — no React, no
 * Pixi, no final UI (Task 03.8: "prove crafting without final UI"). Not
 * shipped as a player-facing feature; it exists to be run/read by a
 * developer (via its test) and to serve as the concrete artifact behind
 * the Phase 3 Exit Gate's "materials -> craft -> time advance -> product
 * output" requirement.
 *
 * Lives under `src/` (not `scripts/`) because it needs the full
 * domain/application/content graph — `scripts/**` is a separate
 * TypeScript project (`tsconfig.node.json`) that does not include `src/`.
 *
 * Uses a small inline mutable clock rather than the `test/helpers`
 * `FakeClock` — this file is production application code, not a
 * `*.test.ts` file, so the ESLint boundary that keeps game code from
 * depending on test helpers still applies to it.
 */
import { CommandId } from "../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../core/time/time-math.ts";
import { toDurationMs } from "../../core/math/duration.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../../core/time/index.ts";
import { toSeed } from "../../core/random/index.ts";
import {
  createGameCatalog,
  type GameCatalog,
} from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../domain/game-state/index.ts";
import { addToInventory } from "../../domain/inventory/index.ts";
import {
  PLAYABLE_STATION_IDS,
  PROVISIONAL_MAX_QUEUE_SIZE,
  SLICE_RECIPE_01_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { createCommand } from "../engine/index.ts";
import { createQueueCraftHandler } from "../commands/craft/queue-craft.ts";
import { createStartCraftHandler } from "../commands/craft/start-craft.ts";
import {
  createCraftQueries,
  type CraftQueries,
} from "../queries/craft/index.ts";
import {
  craftQueueReconciliationPass,
  reconcileGameState,
} from "../reconciliation/index.ts";

export interface DevHarnessLogEntry {
  readonly step: string;
  readonly detail: string;
}

export interface DevHarnessResult {
  readonly log: readonly DevHarnessLogEntry[];
  readonly finalState: GameState;
  readonly catalog: GameCatalog;
}

function createMutableClock(startMs: number): {
  clock: Clock;
  set(ms: number): void;
} {
  let current: TimestampMs = toTimestampMs(startMs);
  return {
    clock: { nowMs: () => current },
    set(ms: number) {
      current = toTimestampMs(ms);
    },
  };
}

export function runCraftingDevHarness(): DevHarnessResult {
  const log: DevHarnessLogEntry[] = [];
  const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
  const stationId = PLAYABLE_STATION_IDS[0];
  if (!stationId) {
    throw new Error("expected a playable station id");
  }

  const { clock, set: setClock } = createMutableClock(0);
  let state = createInitialGameState(catalog, clock, toSeed(42));

  const startCraft = createStartCraftHandler(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
  );
  const queueCraft = createQueueCraftHandler(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
    PROVISIONAL_MAX_QUEUE_SIZE,
  );
  const queries: CraftQueries = createCraftQueries(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
    PROVISIONAL_MAX_QUEUE_SIZE,
  );

  // 1. Materials: stock enough routine material for two crafts of slice-recipe-01.
  const recipe01 = catalog.recipes.get(SLICE_RECIPE_01_ID);
  if (!recipe01) {
    throw new Error("expected slice-recipe-01 to exist");
  }
  const resource = catalog.resources.get(recipe01.routineInputs[0]!.resourceId);
  if (!resource) {
    throw new Error("expected slice-recipe-01's routine input to resolve");
  }
  state = {
    ...state,
    inventory: addToInventory(state.inventory, resource.itemId, 10),
  };
  log.push({
    step: "STOCK_INVENTORY",
    detail: `Added 10x ${resource.itemId} to inventory.`,
  });

  // Recipes: preview + eligibility before crafting anything.
  const preview = queries.productOutputPreview(SLICE_RECIPE_01_ID);
  log.push({
    step: "RECIPE_PREVIEW",
    detail: `slice-recipe-01 -> ${JSON.stringify(preview)}`,
  });
  log.push({
    step: "CAN_CRAFT",
    detail: `canCraft(slice-recipe-01) = ${String(queries.canCraft(state, stationId, SLICE_RECIPE_01_ID))}`,
  });

  // 2. Craft: start one craft, queue a second behind it.
  const started = startCraft(
    state,
    createCommand(
      CommandId.from("dev-harness-start"),
      "START_CRAFT",
      { stationId, recipeId: SLICE_RECIPE_01_ID },
      clock,
    ),
  );
  if (!started.ok) {
    throw new Error(
      `expected START_CRAFT to succeed: ${JSON.stringify(started.error)}`,
    );
  }
  state = started.value.nextState;
  log.push({
    step: "START_CRAFT",
    detail: JSON.stringify(started.value.events),
  });

  const queued = queueCraft(
    state,
    createCommand(
      CommandId.from("dev-harness-queue"),
      "QUEUE_CRAFT",
      { stationId, recipeId: SLICE_RECIPE_01_ID },
      clock,
    ),
  );
  if (!queued.ok) {
    throw new Error(
      `expected QUEUE_CRAFT to succeed: ${JSON.stringify(queued.error)}`,
    );
  }
  state = queued.value.nextState;
  log.push({
    step: "QUEUE_CRAFT",
    detail: JSON.stringify(queued.value.events),
  });

  // Queue: inspect what's active/queued before time passes.
  log.push({
    step: "CURRENT_QUEUE",
    detail: JSON.stringify(queries.currentQueue(state, stationId)),
  });

  // 3. Time advance: jump the clock past both crafts' durations.
  const totalDurationMs = recipe01.craftDuration * 2 + 1000;
  const now = addDurationToTimestamp(
    clock.nowMs(),
    toDurationMs(totalDurationMs),
  );
  setClock(now);

  // 4. Product output: reconcile, then inspect the resulting inventory/queue.
  const report = reconcileGameState(state, now, catalog, [
    craftQueueReconciliationPass,
  ]);
  state = report.nextState;
  log.push({
    step: "RECONCILE",
    detail: `elapsedMs=${String(report.elapsedMs)}, events=${JSON.stringify(report.events)}`,
  });
  log.push({
    step: "FINAL_QUEUE",
    detail: JSON.stringify(queries.currentQueue(state, stationId)),
  });
  log.push({
    step: "FINAL_INVENTORY",
    detail: JSON.stringify(state.inventory.stacks),
  });

  return { log, finalState: state, catalog };
}
