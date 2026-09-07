Grouping surface for related shop content — inventory sections, station detail, settings blocks.

```jsx
<Panel title="Provision Station" subtitle="Two batches resting" action={<StatusPill tone="success">Ready</StatusPill>}>
  …
</Panel>
```

- Radius is always `--radius-panel` (24px); the border is a single hairline, never doubled.
- `tone="sand"` reads as recessed — use it for a sub-section inside a cream panel, not as a page background.
- Panels never get glow, wood texture, or ornamental frames.
