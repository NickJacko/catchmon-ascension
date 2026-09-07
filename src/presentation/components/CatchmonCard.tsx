/*
 * Adapted from approved-v1 components/shop/CatchmonCard.jsx. `art`
 * resolves through `resolveAssetImageUrl` at the call site — real portrait
 * for a `FINAL` asset, `undefined` (silhouette/empty) otherwise.
 */
import * as React from "react";
import { type ElementId } from "../../domain/world/index.ts";
import { ElementBadge } from "./ElementBadge.tsx";
import "./CatchmonCard.css";

export interface CatchmonCardProps {
  readonly name: string;
  /** `| undefined` explicit: callers commonly pass `resolveAssetImageUrl(...)`'s result directly, which is `string | undefined`. */
  readonly art?: string | undefined;
  readonly element?: ElementId;
  readonly caption?: React.ReactNode;
  readonly discovered?: boolean;
  readonly glow?: boolean;
  readonly onClick?: () => void;
}

export function CatchmonCard({
  name,
  art,
  element,
  caption,
  discovered = true,
  glow = false,
  onClick,
}: CatchmonCardProps): React.JSX.Element {
  const classes = ["ds-catchmon-card", glow ? "ds-catchmon-card--glow" : ""]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      data-element={element}
      className={classes}
    >
      {element && (
        <div className="ds-catchmon-card__badge">
          <ElementBadge element={element} size="sm" />
        </div>
      )}
      <div className="ds-catchmon-card__art">
        {art && (
          <img
            src={art}
            alt=""
            className={
              discovered
                ? "ds-catchmon-card__art-image"
                : "ds-catchmon-card__art-image ds-catchmon-card__art-image--undiscovered"
            }
          />
        )}
      </div>
      <span className="ds-catchmon-card__name">
        {discovered ? name : "???"}
      </span>
      {caption && <span className="ds-catchmon-card__caption">{caption}</span>}
    </button>
  );
}
