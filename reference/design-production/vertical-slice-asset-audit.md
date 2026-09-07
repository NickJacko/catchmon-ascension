# Vertical Slice — Code-Derived Asset Production Audit

Status: audit only. No artwork generated, no gameplay/system code changed,
`reference/design-system/approved-v1/` untouched. This is the handoff
manifest for Claude Designer / image production, derived exclusively from
what Phases 0–9 actually implement — not from what any design document
merely *describes*.

## Method

Every entry below was verified against real source: a registered
`AssetId`/`AssetMetadata`, a domain type's actual field list, or an actual
render call site in `src/presentation/`. Where content/type exists but no
render call site consumes it, that gap is stated explicitly rather than
silently treated as "required." Camera/material/naming guidance is taken
from the one approved production contract that already exists —
`reference/design-system/approved-v1/guidelines/source-art-brief.md`
("Golden Samples" §, Wave 1/2/3) — read, never edited.

Two important code-wide findings that shape almost every entry below:

1. **Only Catchmon portraits have a complete asset pipeline today.**
   `resolveAssetImageUrl()` is called from exactly 7 sites in
   `src/presentation/`, and every one of them resolves a Catchmon
   `portraitAssetId`. Products, materials, components, customers, regions,
   and routes all have a `visualAssetId`/`portraitAssetId`/
   `visualEnvironmentId` *field* in their domain type (except Region, which
   has none), but **no component or Pixi entity ever reads it** — art
   dropped in today would have no code path displaying it without a small
   follow-up wiring change.
2. **Stations, Displays, and the Expedition Hub have no `AssetId` field at
   all yet** (`StationState`, `DisplaySlotState`, `InfrastructureDefinition`
   — confirmed by direct type inspection). Phase 9's Pixi entities for
   these are hand-drawn `Graphics` shapes with zero asset hook. Wiring real
   art here needs both new art **and** a small domain-type/entity change,
   not just a file drop.

---

## 1. Shop environment / room shell

### `env-shop-key` (PROPOSED)
- **Category:** environment
- **Use:** the Pixi Living Shop's background/floor/zone backdrop — the one thing rendered behind every other scene entity.
- **Implementation:** `presentation/scene/ShopSceneRenderer.ts` (`drawEnvironment()`), scene layers `background`/`floor`/`zones` (`scene-layout.ts`'s `SCENE_LAYER_ORDER`).
- **Current state:** placeholder Graphics — two flat-color rectangles (wall band, floor band) + two translucent rounded-rect zone outlines (station zone, display zone). No image asset exists or is referenced.
- **Priority:** P0 — this is the base of the entire living shop; Rule 6 requires shop zones to be represented.
- **Target presentation:** Pixi scene only.
- **Camera/perspective:** elevated 3/4 soft-isometric diorama (Document 12; brief's "Shop Key Environment... 3/4 elevated").
- **Target dimensions/aspect ratio — PRODUCER DECISION (resolved):** two distinct deliverables, not one:
  1. **Style-lock Golden Sample** — the brief's original 2048×1536 (4:3), opaque, "Shop Key Environment + one Catchmon" sample. This stays exactly as the brief specifies; its job is style validation only, and it is **not** what gets integrated into the Pixi scene.
  2. **Production master (the actual playable modular environment)** — **2400×1600, opaque, 3:2** — matches the Phase 9 logical scene ratio (`scene-layout.ts`'s 1200×800 is exactly 3:2) at 2× for a crisp downscale, per the producer's explicit instruction not to change the Phase 9 logical scene space to fit the older Golden Sample format.
- **Transparent vs opaque:** opaque (full-bleed background), both deliverables.
- **Pivot/origin/footprint:** full-frame; no pivot. The production master must be authored as separate layers (background wall / floor), not one flattened illustration, so the existing two-layer Pixi structure can consume it directly ("modular composition" requirement) — this applies to the 2400×1600 production master, not the single-frame style-lock sample.
- **Safe margin:** the two zone rectangles (station zone: logical x180–560,y380–560; display zone: x700–1160,y280–460) must stay visually uncluttered — matches the brief's own "Foreground floor stays clear for UI" note. At the 2400×1600 production scale, that's a 2× multiple of the same logical coordinates.
- **Required states/variants:** none (static); a later `EXPANDED` macro-stage variant is *code-composed* today (a gold trim banner drawn by `ShopSceneRenderer`), not a separate art asset — keep it that way unless Designer wants a richer "shop upgraded" backdrop later (P2).
- **Layers:** base only.
- **Animation:** none.
- **Golden Sample:** Wave 1 (both the style-lock sample and the production master belong to Wave 1 — see Summary).
- **Reusable across states:** n/a — one environment.
- **Notes:** deliver the production master as separate background/floor PNGs matching the two existing Pixi layers so no renderer code changes are needed beyond the texture swap. The style-lock sample is a one-off validation image, not integrated into any layer.

---

## 2. Stations

### `station-provision-station` (PROPOSED)
- **Category:** station
- **Use:** Provision Station — one of the slice's 2 crafting stations.
- **Implementation:** `presentation/scene/entities/StationEntity.ts` (Pixi); `presentation/sheets/StationSheet.tsx` (DOM — text/list only, no station art rendered there today).
- **Current state:** placeholder Graphics — a flat rounded rect, color swaps between idle (`--surface-card`) and crafting (`--cs-soft-gold`); a code-drawn progress arc during crafting; a code-drawn queue-count dot. No image asset, no `AssetId` field exists on `StationState` to hang one from yet.
- **Priority:** P0.
- **Target presentation:** Pixi scene (the DOM sheet is text/list-based by design and doesn't need station art).
- **Camera/perspective:** 3/4 elevated, matching the shop diorama.
- **Target dimensions/aspect ratio:** 1024² (brief's own spec for this exact Wave 1 sample).
- **Transparent vs opaque:** transparent production canvas (alpha) — composites onto the environment. **PRODUCER DECISION.**
- **Pivot/origin/footprint — PRODUCER DECISION (resolved):** canonical pivot = **center of the object's actual floor footprint**, using the shared approved elevated 3/4 camera. This supersedes the current Pixi placeholder's top-left-anchored `Graphics` box (96×96 logical, top-left) — that is a renderer implementation detail, not the art pivot. The pivot/footprint must be represented as **explicit asset metadata** at Phase 10 integration time (a real field, once `AssetMetadata` gains one — it has none today) rather than inferred from where the transparent padding happens to sit in the image.
- **Safe margin:** ~15% padding beyond the 1024² frame recommended so the code-drawn progress ring (which currently draws ~10 logical px outside the sprite bounds) doesn't visually clip the art.
- **Required states/variants:** IDLE, ACTIVE (crafting) — matches `StationEntity`'s boolean exactly. Queue-count is a small code-drawn badge, not a baked-in art variant.
- **Layers:** base + ground-shadow (separate layer). **PRODUCER DECISION** — supersedes this audit's earlier note that stations get no shadow; deliver the shadow as its own layer, not baked into the base.
- **Animation:** state swap (idle↔active texture/frame). The progress ring itself is code-driven (a Pixi `Graphics.arc()`), not art.
- **Golden Sample:** Wave 1.
- **Reusable across states:** no — Provision Station and Fieldworks Bench are visually distinct per the brief.
- **Notes:** integrating this needs a small code change (swap `StationEntity`'s `Graphics` fill for a `Sprite`, and consume the new pivot/footprint metadata field once it exists), not just an art drop.

### `station-fieldworks-bench` (PROPOSED)
- Identical structure to the above; the slice's second station.
- **Priority:** P0 (both stations are core to the 2-station vertical slice, CLAUDE.md §33).
- **Golden Sample:** Wave 2.
- All other fields identical to `station-provision-station`.

---

## 3. Displays

### `display-slot-furniture` (PROPOSED)
- **Category:** display
- **Use:** the shelf/furniture rendering for a Display Slot — 3 in the slice, visually identical furniture (only stock/lock state differs).
- **Implementation:** `presentation/scene/entities/DisplayEntity.ts` (Pixi); `presentation/components/Slot.tsx` (DOM — also placeholder-only, no image today).
- **Current state:** placeholder Graphics — a two-tone rounded rect (outer "slot," inner "slot-inner"), dimmed + non-interactive when locked, a small gold dot when stocked. `DisplaySlotState` has no `AssetId` field.
- **Priority:** P0.
- **Target presentation:** both (Pixi `DisplayEntity` and the DOM `Slot`/`ProductCard` components could share one furniture asset).
- **Camera/perspective:** 3/4 elevated.
- **Target dimensions/aspect ratio:** current Pixi footprint is 88×72 (roughly 11:9); recommend a square 1024² master matching the Product convention and letting the renderer scale/crop, consistent with how Catchmon portraits are already handled.
- **Transparent vs opaque:** transparent production canvas. **PRODUCER DECISION.**
- **Pivot/origin/footprint — PRODUCER DECISION (resolved):** canonical pivot = **center of the object's actual floor footprint**, shared approved elevated 3/4 camera — supersedes the current Pixi placeholder's top-left origin (88×72 logical), which is a renderer detail, not the art pivot. Represent the pivot/footprint as explicit asset metadata at Phase 10 integration, not inferred from transparent padding.
- **Safe margin:** interior "slot" area must stay clear for the code-composited product icon on top (a separate asset, see §5) — do not bake a product into this art.
- **Required states/variants:** one base furniture asset is sufficient — empty/stocked/locked are all handled by code today (dot overlay, alpha/tint) and should stay that way (avoid duplicate art per the "tinting/overlays sufficient" rule).
- **Layers:** base + ground-shadow (separate layer). **PRODUCER DECISION.**
- **Animation:** none.
- **Golden Sample:** Wave 2 ("Display Furniture").
- **Reusable across states:** yes — one asset for all 3 display slots (identical furniture; only content/lock state differs, already code-driven).
- **Notes:** locked-state treatment (dim/desaturate) is already implemented purely via alpha in code — do not request a separate "locked" painting.

---

## 4. Infrastructure / Expedition Hub

### `infrastructure-expedition-hub` (PROPOSED)
- **Category:** infrastructure
- **Use:** the Expedition Hub building/badge — gates the entire World/Expedition loop.
- **Implementation:** `presentation/scene/entities/ExpeditionHubEntity.ts` (Pixi); `presentation/screens/ShopScreen.tsx`'s Expedition Hub `Panel` (DOM — text/`StatusPill` only, no art).
- **Current state:** placeholder Graphics — one flat rounded rect, 4 states told apart purely by fill color (gray/gold/amber/green) plus a small corner badge dot for "unviewed result"/"active expedition." `InfrastructureDefinition` has no `AssetId` field.
- **Priority:** P0 (the single gate to the entire World loop; must be visually legible).
- **Target presentation:** Pixi scene now; the DOM panel is a reasonable P2 follow-up.
- **Camera/perspective:** 3/4 elevated, matching station/hub scale in the same diorama.
- **Target dimensions/aspect ratio:** 1024² (matching the station convention); current Pixi footprint is an 80×80 logical box, top-left origin.
- **Transparent vs opaque:** transparent production canvas. **PRODUCER DECISION.**
- **Pivot/origin/footprint — PRODUCER DECISION (resolved):** canonical pivot = **center of the object's actual floor footprint**, shared approved elevated 3/4 camera — supersedes the current Pixi placeholder's top-left origin (80×80 logical). Represent as explicit asset metadata at Phase 10 integration, not inferred from transparent padding.
- **Safe margin:** ~10% for the corner status badge, which is code-drawn and must remain legible over the art.
- **Required states/variants:** LOCKED / AVAILABLE / UNDER_CONSTRUCTION / OWNED (4, exact enum in `SceneExpeditionHubView`). Recommend **one base building asset** with state communicated by a code-driven tint/glow/overlay (dim for locked, gold glow for available, a scaffolding overlay for under-construction, a small banner for owned) rather than 4 separate paintings, per the "avoid duplicate assets where tinting/overlays suffice" rule.
- **Layers:** base + ground-shadow (separate layer, **PRODUCER DECISION**) + glow (the "available"/"owned" states are exactly the glow use case the approved style bible calls out: "active selection, masterwork, discovery, capture... nowhere else").
- **Animation:** state swap; construction could later get a code-driven particle/progress indicator rather than new art (P2).
- **Golden Sample:** **Wave 2, placed explicitly after Display Furniture.** **PRODUCER DECISION** — supersedes this audit's earlier "not covered by any existing Wave, recommend Wave 3" note. The brief's own Wave 1/2/3 list never named an Expedition Hub asset; the producer has now placed it.
- **Reusable across states:** yes, via the tint/overlay approach above.
- **Notes:** the second infrastructure item, Display Expansion, needs **no separate asset** — it only unlocks the 3rd Display Slot, which reuses `display-slot-furniture`.

---

## 5. Products

All 5 real products (`SLICE_PRODUCT_01`–`05`) currently point at one shared
placeholder (`SLICE_PLACEHOLDER_ITEM_ASSET_ID`, 128×128, `PLACEHOLDER`
status). `ProductCard.tsx`'s `art` prop is wired but never populated in
production code, and Pixi's `DisplayEntity` doesn't render a product icon
at all (only a generic stock dot) — **product art has no live consumer
in the Pixi scene yet**, only a ready-but-unused prop in the DOM component.

### `product-slice-product-01` … `product-slice-product-05` (PROPOSED, 5 assets)
- **Category:** product
- **Use:** the 5 real slice products — "Slice Provisions A (Turnover)," "...B (Higher Value)," "Slice Field Gear A (Balanced)," "...B (Dual-Use / Capture Aid)," "Slice Elemental Craft A (Special-Component Conversion)."
- **Implementation:** `presentation/components/ProductCard.tsx` (`art` prop, DOM); `DisplaySheet.tsx`/`ShopScreen.tsx`/`StationSheet.tsx` render `ProductCard` without `art` today.
- **Current state:** shared placeholder UI (a recessed empty-slot box, `.ds-product-card__art-placeholder`) — functionally fine, visually generic across all 5.
- **Priority:** P0 for `-01`..`-04` (used by the guaranteed fresh-save craft→sell loop and both Everyday Orders); **P1** for `-05` (gated behind the Special Component, which has no acquisition path in the current guaranteed loop — see the Phase 8 fresh-save fix report).
- **Target presentation:** React DOM now (`ProductCard`); Pixi `DisplayEntity` would need a new render call to show it (currently doesn't).
- **Camera/perspective:** shared 3/4 angle (brief's "Products" category modifier).
- **Target dimensions/aspect ratio:** 1024², square.
- **Transparent vs opaque:** transparent, generous safe margin, single centered object.
- **Pivot/origin/footprint:** centered; optional separate soft ground shadow layer per the brief.
- **Safe margin:** generous, per brief.
- **Required states/variants:** none live in code today — `QualityGrade` (`FINE`/`MASTERWORK`) exists in the type system but nothing in the current slice ever produces non-`STANDARD` output (see §14). One STANDARD-quality art per product is sufficient. **PRODUCER DECISION:** if quality rolling is ever implemented, FINE/MASTERWORK should be realized as **overlays/treatments on the base art** (e.g. a shared shine/frame/particle layer), not duplicate full paintings per tier — unless actual code later requires otherwise.
- **Layers:** base + shadow.
- **Animation:** none.
- **Golden Sample — PRODUCER DECISION (resolved):** **Products 01–04 are Wave 1 because they are P0; Product 05 is Wave 2 because it is P1.** This supersedes this audit's earlier Standard/Premium tier inference — Wave assignment is now purely priority-based, per the explicit instruction not to infer product tiers. All 5 products use **one shared product-art grammar** (same 3/4 angle, same lighting/outline recipe, same base/shadow layer structure) regardless of Wave — Wave number reflects production sequencing, not a visual tier.
- **Reusable across states:** each product needs its own distinct art; no reuse between the 5.
- **Notes:** Product `-04` doubles as the expedition Capture Aid item (`playerUse: "expedition-preparation"`) — its art should read clearly as a piece of field gear, not just another provision.

---

## 6. Routine materials

### `material-slice-resource-a`, `material-slice-resource-b` (PROPOSED, 2 assets)
- **Category:** material
- **Use:** "Slice Routine Material A" (consumed by Provision Station recipes 01/02) and "...B" (consumed by Fieldworks Bench recipes 03/04/05).
- **Implementation:** none render it — `presentation/sheets/InventorySheet.tsx` lists materials as **plain text rows with quantities, no icon at all**, not even the shared placeholder image.
- **Current state:** completely missing from any visual — the registered placeholder `AssetMetadata` exists in content but is not rendered anywhere.
- **Priority:** P1 — the slice is fully playable via text today; icons are a real but non-blocking clarity improvement.
- **Target presentation:** React DOM (`InventorySheet`, `StationSheet`'s recipe list).
- **Camera/perspective:** single clear object, natural color code (brief's "Materials & components" category modifier).
- **Target dimensions/aspect ratio:** recommend 512² (smaller than products, per Document 14 §192's responsive-variant guidance — not currently implemented in code, but a reasonable target size for a material icon).
- **Transparent vs opaque:** transparent.
- **Pivot/origin/footprint:** centered.
- **Safe margin:** moderate.
- **Required states/variants:** none.
- **Layers:** base only.
- **Animation:** none.
- **Golden Sample:** Wave 2 ("Routine Material" — the brief itself notes "creature artwork stands in" for this Golden Sample, i.e. even the approved kit doesn't have bespoke material art yet).
- **Reusable across states:** each material needs distinct art (2 total).
- **Notes:** rendering these in `InventorySheet` requires a small code addition (an `art`-capable row), not just an asset drop.

---

## 7. Special components

### `component-slice-component-a` (PROPOSED)
- **Category:** component
- **Use:** "Slice Special Component A," the one input Recipe 05 (Elemental Craft A) needs beyond routine material.
- **Implementation:** same as materials — `InventorySheet.tsx` text row only, no icon.
- **Current state:** completely missing visually.
- **Priority:** P1 — Recipe 05 is not on the guaranteed fresh-save critical path (see §5), so this is lower urgency than the P0 items, but real (Component Hunt route's bonus reward references it).
- **Target presentation:** React DOM.
- **Camera/perspective:** single clear object; element hint only if a real element is ever assigned (none is today — see §10/§14 notes on unresolved element data).
- **Target dimensions/aspect ratio:** 512², transparent.
- **Required states/variants:** none.
- **Layers:** base + a subtle glow accent (brief: components may carry "element hint... glow" more than routine materials, to read as rarer).
- **Animation:** none.
- **Golden Sample:** Wave 2 ("Special Component").
- **Reusable across states:** n/a — one component.

---

## 8. Customers

Three archetypes are registered (`SLICE_CUSTOMER_ARCHETYPES`), all sharing
one placeholder portrait. **No component or Pixi entity ever renders a
customer image** — `CustomerSheet.tsx` is text-only, and
`presentation/scene/entities/CustomerEntity.ts` draws a plain colored
circle token (not even the shared placeholder image is used there).

### `customer-portrait-everyday-buyer` (PROPOSED)
- **Category:** customer-portrait
- **Use:** "Everyday Buyer" (Walk-In layer) — the most common customer archetype (preferred family: PROVISIONS).
- **Implementation:** none currently render it (`CustomerSheet.tsx` text-only; `CustomerEntity.ts` uses a color token, not an image).
- **Current state:** completely missing from any rendering; content-level placeholder exists but unused.
- **Priority:** P0 — this is the archetype every fresh-save playthrough meets first and most often.
- **Target presentation:** both (DOM `CustomerSheet` header, Pixi `CustomerEntity` token).
- **Camera/perspective:** stylized humanoid, shared 3/4 character angle (brief's "Customers" modifier — slightly larger head/hands, reduced facial detail, cozy-adventure clothing, silhouette quieter than any Catchmon).
- **Target dimensions/aspect ratio — PRODUCER DECISION (resolved):** **1024×1280, transparent, full body.** Supersedes this audit's earlier "1024² alpha, bust or full-figure, Designer's call" proposal.
- **Transparent vs opaque:** transparent, with a safe transparent margin around the full figure.
- **Pivot/origin/footprint — PRODUCER DECISION (resolved):** full body, **common ground/foot baseline** as the pivot (all 3 customer archetypes share the same baseline so they compose consistently at different queue positions) — supersedes the earlier "centered bust/full-figure, Designer's call" note.
- **Safe margin:** safe transparent margin around the full figure, per producer decision (generous enough that the character isn't cropped at any reasonable Pixi/DOM scale-down).
- **Required states/variants:** `CustomerEntity` already differentiates `AWAITING_DECISION`/`LEAVING`/other purely by token color — one base portrait is enough; do not request per-status art.
- **Layers:** base + shadow.
- **Animation:** none required now (idle bob is already code-driven, applies to any art dropped in).
- **Golden Sample:** Wave 2 ("Customer").
- **Reusable across states:** yes — across all customer-status states, **and explicitly reusable in both React DOM and the Pixi scene** (one asset, one pivot/baseline convention, per producer decision).

### `customer-portrait-explorer-buyer` (PROPOSED)
- Identical structure; "Explorer Buyer" (Focused layer, prefers FIELD_GEAR/CAPTURE_AND_DISCOVERY_GEAR).
- **Priority:** P1 (real, reachable archetype, but secondary to Everyday Buyer in arrival frequency).

### `customer-portrait-special-visitor` (PROPOSED)
- Identical structure; "Special Visitor (Placeholder)" — prefers ELEMENTAL_CRAFT.
- **Priority:** P1 — it is a real, spawnable archetype (included in the same arrival pool as the other two), but its own content ID/`displayName` already self-identify it as provisional ("Placeholder"), so treat its art as lower-confidence pending a real design decision, not P0.
- **Notes:** do not let this archetype's "Placeholder" naming be mistaken for "no art needed" — it does arrive in real gameplay via the same RNG pool as the other two.

---

## 9. Catchmons

**12 species already have FINAL, real, approved art — identify as EXISTING,
do not recreate:**

| Species (existing AssetId `catchmon-portrait-<name>`) | Source folder | Role in slice |
|---|---|---|
| Flamarox | `reference/catchmons/Starter/` | Selected roster (WORKSHOP) |
| Emberynn | `reference/catchmons/Common/` | Selected roster (SHOP_FLOOR) |
| Aquilor | `reference/catchmons/Starter/` | Selected roster (EXPEDITION) |
| Hydroscythe | `reference/catchmons/Common/` | Selected roster (SUPPLY) |
| Geckon | `reference/catchmons/Starter/` | Selected roster (WORKSHOP) |
| Aerorion | `reference/catchmons/Rare/` | Selected roster (SHOP_FLOOR, starts unassigned) |
| Flameron | `reference/catchmons/Starter/` | Evolution target of Flamarox |
| Pyrocore | `reference/catchmons/Common/` | Evolution target of Emberynn |
| Hydravian | `reference/catchmons/Starter/` | Evolution target of Aquilor |
| Reptorax | `reference/catchmons/Starter/` | Evolution target of Geckon (stage 1) |
| Dracogold | `reference/catchmons/Starter/` | Evolution target of Geckon (stage 2, terminal) |
| Aquaril | `reference/catchmons/Common/` | Discovery Survey wild-encounter line |

All 12 are `status: "FINAL"`, 1024×1024 PNG, alpha, already registered in
`VERTICAL_SLICE_CATALOG_CONTENT.assets`. **No production action needed.**
This is the one category where the full `AssetId → resolveAssetImageUrl →
Sprite/img` pipeline is already wired end-to-end (7 real call sites across
`CatchmonsScreen`, `CatchmonDetailSheet`, `EncounterSheet`, `EvolutionSheet`,
and `scene-view-model.ts`). Do not mass-list the other 92 canonical
Catchmons — the vertical slice runtime never references them.

Responsive size variants (128/256/512, per Document 14 §192) are **not**
required — no call site ever requests anything but the single registered
1024² master; `resolveAssetImageUrl` has no size-variant selection logic.

---

## 10. Regions

Vulkankrater (start, Fire) and Ozean (preview, Water). **`RegionDefinition`
has no `AssetId` field of any kind** — only an inert placeholder string,
`visualThemeId: "slice-provisional-visual-theme"`. `WorldScreen.tsx`
renders regions as plain text/`StatusPill` `Panel` cards.

### `region-background-vulkankrater`, `region-background-ozean` (PROPOSED — HOLD, NOT YET WIRED)
- **Priority:** P2 — the World loop is fully playable via text today; this is a "looks finished" pass, not a functional gap. **PRODUCER DECISION: stays P2.**
- **Production status: ON HOLD.** **PRODUCER DECISION** — do not send either asset to production until Phase 10 establishes the actual rendering/`AssetId` integration for regions. That integration is **not** invented or specified in this audit (`RegionDefinition` has no `AssetId` field today, and adding one is a domain-type decision out of this audit's scope). This entry exists to record the requirement, not to authorize generating the art now.
- **Current state:** completely missing, and structurally not yet possible without a domain-type change (adding a real `AssetId` field to `RegionDefinition`).
- **Target presentation:** React DOM (`WorldScreen`).
- **Camera/perspective:** layered fore/mid/background, one dominant landform, 1–2 element cues in form (not just color), lower contrast than interactive objects (brief's "Regions" modifier).
- **Target dimensions/aspect ratio:** recommend a wide card format (e.g. 3:2 or 16:9) matching `WorldScreen`'s `Panel` card layout; not locked by any current code constant — and not to be finalized until the Phase 10 integration decision above is made.
- **Golden Sample:** Wave 3 ("Region Background") — sequencing only; see HOLD status above.
- **Notes:** do not generate before the domain-type/rendering wiring exists — there is no code path that would display it today.

---

## 11. Routes

Three routes (Supply Run, Discovery Survey, Component Hunt), all sharing
one `visualEnvironmentId` (the same shared item placeholder, reused).
Unlike Region, `RouteDefinition` **does** have a real `AssetId` field —
but `RouteSheet.tsx` never resolves/renders it.

### `route-card-supply-run`, `route-card-discovery-survey`, `route-card-component-hunt` (PROPOSED)
- **Priority:** P2 — same reasoning as Region; `RouteSheet` already conveys duration/reward/encounter-chance via text/`StatusPill`.
- **Current state:** an `AssetId` exists in content (pointing at the shared placeholder today) but nothing resolves it — closer to "wired but unused" than "missing."
- **Target presentation:** React DOM (`RouteSheet`).
- **Camera/perspective:** same "Regions" layered-environment treatment, scaled to a card.
- **Golden Sample:** Wave 3 ("Route Card").
- **Reusable across states:** each route should get distinct art reflecting its intent (routine-materials run vs. discovery vs. component hunt), per the brief's general "no needless duplication" principle — but a shared **frame/card treatment** (border, vignette) can and should be reused across all 3, consistent with the Route Card being one Golden Sample, not three.

---

## 12. Capture / discovery / expedition result visuals

No new asset requirement. `EncounterSheet.tsx`/`ExpeditionResultSheet.tsx`
use only: Catchmon portraits (§9, already covered), `StatusPill` icons
(§13, already covered), and plain text/numbers. The approved brief's Wave 3
"Masterwork Effect" and "Capture Effect" are **not required by current
code** — quality is never rolled beyond `STANDARD` (§14) and
`scene-effects.ts`'s `deriveSceneEffects` has no case for
`CAPTURE_ATTEMPTED`/`ENCOUNTER_*` events (Task 09.9 only mapped sale/craft/
customer-decline/upgrade/expedition-return, matching its own task text
exactly — this is not a Phase 9 compliance gap, just a real absence of any
current hook for capture-specific VFX).

---

## 13. UI icons

Already tracked by the approved Design System's own substitution system
(`reference/design-system/approved-v1/guidelines/icons-substituted.card.html`):
36 approved Lucide-substitute SVGs behind one `<Icon name="..."/>` adapter
(`presentation/icons/index.tsx`). Roughly 24 of the 36 are actively
referenced by current Phase 8/9 code (coins, wind, package, map, store,
sparkles, hammer, lock, plus, check, clock, triangle-alert, info,
chevron-left/right, and others). This audit does **not** re-itemize each
glyph individually — that inventory already exists and is maintained at
the design-system level, not the gameplay-code level this audit targets.

- **Priority:** P2 (cosmetic polish; the substitutes are fully functional).
- **Current state:** existing temporary substitute, by design (the
  guideline file's own stated purpose: "Lucide stands in until Catchmon
  Shop icon masters are produced").
- **Notes:** real icon masters drop into
  `approved-v1/assets/icons/*.svg` under the same glyph names per that
  guideline — no consuming component changes needed, confirmed by
  `presentation/icons/index.tsx`'s own header comment.

---

## 14. Quality / mastery visual treatments

**Not required.** `QualityGrade` (`STANDARD`/`FINE`/`MASTERWORK`) exists in
the domain type system and `ProductCard.tsx` has a `tier` prop for it, but
no command or reconciliation path in the current slice ever produces
non-`STANDARD` output (`craft-queue-reconciliation-pass.ts`'s own comment:
"Phase 3 does not roll quality... output always lands as STANDARD").
Excluded from the manifest. Flagged as a design-side gap (not an
asset-side one) should quality rolling ever be implemented. **Producer
decision, forward-looking:** if it is, FINE/MASTERWORK should use
overlays/treatments on the existing base product art rather than
duplicate base paintings per tier, unless actual code later requires
otherwise (see §5 Products).

---

## 15. VFX

All 5 current scene VFX kinds (`SALE`, `CUSTOMER_REACTION`, `CRAFT_READY`,
`UPGRADE`, `EXPEDITION_RETURN` — `presentation/scene/effects/scene-effects.ts`)
are **deliberately code-driven**: a small tinted circle that scales up and
fades over ~900ms (`ShopSceneRenderer.playEffects`), matching Document 14
§182-184's "animation state is ephemeral, never persisted." Per this
audit's instruction to distinguish real image assets from effects that
should stay code-driven: **no image/sprite asset is required for any of
these today**, and recommend they *remain* code-driven rather than
becoming sprite-sheet particles — that would be new gameplay-adjacent
complexity for a purely cosmetic gain, and Rule 9 (Phase 9) explicitly
prioritizes input responsiveness over decorative animation.

- **Future animation (P2, optional):** if Designer wants richer VFX later, a
  small sprite/particle set per effect kind (sale-sparkle, upgrade-shine,
  etc.) could replace the current circles without any gameplay change —
  purely a `ShopSceneRenderer.playEffects` internal swap.

---

## 16. Branding

**Not required.** `index.html` has a plain `<title>Catchmon Shop</title>`
and no `<link rel="icon">`; no logo asset is referenced anywhere in
`src/`. Out of scope for this audit — the current slice does not need
branding art to function or to demonstrate the loop.

---

## Summary

Counts below cover the 33 individually-identified assets across
categories 1–11 (21 needing new production + 12 already-existing
Catchmon portraits). "UI icons" (§13) and "VFX" (§15) are deliberately
tracked as single aggregate notes rather than per-glyph/per-effect line
items — see those sections for why — and are excluded from these counts
to keep the arithmetic exact. Quality/Mastery (§14), Capture/Discovery-
result art (§12), and Branding (§16) need nothing at all and are
likewise excluded.

**1. Exact number of REQUIRED unique production assets: 33**
(21 needing new production + 12 already-existing).

**2. Count by category**

| Category | Count | New production | Existing |
|---|---|---|---|
| 1. Shop environment | 1 | 1 | 0 |
| 2. Stations | 2 | 2 | 0 |
| 3. Displays | 1 | 1 | 0 |
| 4. Infrastructure (Expedition Hub) | 1 | 1 | 0 |
| 5. Products | 5 | 5 | 0 |
| 6. Routine materials | 2 | 2 | 0 |
| 7. Special components | 1 | 1 | 0 |
| 8. Customers | 3 | 3 | 0 |
| 9. Catchmons | 12 | 0 | 12 |
| 10. Regions | 2 | 2 | 0 |
| 11. Routes | 3 | 3 | 0 |
| **Total** | **33** | **21** | **12** |

**3. Count by priority** (21 new-production items only — the 12 existing Catchmons need no priority, they're done)

| Priority | Count | Items |
|---|---|---|
| P0 | 10 | Shop environment; Provision Station; Fieldworks Bench; Display Furniture; Expedition Hub; Products 01–04; Customer (Everyday Buyer) |
| P1 | 6 | Product 05; Material A; Material B; Special Component; Customer (Explorer Buyer); Customer (Special Visitor) |
| P2 | 5 | Region Background (Vulkankrater); Region Background (Ozean); Route Card ×3 |

**4. Already exist: 12** (all Catchmon portraits, `status: "FINAL"`, category 9).

**5. Placeholders/substitutes in place today: 10**
Shop environment, both Stations, Display Furniture, and the Expedition
Hub already render *something* on screen (placeholder `Graphics` shapes
with zero `AssetId` hook) plus the 5 Products (a generic recessed-slot UI
via `ProductCard`'s empty state) — 4 + 5 + 1 = 10.

**6. Need new generation: 21**
All new-production items from question 2/3 need real art. This is a
strict superset of question 5 — the 10 "placeholder" items above still
need real art to replace their current stand-in, plus the 11 items with
*zero* current visual (both Materials, the Special Component, all 3
Customers, both Regions, all 3 Routes = 2+1+3+2+3 = 11). **10 + 11 = 21.**

**7. Golden Sample Wave assignment** (updated per producer decisions)

- **Wave 1:** Shop Key Environment (style-lock sample, 2048×1536, brief
  spec — **and** the 2400×1600 production master, per producer decision),
  Provision Station, Products 01–04 (assigned by priority — P0 — not by
  an inferred tier), Coin Icon (already an existing Lucide substitute,
  not new generation).
- **Wave 2:** Fieldworks Bench, **Display Furniture, then Expedition Hub
  explicitly placed immediately after it** (producer decision — the
  brief's own Wave list never named the Hub), Product 05 (assigned by
  priority — P1 — not by an inferred tier), both Routine Materials, the
  Special Component, the Customer archetypes (1024×1280, full body,
  producer-decided convention; all 3 share one Golden Sample slot per
  the brief's "Customer" singular entry).
- **Wave 3:** Route Cards ×3, Momentum Icon (already an existing Lucide
  substitute). **Region Backgrounds ×2 are sequenced here but ON HOLD —
  do not produce until Phase 10 establishes region rendering/`AssetId`
  integration** (producer decision; see §10).
- **Not required by current code:** Masterwork Effect, Capture Effect
  (both named in Wave 3 but have no current gameplay/VFX hook — see §12).

**8. Recommended production order**

1. Shop Key Environment — style-lock sample (2048×1536, +1 existing
   Catchmon, Wave 1's own stated "first asset to generate") **and** the
   2400×1600 production master (background + floor layers), both Wave 1.
2. Provision Station (idle + active, base + ground-shadow, center-of-
   footprint pivot) — proves the station pattern before duplicating it
   for Fieldworks Bench.
3. Products 01–04 — unblocks the entire guaranteed craft→sell loop
   visually; one shared product-art grammar, no tier split.
4. Fieldworks Bench, **then Display Furniture, then Expedition Hub**
   (Wave 2 order, per producer decision) — Hub uses base + ground-shadow
   + glow, one building asset with code-driven tint/overlay per state.
5. Customer (Everyday Buyer first, then Explorer Buyer, then Special
   Visitor) — 1024×1280, full body, common ground/foot baseline.
6. Routine Materials ×2, Special Component, Product 05 (P1 items).
7. Route Cards ×3 (P2).
8. **Region Backgrounds — held.** Do not produce until Phase 10
   establishes the actual rendering/`AssetId` integration; this audit
   does not invent that integration.

**9. Code-side ambiguity preventing an exact asset specification**

Resolved by this producer-decision pass: environment format/aspect ratio,
station/display/hub sprite pivot convention, product tier inference, and
customer art dimensions — see the relevant sections above, each now
marked **PRODUCER DECISION**. One item remains genuinely open:

- **Region/Route rendering surface:** `RegionDefinition` has no `AssetId`
  field at all; adding one is a domain-type decision outside this
  audit's scope (CLAUDE.md: structural decisions require a check-in, not
  a unilateral change here). Region art is explicitly held per producer
  decision 5 until that integration exists. Route art (`RouteDefinition`
  *does* have a real `AssetId` field already) remains P2/Wave 3 and is
  not held, since its content-level wiring already exists even though no
  component renders it yet.
- **Pivot/footprint metadata schema:** the producer's canonical-pivot
  decision (§2–4) requires `AssetMetadata` to carry an explicit
  pivot/footprint field; that field does not exist in the type today
  (`src/domain/assets/types.ts`). Adding it is a Phase 10 code task, not
  something this audit or the producer-decision pass performs — noted
  here so Phase 10 doesn't rediscover it from scratch.

---

## Readiness for handoff to Claude Designer

**READY FOR WAVE 1 PRODUCTION.**

Every ambiguity that stood between this manifest and a confident Wave 1
start has been resolved by the producer decisions applied in this pass:
the environment's dual style-lock/production-master format is settled,
the canonical pivot convention for all spatial assets (Stations, Display
Furniture, Expedition Hub) is settled and explicitly deferred to real
metadata rather than guesswork, the product Wave split no longer depends
on an invented tier, and the Customer production convention is fully
specified (1024×1280, transparent, full body, shared 3/4 angle, common
ground baseline). The one remaining open item — Region/Route rendering
integration — is correctly scoped as a Phase 10 concern and is not a
Wave 1 blocker (Regions are held; Routes are P2/Wave 3, not part of Wave
1 at all).

Wave 1 can proceed with: the Shop Key Environment (both the style-lock
sample and the 2400×1600 production master), Provision Station, and
Products 01–04.
