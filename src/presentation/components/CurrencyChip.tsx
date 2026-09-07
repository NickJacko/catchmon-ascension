/*
 * Adapted from approved-v1 components/shop/CurrencyChip.jsx — "momentum
 * must never read as a second currency" is enforced by giving it its own
 * `kind` (distinct glyph/color from `coin`), never a shared visual
 * treatment.
 */
import * as React from "react";
import { Icon, type ApprovedIconName } from "../icons/index.tsx";
import "./CurrencyChip.css";

export type CurrencyChipKind = "coin" | "momentum" | "material";

const KIND_GLYPH: Record<CurrencyChipKind, ApprovedIconName> = {
  coin: "coins",
  momentum: "wind",
  material: "package",
};
const KIND_COLOR: Record<CurrencyChipKind, string> = {
  coin: "var(--cs-soft-gold)",
  momentum: "var(--el-wind-1)",
  material: "var(--cs-walnut-600)",
};

export interface CurrencyChipProps {
  readonly kind?: CurrencyChipKind;
  readonly amount: number | string;
  readonly size?: "sm" | "md";
  readonly "aria-label"?: string;
}

export function CurrencyChip({
  kind = "coin",
  amount,
  size = "md",
  ...rest
}: CurrencyChipProps): React.JSX.Element {
  const glyphSize = size === "sm" ? 14 : 18;
  return (
    <span className={`ds-currency-chip ds-currency-chip--${size}`} {...rest}>
      <Icon name={KIND_GLYPH[kind]} size={glyphSize} color={KIND_COLOR[kind]} />
      <span className="ds-currency-chip__amount">
        {typeof amount === "number" ? amount.toLocaleString("en-US") : amount}
      </span>
    </span>
  );
}
