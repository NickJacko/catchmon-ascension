import React from 'react';
import { Icon } from '../core/Icon.jsx';


const TIERS = {
  standard: { border: 'var(--border-hairline)', ring: 'none', label: null },
  fine: { border: 'var(--border-default)', ring: 'inset 0 0 0 1px rgba(231,184,90,.5)', label: 'Fine' },
  masterwork: { border: 'var(--border-premium)', ring: 'var(--glow-ring-masterwork)', label: 'Masterwork' },
};

export function ProductCard({
  name,
  art,
  price,
  currencyGlyph = 'coins',
  tier = 'standard',
  element,
  status,
  count,
  selected = false,
  onClick,
  style,
  ...rest
}) {
  const t = TIERS[tier] || TIERS.standard;
  return (
    <button
      type="button"
      onClick={onClick}
      data-element={element}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
        width: '100%',
        padding: 'var(--pad-card)',
        textAlign: 'left',
        background: 'var(--surface-card)',
        border: `1px solid ${t.border}`,
        borderRadius: 'var(--radius-card)',
        boxShadow: selected
          ? `var(--shadow-card),var(--glow-ring-selection)`
          : tier === 'masterwork'
          ? `var(--shadow-card),${t.ring}`
          : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'var(--transition-press),var(--transition-surface)',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          position: 'relative',
          alignSelf: 'center',
          width: '100%',
          aspectRatio: '1 / 1',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {art ? (
          <img
            src={art}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 8px rgba(94,64,41,.22))' }}
          />
        ) : (
          <div
            style={{
              width: '76%',
              height: '76%',
              borderRadius: 'var(--radius-m)',
              background: 'var(--surface-slot)',
              boxShadow: 'var(--inset-slot)',
            }}
          />
        )}
        {count != null && (
          <span
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--surface-panel)',
              border: '1px solid var(--border-hairline)',
              font: 'var(--type-numeric)',
              fontSize: 'var(--text-micro)',
              color: 'var(--text-muted)',
            }}
          >
            ×{count}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <span style={{ font: 'var(--type-card-title)', fontSize: 'var(--text-body-md)', color: 'var(--text-body)' }}>{name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        {price != null && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', font: 'var(--type-numeric)', color: 'var(--text-body)' }}>
            <Icon name={currencyGlyph} size={14} color="var(--cs-soft-gold)" />
            {price}
          </span>
        )}
        {status || (t.label && (
          <span
            style={{
              font: 'var(--type-label)',
              letterSpacing: 'var(--tracking-label)',
              textTransform: 'uppercase',
              color: 'var(--text-premium)',
            }}
          >
            {t.label}
          </span>
        ))}
      </div>
    </button>
  );
}
