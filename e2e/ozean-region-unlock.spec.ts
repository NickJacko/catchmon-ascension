import { test, expect } from "@playwright/test";
import {
  SLICE_SAVE_ID,
  readSavedEnvelope,
  seedSaveFixture,
} from "./helpers/seed-save.ts";

/**
 * Ozean region unlock — Document 08 §3 Region Unlock, Document 09 §50-54
 * Region Progression Model; docs/rebuild/15 Phase R6 migration (Ozean's
 * unlock rule moved off the legacy `SHOP_RANK` + Vulkankrater
 * route-completion signal onto the new locked target model: "global/
 * Journey readiness (Journey Rank) + prior-World milestone (Vulkankrater's
 * Region-completion milestone) -> Ozean unlock" —
 * `content/vertical-slice/worldContent.ts`'s `OZEAN_UNLOCK_RULE_ID`).
 * Proves, through the real UI/domain path (not a manual verification
 * script), the full loop:
 *
 * locked Ozean -> correct locked UI -> seed both new unlock signals
 * (Journey Rank threshold + Vulkankrater's REGION_COMPLETED milestone)
 * alongside a due Ozean Tidal Shallows expedition -> reload -> Ozean
 * unlocks, the expedition's routine reward resolves to the real Reef Kelp
 * resource exactly once -> a second reload does not re-unlock/re-grant
 * anything -> Ozean's 3 routes are genuinely reachable from the World
 * screen.
 *
 * Uses a seeded save fixture (same technique as `save-migration.spec.ts`/
 * `deterministic-capture.spec.ts`) rather than a real-time grind through
 * the Journey combat loop — `fresh-save-progression.spec.ts` already
 * covers the long real-DOM-interaction path; this spec stays focused on
 * Ozean's own unlock/reward mechanics.
 */

const OWNED_LEAD_ID = "owned-aquilor-ozean-e2e";
const EXPEDITION_ID = "expo-ozean-tidal-shallows-e2e";
const OZEAN_TIDAL_SHALLOWS_ROUTE_ID = "ozean-tidal-shallows";
// START_REGION_ID's raw value (content/vertical-slice/verticalSliceManifest.ts) — Vulkankrater's real internal RegionId.
const VULKANKRATER_REGION_ID = "grasland";
const REGION_COMPLETED_MILESTONE = "REGION_COMPLETED";
const REEF_KELP_ITEM_ID = "ozean-resource-reef-kelp-item";
// PROVISIONAL_SUPPLY_RUN_ROUTINE_REWARD_QUANTITY (balance.ts) — Tidal
// Shallows is a SUPPLY_RUN route, so it grants this exact quantity.
const EXPECTED_REEF_KELP_QUANTITY = 4;

function buildOzeanThresholdEnvelope(nowMs: number) {
  return {
    saveId: SLICE_SAVE_ID,
    schemaVersion: 1,
    appVersion: "0.0.0-vertical-slice",
    contentVersion: 1,
    revision: 5,
    savedAtMs: nowMs,
    gameState: {
      meta: {
        saveId: SLICE_SAVE_ID,
        schemaVersion: 1,
        createdAtMs: nowMs - 200_000,
        updatedAtMs: nowMs,
        lastActiveAtMs: nowMs,
        revision: 5,
        rootRandomSeed: 12345,
        randomEventCounter: 0,
        contentVersion: 1,
      },
      economy: { coins: 0 },
      inventory: { stacks: {}, reservations: {} },
      shop: { momentum: 0, displaySlots: {}, shopFloorSupportCatchmonIds: [] },
      crafting: { stations: {} },
      customers: { activeCustomerIds: [], customers: {} },
      orders: { activeOrderIds: [], orders: {} },
      catchmons: {
        ownedCatchmonIds: [OWNED_LEAD_ID],
        ownedCatchmons: {
          [OWNED_LEAD_ID]: {
            ownedCatchmonId: OWNED_LEAD_ID,
            lineId: "plipsy-line",
            currentSpeciesId: "Aquilor",
            level: 1,
            xp: 0,
            evolutionReadiness: "NOT_READY",
            currentAssignment: {
              kind: "EXPEDITION",
              expeditionId: EXPEDITION_ID,
            },
          },
        },
      },
      // Already due (completesAtMs in the past) — the real boot-time
      // reconciliation pass (app/boot.ts) resolves it on the very first
      // load, exactly like any offline-elapsed expedition would.
      expeditions: {
        activeExpeditionIds: [EXPEDITION_ID],
        expeditions: {
          [EXPEDITION_ID]: {
            expeditionId: EXPEDITION_ID,
            routeId: OZEAN_TIDAL_SHALLOWS_ROUTE_ID,
            status: "IN_PROGRESS",
            startedAtMs: nowMs - 60_000,
            completesAtMs: nowMs - 1_000,
            leadCatchmonId: OWNED_LEAD_ID,
            supportCatchmonIds: [],
            resultSeed: 999,
            leadDiscoveryBoostBonus: 0,
          },
        },
      },
      world: {
        // Deliberately NOT yet unlocked — proves the region-unlock
        // reconciliation pass, not just a pre-seeded already-unlocked
        // array, is what promotes Ozean.
        unlockedRegionIds: [VULKANKRATER_REGION_ID],
        routeStates: {},
        discoveryStates: { "plipsy-line": "OWNED" },
        traceProgress: {},
        encounterProtection: {},
        captureProtection: {},
        // Vulkankrater's Region-completion milestone (`ATTEMPT_STAGE`
        // writes this generically on any Region's first completion-boss
        // WIN) — half of Ozean's two-signal Phase R6 unlock rule.
        regionMilestones: {
          [VULKANKRATER_REGION_ID]: [REGION_COMPLETED_MILESTONE],
        },
        encounterOpportunities: {},
        componentHuntBonusProtection: {},
      },
      // `rank`/`journeyRank` are both DERIVED fields (`rankForProgress`,
      // domain/progression/shop-rank.ts: floor(progress / progressPerRank)
      // + 1) — recomputed from their own `*Progress` counterpart on the
      // very next reconciliation pass, so an inconsistent seeded pair
      // gets silently "corrected" back down. `journeyRankProgress: 40` is
      // comfortably past the real `PROVISIONAL_JOURNEY_RANK_THRESHOLD_
      // OZEAN` (2) at the real `PROVISIONAL_JOURNEY_RANK_PROGRESS_PER_
      // RANK` (20) — Journey Rank 3. Shop's own `rank`/`rankProgress` are
      // irrelevant to Ozean's Phase R6 unlock rule now, left at their
      // fresh-game defaults.
      progression: {
        rank: 1,
        rankProgress: 0,
        journeyRank: 3,
        journeyRankProgress: 40,
        earnedMilestoneIds: [],
        unlockedSystemIds: [],
      },
      infrastructure: {
        ownedInfrastructureIds: [],
        upgradeLevels: {},
        activeConstructions: [],
      },
      // docs/rebuild/15 Phases R2-R5: GameState grew these areas —
      // save-envelope.ts's schema now requires them, so a hand-built
      // fixture predating them fails validation and silently loses to a
      // fresh game.
      journey: {
        currentStageIndex: 0,
        clearedStageIds: [],
        stableFarmStageIndex: -1,
      },
      loadout: {
        bondSupportCatchmonIds: [],
        equippedSkillIds: [],
        relicMatrix: {},
      },
      forge: { echoCharges: 0, totalRelicsForged: 0, forgeInsight: 0 },
      relicInventory: { ownedRelicInstanceIds: [], relics: {} },
      skills: { unlockedSkillIds: [] },
    },
  };
}

test("Ozean stays locked until both unlock signals are met, then unlocks, persists across reload, and Tidal Shallows resolves its reward exactly once", async ({
  page,
}) => {
  // 1. Boot once normally — creates the DB, and gives us a genuinely
  // fresh game to check the LOCKED presentation against.
  // Shop is no longer the default landing route (docs/rebuild/R0 neutral
  // shell) — still valid regression coverage for gameplay that hasn't
  // retired, so navigate to it explicitly rather than deleting this spec.
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  // 2. Locked Ozean -> correct preview/locked UI, not normal "View Routes".
  await page.getByRole("link", { name: /World/i }).first().click();
  const ozeanPanel = page.locator(".ds-panel", { hasText: "Ozean" });
  await expect(ozeanPanel).toBeVisible();
  await expect(ozeanPanel.getByText("Locked")).toBeVisible();
  await expect(
    ozeanPanel.getByRole("button", { name: "View Routes" }),
  ).toHaveCount(0);

  // Back to /shop before seeding/reloading, matching every other
  // seeded-fixture spec's own proven sequence. Shop is no longer a
  // primary-nav destination (docs/rebuild/R0 neutral shell removed it
  // from BottomTabBar) — navigate directly rather than clicking a nav
  // link that no longer exists.
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  // 3. Satisfy Journey Rank + Vulkankrater's Region-completion milestone
  // (seeded directly, matching save-migration.spec.ts/deterministic-
  // capture.spec.ts's technique) alongside a due Ozean expedition.
  await seedSaveFixture(page, buildOzeanThresholdEnvelope(Date.now()));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  // 4. Ozean unlocks, and this is real persisted domain state (not just a
  // UI flag) — read the same envelope the app itself wrote back.
  const afterUnlock = await readSavedEnvelope(page, SLICE_SAVE_ID);
  expect(afterUnlock?.gameState.world?.unlockedRegionIds).toContain("ozean");
  expect(afterUnlock?.gameState.world?.unlockedRegionIds).toContain("grasland");

  // 5. Tidal Shallows' guaranteed reward resolved to the real Reef Kelp
  // resource (not the Vulkankrater-shared one), exactly once.
  expect(
    afterUnlock?.gameState.inventory?.stacks[REEF_KELP_ITEM_ID]?.quantity,
  ).toBe(EXPECTED_REEF_KELP_QUANTITY);

  // 6. Reload preserves the unlock AND does not double-grant the reward
  // (the expedition already left activeExpeditionIds, so a second
  // reconciliation pass finds nothing left to resolve).
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
  const afterReload = await readSavedEnvelope(page, SLICE_SAVE_ID);
  expect(afterReload?.gameState.world?.unlockedRegionIds).toContain("ozean");
  expect(
    afterReload?.gameState.inventory?.stacks[REEF_KELP_ITEM_ID]?.quantity,
  ).toBe(EXPECTED_REEF_KELP_QUANTITY);

  // 7. Ozean's routes are genuinely reachable through the real UI now.
  await page.getByRole("link", { name: /World/i }).first().click();
  await expect(
    ozeanPanel.getByRole("button", { name: "View Routes" }),
  ).toBeVisible();
  await ozeanPanel.getByRole("button", { name: "View Routes" }).click();
  await expect(page.locator(".row.row--between")).toHaveCount(3);
});
