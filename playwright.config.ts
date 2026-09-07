import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // `--mode e2e` loads `.env.e2e` (`VITE_E2E_TEST_HOOKS=true`), which
    // gates `main.tsx`'s deterministic-capture test hooks
    // (`__e2eSetNextCommandId__`/`__e2eFindCaptureCommandId__`). A normal
    // `pnpm build`/`vite build` (default mode) never loads that file, so
    // those hooks are absent from `window` in a normal production build.
    command: "tsc -b && vite build --mode e2e && vite preview --port 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
  },
});
