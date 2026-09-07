#!/usr/bin/env node
/*
 * Tier 2 — batch/subsystem check (CLAUDE.md validation policy). Run after
 * completing a coherent task group, or after touching shared architecture
 * (application command infrastructure, GameState shape, asset resolver/
 * metadata, persistence, reconciliation, the shared React shell, the Pixi
 * renderer/view-model boundary, content registry changes, ...).
 *
 * Broader than `check:fast`, still cheaper than the full `pnpm check` gate:
 *
 *   1. incremental typecheck (`tsc -b`)
 *   2. legacy-leak scan (direct script)
 *   3. lint + format check, scoped to exactly the given files — like Tier
 *      1, NOT full-repo. This project's custom ESLint rules (architecture
 *      layer boundaries, no direct Date.now()/Math.random(), Dexie import
 *      restrictions, ...) are all per-file AST checks with no cross-file
 *      analysis, and Prettier formatting is inherently per-file too — so a
 *      NEW violation can only appear in a file that was actually touched.
 *      Every untouched file was already lint/format-clean as of the last
 *      Tier 3 gate. Scoping here (measured: full lint+format ~140s vs.
 *      near-instant scoped) does not weaken what Tier 2 actually catches,
 *      because Tier 3 still does one full sweep before every phase exit.
 *   4. `vitest related <files>` — the same real static-import-graph
 *      mechanism as Tier 1, not a fragile hand-maintained "if you touched
 *      directory X, run subsystem Y" mapping. For shared/foundational
 *      files this already naturally expands to a large share of the suite
 *      (measured: a single widely-imported domain type pulled in 71/111
 *      files) — that expansion IS the affected-subsystem coverage this
 *      tier exists to provide.
 *   5. `pnpm build` — real production build/type validation (catches
 *      prod-bundling/import-resolution issues `tsc`/Vitest alone can miss).
 *
 * What actually distinguishes this from `check:fast`: (a) it's meant to be
 * invoked once with the FULL list of files touched across a whole
 * completed batch (a wider `vitest related` net than a single small edit),
 * and (b) it adds the real production build, which Tier 1 never runs.
 *
 * Usage:
 *   pnpm check:affected <file> [file...]
 *
 * Still not the full 111-file Vitest suite unless `vitest related`'s own
 * graph says that's what's actually affected. If you're unsure whether the
 * regression radius is fully covered, escalate to `pnpm check`.
 */
import { spawnSync } from "node:child_process";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error(
    "check:affected requires the file(s) at the root of this batch, e.g.:\n" +
      "  pnpm check:affected src/domain/game-state/game-state.ts\n" +
      "(Use the file(s) that most directly represent the shared surface you changed.)",
  );
  process.exit(1);
}

function quote(arg) {
  return `"${arg.replaceAll('"', '\\"')}"`;
}

function run(label, command, args) {
  console.log(`\n→ ${label}`);
  // `shell: true` is required on Windows to resolve pnpm's/npm-installed
  // binaries' .cmd shims; building one pre-quoted string (rather than
  // passing `args` alongside `shell: true`) avoids Node's DEP0190
  // unescaped-argument warning. Arguments here are always file paths this
  // script itself was invoked with, never untrusted external input.
  const commandLine = `${command} ${args.map(quote).join(" ")}`;
  const result = spawnSync(commandLine, { stdio: "inherit", shell: true });
  if (result.status !== 0) {
    console.error(`\ncheck:affected — FAILED at: ${label}`);
    process.exit(result.status ?? 1);
  }
}

const LINTABLE = /\.(ts|tsx|js|jsx)$/;
const lintableFiles = files.filter((f) => LINTABLE.test(f));

run("typecheck (incremental, tsc -b)", "pnpm", ["exec", "tsc", "-b"]);
run("legacy-leak scan (direct script)", "node", [
  "scripts/validate-legacy-leaks.ts",
]);
if (lintableFiles.length > 0) {
  run("lint (changed files only)", "pnpm", [
    "exec",
    "eslint",
    ...lintableFiles,
  ]);
}
run("format check (changed files only)", "pnpm", [
  "exec",
  "prettier",
  "--check",
  ...files,
]);
run("affected tests (vitest related)", "pnpm", [
  "exec",
  "vitest",
  "related",
  ...files,
  "--run",
]);
run("production build", "pnpm", ["exec", "vite", "build"]);

console.log(
  "\ncheck:affected — all subsystem checks passed.\n" +
    "Still run the full `pnpm check` before reporting a phase complete.",
);
