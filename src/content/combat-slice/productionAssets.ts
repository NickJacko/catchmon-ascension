/**
 * Design owner: docs/rebuild/GOLDEN_SAMPLE_ASSET_CONTRACT.md; docs/rebuild/
 * POST_R7_ASSET_AUDIT.md; docs/rebuild/13_ART_DIRECTION_CONTENT_AND_ASSET_
 * PIPELINE.md. Wave 0A Integration — the one centralized place the six
 * currently-available Ascension battle-art masters are registered
 * (mirrors `content/vertical-slice/productionAssets.ts`'s exact pattern:
 * `AssetId` -> `AssetMetadata`, no parallel lookup table, no filename
 * inference in rendering code).
 *
 * Provenance: `reference/design-production/ascension-wave0/generated-v1`
 * (art-production source master, untouched) -> `normalized-v1` (content-
 * bbox-cropped, aspect-preserving, still source-controlled) -> this file's
 * `sourcePath` (the direct normalized-v1 input) -> `runtimePath` (a
 * WebP export resized to the real on-screen size — 2x the logical
 * `COMBATANT_ENVELOPE`/`BOSS_ENVELOPE` diameter from
 * `battle-scene-layout.ts` — copied into `public/assets/combat-slice/`,
 * served by Vite's `public/` convention like every other Phase 10/Wave 0
 * asset). See `reference/design-production/ascension-wave0/qa/
 * WAVE_0A_INTEGRATION_REPORT.md` for the full intake/normalization audit.
 *
 * Only the six assets confirmed usable this pass are registered here.
 * `forge.base`/`forge.charged-overlay` are NOT registered — both source
 * files fail the Golden Sample contract (base.png is a full baked scene,
 * not an isolated device on transparent ground; charged-overlay.png is a
 * complete standalone illustration at a different framing/canvas than
 * base.png, not a thin additive overlay) and are flagged rather than
 * silently reinterpreted (CLAUDE.md primary rule). `forge.reveal-overlay`
 * has no source art at all. See the QA report's Forge section.
 *
 * Pivots are the exact bottom-contact point of each character's own alpha
 * content bbox (computed directly from the normalized master, not
 * inferred at render time) — the "floor/visual-envelope contact point"
 * `CombatantEntity`'s sprite anchor reads generically, so Ember Wisp's
 * floating (legless) silhouette anchors at the bottom of its visual
 * envelope rather than a fabricated literal-feet point.
 */
import {
  AssetId,
  type CatchmonSpeciesId,
  type EnemyId,
  type RegionId,
} from "../../core/ids/index.ts";
import {
  type AssetMetadata,
  type AssetPivot,
} from "../../domain/assets/index.ts";
import { FLAMAROX_SPECIES_ID } from "../vertical-slice/catchmonContent.ts";
import { START_REGION_ID } from "../vertical-slice/verticalSliceManifest.ts";
import { EMBER_WISP_ENEMY_ID, VULKAN_WARDEN_BOSS_ID } from "./enemies.ts";

const NORMALIZED_ROOT =
  "reference/design-production/ascension-wave0/normalized-v1";
const RUNTIME_ROOT = "/assets/combat-slice";

export const COMBAT_VULKANKRATER_BACKGROUND_ASSET_ID = AssetId.from(
  "combat.vulkankrater.background",
);
export const COMBAT_FLAMAROX_IDLE_ASSET_ID = AssetId.from(
  "combat.flamarox.idle",
);
export const COMBAT_EMBER_WISP_IDLE_ASSET_ID = AssetId.from(
  "combat.ember-wisp.idle",
);
export const COMBAT_VULKAN_WARDEN_IDLE_ASSET_ID = AssetId.from(
  "combat.vulkan-warden.idle",
);

function combatIdleAsset(
  assetId: AssetId,
  relPath: string,
  runtimeRelPath: string,
  width: number,
  height: number,
  pivot: AssetPivot,
  tags: readonly string[],
): AssetMetadata {
  return {
    assetId,
    category: "combat-idle",
    sourcePath: `${NORMALIZED_ROOT}/${relPath}`,
    runtimePath: `${RUNTIME_ROOT}/${runtimeRelPath}`,
    status: "FINAL",
    version: 1,
    width,
    height,
    format: "webp",
    hasAlpha: true,
    tags,
    preloadClass: "CURRENT_CONTEXT",
    pivot,
  };
}

// Runtime sizes are 2x the logical envelope diameter from
// `battle-scene-layout.ts` (COMBATANT_ENVELOPE=120, BOSS_ENVELOPE=200) —
// retina-sharp without shipping the full ~1300-1700px normalized master
// to the browser for a sprite that renders at ~120-200px on screen.

export const COMBAT_VULKANKRATER_BACKGROUND_ASSET: AssetMetadata = {
  assetId: COMBAT_VULKANKRATER_BACKGROUND_ASSET_ID,
  category: "combat-background",
  sourcePath: `${NORMALIZED_ROOT}/combat/vulkankrater/background.png`,
  runtimePath: `${RUNTIME_ROOT}/vulkankrater/background.webp`,
  status: "FINAL",
  version: 1,
  width: 1280,
  height: 800,
  format: "webp",
  hasAlpha: false,
  tags: ["combat", "background", "vulkankrater", "wave0"],
  preloadClass: "CURRENT_CONTEXT",
};

export const COMBAT_FLAMAROX_IDLE_ASSET: AssetMetadata = combatIdleAsset(
  COMBAT_FLAMAROX_IDLE_ASSET_ID,
  "combat/flamarox/idle.png",
  "flamarox/idle.webp",
  240,
  224,
  { x: 0.5, y: 0.8929 },
  ["combat", "idle", "flamarox", "lead", "wave0"],
);

export const COMBAT_EMBER_WISP_IDLE_ASSET: AssetMetadata = combatIdleAsset(
  COMBAT_EMBER_WISP_IDLE_ASSET_ID,
  "combat/ember-wisp/idle.png",
  "ember-wisp/idle.webp",
  214,
  240,
  { x: 0.5, y: 0.9 },
  ["combat", "idle", "ember-wisp", "enemy", "wave0"],
);

export const COMBAT_VULKAN_WARDEN_IDLE_ASSET: AssetMetadata = combatIdleAsset(
  COMBAT_VULKAN_WARDEN_IDLE_ASSET_ID,
  "combat/vulkan-warden/idle.png",
  "vulkan-warden/idle.webp",
  400,
  321,
  { x: 0.5, y: 0.875 },
  ["combat", "idle", "vulkan-warden", "boss", "wave0"],
);

export const COMBAT_SLICE_PRODUCTION_ASSETS: readonly AssetMetadata[] = [
  COMBAT_VULKANKRATER_BACKGROUND_ASSET,
  COMBAT_FLAMAROX_IDLE_ASSET,
  COMBAT_EMBER_WISP_IDLE_ASSET,
  COMBAT_VULKAN_WARDEN_IDLE_ASSET,
];

/**
 * Content-owned lookup maps — the mechanism `battle-scene-view-model.ts`
 * (a pure selector) uses to resolve which AssetId belongs to which
 * species/enemy/region, generically. Mirrors `scene-view-model.ts`'s own
 * established precedent of importing a content-layer lookup map
 * (`STATION_ASSET_IDS_BY_ARCHETYPE`) directly, rather than the renderer
 * or view-model hardcoding a species/enemy name branch (docs/rebuild/15
 * Phase R9 §9-10's explicit "must not hardcode Ember Wisp/Vulkan Warden
 * inside rendering logic").
 */
export const LEAD_BATTLE_IDLE_ASSET_ID_BY_SPECIES: ReadonlyMap<
  CatchmonSpeciesId,
  AssetId
> = new Map([[FLAMAROX_SPECIES_ID, COMBAT_FLAMAROX_IDLE_ASSET_ID]]);

export const ENEMY_BATTLE_IDLE_ASSET_ID_BY_ENEMY: ReadonlyMap<
  EnemyId,
  AssetId
> = new Map([
  [EMBER_WISP_ENEMY_ID, COMBAT_EMBER_WISP_IDLE_ASSET_ID],
  [VULKAN_WARDEN_BOSS_ID, COMBAT_VULKAN_WARDEN_IDLE_ASSET_ID],
]);

export const REGION_BATTLE_BACKGROUND_ASSET_ID_BY_REGION: ReadonlyMap<
  RegionId,
  AssetId
> = new Map([[START_REGION_ID, COMBAT_VULKANKRATER_BACKGROUND_ASSET_ID]]);
