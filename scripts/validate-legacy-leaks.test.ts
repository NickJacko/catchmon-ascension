// @vitest-environment node
//
// This file does pure Node fs/path work and never touches the DOM — the
// project's global Vitest environment is jsdom (needed by the React/Pixi
// tests), which costs real setup/teardown time and worker memory pressure
// for a file that gets nothing from it. Overriding to `node` per-file is a
// standard, supported Vitest capability (not a config-wide change), and
// removes this file's jsdom cost entirely without touching its assertions.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  LEGACY_WATCH_TERMS,
  scanForLegacyLeaks,
} from "./validate-legacy-leaks.ts";

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(currentDir, "__fixtures__", "legacy-leak");
const repoRoot = join(currentDir, "..");

describe("legacy leak guard", () => {
  it("detects each representative prohibited active-gameplay pattern", () => {
    const violations = scanForLegacyLeaks(join(fixturesDir, "violation"));
    const foundTerms = new Set(violations.map((v) => v.term.toLowerCase()));

    expect(violations.length).toBeGreaterThan(0);
    for (const term of LEGACY_WATCH_TERMS) {
      expect(foundTerms.has(term.toLowerCase())).toBe(true);
    }
  });

  it("does not flag normal source or the guard's own documented exceptions", () => {
    // Includes documented-exception.ts and documented-exception-line-comment.ts,
    // which deliberately mention watched terms inside a `legacy-leak-allow`
    // comment — proving the exception mechanism doesn't need broad disabling.
    const violations = scanForLegacyLeaks(join(fixturesDir, "clean"));
    expect(violations).toEqual([]);
  });

  it("finds no violations in the real active src/ tree", () => {
    const violations = scanForLegacyLeaks(join(repoRoot, "src"));
    expect(violations).toEqual([]);
  });

  it("does not naively treat reference/ as active implementation", () => {
    // reference/ is currently the approved-v1 design-system export plus
    // canonical Catchmon art — content that happens not to mention any
    // watched term right now, so asserting against its live text would be
    // fragile (that content is owned/reshaped by design, not this guard).
    // Instead, prove the actual claim structurally: the scanner itself
    // finds violations perfectly well when pointed at content that has
    // them (reference/ being clean is not a blind spot in the matching
    // logic), and `main()`'s scan root is hardcoded to `src` only (not a
    // coincidence that reference/ is skipped).
    const fixtureHits = scanForLegacyLeaks(join(fixturesDir, "violation"));
    expect(fixtureHits.length).toBeGreaterThan(0);

    const mainSource = readFileSync(
      join(currentDir, "validate-legacy-leaks.ts"),
      "utf-8",
    );
    expect(mainSource).toMatch(/join\(repoRoot,\s*["']src["']\)/);
  });
});
