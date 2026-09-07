/*
 * Adapted from approved-v1 components/shop/Slot.jsx.
 */
import * as React from "react";
import { Icon } from "../icons/index.tsx";
import "./Slot.css";

export interface SlotProps {
  readonly art?: string;
  readonly label: string;
  readonly size?: number;
  readonly locked?: boolean;
  readonly empty?: boolean;
  readonly tier?: "standard" | "masterwork";
  readonly selected?: boolean;
  readonly onClick?: () => void;
}

export function Slot({
  art,
  label,
  size = 72,
  locked = false,
  empty,
  tier = "standard",
  selected = false,
  onClick,
}: SlotProps): React.JSX.Element {
  const isEmpty = empty ?? !art;
  const classes = [
    "ds-slot",
    locked ? "ds-slot--locked" : "",
    selected ? "ds-slot--selected" : "",
    tier === "masterwork" ? "ds-slot--masterwork" : "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked || !onClick}
      aria-label={label}
      className={classes}
      style={{ width: size, height: size }}
    >
      {locked ? (
        <Icon
          name="lock"
          size={Math.round(size * 0.28)}
          color="var(--cs-walnut-600)"
        />
      ) : isEmpty ? (
        // Phase 12 hardening: `--text-subtle` fails WCAG 1.4.11's 3:1
        // non-text-contrast floor for a meaningful icon; `--text-muted`
        // passes comfortably.
        <Icon
          name="plus"
          size={Math.round(size * 0.26)}
          color="var(--text-muted)"
        />
      ) : (
        <img src={art} alt="" className="ds-slot__art" />
      )}
    </button>
  );
}
