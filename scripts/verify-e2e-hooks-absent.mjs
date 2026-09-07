/**
 * Guards the invariant a normal production build must uphold: the
 * deterministic-capture E2E test hooks (`window.__e2eSetNextCommandId__`,
 * `window.__e2eFindCaptureCommandId__` — see `main.tsx`) must never ship
 * in a normal build. Those hooks are gated behind `VITE_E2E_TEST_HOOKS`
 * (`.env.e2e`, loaded only via `vite build --mode e2e`, which
 * `playwright.config.ts`'s `webServer` command uses) — a normal
 * `pnpm build`/`vite build` never loads that file, and Vite's dead-code
 * elimination strips the gated block entirely rather than merely leaving
 * it unattached.
 *
 * Cheap by design: a static grep over `dist/`, reusing whatever `pnpm
 * check`'s own `pnpm build` step (normal mode, no `--mode e2e`) already
 * produced — no extra build, no browser launch.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST_DIR = "dist";
const FORBIDDEN_STRINGS = [
  "__e2eSetNextCommandId__",
  "__e2eFindCaptureCommandId__",
];

function listFilesRecursive(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...listFilesRecursive(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

let distFiles;
try {
  distFiles = listFilesRecursive(DIST_DIR);
} catch {
  console.error(
    `verify-e2e-hooks-absent — could not read "${DIST_DIR}"; run this after "pnpm build" (normal mode, no --mode e2e).`,
  );
  process.exit(1);
}

const jsFiles = distFiles.filter((f) => f.endsWith(".js"));
const violations = [];
for (const file of jsFiles) {
  const content = readFileSync(file, "utf8");
  for (const forbidden of FORBIDDEN_STRINGS) {
    if (content.includes(forbidden)) {
      violations.push({ file, forbidden });
    }
  }
}

if (violations.length > 0) {
  console.error(
    "verify-e2e-hooks-absent — FAILED: E2E-only test hooks found in a normal production build:",
  );
  for (const { file, forbidden } of violations) {
    console.error(`  ${forbidden} in ${file}`);
  }
  console.error(
    'Check that VITE_E2E_TEST_HOOKS is not set (e.g. this was accidentally built with --mode e2e) and that main.tsx\'s "if (import.meta.env.VITE_E2E_TEST_HOOKS === \\"true\\")" gate is intact.',
  );
  process.exit(1);
}

console.log(
  `verify-e2e-hooks-absent — clean: neither E2E test hook found across ${String(jsFiles.length)} built JS file(s).`,
);
