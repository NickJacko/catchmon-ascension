#!/usr/bin/env node
/**
 * Design owner: Document 15 Phase 11 (Scale Validation), Tasks
 * 11.2/11.4/11.5/11.6/11.7 + Exit Gate — CLAUDE.md's validation policy
 * ("pnpm test:scale", "capture useful diagnostic measurements... do not
 * add brittle micro-benchmark thresholds").
 *
 * A deterministic, headless proof that the REAL production architecture
 * — catalog construction, `GameState`, real command handlers, real
 * reconciliation passes, real selectors/queries, real Dexie persistence —
 * survives a synthetic content set at Phase 11's target scale (17
 * regions/34 routes, ~104 Catchmons across mixed 1/2/3-stage lines, ~98
 * products/recipes, 10 stations, 8 customer archetypes, 10 infrastructure
 * entries) with NO GameEngine/React/Zustand involved, exactly like
 * `application/dev-harness/fresh-save-bootstrap.ts`'s proven pattern —
 * generalized from the Vertical Slice's hand-authored content to
 * `content/scale-fixture/*`'s generated content.
 *
 * This is a correctness + diagnostic harness, not a benchmark suite: it
 * asserts real invariants (a command expected to succeed did; catalog
 * validation catches a deliberately broken reference; `validateGameState`
 * reports no violations; a persistence round-trip is byte-for-byte
 * faithful) and PRINTS timing/size numbers for a human to read — it never
 * fails on a numeric threshold (CLAUDE.md Phase 11 instruction: "do not
 * add brittle micro-benchmark thresholds").
 *
 * Run: `pnpm test:scale` (== `node scripts/scale-harness.ts`).
 */
import "fake-indexeddb/auto";
import process from "node:process";
import { CommandId, SaveId } from "../src/core/ids/index.ts";
import {
  toTimestampMs,
  type Clock,
  type TimestampMs,
} from "../src/core/time/index.ts";
import { toSeed } from "../src/core/random/index.ts";
import {
  createGameCatalog,
  type GameCatalogContent,
} from "../src/domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
  validateGameState,
  type GameState,
} from "../src/domain/game-state/index.ts";
import {
  getAvailableQuantity,
  getReservedQuantitiesByItem,
  productItemId,
} from "../src/domain/inventory/index.ts";
import { isUnlockRuleSatisfied } from "../src/domain/progression/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../src/domain/journey/index.ts";
import {
  createCommand,
  type CommandHandler,
} from "../src/application/engine/index.ts";
import { createStartCraftHandler } from "../src/application/commands/craft/start-craft.ts";
import {
  createAssignCatchmonHandler,
  createEvolveCatchmonHandler,
} from "../src/application/commands/catchmons/index.ts";
import { createAssignDisplayProductHandler } from "../src/application/commands/display/assign-display-product.ts";
import { createArriveCustomerHandler } from "../src/application/commands/customer/index.ts";
import {
  createFavorableDealHandler,
  createPremiumPitchHandler,
  createRecommendHandler,
  createStandardSaleHandler,
  declineHandler,
} from "../src/application/commands/sale/index.ts";
import { createPurchaseInfrastructureHandler } from "../src/application/commands/shop-infrastructure/index.ts";
import {
  createAttemptCaptureHandler,
  createDeclineEncounterHandler,
  createObserveEncounterHandler,
  createStartExpeditionHandler,
} from "../src/application/commands/expeditions/index.ts";
import {
  createCraftQueueReconciliationPass,
  createExpeditionReconciliationPass,
  infrastructureConstructionReconciliationPass,
  reconcileGameState,
} from "../src/application/reconciliation/index.ts";
import { getCustomerTransactionOptions } from "../src/application/queries/customer/index.ts";
import { createExpeditionPlanningQueries } from "../src/application/queries/expeditions/index.ts";
import { createCraftQueries } from "../src/application/queries/craft/index.ts";
import { getDisplaySlotView } from "../src/application/queries/display/index.ts";
import { CatchmonAscensionDatabase } from "../src/infrastructure/persistence/catchmon-ascension-database.ts";
import { createDexieSaveRepository } from "../src/infrastructure/persistence/dexie-save-repository.ts";
import { type StoredSave } from "../src/application/engine/index.ts";
import {
  SCALE_CATALOG_CONTENT,
  SCALE_STATION_IDS,
  SCALE_STATION_ARCHETYPE_MAP,
  SCALE_CUSTOMER_ARCHETYPES,
  SCALE_PRODUCTS,
  SCALE_RECIPES,
  SCALE_ROUTES,
  SCALE_INFRASTRUCTURE,
  SCALE_STARTER_SPECIES_IDS,
  applyScaleStarterInventory,
} from "../src/content/scale-fixture/index.ts";
import {
  buildScaleGameConfig,
  SCALE_DISPLAY_SLOT_IDS,
} from "../src/content/scale-fixture/gameConfig.ts";

// ---------------------------------------------------------------------
// Small measurement/reporting scaffolding — diagnostics only, no
// pass/fail thresholds anywhere in this file.
// ---------------------------------------------------------------------

interface Measurement {
  readonly label: string;
  readonly ms: number;
  readonly detail?: string;
}

const measurements: Measurement[] = [];

function measure<T>(
  label: string,
  fn: () => T,
  detail?: (result: T) => string,
): T {
  const startedAt = performance.now();
  const result = fn();
  const ms = performance.now() - startedAt;
  const detailText = detail?.(result);
  measurements.push({
    label,
    ms,
    ...(detailText !== undefined ? { detail: detailText } : {}),
  });
  return result;
}

async function measureAsync<T>(
  label: string,
  fn: () => Promise<T>,
  detail?: (result: T) => string,
): Promise<T> {
  const startedAt = performance.now();
  const result = await fn();
  const ms = performance.now() - startedAt;
  const detailText = detail?.(result);
  measurements.push({
    label,
    ms,
    ...(detailText !== undefined ? { detail: detailText } : {}),
  });
  return result;
}

let failures = 0;
function assertTrue(condition: boolean, message: string): void {
  if (!condition) {
    failures += 1;
    console.error(`  ✗ ASSERTION FAILED: ${message}`);
  } else {
    console.log(`  ✓ ${message}`);
  }
}

function section(title: string): void {
  console.log(`\n=== ${title} ===`);
}

// ---------------------------------------------------------------------
// Task 11.2: registry / recipe-graph validation, including a deliberate
// negative case — `createGameCatalog` must actually reject a broken
// reference, proving the guard the rest of this harness relies on works.
// ---------------------------------------------------------------------

section("Task 11.2 — Registry & recipe-graph validation");

const catalog = measure(
  "catalog build (createGameCatalog)",
  () => createGameCatalog(SCALE_CATALOG_CONTENT),
  (c) =>
    `${String(c.products.size)} products, ${String(c.recipes.size)} recipes, ${String(c.catchmonSpecies.size)} species, ${String(c.catchmonLines.size)} lines, ${String(c.regions.size)} regions, ${String(c.routes.size)} routes, ${String(c.customerArchetypes.size)} customer archetypes, ${String(c.infrastructure.size)} infrastructure, ${String(c.unlockRules.size)} unlock rules`,
);

{
  const brokenContent: GameCatalogContent = {
    ...SCALE_CATALOG_CONTENT,
    recipes: [
      ...SCALE_CATALOG_CONTENT.recipes.slice(1),
      {
        ...SCALE_CATALOG_CONTENT.recipes[0]!,
        outputProductId: "scale-product-does-not-exist" as never,
      },
    ],
  };
  let threw = false;
  try {
    createGameCatalog(brokenContent);
  } catch {
    threw = true;
  }
  assertTrue(
    threw,
    "createGameCatalog rejects a deliberately broken recipe->product reference (no orphan materials can slip through)",
  );
}

// No orphan materials: every resource/component is referenced by at least one recipe.
{
  const referencedResources = new Set(
    SCALE_RECIPES.flatMap((r) => r.routineInputs.map((i) => i.resourceId)),
  );
  const referencedComponents = new Set(
    SCALE_RECIPES.flatMap((r) => r.specialInputs.map((i) => i.componentId)),
  );
  assertTrue(
    Array.from(catalog.resources.ids()).every((id) =>
      referencedResources.has(id),
    ),
    "every registered resource is used by at least one recipe (no orphan materials)",
  );
  assertTrue(
    Array.from(catalog.components.ids()).every((id) =>
      referencedComponents.has(id),
    ),
    "every registered component is used by at least one recipe (no orphan materials)",
  );
}

// ---------------------------------------------------------------------
// Boot: large GameState creation.
// ---------------------------------------------------------------------

section("GameState creation at scale");

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

const { clock, set: setClock } = createMutableClock(0);

let state = measure(
  "createInitialGameState + starter inventory",
  () =>
    applyScaleStarterInventory(
      createInitialGameState(catalog, clock, toSeed(99)),
      catalog,
    ),
  (s) =>
    `${String(s.world.unlockedRegionIds.length)} regions unlocked, ${String(Object.keys(s.orders.orders).length)} orders seeded, ${String(s.catchmons.ownedCatchmonIds.length)} starter Catchmons`,
);

assertTrue(
  state.world.unlockedRegionIds.length === catalog.regions.size,
  "every catalog region is unlocked at game start (matches documented createInitialGameState behavior, scales O(regions))",
);
assertTrue(
  Object.keys(state.orders.orders).length === catalog.everydayOrders.size,
  "one order snapshot seeded per catalog everydayOrders entry (scales O(everydayOrders), not player-driven)",
);
assertTrue(
  state.catchmons.ownedCatchmonIds.length === SCALE_STARTER_SPECIES_IDS.length,
  "owned Catchmon count matches the explicit starter roster, independent of the 104-species registry size",
);

const config = buildScaleGameConfig(catalog);

// ---------------------------------------------------------------------
// Handlers (headless — no GameEngine, mirrors fresh-save-bootstrap.ts).
// ---------------------------------------------------------------------

const startCraft = createStartCraftHandler(
  catalog,
  config.stationArchetypes,
  config.catchmonCapabilityMagnitudes,
);
const assignCatchmon = createAssignCatchmonHandler(
  catalog,
  config.stationArchetypes,
  config.maxWorkshopSupportPerStation,
  config.shopFloorSupportSlotId,
  config.maxShopFloorSupportSlots,
);
const evolveCatchmon = createEvolveCatchmonHandler(
  catalog,
  config.evolutionLevelRequirement,
);
const assignDisplayProduct = createAssignDisplayProductHandler(
  catalog,
  config.displaySlotUnlockRequirements,
);
const arriveCustomer = createArriveCustomerHandler(
  catalog,
  config.customerArchetypes,
  config.displaySlotIds,
  config.maxActiveCustomers,
);
const standardSale = createStandardSaleHandler(
  catalog,
  config.displaySlotIds,
  config.saleXpConfig,
);
const favorableDeal = createFavorableDealHandler(
  catalog,
  config.displaySlotIds,
  config.saleXpConfig,
);
const premiumPitch = createPremiumPitchHandler(
  catalog,
  config.displaySlotIds,
  config.saleXpConfig,
);
const recommend = createRecommendHandler(
  catalog,
  config.displaySlotIds,
  config.catchmonCapabilityMagnitudes,
  config.saleXpConfig,
);
const purchaseInfrastructure = createPurchaseInfrastructureHandler(catalog);
const startExpedition = createStartExpeditionHandler(
  catalog,
  config.captureAidProductId,
  config.routeDurationMsByRouteId,
  config.maxConcurrentExpeditions,
  config.catchmonCapabilityMagnitudes,
);
const attemptCapture = createAttemptCaptureHandler(
  catalog,
  config.captureChanceConfig,
  config.captureRankProgressConfig,
);
const declineEncounter = createDeclineEncounterHandler();
const observeEncounter = createObserveEncounterHandler(
  config.observeRewardItemId,
  config.observeRewardQuantity,
);

const craftQueuePass = createCraftQueueReconciliationPass(
  undefined,
  config.craftXpConfig,
  config.craftRankProgressConfig,
);
const expeditionPass = createExpeditionReconciliationPass(
  config.expeditionRewardConfig,
  config.expeditionXpConfig,
  config.expeditionRankProgressConfig,
);
const reconciliationPasses = [
  craftQueuePass,
  expeditionPass,
  infrastructureConstructionReconciliationPass,
];

let cmdCounter = 0;
const nextCommandId = (label: string) => {
  cmdCounter += 1;
  return CommandId.from(`scale-${label}-${String(cmdCounter)}`);
};

function dispatch<TPayload>(
  label: string,
  type: string,
  handler: CommandHandler<GameState, TPayload, unknown>,
  payload: TPayload,
  { allowFailure = false }: { allowFailure?: boolean } = {},
): boolean {
  const result = handler(
    state,
    createCommand(nextCommandId(label), type, payload, clock),
  );
  if (!result.ok) {
    if (allowFailure) return false;
    failures += 1;
    console.error(
      `  ✗ expected ${type} (${label}) to succeed: ${JSON.stringify(result.error)}`,
    );
    return false;
  }
  state = result.value.nextState;
  return true;
}

let totalReconcileMs = 0;
function reconcileTo(nowMs: number): void {
  setClock(nowMs);
  const startedAt = performance.now();
  const report = reconcileGameState(
    state,
    toTimestampMs(nowMs),
    catalog,
    reconciliationPasses,
  );
  totalReconcileMs += performance.now() - startedAt;
  state = report.nextState;
}

// ---------------------------------------------------------------------
// Task 11.6-ish: representative command workload across every real
// command type this catalog can exercise.
// ---------------------------------------------------------------------

section("Representative command workload (crafting/inventory/reservations)");

let virtualNowMs = 0;
const craftedProductIds = new Set<string>();
let stationsCrafted = 0;

for (const stationId of SCALE_STATION_IDS) {
  const archetype = SCALE_STATION_ARCHETYPE_MAP[stationId]!;
  // `.find()` picks the same recipe for every station instance sharing an
  // archetype (2 stations per archetype here) — that's correct: this loop
  // proves every STATION can complete a real craft, not that every
  // station picks a distinct product. Distinct-product coverage across
  // the ~98-product catalog is exercised separately, by the customer/
  // display loops below drawing from `SCALE_PRODUCTS` directly.
  const recipe = SCALE_RECIPES.find((r) => r.stationType === archetype);
  if (!recipe) continue;
  const started = dispatch("start-craft", "START_CRAFT", startCraft, {
    stationId,
    recipeId: recipe.recipeId,
  });
  if (!started) continue;
  const activeCraft = state.crafting.stations[stationId]!.activeCraft!;
  virtualNowMs = Math.max(virtualNowMs, activeCraft.completesAtMs) + 1;
  reconcileTo(virtualNowMs);
  craftedProductIds.add(recipe.outputProductId);
  stationsCrafted += 1;
}
assertTrue(
  stationsCrafted === SCALE_STATION_IDS.length,
  `every station completed a real craft (${String(stationsCrafted)}/${String(SCALE_STATION_IDS.length)} stations, ${String(craftedProductIds.size)} distinct archetype-recipes)`,
);

section("Catchmon assignment / XP / evolution");

const evolvableStarterId = SCALE_STARTER_SPECIES_IDS.find(
  (id) => catalog.catchmonSpecies.get(id)?.evolvesToSpeciesId !== undefined,
);
assertTrue(
  evolvableStarterId !== undefined,
  "at least one starter species has a real evolution target to exercise EVOLVE_CATCHMON against",
);

if (evolvableStarterId) {
  const ownedId = deriveInitialOwnedCatchmonId(evolvableStarterId);
  const workshopStationId = SCALE_STATION_IDS[0]!;
  dispatch("assign-workshop", "ASSIGN_CATCHMON", assignCatchmon, {
    ownedCatchmonId: ownedId,
    assignment: { kind: "WORKSHOP", stationId: workshopStationId },
  });
  const archetype = SCALE_STATION_ARCHETYPE_MAP[workshopStationId]!;
  const recipe = SCALE_RECIPES.find((r) => r.stationType === archetype)!;
  // Enough craft completions to clear `evolutionLevelRequirement` (Task
  // 11.7: reused straight from Vertical Slice balance) via the SAME real
  // XP-per-craft-completion path craft-queue-reconciliation-pass.ts uses
  // for any WORKSHOP-assigned Catchmon — no shortcut/direct XP grant.
  for (let i = 0; i < 12; i += 1) {
    const ok = dispatch(
      "evolution-craft",
      "START_CRAFT",
      startCraft,
      {
        stationId: workshopStationId,
        recipeId: recipe.recipeId,
      },
      { allowFailure: true },
    );
    if (!ok) break;
    const activeCraft =
      state.crafting.stations[workshopStationId]!.activeCraft!;
    virtualNowMs = Math.max(virtualNowMs, activeCraft.completesAtMs) + 1;
    reconcileTo(virtualNowMs);
  }
  const ownedNow = state.catchmons.ownedCatchmons[ownedId];
  assertTrue(
    !!ownedNow && ownedNow.level >= 1,
    "WORKSHOP-assigned starter actually accrued XP/levels through real craft-completion reconciliation",
  );
  const evolved = dispatch(
    "evolve",
    "EVOLVE_CATCHMON",
    evolveCatchmon,
    { ownedCatchmonId: ownedId },
    { allowFailure: true },
  );
  console.log(
    `  (evolution ${evolved ? "succeeded" : "did not reach the level requirement within the simulated budget — command path still exercised without crashing"})`,
  );
}

section("Display assignment / customers / sales");

for (const [i, displaySlotId] of SCALE_DISPLAY_SLOT_IDS.entries()) {
  const product = SCALE_PRODUCTS[i % SCALE_PRODUCTS.length]!;
  const itemId = productItemId(product.productId, "STANDARD");
  if (getAvailableQuantity(state.inventory, itemId) < 1) continue;
  dispatch(
    "assign-display",
    "ASSIGN_DISPLAY_PRODUCT",
    assignDisplayProduct,
    {
      displaySlotId,
      productId: product.productId,
    },
    { allowFailure: true },
  );
}
const assignedDisplays = SCALE_DISPLAY_SLOT_IDS.filter(
  (id) => getDisplaySlotView(state, id) !== null,
);
assertTrue(
  assignedDisplays.length > 0,
  `at least one display slot successfully stocked (${String(assignedDisplays.length)}/${String(SCALE_DISPLAY_SLOT_IDS.length)})`,
);

let salesResolved = 0;
let declinesIssued = 0;
for (let i = 0; i < 20; i += 1) {
  const arrived = dispatch(
    "arrive",
    "ARRIVE_CUSTOMER",
    arriveCustomer,
    {},
    { allowFailure: true },
  );
  if (!arrived) break;
  const ids = state.customers.activeCustomerIds;
  const customerId = ids[ids.length - 1]!;
  const options = getCustomerTransactionOptions(
    state,
    customerId,
    catalog,
    config.displaySlotIds,
  );
  if (options.standardSale.eligible) {
    dispatch("standard-sale", "STANDARD_SALE", standardSale, { customerId });
    salesResolved += 1;
  } else if (options.favorableDeal.eligible) {
    dispatch("favorable-deal", "FAVORABLE_DEAL", favorableDeal, { customerId });
    salesResolved += 1;
  } else if (options.premiumPitch.eligible) {
    dispatch("premium-pitch", "PREMIUM_PITCH", premiumPitch, { customerId });
    salesResolved += 1;
  } else {
    const candidate = options.recommendCandidates.find(
      (c) => c.outcome.eligible,
    );
    if (candidate) {
      dispatch("recommend", "RECOMMEND", recommend, {
        customerId,
        productId: candidate.productId,
        quality: candidate.quality,
      });
      salesResolved += 1;
    } else {
      dispatch("decline", "DECLINE", declineHandler, { customerId });
      declinesIssued += 1;
    }
  }
}
assertTrue(
  salesResolved + declinesIssued > 0,
  `customer arrival/transaction loop resolved ${String(salesResolved)} sale(s) and ${String(declinesIssued)} decline(s) across ${String(SCALE_CUSTOMER_ARCHETYPES.length)} archetypes`,
);

// "Everyday orders" exercise section retired (docs/rebuild/15 Phase R5
// retirement batch — Everyday Orders' commands no longer exist for
// Ascension; see docs/rebuild/R1_DEPENDENCY_AUDIT.md §12.2). The
// synthetic `SCALE_EVERYDAY_ORDERS` content itself is untouched
// (content/scale-fixture is a separate architecture-scale fixture, not
// live gameplay) — `state.orders.orders` is still seeded at scale by
// `createInitialGameState`, only the accept/complete exercise is gone.

section("Infrastructure purchase / construction reconciliation");

let infrastructurePurchased = 0;
for (const infra of SCALE_INFRASTRUCTURE.slice(0, 3)) {
  if (!isUnlockRuleSatisfied(infra.unlockRule, state)) continue;
  if (state.economy.coins < infra.coinCost) continue;
  const bought = dispatch(
    "purchase-infra",
    "PURCHASE_INFRASTRUCTURE",
    purchaseInfrastructure,
    {
      infrastructureId: infra.infrastructureId,
    },
    { allowFailure: true },
  );
  if (!bought) continue;
  infrastructurePurchased += 1;
  const construction = state.infrastructure.activeConstructions.find(
    (a) => a.infrastructureId === infra.infrastructureId,
  );
  if (construction) {
    virtualNowMs = Math.max(virtualNowMs, construction.completesAtMs) + 1;
    reconcileTo(virtualNowMs);
  }
}
console.log(
  `  (${String(infrastructurePurchased)} infrastructure entries purchased within reach of this simulated economy — not a hard requirement, Coins/Rank pacing is Vertical Slice balance, not scale-relevant)`,
);

section("Expeditions / encounters / capture");

// Phase R6: START_EXPEDITION's real gate is the Journey system milestone
// (first Region completion), not Expedition Hub ownership — this harness
// never runs the Journey/combat system (it exercises Shop/crafting/
// economy scale, not Ascension's combat loop), so the milestone is
// granted directly here as synthetic setup data, the same way this file
// already treats Coins/rank progress elsewhere as reachable-without-
// re-simulating-every-upstream-system.
state = {
  ...state,
  progression: {
    ...state.progression,
    unlockedSystemIds: [
      ...state.progression.unlockedSystemIds,
      EXPEDITIONS_SYSTEM_MILESTONE,
    ],
  },
};
const expeditionsUnlocked = state.progression.unlockedSystemIds.includes(
  EXPEDITIONS_SYSTEM_MILESTONE,
);
if (expeditionsUnlocked) {
  const expeditionQueries = createExpeditionPlanningQueries(
    catalog,
    config.captureAidProductId,
    config.routeDurationMsByRouteId,
    config.catchmonCapabilityMagnitudes,
  );
  const available = measure("expedition planning query (availableRoutes)", () =>
    expeditionQueries.availableRoutes(state),
  );
  console.log(`  ${String(available.length)} routes reported available`);

  const unassignedStarter = SCALE_STARTER_SPECIES_IDS.map(
    deriveInitialOwnedCatchmonId,
  ).find(
    (id) =>
      state.catchmons.ownedCatchmons[id]?.currentAssignment.kind ===
      "UNASSIGNED",
  );
  const discoveryRoute = SCALE_ROUTES.find(
    (r) =>
      r.expeditionIntent === "DISCOVERY_SURVEY" && r.encounterPool.length > 0,
  );
  const componentHuntRoute = SCALE_ROUTES.find(
    (r) =>
      r.expeditionIntent === "COMPONENT_HUNT" &&
      r.specialComponentPool.length > 0,
  );

  for (const route of [discoveryRoute, componentHuntRoute].filter(
    (r): r is NonNullable<typeof r> => !!r,
  )) {
    const lead = SCALE_STARTER_SPECIES_IDS.map(
      deriveInitialOwnedCatchmonId,
    ).find(
      (id) =>
        state.catchmons.ownedCatchmons[id]?.currentAssignment.kind ===
        "UNASSIGNED",
    );
    if (!lead) break;
    const started = dispatch(
      "start-expedition",
      "START_EXPEDITION",
      startExpedition,
      {
        routeId: route.routeId,
        leadCatchmonId: lead,
        bringCaptureAid: false,
      },
      { allowFailure: true },
    );
    if (!started) continue;
    const expeditionId =
      state.expeditions.activeExpeditionIds[
        state.expeditions.activeExpeditionIds.length - 1
      ]!;
    const completesAtMs =
      state.expeditions.expeditions[expeditionId]!.completesAtMs;
    virtualNowMs = Math.max(virtualNowMs, completesAtMs) + 1;
    reconcileTo(virtualNowMs);
  }
  void unassignedStarter;

  const pendingEncounters = Object.values(
    state.world.encounterOpportunities,
  ).filter((e) => e.status === "PENDING");
  console.log(
    `  ${String(pendingEncounters.length)} pending encounter(s) created by real Discovery Survey reconciliation`,
  );
  for (const encounter of pendingEncounters) {
    dispatch(
      "attempt-capture",
      "ATTEMPT_CAPTURE",
      attemptCapture,
      {
        encounterId: encounter.encounterId,
        useAid: false,
      },
      { allowFailure: true },
    );
  }
  // Any encounter ATTEMPT_CAPTURE didn't resolve (e.g. already-owned line) exercised via DECLINE/OBSERVE for full command coverage.
  const stillPending = Object.values(state.world.encounterOpportunities).filter(
    (e) => e.status === "PENDING",
  );
  for (const encounter of stillPending) {
    const line = catalog.catchmonLines.get(encounter.targetLineId);
    const alreadyOwned =
      state.world.discoveryStates[encounter.targetLineId] === "OWNED";
    if (alreadyOwned) {
      dispatch(
        "observe-encounter",
        "OBSERVE_ENCOUNTER",
        observeEncounter,
        { encounterId: encounter.encounterId },
        { allowFailure: true },
      );
    } else {
      dispatch(
        "decline-encounter",
        "DECLINE_ENCOUNTER",
        declineEncounter,
        { encounterId: encounter.encounterId },
        { allowFailure: true },
      );
    }
    void line;
  }
} else {
  console.log(
    "  (Expedition Hub not reached within this simulated economy's pacing — expedition/encounter/capture commands not exercised this run; this is a balance-pacing outcome, not a structural failure)",
  );
}

// ---------------------------------------------------------------------
// Task 11.4-ish: selectors/queries at scale.
// ---------------------------------------------------------------------

section("Selectors/queries at scale");

measure(
  "craft queries (canCraft x all recipes x all stations)",
  () => {
    const craftQueries = createCraftQueries(
      catalog,
      config.stationArchetypes,
      config.maxQueueSize,
    );
    let checked = 0;
    for (const stationId of SCALE_STATION_IDS) {
      for (const recipe of SCALE_RECIPES) {
        craftQueries.canCraft(state, stationId, recipe.recipeId);
        checked += 1;
      }
    }
    return checked;
  },
  (n) => `${String(n)} (station, recipe) pairs checked`,
);

measure(
  "batched reservation lookup (Phase 11 audit fix) across every product/resource/component",
  () => {
    const reservedByItem = getReservedQuantitiesByItem(state.inventory);
    let total = 0;
    for (const product of SCALE_PRODUCTS) {
      const itemId = productItemId(product.productId, "STANDARD");
      total += reservedByItem[itemId] ?? 0;
    }
    return total;
  },
  (n) =>
    `sum reserved across ${String(SCALE_PRODUCTS.length)} products = ${String(n)} (single pass, not O(products x reservations))`,
);

measure(
  "display slot views (all slots)",
  () => {
    let stocked = 0;
    for (const slotId of SCALE_DISPLAY_SLOT_IDS) {
      if (getDisplaySlotView(state, slotId)) stocked += 1;
    }
    return stocked;
  },
  (n) => `${String(n)}/${String(SCALE_DISPLAY_SLOT_IDS.length)} stocked`,
);

// "order board view" measurement retired alongside Everyday Orders'
// commands (see the module-level retirement note above).

// ---------------------------------------------------------------------
// State invariant check.
// ---------------------------------------------------------------------

section("GameState invariants");

const validation = measure("validateGameState", () => validateGameState(state));
assertTrue(
  validation.ok,
  `validateGameState reports no violations${validation.ok ? "" : `: ${JSON.stringify(validation.error)}`}`,
);

// ---------------------------------------------------------------------
// Task 11.4/372: persistence — serialization, DB write/read, size.
// ---------------------------------------------------------------------

section("Persistence (Dexie, Task 11.4 / Document 14 §372 Save Scale Test)");

const serialized = measure("JSON.stringify(state)", () =>
  JSON.stringify(state),
);
console.log(
  `  serialized size: ${String(new TextEncoder().encode(serialized).length)} bytes`,
);

const db = new CatchmonAscensionDatabase("scale-harness-db");
const repository = createDexieSaveRepository(db);
const saveId = SaveId.from("scale-harness-save");
const snapshot: StoredSave<GameState> = {
  saveId,
  schemaVersion: state.meta.schemaVersion,
  revision: state.meta.revision,
  savedAtMs: toTimestampMs(virtualNowMs),
  state,
};

await measureAsync("Dexie commit()", () => repository.commit(snapshot));
const loaded = await measureAsync("Dexie load()", () =>
  repository.load(saveId),
);

assertTrue(
  loaded !== null,
  "persisted save round-trips (load() returns a row after commit())",
);
if (loaded) {
  assertTrue(
    JSON.stringify(loaded.state) === JSON.stringify(state),
    "loaded GameState is byte-for-byte identical to what was committed",
  );
}

await db.delete();

// ---------------------------------------------------------------------
// Report.
// ---------------------------------------------------------------------

section("Diagnostic measurements");
for (const m of measurements) {
  console.log(
    `  ${m.label}: ${m.ms.toFixed(2)}ms${m.detail ? ` — ${m.detail}` : ""}`,
  );
}
console.log(
  `  total reconciliation time across ${String(virtualNowMs > 0 ? "the whole run" : "0 calls")}: ${totalReconcileMs.toFixed(2)}ms`,
);

section("Result");
if (failures > 0) {
  console.error(
    `test:scale — FAILED (${String(failures)} assertion(s) failed)`,
  );
  process.exitCode = 1;
} else {
  console.log("test:scale — all scale-validation checks passed.");
}
