/*
 * Adapted from approved-v1 ui_kits/shop_app/AppShell.jsx's `SectionHead`.
 */
import * as React from "react";
import "./SectionHead.css";

export interface SectionHeadProps {
  readonly title: React.ReactNode;
  readonly action?: React.ReactNode;
}

export function SectionHead({
  title,
  action,
}: SectionHeadProps): React.JSX.Element {
  return (
    <div className="ds-section-head">
      <h2 className="ds-section-head__title">{title}</h2>
      {action}
    </div>
  );
}
