import React from 'react';
import { ElementBadge } from './ElementBadge.jsx';

export function CatchmonCard({
  name,
  art,
  element = 'normal',
  caption,
  discovered = true,
  glow = false,
  onClick,
  style,
  ...rest
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-element={element}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
        padding: 'var(--pad-card)',
        width: '100%',
        textAlign: 'center',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-card)',
        boxShadow: glow ? 'var(--shadow-card),var(--glow-ring-selection)' : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-press),var(--transition-surface)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ position: 'absolute', top: 10, left: 10 }}>
        <ElementBadge element={element} size="sm" />
      </div>
      <div
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          display: 'grid',
          placeItems: 'center',
          borderRadius: 'var(--radius-m)',
          background: `radial-gradient(120% 90% at 50% 82%, var(--el-glow) 0%, rgba(255,248,235,0) 62%)`,
        }}
      >
        {art ? (
          <img
            src={art}
            alt=""
            style={{
              width: '92%',
              height: '92%',
              objectFit: 'contain',
              filter: discovered
                ? 'drop-shadow(0 8px 10px rgba(94,64,41,.22))'
                : 'brightness(0) opacity(.28)',
            }}
          />
        ) : null}
      </div>
      <span style={{ font: 'var(--type-card-title)', color: 'var(--text-body)' }}>
        {discovered ? name : '???'}
      </span>
      {caption && (
        <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
          {caption}
        </span>
      )}
    </button>
  );
}
