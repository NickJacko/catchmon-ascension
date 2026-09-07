/*
 * Adapted from approved-v1 components/core/Tabs.jsx.
 */
import * as React from "react";
import { Icon, type ApprovedIconName } from "../icons/index.tsx";
import "./Tabs.css";

export interface TabItem {
  readonly id: string;
  readonly label: string;
  readonly icon?: ApprovedIconName;
  readonly count?: number;
}

export interface TabsProps {
  readonly items: readonly TabItem[];
  readonly value?: string;
  readonly onChange: (id: string) => void;
  readonly "aria-label": string;
}

export function Tabs({
  items,
  value,
  onChange,
  ...rest
}: TabsProps): React.JSX.Element {
  const active = value ?? items[0]?.id;
  return (
    <div role="tablist" className="ds-tabs" {...rest}>
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              onChange(item.id);
            }}
            className={
              isActive ? "ds-tabs__tab ds-tabs__tab--active" : "ds-tabs__tab"
            }
          >
            {item.icon && <Icon name={item.icon} size={16} />}
            {item.label}
            {item.count != null && (
              <span className="ds-tabs__count">{item.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
