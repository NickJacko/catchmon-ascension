/**
 * Design owner: Phase 10 Asset Metadata (§2) — "Add validation/tests so
 * invalid normalized pivot/footprint metadata fails early." A pure
 * validator, not a runtime guard inside the resolver — content authoring
 * mistakes (an out-of-range or non-finite pivot) should surface as a
 * loud, specific failure wherever this is called (content registry
 * construction, a dedicated test), not as a silently-misplaced sprite
 * discovered by a human later.
 */
import { type AssetMetadata } from "./types.ts";

export interface PivotValidationError {
  readonly assetId: string;
  readonly reason: string;
}

/** A pivot fraction must be a finite number within `[0, 1]` — outside that range the "floor contact point" isn't on the image at all. */
function isValidFraction(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= 1;
}

export function validateAssetPivot(
  asset: AssetMetadata,
): PivotValidationError | null {
  if (!asset.pivot) return null;
  const { x, y } = asset.pivot;
  if (!isValidFraction(x) || !isValidFraction(y)) {
    return {
      assetId: asset.assetId,
      reason: `pivot must have both x and y within [0, 1] as finite numbers; got (${String(x)}, ${String(y)})`,
    };
  }
  return null;
}

/** Batch form for validating an entire registered asset list (e.g. a catalog's full `assets` array) in one pass. */
export function validateAssetPivots(
  assets: readonly AssetMetadata[],
): readonly PivotValidationError[] {
  const errors: PivotValidationError[] = [];
  for (const asset of assets) {
    const error = validateAssetPivot(asset);
    if (error) errors.push(error);
  }
  return errors;
}
