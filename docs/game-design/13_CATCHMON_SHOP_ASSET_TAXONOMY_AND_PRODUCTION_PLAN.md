# CATCHMON SHOP — 13 ASSET TAXONOMY & PRODUCTION PLAN

**Status:** Asset Taxonomy & Production Plan v1  
**Purpose:** Convert the approved gameplay, UX, world, and art-direction architecture into a production-ready asset system: define exactly which asset classes exist, what is already reusable, what must be created, how assets are named and exported, which production specifications apply, and in what order assets should be generated so Catchmon Shop can scale without style drift or unnecessary rework  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  
- `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`  
- `06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`  
- `07_CATCHMON_SHOP_ACQUISITION_AND_EXPEDITIONS.md`  
- `08_CATCHMON_SHOP_SHOP_GROWTH_AND_INFRASTRUCTURE.md`  
- `09_CATCHMON_SHOP_PROGRESSION_AND_UNLOCK_ARCHITECTURE.md`  
- `10_CATCHMON_SHOP_WORLD_AND_ELEMENT_STRUCTURE.md`  
- `11_CATCHMON_SHOP_UX_AND_INFORMATION_ARCHITECTURE.md`  
- `12_CATCHMON_SHOP_ART_DIRECTION_AND_VISUAL_STYLE_BIBLE.md`  
- `reference/design-system/`  
- `reference/catchmons/`

**Authority:** This document owns:
- asset taxonomy,
- asset categories,
- asset IDs and naming rules,
- asset folder architecture,
- existing-vs-new asset classification,
- authoring master formats,
- runtime delivery format recommendations,
- export/background/alpha rules,
- size-class standards,
- product/resource/component asset standards,
- station/infrastructure asset standards,
- customer asset standards,
- region/environment asset standards,
- UI/icon asset standards,
- motion/VFX asset standards,
- Golden Sample definition,
- prototype asset scope,
- vertical-slice asset scope,
- full-production planning envelopes,
- asset-generation order,
- production gates,
- asset QA/checklists,
- reuse and versioning rules.

**Out of scope:**  
- exact final recipe names,
- exact final routine-material taxonomy,
- exact final special-component list,
- exact 104-Catchmon gameplay role mapping,
- exact final customer roster,
- exact final route list,
- exact final region unlock order,
- final renderer implementation,
- final compression settings per target device,
- final animation runtime,
- final CDN/deployment architecture,
- marketing campaign assets,
- store-page screenshots,
- paid cosmetic catalog,
- live-event assets.

---

# 1. WHY THIS DOCUMENT EXISTS

The project has deliberately postponed large-scale asset generation.

That was intentional.

Until Documents 01–12 were stable, the project did not yet know:

- what products actually exist,
- what stations exist,
- what customers do,
- what Catchmons do,
- how expeditions work,
- how 17 regions differ,
- how the interface works,
- what the visual language should be.

Now the system boundaries are stable enough to define a controlled asset pipeline.

The objective of Document 13 is:

> **generate the minimum correct asset system once, then scale it consistently.**

The project should not:

- create hundreds of unrelated images,
- generate every possible asset before gameplay validation,
- bake UI into content art,
- regenerate the 104 Catchmons unnecessarily,
- create one-off file conventions per feature.

---

# 2. ASSET PRODUCTION THESIS

The production thesis is:

> **Reuse canonical assets where possible, build reusable visual systems before content volume, prove each asset family through Golden Samples, and only then scale.**

The sequence is:

**EXISTING ASSET AUDIT**

↓

**GOLDEN SAMPLES**

↓

**PROTOTYPE ASSETS**

↓

**VERTICAL SLICE ASSETS**

↓

**CONTENT LOCK**

↓

**BATCH PRODUCTION**

↓

**QA / OPTIMIZATION**

↓

**RUNTIME DELIVERY**

---

# 3. ASSET STATUS CLASSES

Every asset entry must have exactly one production status.

## EXISTING_CANONICAL

Already exists and should be reused as the source of truth.

## EXISTING_ADAPT

Existing asset is usable but needs controlled adaptation/export.

## NEW_REQUIRED

Must be created for core gameplay.

## NEW_OPTIONAL

Useful later but not required for vertical slice.

## BLOCKED_BY_CONTENT

Asset cannot be produced correctly until content data is finalized.

## BLOCKED_BY_TECH

Visual definition is known but final export/runtime form depends on Technical Architecture.

## DEFERRED

Not part of the current production scope.

---

# 4. EXISTING CANONICAL ASSETS

The project already contains important reusable sources.

## 4.1 CATCHMONS

Location:

`reference/catchmons/`

Status:

# EXISTING_CANONICAL

Current known scope:

> **104 Catchmon images/assets**

These are the canonical creature identity source.

Do not regenerate or redesign them merely because Catchmon Shop has a new gameplay model.

---

# 5. CATCHMON ADAPTATION MAY STILL BE REQUIRED

Existing Catchmon art may need controlled technical adaptation such as:

- transparent-background cleanup,
- consistent canvas padding,
- normalized scale,
- standardized portrait crop,
- contact-shadow generation,
- thumbnail generation,
- optional in-world presentation variants.

These are:

# EXISTING_ADAPT

They are not creature redesigns.

---

# 6. DESIGN SYSTEM SOURCES

Location:

`reference/design-system/`

Includes:

- `tokens.css`
- `element-farbkompass.md`
- `motionTokens.ts`
- `regions.ts`
- `icons/`

Status:

# EXISTING_CANONICAL / REFERENCE

These sources define:

- semantic colors,
- element colors,
- spacing,
- typography tokens,
- motion values,
- existing iconography,
- canonical region identity references.

---

# 7. EXISTING ICON SET

Location:

`reference/design-system/icons/`

Before creating any new semantic icon:

1. search the existing shared icon set,
2. determine whether an existing icon communicates the concept,
3. reuse it if suitable,
4. only create a new icon if a clear semantic gap exists.

No duplicate visual synonym should be added merely because a feature team prefers another icon.

---

# 8. REGION IDENTITY REFERENCE

Existing `regions.ts` is reference-only for approved identity fields such as:

- stable region ID,
- region name,
- element.

Legacy Funken-related fields are not gameplay assets/data for Catchmon Shop.

---

# 9. MASTER ASSET TAXONOMY

The complete asset system is divided into twelve top-level families:

1. **CATCHMON**
2. **PRODUCT**
3. **RESOURCE**
4. **COMPONENT**
5. **UI_ICON**
6. **UI_TREATMENT**
7. **SHOP_ENVIRONMENT**
8. **STATION**
9. **INFRASTRUCTURE_PROP**
10. **CUSTOMER**
11. **REGION_WORLD**
12. **VFX_MOTION**

These categories must remain stable.

---

# 10. WHY RESOURCE AND COMPONENT ARE SEPARATE

Routine Materials and Special Components have different gameplay semantics.

Therefore their asset handling should be distinguishable.

## RESOURCE
Common/repeatable crafting input.

## COMPONENT
Scarcer/specialized crafting input.

They may share icon rendering style.

But their UI metadata/category remains distinct.

---

# 11. ASSET ID PHILOSOPHY

Every production asset must have a stable machine-readable ID.

File display names may change.

Asset IDs should not.

Recommended pattern:

```text
<category>_<semantic-id>_<variant?>
```

Examples:

```text
product_fieldgear_tracker_basic
resource_fiber_soft
component_fire_resonant_core
station_fieldworks_tier02
region_vulkankrater_card
ui_action_premium_pitch
customer_explorer_variant02
```

Exact content names remain subject to final content lock.

---

# 12. ID RULES

Asset IDs must:

- use lowercase,
- use ASCII,
- use underscores,
- avoid spaces,
- avoid punctuation beyond underscore,
- avoid display-name dependence where possible,
- remain stable after localization,
- describe semantic identity, not export size.

Bad:

```text
Cool Fire Sword FINAL 2.png
```

Good:

```text
product_elemental_fire_resonator
```

---

# 13. VERSIONING RULE

Do not put iteration words such as:

- final,
- final2,
- new,
- good,
- latest

inside asset IDs.

Versioning belongs to:

- source control,
- production metadata,
- revision folders if needed.

---

# 14. FOLDER ARCHITECTURE — RECOMMENDED

Recommended future runtime/source organization:

```text
assets/
├── catchmons/
│   ├── source/
│   ├── portraits/
│   ├── thumbnails/
│   └── world/
├── products/
│   ├── provisions/
│   ├── care/
│   ├── wearables/
│   ├── field-gear/
│   ├── capture-discovery/
│   ├── elemental/
│   └── habitat/
├── resources/
│   ├── routine/
│   └── components/
├── ui/
│   ├── icons/
│   ├── quality/
│   ├── rarity/
│   ├── status/
│   └── navigation/
├── shop/
│   ├── shell/
│   ├── displays/
│   ├── storage/
│   ├── support/
│   ├── expedition-hub/
│   └── props/
├── stations/
│   ├── provision/
│   ├── care/
│   ├── fieldworks/
│   ├── resonance/
│   └── habitat/
├── customers/
│   ├── archetypes/
│   ├── variants/
│   └── special/
├── regions/
│   ├── vulkankrater/
│   ├── ozean/
│   └── ...
└── vfx/
    ├── commerce/
    ├── crafting/
    ├── expedition/
    ├── capture/
    ├── evolution/
    └── progression/
```

Final exact code path belongs to Document 14.

---

# 15. SOURCE VS RUNTIME ASSETS

Keep source-quality assets separate from runtime-delivery assets.

## SOURCE MASTER

Used for:
- editing,
- regeneration,
- future exports.

## RUNTIME ASSET

Optimized for:
- browser/mobile,
- memory,
- loading.

Do not overwrite source masters with compressed runtime exports.

---

# 16. AUTHORING MASTER FORMAT — RASTER

Recommended master format for raster visual assets:

- PNG where transparency matters,
- high-quality lossless master,
- sRGB color space,
- no baked UI labels.

For complex editable art:
- keep original layered/source format privately in production storage where available.

The game repository does not need every huge editable source file.

---

# 17. RUNTIME RASTER FORMAT

Preferred runtime direction:

# WebP

with PNG fallback only where required.

AVIF may be considered after Technical Architecture/performance validation.

Do not prematurely require AVIF for all art.

---

# 18. VECTOR FORMAT

UI icons and simple semantic symbols should preferably be:

# SVG

when the existing icon architecture supports it.

Benefits:

- resolution independence,
- token-driven color,
- small file size,
- consistency.

---

# 19. NO SVG FOR COMPLEX PAINTERLY ART

Do not force:

- product paintings,
- Catchmons,
- region environments

into vector format.

Use the appropriate medium.

---

# 20. COLOR SPACE

All normal game art should be authored/exported in:

# sRGB

unless Technical Architecture defines a specialized pipeline.

This avoids cross-browser color surprises.

---

# 21. ALPHA RULE

Assets requiring transparency should use:

- clean alpha,
- no colored matte,
- no baked checkerboard,
- no visible fringe.

Transparent icon/source exports must be tested on:

- light background,
- dark background,
- element-colored background.

---

# 22. PREMULTIPLIED ALPHA BOUNDARY

Exact runtime alpha handling is Technical Architecture territory.

Source assets should preserve clean straight transparency.

---

# 23. TEXT-IN-ART RULE

Do not bake player-facing text into:

- product icons,
- resource icons,
- station art,
- region art,
- customer art,
- world map nodes.

Text belongs to UI/localization.

Exceptions require explicit visual/narrative justification.

---

# 24. SIZE CLASS SYSTEM

Instead of defining a unique resolution for every asset, use stable size classes.

## XS — MICRO ICON
UI glyph / tiny indicator.

## S — STANDARD UI ICON
Navigation/action/status.

## M — CONTENT ICON
Product/resource/component.

## L — PORTRAIT / CARD ART
Catchmon/customer/region card.

## XL — SCENE MODULE
station/shop/environment.

## XXL — MAJOR BACKDROP
region environment / shop scene source.

---

# 25. UI ICON MASTER SIZE

Recommended SVG artboard:

# `24 × 24`

or the existing canonical icon viewBox standard.

Where the shared icon system already uses a standard:

> match it exactly.

Do not create a second icon coordinate system.

---

# 26. CONTENT ICON MASTER SIZE

Recommended raster master for:

- products,
- routine resources,
- special components:

# `1024 × 1024 px`

transparent.

Rationale:

- enough generation/detail headroom,
- future high-density displays,
- easy downscaling.

Runtime exports may be much smaller.

---

# 27. CONTENT ICON RUNTIME SIZE CLASSES

Recommended runtime exports:

```text
128 × 128
256 × 256
512 × 512
```

The renderer should use responsive image selection where worthwhile.

Do not load 1024 px icons for 48 px UI use.

---

# 28. CATCHMON PORTRAIT MASTER

If current assets are high enough resolution:

reuse.

If standardized portrait exports are required:

recommended normalized master canvas:

# `1024 × 1024`

with species-specific padding rules.

Do not rescale the original source destructively.

---

# 29. CATCHMON THUMBNAILS

Runtime variants may include:

```text
128 × 128
256 × 256
512 × 512
```

depending on usage.

---

# 30. REGION CARD / VIGNETTE MASTER

Recommended master:

# `1600 × 900` or larger 16:9 source

for region cards, previews, and responsive crops.

Final world-map use may need separate crops.

---

# 31. REGION BACKDROP MASTER

Recommended source class:

# minimum `2560 × 1440`

for major environment backdrops.

If the final rendering architecture uses modular scene layers rather than flat backgrounds, this becomes a source-reference target rather than one runtime image.

---

# 32. SHOP SCENE MASTER

The shop should preferably be built from:

- modular environment pieces,
- station modules,
- display modules,
- background shell,

rather than one giant baked screenshot.

Exact scene export depends on Document 14.

---

# 33. CUSTOMER MASTER SIZE

For 2D/2.5D customer renders:

recommended authoring master:

# approximately `1024–1536 px` tall

with transparent background.

Exact runtime sprite dimensions depend on scene scale.

---

# 34. VFX FORMAT BOUNDARY

VFX may be implemented using:

- CSS,
- SVG,
- sprite sequence,
- small raster particle,
- shader,
- WebGL/canvas

depending on Technical Architecture.

Do not generate long pre-rendered video effects by default.

---

# 35. CATCHMON ASSET SYSTEM

The Catchmon asset family is divided into:

1. Canonical source art
2. Roster portrait
3. Catchdex thumbnail
4. In-world presentation asset
5. Encounter reveal asset
6. Capture/evolution presentation asset
7. Optional shiny/variant presentation
8. Contact shadow / grounding helper if needed

---

# 36. CATCHMON SOURCE ART

Status:

# EXISTING_CANONICAL

Count:

# 104

Do not regenerate.

---

# 37. CATCHMON NORMALIZATION PASS

Before use, audit all 104 for:

- source resolution,
- transparency,
- canvas padding,
- orientation,
- scale,
- color consistency,
- unwanted backgrounds,
- clipping,
- file format.

Create a normalization report.

---

# 38. CATCHMON NORMALIZATION OUTPUT

Each Catchmon should eventually have canonical references such as:

```text
sourceAssetId
portraitAssetId
thumbnailAssetId
worldAssetId
shinyAssetId?
```

Not every ID requires a different source image.

Multiple usages may reference derived exports from one source.

---

# 39. CATCHMON WORLD PRESENTATION

Do not create 104 entirely new scene renders if simple adaptation works.

Preferred sequence:

1. reuse canonical creature,
2. normalize,
3. add scene grounding,
4. add small animation layer where possible.

Only create bespoke work-state art when the vertical slice proves it is necessary.

---

# 40. CATCHMON WORK-STATE ENVELOPE

Do **not** plan:

> 104 Catchmons × 4 jobs × 5 animations

for initial production.

That would explode scope.

Preferred architecture:

- generic idle,
- generic active/work reaction,
- contextual scene props/effects,
- selected signature animations later.

---

# 41. CATCHMON GOLDEN SAMPLES

Choose at least:

- one small creature,
- one large creature,
- one bright creature,
- one dark creature,
- one highly detailed creature.

Test them inside the same shop scene.

This validates integration across the roster.

---

# 42. PRODUCT ASSET SYSTEM

Products are one of the largest new asset families.

Each product needs:

- stable product ID,
- product family,
- one base visual icon,
- optional element accent metadata,
- optional special/signature art.

Quality is not a separate rendered product asset by default.

---

# 43. PRODUCT FAMILIES

The seven product asset families are:

1. Provisions
2. Care & Comfort
3. Wearables
4. Field Gear
5. Capture & Discovery Gear
6. Elemental Craft
7. Habitat & Enrichment

Folder and metadata structures should preserve these families.

---

# 44. PRODUCT GOLDEN SAMPLE SET

Before any mass production, create exactly one approved sample per family.

Minimum Golden Product Set:

```text
01 Provision sample
02 Care sample
03 Wearable sample
04 Field Gear sample
05 Capture & Discovery sample
06 Elemental Craft sample
07 Habitat & Enrichment sample
```

All seven must be reviewed side-by-side.

---

# 45. GOLDEN PRODUCT SAMPLE REQUIREMENTS

Every sample must use:

- same camera family,
- same light direction,
- same canvas,
- same transparent-background rule,
- same detail density,
- same edge softness.

If the seven do not look like one catalog:

> stop production.

---

# 46. PRODUCT PROTOTYPE COUNT

Core mechanics prototype:

# 5 product icons

These can be polished placeholders or early Golden assets.

No need to build the full product catalog.

---

# 47. PRODUCT VERTICAL SLICE COUNT

From Document 04:

recommended content envelope:

# approximately 18–28 unique products

The vertical slice should cover:

- all seven families,
- several dual-use items,
- quality,
- one region content package,
- at least one signature product.

---

# 48. PRODUCT FULL-GAME PLANNING ENVELOPE

Initial full content planning remains:

# approximately 70–100 unique product definitions/icons

This is not a locked exact count.

Do not generate 100 icons until the product registry is content-locked.

---

# 49. PRODUCT ASSET BLOCKER

Full product icon batch status:

# BLOCKED_BY_CONTENT

until:

- product list,
- product IDs,
- family,
- functional role,
- element relationship

are finalized.

---

# 50. PRODUCT ICON SPEC

Master:

```text
1024 × 1024
transparent PNG
sRGB
centered three-quarter object
consistent padding
no text
no quality frame
no rarity frame
```

Recommended object occupancy:

# approximately 70–82% of canvas

with family-specific exceptions.

---

# 51. PRODUCT SHADOW RULE

Use either:

- subtle baked contact shadow within transparent icon,
- or runtime shadow system.

Choose one consistent approach during Golden Samples.

Do not mix randomly.

---

# 52. ELEMENT ACCENT RULE FOR PRODUCTS

Element-aligned products may use:

- material,
- glow,
- small colored detail.

Do not create a full colored background.

---

# 53. HYBRID PRODUCT RULE

Hybrid regional/element products should still use one base object illustration.

Do not add multiple competing element frames.

Metadata/UI handles element identity.

---

# 54. SIGNATURE PRODUCT RULE

Signature products may justify:

- extra detail,
- stronger material treatment,
- subtle unique effect.

They still follow catalog camera/lighting rules.

---

# 55. RESOURCE ASSET SYSTEM

Routine Materials require clear small icons.

The resource set should prioritize:

- material category readability,
- texture,
- silhouette.

They should not look like finished commercial products.

---

# 56. ROUTINE MATERIAL COUNT ENVELOPE

Exact material taxonomy is not yet locked.

Recommended planning envelope for initial full game:

# roughly 12–24 routine material definitions

This is an envelope, not a content decision.

The final count should remain as low as the economy can support.

---

# 57. WHY MATERIAL COUNT SHOULD STAY LOW

Too many routine materials create:

- inventory noise,
- recipe complexity,
- icon burden,
- regional mini-economies.

Reuse material families across regions.

---

# 58. ROUTINE MATERIAL GOLDEN SAMPLES

Before full material generation, create:

- one organic material,
- one mineral material,
- one textile/fiber material,
- one fluid/material-in-container,
- one technical material.

This validates the material icon language.

---

# 59. ROUTINE MATERIAL ICON SPEC

Same master class as product icons:

```text
1024 × 1024
transparent
strong silhouette
simpler detail than products
```

Material icons may use:

- grouped bundle,
- container,
- chunk,
- spool,
- vial

where that improves recognition.

---

# 60. SPECIAL COMPONENT ASSET SYSTEM

Special Components should visually feel:

- scarce,
- specific,
- premium.

But they should not all be:

> glowing crystals.

Use regional material logic.

---

# 61. SPECIAL COMPONENT COUNT ENVELOPE

Final count depends on regional/recipe content.

Recommended planning envelope:

# approximately 17–34 special-component definitions

This allows roughly one or two strong component identities per region without requiring it.

Not every region must receive exactly two.

---

# 62. COMPONENT GOLDEN SAMPLES

Create at least:

- Fire-linked component,
- organic component,
- technical component,
- spectral/psychic component,
- metallic component.

Side-by-side test for variety within one visual catalog.

---

# 63. COMPONENT ICON SPEC

Use the same technical canvas as products/resources.

Visually differentiate components through:

- cleaner presentation,
- controlled special material,
- rare accent,
- UI category treatment.

Do not create a separate icon camera.

---

# 64. CURRENCY / PROGRESSION SYMBOLS

Core symbolic assets include:

- Coins
- Shop Momentum
- Shop Rank

These must be visually distinct.

---

# 65. COINS ICON

Status:

# NEW_REQUIRED unless a suitable canonical coin icon already exists.

Before creation:

audit existing icon set.

If new:
- simple,
- commercial,
- readable at 16–24 px.

---

# 66. MOMENTUM SYMBOL

Status:

# NEW_REQUIRED unless suitable existing icon exists.

Must communicate:

- active flow,
- temporary leverage,
- shop energy.

It should not look like:

- premium currency,
- lightning element,
- XP star.

---

# 67. SHOP RANK SYMBOL

Status:

# NEW_REQUIRED unless suitable existing badge icon exists.

Must communicate:

- stable business progression,
- prestige/milestone.

It should not look spendable.

---

# 68. UI ICON TAXONOMY

New UI icons should be tracked in a registry.

Required semantic families likely include:

## PRIMARY NAVIGATION
- Shop
- Catchmons
- World

## CATCHMON DOMAINS
- Workshop
- Shop Floor
- Supply
- Expedition

## TRANSACTION ACTIONS
- Standard Sale
- Favorable Deal
- Premium Pitch
- Recommend
- Decline

## CRAFTING
- Craft
- Queue
- Quality
- Mastery
- Workshop Push

## WORLD
- Route
- Supply Run
- Component Hunt
- Discovery Survey
- Special Expedition

## DISCOVERY/CAPTURE
- Unknown
- Traced
- Encountered
- Owned
- Capture
- Capture Aid
- Shiny

## INVENTORY
- Reserved
- Product
- Material
- Component
- Gear

## PROGRESSION
- Shop Rank
- Upgrade
- Unlock
- Evolution
- Goal

---

# 69. UI ICON COUNT ENVELOPE

Do not assume every semantic word needs a unique icon.

After reuse audit, expected new-icon envelope:

# approximately 15–35 genuinely new icons

This is deliberately lower than the number of UI concepts.

Reuse existing primitives where semantics are clear.

---

# 70. UI ICON PRODUCTION ORDER

1. Audit existing icons.
2. Build missing primary nav icons.
3. Build domain icons.
4. Build transaction/action icons.
5. Build discovery/status icons.
6. Only then add secondary icons.

---

# 71. UI ICON SPEC

Preferred:

- SVG
- existing canonical viewBox convention
- currentColor/token compatible where appropriate
- no embedded raster texture
- readable at 20–24 px
- consistent stroke/fill rules

---

# 72. ELEMENT ICON SET

Need one canonical icon/symbol for each of the 17 real elements if the existing asset set does not already provide suitable ones.

Elements:

- Fire
- Water
- Electric
- Grass
- Earth
- Poison
- Normal
- Ice
- Fairy
- Wind
- Steel
- Psychic
- Light
- Dark
- Ghost
- Dragon
- Cosmic

No Bug icon.

---

# 73. ELEMENT ICON STATUS

First:

# AUDIT EXISTING

If complete and visually suitable:

reuse.

If incomplete:

create a matched replacement/addition set.

Avoid mixing 12 old icons with 5 visually unrelated new icons.

If extension cannot match:
- consider rebuilding the full 17-icon set intentionally.

---

# 74. QUALITY UI TREATMENT ASSETS

Need treatments for:

- Standard
- Fine
- Masterwork

Preferred implementation:

- vector/CSS frame treatment,
- small quality icon/symbol,
- optional subtle VFX for Masterwork.

Do not create product-specific frames.

---

# 75. QUALITY ASSET COUNT

Minimum:

- Fine treatment
- Masterwork treatment

Standard may simply use neutral/default presentation.

---

# 76. RARITY UI TREATMENTS

Catchmon rarity system should reuse existing canonical rarity semantics if present.

Do not create new rarity tiers merely for art.

Required visual treatment may include:

- badge,
- border,
- reveal VFX.

Exact tier count must come from canonical roster data.

---

# 77. SHINY TREATMENT ASSET

Shiny may need:

- small badge/icon,
- subtle reveal effect.

Do not create a separate UI frame that overwhelms Catchmon identity.

---

# 78. SHOP ENVIRONMENT ASSET SYSTEM

The Shop Environment family contains:

1. Shop shell/background
2. zone architecture
3. floor/wall structural modules
4. display units
5. storage units
6. Catchmon support area
7. Expedition Hub
8. Special/Prestige area
9. decorative props
10. construction/upgrade states

---

# 79. SHOP SHELL MACRO STATES

Document 08 planning envelope:

# approximately 4–6 macro visual shop states.

Asset production should initially target:

## VERTICAL SLICE
2 macro states:
- starter,
- visibly expanded.

## FULL GAME
4–6 as content demands.

---

# 80. SHOP SHELL PRODUCTION STRATEGY

Prefer modular growth.

Example:

- base shell,
- extension wing,
- upgraded trim,
- lighting layer,
- zone reveal.

Avoid requiring one fully redrawn shop image for every numerical upgrade.

---

# 81. SHOP SHELL STATUS

Vertical-slice shell assets:

# NEW_REQUIRED

Full-game macro states:

# BLOCKED_BY_PROGRESSION / ART IMPLEMENTATION

until exact visual milestone mapping is approved.

---

# 82. DISPLAY UNIT ASSETS

Core display families likely require:

1. General Shelf / Display
2. Counter / Compact Display
3. Rack / Gear Display
4. Premium Pedestal / Case

Not all are required immediately.

---

# 83. DISPLAY ASSET REUSE

Displays should be reusable across product families.

Avoid:

- Fire shelf,
- Water shelf,
- Grass shelf,
- etc.

Element identity comes from merchandise/context.

---

# 84. DISPLAY VERTICAL SLICE SCOPE

Recommended:

- 1 standard display family,
- 1 premium display family.

Use visual variants/attachments if needed.

---

# 85. STORAGE ASSETS

Need visual representation for:

- routine materials,
- products,
- special components.

This does not require three completely separate buildings.

Recommended visual modules:

- general crates/racks,
- product shelving/stock area,
- special sealed/glass component storage.

---

# 86. STORAGE UPGRADE STATES

Planning envelope:

# 2–3 meaningful visual states

per major storage module.

Do not render a unique asset for every capacity level.

---

# 87. CATCHMON SUPPORT AREA ASSETS

Core assets may include:

- resting platform,
- cushion/perch,
- enrichment prop,
- assignment/roster interaction anchor.

Vertical slice needs only a small coherent support area.

---

# 88. EXPEDITION HUB ASSETS

Core visual modules:

- route/map board,
- gear rack,
- dispatch platform/door,
- returned-result state,
- optional upgrade attachments.

---

# 89. EXPEDITION HUB VERTICAL SLICE

Minimum:

- base hub,
- ready/returned state,
- one visible upgrade or expanded state if progression requires.

---

# 90. SPECIAL / PRESTIGE SPACE

Status:

# DEFERRED / BLOCKED_BY_CONTENT

Do not produce a full asset set until the actual late-game system using it is locked.

---

# 91. DECORATIVE PROP SYSTEM

Decorative assets support:

- warmth,
- shop ownership,
- world connection.

Examples:

- plants,
- banners,
- lamps,
- crates,
- books,
- jars,
- wall decor,
- trophies.

They should not be mass-produced before the functional environment works.

---

# 92. DECOR PROP VERTICAL SLICE ENVELOPE

Approximately:

# 8–16 reusable props

is enough to create visual richness for the first polished shop.

---

# 93. DECOR FULL-GAME ENVELOPE

A broader initial release may use:

# approximately 30–60 reusable props

depending on visual customization ambitions.

This is optional content volume, not a core requirement.

---

# 94. STATION ASSET SYSTEM

The five station families are:

1. Provision Station
2. Care Atelier
3. Fieldworks Bench
4. Resonance Lab
5. Habitat Workshop

Each requires:

- strong base silhouette,
- Catchmon interaction zone,
- major upgrade-state plan,
- ready/active visual state.

---

# 95. STATION GOLDEN SAMPLE

Do not create all five × all tiers first.

Start with:

# Fieldworks Bench or Provision Station

because both are mechanically clear and visually useful for prototype.

Create:

- base state,
- upgraded state,
- active state.

Approve them against the shop.

---

# 96. STATION MAJOR VISUAL STATE ENVELOPE

Document 12 planning target:

# approximately 3–5 major visual states per station

for full game.

Recommended production interpretation:

- 3 core states minimum,
- 4th/5th only if progression/art needs them.

---

# 97. STATION FULL-GAME MAX PLANNING ENVELOPE

At 5 stations × up to 5 major states:

# maximum planning envelope ≈ 25 station state visuals

This is not a mandate.

Modular attachments should reduce unique full redraws.

---

# 98. STATION VERTICAL SLICE SCOPE

Need:

- 2 station families,
- 2 visual states each,
- active/ready state support.

Approximate:

# 4 major station visuals + state effects

for the polished vertical slice.

---

# 99. STATION STATE VS FULL ASSET

Do not create separate full images for:

- idle,
- crafting,
- ready

if those can be expressed by:

- animation,
- overlay,
- prop,
- effect.

Separate assets should represent structural visual progression.

---

# 100. CUSTOMER ASSET SYSTEM

Customers are divided into:

1. Walk-In
2. Focused
3. Special Visitor
4. Commission/Order Client presentation

Functional logic does not require one unique visual per mechanic.

---

# 101. CUSTOMER BASE ARCHETYPE ENVELOPE

From Document 05:

initial full-game planning envelope:

# approximately 10–16 functional customer archetypes

But visual archetypes may be fewer or differently grouped.

---

# 102. CUSTOMER VISUAL PRODUCTION STRATEGY

Use:

- reusable body/proportion templates,
- outfit/accessory variants,
- color variants within controlled palettes,
- shared animation sets.

Avoid one-off fully bespoke hero art for every normal customer.

---

# 103. CUSTOMER VERTICAL SLICE SCOPE

Recommended:

- 3 normal customer visual archetypes,
- 2–3 variants each if cheap,
- 1 special visitor.

This is enough to make the shop feel populated.

---

# 104. CUSTOMER PROTOTYPE SCOPE

Mechanics prototype may use:

- 1 generic customer asset,
- 1 focused variant,
- 1 special marker.

Do not block mechanics on final character art.

---

# 105. CUSTOMER MASTER EXPORT

If rendered as 2D/2.5D character sprites:

- transparent background,
- standardized baseline,
- consistent body scale,
- same camera facing.

---

# 106. CUSTOMER ANIMATION ENVELOPE

Minimum reusable states:

- idle,
- walk/browse,
- request,
- positive reaction,
- leave.

Special visitors may add one unique gesture.

Do not create dozens of custom animations per archetype.

---

# 107. REGION / WORLD ASSET SYSTEM

The 17 region family needs:

1. Region icon / element icon
2. Region card/vignette
3. World-map node treatment
4. Region detail backdrop/environment
5. Route visual support
6. environmental overlays/effects
7. optional special-expedition art

Not all require unique raster images.

---

# 108. REGION LIST

Canonical baseline:

1. Vulkankrater — Fire
2. Ozean — Water
3. Blitzfeld — Electric
4. Wildwuchs — Grass
5. Erdwall — Earth
6. Giftsumpf — Poison
7. Graufeld — Normal
8. Frostgrat — Ice
9. Feenhain — Fairy
10. Windkamm — Wind
11. Erzader — Steel
12. Traumfeld — Psychic
13. Lichtung — Light
14. Schattenriss — Dark
15. Nebelmoor — Ghost
16. Drachenschlund — Dragon
17. Sternenkuppel — Cosmic

---

# 109. REGION GOLDEN SAMPLE SET

Before all 17:

create 3 highly contrasting region samples.

Recommended:

- Vulkankrater / Fire
- Ozean / Water
- Traumfeld / Psychic

Purpose:

- lock camera,
- detail,
- composition,
- lighting,
- shape language.

---

# 110. REGION VERTICAL SLICE SCOPE

Recommended:

- 1 fully production-quality starting region,
- 1 contrasting second-region preview or partial package.

The vertical slice does not need 17 finished environments.

---

# 111. REGION FULL PRODUCTION PACKAGE

Per region, likely assets include:

- 1 primary region vignette/card,
- 1 region-detail background or modular environment set,
- 1 world-map node treatment,
- 1–3 environmental accent/overlay assets,
- route thumbnails only where needed.

Avoid assuming every route requires its own painted background.

---

# 112. REGION THUMBNAIL COUNT

Preferred:

# one strong canonical region visual per region

before creating route-specific scene art.

This yields:

# 17 primary region visuals

for the full set.

---

# 113. ROUTE VISUAL STRATEGY

Routes should primarily reuse:

- region art,
- route-type icon,
- small contextual overlay/label.

Only Special Expeditions require bespoke route art by default.

---

# 114. WHY NOT ONE IMAGE PER ROUTE

If each region has multiple routes, unique route paintings could create:

- 50–100 environment assets,
- major art burden,
- weak reuse.

Use region identity + route semantics first.

---

# 115. WORLD MAP ASSETS

Need:

- base world-map style,
- region node states,
- locked/unlocked/current/ready states,
- connection/path language.

Prefer vector/UI-driven map state where possible.

---

# 116. WORLD MAP NODE STATES

Reusable states:

- unknown/hidden,
- locked,
- available choice,
- unlocked,
- active expedition,
- result ready,
- region completed.

These should be UI state treatments, not seven different painted nodes per region.

---

# 117. VFX / MOTION ASSET SYSTEM

VFX families:

1. Commerce
2. Crafting
3. Quality
4. Expedition
5. Discovery
6. Capture
7. Evolution
8. Region unlock
9. Infrastructure upgrade
10. Special visitor

---

# 118. COMMERCE VFX

Need reusable feedback for:

- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend.

Most can be built using:

- icon motion,
- Coin/Momentum particles,
- customer reaction.

No bespoke large raster VFX needed initially.

---

# 119. CRAFTING VFX

Need:

- station active loop,
- ready state,
- completion,
- Fine result,
- Masterwork result.

---

# 120. QUALITY VFX

Fine:
- subtle highlight/spark.

Masterwork:
- stronger controlled craftsmanship effect.

Do not use a rainbow rarity explosion.

---

# 121. EXPEDITION VFX

Need:

- departure,
- return,
- route active marker,
- special result cue.

These can be lightweight.

---

# 122. DISCOVERY VFX

Need reusable states for:

- Trace found,
- Encounter found,
- rare discovery.

These should support the Unknown → Traced → Encountered progression.

---

# 123. CAPTURE VFX

Capture requires one of the strongest polished sequences.

Need:

- attempt build-up,
- success,
- failure,
- rare/shiny variant modifier.

Do not create a recognizable Poké Ball imitation.

---

# 124. EVOLUTION VFX

Need:

- transformation focus,
- silhouette/reveal,
- element accent,
- completion.

This should be reusable across evolution lines with element/scale adaptation.

---

# 125. REGION UNLOCK VFX

Need:

- map reveal,
- node/path activation,
- region card reveal.

One reusable system with regional accent is preferred.

---

# 126. INFRASTRUCTURE UPGRADE VFX

Need:

- construction-ready state,
- completion reveal,
- visual swap/upgrade.

Reuse across stations/zones.

---

# 127. SOUND ASSET BOUNDARY

Audio is not owned by this document.

However visual asset timing should avoid assuming sound is required for comprehension.

---

# 128. ASSET METADATA REGISTRY

Every runtime asset should eventually be represented through metadata or canonical registry.

Suggested fields:

```text
assetId
category
sourcePath
runtimePath
status
version
width
height
format
hasAlpha
semanticOwnerId
variant
tags[]
```

Exact schema belongs to Document 14.

---

# 129. SEMANTIC OWNER ID

Every content asset should know what it belongs to.

Examples:

```text
productId
catchmonSpeciesId
regionId
stationId
customerArchetypeId
```

Do not map content by file-name string parsing at runtime.

---

# 130. ASSET MANIFEST

Technical implementation should generate or maintain an asset manifest.

Purpose:

- missing-file validation,
- duplicate detection,
- preload planning,
- QA.

---

# 131. MISSING-ASSET POLICY

Development may use explicit placeholders.

Production must not silently fall back to:

- emoji,
- broken image,
- unrelated generic asset.

Missing production asset should be detected in validation.

---

# 132. PLACEHOLDER SYSTEM

Use a consistent development placeholder asset style.

Examples:

- gray neutral icon with asset ID,
- canonical placeholder card.

Do not use random internet images or emoji.

---

# 133. PLACEHOLDER LABEL

Placeholders must be visibly marked in development.

They should not accidentally ship unnoticed.

---

# 134. ASSET GENERATION PIPELINE

For AI-generated content:

## STEP 1 — CONTENT LOCK
Asset has stable semantic purpose/ID.

## STEP 2 — STYLE BRIEF
Use Document 12.

## STEP 3 — GENERATE CANDIDATES
Small batch.

## STEP 4 — SELECT
Choose best structural result.

## STEP 5 — NORMALIZE
Crop, scale, alpha, color.

## STEP 6 — QA
Small-size and side-by-side.

## STEP 7 — EXPORT
Master + runtime.

## STEP 8 — REGISTER
Canonical asset manifest.

## STEP 9 — IN-GAME REVIEW
Test in actual UI/scene.

Only then:
- approved.

---

# 135. NO GENERATION WITHOUT ASSET ID

Before generating a production asset, it must have:

- asset ID,
- category,
- intended use,
- status,
- target spec.

This prevents orphan art.

---

# 136. MASTER PROMPT METADATA

Every generated asset should store the generation brief/prompt outside the runtime file.

Recommended metadata:

```text
assetId
generationDate
generationTool
promptVersion
styleGuideVersion
referenceAssets
notes
```

This helps later consistency regeneration.

---

# 137. GOLDEN SAMPLE PROGRAM

The Golden Sample Set is the visual production benchmark.

It should be completed before full batch generation.

---

# 138. GOLDEN SAMPLE CATEGORIES

Minimum Golden Sample package:

## CATCHMON
5 normalized existing Catchmons in shop context.

## PRODUCT
7 product-family icons.

## MATERIAL
5 representative material/component icons.

## UI
primary nav icons + customer action icons.

## STATION
1 station base + upgrade.

## SHOP
1 polished starter-shop section.

## CUSTOMER
1 normal + 1 focused + 1 special visitor sample.

## REGION
3 contrasting regions.

## VFX
1 sale + 1 Masterwork + 1 capture success.

---

# 139. GOLDEN SAMPLE APPROVAL GATE

Full batch production is blocked until the Golden Samples pass:

- style consistency,
- mobile size,
- semantics,
- contrast,
- world integration,
- performance feasibility.

---

# 140. PROTOTYPE ASSET PHASE

Goal:

# PROVE GAMEPLAY

Use:

- existing Catchmons,
- minimal UI icons,
- 5 product icons,
- 2 routine materials,
- 1 special component,
- 1–2 station placeholders,
- 1 shop scene placeholder,
- 1 customer,
- 1 region placeholder,
- lightweight effects.

Do not optimize visual breadth.

---

# 141. PROTOTYPE NEW-ASSET LIMIT

A prototype should ideally require:

# fewer than ~25 newly authored visual assets

excluding derived exports and existing Catchmons.

If prototype needs hundreds:

scope is wrong.

---

# 142. VERTICAL SLICE ASSET PHASE

Goal:

# PROVE THE FINAL EXPERIENCE QUALITY

The vertical slice should demonstrate:

- final art direction,
- one coherent shop,
- full core loop,
- Catchmon integration,
- first world/expedition/capture loop.

---

# 143. VERTICAL SLICE — CATCHMON SCOPE

Use:

# approximately 4–8 existing Catchmons

chosen to test:

- different size,
- elements,
- roles,
- evolution if applicable.

Do not need all 104.

---

# 144. VERTICAL SLICE — PRODUCT SCOPE

Use:

# 18–28 product icons

covering all seven families.

---

# 145. VERTICAL SLICE — RESOURCE SCOPE

Recommended:

- 4–8 routine material icons,
- 2–4 special component icons.

Enough for meaningful recipe/resource flow.

---

# 146. VERTICAL SLICE — UI ICON SCOPE

Need polished icons for all features actually present in slice:

- 3 nav,
- core currency/progression,
- 4 Catchmon domains,
- 5 transaction actions,
- basic crafting,
- expedition/discovery,
- reserved/locked/ready,
- quality.

Reuse canonical icons where possible.

---

# 147. VERTICAL SLICE — SHOP SCOPE

Need:

- starter shop shell,
- one expanded state,
- 2 station families,
- standard display,
- premium display,
- storage modules,
- Catchmon support zone,
- Expedition Hub,
- 8–16 props.

---

# 148. VERTICAL SLICE — CUSTOMER SCOPE

Need:

- 3 normal visual archetypes,
- variants where inexpensive,
- 1 special visitor.

---

# 149. VERTICAL SLICE — REGION SCOPE

Need:

- 1 full starting region,
- 1 contrasting region preview/package.

---

# 150. VERTICAL SLICE — VFX SCOPE

Need polished:

- Standard Sale,
- Favorable/Premium differentiation,
- craft ready,
- Fine/Masterwork,
- expedition return,
- Trace/Encounter,
- Capture success/failure,
- evolution if slice includes it,
- infrastructure upgrade.

---

# 151. FULL PRODUCTION PHASE

Full production begins only after:

1. gameplay prototype passes,
2. vertical slice passes,
3. product/content registries are locked,
4. Golden Samples approved,
5. Technical Architecture accepts asset formats.

---

# 152. FULL PRODUCTION — CATCHMONS

Existing:

# 104 canonical creature assets.

Required work:

- normalization,
- derived sizes,
- in-world integration.

Do not plan 104 redesigns.

---

# 153. FULL PRODUCTION — PRODUCTS

Planning envelope:

# 70–100 product icons.

Generate in controlled batches by family.

Recommended batch size:

# 8–15 assets

before QA.

Do not generate all 100 in one uncontrolled prompt/run.

---

# 154. PRODUCT BATCH ORDER

Suggested order:

1. Provisions
2. Care & Comfort
3. Field Gear
4. Capture & Discovery Gear
5. Wearables
6. Habitat & Enrichment
7. Elemental Craft

Reason:
- establish practical material language first,
- leave the most magical/premium family until consistency is proven.

Exact order may adapt to content lock.

---

# 155. FULL PRODUCTION — ROUTINE MATERIALS

Target only after taxonomy lock.

Planning envelope:

# 12–24 icons.

Produce by material class rather than region.

---

# 156. FULL PRODUCTION — SPECIAL COMPONENTS

Planning envelope:

# 17–34 icons.

Produce by visual-material family.

Avoid one batch per region if that creates style drift.

---

# 157. FULL PRODUCTION — STATIONS

Expected:

- 5 station families,
- 3–5 major visual states each.

Maximum planning envelope:

# ~15–25 major station-state visuals.

Use modular attachments to reduce actual unique full renders.

---

# 158. FULL PRODUCTION — SHOP SHELL

Expected:

# 4–6 major macro shop visual states.

Prefer modular deltas.

---

# 159. FULL PRODUCTION — DISPLAYS

Expected core set:

# 3–5 reusable display families

with limited visual states.

Do not create one display per product family by default.

---

# 160. FULL PRODUCTION — STORAGE

Expected:

- 3 functional visual categories,
- 2–3 major states each.

Planning envelope:

# ~6–9 major storage visuals.

---

# 161. FULL PRODUCTION — CUSTOMER VISUALS

Functional archetype envelope:

# 10–16.

Visual production may use:

- fewer base bodies,
- multiple variants.

Planning envelope:

# ~12–30 normal customer visual variants

plus curated Special Visitors.

Exact count depends on animation system and final content.

---

# 162. FULL PRODUCTION — SPECIAL VISITORS

Start with:

# approximately 3–8 curated special visitors

for initial release.

Do not create dozens before customer mechanics prove their need.

---

# 163. FULL PRODUCTION — REGIONS

Required canonical region visual package:

# 17 regions.

Minimum per region:
- primary region vignette,
- map identity,
- backdrop/modular scene support.

Do not require unique art per route.

---

# 164. FULL PRODUCTION — UI ICONS

Final count should be determined after reuse audit.

Expected new additions:

# ~15–35 icons.

The complete UI icon set may be larger because many existing icons are reused.

---

# 165. FULL PRODUCTION — VFX

Prefer a small set of reusable systems.

Expected major VFX families:

# roughly 10 core systems

with variants rather than one effect per content item.

---

# 166. ESTIMATED FULL NEW-ASSET ORDER OF MAGNITUDE

This is a planning estimate, not a committed count.

Excluding the existing 104 Catchmons:

```text
Products                  ~70–100
Routine materials         ~12–24
Special components        ~17–34
New UI icons              ~15–35
Station major states      ~15–25
Shop macro states          ~4–6
Display major assets       ~3–8
Storage major assets       ~6–9
Customer visuals          ~15–38
Region primary packages    17
Core VFX systems           ~10
Props                      ~30–60 optional/reusable
```

Many entries are modular/reusable.

The project should not interpret this as:

> create everything immediately.

---

# 167. PRODUCTION PRIORITY TIERS

Every asset should be assigned a priority.

## P0 — BLOCKS CORE PROTOTYPE

## P1 — BLOCKS VERTICAL SLICE

## P2 — REQUIRED FOR FULL CORE RELEASE

## P3 — POLISH / CONTENT BREADTH

## P4 — OPTIONAL / FUTURE

---

# 168. P0 ASSETS

Typical P0:

- 5 products,
- 2 materials,
- 1 component,
- basic currency/icons,
- 1 station placeholder,
- 1 customer,
- 1 region,
- existing Catchmon adaptation,
- basic shop scene.

---

# 169. P1 ASSETS

Typical P1:

- Golden Product Set,
- polished 18–28 products,
- 2 stations,
- polished shop environment,
- core UI icons,
- 3 customer archetypes,
- Expedition Hub,
- starting region,
- capture/evolution VFX,
- 4–8 Catchmon adaptations.

---

# 170. P2 ASSETS

Typical P2:

- complete product catalog,
- all material/component icons,
- all station families,
- full customer core roster,
- all 17 regions,
- complete UI semantic icon gaps,
- major shop macro states.

---

# 171. P3 ASSETS

Examples:

- extra customer variants,
- extra props,
- additional special visitors,
- signature recipe art,
- regional special-expedition art,
- advanced VFX variants.

---

# 172. P4 ASSETS

Examples:

- seasonal themes,
- marketing-only visual variants,
- decorative customization breadth,
- optional outpost concepts,
- non-core emotes.

---

# 173. STOP-GATE A — NO FULL PRODUCTS BEFORE PRODUCT REGISTRY

Do not generate 70–100 products before:

- exact product IDs,
- names/fantasies,
- family,
- role,
- element relationship

are locked.

---

# 174. STOP-GATE B — NO FULL MATERIAL SET BEFORE ECONOMY CONTENT MAP

Do not generate final resource icons before the economy/content pass decides:

- which routine material families actually exist.

---

# 175. STOP-GATE C — NO FULL COMPONENT SET BEFORE REGIONAL CONTENT

Do not create “two components per region” just to fill a quota.

Create only components with real recipes/routes.

---

# 176. STOP-GATE D — NO 17 REGION ENVIRONMENTS BEFORE GOLDEN REGION TEST

Three region Golden Samples first.

Then full production.

---

# 177. STOP-GATE E — NO FULL CUSTOMER ROSTER BEFORE VISUAL REUSE MODEL

Prove:

- base bodies,
- variants,
- animation reuse.

Then scale.

---

# 178. STOP-GATE F — NO STATION TIER BATCH BEFORE MODULAR UPGRADE TEST

Build one station through multiple states first.

Verify:

- silhouette progression,
- modularity,
- runtime implementation.

---

# 179. STOP-GATE G — NO ICON REBUILD WITHOUT AUDIT

Never rebuild the entire icon set just because new icons are needed.

Audit and extend first.

Only rebuild if style mismatch makes extension impossible.

---

# 180. STOP-GATE H — NO 104 WORK-ANIMATION SET

Do not create custom job animation packs for all Catchmons before testing a shared animation/adaptation approach.

---

# 181. REUSE MATRIX — CORE

| Asset family | Existing? | New work |
|---|---|---|
| 104 Catchmon identities | Yes | Normalize/adapt |
| Element colors | Yes | Reuse |
| Motion tokens | Yes | Reuse |
| Shared UI icons | Partial/Yes | Audit + extend |
| Region IDs/names | Yes | Reuse identity only |
| Product icons | No | Create |
| Routine material icons | Not locked | Create after taxonomy |
| Special components | Not locked | Create after content |
| Stations | No/new project | Create |
| Shop environment | No/new project | Create |
| Displays/storage | No/new project | Create |
| Customers | New | Create |
| Region environments | New | Create |
| VFX | New | Create/reuse systems |

---

# 182. ASSET ADAPTATION MATRIX — CATCHMONS

For every Catchmon, audit:

| Check | Action |
|---|---|
| Transparent already? | Reuse |
| Background present? | Clean |
| Canvas inconsistent? | Normalize |
| Resolution too low? | Controlled upscale only if needed |
| Cropped extremities? | Repair/source revisit |
| Color cast? | Correct carefully |
| In-world shadow absent? | Runtime/derived shadow |
| Shiny source exists? | Register |
| Evolution-stage ID known? | Map to canonical data |

---

# 183. NO CONTENT ART WITHOUT DATA OWNER

Every asset must map to an approved domain owner.

Examples:

Product icon:
- product registry.

Region visual:
- region registry.

Catchmon:
- canonical species registry.

Customer:
- customer archetype registry.

Do not create content whose gameplay object does not exist.

---

# 184. ASSET BRIEF TEMPLATE

Every new asset brief should use:

```text
ASSET ID:
CATEGORY:
STATUS:
GAMEPLAY OWNER:
DISPLAY NAME / CONCEPT:
PRIMARY USE:
SECONDARY USES:
ART STYLE:
CAMERA:
MATERIALS:
LIGHTING:
ELEMENT ACCENT:
SILHOUETTE:
BACKGROUND:
TRANSPARENCY:
MASTER SIZE:
RUNTIME SIZE(S):
DO NOT INCLUDE:
REFERENCE ASSETS:
QA NOTES:
```

---

# 185. PRODUCT BRIEF TEMPLATE

Add:

```text
PRODUCT FAMILY:
PRODUCT ROLE:
DUAL-USE?:
REGION / ELEMENT ALIGNMENT:
QUALITY TREATMENT:
ICON OCCUPANCY TARGET:
```

---

# 186. REGION BRIEF TEMPLATE

Add:

```text
REGION:
ELEMENT:
CORE ECONOMIC IDENTITY:
SHAPE LANGUAGE:
MATERIAL LANGUAGE:
LIGHTING:
MOTION CUES:
KEY LANDMARK:
AVOID:
```

---

# 187. STATION BRIEF TEMPLATE

Add:

```text
STATION FAMILY:
VISUAL TIER:
FUNCTION:
CATCHMON INTERACTION AREA:
UPGRADE DIFFERENTIATOR:
ACTIVE STATE:
READY STATE:
```

---

# 188. CUSTOMER BRIEF TEMPLATE

Add:

```text
FUNCTIONAL ARCHETYPE:
CUSTOMER LAYER:
SILHOUETTE:
OUTFIT / PROP CUES:
ANIMATION SET:
SPECIAL STATUS:
```

---

# 189. AI GENERATION BRIEF RULE

Every AI-generation brief must include the approved style language from Document 12.

Do not rely on the model remembering earlier prompts.

Each batch prompt should be self-contained.

---

# 190. AI GENERATION NEGATIVE CONSTRAINTS

Common exclusions:

- photorealistic,
- pixel art,
- anime gacha interface,
- medieval weapon shop,
- generic sci-fi neon,
- text,
- watermark,
- logo,
- UI frame,
- background where transparency required,
- extra duplicate objects,
- inconsistent camera.

---

# 191. GENERATION BATCH SIZE

Recommended:

# 4–12 candidates per content batch

depending on asset family.

Do not generate 100 final assets without intermediate human/style QA.

---

# 192. BATCH LOCK RULE

After one family style is approved:

- save the prompt recipe,
- save references,
- save camera/light values,
- do not casually alter them mid-family.

---

# 193. ASSET NORMALIZATION

Generated output should be normalized through:

- crop,
- canvas size,
- alpha,
- padding,
- scale,
- color balance,
- file naming.

Do not feed raw generated filenames directly into runtime.

---

# 194. BACKGROUND REMOVAL BOUNDARY

Transparent asset categories should ideally be generated with clean background support.

If removal is required:

- inspect edges manually,
- avoid halo/fringing,
- retain soft shadows only intentionally.

---

# 195. GENERATIVE EDIT POLICY

If an otherwise approved asset has:

- wrong small detail,
- unwanted extra object,
- slightly wrong color

prefer targeted editing over full regeneration if consistency can be preserved.

---

# 196. ASSET REVIEW ROLES

Every production batch should be reviewed across:

## GAME DESIGN
Does asset match gameplay meaning?

## ART DIRECTION
Does it match style?

## UX
Is it readable at intended size?

## TECH
Does it meet format/performance requirements?

In a solo/AI-assisted project, these are review lenses rather than separate people.

---

# 197. QA STATUS VALUES

Recommended:

```text
DRAFT
REVIEW
APPROVED_MASTER
EXPORTED_RUNTIME
IN_GAME_VERIFIED
DEPRECATED
```

Do not consider an image done merely because it looks good in isolation.

---

# 198. IN-GAME VERIFIED RULE

An asset is production-complete only after it has been seen in:

- actual intended UI,
- actual background,
- realistic mobile size.

---

# 199. MOBILE ICON QA

Test all content icons at:

- 32 px,
- 48 px,
- 64 px,
- 96 px

depending on use.

The main object must remain recognizable.

---

# 200. ASSET CONTRAST QA

Test transparent icons against:

- light UI,
- dark UI,
- neutral shop environment,
- element-accent surface.

---

# 201. ASSET SEMANTIC QA

Ask:

> Could the player mistake this for another gameplay category?

Examples:

- Component vs product,
- Momentum vs Electric,
- Masterwork vs Rare,
- Reserved vs Locked.

If yes:
fix.

---

# 202. PRODUCT FAMILY QA

Place one icon from every family side-by-side.

They should feel:

- one catalog,
- different functional identities.

---

# 203. REGION QA

Place all finished region thumbnails in one grid.

Check:

- camera consistency,
- detail density,
- color balance,
- shape differentiation,
- no region visually dominates purely through saturation.

---

# 204. CUSTOMER QA

Place all customer archetypes beside Catchmons.

Customers should:

- belong to world,
- not visually overpower Catchmons,
- remain distinguishable.

---

# 205. STATION QA

Place all stations in one shop scene.

Check:

- scale,
- world consistency,
- silhouette,
- interaction zones,
- upgrade states.

---

# 206. FILE WEIGHT QA

Before runtime approval:

- measure file size,
- remove unnecessary dimensions,
- compress without visible degradation.

Exact budgets belong to Technical Architecture.

---

# 207. ASSET PRELOADING CLASSES

Technical Architecture should later classify:

## IMMEDIATE
main HUD, current shop, current Catchmons.

## NEAR
current station/customer/region.

## ON_DEMAND
locked regions, rare encounters, deep collection art.

Do not preload the full 104 + 17 regions + 100 products at boot.

---

# 208. LAZY-LOAD FRIENDLY STRUCTURE

Asset IDs and folders should support loading by:

- current destination,
- current region,
- current inventory subset.

---

# 209. SPRITE ATLAS BOUNDARY

Small UI icons may benefit from SVG bundling or component imports.

Raster sprites/atlases may be useful for repeated effects/animation.

Do not atlas everything blindly.

---

# 210. CACHING BOUNDARY

Browser caching/CDN strategy belongs to Document 14.

Asset filenames should support immutable versioning where feasible.

---

# 211. ASSET DEPRECATION RULE

When replacing an asset:

- mark old asset deprecated,
- update registry,
- verify no runtime references,
- delete only after migration.

Do not silently overwrite semantic identity if save/content references depend on it.

---

# 212. NO FILE-NAME BUSINESS LOGIC

Gameplay code should not infer:

- rarity,
- element,
- product family

from filename substrings.

Those belong to data registries.

---

# 213. FULL ASSET INVENTORY DOCUMENT

After content lock, create a machine-readable or Markdown inventory:

# `13A_CATCHMON_SHOP_ASSET_INVENTORY.md`

or CSV/JSON equivalent.

It should list every actual asset ID and status.

Document 13 defines the system.

13A defines the final content rows.

---

# 214. 13A COLUMNS

Recommended:

```text
assetId
category
ownerId
displayName
priority
status
sourceExists
needsGeneration
masterFormat
runtimeFormat
masterSize
runtimeSizes
alpha
styleReference
notes
```

---

# 215. ASSET PRODUCTION BOARD

A spreadsheet/project tracker may later manage:

- asset ID,
- status,
- assignee/tool,
- review,
- version.

Do not use the game registry itself as the human production tracker.

---

# 216. PRODUCTION WAVE 0 — AUDIT

Before creating anything:

1. inventory 104 Catchmon files,
2. inventory existing icons,
3. verify tokens,
4. identify element-icon completeness,
5. identify existing reusable backgrounds/props if any.

Output:

# Existing Asset Audit

---

# 217. PRODUCTION WAVE 1 — GOLDEN SAMPLES

Create:

- 7 product icons,
- 5 material/component samples,
- 1 station + upgrade,
- starter shop section,
- 3 customer samples,
- 3 regions,
- core UI/icon mini-set,
- 5 Catchmon integrations,
- 3 core VFX samples.

Do not scale before review.

---

# 218. PRODUCTION WAVE 2 — PROTOTYPE

Only create assets required to implement/test core systems.

Reuse Golden Samples where possible.

---

# 219. PRODUCTION WAVE 3 — VERTICAL SLICE

Bring one coherent playable section to near-final visual quality.

This is the main art-direction validation gate.

---

# 220. PRODUCTION WAVE 4 — CONTENT LOCK

Finalize:

- product list,
- routine materials,
- special components,
- customer roster,
- region package,
- 104 Catchmon gameplay mapping.

Only now can full counts be known.

---

# 221. PRODUCTION WAVE 5 — FULL CORE CONTENT

Generate:

- complete product catalog,
- complete required resources/components,
- all stations,
- all core shop states,
- all core customer archetypes,
- all regions.

Batch by asset family.

---

# 222. PRODUCTION WAVE 6 — POLISH

Add:

- extra variants,
- special visitors,
- signature assets,
- decoration breadth,
- optional special expedition art,
- richer VFX.

---

# 223. PRODUCTION WAVE 7 — OPTIMIZATION

Perform:

- runtime compression,
- responsive exports,
- lazy-load validation,
- mobile memory checks,
- final alpha/edge cleanup.

---

# 224. WHAT SHOULD NOT BE GENERATED NOW

Before Technical Architecture / Vertical Slice implementation, do **not** mass-generate:

- all 70–100 products,
- all 17 final region environments,
- all customer variants,
- all station tiers,
- all routine materials,
- all special components,
- 104 custom work animations,
- decoration packs.

At this stage:

> the system is specified, but implementation feedback can still alter asset needs.

---

# 225. WHAT CAN BE CREATED NOW SAFELY

Safe pre-implementation preparation:

1. Existing Asset Audit
2. Catchmon normalization audit
3. icon audit
4. Golden Product Sample briefs
5. Golden Station brief
6. Golden Region briefs
7. asset folder/ID conventions
8. placeholder assets
9. Golden Sample generation only if desired

This work has low rework risk.

---

# 226. ASSET PRODUCTION AND CLAUDE CODE

Claude Code should not generate or assume content assets implicitly.

Implementation tasks should reference:

- asset IDs,
- placeholder status,
- registry entries.

If an asset does not exist:

Claude should use the canonical placeholder.

It should not invent filenames or duplicate assets.

---

# 227. CLAUDE CODE ASSET RULE

Recommended repository instruction:

> Do not invent production assets, filenames, element icons, product images, or Catchmon images. Use the canonical asset registry. If an approved asset is missing, use the project placeholder and report the missing asset ID.

---

# 228. TOKEN-EFFICIENT ASSET CONTEXT

When Claude implements:

## Product card
Read:
- relevant UX,
- art spec,
- product registry entry,
- asset metadata.

Do not load all 100 product images/data.

## Region screen
Read:
- one region definition,
- region asset entries,
- relevant UX.

Do not load all 17 region briefs unless doing a cross-region audit.

---

# 229. DESIGN-TOKEN INTEGRATION

Asset art does not replace runtime design tokens.

Examples:

- element accent color = token,
- quality frame = reusable UI treatment,
- selected state = UI token.

Do not bake token-controlled states into every raster asset.

---

# 230. DARK/LIGHT UI COMPATIBILITY

Transparent content icons should work against intended supported UI surfaces.

If a light object disappears on light UI:

use:
- frame,
- shadow,
- runtime surface,

not a baked colored background per icon.

---

# 231. LOCALIZATION SAFETY

No player-facing text in content art.

Any symbolic markings should be:

- decorative,
- non-linguistic,
- world-consistent.

---

# 232. ACCESSIBILITY ASSET RULE

Critical semantics must have more than color.

Asset systems should support:

- icon,
- shape,
- label.

Especially:
- element,
- quality,
- status.

---

# 233. ELEMENT ASSET RULE

Elements should be communicated through:

- canonical icon,
- token color,
- material/shape when relevant.

Do not require color vision alone.

---

# 234. QUALITY ASSET RULE

Fine/Masterwork should differ through:

- frame structure,
- icon/symbol,
- highlight.

Not hue only.

---

# 235. RARITY ASSET RULE

Rarity should use:

- badge/border,
- reveal treatment.

Not only color.

---

# 236. SOURCE CONTROL RULE

Runtime-ready assets belong in version control if practical.

Very large generation/edit source files may live in separate production storage.

The repository should retain enough metadata to reproduce/trace assets.

---

# 237. LICENSE / PROVENANCE RULE

For every external or generated asset, track:

- origin,
- generation/source,
- license where relevant.

Do not import unknown-license web art into production.

---

# 238. NO STOCK-ART PATCHWORK

Do not fill missing content using unrelated stock illustration.

Consistency is more important than speed.

Use placeholders until proper assets exist.

---

# 239. ASSET SAFETY BUFFER

Do not crop content to the exact visible silhouette.

Maintain padding for:

- hover/selection,
- shadows,
- responsive crop,
- animations.

---

# 240. SAFE PADDING — CONTENT ICONS

Recommended initial rule:

- keep ~8–15% canvas safety around most objects,
- allow deliberate exceptions for long/thin items.

Golden Samples will refine.

---

# 241. ANCHOR POINT METADATA

Some scene assets may need anchor metadata such as:

- ground point,
- interaction point,
- Catchmon work point.

Do not bake these into filenames.

Technical Architecture may define metadata fields.

---

# 242. STATION INTERACTION ANCHORS

Each station should eventually support:

- player tap bounds,
- Catchmon work position,
- effect origin,
- ready-state marker point.

These may be technical metadata rather than visual assets.

---

# 243. CUSTOMER BASELINE ANCHOR

Customer sprites/renders need a standardized ground/baseline reference so scale and pathing remain coherent.

---

# 244. CATCHMON GROUND ANCHOR

Each Catchmon in-world asset should define:

- ground/contact position,
- approximate visual bounds.

This helps scene placement despite varied anatomy.

---

# 245. PORTRAIT CROP METADATA

Catchmon/customer portrait cards may need per-asset crop metadata.

Do not manually encode crop offsets in individual components.

---

# 246. IMAGE FOCAL POINT METADATA

Region/customer/Catchmon larger images may need:

```text
focalX
focalY
```

for responsive cropping.

Technical Architecture should support this if necessary.

---

# 247. PRODUCTION DASHBOARD METRICS

Track:

- assets planned,
- assets approved,
- assets in-game verified,
- rejected/regenerated,
- average revision count,
- runtime size,
- style-drift failures.

---

# 248. REGENERATION RATE HEALTH TARGET

If a large percentage of a batch requires regeneration:

> stop the batch and fix the prompt/style process.

Do not brute-force through inconsistency.

---

# 249. ASSET CONSISTENCY HEALTH TARGET

A blind reviewer should be able to group:

- products,
- regions,
- stations,
- customers

as belonging to the same game.

---

# 250. MOBILE READABILITY HEALTH TARGET

At actual mobile scale:

- major icons identifiable,
- stations distinguishable,
- customer request state visible,
- Catchmon silhouette readable.

---

# 251. PERFORMANCE HEALTH TARGET

The visual system must support:

- responsive shop interactions,
- several customers,
- several Catchmons,
- station activity.

If final art cannot run smoothly on target mobile hardware, visual complexity must be reduced.

---

# 252. ART-ASSET ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — GENERATE EVERYTHING FIRST

Hundreds of assets before vertical slice.

Result:
mass rework.

---

## ANTI-PATTERN B — NO ASSET ID

Images exist only as filenames.

Result:
registry chaos.

---

## ANTI-PATTERN C — ONE-OFF SIZES

Every feature requests custom dimensions.

Result:
export complexity.

---

## ANTI-PATTERN D — UI BAKED INTO ART

Product images contain rarity frame/text.

Result:
reuse/localization failure.

---

## ANTI-PATTERN E — ONE IMAGE PER QUALITY

Standard/Fine/Masterwork each have full render.

Result:
3× asset multiplication.

---

## ANTI-PATTERN F — ONE IMAGE PER ROUTE

Every expedition route has unique environment art.

Result:
world asset explosion.

---

## ANTI-PATTERN G — 104×JOB ANIMATIONS

Every Catchmon gets many custom work sets.

Result:
production becomes infeasible.

---

## ANTI-PATTERN H — REGION-SPECIFIC EVERYTHING

Every region receives unique station/display/storage.

Result:
17× multiplication.

---

## ANTI-PATTERN I — RANDOM ICON LIBRARIES

New features pull icons from unrelated sets.

Result:
visual fragmentation.

---

## ANTI-PATTERN J — RAW AI EXPORTS IN GAME

Generated files ship without normalization.

Result:
padding/color/alpha inconsistency.

---

## ANTI-PATTERN K — PHOTOREAL PRODUCT BATCH

Products drift away from stylized world.

Result:
catalog mismatch.

---

## ANTI-PATTERN L — CONTENT BEFORE MECHANICS

Components/products created with no gameplay owner.

Result:
orphan assets.

---

## ANTI-PATTERN M — FULL-RES EVERYWHERE

1024/2048 images loaded for tiny cards.

Result:
mobile performance loss.

---

## ANTI-PATTERN N — SILENT FALLBACK

Missing asset replaced by emoji/generic icon.

Result:
production bugs hidden.

---

## ANTI-PATTERN O — NO IN-GAME REVIEW

Asset approved on white background only.

Result:
scene readability problems.

---

# 253. PROTOTYPE ASSET ACCEPTANCE CRITERIA

Prototype assets are sufficient when:

- core object categories are understandable,
- no production system is blocked by missing imagery,
- placeholders are clearly marked,
- existing Catchmons can be integrated,
- the loop can be tested.

Prototype assets do not need full polish.

---

# 254. VERTICAL SLICE ASSET ACCEPTANCE CRITERIA

Vertical slice assets are sufficient when:

- the shop looks like final intended style,
- product catalog samples are coherent,
- Catchmons feel grounded,
- customers feel world-consistent,
- one region feels production-ready,
- core VFX hierarchy works,
- mobile readability is proven.

---

# 255. FULL PRODUCTION ACCEPTANCE CRITERIA

A batch is complete when:

- asset IDs match registry,
- source master stored,
- runtime export created,
- QA passed,
- in-game verified,
- status marked approved,
- no semantic duplication exists.

---

# 256. PRODUCTION CHECKLIST — BEFORE GENERATING

For every batch:

- [ ] Content IDs locked
- [ ] Gameplay role known
- [ ] Style brief known
- [ ] Golden Sample exists
- [ ] Camera known
- [ ] Master size known
- [ ] Background rule known
- [ ] References attached
- [ ] Negative constraints known
- [ ] Runtime use known

If any answer is unknown:

> do not start mass generation.

---

# 257. PRODUCTION CHECKLIST — AFTER GENERATING

- [ ] Correct semantic object
- [ ] Correct perspective
- [ ] Correct material language
- [ ] Correct lighting
- [ ] Consistent padding
- [ ] No text/watermark
- [ ] Transparency clean
- [ ] Small-size readable
- [ ] Side-by-side consistent
- [ ] Runtime export optimized
- [ ] Registry updated
- [ ] In-game verified

---

# 258. FIRST PRACTICAL ASSET TASK AFTER DOCUMENT 13

The safest next art task is:

# **EXISTING ASSET AUDIT + GOLDEN SAMPLE BRIEF**

Not full production.

Specifically:

1. inventory all 104 Catchmon images,
2. inventory existing icons,
3. identify 17 element-icon coverage,
4. define 7 product Golden Samples,
5. define 3 region Golden Samples,
6. define 1 station Golden Sample,
7. define starter-shop Golden Scene.

---

# 259. RELATIONSHIP TO DOCUMENT 14

Document 14 — Technical Architecture must now decide:

- renderer/scene technology,
- React/framework structure,
- asset registry implementation,
- responsive image loading,
- WebP/PNG/SVG delivery,
- caching,
- animation runtime,
- save architecture,
- data registries.

Document 13 gives Technical Architecture a known visual input model.

---

# 260. RELATIONSHIP TO DOCUMENT 15

Document 15 — Vertical Slice Implementation Plan must choose:

- the exact P0/P1 assets required for the first build,
- which assets use placeholders,
- when Golden Samples become production dependencies,
- which asset work can run in parallel with code.

---

# 261. LOCKED DECISIONS FROM DOCUMENT 13

The following decisions are considered part of the intended Asset Taxonomy & Production Plan unless deliberately revised:

1. Existing 104 Catchmon identities/assets are canonical and should be reused rather than regenerated.
2. Existing design-system tokens, element colors, motion values, and icons are canonical/reusable references.
3. Every asset belongs to one stable top-level asset family.
4. Every production asset requires a stable machine-readable asset ID.
5. Asset IDs use lowercase ASCII semantic naming and do not contain iteration labels such as `final2`.
6. Source masters and runtime exports are conceptually separate.
7. Transparent raster masters use clean alpha and sRGB.
8. SVG is preferred for UI icons when compatible with the existing icon architecture.
9. Complex painterly/content art remains raster.
10. Product/resource/component raster masters use a standard 1024×1024 transparent authoring canvas by default.
11. Responsive/runtime exports should be smaller than source masters.
12. Player-facing text is not baked into content art.
13. UI frames/rarity/quality states are not baked into product images.
14. Catchmon source art receives a normalization audit before large implementation use.
15. Catchmon adaptation does not mean creature redesign.
16. The project does not create 104 bespoke multi-job animation packs for initial production.
17. Products use one base icon per product; Standard/Fine/Masterwork do not require separate product renders.
18. Seven product-family Golden Samples are created before full product batch production.
19. The vertical slice uses approximately 18–28 product definitions/icons.
20. Initial full-game product planning remains approximately 70–100 products, not a locked exact count.
21. Routine material count remains intentionally constrained and cross-region reusable.
22. Special components are created only when supported by actual regional/recipe content.
23. UI icons must be audited against the existing set before any new icon is created.
24. No Bug element icon is created.
25. Quality, rarity, shiny, element, reserved, and locked states use separate semantics.
26. Shop environments are modular rather than one fully baked image per numerical state.
27. The shop uses approximately 4–6 macro visual growth states as a planning envelope.
28. Display units are reusable across product families/elements.
29. Storage uses a small number of logical visual modules rather than item-by-item depiction.
30. The five production-station families use approximately 3–5 major visual states each at most as a planning envelope.
31. Station active/ready states should use animation/effects where possible rather than separate full structural renders.
32. Customer visuals use reusable archetype/variant structures.
33. The vertical slice needs only a small customer roster and one Special Visitor.
34. The world requires 17 canonical region visual packages eventually.
35. Routes primarily reuse regional visual identity rather than requiring one painted environment per route.
36. VFX is built as a small number of reusable systems rather than unique effects per content item.
37. Golden Samples are mandatory before large-scale asset production.
38. Prototype asset creation is intentionally minimal.
39. Full production begins only after gameplay prototype, vertical slice, content lock, Golden Sample approval, and Technical Architecture format validation.
40. Production uses priority tiers P0–P4.
41. Full product generation is blocked before product-registry lock.
42. Full resource/component generation is blocked before content taxonomy lock.
43. Full 17-region production is blocked before Golden Region approval.
44. Full customer production is blocked before the visual-reuse/animation model is proven.
45. Full station-tier production is blocked before one modular upgrade sequence is validated.
46. Missing production assets use explicit canonical placeholders rather than emoji or random fallback art.
47. Every generated asset must have an asset brief and semantic owner.
48. AI generation prompts must be self-contained and include approved style/camera/material/background constraints.
49. Generated assets require normalization before runtime use.
50. Every production asset must be reviewed in its real in-game context.
51. Asset registries/data, not filenames, own gameplay semantics.
52. Runtime loading should not preload the complete content catalog at startup.
53. Asset production must remain mobile-performance aware.
54. Final full inventory should be maintained separately as `13A_CATCHMON_SHOP_ASSET_INVENTORY` or equivalent.
55. The immediate next safe art step is Existing Asset Audit + Golden Samples, not mass generation.
56. Technical Architecture owns final runtime asset implementation details.
57. Vertical Slice Plan owns the exact first-build asset subset.

---

# 262. OPEN QUESTIONS DELIBERATELY LEFT FOR CONTENT / TECHNICAL ARCHITECTURE

This document intentionally leaves open:

- exact final product count,
- exact product IDs/names,
- exact routine material count/names,
- exact special component count/names,
- exact customer archetype list,
- exact station visual-tier count,
- exact shop macro-state count,
- exact element-icon reuse completeness,
- exact font assets,
- exact animation file format,
- exact scene renderer,
- exact WebP quality settings,
- whether AVIF is used,
- exact preload/caching rules,
- exact maximum file-size budgets,
- exact sprite atlas policy,
- exact focal-point metadata implementation,
- exact asset manifest schema,
- exact final folder path inside codebase.

These belong to Documents 14–15 and detailed content production.

---

# 263. DEPENDENCY HANDOFF TO DOCUMENT 14

Documents 01–13 now define:

- the game,
- all core systems,
- progression,
- UX,
- visual style,
- exact asset classes and production pipeline.

The next question is:

> **How should the game actually be engineered so all of these systems remain modular, testable, data-driven, performant, save-safe, and maintainable while Claude Code implements them?**

Document 14 must define the Technical Architecture.

---

# 264. NEXT DOCUMENT

## `14_CATCHMON_SHOP_TECHNICAL_ARCHITECTURE.md`

Document 14 should define:

### Technology stack
- web framework,
- language,
- build tool,
- rendering approach,
- state architecture.

### Domain architecture
- Economy,
- Crafting,
- Customers,
- Catchmons,
- Expeditions,
- Progression,
- World.

### Canonical registries
- products,
- recipes,
- Catchmons,
- capabilities,
- regions,
- routes,
- customers,
- infrastructure,
- assets.

### Balance architecture
- centralized config,
- no UI formulas,
- deterministic simulation.

### Save architecture
- schema,
- versioning,
- migrations,
- offline time,
- idempotency.

### Randomness
- injected seeded RNG,
- protection/pity state,
- deterministic tests.

### Scene architecture
- Main Shop,
- 2.5D representation,
- entity states,
- animation boundaries.

### Asset loading
- manifest,
- lazy loading,
- responsive variants,
- cache strategy.

### UI architecture
- Shop/Catchmons/World,
- bottom sheets,
- full-screen workspaces,
- navigation-state preservation.

### Testing
- unit,
- domain simulation,
- integration,
- progression,
- save migration.

### Performance
- mobile budgets,
- animation/VFX limits,
- rendering strategy.

### Claude Code guardrails
- source-of-truth rules,
- context discipline,
- task structure,
- prohibited legacy imports.

Only after Document 14 is approved should the implementation plan be authored.

---

# 265. DEFINITION OF DONE FOR ASSET TAXONOMY & PRODUCTION PLAN

Document 13 is ready to hand off when the project can answer:

- Which assets already exist?
- Which existing assets are canonical?
- Which need only adaptation?
- What are the top-level asset families?
- How are asset IDs named?
- What are the source-vs-runtime rules?
- Which formats belong to icons vs raster content?
- What master size is used for products/resources/components?
- How are Catchmon assets normalized?
- How many product assets are expected at prototype, vertical-slice, and full-content scales?
- Why is Quality not three separate product images?
- How are routine materials different from special components?
- Which UI icons likely need to exist?
- How are existing icons reused?
- How many station/Shop states are planned?
- How are customer assets kept scalable?
- How many region visual packages are required?
- Why does every route not get a unique painting?
- What VFX systems are actually needed?
- What are Golden Samples?
- What blocks mass production?
- What is safe to create now?
- What should Claude Code do when an asset is missing?
- How are production assets tracked and validated?
- What belongs in `13A_ASSET_INVENTORY`?
- What must Technical Architecture decide next?

If these answers remain stable, the project is ready to define Technical Architecture without needing to re-open the asset strategy.
