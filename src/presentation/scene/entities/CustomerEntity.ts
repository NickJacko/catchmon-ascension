/**
 * Design owner: Document 15 Task 09.6 (Customer Scene Entities), extended
 * by Phase 10 Task 10.9 (real production art) — "only needs: visual
 * state, position, reaction hooks." No request/eligibility logic lives
 * here; that stays in `getCustomerTransactionOptions` behind the sheet
 * the tap opens.
 *
 * The archetype portrait (`view.portraitUrl`, resolved by
 * `scene-view-model.ts` via the same `AssetId` -> resolver pipeline every
 * other real asset in this slice uses) replaces the flat colored circle.
 * Status is still conveyed without a second raster asset: a thin
 * code-driven ring around the portrait, colored by `view.status` (Phase
 * 10 §14 base art + code-driven overlay). The ground shadow is a plain
 * Pixi ellipse, per Phase 10 §9's explicit "simple CODE-DRIVEN Pixi
 * ground shadow — do not create customer shadow raster assets."
 */
import { Container, Graphics, Sprite } from "pixi.js";
import { type CustomerId } from "../../../core/ids/index.ts";
import { type SceneCustomerView } from "../scene-view-model.ts";
import { resolveSceneColor } from "../scene-tokens.ts";
import { loadCachedTexture } from "./texture-cache.ts";

const RADIUS = 26;
const HIT_PADDING = 18;
const PORTRAIT_HEIGHT = 96;

/** Cosmetic idle bob — deterministic-per-instance phase offset via `Math.random()` (never `core/random`'s seeded gameplay RNG; Document 15 Phase 9 Rule 9), so multiple customers don't bob in lockstep. */
export class CustomerEntity extends Container {
  private readonly groundShadow: Graphics;
  private readonly placeholder: Graphics;
  private readonly statusRing: Graphics;
  private sprite: Sprite | null = null;
  private readonly requestDot: Graphics;
  private customerId: CustomerId;
  private readonly bobPhase = Math.random() * Math.PI * 2;
  private baseY = 0;
  private loadedUrl: string | undefined;

  constructor(
    view: SceneCustomerView,
    onSelect: (customerId: CustomerId) => void,
  ) {
    super();
    this.customerId = view.customerId;

    this.groundShadow = new Graphics()
      .ellipse(0, RADIUS + 6, RADIUS * 0.9, 9)
      .fill({ color: 0x000000, alpha: 0.2 });
    this.placeholder = new Graphics();
    this.statusRing = new Graphics();
    this.requestDot = new Graphics();
    this.addChild(
      this.groundShadow,
      this.placeholder,
      this.statusRing,
      this.requestDot,
    );

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = {
      contains: (x: number, y: number) =>
        x >= -RADIUS - HIT_PADDING &&
        x <= RADIUS + HIT_PADDING &&
        y >= -RADIUS - HIT_PADDING &&
        y <= RADIUS + HIT_PADDING,
    };
    this.on("pointertap", () => {
      onSelect(this.customerId);
    });

    this.update(view);
  }

  update(view: SceneCustomerView): void {
    this.customerId = view.customerId;

    const statusColor =
      view.status === "AWAITING_DECISION"
        ? resolveSceneColor("--cs-warning", 0xe6a94c)
        : view.status === "LEAVING"
          ? resolveSceneColor("--cs-ink-300", 0x8e8984)
          : resolveSceneColor("--cs-info", 0x67a9d8);

    if (view.portraitUrl && view.portraitUrl !== this.loadedUrl) {
      this.loadedUrl = view.portraitUrl;
      const url = view.portraitUrl;
      loadCachedTexture(url)
        .then((texture) => {
          if (this.destroyed || this.loadedUrl !== url) return;
          if (!this.sprite) {
            this.sprite = new Sprite(texture);
            this.sprite.anchor.set(0.5, 1);
            // Insert right above the ground shadow — statusRing/requestDot
            // (added at construction time) must stay on top as overlay
            // badges, not get buried under a portrait appended later.
            this.addChildAt(this.sprite, 1);
            this.placeholder.visible = false;
          } else {
            this.sprite.texture = texture;
          }
          this.sprite.position.set(0, RADIUS);
          const scale = PORTRAIT_HEIGHT / texture.height;
          this.sprite.scale.set(scale);
        })
        .catch(() => {
          // Phase 12 hardening — see CatchmonEntity.ts's identical comment.
        });
    }

    this.placeholder.clear();
    if (!this.sprite) {
      this.placeholder
        .circle(0, 0, RADIUS)
        .fill(statusColor)
        .stroke({
          width: 2,
          color: resolveSceneColor("--border-default", 0x7b573d),
          alpha: 0.5,
        });
    }

    this.statusRing.clear();
    if (this.sprite) {
      this.statusRing
        .circle(0, -RADIUS + 4, RADIUS * 0.42)
        .stroke({ width: 3, color: statusColor, alpha: 0.9 });
    }

    this.requestDot.clear();
    if (view.hasRequest) {
      this.requestDot
        .circle(RADIUS - 6, -RADIUS + 6, 7)
        .fill(resolveSceneColor("--cs-soft-gold", 0xe7b85a));
    }
  }

  /** `nowMs` is a cosmetic wall-clock read (Document 14 §182 — animation state is ephemeral, never persisted). */
  animate(nowMs: number, reduceMotion: boolean): void {
    if (reduceMotion) {
      this.y = this.baseY;
      return;
    }
    const bob = Math.sin(nowMs / 600 + this.bobPhase) * 4;
    this.y = this.baseY + bob;
  }

  setBasePosition(x: number, y: number): void {
    this.x = x;
    this.baseY = y;
    this.y = y;
  }
}
