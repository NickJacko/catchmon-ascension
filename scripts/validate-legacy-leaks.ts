/*
 * Legacy Leak Guard (Task 00.5).
 *
 * Scans active implementation (src/ by default) for terms tied to
 * prohibited legacy gameplay mechanics from the old Catchmon project
 * (CLAUDE.md §7 Legacy Boundary; Document 14 §271, §290; Document 15
 * Task 00.5). This is a lightweight text scan, not a full parser — it is
 * a guardrail against accidental reintroduction, not a proof of absence.
 *
 * Deliberately NOT scanned: docs/, reference/, node_modules/, dist/, and
 * other build/test artifacts — those may legitimately discuss or contain
 * old terminology (canonical old reference files, design-doc prose) without
 * that being "active implementation".
 *
 * Exception mechanism: a line is allowed to mention a watched term if a
 * comment containing `legacy-leak-allow: <term>` appears either in the
 * same block comment, or within a small number of lines nearby. This is
 * for documented, deliberate mentions (e.g. "we intentionally do NOT
 * re-export X because it's the old currency") — not a way to silence a
 * real leak. Keep exceptions narrow and explicit.
 */
import { readFileSync, readdirSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

export const LEGACY_WATCH_TERMS = [
  "funken",
  "sparksThreshold",
  "harvest",
  "prestige",
] as const;

const SCANNED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".css",
  ".json",
]);

const ALLOW_MARKER = "legacy-leak-allow";
const ALLOW_MARKER_PATTERN = /legacy-leak-allow:\s*([a-zA-Z]+)/;
const NEARBY_LINE_WINDOW = 3;

export interface LegacyLeakViolation {
  file: string;
  term: string;
  line: number;
  snippet: string;
}

function collectSourceFiles(rootDir: string): string[] {
  const files: string[] = [];
  const stack: string[] = [rootDir];

  while (stack.length > 0) {
    const currentDir = stack.pop();
    if (currentDir === undefined) continue;

    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (
        entry.isFile() &&
        SCANNED_EXTENSIONS.has(extname(entry.name))
      ) {
        files.push(fullPath);
      }
    }
  }

  return files;
}

/**
 * Assigns each line to a block-comment "id" (lines inside the same
 * contiguous `/* ... *\/` run share an id), or -1 if outside any block
 * comment. Deliberately simple line-based detection, not a real tokenizer
 * — sufficient for finding doc-comment blocks in this project's files.
 */
function computeBlockCommentIds(lines: readonly string[]): number[] {
  const blockIds = new Array<number>(lines.length).fill(-1);
  let insideBlock = false;
  let currentBlockId = -1;
  let nextBlockId = 0;

  lines.forEach((line, index) => {
    if (!insideBlock && line.includes("/*")) {
      insideBlock = true;
      currentBlockId = nextBlockId;
      nextBlockId += 1;
    }
    if (insideBlock) {
      blockIds[index] = currentBlockId;
    }
    if (insideBlock && line.includes("*/")) {
      insideBlock = false;
    }
  });

  return blockIds;
}

interface AllowMarker {
  line: number;
  term: string;
}

function findAllowMarkers(lines: readonly string[]): AllowMarker[] {
  const markers: AllowMarker[] = [];
  lines.forEach((line, index) => {
    if (!line.includes(ALLOW_MARKER)) return;
    const match = ALLOW_MARKER_PATTERN.exec(line);
    if (match?.[1] !== undefined) {
      markers.push({ line: index, term: match[1].toLowerCase() });
    }
  });
  return markers;
}

function isAllowed(
  matchLine: number,
  term: string,
  markers: readonly AllowMarker[],
  blockIds: readonly number[],
): boolean {
  const lowerTerm = term.toLowerCase();
  return markers.some((marker) => {
    if (marker.term !== lowerTerm) return false;
    const sameBlock =
      blockIds[matchLine] !== -1 &&
      blockIds[matchLine] === blockIds[marker.line];
    const nearby = Math.abs(marker.line - matchLine) <= NEARBY_LINE_WINDOW;
    return sameBlock || nearby;
  });
}

export function scanForLegacyLeaks(
  rootDir: string,
  terms: readonly string[] = LEGACY_WATCH_TERMS,
): LegacyLeakViolation[] {
  const violations: LegacyLeakViolation[] = [];

  for (const filePath of collectSourceFiles(rootDir)) {
    const content = readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const blockIds = computeBlockCommentIds(lines);
    const markers = findAllowMarkers(lines);

    lines.forEach((lineText, index) => {
      const lowerLine = lineText.toLowerCase();
      for (const term of terms) {
        if (!lowerLine.includes(term.toLowerCase())) continue;
        if (isAllowed(index, term, markers, blockIds)) continue;

        violations.push({
          file: relative(process.cwd(), filePath),
          term,
          line: index + 1,
          snippet: lineText.trim(),
        });
      }
    });
  }

  return violations;
}

function main(): void {
  const repoRoot = fileURLToPath(new URL("..", import.meta.url));
  const srcDir = join(repoRoot, "src");
  const violations = scanForLegacyLeaks(srcDir);

  if (violations.length === 0) {
    console.log(
      "validate:legacy — no prohibited legacy terms found in active src/.",
    );
    return;
  }

  console.error(
    `validate:legacy — found ${String(violations.length)} prohibited legacy reference(s) in active src/:\n`,
  );
  for (const violation of violations) {
    console.error(
      `  ${violation.file}:${String(violation.line)}  [${violation.term}]  ${violation.snippet}`,
    );
  }
  console.error(
    "\nThese terms are forbidden in active implementation without an explicit, documented exception " +
      "(CLAUDE.md §7 Legacy Boundary; Document 14 §271, §290). If this is a deliberate, documented " +
      `exclusion (not an implementation), add a nearby comment: ${ALLOW_MARKER}: <term> — <reason>.`,
  );
  process.exitCode = 1;
}

const isDirectRun =
  process.argv[1] !== undefined &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectRun) {
  main();
}
