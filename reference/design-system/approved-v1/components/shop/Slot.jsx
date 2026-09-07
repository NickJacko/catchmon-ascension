import React from 'react';
import { Icon } from '../core/Icon.jsx';

export function Slot({ art, label, size = 72, locked = false, empty, tier = 'standard', selected = false, onClick, style, ...rest }) {
  const isEmpty = empty != null ? empty : !art;
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      aria-label={label}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'grid',
        placeItems: 'center',
        padding: '6px',
        background: locked ? 'var(--cs-sand-300)' : 'var(--surface-slot)',
        border: `1px solid ${
          selected ? 'var(--border-premium)' : tier === 'masterwork' ? 'var(--border-premium)' : 'var(--border-hairline)'
        }`,
        borderRadius: 'var(--radius-slot)',
        boxShadow: selected ? 'var(--inset-slot),var(--glow-ring-selection)' : 'var(--inset-slot)',
        cursor: locked ? 'not-allowed' : onClick ? 'pointer' : 'default',
        transition: 'var(--transition-surface)',
        ...style,
      }}
      {...rest}
    >
      {locked ? (
        <Icon name="lock" size={Math.round(size * 0.28)} color="var(--cs-walnut-600)" />
      ) : isEmpty ? (
        <Icon name="plus" size={Math.round(size * 0.26)} color="rgba(123,87,61,.45)" />
      ) : (
        <img
          src={art}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 5px rgba(94,64,41,.24))' }}
        />
      )}
      {!isEmpty && !locked && tier === 'masterwork' && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'var(--radius-slot)',
            boxShadow: 'var(--glow-ring-masterwork)',
            pointerEvents: 'none',
          }}
        />
      )}
    </button>
  );
}
