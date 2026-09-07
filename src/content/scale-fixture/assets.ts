/**
 * One shared placeholder asset for every scale-fixture item, mirroring
 * `content/vertical-slice/craftingContent.ts`'s `SLICE_PLACEHOLDER_ITEM_ASSET`
 * precedent — Phase 11 is proving the catalog/registry/state architecture
 * scales, not authoring ~200 real asset records. Every content record
 * below references this one `AssetId`, so `createGameCatalog`'s asset
 * cross-reference validation passes without real art.
 */
import { AssetId } from "../../core/ids/index.ts";
import { type AssetMetadata } from "../../domain/assets/index.ts";

export const SCALE_PLACEHOLDER_ASSET_ID: AssetId = AssetId.from(
  "scale-fixture-placeholder-item-icon",
);

export const SCALE_PLACEHOLDER_ASSET: AssetMetadata = {
  assetId: SCALE_PLACEHOLDER_ASSET_ID,
  category: "item",
  sourcePath: "placeholder/scale-fixture-item-icon.png",
  runtimePath: "/assets/placeholder/scale-fixture-item-icon.png",
  status: "PLACEHOLDER",
  version: 1,
  width: 128,
  height: 128,
  format: "png",
  hasAlpha: true,
  tags: ["placeholder", "scale-fixture"],
  preloadClass: "ON_DEMAND",
};
