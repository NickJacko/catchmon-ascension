import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Native shell config only — the app id below is a PROVISIONAL
 * development identifier (no final company/production domain exists yet;
 * see docs/rebuild/MOBILE_APP_TESTING.md). `webDir` points at the
 * existing Vite production output (`pnpm build`'s `dist/`); Capacitor
 * only packages that already-built web app, it does not replace it —
 * `pnpm dev`/`pnpm build` remain the authoritative web build.
 */
const config: CapacitorConfig = {
  appId: "com.catchmonascension.dev",
  appName: "Catchmon Ascension",
  webDir: "dist",
  android: {
    // Matches the design system's `--surface-app` token
    // (reference/design-system/approved-v1/tokens/colors.css) — avoids a
    // white flash on cold boot before the React shell's own background
    // paints.
    backgroundColor: "#F1E2C6",
  },
};

export default config;
