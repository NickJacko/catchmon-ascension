import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

// --- Architecture layer boundary helpers (Document 14 §15-23) ---
// Kept local to this config on purpose: this is mechanical enforcement of an
// already-approved dependency direction, not a new architecture framework.

const ARCHITECTURE_DOC = "Document 14 §16-19, §22-23";
const TEST_FILE_GLOB = "**/*.test.{ts,tsx}";

const FRAMEWORK_IMPORTS = [
  {
    name: "react",
    message: `core/domain/content/application may not import React (${ARCHITECTURE_DOC}).`,
  },
  {
    name: "react-dom",
    message: `core/domain/content/application may not import React (${ARCHITECTURE_DOC}).`,
  },
  {
    name: "pixi.js",
    message: `core/domain/content/application may not import PixiJS (${ARCHITECTURE_DOC}).`,
  },
  {
    name: "dexie",
    message: `core/domain/content/application may not import Dexie directly; infrastructure owns persistence (${ARCHITECTURE_DOC}).`,
  },
];

const DEXIE_IMPORT = {
  name: "dexie",
  message: `presentation may not import Dexie directly; dispatch application commands instead (${ARCHITECTURE_DOC}).`,
};

const WINDOW_MESSAGE = `domain/ must not read browser globals directly; time/DOM access is injected via core ports, not called ad hoc (${ARCHITECTURE_DOC}).`;

const DATE_NOW_MESSAGE =
  "domain/application must not call Date.now() directly; inject a Clock and call clock.nowMs() instead " +
  "(Document 14 §115 Time Architecture — Clock Port; Document 15 Task 01.3). The SystemClock adapter in " +
  "infrastructure/platform/ is the one place Date.now() is legitimate.";

const NO_DIRECT_DATE_NOW = {
  selector:
    "CallExpression[callee.type='MemberExpression'][callee.object.name='Date'][callee.property.name='now']",
  message: DATE_NOW_MESSAGE,
};

const MATH_RANDOM_MESSAGE =
  "domain/application/core must not call Math.random() directly; inject a RandomSource and call " +
  "randomSource.nextUint32()/nextProbabilityRollBps() instead (Document 14 §128 Randomness Architecture; " +
  "Document 15 Task 01.4). The deterministic PRNG in core/random/deterministic-rng.ts never needs " +
  "Math.random() either — the guard applies there too, with no exception.";

const NO_DIRECT_MATH_RANDOM = {
  selector:
    "CallExpression[callee.type='MemberExpression'][callee.object.name='Math'][callee.property.name='random']",
  message: MATH_RANDOM_MESSAGE,
};

// "test" is listed here like any other forbidden target (Document 15 Task
// 01.3: "Do not make production game code depend on test helpers"). Every
// block below that uses this list is paired with a second block for
// *.test.{ts,tsx} files using `forbiddenLayerPatterns(layer, { includeTest:
// false })`, so test files can still import shared helpers like FakeClock
// while every *other* restriction (framework imports, other layers) still
// applies to them too — ESLint flat config replaces a rule's whole value
// per matching file rather than merging it across blocks, so this has to
// be two explicit blocks per layer, not a single shared "ignores" block.
const FORBIDDEN_LAYER_TARGETS = {
  core: [
    "domain",
    "content",
    "application",
    "infrastructure",
    "presentation",
    "app",
    "test",
  ],
  domain: ["application", "infrastructure", "presentation", "app", "test"],
  content: ["presentation", "app", "test"],
  application: ["infrastructure", "presentation", "app", "test"],
};

function forbiddenLayerPatterns(layer, { includeTest = true } = {}) {
  return FORBIDDEN_LAYER_TARGETS[layer]
    .filter((target) => includeTest || target !== "test")
    .map((target) => `**/${target}/**`);
}

export default tseslint.config([
  globalIgnores([
    "dist",
    "coverage",
    "playwright-report",
    "test-results",
    "node_modules",
    // Generated/vendored Capacitor native platform projects (Android
    // Gradle project, Xcode project) — not this repo's web app source,
    // same category as `dist` (which they also both bundle a copy of).
    "android",
    "ios",
  ]),
  {
    files: ["src/**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat["recommended-latest"],
      reactRefresh.configs.vite,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
  {
    files: ["*.config.{ts,js}", "e2e/**/*.ts", "scripts/**/*.ts"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.node,
    },
  },

  // --- Architecture layer boundaries (Document 14 §15-23) ---
  // Enforced mechanically via core ESLint rules, no extra dependency.
  // `no-restricted-imports` matches on the import specifier text, so a
  // "**/layer/**" pattern catches that layer regardless of "../" depth.
  {
    files: ["src/core/**/*.{ts,tsx}"],
    ignores: [TEST_FILE_GLOB],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("core"),
        },
      ],
      "no-restricted-syntax": ["error", NO_DIRECT_MATH_RANDOM],
    },
  },
  {
    files: [`src/core/${TEST_FILE_GLOB}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("core", { includeTest: false }),
        },
      ],
      "no-restricted-syntax": ["error", NO_DIRECT_MATH_RANDOM],
    },
  },
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    ignores: [TEST_FILE_GLOB],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("domain"),
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "window", message: WINDOW_MESSAGE },
        { name: "document", message: WINDOW_MESSAGE },
      ],
      "no-restricted-syntax": [
        "error",
        NO_DIRECT_DATE_NOW,
        NO_DIRECT_MATH_RANDOM,
      ],
    },
  },
  {
    files: [`src/domain/${TEST_FILE_GLOB}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("domain", { includeTest: false }),
        },
      ],
      "no-restricted-globals": [
        "error",
        { name: "window", message: WINDOW_MESSAGE },
        { name: "document", message: WINDOW_MESSAGE },
      ],
      "no-restricted-syntax": [
        "error",
        NO_DIRECT_DATE_NOW,
        NO_DIRECT_MATH_RANDOM,
      ],
    },
  },
  {
    files: ["src/content/**/*.{ts,tsx}"],
    ignores: [TEST_FILE_GLOB],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("content"),
        },
      ],
    },
  },
  {
    files: [`src/content/${TEST_FILE_GLOB}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("content", { includeTest: false }),
        },
      ],
    },
  },
  {
    files: ["src/application/**/*.{ts,tsx}"],
    ignores: [TEST_FILE_GLOB],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("application"),
        },
      ],
      "no-restricted-syntax": [
        "error",
        NO_DIRECT_DATE_NOW,
        NO_DIRECT_MATH_RANDOM,
      ],
    },
  },
  {
    files: [`src/application/${TEST_FILE_GLOB}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [...FRAMEWORK_IMPORTS],
          patterns: forbiddenLayerPatterns("application", {
            includeTest: false,
          }),
        },
      ],
      "no-restricted-syntax": [
        "error",
        NO_DIRECT_DATE_NOW,
        NO_DIRECT_MATH_RANDOM,
      ],
    },
  },
  {
    files: ["src/presentation/**/*.{ts,tsx}"],
    ignores: [TEST_FILE_GLOB],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [DEXIE_IMPORT],
          patterns: ["**/infrastructure/**", "**/test/**"],
        },
      ],
    },
  },
  {
    files: [`src/presentation/${TEST_FILE_GLOB}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [DEXIE_IMPORT],
          patterns: ["**/infrastructure/**"],
        },
      ],
    },
  },
  {
    files: ["src/infrastructure/**/*.{ts,tsx}"],
    ignores: [TEST_FILE_GLOB],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["**/presentation/**", "**/app/**", "**/test/**"],
        },
      ],
    },
  },
  {
    files: [`src/infrastructure/${TEST_FILE_GLOB}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["**/presentation/**", "**/app/**"],
        },
      ],
    },
  },
]);
