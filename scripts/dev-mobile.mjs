/**
 * `pnpm dev:mobile` — a one-command "get a scannable device URL" workflow
 * for real-iPhone development (Mobile Dev Flow task §5), for a machine
 * where installing/trusting local certificates is not an option (locked-
 * down corporate Windows laptop — no mkcert, no local CA, no admin-
 * controlled TLS setup). Starts the same Vite dev server as `pnpm dev`,
 * bound to the LAN (`server.host: true`) over plain HTTP. No certificate
 * work happens here at all.
 *
 * Plain HTTP means this is NOT how to test service-worker/offline PWA
 * behavior — a `http://<lan-ip>` origin is not a secure context, so
 * `navigator.serviceWorker` does not even exist there (the service
 * worker is disabled in dev regardless — see `vite.config.ts`). This
 * command is for live UI/gameplay iteration in iPhone Safari: real
 * touch input, real viewport/safe-area rendering, real Pixi battle
 * scene, hot-reload. See docs/rebuild/MOBILE_APP_TESTING.md's
 * "Installable PWA (hosted)" section for how offline/install behavior is
 * verified instead (a real HTTPS deploy, not this command).
 *
 * Deliberately plain `.mjs`, not `.ts` (matches `check-fast.mjs`/
 * `verify-e2e-hooks-absent.mjs`'s existing convention for one-off dev
 * tooling scripts) — not part of the app bundle, not typechecked as
 * application code.
 */
import { createServer } from "vite";
import qrcodeTerminal from "qrcode-terminal";

const server = await createServer({
  server: { host: true },
});

await server.listen();

server.printUrls();

const networkUrl = server.resolvedUrls?.network[0];

if (networkUrl) {
  console.log("\nScan with your iPhone's Camera app:\n");
  qrcodeTerminal.generate(networkUrl, { small: true }, (qr) => {
    console.log(qr);
  });
  console.log(`  ${networkUrl}\n`);
  console.log(
    "PC and iPhone must be on the same Wi-Fi network. This is plain HTTP —\n" +
      "fine for live UI/gameplay testing in Safari, but the service worker\n" +
      "will not register here (no secure context) and 'Add to Home Screen'\n" +
      "will not have offline capability from this URL. See\n" +
      "docs/rebuild/MOBILE_APP_TESTING.md for the hosted-HTTPS PWA workflow.\n",
  );
} else {
  console.log(
    "\nNo LAN-reachable URL was found (no active network interface?).\n" +
      "You can still use the Local URL above on this machine.\n",
  );
}
