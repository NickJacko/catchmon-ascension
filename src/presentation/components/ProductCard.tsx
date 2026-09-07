/*
 * Adapted from approved-v1 components/shop/ProductCard.jsx. `art` is
 * expected to stay `undefined` for the whole vertical slice — Document 13
 * production art has not been generated (CLAUDE.md §25/§8 Asset Rule); the
 * component's own "no art -> recessed placeholder slot" branch is the
 * approved placeholder convention, not a gap introduced here.
 */
import * as React from "react";
import { Icon } from "../icons/index.tsx";
import "./ProductCard.css";

export type ProductCardTier = "standard" | "fine" | "masterwork";

export interface ProductCardProps {
  readonly name: string;
  readonly art?: string | undefined;
  readonly price?: number;
  readonly tier?: ProductCardTier;
  readonly status?: React.ReactNode;
  readonly count?: number;
  readonly selected?: boolean;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

const TIER_LABEL: Partial<Record<ProductCardTier, string>> = {
  fine: "Fine",
  masterwork: "Masterwork",
};

export function ProductCard({
  name,
  art,
  price,
  tier = "standard",
  status,
  count,
  selected = false,
  disabled = false,
  onClick,
}: ProductCardProps): React.JSX.Element {
  const classes = [
    "ds-product-card",
    `ds-product-card--${tier}`,
    selected ? "ds-product-card--selected" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || !onClick}
      className={classes}
    >
      <div className="ds-product-card__art">
        {art ? (
          <img src={art} alt="" className="ds-product-card__art-image" />
        ) : (
          <div className="ds-product-card__art-placeholder" />
        )}
        {count != null && (
          <span className="ds-product-card__count">×{count}</span>
        )}
      </div>
      <div className="ds-product-card__name">{name}</div>
      <div className="ds-product-card__footer">
        {price != null && (
          <span className="ds-product-card__price">
            <Icon name="coins" size={14} color="var(--cs-soft-gold)" />
            {price}
          </span>
        )}
        {status ??
          (TIER_LABEL[tier] && (
            <span className="ds-product-card__tier-label">
              {TIER_LABEL[tier]}
            </span>
          ))}
      </div>
    </button>
  );
}
