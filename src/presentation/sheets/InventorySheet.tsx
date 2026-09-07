/*
 * Design owner: Document 15 Task 08.9 (Inventory Workspace) — "Products,
 * Materials, Components, Gear/use items, reserved state, source/use links
 * where slice data supports them." Reachable from anywhere via the shared
 * HUD's inventory icon (Task 08.3).
 */
import * as React from "react";
import { type ItemId } from "../../core/ids/index.ts";
import {
  getReservedQuantitiesByItem,
  getTotalQuantity,
  productItemId,
} from "../../domain/inventory/index.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Sheet } from "../components/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import "./InventorySheet.css";

export function InventorySheet(): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const closeSheet = useUiStore((s) => s.closeSheet);
  if (!state || !catalog) return null;

  const products = Array.from(catalog.products.values()).map((product) => ({
    label: product.displayName,
    note: product.playerUse ? "Gear / use item" : undefined,
    itemId: productItemId(product.productId, "STANDARD"),
    art: resolveAssetImageUrl(catalog.assets.get(product.visualAssetId)),
  }));
  const resources = Array.from(catalog.resources.values()).map((resource) => ({
    label: resource.displayName,
    itemId: resource.itemId,
    art: resolveAssetImageUrl(catalog.assets.get(resource.visualAssetId)),
  }));
  const components = Array.from(catalog.components.values()).map(
    (component) => ({
      label: component.displayName,
      itemId: component.itemId,
      art: resolveAssetImageUrl(catalog.assets.get(component.visualAssetId)),
    }),
  );

  const reservedByItem = getReservedQuantitiesByItem(state.inventory);

  const renderGroup = (
    title: string,
    items: readonly {
      label: string;
      note?: string | undefined;
      itemId: ItemId;
      art?: string | undefined;
    }[],
  ) => (
    <div>
      <h3 className="cs-customer-recommend__title">{title}</h3>
      {items.map((item) => {
        const total = getTotalQuantity(state.inventory, item.itemId);
        const reserved = reservedByItem[item.itemId] ?? 0;
        const available = total - reserved;
        if (total === 0) return null;
        return (
          <div key={item.itemId} className="row row--between">
            <span className="row">
              {item.art && (
                <img
                  src={item.art}
                  alt=""
                  className="inventory-sheet__item-icon"
                />
              )}
              {item.label}
              {item.note && <span className="muted"> · {item.note}</span>}
            </span>
            <span className="cs-action-row__value">
              {available} available
              {reserved > 0 ? ` (${reserved} reserved)` : ""}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <Sheet title="Inventory" onClose={closeSheet}>
      <div className="stack">
        {renderGroup("Products", products)}
        {renderGroup("Materials", resources)}
        {renderGroup("Components", components)}
      </div>
    </Sheet>
  );
}
