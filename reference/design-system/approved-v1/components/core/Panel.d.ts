import * as React from 'react';

/**
 * Warm-ground surface container: one controlled border, soft warm shadow, a single
 * inner highlight for depth. No glass morphism, no stacked border layers, no parchment.
 */
export interface PanelProps {
  /** Optional panel heading, set in the display face. */
  title?: string;
  /** One short supporting line under the title. */
  subtitle?: string;
  /** Trailing header slot — usually a ghost `<Button />` or a `<StatusPill />`. */
  action?: React.ReactNode;
  /** Ground colour. `cream` for grouped content, `card` for the lightest raised surface, `sand` for recessed sections. */
  tone?: 'cream' | 'card' | 'sand';
  /** Overrides the default `--pad-panel`. */
  padding?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Panel(props: PanelProps): JSX.Element;
