# 13 — Art Direction, Content & Asset Pipeline

# 1. Preserve Catchmon Identity

Existing Catchmon artwork remains the primary visual source.

Direction:
- stylized,
- collectible,
- cute + cool,
- clean silhouettes,
- controlled warm outlines,
- mobile-readable,
- strong elemental accents.

# 2. Deliberate Visual Separation

Do not use:
- mushroom protagonist silhouettes,
- genie/lamp imagery,
- competitor UI composition,
- copied iconography,
- copied stage backgrounds,
- copied animation timing,
- copied event banners.

# 3. Rift Forge Fantasy

Working concept:

A compact elemental machine / ancient prism device that:
- absorbs Echo Charges,
- refracts elemental light,
- crystallizes a Relic,
- uses circular/triangular resonance motifs.

Avoid lamp, genie, bottle or lantern silhouettes.

# 4. Combat Camera

Mobile portrait scene.

Recommended:
- 2.5D side-view or shallow diagonal lane,
- Lead Catchmon left/lower side,
- enemy right/upper side,
- readable effects,
- restrained combat text.

Do not imitate another game's exact battlefield framing.

# 5. Catchmon Assets

Existing portraits/WebP remain useful.

Future production may need:
- battle cutouts,
- idle animation,
- attacks,
- hit reactions,
- evolution sequences.

Prototype may reuse static cutouts before full animation production.

# 6. Region Art

Eventually each world needs:
- region card/thumbnail,
- battle background set,
- boss arena,
- props,
- elemental VFX grammar.

Produce one Region at a time after gameplay identity is locked.

# 7. Relic Art

Relics are abstract magical equipment compatible with different creature body plans.

Need:
- slot icons,
- rarity treatment,
- effect icons,
- representative Relic illustrations.

Avoid humanoid armor dependency.

# 8. Element VFX Grammar

Each Element gets:
- accent palette,
- shape language,
- particle behavior,
- impact grammar.

Examples:
- Fire = burst/expansion,
- Water = flow/arc,
- Steel = angular impact,
- Psychic = layered waves,
- Cosmic = deep-space distortion.

Avoid full-screen saturation spam.

# 9. UI Art

UI feels like Catchmon:
- warm materials,
- modern readability,
- magical utility,
- less ornamental clutter than typical gacha UI.

# 10. Asset Pipeline

All runtime art remains:

AssetId
→ AssetMetadata
→ resolver
→ React/Pixi.

No component hardcodes provenance paths.

# 11. Runtime Format

Prefer:
- WebP for runtime raster,
- PNG where alpha/pipeline requires it,
- AVIF only after validation.

Do not repeat the prior oversized-PNG production problem.

# 12. Provenance

Keep separate:
- generated masters,
- normalized masters,
- runtime copies.

Never destructively overwrite source masters.

# 13. Production Waves

## Wave 0
Rift Forge golden sample + combat-scene style test.

## Wave 1
Lead Catchmons + first Region + Forge + first Relic set.

## Wave 2
Second Region + bosses + Bond Supports + skill VFX.

## Wave 3
Scale templates for Regions 3–17.

# 14. Stop Gates

Do not mass-produce art until:
- combat camera validated,
- Forge screen locked,
- one battle background works in real mobile build,
- one Catchmon battle-asset pipeline is proven.

# 15. Exit Gate

- visually distinct at a glance,
- Catchmons remain stars,
- Forge cannot be mistaken for a magic lamp,
- runtime assets load acceptably,
- one new Region can be produced from documented template.
