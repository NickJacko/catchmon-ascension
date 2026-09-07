import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

/**
 * Design system tokens duplicated here deliberately (not imported — this
 * file runs in Node, not the browser/CSS pipeline): `--surface-app` /
 * `--action-primary` from
 * reference/design-system/approved-v1/tokens/colors.css. Keep in sync by
 * hand if those tokens ever change; there are only two.
 */
const SURFACE_APP = "#F1E2C6";
const ACTION_PRIMARY = "#7B573D";

export default defineConfig({
  // Root-relative ("/") for local dev/preview and the Capacitor native
  // shell (which serves from its own scheme, not a subpath). A hosted
  // static deploy under a subpath (e.g. a GitHub Pages *project* page,
  // `https://<user>.github.io/<repo>/`) sets `GH_PAGES_BASE` at build
  // time instead of this file being edited — see
  // `.github/workflows/deploy-pages.yml` and
  // docs/rebuild/MOBILE_APP_TESTING.md's "Installable PWA (hosted)"
  // section. Never hardcode a repo name here: this file doesn't know
  // what the eventual GitHub repo will be called.
  base: process.env.GH_PAGES_BASE ?? "/",
  plugins: [
    react(),
    VitePWA({
      // "prompt": a new build installs in the background but never
      // auto-activates/reloads mid-session (Mobile Dev Flow task §8) —
      // `PwaUpdateBanner.tsx` drives the actual, explicit user-triggered
      // update.
      registerType: "prompt",
      // Registration is manual (`src/presentation/shell/PwaUpdateBanner.tsx`,
      // via `virtual:pwa-register/react`), gated on
      // `!Capacitor.isNativePlatform()` — no injected auto-register
      // script, so the native shell never even attempts to register a
      // service worker (task §10).
      injectRegister: false,
      // The service worker stays inactive during `pnpm dev`/`pnpm
      // dev:mobile` (Vite's dev server is not an offline-capable build to
      // begin with, and — no local HTTPS in this project, see
      // docs/rebuild/MOBILE_APP_TESTING.md — a LAN `http://` origin is
      // not a secure context, so `navigator.serviceWorker` would not
      // even exist there regardless). Only a real `pnpm build` served
      // over HTTPS (a hosted deploy) or the native-shell bundle is
      // offline-capable.
      devOptions: { enabled: false },
      manifest: {
        name: "Catchmon Ascension",
        short_name: "Catchmon",
        description:
          "Collect Catchmons, battle through the Journey, and forge Relics.",
        start_url: ".",
        scope: ".",
        display: "standalone",
        orientation: "portrait",
        background_color: SURFACE_APP,
        theme_color: ACTION_PRIMARY,
        icons: [
          { src: "pwa/icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "pwa/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa/icon-maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // App-shell-only precache (task §4/§8): the actual JS/CSS bundles,
        // the HTML entry, and the small PWA icon set. Deliberately
        // excludes `assets/*.png`/`*.webp` — the ~200+ canonical Catchmon
        // portraits and Wave 0A combat/forge art are large (~200MB+
        // combined), loaded on demand at runtime (never all needed to
        // boot), and already governed by this app's own "preload only
        // current-context assets" contract (CLAUDE.md's Preload/Cache
        // rule) — precaching all of it here would silently duplicate and
        // fight that contract, not serve it.
        globPatterns: ["**/*.{js,css,html}", "pwa/*.png", "favicon.png"],
        globIgnores: ["assets/**/*.{png,webp}"],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
