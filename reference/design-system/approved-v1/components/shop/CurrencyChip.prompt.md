Resource readout for headers, purchase rows and reward summaries.

```jsx
<CurrencyChip kind="coin" amount={4820} />
<CurrencyChip kind="momentum" amount="12" size="sm" />
<CurrencyChip kind="coin" amount={4820} delta="-240" />
```

- Figures are mono and tabular so columns of numbers don't jitter.
- The coin mark is gold-on-cream; it never glows or sparkles.
- Momentum is deliberately not gold — same capsule, wind glyph, wind hue, so it can't be mistaken for currency.
