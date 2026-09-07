import * as React from 'react';

/**
 * Short status marker — the one place the pill radius is allowed. Status is never
 * communicated by colour alone, so the pill always carries a word and (by default) a glyph.
 */
export interface StatusPillProps {
  /** Semantic colour role, drawn from the approved semantic palette only. */
  tone?: 'success' | 'warning' | 'error' | 'info' | 'premium' | 'neutral';
  /** Override the tone's default glyph, or pass `null` for text only. */
  icon?: string | null;
  /** The status word — keep it to one or two words, it renders uppercase. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function StatusPill(props: StatusPillProps): JSX.Element;
