import React from 'react';
import { Icon } from '../core/Icon.jsx';


export const ELEMENTS = [
  'fire', 'water', 'electric', 'grass', 'earth', 'poison', 'normal', 'ice', 'fairy',
  'wind', 'steel', 'psychic', 'light', 'dark', 'ghost', 'dragon', 'cosmic',
];

const GLYPHS = {
  fire: 'flame', water: 'droplet', electric: 'zap', grass: 'leaf', earth: 'mountain',
  poison: 'flask-conical', normal: 'circle', ice: 'snowflake', fairy: 'sparkle',
  wind: 'wind', steel: 'shield', psychic: 'eye', light: 'sun', dark: 'moon',
  ghost: 'ghost', dragon: 'gem', cosmic: 'orbit',
};

export function ElementBadge({ element = 'normal', size = 'md', showLabel = false, style, ...rest }) {
  const box = size === 'sm' ? 22 : size === 'lg' ? 34 : 28;
  const glyph = GLYPHS[element] || 'circle';
  return (
    <span
      data-element={element}
      title={element}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...style,
      }}
      {...rest}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: box,
          height: box,
          borderRadius: 'var(--radius-pill)',
          background: 'var(--surface-card)',
          border: '1.5px solid var(--el-1)',
          boxShadow: 'var(--shadow-small)',
          flex: '0 0 auto',
        }}
      >
        <Icon name={glyph} size={Math.round(box * 0.56)} color="var(--el-1)" />
      </span>
      {showLabel && (
        <span
          style={{
            font: 'var(--type-label)',
            letterSpacing: 'var(--tracking-label)',
            textTransform: 'uppercase',
            color: 'var(--el-1)',
          }}
        >
          {element}
        </span>
      )}
    </span>
  );
}
