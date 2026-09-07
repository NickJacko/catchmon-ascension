import { test, expect } from "@playwright/test";

/**
 * Phase 9 exit gate — Document 15 §400 Scene Acceptance Criteria: "renders
 * from view model ... semantic taps work ... scene responds to state
 * changes." Proves through the real app (real boot, real Game Engine, real
 * Pixi canvas) that the living shop scene is a renderer over existing
 * state, not a second gameplay engine: a tap on the canvas opens the same
 * real Station Sheet the DOM row already opens — no duplicate command
 * validation, no Pixi-owned state.
 */

test("living shop canvas renders and a station tap opens the real Station Sheet", async ({
  page,
}) => {
  // Phase 10 exit gate: prove a real production asset — not a Graphics
  // placeholder — actually loads for the Pixi scene, served exactly as
  // `content/vertical-slice/productionAssets.ts` documents (a plain
  // `public/assets/vertical-slice/...` file, no bundler involvement).
  // Stations render immediately on boot regardless of customer arrival
  // timing, so this doesn't depend on any further game-time progression.
  const stationArtResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/assets/vertical-slice/stations/") &&
      response.ok(),
  );

  // Shop is no longer the default landing route (docs/rebuild/R0 neutral
  // shell) — still valid regression coverage for gameplay that hasn't
  // retired, so navigate to it explicitly rather than deleting this spec.
  await page.goto("/shop");
  await expect(
    page.getByRole("heading", { name: "Shop", exact: true }),
  ).toBeVisible();
  await stationArtResponse;

  const sceneHost = page.locator(".shop-scene-host");
  await expect(sceneHost).toBeVisible();
  const canvas = sceneHost.locator("canvas");
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) throw new Error("expected the scene canvas to have a bounding box");

  // The host's aspect-ratio (3/2) exactly matches the scene's logical space
  // (1200x800), so `computeViewport` applies no letterbox offset — a
  // logical anchor maps to the canvas by simple proportional scaling.
  // Station 0's entity center is at logical (260 + 48, 460 + 48).
  const logicalX = 260 + 48;
  const logicalY = 460 + 48;
  const targetX = box.x + (logicalX / 1200) * box.width;
  const targetY = box.y + (logicalY / 800) * box.height;

  await page.mouse.click(targetX, targetY);

  await expect(
    page.getByRole("heading", { name: "Station", exact: true }),
  ).toBeVisible();

  // Closing the sheet and using the existing DOM row must still work
  // identically — the scene is an additional entry point, not a
  // replacement for the accessible fallback (Document 15 Task 09.10).
  await page.locator(".ds-sheet__close").click();
  await page.getByRole("tab", { name: /Stations/i }).click();
  await page.locator(".shop-screen__station-row").first().click();
  await expect(
    page.getByRole("heading", { name: "Station", exact: true }),
  ).toBeVisible();
});
