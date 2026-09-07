/**
 * Design owner: Document 15 Task 09.8 (Expedition Hub Entity), extended by
 * Phase 10 Task 10.6 (real production art) — render
 * locked/available/active/result-ready states; tap routes to the
 * existing World/Hub context (the Shop screen's own Expedition Hub
 * panel/Build flow, or the World screen when owned — the caller decides,
 * per §175).
 *
 * One base raster asset represents every functional state (Phase 10 §6:
 * "do not duplicate the base Hub art merely to represent functional
 * states") — LOCKED/UNDER_CONSTRUCTION dim the sprite via alpha and a
 * flat state-color wash rather than separate art, and the existing
 * active-expedition/result badge stays exactly where it was validated to
 * clear the artwork's margin in the prior asset-normalization audit.
 */
import { Container, Graphics, Sprite } from "pixi.js";
import { type SceneExpeditionHubView } from "../scene-view-model.ts";
import { resolveSceneColor } from "../scene-tokens.ts";
import { loadCachedTexture } from "./texture-cache.ts";

const SIZE = 80;
const HIT_PADDING = 20;

const FOOTPRINT_X = SIZE / 2;
const FOOTPRINT_Y = SIZE;
const ART_DISPLAY_SIZE = 140;

export class ExpeditionHubEntity extends Container {
  private readonly placeholder: Graphics;
  private readonly artContainer: Container;
  private shadowSprite: Sprite | null = null;
  private baseSprite: Sprite | null = null;
  private readonly stateWash: Graphics;
  private readonly badge: Graphics;
  private loadedBaseUrl: string | undefined;
  private loadedShadowUrl: string | undefined;

  constructor(view: SceneExpeditionHubView, onSelect: () => void) {
    super();

    this.placeholder = new Graphics();
    this.artContainer = new Container();
    this.stateWash = new Graphics();
    this.badge = new Graphics();
    this.addChild(
      this.placeholder,
      this.artContainer,
      this.stateWash,
      this.badge,
    );

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = {
      contains: (x: number, y: number) =>
        x >= -HIT_PADDING &&
        x <= SIZE + HIT_PADDING &&
        y >= -HIT_PADDING &&
        y <= SIZE + HIT_PADDING,
    };
    this.on("pointertap", onSelect);

    this.update(view);
  }

  update(view: SceneExpeditionHubView): void {
    this.updateArt(view);

    const colorForState: Record<SceneExpeditionHubView["state"], number> = {
      LOCKED: resolveSceneColor("--action-disabled", 0x8e8984),
      AVAILABLE: resolveSceneColor("--cs-soft-gold", 0xe7b85a),
      UNDER_CONSTRUCTION: resolveSceneColor("--cs-warning", 0xe6a94c),
      OWNED: resolveSceneColor("--cs-success", 0x65b97a),
    };

    this.placeholder.clear();
    this.stateWash.clear();
    if (!this.baseSprite) {
      this.placeholder
        .roundRect(0, 0, SIZE, SIZE, 14)
        .fill(colorForState[view.state])
        .stroke({
          width: 3,
          color: resolveSceneColor("--border-default", 0x7b573d),
          alpha: 0.5,
        });
    } else if (view.state === "LOCKED" || view.state === "UNDER_CONSTRUCTION") {
      // A code-driven tint wash over the real artwork — no duplicated locked/under-construction raster variant (Phase 10 §14).
      this.stateWash
        .circle(
          FOOTPRINT_X,
          FOOTPRINT_Y - ART_DISPLAY_SIZE * 0.42,
          ART_DISPLAY_SIZE * 0.46,
        )
        .fill({ color: colorForState[view.state], alpha: 0.35 });
    }
    this.alpha = view.state === "LOCKED" ? 0.6 : 1;

    this.badge.clear();
    if (view.hasUnviewedResult) {
      this.badge
        .circle(SIZE - 8, 8, 9)
        .fill(resolveSceneColor("--cs-premium", 0xe6b958));
    } else if (view.hasActiveExpedition) {
      this.badge
        .circle(SIZE - 8, 8, 9)
        .fill(resolveSceneColor("--cs-info", 0x67a9d8));
    }
  }

  private updateArt(view: SceneExpeditionHubView): void {
    const art = view.art;
    if (!art?.baseUrl) {
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
