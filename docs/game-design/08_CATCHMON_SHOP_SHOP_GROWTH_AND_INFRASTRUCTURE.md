# CATCHMON SHOP — 08 SHOP GROWTH & INFRASTRUCTURE

**Status:** Shop Growth & Infrastructure Architecture v1  
**Purpose:** Define how the player's physical shop is structured, expanded, upgraded, visually transformed, and used to support production, display, storage, customer flow, Catchmon assignments, supply operations, and expeditions without turning the game into a free-form city builder or a grid-management chore  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  
- `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`  
- `06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`  
- `07_CATCHMON_SHOP_ACQUISITION_AND_EXPEDITIONS.md`  
- canonical design-system references in `reference/design-system/`

**Authority:** This document owns:
- the physical shop model,
- shop expansion architecture,
- room/zone/module structure,
- production infrastructure representation,
- display infrastructure,
- storage infrastructure,
- customer-capacity infrastructure,
- Catchmon workplace/support infrastructure,
- supply infrastructure,
- expedition infrastructure,
- infrastructure upgrade categories,
- infrastructure capacity model,
- visible growth rules,
- shop transformation stages,
- infrastructure-vs-decoration boundary,
- placement complexity boundary,
- infrastructure upgrade interaction,
- construction timing philosophy,
- infrastructure persistence principles,
- infrastructure prototype scope,
- rules for later building/station asset planning.

**Out of scope:**  
- exact final building art,
- exact shop floorplan,
- exact dimensions,
- exact upgrade costs,
- exact upgrade durations,
- exact room names,
- exact station visual design,
- exact furniture catalog,
- exact decoration catalog,
- exact progression unlock order,
- exact shop-level requirements,
- exact monetization,
- exact social/guild spaces,
- housing/base-building outside the shop,
- exact animation implementation,
- final UX,
- final technical scene architecture.

---

# 1. WHY THIS DOCUMENT EXISTS

Catchmon Shop already has two major gameplay loops.

## SHOP LOOP

**Craft → Display → Customer → Sell → Reinvest**

## WORLD LOOP

**Prepare → Team → Expedition → Reward/Discovery → Encounter → Capture → Return**

Those systems need a physical home.

Without meaningful infrastructure, upgrades become:

> “+1 slot”

inside abstract menus.

That would weaken the fantasy of owning and growing a real Catchmon shop.

But the opposite extreme is also dangerous.

If the player must:

- place every table manually,
- optimize walking paths,
- rotate furniture pixel-perfectly,
- manage power grids,
- construct dozens of detached buildings,

the game becomes a city/base builder rather than a shop-management game.

The infrastructure system therefore needs to create:

> **visible, satisfying shop growth with meaningful capacity decisions — without making layout management the primary game.**

---

# 2. INFRASTRUCTURE DESIGN THESIS

The core thesis is:

> **Infrastructure should convert economic progression into visible capability.**

When the player invests Coins, the result should not only appear in a stat panel.

The player should see:

- more shelves,
- better stations,
- larger work areas,
- more active Catchmons,
- more customers,
- improved expedition preparation,
- expanded storage,
- a more impressive shop.

Infrastructure therefore has two jobs:

## FUNCTIONAL

Change what the player can do.

## VISUAL

Show how far the player has progressed.

Both are required.

---

# 3. THE SHOP IS THE PRIMARY HOME SPACE

The main shop remains the emotional center of Catchmon Shop.

It should contain or visually connect to:

- customer area,
- displays,
- production spaces,
- Catchmon activity,
- expedition/supply support,
- major progression changes.

The player should regularly return to one coherent home space.

---

# 4. NO DISCONNECTED MENU-CITY

Avoid a structure where:

- crafting lives in one menu,
- customers in another,
- Catchmons in another,
- expedition building in another,
- storage in another,
- upgrades in another,

with no sense of place.

Management screens may exist.

But the physical shop should make the systems feel connected.

---

# 5. PHYSICAL SHOP MODEL

The intended architecture uses:

# **EXPANDABLE FUNCTIONAL ZONES**

rather than:

- fully freeform city construction,
- one giant static backdrop,
- dozens of separate buildings.

The shop grows through a small number of coherent zones.

---

# 6. WHY ZONES

Zones solve several problems.

They:

- create visible spatial identity,
- support mobile readability,
- let capacity grow gradually,
- avoid grid-placement micromanagement,
- provide clear places for Catchmons,
- create useful asset families.

A zone can expand visually without requiring the player to design every tile.

---

# 7. INITIAL ZONE ARCHITECTURE

The shop contains six functional zones:

1. **Sales Floor**
2. **Workshop Wing**
3. **Storage & Supply**
4. **Catchmon Support Area**
5. **Expedition Corner / Expedition Hub**
6. **Special / Prestige Space**

Final player-facing names may change.

These are system ownership zones.

---

# 8. ZONE 1 — SALES FLOOR

The Sales Floor contains the visible commercial heart of the shop.

It supports:

- product displays,
- customer browsing,
- customer request states,
- Shop Floor Catchmon presence,
- special visitor presentation,
- visual shop identity.

---

# 9. SALES FLOOR — CORE INFRASTRUCTURE

The Sales Floor owns:

- Display Capacity,
- Active Customer Capacity,
- customer browsing space,
- premium/special presentation capacity.

It does not directly own production.

---

# 10. DISPLAY CAPACITY

Display infrastructure determines:

- how many product slots/categories can be actively presented,
- how broad the visible product mix can be,
- how much demand control the player has.

Display upgrades therefore increase both:

- capacity,
- strategic flexibility.

---

# 11. DISPLAY UNIT MODEL

The base system should use **functional Display Units** rather than individual physical product placement.

A Display Unit may represent:

- shelf,
- counter,
- rack,
- stand,
- premium pedestal.

The player assigns product stock to the unit.

---

# 12. NO ITEM-BY-ITEM PHYSICAL PLACEMENT

Avoid:

> manually drag every product onto a shelf.

The player decides:

- which product/family occupies the display,
- how much stock is allocated,
- whether a display has a specialization.

The game handles visual product arrangement automatically.

---

# 13. DISPLAY SPECIALIZATION

Later Display Units may support specialization such as:

- general merchandise,
- premium goods,
- Provisions,
- Gear,
- Elemental Craft,
- Habitat orders.

Specialization must create demand/visual effects.

It should not become a large equipment-modification system.

---

# 14. PREMIUM DISPLAY

A limited premium display concept may later support:

- Fine/Masterwork goods,
- special visitors,
- high-value Elemental Craft.

This can create meaningful choice:

> Which product deserves premium presentation?

Exact rules remain open.

---

# 15. ACTIVE CUSTOMER CAPACITY

The Sales Floor controls how many customers can:

- browse,
- wait,
- interact

simultaneously.

Customer capacity is a visible progression dimension.

A larger shop should feel busier.

---

# 16. CUSTOMER CAPACITY VS ARRIVAL RATE

As defined in Document 05:

- capacity = number present,
- arrival rate = how quickly they appear.

Infrastructure may affect both, but through different upgrades.

Do not collapse them into one stat.

---

# 17. CUSTOMER SPACE UPGRADES

Potential functional upgrade classes:

- additional browsing space,
- additional request capacity,
- better flow,
- special visitor area.

Exact physical representation belongs to later UX/art.

---

# 18. ZONE 2 — WORKSHOP WING

The Workshop Wing houses the five functional station archetypes from Document 04:

1. Provision Station
2. Care Atelier
3. Fieldworks Bench
4. Resonance Lab
5. Habitat Workshop

---

# 19. STATION ≠ BUILDING

A station is a **functional production archetype**.

It does not automatically require:

- a detached building,
- its own screen,
- its own loading scene.

In the physical shop, stations may exist as:

- dedicated benches,
- corners,
- workrooms,
- connected workshop modules.

---

# 20. WORKSHOP CAPACITY

Infrastructure controls:

- which station archetypes are available,
- how many active production slots exist,
- queue capacity,
- Catchmon support capacity,
- station capability level.

These are separate progression dimensions.

---

# 21. STATION UNLOCK

A station should enter the shop when its product family becomes relevant.

Do not expose five empty station systems at the start.

The physical shop evolves as new station types appear.

---

# 22. STATION CAPABILITY UPGRADE

A station upgrade may improve:

- recipe eligibility,
- active slot capacity,
- queue support,
- Catchmon support,
- visible sophistication.

Exact values belong to progression/balance.

---

# 23. SLOT UPGRADE VS STATION UPGRADE

These are conceptually different.

## STATION CAPABILITY
“What can this station do?”

## PRODUCTION SLOT
“How much can it do in parallel?”

This distinction creates investment choices.

---

# 24. STATION VISUAL GROWTH

Station upgrades should visibly change:

- size,
- tools,
- lighting,
- complexity,
- Catchmon work space.

A player should see that the station improved.

---

# 25. MULTIPLE IDENTICAL STATION BOUNDARY

The base architecture prefers:

> one evolving instance of each station archetype

over:

> placing five identical copies.

Parallel production should usually come from:

- slot expansion,
- station development.

This keeps the shop readable.

---

# 26. WHY NOT DUPLICATE STATIONS

Many identical stations would create:

- visual clutter,
- pathing complexity,
- asset duplication,
- factory-game behavior.

Catchmon Shop should feel like a premium evolving shop, not an industrial plant.

---

# 27. ZONE 3 — STORAGE & SUPPLY

This zone supports:

- routine material storage,
- product storage,
- special-component handling,
- supply assignment,
- inventory overflow protection,
- visible goods movement.

---

# 28. STORAGE ARCHITECTURE

Storage should have separate logical capacities for:

1. **Materials**
2. **Products**
3. **Special Components**

Exact implementation may combine UI physically.

The economic behaviors remain distinct.

---

# 29. MATERIAL STORAGE

Material storage determines:

- how much routine supply can accumulate,
- offline supply cap,
- practical crafting buffer.

This is an important economic upgrade.

---

# 30. PRODUCT STORAGE

Product storage limits:

- pre-crafting,
- inventory stockpile,
- long-session production behavior.

It should create useful pressure without becoming cleanup labor.

---

# 31. SPECIAL COMPONENT STORAGE

Special components require protection.

If they have a cap:

- capacity should be generous,
- warnings should be explicit,
- no rare component should silently disappear.

The infrastructure system should prioritize safety over punishment.

---

# 32. STORAGE VISUALIZATION

The shop may visually show:

- crates,
- bins,
- shelves,
- material containers,
- delivery spaces.

But exact stored quantities do not need to be represented 1:1 physically.

---

# 33. NO INVENTORY TETRIS

The player does not manually arrange items in storage grids.

Storage is capacity management.

Not spatial puzzle gameplay.

---

# 34. SUPPLY ASSIGNMENT AREA

Supply-domain Catchmons need a physical/systemic place to work.

This zone may contain:

- supply posts,
- sorting area,
- resource station,
- gathering dispatch point.

Exact art is deferred.

---

# 35. SUPPLY CAPACITY

Infrastructure determines how many Catchmons can perform Supply duties simultaneously.

This is distinct from expedition capacity.

---

# 36. SUPPLY UPGRADE EFFECTS

Supply infrastructure may improve:

- active Supply assignment slots,
- routine-material capacity,
- material recovery handling,
- conversion access,
- overflow protection.

Exact Catchmon effects remain in Document 06.

---

# 37. SUPPLY DOES NOT BECOME A MINI FARM

Avoid turning Supply into:

- field planting,
- manual harvesting,
- watering,
- crop rotation.

The game is not a farming sim.

Supply infrastructure supports the shop economy.

---

# 38. ZONE 4 — CATCHMON SUPPORT AREA

This zone gives owned Catchmons a visible place inside the shop.

It supports:

- unassigned roaming/rest,
- assignment visibility,
- evolution/development presentation,
- Catchmon management access,
- aesthetic collection presence.

---

# 39. SUPPORT AREA IS NOT A STAMINA SYSTEM

The support area does not exist because Catchmons require forced rest.

It exists for:

- visual life,
- roster organization,
- progression moments.

No universal fatigue loop is introduced.

---

# 40. CATCHMON CAPACITY — DISPLAY VS OWNERSHIP

The player may own many Catchmons.

The shop does **not** need to physically display all 104 at once.

The support area may visually rotate:

- favorites,
- unassigned Catchmons,
- recently captured Catchmons,
- context-relevant Catchmons.

Ownership capacity is not limited by visible floor space.

---

# 41. NO “BOX STORAGE” PUNISHMENT

Catchmons not currently visible remain fully owned.

The game should not frame them as discarded/inactive inventory.

---

# 42. ASSIGNMENT HUB

The Catchmon Support Area may act as the entry point to:

- Workshop assignment,
- Shop Floor assignment,
- Supply assignment,
- Expedition assignment.

The final UX may also allow assignment directly from each functional zone.

---

# 43. EVOLUTION PRESENTATION

Evolution should be a meaningful moment.

The physical support area may later contain a dedicated evolution presentation or chamber.

However:

> **Evolution does not automatically require a separate permanent building.**

Document 09/11 can decide whether a dedicated visual space is justified.

---

# 44. CATCHMON DEVELOPMENT INFRASTRUCTURE

Catchmon Level should primarily come from participation.

Infrastructure may later provide:

- visibility,
- development overview,
- mild support/acceleration.

It should not become:

> pay Coins to idle-train every Catchmon infinitely.

---

# 45. ZONE 5 — EXPEDITION HUB

The Expedition Hub supports the entire Document 07 loop.

It provides:

- expedition slot capacity,
- team preparation,
- loadout preparation,
- route dispatch,
- result return,
- encounter result access.

---

# 46. EXPEDITION SLOT CAPACITY

Infrastructure determines how many expeditions can run concurrently.

Exact counts are deferred.

The player must make meaningful decisions about:

- which route,
- which Catchmons,
- which opportunity

gets expedition capacity.

---

# 47. EXPEDITION HUB UPGRADES

Possible upgrade classes:

- more expedition slots,
- Support Catchmon capacity,
- preparation/loadout support,
- route information,
- result holding capacity,
- special-route capability.

Not all need to exist.

---

# 48. LEAD / SUPPORT INFRASTRUCTURE

Support slot progression should be represented through expedition infrastructure rather than arbitrary account level alone.

This creates visible capability growth.

---

# 49. LOADOUT SUPPORT

The Expedition Hub may expand preparation flexibility through:

- additional preparation slot,
- better reusable Gear support,
- better route preview.

Exact counts belong to progression.

---

# 50. RESULT HANDLING

Completed expeditions should return to the Hub.

The Hub may visually communicate:

- team returned,
- special component found,
- trace discovered,
- Encounter Opportunity waiting.

This creates visible world/shop connection.

---

# 51. EXPEDITION RESULT STORAGE

Protected result holding should have enough system capacity that the player cannot lose value.

If a cap exists, it must be designed for convenience.

No rare encounter should be deleted because the result area is full.

---

# 52. ZONE 6 — SPECIAL / PRESTIGE SPACE

The final zone is intentionally flexible.

It supports later systems that deserve strong visual presence but do not belong in the starting shop.

Potential uses:

- premium display/gallery,
- special visitor lounge,
- collection showcase,
- signature recipe area,
- milestone trophy space,
- high-level Elemental Craft presentation.

This zone is not fully defined yet.

---

# 53. WHY A FLEXIBLE SPECIAL ZONE EXISTS

The architecture needs room for later high-level identity without:

- adding detached buildings,
- redesigning the shop shell,
- overcrowding core zones.

It should unlock only when a real system needs it.

---

# 54. SPECIAL ZONE IS NOT A FEATURE DUMP

Do not put every future mechanic here.

A system still needs:

- gameplay justification,
- clear ownership,
- progression value.

---

# 55. SHOP EXPANSION ARCHITECTURE

The shop should grow through **expansion stages**.

An expansion stage increases the physical capability of one or more zones.

The player experiences:

> small shop → established shop → advanced shop → major Catchmon commerce hub.

Exact names/count are deferred.

---

# 56. EXPANSION STAGE PURPOSE

Expansion should create:

- more physical space,
- more visible systems,
- capacity,
- new interaction areas,
- visual prestige.

It should not only scale background art.

---

# 57. EXPANSION VS UPGRADE

Important distinction:

## EXPANSION
Adds new space/capability potential.

## UPGRADE
Improves an existing piece of infrastructure.

Example:

> unlock larger Workshop Wing = expansion.

> improve Fieldworks Bench = upgrade.

---

# 58. EXPANSION SHOULD NOT BE PURELY LINEAR

Infrastructure investment should create competing priorities.

The player may choose:

- stronger production,
- more display,
- more storage,
- more expedition capacity.

Progression may require certain minimum milestones, but not every upgrade should follow one fixed sequence.

---

# 59. NO IRREVERSIBLE LAYOUT CHOICE

The shop structure may allow customization.

But the player should not permanently ruin progression by placing something badly.

Functional upgrades should be:

- movable,
- reconfigurable,
- or layout-independent.

---

# 60. PLACEMENT COMPLEXITY — CORE DECISION

Catchmon Shop should use:

> **guided placement / predefined functional anchors**

rather than unrestricted tile-grid placement as the core system.

The player may choose:

- which valid area a display/station occupies,
- visual arrangement within allowed anchors.

The game handles exact navigation/pathing.

---

# 61. WHY GUIDED PLACEMENT

This preserves:

- ownership,
- visual customization,
- spatial growth,

without introducing:

- blocked paths,
- pixel optimization,
- accidental unusable layouts,
- complex mobile controls.

---

# 62. FUNCTIONAL ANCHORS

Each zone contains valid infrastructure anchors.

Examples:

- display anchor,
- station anchor,
- Catchmon support anchor,
- expedition anchor.

Infrastructure can upgrade or visually change within these anchors.

---

# 63. NO GRID OPTIMIZATION BONUS

Do not create bonuses such as:

> station gets +10% because it is exactly two tiles from shelf.

The player should not need to optimize geometry for economics.

---

# 64. OPTIONAL DECOR PLACEMENT

Decoration may later support freer placement in non-critical areas.

Decoration should not interfere with:

- customer flow,
- station functionality,
- Catchmon pathing.

---

# 65. DECORATION — CORE PHILOSOPHY

Decoration supports:

- ownership,
- personality,
- collection prestige,
- visual variety.

Decoration is not a major economic power system.

---

# 66. NO PAY-TO-POWER DECORATION

If monetization exists later, cosmetic decoration should not become hidden mandatory economic buffs.

---

# 67. FUNCTIONAL DECOR BOUNDARY

Selected trophy/signature items may provide small informational or thematic effects later.

But avoid:

> every chair gives +2% customer value.

This would turn decoration into optimization clutter.

---

# 68. SHOP VISUAL GROWTH

The shop should communicate progression at a glance.

Visual progression may include:

- larger space,
- improved floor/walls,
- more complex stations,
- more product presentation,
- more active Catchmons,
- more customers,
- higher-quality lighting,
- regional/elemental accents,
- rare trophies.

---

# 69. VISUAL GROWTH MUST FOLLOW FUNCTIONAL GROWTH

A major functional upgrade should ideally create visible change.

Example:

> increased display capacity

should add/expand visible merchandising.

Not merely:

> `Display Slots 3 → 4` in a menu.

---

# 70. NO COMPLETELY STATIC MAIN SHOP

If the shop looks almost identical after weeks of progression, the infrastructure system has failed emotionally.

---

# 71. SHOP TRANSFORMATION STAGES

The project should later define a small set of visual macro stages.

Conceptually:

## STAGE A — STARTER SHOP
Compact, modest, highly readable.

## STAGE B — ESTABLISHED SHOP
Multiple zones become visible.

## STAGE C — SPECIALIZED SHOP
Player's chosen strengths begin shaping appearance.

## STAGE D — GRAND CATCHMON EMPORIUM
Large, premium, active, visibly advanced.

Exact number/names remain open.

---

# 72. MACRO STAGE IS NOT A HARD RESET

The shop never resets back to a small store as part of normal progression.

Infrastructure progression is persistent forward growth.

---

# 73. SPECIALIZATION VISUALIZATION

If the player specializes in:

- Elemental Craft,
- Field Gear,
- Provisions,
- Habitat,

the shop may visually emphasize that specialization through:

- station prominence,
- display mix,
- Catchmon presence,
- visual props.

The base shell remains coherent.

---

# 74. REGION / ELEMENT VISUALIZATION

Canonical element colors/region accents may influence:

- temporary ambient accents,
- expedition context,
- special displays.

The shop should not become unreadably recolored for each region.

Exact art direction belongs to Document 12.

---

# 75. DESIGN-TOKEN RULE

When the UI/infrastructure presentation is implemented:

- reuse existing design tokens,
- use canonical element colors,
- reuse motion tokens,
- do not invent a second color system.

The reference-only legacy region progression logic must not be imported.

---

# 76. INFRASTRUCTURE UPGRADE CATEGORIES

Infrastructure upgrades should fall into clear categories.

1. Capacity
2. Capability
3. Efficiency
4. Information
5. Convenience
6. Visual prestige

---

# 77. CATEGORY 1 — CAPACITY

Examples:

- production slots,
- display slots,
- storage,
- customer capacity,
- Catchmon assignment slots,
- expedition slots.

Capacity enables more simultaneous activity.

---

# 78. CATEGORY 2 — CAPABILITY

Examples:

- station can craft higher Recipe Rank,
- expedition hub supports a new preparation type,
- special visitor space becomes available.

Capability creates new possibilities.

---

# 79. CATEGORY 3 — EFFICIENCY

Examples:

- bounded station throughput,
- improved storage handling,
- customer flow support.

Efficiency should not replace Catchmon specialization.

---

# 80. CATEGORY 4 — INFORMATION

Examples:

- demand insight infrastructure,
- route preview,
- storage forecasting.

Information is a valid progression reward.

---

# 81. CATEGORY 5 — CONVENIENCE

Examples:

- queue capacity,
- auto-restock support,
- conservative automation,
- inventory reservation tools.

Convenience removes chores.

It should not remove strategy.

---

# 82. CATEGORY 6 — VISUAL PRESTIGE

Examples:

- improved shop shell,
- upgraded signage,
- trophy displays,
- premium presentation.

Visual prestige may be paired with milestones without needing gameplay power.

---

# 83. UPGRADE EFFECT DISCIPLINE

An infrastructure upgrade should normally have:

- one primary effect,
- optional closely related secondary effect.

Avoid giant bundles like:

> +slots +speed +customers +prices +storage

in one upgrade.

That hides economic decisions.

---

# 84. UPGRADE VISIBILITY

Before purchasing, the player should know:

- Coin cost,
- what changes,
- whether capacity/capability is added,
- construction duration if applicable,
- visual change.

No blind infrastructure upgrades.

---

# 85. CONSTRUCTION TIMING — CORE DECISION

Major infrastructure upgrades may use construction timers.

Small functional upgrades do not all need timers.

The purpose of construction time is:

- anticipation,
- return hook,
- pacing.

Not friction.

---

# 86. NO BUILDER TIMER FLOOD

The game should not become:

> every tiny upgrade waits 4 hours.

Construction timers should be reserved for:

- expansions,
- significant station upgrades,
- major capacity growth.

---

# 87. CONSTRUCTION SLOT BOUNDARY

A universal builder-slot system is **not assumed**.

If only major upgrades use time, limiting the player with one “builder” may add unnecessary friction.

Document 09/14 may revisit based on pacing.

---

# 88. SHOP REMAINS USABLE DURING CONSTRUCTION

A station/zone upgrade should generally not disable the core shop for long periods.

Potential behaviors:

- old capacity remains until completion,
- visual construction overlay,
- only new capacity waits.

Avoid punishing the player for upgrading.

---

# 89. NO PREMIUM SKIP ASSUMPTION

Construction does not require premium speed-up architecture.

Monetization remains out of scope.

---

# 90. COIN SINK ROLE

Infrastructure is one of the major Coin sinks defined in Document 03.

Different infrastructure categories should compete for player investment.

---

# 91. NO SINGLE MANDATORY INFRASTRUCTURE PATH

Avoid:

> always upgrade storage, then station, then display, in exactly this order.

The player should have multiple reasonable priorities.

---

# 92. ECONOMIC RECOVERY PROTECTION

Infrastructure purchases should not soft-lock the player.

The basic recovery craft/sale loop must remain possible after expensive investment.

---

# 93. INFRASTRUCTURE COST SHAPE

Exact values are deferred.

But cost progression should consider:

- time-to-afford,
- payback,
- structural unlock value,
- progression stage.

---

# 94. MAJOR EXPANSION COST

Major shop expansions may intentionally require saving.

They should feel like:

> meaningful milestones.

But they must remain visibly achievable.

---

# 95. SMALL UPGRADE COST

Smaller upgrades should provide more frequent spending opportunities.

This maintains:

> sell → improve → see effect.

---

# 96. INFRASTRUCTURE BOTTLENECK ROTATION

Different stages may emphasize:

- storage,
- production,
- display,
- expedition,
- customer flow.

The player should periodically solve a physical bottleneck.

---

# 97. PRODUCTION BOTTLENECK

Examples:

- station not unlocked,
- active slot occupied,
- station capability too low.

Infrastructure can solve part of this.

Catchmons/recipes solve other parts.

---

# 98. DISPLAY BOTTLENECK

Examples:

- too few active display slots,
- insufficient premium presentation.

Infrastructure increases selling flexibility.

---

# 99. STORAGE BOTTLENECK

Examples:

- materials cap too quickly,
- product inventory pressure.

Infrastructure creates larger buffers.

---

# 100. CUSTOMER BOTTLENECK

Examples:

- customers arrive faster than active floor capacity,
- special visitor lacks proper space.

Infrastructure can increase throughput.

---

# 101. EXPEDITION BOTTLENECK

Examples:

- only one expedition slot,
- limited Support capacity,
- limited preparation options.

Infrastructure expands world throughput.

---

# 102. CATCHMON ASSIGNMENT BOTTLENECK

The player may own more useful Catchmons than active slots.

This is intentional.

Infrastructure expands:

- Workshop support,
- Shop Floor support,
- Supply posts,
- expedition capability.

---

# 103. NO ALL-CATCHMON ACTIVE ENDGAME

Even late game should not automatically activate all 104 simultaneously.

Selection remains part of strategy.

---

# 104. WORKSHOP SUPPORT INFRASTRUCTURE

Workshop stations may have limited Catchmon support positions.

Infrastructure upgrades may:

- unlock a support position,
- improve compatibility,
- enable synergy support.

Exact per-station slot counts remain open.

---

# 105. SHOP FLOOR SUPPORT INFRASTRUCTURE

The Sales Floor may have limited Catchmon active-service positions.

These determine how many customer-focused Catchmons can affect the shop.

---

# 106. SUPPLY SUPPORT INFRASTRUCTURE

Supply posts determine how many Supply Catchmons can work simultaneously.

---

# 107. EXPEDITION SUPPORT INFRASTRUCTURE

Expedition Hub determines:

- concurrent routes,
- team composition limits,
- preparation complexity.

---

# 108. CATCHMON VISUAL DENSITY

More functional Catchmon slots should create more visible activity.

However:

- the shop must remain readable,
- not every assigned Catchmon must occupy the center of screen.

The art/UX system may prioritize contextual visibility.

---

# 109. SHOP PERFORMANCE BOUNDARY

Technical architecture must eventually account for:

- many animated Catchmons,
- customers,
- station effects,
- mobile rendering.

Visual ambition must not destroy mobile performance.

---

# 110. INFRASTRUCTURE AND CUSTOMIZATION

The player should have some ownership over shop appearance.

Potential layers:

## FUNCTIONAL LAYOUT
Mostly guided.

## COSMETIC STYLE
More flexible.

## TROPHY / COLLECTION DISPLAY
Milestone-driven.

---

# 111. COSMETIC THEMES

Future cosmetic themes may modify:

- wall/floor treatment,
- signs,
- props,
- lighting,
- decorative frames.

They should preserve:

- functional readability,
- element semantics,
- UI contrast.

---

# 112. FUNCTIONAL CLARITY OVER DECOR

Decoration must not hide:

- ready stations,
- waiting customers,
- Catchmon assignments,
- expedition results.

The game layer remains readable.

---

# 113. SHOP SHELL VS UI CHROME

The physical shop is in-world presentation.

UI chrome follows the design system.

Do not blur them into one inconsistent visual system.

---

# 114. MAIN-SHOP CAMERA / VIEW BOUNDARY

The exact camera perspective is deferred to Documents 11/12.

Infrastructure architecture requires that:

- core zones can be perceived,
- active systems are readable,
- expansion remains visible.

---

# 115. ISOMETRIC VS FRONT-FACING — OPEN

Do not lock the implementation into isometric placement before Art/UX Architecture.

The zone system works with:

- soft isometric,
- 2.5D,
- fixed perspective,
- layered front-facing shop.

---

# 116. INTERACTION DENSITY

The shop should not require the player to tap tiny physical objects.

Systems may be accessible through:

- zone tap,
- station tap,
- contextual panels,
- bottom-sheet interactions.

Mobile readability is mandatory.

---

# 117. TOUCH TARGET RULE

Interactive infrastructure must respect the established mobile-first touch-target principles from the design system.

---

# 118. READY STATES

Infrastructure should visibly communicate:

- craft ready,
- storage warning,
- customer waiting,
- expedition returned,
- Catchmon available.

Ready states should not all use identical red notification badges.

---

# 119. PRIORITY SIGNALING

High-value states should visually outrank routine states.

Example order:

1. new Catchmon encounter,
2. major special visitor,
3. expedition special return,
4. craft ready,
5. routine stock state.

Exact UI belongs to Document 11.

---

# 120. INFRASTRUCTURE NOTIFICATION BOUNDARY

Do not attach a notification dot to every station/zone constantly.

Notifications should indicate:

> actionable meaningful state

not:

> this system exists.

---

# 121. INFRASTRUCTURE IDENTITY

Each zone should have a distinct visual/function language.

The player should recognize:

- Sales,
- Workshop,
- Storage,
- Catchmon,
- Expedition

without labels everywhere.

Art Direction will define the visual vocabulary.

---

# 122. BUILDING / ASSET TAXONOMY CONSEQUENCE

Document 08 establishes that later asset planning needs:

## SHOP SHELL ASSETS
- macro shop stages,
- expansion transitions.

## ZONE ASSETS
- Sales Floor,
- Workshop Wing,
- Storage/Supply,
- Catchmon Support,
- Expedition Hub,
- Special space.

## STATION ASSETS
- five station archetypes,
- upgrade states.

## DISPLAY ASSETS
- standard,
- premium,
- family-specialized variations if needed.

## STORAGE ASSETS
- material/product/special storage visuals.

## FUNCTIONAL PROPS
- signs,
- crates,
- expedition equipment,
- Catchmon work props.

Exact production list belongs to Document 13.

---

# 123. NO BUILDING ASSET GENERATION YET

Do not generate final buildings/stations from this document alone.

The project still needs:

- progression order,
- world/element mapping,
- UX,
- Art Direction,
- Asset Taxonomy.

Otherwise visual work risks being rebuilt later.

---

# 124. INFRASTRUCTURE CONTENT VOLUME DISCIPLINE

The game needs enough visual change to feel alive.

It does not need:

- 50 buildings,
- 200 furniture items,
- 20 station variants per level

at launch.

---

# 125. STATION VISUAL STATE TARGET

Each station archetype should eventually have a small number of meaningful visual upgrade states.

Recommended planning envelope:

> approximately 3–5 major visual states per station

not one unique asset for every numerical level.

Exact count is later.

---

# 126. SHOP SHELL VISUAL STATE TARGET

The overall shop should have a small set of major growth states.

Recommended planning envelope:

> approximately 4–6 macro states.

These are not necessarily strict levels.

---

# 127. DISPLAY VARIANT TARGET

Displays should reuse modular visual families.

Avoid one unique shelf asset per product category unless function demands it.

---

# 128. STORAGE VARIANT TARGET

Storage visuals should evolve through:

- capacity,
- sophistication,
- organization.

They do not need to reflect every capacity increment.

---

# 129. EXPEDITION HUB VISUAL STATE TARGET

The Hub should visibly evolve as:

- more expedition capacity,
- better preparation,
- more advanced routes

become available.

---

# 130. CATCHMON SUPPORT VISUAL STATE TARGET

The support area should become:

- livelier,
- more polished,
- more collection-focused

without implying mandatory rest mechanics.

---

# 131. VERTICAL SLICE INFRASTRUCTURE SCOPE

A first polished vertical slice does not need the complete shop.

Recommended scope:

## Sales Floor
- 3 display slots,
- small customer capacity.

## Workshop
- 2 functional station archetypes represented.

## Storage
- small material/product capacities.

## Catchmon
- visible Workshop/Shop Floor assignment.

## Expedition
- 1 expedition slot / simple Hub.

## Growth
- 2–3 meaningful infrastructure upgrades,
- one visible macro improvement.

This is enough to test whether progression feels spatial.

---

# 132. PROTOTYPE INFRASTRUCTURE SCOPE

The earliest gameplay prototype can be even smaller.

It may represent zones as:

- cards,
- panels,
- placeholder blocks.

The question is:

> **Does capacity/investment create meaningful gameplay?**

not:

> does the shop already look beautiful?

---

# 133. PROTOTYPE SCENARIO A — DISPLAY UPGRADE

Start:

- 2–3 display slots.

Upgrade adds:

- another meaningful display option.

Question:

> Does this change demand strategy?

---

# 134. PROTOTYPE SCENARIO B — PRODUCTION SLOT

Upgrade station capacity.

Question:

> Does added parallel production feel valuable without immediately removing all bottlenecks?

---

# 135. PROTOTYPE SCENARIO C — STORAGE

Start with mild storage pressure.

Upgrade storage.

Question:

> Does the player feel real relief/value?

---

# 136. PROTOTYPE SCENARIO D — EXPEDITION SLOT

Unlock second expedition capability or simulated capacity.

Question:

> Does the player value world throughput enough to compete with shop upgrades?

---

# 137. PROTOTYPE SCENARIO E — CATCHMON SUPPORT SLOT

Unlock an additional active Catchmon support position.

Question:

> Does this create a meaningful new setup rather than only another stacked bonus?

---

# 138. PROTOTYPE SCENARIO F — VISIBLE GROWTH

After several purchases, change the visible shop state.

Question:

> Can the player feel that the business became bigger without opening a stats screen?

---

# 139. INFRASTRUCTURE METRICS

Later telemetry should track:

- upgrade purchase order,
- Coin spend by infrastructure category,
- display capacity utilization,
- production slot utilization,
- storage-cap hits,
- customer-cap saturation,
- Catchmon support slot usage,
- expedition slot usage,
- time-to-afford major expansions,
- construction completion,
- player layout/customization changes,
- infrastructure idle capacity.

---

# 140. CAPACITY HEALTH TARGET

A capacity upgrade should be desirable when the previous capacity is meaningfully used.

Avoid selling:

> more slots the player has no reason to fill.

---

# 141. STORAGE HEALTH TARGET

Storage should create occasional planning pressure.

It should not produce constant waste warnings.

---

# 142. PRODUCTION HEALTH TARGET

More production capacity should increase strategy.

It should not instantly turn crafting into:

> queue everything.

---

# 143. CUSTOMER CAPACITY HEALTH TARGET

A larger floor should feel busier.

It should not make active play overwhelming.

---

# 144. EXPEDITION CAPACITY HEALTH TARGET

Additional expedition capacity should feel valuable while preserving route/team choice.

---

# 145. CATCHMON SLOT HEALTH TARGET

Active Catchmon capacity should create meaningful roster decisions at every stage.

---

# 146. VISUAL PROGRESSION HEALTH TARGET

Players should be able to identify screenshots from:

- early,
- mid,
- late

game based on shop appearance.

---

# 147. INFRASTRUCTURE ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — ABSTRACT SLOT SHOP

All upgrades exist only as numbers in menus.

Result:

Business growth has no visual payoff.

---

## ANTI-PATTERN B — CITY BUILDER CREEP

Player manages dozens of detached buildings.

Result:

Core shop loses focus.

---

## ANTI-PATTERN C — GRID OPTIMIZATION

Economic performance depends on furniture adjacency.

Result:

Mobile shop management becomes layout spreadsheet.

---

## ANTI-PATTERN D — FIVE IDENTICAL STATIONS

Parallel production is created by duplicate station spam.

Result:

Shop becomes factory.

---

## ANTI-PATTERN E — STORAGE TETRIS

Player manually places items into cells.

Result:

Inventory becomes chore.

---

## ANTI-PATTERN F — DECOR BUFF META

Every decoration gives economic bonuses.

Result:

Cosmetic choice becomes optimization burden.

---

## ANTI-PATTERN G — TIMER FLOOD

Every upgrade uses long construction timers.

Result:

Progression becomes waiting.

---

## ANTI-PATTERN H — BUILDER SLOT TAX

One arbitrary builder blocks all growth without clear design need.

Result:

Infrastructure becomes artificial friction.

---

## ANTI-PATTERN I — UPGRADE SHUTDOWN

Upgrading disables a core station for hours.

Result:

Player is punished for progressing.

---

## ANTI-PATTERN J — NO VISIBLE CHANGE

Large Coin investments barely affect shop appearance.

Result:

Growth feels abstract.

---

## ANTI-PATTERN K — ALL 104 ON SCREEN

Every Catchmon is physically rendered simultaneously.

Result:

Visual/performance/readability collapse.

---

## ANTI-PATTERN L — ALL 104 ACTIVE

Infrastructure eventually enables every Catchmon effect at once.

Result:

Assignment strategy disappears.

---

## ANTI-PATTERN M — DEDICATED BUILDING FOR EVERY FEATURE

Every system gets a new structure.

Result:

Asset/UX bloat.

---

## ANTI-PATTERN N — UI-ONLY EXPEDITION HUB

Expedition exists as disconnected menus with no world/shop presence.

Result:

World loop feels detached.

---

## ANTI-PATTERN O — LEGACY REGION PROGRESSION LEAK

Old Funken thresholds are reused because `regions.ts` contains them.

Result:

New progression architecture becomes contaminated by old game design.

---

# 148. INFRASTRUCTURE DEVELOPMENT PIPELINE

When adding infrastructure:

### STEP 1 — IDENTIFY SYSTEM NEED
What capability/bottleneck does it solve?

### STEP 2 — ASSIGN ZONE
Where does it belong physically?

### STEP 3 — DEFINE PRIMARY FUNCTION
Capacity, Capability, Efficiency, Information, Convenience, or Prestige.

### STEP 4 — DEFINE PLAYER DECISION
Why would the player choose it over another investment?

### STEP 5 — DEFINE UPGRADE BEHAVIOR
What changes over progression?

### STEP 6 — DEFINE VISUAL CONSEQUENCE
How should growth be visible?

### STEP 7 — DEFINE UX ACCESS
How does the player interact with it?

### STEP 8 — CREATE ASSET BRIEF
Only after Art Direction/Asset Taxonomy.

---

# 149. MAJOR EXPANSION DEVELOPMENT PIPELINE

For each macro shop expansion:

### STEP 1
Define capability milestone.

### STEP 2
Define newly visible zone/space.

### STEP 3
Define economic cost class.

### STEP 4
Define visual transformation.

### STEP 5
Define which systems become easier/broader.

### STEP 6
Check that it does not invalidate earlier infrastructure.

---

# 150. CANONICAL INFRASTRUCTURE DATA

When implemented, infrastructure definitions should be data-driven.

Suggested conceptual structure:

```text
infrastructureId
zoneId
infrastructureType
upgradeTrackId
functionalCategory
currentLevel / state
unlockRequirements
costProfile
constructionProfile
capacityEffects[]
capabilityEffects[]
visualStateId
interactionTargetId
```

Exact technical types belong to Document 14.

---

# 151. UPGRADE TRACK DATA

An upgrade track should define:

- effect progression,
- cost progression,
- visual milestone references,
- requirements.

Do not hardcode infrastructure levels independently inside UI components.

---

# 152. VISUAL STATE DATA

Visual asset state should be separated from balance state where possible.

Example:

> levels 1–2 use visual state A  
> levels 3–4 use visual state B

This avoids needing art for every numerical level.

---

# 153. SINGLE SOURCE OF TRUTH

Infrastructure capacity values must not be duplicated between:

- scene objects,
- UI,
- game state,
- balance files.

Canonical definitions own the values.

---

# 154. INFRASTRUCTURE PERSISTENCE

Save data must eventually persist:

- unlocked infrastructure,
- upgrade states,
- expansion state,
- layout/customization choices,
- construction state.

Exact persistence architecture belongs to Document 14.

---

# 155. MOVING INFRASTRUCTURE

If guided placement allows reconfiguration:

- moving should be safe,
- no economic loss,
- no sell/rebuy penalty.

The player should experiment visually.

---

# 156. NO DECONSTRUCTION ECONOMY BY DEFAULT

The base design does not require:

- demolish building,
- recover 50% Coins,
- rebuild elsewhere.

Guided zones remove the need.

---

# 157. SHOP EXPANSION AND SAVE COMPATIBILITY

Technical implementation should use stable IDs.

Visual layout changes across versions should not destroy saved infrastructure state.

---

# 158. INFRASTRUCTURE + ART DIRECTION HANDOFF

Document 12 must later define:

- shop perspective,
- environment shape language,
- station visual family,
- display design language,
- storage design language,
- upgrade readability,
- Catchmon integration,
- lighting,
- materials.

---

# 159. INFRASTRUCTURE + ASSET TAXONOMY HANDOFF

Document 13 must turn this architecture into a controlled asset list.

It should distinguish:

- macro shop shell,
- zone modules,
- station states,
- displays,
- storage,
- functional props,
- decorative props,
- interaction icons,
- construction states.

---

# 160. NO ASSET COUNT UNTIL 12/13

Do not decide:

> “we need 47 buildings”

from this document.

The system does not need 47 buildings.

It needs enough modular assets to communicate the six zones and their progression.

---

# 161. SYSTEM OWNERSHIP BOUNDARIES

To prevent future conflicts:

### Document 02 owns
- main shop as gameplay center.

### Document 03 owns
- infrastructure as Coin sink/economic investment.

### Document 04 owns
- five functional production station archetypes.

### Document 05 owns
- customer capacity behavior.

### Document 06 owns
- Catchmon assignment roles.

### Document 07 owns
- expedition execution and expedition slot usage.

### Document 08 owns
- physical/capacity infrastructure supporting all above systems.

### Document 09 will own
- when infrastructure unlocks,
- upgrade pacing,
- progression sequencing.

### Document 10 will own
- region/world thematic relationships.

### Document 11 will own
- final shop interaction/navigation UX.

### Document 12 will own
- visual style.

### Document 13 will own
- exact asset production list.

---

# 162. LOCKED DECISIONS FROM DOCUMENT 08

The following decisions are considered part of the intended Shop Growth & Infrastructure system unless deliberately revised:

1. The shop is the primary physical home space of the game.
2. Infrastructure must create both functional and visible progression.
3. The game uses expandable functional zones rather than a full freeform city-builder model.
4. The initial infrastructure architecture contains six zones:
   - Sales Floor,
   - Workshop Wing,
   - Storage & Supply,
   - Catchmon Support Area,
   - Expedition Hub,
   - flexible Special / Prestige Space.
5. The Sales Floor owns Display Capacity and Active Customer Capacity.
6. Products are assigned to functional Display Units rather than manually placed item-by-item.
7. Display infrastructure affects demand strategy.
8. Premium/specialized displays may exist later where they create meaningful selling decisions.
9. The Workshop Wing houses the five functional station archetypes from Document 04.
10. A production station is not automatically a detached building.
11. Station Capability and Production Slot capacity are separate upgrade dimensions.
12. The base architecture prefers one evolving instance of each station archetype rather than duplicate-station spam.
13. Station upgrades should produce visible visual growth.
14. Storage uses distinct logical capacity for materials, products, and special components.
15. Storage is capacity management, not inventory Tetris.
16. Special components must be protected from silent overflow loss.
17. Supply-domain Catchmons use dedicated Supply infrastructure rather than a farming minigame.
18. Supply infrastructure controls Supply assignment capacity and resource-handling support.
19. The Catchmon Support Area exists for roster presence/management, not because of a stamina system.
20. The game does not require all 104 Catchmons to be simultaneously rendered in the shop.
21. Unseen Catchmons remain fully owned.
22. Catchmon development remains participation-driven rather than idle-training infrastructure.
23. The Expedition Hub owns expedition capacity, preparation support, team dispatch, and return/result presentation.
24. Expedition slot capacity is infrastructure-controlled.
25. Lead/Support expansion and preparation flexibility may be represented through Expedition Hub growth.
26. Expedition results and rare encounters must be protected from loss regardless of result-area visual capacity.
27. The Special / Prestige Space remains flexible and is not a generic feature dump.
28. Shop growth uses macro expansion stages.
29. Expansion and Upgrade are separate concepts.
30. Infrastructure progression should not follow one mandatory total order.
31. Functional layout uses guided placement / predefined functional anchors rather than unrestricted grid placement as the core mechanic.
32. Functional performance does not depend on adjacency/grid optimization.
33. Decorations may support more flexible placement but should not block gameplay.
34. Decoration is primarily aesthetic/ownership-focused rather than a major buff system.
35. Functional decor buffs are not a core progression layer.
36. Major functional upgrades should ideally create visible physical change.
37. The overall shop should have a small number of recognizable macro visual growth stages.
38. Shop progression is persistent forward growth rather than a reset loop.
39. Infrastructure upgrades are categorized as Capacity, Capability, Efficiency, Information, Convenience, or Visual Prestige.
40. Infrastructure upgrades should usually have one clear primary function.
41. Major infrastructure upgrades may use construction timers.
42. Small upgrades do not all require construction timers.
43. A universal builder-slot restriction is not assumed.
44. Upgrading infrastructure should generally not disable the player's existing core functionality.
45. Premium construction skip is not part of the base architecture.
46. Infrastructure remains a major competing Coin sink.
47. Basic economic recovery must remain possible after infrastructure investment.
48. Infrastructure should create rotating physical bottlenecks across progression.
49. Active Catchmon support capacity remains limited even in later progression.
50. The shop may support cosmetic customization without compromising functional readability.
51. Exact shop camera/perspective remains open until UX/Art Direction.
52. Infrastructure interactions must remain mobile-readable and touch-friendly.
53. High-value ready states should visually outrank routine infrastructure states.
54. Infrastructure systems require canonical data definitions.
55. Visual upgrade states should be decoupled from every individual numerical level where possible.
56. The first prototype may represent infrastructure abstractly; final visuals are not required to test mechanics.
57. A vertical slice should demonstrate at least one clearly visible shop-growth transformation.
58. Final building/station asset generation remains blocked until Documents 09–13 define progression, world, UX, art, and asset taxonomy.
59. Legacy Funken-based region unlock logic from old `regions.ts` must not be imported into new infrastructure/progression design.
60. The game should feel like one evolving Catchmon shop, not a collection of disconnected buildings.

---

# 163. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- final names of all zones,
- exact zone count if later consolidation is justified,
- exact shop floorplan,
- exact placement anchors,
- exact display slot counts,
- exact customer capacity,
- exact production slot counts,
- exact Catchmon support slots,
- exact Supply slots,
- exact expedition slots,
- exact storage caps,
- exact infrastructure upgrade levels,
- exact construction durations,
- exact Coin costs,
- exact expansion requirements,
- exact macro shop-stage count,
- exact visual station states,
- exact cosmetic theme system,
- exact Special / Prestige Space purpose,
- exact camera perspective,
- exact animation approach,
- exact shop-scene technical architecture,
- exact building/station assets.

These belong to Documents 09–14, balancing, UX, Art Direction, and Asset Taxonomy.

---

# 164. DEPENDENCY HANDOFF TO DOCUMENT 09

Documents 01–08 now define:

- what the game is,
- what the player does,
- how value flows,
- what is crafted,
- how customers behave,
- what Catchmons do,
- how the world/expedition loop works,
- what physical infrastructure supports those systems.

The next unanswered question is:

> **In what order does the player receive all of this, and how do we make progression feel exciting instead of overwhelming or grindy?**

Document 09 must create the progression spine.

---

# 165. NEXT DOCUMENT

## `09_CATCHMON_SHOP_PROGRESSION_AND_UNLOCK_ARCHITECTURE.md`

Document 09 should define:

### Progression layers
- shop progression,
- recipe progression,
- infrastructure progression,
- Catchmon development,
- evolution,
- world access,
- expedition progression.

### Unlock sequencing
- what exists in the first 5 minutes,
- first 30 minutes,
- first sessions,
- early/mid/late phases.

### System introduction order
- when Momentum,
- Recommend,
- orders,
- quality,
- mastery,
- Focused Customers,
- expeditions,
- support slots,
- special components,
- region expansion

appear.

### Shop-level / reputation boundary
- whether a primary account/shop progression meter exists,
- what it unlocks,
- why it is not another currency.

### Infrastructure pacing
- when zones/stations/slots unlock.

### Catchmon Level
- actual curve/threshold philosophy,
- development milestones,
- evolution pacing.

### Recipe progression
- Recipe Rank,
- mastery prerequisites,
- region/Catchmon gates.

### Horizontal vs vertical progression
- how the player gains new possibilities, not only bigger values.

### Catch-up and anti-grind
- how suboptimal choices remain recoverable.

### Long-term objectives
- collection,
- mastery,
- infrastructure,
- specialization.

### No-prestige boundary
- confirm whether a reset loop is needed or rejected.

Only after Document 09 is stable should exact world/region order and onboarding/UX sequencing be finalized.

---

# 166. DEFINITION OF DONE FOR SHOP GROWTH & INFRASTRUCTURE

Document 08 is ready to hand off when the project can answer:

- What is the player's physical home space?
- Is the game a freeform builder?
- What are the main shop zones?
- Where do displays live?
- Where do the five production stations live?
- How does storage work physically and logically?
- Where do Supply Catchmons work?
- How are unassigned Catchmons represented?
- What does the Expedition Hub control?
- How does expansion differ from upgrading?
- How much placement freedom does the player have?
- Does adjacency affect economics?
- What is decoration for?
- How does the shop visibly transform?
- How are capacity, capability, efficiency, information, convenience, and prestige upgrades separated?
- Do construction timers exist?
- Is there a builder-slot system?
- Does upgrading shut systems down?
- How do infrastructure upgrades compete for Coins?
- How does infrastructure preserve assignment strategy?
- What does the first prototype need?
- What does a vertical slice need to prove?
- Which building/station assets are implied?
- Why are final asset lists still deferred?
- Which decisions are now locked?
- Which details intentionally remain for progression, UX, art, and technical architecture?

If these answers remain coherent, the project can design the complete progression/unlock spine without needing to redefine how the shop physically grows.
