/**
 * Design owner: docs/rebuild/15 Phase R9 §7-11. Mirrors
 * `ShopSceneRenderer.ts`'s contract exactly: owns the Pixi `Application`
 * and every entity's lifecycle, reads only the plain
 * `BattleSceneViewModel`/`BattleSceneEffect` (no domain import anywhere in
 * this file), never opens a sheet or dispatches a command.
 *
 * VFX simplification (R9 §11 "restrained... do not create a final
 * animation system if not required"): `ATTEMPT_STAGE` resolves an entire
 * battle in one deterministic call with no persisted round-by-round log,
 * and a WIN immediately advances `journey.currentStageIndex` to the next
 * stage — by the time `playEffects()` runs, `update()` has usually already
 * repainted the scene with the NEXT enemy. Rather than fight that
 * ordering to reconstruct a numerically-accurate "HP drains toward the
 * old event's remaining value" animation against an entity that may no
 * longer represent the fight that just happened, this renderer plays one
 * restrained, always-correct beat — both combatants flash/shake, an
 * outcome banner announces WIN/LOSS/TIMEOUT — then settles into the
 * already-updated, already-correct idle view. Proves attack/hit/defeat/
 * boss-presence per R9 §11 without fabricating a precision this phase's
 * data doesn't support.
 */
import { Application, Container, Graphics, Sprite, Text } from "pixi.js";
import { DURATION } from "../../motion/index.ts";
import {
  BATTLE_GROUND_LINE_Y,
  BATTLE_SCENE_HEIGHT,
  BATTLE_SCENE_LAYER_ORDER,
  BATTLE_SCENE_WIDTH,
  BOSS_ANCHOR,
  BOSS_ENVELOPE,
  COMBATANT_ENVELOPE,
  ENEMY_ANCHOR,
  LEAD_ANCHOR,
  computeBattleViewport,
  type BattleSceneLayerName,
} from "./battle-scene-layout.ts";
import { resolveSceneColor } from "../scene-tokens.ts";
import { type BattleSceneViewModel } from "./battle-scene-view-model.ts";
import { type BattleSceneEffect } from "./effects/battle-scene-effects.ts";
import { CombatantEntity } from "./entities/CombatantEntity.ts";
import { loadCachedTexture } from "../entities/texture-cache.ts";

const MAX_DPR = 2;
const BANNER_TONE: Readonly<Record<string, number>> = {
  WIN: 0x6fa06a,
  LOSS: 0xd96868,
  TIMEOUT: 0xe7b85a,
};

interface ActiveBanner {
  readonly container: Container;
  startedAtMs: number;
}

export class BattleSceneRenderer {
  private readonly app = new Application();
  private readonly layers = new Map<BattleSceneLayerName, Container>();
  private readonly root = new Container();

  private leadEntity: CombatantEntity | null = null;
  private enemyEntity: CombatantEntity | null = null;
  private reduceMotion = false;
  private activeBanner: ActiveBanner | null = null;

  private readonly backgroundFill = new Graphics();
  private readonly groundLine = new Graphics();
  private backgroundSprite: Sprite | null = null;
  private loadedBackgroundUrl: string | undefined;
  private disposed = false;

  async init(canvasHost: HTMLElement): Promise<void> {
    await this.app.init({
      width: BATTLE_SCENE_WIDTH,
      height: BATTLE_SCENE_HEIGHT,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, MAX_DPR),
      autoDensity: true,
    });
    canvasHost.appendChild(this.app.canvas);

    this.app.stage.addChild(this.root);
    for (const name of BATTLE_SCENE_LAYER_ORDER) {
      const layer = new Container();
      this.layers.set(name, layer);
      this.root.addChild(layer);
    }

    this.layers.get("background")!.addChild(this.backgroundFill);
    this.layers.get("ground")!.addChild(this.groundLine);
    this.drawStaticGeometry(undefined);

    this.app.ticker.add(this.onTick);
  }

  private drawStaticGeometry(tint: number | undefined): void {
    const bg = tint ?? resolveSceneColor("--cs-warm-sand", 0xd8b882);
    this.backgroundFill
      .clear()
      .rect(0, 0, BATTLE_SCENE_WIDTH, BATTLE_SCENE_HEIGHT)
      .fill(bg);
    this.groundLine
      .clear()
      .rect(0, BATTLE_GROUND_LINE_Y, BATTLE_SCENE_WIDTH, 3)
      .fill({ color: 0x000000, alpha: 0.15 });
  }

  /**
   * Real battle-arena art (Wave 0A: Vulkankrater only) layers on top of the
   * element-tinted flat fill rather than replacing it — a region with no
   * background art yet (every region besides Vulkankrater, so far) simply
   * keeps the existing flat-fill fallback, no broken/missing texture.
   */
  private updateBackground(url: string | undefined): void {
    if (url === this.loadedBackgroundUrl) return;
    this.loadedBackgroundUrl = url;
    if (!url) {
      this.backgroundSprite?.destroy();
      this.backgroundSprite = null;
      return;
    }
    loadCachedTexture(url)
      .then((texture) => {
        if (this.disposed || this.loadedBackgroundUrl !== url) return;
        let sprite = this.backgroundSprite;
        if (!sprite) {
          sprite = new Sprite(texture);
          sprite.anchor.set(0, 0);
          this.backgroundSprite = sprite;
          this.layers.get("background")!.addChild(sprite);
        } else {
          sprite.texture = texture;
        }
        sprite.width = BATTLE_SCENE_WIDTH;
        sprite.height = BATTLE_SCENE_HEIGHT;
      })
      .catch(() => {
        // Load failure evicts its own cache entry (texture-cache.ts) — the flat-fill fallback stays visible.
      });
  }

  resize(containerWidth: number, containerHeight: number): void {
    const viewport = computeBattleViewport(containerWidth, containerHeight);
    this.app.renderer.resize(containerWidth, containerHeight);
    this.root.scale.set(viewport.scale);
    this.root.position.set(viewport.offsetX, viewport.offsetY);
  }

  setReducedMotion(reduce: boolean): void {
    this.reduceMotion = reduce;
  }

  pause(): void {
    this.app.ticker.stop();
  }

  resume(): void {
    this.app.ticker.start();
  }

  update(viewModel: BattleSceneViewModel): void {
    const combatants = this.layers.get("combatants")!;

    if (viewModel.regionElementId) {
      const tint = resolveSceneColor(
        `--el-${viewModel.regionElementId}-1`,
        0xd8b882,
      );
      this.drawStaticGeometry(tint);
    }
    this.updateBackground(viewModel.backgroundUrl);

    if (viewModel.lead) {
      if (!this.leadEntity) {
        this.leadEntity = new CombatantEntity(COMBATANT_ENVELOPE);
        this.leadEntity.setBasePosition(LEAD_ANCHOR.x, LEAD_ANCHOR.y);
        combatants.addChild(this.leadEntity);
      }
      this.leadEntity.update(viewModel.lead);
      this.leadEntity.setHpFraction(1);
    } else if (this.leadEntity) {
      this.leadEntity.destroy();
      this.leadEntity = null;
    }

    if (viewModel.enemy) {
      const anchor = viewModel.enemy.isBoss ? BOSS_ANCHOR : ENEMY_ANCHOR;
      const envelope = viewModel.enemy.isBoss
        ? BOSS_ENVELOPE
        : COMBATANT_ENVELOPE;
      // A boss's larger envelope means it can never be the same pooled
      // entity as a normal enemy (the envelope is fixed at construction) —
      // rebuild when the boss-ness of the current enemy changes, not just
      // when its ID changes.
      if (
        !this.enemyEntity ||
        this.enemyEntity.envelopeMaxWidth !== envelope.maxWidth
      ) {
        this.enemyEntity?.destroy();
        this.enemyEntity = new CombatantEntity(envelope);
        combatants.addChild(this.enemyEntity);
      }
      this.enemyEntity.setBasePosition(anchor.x, anchor.y);
      this.enemyEntity.update(viewModel.enemy);
      this.enemyEntity.setHpFraction(1);
    } else if (this.enemyEntity) {
      this.enemyEntity.destroy();
      this.enemyEntity = null;
    }
  }

  playEffects(effects: readonly BattleSceneEffect[]): void {
    const nowMs = Date.now();
    for (const effect of effects) {
      if (effect.kind !== "CLASH") continue;
      this.leadEntity?.playHit(nowMs);
      this.enemyEntity?.playHit(nowMs);
      this.showOutcomeBanner(effect.outcome, nowMs);
    }
  }

  private showOutcomeBanner(outcome: string, nowMs: number): void {
    this.activeBanner?.container.destroy({ children: true });
    const container = new Container();
    const color = BANNER_TONE[outcome] ?? 0xffffff;
    const bg = new Graphics()
      .roundRect(-70, -18, 140, 36, 8)
      .fill({ color, alpha: 0.92 });
    const label = new Text({
      text: outcome,
      style: { fill: 0xffffff, fontSize: 18, fontWeight: "bold" },
    });
    label.anchor.set(0.5);
    container.addChild(bg, label);
    container.position.set(BATTLE_SCENE_WIDTH / 2, BATTLE_SCENE_HEIGHT / 2);
    this.layers.get("foreground")!.addChild(container);
    this.activeBanner = { container, startedAtMs: nowMs };
  }

  private readonly onTick = (): void => {
    const nowMs = Date.now();
    this.leadEntity?.animate(nowMs, this.reduceMotion);
    this.enemyEntity?.animate(nowMs, this.reduceMotion);

    if (this.activeBanner) {
      const duration = this.reduceMotion ? DURATION.fast : DURATION.vfxMax;
      const elapsed = nowMs - this.activeBanner.startedAtMs;
      if (elapsed >= duration) {
        this.activeBanner.container.destroy({ children: true });
        this.activeBanner = null;
      } else {
        const fadeStart = duration - DURATION.vfx;
        this.activeBanner.container.alpha =
          elapsed < fadeStart
            ? 1
            : Math.max(0, 1 - (elapsed - fadeStart) / DURATION.vfx);
      }
    }
  };

  destroy(): void {
    this.disposed = true;
    this.app.ticker.remove(this.onTick);
    this.leadEntity = null;
    this.enemyEntity = null;
    this.backgroundSprite = null;
    this.activeBanner = null;
    this.app.destroy(true, { children: true, texture: false });
  }
}
