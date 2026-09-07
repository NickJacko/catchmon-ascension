#!/usr/bin/env node
/*
 * Tier 1 — fast development check (Document 14 "testing architecture" /
 * CLAUDE.md validation policy). Run repeatedly while implementing a single
 * task. Takes the file(s) you just touched as arguments and validates only
 * what's actually implicated:
 *
 *   1. incremental typecheck (`tsc -b` — already composite + cached via
 *      tsBuildInfo, ~7s warm; the plain `tsc -b` gains nothing by trying to
 *      scope to individual files, so this stays whole-project but cheap)
 *   2. legacy-leak scan (`validate-legacy-leaks.ts` run directly via node —
 *      already outside Vitest entirely, ~2-3s regardless of scope)
 *   3. lint + format check, scoped to exactly the given files (full-repo
 *      `eslint .` / `prettier --check .` measured at ~90s / ~50s — far too
 *      slow to pay on every edit; per-file invocation is near-instant)
 *   4. targeted tests via `vitest related` — Vitest's own static-import
 *      module graph, not a hand-maintained file list and not git-diff-based
 *      (this repo has no .git). For a genuinely leaf file this is a handful
 *      of files in a few seconds; for a widely-imported file (e.g. a
 *      domain types file or a content barrel) it naturally widens toward
 *      "most of the suite" — that widening IS the signal to stop iterating
 *      here and move to `pnpm check:affected` or the full `pnpm check`
 *      instead, not a bug in this script.
 *
 * Usage:
 *   pnpm check:fast <file> [file...]
 *
 * Never runs the full 111-file Vitest suite, full-repo lint, or full-repo
 * format check — those are Tier 2/3 territory (see CLAUDE.md's validation
 * policy section).
 */
import { spawnSync } from "node:child_process";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error(
    "check:fast requires the file(s) you just touched, e.g.:\n" +
      "  pnpm check:fast src/domain/crafting/some-file.ts src/domain/crafting/some-file.test.ts\n" +
      "(Targeted by design — see CLAUDE.md's validation policy. For a full sweep use `pnpm check`.)",
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
    console.error(`\ncheck:fast — FAILED at: ${label}`);
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
run("targeted tests (vitest related)", "pnpm", [
  "exec",
  "vitest",
  "related",
  ...files,
  "--run",
]);

console.log(
  "\ncheck:fast — all targeted checks passed.\n" +
    "If the related-test count above looked large (broad regression radius), " +
    "prefer `pnpm check:affected` or the full `pnpm check` instead of iterating here.",
);
