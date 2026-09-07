# Source: Visual Production System · v1 (extracted)

Extracted from `uploads/# Catchmon Shop Visual System __Title___ Catchmon Shop Design System2.pdf`.
The approved foundations are locked; this document is the operational layer.

Scope note carried from the source: no product catalogue, customer roster, route list, state machine, asset
count or production manifest is defined or implied. Those arrive later from the game implementation.

## 1 · Style Lock — twelve mandatory rules
A violation is a rework, not a discussion.

- **SL-01 Silhouette first.** 1–3 dominant silhouette features, separated volumes, still recognisable as a
  flat black shape with all interior detail deleted.
- **SL-02 Outline is always present.** Visible, deliberate, medium weight; heavier exterior than interior;
  dark but warm-tinted toward the material, never pure black. No hairline lineart, no hard comic ink, no
  outline-free rendering.
- **SL-03 One key light.** Soft, clearly directed, slightly warm. Shadows are large connected shapes. No
  second competing light, no AO grime, no studio setup.
- **SL-04 Cel-painterly shading only.** Between clean cel bands and soft digital painting. No photoreal
  texture, no PBR, no micro-noise, no visible brush chaos.
- **SL-05 Highlight budget: 1–2.** Material-dependent — diffuse on fur and cloth, tight on metal and glass,
  strongest on magic. Never a realistic specular.
- **SL-06 Material through shape.** Stone as faceted planes, fur as soft volume transitions, wood as thick
  simplified planks, energy as glow plus colour contrast. Never through texture fidelity.
- **SL-07 Form ratio 60–70 / 20–30 / 10.** Soft-round base, clean-angular accents, sharp-magical spice.
  Category may shift the mix; nothing abandons the round majority except sharp magical objects.
- **SL-08 Warm base, element as accent.** The approved base palette carries the object; Element Compass
  colour enters as accent, symbol, glow or silhouette change and never repaints the asset.
- **SL-09 Glow is earned.** Elemental energy, active selection, masterwork, discovery, capture, special
  creature reaction. Nowhere else. The core glows; the surrounding form stays legible.
- **SL-10 Contrast hierarchy is absolute.** UI > interactive object > props > environment > far background, in
  saturation, contrast and detail density. Never inverted for a nice picture.
- **SL-11 Detail ceiling.** Micro-detail is spent on the main form, not scattered. Any detail invisible at the
  asset's smallest in-game size is deleted rather than kept.
- **SL-12 Catchmons stay the stars.** Nothing may out-silhouette, out-saturate, out-glow or out-detail a
  Catchmon: not a prop, not a customer, not a background, not a UI frame.

**Tone guardrails.** Warm, magical, charming, collectible, high-quality. Not realistic. Not grimdark. Not
childish. Not generic mobile-game UI. Premium is produced by light, restraint, clean edges and spacing —
never by more gold, more glow, more particles or more detail.

## 2 · Category rules (condensed)
Canvas sizes are authoring-master defaults, not claims about what the game will request.

**Shop environments** — soft elevated 3/4 diorama; wide opaque master, 4:3 or wider, layered base/shadow/glow;
round-warm majority with angular work areas; warm wood, sandstone, ceramic, cloth, metal fittings, glass,
paper, leather; warm ambient plus local sources, soft shadows, subtle rimlight; mid-low density with walls and
far background desaturated below the interactive layer; zoning by material, props, lighting, colour
temperature, floor pattern and station silhouette — never hard architectural walls; clear walking paths,
deliberate empty floor for UI, visible craft life, room for a Catchmon at true scale. Never clutter as a
substitute for growth, gold everywhere, glowing surfaces, or background out-contrasting foreground.

**Stations** — same elevated 3/4 as their environment; square transparent master, one state per file, shared
origin and footprint; archetype-driven form (warm/round for care and provisioning, robust/angular for
fieldwork, symmetrical glass-cored for resonance, modular/organic for habitat work); element accent only where
the purpose is elemental; a state is communicated by a working component, small motion, light or particles —
never by recolouring the whole station; completion is one clear pulse, not a sustained display; reads as a
workplace with a visible purpose; upgrades show as better materials and structure, not new architecture.

**Displays** — shared 3/4, matched horizon with the products they carry; defined presentation surface and
consistent product footprint; clean, calm, quietly crafted; lower saturation and detail than any product
placed on them; frame the product and lead the eye to it; premium tiers gain material quality, light and
structure. Never ornament that competes, gold frames as a quality signal, or a display that reads as hero.

**Products** — one single shared 3/4 product angle across the entire catalogue, no exceptions; 1024²
transparent master, generous safe margin, centred, consistent optical size within a family, soft ground shadow
on its own layer; family-driven form; large material areas, 1–2 highlights, minimal micro-detail; **quality
tiers never change the base artwork** — refinement is material finish, light edge, frame and controlled glow in
overlay layers; must read at 64–96px. Never a baked background, an off-angle hero shot, or a product rendered
more realistically than a Catchmon.

**Routine materials** — simplest honest shape; natural colour coding so the material is identified by hue and
shape alone; lowest detail in the system, recognition speed beats charm; instantly distinguishable in a dense
grid. Never decorative flourishes, magical glow, rarity framing or storytelling props.

**Special components** — base and glow layers separated; stronger, more sculptural than a routine material, a
sharp or crystalline accent allowed; Element Compass primary plus secondary, glow hue reserved for the core;
legible element or region identity through form as well as colour; clearly below legendary intensity. Never
full-body glow or particle storms.

**Customers** — one shared character angle and eye-line logic; transparent full-figure master, consistent
height reference and ground contact; stylised humanoid, slightly enlarged head and hands, clear silhouette,
reduced facial detail; lower saturation than the Catchmons and products they look at; modern-fantasy crafted
cozy-adventure clothing, optional light regional influence; base poses plus swappable expressions over many
fully rendered variants; always visually subordinate. Never glossy anime eyes by default or hero treatment.

**Regions** — illustrative diorama with clear depth; wide opaque master with fore/mid/background as separate
layers; one dominant landform motif, 1–2 element cues, deliberate quiet zones for UI; element expressed
through geology, flora, atmosphere and light behaviour, not a colour wash; more atmospheric than the shop but
the same rendering language, held below the interactive layer. Never dense concept art or competing focal
points.

**Route art** — cropped landscape excerpt derived from the region language; card-ratio opaque master with a
safe area for labels; strong horizontal or diagonal read with one visual destination; detail clearly below
region key art; readable behind UI at card size; inherits the parent region's element cues.

**UI components** — radius family XS 6 / S 10 / M 14 / L 18 / XL 24, pill reserved for short status markers;
shadow family small / card / modal / world, never pure black; approved base and semantic colours only. Panels:
warm ground, slight inner depth, one controlled border, soft shadow — no glass morphism, no stacked border
layers. Buttons: primary filled with visible depth and a firm pressed state; secondary softer fill with a thin
border; destructive red-brown, never neon. Cards: asset prominent, status secondary, generous padding, at most
2–3 accent layers. Tabs: selected by fill plus weight, not colour alone. Slots: slightly recessed,
asset-focused, quality shown by overlay rather than new artwork. Mobile: ≥44px targets, hover never required,
status never colour-only, contrast that survives daylight. Never skeuomorphic wood frames, parchment, sci-fi
HUD, permanent glow or ambient decorative ornament.

**Icons** — square transparent master on a shared grid with shared stroke weight and matched optical mass; one
clear silhouette, medium outline, minimal interior lines, a light asymmetric fantasy character; must be
understood without text at 20–24px; one visual metaphor per icon and one stroke logic per family. Never fine
interior detail, reused metaphors, or two icons in a set with different weights.

**VFX** — short, clear, soft, directed, colour-matched to its element or system; resolved within roughly 1–2
seconds; soft spring, quick ease-out, slight overshoot, brief anticipation — no linear tweens, no shakes, no
permanent bounce; authored as its own layer over an untouched base asset, reducible for low-end devices; stays
clear of UI and never obscures the current decision; reads as the same family as its trigger. Never continuous
particles, screen-filling bursts, explosions on ordinary interactions, or effects that outlive the moment they
describe.
