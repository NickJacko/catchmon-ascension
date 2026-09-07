The world-derived action button — use it for every tap target that commits an action; one primary per view.

```jsx
<Button variant="primary" size="md" iconLeft={<Icon name="coins" size={18} />}>Buy for 240</Button>
<Button variant="secondary">Not now</Button>
<Button variant="destructive" fullWidth>Discard batch</Button>
```

- `primary` carries a 3px walnut depth edge and drops 2px on press — that depth IS the brand's button, don't flatten it.
- `secondary` is sand fill + hairline border; `ghost` is walnut text only, for tertiary navigation.
- Never add glow to a button (SL-09: glow is earned by magical states, not by UI).
- Sizes: `sm` 44px, `md` 52px, `lg` 58px. Mobile targets never go below 44px.
