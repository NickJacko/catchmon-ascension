import React from 'react';

// TEMPORARY ICON SET — Lucide stands in until Catchmon Shop icon masters are produced.
// Lucide is NOT the final Catchmon Shop icon art language. Custom SVG masters drop into
// assets/icons/ under the same glyph names; no consuming component changes.
// Icon masters live in the project's assets/icons/ folder. Pages can override the
// base path with window.CATCHMON_ICON_BASE; the CDN default keeps standalone pages working.
const ICON_BASE = () =>
  (typeof window !== 'undefined' && window.CATCHMON_ICON_BASE) ||
  'https://unpkg.com/lucide-static@0.441.0/icons/';

const CACHE = {};

function iconUrl(name) {
  // Standalone exports map glyph names to inlined blob URLs.
  const map = typeof window !== 'undefined' && window.CATCHMON_ICON_URLS;
  return (map && map[name]) || ICON_BASE() + name + '.svg';
}

function useGlyph(name) {
  const url = iconUrl(name);
  const [markup, setMarkup] = React.useState(CACHE[url] || null);
  React.useEffect(() => {
    if (CACHE[url]) { setMarkup(CACHE[url]); return; }
    let live = true;
    fetch(url)
      .then((r) => (r.ok ? r.text() : ''))
      .then((t) => {
        const cleaned = t
          .replace(/<!--[\s\S]*?-->/g, '')
          .replace(/\swidth="[^"]*"/, '')
          .replace(/\sheight="[^"]*"/, '');
        CACHE[url] = cleaned;
        if (live) setMarkup(cleaned);
      })
      .catch(() => {});
    return () => { live = false; };
  }, [url]);
  return markup;
}

export function Icon({ name, size = 24, color = 'currentColor', label, style, ...rest }) {
  const markup = useGlyph(name);
  return (
    <span
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={markup ? { __html: markup } : undefined}
      style={{
        display: 'inline-flex',
        flex: '0 0 auto',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color,
        ...style,
      }}
      {...rest}
    />
  );
}
