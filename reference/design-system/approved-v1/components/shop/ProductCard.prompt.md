The product tile used across shelf, shop and crafting grids — one per purchasable or craftable object.

```jsx
<ProductCard name="Berry Cake" art="assets/products/berrycake.png" price={240} tier="fine" />
<ProductCard name="Ember Core" element="fire" tier="masterwork" status={<StatusPill tone="premium">Masterwork</StatusPill>} />
```

- Artwork owns the tile: square, contained, with the authored soft ground shadow. Never crop it to fill.
- Tier is overlay-only — `standard` hairline, `fine` light edge, `masterwork` gold ring + glow. Do not repaint the art.
- `selected` is the only other glow state allowed here.
- Two accent layers max: element badge + one status marker.
