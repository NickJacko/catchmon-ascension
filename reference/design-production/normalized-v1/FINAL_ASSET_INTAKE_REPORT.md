# Vertical Slice Generated Art — FINAL Normalization & Intake Report

Status: normalization + validation only. `generated-v1/` source masters were
never modified (read-only throughout; all outputs written to this
`normalized-v1/` directory). No gameplay/presentation code touched, no
`AssetMetadata` architecture refactor performed, `reference/design-system/
approved-v1/` untouched, Phase 10 not started.

Every normalized file was produced from its `generated-v1` source master
via a documented, non-destructive Pillow pipeline (contain-scale +
transparent-canvas padding; no cropping, no stretching, no repainting —
see §0). Every technical claim below was re-measured directly against the
actual output files. The 5 stated semantic corrections were additionally
**visually confirmed by direct image inspection**, not inferred from pixel
statistics alone — see §1.

**34 required assets normalized. 0 BLOCKED. 0 FIX remaining on the
technical criteria this pass targets** (dimensions, ratio, alpha,
base/shadow canvas compatibility, floor opacity). Two items are marked
**PASS — visual confirmation recommended** rather than an unqualified
PASS, because they depend on judgment this pass's tooling cannot fully
verify (see §4, §6).

---

## 0. Normalization method (applies to every file below)

- **Square category (Stations, Displays, Expedition Hub, Products,
  Routine Materials, Special Component) → 1024×1024:** each source PNG
  is contain-scaled (uniform, aspect-preserving) to fit within a
  1024×1024 transparent canvas and centered; alpha is preserved
  losslessly wherever the source had it. A source already square (the
  large majority) receives a pure proportional downscale with **zero**
  padding. A source that was wide (3:2, from the previously-reported
  canvas mismatches) is scaled to fit and padded symmetrically —
  **nothing is cropped, nothing is stretched, no pixel is repainted.**
- **Customers → 1024×1280:** identical contain-scale approach; every
  customer source already matched the 4:5 target ratio exactly, so this
  is a pure proportional downscale with zero padding — full body and
  the artist's original foot placement are preserved exactly as
  composed, not re-derived.
- **Shop Key Environment → 2048×1536:** pure proportional upscale (source
  already 4:3) — a style-lock reference, not integrated into the running
  scene.
- **Playable Environment (Wall/Floor) → 2400×1600:** pure proportional
  upscale (source already 3:2) for both layers. The Floor's alpha
  channel is additionally **flattened to fully opaque before scaling** —
  every RGB value is preserved exactly as delivered; only the alpha
  channel (which had an unintended vignette) is discarded, converting
  the layer from `RGBA` to `RGB`. This is the described "remove the
  vignette non-destructively" step: no pixel color changes, the pixels
  that were partially see-through are simply made fully opaque.
- **Expedition Hub margin (base + shadow only):** contain-scaled to fill
  at most **87.5%** of the 1024×1024 canvas on its longer axis (instead
  of the default 100%), then centered — a uniform ~6.25% transparent
  margin is added on every side specifically so the artwork's own edges
  sit clear of the corner area where `ExpeditionHubEntity.ts`'s
  code-drawn status badge is composited. No other category received
  this extra inset (not requested for them).
- **A bug was found and fixed during this pass:** an early version of
  the normalization script passed the same image as both the paste
  source and the paste mask, which double-applies alpha and silently
  shrinks the effective visible content by up to ~25 percentage points
  of bounding box. This was caught by re-measuring bounding boxes against
  the known source values before finalizing any output, fixed, and every
  file was regenerated from the source masters — no destructive artifact
  reached this directory's final state.

---

## 1. Semantic corrections — visually confirmed

Every one of the 5 stated corrections was opened and inspected directly
(not inferred from pixel statistics). All 5 are confirmed correct:

| File | Correction claimed | Visual confirmation |
|---|---|---|
| `product-03_base_1024.png` | Field Gear, leather/tool/metal, no longer provisions | **Confirmed** — a leather expedition satchel with a rolled map, brass compass, buckles and feather charms. Clearly field/expedition gear, not a food/provisions object. |
| `product-04_base_1024.png` | Capture Aid, expedition/capture equipment, targeted magical accent | **Confirmed** — a glowing capture net on a rod plus a pouch holding glowing capture-orb spheres and a vial. Reads unambiguously as capture equipment; the blue glow is a targeted accent on specific objects, not an ambient wash. |
| `customer-special-visitor_1024x1280.png` | Same Special Visitor concept, shoulder creature removed | **Confirmed** — a stylish shopper figure carrying bags; no creature present anywhere on the figure. |
| `expedition-hub_base_1024.png` | Bird/mascot removed | **Confirmed** — a wooden expedition outpost/kiosk (map table, compass, lanterns, destination signpost, dock); no bird or mascot creature anywhere in the scene. |
| `fieldworks-bench_active_base_1024.png` | Creature hologram removed, replaced with map/compass/leaf visual language | **Confirmed** — a workbench with glowing holographic map/compass/leaf projections and a lit lantern; no creature imagery present. The idle-state sibling (no glow, unlit lantern) forms a coherent, legible idle↔active pair. |

`product-03_shadow_1024.png` / `product-04_shadow_1024.png` are
confirmed updated in lockstep (matching alpha/shape data specific to the
new base art, not the old provisions-themed renders — see §5).

**Style note, not a defect:** all 5 corrected renders lean toward a more
detailed/glossy rendering treatment than the approved brief's "flat,
cel-painterly, medium-weight deliberate outline" recipe. Per this task's
own instruction not to reject for subjective polish, this is **not**
flagged as FIX — it's a style-consistency observation for a later pass,
not a technical or semantic defect.

---

## 2. Out-of-scope files confirmed correctly excluded

`generated-v1/reserved/product-x_*` and `generated-v1/reserved/product-y_*`
(4 files) are present in the source tree but are **not** part of the 21
real required-asset list (no "Product X/Y" exists in
`content/vertical-slice/craftingContent.ts` — only Products 01–05 are
real slice content). Their pixel statistics exactly match the
*previously-flagged, semantically-wrong* provisions-themed renders that
used to occupy `product-03`/`product-04` — confirming the old art was
**preserved under a reserved name, not deleted**, consistent with the
"preserve source masters" instruction. Correctly **not normalized**, not
counted in the 34.

Region Backgrounds and Route Cards remain absent from `generated-v1`,
consistent with Regions being held and Routes belonging to a
not-yet-produced Wave 3 — not a gap in this pass's scope.

---

## 3. Per-asset table

Legend: **dims** = actual output pixel size. **α** = alpha/opacity
status. **Pair** = base/shadow canvas compatibility. All AssetIds below
are the same PROPOSED identifiers from `vertical-slice-asset-audit.md`.

### Environments

| Source | Normalized | AssetId | Dims | α/opacity | Preprocessing | Verdict |
|---|---|---|---|---|---|---|
| `environments/shop-environment_wall_2400x1600.png` | same path | `env-shop-key-wall` | 2400×1600 | `RGB`, no alpha — fully opaque | proportional upscale only | **PASS** |
| `environments/shop-environment_floor_2400x1600.png` | same path | `env-shop-key-floor` | 2400×1600 | `RGB`, no alpha — **fully opaque (vignette removed)** | alpha channel flattened/dropped, RGB preserved, then upscaled | **PASS** |
| `environments/shop-key-environment_golden-sample_2048x1536.png` | same path | `env-shop-key-golden-sample` | 2048×1536 | `RGB`, no alpha — fully opaque | proportional upscale only | **PASS** (style reference, never integrated) |

**Integration note carried over (unchanged by this pass):** both layers
are still full-canvas images, not pre-cropped to their intended 42%/58%
vertical band. Compositing them as two literal full-canvas layers still
needs a Phase 10 integration-approach decision (crop to band vs.
positional clipping in the renderer) — this pass fixed opacity/dimensions,
not layer-cropping, which was never in scope here.

### Stations

| Source | Normalized | AssetId | Dims | α | Pair compatibility | Preprocessing | Verdict |
|---|---|---|---|---|---|---|---|
| `provision-station_idle_base_1024.png` | same | `station-provision-station-idle-base` | 1024×1024 | preserved | matches all 3 siblings | proportional downscale | **PASS** |
| `provision-station_idle_shadow_1024.png` | same | `-idle-shadow` | 1024×1024 | preserved | ✓ | downscale | **PASS** |
| `provision-station_active_base_1024.png` | same | `-active-base` | 1024×1024 | preserved | ✓ | downscale | **PASS** |
| `provision-station_active_shadow_1024.png` | same | `-active-shadow` | 1024×1024 | preserved | ✓ | downscale | **PASS** |
| `fieldworks-bench_idle_base_1024.png` | same | `station-fieldworks-bench-idle-base` | 1024×1024 | preserved | matches idle-shadow | downscale | **PASS** |
| `fieldworks-bench_idle_shadow_1024.png` | same | `-idle-shadow` | 1024×1024 | preserved | ✓ | downscale | **PASS** |
| `fieldworks-bench_active_base_1024.png` | same | `-active-base` | 1024×1024 | preserved | **now matches active-shadow AND the idle pair** — previously-reported cross-mismatch resolved | contain-scale + center pad (source was already square post-correction; no padding actually needed) | **PASS** |
| `fieldworks-bench_active_shadow_1024.png` | same | `-active-shadow` | 1024×1024 | preserved | ✓ | contain-scale + center pad (source was wide 1536×1024 → padded to square) | **PASS** |

### Displays

| Source | Normalized | AssetId | Dims | α | Pair | Preprocessing | Verdict |
|---|---|---|---|---|---|---|---|
| `display-furniture_base_1024.png` | same | `display-slot-furniture-base` | 1024×1024 | preserved | matches shadow (both were wide, both padded identically → alignment preserved by construction) | contain-scale + center pad | **PASS** |
| `display-furniture_shadow_1024.png` | same | `display-slot-furniture-shadow` | 1024×1024 | preserved | ✓ | contain-scale + center pad | **PASS** |

### Infrastructure / Expedition Hub

| Source | Normalized | AssetId | Dims | α | Pair | Preprocessing | Verdict |
|---|---|---|---|---|---|---|---|
| `expedition-hub_base_1024.png` | same | `infrastructure-expedition-hub-base` | 1024×1024 | preserved | **now matches shadow** (source base had already become square post-correction; shadow was still wide — both now reconciled to 1024×1024) | contain-scale to 87.5% fill + center pad (extra safe margin) | **PASS — visual confirmation recommended** |
| `expedition-hub_shadow_1024.png` | same | `infrastructure-expedition-hub-shadow` | 1024×1024 | preserved | ✓ | contain-scale to 87.5% fill + center pad | **PASS — visual confirmation recommended** |

Direct visual inspection of the corrected hub art (§1) shows open sky/
background area in the extreme top-right corner already, before the
extra margin was even applied — combined with the new 87.5%-fill
transparent border on all sides, the corner the code-drawn badge
occupies should be clear. This pass could not run the actual
`ExpeditionHubEntity` renderer to confirm pixel-for-pixel, so it is
marked PASS with a recommended one-time visual spot-check in the running
scene during Phase 10, not held back as FIX.

### Products

| Source | Normalized | AssetId | Dims | α | Pair | Preprocessing | Verdict |
|---|---|---|---|---|---|---|---|
| `product-01_base/_shadow` | same | `product-slice-product-01-{base,shadow}` | 1024×1024 | preserved | matched pair | downscale | **PASS** |
| `product-02_base/_shadow` | same | `product-slice-product-02-{base,shadow}` | 1024×1024 | preserved | matched pair | downscale | **PASS** |
| `product-03_base/_shadow` | same | `product-slice-product-03-{base,shadow}` | 1024×1024 | preserved | matched pair | downscale | **PASS** — new Field Gear art, see §1 |
| `product-04_base/_shadow` | same | `product-slice-product-04-{base,shadow}` | 1024×1024 | preserved | matched pair | downscale | **PASS** — new Capture Aid art, see §1 |
| `product-05_base_1024.png` | same | `product-slice-product-05-base` | 1024×1024 | preserved | **now matches shadow** — previously-reported mismatch resolved | downscale | **PASS** |
| `product-05_shadow_1024.png` | same | `product-slice-product-05-shadow` | 1024×1024 | preserved | ✓ | contain-scale + center pad (was wide 1536×1024) | **PASS** |

Products 01–05 now form one coherent, canvas-consistent base-art set —
all 10 files share the identical 1024×1024 square convention.

### Routine materials

| Source | Normalized | AssetId (provisional mapping) | Dims | α | Pair | Preprocessing | Verdict |
|---|---|---|---|---|---|---|---|
| `routine-material-01_base_1024.png` | same | `material-slice-resource-a-base` | 1024×1024 | preserved | matches shadow | downscale | **PASS** |
| `routine-material-01_shadow_1024.png` | same | `material-slice-resource-a-shadow` | 1024×1024 | preserved | **now matches base** — previously-reported mismatch resolved | contain-scale + center pad | **PASS** |
| `routine-material-02_base_1024.png` | same | `material-slice-resource-b-base` | 1024×1024 | preserved | matches shadow | downscale | **PASS** |
| `routine-material-02_shadow_1024.png` | same | `material-slice-resource-b-shadow` | 1024×1024 | preserved | **now matches base** | contain-scale + center pad | **PASS** |

### Special component

| Source | Normalized | AssetId | Dims | α | Pair | Preprocessing | Verdict |
|---|---|---|---|---|---|---|---|
| `special-component-01_base_1024.png` | same | `component-slice-component-a-base` | 1024×1024 | preserved | matches shadow | downscale | **PASS** |
| `special-component-01_shadow_1024.png` | same | `component-slice-component-a-shadow` | 1024×1024 | preserved | **now matches base** — previously-reported mismatch resolved | contain-scale + center pad | **PASS** |

### Customers (no shadow files — see §6)

| Source | Normalized | AssetId | Dims | α | Preprocessing | Verdict |
|---|---|---|---|---|---|---|
| `customer-everyday-buyer_1024x1280.png` | same | `customer-portrait-everyday-buyer` | 1024×1280 | preserved | proportional downscale, zero padding (ratio already matched) | **PASS** |
| `customer-explorer-buyer_1024x1280.png` | same | `customer-portrait-explorer-buyer` | 1024×1280 | preserved | downscale | **PASS** |
| `customer-special-visitor_1024x1280.png` | same | `customer-portrait-special-visitor` | 1024×1280 | preserved | downscale | **PASS** — new art, creature removed, see §1 |

**PASS, margin note (informational only, not FIX):** margin remains
tight for all 3 customers (content commonly fills 95–100% of the frame
on at least one axis) because normalization preserves whatever margin
the source already had — nothing in this pass's instructions called for
artificially shrinking customer content to manufacture extra margin the
way the Hub received. No code-drawn overlay is composited onto customer
art today, so there is no functional collision this creates.

---

## 4. Base/shadow reconciliation — explicit resolution list

All 5 previously-reported cross-pair canvas mismatches are resolved —
every pair now shares an identical 1024×1024 canvas:

| Pair | Before | After |
|---|---|---|
| `fieldworks-bench_active_base` / `_active_shadow` | base 1254×1254 (square) / shadow 1536×1024 (wide) — **also newly checked:** base had already become square after the art correction, shadow had not | both 1024×1024 |
| `product-05_base` / `_shadow` | 1254×1254 / 1536×1024 | both 1024×1024 |
| `routine-material-01_base` / `_shadow` | 1254×1254 / 1536×1024 | both 1024×1024 |
| `routine-material-02_base` / `_shadow` | 1254×1254 / 1536×1024 | both 1024×1024 |
| `special-component-01_base` / `_shadow` | 1254×1254 / 1536×1024 | both 1024×1024 |

**Alignment assumption, stated plainly:** for the 5 pairs above, base and
shadow started on genuinely different source canvases. This pass
registers both to the shared 1024×1024 canvas by **centering each
independently on its own canvas**, since no per-pixel authored offset
data exists to do otherwise. This is the same assumption flagged in the
prior intake report — normalization did not (and could not) resolve it
with certainty; it is the most defensible non-guessing choice available,
and worth a quick visual spot-check once these five pairs are stacked in
the real Pixi scene. Every pair that started on the **same** canvas
(Provision Station all 4 files, Fieldworks Bench idle pair, Products
01–04, Display Furniture) has zero such ambiguity — their relative
alignment was never in question.

No baked-black backgrounds were found in any normalized file (re-checked
post-normalization) — every transparent asset still shows genuine
`alpha = 0` at its borders, not an opaque black fill.

---

## 5. Missing assets

None, relative to this pass's scope (Wave 1 + Wave 2, customers without
separate shadows per producer decision). See §6 and §7 for the two
producer decisions that closed the previously-open questions.

---

## 6. Producer decision — customer shadows

**Confirmed: customers do not require a separate raster shadow file.**
The single delivered image per archetype is the complete, correct
deliverable — not a missing asset. Where the Pixi scene needs ground
contact under a customer, `CustomerEntity.ts` should draw a simple
code-driven shadow shape (matching the same pattern
`ShopSceneRenderer.ts` already uses for scene VFX), not consume a second
raster layer. React's `CustomerSheet` needs no shadow treatment at all.
This is a Phase 10 code task (not performed here) — recorded so it isn't
rediscovered from scratch.

---

## 7. Producer decision — routine material mapping

**Confirmed, provisional:** `routine-material-01` → `SLICE_RESOURCE_A_ID`,
`routine-material-02` → `SLICE_RESOURCE_B_ID`. This is recorded as a
**visual mapping only** — it does not rename, relabel, or imply any
canonical name (e.g. "Wood"/"Crystal") for either domain resource, and no
domain/content code was changed to reflect it. Phase 10 should wire the
`AssetId`s using this mapping as given, not re-derive or second-guess it.

---

## 8. Proposed spatial metadata (pivot / floor footprint)

Per the approved convention (canonical pivot = center of the object's
actual floor footprint) and the instruction not to guess from transparent
canvas bounds when the footprint can be derived more accurately: each
value below is the **alpha-weighted centroid of the object's own
normalized shadow layer** — a real, artwork-derived proxy for "where the
object actually contacts the ground," not a guess from the base
artwork's bounding box (which would incorrectly place the pivot at the
object's overall visual center, including its height).

| Object | Source (normalized shadow) | Proposed pivot (fraction of 1024×1024, x, y from top-left) |
|---|---|---|
| Provision Station — idle | `provision-station_idle_shadow_1024.png` | (0.497, 0.699) |
| Provision Station — active | `provision-station_active_shadow_1024.png` | (0.493, 0.758) |
| Provision Station — **recommended unified pivot** | average of the two states | **(0.495, 0.729)** |
| Fieldworks Bench — idle | `fieldworks-bench_idle_shadow_1024.png` | (0.525, 0.733) |
| Fieldworks Bench — active | `fieldworks-bench_active_shadow_1024.png` | (0.489, 0.709) |
| Fieldworks Bench — **recommended unified pivot** | average of the two states | **(0.507, 0.721)** |
| Display Furniture | `display-furniture_shadow_1024.png` | **(0.518, 0.701)** |
| Expedition Hub | `expedition-hub_shadow_1024.png` | **(0.499, 0.668)** |

All 6 raw values cluster tightly around x≈0.49–0.53 (horizontal center,
as expected for a symmetric 3/4-camera object) and y≈0.67–0.76 (below
visual center, matching where a ground shadow actually falls). This
report recommends **one unified pivot per station** (idle and active
share the same physical object and footprint) rather than a per-state
pivot, since the two states' raw values differ only by ~0.03–0.06 —
well within what a single shared pivot can absorb without a visible
jump on state swap.

**Not performed in this task, by instruction:** adding a real
pivot/footprint field to `AssetMetadata` (`src/domain/assets/types.ts`
has none today) is a Phase 10 code/architecture task. These values are
recorded here so Phase 10 does not have to re-derive them from scratch.

---

## 9. Final validation checklist

- [x] No missing required production assets (34/34 present and normalized)
- [x] No unexpected duplicate files (34 unique MD5 hashes in `normalized-v1`; the 4 `reserved/*` files are correctly excluded, not duplicated)
- [x] All replacement artwork is the latest corrected version (verified: `product-03`/`-04`, `customer-special-visitor`, `expedition-hub_base`, `fieldworks-bench_active_base` all show different content from the original, pre-correction delivery; every other file is unchanged, exactly matching the stated correction scope)
- [x] Products 01–05 form a coherent base-art set (all 10 files, 1024×1024, consistent canvas convention)
- [x] Product 03 reads as Field Gear — visually confirmed (§1)
- [x] Product 04 reads as Capture Aid / Field Gear — visually confirmed (§1)
- [x] No invented creature remains in Special Visitor, Expedition Hub, or Fieldworks Bench active state — visually confirmed, all 3 (§1)

---

## Final readiness status

**READY FOR PHASE 10 INTEGRATION**

Every technical blocker from the prior intake pass is resolved: all 34
required assets are at their locked target dimensions, every base/shadow
pair shares an identical canvas, the environment floor is genuinely
opaque, the Expedition Hub has real margin for its status badge, and all
5 semantic corrections are visually confirmed correct. The two
open items — the base/shadow alignment assumption for 5 previously-
mismatched pairs (§4), and a one-time visual spot-check of the Hub's
corner margin once it's actually rendered in Pixi (§3) — are
recommendations for a quick look during wiring, not blockers to
starting it.
