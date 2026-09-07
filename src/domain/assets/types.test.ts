// @vitest-environment node
import { describe, expect, it } from "vitest";
import { AssetId } from "../../core/ids/index.ts";
import { type AssetMetadata } from "./types.ts";

describe("AssetMetadata (type-shape fixture, not canonical content)", () => {
  it("is satisfiable for a placeholder asset with a BOOT preload class", () => {
    const example = {
      assetId: AssetId.from("example-asset"),
      category: "product",
      sourcePath: "example/source.png",
      runtimePath: "/assets/example.png",
      status: "PLACEHOLDER",
      version: 1,
      width: 256,
      height: 256,
      format: "png",
      hasAlpha: true,
      tags: ["example"],
      preloadClass: "BOOT",
    } satisfies AssetMetadata;

    expect(example.status).toBe("PLACEHOLDER");
    expect(example.preloadClass).toBe("BOOT");
  });

  it("is satisfiable with an optional semanticOwnerId and variant", () => {
    const example = {
      assetId: AssetId.from("example-asset-variant"),
      category: "catchmonSpecies",
      sourcePath: "example/source2.png",
      runtimePath: "/assets/example2.png",
      status: "FINAL",
      version: 2,
      width: 512,
      height: 512,
      format: "webp",
      hasAlpha: false,
      semanticOwnerId: "example-species-id",
      variant: "shiny",
      tags: [],
      preloadClass: "ON_DEMAND",
    } satisfies AssetMetadata;

    expect(example.semanticOwnerId).toBe("example-species-id");
  });
});
