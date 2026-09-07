import { test, expect } from "@playwright/test";

/**
 * Document 15 Task 12.1 — Multi-Tab Writer Lease: "Test with two tabs."
 * `writer-lease.test.ts` (Vitest) already proves the `BroadcastChannel`
 * protocol itself deterministically with two real `createWriterLease`
 * instances; this proves the actual app wiring (`game-store.ts`'s
 * `dispatch()` gate + `SaveStatusBanner`'s takeover UI) works with two
 * genuine browser tabs sharing one origin/IndexedDB/BroadcastChannel,
 * which the unit test — exercising the lease module alone — cannot cover.
 */

test("a second tab opened on the same save becomes read-only, and Use game here hands the lease back", async ({
  context,
}) => {
  test.setTimeout(60_000);

  const tabA = await context.newPage();
  // Shop is no longer the default landing route (docs/rebuild/R0 neutral
  // shell) — still valid generic-infrastructure regression coverage, so
  // navigate to it explicitly rather than deleting this spec.
  await tabA.goto("/shop");
  await expect(
    tabA.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
  // Give tabA's claim window time to resolve before tabB opens, so the
  // outcome (tabA writer, tabB read-only) is unambiguous rather than a
  // race between two simultaneous claims.
  await tabA.waitForTimeout(500);

  const tabB = await context.newPage();
  await tabB.goto("/shop");
  await expect(
    tabB.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();

  await expect(
    tabB.getByText("Read-only — this save is open in another tab"),
  ).toBeVisible();
  await expect(
    tabA.getByText("Read-only — this save is open in another tab"),
  ).not.toBeVisible();

  // While tabA holds the lease, a dispatch attempted from the read-only
  // tabB must not silently apply — `game-store.ts`'s `dispatch()` refuses
  // it (`NOT_ACTIVE_WRITER`) rather than the two tabs racing to commit
  // divergent revisions. Clicking Craft in tabB must not start a craft.
  await tabB.getByRole("tab", { name: /Stations/i }).click();
  await tabB.locator(".shop-screen__station-row").first().click();
  const turnoverRowReadOnly = tabB.locator(".ds-sheet .row.row--between", {
    hasText: "Turnover",
  });
  await turnoverRowReadOnly.getByRole("button").click();
  await tabB.locator(".ds-sheet__close").click();
  await tabB.locator(".shop-screen__station-row").first().click();
  await expect(tabB.getByText("No active craft.")).toBeVisible();
  await tabB.locator(".ds-sheet__close").click();

  await tabB.getByRole("button", { name: "Use game here" }).click();
  await expect(
    tabB.getByText("Read-only — this save is open in another tab"),
  ).not.toBeVisible({ timeout: 5_000 });
  await expect(
    tabA.getByText("Read-only — this save is open in another tab"),
  ).toBeVisible({ timeout: 5_000 });

  // tabB is now the writer: a real dispatch from it applies.
  await tabB.getByRole("tab", { name: /Stations/i }).click();
  await tabB.locator(".shop-screen__station-row").first().click();
  const turnoverRow = tabB.locator(".ds-sheet .row.row--between", {
    hasText: "Turnover",
  });
  await expect(turnoverRow.getByRole("button")).toBeEnabled();
  await turnoverRow.getByRole("button").click();
  await tabB.locator(".ds-sheet__close").click();

  // tabA (now read-only) must not be able to dispatch the same action —
  // symmetric check to tabB's earlier one, after the handoff reversed
  // which tab holds the lease.
  await tabA.getByRole("tab", { name: /Stations/i }).click();
  await tabA.locator(".shop-screen__station-row").first().click();
  await expect(tabA.getByText("No active craft.")).toBeVisible();
});
