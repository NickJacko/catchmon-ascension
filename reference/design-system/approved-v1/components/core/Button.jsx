import React from 'react';

const SIZES = {
  sm: { minHeight: 'var(--touch-min)', padding: '0 16px', fontSize: 'var(--text-body-sm)', radius: 'var(--radius-s)' },
  md: { minHeight: 'var(--touch-comfortable)', padding: '0 20px', fontSize: 'var(--text-body-md)', radius: 'var(--radius-m)' },
  lg: { minHeight: '58px', padding: '0 26px', fontSize: 'var(--text-body-lg)', radius: 'var(--radius-l)' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  onClick,
  children,
  style,
  ...rest
}) {
  const [held, setHeld] = React.useState(false);
  const s = SIZES[size] || SIZES.md;

  const skins = {
    primary: {
      background: 'var(--action-primary)',
      color: 'var(--text-on-primary)',
      border: '1px solid var(--action-primary-press)',
      boxShadow: held ? 'var(--depth-button-press)' : 'var(--depth-button)',
    },
    secondary: {
      background: 'var(--action-secondary)',
      color: 'var(--text-body)',
      border: '1px solid var(--border-default)',
      boxShadow: held ? 'none' : 'var(--shadow-small)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-link)',
      border: '1px solid transparent',
      boxShadow: 'none',
    },
    destructive: {
      background: 'var(--action-destructive)',
      color: 'var(--text-on-primary)',
      border: '1px solid var(--action-destructive-press)',
      boxShadow: held ? 'var(--depth-button-press)' : '0 3px 0 var(--action-destructive-press)',
    },
  };

  const skin = skins[variant] || skins.primary;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onPointerDown={() => setHeld(true)}
      onPointerUp={() => setHeld(false)}
      onPointerLeave={() => setHeld(false)}
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        minHeight: s.minHeight,
        padding: s.padding,
        borderRadius: s.radius,
        font: 'var(--type-body-strong)',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: s.fontSize,
        letterSpacing: '0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'var(--transition-press),var(--transition-surface)',
        transform: held && !disabled ? 'translateY(var(--press-offset))' : 'none',
        ...skin,
        ...(disabled
          ? {
              background: variant === 'ghost' ? 'transparent' : 'var(--action-disabled)',
              color: 'var(--cs-disabled)',
              border: '1px solid transparent',
              boxShadow: 'none',
            }
          : null),
        ...style,
      }}
      {...rest}
    >
      {iconLeft}
      <span>{children}</span>
      {iconRight}
    </button>
  );
}
