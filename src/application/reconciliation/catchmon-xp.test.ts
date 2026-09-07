// @vitest-environment node
//
// Design owner: Document 15 Task 05.8 (Catchmon XP). Acceptance: "relevant
// activity XP events, fast early progression profile, central provisional
// curve, no manual skill points."
import { describe, expect, it } from "vitest";
import { CommandId } from "../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../core/time/time-math.ts";
import { toDurationMs } from "../../core/math/duration.ts";
import { toSeed } from "../../core/random/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
} from "../../domain/game-state/index.ts";
import { addToInventory } from "../../domain/inventory/index.ts";
import { createCommand } from "../engine/index.ts";
import {
  FLAMAROX_SPECIES_ID,
  PLAYABLE_STATION_IDS,
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  PROVISIONAL_XP_PER_CRAFT_COMPLETION,
  PROVISIONAL_XP_PER_LEVEL,
  SLICE_RECIPE_01_ID,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { createAssignCatchmonHandler } from "../commands/catchmons/assign-catchmon.ts";
import { createStartCraftHandler } from "../commands/craft/start-craft.ts";
import { createCraftQueueReconciliationPass } from "./craft-queue-reconciliation-pass.ts";
import { reconcileGameState } from "./reconcile-game-state.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const [PROVISION_STATION_ID] = PLAYABLE_STATION_IDS;
if (!PROVISION_STATION_ID) throw new Error("expected a provision station id");

const startCraft = createStartCraftHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
);
const assignCatchmon = createAssignCatchmonHandler(
  catalog,
  VERTICAL_SLICE_STATION_ARCHETYPES,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
);
const craftXpPass = createCraftQueueReconciliationPass(undefined, {
  xpPerCraftCompletion: PROVISIONAL_XP_PER_CRAFT_COMPLETION,
  xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
  levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
});

describe("Workshop Catchmon XP on craft completion (Task 05.8)", () => {
  it("awards XP to the supporting Catchmon when its supported craft completes", () => {
    const flamaroxOwnedId = deriveInitialOwnedCatchmonId(FLAMAROX_SPECIES_ID);
    let state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const recipe = catalog.recipes.get(SLICE_RECIPE_01_ID)!;
    const resource = catalog.resources.get(
      recipe.routineInputs[0]!.resourceId,
    )!;
    state = {
      ...state,
      inventory: addToInventory(state.inventory, resource.itemId, 10),
    };

    const assigned = assignCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-assign"),
        "ASSIGN_CATCHMON",
        {
          ownedCatchmonId: flamaroxOwnedId,
          assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
        },
        new FakeClock(0),
      ),
    );
    if (!assigned.ok) throw new Error("expected assignment to succeed");
    state = assigned.value.nextState;
    expect(state.catchmons.ownedCatchmons[flamaroxOwnedId]!.xp).toBe(0);

    const started = startCraft(
      state,
      createCommand(
        CommandId.from("cmd-start"),
        "START_CRAFT",
        { stationId: PROVISION_STATION_ID, recipeId: SLICE_RECIPE_01_ID },
        new FakeClock(0),
      ),
    );
    if (!started.ok) throw new Error("expected craft to start");
    state = started.value.nextState;

    const activeCraft =
      state.crafting.stations[PROVISION_STATION_ID]!.activeCraft!;
    const now = addDurationToTimestamp(
      activeCraft.completesAtMs,
      toDurationMs(1),
    );
    const report = reconcileGameState(state, now, catalog, [craftXpPass]);
    state = report.nextState;

    expect(state.catchmons.ownedCatchmons[flamaroxOwnedId]!.xp).toBe(
      PROVISIONAL_XP_PER_CRAFT_COMPLETION,
    );
  });
});
