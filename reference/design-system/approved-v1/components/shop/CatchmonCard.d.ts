import * as React from 'react';
import type { ElementName } from './ElementBadge';

/**
 * Collection tile for a Catchmon. Catchmons are the visual stars, so this card is
 * quieter than its occupant: cream ground, hairline border, and the element hue
 * appearing only as a soft floor wash under the creature plus the element badge.
 */
export interface CatchmonCardProps {
  name: string;
  /** Path to the creature master (1024² transparent PNG) from `assets/catchmons/`. */
  art?: string;
  element?: ElementName;
  /** One short supporting line — habitat, region, or care note. */
  caption?: string;
  /** `false` renders the silhouette-only undiscovered state and hides the name. */
  discovered?: boolean;
  /** Earned glow: capture, discovery or active selection only. */
  glow?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function CatchmonCard(props: CatchmonCardProps): JSX.Element;
