/*
 * Design owner: Document 15 Task 08.6 (Display Sheet) — "current product,
 * stock, change product, restock/allocation, demand hint where
 * available." No demand-hint query exists yet in this slice's read
 * design docs beyond `RecommendCandidate` (customer-scoped, not display-
 * scoped), so that part is honestly omitted rather than invented.
 */
import * as React from "react";
import { type DisplaySlotId } from "../../core/ids/index.ts";
import { getDisplaySlotView } from "../../application/queries/display/index.ts";
import {
  getReservedQuantitiesByItem,
  getTotalQuantity,
  productItemId,
} from "../../domain/inventory/index.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, ProductCard, Sheet } from "../components/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";

export interface DisplaySheetProps {
  readonly displaySlotId: DisplaySlotId;
}

export function DisplaySheet({
  displaySlotId,
}: DisplaySheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);

  if (!state || !catalog) return null;

  const current = getDisplaySlotView(state, displaySlotId);
  const currentProduct = current
    ? catalog.products.get(current.productId)
    : undefined;
  const reservedByItem = getReservedQuantitiesByItem(state.inventory);
  const availableProducts = Array.from(catalog.products.values()).map(
    (product) => {
      const itemId = productItemId(product.productId, "STANDARD");
      const total = getTotalQuantity(state.inventory, itemId);
      const reserved = reservedByItem[itemId] ?? 0;
      return { product, quantity: total - reserved };
    },
  );

  return (
    <Sheet title="Display" onClose={closeSheet}>
      {current ? (
        <div className="stack">
          <ProductCard
            name={currentProduct?.displayName ?? current.productId}
            art={resolveAssetImageUrl(
              currentProduct
                ? catalog.assets.get(currentProduct.visualAssetId)
                : undefined,
            )}
            count={current.availableQuantity}
          />
          <Button
            variant="destructive"
            fullWidth
            onClick={() => {
              void dispatch("CLEAR_DISPLAY_SLOT", { displaySlotId });
              closeSheet();
            }}
          >
            Remove from display
          </Button>
        </div>
      ) : (
        <p className="muted">Nothing displayed here.</p>
      )}

      <h3 className="cs-customer-recommend__title">Assign a product</h3>
      <div className="grid-cards">
        {availableProducts.map(({ product, quantity }) => (
          <ProductCard
            key={product.productId}
            name={product.displayName}
            art={resolveAssetImageUrl(
              catalog.assets.get(product.visualAssetId),
            )}
            count={quantity}
            disabled={quantity < 1}
            selected={current?.productId === product.productId}
            onClick={() => {
              void dispatch("ASSIGN_DISPLAY_PRODUCT", {
                displaySlotId,
                productId: product.productId,
                quality: "STANDARD",
              });
              closeSheet();
            }}
          />
        ))}
      </div>
    </Sheet>
  );
}
