import React from 'react';
import { Icon } from '../core/Icon.jsx';

const KINDS = {
  coin: { glyph: 'coins', color: 'var(--cs-soft-gold)' },
  momentum: { glyph: 'wind', color: 'var(--el-wind-1)' },
  material: { glyph: 'package', color: 'var(--cs-walnut-600)' },
};

export function CurrencyChip({ kind = 'coin', amount, delta, size = 'md', style, ...rest }) {
  const k = KINDS[kind] || KINDS.coin;
  const pad = size === 'sm' ? '4px 8px' : '6px 12px';
  const glyphSize = size === 'sm' ? 14 : 18;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: pad,
        background: 'var(--surface-panel)',
        border: '1px solid var(--border-hairline)',
        borderRadius: 'var(--radius-pill)',
        boxShadow: 'var(--shadow-small)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={k.glyph} size={glyphSize} color={k.color} />
      <span
        style={{
          font: 'var(--type-numeric)',
          fontSize: size === 'sm' ? 'var(--text-body-sm)' : 'var(--text-body-md)',
          color: 'var(--text-body)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {typeof amount === 'number' ? amount.toLocaleString('en-US') : amount}
      </span>
      {delta != null && (
        <span
          style={{
            font: 'var(--type-label)',
            color: String(delta).startsWith('-') ? 'var(--action-destructive)' : 'var(--cs-success)',
          }}
        >
          {delta}
        </span>
      )}
    </span>
  );
}
