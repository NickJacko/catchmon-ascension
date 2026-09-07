/**
 * Design owner: docs/rebuild/15 Phase R9 §7 (Camera / Logical Scene).
 * Pure geometry — no Pixi import, no domain import, no gameplay state,
 * matching `scene-layout.ts`'s own contract exactly. Every value below
 * becomes an ART CONTRACT the moment this phase ships (see
 * `docs/rebuild/GOLDEN_SAMPLE_ASSET_CONTRACT.md`) — changing them after
 * that point is a scope decision, not a drive-by tuning pass.
 *
 * Chosen shape: a compact 8:5 landscape "battle banner" (640x400), not a
 * full-bleed portrait canvas. The Journey screen is itself a portrait,
 * scrolling, multi-panel mobile screen (Document 12 §3: stage/boss
 * progress, Lead, enemy, Forge-ready indicator, objective all share the
 * screen) — a landscape strip embedded near the top leaves room for that
 * surrounding UI without the battle stage swallowing the whole viewport,
 * matching the common mobile-RPG "battle banner over a control panel"
 * layout `computeViewport`'s "contain, centered" responsive scaling
 * already handles for any host width.
 */

export const BATTLE_SCENE_WIDTH = 640;
export const BATTLE_SCENE_HEIGHT = 400;

/** Document 14 §179-style layer order: background behind ground behind combatants behind VFX/foreground. */
export const BATTLE_SCENE_LAYER_ORDER = [
  "background",
  "ground",
  "combatants",
  "effects",
  "foreground",
] as const;
export type BattleSceneLayerName = (typeof BATTLE_SCENE_LAYER_ORDER)[number];

export interface ScenePoint {
  readonly x: number;
  readonly y: number;
}

/** Where the ground plane sits — everything below this line reads as "floor," everything above as "air" (VFX arcs, jump poses). */
export const BATTLE_GROUND_LINE_Y = 300;

/** The Lead always stands stage-left, facing right. */
export const LEAD_ANCHOR: ScenePoint = { x: 150, y: 280 };
/** A normal enemy's anchor, stage-right, facing left. */
export const ENEMY_ANCHOR: ScenePoint = { x: 490, y: 280 };
/** A boss's anchor — slightly higher/more-centered than a normal enemy to accommodate its larger envelope while keeping its feet on the same ground line. */
export const BOSS_ANCHOR: ScenePoint = { x: 470, y: 260 };

export interface SizeEnvelope {
  readonly maxWidth: number;
  readonly maxHeight: number;
}

/** Both the Lead and a normal enemy share one envelope — symmetric combat presentation, no combatant reads as structurally "bigger" than its opponent by default. */
export const COMBATANT_ENVELOPE: SizeEnvelope = {
  maxWidth: 120,
  maxHeight: 120,
};
/** A boss's allowed footprint — larger, but still capped (Document 03 §7 "boss" is a stakes/mechanics distinction here, not licence for unbounded art). */
export const BOSS_ENVELOPE: SizeEnvelope = { maxWidth: 200, maxHeight: 200 };

/** VFX (hit flashes, damage numbers, skill effects) must stay within this inset region — never bleed to the canvas edge, never cross into the reserved HP-label strip below. */
export const VFX_SAFE_BOUNDS = {
  x: 40,
  y: 40,
  width: BATTLE_SCENE_WIDTH - 80,
  height: BATTLE_SCENE_HEIGHT - 80,
} as const;

/** Reserved top strip for each combatant's name/HP readout — combatant art must never be positioned so its top edge invades this band, keeping health display legible over any background. */
export const HP_LABEL_STRIP_HEIGHT = 34;

/**
 * Maps a logical point to screen pixels for the current container size —
 * "contain" scaling (never crops), centered, identical algorithm to
 * `scene-layout.ts`'s `computeViewport` (kept as a separate, duplicate
 * function rather than a shared import: the two scenes' logical
 * dimensions differ, and a shared generic helper would need to take both
 * as parameters anyway — this is exactly as much duplication as that
 * refactor would remove).
 */
export interface SceneViewport {
  readonly scale: number;
  readonly offsetX: number;
  readonly offsetY: number;
}

export function computeBattleViewport(
  containerWidth: number,
  containerHeight: number,
): SceneViewport {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { scale: 1, offsetX: 0, offsetY: 0 };
  }
  const scale = Math.min(
    containerWidth / BATTLE_SCENE_WIDTH,
    containerHeight / BATTLE_SCENE_HEIGHT,
  );
  const offsetX = (containerWidth - BATTLE_SCENE_WIDTH * scale) / 2;
  const offsetY = (containerHeight - BATTLE_SCENE_HEIGHT * scale) / 2;
  return { scale, offsetX, offsetY };
}
