/**
 * Design owner: Document 15 Task 09.5 (Display Scene Entities), extended
 * by Phase 10 Task 10.5 (real production art). Consumes only
 * `SceneDisplayView` — no domain import, no duplicate display logic
 * (stock/locked state is read entirely from the view model; this entity
 * only draws it).
 *
 * Furniture art (base+shadow, pivot-positioned per `domain/assets`'
 * `AssetPivot` convention — see `StationEntity` for the identical
 * technique) is one composable layer; the currently displayed product's
 * own icon is a second, independent child `Sprite` swapped whenever
 * `view.productImageUrl` changes (Phase 10 §5: "rendered products should
 * remain composable child visuals," never baked into the furniture art).
 */
import { Container, Graphics, Sprite } from "pixi.js";
import { type DisplaySlotId } from "../../../core/ids/index.ts";
import { type SceneDisplayView } from "../scene-view-model.ts";
import { resolveSceneColor } from "../scene-tokens.ts";
import { loadCachedTexture } from "./texture-cache.ts";

const WIDTH = 88;
const HEIGHT = 72;
const HIT_PADDING = 20;

const FOOTPRINT_X = WIDTH / 2;
const FOOTPRINT_Y = HEIGHT;
const ART_DISPLAY_SIZE = 130;
const PRODUCT_ICON_SIZE = 40;
/** The product icon sits above the furniture's own floor-contact point, roughly where a shelf surface would be. */
const PRODUCT_ICON_OFFSET_Y = -ART_DISPLAY_SIZE * 0.42;

export class DisplayEntity extends Container {
  private readonly placeholder: Graphics;
  private readonly artContainer: Container;
  private shadowSprite: Sprite | null = null;
  private baseSprite: Sprite | null = null;
  private productSprite: Sprite | null = null;
  private readonly stockDot: Graphics;
  private displaySlotId: DisplaySlotId;
  private loadedBaseUrl: string | undefined;
  private loadedShadowUrl: string | undefined;
  private loadedProductUrl: string | undefined;

  constructor(
    view: SceneDisplayView,
    onSelect: (displaySlotId: DisplaySlotId) => void,
  ) {
    super();
    this.displaySlotId = view.displaySlotId;

    this.placeholder = new Graphics();
    this.artContainer = new Container();
    this.stockDot = new Graphics();
    this.addChild(this.placeholder, this.artContainer, this.stockDot);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.hitArea = {
      contains: (x: number, y: number) =>
        x >= -HIT_PADDING &&
        x <= WIDTH + HIT_PADDING &&
        y >= -HIT_PADDING &&
        y <= HEIGHT + HIT_PADDING,
    };
    this.on("pointertap", () => {
      onSelect(this.displaySlotId);
    });

    this.update(view);
  }

  update(view: SceneDisplayView): void {
    this.displaySlotId = view.displaySlotId;

    this.updateFurnitureArt(view);
    this.updateProductIcon(view);

    const slotColor = resolveSceneColor("--surface-slot", 0xe7d3b0);
    const slotInnerColor = resolveSceneColor("--surface-slot-inner", 0xdcc49c);
    const lockedColor = resolveSceneColor("--action-disabled", 0x8e8984);
    const stockedColor = resolveSceneColor("--cs-soft-gold", 0xe7b85a);

    this.placeholder.clear();
    if (!this.baseSprite) {
      this.placeholder
        .roundRect(0, 0, WIDTH, HEIGHT, 10)
        .fill(view.locked ? lockedColor : slotColor);
      this.placeholder
        .roundRect(6, 6, WIDTH - 12, HEIGHT - 12, 8)
        .fill({ color: slotInnerColor, alpha: view.locked ? 0.4 : 1 });
    }

    this.alpha = view.locked ? 0.55 : 1;
    this.eventMode = view.locked ? "none" : "static";
    this.cursor = view.locked ? "default" : "pointer";

    this.stockDot.clear();
    if (!view.locked && view.productId && view.quantity > 0) {
      this.stockDot.circle(WIDTH - 10, 10, 8).fill(stockedColor);
    }
  }

  private updateFurnitureArt(view: SceneDisplayView): void {
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
            // Product icon renders above the furniture but below shadows added later; insert base right after shadow if present.
            this.artContainer.addChildAt(
              this.baseSprite,
              this.shadowSprite ? 1 : 0,
            );
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

  private updateProductIcon(view: SceneDisplayView): void {
    const url = view.productImageUrl;
    if (!url) {
      this.productSprite?.destroy();
      this.productSprite = null;
      this.loadedProductUrl = undefined;
      return;
    }
    if (url === this.loadedProductUrl) return;
    this.loadedProductUrl = url;
    loadCachedTexture(url)
      .then((texture) => {
        if (this.destroyed || this.loadedProductUrl !== url) return;
        if (!this.productSprite) {
          this.productSprite = new Sprite(texture);
          this.productSprite.anchor.set(0.5, 0.5);
          this.artContainer.addChild(this.productSprite);
        } else {
          this.productSprite.texture = texture;
        }
        this.productSprite.position.set(
          FOOTPRINT_X,
          FOOTPRINT_Y + PRODUCT_ICON_OFFSET_Y,
        );
        const scale =
          PRODUCT_ICON_SIZE / Math.max(texture.width, texture.height);
        this.productSprite.scale.set(scale);
      })
      .catch(() => {
        // Phase 12 hardening — see CatchmonEntity.ts's identical comment.
      });
  }
}
