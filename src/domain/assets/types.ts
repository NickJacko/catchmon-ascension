/**
 * Design owner: 13 Asset Taxonomy & Production Plan — §128 Asset Metadata
 * Registry, §129 Semantic Owner ID; 14 Technical Architecture — §188-189
 * Asset Architecture/Registry, §193 Preload Classes.
 *
 * Content-domain type only — no asset metadata records are created here.
 * Runtime code must address assets via `AssetId`, never hand-built paths
 * (Document 14 §188/§190) — this type describes what a registry entry
 * behind an `AssetId` eventually looks like.
 */
import { type AssetId } from "../../core/ids/index.ts";

/**
 * Document 14 §193 Preload Classes.
 */
export type AssetPreloadClass =
  "BOOT" | "CURRENT_CONTEXT" | "PREFETCH" | "ON_DEMAND";

/**
 * Document 13 §128. `category` intentionally stays a plain string, not a
 * closed union — the design doc gives only illustrative examples
 * (`product`, `resource`, `component`, `station`, `region`, `ui`,
 * `customer`, ...) and explicitly says "exact schema belongs to Document
 * 14" without locking the category set. `semanticOwnerId` (§129) is
 * likewise a plain string for now: it may reference any other content
 * ID (`ProductId`, `CatchmonSpeciesId`, `RegionId`, ...), and a precise
 * union would need updating every time a new ownable content type is
 * added — cross-reference *validation* of this field is a Task 01.6+
 * registry concern, not this type's job.
 */
/**
 * Phase 10 addition — the approved convention (canonical pivot = center
 * of the object's actual floor footprint), recorded as explicit,
 * pre-computed metadata rather than something presentation code infers
 * from an image's transparent bounds at runtime (CLAUDE.md §25/§8: don't
 * guess at render time what production already knows). Fractions of the
 * asset's own canvas, `0`-`1`, measured from the top-left corner — e.g.
 * `{ x: 0.5, y: 0.73 }` means the floor-contact point sits at the
 * horizontal center, about three-quarters of the way down the image.
 * Optional: only spatial (station/display/infrastructure) assets carry
 * one; a product icon or a Catchmon portrait has no floor footprint.
 */
export interface AssetPivot {
  readonly x: number;
  readonly y: number;
}

export interface AssetMetadata {
  readonly assetId: AssetId;
  readonly category: string;
  readonly sourcePath: string;
  readonly runtimePath: string;
  readonly status: "PLACEHOLDER" | "FINAL";
  readonly version: number;
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly hasAlpha: boolean;
  readonly semanticOwnerId?: string;
  readonly variant?: string;
  readonly tags: readonly string[];
  readonly preloadClass: AssetPreloadClass;
  readonly pivot?: AssetPivot;
}
