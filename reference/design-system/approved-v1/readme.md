# Catchmon Shop — Design System

**CatchShop / Catchmon Shop** is a warm, stylised 2.5D collector-and-shopkeeping game world. The player runs a
shop — sales floor, workshop, stations, displays — inside a magical-adventurous world populated by *Catchmons*,
the collectible creatures that are the emotional and visual centre of the product. Everything else in the
frame exists to make a Catchmon look good.

This design system is the operational layer for that world's **interface and 2D asset production**: the
approved palette, the Element Compass, form and rendering law, type, spacing, radii, shadows, motion, the
reusable UI primitives, and a mobile UI kit showing them in a real screen context.

## Sources given

| Source | What it provided |
| --- | --- |
| `uploads/# Catchmon Shop Visual System __Title___ Catchmon Shop Design System.pdf` | **Production Art Brief v1** — rendering recipe, colour palette, Element Compass, reference read-out, Golden Sample waves, generation contract, review gate. Extracted copy in `guidelines/source-art-brief.md`. |
| `uploads/# Catchmon Shop Visual System __Title___ Catchmon Shop Design System2.pdf` | **Visual Production System v1** — the twelve Style Lock rules, per-category rules (environments, stations, displays, products, materials, components, customers, regions, routes, UI, icons, VFX). Extracted copy in `guidelines/source-visual-production-system.md`. |
| 16 approved Catchmon PNGs (1024², transparent) | The only real artwork in the system. Copied verbatim to `assets/catchmons/`. |

No codebase, Figma file or repository was supplied. No slide template was supplied, so no sample slides
were created. There is **no logo or brand mark** in the sources — the brand name is set in plain display
type wherever a mark would go (see `thumbnail.html`). Nothing was drawn or reconstructed from memory.

Explicit scope note carried over from the source: *no product catalogue, customer roster, route list, state
machine, asset count or production manifest is defined*. Those arrive later from the game implementation.
Every product name in this system is a category-level placeholder, deliberately not game content.

---

## CONTENT FUNDAMENTALS

The source documents are written as **law, not suggestion** — and the product's own voice inherits that
calm confidence without the sternness.

**Register.** Warm, plain, specific. Short declarative sentences. The brief's own line — *"The world has to
look like it was drawn by whoever drew the Catchmons"* — is the model: concrete, unhedged, no marketing
adjectives. Internal documentation states a rule and its consequence ("A violation is a rework, not a
discussion").

**Person.** The player is addressed as **you**, implicitly and rarely. The system never says "I". UI copy
prefers the imperative for actions ("Start batch", "Collect batch", "Tend", "Open the doors") and the neutral
third person for states ("Two batches are resting", "Ready in about two hours"). Never "We're preparing your
batch!"

**Casing.** Sentence case for everything readable: buttons, headings, body, sheet titles. `UPPERCASE` is
reserved for 12px status markers and micro-labels (`READY`, `MASTERWORK`, `FINE`) — never a heading, never a
sentence. Title Case appears only in proper nouns: Catchmon names, station names, region names.

**Numbers.** Always numerals, always in the mono face, thousands-separated: `4,820`. Durations are human and
approximate in prose ("about two hours"), exact in chips (`1h 58m`).

**Length.** Product and station names: one to three words. Card captions: one clause. Sheet body: one to two
sentences. If copy needs a third sentence, it belongs in a panel, not on a card. "Quiet space between
important information" is a copy rule as much as a layout rule.

**Emoji: never.** Not in UI, not in documentation, not in marketing. Element identity is carried by the
Element Compass badge and the artwork. Unicode dingbats are not used as icons either.

**Tone guardrails.** Warm, magical, charming, collectible, premium. **Never** realistic, grimdark, childish,
generic hyper-casual, neon-heavy, or cluttered. Premium is produced by restraint, light, clean edges and
spacing — never by more gold, more glow, more particles, more exclamation marks.

Examples:

- ✅ "Two batches are resting. They finish in about two hours."  ❌ "Your yummy batches are almost ready!! 🎉"
- ✅ "Buy for 240"  ❌ "GET IT NOW — ONLY 240 COINS!"
- ✅ "Provision Station · Idle"  ❌ "Uh-oh, nothing's cooking…"

---

## VISUAL FOUNDATIONS

### Colour
One **warm base family** carries the entire product: Neutral Dark `#2E2A28`, Soft Cream `#F5E8D2`, Warm Sand
`#D8B882`, Muted Walnut `#7B573D`, Soft Gold `#E7B85A`, Warm White `#FFF8EB`. Every neutral in
`tokens/colors.css` is a mix inside that family — there is no cool grey anywhere in the system.

**Element colour is an accent, never a wash** (SL-08). The 17-element Compass in `tokens/elements.css`
exposes `--el-1 / --el-2 / --el-glow` under a `data-element` scope. Element hue is allowed in: an outline, a
glyph, a label, a low-opacity floor light under an asset. It is *not* allowed as a card fill, a page
background, a button colour, or a full-bleed gradient. Maximum 2–3 accent layers per card.

Semantic status is the approved six (`success #65B97A`, `warning #E6A94C`, `error #D96868`, `info #67A9D8`,
`premium #E6B958`, `disabled #8E8984`) and **status is never colour alone** — every `StatusPill` carries a
word and, by default, a glyph.

### Type — FINAL
Two families, no third face:

- **Display — Baloo 2** (600/700/800): screen titles, panel titles, card and product names, tab labels,
  button labels. Rounded terminals, generous x-height, warm without being cartoonish.
- **UI / body — Nunito Sans** (400/600/700): all running copy, captions, helper text.
- **Numeric — Nunito Sans with `font-variant-numeric: tabular-nums`** (`--font-numeric`, `--numeric-figures`):
  coins, prices, quantities, timers, percentages and every other numeric readout. Tabular figures so columns
  of numbers never jitter. A separate mono face was evaluated and rejected — it read as a developer tool
  against warm cream and rounded display type.

Fonts load remotely in the designer workspace. Local binaries with `@font-face` rules will be supplied before
integration into the game project; that is a packaging step, not an open type decision.

Scale: 34 / 28 / 22 / 18 / 16 / 15 / 13 / 12 / 11. Leading 1.1 display → 1.45 body. Tracking is neutral except
`0.06em` on uppercase micro-labels.

### Spacing & layout
4px base unit; the working set is 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64. Screen gutter 16, grid gap 12,
card padding 16, panel padding 20, section stack 32. Touch targets never below **44px** (52px comfortable).
The mobile frame is 390 wide, matching the brief's UI Golden Sample.

Fixed elements: a sticky warm-cream top bar (title + resource chips) and a bottom tab bar with a hairline
border and a faint upward shadow. Content scrolls between them. Sheets rise from the bottom edge over a
warm scrim (`rgba(46,42,40,.56)`); modals never cover the resource chips entirely.

### Backgrounds
The app ground is a flat warm sand `#F1E2C6`. **No gradients as decoration, no repeating patterns, no
parchment, no textures, no full-bleed photography.** The only gradient in the whole system is the radial
floor-light wash under a Catchmon or an elemental asset, fading `--el-glow` to transparent — a light effect,
not a colour field. Full-bleed art belongs to key environment illustrations (layered base/shadow/glow), which
sit *behind* UI with a deliberately clear foreground floor; UI never sits on busy art.

### Cards, panels, borders, radii
Approved radius family: XS 6 · S 10 · M 14 · L 18 · XL 24, plus pill **reserved for status markers only**.
Buttons M, cards L, panels XL, slots M.

A card is: warm-white ground, **one** hairline walnut-tinted border (`rgba(123,87,61,.22)`), soft warm shadow,
16px padding, asset prominent and status secondary. Never a double border, never a coloured left-border
accent stripe, never a glass surface. A panel adds `--inset-panel` — a single 1px warm-white inner top
highlight — for quiet depth. A slot is the inverse: sand fill plus `--inset-slot` so it reads recessed.

### Shadow system
Four warm-tinted families, **never pure black**: `small` (chips, tab pills), `card`, `modal`, `world` (the
ground shadow under an object in the diorama). Inner shadows are structural only: `--inset-panel` for depth,
`--inset-slot` for recess. Primary buttons additionally carry a 3px solid walnut **depth edge**
(`--depth-button`) rather than a blur — that edge is the brand's button.

### Glow
Glow is **earned** (SL-09): elemental energy, active selection, masterwork quality, discovery, capture. Three
tokens only — `--glow-ring-selection`, `--glow-ring-masterwork`, `--glow-capture`. There is no permanent
bloom, no glowing button, no ambient decorative light. The core glows; the surrounding form stays legible.

### Transparency & blur
Blur is **not used**. No glass morphism, no backdrop filters. Transparency appears only in: warm-tinted
border and shadow alphas, the modal scrim, semantic pill fills at ~20–24% and the radial floor light. Any
surface a user reads text on is opaque.

### Animation
Soft spring, quick ease-out, slight overshoot, brief anticipation. Durations: 90 / 140 / 220 / 360ms for UI,
~900ms for VFX, hard ceiling 2s. Easings live in `tokens/motion.css`; `--ease-overshoot` is the signature
curve. **No linear tweens, no shakes, no permanent bounce, no continuous particles.** Effects resolve and
disappear; nothing survives longer than the moment it describes.

### Interaction states
- **Press** (the primary state — this is a touch product): the button translates down 2px and its depth edge
  compresses from 3px to 1px. Cards and slots use `--press-scale` 0.97. Colour also darkens one step
  (`--action-primary-press`).
- **Hover** is a convenience, never required: one step lighter fill (`--action-primary-hover`,
  `--action-secondary-hover`), no lift, no glow, no colour change of text.
- **Selected**: fill plus weight change (tabs), or the gold selection ring (cards, slots).
- **Disabled**: `--action-disabled` fill, `--cs-disabled` text, no border, no shadow — visibly inert, never
  just faded to 50%.
- **Focus**: the gold selection ring doubles as the keyboard focus ring.

### Imagery colour vibe
Warm, one slightly warm directed key light, large connected shadow shapes, soft cel-painterly shading,
visible medium-weight warm-tinted outlines (never pure black), 1–2 highlights per object, materials read
through shape rather than texture. Saturation ceiling drops with the contrast hierarchy:
**UI > interactive object > props > environment > far background.** No grain, no bloom, no cool-cast, no
photoreal render. Form ratio across any asset: 60–70% soft/round, 20–30% clean/angular, ~10% sharp/magical.

---

## ICONOGRAPHY

**No icon masters were supplied.** The source specifies the intended set precisely — square masters on a
shared grid, one clear silhouette, medium uniform stroke, minimal interior lines, matched optical mass,
legible without text at 20–24px, one metaphor per meaning, one stroke logic per family.

**Status: TEMPORARY IMPLEMENTATION SUBSTITUTE.** Lucide is not the final Catchmon Shop icon art language.

**Substitution:** the system uses **Lucide** (`lucide-static@0.441.0`), wrapped in the
`Icon` component. Lucide was chosen because it matches the brief's requirements closest available: uniform
medium stroke, no fills, no interior micro-detail, consistent optical mass. The 36 glyphs currently in use are
copied into **`assets/icons/`** as SVG masters, so the system works offline; `Icon` inlines the SVG so the
stroke inherits `currentColor` and can be tinted with brand tokens — never hand-drawn SVG, never PNG. Pages
set `window.CATCHMON_ICON_BASE` to point at their relative `assets/icons/` path; without it the component
falls back to the CDN.

Rules in use:
- Minimum render size 20px; icon-only targets keep a 44px hit area.
- Icons are monochrome and inherit text colour. Element hue on a glyph is allowed **only** inside
  `ElementBadge`.
- One glyph per meaning per screen. The element→glyph mapping lives in `components/shop/ElementBadge.jsx`.
- **No emoji, ever.** No unicode dingbats as icons. No PNG icons.
- No icon font is embedded, because none was provided.

**Ask:** ship the brand icon masters (SVG, shared grid, stated stroke weight) and they drop straight into
`assets/icons/` — only `Icon.jsx` holds the base path.

---

## Index

Root manifest:

| Path | What it is |
| --- | --- |
| `styles.css` | The single entry point consumers link. `@import` lines only. |
| `tokens/` | `fonts.css`, `colors.css`, `elements.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css` |
| `assets/catchmons/` | The 16 approved Catchmon masters (1024², transparent PNG) |
| `assets/icons/` | 36 Lucide SVG glyphs in use (temporary substitute) |
| `assets/catchmons/web/` | 448px WebP re-encodes — standalone preview only, **not masters** |
| `guidelines/` | Foundation specimen cards + the extracted source documents |
| `components/` | Reusable UI primitives (below) |
| `ui_kits/shop_app/` | Mobile UI kit — see its own `README.md` |
| `thumbnail.html` | Homepage tile (brand name in type; no logo exists) |
| `SKILL.md` | Agent-skill entry point for downloading this system into Claude Code |
| `Catchmon Shop UI Kit.html` | Self-contained offline export of the UI kit (generated) |

### Components

`components/core/`
- **Button** — primary / secondary / ghost / destructive, three sizes, depth edge and pressed state
- **Panel** — warm-ground surface container with optional title, subtitle and action slot
- **StatusPill** — short uppercase status marker, the only pill radius in the system
- **Tabs** — segmented switch; selection by fill plus weight
- **Icon** — Lucide glyph wrapper (substituted set)

`components/shop/`
- **ElementBadge** — element identity disc; exports `ELEMENTS`, the 17-name Compass list
- **ProductCard** — product tile with quality tier, price and optional element accent
- **CatchmonCard** — collection tile, including the undiscovered silhouette state
- **Slot** — recessed asset cell: filled / empty / locked / masterwork / selected
- **CurrencyChip** — coin, momentum and material readouts in tabular mono

Each component directory carries `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md` and one `@dsCard` HTML.

### Intentional additions

The sources define UI *categories* (panels, buttons, cards, tabs, slots, status markers, icons) rather than a
named component library, so the primitives above are the direct translation of those categories. Three go
slightly beyond a literal reading and are called out here:

- **ElementBadge** — the Element Compass is an approved foundation but had no UI carrier; this is the only
  sanctioned way element colour enters the interface.
- **CurrencyChip** — the brief specifies a Coin Icon and a Momentum Icon plus "momentum must never read as a
  second currency"; the chip is where that distinction is enforced.
- **CatchmonCard** — rule SL-12 makes "Catchmons stay the stars" a system-level requirement; it needs a
  component whose job is to stay quieter than its occupant.

### Guidelines

`guidelines/source-art-brief.md` and `guidelines/source-visual-production-system.md` hold the extracted text
of the two PDFs — the Style Lock rules, per-category rules and the verbatim generation contract, including
the base style block to paste into every asset prompt and the 8-check review gate.

---

## FOUNDATION LOCKED

The visual foundation of the Catchmon Shop Design System is **locked**. Palette, Element Compass, typography,
spacing, radii, shadows, motion and the component set are approved and final. Remaining open work is **asset
production / Golden Samples**, not further Design System definition.

Locked:

- **Colour** — the six approved base colours, the derived warm neutral ramp, the semantic six, the surface,
  border, action and glow aliases.
- **Element Compass** — all 17 elements, approved final hex values. Provenance is documented in
  `guidelines/source-art-brief.md`; the values are not provisional and are not to be re-derived.
- **Typography** — Baloo 2 + Nunito Sans (tabular numerals). Final.
- **Spacing, radii, shadows, motion, component set** — final.

### Intentional remaining placeholders

These are deliberate blanks awaiting production, not unresolved design decisions:

1. **Icons — temporary implementation substitute.** Lucide (36 glyphs in `assets/icons/`) stands in so the
   system is usable today. **Lucide is not the final Catchmon Shop icon art language.** Custom SVG masters
   drop into `assets/icons/` under the same glyph names — no consuming component changes. Flagged in the
   Design System tab under Brand → *Icons · temporary substitute*.
2. **Logo** — none supplied; the brand name is set in display type. Nothing was invented.
3. **Environment, station, product and material art** — none supplied. The UI kit shows labelled placeholders
   carrying their **Golden Sample Wave** reference (Wave 1: Shop Key Environment, Provision Station, Standard
   Product; Wave 2: Premium Product, Special Component, routine materials), so the kit doubles as the intake
   checklist when samples arrive.
4. **Font binaries** — local files land before game-project integration; a packaging step, not a type
   decision.
5. **No game content** — no product catalogue, customer roster, route list, asset manifest or asset counts
   exist here by design. Product names in the UI kit are category-level stand-ins.

### Standalone preview files — not canonical assets

`ui_kits/shop_app/index-standalone.html` and `assets/catchmons/web/*.webp` exist **only** to produce the
self-contained Design System / UI Kit preview. The WebP files are 448px re-encodes made to fit the export size
limit. **They are not canonical Catchmon master assets** — the masters are the 1024² transparent PNGs in
`assets/catchmons/`. Never source production work from `assets/catchmons/web/`.
