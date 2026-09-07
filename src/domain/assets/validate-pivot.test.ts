import { describe, expect, it } from "vitest";
import { AssetId } from "../../core/ids/index.ts";
import { type AssetMetadata } from "./types.ts";
import { validateAssetPivot, validateAssetPivots } from "./validate-pivot.ts";

function makeAsset(overrides: Partial<AssetMetadata> = {}): AssetMetadata {
  return {
    assetId: AssetId.from("test-asset"),
    category: "station",
    sourcePath: "reference/design-production/generated-v1/stations/x.png",
    runtimePath: "/assets/vertical-slice/stations/x.png",
    status: "FINAL",
    version: 1,
    width: 1024,
    height: 1024,
    format: "png",
    hasAlpha: true,
    tags: ["station"],
    preloadClass: "CURRENT_CONTEXT",
    ...overrides,
  };
}

describe("validateAssetPivot", () => {
  it("passes an asset with no pivot at all (non-spatial assets never need one)", () => {
    expect(validateAssetPivot(makeAsset())).toBeNull();
  });

  it("passes a valid pivot within [0, 1]", () => {
    expect(
      validateAssetPivot(makeAsset({ pivot: { x: 0.495, y: 0.729 } })),
    ).toBeNull();
  });

  it("passes pivot values at the exact boundary (0 and 1)", () => {
    expect(validateAssetPivot(makeAsset({ pivot: { x: 0, y: 1 } }))).toBeNull();
  });

  it("rejects an x fraction above 1", () => {
    const error = validateAssetPivot(makeAsset({ pivot: { x: 1.2, y: 0.5 } }));
    expect(error).not.toBeNull();
    expect(error?.assetId).toBe("test-asset");
  });

  it("rejects a negative y fraction", () => {
    const error = validateAssetPivot(makeAsset({ pivot: { x: 0.5, y: -0.1 } }));
    expect(error).not.toBeNull();
  });

  it("rejects a non-finite pivot value (NaN/Infinity)", () => {
    expect(
      validateAssetPivot(makeAsset({ pivot: { x: Number.NaN, y: 0.5 } })),
    ).not.toBeNull();
    expect(
      validateAssetPivot(
        makeAsset({ pivot: { x: 0.5, y: Number.POSITIVE_INFINITY } }),
      ),
    ).not.toBeNull();
  });
});

describe("validateAssetPivots (batch)", () => {
  it("returns one error per invalid asset, none for valid ones", () => {
    const assets = [
      makeAsset({ assetId: AssetId.from("good-1"), pivot: { x: 0.5, y: 0.7 } }),
      makeAsset({ assetId: AssetId.from("bad-1"), pivot: { x: 2, y: 0.5 } }),
      makeAsset({ assetId: AssetId.from("good-2") }),
      makeAsset({ assetId: AssetId.from("bad-2"), pivot: { x: 0.5, y: -5 } }),
    ];
    const errors = validateAssetPivots(assets);
    expect(errors).toHaveLength(2);
    expect(errors.map((e) => e.assetId).sort()).toEqual(["bad-1", "bad-2"]);
  });

  it("returns an empty array when every asset is valid", () => {
    const assets = [makeAsset(), makeAsset({ pivot: { x: 0.5, y: 0.5 } })];
    expect(validateAssetPivots(assets)).toEqual([]);
  });
});
