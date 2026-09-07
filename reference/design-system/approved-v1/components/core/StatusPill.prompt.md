Compact state marker for stations, orders, products and slots — the only component allowed the pill radius.

```jsx
<StatusPill tone="success">Ready</StatusPill>
<StatusPill tone="warning" icon="hourglass">2h left</StatusPill>
<StatusPill tone="premium">Masterwork</StatusPill>
```

- Always keep the label. Colour alone is never a status (accessibility + Style Lock).
- Uppercase, 12px, letterspaced — do not put sentences in it.
- One pill per card maximum; a second competing marker breaks the "status secondary" card rule.
