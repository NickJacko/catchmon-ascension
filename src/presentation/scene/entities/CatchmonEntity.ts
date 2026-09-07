/**
 * Design owner: Document 15 Task 09.7 (Catchmon Scene Entities) — "render
 * selected assigned/roaming Catchmons with: canonical image, normalized
 * scale, contact shadow, simple idle motion, assignment-aware location.
 * No all-104 rendering." The Catchmon roster in this slice is small and
 * already bounded by `buildCatchmonViews`'s WORKSHOP/SHOP_FLOOR filter, so
 * "no all-104 rendering" holds structurally, not by an arbitrary cap here.
 *
 * Unlike every other scene entity, Catchmon portraits ARE real, final
 * assets already (Phase 5/8) — `view.portraitUrl` is resolved by
 * `scene-view-model.ts` via the same `resolveAssetImageUrl`/`AssetId`
 * pipeline the DOM `CatchmonCard` uses (Document 14 §188: address via
 * AssetId, never a hand-built path). This entity only turns that URL into
 * a `Texture`; it never invents or guesses a filename itself. Textures
 * are cached by URL (module-level, shared across every instance) per
 * §195 — never re-decoded per entity/per update.
 */
import { Container, Graphics, Sprite } from "pixi.js";
import { type OwnedCatchmonId } from "../../../core/ids/index.ts";
import { type SceneCatchmonView } from "../scene-view-model.ts";
import { resolveSceneColor } from "../scene-tokens.ts";
import { loadCachedTexture } from "./texture-cache.ts";

const PORTRAIT_SIZE = 72;

export class CatchmonEntity extends Container {
  private readonly shadow: Graphics;
  private readonly placeholder: Graphics;
  private sprite: Sprite | null = null;
  private ownedCatchmonId: OwnedCatchmonId;
  private readonly bobPhase = Math.random() * Math.PI * 2;
  private baseY = 0;
  private loadedUrl: string | undefined;

  constructor(
    view: SceneCatchmonView,
    onSelect: (ownedCatchmonId: OwnedCatchmonId) => void,
  ) {
    super();
    this.ownedCatchmonId = view.ownedCatchmonId;

    this.shadow = new Graphics()
      .ellipse(0, PORTRAIT_SIZE / 2 + 4, PORTRAIT_SIZE / 2.4, 8)
      .fill({ color: 0x000000, alpha: 0.22 });
    this.placeholder = new Graphics()
      .circle(0, 0, PORTRAIT_SIZE / 2)
      .fill(resolveSceneColor("--surface-slot", 0xe7d3b0));
    this.addChild(this.shadow, this.placeholder);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.on("pointertap", () => {
      onSelect(this.ownedCatchmonId);
    });

    this.update(view);
  }

  update(view: SceneCatchmonView): void {
    this.ownedCatchmonId = view.ownedCatchmonId;
    if (view.portraitUrl && view.portraitUrl !== this.loadedUrl) {
      this.loadedUrl = view.portraitUrl;
      const url = view.portraitUrl;
      loadCachedTexture(url)
        .then((texture) => {
          if (this.destroyed || this.loadedUrl !== url) return; // a newer update/unmount arrived first
          if (!this.sprite) {
            this.sprite = new Sprite(texture);
            this.sprite.anchor.set(0.5, 0.5);
            this.addChild(this.sprite);
            this.placeholder.visible = false;
          } else {
            this.sprite.texture = texture;
          }
          const scale = PORTRAIT_SIZE / Math.max(texture.width, texture.height);
          this.sprite.scale.set(scale);
        })
        .catch(() => {
          // Phase 12 hardening: load failure already evicted from the
          // shared cache (texture-cache.ts), so a later retry can
          // succeed; the placeholder Graphics simply stays visible.
        });
    }
  }

  animate(nowMs: number, reduceMotion: boolean): void {
    if (reduceMotion) {
      this.y = this.baseY;
      return;
    }
    const bob = Math.sin(nowMs / 700 + this.bobPhase) * 3;
    this.y = this.baseY + bob;
  }

  setBasePosition(x: number, y: number): void {
    this.x = x;
    this.baseY = y;
    this.y = y;
  }
}
