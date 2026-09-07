# CATCHMON SHOP — 11 UX & INFORMATION ARCHITECTURE

**Status:** UX & Information Architecture v1  
**Purpose:** Define how the complete Catchmon Shop system is presented, navigated, understood, and operated on mobile-first screens: what belongs on the main shop screen, what becomes a bottom sheet, what becomes a dedicated full-screen workspace, how customers/crafting/Catchmons/expeditions/inventory/progression are surfaced, and how complexity is revealed without turning the game into a dashboard of menus  
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
- canonical design-system references in `reference/design-system/`

**Authority:** This document owns:
- primary navigation architecture,
- main shop screen information architecture,
- screen hierarchy,
- contextual interaction model,
- bottom-sheet vs full-screen rules,
- crafting UX structure,
- customer-selling UX structure,
- Catchmon roster/assignment UX structure,
- expedition/world-map UX structure,
- capture UX structure,
- inventory UX structure,
- progression/Shop Rank UX structure,
- order/commission UX structure,
- notification/readiness hierarchy,
- information density rules,
- mobile interaction rules,
- navigation state preservation,
- empty/loading/error state requirements,
- accessibility-oriented interaction requirements,
- prototype UX scope.

**Out of scope:**  
- final visual style,
- final colors beyond use of canonical tokens,
- final typography scale,
- final illustrations,
- final 2D/2.5D/3D rendering style,
- exact animation curves,
- exact icon artwork,
- exact copywriting,
- exact sound design,
- exact HUD pixel dimensions,
- exact responsive breakpoints,
- exact technical routing/state framework,
- monetization UX,
- social/guild UX,
- live-event UX.

---

# 1. WHY THIS DOCUMENT EXISTS

Catchmon Shop now contains:

- shop operation,
- crafting,
- displays,
- customers,
- Shop Momentum,
- orders,
- inventory,
- 104 Catchmons,
- Catchmon Levels,
- evolution,
- assignments,
- expeditions,
- discovery,
- capture,
- 17 regions,
- infrastructure,
- Shop Rank,
- mastery,
- quality,
- special visitors.

That is enough complexity to create an excellent game.

It is also enough complexity to create a terrible interface.

If every system gets its own tab:

> the game becomes a dashboard.

If everything stays on the shop screen:

> the screen becomes unreadable.

If every action opens a full-screen modal:

> the shop stops feeling alive.

If the world is visually rich but management requires tiny object tapping:

> mobile usability collapses.

Therefore the UX architecture must decide:

> **what the player should see at a glance, what should be contextual, and what deserves a dedicated workspace.**

---

# 2. UX DESIGN THESIS

The core UX thesis is:

> **The player lives in the shop and briefly enters focused workspaces when a task requires more information.**

The interface should feel like:

1. **SEE what is happening**
2. **TAP the relevant thing**
3. **RESOLVE the decision**
4. **RETURN immediately to the living shop**

The player should not feel like they are navigating a business-management application.

---

# 3. THREE PRIMARY DESTINATIONS

The base product should use only **three persistent primary destinations**:

# SHOP

Operate the business.

# CATCHMONS

Manage the collection and assignments.

# WORLD

Explore regions and run expeditions.

These are the three major fantasies of the game.

---

# 4. WHY ONLY THREE PRIMARY DESTINATIONS

The game contains many systems, but they fall naturally under these three domains.

## SHOP
- customers,
- displays,
- crafting,
- orders,
- inventory quick access,
- infrastructure,
- Shop Momentum.

## CATCHMONS
- roster,
- abilities,
- levels,
- evolution,
- assignment,
- collection.

## WORLD
- regions,
- routes,
- expeditions,
- discovery,
- capture.

This keeps the mental model simple.

---

# 5. NO PERSISTENT CRAFTING TAB BY DEFAULT

Crafting is part of operating the shop.

It should be accessed through:

- Workshop zone,
- station interactions,
- contextual crafting access.

A permanent Crafting tab would separate production from the physical shop.

---

# 6. NO PERSISTENT INVENTORY TAB BY DEFAULT

Inventory is important but not a top-level fantasy.

It should be accessible quickly through a persistent utility button and context links.

It does not need to occupy one of the three primary destinations.

---

# 7. NO PERSISTENT PROGRESSION TAB BY DEFAULT

Shop Rank and progression should be visible through:

- top-level progress indicator,
- milestone access,
- contextual goals.

Progression is something the player sees **through the game**, not a destination they constantly visit.

---

# 8. PERSISTENT BOTTOM NAVIGATION

The preferred mobile-first persistent navigation is:

| Position | Destination |
|---|---|
| Left | Shop |
| Center | Catchmons |
| Right | World |

The exact visual implementation is deferred.

The important rule:

> three destinations only.

---

# 9. BOTTOM NAVIGATION VISIBILITY

The bottom navigation should remain visible on major browsing screens.

It may temporarily hide during:

- Capture reveal,
- evolution presentation,
- major special visitor presentation,
- cinematic transition.

It should return immediately afterward.

---

# 10. PRIMARY SCREEN HIERARCHY

The UX uses four interaction layers:

## LAYER 1 — HOME / SPATIAL SCREEN

The player sees the living system.

Examples:
- Main Shop,
- World Map.

## LAYER 2 — CONTEXTUAL BOTTOM SHEET

Quick actions and short decisions.

Examples:
- station queue,
- customer transaction,
- display stock,
- quick inventory item details.

## LAYER 3 — FOCUSED FULL-SCREEN WORKSPACE

Complex management requiring more information.

Examples:
- Catchmon roster,
- full station recipe browser,
- Expedition planning,
- Inventory,
- Shop expansion.

## LAYER 4 — HIGH-IMPACT OVERLAY / PRESENTATION

Rare emotionally important moments.

Examples:
- successful capture,
- evolution,
- major Shop Rank milestone,
- new region unlock.

---

# 11. BOTTOM SHEET RULE

Use a bottom sheet when the player:

- already understands context,
- needs 1–4 decisions,
- does not need to compare many entities,
- should remain visually connected to the shop/world.

Examples:

- customer request,
- display stock selection,
- quick station status,
- item detail,
- order progress preview.

---

# 12. FULL-SCREEN RULE

Use a focused full screen when the player needs:

- filtering,
- sorting,
- comparison,
- multiple categories,
- planning across several entities,
- deeper management.

Examples:

- full recipe catalog,
- Catchmon roster,
- Inventory,
- expedition team/loadout planning,
- infrastructure upgrade browser.

---

# 13. HIGH-IMPACT OVERLAY RULE

Use a strong overlay/presentation only when an event is rare enough to deserve interruption.

Appropriate:

- first capture,
- rare capture,
- evolution,
- new region,
- major shop transformation.

Not appropriate:

- every normal sale,
- every completed craft,
- every routine order.

---

# 14. MAIN SHOP SCREEN — PURPOSE

The Main Shop Screen is the game's default home.

It should answer at a glance:

- Is something ready?
- Are customers waiting?
- What am I crafting?
- What is displayed?
- What are my Catchmons doing?
- Did an expedition return?
- What is my next meaningful goal?

It should not display every numeric detail simultaneously.

---

# 15. MAIN SHOP SCREEN — SPATIAL MODEL

The main shop presents the functional zones from Document 08 in one coherent scene.

Relevant visible regions:

- Sales Floor,
- Workshop Wing,
- Storage/Supply hints,
- Catchmon Support presence,
- Expedition Hub entry,
- Special space when unlocked.

Not every zone needs equal screen space.

The Sales Floor and Workshop should dominate early.

---

# 16. MAIN SHOP SCREEN — CAMERA / PRESENTATION REQUIREMENT

Final perspective remains open.

The UX architecture requires:

- readable interactive zones,
- visible customer activity,
- recognizable production states,
- visible Catchmon presence,
- easy mobile tapping.

The camera must not require precision.

---

# 17. SHOP SCREEN INTERACTION TARGETS

Primary tap targets include:

- customer with active request,
- production station,
- display unit,
- Expedition Hub result state,
- Catchmon with contextual assignment state,
- Shop Rank / goal indicator.

Targets must meet mobile touch-size requirements.

---

# 18. NO TINY OBJECT DEPENDENCY

If a visible object is too small to tap reliably:

- its whole zone becomes tappable,
- or a contextual hotspot expands the hit area.

Visual scale and interaction scale do not need to be identical.

---

# 19. TOP HUD — MINIMAL PERSISTENT INFORMATION

The Shop screen should persistently show only the most frequently decision-relevant information.

Recommended core HUD:

## MAIN CURRENCY
Coins.

## SHOP RANK
compact progress/milestone indicator.

## UTILITY ACCESS
Inventory / settings / overflow menu.

Shop Momentum is contextual and belongs near customer/selling activity, not necessarily as global top-bar currency.

---

# 20. NO FIVE-CURRENCY TOP BAR

The HUD should not display:

- Coins,
- Momentum,
- Rank XP,
- Recipe XP,
- Catchmon XP,
- region points

simultaneously.

Local progression belongs in local context.

---

# 21. SHOP MOMENTUM LOCATION

Shop Momentum should be visible when:

- customer selling is active,
- the player is on the Shop screen,
- Workshop Push is available.

Preferred placement:

- integrated near the customer/action area,
- or in a compact shop-specific HUD element.

It should not visually imply it is a permanent macro currency.

---

# 22. SHOP RANK INTERACTION

Tapping Shop Rank should open a compact progression panel showing:

- current Rank,
- progress,
- next major unlock,
- one or two nearby milestones.

Do not open a giant progression tree by default.

---

# 23. CONTEXTUAL GOAL

The Shop screen may show one primary contextual goal.

Examples:

- Build Expedition Hub
- Complete first Order
- Capture a new Catchmon
- Reach next Shop Rank

Only one major goal should dominate at a time.

Secondary goals can exist in a dedicated Goals panel.

---

# 24. GOALS UTILITY

A Goals/Progress panel may be accessible through:

- Shop Rank panel,
- utility menu,
- contextual milestone prompt.

It is not a primary navigation destination.

---

# 25. SALES FLOOR UX

The Sales Floor should visually communicate:

- browsing customers,
- requesting customers,
- displayed stock,
- premium/special visitors,
- Shop Floor Catchmons.

The player should understand shop state without opening a list.

---

# 26. CUSTOMER REQUEST VISUAL STATE

A customer ready for decision should show a clear request indicator.

The indicator should communicate:

- requested product,
- special state if any,
- urgency only if genuinely relevant.

Avoid large speech bubbles blocking the scene.

---

# 27. CUSTOMER TRANSACTION BOTTOM SHEET

Tapping a requesting customer opens a bottom sheet.

It should show:

## HEADER
- customer archetype / identity,
- special visitor status if relevant.

## REQUEST
- product image/icon,
- quality,
- requested quantity,
- displayed sale value.

## MOMENTUM
- current amount,
- action gain/cost preview.

## ACTIONS
- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend,
- Decline.

---

# 28. CUSTOMER ACTION PRIORITY

Standard Sale should be visually easy to identify.

Premium Pitch should appear clearly valuable when affordable.

Favorable Deal should communicate:

> less Coins / more Momentum.

Recommend should communicate:

> change requested product.

Decline should be visually secondary.

---

# 29. NO HIDDEN TRANSACTION MATH

Before tapping:

- resulting Coins,
- Momentum gain/cost

should be readable.

If contextual modifiers affect value, the final result should already include them.

---

# 30. FAVORABLE DEAL UX

The action must visually emphasize the trade:

`Coins ↓`

`Momentum ↑`

The player should not interpret it as a discounted mistake.

---

# 31. PREMIUM PITCH UX

Premium Pitch should show:

- boosted final value,
- Momentum cost,
- whether the action is currently available.

If unavailable:

- show why,
- usually insufficient Momentum.

Do not hide the action behind a separate negotiation screen.

---

# 32. RECOMMEND UX

Recommend opens a nested selection surface showing only:

- compatible displayed products.

For each candidate show:

- product,
- quality,
- sale value,
- Momentum cost/result.

Do not show the entire inventory.

---

# 33. CUSTOMER RESOLUTION

After action:

- sheet collapses quickly,
- customer reacts,
- Coin/Momentum feedback appears,
- shop remains visible.

No additional confirmation screen.

---

# 34. SPECIAL VISITOR UX

Special Visitors deserve stronger visual distinction.

Tapping them may open:

- a richer bottom sheet,
- or short full-screen presentation if the event is rare.

They should still reuse the same transaction architecture where possible.

---

# 35. CUSTOMER QUEUE / OVERVIEW

If several customers wait:

- the shop scene remains the primary queue.

A compact overview may exist for accessibility/QoL.

Do not force players into a customer list for normal operation.

---

# 36. DISPLAY UX

Tapping a Display Unit opens a bottom sheet showing:

- current stocked product,
- quantity,
- recent demand signal,
- quick restock,
- change product.

---

# 37. DISPLAY CHANGE

Changing a Display Unit opens a compact product selection.

Prioritize:

- owned eligible products,
- demand context,
- product family,
- quality/stock.

Avoid showing every crafting recipe.

---

# 38. DISPLAY DEMAND FEEDBACK

The display sheet may surface:

- high interest,
- low stock,
- frequent recent demand,
- unmet demand.

This helps the player understand why display decisions matter.

---

# 39. AUTO-RESTOCK BOUNDARY

If auto-restock exists later:

- display sheet contains configuration,
- reserved stock rules remain respected,
- auto-restock is convenience, not strategy replacement.

---

# 40. WORKSHOP UX — TWO DEPTHS

Crafting should use two interaction depths.

## QUICK STATION SHEET
For everyday operation.

## FULL RECIPE WORKSPACE
For planning/comparison.

---

# 41. QUICK STATION SHEET

Tapping a station shows:

- active craft(s),
- remaining time,
- queue,
- ready outputs,
- current Catchmon support,
- quick repeat/recent recipes.

This is the main repeated crafting interaction.

---

# 42. READY CRAFT UX

A ready craft should show:

- product result,
- quality,
- inventory destination,
- mastery progress if relevant.

Routine results should be quick.

Masterwork or first-time milestones may receive stronger presentation.

---

# 43. QUEUE UX

Queue entries show:

- recipe icon,
- quantity if relevant,
- time,
- reserved materials.

The player should understand which materials are already committed.

---

# 44. CRAFT CANCELLATION UX

If cancellation is allowed:

- show returned/reserved input behavior,
- avoid accidental destructive cancellation.

Exact economy rules remain from Document 04.

---

# 45. FULL RECIPE WORKSPACE

The full recipe screen supports:

- category/product-family filter,
- station filter/context,
- available vs locked,
- material requirements,
- craft time,
- sale value,
- mastery,
- quality potential,
- order relevance,
- Catchmon affinity.

---

# 46. RECIPE CARD INFORMATION PRIORITY

A recipe card should prioritize:

1. product,
2. craftability,
3. time,
4. key material need,
5. current role/context.

Detailed economic breakdown belongs in expanded details.

---

# 47. NO STAT-DENSE RECIPE GRID

Do not display:

- 12 numeric fields

on every recipe card.

The player should scan quickly.

---

# 48. RECIPE FILTERS

Useful filters may include:

- product family,
- craftable now,
- active order,
- mastery progress,
- quality goal,
- new/untried.

Avoid excessive filter taxonomies.

---

# 49. MASTERY UX

Recipe Mastery appears locally.

On recipe detail show:

- current mastery stage,
- next milestone,
- what it unlocks/improves.

Do not show raw long XP bars without explaining next reward.

---

# 50. QUALITY UX

Quality uses clear visual hierarchy:

- Standard,
- Fine,
- Masterwork.

Quality should be encoded with:

- frame/treatment,
- label/icon where needed.

Do not rely only on color.

---

# 51. WORKSHOP PUSH UX

Workshop Push is accessed from:

- active station,
- possibly quick station sheet.

The player sees:

- Momentum cost,
- exact effect on current production.

No generic “boost all production” button.

---

# 52. ORDER UX

Orders should be visible from the Shop screen through:

- compact order indicator,
- contextual board/desk,
- utility access.

They do not need a persistent nav tab.

---

# 53. ORDER BOARD SCREEN

The focused Order screen shows:

- available orders,
- active accepted orders,
- progress,
- reward,
- expiration only where meaningful.

---

# 54. ORDER CARD PRIORITY

Show:

- requested products,
- quality requirement if any,
- quantity,
- reward,
- difficulty/time implication.

---

# 55. ORDER ACCEPTANCE

Accepting an order should clearly communicate:

- active slot use,
- required items,
- whether existing stock is reserved automatically or not.

The default should not consume items immediately.

---

# 56. ORDER PROGRESS IN CRAFTING

Recipes needed for an active order should show a subtle contextual marker.

This closes the planning loop.

---

# 57. INVENTORY UX — UTILITY WORKSPACE

Inventory is a focused full-screen workspace accessible from:

- Shop HUD utility button,
- crafting material taps,
- order requirements,
- expedition loadout.

---

# 58. INVENTORY PRIMARY CATEGORIES

The base inventory should separate:

1. Products
2. Routine Materials
3. Special Components
4. Gear / Player-use items

The implementation may combine Gear with Products if data architecture makes that cleaner.

The UX should still allow player-use items to be found easily.

---

# 59. INVENTORY PRODUCT VIEW

Show:

- product,
- quality,
- quantity,
- displayed/reserved state,
- active order relevance,
- sale/use role.

---

# 60. INVENTORY MATERIAL VIEW

Show:

- material,
- quantity/capacity,
- main sources,
- main uses.

The player should be able to answer:

> where do I get more?

---

# 61. SPECIAL COMPONENT VIEW

Special Components should have strong clarity around:

- rarity,
- source regions/routes,
- recipes that use them.

No accidental silent overflow.

---

# 62. RESERVED STATE UX

Reserved inventory must have a visible state.

Reserved can mean:

- expedition loadout,
- order,
- manual Do Not Sell.

The player should know why an item is unavailable.

---

# 63. MANUAL RESERVE UX

The player may mark important products as reserved.

This can be accessed from item detail.

Reserved status should be easy to remove.

---

# 64. INVENTORY SORTING

Useful sorting:

- quantity,
- value,
- quality,
- recent,
- reserved,
- family.

Avoid spreadsheet-level complexity.

---

# 65. CATCHMONS — PRIMARY DESTINATION

The Catchmons destination is a dedicated full-screen space.

Its purpose is:

- collection overview,
- role understanding,
- assignment,
- development,
- evolution.

It should not feel like a static Pokédex only.

---

# 66. CATCHMON ROSTER DEFAULT VIEW

The default roster should prioritize **owned Catchmons**.

Each card should communicate:

- image,
- name,
- element,
- Primary Domain,
- current assignment,
- evolution stage.

Rarity can be visible but not visually dominate utility.

---

# 67. DISCOVERED / UNKNOWN VIEW

Collection completion states should also be accessible:

- Unknown,
- Traced,
- Encountered,
- Owned.

But the operational roster view should not be overwhelmed by hundreds of silhouette cards.

---

# 68. ROSTER VIEW MODES

Recommended two modes:

## ROSTER
Owned operational Catchmons.

## CATCHDEX
Discovery/completion across all 104 stages.

This distinction keeps management and collection goals separate.

---

# 69. CATCHMON CARD INFORMATION BUDGET

A roster card should not show:

- every ability,
- level breakdown,
- all synergy tags,
- rarity text,
- six stats.

At card level show only what helps selection.

Detailed abilities belong on Catchmon Detail.

---

# 70. CATCHMON DETAIL SCREEN

The detail screen should show:

1. identity / art,
2. element,
3. Primary Domain,
4. current assignment,
5. Core Capability,
6. developed/signature capability if unlocked,
7. Catchmon Level,
8. evolution progress,
9. synergy tags,
10. relevant history/collection state.

---

# 71. NO POWER SCORE

Catchmon detail should not show a universal Power number.

Comparison is contextual.

---

# 72. ABILITY PRESENTATION

Ability copy should clearly answer:

- what system,
- under what condition,
- what changes.

Avoid flavor-first text obscuring function.

---

# 73. ASSIGNMENT UX

Catchmons can be assigned from two directions:

## CATCHMON-FIRST
Catchmon Detail → Assign.

## SYSTEM-FIRST
Station / Shop Floor / Expedition / Supply → Choose Catchmon.

Both should use the same eligibility rules.

---

# 74. ASSIGNMENT DESTINATION SELECTOR

From a Catchmon detail, tapping Assign should show only eligible destinations:

- Workshop,
- Shop Floor,
- Supply,
- Expedition availability.

If already assigned:

- current duty clearly shown,
- reassignment consequence visible.

---

# 75. REASSIGNMENT UX

Reassignment should be safe.

If a Catchmon is snapshotted into an active craft/expedition:

- show that current activity retains existing snapshot,
- new assignment applies forward.

Avoid confusing duplicated-state behavior.

---

# 76. ASSIGNMENT SLOT UX

System-side assignment screens should show:

- available slots,
- current Catchmons,
- suggested fits,
- why suggested.

Do not use “Auto Best” as the only meaningful choice.

---

# 77. CATCHMON FILTERS

Useful filters:

- Primary Domain,
- assignment state,
- element,
- evolution line,
- synergy tag,
- level,
- favorites.

---

# 78. CATCHMON LEVEL UX

Show:

- current level,
- progress,
- next meaningful milestone.

Do not make the player inspect every tiny level reward.

---

# 79. EVOLUTION UX

Evolution should show:

- current stage,
- next stage preview,
- requirements,
- mechanical improvement,
- visual preview if available.

When ready, Evolution becomes a deliberate high-impact action.

---

# 80. EVOLUTION PRESENTATION

Evolution deserves:

- strong full-screen presentation,
- before/after capability summary,
- preserved progress confirmation.

Then return to Catchmon detail.

---

# 81. SYNERGY UX

Synergy should be understandable without a spreadsheet.

Display:

- active synergy tags,
- compatible current partners,
- what the synergy changes.

---

# 82. SYNERGY DISCOVERY

The player may discover synergies through assignment.

Once discovered:

- record them,
- make them easier to inspect later.

Do not hide fundamental synergy rules permanently.

---

# 83. WORLD — PRIMARY DESTINATION

The World destination is the home of:

- region progression,
- routes,
- expeditions,
- discovery,
- capture opportunities.

The default screen is the World Map / Region Navigator.

---

# 84. WORLD MAP PURPOSE

At a glance, the player should understand:

- which regions are unlocked,
- which have active expeditions,
- which have results,
- where new progression is available,
- what next region choices are approaching.

---

# 85. NO 17-EQUAL-BUTTON MAP

The World Map should not present all 17 regions as equal tiles from the start.

Locked distant regions should be:

- hidden,
- abstracted,
- or softly teased.

The player should focus on current progression band.

---

# 86. REGION NODE INFORMATION

A region node may show:

- region name,
- element,
- completion state,
- active expedition/result indicator,
- new discovery indicator.

Detailed resources/routes belong after entering region.

---

# 87. REGION DETAIL SCREEN

Entering a region shows:

- economic identity,
- available route intents,
- known resources,
- known Catchmon traces/encounters,
- regional recipes/opportunities,
- completion/milestones.

Do not turn it into a dense encyclopedia.

---

# 88. REGION IDENTITY SUMMARY

The top of a region screen should communicate one sentence such as:

> “Best known for durable reusable expedition gear and metallic resources.”

This makes the region's purpose clear.

---

# 89. ROUTE SELECTION

Routes should be presented as clearly differentiated cards.

Each card prioritizes:

1. route intent,
2. duration,
3. guaranteed reward category,
4. special opportunity,
5. encounter potential,
6. current team fit.

---

# 90. ROUTE DETAILS

Expanded route details may include:

- preferred capabilities,
- preferred elements/tags,
- known encounter silhouettes,
- preparation suggestions,
- discovered reward information.

---

# 91. EXPEDITION PLANNING — FULL SCREEN

Starting an expedition opens a focused planning workspace.

Sequence:

1. confirm route,
2. choose Lead,
3. choose Supports,
4. choose preparation,
5. review outcome preview,
6. start.

This is complex enough to deserve full-screen focus.

---

# 92. EXPEDITION TEAM SELECTION

The Catchmon list should prioritize expedition-relevant information:

- route fit,
- expedition capability,
- element,
- synergy,
- availability.

Hide irrelevant Workshop-only details.

---

# 93. LEAD SELECTION

Lead slot is visually dominant.

The player should understand:

> this Catchmon defines the team's primary approach.

---

# 94. SUPPORT SELECTION

Support slots show:

- current synergy,
- complementary abilities,
- route-fit changes.

---

# 95. TEAM FIT EXPLANATION

Instead of one Power score, show interpretable fit signals.

Examples:

- Strong Discovery Fit
- Good Route Access
- Improved Component Chance
- No Special Bonus

Exact labels may vary.

---

# 96. LOADOUT SELECTION

Preparation items are grouped by:

- Provisions,
- Field Gear,
- Capture & Discovery Gear.

Each shows:

- effect,
- reusable vs consumable,
- when consumed,
- quantity owned.

---

# 97. LOADOUT SLOT CLARITY

Limited preparation slots should be visually obvious.

The player should immediately understand:

- what is equipped,
- what is reserved.

---

# 98. CAPTURE GEAR RESERVATION

Capture aids reserved for the expedition should show:

> “Consumed only if used during encounter.”

This reduces fear of wasting rare gear.

---

# 99. EXPEDITION REVIEW SCREEN

Before Start, show a compact summary:

- route,
- duration,
- team,
- active synergies,
- preparation,
- guaranteed reward,
- known special opportunities.

Do not show unsupported fake precision.

---

# 100. ACTIVE EXPEDITION UX

Active expeditions should be visible from:

- World Map,
- Expedition Hub on Shop screen.

Show:

- destination,
- team lead,
- remaining time,
- route intent.

No need for a constantly animated progress scene.

---

# 101. COMPLETED EXPEDITION UX

A completed expedition should show:

- Ready / Returned state,
- special result priority,
- team available.

The player can review when convenient.

---

# 102. EXPEDITION RESULT SCREEN

Results should prioritize:

1. new Catchmon encounter/trace,
2. special component,
3. meaningful bonus,
4. routine materials.

The presentation should reflect importance.

---

# 103. NO 20-ITEM LOOT EXPLOSION

Routine results should be grouped.

Example:

> 3 resource types + 1 special discovery

rather than dozens of tiny lines.

---

# 104. ENCOUNTER OPPORTUNITY UX

If a Catchmon encounter exists, the result screen transitions to an Encounter screen.

The Encounter should feel important but not like combat.

---

# 105. ENCOUNTER SCREEN

Show:

- Catchmon art/silhouette,
- name if known,
- element,
- discovery state,
- rarity/difficulty context,
- current capture chance,
- available reserved capture aids,
- team effects.

---

# 106. CAPTURE CHANCE PRESENTATION

Use:

- precise percentage where appropriate,
- plus visual confidence.

Do not hide major probability behind vague text.

---

# 107. CAPTURE AID SELECTION

Selecting an aid updates the capture preview immediately.

Show:

- new chance,
- item consumption,
- protection effect.

---

# 108. CAPTURE ACTIONS

Primary actions:

- Attempt Capture
- use/change aids
- Decline / Let Go

No “Pay Coins to Retry.”

---

# 109. FAILED CAPTURE UX

Failure should immediately communicate:

- attempt failed,
- what was consumed,
- Encountered state retained,
- future protection improved,
- where/how to hunt again.

The emotional message is:

> progress was made.

---

# 110. SUCCESSFUL CAPTURE UX

Successful capture deserves strong presentation:

- Catchmon obtained,
- Primary Domain preview,
- core capability,
- immediate “why this matters.”

Then offer:

- View Catchmon,
- return to World/Shop.

---

# 111. NEW CATCHMON VALUE PREVIEW

On capture success, show more than rarity.

Prioritize:

> “What can this Catchmon do?”

This reinforces the collection design thesis.

---

# 112. ALREADY-OWNED ENCOUNTER UX

Clearly communicate:

- already owned,
- alternate reward or shiny opportunity.

Do not imply a second worker copy.

---

# 113. SHINY / VARIANT UX

Shiny discovery should be visually special.

The screen should clarify:

- visual variant unlocked,
- gameplay ability unchanged.

---

# 114. SHOP RANK UX

Shop Rank should be present but not intrusive.

The player should see:

- current rank,
- progress,
- next major milestone.

Rank-up itself may trigger a short celebration.

---

# 115. RANK-UP PRESENTATION

A normal Rank-up can be compact.

A major system-unlock Rank-up may use a stronger overlay.

Always prioritize:

> what became possible.

Not:

> arbitrary reward chest.

---

# 116. UNLOCK PRESENTATION

When a new system unlocks:

1. name the new capability,
2. show where it lives,
3. give one first-use objective,
4. let the player act.

Do not show a multi-page feature tutorial.

---

# 117. LOCKED FEATURE PRESENTATION

Locked systems should show:

- reason,
- broad next requirement,
- what value they add.

Do not expose exact late-game detail before relevant.

---

# 118. INFRASTRUCTURE UX

Infrastructure is accessed primarily from:

- relevant zone,
- Shop expansion/control entry.

Tapping a zone/station should show:

- current capability,
- next upgrade,
- cost,
- visual impact if available.

---

# 119. INFRASTRUCTURE UPGRADE SHEET

For a small upgrade:

bottom sheet.

Show:

- current → next state,
- Coin cost,
- primary effect,
- construction time if any.

---

# 120. MAJOR SHOP EXPANSION

Major expansion deserves a focused full-screen view or high-impact preview.

Show:

- what physical area changes,
- which new capability becomes possible,
- cost,
- completion behavior.

---

# 121. NO TECH TREE BY DEFAULT

Infrastructure should not be presented as a giant abstract skill tree.

The shop itself is the progression map.

---

# 122. CONSTRUCTION UX

If construction has time:

- show completion time,
- show that existing functionality remains,
- show visual construction state.

No builder-slot interface unless later explicitly adopted.

---

# 123. SUPPLY UX

Supply-domain Catchmon work should be accessed from:

- Storage/Supply zone,
- Catchmon assignment.

The Supply workspace should show:

- active Supply Catchmons,
- targeted resource role,
- capacity,
- output/readiness.

Avoid farming-sim presentation.

---

# 124. STORAGE WARNING UX

Storage pressure should be communicated at thresholds.

Examples:

- Near Full
- Full

Warnings should identify:

- which category,
- what action can solve it.

Avoid constant red alerts.

---

# 125. NOTIFICATION HIERARCHY

Notifications should follow importance.

## TIER 1 — CRITICAL / RARE
- new Catchmon Encounter,
- evolution ready,
- region unlock.

## TIER 2 — STRATEGIC
- special visitor,
- major order ready,
- expedition special return,
- Masterwork result.

## TIER 3 — ROUTINE READY
- craft complete,
- normal expedition return,
- order progress.

## TIER 4 — INFORMATIONAL
- storage near cap,
- recipe mastery progress.

---

# 126. NO UNIVERSAL RED DOT

Different notification types should use:

- contextual badges,
- scene states,
- subtle markers.

A red dot should not be the default for everything.

---

# 127. SHOP-SCENE READINESS

Whenever possible, readiness should appear in-world.

Examples:

- station glows/changes state,
- Expedition Hub shows return,
- customer visibly requests,
- Catchmon evolution indicator appears in roster.

This reduces HUD clutter.

---

# 128. NOTIFICATION AGGREGATION

If several routine crafts complete:

- aggregate where sensible.

Do not fire five separate popups.

---

# 129. BADGE COUNT DISCIPLINE

Avoid:

- `99+`

as the normal state.

If many routine items are ready, summarize.

---

# 130. EMPTY STATES

Every major workspace needs a useful empty state.

Examples:

## No Orders
Explain when new ones appear.

## No Active Expedition
Suggest a route.

## No Compatible Catchmon
Explain the missing capability.

## No Product Stock
Link to crafting.

Empty states should create the next action.

---

# 131. LOCKED STATES

A locked system should show:

- what it is,
- why it matters,
- what broad milestone unlocks it.

Avoid completely dead grey buttons with no explanation.

---

# 132. LOADING STATES

Loading should preserve context.

Examples:

- skeleton cards,
- retained previous scene,
- local spinner.

Avoid blank full-screen flashes between Shop/Catchmons/World.

---

# 133. ERROR STATES

Errors should be actionable.

Examples:

- save issue,
- offline sync issue,
- invalid operation.

Do not expose technical error codes to normal players.

---

# 134. OFFLINE / RETURN UX

Returning to the game should prioritize:

1. rare/special outcomes,
2. completed expeditions,
3. completed crafts,
4. new customer/shop state.

Avoid one giant “Offline Rewards” modal listing everything.

---

# 135. NO OFFLINE REWARD WALL

The player should be able to enter the shop quickly.

Routine offline results can be integrated directly into their systems.

---

# 136. RETURN SUMMARY

A small optional summary may show:

- crafts completed,
- expedition returned,
- material caps hit.

It should not block play.

---

# 137. INFORMATION DENSITY PRINCIPLE

Each screen should have one primary question.

Examples:

## Customer sheet
How do I resolve this sale?

## Recipe workspace
What should I craft?

## Catchmon roster
Which Catchmon should I use?

## World Map
Where should I explore?

If a screen tries to answer all questions, split it.

---

# 138. ONE PRIMARY CTA RULE

Each focused state should normally have one visually dominant action.

Examples:

- Craft
- Sell
- Start Expedition
- Attempt Capture
- Upgrade
- Evolve

Secondary actions remain visible but less dominant.

---

# 139. PROGRESSIVE DISCLOSURE

Advanced information appears only when requested.

Examples:

Recipe card:
- quick values first.

Expanded detail:
- mastery,
- quality,
- source details.

Catchmon card:
- role first.

Detail:
- capabilities/synergy.

---

# 140. NO TOOLTIP DEPENDENCY ON MOBILE

Critical information must not require hover.

Long-press may reveal optional detail but should not be mandatory.

---

# 141. TOUCH TARGET STANDARD

All frequent interactive targets should be designed around minimum comfortable mobile targets.

Existing project guidance requires approximately **44×44 px minimum** interaction targets.

Final implementation should verify physical usability, not only CSS dimensions.

---

# 142. GESTURE DISCIPLINE

Gestures may enhance UX.

Examples:

- swipe bottom sheet,
- swipe between Catchmon details.

But every critical action must also have an obvious tap-based path.

---

# 143. NO PRECISION DRAGGING FOR CORE PLAY

Do not require:

- dragging tiny products,
- dragging Catchmons onto small station slots,
- pixel positioning furniture.

Where drag-and-drop is used, it should be optional/convenient.

---

# 144. CONFIRMATION DIALOG DISCIPLINE

Confirm only destructive/high-cost actions.

Potential confirmations:

- rare item consumption,
- major irreversible-looking event,
- cancel costly commission if loss exists.

Do not confirm:

- normal sale,
- normal craft,
- standard assignment change,
- display restock.

---

# 145. BACK NAVIGATION

Back should behave predictably.

Priority:

1. close nested panel,
2. close bottom sheet,
3. return to previous focused workspace,
4. return to primary destination.

Do not jump randomly to Shop on every back action.

---

# 146. TAB STATE PRESERVATION

Switching between Shop, Catchmons, and World should preserve useful local context.

Examples:

- previously opened region,
- roster filter,
- shop camera/scroll location where practical.

Do not reset every tab to top on each switch.

---

# 147. DEEP LINK / CONTEXT RETURN

When a system links to another destination:

Example:

Order → missing product → Craft Recipe.

After action, the player should have a clear way to return to the originating context.

---

# 148. CROSS-SYSTEM LINKS

Useful direct links:

- Order → required Recipe
- Recipe → missing Material source
- Material → relevant Region/Route
- Catchmon → current Assignment
- Route → recommended Catchmon
- Customer → displayed Product
- Region → Encountered Catchmon

Cross-links should reduce menu hunting.

---

# 149. NO CROSS-LINK MAZE

Cross-links should be contextual.

Do not turn every noun into a hyperlink that opens a new stack.

---

# 150. INFORMATION OWNERSHIP

Each data type has a primary UI home.

## Product
Inventory / Recipe.

## Catchmon
Catchmons.

## Region
World.

## Infrastructure
Shop.

Other screens may show summaries and deep links.

---

# 151. SEARCH BOUNDARY

Search may be useful once content scale is high.

Potential places:

- Catchmon roster,
- recipes,
- inventory.

Do not add search to every list.

---

# 152. SORT/FILTER PERSISTENCE

Filters may persist per workspace.

Example:

Catchmons filtered by Expedition.

Returning later may retain that filter.

Provide a clear reset.

---

# 153. ACCESSIBILITY — COLOR

Do not encode critical state only by:

- element color,
- rarity color,
- quality color.

Use:

- icons,
- labels,
- shapes,
- patterns where appropriate.

---

# 154. ACCESSIBILITY — MOTION

Motion should communicate:

- state change,
- causality,
- importance.

Respect reduced-motion preference when implemented.

---

# 155. ACCESSIBILITY — TEXT

Important values should remain readable on small screens.

Avoid tiny secondary labels throughout dense cards.

---

# 156. ACCESSIBILITY — CONTRAST

Use canonical design tokens and verify:

- text/background,
- disabled states,
- element accents,
- buttons,
- overlays.

Region ambiance must not destroy UI contrast.

---

# 157. ACCESSIBILITY — INPUT

Critical interactions should not require:

- fast response,
- multi-finger gestures,
- drag precision.

This aligns with the non-reflex game design.

---

# 158. RESPONSIVE DESKTOP PRINCIPLE

Desktop may use more horizontal space.

But desktop must not become a different dashboard game.

The mobile interaction model remains primary.

---

# 159. DESKTOP ENHANCEMENTS

Desktop may support:

- wider shop scene,
- side-by-side detail panels,
- persistent secondary panel,
- larger world map.

Do not create desktop-exclusive core functionality.

---

# 160. SCREEN INVENTORY — PRIMARY

The expected major screens/workspaces are:

1. Main Shop
2. Customer Transaction Sheet
3. Display Sheet
4. Station Quick Sheet
5. Recipe Workspace
6. Orders
7. Inventory
8. Catchmon Roster
9. Catchdex
10. Catchmon Detail
11. Assignment Selector
12. Evolution Presentation
13. World Map
14. Region Detail
15. Expedition Planning
16. Active Expedition Detail
17. Expedition Results
18. Encounter / Capture
19. Infrastructure Upgrade
20. Major Expansion
21. Shop Rank / Goals panel
22. Settings / Utility

This is not a requirement for 22 separate routes.

Several may be sheets/overlays.

---

# 161. SCREEN COUNT DISCIPLINE

Do not make one React route/component hierarchy for every minor interaction if a sheet is sufficient.

The UX architecture distinguishes **interaction states**, not necessarily URLs/routes.

---

# 162. MAIN SHOP STATE MODEL

The Main Shop should support:

- idle/default,
- customer-active,
- craft-ready,
- expedition-returned,
- special-visitor,
- major-upgrade construction,
- new-system hint.

Multiple states may coexist.

Priority rules prevent visual overload.

---

# 163. SHOP SCREEN PRIORITY RESOLUTION

When several things happen:

### Rare Encounter waiting
High-priority World badge, not forced popup.

### Customer waiting
Visible in scene.

### Craft ready
Visible at station.

### Storage near full
subtle utility warning.

The player chooses what to resolve.

---

# 164. NO FORCED QUEUE RESOLUTION

The game should not force:

> resolve all crafts → then customers → then expedition.

Parallel systems remain accessible.

---

# 165. ONBOARDING UX

Onboarding should use:

- highlighted existing UI,
- one-step objectives,
- contextual hints.

Avoid a separate tutorial world.

---

# 166. FIRST SHOP ONBOARDING

Recommended sequence:

1. highlight first station,
2. craft product,
3. display/stock,
4. customer arrives,
5. Standard Sale,
6. upgrade prompt.

The interface teaches through the actual loop.

---

# 167. MOMENTUM ONBOARDING

When Momentum first appears:

- show meter,
- explain one source,
- let player earn it,
- then unlock one spend.

Do not explain Recommend before it exists.

---

# 168. CATCHMON ONBOARDING

When first functional Catchmon is introduced:

1. show Catchmon Detail,
2. show Primary Domain,
3. assign to obvious destination,
4. demonstrate effect visually.

---

# 169. EXPEDITION ONBOARDING

When Expedition Hub unlocks:

1. open World,
2. choose first simple route,
3. choose Lead,
4. minimal preparation,
5. Start.

Do not teach capture until the first encounter.

---

# 170. CAPTURE ONBOARDING

At first encounter:

- explain chance,
- show aid effect if available,
- allow attempt.

The system teaches itself through the state.

---

# 171. QUALITY ONBOARDING

The first Fine result should trigger:

- short explanation,
- clear visual difference,
- sale-value meaning.

No long tutorial.

---

# 172. SYNERGY ONBOARDING

When player first owns a relevant pair:

- show compatibility indicator,
- let player assign them,
- show active effect.

---

# 173. REGION UNLOCK ONBOARDING

New region unlock presentation should show:

- region identity,
- what is new,
- one recommended first route.

Do not dump the full region encyclopedia.

---

# 174. UX CONTENT LANGUAGE

Player-facing labels should prefer direct functional language.

Examples:

Good:
- Ready
- Reserved
- Fine
- Needs Field Gear
- Strong Discovery Fit

Bad:
- Operational Resonance State
- Expedition Compatibility Coefficient

---

# 175. NUMERIC PRECISION

Display only precision that supports decisions.

Examples:

Coins:
- compact formatting if large.

Capture chance:
- precise enough to compare.

Craft time:
- human-readable.

Do not show excessive decimals.

---

# 176. TIMER PRESENTATION

Timers should show:

- useful completion estimate,
- not technical milliseconds.

Examples:
- 1m 24s
- 18m
- 2h 10m

---

# 177. LONG TIMER UX

For long durations:

- show end time optionally,
- show remaining duration.

Avoid anxiety countdown styling.

---

# 178. ECONOMIC VALUE UX

Show final actionable values.

Detailed formula breakdown may exist on demand.

The player should not need to manually calculate:

> base × quality × customer × premium.

---

# 179. SOURCE / USE DISCOVERY UX

Materials and items should offer:

- “Sources”
- “Used In”

where helpful.

This prevents external-wiki dependence.

---

# 180. LOCKED RECIPE UX

A locked recipe should explain the main blocker:

- Station Rank,
- Region,
- Mastery,
- Catchmon capability.

Do not display a vague lock icon only.

---

# 181. CATCHMON LOCKED/UNKNOWN UX

Unknown Catchmons should preserve mystery.

The Catchdex may show:

- silhouette,
- element/region hint when traced,
- known route after discovery.

Do not expose complete acquisition guide immediately.

---

# 182. DISCOVERY PROGRESS UX

Unknown → Traced → Encountered → Owned should have distinct visual states.

The player should understand:

- what they know,
- what next progress means.

---

# 183. WORLD TARGETING UX

Once a species is Traced:

- relevant routes may show a target marker,
- preparation suggestions may surface.

This supports intentional hunting.

---

# 184. SHINY UX BOUNDARY

Shiny status should not clutter normal operational screens.

It is primarily visible on:

- Catchmon art,
- Catchdex,
- capture presentation.

---

# 185. RARITY UX BOUNDARY

Rarity supports:

- collection excitement,
- presentation,
- discovery.

It should not dominate assignment cards or imply “use highest rarity.”

---

# 186. QUALITY VS RARITY VISUAL SEPARATION

Product Quality and Catchmon Rarity are different semantics.

Do not reuse identical frame systems if it creates confusion.

---

# 187. ELEMENT COLOR VS QUALITY COLOR

Element color and Quality treatment must remain distinct.

A Fire Masterwork product should communicate both without visual collision.

Art Direction must solve the exact system.

---

# 188. UI TOKEN RULE

Implementation must reuse:

- existing spacing,
- typography,
- semantic colors,
- element tokens,
- motion tokens

where available.

Do not create a second token system.

---

# 189. ICON RULE

Reuse existing shared icons before creating new ones.

New semantic icons should be added only when:

- the concept is stable,
- no suitable existing icon exists.

No emoji in final production UI.

---

# 190. ICON SEMANTIC SETS NEEDED

Future asset planning likely needs icons for:

## Primary nav
- Shop
- Catchmons
- World

## Systems
- Coins
- Shop Rank
- Momentum
- Orders
- Inventory
- Workshop
- Shop Floor
- Supply
- Expedition

## States
- Ready
- Reserved
- Locked
- Traced
- Encountered
- Owned
- Fine
- Masterwork
- Special Visitor

Final asset taxonomy belongs to Document 13.

---

# 191. ANIMATION UX PURPOSES

Animation should communicate:

- cause and effect,
- ready state,
- customer reaction,
- Catchmon activity,
- capture/evolution importance.

Avoid constant decorative motion that competes with actionable states.

---

# 192. TRANSACTION MOTION

A successful sale should visually connect:

- product,
- customer,
- Coins/Momentum.

This reinforces causality.

---

# 193. CRAFT COMPLETION MOTION

Ready station should visually change.

Collecting output should clearly move/result into inventory.

---

# 194. EXPEDITION MOTION

Departure/return can be short and symbolic.

The player does not need to watch travel.

---

# 195. NAVIGATION MOTION

Transitions between primary destinations should be quick and consistent.

Do not use long cinematic transitions for routine navigation.

---

# 196. UX PERFORMANCE BOUNDARY

Mobile UX must remain responsive even with:

- customers,
- Catchmons,
- animated stations,
- overlays.

Interaction response has priority over decorative effects.

---

# 197. OFFLINE-FIRST RESILIENCE BOUNDARY

Core local interaction should not feel blocked by short connectivity issues if the technical architecture supports local saves.

Exact sync model belongs to Document 14.

---

# 198. UX TELEMETRY

Later track:

- time spent in each primary destination,
- number of navigation hops per task,
- abandoned bottom sheets,
- customer resolution time,
- recipe selection time,
- Catchmon assignment changes,
- route-planning time,
- capture aid usage,
- inventory visits,
- filter usage,
- back-navigation loops,
- unvisited unlocked systems.

---

# 199. UX FRICTION METRIC

For common tasks, track:

> taps / transitions required.

Examples:

- sell normal customer,
- start recent craft,
- assign Catchmon,
- start expedition.

Common tasks should remain compact.

---

# 200. CUSTOMER INTERACTION TARGET

A Standard Sale should normally require:

- tap customer,
- tap Standard Sale.

Potentially even fewer with future quick-action affordances.

Do not require multi-screen navigation.

---

# 201. QUICK CRAFT TARGET

Repeating a recent known recipe should require:

- tap station,
- tap recipe/repeat,
- confirm only when needed.

---

# 202. EXPEDITION TARGET

Starting a known route requires more planning and can justifiably take more steps.

But returning to a saved/recent setup may later be streamlined.

---

# 203. CATCHMON ASSIGNMENT TARGET

Changing one Catchmon assignment should not require:

- opening five nested menus.

Both system-first and Catchmon-first flows remain short.

---

# 204. UX ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — SEVEN-TAB BOTTOM NAV

Every system receives a primary tab.

Result:
mental model fragments.

---

## ANTI-PATTERN B — DASHBOARD HOME

Main Shop becomes rows of KPI cards.

Result:
shop fantasy disappears.

---

## ANTI-PATTERN C — FULLSCREEN CUSTOMER MODALS

Every sale removes player from shop.

Result:
commercial flow feels disconnected.

---

## ANTI-PATTERN D — TINY OBJECT TAPPING

Player must hit visually tiny props.

Result:
mobile frustration.

---

## ANTI-PATTERN E — ALL DATA ON CARDS

Recipe/Catchmon cards become stat tables.

Result:
scanning fails.

---

## ANTI-PATTERN F — HOVER-DEPENDENT INFORMATION

Critical explanations require hover.

Result:
mobile incompatibility.

---

## ANTI-PATTERN G — RED DOT EVERYWHERE

Every system constantly signals unread status.

Result:
notification blindness.

---

## ANTI-PATTERN H — CLAIM BUTTON LOOP

Crafts/Rank/Orders/Offline all require separate claim flows.

Result:
administrative gameplay.

---

## ANTI-PATTERN I — ONE SCREEN PER MINOR STATE

Every interaction becomes a route/page.

Result:
navigation overhead.

---

## ANTI-PATTERN J — INVENTORY AS TOP-LEVEL FANTASY

Inventory competes with Shop/Catchmons/World in primary nav.

Result:
navigation centers on administration.

---

## ANTI-PATTERN K — CRAFTING SEPARATED FROM SHOP

Permanent Crafting tab becomes the main production entry.

Result:
Workshop loses physical meaning.

---

## ANTI-PATTERN L — HIDDEN CAPTURE CHANCE

Player spends rare aid without seeing effect.

Result:
unfairness.

---

## ANTI-PATTERN M — POWER SCORE ROSTER

Catchmon cards sort by one Power number.

Result:
role design collapses.

---

## ANTI-PATTERN N — 17-REGION BUTTON GRID

World Map is a list of all regions.

Result:
world fantasy and progression disappear.

---

## ANTI-PATTERN O — COLOR-ONLY STATE

Quality, element, rarity depend only on hue.

Result:
accessibility/readability issues.

---

## ANTI-PATTERN P — TUTORIAL DUMP

New system unlock triggers several pages of explanation.

Result:
player skips/forgets.

---

# 205. UX PROTOTYPE SCOPE

The first UX prototype should focus only on the central loop.

Recommended interactive prototype:

## Main Shop
- 1–2 stations,
- 3 displays,
- 2–3 customers,
- one Catchmon visible,
- Expedition Hub placeholder.

## Customer Sheet
- all four transaction actions.

## Station Sheet
- active craft,
- queue,
- quick recipe.

## Catchmon
- small roster,
- detail,
- assignment.

## World
- 1 region,
- 2–3 routes,
- expedition planning,
- encounter/capture.

The prototype can use simple placeholders.

---

# 206. UX PROTOTYPE TEST A — HOME COMPREHENSION

Show the Main Shop for 10 seconds.

Ask:

> What can you do here?

Player should identify:

- crafting,
- customers,
- displays,
- world/Catchmon access.

---

# 207. UX PROTOTYPE TEST B — CUSTOMER SPEED

Give a normal customer request.

Question:

> Can player understand and resolve it in seconds?

---

# 208. UX PROTOTYPE TEST C — RECOMMEND

Question:

> Can player understand why only certain products are eligible?

---

# 209. UX PROTOTYPE TEST D — CRAFTING

Question:

> Can player start/repeat a craft without opening a complex catalog?

---

# 210. UX PROTOTYPE TEST E — CATCHMON ROLE

Show Catchmon roster.

Question:

> Can player tell what each owned Catchmon is mainly for?

---

# 211. UX PROTOTYPE TEST F — EXPEDITION

Question:

> Can player understand route goal, Lead selection, and Gear preparation without a tutorial document?

---

# 212. UX PROTOTYPE TEST G — CAPTURE

Question:

> Does player understand chance, aid effect, and consequence before attempt?

---

# 213. UX PROTOTYPE TEST H — NAVIGATION

Task:

> Start in Shop. Find a material source, identify route, start expedition, return to Shop.

Measure:

- number of transitions,
- confusion,
- backtracking.

---

# 214. UX PROTOTYPE TEST I — RETURN SESSION

Present:

- craft ready,
- customer waiting,
- expedition returned.

Question:

> Does player understand priorities without forced sequence?

---

# 215. VERTICAL SLICE UX DEFINITION

A polished vertical slice should include:

- working three-tab navigation,
- living Main Shop,
- customer transaction sheets,
- crafting quick/full flows,
- small Catchmon roster/detail/assignment,
- World Map,
- expedition planning,
- result/encounter/capture,
- Inventory utility,
- Shop Rank milestone,
- one infrastructure upgrade,
- contextual onboarding.

---

# 216. UX DEFINITION OF “LIVING SHOP”

The shop should visually show:

- customers moving/browsing,
- Catchmons working/roaming,
- stations active/ready,
- display stock,
- expedition result state.

The player should not need menus to know that the shop is alive.

---

# 217. UX DEFINITION OF “NOT CHAOTIC”

At any moment, the screen should have:

- one or two strong actionable priorities,
- several ambient/background activities.

Not every animated object demands input.

---

# 218. PRIMARY DESTINATION STATE OWNERSHIP

## Shop
Current operational state.

## Catchmons
Current roster/filter/detail state.

## World
Current map/region/expedition state.

The technical router should preserve these states where practical.

---

# 219. CONTEXTUAL STATE OWNERSHIP

Bottom sheets should close when switching primary destinations.

Important pending actions remain represented in underlying state.

Example:

Customer request still exists when returning to Shop.

---

# 220. SAVE-STATE UX CONSEQUENCE

UI transient state should not be confused with game state.

Examples:

- open bottom sheet does not need permanent save,
- active expedition does,
- reserved item does,
- customer request may depending on customer persistence model.

Technical Architecture owns exact persistence.

---

# 221. INPUT MODALITY BOUNDARY

The game should work with:

- touch,
- mouse.

Keyboard shortcuts may be added for desktop convenience.

They are never required for core play.

---

# 222. DESIGN SYSTEM HANDOFF

Document 12 must convert this UX architecture into:

- spacing hierarchy,
- visual component language,
- card/sheet style,
- world/shop presentation style,
- icon style,
- quality/rarity/element treatments,
- motion principles.

---

# 223. ASSET TAXONOMY HANDOFF

Document 13 must identify exact assets implied by this UX.

Key categories include:

- nav icons,
- domain icons,
- status icons,
- transaction icons,
- product/resource icons,
- station/zone assets,
- region assets,
- world map nodes,
- quality frames,
- Catchmon assignment indicators,
- expedition/capture icons.

---

# 224. TECHNICAL ARCHITECTURE HANDOFF

Document 14 must support:

- three primary destinations,
- nested sheets/full screens,
- preserved tab state,
- data-driven screen state,
- canonical domain APIs,
- no gameplay logic in presentation,
- mobile performance.

---

# 225. LOCKED DECISIONS FROM DOCUMENT 11

The following decisions are considered part of the intended UX & Information Architecture unless deliberately revised:

1. Catchmon Shop is mobile-first.
2. The player conceptually lives in the main shop and enters focused workspaces only when necessary.
3. The base product uses exactly three persistent primary destinations: Shop, Catchmons, and World.
4. Crafting is not a persistent primary navigation tab by default.
5. Inventory is not a persistent primary navigation tab by default.
6. Progression is not a persistent primary navigation tab by default.
7. The interface uses four interaction layers: spatial/home screen, contextual bottom sheet, focused full-screen workspace, and high-impact overlay.
8. Bottom sheets are preferred for short contextual decisions.
9. Full screens are preferred for comparison/filtering/planning.
10. High-impact overlays are reserved for rare important moments.
11. Main Shop is the default home screen.
12. The Main Shop visually communicates customers, crafting, displays, Catchmons, expedition state, and progression.
13. The game does not depend on tapping visually tiny objects.
14. The persistent HUD remains intentionally small.
15. Coins and Shop Rank are the primary persistent macro values.
16. Shop Momentum is shown as a shop-context tactical resource rather than another universal currency.
17. Shop Rank opens a compact next-milestone panel rather than a giant progression tree by default.
18. Normal customer transactions use a contextual bottom sheet.
19. Standard Sale, Favorable Deal, Premium Pitch, Recommend, and Decline are shown in one coherent transaction flow.
20. Customer action results preview final Coins and Momentum before confirmation.
21. Favorable Deal visually communicates Coins-for-Momentum tradeoff.
22. Premium Pitch shows final boosted value and Momentum cost.
23. Recommend shows only compatible displayed alternatives rather than the full inventory.
24. Normal customer transactions return immediately to the shop without extra confirmation screens.
25. Display interaction uses a contextual sheet.
26. Crafting uses a Quick Station Sheet plus a deeper Recipe Workspace.
27. Routine crafting should be operable without entering the full recipe catalog.
28. Recipe cards use progressive disclosure rather than dense stat tables.
29. Recipe Mastery and Quality are shown contextually.
30. Orders are accessible from the shop but are not a primary navigation destination.
31. Inventory is a focused utility workspace reachable contextually and from the Shop HUD.
32. Reserved inventory states must be visible and explain why an item is unavailable.
33. Catchmons is a primary destination.
34. Operational Roster and Catchdex are separate views/modes.
35. Catchmon cards prioritize role, assignment, element, and evolution stage over full stats.
36. Catchmon Detail does not show a universal Power score.
37. Catchmon assignment is possible both Catchmon-first and system-first.
38. Reassignment is safe and persistent.
39. Catchmon Level shows progress toward the next meaningful milestone.
40. Evolution receives a high-impact presentation.
41. Synergy must be inspectable in-game without external spreadsheets.
42. World is a primary destination.
43. World Map shows current progression choices and does not expose 17 equal destinations from the start.
44. Region screens communicate one clear economic/gameplay identity.
45. Route cards prioritize intent, duration, guaranteed rewards, opportunities, encounter potential, and team fit.
46. Expedition planning is a focused full-screen workspace.
47. Expedition team selection shows contextual fit rather than a Power score.
48. Expedition loadout clearly distinguishes consumable and reusable items.
49. Capture aids explain reservation/consumption behavior.
50. Expedition results prioritize new discoveries/encounters over routine materials.
51. Encounter/Capture is a dedicated high-value focused state.
52. Capture chance is visible/readable before consuming scarce gear.
53. Capture aid selection updates the chance/result preview before confirmation.
54. Failed capture presentation explains retained progress and future protection.
55. Capture success presents the Catchmon's gameplay role/capability, not only rarity.
56. Already-owned encounters do not imply duplicate worker ownership.
57. Shiny presentation explicitly separates cosmetic status from gameplay power.
58. Infrastructure upgrades are accessed primarily through the relevant physical shop context.
59. Small upgrades use sheets; major expansions may use focused previews.
60. Supply is presented as resource operations, not farming simulation.
61. Notifications use a hierarchy rather than universal red dots.
62. Rare encounters/evolution/region unlocks have higher visual priority than routine ready states.
63. Readiness should be communicated in-world whenever possible.
64. Routine notifications should aggregate where appropriate.
65. Empty states should propose the next meaningful action.
66. Locked states should explain the primary unlock requirement.
67. Returning players should not face a blocking offline-reward wall.
68. Every screen should answer one primary player question.
69. Focused states normally have one dominant primary action.
70. The interface uses progressive disclosure.
71. Critical information never depends on hover.
72. Frequent interaction targets should meet approximately 44×44 px minimum touch targets.
73. Core gameplay does not require precision drag-and-drop.
74. Confirmation dialogs are reserved for destructive/high-cost actions.
75. Back navigation closes local context before leaving the current destination.
76. Primary tab context should be preserved where practical.
77. Cross-system deep links should reduce menu hunting while maintaining clear return context.
78. Critical state is never communicated by color alone.
79. Desktop may use extra space but does not receive a separate core interaction model.
80. Onboarding is contextual and action-driven rather than tutorial-dump driven.
81. Final UI must reuse canonical design tokens and existing icon assets where suitable.
82. No emoji are used as final production icons.
83. UX telemetry should measure navigation friction and actual system usage.
84. The vertical slice must prove the three-destination navigation and full shop→world→capture loop.
85. Final visual style remains intentionally deferred to Document 12.

---

# 226. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- exact Main Shop perspective,
- exact bottom-nav visual design,
- exact HUD placement,
- exact component dimensions,
- exact sheet heights,
- exact navigation animations,
- exact region map visual topology,
- exact list/grid layouts,
- exact Catchmon card appearance,
- exact quality frame appearance,
- exact notification iconography,
- exact type scale,
- exact visual theme,
- exact desktop layout,
- exact controller/keyboard support,
- exact search implementation,
- exact accessibility settings surface,
- exact tutorial copy.

These belong to Documents 12–14 and implementation prototyping.

---

# 227. DEPENDENCY HANDOFF TO DOCUMENT 12

Documents 01–11 now define:

- what the game is,
- how it plays,
- how its economy works,
- how products/customers/Catchmons/expeditions/progression/worlds work,
- and how the player navigates and understands those systems.

The next question is:

> **What should Catchmon Shop actually look and feel like as one coherent visual product?**

Document 12 must establish the Art Direction & Visual Style Bible.

---

# 228. NEXT DOCUMENT

## `12_CATCHMON_SHOP_ART_DIRECTION_AND_VISUAL_STYLE_BIBLE.md`

Document 12 should define:

### Overall visual thesis
- premium cozy commerce,
- Catchmon charm,
- readable mobile-first world.

### Perspective
- 2D / 2.5D / soft-isometric / fixed-perspective decision.

### Shape language
- shop,
- stations,
- props,
- UI.

### Material language
- wood, metal, glass, cloth, magical/elemental material treatment.

### Catchmon presentation
- integration of existing 104 images/assets into the new style.

### Product icon language
- silhouette,
- lighting,
- framing,
- material clarity.

### Region/environment language
- how all 17 regions differ beyond color.

### UI visual language
- cards,
- sheets,
- buttons,
- hierarchy,
- token use.

### Element treatment
- semantic use of existing canonical element colors.

### Quality / rarity / status
- clear separate visual systems.

### Motion language
- routine vs high-impact motion.

### Lighting
- shop atmosphere,
- premium moments,
- region ambiance.

### Asset-generation constraints
- exact perspectives,
- backgrounds,
- export standards,
- consistency rules.

Only after Document 12 is stable should Document 13 lock the full asset production list.

---

# 229. DEFINITION OF DONE FOR UX & INFORMATION ARCHITECTURE

Document 11 is ready to hand off when the project can answer:

- What are the three primary destinations?
- Why are Crafting, Inventory, and Progression not permanent top-level tabs?
- What belongs on Main Shop?
- What belongs in a bottom sheet?
- What deserves a full-screen workspace?
- How does a normal customer interaction work?
- How does Recommend present compatible products?
- How is routine crafting kept fast?
- How does full recipe planning work?
- Where are Orders?
- How is Inventory reached?
- How are Reserved items communicated?
- How is Catchmon management separated from Catchdex completion?
- How are Catchmons assigned?
- How is Level/Evolution shown?
- How does the World Map avoid overwhelming the player with 17 regions?
- How does route selection work?
- How does expedition planning work?
- How are Lead, Supports, Gear, and synergy shown?
- How are results prioritized?
- What does the Capture screen show?
- How is failure protection explained?
- How are Shop Rank and infrastructure upgrades surfaced?
- How are notifications prioritized?
- How are offline returns handled without a claim wall?
- What are the mobile touch/gesture rules?
- How does navigation preserve context?
- How does onboarding teach one system at a time?
- What must Art Direction define next?

If these answers remain coherent in interactive prototyping, the project can proceed into final visual language and asset planning without needing to redesign the information architecture.
