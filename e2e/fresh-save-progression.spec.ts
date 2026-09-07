import { test, expect } from "@playwright/test";

/**
 * Phase 8 exit-gate fix — Document 15's exit gate requires the complete
 * slice loop to be reachable "through React DOM" from a genuinely fresh
 * save: craft -> display -> sell -> earn Coins + Shop Rank -> repeat ->
 * reach the Expedition Hub unlock -> purchase/build it. Every action here
 * is a real click dispatching a real command through the real Game
 * Engine — nothing is driven via `page.evaluate` state injection.
 *
 * Uses Playwright's clock API to fast-forward the browser's `Date`/timer
 * APIs (which `SystemClock`, the reconciliation ticker, and the customer
 * arrival ticker all read/use) so craft durations (15s) and the
 * Expedition Hub's construction timer (30s) resolve instantly instead of
 * requiring real wall-clock waits.
 *
 * `MAX_ITERATIONS` is a safety ceiling with an early `break` the moment
 * the Hub is owned, not a fixed cycle count — measured, this genuine fresh-
 * save economy loop actually needs ~47-51 real craft/sell cycles to earn
 * enough Coins + Rank (varying slightly run-to-run with customer-arrival
 * timing), leaving real headroom under 60 without the test ever paying for
 * cycles it doesn't need.
 *
 * Runtime investigation (Phase 10 follow-up): instrumented timing showed
 * `page.clock.fastForward()` itself is cheap (~9-11s of the ~200-260s total
 * — Playwright's Clock fires each due timer at most once per call,
 * regardless of the virtual duration jumped). The dominant cost (~96%) is
 * the real Playwright DOM actions themselves — clicks, actionability
 * waits, React/Pixi re-renders — which is exactly the real-UI guarantee
 * this test exists to prove, not overhead to eliminate. One genuine,
 * accessibility-motivated win was found and applied: `Sheet.css`'s 220ms
 * mount animation replayed on every one of this loop's dozens of sheet
 * opens, and Playwright's actionability engine waits for an element's
 * bounding box to settle before interacting with it. Making that
 * animation respect `prefers-reduced-motion` (a real a11y affordance, not
 * a test-only shortcut) and having this test opt into it cut measured
 * per-iteration DOM-action time by ~29% (~5.3s -> ~3.75s/iteration; total
 * wall time ~5.0min -> ~3.6min) with zero change to what's clicked,
 * asserted, or dispatched.
 */

const MAX_ITERATIONS = 60;

test("fresh save reaches and unlocks the Expedition Hub through real DOM interactions", async ({
  page,
}) => {
  test.setTimeout(300_000);

  await page.clock.install({ time: 0 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Shop is no longer the default landing route (docs/rebuild/R0 neutral
  // shell) — still valid regression coverage for gameplay that hasn't
  // retired, so navigate to it explicitly rather than deleting this spec.
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  const hubPanel = page.locator(".ds-panel", {
    has: page.getByRole("heading", { name: "Expedition Hub" }),
  });
  const stationsSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Stations" }),
  });
  const customersSection = page.locator("section", {
    has: page.getByRole("heading", { name: "Customers" }),
  });

  await page.getByRole("tab", { name: /Stations/i }).click();

  let displayAssigned = false;
  let hubOwned = false;
  let iterationsUsed = 0;

  for (let i = 0; i < MAX_ITERATIONS; i += 1) {
    iterationsUsed = i + 1;
    if (
      await hubPanel
        .getByText("Owned")
        .isVisible()
        .catch(() => false)
    ) {
      hubOwned = true;
      break;
    }

    const buildButton = hubPanel.getByRole("button", { name: "Build" });
    if (
      (await buildButton.count()) > 0 &&
      (await buildButton.isEnabled().catch(() => false))
    ) {
      await buildButton.click();
      await page.clock.fastForward(31_000); // past the Hub's construction timer
      continue;
    }

    // Craft: open the Provision Station and push whichever button (Craft
    // or Queue) the "Turnover" recipe row currently shows.
    await stationsSection.locator(".shop-screen__station-row").first().click();
    const turnoverRow = page.locator(".ds-sheet .row.row--between", {
      hasText: "Turnover",
    });
    const craftButton = turnoverRow.getByRole("button");
    if (await craftButton.isEnabled().catch(() => false)) {
      await craftButton.click();
    }
    await page.locator(".ds-sheet__close").click();
    await page.clock.fastForward(16_000); // past the 15s craft duration + a reconcile tick

    // Display: assign the first freshly-crafted batch once, the first
    // time real stock exists (Document 14 §79 — a display slot requires
    // stock to already exist before it can be assigned).
    if (!displayAssigned) {
      await page.getByRole("tab", { name: /Displays/i }).click();
      await page.locator(".ds-slot").first().click();
      const turnoverCard = page.getByRole("button", { name: /Turnover/ });
      if (await turnoverCard.isEnabled().catch(() => false)) {
        await turnoverCard.click(); // DisplaySheet closes itself on assignment
        displayAssigned = true;
      } else {
        await page.locator(".ds-sheet__close").click();
      }
      await page.getByRole("tab", { name: /Stations/i }).click();
    }

    // Sell: resolve every customer currently on the floor via Standard
    // Sale (always eligible once stock/display exist) or Decline.
    for (let c = 0; c < 3; c += 1) {
      const customerRow = customersSection
        .locator(".shop-screen__station-row")
        .first();
      if ((await customerRow.count()) === 0) break;
      await customerRow.click();
      const standardSale = page.getByRole("button", { name: "Standard Sale" });
      if (await standardSale.isEnabled().catch(() => false)) {
        await standardSale.click();
      } else {
        await page.getByRole("button", { name: "Decline" }).click();
      }
    }
  }

  // Diagnostic only — not an assertion. Lets a future run notice
  // progression pacing drifting toward MAX_ITERATIONS before it becomes a
  // failure.
  console.log(
    `[fresh-save-progression] reached the Expedition Hub in ${String(iterationsUsed)}/${String(MAX_ITERATIONS)} iterations`,
  );
  expect(hubOwned).toBe(true);
});
