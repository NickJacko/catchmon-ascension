/*
 * Adapted from approved-v1 components/shop/ElementBadge.jsx — the only
 * sanctioned way element colour enters the interface (readme.md
 * "Intentional additions"). Uses the canonical Document 10 §1 ElementId
 * union (core/domain type) rather than the prototype's own bare string
 * list, so an invalid element cannot be passed at compile time.
 */
import * as React from "react";
import { type ElementId } from "../../domain/world/index.ts";
import { ELEMENT_ICONS } from "../icons/element-icon-map.ts";
import "./ElementBadge.css";

export interface ElementBadgeProps {
  readonly element: ElementId;
  readonly size?: "sm" | "md" | "lg";
  readonly showLabel?: boolean;
}

const BOX_SIZE: Record<"sm" | "md" | "lg", number> = { sm: 22, md: 28, lg: 34 };

export function ElementBadge({
  element,
  size = "md",
  showLabel = false,
}: ElementBadgeProps): React.JSX.Element {
  const box = BOX_SIZE[size];
  const ElementIcon = ELEMENT_ICONS[element];
  return (
    <span data-element={element} title={element} className="ds-element-badge">
      <span
        className="ds-element-badge__disc"
        style={{ width: box, height: box }}
      >
        <ElementIcon size={Math.round(box * 0.56)} color="var(--el-1)" />
      </span>
      {showLabel && <span className="ds-element-badge__label">{element}</span>}
    </span>
  );
}
