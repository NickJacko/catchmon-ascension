import { describe, expect, it } from "vitest";
import source from "./App.css?raw";

describe("App.css (boot gate)", () => {
  it("uses canonical design tokens for background, text, and spacing", () => {
    expect(source).toMatch(/background:\s*var\(--surface-app\)/);
    expect(source).toMatch(/color:\s*var\(--text-body\)/);
    expect(source).toContain("var(--space-8)");
    expect(source).toContain("var(--font-ui)");
    expect(source).toContain("var(--cs-error)");
  });

  it("does not introduce a duplicate hardcoded palette", () => {
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
  });
});
