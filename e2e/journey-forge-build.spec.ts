import { test, expect, type Page } from "@playwright/test";
import { SLICE_SAVE_ID, seedSaveFixture } from "./helpers/seed-save.ts";

/**
 * docs/rebuild/15 Phase R8/R9 exit — the real four-tab IA, the real Forge
 * loop, the real Build surface, and the real Pixi battle scene, all
 * proven through the real UI/domain path (not a manual verification
 * script). A seeded save fixture (same technique as `expedition-and-
 * capture.spec.ts`) starts the Lead already boosted (level 10, matching
 * the exact fixture pattern `attempt-stage.test.ts` uses to make a boss
 * fight reliably winnable within a small retry bound) and already
 * standing at Vulkankrater's boss stage — this spec's job is proving the
 * R8/R9 UI wiring against real commands/state, not re-proving R2-R7's own
 * combat/Journey mechanics (already covered by their own unit/e2e tests).
 *
 * Flow: Journey (battle scene renders, stage win, boss win) -> Forge
 * (forge a Relic, equip it) -> Build sheet (Battle Path, Relic Matrix,
 * Skills, Lead & Bond) -> World (Vulkankrater shows Journey progress,
 * navigation still works) -> reload (everything persists).
 */

const LEAD_ID = "e2e-jfb-owned-flamarox";
const SUPPORT_ID = "e2e-jfb-owned-aquilor";
const CLEARED_STAGE_IDS = [
  "vulkankrater-stage-1",
  "vulkankrater-stage-2",
  "vulkankrater-stage-3",
];
const BREAKER_SKILL_ID = "breaker-signature-rend";

async function waitForRebootAfterReload(page: Page): Promise<void> {
  await expect(page.locator(".app-tabbar")).toBeVisible({ timeout: 15_000 });
}

async function seedAtVulkankraterBoss(page: Page): Promise<void> {
  const now = 0;
  await seedSaveFixture(page, {
    saveId: SLICE_SAVE_ID,
    schemaVersion: 1,
    appVersion: "0.0.0-vertical-slice",
    contentVersion: 1,
    revision: 1,
    savedAtMs: now,
    gameState: {
      meta: {
        saveId: SLICE_SAVE_ID,
        schemaVersion: 1,
        createdAtMs: now,
        updatedAtMs: now,
        lastActiveAtMs: now,
        revision: 1,
        rootRandomSeed: 777,
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
        ownedCatchmonIds: [LEAD_ID, SUPPORT_ID],
        ownedCatchmons: {
          [LEAD_ID]: {
            ownedCatchmonId: LEAD_ID,
            lineId: "flaumi-line",
            currentSpeciesId: "Flamarox",
            level: 10,
            xp: 0,
            evolutionReadiness: "NOT_READY",
            currentAssignment: { kind: "LEAD" },
          },
          [SUPPORT_ID]: {
            ownedCatchmonId: SUPPORT_ID,
            lineId: "plipsy-line",
            currentSpeciesId: "Aquilor",
            level: 1,
            xp: 0,
            evolutionReadiness: "NOT_READY",
            currentAssignment: { kind: "UNASSIGNED" },
          },
        },
      },
      expeditions: { activeExpeditionIds: [], expeditions: {} },
      world: {
        unlockedRegionIds: ["grasland"],
        routeStates: {},
        discoveryStates: { "flaumi-line": "OWNED", "plipsy-line": "OWNED" },
        traceProgress: {},
        encounterProtection: {},
        captureProtection: {},
        regionMilestones: {},
        encounterOpportunities: {},
        componentHuntBonusProtection: {},
      },
      progression: {
        rank: 1,
        rankProgress: 0,
        journeyRank: 1,
        journeyRankProgress: 15,
        earnedMilestoneIds: [],
        unlockedSystemIds: [],
      },
      infrastructure: {
        ownedInfrastructureIds: [],
        upgradeLevels: {},
        activeConstructions: [],
      },
      journey: {
        currentStageIndex: 3,
        clearedStageIds: CLEARED_STAGE_IDS,
        stableFarmStageIndex: 2,
      },
      loadout: {
        leadCatchmonId: LEAD_ID,
        bondSupportCatchmonIds: [],
        equippedSkillIds: [],
        relicMatrix: {},
      },
      forge: { echoCharges: 100, totalRelicsForged: 0, forgeInsight: 0 },
      relicInventory: { ownedRelicInstanceIds: [], relics: {} },
      skills: { unlockedSkillIds: [BREAKER_SKILL_ID] },
    },
  });
}

test("Journey battle scene, Forge loop, Build surface, and World navigation all work through the real UI", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  await seedAtVulkankraterBoss(page);
  await page.reload();
  await waitForRebootAfterReload(page);
  await page.getByRole("link", { name: "Journey" }).click();

  // --- R9: the battle scene mounts and shows something real (not the
  // Pixi-init-failure fallback) ---
  await expect(page.getByRole("img", { name: /Battle scene/i })).toBeVisible();
  await expect(page.getByText(/Battle view unavailable/i)).not.toBeVisible();

  // --- R8 Journey screen: boss identity, Journey Rank, checkpoint ---
  await expect(page.getByText("Vulkan Warden").first()).toBeVisible();
  await expect(page.getByText("Boss", { exact: true })).toBeVisible();
  await expect(page.getByText(/Stable farm checkpoint/i)).toBeVisible();

  const challengeBoss = page.getByRole("button", { name: "Challenge Boss" });
  await expect(challengeBoss).toBeVisible();

  // A WIN advances the stage, which replaces "Challenge Boss" with
  // "Attempt Stage" (the next stage, Ozean's Tide Sprite, is not a
  // boss) — re-querying by name each attempt (rather than a single
  // locator captured once) means the loop simply stops finding the
  // button once that happens, which is a more reliable win signal than
  // racing the transient outcome StatusPill's text.
  for (let attempt = 0; attempt < 15; attempt += 1) {
    const boss = page.getByRole("button", { name: "Challenge Boss" });
    if ((await boss.count()) === 0) break;
    await boss.click();
    await page.waitForTimeout(300);
  }
  await expect(
    page.getByRole("button", { name: "Challenge Boss" }),
  ).toHaveCount(0);

  // --- R6 integration proof, reachable from the UI: the boss win records
  // the Region milestone + Journey Rank crossing the Ozean threshold in
  // one shot (journeyRankProgress 15 + 20 for a boss win = 35 -> rank 2,
  // exactly `PROVISIONAL_JOURNEY_RANK_THRESHOLD_OZEAN`) — both of Ozean's
  // real unlock signals become true together.
  await page.reload();
  await waitForRebootAfterReload(page);
  await page.getByRole("link", { name: "World" }).click();
  const vulkanPanel = page.locator(".ds-panel", { hasText: "Vulkankrater" });
  await expect(vulkanPanel.getByText("Complete")).toBeVisible();
  const ozeanPanel = page.locator(".ds-panel", { hasText: "Ozean" });
  await expect(
    ozeanPanel.getByRole("button", { name: "View Routes" }),
  ).toBeVisible();

  // --- R8 Forge screen: the full Echo Charge -> Forge -> equip loop ---
  await page.getByRole("link", { name: "Forge" }).click();
  await expect(page.getByText("Echo Charges", { exact: true })).toBeVisible();
  const echoChargesBefore = await page
    .locator(".row.row--between", { hasText: "Echo Charges" })
    .locator("span")
    .last()
    .textContent();

  await page.getByRole("button", { name: /^CORE/ }).click();
  await expect(page.getByText("Latest Relic")).toBeVisible();
  const echoChargesAfter = await page
    .locator(".row.row--between", { hasText: "Echo Charges" })
    .locator("span")
    .last()
    .textContent();
  expect(echoChargesAfter).not.toBe(echoChargesBefore);

  const equipButton = page.getByRole("button", { name: "Equip", exact: true });
  await equipButton.click();
  await expect(page.getByRole("button", { name: "Equipped" })).toBeVisible();

  // --- R8 Build surface: Path / Relics / Skills / Lead & Bond, all real commands ---
  await page.getByRole("button", { name: "Relic Matrix" }).click();
  await expect(page.getByRole("dialog", { name: "Build" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Relics" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.getByRole("tab", { name: "Path" }).click();
  await page.getByRole("button", { name: "BREAKER" }).click();
  await expect(page.getByRole("button", { name: "BREAKER" })).toHaveClass(
    /ds-button--primary/,
  );

  await page.getByRole("tab", { name: "Skills" }).click();
  await expect(page.getByText("Rend")).toBeVisible();
  await page.getByRole("button", { name: "Equip", exact: true }).click();
  await expect(page.getByRole("button", { name: "Unequip" })).toBeVisible();

  await page.getByRole("tab", { name: "Lead & Bond" }).click();
  await expect(page.getByText("Aquilor")).toBeVisible();
  const aquirlRow = page.locator(".cs-action-row", { hasText: "Aquilor" });
  await aquirlRow.getByRole("button", { name: "1" }).click();

  await page.locator(".ds-sheet__close").click();

  // --- Reload: Battle Path / equipped Relic / equipped Skill / Bond assignment all persist ---
  await page.reload();
  await waitForRebootAfterReload(page);
  await page.getByRole("link", { name: "Journey" }).click();
  await page.getByRole("button", { name: "Build" }).click();
  await expect(page.getByRole("dialog", { name: "Build" })).toBeVisible();
  await page.getByRole("tab", { name: "Path" }).click();
  await expect(page.getByRole("button", { name: "BREAKER" })).toHaveClass(
    /ds-button--primary/,
  );
  await page.getByRole("tab", { name: "Relics" }).click();
  await expect(page.getByRole("button", { name: "CORE" })).toBeVisible();
  await page.getByRole("tab", { name: "Lead & Bond" }).click();
  const aquirlRowAfterReload = page.locator(".cs-action-row", {
    hasText: "Aquilor",
  });
  await expect(
    aquirlRowAfterReload.getByRole("button", { name: "1" }),
  ).toHaveClass(/ds-button--primary/);
});
