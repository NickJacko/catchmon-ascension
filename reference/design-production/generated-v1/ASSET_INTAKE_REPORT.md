# Vertical Slice Generated Art — Production Intake & Validation Report

Status: intake/validation only. No files moved, resized, or edited; no
gameplay/presentation code touched; `reference/design-system/approved-v1/`
untouched; Phase 10 not started. Every technical claim below was measured
directly (PNG header, real pixel/alpha data via Pillow, MD5 across all 34
files) against `reference/design-production/vertical-slice-asset-audit.md`.

**34 files received.** All are valid, non-corrupt PNGs with real image
content. All 34 MD5 hashes are unique — no exact-duplicate files. No file
is fundamentally broken. **Nothing in this delivery is BLOCKED.** Every
issue found is fixable without destroying source content (resize, canvas
pad/crop-to-shared-size, or a naming/mapping confirmation) — see the
per-category tables below for exactly what and where.

## How to read the verdicts

- **PASS** — matches the audit's intent closely enough to integrate;
  any deviation (typically: correct aspect ratio, smaller absolute
  resolution than spec) is cosmetic and does not block wiring, since Pixi/
  DOM rendering scales images to their target footprint regardless of
  source pixel count.
- **FIX** — technically usable, but needs a specific non-destructive
  preprocessing step or an explicit confirmation decision before
  integration (described per file — not performed here, per instruction).
- **BLOCKED** — would need destructive editing (cropping into real
  content, redrawing, discarding unusable art) to become usable. **No
  file in this delivery falls in this category.**

---

## 0. Systemic findings (read this first — it explains most per-file notes)

1. **Every asset preserves its specified aspect ratio; none hit the exact
   specified pixel count.** Station/display/hub/product/material/
   component "1024" square items were delivered at **1254×1254** (still
   exactly 1:1); the "2400×1600" environment layers at **1536×1024**
   (still exactly 3:2); the "1024×1280" customers at **1122×1402** (still
   exactly 4:5, matching 1024/1280 = 0.8 precisely). This is the
   **lowest-risk possible deviation** — a uniform scale, not a crop or
   distortion — and does not block integration on its own anywhere in
   this delivery.
2. **A real, recurring canvas-shape split: several "square" items were
   actually delivered on the wide 1536×1024 (3:2) canvas instead of the
   1254×1254 (1:1) square canvas every sibling file in the same category
   uses.** This shows up in two forms, and they are not equally serious:
   - **Cross-pair mismatch (higher priority to fix):** `special-
     component-01`, `routine-material-01`, `routine-material-02`, and
     `product-05` each have a **square base but a wide shadow** — the
     base and its own shadow are on different canvases. `fieldworks-
     bench` has a **square idle pair but a wide active pair** — the same
     station's two states are on different canvases. Either case means
     the base/shadow (or idle/active) art cannot share one direct pivot/
     scale transform without first reconciling the canvases.
   - **Internally-consistent but off-convention (lower priority):**
     `display-furniture` (base+shadow) and `expedition-hub` (base+
     shadow) are each wide 3:2, but *consistently* wide across their own
     pair — a producer/Designer call on whether to accept the wide
     canvas as the real convention for these two items or request a
     square re-export, not a pair-compatibility defect.
3. **No baked-black backgrounds found anywhere.** Every asset expected to
   be transparent shows genuine `alpha = 0` at its borders/corners (not
   `alpha = 255` with near-black RGB, which is the actual failure
   pattern this check exists to catch). This is a clean pass across all
   32 alpha-bearing files.
4. **One real opacity spec violation:** the environment **floor** layer
   was specified as opaque but was delivered as `RGBA` with a soft
   vignette — alpha never reaches 0 *or* 255 anywhere in the image
   (ranges 1–252, opaque-ish center fading to near-transparent edges).
   The **wall** layer is correctly fully opaque (`RGB`, no alpha channel
   at all). See §1.
5. **Margins are tight almost everywhere** (content commonly fills
   90–100% of the canvas on at least one axis) against this audit's
   "generous"/"~15%"/"~10%" safe-margin recommendations. Fewer than half
   the assets in this delivery have what the criteria would call a real
   safe margin. This is only escalated to **FIX** where a specific
   code-drawn overlay would sit inside the same texture's own bounds
   (the Expedition Hub's corner status badge); the Provision/Fieldworks
   station progress ring is drawn as a *separate* Graphics arc outside
   the sprite's radius in `StationEntity.ts`, so station-art tightness
   does not collide with it — noted as informational there, not FIX.
6. **This batch covers Wave 1 + Wave 2 only, correctly.** No Region
   Background, Route Card, or Momentum Icon files are present — consistent
   with Regions being held per producer decision and Routes/Momentum Icon
   belonging to the not-yet-produced Wave 3. This is compliance, not a gap.
7. **One real missing-or-unconfirmed deliverable:** the audit's Customer
   entries called for base+shadow (by extrapolation from every other
   spatial asset, not a hard requirement in the approved brief itself);
   only one combined file per customer archetype was delivered. Cannot
   tell from pixel data alone whether a ground shadow is baked into the
   single image or simply omitted — flagged for visual confirmation, not
   treated as BLOCKED.

---

## 1. Environments

| File | Verdict | Actual size / ratio | Alpha / transparency | Notes |
|---|---|---|---|---|
| `environments/shop-environment_wall_2400x1600.png` | **FIX** | 1536×1024, 3:2 ✓ (spec 2400×1600, same ratio) | `RGB`, no alpha channel — correctly fully opaque | Canvas-compatible with the floor layer (identical 1536×1024). Below target resolution; a straight upscale (no crop) closes the gap. |
| `environments/shop-environment_floor_2400x1600.png` | **FIX** | 1536×1024, 3:2 ✓ (matches wall) | `RGBA`, alpha range **1–252** — never fully opaque, never fully transparent (soft vignette, opaque-ish center fading toward the edges) | **Opacity spec violation** — this layer was specified opaque. Needs a decision: is the edge fade an intentional soft blend into the wall layer (fine to keep, but should be confirmed deliberate), or should it be re-baked fully opaque before the two layers are treated as flat full-bleed rectangles per `ShopSceneRenderer.drawEnvironment()`'s current 42%/58% band split? |
| `environments/shop-key-environment_golden-sample_2048x1536.png` | **PASS** | 1448×1086, 4:3 ✓ (spec 2048×1536, same ratio) | `RGB`, no alpha — fully opaque | Style-lock reference only, never integrated into the running scene — resolution shortfall is inconsequential here. |

**AssetId mapping:** `env-shop-key` → wall + floor (production master, two
layers); the golden-sample file is a separate, non-integrated style
reference (no AssetId consumption path needed).

**Integration note (not a defect):** both layers are full-canvas, edge-
to-edge opaque/near-opaque images, not pre-cropped to their intended
vertical band (42% wall / 58% floor per the current renderer split).
Compositing them as two literal full-canvas layers would have the floor
layer's opaque lower two-thirds sit *over* the wall layer entirely (not
just its own band) unless the floor is either cropped to its band before
use or the renderer clips/positions it to only its band. This is a
Phase 10 integration-approach decision, not something to fix in the
source files.

---

## 2. Stations

| File | Verdict | Actual size / ratio | Alpha | Pair compatibility | Notes |
|---|---|---|---|---|---|
| `provision-station_idle_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean, alpha=0 at borders | matches all 3 siblings below | content fills ~99%/~99% of frame (tight but not edge-exact) |
| `provision-station_idle_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | — |
| `provision-station_active_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | content touches the vertical edge (99.9%) — no functional issue, the progress ring is drawn externally by `StationEntity.ts`, not composited into this texture |
| `provision-station_active_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | content touches the vertical edge exactly (100%) — same non-issue as above |
| `fieldworks-bench_idle_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | matches its own shadow | — |
| `fieldworks-bench_idle_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | — |
| `fieldworks-bench_active_base_1024.png` | **FIX** | **1536×1024, 3:2** ✗ (spec 1:1) | clean | **mismatched vs its own idle sibling** (1254×1254) and vs its own active-shadow's canvas *shape family* | Needs canvas reconciliation (pad to the same 1254×1254 square, no cropping) before an idle↔active texture swap won't visibly jump/rescale the sprite |
| `fieldworks-bench_active_shadow_1024.png` | **FIX** | **1536×1024, 3:2** ✗ | clean | matches its own active-base (both wide) but not the idle pair | Same reconciliation as above |

**AssetId mapping:** `station-provision-station` (idle+active, base+
shadow, all 4 files — internally fully consistent, no reconciliation
needed); `station-fieldworks-bench` (idle+active, base+shadow, all 4
files — idle pair square, active pair wide, reconciliation needed before
integration).

Provision Station is the cleaner of the two stations technically: all 4
files share one canvas convention. Fieldworks Bench's idle/active canvas
split is the single most integration-relevant issue in this whole
delivery for the Stations category.

---

## 3. Displays

| File | Verdict | Actual size / ratio | Alpha | Pair compatibility | Notes |
|---|---|---|---|---|---|
| `display-furniture_base_1024.png` | **FIX** | 1536×1024, 3:2 (spec 1:1) | clean | matches its own shadow (both 1536×1024) | Internally consistent pair, but off the documented square convention — Designer/producer call: accept wide as the real Display Furniture format (plausible for shelf-shaped furniture) or request a square re-export |
| `display-furniture_shadow_1024.png` | **FIX** | 1536×1024, 3:2 | clean | ✓ | same as above |

**AssetId mapping:** `display-slot-furniture` (base+shadow, both files).

---

## 4. Infrastructure / Expedition Hub

| File | Verdict | Actual size / ratio | Alpha | Pair compatibility | Notes |
|---|---|---|---|---|---|
| `expedition-hub_base_1024.png` | **FIX** | 1536×1024, 3:2 (spec 1:1) | clean (a few near-zero-alpha border pixels carry stray low RGB values, e.g. `(14,11,0,0)` — harmless since alpha=0 makes them invisible regardless) | matches its own shadow | Content reaches the frame edge on one axis (100%) — **this is the one margin issue this audit escalates to FIX**, because `ExpeditionHubEntity.ts` draws its "unviewed result"/"active expedition" status badge as a small circle *inside* the same 80×80 local coordinate space, in the corner — edge-to-edge hub art gives that badge nothing to sit on but the art itself, risking visual collision. |
| `expedition-hub_shadow_1024.png` | **FIX** | 1536×1024, 3:2 | clean | ✓ | content fills **100% × 100%** of the frame — zero margin at all |

**AssetId mapping:** `infrastructure-expedition-hub` (base+shadow, both
files).

---

## 5. Products

| File | Verdict | Actual size / ratio | Alpha | Pair compatibility | Notes |
|---|---|---|---|---|---|
| `product-01_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | matches shadow | — |
| `product-01_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | — |
| `product-02_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | matches shadow | — |
| `product-02_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | — |
| `product-03_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | matches shadow | — |
| `product-03_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | — |
| `product-04_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | matches shadow | — |
| `product-04_shadow_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | ✓ | — |
| `product-05_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | **mismatched vs its own shadow** | Base matches the shared product-art grammar (same square canvas as 01–04); the mismatch is entirely on the shadow side |
| `product-05_shadow_1024.png` | **FIX** | **1536×1024, 3:2** ✗ | clean | mismatched vs its own base and vs every other product's shadow (all square) | The only product-family shadow off the shared square canvas — needs reconciliation to 1254×1254 before it can share Product 05's pivot with its base |

**AssetId mapping:** `product-slice-product-01` … `-05` (base+shadow
each). Products 01–04 are the cleanest category in the entire delivery —
all 8 files share one canvas convention with zero cross-pair issues.

---

## 6. Routine materials

| File | Verdict | Actual size / ratio | Alpha | Pair compatibility | Notes |
|---|---|---|---|---|---|
| `routine-material-01_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | mismatched vs its own shadow | — |
| `routine-material-01_shadow_1024.png` | **FIX** | **1536×1024, 3:2** ✗ | clean | mismatched vs its own base | Reconciliation needed |
| `routine-material-02_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | mismatched vs its own shadow | — |
| `routine-material-02_shadow_1024.png` | **FIX** | **1536×1024, 3:2** ✗ | clean | mismatched vs its own base | Reconciliation needed |

**AssetId mapping — ⚠ needs confirmation, not determinable from pixel
data:** the audit proposes `material-slice-resource-a` /
`material-slice-resource-b` for the slice's two routine materials
(`SLICE_RESOURCE_A_ID` feeds Provision Station recipes 01/02;
`SLICE_RESOURCE_B_ID` feeds Fieldworks Bench recipes 03/04/05). This
report assumes `routine-material-01` → Resource A and `-02` → Resource B
purely by filename ordinal position — **this is a guess, not a verified
mapping.** Confirm which physical material each file actually depicts
before wiring; getting this backwards would put the wrong icon on the
wrong recipe's ingredient list.

---

## 7. Special components

| File | Verdict | Actual size / ratio | Alpha | Pair compatibility | Notes |
|---|---|---|---|---|---|
| `special-component-01_base_1024.png` | **PASS** | 1254×1254, 1:1 ✓ | clean | mismatched vs its own shadow | — |
| `special-component-01_shadow_1024.png` | **FIX** | **1536×1024, 3:2** ✗ | clean | mismatched vs its own base | Reconciliation needed |

**AssetId mapping:** `component-slice-component-a` — unambiguous, only
one component exists in the slice (the `-01` suffix doesn't imply a
second one is missing).

---

## 8. Customers

| File | Verdict | Actual size / ratio | Alpha | Notes |
|---|---|---|---|---|
| `customer-everyday-buyer_1024x1280.png` | **FIX** | 1122×1402, ratio 0.800 ✓ (spec 1024×1280 = 0.800, exact match) | clean, no baked-black | Content fills 98.8%×98.9% of frame — well short of "safe transparent margin." No separate shadow file. |
| `customer-explorer-buyer_1024x1280.png` | **FIX** | 1122×1402, ratio 0.800 ✓ | clean | Content fills 98.0%×**100%** — zero margin on the vertical axis. No separate shadow file. |
| `customer-special-visitor_1024x1280.png` | **FIX** | 1122×1402, ratio 0.800 ✓ | clean | Content fills 95.7%×99.3%. No separate shadow file. |

**AssetId mapping:** `customer-portrait-everyday-buyer` /
`-explorer-buyer` / `-special-visitor` — filename-to-archetype mapping is
unambiguous (exact name match, no ordinal guessing needed, unlike §6).

**Open question (not BLOCKED):** no `_shadow` file exists for any
customer. Cannot determine from alpha/pixel data alone whether a ground
shadow is already baked into the single delivered image or was simply
not produced — recommend a quick visual check (does a soft shadow shape
extend beyond the character's feet at the bottom of the frame?) before
deciding whether a follow-up shadow-layer request is needed.

---

## 9. Missing assets relative to this delivery's own scope

Nothing required for **Wave 1 + Wave 2** (per the audit's producer-decision
pass) is absent except the customer shadow-layer question above. Region
Backgrounds (held) and Route Cards / Momentum Icon (Wave 3, not yet
produced) are correctly not present — not a gap.

---

## 10. Preprocessing catalogue (described only — nothing performed)

| Preprocessing type | Applies to | What it would do |
|---|---|---|
| **Uniform upscale, no crop** | All 3 environment files, all "1024" square-family files at 1254×1254, all 3 customer files | Scale to the exact spec resolution (2400×1600 / 1024×1024 / 1024×1280). Purely cosmetic-for-spec-compliance — Pixi/DOM rendering already scales these correctly today regardless. |
| **Canvas reconciliation (pad to shared square, no cropping)** | `fieldworks-bench_active_*` (vs its idle pair), `special-component-01_shadow`, `routine-material-01_shadow`, `routine-material-02_shadow`, `product-05_shadow` (each vs its own base) | Pad the wide 1536×1024 file onto a 1254×1254 (or spec 1024×1024) canvas, centered, so it shares one pivot/scale transform with its square sibling. |
| **Canvas-convention decision (no file change required either way)** | `display-furniture_*`, `expedition-hub_*` | Producer/Designer decides: accept the wide 3:2 canvas as these two items' real convention, or request a square re-export. Either choice is valid; this report does not decide it. |
| **Opacity flattening or confirmation** | `shop-environment_floor` | Either confirm the vignette alpha is an intentional soft blend (no change needed) or re-bake fully opaque to match the "opaque" spec and the wall layer's own treatment. |
| **Filename/content confirmation** | `routine-material-01` / `-02` | Confirm which file is Resource A vs Resource B by inspecting actual content, not ordinal position. |
| **Visual confirmation only** | `customer-*` | Confirm whether a ground shadow is baked into the single delivered image. |

None of the above have been performed. All are non-destructive (no
content is cropped away or discarded in any of them).

---

## Final readiness status

**FIXES REQUIRED BEFORE PHASE 10**

Not because anything is broken beyond use — nothing in this delivery is
BLOCKED, and Products 01–04 plus both Provision Station states are fully
clean and could be wired today with only an optional cosmetic resize.
But 5 files have a genuine cross-pair canvas mismatch that would visibly
break a clean base/shadow or idle/active pivot if wired as-is
(`fieldworks-bench_active_*`, `special-component-01_shadow`,
`routine-material-01_shadow`, `routine-material-02_shadow`,
`product-05_shadow`), the environment floor layer violates its own
opacity spec, the Expedition Hub's edge-to-edge art conflicts with its
own corner-badge overlay, and two confirmations (routine-material
ordinal mapping, customer shadow presence) should happen before code
starts consuming filenames as fact. None of this requires new art
generation or destructive editing — every item above is a describable,
non-destructive preprocessing or confirmation step, listed in §10, ready
to execute once approved.
