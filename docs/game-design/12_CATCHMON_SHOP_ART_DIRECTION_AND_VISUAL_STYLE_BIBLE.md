# CATCHMON SHOP — 12 ART DIRECTION & VISUAL STYLE BIBLE

**Status:** Art Direction & Visual Style Bible v1  
**Purpose:** Establish one coherent visual language for Catchmon Shop across the main shop, UI, Catchmons, products, crafting stations, infrastructure, customers, expeditions, regions, effects, quality/rarity states, and future generated assets so the game can scale to 104 Catchmons and 17 worlds without visual drift  
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
- `reference/design-system/DESIGN_SYSTEM_SOURCES.md`  
- `reference/design-system/tokens.css`  
- `reference/design-system/element-farbkompass.md`  
- `reference/design-system/motionTokens.ts`  
- `reference/design-system/regions.ts`  
- `reference/design-system/icons/`  
- canonical Catchmon images/assets in `reference/catchmons/`

**Authority:** This document owns:
- overall art direction,
- visual product identity,
- perspective and scene presentation direction,
- environment shape language,
- shop architecture language,
- crafting-station visual language,
- display/storage visual language,
- material language,
- lighting language,
- product icon visual language,
- customer visual language,
- Catchmon presentation rules,
- regional visual language,
- element visual treatment,
- quality visual treatment,
- rarity visual treatment,
- status/interaction visual language,
- motion hierarchy,
- visual effects hierarchy,
- asset consistency rules,
- AI/image-generation briefing rules,
- export/production visual constraints,
- visual QA rules.

**Out of scope:**  
- exact final asset list,
- exact number of every icon/prop/background,
- exact file naming for every asset,
- exact export dimensions for every asset type,
- final technical renderer,
- final shader implementation,
- final animation rigging approach,
- final audio direction,
- exact font licensing choice,
- final logo,
- marketing key art,
- monetization art,
- live-event themes.

---

# 1. WHY THIS DOCUMENT EXISTS

Catchmon Shop has enough content to become visually inconsistent very quickly.

The project contains:

- 104 Catchmons,
- 17 elements/regions,
- 7 product families,
- 5 production stations,
- customers,
- displays,
- storage,
- expedition infrastructure,
- world-map content,
- quality states,
- rarity states,
- progression states,
- a large UI surface.

Without one strict visual language, the project can easily become:

> one style for Catchmons  
> another style for products  
> another style for buildings  
> another style for UI  
> another style for regions.

That is not acceptable.

The art direction must create the feeling that:

> **everything belongs to the same Catchmon world even when it serves a different gameplay purpose.**

---

# 2. VISUAL NORTH STAR

The visual North Star is:

# **PREMIUM COZY COMMERCE + LIVELY CATCHMON CHARM**

Catchmon Shop should feel:

- warm,
- tactile,
- collectible,
- premium,
- playful,
- polished,
- readable,
- active without being chaotic.

The world should look like a place where:

> **beautiful crafted objects, expressive creatures, and a growing magical-modern shop naturally belong together.**

---

# 3. WHAT THE GAME SHOULD NOT LOOK LIKE

The game should not visually become:

- grim fantasy,
- medieval weapons shop,
- realistic retail simulator,
- generic mobile-idle UI,
- neon cyberpunk,
- hyper-saturated children's app,
- flat dashboard,
- anime gacha menu,
- plastic toy-store clutter,
- generic Pokémon imitation,
- pixel-art management game,
- photorealistic 3D simulation.

The target is stylized and premium.

---

# 4. PRIMARY VISUAL DIRECTION

The locked visual direction is:

# **STYLIZED PREMIUM 2.5D WITH A SOFT THREE-QUARTER / SOFT-ISOMETRIC ENVIRONMENT**

Meaning:

- environment and infrastructure read spatially,
- depth is visible,
- the shop feels like a place,
- camera remains controlled,
- UI remains mobile-readable,
- assets can be modular,
- Catchmons can integrate without requiring full realistic 3D production.

---

# 5. WHY 2.5D / SOFT-ISOMETRIC

This direction gives the project:

- visible shop growth,
- readable customers,
- visible Catchmon assignments,
- understandable stations,
- spatial identity,
- lower production complexity than free 3D,
- stronger visual richness than a flat menu.

It also avoids:

- free-camera controls,
- complex collision/pathfinding dependence,
- precision object placement,
- expensive 3D animation requirements.

---

# 6. CAMERA PHILOSOPHY

The camera should feel like:

> **a carefully staged diorama view of a living shop.**

The player observes a compact premium space from a consistent elevated three-quarter angle.

The camera is not a character-controlled camera.

---

# 7. CAMERA RULES

The main shop should use:

- fixed or narrowly controlled angle,
- consistent perspective,
- mild parallax/depth,
- no extreme fisheye,
- no dramatic perspective distortion,
- no constant zooming.

Routine play should never require:

- rotating the camera,
- searching behind objects,
- precise camera positioning.

---

# 8. CAMERA ZOOM

A small number of authored zoom states may exist:

## DEFAULT SHOP VIEW
Shows the operational space.

## CONTEXT FOCUS
Slightly focuses on station/customer/zone.

## HIGH-IMPACT FOCUS
Used for capture/evolution/major shop transformation.

The camera should not become a free-form 3D navigation system.

---

# 9. SCENE COMPOSITION

The shop should read in three layers:

## FOREGROUND
high-value contextual interaction area.

## MIDGROUND
primary stations, displays, customers, active Catchmons.

## BACKGROUND
shop architecture, decoration, ambient activity.

Gameplay clarity belongs mainly in the midground.

---

# 10. SILHOUETTE-FIRST RULE

Every major object must remain identifiable at small mobile size.

This applies to:

- stations,
- displays,
- product icons,
- Catchmons,
- world-map nodes,
- customer archetypes.

A good asset should still read when:

- blurred slightly,
- shrunk,
- seen in peripheral vision.

---

# 11. SHAPE LANGUAGE — GLOBAL

The base world uses:

- rounded corners,
- softened geometric forms,
- thick readable silhouettes,
- controlled asymmetry,
- handcrafted accents.

Avoid:

- razor-thin detail,
- hyper-ornate filigree,
- excessive micro-texture,
- harsh industrial realism.

---

# 12. SHAPE LANGUAGE — SHOP

The shop combines:

## STRUCTURE
clean geometric architecture.

## WARMTH
rounded wood, cloth, soft lighting.

## MAGIC / ELEMENT
selective glowing accents and unusual materials.

The shop should feel:

> **crafted and curated**

not:

> improvised fantasy clutter.

---

# 13. SHAPE LANGUAGE — MACHINERY

Production stations may have:

- visible tools,
- pipes,
- vessels,
- shelves,
- work surfaces,
- soft mechanical details.

But machinery should remain:

- friendly,
- readable,
- slightly oversized,
- visually understandable.

No dense steampunk complexity by default.

---

# 14. MATERIAL LANGUAGE — GLOBAL

The core material palette should combine:

- warm wood,
- brushed metal,
- ceramic,
- glass,
- fabric,
- stone,
- paper/cardboard,
- soft magical/elemental materials.

This creates a shop that feels tactile.

---

# 15. WOOD

Wood is one of the primary grounding materials.

Use:

- warm mid-tone wood,
- visible but simplified grain,
- rounded edges,
- slightly crafted imperfections.

Avoid:

- hyper-real scratches,
- dark medieval tavern wood,
- orange cartoon wood.

---

# 16. METAL

Metal should be:

- satin,
- brushed,
- polished only selectively,
- slightly stylized.

Steel-region or advanced equipment may use stronger metallic presence.

Do not make all metal dark gunmetal.

---

# 17. GLASS

Glass is useful for:

- premium displays,
- resonance devices,
- special components,
- capture/discovery tools.

Glass should remain readable against the background.

Use:

- controlled reflections,
- simplified refraction,
- edge highlights.

---

# 18. CLOTH / FABRIC

Fabric should support:

- awnings,
- banners,
- bags,
- Wearables,
- cozy surfaces.

Keep folds broad and readable.

---

# 19. CERAMIC / STONE

These materials support:

- Care,
- Habitat,
- Earth,
- Fire,
- decorative utility.

They should feel tactile and stylized, not photoreal.

---

# 20. MAGICAL / ELEMENTAL MATERIALS

Elemental materials should look:

- physically present,
- unusual,
- premium,
- integrated.

Avoid:

> every magical object is a floating glowing crystal.

Use different material behaviors by element:

- Fire → internal heat/glow,
- Water → translucent flow,
- Electric → pulse/signal,
- Grass → living organic growth,
- Earth → strata/mass,
- Poison → reactive liquid/film,
- Ice → crystalline frost,
- Fairy → iridescent shimmer,
- Wind → light suspended fabric/aero forms,
- Steel → precision surfaces,
- Psychic → layered resonance,
- Light → clean luminescence,
- Dark → deep reflective absorption,
- Ghost → translucency/traces,
- Dragon → forged prestige,
- Cosmic → anomalous gradients/refraction.

---

# 21. COLOR SYSTEM — FOUNDATION RULE

The project already has canonical design tokens.

Therefore:

> **Do not invent a second global color system.**

Visual work must reference:

- semantic UI tokens,
- canonical element colors,
- existing region accents.

If a needed color role does not exist, it should be added centrally to the canonical token system rather than hardcoded in one component.

---

# 22. ELEMENT COLORS

Canonical element colors are semantic identifiers.

They are used for:

- element badge,
- subtle rim/accent,
- world-map identity,
- regional lighting accents,
- Catchmon element cues,
- selected recipe/component treatments.

They are **not** used to recolor every UI surface.

---

# 23. ELEMENT COLOR INTENSITY

Recommended usage:

## HIGH
small icon, glow, badge, special focal object.

## MEDIUM
regional ambient accent, frame edge, selected panel.

## LOW
background tint, environmental detail.

Large screens filled with full-strength element color should be avoided.

---

# 24. CTA COLOR PROTECTION

Global CTA/action color remains semantically separate from element colors.

Grass/Poison/etc. must not visually impersonate:

- primary CTA,
- success,
- error.

This is especially important where element colors are green-adjacent.

---

# 25. SUCCESS / WARNING / ERROR

Semantic UI states remain global.

Do not make:

- Fire = error,
- Grass = success,
- Light = selected

by default.

Element identity must not overwrite UX semantics.

---

# 26. BACKGROUND COLOR PHILOSOPHY

The main shop should use:

- warm neutral base,
- enough contrast for colorful Catchmons/products,
- limited ambient region accents.

A neutral environment helps the collection content stand out.

---

# 27. SATURATION DISCIPLINE

The game should be colorful without being visually loud.

Use high saturation primarily for:

- Catchmons,
- key products,
- element accents,
- major states.

Keep large structural surfaces calmer.

---

# 28. VALUE CONTRAST

Gameplay-important objects should stand out through:

- luminance,
- silhouette,
- local contrast,
- motion,
- spacing.

Do not rely only on hue.

---

# 29. LIGHTING THESIS

The lighting target is:

# **WARM SHOP LIGHT + SELECTIVE MAGICAL ACCENTS**

The shop should feel inviting.

Lighting should make products look desirable and Catchmons expressive.

---

# 30. BASE SHOP LIGHT

Default shop light should combine:

- warm ambient interior light,
- soft directional fill,
- bright enough midtones,
- restrained shadow depth.

Avoid:

- dark corners that hide gameplay,
- dramatic horror lighting,
- blown-out white interiors.

---

# 31. LIGHTING HIERARCHY

Lighting supports hierarchy:

## ENVIRONMENT
soft, stable.

## PRODUCT / DISPLAY
slightly brighter/focused.

## ACTIVE STATE
localized accent.

## HIGH-IMPACT EVENT
temporary stronger lighting.

---

# 32. SHADOWS

Shadows should be:

- soft,
- readable,
- grounding.

Objects should feel anchored.

Avoid:

- harsh realistic shadow maps,
- very dark pools,
- excessive ambient occlusion.

---

# 33. GLOW

Glow is a scarce visual resource.

Use it for:

- element resonance,
- rare components,
- Masterwork,
- capture/evolution,
- special visitors.

Do not make every button/object glow.

---

# 34. GLOW BUDGET

At any normal shop moment:

- only a small number of glowing elements should be visible.

If everything glows:

> nothing feels special.

---

# 35. MAIN SHOP VISUAL IDENTITY

The shop should feel like:

> **a boutique workshop and creature-friendly commerce space**

rather than:

- warehouse,
- medieval blacksmith,
- supermarket,
- laboratory.

It blends:

- craft,
- retail,
- collection,
- expedition preparation.

---

# 36. SHOP ARCHITECTURE

Architectural characteristics:

- modular zones,
- rounded structural frames,
- open sightlines,
- layered shelving,
- broad windows/openings,
- visible workshop depth,
- readable station silhouettes.

---

# 37. SHOP BASE PALETTE

Base palette should be:

- warm neutral,
- natural,
- slightly premium.

Suggested material emphasis:

- light/mid wood,
- warm stone,
- off-white/cream surfaces,
- muted metal,
- soft dark trim.

Exact values come from tokens/Art implementation.

---

# 38. SHOP GROWTH VISUALIZATION

Progression should visually add:

- better materials,
- increased space,
- improved fixtures,
- stronger lighting,
- more organized displays,
- richer station detail,
- more Catchmon-friendly features.

Do not simply make the building taller or more ornate.

---

# 39. STARTER SHOP

The starter shop should look:

- small,
- charming,
- clean,
- capable,
- intentionally modest.

It should not look broken or poor.

The player starts with:

> a promising little business

not:

> a ruined shack.

---

# 40. MID-GAME SHOP

Mid-game growth adds:

- more obvious zones,
- layered production,
- premium display opportunities,
- expedition infrastructure,
- richer materials.

---

# 41. LATE-GAME SHOP

Late shop should feel:

- prestigious,
- alive,
- sophisticated,
- globally connected.

But it must remain:

- cozy,
- readable,
- not palace-like excess.

---

# 42. SPECIALIZATION VISUALIZATION

Soft specialization should show through:

- active product displays,
- station prominence,
- Catchmon assignments,
- region trophies,
- props.

Do not permanently recolor the whole shop for one specialization.

---

# 43. SALES FLOOR VISUAL LANGUAGE

Sales Floor should feel:

- open,
- inviting,
- browsable,
- warm.

Displays should have strong product visibility.

Customer movement paths should remain visually clear.

---

# 44. DISPLAY DESIGN

Display units should be:

- modular,
- readable,
- slightly premium,
- neutral enough for different product families.

Types may include:

- shelf,
- counter,
- rack,
- pedestal.

Avoid excessive bespoke themed furniture for every family.

---

# 45. PREMIUM DISPLAY

Premium displays may use:

- glass,
- focused light,
- cleaner framing,
- slightly elevated placement.

They should visually communicate:

> “this product matters”

without using a giant gold chest aesthetic.

---

# 46. WORKSHOP WING VISUAL LANGUAGE

The Workshop should feel:

- productive,
- crafted,
- active,
- organized.

It should not feel:

- dirty,
- industrial,
- unsafe.

Each station archetype gets a strong silhouette.

---

# 47. PROVISION STATION

Visual traits:

- warmth,
- containers,
- preparation surfaces,
- heat/steam only where relevant,
- accessible ingredient presentation.

Avoid generic medieval cooking pot imagery.

---

# 48. CARE ATELIER

Visual traits:

- clean,
- soft,
- ceramic/glass,
- textile detail,
- calm organization.

Avoid medical-clinic sterility.

---

# 49. FIELDWORKS BENCH

Visual traits:

- tools,
- maps,
- straps,
- modular equipment,
- technical ruggedness.

This should clearly read as:

> expedition / gear preparation.

---

# 50. RESONANCE LAB

Visual traits:

- premium precision,
- glass,
- subtle elemental light,
- controlled magical-tech.

Avoid:

- science-lab realism,
- neon sci-fi.

---

# 51. HABITAT WORKSHOP

Visual traits:

- larger forms,
- natural/structural materials,
- enrichment objects,
- crafted habitat pieces.

Should feel:

> comfortable and creature-oriented.

---

# 52. STATION UPGRADE STATES

Every station should use a small number of major visual states.

Each major state should change:

- silhouette,
- visible capability,
- materials,
- tools.

Do not only add tiny decorations.

---

# 53. STATION CONSISTENCY

All five stations should look like they were designed by the same world.

Shared DNA:

- material palette,
- edge language,
- hardware,
- light language,
- Catchmon-scale interaction zones.

---

# 54. STORAGE VISUAL LANGUAGE

Storage should feel:

- organized,
- tactile,
- slightly busy,
- safe.

Use:

- crates,
- bins,
- racks,
- containers.

Avoid visual junk piles.

---

# 55. MATERIAL STORAGE

Routine material storage can use:

- broad containers,
- grouped silhouettes,
- visible category cues.

Do not attempt 1:1 quantity representation.

---

# 56. SPECIAL COMPONENT STORAGE

Special components may receive:

- glass cases,
- sealed containers,
- subtle glow,
- cleaner framing.

This visually communicates rarity/value.

---

# 57. EXPEDITION HUB VISUAL LANGUAGE

The Expedition Hub should blend:

- maps,
- route tools,
- gear storage,
- dispatch area,
- travel markers.

It should feel:

> adventurous but connected to the shop.

---

# 58. CATCHMON SUPPORT AREA

This area should feel:

- welcoming,
- comfortable,
- integrated.

Use:

- cushions,
- perches,
- small platforms,
- habitat features,
- toys/enrichment.

Avoid:

- cages,
- storage boxes,
- clinical holding pens.

---

# 59. CATCHMON ETHICAL VISUAL LANGUAGE

Catchmons are partners/helpers.

Visual design should not imply:

- forced labor,
- confinement,
- exploitation.

Work areas should look:

- safe,
- adapted,
- playful,
- collaborative.

---

# 60. CATCHMON PRESENTATION — CORE RULE

Existing 104 Catchmon identities/assets should be preserved.

Do not redesign their anatomy merely to fit the shop style.

The environment/UI should adapt to the Catchmons.

---

# 61. CATCHMON RENDER INTEGRATION

The preferred integration model is:

# **ILLUSTRATED / STYLIZED CATCHMON RENDER + 2.5D SCENE GROUNDING**

Catchmons may remain as high-quality 2D/2.5D character assets while the shop uses spatial environments.

To integrate them:

- consistent camera-facing orientation,
- contact shadow,
- subtle depth scaling,
- slight ambient light tint,
- controlled animation.

---

# 62. NO CHEAP “STICKER” LOOK

Catchmons should not look pasted onto the scene.

Use:

- soft ground shadow,
- ambient rim/fill,
- local occlusion,
- correct scale,
- environmental color response.

---

# 63. NO FORCED FAKE 3D

Do not distort existing Catchmon art into pseudo-3D if it damages anatomy/style.

If a future 3D pipeline produces high-quality consistent models, they may be adopted explicitly.

The v1 direction does not require full 3D models for all 104.

---

# 64. CATCHMON SCALE

Catchmon scale should be:

- visually expressive,
- readable on mobile,
- consistent within species fantasy.

Exact real-world scale is less important than:

- silhouette,
- shop readability.

---

# 65. CATCHMON ANIMATION STYLE

Routine animation should be small and characterful.

Examples:

- idle breathing,
- blink,
- ear/tail movement,
- bounce,
- glance,
- small work reaction.

Do not require full skeletal locomotion for every species before prototype.

---

# 66. CATCHMON WORK ANIMATION

Work interactions should communicate:

- role,
- causality.

Examples:

Workshop:
- touch/inspect tool,
- heat/stir/adjust,
- celebrate result.

Shop Floor:
- greet,
- point,
- react,
- carry small item.

Supply:
- sort,
- deliver,
- inspect material.

Expedition:
- departure/return pose.

---

# 67. CATCHMON EXPRESSIVENESS

Expressions should be:

- readable,
- charming,
- not hyper-anthropomorphic unless canonical design supports it.

---

# 68. CATCHMON ROLE INDICATORS

Role/assignment status is primarily UI.

Do not permanently attach giant badges above Catchmons.

Small contextual markers may appear when needed.

---

# 69. CUSTOMER VISUAL LANGUAGE

Customers should feel:

- stylized,
- friendly,
- diverse,
- readable.

They are not the collection focus.

Therefore customer design should be simpler than Catchmon design.

---

# 70. CUSTOMER DETAIL LEVEL

Customers need:

- clear silhouette,
- role cues,
- broad outfit identity,
- readable emotion.

They do not need:

- heavily detailed hero-character rendering.

---

# 71. CUSTOMER ARCHETYPE DIFFERENTIATION

Differentiate archetypes through:

- body silhouette,
- clothing shape,
- bag/gear,
- posture,
- movement.

Avoid depending only on recolor.

---

# 72. CUSTOMER VISUAL VARIANTS

Functional customer archetypes may reuse:

- animation sets,
- body rigs,
- structural templates.

Visual variation should be efficient.

---

# 73. SPECIAL VISITORS

Special Visitors may have:

- more detail,
- stronger silhouette,
- unique accessory,
- controlled effect.

They should still belong to the same world.

---

# 74. PRODUCT ICON THESIS

Product icons are one of the game's largest future asset families.

The icon style must be highly standardized.

Target:

# **PREMIUM OBJECT ILLUSTRATION WITH STRONG SILHOUETTE AND MATERIAL READABILITY**

---

# 75. PRODUCT ICON CAMERA

All product icons should use a consistent camera family.

Recommended:

- three-quarter view,
- slight top-down angle,
- centered object,
- minimal perspective distortion.

Avoid mixing:

- side view,
- top view,
- front view,
- dramatic perspective

without gameplay reason.

---

# 76. PRODUCT ICON BACKGROUND

Preferred production asset:

- transparent background,
- soft integrated contact shadow where appropriate.

UI provides:

- frame,
- rarity/quality treatment,
- selected state.

Do not bake a unique card background into every item image.

---

# 77. PRODUCT ICON LIGHTING

Use:

- soft key light,
- readable material highlights,
- mild warm fill,
- controlled element accent.

Keep lighting consistent across the set.

---

# 78. PRODUCT ICON SILHOUETTE

At 48–64 px, the object should still be identifiable.

Avoid:

- thin strings,
- tiny dangling detail,
- low-contrast transparent shapes.

---

# 79. PRODUCT ICON DETAIL BUDGET

Large icon:
- enough detail to feel premium.

Small icon:
- main form remains clean.

No micro-engraving required for normal items.

---

# 80. PRODUCT FAMILY SHAPE LANGUAGE

Product families should have loose visual tendencies.

## PROVISIONS
rounded, edible, packaged, inviting.

## CARE & COMFORT
soft, clean, ceramic/textile/glass.

## WEARABLES
clear wearable silhouette, compact premium shape.

## FIELD GEAR
rugged, modular, functional.

## CAPTURE & DISCOVERY GEAR
precision, readable mechanism, exploration-tech.

## ELEMENTAL CRAFT
striking, refined, magical-material emphasis.

## HABITAT & ENRICHMENT
larger, playful, creature-friendly.

---

# 81. QUALITY VISUAL SYSTEM

Product Quality uses:

- Standard,
- Fine,
- Masterwork.

Quality must be visually distinct from:

- Catchmon rarity,
- element,
- item family.

---

# 82. STANDARD QUALITY

Standard should feel:

- complete,
- attractive,
- normal.

Do not visually punish Standard items.

---

# 83. FINE QUALITY

Fine may add:

- cleaner highlight,
- refined frame accent,
- subtle sparkle,
- small craftsmanship symbol.

It should not change the product's base art completely.

---

# 84. MASTERWORK QUALITY

Masterwork may add:

- premium frame,
- controlled glow,
- richer highlight,
- high-craftsmanship symbol.

Avoid:

- huge rainbow aura,
- excessive particle storm.

---

# 85. QUALITY FRAME RULE

Preferred:

> one product icon + UI quality treatment.

Do not create three separate rendered icon files for Standard/Fine/Masterwork unless a specific product requires it.

---

# 86. RARITY VISUAL SYSTEM

Catchmon rarity is a different semantic layer.

Rarity may use:

- border treatment,
- small badge,
- collection reveal effect.

It should not determine operational card dominance.

---

# 87. RARITY VS QUALITY

Never use the exact same:

- border,
- glow,
- color progression

for both systems.

A Masterwork normal item and a rare Catchmon are different concepts.

---

# 88. SHINY VISUAL SYSTEM

Shiny is:

- creature-variant treatment,
- collection prestige.

It should be shown through:

- Catchmon art/variant,
- subtle special badge,
- capture reveal.

Not through gameplay-stat effects.

---

# 89. UI VISUAL THESIS

The UI should feel like:

# **A MODERN PREMIUM GAME UI BUILT AROUND THE WORLD — NOT A CORPORATE DASHBOARD**

UI must support:

- clarity,
- touch,
- density control,
- tactile satisfaction.

---

# 90. UI SURFACE LANGUAGE

Preferred surfaces:

- soft cards,
- bottom sheets,
- layered panels,
- controlled radius,
- subtle depth,
- clean separators.

Avoid:

- glassmorphism everywhere,
- heavy skeuomorphism,
- flat spreadsheet tables,
- neon-outline UI.

---

# 91. CARD SHAPE LANGUAGE

Cards should use:

- consistent radii from tokens,
- strong padding,
- simple hierarchy,
- limited decoration.

Product/Catchmon art provides personality.

---

# 92. BOTTOM SHEET LANGUAGE

Bottom sheets should feel:

- solid,
- premium,
- easy to scan.

Use:

- clear drag handle if draggable,
- stable action area,
- strong top hierarchy.

---

# 93. BUTTON LANGUAGE

Buttons should be:

- substantial,
- touch-friendly,
- visually obvious.

Primary CTA:
- strong semantic treatment.

Secondary:
- quieter.

Destructive:
- clearly distinct.

---

# 94. NO BUTTON RAINBOW

Do not assign random element colors to core buttons.

Element colors belong to content identity.

Actions use semantic UI colors.

---

# 95. TYPOGRAPHY PRINCIPLE

Typography should be:

- modern,
- friendly,
- highly readable,
- slightly premium.

Avoid:

- fantasy serif body text,
- narrow condensed body fonts,
- playful bubble fonts for core UI.

---

# 96. TYPOGRAPHY HIERARCHY

Need clear levels for:

- screen title,
- section title,
- card title,
- body,
- metadata,
- number/value.

Use existing token system before creating new sizes.

---

# 97. NUMERIC TYPOGRAPHY

Important numbers:

- Coins,
- sale values,
- timers,
- capture chance

should be immediately readable.

Prefer tabular/consistent numeral rendering where supported.

---

# 98. ICONOGRAPHY THESIS

Icons should be:

- simple,
- bold,
- rounded,
- consistent stroke/fill family,
- readable at small size.

Existing `src/ui/icons/` reference set should be reused before new icons are created.

---

# 99. ICON STROKE

New icons should match the established icon family's:

- stroke weight,
- corner shape,
- viewBox conventions,
- filled/outline behavior.

Do not mix unrelated icon libraries casually.

---

# 100. EMOJI RULE

Emoji are not final production icons.

Prototype-only use must be explicitly temporary.

---

# 101. ICON SEMANTIC CATEGORIES

Future icon production should distinguish:

## NAVIGATION
Shop, Catchmons, World.

## RESOURCES
Coins, Rank, Momentum.

## DOMAINS
Workshop, Shop Floor, Supply, Expedition.

## ACTIONS
Sell, Favorable Deal, Premium Pitch, Recommend, Craft, Evolve, Capture.

## STATES
Ready, Reserved, Locked, Traced, Encountered, Owned.

## QUALITY
Fine, Masterwork.

## WORLD
17 elements/regions where existing assets do not suffice.

---

# 102. STATUS VISUAL SYSTEM

Statuses should combine:

- icon,
- label where necessary,
- shape/color.

Avoid color-only state.

---

# 103. READY STATE

Ready should feel:

- positive,
- actionable,
- calm.

Use:
- localized highlight,
- subtle pulse.

Avoid:
- flashing red.

---

# 104. LOCKED STATE

Locked should be:

- muted,
- readable,
- still legible.

Do not reduce opacity so far that content becomes inaccessible.

---

# 105. RESERVED STATE

Reserved should communicate:

> unavailable because intentionally committed.

Use:
- small lock/reserve symbol,
- contextual label.

Do not use the same visual as permanently Locked content.

---

# 106. TRACED / ENCOUNTERED / OWNED

Discovery states should have distinct treatments.

## UNKNOWN
silhouette/hidden.

## TRACED
partial reveal.

## ENCOUNTERED
full identity known.

## OWNED
clear collection confirmation.

---

# 107. MOMENTUM VISUAL LANGUAGE

Momentum should feel:

- energetic,
- commercial,
- temporary.

It should visually differ from Coins and Shop Rank.

Potential style:
- compact meter,
- flowing/pulse state,
- shop-specific accent.

Exact color must respect tokens.

---

# 108. SHOP RANK VISUAL LANGUAGE

Shop Rank should feel:

- prestigious,
- stable,
- long-term.

Use:
- badge,
- compact progress,
- milestone framing.

Do not make it look like spendable currency.

---

# 109. COINS VISUAL LANGUAGE

Coins are:

- practical,
- ubiquitous,
- commercially grounded.

They should be easy to identify but not visually dominate every screen.

---

# 110. MOTION THESIS

Motion should communicate:

# **CAUSE → EFFECT → RESULT**

Catchmon Shop does not need constant decorative movement.

Motion should help the player understand what changed.

---

# 111. MOTION HIERARCHY

Three levels:

## ROUTINE
short, subtle.

Examples:
- button press,
- sale,
- craft ready.

## MEANINGFUL
noticeable but fast.

Examples:
- Fine result,
- special visitor,
- infrastructure upgrade.

## CELEBRATORY
strong/high-impact.

Examples:
- Catchmon capture,
- evolution,
- major region unlock.

---

# 112. ROUTINE MOTION

Routine motion should be:

- fast,
- reversible,
- non-blocking.

Use existing motion tokens.

Do not invent per-component timings unless needed.

---

# 113. HIGH-IMPACT MOTION

High-impact events may temporarily:

- slow,
- zoom,
- brighten,
- use particles.

They should remain short enough that repetition is not annoying.

---

# 114. REDUCED MOTION

Final implementation should respect reduced-motion preference.

Alternative presentation should preserve:

- hierarchy,
- outcome clarity.

---

# 115. PARTICLE BUDGET

Particles are reserved for:

- element resonance,
- quality,
- capture,
- evolution,
- special discovery.

Do not emit particles for every normal UI action.

---

# 116. SALE VFX

Standard Sale:
- compact Coin flow,
- small customer reaction.

Favorable Deal:
- stronger Momentum indication.

Premium Pitch:
- stronger premium value feedback.

Recommend:
- visible change of product interest.

---

# 117. CRAFT VFX

Crafting should emphasize:

- station activity,
- product completion,
- quality result.

Station effects should be themed but controlled.

---

# 118. EXPEDITION VFX

Expedition departure/return:
- brief directional motion,
- route/map cue.

No need for long travel animation.

---

# 119. CAPTURE VFX

Capture is one of the strongest visual moments.

It may use:

- focused background,
- element accent,
- controlled particle arc,
- success burst,
- Catchmon reveal.

Avoid copying recognizable Pokémon capture-device presentation.

---

# 120. EVOLUTION VFX

Evolution should feel:

- transformative,
- celebratory,
- identity-preserving.

Use:
- silhouette transformation,
- element accent,
- reveal,
- capability upgrade summary.

Avoid giant abstract energy explosion if it obscures the Catchmon.

---

# 121. REGION UNLOCK VFX

New region unlock may use:

- map expansion,
- element accent,
- environment reveal.

It should emphasize:

> new possibility.

---

# 122. WORLD ART DIRECTION — GLOBAL

The 17 regions must feel like one world family.

Shared rules:

- stylized 2.5D,
- premium painterly/3D-like materials,
- controlled detail,
- strong silhouettes,
- same lighting/render logic.

Regions differ through:

- shape,
- material,
- atmosphere,
- motion,
- element accent.

---

# 123. NO REGION-ONLY RECOLOR

A region must remain recognizable even in:

- grayscale,
- silhouette,
- cropped composition.

Color alone is insufficient.

---

# 124. FIRE — VULKANKRATER VISUAL LANGUAGE

Shape:
- angular volcanic terraces,
- rounded lava forms,
- heated stone.

Material:
- basalt,
- warm mineral,
- glowing seams.

Lighting:
- warm underglow,
- amber/red local accents.

Motion:
- heat shimmer,
- small ember drift.

Avoid:
- apocalyptic lava hell.

---

# 125. WATER — OZEAN VISUAL LANGUAGE

Shape:
- layered curves,
- flowing terraces,
- wave-cut structures.

Material:
- wet stone,
- shell,
- glassy water,
- rope/fabric.

Lighting:
- cool luminous fill,
- reflected light.

Motion:
- water movement,
- suspended droplets,
- gentle current.

Avoid:
- generic beach postcard.

---

# 126. ELECTRIC — BLITZFELD VISUAL LANGUAGE

Shape:
- sharp but clean conductive paths,
- antenna-like forms,
- rhythmic geometric structures.

Material:
- conductive metal,
- ceramic,
- charged glass.

Lighting:
- pulse accents,
- crisp highlights.

Motion:
- signal pulses,
- restrained arcs.

Avoid:
- cyberpunk neon city.

---

# 127. GRASS — WILDWUCHS VISUAL LANGUAGE

Shape:
- organic layered growth,
- broad leaves,
- roots,
- curved habitat structures.

Material:
- wood,
- leaf,
- moss,
- fiber.

Lighting:
- soft dappled light.

Motion:
- leaf sway,
- spores/pollen sparingly.

Avoid:
- generic jungle wall of green.

---

# 128. EARTH — ERDWALL VISUAL LANGUAGE

Shape:
- terraces,
- strata,
- broad structural masses.

Material:
- stone,
- clay,
- mineral layers.

Lighting:
- grounded warm-neutral.

Motion:
- dust motes,
- small shifting gravel only.

Avoid:
- uniformly brown cave.

---

# 129. POISON — GIFTSUMPF VISUAL LANGUAGE

Shape:
- pools,
- reeds,
- bulbous organic forms,
- twisted but controlled silhouettes.

Material:
- wet organic surfaces,
- reactive fluids,
- resin.

Lighting:
- muted environment + selective reactive highlights.

Motion:
- bubbles,
- vapor,
- subtle surface reaction.

Avoid:
- gross-out slime aesthetic.

---

# 130. NORMAL — GRAUFELD VISUAL LANGUAGE

Shape:
- broad open landscape,
- practical settlement forms,
- balanced geometry.

Material:
- wood,
- cloth,
- stone,
- everyday utility.

Lighting:
- clear neutral daylight.

Motion:
- wind,
- ambient everyday life.

Avoid:
- looking unfinished because it is “normal.”

---

# 131. ICE — FROSTGRAT VISUAL LANGUAGE

Shape:
- clean crystalline ridges,
- layered snow/ice planes.

Material:
- frost,
- translucent ice,
- pale stone.

Lighting:
- cool but bright,
- strong edge light.

Motion:
- snow drift,
- fine crystal particles.

Avoid:
- low-contrast blue-white wash.

---

# 132. FAIRY — FEENHAIN VISUAL LANGUAGE

Shape:
- soft organic arcs,
- delicate vertical growth,
- decorative natural structures.

Material:
- petal,
- iridescent surface,
- soft wood,
- luminous botanical detail.

Lighting:
- gentle warm-pastel highlights.

Motion:
- small lights,
- floating petals.

Avoid:
- excessive pink glitter.

---

# 133. WIND — WINDKAMM VISUAL LANGUAGE

Shape:
- tall open forms,
- bridges,
- banners,
- aerodynamic curves.

Material:
- pale stone,
- fabric,
- light wood,
- airy metal.

Lighting:
- bright open sky.

Motion:
- fabric,
- grass,
- cloud flow.

Avoid:
- invisible element with no material identity.

---

# 134. STEEL — ERZADER VISUAL LANGUAGE

Shape:
- engineered beams,
- clean extraction structures,
- practical modular forms.

Material:
- brushed metal,
- dark stone,
- precision hardware.

Lighting:
- focused work light,
- cool neutral highlights.

Motion:
- machinery,
- sparks very sparingly.

Avoid:
- dark industrial dystopia.

---

# 135. PSYCHIC — TRAUMFELD VISUAL LANGUAGE

Shape:
- layered floating planes,
- curved resonance forms,
- repeated patterns.

Material:
- soft translucent surfaces,
- reflective mineral,
- textile-like dream forms.

Lighting:
- diffused gradients,
- controlled glow.

Motion:
- gentle floating,
- ripple/echo effects.

Avoid:
- random surrealism with no readability.

---

# 136. LIGHT — LICHTUNG VISUAL LANGUAGE

Shape:
- clean open structures,
- clear vertical lines,
- reflective surfaces.

Material:
- pale stone,
- glass,
- polished natural surfaces.

Lighting:
- bright volumetric softness,
- precise highlights.

Motion:
- dust/light motes.

Avoid:
- pure white overexposure.

---

# 137. DARK — SCHATTENRISS VISUAL LANGUAGE

Shape:
- narrow passages,
- layered silhouettes,
- elegant angular forms.

Material:
- dark stone,
- matte surfaces,
- subtle reflective accents.

Lighting:
- controlled pools of light,
- deep but readable contrast.

Motion:
- shadow shifts,
- subtle drifting particles.

Avoid:
- horror/gothic cliché.

---

# 138. GHOST — NEBELMOOR VISUAL LANGUAGE

Shape:
- soft broken silhouettes,
- reeds,
- old structures,
- mist layers.

Material:
- weathered wood/stone,
- translucent fog,
- spectral residue.

Lighting:
- low-contrast luminous fog,
- cool selective accents.

Motion:
- mist drift,
- faint trace trails.

Avoid:
- scary haunted-house tone.

---

# 139. DRAGON — DRACHENSCHLUND VISUAL LANGUAGE

Shape:
- monumental natural structures,
- carved/forged forms,
- dramatic vertical mass.

Material:
- dark stone,
- forged metal,
- rare mineral.

Lighting:
- premium warm highlights,
- controlled dramatic contrast.

Motion:
- dust,
- heat,
- occasional grand environmental movement.

Avoid:
- generic boss arena.

---

# 140. COSMIC — STERNENKUPPEL VISUAL LANGUAGE

Shape:
- unusual arcs,
- layered celestial geometry,
- floating/anomalous forms.

Material:
- dark glass,
- refractive mineral,
- star-like embedded detail.

Lighting:
- deep neutral base,
- selective spectral accents.

Motion:
- slow orbit,
- subtle anomaly distortion.

Avoid:
- rainbow space-noise everywhere.

---

# 141. REGION ICON LANGUAGE

Region/element icons should be:

- simple,
- symbolic,
- compatible with shared icon system,
- readable at 20–32 px.

Do not use detailed landscape thumbnails as the only region identifier.

---

# 142. REGION THUMBNAILS

Where visual region cards need imagery:

- use authored environment vignette,
- consistent camera,
- consistent crop,
- one dominant silhouette.

Do not use unrelated key art.

---

# 143. WORLD MAP VISUAL LANGUAGE

World Map should feel:

- connected,
- exploratory,
- curated.

Preferred:
- stylized node/path topology,
- soft terrain/world backdrop.

Avoid:
- corporate card grid,
- literal Google Maps imitation.

---

# 144. LOCKED REGION VISUALS

Locked distant regions may appear as:

- silhouette,
- fogged node,
- partially revealed shape.

Do not show full detailed art for every locked world immediately.

---

# 145. PRODUCT FAMILY COLOR BOUNDARY

Product families should not each receive a dominant competing color system if element colors already exist.

Use:

- shape,
- icon,
- object language

before adding another color taxonomy.

---

# 146. DOMAIN VISUAL LANGUAGE

The four Catchmon domains need simple semantic cues:

## WORKSHOP
craft/tool.

## SHOP FLOOR
customer/commerce.

## SUPPLY
resource/logistics.

## EXPEDITION
route/compass.

These should use the shared icon language.

---

# 147. UI BACKGROUND VS WORLD BACKGROUND

UI sheets need reliable contrast regardless of region/shop.

Therefore UI surfaces should use stable semantic background tokens.

World art may vary behind them.

---

# 148. TRANSPARENCY DISCIPLINE

Use transparency where it improves layering.

Do not put translucent panels over busy worlds without enough contrast.

---

# 149. BLUR DISCIPLINE

Background blur may support modal focus.

Avoid using heavy blur as the primary design language.

---

# 150. SHADOW SYSTEM

UI shadows should be subtle and token-driven.

World shadows are environmental.

Do not mix exaggerated card shadows with flat environment rendering.

---

# 151. BORDER SYSTEM

Borders are semantic.

Use them for:

- selection,
- quality,
- rarity,
- focus.

Avoid putting strong borders around every object.

---

# 152. VISUAL DENSITY — MOBILE

Mobile screen should prioritize:

- one focal interaction,
- clear cards,
- generous tap space.

Large artwork may crop responsively.

Do not shrink desktop layouts.

---

# 153. DESKTOP VISUAL EXPANSION

Desktop may:

- reveal more environment,
- use side panels,
- show larger art.

But the same visual system applies.

---

# 154. ART PRODUCTION MODEL

Future asset production should be divided into reusable systems:

1. **Environment modules**
2. **Station modules**
3. **Display/storage modules**
4. **Product icons**
5. **Resource/component icons**
6. **Customer archetypes**
7. **UI icons/status**
8. **Region thumbnails/backgrounds**
9. **VFX/motion assets**
10. **Catchmon presentation adaptations**

Document 13 will enumerate exact counts.

---

# 155. MODULARITY RULE

Whenever possible, one asset should support multiple contexts.

Examples:

- one display frame for several products,
- one customer body rig with variants,
- one station base with upgrade attachments,
- one quality frame system.

Avoid unnecessary bespoke production.

---

# 156. ASSET REUSE WITHOUT REPETITION

Reuse structure, vary:

- attachment,
- material,
- prop,
- accent,
- silhouette.

The goal is coherent efficiency, not obvious duplication.

---

# 157. AI / IMAGE GENERATION — GLOBAL PROMPT RULE

Generated assets must always specify:

- Catchmon Shop visual language,
- asset category,
- camera/perspective,
- lighting,
- material language,
- silhouette priority,
- background/export behavior,
- forbidden styles.

Do not use short vague prompts such as:

> “cute fantasy shop item.”

---

# 158. AI ASSET MASTER STYLE STRING

A future generation prompt should conceptually include:

> stylized premium 2.5D game asset, soft three-quarter view, tactile handcrafted materials, clean readable silhouette, warm neutral global lighting with restrained element accent, cozy commerce fantasy, polished mobile-game quality, no photorealism, no pixel art, no anime UI, no generic medieval weapon-shop styling

This is a semantic guide, not a mandatory literal prompt string.

---

# 159. PRODUCT ICON GENERATION RULE

Every generated product icon prompt should specify:

- family,
- object function,
- silhouette,
- three-quarter camera,
- consistent light direction,
- material,
- transparent background,
- no embedded text,
- no baked rarity/quality frame.

---

# 160. STATION GENERATION RULE

Every station prompt should specify:

- functional station type,
- fixed soft-isometric camera,
- shop material palette,
- Catchmon interaction space,
- major silhouette,
- upgrade tier.

Do not generate stations independently with different camera angles.

---

# 161. REGION ART GENERATION RULE

Every region environment prompt should specify:

- region identity,
- shape language,
- material language,
- lighting,
- environmental motion cues,
- camera family,
- prohibition on color-only differentiation.

---

# 162. CUSTOMER GENERATION RULE

Customer prompts should specify:

- archetype function,
- readable silhouette,
- outfit cues,
- stylized world-consistent proportions,
- simpler detail than Catchmons,
- no celebrity/real-person likeness.

---

# 163. CATCHMON ADAPTATION RULE

Do not use AI generation to “improve” existing Catchmons into a different species/design language by default.

Use existing approved creature imagery as canonical.

Any regeneration/redesign requires explicit approval.

---

# 164. CONSISTENCY SEED / REFERENCE RULE

When using image generation for asset batches:

- use the same reference sheet/style guide,
- same camera,
- same light direction,
- same background rule,
- same material language.

Batch consistency is more important than isolated asset perfection.

---

# 165. ASSET REVIEW BEFORE BATCH SCALE

Before generating 100+ assets:

1. create 3–5 representative samples,
2. compare side-by-side,
3. lock style,
4. only then scale.

Never generate full catalog before visual QA.

---

# 166. GOLDEN SAMPLE SET

Document 13 should designate a small **Golden Sample Set**.

Recommended categories:

- one product from each major material class,
- one station,
- one display,
- one customer,
- one region vignette,
- one UI icon family.

All later assets are compared to these.

---

# 167. STYLE DRIFT AUDIT

For every new asset batch, check:

- perspective,
- edge softness,
- lighting,
- saturation,
- material detail,
- silhouette,
- scale,
- background handling.

Reject assets that are individually beautiful but stylistically inconsistent.

---

# 168. PRODUCT ICON QA CHECKLIST

For each icon:

- readable at small size?
- correct camera?
- transparent background?
- no accidental text?
- material readable?
- silhouette distinct?
- no baked quality frame?
- no excessive glow?
- family identity correct?
- element accent restrained?

---

# 169. ENVIRONMENT QA CHECKLIST

For each environment:

- correct region silhouette?
- distinguishable without color?
- same perspective family?
- gameplay objects readable?
- no visual noise behind UI?
- appropriate light?
- no photoreal mismatch?
- no inconsistent detail density?

---

# 170. STATION QA CHECKLIST

For each station:

- immediately identifiable?
- same shop world?
- functional role readable?
- Catchmon interaction space?
- upgrade state visually stronger?
- mobile silhouette?
- no excessive micro-detail?

---

# 171. UI QA CHECKLIST

For each UI surface:

- uses canonical tokens?
- readable contrast?
- minimum touch target?
- one primary action?
- semantic colors correct?
- element color not misused?
- quality/rarity states distinct?
- existing icon reused if possible?

---

# 172. CATCHMON SCENE QA CHECKLIST

For each Catchmon in-world placement:

- scale believable?
- contact shadow?
- ambient color integration?
- silhouette readable?
- not obscured by props?
- no giant permanent badge?
- work animation communicates role?

---

# 173. VISUAL PERFORMANCE BUDGET

The art direction must be achievable on mobile.

Potential constraints:

- limited simultaneous complex VFX,
- controlled transparent layers,
- limited large blur,
- modular textures,
- atlas where appropriate,
- avoid too many independently animated high-detail objects.

Exact technical budgets belong to Document 14.

---

# 174. VFX PERFORMANCE PRIORITY

When performance is constrained:

1. input responsiveness,
2. readable characters,
3. shop state,
4. essential feedback,
5. decorative effects.

Decorative particles are removed first.

---

# 175. MOTION PERFORMANCE PRIORITY

Catchmon/customer motion may use:

- low-cost sprite/transform animation,
- authored loops,
- event-driven animation.

Avoid requiring physics-heavy simulation.

---

# 176. 2D / 3D HYBRID CONSISTENCY

If assets mix techniques:

- 3D environment,
- 2D Catchmon render,
- illustrated product icons,

they must share:

- camera logic,
- light direction,
- saturation,
- edge softness,
- shadow behavior.

Technique consistency matters less than visual consistency.

---

# 177. NO TECHNIQUE PURITY REQUIREMENT

Catchmon Shop does not need:

> everything must be 3D

or

> everything must be hand-painted 2D.

The project should choose the most efficient technique per asset type while preserving one art direction.

---

# 178. BRAND PERSONALITY

Catchmon Shop should communicate:

- craft,
- curiosity,
- warmth,
- competence,
- charm.

Avoid childishness.

Avoid cynicism.

---

# 179. HUMOR BOUNDARY

Small visual humor is welcome through:

- Catchmon behavior,
- customer reactions,
- props.

Do not turn the entire art style into gag/cartoon chaos.

---

# 180. PREMIUM FEEL

Premium feel comes from:

- consistent composition,
- controlled detail,
- material readability,
- strong lighting,
- intentional spacing,
- coherent motion.

Not from:

- gold everywhere,
- constant sparkles,
- excessive gradients.

---

# 181. COZY FEEL

Cozy feel comes from:

- warm light,
- tactile materials,
- rounded shapes,
- friendly activity,
- safe creature spaces.

Not from:

- sepia filter,
- clutter,
- overly soft low-contrast UI.

---

# 182. COLLECTIBLE FEEL

Collectible feel comes from:

- clear silhouettes,
- consistent framing,
- meaningful reveals,
- visible collection states.

Not from:

- rarity explosion,
- gacha-style confetti for every item.

---

# 183. REGION PRESTIGE

Late regions may look more unusual/premium.

But visual complexity should increase through:

- material sophistication,
- composition,
- rare effects.

Not only through saturation.

---

# 184. COSMIC / DRAGON LATE-GAME BOUNDARY

Dragon/Cosmic should not visually communicate:

> strictly strongest.

They communicate:

- rare,
- advanced,
- unusual.

Common/early elements should remain beautiful and desirable.

---

# 185. UI ELEMENT ACCENT RULE

When showing element identity in UI, use one or two accents:

- icon,
- thin frame/rim,
- badge,
- small gradient.

Do not recolor entire screen.

---

# 186. UI QUALITY ACCENT RULE

Quality should override only the item's quality frame/treatment.

It should not recolor the page.

---

# 187. UI RARITY ACCENT RULE

Rarity should be visible mainly in Catchdex/reveal contexts.

Operational Roster should prioritize role.

---

# 188. VISUAL PRIORITY ORDER

In normal play:

1. actionable state,
2. Catchmon/customer/product,
3. system identity,
4. decorative atmosphere.

If decoration competes with action, decoration loses.

---

# 189. FOCAL POINT RULE

A normal mobile screen should have one main focal point.

Examples:

- requesting customer,
- selected recipe,
- selected Catchmon,
- selected route.

Do not create five equal glowing cards.

---

# 190. DEPTH / BLUR RULE

Use depth separation through:

- lighting,
- scale,
- value,
- subtle blur.

Do not blur gameplay-important background objects so heavily that the living-shop illusion disappears.

---

# 191. SHOP BACKGROUND ACTIVITY

Ambient activity may include:

- Catchmon idle,
- customer browsing,
- small machine loops,
- environmental motion.

Only a minority should be attention-seeking at once.

---

# 192. INTERACTION HIGHLIGHT

When tapping/hovering a zone:

- small lift/outline/light shift,
- no giant selection ring unless needed.

---

# 193. DISABLED STATE

Disabled actions should remain:

- readable,
- explanatory,
- visually subordinate.

Do not make them nearly invisible.

---

# 194. LOCKED WORLD CONTENT

Locked region content may retain mystery.

Use:

- silhouette,
- obscured art,
- low-contrast preview.

Do not show the full reward table.

---

# 195. MARKETING VS IN-GAME ART

Marketing/key art may use:

- more dramatic composition,
- larger effects.

In-game assets remain:

- functional,
- consistent,
- readable.

Do not use marketing-render style for every normal icon.

---

# 196. FINAL LOGO BOUNDARY

The final logo is not defined here.

It should eventually match:

- premium cozy fantasy,
- readable mobile/web,
- collection/shop dual identity.

---

# 197. FILE / EXPORT PRINCIPLE

Final technical specs belong to Document 13.

General requirements:

- transparent assets stay transparent,
- UI frames separate from content art,
- source resolution high enough for target usage,
- no embedded text in art unless unavoidable,
- consistent padding.

---

# 198. TEXT-IN-ASSET RULE

Avoid generating text inside:

- product icons,
- station art,
- region art,
- customer art.

Text belongs in UI.

This supports:

- localization,
- readability,
- correction.

---

# 199. BAKED UI RULE

Do not bake:

- buttons,
- labels,
- currency counters,
- rarity frames

into environment/item artwork.

Art and interface remain modular.

---

# 200. ASSET BACKGROUND RULE

Asset categories should follow consistent background rules.

## Product/resource icons
transparent.

## Customer/Catchmon portraits
transparent or standardized portrait treatment.

## Region vignettes
full-background environment.

## Station modules
transparent/modular where renderer requires.

Document 13 will finalize.

---

# 201. MASTER VISUAL QA — SIDE-BY-SIDE TEST

Before approving the art direction, place together:

- one Catchmon,
- one customer,
- one product icon,
- one station,
- one UI sheet,
- one region image.

Ask:

> **Do these look like one game?**

If not, fix style before scaling.

---

# 202. GRAYSCALE TEST

For:

- UI hierarchy,
- region differentiation,
- quality state,
- actionable state

review in grayscale.

Color should enhance, not carry all meaning.

---

# 203. SMALL-SIZE TEST

Test:

- product icons,
- Catchmon cards,
- region icons,
- station states

at realistic mobile size.

Assets that only work large must be simplified.

---

# 204. BUSY-SCENE TEST

Place:

- several customers,
- Catchmons,
- ready station,
- product displays

in one shop composition.

Check whether:

- actionable states remain visible,
- colors do not clash,
- characters remain readable.

---

# 205. REGION COLLISION TEST

Test close color families side-by-side:

- Water,
- Ice,
- Steel,
- Wind.

Also:

- Grass,
- Poison,
- CTA green.

Differentiation must use:

- shape,
- material,
- icon,
- value.

---

# 206. QUALITY / RARITY COLLISION TEST

Place:

- Fine product,
- Masterwork product,
- rare Catchmon,
- shiny Catchmon

on one screen.

Each semantic state must remain understandable.

---

# 207. DARK-MODE / LIGHT-MODE BOUNDARY

The physical game world is not simply “dark mode/light mode.”

UI appearance may respect platform/app appearance if supported.

Art assets should remain readable across intended UI backgrounds.

---

# 208. ART DIRECTION ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — STYLE PER SYSTEM

Crafting is fantasy, UI is SaaS, world is anime, products are photoreal.

Result:
no visual identity.

---

## ANTI-PATTERN B — FULL 3D REQUIREMENT TOO EARLY

Every Catchmon needs a rigged 3D model before prototype.

Result:
production stalls.

---

## ANTI-PATTERN C — STICKER CATCHMONS

Character art is pasted without grounding.

Result:
cheap hybrid look.

---

## ANTI-PATTERN D — REGION RECOLOR

Same environment in 17 hues.

Result:
fake world breadth.

---

## ANTI-PATTERN E — GOLD = PREMIUM EVERYWHERE

Premium state uses gold on every surface.

Result:
visual cliché.

---

## ANTI-PATTERN F — GLOW EVERYWHERE

Products, stations, Catchmons, UI all glow.

Result:
no hierarchy.

---

## ANTI-PATTERN G — TOO MUCH MICRO-DETAIL

Assets look great at 4K but fail on phone.

Result:
mobile unreadability.

---

## ANTI-PATTERN H — ELEMENT COLOR BUTTONS

Actions use element colors instead of semantic UI colors.

Result:
UX confusion.

---

## ANTI-PATTERN I — QUALITY = RARITY

Same frames/colors for item quality and creature rarity.

Result:
semantic collision.

---

## ANTI-PATTERN J — GENERATE 500 ASSETS BEFORE LOCKING STYLE

Result:
mass rework.

---

## ANTI-PATTERN K — UNIQUE CAMERA PER ICON

Each item render uses different perspective.

Result:
catalog inconsistency.

---

## ANTI-PATTERN L — EMOJI ICONS

Final UI uses emoji placeholders.

Result:
style breaks.

---

## ANTI-PATTERN M — DARK SHOP

Atmospheric lighting hides gameplay.

Result:
readability loss.

---

## ANTI-PATTERN N — KIDS-APP SATURATION

Every surface is bright primary color.

Result:
premium/cozy identity lost.

---

## ANTI-PATTERN O — MEDIEVAL WEAPON SHOP

Visual inspiration drifts into swords, armor, tavern fantasy.

Result:
Catchmon product identity lost.

---

## ANTI-PATTERN P — CATCHMON REDESIGN DRIFT

AI-generated adaptations alter canonical creatures.

Result:
collection identity breaks.

---

# 209. GOLDEN VISUAL PROTOTYPE

Before large-scale asset production, create one polished mini-scene containing:

- starter shop section,
- one station,
- one display,
- one customer,
- two existing Catchmons,
- three product icons,
- one UI customer sheet,
- one element accent.

This becomes the first visual proof.

---

# 210. GOLDEN PRODUCT SET

Before creating 70–100 products, generate only:

1. Provisions sample,
2. Care sample,
3. Wearable sample,
4. Field Gear sample,
5. Capture Gear sample,
6. Elemental Craft sample,
7. Habitat sample.

Approve them side-by-side.

---

# 211. GOLDEN STATION SET

Before creating all station tiers:

- generate one base station,
- one upgraded state,
- compare against shop scene.

Then propagate the same visual logic.

---

# 212. GOLDEN REGION SET

Before all 17 environments:

generate 3 highly contrasting regions:

- Vulkankrater / Fire,
- Ozean / Water,
- Traumfeld / Psychic

or similarly contrasting set.

Approve:

- camera,
- detail,
- lighting,
- shape language.

Then scale.

---

# 213. GOLDEN UI SET

Before full UI production, create:

- Main Shop HUD,
- customer bottom sheet,
- Catchmon card/detail,
- expedition route card.

Verify one coherent component language.

---

# 214. ART PROTOTYPE TEST A — CATCHMON INTEGRATION

Place existing Catchmon art in the shop.

Question:

> Does it feel grounded rather than pasted?

---

# 215. ART PROTOTYPE TEST B — PRODUCT READABILITY

Show seven family sample icons at 48 px.

Question:

> Can player distinguish them?

---

# 216. ART PROTOTYPE TEST C — STATION SILHOUETTE

Show all five station silhouettes.

Question:

> Can player tell them apart without labels?

---

# 217. ART PROTOTYPE TEST D — REGION DIFFERENCE

Show three region images in grayscale.

Question:

> Are they still distinct?

---

# 218. ART PROTOTYPE TEST E — STATE COLLISION

Show:
- Fire,
- Masterwork,
- rare,
- selected,
- ready

on one screen.

Question:

> Are semantics still clear?

---

# 219. ART PROTOTYPE TEST F — MOBILE BUSY SHOP

Simulate:
- 3 customers,
- 3 Catchmons,
- 2 ready stations,
- 3 displays.

Question:

> Does the player still know what to tap?

---

# 220. ART TELEMETRY / USER TESTING BOUNDARY

Visual testing should measure:

- object recognition,
- region recognition,
- UI hierarchy,
- interaction discoverability,
- icon confusion,
- state confusion.

Art direction is validated through usability, not taste only.

---

# 221. CANONICAL VISUAL SOURCE OF TRUTH

When implementation begins:

## UI tokens
remain canonical in the design-system source.

## Element colors
remain canonical in element tokens/reference.

## Icons
remain canonical in shared icon registry.

## Art direction
this document defines visual intent.

## Asset catalog
Document 13 defines exact produced assets.

Do not duplicate visual constants in feature code.

---

# 222. STYLE VERSIONING

If the visual direction changes later:

- update this document,
- update Golden Samples,
- migrate batches intentionally.

Do not let different feature branches silently create new styles.

---

# 223. ART REVIEW GATE

No large asset batch should be accepted without:

1. Golden Sample comparison,
2. small-size test,
3. consistency test,
4. semantic test,
5. mobile readability test.

---

# 224. DESIGN REVIEW GATE

Before final UI implementation, verify:

- token usage,
- element semantics,
- quality/rarity separation,
- touch readability,
- no duplicate color system.

---

# 225. LOCKED DECISIONS FROM DOCUMENT 12

The following decisions are considered part of the intended Art Direction unless deliberately revised:

1. Catchmon Shop uses a premium cozy commerce visual identity with lively Catchmon charm.
2. The primary environment direction is stylized premium 2.5D with a soft three-quarter / soft-isometric presentation.
3. The main shop uses a controlled/fixed camera rather than free-camera 3D exploration.
4. The shop is staged like a readable living diorama.
5. Major objects use strong mobile-readable silhouettes.
6. Global shape language favors rounded, softened, tactile geometric forms.
7. Core material language combines warm wood, brushed metal, ceramic, glass, fabric, stone, and controlled elemental materials.
8. The project reuses the existing canonical design-token/color system and does not create a second independent palette.
9. Element colors are semantic accents rather than full-screen recolor rules.
10. Element colors must not replace CTA/success/error semantics.
11. Large structural surfaces remain calmer than key collectible/gameplay content.
12. Default shop lighting is warm, soft, readable, and premium.
13. Glow is a scarce effect reserved for meaningful states.
14. The starter shop is modest but intentionally attractive, not broken or poor.
15. Shop growth must be visible through space/material/station/display sophistication.
16. The Sales Floor remains open and customer-readable.
17. Display units are modular and product-focused.
18. Premium displays use controlled light/glass/elevation rather than excessive gold.
19. All five crafting stations share one world language while maintaining distinct silhouettes.
20. Station visual states change silhouette/function cues rather than only adding tiny decoration.
21. Storage is organized and safe rather than cluttered.
22. Catchmon support spaces communicate partnership and comfort, not confinement.
23. Existing 104 Catchmon identities/art are preserved as canonical content.
24. The preferred v1 integration allows high-quality 2D/2.5D Catchmon renders inside a spatial 2.5D scene.
25. The project does not require fully rigged 3D models for all 104 Catchmons before implementation.
26. Catchmons must be visually grounded through scale, light response, contact shadow, and scene integration.
27. Existing Catchmon art must not be casually regenerated/redesigned through AI.
28. Customers use a simpler visual detail budget than Catchmons.
29. Product icons use one consistent premium object-illustration language.
30. Product icons use a consistent three-quarter camera family.
31. Product icons are generally produced on transparent backgrounds without baked UI frames or text.
32. Product Quality is represented through UI treatment around one base product icon rather than three independently rendered quality assets.
33. Standard quality remains visually attractive.
34. Fine and Masterwork use increasingly refined but controlled visual treatments.
35. Product Quality and Catchmon Rarity use distinct visual systems.
36. Shiny status remains a creature visual/collection treatment rather than power treatment.
37. The UI should feel like a modern premium game UI rather than a SaaS dashboard.
38. UI components use soft cards, bottom sheets, controlled depth, clear hierarchy, and canonical tokens.
39. Core buttons use semantic action colors rather than element colors.
40. Typography remains modern, friendly, and highly readable.
41. Shared icons are reused before creating new ones.
42. New icons must match the existing shared icon family.
43. Emoji are not final production icons.
44. Motion communicates cause → effect → result.
45. Motion uses routine, meaningful, and celebratory tiers.
46. Existing motion tokens should be reused for routine UI motion.
47. Reduced-motion support is required in final implementation.
48. Particle effects are limited to meaningful states.
49. Capture, evolution, and region unlock receive strong but controlled visual presentation.
50. All 17 regions share one rendering language while differing through shape, material, atmosphere, motion, and element accent.
51. Region identity cannot depend on color alone.
52. Vulkankrater visually emphasizes volcanic forms/heat without becoming apocalyptic.
53. Ozean emphasizes fluid layered forms rather than generic beach imagery.
54. Blitzfeld emphasizes signal/precision rather than cyberpunk neon.
55. Wildwuchs emphasizes organic growth rather than a generic green jungle wall.
56. Erdwall emphasizes mass/strata rather than brown cave monotony.
57. Giftsumpf emphasizes reactive chemistry without gross-out slime.
58. Graufeld remains intentionally designed and is not visually “default/uninteresting.”
59. Frostgrat remains bright/readable rather than low-contrast blue-white.
60. Feenhain uses controlled delight/iridescence rather than excessive pink glitter.
61. Windkamm uses mobility/open forms and physical motion cues.
62. Erzader uses engineered durable utility without dark industrial dystopia.
63. Traumfeld uses structured dream/resonance design rather than unreadable randomness.
64. Lichtung uses clarity/light without overexposure.
65. Schattenriss uses elegant hidden-opportunity visual language rather than horror/gothic cliché.
66. Nebelmoor uses trace/mist/elusive atmosphere without horror.
67. Drachenschlund communicates mastery/prestige rather than boss-arena combat.
68. Sternenkuppel communicates anomaly/synthesis rather than rainbow-space noise.
69. World Map visual language should feel connected/exploratory rather than a button grid.
70. The project uses modular asset production where possible.
71. AI-generated assets must use explicit style/camera/material/background constraints.
72. Batch generation must begin with Golden Samples before scaling.
73. Product, station, environment, UI, and Catchmon-placement assets each require dedicated QA.
74. Assets must be tested at real mobile sizes.
75. Cross-element color collisions require grayscale/shape/icon validation.
76. Quality/rarity/shiny/element states require explicit semantic collision testing.
77. Art production should use the most efficient technique per asset type; technique purity is not required.
78. Marketing art may be more dramatic than in-game assets.
79. Text should generally not be baked into generated art.
80. UI frames/buttons/labels should not be baked into content art.
81. Performance/readability outrank decorative effects.
82. Final large-scale asset production remains blocked until Document 13 defines exact taxonomy/specifications.

---

# 226. OPEN QUESTIONS DELIBERATELY LEFT FOR DOCUMENT 13 / IMPLEMENTATION

This document intentionally leaves open:

- exact file formats,
- exact pixel dimensions,
- exact product-icon export size,
- exact region-background export size,
- exact station-module export dimensions,
- exact sprite-sheet conventions,
- exact alpha/premultiplication rules,
- exact naming convention,
- exact folder hierarchy,
- exact Golden Sample file list,
- exact asset counts,
- exact station-tier count,
- exact customer variant count,
- exact region vignette count,
- exact 2D animation format,
- exact VFX implementation format,
- exact fonts,
- final logo,
- final marketing art.

These belong to Document 13 and Technical Architecture.

---

# 227. DEPENDENCY HANDOFF TO DOCUMENT 13

Documents 01–12 now define:

- game identity,
- gameplay,
- economy,
- products,
- customers,
- Catchmons,
- expeditions,
- infrastructure,
- progression,
- worlds,
- UX,
- and the final intended visual language.

The next question is:

> **Exactly which assets do we need to build, in what format, in what quantity, in what order, and which ones can reuse existing assets?**

Document 13 must convert the visual/gameplay architecture into a production-ready asset plan.

---

# 228. NEXT DOCUMENT

## `13_CATCHMON_SHOP_ASSET_TAXONOMY_AND_PRODUCTION_PLAN.md`

Document 13 should define:

### Existing assets
- 104 Catchmons,
- existing icons,
- design tokens,
- region references.

### New UI assets
- nav icons,
- transaction icons,
- role/domain icons,
- state icons,
- quality treatments,
- region/element icons if missing.

### Product assets
- exact product icon classes,
- quantity envelope,
- required sizes,
- transparent export rules.

### Resource assets
- routine materials,
- special components,
- Coin/Momentum/Rank symbols.

### Station assets
- five station families,
- major upgrade states,
- modular attachments.

### Shop/environment assets
- shop shell states,
- zone modules,
- displays,
- storage,
- Expedition Hub,
- support area.

### Customer assets
- archetype base models,
- visual variants,
- special visitors.

### Region assets
- 17 region thumbnails/backgrounds,
- route cards if required,
- world-map visuals.

### Motion/VFX assets
- sale,
- quality,
- capture,
- evolution,
- region unlock.

### Technical specs
- file formats,
- dimensions,
- alpha,
- naming,
- compression,
- export rules.

### Production order
- Golden Samples,
- prototype,
- vertical slice,
- full content.

### Reuse matrix
- what already exists,
- what needs adaptation,
- what must be newly created.

Only after Document 13 is approved should full-scale asset generation begin.

---

# 229. DEFINITION OF DONE FOR ART DIRECTION & VISUAL STYLE BIBLE

Document 12 is ready to hand off when the project can answer:

- What should Catchmon Shop feel like visually?
- What should it explicitly not look like?
- Is the game 2D, 2.5D, or full 3D?
- How is the main shop camera controlled?
- What is the global shape language?
- What materials define the world?
- How are element materials differentiated?
- How are canonical element colors used?
- How is CTA/UI semantic color protected?
- What is the lighting philosophy?
- How does shop progression change appearance?
- What should each of the five stations look/feel like?
- How are Catchmons integrated without looking pasted in?
- Are full 3D Catchmon models required?
- What is the customer visual detail level?
- What is the product-icon camera/style?
- How are Standard/Fine/Masterwork shown?
- How is Catchmon Rarity visually separated from product Quality?
- How is Shiny treated?
- What is the UI visual language?
- What is the icon style?
- What is the motion hierarchy?
- What visual role does every one of the 17 regions have?
- How are regions differentiated beyond color?
- How should AI-generated assets be prompted and reviewed?
- What is a Golden Sample?
- What QA checks prevent style drift?
- Which production details intentionally remain for Document 13?

If these answers remain coherent during Golden Sample creation, the project is ready to build the exact asset taxonomy and production pipeline.
