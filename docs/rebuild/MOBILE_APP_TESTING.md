# Mobile App Testing — Catchmon Ascension Native Shell & PWA

Three complementary, non-competing ways to test Catchmon Ascension on a
real phone:

1. **Real iPhone dev over LAN (HTTP)** — `pnpm dev:mobile`. Fastest,
   day-to-day iteration. No certificates, no admin privileges, works on a
   locked-down corporate laptop.
2. **Installable PWA (hosted HTTPS)** — a real deploy (e.g. GitHub Pages)
   made installable to the Home Screen via Safari. This is where offline/
   service-worker behavior is actually verified — HTTPS is only ever
   solved by deploying somewhere real, never locally on this machine.
3. **Capacitor** — a native Android/iOS app shell wrapping the built web
   app (real app, installable via Android Studio/Xcode or a `.apk`).

All three are **packaging/runtime layers, not a rewrite**. The
authoritative application is still React + Vite + PixiJS + Dexie/
IndexedDB + the existing Game Engine architecture, and the same
`pnpm build` output (`dist/`) feeds all three.

This document is the practical day-to-day workflow. For what was built
and why, see the relevant completion reports in the conversation history
(or `git log`, once this repo is under version control) — this file only
covers *how to run things*.

## A note on this machine

This development environment is a **locked-down corporate Windows
laptop**: no installing/trusting local certificates, no mkcert, no
modifying the enterprise certificate store, no admin-controlled TLS
setup. Nothing in this document requires any of that. Local HTTPS is
**not solved on this machine at all** — where HTTPS is actually needed
(installable/offline PWA behavior), the answer is always "deploy
somewhere with real HTTPS" (§2 below), never a local certificate.

## App identity (PROVISIONAL)

- **App name**: `Catchmon Ascension` / **short name**: `Catchmon` (Home
  Screen label).
- **App id** (Capacitor only): `com.catchmonascension.dev` — a
  **provisional development identifier**. No final company/production
  domain exists yet. Before any real store submission, this id must be
  replaced with a real reverse-domain id (e.g.
  `com.<company>.catchmonascension`), and doing so requires
  regenerating/reconfiguring the native projects (an app id change is not
  a safe drop-in rename on Android — package refactor is required — and
  not on iOS either — Bundle ID changes affect provisioning).
- **App icon (PROVISIONAL / dev placeholder)**: derived from the existing
  canonical Flamarox portrait (`reference/catchmons/Starter/Flamarox.png`
  — the player's own Starter/Lead species, already-approved art), flattened
  onto the `--surface-app` design token background. **Not final production
  branding** — a real app icon/logo is deferred to a future design pass.
  Generated files: `public/pwa/icon-192.png`, `icon-512.png`,
  `icon-maskable-512.png`, `apple-touch-icon.png`, and `public/favicon.png`.
- **Capacitor version**: 8.5.1 (`@capacitor/core`, `@capacitor/cli`,
  `@capacitor/android`, `@capacitor/ios`), plus `@capacitor/app` 8.1.1
  (the one plugin in use — see "App lifecycle" below).
- **PWA tooling**: `vite-plugin-pwa` 1.3.0 (Workbox-based manifest +
  service worker generation), `qrcode-terminal` (dev-only QR printing).
  Neither ships in the production runtime bundle. **No mkcert, no local
  certificate tooling of any kind is used anywhere in this project.**

## 0. Web development (unchanged)

Capacitor/PWA change nothing about the normal web workflow:

```
pnpm dev       # Vite dev server, as always
pnpm build     # Vite production build -> dist/
pnpm preview   # Preview the production build in a browser
```

## 1. Real iPhone development (LAN, HTTP — no certificates)

The fastest day-to-day loop: one command, a QR code, your iPhone showing
live code over your own Wi-Fi. No Xcode, no App Store, no cable, no
certificate prompts of any kind.

### Steps

1. **PC and iPhone on the same Wi-Fi network.**
2. Run:
   ```
   pnpm dev:mobile
   ```
3. **Scan the QR code** the terminal prints, with the iPhone's **Camera**
   app (not a separate QR app — modern iOS Camera recognizes QR codes
   natively and offers to open the link in Safari). If you'd rather not
   scan, just type the printed `http://<lan-ip>:5173` URL into Safari
   manually.
4. Use the app live in Safari — full hot-reload, real touch input, real
   viewport/safe-area rendering, the real Pixi battle scene.

### What this HTTP mode is and isn't for

`pnpm dev:mobile` binds Vite to your LAN over **plain HTTP**. That's
deliberate and requires no local certificate work at all — but it means:

- **This is for live UI/gameplay iteration only.** Everything you'd
  normally check in Safari works fine: layout, safe areas, touch,
  battle scene rendering, Forge screen, navigation.
- **This is NOT how to test service-worker/offline PWA behavior.** A
  `http://<lan-ip>` origin is not a "secure context," so
  `navigator.serviceWorker` does not even exist on that page — the
  service worker cannot register there regardless. (It's also just
  disabled in dev outright — see `vite.config.ts`'s
  `devOptions.enabled: false` — so this isn't a gap specific to HTTP,
  dev mode is never the way to test offline behavior.)
- You can still tap **Share → Add to Home Screen** from this HTTP dev
  session to sanity-check the manifest/icon/standalone-launch visuals —
  but that Home Screen shortcut points at your PC's dev server, so it
  stops working the moment `pnpm dev:mobile` isn't running. Treat it as
  a quick visual check, not a real install.

For the real installable/offline PWA, see §2.

## 2. Installable PWA (hosted HTTPS)

PWA installability with real offline capability requires HTTPS. This
project **does not** attempt to solve HTTPS locally (no mkcert, no
self-signed certificates, no local CA) — instead, the production build is
prepared to be deployed to any normal static HTTPS host, and installed
from there.

### What's already prepared

- `vite.config.ts`'s `base: process.env.GH_PAGES_BASE ?? "/"` — the build
  defaults to root-relative paths (correct for Capacitor and for a host
  serving from its domain root), and switches to a subpath automatically
  when `GH_PAGES_BASE` is set at build time (correct for a GitHub Pages
  *project* page, `https://<user>.github.io/<repo>/`). Verified: building
  with `GH_PAGES_BASE=/catchmon-ascension/` correctly prefixes every
  asset URL, the manifest link, and the manifest's own icon paths (the
  manifest's `icons[].src`/`start_url`/`scope` are host-relative, so they
  resolve correctly under whatever base the page itself was served from —
  no hand-editing needed per deploy target).
- `.github/workflows/deploy-pages.yml` — a ready-to-use GitHub Actions
  workflow that builds with the correct `GH_PAGES_BASE` (derived from the
  real repo name at run time, never hand-typed) and deploys `dist/` to
  GitHub Pages via the official `actions/deploy-pages` action.

### Why it isn't live yet

**This directory is not currently a git repository at all** (`git
status` fails — confirmed while preparing this). GitHub Pages needs a
real GitHub repository to deploy to, so nothing can actually publish
until that exists. The workflow file above is inert scaffolding — it
cannot run and cannot publish anything by itself.

### To actually go live (when you're ready)

1. `git init`, commit, and push this repo to a real GitHub repository.
2. In that repo's **Settings → Pages**, set **Source: GitHub Actions**.
3. In the **Actions** tab, open **"Deploy to GitHub Pages"** and click
   **"Run workflow"** (it's manual-only on purpose — a stray commit must
   never silently publish a mid-development build; add a `push:` trigger
   to the workflow later if you want continuous deployment instead).
4. GitHub prints the live URL
   (`https://<your-username>.github.io/<repo-name>/`).

### Installing from the hosted URL

1. Open the hosted URL in **Safari** on the iPhone.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Launch **"Catchmon"** from the Home Screen — full-screen, standalone,
   no Safari chrome.
4. This install is now genuinely offline-capable for the app shell (see
   §9 of the original PWA integration — precache covers the JS/CSS
   bundles, `index.html`, and the icon set; Catchmon portraits/combat art
   remain on-demand over the network, by design).

### Any other static HTTPS host works too

GitHub Pages is just the smallest, no-extra-account option already
wired up. Netlify, Vercel, Cloudflare Pages, or any plain HTTPS static
file host work identically — build with `pnpm build` (set `GH_PAGES_BASE`
only if that specific host also serves from a subpath; leave it unset for
a host serving from its domain root) and upload `dist/`.

### Three different things you might be testing — know which one you're in

| Mode | How you got there | What it proves | Offline? |
|---|---|---|---|
| **LAN dev mode (§1)** | `pnpm dev:mobile`, opened in Safari | Live code, hot-reload, fastest iteration | No — needs your PC's dev server running, and HTTP means no service worker at all |
| **Installed PWA (§2)** | Home Screen icon, from a real HTTPS deploy | Real manifest/icons/safe-area/standalone behavior, real app-shell offline boot | Yes, for the app shell |
| **Future Capacitor iOS/TestFlight build (§3+)** | A real native `.ipa`, from Xcode/TestFlight | The actual store-distributable app | Yes, always (bundled assets, no network involved at all) |

## 3. Building for native (Android)

The native shell always loads the **built** `dist/` output — never the
Vite dev server — so a native build always starts with a real
`pnpm build`:

```
pnpm build          # 1. tsc -b && vite build -> dist/
npx cap sync android  # 2. copies dist/ into android/app/src/main/assets/public
                       #    and updates native plugin registration
```

(`npx cap sync` with no platform argument syncs both `android/` and
`ios/`; `npx cap copy android` alone re-copies web assets without
touching native dependencies/plugins, useful for a quick asset-only
refresh. Do **not** set `GH_PAGES_BASE` for a Capacitor build — the
native shell needs the default root-relative `base`.)

### Open in Android Studio

```
npx cap open android
```

This opens `android/` as a normal Android Studio project. Run it on an
emulator or a USB-connected device with the regular Android Studio Run
button (▶).

### Build a debug APK from the command line

Requires a configured Android SDK (see "Environment requirements"
below):

```
cd android
./gradlew assembleDebug        # macOS/Linux
gradlew.bat assembleDebug      # Windows
```

Output APK: **`android/app/build/outputs/apk/debug/app-debug.apk`**

Install it on a connected device/emulator with:

```
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Environment requirements for an actual Android build

- **JDK 17 or newer** (this machine has JDK 21 and 25 available; either
  works with the Android Gradle Plugin version Capacitor 8 ships).
- **Android SDK** — install via Android Studio's SDK Manager, or the
  standalone `sdkmanager` CLI. At minimum: `platform-tools`, a
  `platforms;android-36` (matches `compileSdkVersion`/`targetSdkVersion`
  in `android/variables.gradle`), and a recent `build-tools`.
- Either set the `ANDROID_HOME` environment variable to the SDK path, or
  create `android/local.properties` with `sdk.dir=<path-to-sdk>`
  (Android Studio does this automatically on first open).

**This development environment does not currently have an Android SDK
installed.** `./gradlew assembleDebug` was run here and correctly
downloaded Gradle and configured both Gradle modules, then failed at
exactly the expected point:

```
SDK location not found. Define a valid SDK location with an
ANDROID_HOME environment variable or by setting the sdk.dir path in
your project's local properties file at
'...\android\local.properties'.
```

This confirms the generated Android project itself is valid — installing
the SDK (or opening the project in Android Studio, which installs/
configures it interactively) is the only remaining step before a real
debug build/APK.

## 4. iOS preparation

`ios/` has been generated (`npx cap add ios`) and kept in sync
(`npx cap sync` updates both platforms). **This environment cannot build
or run the iOS project** — Xcode only runs on macOS, and this is a
Windows machine. Nothing further can be validated here.

On a Mac, once Xcode + CocoaPods are installed:

```
npx cap sync ios
cd ios/App
pod install              # first time / after adding a plugin
cd ../..
npx cap open ios         # opens ios/App/App.xcworkspace in Xcode
```

Then Run (▶) in Xcode against a simulator or a provisioned device.

## 5. Live device development against Capacitor (optional — not the primary workflow)

Capacitor supports pointing the native shell at the Vite dev server
(`capacitor.config.ts`'s `server.url`) for hot-reload-in-the-native-shell
development. **This is intentionally not configured by default** — the
default, safest workflow is always "build web, sync, run native," which
matches what a real installed app actually does (bundled local assets,
no network dependency).

If you want live-reload against a device on the same network, add
(temporarily, do not commit) to `capacitor.config.ts`:

```ts
server: {
  url: "http://<your-machine-LAN-IP>:5173",
  cleartext: true,
},
```

then `pnpm dev` and `npx cap sync android` (or just reopen the already-
installed app). Remove this block before any debug/release build meant
to run offline — leaving it in ships a build that depends on your dev
machine being reachable.

## 6. What "Android project generated successfully" means today

- `android/` is a complete, valid Capacitor Android project (Gradle
  successfully configures both the `:app` and
  `:capacitor-cordova-android-plugins` modules).
- Portrait orientation is locked
  (`android/app/src/main/AndroidManifest.xml`'s `MainActivity` has
  `android:screenOrientation="portrait"`).
- The WebView's initial background color matches the design system's
  `--surface-app` token (`capacitor.config.ts`'s `android.backgroundColor:
  "#F1E2C6"`), avoiding a white flash on cold boot.
- The bundled web assets under `android/app/src/main/assets/public` are
  the real `pnpm build` output — the app boots fully offline.
- What's **not** done: no SDK installed in this environment, so no actual
  compile/APK/emulator/device run has happened here yet.

## 7. Persistence (Dexie/IndexedDB) and PWA cache — independent of each other

Saves have never been part of the service worker's job, in either
direction:

- The service worker's precache covers only the static app shell (JS/CSS
  bundles, `index.html`, the small icon set) — never gameplay state.
  Journey progress, Catchmon/Bond state, Forge/Relic state, and world
  progress all live in **Dexie/IndexedDB**, exactly as before this task —
  nothing about the PWA layer reads, writes, or wraps that store.
- Updating the service worker (`PwaUpdateBanner`'s "Restart to update")
  never touches IndexedDB. Reinstalling the PWA (removing and re-adding
  the Home Screen icon) does **not** delete IndexedDB either — the origin
  is what owns storage, not the shortcut.
- **What does delete local saves**: uninstalling the PWA is just removing
  a Home Screen shortcut and does not, by itself, clear storage — but
  iOS Safari's own "Clear History and Website Data," or the site-specific
  "Website Data" removal in Settings → Safari, **does** delete
  IndexedDB for that origin, taking the save with it. This project has no
  cloud-save system (deliberately out of scope for this task) — a save
  lost this way is not recoverable. Treat this exactly like any other
  browser local-storage game today.

## 8. Physical-device / emulator steps still required (the user's turn)

1. Install Android Studio (installs the SDK + emulator images with it),
   or install the standalone Android SDK + create
   `android/local.properties`.
2. `npx cap open android`, let Gradle sync inside Android Studio, then
   Run on an emulator or a USB-connected phone (enable Developer
   Options + USB debugging on the phone first).
3. On the real device/emulator, verify by hand: status bar / notch
   clearance, bottom gesture-area clearance, Journey battle scene renders
   and is touchable, Forge screen works, backgrounding the app and
   returning reconciles correctly, and a save survives a full app close/
   reopen.
4. For iOS: needs a Mac with Xcode — follow §4 above.
5. For the hosted PWA (§2): push this repo to GitHub, enable Pages, run
   the deploy workflow, then install from the printed HTTPS URL on the
   iPhone.
