# Source: Production Art Brief · v1 (extracted)

Extracted from `uploads/# Catchmon Shop Visual System __Title___ Catchmon Shop Design System.pdf`.
Paraphrased where structural, verbatim where the document is a contract.

## Direction
Warm, stylised, magical-adventurous 2.5D collector world: clean readable outlines, soft cel-painterly
shading, large simple volumes, warm materials, elemental colour used as an accent — never as a wash. Cute and
cool sit side by side. Nothing realistic, nothing grimdark, nothing childish. Catchmons stay the emotional
stars; every other asset frames them.

*"The world has to look like it was drawn by whoever drew the Catchmons."*

## Three laws
- **Form ratio** — 60–70% soft/round · 20–30% clean/angular · 10% sharp/magical. Round = shop, care, food.
  Angular = tools, stone, steel, expedition. Sharp = magic, rarity, power.
- **Silhouette law** — 1–3 dominant silhouette features per asset, separated volumes, readable with all
  interior detail removed. Must read at 64px; icons at 20–24px.
- **Hierarchy of contrast** — UI > interactive object > props > environment > far background. Backgrounds are
  always less saturated, lower contrast and less detailed than the thing you can touch.

## The rendering recipe (six settings)
1. **Outline** — visible, deliberate, medium weight, heavier outside than inside. Dark but almost never pure
   black: tint toward the material. No hairline anime lineart, no hard comic ink, no outline-free semi-realism.
2. **Shading** — soft cel-painterly. One clearly directed, slightly warm key light; large connected shadow
   shapes; no AO grime, no noise, no micro-texture.
3. **Highlights** — 1–2 dominant per object, material-dependent. Diffuse on fur and cloth, tight on metal and
   glass, strongest on magic. Never a realistic specular.
4. **Material by shape, not texture** — stone through faceted planes, fur through soft volume transitions,
   energy through glow and colour contrast. Simplified wood grain, stylised metal, translucent glass where the
   contents out-read the glass.
5. **Camera** — products and props at one shared 3/4 angle; shop and stations in a soft elevated 3/4 2.5D
   diorama; regions layered fore/mid/background.
6. **Glow** — elemental energy, active selection, masterwork, discovery, capture. Nowhere else. Core glows,
   surrounding form stays legible; no permanent bloom, no glowing buttons.

**ALWAYS** large legible masses · rounded base forms with targeted angular accents · warm harmonious palettes
· depth through layering and light · elemental colour as accent · one small asymmetric detail for personality
· visible craft and shop life · quiet space between important information.

**NEVER** photoreal texture or PBR · thin lines · dirty grimdark palettes · neon everywhere · permanently
glowing UI · flat generic mobile-game cards without depth · sci-fi HUD framing · MMO gold frames on
everything · glossy anime eyes on every character · random radii and shadows · props rendered more
realistically than a Catchmon · backgrounds that out-contrast the interactive object.

## Colour
Base: Neutral Dark `#2E2A28` (text, outline) · Soft Cream `#F5E8D2` (panels) · Warm Sand `#D8B882` (surfaces)
· Muted Walnut `#7B573D` (wood, borders) · Soft Gold `#E7B85A` (premium) · Warm White `#FFF8EB` (highlights).

Semantic: Success `#65B97A` · Warning `#E6A94C` · Error `#D96868` · Info `#67A9D8` · Premium `#E6B958` ·
Disabled `#8E8984`.

Element colour enters as accent, symbol, glow or silhouette change — it never repaints an asset. Max 2–3
accent layers per card; status is never communicated by colour alone.

**Element Compass** (primary / secondary / glow), expressed through form as well as hue:
Fire (lava, embers) · Water (waves, coral) · Electric (veins, bolts) · Grass (oversized flora) · Earth
(strata, rock) · Poison (fungi, vapour) · Normal (open land) · Ice (crystal, frost) · Fairy (light motes) ·
Wind (arcs, plains) · Steel (ore, geology) · Psychic (floating forms) · Light (beams, monoliths) · Dark (deep
shadow) · Ghost (mist, transparency) · Dragon (monumental rock) · Cosmic (stars, voids).

> **Provenance note.** The source document names the 17 elements without specifying hex values. The values in
> `tokens/elements.css` were sampled from the 16 approved Catchmon masters and have since been **approved as
> the final Design System element colours**. They are not provisional and are not to be re-derived.

## What the references prove
The existing Catchmons define the width of the style — every new asset sits inside this band. The brief calls
out: the angular/heroic end, the cute end (two-tone flat masses, one element symbol, no micro-detail), elegant
translucency, the stylised-metal ceiling, mystical-without-grimdark, and the darkest-but-still-collectible
point.

## Golden Samples
- **Wave 1 — style lock (5 assets):** Shop Key Environment + one Catchmon (2048×1536, opaque, 3/4 elevated) ·
  Provision Station (1024², alpha, idle+active) · Standard Product (1024², alpha, 3/4) · Product Card + Button
  Set (1× mobile frame, 390 wide) · Coin Icon (512², alpha, +24px test).
- **Wave 2 — system proof (6):** Fieldworks Bench · Display Furniture · Premium Product · Routine Material ·
  Special Component · Customer.
- **Wave 3 — world & motion (5):** Region Background · Route Card · Masterwork Effect · Capture Effect ·
  Momentum Icon + World UI Context.

First asset to generate: the Shop Key Environment with one existing Catchmon standing in it — the only sample
where world and a signed-off creature share the same pixels. Deliver base / shadow / glow layers separately.

## Generation contract

**Base style block — always included verbatim:**

> Stylised 2D game illustration, clean deliberate outline of medium weight, dark warm-tinted line rather than
> pure black, soft cel-painterly shading with one directed slightly warm key light, large connected shadow
> shapes, 1–2 controlled highlights, simplified stylised materials with no photoreal texture, warm harmonious
> palette, strong readable silhouette, minimal micro-detail, mobile-legible, charming high-quality collectible
> feel, not realistic, not grimdark, not childish, no neon, no lens flare, no PBR, no gold ornament frames.

Category modifiers: **Products** shared 3/4 angle, 1024², transparent, generous safe margin, single centred
object, optional separate soft ground shadow · **Stations & displays** 3/4 elevated, craft materials, one
working component for the active state, lower saturation than the product on top · **Materials & components**
single clear object, natural colour code, element hint only for special components · **Customers** stylised
humanoid, slightly larger head and hands, reduced facial detail, cozy-adventure clothing, silhouette quieter
than any Catchmon · **Regions** layered fore/mid/background, one dominant landform, 1–2 element cues in form
not just colour, UI space left empty, lower contrast than interactive objects · **Icons** single silhouette,
medium uniform stroke, no fine interior lines, readable at 20–24px, matched optical mass across the set.

**Asset record — fill before generating:** AssetId · category · where used · target size · transparency ·
camera angle · safe margin · variants · required states · animated yes/no · Golden Sample reference.

Naming: `cms_[category]_[name]_[variant]_[state]@1024.png` — e.g. `cms_prod_berrycake_std_base@1024.png`.

**Review gate — 8 checks, any fail = rework:** believable beside a Catchmon · silhouette readable at 64px ·
material stylised enough · outline consistent with the family · saturation under control · no realistic
highlights · no needless micro-detail · magic targeted, not ambient.

Decision rule: *"Would this asset believably exist in the same world as our Catchmons?"* If the answer is not
clearly yes, it gets reworked.
