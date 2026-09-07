# Catchmon Shop — mobile UI kit

A 390×844 recreation of the shop app's three core surfaces, built entirely from this design system's
components. It is a visual/interaction recreation, not production code.

## Screens
| File | Surface |
| --- | --- |
| `index.html` | App shell: top bar, tab bar, screen routing, purchase flow, toast |
| `ShopFloorScreen.jsx` | Sales floor — key-art slot, station row, shelf grid with tier filter |
| `WorkshopScreen.jsx` | Provision Station with input slots and the idle → working → done state language |
| `CollectionScreen.jsx` | Catchmon collection grid + creature detail with care actions |
| `ProductSheet.jsx` | Bottom sheet for a single product: tier, price, buy/dismiss |
| `AppShell.jsx` | TopBar, TabBar, ArtPlaceholder, SectionHead |
| `data.jsx` | Placeholder content (see below) |

## Interactions
Tap a product → bottom sheet → **Buy** debits the coin chip and raises a toast. Tap a Catchmon → detail
view with a back affordance in the top bar. In the Workshop, tap input slots to fill them, start a batch,
then finish and collect — the station moves through three states.

## Deliberate blanks
The supplied sources define **no product catalogue, customer roster, route list or asset manifest**, and no
environment/product/icon masters were provided. So:

Every placeholder carries its **Golden Sample Wave** reference, so this kit doubles as the intake checklist:

- **Shop Key Environment — Wave 1** and **Provision Station — Wave 1**: labelled placeholder frames.
- **Products — Wave 1** (Standard Product) and **Wave 2** (Premium Product, Special Component): tiles show
  `ProductCard`'s recessed empty state; names are category-level placeholders ("Provision I", "Care Item",
  "Special Component") — not game content.
- **Routine materials — Wave 2**: creature artwork stands in.
- Creature artwork is the only real art in the kit.
- Icons come from the temporary Lucide set — not the final icon art language (see readme.md → ICONOGRAPHY).

## Standalone export files

`index-standalone.html` and `assets/catchmons/web/*.webp` exist only to build the self-contained preview
(`Catchmon Shop UI Kit.html`). The WebP files are 448px re-encodes and are **not canonical master assets** —
the masters are the 1024² PNGs in `assets/catchmons/`.

Replace these as masters arrive; the layout, spacing and state language are the parts meant to be copied.
