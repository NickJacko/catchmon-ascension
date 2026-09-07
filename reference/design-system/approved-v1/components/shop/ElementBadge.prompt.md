Marks the element of a Catchmon, a special component or an elemental station — the only sanctioned way element colour enters the UI.

```jsx
<ElementBadge element="cosmic" size="lg" showLabel />
```

- Sets `data-element`, so `--el-1 / --el-2 / --el-glow` resolve for anything nested inside it too.
- The disc stays cream; only the outline, glyph and label take the element hue. Never fill the disc with the element colour.
- Two accent layers maximum on a card — an element badge plus a status pill is already the ceiling.
