import * as React from 'react';

/**
 * World-derived action button. Primary is a filled walnut fill with a firm bottom
 * depth edge and a real pressed state; never neon, never glowing.
 */
export interface ButtonProps {
  /** Visual role. `primary` filled with depth, `secondary` softer fill + thin border, `ghost` text-only, `destructive` red-brown. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  /** Height ladder. All sizes clear the 44px mobile touch minimum. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to the container width (used for sheet and modal confirms). */
  fullWidth?: boolean;
  disabled?: boolean;
  /** Leading glyph — pass an `<Icon />`. */
  iconLeft?: React.ReactNode;
  /** Trailing glyph — pass an `<Icon />`. */
  iconRight?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
