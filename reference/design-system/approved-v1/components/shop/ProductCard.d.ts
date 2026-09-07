import * as React from 'react';
import type { ElementName } from './ElementBadge';

/**
 * The shop's product tile: asset prominent, status secondary, generous padding,
 * at most 2–3 accent layers. Quality tier is expressed by border, light edge and
 * controlled glow — the base artwork never changes.
 */
export interface ProductCardProps {
  /** Product name — one short line; it truncates badly past ~18 characters. */
  name: string;
  /** Path to the product master (1024² transparent PNG). Omitted renders a recessed placeholder slot. */
  art?: string;
  /** Price in the shop's currency. Omit for owned/inventory contexts. */
  price?: number | string;
  /** Lucide glyph used as the currency mark. */
  currencyGlyph?: string;
  /** Quality tier. `fine` adds a light edge, `masterwork` adds the earned gold ring. */
  tier?: 'standard' | 'fine' | 'masterwork';
  /** Element accent for elemental craft products; sets `data-element` on the card. */
  element?: ElementName;
  /** Trailing status slot — pass a `<StatusPill />`. Replaces the tier word. */
  status?: React.ReactNode;
  /** Owned quantity, shown as a ×n chip over the artwork. */
  count?: number;
  /** Active selection — draws the gold selection ring. */
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function ProductCard(props: ProductCardProps): JSX.Element;
