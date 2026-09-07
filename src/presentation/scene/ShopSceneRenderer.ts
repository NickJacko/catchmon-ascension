/**
 * Design owner: Document 15 Tasks 09.1/09.3/09.9; Document 14 §170-172
 * Pixi Scene Architecture ("no game state inside Pixi... never persist a
 * Sprite/Container/Texture"), §400 Scene Acceptance Criteria.
 *
 * Owns the Pixi `Application` and every scene entity's lifecycle. Reads
 * only the plain `ShopSceneViewModel` (never `GameState`/`GameCatalog`
 * directly — no domain import anywhere in this file) and emits semantic
 * callbacks on tap; it never opens a sheet or dispatches a command
 * itself. Entities are created once per gameplay ID and mutated in place
 * on every `update()` (Document 15 Phase 9 Rule 10: reusable sprites, no
 * per-frame allocation) rather than torn down and rebuilt.
 */
import {
  Application,
  Container,
  Graphics,
  Sprite,
  type FillInput,
} from "pixi.js";
import {
  type CustomerId,
  type DisplaySlotId,
  type OwnedCatchmonId,
  type StationId,
} from "../../core/ids/index.ts";
import { DURATION } from "../motion/index.ts";
import {
  computeViewport,
  customerAnchor,
  displayAnchor,
  EXPEDITION_HUB_ANCHOR,
  SCENE_HEIGHT,
  SCENE_LAYER_ORDER,
  SCENE_WIDTH,
  shopFloorCatchmonAnchor,
  stationAnchor,
  workshopCatchmonAnchor,
  type SceneLayerName,
} from "./scene-layout.ts";
import { resolveSceneColor } from "./scene-tokens.ts";
import { type ShopSceneViewModel } from "./scene-view-model.ts";
import { StationEntity } from "./entities/StationEntity.ts";
import { DisplayEntity } from "./entities/DisplayEntity.ts";
import { CustomerEntity } from "./entities/CustomerEntity.ts";
import { CatchmonEntity } from "./entities/CatchmonEntity.ts";
import { ExpeditionHubEntity } from "./entities/ExpeditionHubEntity.ts";
import { loadCachedTexture } from "./entities/texture-cache.ts";
import { type SceneEffect } from "./effects/scene-effects.ts";

export interface ShopSceneCallbacks {
  readonly onStationSelected: (stationId: StationId) => void;
  readonly onDisplaySelected: (displaySlotId: DisplaySlotId) => void;
  readonly onCustomerSelected: (customerId: CustomerId) => void;
  readonly onCatchmonSelected: (ownedCatchmonId: OwnedCatchmonId) => void;
  readonly onExpeditionHubSelected: () => void;
}

const MAX_DPR = 2; // Document 14 §186: cap expensive resolution rather than rendering at extreme device DPR unconditionally.

interface ActiveEffect {
  readonly graphic: Graphics;
  startedAtMs: number;
}

export class ShopSceneRenderer {
  private readonly app = new Application();
  private readonly layers = new Map<SceneLayerName, Container>();
  private readonly root = new Container();

  private readonly stationEntities = new Map<StationId, StationEntity>();
  private readonly displayEntities = new Map<DisplaySlotId, DisplayEntity>();
  private readonly customerEntities = new Map<CustomerId, CustomerEntity>();
  private readonly catchmonEntities = new Map<
    OwnedCatchmonId,
    CatchmonEntity
  >();
  private hubEntity: ExpeditionHubEntity | null = null;

  private currentViewModel: ShopSceneViewModel | null = null;
  private reduceMotion = false;
  private readonly activeEffects: ActiveEffect[] = [];
  private readonly macroStageBanner = new Graphics();
  private lastMacroStage: ShopSceneViewModel["macroStage"] | null = null;

  private readonly wallFallback = new Graphics();
  private readonly floorFallback = new Graphics();
  private wallSprite: Sprite | null = null;
  private floorSprite: Sprite | null = null;
  private loadedWallUrl: string | undefined;
  private loadedFloorUrl: string | undefined;

  async init(
    canvasHost: HTMLElement,
    callbacks: ShopSceneCallbacks,
  ): Promise<void> {
    await this.app.init({
      width: SCENE_WIDTH,
      height: SCENE_HEIGHT,
      backgroundAlpha: 0,
      antialias: true,
      resolution: Math.min(window.devicePixelRatio || 1, MAX_DPR),
      autoDensity: true,
    });
    canvasHost.appendChild(this.app.canvas);

    this.app.stage.addChild(this.root);
    for (const name of SCENE_LAYER_ORDER) {
      const layer = new Container();
      this.layers.set(name, layer);
      this.root.addChild(layer);
    }

    this.drawEnvironment();
    this.layers.get("foreground")!.addChild(this.macroStageBanner);
    this.callbacks = callbacks;

    this.app.ticker.add(this.onTick);
  }

  private callbacks: ShopSceneCallbacks | null = null;

  /**
   * Document 15 Task 09.3, extended by Phase 10 Task 10.3. Draws the
   * neutral fallback background/floor shapes first (still the actual
   * rendering whenever real environment art hasn't resolved), then
   * `updateEnvironmentArt` layers the real 2400x1600 wall/floor Sprites
   * on top once the scene view model resolves them — the fallback stays
   * in the tree underneath so a load failure never leaves a blank scene.
   */
  private drawEnvironment(): void {
    const background = this.layers.get("background")!;
    const floor = this.layers.get("floor")!;
    const zones = this.layers.get("zones")!;

    const wallColor = resolveSceneColor("--cs-warm-sand", 0xd8b882);
    const floorColor = resolveSceneColor("--cs-sand-300", 0xe4cfa9);
    const zoneOutline = resolveSceneColor("--border-hairline", 0x7b573d);

    this.wallFallback
      .rect(0, 0, SCENE_WIDTH, SCENE_HEIGHT * 0.42)
      .fill(wallColor);
    background.addChild(this.wallFallback);
    this.floorFallback
      .rect(0, SCENE_HEIGHT * 0.42, SCENE_WIDTH, SCENE_HEIGHT * 0.58)
      .fill(floorColor);
    floor.addChild(this.floorFallback);

    const zoneFill: FillInput = { color: zoneOutline, alpha: 0.18 };
    // Station zone
    zones.addChild(
      new Graphics()
        .roundRect(180, 380, 380, 180, 24)
        .stroke({ width: 2, color: zoneOutline, alpha: 0.35 })
        .fill(zoneFill),
    );
    // Display zone
    zones.addChild(
      new Graphics()
        .roundRect(700, 280, 460, 180, 24)
        .stroke({ width: 2, color: zoneOutline, alpha: 0.35 })
        .fill(zoneFill),
    );
  }

  /** Called by the host on every container resize (Document 14 §177 Responsive Camera). */
  resize(containerWidth: number, containerHeight: number): void {
    const viewport = computeViewport(containerWidth, containerHeight);
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

  /** Document 15 Phase 9 Rule 6: infrastructure/macro shop stage must be visually represented, not just stations/displays/customers. A thin gold trim marks the shop as EXPANDED (Document 08's "growth is visible") — cheap, redrawn only on actual stage change. */
  private updateMacroStageBanner(
    macroStage: ShopSceneViewModel["macroStage"],
  ): void {
    if (macroStage === this.lastMacroStage) return;
    this.lastMacroStage = macroStage;
    this.macroStageBanner.clear();
    if (macroStage === "EXPANDED") {
      this.macroStageBanner
        .rect(0, 0, SCENE_WIDTH, 8)
        .fill(resolveSceneColor("--cs-soft-gold", 0xe7b85a));
    }
  }

  /**
   * Task 10.3: the real environment layers are a single @2x
   * (2400x1600 -> 1200x800) full-canvas Sprite each, stacked in the
   * existing `background` (wall) then `floor` layer order — the floor
   * layer's own transparent regions let the wall show through above it,
   * exactly mirroring the flat-rect fallback's 42%/58% split without this
   * renderer needing to know that split itself. Once a real Sprite loads
   * for a layer, its flat-color fallback beneath it is hidden.
   */
  private updateEnvironmentArt(
    environment: ShopSceneViewModel["environment"],
  ): void {
    if (environment.wallUrl && environment.wallUrl !== this.loadedWallUrl) {
      this.loadedWallUrl = environment.wallUrl;
      const url = environment.wallUrl;
      void loadCachedTexture(url).then((texture) => {
        if (this.loadedWallUrl !== url) return;
        if (!this.wallSprite) {
          this.wallSprite = new Sprite(texture);
          this.layers.get("background")!.addChild(this.wallSprite);
          this.wallFallback.visible = false;
        } else {
          this.wallSprite.texture = texture;
        }
        this.wallSprite.width = SCENE_WIDTH;
        this.wallSprite.height = SCENE_HEIGHT;
      });
    }
    if (environment.floorUrl && environment.floorUrl !== this.loadedFloorUrl) {
      this.loadedFloorUrl = environment.floorUrl;
      const url = environment.floorUrl;
      void loadCachedTexture(url).then((texture) => {
        if (this.loadedFloorUrl !== url) return;
        if (!this.floorSprite) {
          this.floorSprite = new Sprite(texture);
          this.layers.get("floor")!.addChild(this.floorSprite);
          this.floorFallback.visible = false;
        } else {
          this.floorSprite.texture = texture;
        }
        this.floorSprite.width = SCENE_WIDTH;
        this.floorSprite.height = SCENE_HEIGHT;
      });
    }
  }

  update(viewModel: ShopSceneViewModel): void {
    this.currentViewModel = viewModel;
    const entitiesLayer = this.layers.get("entities")!;
    const callbacks = this.callbacks;
    if (!callbacks) return;

    this.updateMacroStageBanner(viewModel.macroStage);
    this.updateEnvironmentArt(viewModel.environment);

    // Stations
    const seenStations = new Set<StationId>();
    viewModel.stations.forEach((view, index) => {
      seenStations.add(view.stationId);
      let entity = this.stationEntities.get(view.stationId);
      if (!entity) {
        entity = new StationEntity(view, callbacks.onStationSelected);
        this.stationEntities.set(view.stationId, entity);
        entitiesLayer.addChild(entity);
      }
      const anchor = stationAnchor(index);
      entity.position.set(anchor.x, anchor.y);
      entity.update(
        view,
        this.craftProgress(view.craftStartedAtMs, view.craftCompletesAtMs),
      );
    });
    for (const [stationId, entity] of this.stationEntities) {
      if (!seenStations.has(stationId)) {
        entity.destroy();
        this.stationEntities.delete(stationId);
      }
    }

    // Displays
    const seenDisplays = new Set<DisplaySlotId>();
    viewModel.displays.forEach((view, index) => {
      seenDisplays.add(view.displaySlotId);
      let entity = this.displayEntities.get(view.displaySlotId);
      if (!entity) {
        entity = new DisplayEntity(view, callbacks.onDisplaySelected);
        this.displayEntities.set(view.displaySlotId, entity);
        entitiesLayer.addChild(entity);
      }
      const anchor = displayAnchor(index);
      entity.position.set(anchor.x, anchor.y);
      entity.update(view);
    });
    for (const [displaySlotId, entity] of this.displayEntities) {
      if (!seenDisplays.has(displaySlotId)) {
        entity.destroy();
        this.displayEntities.delete(displaySlotId);
      }
    }

    // Customers
    const seenCustomers = new Set<CustomerId>();
    viewModel.customers.forEach((view, index) => {
      seenCustomers.add(view.customerId);
      let entity = this.customerEntities.get(view.customerId);
      if (!entity) {
        entity = new CustomerEntity(view, callbacks.onCustomerSelected);
        this.customerEntities.set(view.customerId, entity);
        entitiesLayer.addChild(entity);
      }
      const anchor = customerAnchor(index, viewModel.customers.length);
      entity.setBasePosition(anchor.x, anchor.y);
      entity.update(view);
    });
    for (const [customerId, entity] of this.customerEntities) {
      if (!seenCustomers.has(customerId)) {
        entity.destroy();
        this.customerEntities.delete(customerId);
      }
    }

    // Catchmons
    const seenCatchmons = new Set<OwnedCatchmonId>();
    let shopFloorIndex = 0;
    for (const view of viewModel.catchmons) {
      seenCatchmons.add(view.ownedCatchmonId);
      let entity = this.catchmonEntities.get(view.ownedCatchmonId);
      if (!entity) {
        entity = new CatchmonEntity(view, callbacks.onCatchmonSelected);
        this.catchmonEntities.set(view.ownedCatchmonId, entity);
        entitiesLayer.addChild(entity);
      }
      if (view.zone === "WORKSHOP" && view.stationId) {
        const stationIndex = viewModel.stations.findIndex(
          (s) => s.stationId === view.stationId,
        );
        const anchor = workshopCatchmonAnchor(
          stationAnchor(Math.max(stationIndex, 0)),
        );
        entity.setBasePosition(anchor.x, anchor.y);
      } else {
        const anchor = shopFloorCatchmonAnchor(shopFloorIndex);
        shopFloorIndex += 1;
        entity.setBasePosition(anchor.x, anchor.y);
      }
      entity.update(view);
    }
    for (const [ownedCatchmonId, entity] of this.catchmonEntities) {
      if (!seenCatchmons.has(ownedCatchmonId)) {
        entity.destroy();
        this.catchmonEntities.delete(ownedCatchmonId);
      }
    }

    // Expedition Hub — a single, always-present entity.
    if (!this.hubEntity) {
      this.hubEntity = new ExpeditionHubEntity(
        viewModel.expeditionHub,
        callbacks.onExpeditionHubSelected,
      );
      this.hubEntity.position.set(
        EXPEDITION_HUB_ANCHOR.x,
        EXPEDITION_HUB_ANCHOR.y,
      );
      entitiesLayer.addChild(this.hubEntity);
    } else {
      this.hubEntity.update(viewModel.expeditionHub);
    }
  }

  private craftProgress(
    startedAtMs: number | undefined,
    completesAtMs: number | undefined,
  ): number {
    if (startedAtMs === undefined || completesAtMs === undefined) return 0;
    const total = completesAtMs - startedAtMs;
    if (total <= 0) return 1;
    return (Date.now() - startedAtMs) / total;
  }

  /** Document 15 Task 09.9: transient, non-persisted visual feedback for a just-dispatched event batch. */
  playEffects(effects: readonly SceneEffect[]): void {
    const view = this.currentViewModel;
    if (!view) return;
    const effectsLayer = this.layers.get("effects")!;

    for (const effect of effects) {
      const anchor = this.effectAnchor(effect);
      if (!anchor) continue;
      const color =
        effect.kind === "CUSTOMER_REACTION" && !effect.positive
          ? resolveSceneColor("--cs-error", 0xd96868)
          : resolveSceneColor("--cs-soft-gold", 0xe7b85a);
      const graphic = new Graphics().circle(0, 0, 10).fill(color);
      graphic.position.set(anchor.x, anchor.y);
      graphic.alpha = 0.9;
      effectsLayer.addChild(graphic);
      this.activeEffects.push({ graphic, startedAtMs: Date.now() });
    }
  }

  private effectAnchor(effect: SceneEffect): { x: number; y: number } | null {
    const view = this.currentViewModel;
    if (!view) return null;
    switch (effect.kind) {
      case "SALE":
      case "CUSTOMER_REACTION": {
        const index = view.customers.findIndex(
          (c) => c.customerId === effect.customerId,
        );
        return index >= 0 ? customerAnchor(index, view.customers.length) : null;
      }
      case "CRAFT_READY": {
        const index = view.stations.findIndex(
          (s) => s.stationId === effect.stationId,
        );
        return index >= 0 ? stationAnchor(index) : null;
      }
      case "UPGRADE":
        return EXPEDITION_HUB_ANCHOR;
      case "EXPEDITION_RETURN":
        return EXPEDITION_HUB_ANCHOR;
      default:
        return null;
    }
  }

  private readonly onTick = (): void => {
    const nowMs = Date.now();
    const view = this.currentViewModel;
    if (view) {
      for (const stationView of view.stations) {
        if (!stationView.isCrafting) continue;
        const entity = this.stationEntities.get(stationView.stationId);
        entity?.update(
          stationView,
          this.craftProgress(
            stationView.craftStartedAtMs,
            stationView.craftCompletesAtMs,
          ),
        );
      }
      for (const entity of this.customerEntities.values()) {
        entity.animate(nowMs, this.reduceMotion);
      }
      for (const entity of this.catchmonEntities.values()) {
        entity.animate(nowMs, this.reduceMotion);
      }
    }

    for (let i = this.activeEffects.length - 1; i >= 0; i -= 1) {
      const active = this.activeEffects[i]!;
      const elapsed = nowMs - active.startedAtMs;
      const duration = this.reduceMotion ? DURATION.fast : DURATION.vfx;
      if (elapsed >= duration) {
        active.graphic.destroy();
        this.activeEffects.splice(i, 1);
        continue;
      }
      const t = elapsed / duration;
      active.graphic.alpha = 1 - t;
      active.graphic.scale.set(1 + t * 1.5);
      active.graphic.y -= 0.6;
    }
  };

  destroy(): void {
    this.app.ticker.remove(this.onTick);
    this.stationEntities.clear();
    this.displayEntities.clear();
    this.customerEntities.clear();
    this.catchmonEntities.clear();
    this.hubEntity = null;
    this.app.destroy(true, { children: true, texture: false });
  }
}
