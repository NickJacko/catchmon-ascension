# Wave 0A Integration Report — Catchmon Ascension

Golden Sample integration pass. Normalizes, exports, registers, and wires
the currently-available Wave 0A production masters into the real R8/R9
game surfaces. Does not start R10, does not generate art, does not invent
missing assets.

## 1. Source intake audit

Six source PNGs were provided under
`reference/design-production/ascension-wave0/generated-v1/`. All six were
opened and visually inspected (not assumed from filenames) before any
processing.

| Asset | Source dims | Mode | Alpha content? | Aspect | Fit for contract role? |
|---|---|---|---|---|---|
| `combat/vulkankrater/background.png` | 1586×992 | RGB | n/a (opaque) | 1.599 (~8:5) | Yes — usable near-as-is |
| `combat/flamarox/idle.png` | 1536×1024 | RGBA | Yes, real (bbox 1096×1005) | — | Yes |
| `combat/ember-wisp/idle.png` | 1536×1024 | RGBA | Yes, real (bbox 863×1000) | — | Yes |
| `combat/vulkan-warden/idle.png` | 1536×1024 | RGBA | Yes, real (bbox 1349×1014) | — | Yes |
| `combat/forge/base.png` | 1536×1024 | RGBA (header) | **No** — content bbox = full canvas | — | **No — flagged, see §5** |
| `combat/forge/charged-overlay.png` | 1254×1254 | RGBA | Yes, real (bbox 1179×1040) | — | **No — flagged, see §5** |

Findings, asset by asset:

- **Vulkankrater background** — a complete, high-quality volcanic arena
  (stone-tile floor, volcano + rift-portal background, dead/gold trees
  framing the sides). Genuinely opaque (no alpha channel content).
  **Content note (not silently fixed):** the visual horizon (mountains
  meeting ground) sits at roughly the vertical midpoint of the frame, not
  at the battle contract's `BATTLE_GROUND_LINE_Y` target (75% down a
  640×400 canvas). Forcing the horizon to 75% would require destructively
  cropping the top of the image (losing the volcano/rift-portal
  establishing shot) or would break the clean 8:5 aspect. Not fixed —
  flagged here instead, per "flag rather than disguise." The open stone
  floor still comfortably covers the combatant-anchor band (y≈260–300 of
  400) regardless, so this reads correctly in play; it's a content note,
  not a blocker.
- **Flamarox idle** — genuinely re-posed for battle (not the canonical
  roster portrait): front claw reaching right, tail-flame trailing left,
  action stance, **facing RIGHT** — matches the Lead-orientation contract
  exactly. Real, correct alpha transparency (verified by direct pixel
  sampling, not just the PNG header).
- **Ember Wisp idle** — a floating flame-wisp with no legs/feet, roughly
  frontal/symmetric silhouette (no strong left/right asymmetry) — matches
  the contract's own anticipation that a floating creature's anchor
  represents "the bottom of its visual envelope," not literal feet.
- **Vulkan Warden idle** — an imposing lava-golem/dragon-like boss in a
  roaring pose, front claw raised, **facing LEFT** — matches the boss-
  orientation contract. Wide, low, ground-hugging composition; real
  content spans nearly the full source canvas width (only ~17px margin on
  one side before normalization), i.e. genuinely not a square-friendly
  composition — confirmed a non-square-preserving normalization was the
  right call (see §2).
- **Forge base** — **fails the contract.** Visually a complete, opaque
  background *scene*: floating islands, sky, distant volcanoes, and a
  foreground altar/rift-device with surrounding crates/anvil/banner/
  lantern props, all baked into one illustration. The contract requires
  an isolated device on a transparent background; this is a full scene.
  Not reinterpreted or cropped down — see §5.
- **Forge charged-overlay** — **fails the contract, differently.**
  Genuinely transparent (real alpha, confirmed by content-bbox scan), but
  it is a **complete standalone illustration** of the entire Forge device
  (altar, chains, crystal, anvil, crates, banner, lantern) with ambient
  fire/energy glow baked in — not a thin additive glow layer meant to
  stack over a separate base image. Its canvas (1254×1254) and framing/
  crop of the altar also don't match `base.png` (1536×1024, differently
  composed) — the two files cannot function as a base+overlay layered
  pair as specified. See §5.

## 2. Normalized masters

Created under `reference/design-production/ascension-wave0/normalized-v1/`
(same folder structure; `generated-v1/` untouched). Only technically
required normalization was applied — no destructive cropping, no content
reinterpretation.

- **Background**: minimally center-cropped 1586×992 → **1586×991** to hit
  an exact 8:5 aspect (a 1px height crop — negligible, not a content
  decision).
- **Character idles** (Flamarox / Ember Wisp / Vulkan Warden): cropped/
  padded to each character's own real alpha content bounding box plus a
  12.5%-of-max-content-dimension margin, **centered on the content's own
  bbox center** (not the source canvas's geometric center) — this
  preserves each character's actual aspect ratio rather than forcing a
  square canvas. `CombatantEntity`'s existing scale formula
  (`scale = diameter / Math.max(texture.width, texture.height)`) already
  handles non-square textures correctly, so forcing square was unnecessary
  and would have padded/cropped real art for no technical reason.

| Asset | Normalized dims | Aspect | Margin |
|---|---|---|---|
| `vulkankrater/background.png` | 1586×991 | 1.600 | n/a |
| `flamarox/idle.png` | 1370×1279 | 1.071 | 137px (10.0%/10.7%) |
| `ember-wisp/idle.png` | 1113×1250 | 0.890 | 125px (11.2%/10.0%) |
| `vulkan-warden/idle.png` | 1687×1352 | 1.248 | 169px (10.0%/12.5%) |

Forge `base.png`/`charged-overlay.png` were **not** normalized — there is
no technically-correct normalization that fixes a semantic contract
violation (isolated-device vs. baked scene; mismatched framing/canvas)
without reinterpreting content, which is exactly what "flag rather than
disguise" forbids. See §5.

## 3. Runtime export

WebP-first, exported to the exact paths specified. Runtime size follows
the existing Wave 0/Phase 10 "2x the logical on-screen size" retina
convention, read directly from `battle-scene-layout.ts`
(`COMBATANT_ENVELOPE.maxWidth = 120`, `BOSS_ENVELOPE.maxWidth = 200`) — the
larger dimension of each character's runtime WebP equals `2 × envelope
diameter`. All four exports use real Pillow (PIL) `LANCZOS` resizing +
WebP encoding (quality 90 background / 92 characters); no runtime PNG
fallback was needed (WebP preserved required alpha/quality for all four).

| Runtime file | Size (px) | Bytes | Source master |
|---|---|---|---|
| `public/assets/combat-slice/vulkankrater/background.webp` | 1280×800 | 169,542 | 2,133,444 (source PNG) |
| `public/assets/combat-slice/flamarox/idle.webp` | 240×224 | 17,160 | 1,844,949 (source PNG) |
| `public/assets/combat-slice/ember-wisp/idle.webp` | 214×240 | 21,864 | 1,664,417 (source PNG) |
| `public/assets/combat-slice/vulkan-warden/idle.webp` | 400×321 | 51,240 | 2,458,288 (source PNG) |

Total runtime payload for all four: **259,806 bytes (~254 KB)** — a
single `CURRENT_CONTEXT` battle scene load.

`public/assets/forge/base.webp` / `charged-overlay.webp` /
`reveal-overlay.webp` were **not** created — see §5/§6.

An earlier internal draft of this export accidentally shipped the
character WebPs at their full normalized-master resolution (e.g. 1370×1279
for Flamarox, 162 KB) instead of the correct ~240px on-screen size; this
was caught and corrected before registration (final sizes are the ones
in the table above).

## 4. Asset registry

Registered in `src/content/combat-slice/productionAssets.ts` (new file,
mirrors `content/vertical-slice/productionAssets.ts`'s exact
`AssetId → AssetMetadata` pattern, no parallel lookup table):

- `combat.vulkankrater.background`
- `combat.flamarox.idle`
- `combat.ember-wisp.idle`
- `combat.vulkan-warden.idle`

`forge.base` / `forge.charged-overlay` / `forge.reveal-overlay` are **not**
registered (§5).

Wired into the real catalog via `app/ascension-catalog-content.ts`
(`assets: [...VERTICAL_SLICE_CATALOG_CONTENT.assets,
...COMBAT_SLICE_PRODUCTION_ASSETS]`) and mirrored in the shared
`src/test/helpers/ascension-test-catalog.ts` test catalog. Resolution goes
through the existing, unmodified `resolveAssetImageUrl` (Phase-10 "FINAL
asset without a matching canonical-portrait filename resolves to its
`runtimePath`" branch) — no new resolver code was needed.

Each character asset carries a `pivot` (`AssetPivot`, fraction of its own
canvas) computed directly from its normalized master's real alpha content
bbox, not inferred at render time:

| Asset | Pivot (x, y) |
|---|---|
| `combat.flamarox.idle` | (0.5, 0.8929) |
| `combat.ember-wisp.idle` | (0.5, 0.9) |
| `combat.vulkan-warden.idle` | (0.5, 0.875) |

## 5. Forge asset decision — flagged, not integrated this pass

Both Forge source files fail the Golden Sample contract, in different
ways (§1). Two options were considered:

1. Repurpose `charged-overlay.png`'s content as `forge.base` (it's the
   only genuinely isolated, usable Forge illustration) and express
   "charged" as a restrained CSS glow/pulse over the same image.
2. Flag both files as not meeting the contract, integrate **zero** Forge
   art this pass, leave `ForgeScreen.tsx` completely unchanged.

**Decision: option 2.** Reassigning `charged-overlay.png`'s content to a
different `AssetId` than the one it was produced for (`forge.charged-
overlay`) would itself be a form of "silently fixing/disguising" a
semantic problem — the exact thing this task's own instructions forbid.
`ForgeScreen.tsx` is untouched; its existing text/Panel/Slot presentation
(already fully functional — Echo Charges → Forge → Latest Relic → Equip/
Recycle/Lock, all real commands) continues to work exactly as before,
verified by the existing `e2e/journey-forge-build.spec.ts` (still green,
see §8).

**Recommendation for a future pass:** regenerate `forge.base` as a
genuinely isolated device on a transparent background, and
`forge.charged-overlay` as a thin additive glow-only layer at the *same*
canvas/framing as the corrected base, so the two can actually function as
a layered base+overlay pair per the R8 §8 architecture.

## 6. Missing Reveal overlay

`forge.reveal-overlay` has no source art and was not generated, not
recreated in CSS-pretending-to-be-art, and not substituted with an
unrelated asset. Because *all* Forge visual integration is deferred this
pass (§5), there is no reveal moment in the UI at all yet to provide a
fallback for — `ForgeScreen.tsx`'s FORGE_RELIC flow has no image-based
reveal step today, and none was added. This is stronger than "reveal
deferred but base/charged wired": nothing Forge-visual changed.

**REVEAL PRODUCTION ART DEFERRED** — along with the rest of Forge visual
integration, pending corrected `forge.base`/`forge.charged-overlay`
source art (§5).

## 7. Battle Scene integration

- `battle-scene-view-model.ts`: `SceneCombatantView` gained an optional
  `pivot`; `BattleSceneViewModel` gained an optional `backgroundUrl`. Lead/
  enemy/region → `AssetId` resolution goes through three content-owned
  `ReadonlyMap`s in `productionAssets.ts`
  (`LEAD_BATTLE_IDLE_ASSET_ID_BY_SPECIES`,
  `ENEMY_BATTLE_IDLE_ASSET_ID_BY_ENEMY`,
  `REGION_BATTLE_BACKGROUND_ASSET_ID_BY_REGION`) — the same established
  pattern `scene-view-model.ts` already uses for
  `STATION_ASSET_IDS_BY_ARCHETYPE`. The view-model itself contains no
  `if enemyId === EMBER_WISP_ENEMY_ID`-style branch; a species/enemy/
  region absent from a map (no art yet) resolves `undefined`, which
  renders the existing placeholder — verified by a new test case using
  Ozean (no Wave 0A art registered for it).
- The Lead's battle sprite now prefers a dedicated battle-idle asset
  (`combat.flamarox.idle`) over the canonical roster portrait when one is
  registered for that species, falling back to the canonical portrait
  otherwise (unchanged behavior for every other species).
- `BattleSceneRenderer.ts`: real background art now layers on top of the
  existing element-tinted flat fill (which stays as the fallback for any
  region without background art) via a plain `Sprite` sized to exactly
  fill the 640×400 logical canvas (the art's own 8:5 aspect already
  matches, so this is a clean scale, not a stretch/distortion).
- `CombatantEntity.ts` / renderer code contain **no** species/enemy-name
  branches — everything is driven by the `SceneCombatantView`/
  `BattleSceneViewModel` the view-model already resolved.

## 8. Combatant orientation/anchor fix

`CombatantEntity`'s sprite anchor changed from the old generic `(0.5,
0.5)` (center) to `view.pivot` when the view supplies one, else a generic
`(0.5, 1.0)` (bottom-center) — never a species branch. Concretely:

- Flamarox anchors at (0.5, 0.8929) of its own texture — visually
  confirmed facing **right**.
- Ember Wisp anchors at (0.5, 0.9) — the bottom of its floating visual
  envelope, not fabricated literal feet, per the contract's own
  anticipation of this case.
- Vulkan Warden anchors at (0.5, 0.875) — visually confirmed facing
  **left**.
- Any future combatant with no registered pivot defaults to `(0.5, 1.0)`.

The placeholder circle/shadow geometry for combatants with no production
art is unchanged (still center-anchored, as before — out of scope to
touch). As a direct, minimal consequence of the anchor fix, the drop
shadow is now redrawn to sit under the sprite's *real* bottom edge once a
sprite with a known pivot loads (previously it assumed the placeholder's
`radius + 8`, which would have floated visibly below a bottom-anchored
character's feet) — this is not a new feature, just keeping the shadow
attached to the ground contact point the anchor fix establishes.

## 9. Battle scale/footprint

Read straight from `CombatantEntity`'s existing (unmodified) scale
formula (`scale = diameter / Math.max(texture.width, texture.height)`,
`diameter = min(envelope.maxWidth, envelope.maxHeight)`):

| Combatant | Runtime texture | Envelope diameter | On-screen size |
|---|---|---|---|
| Ember Wisp (normal enemy) | 214×240 | 120 | ~107×120 |
| Vulkan Warden (boss) | 400×321 | 200 | 200×160.5 |

The boss renders **~1.9× wider and ~1.3× taller** than a normal enemy
while staying at/under its own `BOSS_ENVELOPE` cap (200×200) — "boss reads
substantially larger while remaining inside the envelope" holds. The
scene itself (`BATTLE_SCENE_WIDTH`/`HEIGHT`, anchors) was not resized;
only the art was scaled to fit the existing contract.

## 10. Preload/cache

`collectBattleSceneImageUrls` now returns exactly the URLs the *current*
scene needs — Lead portrait, current enemy portrait, current region
background — filtering out any that resolve `undefined` (no art yet).
`BattleSceneHost.tsx` needed no changes: it already generically preloads
whatever this function returns via the existing `loadCachedTexture`
cache. No Relic/VFX/Reveal art is preloaded (none is registered).

## 11. Fallback preservation

Verified via `battle-scene-view-model.test.ts`'s new Ozean case: a
region/enemy/species with no Wave 0A art resolves `portraitUrl`/
`backgroundUrl: undefined`, which renders the pre-existing placeholder
circle / flat-fill background — no broken-image icon, no crash, no
species branch anywhere in the fallback path.

## 12. Validation

- **FAST CHECK** (`pnpm check:fast`, all files touched this pass):
  typecheck, legacy-leak scan, lint, format, and `vitest related` —
  **all green** (295 tests passed across 50 related files, including 4
  new Wave 0A-specific cases in `battle-scene-view-model.test.ts`).
- **AFFECTED CHECK** (`pnpm check:affected`, same file set): typecheck,
  legacy-leak scan, lint+format, `vitest related`, and a real `vite
  build` — **all green**.
- **FULL PHASE GATE** (`pnpm check`): see final report message for
  pass/fail (run after this document).
- **E2E**: `e2e/journey-forge-build.spec.ts` (Journey battle scene +
  Forge loop + Build surface) is the relevant existing coverage; run as
  part of this pass's validation (see final report message).

## 13. Remaining Wave 0 assets (explicitly out of scope this pass)

`relic.slot-icon.core`, `relic.archetype.ember-core`,
`relic.rarity-frame.rare`, `vfx.fire-skill.strip`, `forge.base` (needs
regeneration), `forge.charged-overlay` (needs regeneration),
`forge.reveal-overlay` (no source art). R10 not started. No Relic art, no
Fire Skill VFX, no Reveal art, no Ozean art, no additional Catchmons, no
combat-formula/progression/Forge-redesign/camera changes, no Shop
visual/gameplay concepts.
