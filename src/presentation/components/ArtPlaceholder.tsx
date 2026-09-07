/*
 * Adapted from approved-v1 ui_kits/shop_app/AppShell.jsx's `ArtPlaceholder`
 * — the approved convention for missing production art (CLAUDE.md §25,
 * Phase 8 Rule 8): a labeled recessed box, optionally naming which Golden
 * Sample Wave the missing asset belongs to, never invented final art.
 */
import * as React from "react";
import { Icon } from "../icons/index.tsx";
import "./ArtPlaceholder.css";

export interface ArtPlaceholderProps {
  readonly height?: number;
  readonly note: string;
}

export function ArtPlaceholder({
  height = 150,
  note,
}: ArtPlaceholderProps): React.JSX.Element {
  return (
    <div className="ds-art-placeholder" style={{ height }}>
      <div>
        {/* Phase 12 hardening: `--text-subtle` fails WCAG 1.4.11's 3:1 non-text-contrast floor; `--text-muted` passes. */}
        <Icon name="image" size={22} color="var(--text-muted)" />
        <p className="ds-art-placeholder__note">{note}</p>
      </div>
    </div>
  );
}
