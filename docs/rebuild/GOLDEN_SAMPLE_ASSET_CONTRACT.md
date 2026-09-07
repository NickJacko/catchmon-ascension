# Golden Sample Asset Contract

Status: **contract only — no art generated, no normalization, no production
authorized.** Written against the ACTUAL R8/R9 implementation (real logical
canvas, real anchors, real envelopes, real component/query shapes) — not
guesses. Supersedes/completes the "Golden Sample" section of
`docs/rebuild/POST_R7_ASSET_AUDIT.md` now that R8/R9 exist to derive exact
numbers from.

Owner scope: docs/rebuild/13 (pipeline authority), docs/rebuild/15 R8/R9
(source of the real values below), R10/R12 (where anything explicitly
deferred here gets produced).

**Reconciliation pass**: `reference/design-production/spec/Catchmon
Ascension - Wave 0 Golden Sample Package.html` (the designer's corrected
Wave 0 package, built directly against this contract) flagged ten
TO-FILL values it could not resolve without engineering access. This
revision closes each of them against the real R8/R9 code — see §0.

---

## 0. TO-FILL register — resolved

Numbered to match the design package's own "TO-FILL register — resolve
before generation" section exactly.

**01 — Anchor vs. ground line. RESOLVED.** `LEAD_ANCHOR`/`ENEMY_ANCHOR`
are `{y: 280}`, `BOSS_ANCHOR` is `{y: 260}`, `BATTLE_GROUND_LINE_Y` is
`300` (`battle-scene-layout.ts`). These are two different things, not a
20px measurement error: `LEAD_ANCHOR`/`ENEMY_ANCHOR`/`BOSS_ANCHOR` are
`CombatantEntity.setBasePosition(x, y)` calls — the actual container
position a combatant's own art renders at. `BATTLE_GROUND_LINE_Y` is a
separate, purely decorative horizon rule the renderer draws
(`BattleSceneRenderer`'s `groundLine` Graphics: `rect(0,
BATTLE_GROUND_LINE_Y, BATTLE_SCENE_WIDTH, 3)`) — nothing in the code ties
combatant position to it. **Resolved reading: foot contact is intended at
the anchor's own y (280 for Lead/normal enemy, 260 for boss), not at
y=300.** The 20-40px gap is combatants standing in the midground, in
front of the horizon line — normal for a layered background/ground/
combatants stack, not a bug to reconcile away. This does depend on a
real code change already flagged in §2 below: `CombatantEntity`'s Sprite
is currently center-anchored (0.5, 0.5), matching `CatchmonEntity`'s
existing convention, not bottom-anchored — moving it to (0.5, 1.0) is
required before a real cutout's feet will actually land on 280/260. That
Sprite-anchor change is presentation code, not gameplay, but is
intentionally **not made by this reconciliation pass** (documentation/
production-prep only, per this task's own scope) — flag it as a small R10
prerequisite alongside the first real asset landing.

**02 — Forge host geometry. PARTIALLY RESOLVED / DEFERRED.**
`ForgeScreen.tsx` today has **no image or canvas element at all** — every
row (Echo Charges, Forge Level, Forge Insight meter, the slot picker, the
"Latest Relic" panel) is text/`Slot`/`StatusPill`. There is no existing
"Forge device" host row to extract geometry from — the design package's
own item 5 observation ("the screen has no device art today") is exactly
right, confirmed by re-reading the file. What IS resolvable: the real
container width the asset would render inside. `ForgeScreen`'s content
sits inside `AppShell`'s `.app-shell-content` (`padding: var(
--gutter-screen)` = 16px each side) inside a `Panel` (`padding: var(
--pad-panel)` = 20px each side) — at the Doc 12 §10 reference viewport
(~390px, not an enforced CSS max-width — none exists in
`src/presentation/shell/*.css`), that's `390 - 2×16 - 2×20` = **318px**
of inner content width, which the contract's existing 320×320 CSS
footprint already matches almost exactly. The natural host location is
inside the existing "Rift Forge" Panel (`ForgeScreen.tsx`, the one titled
exactly that, currently text-only) rather than a new Panel. **Deferred**:
the actual host `<div>`/row markup does not exist and is not created by
this pass (R10 work, alongside the Sprite-anchor fix from item 01).

**03 — Journey screen geometry around the battle banner. RESOLVED.** See
new §3a below for the full breakdown (Panel header above, an un-stacked
sequence of rows below — a real, quotable fact, not a placeholder
assumption).

**04 — Fire signature skill binding. DEFERRED — confirmed unresolvable
in the current domain model, not merely unfound.** `SkillDefinition`
(`domain/loadout/types.ts`) has exactly four fields: `skillId`,
`displayName`, `pathId: BattlePathId`, `isSignature`, `statBonus` — no
`elementId`, no VFX reference. Skills are bound to **Battle Paths**
(BREAKER/WARDEN/WEAVER), not to species or elements; the three real
skills (`content/combat-slice/skills.ts`) are `breaker-signature-rend`,
`warden-signature-bulwark`, `weaver-signature-cinderweave` — none is
"Flamarox's skill" or "a Fire skill." Document 05 §6 lists a species
contributing its own "Signature candidate" as a `may` (future work), not
built. There is no code seam to bind a VFX strip to today. Production of
the Fire skill VFX strip should wait for this binding to exist rather
than attach to an arbitrary Path skill.

**05 — VFX anchor offset. DEFERRED, same root cause as 04.** No
per-skill or per-VFX anchor/offset API exists in `BattleSceneRenderer`/
`CombatantEntity` today — the only VFX primitive that exists is the
generic outcome banner (screen-centered, not target-relative) and the
hit-flash tint (applied to the target's own existing position, not an
offset). A "play this strip near the target, offset by (x,y)" contract
has nothing in code to attach to yet.

**06 — Rarity → colour token. DEFERRED, confirmed absent, not just
undocumented.** Searched `reference/design-system/approved-v1/tokens/
*.css` and every `.css` file under `src/` for "rarity" — zero matches.
`elements.css` has a real per-element 3-token pattern
(`--el-<name>-1/-2/-glow` plus a `[data-element]` selector); no
equivalent exists for `RelicRarity`. Confirmed Wave 1 scope (already
correctly framed in §7 below) — the RARE frame's hue is therefore an art
decision for Wave 0 (see §7), not sourced from a token that doesn't
exist yet.

**07 — Fire element triad. RESOLVED.** From
`reference/design-system/approved-v1/tokens/elements.css`:
`--el-fire-1: #C2481F`, `--el-fire-2: #E9762A`, `--el-fire-glow:
#FFB25E`. (For context, not asked but directly relevant to §6's Rift
Forge "Cosmic" framing: `--el-cosmic-1: #1C6478`, `--el-cosmic-2:
#3FD8E0`, `--el-cosmic-glow: #8FF7F2`.)

**08 — Preload manifest. PARTIALLY RESOLVED.** The real mechanism (not
the Wave 0 manifest, which can't exist until these `AssetId`s are wired
into a resolver) is confirmed: `BattleSceneHost.tsx` calls
`collectBattleSceneImageUrls` on mount and eagerly `loadCachedTexture`s
every URL it returns, in parallel with Pixi's async init; today that's
just the Lead's portrait (no enemy/boss art exists yet). `CombatantEntity
.update()` independently `loadCachedTexture`s its own `portraitUrl` on
every structural update — the same cache, so this never double-fetches,
it just means "whatever the current view model needs" is the only
preload tier that exists today, matching `AssetPreloadClass`'s
`CURRENT_CONTEXT` value exactly. `ForgeScreen.tsx` loads no images at
all currently (nothing to describe). Resolved preload-class assignment
for Wave 0, using the real closed `AssetPreloadClass` enum
(`domain/assets/types.ts`): Flamarox idle / current-stage enemy or boss
idle / Vulkankrater background / Forge base = `CURRENT_CONTEXT` (always
visible the moment their screen mounts, mirroring today's Lead-portrait
behavior exactly); Forge charged overlay / Forge reveal overlay / CORE
slot icon / Ember Core relic art / RARE rarity frame / Fire skill VFX
strip = `ON_DEMAND` (each is conditional on a state or event —
`forgeReady`, `FORGE_RELIC` resolving, a Relic actually existing, a
skill actually casting). **Deferred**: the resolver strategy that would
actually honor this (§9) is not built.

**09 — Flamarox canonical master. RESOLVED, traced end-to-end.**
`content/vertical-slice/catchmonReferenceAudit.ts` builds every species'
`portraitAssetId`/`sourcePath` as `` `reference/catchmons/${sourceFolder}/${catchmonSpeciesId}.png` ``.
Flamarox's real file on disk: **`reference/catchmons/Starter/
Flamarox.png`** (confirmed present, `Starter` rarity folder — matches
`SELECTED_CATCHMON_SPECIES_IDS`'s Flamarox being starter-eligible).
`_80`/`_200`/`_400` pre-scaled PNG+WebP siblings exist alongside it but
are not the master. This is the exact file `resolveAssetImageUrl`'s
`import.meta.glob("../../../reference/catchmons/*/*.png")` resolves to
for Flamarox today, live, in the running app.

**10 — CORE relic naming.** Not blocking (the design package's own
verdict) — "Ember Core" is quoted directly from real content
(`COMBAT_SLICE_RELIC_ARCHETYPES`), stays provisional as a product name,
canonizes nothing new. No action needed.

---

## 1. Golden Sample subjects

**Lead:** Flamarox · **Normal enemy:** Ember Wisp · **Boss:** Vulkan Warden
· **Region:** Vulkankrater.

Confirmed correct against the real implementation, no change from the
candidate set: Flamarox is `SELECTED_CATCHMON_SPECIES_IDS[0]`
(`verticalSliceManifest.ts`) — the first species in the roster and the one
`buildBattleSceneViewModel` renders as Lead the moment a fresh game
assigns any Lead at all, since Aquilor/Flamarox are both starter-eligible
but Flamarox pairs with Vulkankrater, the actual starting Region. Ember
Wisp is `COMBAT_SLICE_STAGES[0]`'s enemy (order 0, the very first stage
`ATTEMPT_STAGE` ever resolves). Vulkan Warden is Vulkankrater's
`isRegionCompletionBoss` stage. No reason found in the real R8/R9 code to
pick different subjects.

---

## 2. Flamarox contract (Lead)

Rendered by `CombatantEntity` (`presentation/scene/battle/entities/
CombatantEntity.ts`) at `LEAD_ANCHOR` inside the real 640×400 logical
battle canvas (`battle-scene-layout.ts`).

| Asset | Required? | Reason |
|---|---|---|
| Idle battle cutout | **Required** | The only state `CombatantEntity` currently renders continuously — Golden-Sample-blocking. |
| Attack state | Not required for Golden Sample | `BattleSceneRenderer.playEffects` plays a code-driven lunge (position tween), not a frame swap — see §9. Deferred, not blocking. |
| Hit state | Not required for Golden Sample | Hit is a code-driven red tint + shake (`CombatantEntity.playHit`), not a separate art frame. |
| Signature Skill state | Not required for Golden Sample | No per-skill VFX field exists on `SkillDefinition` yet (confirmed in POST_R7 audit) — inventing one now would be new game design, not implementation. |
| Support Assist state | Not relevant | Bond Support Catchmons are never rendered spatially in the battle scene (only the Lead + current enemy) — no such state exists in the code to satisfy. |
| Ground/contact shadow | **Required** | `CombatantEntity`'s own placeholder shadow (`Graphics.ellipse`) is a permanent scene element; the real art should read correctly under/behind it, or supply its own matching contact shadow if the placeholder ellipse is retired. |

**Required asset: idle battle cutout**
- Canvas: 512×512 px (generated/normalized master), square, generous
  padding around the character so downscale never clips.
- Runtime: 240×240 px WebP (2× the on-screen 120×120 envelope —
  `COMBATANT_ENVELOPE`, `battle-scene-layout.ts` — for retina sharpness at
  the actual rendered size).
- Transparent background (PNG master; WebP runtime with alpha).
- Pivot: bottom-center (0.5, 1.0) — `CombatantEntity` anchors its Sprite
  at (0.5, 0.5) today (matching `CatchmonEntity`'s existing convention),
  but a battle cutout with a contact shadow reads correctly bottom-
  anchored; recompute the sprite's own anchor to (0.5, 1.0) when this
  asset lands rather than stretching art to fit a center anchor.
- Expected on-screen size: fits within 120×120 logical px
  (`COMBATANT_ENVELOPE.maxWidth/maxHeight`) once scaled — the renderer
  scales `diameter / max(texture.width, texture.height)`, so the source
  character should fill most of its 512×512 canvas (large character,
  small margin) rather than being small-and-centered.
- Facing: right (Lead always stands stage-left facing the enemy,
  `LEAD_ANCHOR`/`ENEMY_ANCHOR` — Document 03's combat formation). Viewed
  directly (`reference/catchmons/Starter/Flamarox.png`, confirmed §0 item
  09): the canonical master is a mostly front-on 3/4 pose with a
  left-leaning gaze/weight (raised left fist, tail trailing right) — not
  a clean profile — so "re-posed facing right" means a real re-pose, not
  a horizontal flip of the existing file (a flip would put the tail on
  the wrong side relative to the raised-fist reading and reverse the
  character's established asymmetry). Canonical reference — REUSE for
  anatomy/color/personality, not shippable as-is.
- Safe padding: ≥10% of canvas on every edge.
- Code-driven transform/motion applied on top: idle bob (`Math.sin`
  vertical oscillation), a hit-flash red tint + horizontal shake, and
  uniform scale-to-fit — the art itself should be a single static pose,
  not pre-animated.

---

## 3a. Journey screen geometry (battle banner context)

Resolves TO-FILL item 03. Read directly from `JourneyScreen.tsx` + the
real design-system spacing tokens — no assumed layout.

The 640×400 (8:5) battle banner (`.battle-scene-host`, `width: 100%;
aspect-ratio: 8/5`) sits inside the stage `Panel` (`title={region
.displayName}`, `subtitle={stage.displayName}` — e.g. "Vulkankrater" /
"Vulkan Warden"), which itself sits inside the screen's own `.stack`,
which sits inside `AppShell`'s `.app-shell-content`. Concretely, at the
Doc 12 §10 reference viewport (~390px CSS width — a reference point, not
an enforced max-width; none exists in `src/presentation/shell/*.css`):

- **Screen gutter**: `--gutter-screen` = 16px each side (`AppShell.css`).
- **Panel padding**: `--pad-panel` = 20px each side (`Panel.css`).
- **Available banner width**: `390 - 2×16 - 2×20` = **318px** → banner
  renders at 318 × 198.75px (318 × 5/8) at this reference width.
- **Above the banner**: the Panel's own header (`.ds-panel__header`,
  `margin-bottom: var(--stack-default)` = 12px) — the region name as
  `.ds-panel__title` (`type-section` font), the stage name as
  `.ds-panel__subtitle` (`type-body`, muted).
- **Below the banner**: `JourneyScreen.tsx`'s JSX does **not** wrap the
  Panel's remaining children in a `.stack` — they are plain adjacent
  siblings with no explicit CSS gap between them:
  1. `.row.row--between` (Lead name + 64×64px portrait
     `.cs-customer-header__portrait` on the left; enemy name + Boss
     `StatusPill` + `ElementBadge` on the right) — `.row` gap: `--space-2`
     = 8px, row height driven by the 64px portrait when present.
  2. Conditionally, another `.row.row--between` for "Last attempt" /
     outcome `StatusPill`.
  3. A `<p className="muted">` for the next-objective sentence.
  4. A full-width `Button` (default `md` size, `min-height: var(
     --touch-comfortable)` = 52px) — "Attempt Stage" / "Challenge Boss."
- **Validation implication**: since there is currently no explicit gap
  between the banner and item 1, real art/QA mockups (the design
  package's validations A/B) should butt the Lead/enemy row directly
  against the banner's bottom edge, not assume a gap that the real CSS
  doesn't have.

---

## 3. Ember Wisp contract (normal enemy)

Rendered by the same generic `CombatantEntity` at `ENEMY_ANCHOR`, sized to
`COMBATANT_ENVELOPE` — structurally identical contract to Flamarox's,
values below only where they differ.

- Required state images: idle only (same reasoning as §2).
- Dimensions: 512×512 master / 240×240 WebP runtime (same envelope as the
  Lead — Document 03 §7's contrast is mechanical, not "enemies are
  visually bigger by default").
- Facing: left (faces the Lead across `BATTLE_GROUND_LINE_Y`).
- Pivot: bottom-center (0.5, 1.0), same correction as §2.
- Combat scale: `COMBATANT_ENVELOPE` (120×120 logical px) — identical
  footprint to the Lead.
- Shadow strategy: same ground-contact ellipse convention as the Lead;
  Fire identity should read through color/silhouette, not through a
  different presentation mechanism (no per-element shadow variant exists
  in code).

---

## 4. Vulkan Warden contract (boss)

- Required state images: idle only (Golden Sample scope — see §2's table,
  identical reasoning).
- Dimensions: 768×768 master / 400×400 WebP runtime (2× the 200×200
  logical `BOSS_ENVELOPE`).
- Pivot: bottom-center (0.5, 1.0).
- Allowed visual footprint: capped at `BOSS_ENVELOPE` (200×200 logical
  px) — `BattleSceneRenderer.update` rebuilds the enemy `CombatantEntity`
  with this exact envelope whenever `SceneCombatantView.isBoss` is true
  (envelope-change detection via `envelopeMaxWidth`), so a boss can never
  silently render larger than this cap regardless of source art size.
- Scale relative to Lead: `BOSS_ENVELOPE` (200×200) vs. `COMBATANT_ENVELOPE`
  (120×120) — a boss reads roughly 1.67× larger on each axis, a real but
  bounded size difference (Document 03 §7: boss is a stakes/mechanics
  distinction, not licence for unbounded art, `battle-scene-layout.ts`'s
  own doc comment).
- VFX-safe area: `VFX_SAFE_BOUNDS` (x:40, y:40, 560×320 logical px,
  `battle-scene-layout.ts`) — the boss's own envelope at its anchor
  (`BOSS_ANCHOR` = 470,260) sits inside this region already; no VFX
  authored against the boss should bleed past it.
- Separate boss arena art: **not required.** The battle background is
  per-Region (§5), not per-encounter — no code path exists for a
  boss-specific background swap, and inventing one now would be new
  scope, not implementation.

---

## 5. Vulkankrater background contract

- Source aspect/resolution: author at 2560×1600 px (matches the existing
  Shop environment art convention — `ENV_SHOP_KEY_WALL_ASSET_ID`'s 2400×1600
  precedent — scaled up slightly to a clean 8:5 multiple).
- Runtime aspect: 8:5, matching `BATTLE_SCENE_WIDTH`/`BATTLE_SCENE_HEIGHT`
  (640×400) exactly — `BattleSceneHost.css`'s `aspect-ratio: 8 / 5` is the
  real CSS contract the art must fill without letterboxing.
- Runtime resolution: 1280×800 WebP (2× logical, matching `MAX_DPR = 2`
  in `BattleSceneRenderer.ts`).
- Camera-safe areas: the full canvas is visible at all times (`
  computeBattleViewport`'s "contain, centered" scaling never crops) — no
  region of the background can be assumed off-screen.
- Horizon/ground placement: the art's own ground line must land at
  `BATTLE_GROUND_LINE_Y / BATTLE_SCENE_HEIGHT` = 300/400 = **75% down**
  the frame — `BattleSceneRenderer` currently draws a flat semi-
  transparent ground-line rule at exactly this position (`groundLine`
  Graphics); real background art should align its own horizon there so
  the placeholder ground line can be retired without a visual seam.
- Where combatants sit: both anchors sit ON that same ground line
  (`LEAD_ANCHOR.y` = 280, `ENEMY_ANCHOR.y` = 280, `BOSS_ANCHOR.y` = 260 —
  all within the 120-200px envelope's own height above y=300), stage-left
  and stage-right respectively (150,280 / 490,280) — the background
  should keep that horizontal band (roughly x:40-600, y:180-300) visually
  clear of large foreground obstructions.
- Where visual detail should be avoided: the reserved HP-label strip
  concept (`HP_LABEL_STRIP_HEIGHT` = 34px above each combatant's own
  head) is combatant-relative, not a fixed screen band — background art
  has no fixed exclusion zone for it, but should avoid extreme brightness
  spikes directly above the two ground anchors where HP bars render.
- Foreground prop layers: **not justified for Golden Sample.** The real
  layer stack (`BATTLE_SCENE_LAYER_ORDER`: background, ground, combatants,
  effects, foreground) already reserves a foreground layer (today used
  only for the outcome banner), so a future foreground prop is
  architecturally free to add later — but Golden Sample needs exactly one
  background layer to prove the pipeline, not a parallax set.

---

## 6. Rift Forge contract

**Rendering host decision (R9 §12): React + raster states, not Pixi.**
`ForgeScreen.tsx` (R8) is a DOM/CSS surface today — Forge interaction is a
tap-slot → dispatch → compare → equip/recycle flow (Document 12 §4
"Reveal is satisfying but fast"), not a spatial scene needing WebGL
entities, camera, or per-frame ticking. No Pixi canvas/Application exists
for the Forge and none is warranted: a base raster image plus CSS-driven
state classes and a small number of overlay layers satisfies every real
requirement observed in `ForgeScreen.tsx`/`BuildSheet.tsx` today (a
static "device" identity, a charged/ready glow before forging, a brief
reveal flash after). This mirrors R9 §12's own stated preference ("base
asset + effect layers... if that reduces unnecessary duplicated art").

Required states: **IDLE, CHARGED/READY, ACTIVE/REVEAL** — as one base
asset plus two overlay layers, not three complete raster assets (per the
instruction's own preference, and because the states are additive: READY
is IDLE-plus-glow, REVEAL is READY-plus-flash, not three unrelated poses).

- Base (IDLE) asset: 640×640 px master / 320×320 WebP runtime,
  transparent background. Original Catchmon visual identity — explicitly
  **not** a lamp/genie/bottle silhouette (Document 04 §1 "there is no
  magical lamp," this campaign's own explicit instruction) — an abstract
  Relic-Matrix-adjacent "rift" device/altar form fits the canonical Relic
  Matrix's own abstract slot vocabulary (Core/Crest/Fang/Shell/Step/
  Focus/Charm/Echo, Document 04 §3) better than any humanoid-forge or
  container silhouette.
- CHARGED/READY overlay: same 640×640/320×320 canvas, additive-blend
  glow/energy-line layer over the base — shown once `state.forge.
  echoCharges >= config.forgeRelicConfig.echoChargeCost` (the real
  `forgeReady` condition already computed in `JourneyScreen.tsx`/usable
  identically in `ForgeScreen.tsx`).
- ACTIVE/REVEAL overlay: same canvas, a brief brighter burst layer shown
  for the ~1s window around a `FORGE_RELIC` dispatch resolving (matching
  `DURATION.vfx` = 900ms, `presentation/motion/index.ts`).
- Transparency: required on every layer (stacks over the Panel's own
  background).
- Pivot/anchor: center (0.5, 0.5) — this is a static centered UI element,
  not a spatially-anchored scene entity.
- Maximum visual footprint: 320×320 CSS px — confirmed against the real
  container math (§0 item 02): a `Panel` at the ~390px reference viewport
  has 318px of inner content width, so 320×320 is already the correct
  fit, not a rough guess. **The host row/container itself does not exist
  in `ForgeScreen.tsx` yet** — the screen is text/`Slot`/`StatusPill`
  rows only today; the natural location is inside the existing "Rift
  Forge" Panel, but the actual markup is R10 work, not produced by this
  reconciliation pass.
- UI interaction safe zone: the slot-picker row (`RELIC_MATRIX_SLOTS` ×
  `Slot`) and the Echo Charges/Forge Level/Insight readouts render in
  separate DOM rows above/below this asset in `ForgeScreen.tsx` today —
  the asset itself needs no interactive hit-region cut into it; every
  real tap target already exists as a semantic DOM control beside it
  (Document 12 §11 "accessible controls do not depend on Pixi hit targets
  alone" — doubly true here since there is no Pixi at all).

---

## 7. Relic Golden Sample

Chosen slot: **CORE** (`RELIC_MATRIX_SLOTS[0]`, `domain/forge/types.ts`) —
its real archetype is "Ember Core" (`COMBAT_SLICE_RELIC_ARCHETYPES`,
`content/combat-slice/relicArchetypes.ts`), main stat `attack`. Most
representative first choice: `attack` is a universally-relevant stat
regardless of the equipped Battle Path (unlike e.g. FANG's `critChanceBps`,
which is Breaker-flavored), and CORE is the slot every other UI list
(`BuildSheet.tsx`'s Relic tab, `ForgeScreen.tsx`'s slot picker) renders
first — proving CORE proves the pattern every other slot already follows
identically in code.

- **1 Relic Matrix slot icon**: 128×128 px master / 64×64 WebP runtime,
  transparent, a small abstract glyph reading as "Core" — rendered today
  by the generic `Slot` component (`presentation/components/Slot.tsx`) at
  its default 72px CSS size; a 64px asset comfortably fills that without
  upscaling blur.
- **1 actual representative Relic object/art**: a distinct, larger "Relic
  card" image for Ember Core specifically (not just the slot glyph at a
  bigger size) — 320×320 px master / 160×160 WebP runtime, transparent.
  Rendered wherever a specific owned Relic instance is shown at detail
  size (`BuildSheet.tsx`'s expanded-slot candidate list, `ForgeScreen
  .tsx`'s "Latest Relic" panel) — both currently text/StatusPill only,
  this is the art those rows are missing.
- **1 rarity treatment/frame**: RARE tier (`RelicRarity`, `RELIC_RARITY_
  ORDER` — 3rd of 7 tiers) as the representative sample — common enough
  to be a realistic early forge result, distinct enough to prove a
  rarity-tier visual treatment exists at all. A frame/border overlay (not
  a re-render of the whole card) — 320×320 px, transparent except the
  border/glow ring, composited over the Relic art from the previous
  bullet. **Gap surfaced, not filled here**: no rarity→color-token
  mapping exists in the design system today (confirmed in POST_R7 audit
  §1/§3 — `elements.css` has one, rarity does not) — authoring this one
  RARE frame is Golden Sample scope; the remaining 6 tiers' frames and
  their color-token definitions are Wave 1 (§8 of POST_R7_ASSET_AUDIT.md).
- **Key comparison presentation**: already real, already built, no new
  art required — `forge-queries.ts`'s `relicComparison` (Power delta,
  Build Fit delta) is live in both `ForgeScreen.tsx`'s "Latest Relic"
  panel and `BuildSheet.tsx`'s Relic tab today. The Golden Sample's job
  here is purely visual (give the Relic itself an image) — the
  comparison UI needs no new asset to prove.

---

## 8. Golden Sample VFX

| VFX | Recommendation | Max dimensions | Duration | Blend/opacity | Reduced-motion fallback |
|---|---|---|---|---|---|
| Basic hit | **Code particle** (already implemented — `CombatantEntity.playHit`: red tint + shake) | n/a (no raster asset) | 220ms (`HIT_FLASH_MS`) | tint overlay, opaque | Tint-only, no shake (`animate()`'s `reduceMotion` branch already implemented) |
| Critical hit | **Code particle**, extending the same mechanism | n/a | ~1.5× the basic-hit duration (~330ms), a brighter tint | tint overlay, opaque | Tint-only, no shake — same fallback path as basic hit |
| One Fire Signature/skill | **Raster spritesheet** (recommended over shader/pure-code for a first real elemental VFX — a shader is unjustified engineering cost for one Golden Sample effect, and a convincing fire burst reads poorly as pure vector Graphics). Palette: `--el-fire-1 #C2481F` / `--el-fire-2 #E9762A` / `--el-fire-glow #FFB25E` (§0 item 07, `elements.css`, quoted exactly). | 128×128 px per frame, 6-frame horizontal strip (768×128 sheet) | ~500ms at 12fps | normal/additive blend, fading opacity across the last 2 frames | Static single frame (frame 3 of 6) held for 150ms, no strip playback |
| Forge reveal | **Code particle** (radial glow burst via Pixi `Graphics`, mirroring the existing `BattleSceneRenderer.showOutcomeBanner`'s fade-in/out pattern) | n/a | `DURATION.vfxMax` = 2000ms, fading over the final `DURATION.vfx` = 900ms (exact constants already in `presentation/motion/index.ts`, already used identically for the battle outcome banner) | additive glow, fading alpha | Static (no fade animation), same instant-show/instant-hide the battle banner already does under `reduceMotion` (`DURATION.fast` = 140ms) |

**DEFERRED, not just unspecified (§0 items 04/05)**: which skill id the
Fire strip binds to, and its anchor offset relative to the target, are
both genuinely unresolvable from the current domain model — no
`elementId`/VFX field exists on `SkillDefinition` (skills are Battle-
Path-bound, not species/element-bound), and no per-skill VFX
anchor/offset API exists in `BattleSceneRenderer`/`CombatantEntity`
today (only the screen-centered outcome banner and the target's-own-
position hit-flash exist). The row above specifies the raster shape
(dimensions/format/palette) so production can start the moment a binding
exists; it does not specify a play trigger, because there isn't one yet.

None of these are produced by this document — the table exists so a
Designer/engineer pairing on Wave 0 knows the exact technical shape
(spritesheet vs. code) before any pixel is drawn, per this campaign's own
instruction not to produce VFX yet.

---

## 9. Asset IDs / file contract

Extends the existing `AssetId -> AssetMetadata -> resolve-asset.ts`
pipeline (`domain/assets/types.ts`, `presentation/assets/resolve-asset.ts`)
with a third resolution strategy, matching `productionAssets.ts`'s
`sourcePath`/`runtimePath` split exactly — WebP-first runtime, PNG masters
only (Doc 13's existing rule; the vertical-slice pipeline this reuses
already normalizes from PNG masters to whatever runtime format is
declared).

Production masters land under the NEW `ascension-wave0/` subtree
(created by this reconciliation pass, kept separate from the Shop-loop
`generated-v1/normalized-v1` folders that already exist one level up) —
`reference/design-production/ascension-wave0/generated-v1/` and
`.../ascension-wave0/normalized-v1/`, mirroring the existing category-
folder convention (`combat/`, `forge/`, `relic/`, `vfx/` subfolders,
matching `environments/`, `stations/`, etc.). `preloadClass` resolves §0
item 08 against the real `AssetPreloadClass` enum (`domain/assets/
types.ts`) — the assignment is real, the resolver wiring to honor it is
not (see §0 item 08).

| Subject | AssetId | Generated master | Normalized master | Runtime | Format | `preloadClass` |
|---|---|---|---|---|---|---|
| Flamarox idle | `combat.flamarox.idle` | `reference/design-production/ascension-wave0/generated-v1/combat/flamarox/idle.png` | `reference/design-production/ascension-wave0/normalized-v1/combat/flamarox/idle.png` | `public/assets/combat-slice/flamarox/idle.webp` | WebP, 240×240, alpha | `CURRENT_CONTEXT` |
| Ember Wisp idle | `combat.ember-wisp.idle` | `.../ascension-wave0/generated-v1/combat/ember-wisp/idle.png` | `.../ascension-wave0/normalized-v1/combat/ember-wisp/idle.png` | `public/assets/combat-slice/ember-wisp/idle.webp` | WebP, 240×240, alpha | `CURRENT_CONTEXT` |
| Vulkan Warden idle | `combat.vulkan-warden.idle` | `.../ascension-wave0/generated-v1/combat/vulkan-warden/idle.png` | `.../ascension-wave0/normalized-v1/combat/vulkan-warden/idle.png` | `public/assets/combat-slice/vulkan-warden/idle.webp` | WebP, 400×400, alpha | `CURRENT_CONTEXT` |
| Vulkankrater background | `combat.vulkankrater.background` | `.../ascension-wave0/generated-v1/combat/vulkankrater/background.png` | `.../ascension-wave0/normalized-v1/combat/vulkankrater/background.png` | `public/assets/combat-slice/vulkankrater/background.webp` | WebP, 1280×800, opaque | `CURRENT_CONTEXT` |
| Rift Forge base | `forge.base` | `.../ascension-wave0/generated-v1/forge/base.png` | `.../ascension-wave0/normalized-v1/forge/base.png` | `public/assets/forge/base.webp` | WebP, 320×320, alpha | `CURRENT_CONTEXT` |
| Rift Forge charged overlay | `forge.charged-overlay` | `.../ascension-wave0/generated-v1/forge/charged-overlay.png` | `.../ascension-wave0/normalized-v1/forge/charged-overlay.png` | `public/assets/forge/charged-overlay.webp` | WebP, 320×320, alpha | `ON_DEMAND` |
| Rift Forge reveal overlay | `forge.reveal-overlay` | `.../ascension-wave0/generated-v1/forge/reveal-overlay.png` | `.../ascension-wave0/normalized-v1/forge/reveal-overlay.png` | `public/assets/forge/reveal-overlay.webp` | WebP, 320×320, alpha | `ON_DEMAND` |
| CORE slot icon | `relic.slot-icon.core` | `.../ascension-wave0/generated-v1/relic/slot-icon-core.png` | `.../ascension-wave0/normalized-v1/relic/slot-icon-core.png` | `public/assets/relic/slot-icon-core.webp` | WebP, 64×64, alpha | `ON_DEMAND` |
| Ember Core relic art | `relic.archetype.ember-core` | `.../ascension-wave0/generated-v1/relic/ember-core.png` | `.../ascension-wave0/normalized-v1/relic/ember-core.png` | `public/assets/relic/ember-core.webp` | WebP, 160×160, alpha | `ON_DEMAND` |
| RARE rarity frame | `relic.rarity-frame.rare` | `.../ascension-wave0/generated-v1/relic/rarity-frame-rare.png` | `.../ascension-wave0/normalized-v1/relic/rarity-frame-rare.png` | `public/assets/relic/rarity-frame-rare.webp` | WebP, 320×320, alpha | `ON_DEMAND` |
| Fire skill VFX strip | `vfx.fire-skill.strip` | `.../ascension-wave0/generated-v1/vfx/fire-skill-strip.png` | `.../ascension-wave0/normalized-v1/vfx/fire-skill-strip.png` | `public/assets/vfx/fire-skill-strip.webp` | WebP, 768×128 (6×128²), alpha | `ON_DEMAND` |

Masters follow the SAME generated → normalized → runtime chain
`productionAssets.ts` already documents (never destructively overwritten —
a revision gets a new `AssetMetadata.version`, not an in-place replace).
The two code-particle VFX rows from §8 (basic hit, critical hit, Forge
reveal) intentionally have no file entry here — they need no asset.

`resolve-asset.ts` needs one new strategy branch (a `combat`/`forge`/
`relic`/`vfx`-prefixed `AssetId` resolves via `runtimePath`, same
fallback-to-`undefined`-when-`PLACEHOLDER` behavior the vertical-slice
strategy already has) — not a parallel resolver function, keeping one
resolution entrypoint per CLAUDE.md §14. Not built by this reconciliation
pass (documentation/production-prep only).

---

## 10. Golden Sample Wave 0 — exact finite list

FLAMAROX
- idle battle cutout (512×512 master / 240×240 WebP runtime, transparent, bottom-center pivot)

EMBER WISP
- idle battle cutout (512×512 master / 240×240 WebP runtime, transparent, bottom-center pivot)

VULKAN WARDEN
- idle battle cutout (768×768 master / 400×400 WebP runtime, transparent, bottom-center pivot)

VULKANKRATER
- battle background (2560×1600 master / 1280×800 WebP runtime, opaque, 75%-down horizon line)

RIFT FORGE
- base asset (640×640 master / 320×320 WebP runtime, transparent, original Catchmon identity — no lamp/genie/bottle)
- charged/ready overlay (same canvas, additive glow layer)
- reveal overlay (same canvas, brief bright-flash layer)

RELIC
- CORE slot icon (128×128 master / 64×64 WebP runtime, transparent)
- Ember Core relic art (320×320 master / 160×160 WebP runtime, transparent)
- RARE rarity frame (320×320 master / 320×320 WebP runtime, transparent border/glow overlay)

VFX
- Fire skill spritesheet, 6 frames × 128×128 (768×128 sheet, transparent) — the one raster VFX asset in Wave 0; basic hit, critical hit, and Forge reveal are code-driven, no asset needed. **Dimensions/format/palette are ready; the skill-id binding and anchor offset are not (§0 items 04/05)** — generate the strip itself if desired (it needs no gameplay change to draw), but do not wire it to a specific skill or a specific play position until that binding is added in code; treat it as a validated art asset waiting on an engineering seam, not a finished feature.

**14 raster files total.** Explicitly excluded from Wave 0 (per this
campaign's own scope boundary): the remaining 5-11 slice Catchmons'
battle art, any Ozean production asset, Regions 3-17, the broader Relic
catalog (7 remaining slots, 6 remaining rarity frames), the 7 remaining
Vulkankrater/Ozean enemies' battle art, and any final automation/Auto-
Forge art.

---

## 11. Reconciliation status

Ten TO-FILL values from the design package's own register (§0): **six
resolved** (01 anchor/ground-line reading, 03 Journey geometry, 07 Fire
triad, 08 preload-class assignment, 09 Flamarox master, 10 not blocking),
**four genuinely deferred** with a stated reason rather than a guess (02
Forge host markup doesn't exist yet, 04 no skill-VFX binding exists, 05
no VFX anchor/offset API exists, 06 no rarity token exists). Production
folders `reference/design-production/ascension-wave0/{generated-v1,
normalized-v1,qa}/` exist and are empty — no art generated, no
normalization run, no runtime asset created, no gameplay code modified.

WAVE 0 CONTRACT RECONCILED — READY FOR ASSET GENERATION
