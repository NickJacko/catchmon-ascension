/*
 * Adapted from approved-v1 components/core/StatusPill.jsx.
 */
import * as React from "react";
import { Icon, type ApprovedIconName } from "../icons/index.tsx";
import "./StatusPill.css";

export type StatusPillTone =
  "success" | "warning" | "error" | "info" | "premium" | "neutral";

const DEFAULT_GLYPH: Partial<Record<StatusPillTone, ApprovedIconName>> = {
  success: "check",
  warning: "clock",
  error: "triangle-alert",
  info: "info",
  premium: "sparkles",
};

export interface StatusPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  readonly tone?: StatusPillTone;
  /** Pass `null` to explicitly suppress the tone's default glyph. */
  readonly icon?: ApprovedIconName | null;
}

export function StatusPill({
  tone = "neutral",
  icon,
  className,
  children,
  ...rest
}: StatusPillProps): React.JSX.Element {
  const glyph = icon === null ? null : (icon ?? DEFAULT_GLYPH[tone] ?? null);
  const classes = ["ds-status-pill", `ds-status-pill--${tone}`, className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes} {...rest}>
      {glyph && <Icon name={glyph} size={12} />}
      {children}
    </span>
  );
}
