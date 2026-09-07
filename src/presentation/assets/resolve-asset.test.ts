import { describe, expect, it } from "vitest";
import { AssetId } from "../../core/ids/index.ts";
import { type AssetMetadata } from "../../domain/assets/index.ts";
import { resolveAssetImageUrl } from "./resolve-asset.ts";

function makeAsset(overrides: Partial<AssetMetadata> = {}): AssetMetadata {
  return {
    assetId: AssetId.from("test-asset"),
    category: "product",
    sourcePath:
      "reference/design-production/normalized-v1/products/does-not-exist.png",
    runtimePath: "/assets/vertical-slice/products/does-not-exist.png",
    status: "FINAL",
    version: 1,
    width: 1024,
    height: 1024,
    format: "png",
    hasAlpha: true,
    tags: [],
    preloadClass: "CURRENT_CONTEXT",
    ...overrides,
  };
}

describe("resolveAssetImageUrl", () => {
  it("returns undefined for an undefined asset", () => {
    expect(resolveAssetImageUrl(undefined)).toBeUndefined();
  });

  it("returns undefined for a PLACEHOLDER-status asset, even with a runtimePath set", () => {
    expect(
      resolveAssetImageUrl(makeAsset({ status: "PLACEHOLDER" })),
    ).toBeUndefined();
  });

  it("falls back to runtimePath for a FINAL asset whose filename isn't a canonical Catchmon portrait (Phase 10 production assets)", () => {
    const url = resolveAssetImageUrl(makeAsset());
    expect(url).toBe("/assets/vertical-slice/products/does-not-exist.png");
  });

  it("returns undefined when a FINAL asset has neither a matching Catchmon portrait nor a usable runtimePath", () => {
    expect(
      resolveAssetImageUrl(makeAsset({ runtimePath: "" })),
    ).toBeUndefined();
  });
});
