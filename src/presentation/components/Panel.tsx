/*
 * Adapted from approved-v1 components/core/Panel.jsx — see Button.tsx's
 * header for the general adaptation approach (typed TSX + scoped CSS
 * instead of inline style objects, same tokens/visual result).
 */
import * as React from "react";
import "./Panel.css";

export type PanelTone = "cream" | "card" | "sand";

export interface PanelProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  readonly title?: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly action?: React.ReactNode;
  readonly tone?: PanelTone;
}

export function Panel({
  title,
  subtitle,
  action,
  tone = "cream",
  className,
  children,
  ...rest
}: PanelProps): React.JSX.Element {
  const classes = ["ds-panel", `ds-panel--${tone}`, className ?? ""]
    .filter(Boolean)
    .join(" ");
  return (
    <section className={classes} {...rest}>
      {(title ?? action) && (
        <header className="ds-panel__header">
          <div>
            {title && <h2 className="ds-panel__title">{title}</h2>}
            {subtitle && <p className="ds-panel__subtitle">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
