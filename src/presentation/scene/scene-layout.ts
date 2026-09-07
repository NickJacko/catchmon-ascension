/**
 * Design owner: Document 15 Task 09.1 (Pixi Shop Scene Host), Document 14
 * §176 Logical Scene Coordinate Space, §177 Responsive Camera, §179 Depth
 * Sorting. Pure geometry — no Pixi import, no domain import, no gameplay
 * state. `ShopSceneRenderer` authors every entity anchor in this fixed
 * logical space; the host maps logical -> screen coordinates once per
 * resize, so entity code never re-derives positions per device (§177:
 * "do not re-author entity positions independently for every device").
 *
 * The chosen 1200x800 logical space is a compact, landscape-ish "shop
 * interior" consistent with Document 12's fixed elevated three-quarter
 * camera (not a free-form 3D space) — exact dimensions are implementation
 * tuning per §176, not a locked design decision.
 */

export const SCENE_WIDTH = 1200;
export const SCENE_HEIGHT = 800;

/** §179: layers derive depth order — background behind floor behind entities behind foreground/vfx. */
export const SCENE_LAYER_ORDER = [
  "background",
  "floor",
  "zones",
  "entities",
  "foreground",
  "effects",
] as const;
export type SceneLayerName = (typeof SCENE_LAYER_ORDER)[number];

export interface ScenePoint {
  readonly x: number;
  readonly y: number;
}

/** Up to 2 stations, left-of-center, side by side on the shop floor. */
export function stationAnchor(index: number): ScenePoint {
  const positions: readonly ScenePoint[] = [
    { x: 260, y: 460 },
    { x: 480, y: 460 },
  ];
  return positions[index] ?? { x: 260 + index * 220, y: 460 };
}

/** Up to 3 displays, a "shelf" line right-of-center. */
export function displayAnchor(index: number): ScenePoint {
  const positions: readonly ScenePoint[] = [
    { x: 760, y: 360 },
    { x: 920, y: 360 },
    { x: 1080, y: 360 },
  ];
  return positions[index] ?? { x: 760 + index * 160, y: 360 };
}

/** Customer queue: a line near the bottom, spread across the floor. */
export function customerAnchor(index: number, total: number): ScenePoint {
  const spread = 640;
  const startX = SCENE_WIDTH / 2 - spread / 2;
  const step = total > 1 ? spread / (total - 1) : 0;
  const x = total > 1 ? startX + step * index : SCENE_WIDTH / 2;
  return { x, y: 680 };
}

/** A Shop Floor-assigned Catchmon stands near the displays, front of the shelf line. */
export function shopFloorCatchmonAnchor(index: number): ScenePoint {
  return { x: 900 + index * 90, y: 560 };
}

/** A Workshop-assigned Catchmon stands just beside its station. */
export function workshopCatchmonAnchor(stationPoint: ScenePoint): ScenePoint {
  return { x: stationPoint.x + 70, y: stationPoint.y + 40 };
}

/** Fixed top-right "building" badge — never relocated by content changes. */
export const EXPEDITION_HUB_ANCHOR: ScenePoint = { x: 1100, y: 140 };

/**
 * Maps a logical point to screen pixels given the current container size —
 * "contain" scaling (never crops the scene) with the result centered,
 * i.e. §177/§178's safe-area-respecting responsive camera. Returns the
 * uniform scale and offset so the caller can also scale entity sizes.
 */
export interface SceneViewport {
  readonly scale: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export function computeViewport(
  containerWidth: number,
  containerHeight: number,
): SceneViewport {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { scale: 1, offsetX: 0, offsetY: 0 };
  }
  const scale = Math.min(
    containerWidth / SCENE_WIDTH,
    containerHeight / SCENE_HEIGHT,
  );
  const offsetX = (containerWidth - SCENE_WIDTH * scale) / 2;
  const offsetY = (containerHeight - SCENE_HEIGHT * scale) / 2;
  return { scale, offsetX, offsetY };
}
