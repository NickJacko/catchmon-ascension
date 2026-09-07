/**
 * Design owner: Document 15 Task 09.4 (Station Scene Entities), extended
 * by Phase 10 Task 10.4 (real production art). Consumes only
 * `SceneStationView` (plain data) — no domain import (Document 14 §400).
 * A tap emits the station's real `StationId` via `onSelect`; it never
 * opens a sheet or dispatches a command itself (§175: Pixi emits semantic
 * intents, the caller decides what to open).
 *
 * `view.art` carries the resolved base/shadow image URLs plus the
 * artwork's pre-computed floor-contact pivot (fractions of the source
 * canvas — see `domain/assets/types.ts`'s `AssetPivot`). Pixi's own
 * `Sprite.anchor` uses the identical 0-1 top-left-origin fraction
 * convention, so the pivot maps onto it directly: `sprite.anchor.set(pivot.x,
 * pivot.y)` then `sprite.position.set(FOOTPRINT_X, FOOTPRINT_Y)` puts the
 * artwork's real floor-contact point exactly at the station's local
 * footprint anchor — not an arbitrary box corner. Falls back to the
 * original flat placeholder box when no real art has resolved yet
 * (content with no approved asset), so no station is ever left blank.
 */
import { Container, Graphics, Sprite } from "pixi.js";
import { type StationId } from "../../../core/ids/index.ts";
import { type SceneStationView } from "../scene-view-model.ts";
import { resolveSceneColor } from "../scene-tokens.ts";
import { loadCachedTexture } from "./texture-cache.ts";

const BASE_SIZE = 96;
const HIT_PADDING = 24; // Document 14 §180: hit areas reflect mobile tap comfort, not exact silhouette.

/** The station's local floor-contact point — the old placeholder box's bottom-center, so the progress ring/queue badge (still authored against the 0,0..BASE_SIZE,BASE_SIZE box) don't need to move when real art is swapped in. */
const FOOTPRINT_X = BASE_SIZE / 2;
const FOOTPRINT_Y = BASE_SIZE;
/** Real station art renders noticeably larger than the old flat box so it reads clearly at this scene's scale, while still fitting the two-station zone in `ShopSceneRenderer`'s layout. */
const ART_DISPLAY_SIZE = 170;

export class StationEntity extends Container {
  private readonly placeholder: Graphics;
  private readonly artContainer: Container;
  private shadowSprite: Sprite | null = null;
  private baseSprite: Sprite | null = null;
  private readonly progressRing: Graphics;
  private readonly queueBadge: Graphics;
  private stationId: StationId;
  private loadedBaseUrl: string | undefined;
  private loadedShadowUrl: string | undefined;

  constructor(
    view: SceneStationView,
    onSelect: (stationId: StationId) => void,
  ) {
    super();
    this.stationId = view.stationId;

    this.placeholder = new Graphics();
    this.artContainer = new Container();
    this.progressRing = new Graphics();
    this.queueBadge = new Graphics();
    this.addChild(
      this.placeholder,
      this.artContainer,
      this.progressRing,
      this.queueBadge,
    );

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = {
      contains: (x: number, y: number) =>
        x >= -HIT_PADDING &&
        x <= BASE_SIZE + HIT_PADDING &&
        y >= -HIT_PADDING &&
        y <= BASE_SIZE + HIT_PADDING,
    };
    this.on("pointertap", () => {
      onSelect(this.stationId);
    });

    this.update(view, 0);
  }

  /** `progress` is 0..1 cosmetic craft-fill, computed by the caller from real timestamps + the current frame's clock read — never persisted, never gameplay-affecting (Document 14 §182). */
  update(view: SceneStationView, progress: number): void {
    this.stationId = view.stationId;

    this.updateArt(view);

    const idleColor = resolveSceneColor("--surface-card", 0xfffdf7);
    const craftingColor = resolveSceneColor("--cs-soft-gold", 0xe7b85a);
    const borderColor = resolveSceneColor("--border-default", 0x7b573d);

    this.placeholder.clear();
    if (!this.baseSprite) {
      this.placeholder
        .roundRect(0, 0, BASE_SIZE, BASE_SIZE, 16)
        .fill(view.isCrafting ? craftingColor : idleColor)
        .stroke({ width: 3, color: borderColor, alpha: 0.6 });
    }

    this.progressRing.clear();
    if (view.isCrafting) {
      const radius = BASE_SIZE / 2 + 10;
      const cx = BASE_SIZE / 2;
      const cy = BASE_SIZE / 2;
      const startAngle = -Math.PI / 2;
      const endAngle =
        startAngle + Math.PI * 2 * Math.min(Math.max(progress, 0), 1);
      this.progressRing
        .arc(cx, cy, radius, startAngle, endAngle)
        .stroke({ width: 6, color: craftingColor, alpha: 0.9, cap: "round" });
    }

    this.queueBadge.clear();
    if (view.queuedCount > 0) {
      this.queueBadge
        .circle(BASE_SIZE - 10, 10, 10)
        .fill(resolveSceneColor("--cs-info", 0x67a9d8));
    }
  }

  private updateArt(view: SceneStationView): void {
    const art = view.art;
    if (!art?.baseUrl) {
      // No real art for this state yet — clear any stale sprites and fall back to the placeholder box.
      this.baseSprite?.destroy();
      this.baseSprite = null;
      this.shadowSprite?.destroy();
      this.shadowSprite = null;
      this.loadedBaseUrl = undefined;
      this.loadedShadowUrl = undefined;
      return;
    }
    const pivot = art.pivot ?? { x: 0.5, y: 0.5 };

    if (art.shadowUrl && art.shadowUrl !== this.loadedShadowUrl) {
      this.loadedShadowUrl = art.shadowUrl;
      const url = art.shadowUrl;
      loadCachedTexture(url)
        .then((texture) => {
          if (this.destroyed || this.loadedShadowUrl !== url) return;
          if (!this.shadowSprite) {
            this.shadowSprite = new Sprite(texture);
            this.artContainer.addChildAt(this.shadowSprite, 0);
          } else {
            this.shadowSprite.texture = texture;
          }
          this.shadowSprite.anchor.set(pivot.x, pivot.y);
          this.shadowSprite.position.set(FOOTPRINT_X, FOOTPRINT_Y);
          const scale =
            ART_DISPLAY_SIZE / Math.max(texture.width, texture.height);
          this.shadowSprite.scale.set(scale);
        })
        .catch(() => {
          // Phase 12 hardening — see CatchmonEntity.ts's identical comment.
        });
    }

    if (art.baseUrl !== this.loadedBaseUrl) {
      this.loadedBaseUrl = art.baseUrl;
      const url = art.baseUrl;
      loadCachedTexture(url)
        .then((texture) => {
          if (this.destroyed || this.loadedBaseUrl !== url) return;
          if (!this.baseSprite) {
            this.baseSprite = new Sprite(texture);
            this.artContainer.addChild(this.baseSprite);
            this.placeholder.visible = false;
          } else {
            this.baseSprite.texture = texture;
          }
          this.baseSprite.anchor.set(pivot.x, pivot.y);
          this.baseSprite.position.set(FOOTPRINT_X, FOOTPRINT_Y);
          const scale =
            ART_DISPLAY_SIZE / Math.max(texture.width, texture.height);
          this.baseSprite.scale.set(scale);
        })
        .catch(() => {
          // Phase 12 hardening — see CatchmonEntity.ts's identical comment.
        });
    }
  }
}
