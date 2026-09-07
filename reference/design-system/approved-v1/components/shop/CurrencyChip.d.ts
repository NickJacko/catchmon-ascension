import * as React from 'react';

/**
 * Numeric resource readout — coins, momentum, material counts. Minted, not sparkly:
 * a cream capsule with a gold coin mark and tabular mono figures. Momentum must
 * never read as a second currency, so it uses the wind glyph and its own hue.
 */
export interface CurrencyChipProps {
  kind?: 'coin' | 'momentum' | 'material';
  /** The value; numbers are thousands-separated. */
  amount: number | string;
  /** Optional signed change shown after the amount, e.g. `"-240"` or `"+12"`. */
  delta?: string;
  size?: 'sm' | 'md';
  style?: React.CSSProperties;
}
export declare function CurrencyChip(props: CurrencyChipProps): JSX.Element;
