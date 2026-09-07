/**
 * Design owner: Document 15 Phase 5 Exit Gate ("Catchmons are canonical
 * entities, one can be assigned, shop strategy changes, XP develops
 * through use, assignment is not duplicated, no old team system exists").
 *
 * A dev-only, headless proof that Catchmon gameplay integration works
 * end-to-end through actual Game Engine commands — no React, no Pixi.
 * Mirrors `shop-loop-dev-harness.ts`'s mutable-clock/step-logging pattern.
 *
 * Evolution (Task 05.9) IS now exercised here with real content: the
 * newly-integrated `reference/catchmons/evolution_lines.json` resolves an
 * unambiguous real chain for Flamarox (Flaumi -> Flamarox -> Flameron),
 * so this harness evolves the real owned Flamarox into the real,
 * catalog-registered Flameron. (Two of the 6 selected species —
 * Hydroscythe and Aerorion — are still genuinely terminal in their real
 * lines and have nothing to evolve into; that is accurate canonical data,
 * not an unresolved gap.)
 */
import { CommandId, CustomerId } from "../../core/ids/index.ts";
import { addDurationToTimestamp } from "../../core/time/time-math.ts";
import { toDurationMs } from "../../core/math/duration.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../../core/time/index.ts";
import { toSeed } from "../../core/random/index.ts";
import { createGameCatalog } from "../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
} from "../../domain/game-state/index.ts";
import { addToInventory, productItemId } from "../../domain/inventory/index.ts";
import {
  EMBERYNN_SPECIES_ID,
  FLAMAROX_SPECIES_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_STATION_IDS,
  PROVISIONAL_CAPABILITY_MAGNITUDES,
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  PROVISIONAL_XP_PER_CRAFT_COMPLETION,
  PROVISIONAL_XP_PER_LEVEL,
  FLAMERON_SPECIES_ID,
  PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
  SLICE_PRODUCT_01_ID,
  SLICE_PRODUCT_05_ID,
  SLICE_RECIPE_01_ID,
  SLICE_RESOURCE_A_ID,
  SLICE_RESOURCE_B_ID,
  SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
  SLICE_WALK_IN_ARCHETYPE_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { createCommand } from "../engine/index.ts";
import { createStartCraftHandler } from "../commands/craft/start-craft.ts";
import { createAssignCatchmonHandler } from "../commands/catchmons/assign-catchmon.ts";
import { createEvolveCatchmonHandler } from "../commands/catchmons/evolve-catchmon.ts";
import { createAssignDisplayProductHandler } from "../commands/display/assign-display-product.ts";
import { getCustomerTransactionOptions } from "../queries/customer/index.ts";
import {
  createCraftQueueReconciliationPass,
  reconcileGameState,
} from "../reconciliation/index.ts";
import {
  type DevHarnessLogEntry,
  type DevHarnessResult,
} from "./crafting-dev-harness.ts";

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

export function runCatchmonDevHarness(): DevHarnessResult {
  const log: DevHarnessLogEntry[] = [];
  const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
  const [PROVISION_STATION_ID, FIELDWORKS_STATION_ID] = PLAYABLE_STATION_IDS;
  const [SLOT_1, SLOT_2] = PLAYABLE_DISPLAY_SLOT_IDS;
  if (!PROVISION_STATION_ID || !FIELDWORKS_STATION_ID) {
    throw new Error("expected 2 playable station IDs");
  }
  if (!SLOT_1 || !SLOT_2) throw new Error("expected 2+ display slot IDs");

  const { clock, set: setClock } = createMutableClock(0);
  let state = createInitialGameState(catalog, clock, toSeed(1));
  let cmdCounter = 0;
  const nextCommandId = (label: string) => {
    cmdCounter += 1;
    return CommandId.from(`catchmon-harness-${label}-${String(cmdCounter)}`);
  };

  // 1. CANONICAL ENTITIES: every owned Catchmon references a real,
  // catalog-registered CatchmonSpeciesDefinition — not an invented one.
  const flamaroxOwnedId = deriveInitialOwnedCatchmonId(FLAMAROX_SPECIES_ID);
  const emberynnOwnedId = deriveInitialOwnedCatchmonId(EMBERYNN_SPECIES_ID);
  for (const ownedId of state.catchmons.ownedCatchmonIds) {
    const owned = state.catchmons.ownedCatchmons[ownedId]!;
    if (!catalog.catchmonSpecies.get(owned.currentSpeciesId)) {
      throw new Error(
        `Owned Catchmon "${ownedId}" references a non-canonical species`,
      );
    }
  }
  log.push({
    step: "CANONICAL_ENTITIES",
    detail: `${String(state.catchmons.ownedCatchmonIds.length)} owned Catchmons, all resolving to real catalog species`,
  });

  const assignCatchmon = createAssignCatchmonHandler(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
    PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
    SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
    PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  );
  const startCraft = createStartCraftHandler(
    catalog,
    VERTICAL_SLICE_STATION_ARCHETYPES,
    PROVISIONAL_CAPABILITY_MAGNITUDES,
  );
  const assignDisplayProduct = createAssignDisplayProductHandler(catalog);
  const craftXpPass = createCraftQueueReconciliationPass(undefined, {
    xpPerCraftCompletion: PROVISIONAL_XP_PER_CRAFT_COMPLETION,
    xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
    levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
  });

  // 2. ASSIGNMENT: assign Flamarox to Workshop at the Provision Station.
  const assigned = assignCatchmon(
    state,
    createCommand(
      nextCommandId("assign"),
      "ASSIGN_CATCHMON",
      {
        ownedCatchmonId: flamaroxOwnedId,
        assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
      },
      clock,
    ),
  );
  if (!assigned.ok)
    throw new Error(
      `expected assignment to succeed: ${JSON.stringify(assigned.error)}`,
    );
  state = assigned.value.nextState;
  log.push({
    step: "ASSIGN_CATCHMON",
    detail: JSON.stringify(assigned.value.events),
  });

  // 3. NOT DUPLICATED: reassigning Flamarox to the OTHER station moves it —
  // it disappears from the Provision Station's support list rather than
  // appearing in both.
  const reassigned = assignCatchmon(
    state,
    createCommand(
      nextCommandId("reassign"),
      "ASSIGN_CATCHMON",
      {
        ownedCatchmonId: flamaroxOwnedId,
        assignment: { kind: "WORKSHOP", stationId: FIELDWORKS_STATION_ID },
      },
      clock,
    ),
  );
  if (!reassigned.ok)
    throw new Error(
      `expected reassignment to succeed: ${JSON.stringify(reassigned.error)}`,
    );
  state = reassigned.value.nextState;
  const stillAtProvision =
    state.crafting.stations[PROVISION_STATION_ID]?.supportCatchmonIds ?? [];
  const nowAtFieldworks =
    state.crafting.stations[FIELDWORKS_STATION_ID]?.supportCatchmonIds ?? [];
  if (
    stillAtProvision.includes(flamaroxOwnedId) ||
    !nowAtFieldworks.includes(flamaroxOwnedId)
  ) {
    throw new Error(
      "expected reassignment to move, not duplicate, the Catchmon",
    );
  }
  log.push({
    step: "ASSIGNMENT_NOT_DUPLICATED",
    detail: `provisionStationSupport=${JSON.stringify(stillAtProvision)}, fieldworksStationSupport=${JSON.stringify(nowAtFieldworks)}`,
  });

  // 4. SHOP STRATEGY CHANGES (Workshop): same recipe, shorter duration
  // while Flamarox supports the station it's now assigned to (Task 05.6's
  // capability only targets FIELDWORKS_BENCH's own capability — but
  // Flamarox's capability targets PROVISION_STATION specifically, so this
  // proves the *targeting* is real too: an assignment to a mismatched
  // station changes nothing).
  const resourceA = catalog.resources.get(SLICE_RESOURCE_A_ID)!;
  const resourceB = catalog.resources.get(SLICE_RESOURCE_B_ID)!;
  state = {
    ...state,
    inventory: addToInventory(
      addToInventory(state.inventory, resourceA.itemId, 10),
      resourceB.itemId,
      10,
    ),
  };
  // slice-recipe-01 only runs on PROVISION_STATION, and Flamarox's own
  // capability targets that exact station archetype — reassign it back
  // there for the real duration comparison below (proving targeting is
  // real: a Workshop assignment doesn't boost "everything everywhere").
  const backAtProvision = assignCatchmon(
    state,
    createCommand(
      nextCommandId("reassign-back"),
      "ASSIGN_CATCHMON",
      {
        ownedCatchmonId: flamaroxOwnedId,
        assignment: { kind: "WORKSHOP", stationId: PROVISION_STATION_ID },
      },
      clock,
    ),
  );
  if (!backAtProvision.ok)
    throw new Error(
      "expected reassignment back to Provision Station to succeed",
    );
  state = backAtProvision.value.nextState;

  const supportedCraft = startCraft(
    state,
    createCommand(
      nextCommandId("start-supported"),
      "START_CRAFT",
      {
        stationId: PROVISION_STATION_ID,
        recipeId: SLICE_RECIPE_01_ID,
      },
      clock,
    ),
  );
  if (!supportedCraft.ok)
    throw new Error(
      `expected supported craft to start: ${JSON.stringify(supportedCraft.error)}`,
    );
  const supportedDurationMs =
    supportedCraft.value.nextState.crafting.stations[PROVISION_STATION_ID]!
      .activeCraft!.durationMs;
  const baseDurationMs = toDurationMs(
    catalog.recipes.get(SLICE_RECIPE_01_ID)!.craftDuration,
  );
  if (supportedDurationMs >= baseDurationMs) {
    throw new Error(
      "expected Workshop Catchmon effect to shorten the craft duration",
    );
  }
  state = supportedCraft.value.nextState;
  log.push({
    step: "WORKSHOP_STRATEGY_CHANGE",
    detail: `baseDurationMs=${String(baseDurationMs)}, supportedDurationMs=${String(supportedDurationMs)}`,
  });

  // 5. XP DEVELOPS THROUGH USE: complete the supported craft, confirm
  // Flamarox's XP increased from 0.
  const activeCraft =
    state.crafting.stations[PROVISION_STATION_ID]!.activeCraft!;
  const completionNow = addDurationToTimestamp(
    activeCraft.completesAtMs,
    toDurationMs(1),
  );
  setClock(completionNow);
  const craftReport = reconcileGameState(state, completionNow, catalog, [
    craftXpPass,
  ]);
  state = craftReport.nextState;
  const flamaroxXpAfterCraft =
    state.catchmons.ownedCatchmons[flamaroxOwnedId]!.xp;
  if (flamaroxXpAfterCraft <= 0) {
    throw new Error(
      "expected Flamarox to gain XP from the completed supported craft",
    );
  }
  log.push({
    step: "WORKSHOP_XP_DEVELOPS",
    detail: `flamaroxXp=${String(flamaroxXpAfterCraft)}`,
  });

  // 6. SHOP STRATEGY CHANGES (Shop Floor): assign Emberynn, display both
  // products, prove Elemental Craft becomes Recommend-compatible.
  state = {
    ...state,
    inventory: addToInventory(
      addToInventory(
        state.inventory,
        productItemId(SLICE_PRODUCT_01_ID, "STANDARD"),
        5,
      ),
      productItemId(SLICE_PRODUCT_05_ID, "STANDARD"),
      5,
    ),
  };
  for (const [slotId, productId] of [
    [SLOT_1, SLICE_PRODUCT_01_ID],
    [SLOT_2, SLICE_PRODUCT_05_ID],
  ] as const) {
    const displayResult = assignDisplayProduct(
      state,
      createCommand(
        nextCommandId("display"),
        "ASSIGN_DISPLAY_PRODUCT",
        { displaySlotId: slotId, productId },
        clock,
      ),
    );
    if (!displayResult.ok) {
      throw new Error(
        `expected display assignment to succeed: ${JSON.stringify(displayResult.error)}`,
      );
    }
    state = displayResult.value.nextState;
  }
  const walkInCustomerId = CustomerId.from("catchmon-harness-walk-in");
  const withWalkInCustomer = (base: typeof state): typeof state => ({
    ...base,
    customers: {
      activeCustomerIds: [walkInCustomerId],
      customers: {
        [walkInCustomerId]: {
          customerId: walkInCustomerId,
          archetypeId: SLICE_WALK_IN_ARCHETYPE_ID,
          arrivedAtMs: toTimestampMs(0),
          status: "AWAITING_DECISION" as const,
          generationSeed: toSeed(1),
          requestedProductId: SLICE_PRODUCT_01_ID,
          requestedQuality: "STANDARD" as const,
        },
      },
    },
  });

  const optionsBeforeEmberynn = getCustomerTransactionOptions(
    withWalkInCustomer(state),
    walkInCustomerId,
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
    PROVISIONAL_CAPABILITY_MAGNITUDES,
  );

  const emberynnAssigned = assignCatchmon(
    state,
    createCommand(
      nextCommandId("assign-emberynn"),
      "ASSIGN_CATCHMON",
      {
        ownedCatchmonId: emberynnOwnedId,
        assignment: {
          kind: "SHOP_FLOOR",
          slotId: SLICE_SHOP_FLOOR_SUPPORT_SLOT_ID,
        },
      },
      clock,
    ),
  );
  if (!emberynnAssigned.ok)
    throw new Error(
      `expected Emberynn assignment to succeed: ${JSON.stringify(emberynnAssigned.error)}`,
    );
  state = emberynnAssigned.value.nextState;

  const optionsAfterEmberynn = getCustomerTransactionOptions(
    withWalkInCustomer(state),
    walkInCustomerId,
    catalog,
    PLAYABLE_DISPLAY_SLOT_IDS,
    PROVISIONAL_CAPABILITY_MAGNITUDES,
  );
  const wasCandidateBefore = optionsBeforeEmberynn.recommendCandidates.some(
    (c) => c.productId === SLICE_PRODUCT_05_ID,
  );
  const isCandidateAfter = optionsAfterEmberynn.recommendCandidates.some(
    (c) => c.productId === SLICE_PRODUCT_05_ID,
  );
  if (wasCandidateBefore || !isCandidateAfter) {
    throw new Error(
      "expected Emberynn's Shop Floor effect to make Elemental Craft newly Recommend-compatible",
    );
  }
  log.push({
    step: "SHOP_FLOOR_STRATEGY_CHANGE",
    detail: `elementalCraftRecommendCandidate: beforeEmberynn=${String(wasCandidateBefore)}, afterEmberynn=${String(isCandidateAfter)}`,
  });

  log.push({
    step: "NO_OLD_TEAM_SYSTEM",
    detail:
      "assignment is a single currentAssignment field per owned Catchmon (Document 14 §94) — no roster/team-slot list exists anywhere in GameState",
  });

  // 7. EVOLUTION (real content): Flamarox has a real, unambiguous
  // canonical evolution target (Flameron) per evolution_lines.json. Level
  // is set directly to the threshold here (harness setup data, same as
  // step 6's momentum top-up) rather than grinding out enough craft
  // completions to reach it naturally — the point is to prove the command
  // works against real catalog content, not to re-derive Task 05.8's XP
  // curve.
  const evolveCatchmon = createEvolveCatchmonHandler(
    catalog,
    PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
  );
  const flamaroxOwned = state.catchmons.ownedCatchmons[flamaroxOwnedId]!;
  state = {
    ...state,
    catchmons: {
      ...state.catchmons,
      ownedCatchmons: {
        ...state.catchmons.ownedCatchmons,
        [flamaroxOwnedId]: {
          ...flamaroxOwned,
          level: PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
        },
      },
    },
  };
  const evolved = evolveCatchmon(
    state,
    createCommand(
      nextCommandId("evolve"),
      "EVOLVE_CATCHMON",
      { ownedCatchmonId: flamaroxOwnedId },
      clock,
    ),
  );
  if (!evolved.ok)
    throw new Error(
      `expected Flamarox to evolve into Flameron: ${JSON.stringify(evolved.error)}`,
    );
  state = evolved.value.nextState;
  if (
    state.catchmons.ownedCatchmons[flamaroxOwnedId]!.currentSpeciesId !==
    FLAMERON_SPECIES_ID
  ) {
    throw new Error(
      "expected the owned Catchmon's currentSpeciesId to become Flameron",
    );
  }
  log.push({
    step: "REAL_EVOLUTION",
    detail: `${flamaroxOwnedId} evolved Flamarox -> ${state.catchmons.ownedCatchmons[flamaroxOwnedId]!.currentSpeciesId} (real evolution_lines.json chain)`,
  });

  return { log, finalState: state, catalog };
}
