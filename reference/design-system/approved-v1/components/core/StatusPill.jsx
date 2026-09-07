import React from 'react';
import { Icon } from './Icon.jsx';

const TONES = {
  success: { fg: '#2C5E38', bg: 'rgba(101,185,122,.22)', bd: 'rgba(101,185,122,.55)', icon: 'check' },
  warning: { fg: '#8A5E13', bg: 'rgba(230,169,76,.22)', bd: 'rgba(230,169,76,.6)', icon: 'clock' },
  error: { fg: '#8E3E3D', bg: 'rgba(217,104,104,.2)', bd: 'rgba(217,104,104,.55)', icon: 'triangle-alert' },
  info: { fg: '#2F5F7C', bg: 'rgba(103,169,216,.2)', bd: 'rgba(103,169,216,.55)', icon: 'info' },
  premium: { fg: 'var(--text-premium)', bg: 'rgba(230,185,88,.24)', bd: 'var(--border-premium)', icon: 'sparkles' },
  neutral: { fg: 'var(--text-muted)', bg: 'rgba(123,87,61,.1)', bd: 'var(--border-hairline)', icon: null },
};

export function StatusPill({ tone = 'neutral', icon, children, style, ...rest }) {
  const t = TONES[tone] || TONES.neutral;
  const glyph = icon === null ? null : icon || t.icon;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-pill)',
        background: t.bg,
        border: `1px solid ${t.bd}`,
        color: t.fg,
        font: 'var(--type-label)',
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...rest}
    >
      {glyph && <Icon name={glyph} size={12} />}
      {children}
    </span>
  );
}
