import { describe, expect, it } from "vitest";
import adapterSource from "./tokens.css?raw";
import canonicalColors from "../../../reference/design-system/approved-v1/tokens/colors.css?raw";
import canonicalElements from "../../../reference/design-system/approved-v1/tokens/elements.css?raw";
import canonicalTypography from "../../../reference/design-system/approved-v1/tokens/typography.css?raw";
import canonicalSpacing from "../../../reference/design-system/approved-v1/tokens/spacing.css?raw";
import canonicalRadius from "../../../reference/design-system/approved-v1/tokens/radius.css?raw";

describe("design-system tokens adapter", () => {
  it("imports the canonical approved-v1 aggregate instead of duplicating it", () => {
    expect(adapterSource).toMatch(
      /@import\s+["']\.\.\/\.\.\/\.\.\/reference\/design-system\/approved-v1\/styles\.css["']/,
    );
    // No hex color literal in the adapter itself — values live only in the
    // canonical files.
    expect(adapterSource).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });

  it("resolves canonical tokens the app actually uses (Document 12/13 approved-v1)", () => {
    for (const token of [
      "--surface-app",
      "--surface-card",
      "--border-default",
      "--text-body",
      "--text-muted",
    ]) {
      expect(canonicalColors).toContain(`${token}:`);
    }
    expect(canonicalElements).toContain("--el-fire-1:");
    expect(canonicalElements).toContain('[data-element="fire"]');
    for (const token of ["--space-4", "--space-8"]) {
      expect(canonicalSpacing).toContain(`${token}:`);
    }
    expect(canonicalRadius).toContain("--radius-l:");
    expect(canonicalRadius).toContain("--radius-card:");
    for (const token of ["--font-display", "--font-ui"]) {
      expect(canonicalTypography).toContain(`${token}:`);
    }
  });
});
