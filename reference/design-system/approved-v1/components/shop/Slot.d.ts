import * as React from 'react';

/**
 * A slightly recessed, asset-focused container: inventory cells, station input slots,
 * display shelves. Quality is shown by an overlay, never by new artwork.
 */
export interface SlotProps {
  /** Path to the contained asset master. */
  art?: string;
  /** Accessible name for the cell. */
  label?: string;
  /** Square edge in px. Keep interactive slots at 44 or above. */
  size?: number;
  /** Not yet unlocked — renders a lock glyph and blocks interaction. */
  locked?: boolean;
  /** Force the empty state; defaults to "no art supplied". */
  empty?: boolean;
  /** Quality overlay tier for the contained item. */
  tier?: 'standard' | 'fine' | 'masterwork';
  /** Active selection — gold ring. */
  selected?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function Slot(props: SlotProps): JSX.Element;
