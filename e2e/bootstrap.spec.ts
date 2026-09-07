import { test, expect } from "@playwright/test";

test("app boots the real Game Engine and lands on the neutral Journey shell, without requiring the Shop loop", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Journey", exact: true }),
  ).toBeVisible();
  // Phase R8: the canonical four-destination IA (docs/rebuild/12 §2).
  await expect(page.getByRole("link", { name: "Forge" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Catchmons" })).toBeVisible();
  await expect(page.getByRole("link", { name: "World" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Shop", exact: true }),
  ).not.toBeVisible();

  // Shop's gameplay loop still exists in the codebase for controlled
  // retirement (docs/rebuild/R1_DEPENDENCY_AUDIT.md §11) — it just isn't
  // the default/required experience anymore. Confirm it's still reachable
  // directly, so this isn't a broad-deletion regression in disguise.
  await page.goto("/shop");
  await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
});
