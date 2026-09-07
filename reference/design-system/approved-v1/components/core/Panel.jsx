import React from 'react';

const TONES = {
  cream: { background: 'var(--surface-panel)', border: '1px solid var(--border-hairline)' },
  card: { background: 'var(--surface-card)', border: '1px solid var(--border-hairline)' },
  sand: { background: 'var(--cs-sand-200)', border: '1px solid var(--border-default)' },
};

export function Panel({ title, subtitle, action, tone = 'cream', padding, children, style, ...rest }) {
  const skin = TONES[tone] || TONES.cream;
  return (
    <section
      style={{
        borderRadius: 'var(--radius-panel)',
        padding: padding || 'var(--pad-panel)',
        boxShadow: 'var(--shadow-card),var(--inset-panel)',
        ...skin,
        ...style,
      }}
      {...rest}
    >
      {(title || action) && (
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
            marginBottom: 'var(--stack-default)',
          }}
        >
          <div>
            {title && (
              <h2 style={{ margin: 0, font: 'var(--type-section)', color: 'var(--text-body)' }}>{title}</h2>
            )}
            {subtitle && (
              <p style={{ margin: '4px 0 0', font: 'var(--type-body)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
