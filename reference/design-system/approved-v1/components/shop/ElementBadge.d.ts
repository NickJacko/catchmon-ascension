import * as React from 'react';

/** The 17 elements of the approved Element Compass. */
export type ElementName =
  | 'fire' | 'water' | 'electric' | 'grass' | 'earth' | 'poison' | 'normal' | 'ice'
  | 'fairy' | 'wind' | 'steel' | 'psychic' | 'light' | 'dark' | 'ghost' | 'dragon' | 'cosmic';

/**
 * Element identity marker: a cream disc with an element-tinted outline and glyph.
 * This is how element colour is allowed to appear in UI — as an accent and symbol,
 * never as a fill behind content (SL-08).
 */
export interface ElementBadgeProps {
  element?: ElementName;
  size?: 'sm' | 'md' | 'lg';
  /** Show the element name next to the disc, uppercase and letterspaced. */
  showLabel?: boolean;
  style?: React.CSSProperties;
}
export declare function ElementBadge(props: ElementBadgeProps): JSX.Element;
