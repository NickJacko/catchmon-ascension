Recessed cell that holds one asset — inventory grids, station inputs, display shelves, loadouts.

```jsx
<Slot art="assets/products/berrycake.png" label="Berry Cake" size={72} />
<Slot empty label="Add ingredient" onClick={openPicker} />
<Slot locked size={72} />
```

- Always reads as recessed: sand fill plus `--inset-slot`. A slot never looks raised.
- Empty = a quiet plus at 45% walnut. Locked = a lock glyph on darker sand, no interaction.
- `tier="masterwork"` adds the gold ring overlay on top of the same artwork; never swap in a different asset.
- Interactive slots stay ≥44px.
