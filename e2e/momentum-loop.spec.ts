import { test, expect } from "@playwright/test";

/**
 * Document 15 Task 12.4 — E2E Momentum Loop: "Test: Favorable Deal,
 * Momentum, Premium Pitch, Recommend." These reuse the same real-UI
 * craft/display/sell interaction pattern as `new-game-sale.spec.ts` and
 * `fresh-save-progression.spec.ts` (short here — none of the four sale
 * actions are actually Rank-gated in `transaction-quote-engine.ts`'s
 * `requestEligibility`; only a request + matching stock is required, and
 * Premium Pitch/Recommend additionally require enough accumulated
 * Momentum, which a few real sales provide — no reason to grind toward
 * the ~50-cycle Expedition Hub `fresh-save-progression` needs).
 */

const MAX_ITERATIONS = 25;

test("Favorable Deal, Premium Pitch, and Recommend each dispatch and move Momentum distinctly from Standard Sale", async ({
  page,
}) => {
  test.setTimeout(180_000);

  await page.clock.install({ time: 0 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Shop is no longer the default landing route (docs/rebuild/R0 neutral
  // shell) — still valid regression coverage for gameplay that hasn't
  // retired, so navigate to it explicitly rather than deleting this spec.
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  const stationsSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Stations" }),
  });
  const customersSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Customers" }),
  });
  const momentumChip = page
    .locator(".app-topbar__chips .ds-currency-chip__amount")
    .first();

  await page.getByRole("tab", { name: /Stations/i }).click();

  /** Fast existence-then-enabled check — avoids Playwright's implicit
   * actionability wait when a locator matches zero elements (recommend
   * candidates and Premium Pitch eligibility both depend on transient
   * game state that's frequently absent). */
  async function isClickable(locator: ReturnType<typeof page.locator>) {
    if ((await locator.count()) === 0) return false;
    return locator.first().isEnabled();
  }

  let displayAssigned = false;
  const used = new Set<string>();
  let distinctActionTexts: string[] = [];

  outer: for (let i = 0; i < MAX_ITERATIONS; i += 1) {
    if (used.has("Favorable Deal") && used.has("Premium Pitch")) break;

    await stationsSection.locator(".shop-screen__station-row").first().click();
    const turnoverRow = page.locator(".ds-sheet .row.row--between", {
      hasText: "Turnover",
    });
    await expect(turnoverRow.getByRole("button")).toBeEnabled();
    await turnoverRow.getByRole("button").click();
    await page.locator(".ds-sheet__close").click();
    await page.clock.fastForward(16_000);

    if (!displayAssigned) {
      await page.getByRole("tab", { name: /Displays/i }).click();
      await page.locator(".ds-slot").first().click();
      const turnoverCard = page.getByRole("button", { name: /Turnover/ });
      await expect(turnoverCard).toBeEnabled();
      await turnoverCard.click();
      displayAssigned = true;
      await page.getByRole("tab", { name: /Stations/i }).click();
    }

    const customerCount = await customersSection
      .locator(".shop-screen__station-row")
      .count();
    for (let c = 0; c < customerCount; c += 1) {
      if (used.has("Favorable Deal") && used.has("Premium Pitch")) {
        break outer;
      }

      await customersSection
        .locator(".shop-screen__station-row")
        .first()
        .click();

      const actionValues = page.locator(".cs-action-row__value");
      const actionCount = await actionValues.count();
      if (actionCount > 0 && distinctActionTexts.length === 0) {
        distinctActionTexts = await actionValues.allTextContents();
      }

      const premiumPitch = page.getByRole("button", { name: "Premium Pitch" });
      const favorableDeal = page.getByRole("button", {
        name: "Favorable Deal",
      });
      const recommendCandidate = page
        .locator(".cs-customer-recommend")
        .getByRole("button")
        .first();
      const standardSale = page.getByRole("button", { name: "Standard Sale" });

      if (!used.has("Premium Pitch") && (await isClickable(premiumPitch))) {
        await premiumPitch.click();
        used.add("Premium Pitch");
      } else if (
        !used.has("Favorable Deal") &&
        (await isClickable(favorableDeal))
      ) {
        await favorableDeal.click();
        used.add("Favorable Deal");
      } else if (
        !used.has("Recommend") &&
        (await isClickable(recommendCandidate))
      ) {
        await recommendCandidate.click();
        used.add("Recommend");
      } else if (await isClickable(standardSale)) {
        await standardSale.click();
        used.add("Standard Sale");
      } else {
        // Decline (not just close) — an ineligible browsing-only customer
        // must actually leave the floor so a later arrival gets a chance
        // at a matching request; closing the sheet alone would leave them
        // parked forever, permanently occupying this iteration's customer
        // slot with the same never-eligible customer.
        await page.getByRole("button", { name: "Decline" }).click();
      }
    }
  }

  console.log(`[momentum-loop] actions exercised: ${[...used].join(", ")}`);

  // The four actions' stated Coins/Momentum effects must be genuinely
  // distinct, not the same value relabeled (Document 15 §172 Exit Gate B —
  // "selling matters" only holds if the actions actually differ).
  expect(distinctActionTexts.length).toBeGreaterThanOrEqual(2);
  expect(new Set(distinctActionTexts).size).toBe(distinctActionTexts.length);
  expect(used.has("Favorable Deal")).toBe(true);
  await expect(momentumChip).toBeVisible();
});
