import { test, expect } from "@playwright/test";

/**
 * Document 15 Task 12.3 — E2E New Game -> Sale: "Playwright: start fresh,
 * craft, display, Standard Sale, persistence." Deliberately does NOT reuse
 * `fresh-save-progression.spec.ts`'s ~3.6-minute, 60-iteration Expedition
 * Hub grind — that scenario only needs *one* craft/display/sale cycle, not
 * a full progression run, so it uses the same real-UI interaction pattern
 * (Stations tab -> station row -> Craft -> close -> Displays tab -> slot
 * -> assign -> Customers -> Standard Sale) for far fewer cycles.
 */

test("fresh save: craft, display, Standard Sale, and the result persists across reload", async ({
  page,
}) => {
  test.setTimeout(60_000);

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

  await page.getByRole("tab", { name: /Stations/i }).click();

  // Craft: open the Provision Station, push the "Turnover" recipe.
  await stationsSection.locator(".shop-screen__station-row").first().click();
  const turnoverRow = page.locator(".ds-sheet .row.row--between", {
    hasText: "Turnover",
  });
  await expect(turnoverRow.getByRole("button")).toBeEnabled();
  await turnoverRow.getByRole("button").click();
  await page.locator(".ds-sheet__close").click();
  await page.clock.fastForward(16_000); // past the 15s craft duration + a reconcile tick

  // Display: assign the freshly-crafted stock to the first slot.
  await page.getByRole("tab", { name: /Displays/i }).click();
  await page.locator(".ds-slot").first().click();
  const turnoverCard = page.getByRole("button", { name: /Turnover/ });
  await expect(turnoverCard).toBeEnabled();
  await turnoverCard.click(); // DisplaySheet closes itself on assignment
  await page.getByRole("tab", { name: /Stations/i }).click();

  // Sell: resolve customers via Standard Sale until one succeeds (a
  // browsing-only customer with no matching request cannot Standard-Sale;
  // Decline and move to the next, matching `fresh-save-progression`'s
  // established resilience against customer-request variance).
  let sold = false;
  for (let attempt = 0; attempt < 6 && !sold; attempt += 1) {
    const customerRow = customersSection
      .locator(".shop-screen__station-row")
      .first();
    if ((await customerRow.count()) === 0) {
      await page.clock.fastForward(5_000);
      continue;
    }
    await customerRow.click();
    const standardSale = page.getByRole("button", { name: "Standard Sale" });
    if (await standardSale.isEnabled().catch(() => false)) {
      await standardSale.click();
      sold = true;
    } else {
      await page.getByRole("button", { name: "Decline" }).click();
      await page.clock.fastForward(5_000);
    }
  }
  expect(sold).toBe(true);

  const coinsAfterSale = await page
    .locator(".app-topbar__chips .ds-currency-chip__amount")
    .last()
    .textContent();
  expect(Number(coinsAfterSale)).toBeGreaterThan(0);

  // Persistence: reload and confirm the sale's Coins survived — not reset
  // to a fresh game, not lost to an unpersisted in-memory-only change.
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
  const coinsAfterReload = await page
    .locator(".app-topbar__chips .ds-currency-chip__amount")
    .last()
    .textContent();
  expect(coinsAfterReload).toBe(coinsAfterSale);
});
