/*
 * Adapter — not an asset source. Resolves a catalog `AssetMetadata` record
 * into an actual, servable image URL for `<img src>`, or `undefined` when
 * none exists — the presentation-layer half of CLAUDE.md's Asset Rule
 * ("if an approved asset is missing, use the canonical project
 * placeholder... report the missing Asset ID").
 *
 * Two resolution strategies, tried in order, and never mixed:
 *
 * 1. Canonical Catchmon portraits (`sourcePath` under
 *    `reference/catchmons/<Rarity>/<Name>.png`) match by filename against
 *    an eager `import.meta.glob` — unchanged since Phase 5/9, and this
 *    branch is tried first so nothing here alters that pipeline
 *    (CLAUDE.md §25: "preserve the existing canonical Catchmon portrait
 *    pipeline... do not bypass").
 * 2. Phase 10 production assets are real files copied into
 *    `public/assets/vertical-slice/...` (see
 *    `content/vertical-slice/productionAssets.ts`) and served verbatim by
 *    Vite's `public/` convention — no bundling, no glob. Their
 *    `runtimePath` is exactly that servable URL, so a `FINAL` asset whose
 *    filename isn't a Catchmon portrait falls back to it directly.
 *
 * A `PLACEHOLDER`-status asset (still true for any content that has no
 * approved production art) always resolves to `undefined`; callers render
 * their own placeholder slot/box, never a broken `<img>`.
 */
import { type AssetMetadata } from "../../domain/assets/index.ts";

const CATCHMON_PORTRAIT_MODULES = import.meta.glob<string>(
  "../../../reference/catchmons/*/*.png",
  { eager: true, query: "?url", import: "default" },
);

/** Resolves a `FINAL` asset's actual image URL, or `undefined` for a `PLACEHOLDER` (or otherwise unresolvable) asset. */
export function resolveAssetImageUrl(
  asset: AssetMetadata | undefined,
): string | undefined {
  if (!asset || asset.status !== "FINAL") {
    return undefined;
  }
  const fileName = asset.sourcePath.split("/").pop();
  if (fileName) {
    const entry = Object.entries(CATCHMON_PORTRAIT_MODULES).find(([path]) =>
      path.endsWith(`/${fileName}`),
    );
    if (entry) return entry[1];
  }
  return asset.runtimePath || undefined;
}
