UI glyph wrapper — use it anywhere an interface needs an icon, so the whole set keeps one stroke logic.

```jsx
<Icon name="coins" size={20} color="var(--cs-soft-gold)" />
<Icon name="package" size={24} label="Inventory" />
```

- Substituted set (Lucide, copied into `assets/icons/`) — flagged in readme.md under ICONOGRAPHY. Never hand-draw an SVG instead.
- Set `window.CATCHMON_ICON_BASE` on the page to the relative `assets/icons/` path; otherwise the component falls back to the CDN.
- One metaphor per meaning; never reuse a glyph for two different things in the same screen.
- Minimum 20px. Icon-only tap targets still need a 44px hit area around the glyph.
- Element identity is carried by the Catchmon artwork and `<ElementBadge>`-style accents, not by recolouring UI glyphs.
