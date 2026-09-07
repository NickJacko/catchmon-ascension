import React from 'react';
import { Icon } from './Icon.jsx';

export function Tabs({ items = [], value, onChange, style, ...rest }) {
  const active = value ?? items[0]?.id;
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: '4px',
        padding: '4px',
        background: 'var(--cs-sand-200)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-l)',
        boxShadow: 'var(--inset-slot)',
        ...style,
      }}
      {...rest}
    >
      {items.map((it) => {
        const on = it.id === active;
        return (
          <button
            key={it.id}
            role="tab"
            aria-selected={on}
            onClick={() => onChange && onChange(it.id)}
            style={{
              flex: 1,
              minHeight: '40px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '0 12px',
              border: on ? '1px solid var(--border-default)' : '1px solid transparent',
              borderRadius: 'var(--radius-m)',
              background: on ? 'var(--surface-card)' : 'transparent',
              boxShadow: on ? 'var(--shadow-small)' : 'none',
              color: on ? 'var(--text-body)' : 'var(--text-muted)',
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: on ? 700 : 600,
              cursor: 'pointer',
              transition: 'var(--transition-surface)',
            }}
          >
            {it.icon && <Icon name={it.icon} size={16} />}
            {it.label}
            {it.count != null && (
              <span style={{ font: 'var(--type-numeric)', fontSize: 'var(--text-micro)', color: 'var(--text-subtle)' }}>
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
