# POST-R7 Production Asset Audit

Status: **read-only audit — no art generated, no production authorized.**
Owner scope: docs/rebuild/13_ART_DIRECTION_CONTENT_AND_ASSET_PIPELINE.md (pipeline
authority), docs/rebuild/15 R8/R9/R10/R12 (surfaces this audit prepares for).
Written against the real R2–R7 code as it exists today, not assumed content.

This document does not authorize any Wave. It exists so a future Golden
Sample review (R8/R9 kickoff) starts from an accurate inventory instead of
re-deriving it from scratch.

---

## 1. Existing asset inventory

### REUSE (already built, already wired to a resolver, needs nothing new for R8/R9)

- **104 canonical Catchmon portraits** — `reference/catchmons/<rarity>/<Name>.png`
  plus `<Name>_80/_200/_400.png` +`.webp` siblings (7 files/species, 728
  files total, all 104 species covered). Resolved today by
  `src/presentation/assets/resolve-asset.ts`'s `import.meta.glob` strategy.
  One static portrait per species — **no alternate pose, no battle
  animation frames**. Directly reusable as a Lead/roster/collection
  portrait; NOT sufficient on its own for a battle scene (see §3).
- **Shop-loop production art** (`src/content/vertical-slice/productionAssets.ts`,
  served from `public/assets/vertical-slice/**`): environment
  wall/floor, 2 station archetypes (idle/active × base/shadow), display
  furniture, Expedition Hub, 5 generic products, 2 routine materials, 1
  special component, 3 customer portraits. All real `AssetMetadata` with
  real pivots. Irrelevant to combat/Forge surfaces — listed here only so
  R8/R9 doesn't accidentally re-produce it.
- **Element color tokens** — `reference/design-system/approved-v1/tokens/elements.css`:
  APPROVED, 3 tokens/element (`-1`/`-2`/`-glow`) for all 17 canonical
  elements, plus a `[data-element]` scoping pattern already consumed by
  `ElementBadge.css`. Fire/Water (Vulkankrater/Ozean) are both already
  final — no new color work needed for the two authored regions.

### REFERENCE ONLY (informs new work, is not itself shippable)

- `reference/design-production/normalized-v1/FINAL_ASSET_INTAKE_REPORT.md`
  — the pivot-derivation methodology (alpha-weighted shadow centroid) any
  new combat/Forge asset's pivot metadata should follow for consistency.
- The Catchmon portrait art style itself — a battle-ready Lead/enemy
  sprite should read as "the same character," not a new style, even
  though the portrait alone isn't sufficient for a battle scene.

### NOT RELEVANT

- Everything else under `reference/` not cited above (raw design-production
  masters for Shop art already covered by REUSE).

### NEEDS NEW PRODUCTION

Everything in §3–§7 below that isn't explicitly marked REUSE.

---

## 2. R8 React asset requirements per surface

R8 (React UX) is **not started** — `src/presentation/screens/JourneyPlaceholderScreen.tsx`
is a static placeholder with no combat/Forge markup, and no Forge/battle
component exists anywhere in `src/presentation/` (stubbed or otherwise).
The requirements below describe what R8's own screens will need, derived
from the R2–R7 domain/application surfaces those screens must present —
not a design R8 hasn't done yet.

| Surface | Proposed AssetId category | Renders in | Dimensions/aspect | Alpha | State variants | Existing art? |
|---|---|---|---|---|---|---|
| Lead portrait (Journey/loadout screens) | `catchmon-portrait` | React `<img>` | existing (80/200/400 square-ish) | yes | none | **REUSE** — canonical portraits |
| Stage list row (`StageDefinition` × 8) | `stage-thumbnail` | React | small square/landscape, TBD | yes | locked/current/cleared (state is a CSS/UI concern, not 3 separate images) | NEEDS NEW |
| Region badge (Vulkankrater/Ozean, already used by World screen's `.ds-panel`) | `region-badge` | React | small icon, square | yes | locked/unlocked (UI state, not separate art) | NEEDS NEW (World screen currently text-only, no region art) |
| Relic Matrix slot icon × 8 (`RelicMatrixSlot`) | `relic-slot-icon` | React | small square | yes | empty/filled (UI state) | NEEDS NEW |
| Relic rarity indicator × 7 (`RelicRarity`) | n/a — color token, not an image | React (CSS) | — | — | — | NEEDS NEW (no rarity→color token exists yet, unlike element colors) |
| Battle Path icon × 3 (BREAKER/WARDEN/WEAVER) | `battle-path-icon` | React | small square | yes | selected/unselected (UI state) | NEEDS NEW |
| Skill icon (per unlocked skill, `COMBAT_SLICE_SKILLS`) | `skill-icon` | React | small square | yes | none | NEEDS NEW |

None of this row needs Pixi — R8's own scope (per docs/rebuild/14) is
screens/sheets/lists, matching how the existing Shop screens work (Pixi is
reserved for the *Living Shop* scene specifically, not general UI).

---

## 3. R9 Battle Golden Sample minimum requirements

Derived directly from what `domain/combat`, `domain/journey`, and
`domain/forge` actually model today (§5 of the earlier investigation),
not an assumed battle-screen design:

- **Battle background** — one per Region (Vulkankrater, Ozean); a
  region's `visualThemeId` field already exists on `RegionDefinition`
  but is currently the placeholder string `"slice-provisional-visual-theme"`
  for both. NEEDS NEW.
- **Lead sprite** — the canonical portrait (REUSE) is not battle-ready:
  no attack/hit/faint state exists. Golden Sample minimum: idle + one
  attack/skill-cast frame + one hit-react frame for the single chosen
  species (§4). Faint state can reuse hit-react for the Golden Sample
  (full frame set is later-wave work, not Golden-Sample-blocking).
- **Enemy/boss sprite** — same idle/attack/hit minimum, for the single
  first enemy the Golden Sample targets (Ember Wisp) plus the region's
  boss (Vulkan Warden) — a boss is visually the actual stakes-proof of
  "combat renders for real," so the Golden Sample should not skip it.
- **Rift Forge screen states** — `ForgeRelicConfig`/`forge-relic.ts`
  models: idle (pre-forge), in-progress (Echo Charge spend animation is
  a nice-to-have, not required), and a result reveal per `RelicRarity`
  (7 tiers) — Golden Sample only needs COMMON vs. a "rare-or-better" glow
  treatment proven once, not all 7 rendered distinctly (that's Wave 1+).
- **Relic icons** — one per `RelicMatrixSlot` (8: CORE/CREST/FANG/SHELL/
  STEP/FOCUS/CHARM/ECHO) is the real content surface (`COMBAT_SLICE_RELIC_ARCHETYPES`
  already names and slots exactly 8 archetypes) — Golden Sample needs
  only the slot the sample Relic actually lands in proven end-to-end;
  the remaining 7 are Wave 1, not Golden-Sample-blocking.
- **Basic VFX** — a hit-flash/damage-number and a win/loss banner are the
  structural minimum `simulateBattle`'s round-by-round outcome needs to
  read as combat rather than a static comparison. No skill-specific VFX
  is required for the Golden Sample (`Skill`/`RelicArchetypeDefinition`
  content doesn't carry a VFX field today — inventing per-skill VFX now
  would be new game design, not implementation).

## Recommended Golden Sample species

**Flamarox** (Fire, Vulkankrater, first entry in `SELECTED_CATCHMON_SPECIES_IDS`).
Reasoning: Vulkankrater is the game's starting Region, so Flamarox is the
species every new player's Journey actually begins against; it already
has a canonical portrait (REUSE) to build the battle sprite from without
inventing a new character; and validating the pipeline against a Fire
species first exercises the "burst/offense" identity `content/combat-slice/enemies.ts`'s
own doc comment describes as Vulkankrater's defining contrast with Ozean
— proving that contrast is legible is exactly what the Golden Sample
needs to demonstrate. **Aquilor** (Water, Ozean's contrast pair) is the
natural Wave 2 second sample once the pipeline is proven, not a second
Golden Sample.

---

## 4. First 8–12 Catchmon battle-art requirements

The slice roster today is **6** species (`SELECTED_CATCHMON_SPECIES_IDS`):
Flamarox, Emberynn (Fire pair), Aquilor, Hydroscythe (Water pair), Geckon,
Aerorion — within the instructed 8–12 ceiling, not at it; this audit does
not recommend growing the roster to reach that ceiling, only reports what
exists. None of the 104 canonical species beyond these 6 need battle art
for R9/first-playable purposes.

Per-species requirement (once the Golden Sample above proves the
pipeline): idle + attack/skill-cast + hit-react, matching the Golden
Sample's own 3-state minimum — not the faint/multi-attack-variant depth a
later polish pass might add.

---

## 5. Vulkankrater asset list

- 1 battle background (`visualThemeId` real art, replacing the
  placeholder string).
- 4 enemy/boss sprites — see §7 (3 normal + Vulkan Warden boss).
- Existing: region identity already has an approved Fire color token
  (REUSE); no region badge/icon art exists yet (NEEDS NEW, §2).

## 6. Ozean asset list

- 1 battle background (same placeholder-`visualThemeId` gap as
  Vulkankrater).
- 4 enemy/boss sprites — see §7 (3 normal + Tidal Sovereign boss).
- Existing: region identity already has an approved Water color token
  (REUSE); no region badge/icon art exists yet (NEEDS NEW, §2), same gap
  as Vulkankrater.

## 7. Enemy/boss asset list

| Enemy | Region | Golden Sample / Wave |
|---|---|---|
| Ember Wisp | Vulkankrater | **Golden Sample** (first enemy target, §3) |
| Cinder Hound | Vulkankrater | Wave 1 (First Playable) |
| Magma Sentry | Vulkankrater | Wave 1 |
| Vulkan Warden (boss) | Vulkankrater | **Golden Sample** (boss proof, §3) |
| Tide Sprite | Ozean | Wave 2 |
| Reef Guardian | Ozean | Wave 2 |
| Abyssal Warden | Ozean | Wave 2 |
| Tidal Sovereign (boss) | Ozean | Wave 2 |

---

## 8. Rift Forge / Relic / VFX asset requirements

Derived from the real `domain/forge` shape (§5 of the investigation) —
**no `RelicDefinition`/visual field exists anywhere in the domain model
today**, only `RelicArchetypeDefinition` (id/slot/main-stat) and runtime
`RelicInstanceState`. Any icon mapping is therefore driven by
`RelicArchetypeDefinition.slot` (8 values), not by rarity or archetype
identity — rarity is a roll-time-only concept with no authored visual yet.

**R8/R9-NOW** (Golden Sample + surrounding minimum, §3):
- Forge screen idle/result-reveal states (2 states, not full rarity
  ladder).
- 1 Relic slot icon (whichever slot the Golden Sample's forged Relic
  lands in).
- A COMMON-vs-"rare-or-better" glow distinction only — not a distinct
  treatment per all 7 `RelicRarity` tiers.

**R10/R12-LATER** (deferred, not Golden-Sample-blocking):
- Remaining 7 Relic slot icons (CREST/FANG/SHELL/STEP/FOCUS/CHARM/ECHO
  minus whichever the Golden Sample already covers).
- Full 7-tier `RelicRarity` visual ladder (a rarity→color token set,
  mirroring how `elements.css` already does this for elements — this
  exact gap is called out in §1's REUSE section: no rarity color tokens
  exist today).
- Per-skill VFX (no VFX field exists on `Skill`/`RelicArchetypeDefinition`
  content — authoring one now would be inventing missing game design,
  not implementation; explicitly deferred, not merely postponed for
  convenience).
- Forge in-progress spend animation (nice-to-have, not structural).

---

## 9. Technical art pipeline recommendation

Extend the **already-proven** pipeline (`domain/assets` → `AssetMetadata`
→ `resolve-asset.ts`), the same shape `productionAssets.ts` already uses
for Shop art — do not invent a second pipeline for combat/Forge assets:

- **Masters**: new combat/Forge art gets its own
  `reference/design-production/generated-v1/<surface>/...` →
  `normalized-v1/<surface>/...` stage pair, mirroring the existing Shop
  art provenance chain 1:1 (§1). Never overwrite an existing master file
  destructively — a revision gets a new version-suffixed file, matching
  `AssetMetadata.version`'s existing field.
- **Format**: WebP-first for anything new, PNG only where an alpha
  edge-case genuinely needs it (Doc 13's existing rule) — note the
  canonical Catchmon portraits already have WebP siblings on disk that
  `resolve-asset.ts`'s glob doesn't pick up yet (`*.png` only); switching
  that glob to prefer `.webp` is a small, self-contained fix worth doing
  before Wave 0 art lands, so new battle-sprite WebP files aren't the
  first ones silently unresolved.
- **Runtime split**: `sourcePath` (design-controlled normalized master)
  stays separate from `runtimePath` (what ships), exactly as
  `productionAssets.ts` already does — new combat/Forge assets follow
  the same two-field convention, not a shortcut that collapses them.
- **Resolver**: extend `resolve-asset.ts` with a third strategy (battle/
  Forge assets keyed by `AssetId`, same `runtimePath`-first pattern the
  vertical-slice strategy already uses) rather than a parallel resolver
  function — one resolution entrypoint stays the single source of truth
  per CLAUDE.md §14.

---

## 10. Wave plan

Explicitly: **no Wave below is authorized by this document.** This is the
plan a future Golden Sample review would evaluate against, not a
production green-light.

- **Wave 0 — Golden Sample**: Flamarox (idle/attack/hit) + Ember Wisp
  (idle/attack/hit) + Vulkan Warden boss (idle/attack/hit) + 1
  Vulkankrater battle background + 1 Relic slot icon + Forge idle/result
  states + hit-flash/damage-number/win-loss-banner VFX. Proves the whole
  pipeline (generated → normalized → runtime → resolver → React/Pixi)
  once, end-to-end, on real production code — not a mockup.
- **Wave 1 — First Playable / Vulkankrater**: remaining 2 Vulkankrater
  normal enemies (Cinder Hound, Magma Sentry) + remaining 7 Relic slot
  icons + region badge/icon art (§2) + skill/battle-path icons (§2) +
  full 7-tier Relic rarity color ladder (§8).
- **Wave 2 — Ozean**: Aquilor as the second Catchmon battle-art sample
  (Water contrast pair) + 4 Ozean enemy/boss sprites + 1 Ozean battle
  background.
- **Wave 3 — Scale Template**: the reusable per-Region/per-enemy/
  per-Relic-slot production template this whole audit's Wave 0-2 proves,
  documented as a repeatable recipe — explicitly NOT mass production for
  all 104 Catchmons / 17 Regions (CLAUDE.md §32/§34, Doc 13's own scope
  guard).
