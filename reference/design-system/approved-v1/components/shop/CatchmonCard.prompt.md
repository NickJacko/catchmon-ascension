Collection / roster tile for a Catchmon — use it wherever creatures are browsed rather than products.

```jsx
<CatchmonCard name="Terranox" element="earth" art="assets/catchmons/terranox.png" caption="Stoneflank Ridge" />
<CatchmonCard name="Voidalon" element="dark" art="…/voidalon.png" discovered={false} />
```

- The undiscovered state is a flat silhouette at 28% — it proves rule SL-01 (readable as a black shape).
- The floor wash uses `--el-glow` at low opacity. That is a light effect under the creature, not a coloured card background.
- `glow` is only for capture, discovery and active selection. Never leave it on as decoration.
- Nothing on this card may out-saturate or out-detail the creature itself (SL-12).
