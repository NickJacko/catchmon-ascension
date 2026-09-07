import * as React from 'react';

/**
 * Single-silhouette UI glyph. SUBSTITUTED SET: no brand icon masters were supplied,
 * so this wraps Lucide (medium uniform stroke, no fine interior lines) from CDN.
 * Swap the base URL for the brand sprite when icon masters arrive.
 */
export interface IconProps {
  /** Lucide icon id, kebab-case — e.g. `coins`, `package`, `sparkles`, `flame`. */
  name: string;
  /** Rendered box in px. Never below 20 — the set is only guaranteed legible at 20–24px. */
  size?: number;
  /** Any CSS colour; defaults to `currentColor` so glyphs inherit their text colour. */
  color?: string;
  /** Accessible name. Omit for decorative glyphs sitting next to a text label. */
  label?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
