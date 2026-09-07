import * as React from 'react';

export interface TabItem {
  id: string;
  label: string;
  /** Optional leading Lucide glyph id. */
  icon?: string;
  /** Optional trailing count, set in the mono face. */
  count?: number;
}

/**
 * Segmented switch for sibling views. Selection is carried by fill PLUS weight,
 * never by colour alone (Visual Production System · UI Components).
 */
export interface TabsProps {
  items: TabItem[];
  /** Id of the selected tab; falls back to the first item. */
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
