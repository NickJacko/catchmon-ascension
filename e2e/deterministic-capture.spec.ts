import { test, expect, type Page } from "@playwright/test";
import {
  SLICE_SAVE_ID,
  seedSaveFixture,
  readSavedEnvelope,
} from "./helpers/seed-save.ts";

/**
 * Document 15 Task 12.6 — E2E Capture, deterministic coverage: "failure
 * path, protection state, success path, no duplicate ownership."
 *
 * `expedition-and-capture.spec.ts` already exercises the real capture
 * command through a real expedition, but the roll's outcome there is
 * genuinely random (see that file's doc comment) — it can only prove
 * "whichever outcome occurs is handled correctly," not force both a
 * specific failure and a specific success.
 *
 * The fix is a command-id injection seam, not a probability change or a
 * mocked result. `attempt-capture.ts` derives its roll seed via
 * `deriveSubSeed(rootRandomSeed, randomEventCounter,
 * "ATTEMPT_CAPTURE:" + command.commandId)` — a pure, tested, deterministic
 * function (`core/random/deterministic-rng.ts`'s doc comment: "the exact
 * output sequence for a given seed is a compatibility contract"). All
 * three inputs are now controllable from outside the app: `rootRandomSeed`
 * via a seeded save fixture (the same technique `save-migration.spec.ts`
 * uses); `randomEventCounter` is *read back*, not assumed — boot's own
 * reconciliation pass reliably advances it past whatever the fixture set,
 * even against this otherwise-inert fixture (zero unlocked regions, zero
 * infrastructure), and by how much is an implementation detail this test
 * does not need to hardcode; `commandId` was hardcoded to
 * `crypto.randomUUID()` inside `game-store.ts` — `createCommand`'s own doc
 * comment already establishes that `commandId` is "supplied by the
 * caller... rather than generated here", so `game-store.ts` now sources it
 * from a swappable, module-level generator (`setNextCommandIdForTests`)
 * instead of hardcoding the random call inline, the same injection shape
 * already used for `Clock`. A tiny `window` hook (`main.tsx`) makes it
 * reachable from here.
 *
 * Given the real (observed, not assumed) counter, this test calls the
 * *actual* `deriveSubSeed`/`rollSucceeds` production functions — the same
 * code `attempt-capture.ts` calls — to search for a command-id string that
 * produces each desired outcome at the encounter's real, untouched chance
 * (`PROVISIONAL_BASE_CAPTURE_CHANCE` = 3500 bps, no aid, no protection
 * bonus — a completely ordinary capture attempt). Nothing about the
 * button, the command, or the domain handler changes; nothing about
 * production randomness changes; only which command ID that one real
 * dispatch carries.
 *
 * The counter is read as late as possible — immediately before arming and
 * clicking, not right after boot — because `useReconciliationTicker`
 * dispatches `RECONCILE` every 3s for as long as the app is mounted, and
 * a `RECONCILE` can itself consume a random event (confirmed empirically:
 * boot's own first reconciliation pass reliably does, even against this
 * otherwise-inert fixture). A wide gap between reading the counter and
 * dispatching risked a tick landing in between and invalidating the
 * precomputed id; keeping that gap to a single synchronous test step
 * keeps it well under the 3s tick period in practice.
 */

const ROOT_RANDOM_SEED = 1;
const BASE_CHANCE_BPS = 3500;

const TARGET_LINE_ID = "flaumi-line";
const TARGET_SPECIES_ID = "Flamarox";
const ENCOUNTER_ID = "e2e-fixed-encounter";
const EXPEDITION_ID = "e2e-fixed-expedition";

function buildEnvelope(now: number) {
  return {
    saveId: SLICE_SAVE_ID,
    schemaVersion: 1,
    appVersion: "0.0.0-vertical-slice",
    contentVersion: 1,
    revision: 3,
    savedAtMs: now,
    gameState: {
      meta: {
        saveId: SLICE_SAVE_ID,
        schemaVersion: 1,
        createdAtMs: now,
        updatedAtMs: now,
        lastActiveAtMs: now,
        revision: 3,
        rootRandomSeed: ROOT_RANDOM_SEED,
        randomEventCounter: 0,
        contentVersion: 1,
      },
      economy: { coins: 0 },
      inventory: { stacks: {}, reservations: {} },
      shop: { momentum: 0, displaySlots: {}, shopFloorSupportCatchmonIds: [] },
      crafting: { stations: {} },
      customers: { activeCustomerIds: [], customers: {} },
      orders: { activeOrderIds: [], orders: {} },
      catchmons: { ownedCatchmonIds: [], ownedCatchmons: {} },
      expeditions: {
        activeExpeditionIds: [],
        expeditions: {
          [EXPEDITION_ID]: {
            expeditionId: EXPEDITION_ID,
            routeId: "e2e-fixed-route",
            status: "COMPLETED",
            startedAtMs: now - 1000,
            completesAtMs: now,
            leadCatchmonId: "e2e-fixed-lead",
            supportCatchmonIds: [],
            resultSeed: 1,
            leadDiscoveryBoostBonus: 0,
            result: {
              routineRewards: [],
              encounterId: ENCOUNTER_ID,
              resolvedAtMs: now,
            },
          },
        },
      },
      world: {
        unlockedRegionIds: [],
        routeStates: {},
        discoveryStates: {},
        traceProgress: {},
        encounterProtection: {},
        captureProtection: {},
        regionMilestones: {},
        encounterOpportunities: {
          [ENCOUNTER_ID]: {
            encounterId: ENCOUNTER_ID,
            expeditionId: EXPEDITION_ID,
            routeId: "e2e-fixed-route",
            targetLineId: TARGET_LINE_ID,
            targetSpeciesId: TARGET_SPECIES_ID,
            discoveryBoostBonus: 0,
            status: "PENDING",
            createdAtMs: now,
          },
        },
        componentHuntBonusProtection: {},
      },
      progression: {
        rank: 1,
        rankProgress: 0,
        journeyRank: 1,
        journeyRankProgress: 0,
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

async function bootFromSeededEncounter(page: Page): Promise<void> {
  // Shop is no longer the default landing route (docs/rebuild/R0 neutral
  // shell) — still valid regression coverage for gameplay that hasn't
  // retired, so navigate to it explicitly rather than deleting this spec.
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
  await seedSaveFixture(page, buildEnvelope(Date.now()));
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
}

async function openSeededEncounter(page: Page): Promise<void> {
  await page.getByRole("link", { name: /World/i }).first().click();
  await page.getByRole("button", { name: "View Expedition Result" }).click();
  await page.getByRole("button", { name: "View Encounter" }).click();
  await expect(
    page.getByRole("button", { name: "Attempt Capture" }),
  ).toBeEnabled();
}

/**
 * Reads the *real* `randomEventCounter` the app is about to dispatch
 * against, then asks the app itself (via `__e2eFindCaptureCommandId__` —
 * see `main.tsx`) to run the same `deriveSubSeed`/`rollSucceeds`
 * production functions `attempt-capture.ts` calls, finding a command-id
 * string that produces `desiredOutcome` at this encounter's real,
 * untouched chance. Delegated to the app bundle rather than imported
 * here directly because `e2e/**` and `src/**` type-check as separate
 * TypeScript projects (`tsconfig.node.json` vs `tsconfig.app.json`) with
 * no cross-project reference between them.
 */
async function findCommandIdForOutcome(
  page: Page,
  desiredOutcome: boolean,
): Promise<string> {
  const envelope = await readSavedEnvelope(page, SLICE_SAVE_ID);
  const counter = envelope?.gameState.meta.randomEventCounter ?? 0;
  const found = await page.evaluate(
    ({ rootSeed, counter: eventCounter, chanceBps, outcome }) => {
      return (
        globalThis as unknown as {
          __e2eFindCaptureCommandId__?: (
            rootSeed: number,
            counter: number,
            chanceBps: number,
            desiredOutcome: boolean,
          ) => string | null;
        }
      ).__e2eFindCaptureCommandId__?.(
        rootSeed,
        eventCounter,
        chanceBps,
        outcome,
      );
    },
    {
      rootSeed: ROOT_RANDOM_SEED,
      counter,
      chanceBps: BASE_CHANCE_BPS,
      outcome: desiredOutcome,
    },
  );
  if (!found) {
    throw new Error(
      `No command-id candidate found producing ${String(desiredOutcome)} within 1000 tries`,
    );
  }
  return found;
}

/** Arms the command-id seam for exactly the next dispatch — see the module doc comment. `e2e/**` type-checks under `tsconfig.node.json` (no DOM lib), so `window` is typed via an inline assertion rather than a `declare global` — this hook is used in exactly one file, unlike the shared IndexedDB shim in `helpers/seed-save.ts`. */
async function armNextCommandId(page: Page, id: string): Promise<void> {
  await page.evaluate((commandId) => {
    (
      globalThis as unknown as {
        __e2eSetNextCommandId__?: (id: string) => void;
      }
    ).__e2eSetNextCommandId__?.(commandId);
  }, id);
}

test("a deterministic failed capture increases protection and grants no ownership", async ({
  page,
}) => {
  await bootFromSeededEncounter(page);
  await openSeededEncounter(page);
  // Read the counter and compute the command id as late as possible,
  // immediately before arming/clicking — see the module doc comment on
  // `useReconciliationTicker`'s 3s tick: the wider this window, the more
  // likely a tick's own random-event consumption lands inside it.
  const failureCommandId = await findCommandIdForOutcome(page, false);

  await armNextCommandId(page, failureCommandId);
  await page.getByRole("button", { name: "Attempt Capture" }).click();

  await expect(page.getByText("FAILED", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Protection progress: 1 failed attempt(s)."),
  ).toBeVisible();

  // No ownership granted on failure.
  await page.locator(".ds-sheet__close").click();
  await page
    .getByRole("link", { name: /Catchmons/i })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "Roster" })).toBeVisible();
  expect(await page.locator(".grid-cards .ds-catchmon-card").count()).toBe(0);
});

test("a deterministic successful capture grants ownership exactly once, surviving reload with no duplicate", async ({
  page,
}) => {
  await bootFromSeededEncounter(page);
  await openSeededEncounter(page);
  const successCommandId = await findCommandIdForOutcome(page, true);

  await armNextCommandId(page, successCommandId);
  await page.getByRole("button", { name: "Attempt Capture" }).click();

  await expect(page.getByText("CAPTURED", { exact: true })).toBeVisible();
  await page.locator(".ds-sheet__close").click();

  await page
    .getByRole("link", { name: /Catchmons/i })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "Roster" })).toBeVisible();
  expect(await page.locator(".grid-cards .ds-catchmon-card").count()).toBe(1);

  // No duplicate ownership across a reload — the same allowed dispatch
  // must not be replayed or re-granted just from rebooting.
  await page.reload();
  await expect(page.locator(".app-tabbar")).toBeVisible();
  await page
    .getByRole("link", { name: /Catchmons/i })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "Roster" })).toBeVisible();
  expect(await page.locator(".grid-cards .ds-catchmon-card").count()).toBe(1);
});
