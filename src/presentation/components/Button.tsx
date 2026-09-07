/*
 * Adapted from reference/design-system/approved-v1/components/core/Button.jsx
 * (FOUNDATION LOCKED source, read-only) — not copied verbatim: converted to
 * typed TSX, using CSS `:active`/`:hover`/`:disabled` selectors via a
 * scoped stylesheet instead of the prototype's `onPointerDown` React-state
 * press tracking (equivalent visual result, no per-press re-render).
 */
import * as React from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "type"
> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly fullWidth?: boolean;
  readonly iconLeft?: React.ReactNode;
  readonly iconRight?: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  iconLeft,
  iconRight,
  className,
  children,
  ...rest
}: ButtonProps): React.JSX.Element {
  const classes = [
    "ds-button",
    `ds-button--${variant}`,
    `ds-button--${size}`,
    fullWidth ? "ds-button--full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" disabled={disabled} className={classes} {...rest}>
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
