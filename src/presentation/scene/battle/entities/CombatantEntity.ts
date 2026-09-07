/**
 * Design owner: docs/rebuild/15 Phase R9 §9 (Lead), §10 (Enemies/Bosses);
 * Wave 0A Integration (docs/rebuild/GOLDEN_SAMPLE_ASSET_CONTRACT.md).
 * One reusable entity for BOTH the Lead and whatever enemy/boss the
 * current stage names — never a per-species/per-enemy subclass (R9's
 * explicit "must not hardcode Ember Wisp or Vulkan Warden inside generic
 * Pixi rendering logic"). Mirrors `CatchmonEntity.ts`'s placeholder ->
 * real-Sprite-once-resolved pattern, extended with an HP bar and a short
 * hit-flash — R9 §10's "health display alignment" and §11's "hit" motion.
 *
 * Sprite anchor: a loaded texture anchors at `view.pivot` (the asset's own
 * bottom-contact fraction, authored in `content/combat-slice/
 * productionAssets.ts` from each asset's real alpha content bbox) when the
 * view supplies one, else a generic bottom-center `(0.5, 1.0)` — never the
 * old `(0.5, 0.5)` center anchor, which put a standing character's
 * vertical midpoint (not its feet) on the ground anchor point. The
 * placeholder circle/shadow keep their pre-existing center-anchor geometry
 * unchanged (no production sprite to anchor yet); once a sprite loads, the
 * shadow is redrawn to sit under the sprite's real bottom edge instead of
 * the placeholder's assumed radius, so it doesn't visibly float.
 */
import { Container, Graphics, Sprite } from "pixi.js";
import {
  HP_LABEL_STRIP_HEIGHT,
  type SizeEnvelope,
} from "../battle-scene-layout.ts";
import { type SceneCombatantView } from "../battle-scene-view-model.ts";
import { resolveSceneColor } from "../../scene-tokens.ts";
import { loadCachedTexture } from "../../entities/texture-cache.ts";

const HIT_FLASH_MS = 220;

export class CombatantEntity extends Container {
  private readonly shadow: Graphics;
  private readonly placeholder: Graphics;
  private readonly hpBarTrack: Graphics;
  private readonly hpBarFill: Graphics;
  private sprite: Sprite | null = null;
  private loadedUrl: string | undefined;
  private readonly radius: number;

  private hpFraction = 1;
  private baseX = 0;
  private baseY = 0;
  private readonly bobPhase = Math.random() * Math.PI * 2;
  private hitFlashUntilMs = 0;
  private baseTint = 0xffffff;

  /** Exposed so the renderer can detect an envelope change (normal enemy <-> boss) and rebuild rather than reuse a pooled entity sized for the wrong footprint. */
  readonly envelopeMaxWidth: number;

  constructor(envelope: SizeEnvelope) {
    super();
    this.envelopeMaxWidth = envelope.maxWidth;
    this.radius = Math.min(envelope.maxWidth, envelope.maxHeight) / 2;

    this.shadow = new Graphics();
    this.redrawShadow(this.radius + 8);
    this.placeholder = new Graphics()
      .circle(0, 0, this.radius)
      .fill(resolveSceneColor("--surface-slot", 0xe7d3b0));

    const barWidth = this.radius * 2;
    const barY = -this.radius - HP_LABEL_STRIP_HEIGHT + 12;
    this.hpBarTrack = new Graphics()
      .roundRect(-barWidth / 2, barY, barWidth, 6, 3)
      .fill(resolveSceneColor("--surface-slot", 0xd8c6a3));
    this.hpBarFill = new Graphics();

    this.addChild(
      this.shadow,
      this.placeholder,
      this.hpBarTrack,
      this.hpBarFill,
    );
    this.redrawHpBar();
  }

  update(view: SceneCombatantView): void {
    // Element-tinted placeholder reads as "identity" until a real portrait
    // resolves (Document 13: no enemy/boss battle art exists yet); a real
    // portrait (the Lead's canonical asset) is shown untinted.
    this.baseTint = view.elementId
      ? resolveSceneColor(`--el-${view.elementId}-1`, 0xffffff)
      : 0xffffff;

    if (view.portraitUrl && view.portraitUrl !== this.loadedUrl) {
      this.loadedUrl = view.portraitUrl;
      const url = view.portraitUrl;
      const pivot = view.pivot;
      loadCachedTexture(url)
        .then((texture) => {
          if (this.destroyed || this.loadedUrl !== url) return;
          let sprite = this.sprite;
          if (!sprite) {
            sprite = new Sprite(texture);
            this.sprite = sprite;
            this.addChildAt(sprite, 1);
            this.placeholder.visible = false;
          } else {
            sprite.texture = texture;
          }
          sprite.anchor.set(pivot?.x ?? 0.5, pivot?.y ?? 1);
          const diameter = this.radius * 2;
          const scale = diameter / Math.max(texture.width, texture.height);
          sprite.scale.set(scale);
          // The sprite's real bottom edge, in this container's local space
          // (0 at the anchor point when pivot.y is 1; a small positive
          // offset for a pivot slightly above the canvas's bottom edge).
          const contactY = (1 - (pivot?.y ?? 1)) * texture.height * scale;
          this.redrawShadow(contactY + 8);
        })
        .catch(() => {
          // Load failure evicts its own cache entry (texture-cache.ts) — the placeholder simply stays visible.
        });
    }
  }

  setHpFraction(fraction: number): void {
    this.hpFraction = Math.min(1, Math.max(0, fraction));
    this.redrawHpBar();
  }

  /** `y` is where the combatant's real bottom edge sits, local to this container (the placeholder's assumed `radius + 8` until a real sprite's actual contact point is known). */
  private redrawShadow(y: number): void {
    this.shadow
      .clear()
      .ellipse(0, y, this.radius * 0.9, 10)
      .fill({ color: 0x000000, alpha: 0.25 });
  }

  private redrawHpBar(): void {
    const barWidth = this.radius * 2;
    const barY = -this.radius - HP_LABEL_STRIP_HEIGHT + 12;
    const color =
      this.hpFraction > 0.5
        ? resolveSceneColor("--cs-success", 0x6fa06a)
        : this.hpFraction > 0.2
          ? resolveSceneColor("--cs-soft-gold", 0xe7b85a)
          : resolveSceneColor("--cs-error", 0xd96868);
    this.hpBarFill
      .clear()
      .roundRect(-barWidth / 2, barY, barWidth * this.hpFraction, 6, 3)
      .fill(color);
  }

  setBasePosition(x: number, y: number): void {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
  }

  /** A brief red flash marking a landed hit (R9 §11 "hit"). */
  playHit(nowMs: number): void {
    this.hitFlashUntilMs = nowMs + HIT_FLASH_MS;
  }

  animate(nowMs: number, reduceMotion: boolean): void {
    const hitFlashing = this.hitFlashUntilMs > nowMs;
    this.placeholder.tint = hitFlashing ? 0xd96868 : this.baseTint;
    if (this.sprite) this.sprite.tint = hitFlashing ? 0xd96868 : 0xffffff;

    if (reduceMotion) {
      this.x = this.baseX;
      this.y = this.baseY;
      return;
    }
    const bob = Math.sin(nowMs / 650 + this.bobPhase) * 3;
    this.y = this.baseY + bob;
    this.x = hitFlashing ? this.baseX + Math.sin(nowMs / 30) * 4 : this.baseX;
  }
}
