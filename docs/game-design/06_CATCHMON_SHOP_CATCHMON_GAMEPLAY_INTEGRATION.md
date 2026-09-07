# CATCHMON SHOP — 06 CATCHMON GAMEPLAY INTEGRATION

**Status:** Catchmon Integration Architecture v1  
**Purpose:** Define how the existing 104 Catchmons become meaningful strategic game pieces across crafting, customer interaction, supply, expeditions, progression, evolution, elements, and synergies without becoming combat units, passive stat cards, or a micromanagement burden  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  
- `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`  
- canonical Catchmon identities/assets in `reference/catchmons/`  
- canonical element/design references in `reference/design-system/`  

**Authority:** This document owns:
- the gameplay purpose of Catchmons in Catchmon Shop,
- line-first role design,
- Catchmon role domains,
- functional assignment model,
- Catchmon capability architecture,
- Catchmon level/development architecture,
- evolution gameplay rules,
- roster uniqueness rules,
- duplicate/species-ownership boundary,
- rarity gameplay boundary,
- shiny gameplay boundary,
- element-affinity gameplay boundary,
- Catchmon synergy architecture,
- Catchmon power-budget rules,
- station/customer/supply/expedition integration hooks,
- persistent assignment principles,
- full-roster mapping schema,
- rules for converting the existing 104-Catchmon roster into canonical game data.

**Out of scope:**  
- exact role assignment for every one of the 104 Catchmons,
- exact Catchmon names/evolution lines if canonical source data has not yet been normalized,
- exact acquisition odds,
- exact capture formula,
- exact expedition routes,
- exact level thresholds,
- exact evolution thresholds,
- exact numeric bonuses,
- exact synergy values,
- exact special-component drop rates,
- exact region unlock order,
- exact Catchmon UI layout,
- final Catchmon animation implementation,
- final art treatment,
- live events,
- social trading,
- breeding,
- combat.

---

# 1. WHY THIS DOCUMENT EXISTS

Catchmon Shop already has a strong commercial engine:

**CRAFT**

↓

**DISPLAY**

↓

**ATTRACT CUSTOMERS**

↓

**SELL / NEGOTIATE**

↓

**EARN COINS & MOMENTUM**

↓

**REINVEST**

But the project is not merely a shop game.

The existing roster of **104 Catchmons** is one of the project's defining assets.

If those Catchmons become:

> portraits that provide `+5% production`

then the collection fantasy fails.

If they become:

> combat characters with a separate battle game

then the shop fantasy loses focus.

If all 104 are active simultaneously:

> collection becomes uncontrolled passive multiplier stacking.

If they need constant reassignment:

> collection becomes administrative labor.

Therefore this document defines a third path:

> **Catchmons are strategic workers, specialists, explorers, helpers, and capability unlocks whose identities change how the player operates the shop and accesses the world.**

The core question is:

> **Why should the player care which Catchmon they caught?**

The intended answer is:

> **Because different Catchmons create different possibilities and different shop strategies.**

---

# 2. CATCHMON DESIGN THESIS

The fundamental Catchmon gameplay thesis is:

> **Every Catchmon line should have a recognizable economic or exploration identity, and progression within that line should deepen that identity rather than replace it.**

A player should be able to think:

- “This is my Field Gear specialist.”
- “This one helps me attract explorer customers.”
- “This one is excellent at gathering rare water-linked components.”
- “This one lets me craft something I otherwise cannot.”
- “These two create a strong expedition synergy.”
- “I want that Catchmon because it unlocks a completely different strategy.”

The player should **not** need to think:

> “This is the blue one with +7.5% instead of +6.8%.”

---

# 3. CATCHMONS ARE NOT A COMBAT SYSTEM

Catchmon Shop does not use Catchmons primarily for combat.

The base project does not require:

- attack,
- defense,
- HP,
- battle speed,
- damage types,
- turn order,
- movesets,
- enemy encounters,
- PvP combat.

Catchmon attributes should be designed around:

- work,
- commerce,
- resource access,
- discovery,
- exploration,
- utility,
- specialization,
- synergy.

If combat is proposed later, it requires an explicit project-level reconsideration rather than being added as a normal extension.

---

# 4. COLLECTION PROMISE

The collection system should repeatedly create the feeling:

> **“Catching this one changes what I can do.”**

The player is not merely filling 104 slots.

They are building a portfolio of capabilities.

Collection progress therefore has three dimensions:

## DISCOVERY

What species have I encountered?

## OWNERSHIP

Which Catchmon lines/stages are currently part of my roster?

## CAPABILITY

What can my collection now do for my shop/world strategy?

The third dimension is the most important mechanically.

---

# 5. LINE-FIRST DESIGN RULE

The 104 Catchmons must **not** be designed as 104 unrelated gameplay definitions.

Design begins at the **evolution-line level**.

Each evolution line receives:

1. one core gameplay fantasy,
2. one primary functional domain,
3. optional secondary domain,
4. one specialization identity,
5. synergy identity,
6. element/region relationship.

Evolution stages then develop that same identity.

---

# 6. WHY LINE-FIRST DESIGN MATTERS

Without line-first design, an evolution line can become incoherent.

Bad example:

### Stage 1
Provisions speed.

### Stage 2
Customer patience.

### Stage 3
Rare expedition loot.

There is no gameplay identity connecting the stages.

The intended structure is more like:

### Stage 1
Useful Field Gear support.

### Stage 2
Stronger Field Gear specialization plus expedition utility.

### Stage 3
Signature explorer capability that transforms Field Gear/expedition strategy.

The player experiences:

> **growth of identity**

rather than:

> **replacement of random bonuses.**

---

# 7. SINGLE-STAGE CATCHMON RULE

A Catchmon without an evolution line is not automatically weaker.

Single-stage Catchmons receive a complete capability identity without requiring evolution.

They may express uniqueness through:

- stronger initial specialization,
- unusual utility,
- signature interaction,
- cross-domain flexibility,
- rare structural effect.

Evolution depth and gameplay value are separate concepts.

---

# 8. CORE FUNCTIONAL DOMAINS

Every Catchmon line is designed primarily around one of **four functional domains**:

# DOMAIN A — WORKSHOP

Crafting and production.

# DOMAIN B — SHOP FLOOR

Customers, selling, demand, and commerce.

# DOMAIN C — SUPPLY

Routine materials, special components, and resource access.

# DOMAIN D — EXPEDITION

Exploration, discovery, world access, and external opportunities.

These four domains map directly onto the game's core engine.

---

# 9. WHY FOUR DOMAINS

The domains mirror the value chain:

**SUPPLY**

↓

**WORKSHOP**

↓

**SHOP FLOOR**

and externally:

**EXPEDITION**

↔ feeds Supply / Discovery / Collection

This means every Catchmon function has a clear relationship to the main game.

A fifth generic “passive” domain is deliberately avoided.

---

# 10. PRIMARY DOMAIN

Every evolution line has exactly **one Primary Domain**.

The Primary Domain represents:

> **what this Catchmon is mainly known for mechanically.**

Examples structurally:

- Workshop primary,
- Shop Floor primary,
- Supply primary,
- Expedition primary.

Primary Domain should remain recognizable across evolution.

---

# 11. SECONDARY DOMAIN

A line may optionally have **one Secondary Domain**.

Secondary Domain is used to:

- create hybrid strategies,
- express fantasy,
- support advanced evolution,
- distinguish similar primary-role lines.

Not every line needs one.

Avoid giving every Catchmon broad multi-domain coverage.

Specialization is valuable.

---

# 12. NO UNIVERSAL CATCHMONS

A Catchmon should not be:

- best crafter,
- best seller,
- best gatherer,
- best expedition unit

at the same time.

Power comes from **fit**, not universal superiority.

---

# 13. DOMAIN A — WORKSHOP

Workshop Catchmons affect the production systems defined in Document 04.

Allowed capability families include:

1. Station Specialist
2. Product-Family Specialist
3. Element Specialist
4. Quality Specialist
5. Material-Efficiency Specialist
6. Queue/Workflow Specialist
7. Recipe Enabler
8. Signature Crafting Interaction

---

# 14. WORKSHOP — STATION SPECIALIST

A Catchmon can specialize in one of the five functional production station archetypes:

- Provision Station,
- Care Atelier,
- Fieldworks Bench,
- Resonance Lab,
- Habitat Workshop.

Possible effects include:

- improved throughput,
- improved quality chance,
- improved routine-material efficiency,
- improved Workshop Push efficiency,
- station-specific capability unlock.

Effects should remain targeted.

---

# 15. WORKSHOP — PRODUCT-FAMILY SPECIALIST

A Catchmon may specialize in one or more product families.

Examples:

- Provisions,
- Wearables,
- Field Gear,
- Elemental Craft.

A family specialist can influence:

- craft tempo,
- quality,
- routine material usage,
- special recipe access.

This supports shop builds centered on product identity.

---

# 16. WORKSHOP — ELEMENT SPECIALIST

A Catchmon may improve recipes aligned with its element or an explicitly defined affinity.

Element alignment should affect:

- recipe eligibility,
- quality,
- special interaction,
- efficiency.

It should not merely recolor the recipe UI.

---

# 17. WORKSHOP — QUALITY SPECIALIST

Selected Catchmons may improve:

- Fine probability,
- Masterwork probability,
- quality protection,
- quality value in a targeted category.

Quality specialization should be uncommon enough to remain meaningful.

---

# 18. WORKSHOP — MATERIAL EFFICIENCY

A Catchmon may reduce or reshape input pressure.

Examples structurally:

- targeted routine-material reduction,
- improved batch output,
- substitution of one routine input in a narrow context,
- better use of one material family.

Generic global material discounts should be avoided.

---

# 19. WORKSHOP — QUEUE / WORKFLOW

Selected Catchmons may change station workflow.

Examples:

- queue convenience,
- faster transition between queued crafts,
- stronger Workshop Push,
- improved short-craft handling.

These effects should change production rhythm, not merely add another percentage.

---

# 20. WORKSHOP — RECIPE ENABLER

A Catchmon may unlock:

- a recipe,
- a recipe branch,
- an element-aligned recipe family,
- a signature craft.

This is one of the strongest possible Catchmon effects.

Use selectively.

---

# 21. DOMAIN B — SHOP FLOOR

Shop Floor Catchmons affect the Customer & Selling system defined in Document 05.

Allowed capability families include:

1. Attraction
2. Affinity
3. Service
4. Recommend Support
5. Demand Insight
6. Premium Interaction
7. Special Visitor
8. Signature Shop Event

---

# 22. SHOP FLOOR — ATTRACTION

A Catchmon may influence which customer profiles are more likely to visit.

Examples structurally:

- more explorer-oriented traffic,
- more care-oriented traffic,
- more element-focused customers.

This changes demand composition instead of only increasing raw customer count.

---

# 23. SHOP FLOOR — AFFINITY

A Catchmon may improve customer interest in:

- one product family,
- one element,
- one demand tag,
- one quality grade context.

This supports themed shop setups.

---

# 24. SHOP FLOOR — SERVICE

A Catchmon may improve shop-floor operations.

Allowed effect classes:

- modest patience support,
- request clarity,
- active customer handling,
- Momentum behavior.

Avoid turning all Shop Floor Catchmons into `+customer speed`.

---

# 25. SHOP FLOOR — RECOMMEND SUPPORT

A Catchmon may:

- broaden Recommend compatibility,
- reduce Recommend cost in a narrow context,
- reveal better alternatives,
- improve recommendation outcome.

This creates active selling value.

---

# 26. SHOP FLOOR — DEMAND INSIGHT

A Catchmon may reveal information such as:

- likely next demand family,
- upcoming Focused Customer type,
- special visitor preference,
- recent unmet demand.

Information can be a powerful capability without changing numbers.

---

# 27. SHOP FLOOR — PREMIUM INTERACTION

Selected Catchmons may improve Premium Pitch in a narrow context.

Examples:

- specific family,
- element,
- customer archetype,
- quality grade.

Avoid universal premium multipliers.

---

# 28. SHOP FLOOR — SPECIAL VISITOR

A Catchmon may:

- unlock,
- attract,
- improve preparation for,
- or change the behavior of

a specific Special Visitor category.

This is a high-value structural ability.

---

# 29. DOMAIN C — SUPPLY

Supply Catchmons affect the flow of crafting inputs.

Allowed capability families include:

1. Routine Supply
2. Storage/Capacity
3. Material Specialization
4. Conversion
5. Special Component Access
6. Regional Resource Affinity
7. Overflow Recovery
8. Signature Supply Interaction

---

# 30. SUPPLY — ROUTINE RESOURCE SUPPORT

A Catchmon may improve predictable routine-material availability.

Examples:

- increased recovery rate,
- improved collection yield,
- reduced local bottleneck,
- better supply-task efficiency.

The effect should target a material family or context.

---

# 31. SUPPLY — STORAGE / CAPACITY

Selected Catchmons may temporarily or structurally improve practical storage behavior.

Use carefully.

Permanent storage progression still belongs primarily to infrastructure.

Catchmons should not replace shop upgrades.

---

# 32. SUPPLY — MATERIAL SPECIALIZATION

A Catchmon may specialize in a resource family.

This creates a strong relationship between:

- element,
- world,
- Catchmon fantasy,
- crafting.

Exact resource families will be finalized after world/content mapping.

---

# 33. SUPPLY — CONVERSION

A Catchmon may reshape resource flow.

Examples structurally:

- convert excess routine material into another related input,
- improve refinement yield,
- reduce waste at storage cap,
- turn one bottleneck into another.

Conversion should be transparent.

---

# 34. SUPPLY — SPECIAL COMPONENT ACCESS

Selected Catchmons may improve access to special components.

Potential effects:

- enables a special acquisition route,
- improves a specific component opportunity,
- unlocks a supply task,
- reveals a rare source.

Avoid generic `+rare drop chance` across all components.

---

# 35. SUPPLY — REGIONAL AFFINITY

A Catchmon may be especially useful for materials associated with:

- its element,
- its home region,
- a specific biome.

This supports world identity.

---

# 36. DOMAIN D — EXPEDITION

Expedition Catchmons affect external exploration and Catchmon discovery.

Allowed capability families include:

1. Route Access
2. Expedition Tempo
3. Reward Specialization
4. Discovery
5. Encounter Insight
6. Gear Efficiency
7. Risk Protection
8. Signature Expedition Interaction

The expedition system is non-combat.

---

# 37. EXPEDITION — ROUTE ACCESS

A Catchmon may enable access to:

- terrain,
- route,
- environmental condition,
- hidden area,
- special expedition node.

This is a strong horizontal-progression effect.

---

# 38. EXPEDITION — TEMPO

A Catchmon may reduce duration for specific expedition types.

Avoid global expedition speed domination.

---

# 39. EXPEDITION — REWARD SPECIALIZATION

A Catchmon may shift reward weighting toward:

- routine materials,
- special components,
- discovery information,
- region-specific items.

Reward specialization creates team-planning choices.

---

# 40. EXPEDITION — DISCOVERY

A Catchmon may improve:

- hidden-route discovery,
- Catchmon encounter opportunity,
- special-event discovery,
- rare-location discovery.

This directly supports the collection fantasy.

---

# 41. EXPEDITION — ENCOUNTER INSIGHT

A Catchmon may reveal:

- likely encountered element,
- rare encounter possibility,
- required Capture & Discovery Gear,
- route conditions.

Again, information is a legitimate capability.

---

# 42. EXPEDITION — GEAR EFFICIENCY

A Catchmon may improve the value of:

- Field Gear,
- Capture & Discovery Gear,
- provisions used externally.

This closes the loop between crafting and expedition.

---

# 43. EXPEDITION — RISK PROTECTION

If Document 07 includes expedition uncertainty, selected Catchmons may:

- protect consumables,
- reduce failed-opportunity cost,
- preserve part of a reward.

The base system should avoid harsh failure regardless.

---

# 44. FUNCTIONAL ASSIGNMENTS

Catchmons only provide major gameplay effects when used through a **functional assignment**.

The core assignment classes are:

1. Workshop Assignment
2. Shop Floor Assignment
3. Supply Assignment
4. Expedition Assignment

A Catchmon may also be:

5. Unassigned / Roaming

---

# 45. ONE ACTIVE FUNCTIONAL DUTY

A Catchmon can normally perform **one functional duty at a time**.

If a Catchmon is:

- supporting a station,

it cannot simultaneously:

- work the shop floor,
- gather supply,
- participate in an expedition.

This creates opportunity cost.

---

# 46. WHY ONE DUTY MATTERS

Without this rule, a strong Catchmon's bonuses could apply everywhere at once.

That would create:

- passive stacking,
- mandatory meta species,
- less meaningful assignment.

With one duty:

> **where you use a Catchmon matters.**

---

# 47. UNASSIGNED / ROAMING

Unassigned Catchmons may still appear visually in:

- shop,
- habitat,
- rest areas,
- collection spaces.

But they do not provide major global economic bonuses merely because they are owned.

This is an important anti-power-creep rule.

---

# 48. NO GLOBAL ROSTER STACKING

Owning 104 Catchmons must not result in:

> 104 simultaneous passive percentage modifiers.

Collection milestones may provide separate progression rewards later.

Individual Catchmon abilities require active placement or explicit system interaction.

---

# 49. FUNCTIONAL CAPACITY

Each system has limited Catchmon support capacity.

Examples structurally:

- limited Workshop support slots,
- limited Shop Floor support slots,
- limited Supply posts,
- limited Expedition team size.

Exact capacities belong to Documents 07–09.

The principle is locked:

> **The player must choose which Catchmons are currently active.**

---

# 50. PERSISTENT ASSIGNMENT

Assignments should be persistent until changed.

The game should not expect:

- Catchmon swapping before every craft,
- customer-by-customer reassignment,
- repeated manual roster optimization every minute.

---

# 51. NO SWAP-MACRO DESIGN

Catchmon effects should be broad enough that a configuration remains useful for a meaningful period.

Avoid abilities such as:

> “+20% to exactly one 30-second recipe”

if they encourage constant reassignment.

Highly narrow effects are appropriate only for rare signature interactions.

---

# 52. EFFECT SNAPSHOTTING

Where appropriate, a Catchmon's relevant state/effect should be captured when an activity begins.

Examples:

- craft starts,
- expedition starts,
- special order begins.

Reassigning the Catchmon later should not retroactively duplicate the same benefit.

This prevents obvious exploit loops.

Exact technical behavior belongs to Document 14.

---

# 53. NO STAMINA SYSTEM BY DEFAULT

Catchmons do **not** require a universal energy/stamina meter in the base design.

The project should not add:

- hunger meters,
- fatigue bars,
- injury timers,
- mandatory rest after routine work

unless later playtesting proves a specific need.

Time commitment and assignment opportunity cost already create enough constraint.

---

# 54. WHY NO STAMINA

Stamina would add:

- another meter,
- another replenishment timer,
- another resource sink,
- additional micromanagement.

Catchmon Shop already has:

- production time,
- customer flow,
- supply,
- expeditions,
- assignment constraints.

A stamina system would need strong justification.

---

# 55. CATCHMON DEVELOPMENT — CORE DECISION

Catchmons have a long-term development track.

Working player-facing concept:

# **CATCHMON LEVEL**

Catchmon Level represents:

- experience using the Catchmon,
- growing capability,
- long-term attachment,
- preparation for evolution.

It is a progression state, not a spendable currency.

---

# 56. CATCHMON LEVEL PURPOSE

Catchmon Level exists to:

- reward using favorite Catchmons,
- improve capabilities gradually,
- unlock ability development,
- support evolution,
- create long-term roster progression.

Leveling should not be required to make a newly caught Catchmon immediately usable.

---

# 57. EXPERIENCE SOURCES

Catchmon experience should primarily come from meaningful participation.

Examples:

## Workshop
- completed supported crafts,
- quality outcomes,
- relevant orders.

## Shop Floor
- completed customer interactions,
- relevant Premium/Recommend outcomes.

## Supply
- completed supply cycles,
- resource tasks.

## Expedition
- completed expeditions,
- discoveries,
- special outcomes.

Exact XP formulas are deferred.

---

# 58. NO XP CURRENCY

Catchmon XP/Level is not bought through a generic XP currency in the base system.

The intended relationship is:

> **use Catchmon → Catchmon develops.**

Training infrastructure may later accelerate development, but should not replace participation.

---

# 59. LEVEL POWER SHAPE

Level progression should improve a Catchmon in **small, bounded steps**.

Large structural changes belong primarily to:

- ability milestones,
- evolution,
- signature unlocks.

Do not create 100 levels of tiny invisible modifiers unless the progression document later proves a need.

---

# 60. LEVEL CAP — OPEN

The exact Catchmon level cap is intentionally not defined here.

Document 09 will determine:

- level curve,
- milestone count,
- cap,
- pacing.

This document defines the **function** of Level, not the numeric curve.

---

# 61. ABILITY DEVELOPMENT TIERS

Every Catchmon line should conceptually progress through capability stages.

Working architecture:

1. **CORE CAPABILITY**
2. **DEVELOPED CAPABILITY**
3. **SIGNATURE CAPABILITY** where appropriate

Not every line requires three separately named buttons/abilities.

These are design layers.

---

# 62. CORE CAPABILITY

The Core Capability is available relatively early.

It answers:

> **What is this Catchmon useful for?**

The identity must already be visible here.

---

# 63. DEVELOPED CAPABILITY

The Developed Capability deepens the line's role.

Examples structurally:

- adds a secondary hook,
- improves targeting,
- broadens one compatibility,
- adds an information effect,
- improves synergy.

It should not replace the core role with a different one.

---

# 64. SIGNATURE CAPABILITY

Selected lines receive a memorable structural ability.

Examples:

- unlock unique recipe branch,
- enable special visitor,
- reveal hidden expedition route,
- convert a resource flow,
- create rare cross-domain synergy.

Signature abilities should be curated.

Not every Catchmon needs a completely unique engine mechanic.

---

# 65. EVOLUTION — CORE RULE

Evolution is a major development milestone.

Evolution should:

- preserve the Catchmon's core gameplay identity,
- strengthen or expand its capability,
- change its visual form,
- create an emotionally meaningful progression moment.

Evolution does **not** reset the Catchmon to level 1 by default.

---

# 66. NO EVOLUTION RESET LOOP

The new Catchmon Shop design does not use:

> reach level cap → evolve → reset to level 1 → repeat

as its default evolution structure.

Evolution is forward character progression, not a prestige reset.

This prevents evolution from feeling like lost progress.

---

# 67. EVOLUTION REQUIREMENTS

Exact evolution requirements remain open.

Potential requirement classes include:

- Catchmon Level milestone,
- shop/world progression,
- element-specific material,
- completed use milestone,
- discovery condition,
- signature item.

No evolution should require sacrificing duplicate copies by default.

---

# 68. EVOLUTION IDENTITY

Evolution should usually follow:

### Base stage
Introduces core identity.

### Middle stage
Strengthens identity and may introduce secondary domain.

### Final stage
Completes identity and may introduce signature capability.

This is a framework, not a requirement that every line has exactly three stages.

---

# 69. EVOLUTION AND COLLECTION RECORD

When a Catchmon evolves:

- the earlier species/stage remains permanently recorded as discovered,
- collection completion remains credited,
- the active roster contains the current evolved stage.

The player does not lose Catchdex/discovery history.

---

# 70. NO DUPLICATE UNIT REQUIREMENT

Catchmon Shop should not depend on collecting multiple gameplay copies of the same species.

The default ownership model is:

> **one functional owned instance per species/evolution line state.**

This keeps the 104-Catchmon roster understandable and avoids gacha-style duplicate power systems.

---

# 71. DUPLICATE ACQUISITION BOUNDARY

If the acquisition system later allows encountering an already-owned species, the duplicate encounter should resolve into:

- collection information,
- cosmetic/variant opportunity,
- alternative non-unit reward,
- or simply be excluded from standard capture availability.

It should **not** create another stackable worker copy by default.

Exact behavior belongs to Document 07.

---

# 72. NO DUPLICATE FUSION

The base design does not use:

- merge five copies,
- star-up through duplicates,
- sacrifice duplicates for stats.

This would conflict with the curated 104-Catchmon collection identity.

---

# 73. SHINY / VARIANT BOUNDARY

The existing design system contains a shiny visual identity.

In Catchmon Shop:

> **Shiny/variant status should be cosmetic/collection prestige, not a gameplay power multiplier.**

A shiny Catchmon should not be economically mandatory because it provides stronger production stats.

---

# 74. SHINY AND OWNERSHIP

If shiny acquisition is supported later:

- it does not create a separate stackable worker,
- it may unlock a visual variant for the owned species,
- it may create collection prestige/status.

Exact acquisition behavior belongs to Document 07.

---

# 75. RARITY — GAMEPLAY BOUNDARY

Rarity primarily influences:

- acquisition frequency,
- discovery excitement,
- presentation,
- signature-content potential.

Rarity does **not** automatically determine economic strength.

---

# 76. NO RARITY POWER LADDER

Avoid:

> Common = weak  
> Rare = 2× stronger  
> Legendary = 5× stronger

Such a ladder would invalidate much of the 104-Catchmon roster.

Instead:

- common Catchmons can be excellent specialists,
- rare Catchmons can provide unusual flexibility,
- legendary/mythic-style Catchmons can provide distinctive structural mechanics,
- all tiers can remain strategically useful.

---

# 77. RARITY AND COMPLEXITY

Higher-rarity Catchmons may more often feature:

- unusual conditional effects,
- cross-domain hooks,
- signature interactions,
- rare access.

Their value should come from uniqueness rather than raw numerical dominance.

---

# 78. ELEMENTS — NON-COMBAT IDENTITY

The existing Catchmon elements remain important.

However, elements do **not** require a battle-style type-effectiveness chart.

Elements should influence:

- recipe affinity,
- region affinity,
- resource affinity,
- customer affinity,
- expedition terrain,
- synergy,
- visual identity.

---

# 79. ELEMENT AFFINITY RULE

Each Catchmon's canonical element should create meaningful context somewhere in the economic/exploration system.

Examples structurally:

- element-aligned recipe benefit,
- region resource affinity,
- themed customer attraction,
- expedition route compatibility.

The effect need not be identical across all elements.

---

# 80. ELEMENT SYSTEM OWNERSHIP

Document 10 will define the exact gameplay identity of each element/world.

Document 06 establishes only that Catchmon capabilities may reference those canonical element identities.

Do not hardcode 17 independent element mechanics before Document 10.

---

# 81. NO ELEMENT ROCK-PAPER-SCISSORS

The game does not need:

- Fire beats Grass,
- Water beats Fire,
- etc.

Element relationships should be economic/exploratory, not combat-counter tables.

---

# 82. HYBRID ELEMENT BOUNDARY

If canonical Catchmons have multi-element identity, the data model should support it.

If the canonical roster is single-element, do not invent multi-element species solely for mechanics.

Document 10 should follow existing roster truth.

---

# 83. SYNERGY SYSTEM — PURPOSE

Synergies give the player reasons to think about combinations rather than only individual power.

The central question becomes:

> **Which Catchmons work well together for the strategy I want?**

---

# 84. NO PAIRWISE 104×104 TABLE

Do not manually design a unique synergy for every Catchmon pair.

104 Catchmons would produce thousands of combinations.

That is unmaintainable.

The primary synergy system should be **tag-based**.

---

# 85. SYNERGY TAGS

Each Catchmon line may have a small number of internal synergy tags.

Examples of tag categories:

## FUNCTION
- artisan,
- scout,
- caretaker,
- trader,
- gatherer.

## ENVIRONMENT
- volcanic,
- aquatic,
- forest,
- nocturnal,
- aerial.

## WORKSTYLE
- precise,
- energetic,
- patient,
- curious,
- social.

## SPECIALIZATION
- provision,
- field,
- resonance,
- habitat,
- discovery.

Exact tag vocabulary will be built during roster mapping.

---

# 86. TAG COUNT DISCIPLINE

A Catchmon should generally have:

- 1 primary functional tag,
- 1–2 additional meaningful tags.

Avoid giving every Catchmon ten tags.

Tags must remain understandable and balanceable.

---

# 87. SYNERGY TRIGGERS

A synergy may trigger when:

- two assigned Catchmons share a compatible tag,
- complementary tags are present,
- an expedition team meets a composition condition,
- a station + Catchmon + recipe condition aligns.

Synergies should reward intentional setup.

---

# 88. SHARED-TAG SYNERGY

Example structure:

Two `artisan` Catchmons supporting related production may provide a small workflow benefit.

Shared-tag synergy is easy to understand.

---

# 89. COMPLEMENTARY-TAG SYNERGY

Example structure:

`scout` + `researcher` may improve discovery information.

Complementary synergy creates richer combinations.

---

# 90. ELEMENT SYNERGY

Selected systems may reward:

- same-element teams,
- complementary element compositions,
- region-matched elements.

Exact rules belong to Documents 07 and 10.

Element synergy must remain curated rather than becoming a combat chart.

---

# 91. SIGNATURE SYNERGY

A small number of canonical Catchmon lines may have explicit signature synergies.

Use when:

- lore/fantasy strongly supports it,
- the combination creates a memorable mechanic,
- the effect cannot be expressed through ordinary tags.

Signature synergies are exceptions.

---

# 92. SYNERGY POWER BOUNDARY

Synergy should create:

- useful optimization,
- different builds,
- discovery.

It should not make a Catchmon useless unless paired with one specific partner.

Every Catchmon must remain functional alone.

---

# 93. SYNERGY DISCOVERY

The player should gradually learn synergy.

Possible later presentation:

- visible tags,
- suggested compatible Catchmons,
- discovered synergy entries.

The game should not expect external spreadsheets.

---

# 94. CATCHMON POWER BUDGET

Every Catchmon line should be designed using a qualitative **capability budget**.

The purpose is not to assign visible points.

It is to prevent one line from receiving:

- multiple structural unlocks,
- multiple strong multipliers,
- broad domain coverage,
- strong synergy,
- rare access

all at once.

---

# 95. CAPABILITY STRENGTH CLASSES

Internal design should classify effects roughly as:

## TIER S — STRUCTURAL
Creates new possibility.

Examples:
- route unlock,
- recipe unlock,
- special visitor,
- conversion mechanic.

## TIER A — STRATEGIC
Meaningfully changes optimal setup.

Examples:
- strong targeted quality specialization,
- Recommend compatibility expansion,
- targeted reward specialization.

## TIER B — OPTIMIZATION
Improves an existing strategy.

Examples:
- targeted speed,
- resource efficiency,
- patience.

## TIER C — SUPPORT
Small supporting modifier.

A normal Catchmon should not receive several Tier-S effects.

---

# 96. POWER BUDGET BY EVOLUTION LINE

Capability budget belongs primarily to the **line**, not each stage independently.

Evolution unlocks more of the same budget over time.

This avoids final evolutions accidentally becoming three Catchmons worth of power stacked together.

---

# 97. POWER BUDGET BY RARITY

Rarity may affect **effect complexity**, but should not simply grant a much larger budget.

A rare single-stage Catchmon may have:

- one unusual structural effect,
- narrower numeric bonuses.

A common evolution line may have:

- strong dependable specialization.

Both remain valuable.

---

# 98. NO UNIVERSAL POWER SCORE

The game should not reduce Catchmons to one visible number such as:

> Power 1,248

because utility is contextual.

Comparison should focus on:

- domain,
- ability,
- affinity,
- tags,
- current assignment.

---

# 99. CATCHMON VALUE COMES FROM FIT

A Catchmon can be “best” for:

- one station,
- one product family,
- one customer strategy,
- one expedition route,
- one resource pipeline.

This contextual strength is the intended balance model.

---

# 100. ABILITY DESIGN PRIORITY

When assigning a capability, use this priority order:

1. **unlock a new possibility**
2. **change a decision**
3. **change information**
4. **change resource shape**
5. **targeted optimization**
6. **generic percentage**

The project should maximize the first four categories where practical.

---

# 101. STRUCTURAL ABILITY LIMIT

Most Catchmon lines should have at most:

> **one major structural capability**

unless the line is deliberately built as a rare flexible specialist with offsetting constraints.

This prevents feature inflation.

---

# 102. GENERIC MODIFIER LIMIT

Avoid giving one Catchmon several independent bonuses such as:

- +craft speed,
- +sale value,
- +materials,
- +customer rate,
- +expedition loot.

A clean ability identity is better than a stat bundle.

---

# 103. CATCHMON ROLE PROFILE

Every line should eventually be described in one sentence:

> **“This Catchmon is a [Primary Domain] specialist that [distinct strategic function].”**

If the sentence is vague, the design is not finished.

---

# 104. FULL-ROSTER MAPPING WORKFLOW

The 104-Catchmon roster should be mapped in a controlled sequence.

Do **not** assign abilities randomly species-by-species.

Use the following process.

---

# 105. STEP 1 — NORMALIZE CANONICAL ROSTER

Create a canonical roster containing:

- species ID,
- display name,
- element,
- evolution line ID,
- evolution stage,
- rarity,
- asset reference,
- canonical lore/fantasy descriptors if available.

No new gameplay role yet.

---

# 106. STEP 2 — GROUP BY EVOLUTION LINE

All stages belonging to the same evolution line are grouped.

Single-stage species form one-member lines.

This becomes the design unit.

---

# 107. STEP 3 — EXTRACT FANTASY SIGNALS

For each line, inspect:

- visual design,
- element,
- name,
- lore,
- apparent behavior,
- environment.

Create 2–4 short fantasy descriptors.

Examples structurally:

- curious,
- volcanic,
- tool-using,
- social,
- nocturnal.

Do not infer gameplay before recording the fantasy.

---

# 108. STEP 4 — ASSIGN PRIMARY DOMAIN

Choose exactly one:

- Workshop,
- Shop Floor,
- Supply,
- Expedition.

Selection should fit:

- fantasy,
- element/world distribution,
- overall roster balance.

---

# 109. STEP 5 — ASSIGN SPECIALIZATION

Choose the line's distinct strategic job.

Example shape:

> Workshop → Fieldworks Bench → Capture Gear quality specialist.

or:

> Shop Floor → Explorer traffic → Demand Insight.

or:

> Supply → Aquatic resources → overflow conversion.

---

# 110. STEP 6 — OPTIONAL SECONDARY DOMAIN

Add only if the line's fantasy strongly supports it and the roster needs it.

Do not use Secondary Domain merely to make a Catchmon “more useful.”

---

# 111. STEP 7 — ASSIGN SYNERGY TAGS

Add a small set of meaningful tags based on:

- domain,
- environment,
- workstyle,
- specialization.

---

# 112. STEP 8 — DESIGN EVOLUTION PROGRESSION

For each stage:

### Base
Core capability.

### Later stage
Deeper capability.

### Final/signature stage
Completed identity.

Ensure no stage changes role arbitrarily.

---

# 113. STEP 9 — CHECK CAPABILITY BUDGET

Review:

- structural effects,
- strategic effects,
- numeric effects,
- flexibility.

Reduce overloaded lines.

---

# 114. STEP 10 — CHECK ROSTER COVERAGE

Review the complete roster for:

- all four domains represented,
- all five stations supported,
- all seven product families supported,
- customer hooks represented,
- supply roles represented,
- expedition roles represented,
- all canonical elements represented,
- no one domain overwhelmingly dominant.

---

# 115. STEP 11 — CHECK DUPLICATION

Identify Catchmon lines with nearly identical gameplay.

If two lines both do:

> +X% Provisions speed

differentiate through:

- resource shape,
- quality,
- order interaction,
- Momentum,
- secondary domain,
- synergy,
- access.

---

# 116. STEP 12 — CHECK ACQUISITION DISTRIBUTION

Later, with Documents 07/09:

Ensure important capability types are not all locked behind very late or rare Catchmons.

The player needs meaningful options throughout progression.

---

# 117. CANONICAL CATCHMON GAMEPLAY SCHEMA

The final canonical gameplay definition should eventually resemble:

```text
catchmonLineId
speciesStages[]
primaryDomain
secondaryDomain?
element
rarityProfile
coreFantasyTags[]
specializationId
stationAffinity?
productFamilyAffinity?
customerAffinity?
resourceAffinity?
expeditionAffinity?
coreCapabilityId
developedCapabilityId?
signatureCapabilityId?
synergyTags[]
evolutionProfile
levelProfile
availabilityProfile
visualAssetRefs[]
```

Stage-specific data may extend the line definition.

---

# 118. STAGE-SPECIFIC SCHEMA

A species stage may define:

```text
speciesId
lineId
stageIndex
displayName
assetRef
levelRequirementProfile
capabilityStage
visualState
collectionEntry
```

Avoid duplicating the full role definition per stage.

---

# 119. CAPABILITY REGISTRY

Capabilities should live in canonical typed definitions.

A capability should reference:

- effect type,
- valid domain,
- target,
- condition,
- magnitude/config reference,
- presentation text key.

Gameplay formulas should not be embedded in Catchmon UI components.

---

# 120. CAPABILITY EFFECT FAMILIES

Implementation should prefer reusable effect families such as:

```text
CRAFT_SPEED_TARGETED
CRAFT_QUALITY_TARGETED
MATERIAL_EFFICIENCY_TARGETED
RECIPE_UNLOCK
CUSTOMER_ATTRACTION
DEMAND_INSIGHT
RECOMMEND_COMPATIBILITY
SUPPLY_YIELD_TARGETED
RESOURCE_CONVERSION
EXPEDITION_ROUTE_ACCESS
EXPEDITION_REWARD_WEIGHT
DISCOVERY_BOOST
GEAR_EFFICIENCY
```

Exact type names belong to Technical Architecture.

The principle is:

> **reuse effect primitives; do not write 104 bespoke engines.**

---

# 121. SIGNATURE EFFECT ESCAPE HATCH

The architecture may support a small number of signature custom effects.

They must be:

- clearly justified,
- isolated,
- testable,
- registered explicitly.

Avoid turning every Catchmon into a special-case branch.

---

# 122. DATA-DRIVEN FIRST

Most Catchmon differences should be expressible through canonical data using reusable effect systems.

This is critical for:

- balance,
- testing,
- future roster tuning,
- token-efficient Claude Code work.

---

# 123. CATCHMON COLLECTION UI REQUIREMENTS

Final UX belongs to Document 11.

This document requires Catchmon presentation to make the following immediately readable:

- owned/discovered state,
- current evolution stage,
- element,
- primary role,
- current assignment,
- core capability,
- next development/evolution goal,
- synergy tags where relevant.

---

# 124. NO STAT WALL

Catchmon details should not display:

- dozens of percentages,
- hidden efficiency formulas,
- irrelevant combat stats.

The player should understand the Catchmon's purpose quickly.

---

# 125. ROLE ICON REQUIREMENT

The future asset system will likely need compact visual symbols for:

- Workshop,
- Shop Floor,
- Supply,
- Expedition.

Potential secondary specialization icons may be needed later.

These should be designed in Document 13.

Do not use emoji as final production UI.

---

# 126. ASSIGNMENT VISIBILITY

A Catchmon's current assignment should be visible from:

- Catchmon detail,
- relevant station/shop/supply/expedition screen,
- roster overview where practical.

The player should not lose track of where a Catchmon is working.

---

# 127. SHOP/WORLD VISUAL PRESENCE

Assigned Catchmons should ideally be visually represented where they work.

Examples:

## Workshop
Near relevant station.

## Shop Floor
Moving/interacting with customers.

## Supply
At supply point or represented through a clear activity state.

## Expedition
Absent from shop and shown as away/on route.

This makes the collection feel alive.

---

# 128. UNASSIGNED VISUAL PRESENCE

Unassigned Catchmons may roam or rest in the shop/habitat.

This is primarily visual/world-building.

They do not produce hidden passive economy.

---

# 129. PLAYER FAVORITES

The player may eventually mark favorite Catchmons.

Favorite status should not affect balance.

It is an organizational/cosmetic preference.

---

# 130. ROSTER FILTERING

As the collection grows, the UI should eventually support filters by:

- domain,
- assignment,
- element,
- evolution state,
- rarity,
- synergy tag,
- availability.

This is a later UX requirement.

---

# 131. RECOMMENDED CATCHMONS

The game may provide contextual suggestions such as:

> “Good for this station.”

This should be derived from canonical capability data.

Do not hardcode recommended species lists per screen.

---

# 132. NO AUTO-BEST BUTTON AS CORE

A convenience “recommend setup” feature may exist later.

But the game should not reduce all assignment decisions to:

> press Auto Best.

The player should understand why a setup works.

---

# 133. CATCHMON + PRODUCT INTERACTION

Catchmon effects should connect to product systems through:

- station affinity,
- product-family affinity,
- element affinity,
- quality,
- recipe access,
- dual-use gear.

These relationships must be visible enough to support decisions.

---

# 134. CATCHMON + CUSTOMER INTERACTION

Catchmon effects should connect to customer systems through:

- traffic composition,
- demand affinity,
- Recommend,
- insight,
- premium interaction,
- special visitors.

---

# 135. CATCHMON + SUPPLY INTERACTION

Catchmon effects should connect to economy through:

- resource access,
- resource flow,
- targeted efficiency,
- special components.

They should not simply print Coins.

---

# 136. CATCHMON + EXPEDITION INTERACTION

Catchmons form the strategic core of expedition preparation.

The expedition system should ask:

> **Which Catchmons are suited to the opportunity I want?**

not:

> “Which have the highest combat power?”

---

# 137. EXPEDITION TEAM BOUNDARY

Expeditions may use small Catchmon teams.

Exact team size belongs to Document 07.

The team system should support:

- role complementarity,
- element/region fit,
- synergy,
- gear interaction.

---

# 138. NO COMBAT POWER CHECK

Expedition eligibility/success should not rely on a single total power number.

Better inputs include:

- required capability,
- preferred tag,
- region affinity,
- gear preparation,
- team synergy,
- Catchmon level.

---

# 139. EXPEDITION OUTCOME PHILOSOPHY

Catchmon choice should alter:

- speed,
- reward profile,
- discovery,
- access,
- information.

It should not create brutal failure for choosing a non-meta team.

---

# 140. COLLECTION PROGRESSION

Catching new Catchmons should create progression through:

- new capabilities,
- broader assignment options,
- synergy possibilities,
- evolution lines,
- collection milestones.

Collection itself is a form of horizontal progression.

---

# 141. COLLECTION MILESTONES

Collection milestones may later unlock:

- cosmetic prestige,
- shop decorations,
- progression rewards,
- quality-of-life features.

They should not produce huge global percentage stacking.

Document 09 owns exact milestone design.

---

# 142. NO COLLECTION TAX

The game should not require:

> own X% of all Catchmons

for every major progression step.

Collection requirements should be used selectively.

Players should be able to pursue different economic strategies without identical catch order.

---

# 143. CATCHMON AVAILABILITY AND ECONOMIC FAIRNESS

Critical economic roles must not exist only on extremely rare species.

Each major domain should have:

- accessible early options,
- mid-game specialists,
- rare advanced alternatives.

Rarity should expand possibilities, not hold the basic economy hostage.

---

# 144. STARTER CATCHMON BOUNDARY

The starting Catchmon should demonstrate the value of Catchmons immediately.

It should provide:

- a visible functional effect,
- an understandable assignment,
- a role that remains useful beyond the tutorial.

Exact starter identity is not defined here.

---

# 145. FIRST CATCH EXPERIENCE

The first newly caught Catchmon should ideally create a different functional possibility from the starter.

This teaches:

> **different Catchmons do different jobs.**

---

# 146. EARLY ROSTER TARGET

Early progression should give the player enough Catchmons to experience:

- at least two functional domains,
- an assignment choice,
- one synergy or complementary setup,
- one evolution path.

Exact pacing belongs to Documents 07/09.

---

# 147. MID-GAME ROSTER EXPERIENCE

Mid game should introduce:

- specialization,
- more assignment competition,
- secondary domains,
- stronger element identity,
- signature capabilities,
- expedition team planning.

---

# 148. LATE-GAME ROSTER EXPERIENCE

Late game should emphasize:

- portfolio optimization,
- advanced synergies,
- signature abilities,
- evolving favorite lines,
- collection completion,
- multiple viable shop builds.

Late game should not become:

> only use highest-rarity Catchmons.

---

# 149. CATCHMON SPECIALIZATION VS FLEXIBILITY

The roster should contain both:

## SPECIALISTS
Very strong in a narrow context.

## FLEXIBLE CATCHMONS
Useful across two related contexts, but not best in either.

This gives players meaningful choices.

---

# 150. FLEXIBILITY COST

A flexible Catchmon should normally sacrifice:

- peak magnitude,
- structural unlock strength,
- narrow specialization.

Otherwise flexibility becomes universally superior.

---

# 151. PLAYER IDENTITY

Over time, a player's active Catchmon configuration should help define their shop identity.

Examples structurally:

- premium Elemental Craft shop,
- high-turnover Provisions shop,
- explorer-focused Field Gear shop,
- efficient habitat supplier,
- discovery-focused collection shop.

The roster enables builds.

---

# 152. NO PERMANENT BUILD LOCK

Catchmon assignment/build strategy should be changeable.

The player should be able to experiment.

Long-term specialization may create opportunity cost, but not irreversible account damage.

---

# 153. CATCHMON RESPEC BOUNDARY

Catchmons themselves should not require complex skill-tree respec systems.

Their core identity is authored.

The player chooses:

- where to assign,
- which to develop,
- which synergies to use.

This is enough strategic control.

---

# 154. NO INDIVIDUAL SKILL TREE BY DEFAULT

The base Catchmon design does not require a per-Catchmon skill tree.

Reasons:

- 104 Catchmons would create huge content burden,
- identity would become harder to balance,
- players would face excessive configuration.

Development should come from:

- Level,
- evolution,
- capability milestones,
- assignment.

A skill tree requires later explicit justification.

---

# 155. NO UNIVERSAL CATCHMON SKILL TREE

A global Catchmon stat tree is also not assumed.

Project progression should first use:

- shop infrastructure,
- recipes,
- Catchmon collection,
- evolution,
- specialization.

---

# 156. ABILITY TEXT RULE

Player-facing Catchmon abilities should use concise, functional language.

Bad:

> “Improves synergistic operational resonance efficiency.”

Good shape:

> “Field Gear crafted here has a higher Fine chance.”

The exact copy comes later.

---

# 157. ABILITY TRANSPARENCY

The player should be able to identify:

- what system is affected,
- under what condition,
- what changes.

Avoid hidden bonuses.

---

# 158. CONDITIONAL EFFECTS

Conditional Catchmon abilities are encouraged when the condition is understandable.

Examples:

- when crafting Field Gear,
- in Water regions,
- for explorer customers,
- when Momentum is above threshold.

Conditions create identity.

---

# 159. CONDITION COUNT LIMIT

A normal ability should not require five simultaneous conditions.

Aim for:

- one primary condition,
- optional simple secondary condition.

Complexity belongs to rare signature abilities only.

---

# 160. PERCENTAGE MODIFIER DISCIPLINE

When numeric modifiers are used:

- target them narrowly,
- centralize balance values,
- avoid uncontrolled multiplication,
- keep player-facing rounding/readability.

Exact numbers belong to balance data.

---

# 161. ADDITIVE VS MULTIPLICATIVE

Technical Architecture should categorize Catchmon modifiers so stacking remains stable.

The design preference is:

- targeted additive bonuses for common stacking,
- multiplicative effects reserved for major structural cases,
- hard caps/diminishing returns where necessary.

---

# 162. CATCHMON SYNERGY STACKING

Synergy effects should not stack infinitely through repeated tags.

A synergy should usually evaluate:

- condition met or not,
- small number of tiers,
- bounded contribution.

---

# 163. MULTIPLE SAME-TAG CATCHMONS

If several Catchmons share one tag, the system should not necessarily scale linearly forever.

Potential later design:

- first pair activates synergy,
- additional members provide limited incremental value.

Exact formula is open.

---

# 164. ROSTER BALANCE AUDIT

Before finalizing 104 mappings, run a structured audit.

For every line, record:

- primary domain,
- secondary domain,
- specialization,
- element,
- rarity,
- capability strength class,
- synergy tags,
- evolution depth,
- expected availability phase.

---

# 165. DOMAIN DISTRIBUTION AUDIT

Check whether the roster provides healthy coverage across:

- Workshop,
- Shop Floor,
- Supply,
- Expedition.

Exact equal distribution is not required.

But no domain should feel like it has only a handful of viable options.

---

# 166. STATION COVERAGE AUDIT

Workshop-focused lines should collectively cover:

- Provision Station,
- Care Atelier,
- Fieldworks Bench,
- Resonance Lab,
- Habitat Workshop.

---

# 167. PRODUCT FAMILY COVERAGE AUDIT

Catchmon abilities should collectively interact with all seven product families.

Avoid over-concentrating value into Elemental Craft simply because it feels “special.”

---

# 168. CUSTOMER COVERAGE AUDIT

Shop Floor lines should collectively cover:

- Walk-In traffic,
- Focused demand,
- Recommend,
- Demand Insight,
- Premium interactions,
- Special Visitors.

---

# 169. SUPPLY COVERAGE AUDIT

Supply lines should collectively cover:

- routine input,
- storage/overflow,
- conversion,
- special components,
- regional resources.

---

# 170. EXPEDITION COVERAGE AUDIT

Expedition lines should collectively cover:

- access,
- speed,
- reward specialization,
- discovery,
- encounter insight,
- gear efficiency.

---

# 171. ELEMENT COVERAGE AUDIT

Every canonical element should have:

- meaningful Catchmon representation,
- at least one economic/exploration identity,
- appropriate region/world relationship.

Document 10 will define the exact identity.

---

# 172. EARLY ACCESS AUDIT

Ensure the player's early roster can support:

- crafting,
- customer interaction or supply,
- initial expedition/discovery.

Do not lock all interesting mechanics behind late-game rarity.

---

# 173. RARITY AUDIT

Check:

- common species are still useful,
- rare species are not universally stronger,
- high-rarity abilities are distinctive rather than merely larger.

---

# 174. EVOLUTION AUDIT

For every multi-stage line, verify:

- role continuity,
- visible capability growth,
- no arbitrary domain switch,
- no evolution that feels mechanically worse.

---

# 175. DUPLICATION AUDIT

Flag any two lines whose capability text could be swapped without changing strategy.

Those lines need differentiation.

---

# 176. FULL-ROSTER MAPPING OUTPUT

After Document 06 is approved and canonical data is normalized, create a dedicated content document/data table such as:

`06A_CATCHMON_ROSTER_ROLE_MAPPING.md`

or a canonical data registry.

This should contain the actual mapping for all 104 Catchmons.

Do not overload this architecture document with 104 final entries.

---

# 177. WHY MAPPING IS SEPARATE

Architecture answers:

> **How Catchmons work.**

Roster mapping answers:

> **What each Catchmon does.**

Keeping them separate allows:

- balance iteration,
- clearer Claude context,
- smaller token usage,
- easier auditing.

---

# 178. TOKEN-EFFICIENT CLAUDE WORKFLOW

When implementing one Catchmon system, Claude should not load all 104 Catchmons unless required.

Example:

### Station-support task
Read:
- Document 04 relevant station sections,
- Document 06 Workshop/assignment sections,
- relevant capability registry,
- only Catchmons using those capability types.

Full-roster data is needed only for:
- validation,
- migration,
- roster-wide analysis.

---

# 179. CATCHMON DATA SOURCE RULE

Canonical Catchmon identity data must not be duplicated between:

- roster UI,
- expedition code,
- crafting code,
- customer code.

All systems reference stable Catchmon/species/line IDs.

---

# 180. EVOLUTION DATA SOURCE RULE

Evolution relationships must have one canonical owner.

Do not independently hardcode evolution chains inside:

- capture,
- UI,
- progression,
- Catchdex.

---

# 181. ELEMENT DATA SOURCE RULE

Catchmon element identity must reference canonical element definitions.

Do not create separate strings or color constants per feature.

---

# 182. CAPABILITY DATA SOURCE RULE

Catchmon abilities should be referenced through canonical capability IDs/config.

UI text should derive from or correspond to the same capability definition.

---

# 183. NO OLD GAMEPLAY IMPORT

When importing the existing 104 Catchmons, do **not** automatically import previous-game:

- Funken production,
- old level curves,
- old evolution reset rules,
- old team limits,
- old catch chance,
- old skill-tree modifiers,
- old prestige interactions,
- old reaction engine behavior

unless a current Catchmon Shop design document explicitly adopts them.

The existing Catchmons are reusable content.

Their old gameplay implementation is not the new source of truth.

---

# 184. CATCHMON PROTOTYPE SCOPE

The first vertical mechanics prototype does **not** need all 104 Catchmons.

It needs only a small set that demonstrates distinct roles.

Minimum recommended set:

1. Workshop specialist
2. Shop Floor specialist
3. Supply specialist
4. Expedition specialist
5. one evolving line or simulated evolution
6. one synergy pair

Some roles may overlap within 4–6 prototype Catchmons.

---

# 185. PROTOTYPE SCENARIO A — ASSIGNMENT CHOICE

State:

- player owns Workshop and Supply specialists,
- only one relevant active slot/opportunity.

Question:

> Does assignment create meaningful opportunity cost?

---

# 186. PROTOTYPE SCENARIO B — ROLE IDENTITY

Give the player two Catchmons with different Primary Domains.

Question:

> Can the player explain what each is for after brief use?

---

# 187. PROTOTYPE SCENARIO C — CATCH VALUE

Add a newly caught Catchmon that unlocks or changes one strategic option.

Question:

> Does the player immediately feel that the catch mattered?

---

# 188. PROTOTYPE SCENARIO D — LEVEL

Allow one Catchmon to reach a development milestone.

Question:

> Does progression feel useful without becoming stat grind?

---

# 189. PROTOTYPE SCENARIO E — EVOLUTION

Simulate an evolution milestone.

Question:

> Does evolution feel like a stronger expression of the same identity?

---

# 190. PROTOTYPE SCENARIO F — SYNERGY

Allow two compatible Catchmons to trigger a synergy.

Question:

> Can the player understand why the combination works?

---

# 191. PROTOTYPE SCENARIO G — EXPEDITION

Offer an expedition where different Catchmons alter:

- duration,
- reward,
- discovery.

Question:

> Does team selection feel strategic without combat stats?

---

# 192. PROTOTYPE METRICS

Track:

- assignment usage by domain,
- reassignment frequency,
- time spent unassigned,
- capability trigger frequency,
- Catchmon level progression,
- evolution timing,
- synergy usage,
- expedition composition,
- station/product choices after Catchmon acquisition,
- customer behavior changes after Catchmon assignment,
- whether players can recall Catchmon roles.

---

# 193. REASSIGNMENT HEALTH TARGET

If players repeatedly swap Catchmons every few seconds to optimize each transaction/craft:

> assignment design has failed.

The preferred behavior is:

> players change setup when their strategy changes.

---

# 194. ROLE RECALL TARGET

After several minutes with a Catchmon, a player should be able to explain its main use without reopening the detail screen.

---

# 195. COLLECTION VALUE TARGET

When a new Catchmon appears, the player should care about:

- what it does,
- what it enables,
- what it synergizes with

in addition to appearance/rarity.

---

# 196. RARITY HEALTH TARGET

Playtesting should show some common/accessible Catchmons remain in active use even after rare species are obtained.

---

# 197. EVOLUTION HEALTH TARGET

Players should want to evolve because:

- capability becomes more interesting,
- identity deepens,
- visual form progresses.

Not merely because:

> number becomes larger.

---

# 198. SYNERGY HEALTH TARGET

Players should discover multiple useful combinations.

No single synergy should become mandatory across all systems.

---

# 199. CATCHMON ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — PASSIVE STAT CARDS

Catchmons mostly provide global percentage bonuses.

Result:

Collection lacks identity.

---

## ANTI-PATTERN B — ALL 104 ACTIVE

Every owned Catchmon contributes simultaneously.

Result:

Collection becomes passive multiplier stacking.

---

## ANTI-PATTERN C — RARITY = POWER

High-rarity Catchmons are strictly stronger in every context.

Result:

Most roster becomes obsolete.

---

## ANTI-PATTERN D — ROLE RANDOMNESS

Evolution stages have unrelated gameplay jobs.

Result:

Lines lack identity.

---

## ANTI-PATTERN E — DUPLICATE POWER

Players need multiple copies to upgrade a Catchmon.

Result:

Curated collection becomes gacha grind.

---

## ANTI-PATTERN F — STAMINA ADMINISTRATION

Every Catchmon has fatigue/hunger timers.

Result:

Roster becomes maintenance work.

---

## ANTI-PATTERN G — SWAP MACRO

Optimal play requires reassigning before each craft/customer.

Result:

Strategy becomes repetitive labor.

---

## ANTI-PATTERN H — UNIVERSAL POWER SCORE

All utility collapses to one Power number.

Result:

Contextual strategy disappears.

---

## ANTI-PATTERN I — 104 BESPOKE ENGINES

Every Catchmon uses custom code.

Result:

Implementation and balance become unmaintainable.

---

## ANTI-PATTERN J — 104 IDENTICAL MODIFIERS

Every Catchmon uses the same effect with different percentages.

Result:

Roster feels interchangeable.

---

## ANTI-PATTERN K — ELEMENT RECOLOR

Element changes only color.

Result:

Canonical world identity has no gameplay meaning.

---

## ANTI-PATTERN L — COMBAT CREEP

Expeditions gradually become battle encounters.

Result:

Project loses shop/exploration focus.

---

## ANTI-PATTERN M — EVOLUTION RESET

Evolution repeatedly resets progress without strong reason.

Result:

Development feels punitive.

---

## ANTI-PATTERN N — SHINY POWER

Shiny variants have stronger economic stats.

Result:

Cosmetic prestige becomes mandatory grind.

---

## ANTI-PATTERN O — LEGENDARY MONOPOLY

Critical economic systems require late legendary Catchmons.

Result:

Progression becomes roster-RNG hostage.

---

## ANTI-PATTERN P — HIDDEN EFFECTS

Player cannot see why a Catchmon affects something.

Result:

Assignments feel arbitrary.

---

# 200. CONTENT DEVELOPMENT PIPELINE — EACH LINE

When designing an actual evolution line:

### STEP 1
Read canonical species data/assets.

### STEP 2
Write fantasy descriptors.

### STEP 3
Choose Primary Domain.

### STEP 4
Choose specialization.

### STEP 5
Choose optional Secondary Domain.

### STEP 6
Choose synergy tags.

### STEP 7
Design core capability.

### STEP 8
Design evolution progression.

### STEP 9
Add signature capability only if justified.

### STEP 10
Assign qualitative capability budget.

### STEP 11
Check against existing lines for duplication.

### STEP 12
Check availability/rarity balance.

Only then approve gameplay mapping.

---

# 201. ROSTER-MAPPING REVIEW FORMAT

Every mapped line should be reviewable in a compact table:

| Field | Value |
|---|---|
| Line ID | |
| Species stages | |
| Element | |
| Rarity | |
| Fantasy | |
| Primary Domain | |
| Secondary Domain | |
| Specialization | |
| Core Capability | |
| Developed Capability | |
| Signature Capability | |
| Synergy Tags | |
| Evolution Logic | |
| Availability Phase | |
| Similar Existing Lines | |
| Differentiator | |

This makes 104-Catchmon review manageable.

---

# 202. FULL-ROSTER BALANCE MATRIX

After mapping, maintain a matrix with one row per evolution line and columns for:

- domain,
- station,
- product family,
- customer hook,
- resource hook,
- expedition hook,
- element,
- rarity,
- synergy,
- structural effect count,
- strategic effect count,
- generic modifier count,
- availability phase.

This will expose gaps and over-concentration.

---

# 203. CATCHMON + ASSET PLANNING CONSEQUENCE

The 104 Catchmon images already exist.

Do not regenerate them merely because the new project has different gameplay.

Future additional Catchmon-related assets may include:

- role icons,
- assignment indicators,
- element badges,
- evolution markers,
- synergy tags,
- away/working states,
- shiny treatment.

These are reusable UI/system assets and belong to Documents 12/13.

---

# 204. NO NEW CREATURE GENERATION REQUIRED FOR MVP

The project already has a substantial roster.

The priority is:

> **make the 104 existing Catchmons mechanically meaningful.**

Do not expand the species count before the existing roster works.

---

# 205. ANIMATION BOUNDARY

Catchmons should eventually show lightweight work behaviors.

Examples:

- craft interaction,
- customer greeting,
- carrying material,
- expedition departure/return,
- idle/rest.

The exact animation system belongs to later technical/art documents.

---

# 206. ANIMATION DOES NOT DEFINE GAMEPLAY

A Catchmon's mechanic must remain valid even if the first prototype represents it with a simple token/card.

Do not block mechanical testing on final animation production.

---

# 207. SYSTEM OWNERSHIP BOUNDARIES

To prevent future document conflicts:

### Document 01 owns
- project identity,
- collection/shop design pillars.

### Document 02 owns
- core engine and session structure.

### Document 03 owns
- macroeconomic boundaries.

### Document 04 owns
- crafting/product systems and Catchmon crafting hook categories.

### Document 05 owns
- customer/selling behavior and Catchmon customer hook categories.

### Document 06 owns
- Catchmon role architecture,
- assignment,
- development,
- evolution,
- rarity/shiny gameplay boundaries,
- synergy.

### Document 07 will own
- expedition execution,
- encounter/capture system,
- duplicate encounter resolution.

### Document 08 will own
- physical assignment infrastructure/capacity.

### Document 09 will own
- Catchmon level/evolution pacing and progression unlock timing.

### Document 10 will own
- exact element/world gameplay identities.

### Document 11 will own
- final Catchmon screens and assignment UX.

---

# 208. LOCKED DECISIONS FROM DOCUMENT 06

The following decisions are considered part of the intended Catchmon Gameplay Integration unless deliberately revised:

1. The existing 104 Catchmons are a core gameplay asset, not merely a cosmetic collection.
2. Catchmons are not primarily combat units.
3. Catchmon gameplay design begins at the evolution-line level rather than treating 104 species as unrelated definitions.
4. Each evolution line has one recognizable gameplay identity.
5. Evolution stages deepen that identity rather than switching to unrelated roles.
6. Single-stage Catchmons are not automatically weaker than evolutionary lines.
7. The Catchmon system uses four Primary Domains:
   - Workshop,
   - Shop Floor,
   - Supply,
   - Expedition.
8. Every evolution line has exactly one Primary Domain.
9. A line may optionally have one Secondary Domain.
10. Catchmons should not be universal all-system specialists.
11. Workshop Catchmons may interact with station, product-family, element, quality, material efficiency, workflow, recipe access, and signature crafting.
12. Shop Floor Catchmons may interact with attraction, affinity, service, Recommend, demand insight, Premium Pitch context, special visitors, and signature shop events.
13. Supply Catchmons may interact with routine supply, storage/overflow, material specialization, conversion, special components, and regional resources.
14. Expedition Catchmons may interact with route access, tempo, reward specialization, discovery, encounter insight, gear efficiency, and risk protection.
15. Catchmons provide major effects through explicit functional assignments.
16. A Catchmon normally performs one functional duty at a time.
17. Functional assignment classes are Workshop, Shop Floor, Supply, and Expedition.
18. Unassigned Catchmons may remain visually present but do not contribute major global passive bonuses.
19. The game does not stack all 104 Catchmon abilities simultaneously.
20. Catchmon support capacity is limited and progression-controlled.
21. Catchmon assignments persist until changed.
22. The design should avoid per-craft/per-customer swap macros.
23. Relevant effects may be snapshotted when an activity begins to prevent duplication/exploits.
24. The base Catchmon system does not use a universal stamina/fatigue/hunger mechanic.
25. Catchmons have a long-term development track under the working concept Catchmon Level.
26. Catchmon Level is a progression state, not a spendable currency.
27. Catchmon experience comes primarily from meaningful participation.
28. Newly caught Catchmons should be useful before heavy leveling.
29. Exact level cap and curve remain open for Document 09.
30. Catchmon capability development uses core, developed, and optional signature layers conceptually.
31. Evolution is forward progression and does not reset to level 1 by default.
32. Evolution preserves the line's gameplay identity.
33. Earlier evolution stages remain permanently credited as discovered after evolution.
34. Duplicate copies are not required for normal Catchmon power progression.
35. The base design does not use duplicate fusion/sacrifice/star-up.
36. The functional ownership model is one active owned instance per species/evolution-line state rather than stackable worker duplicates.
37. Shiny/variant status is cosmetic/collection prestige and does not provide stronger gameplay stats by default.
38. Rarity influences acquisition/presentation/uniqueness more than raw power.
39. Higher rarity does not automatically mean universally stronger.
40. Catchmon elements matter through economic/exploration affinity rather than combat type-effectiveness.
41. Exact element identities are deferred to Document 10.
42. The base synergy system is tag-based.
43. The project does not use a manually authored 104×104 pairwise synergy table.
44. Each Catchmon line uses a small number of meaningful synergy tags.
45. Signature pair synergies are rare exceptions.
46. Every Catchmon remains useful without requiring one exact synergy partner.
47. Catchmon design uses a qualitative capability budget.
48. Structural effects are more powerful/limited than ordinary optimization modifiers.
49. Most lines should have at most one major structural capability.
50. The game does not expose a universal Catchmon Power score.
51. Catchmon value is contextual to role and strategy.
52. Capability design prioritizes new possibilities, decisions, information, and resource-shape changes over generic percentages.
53. Most Catchmon effects should use reusable data-driven capability primitives rather than bespoke code.
54. A small number of signature custom effects may exist when justified.
55. Exact 104-Catchmon role mapping will be created separately after this architecture is approved.
56. Full-roster mapping proceeds by evolution line, fantasy, domain, specialization, synergy, evolution, and balance audit.
57. The canonical Catchmon gameplay schema references stable line/species IDs.
58. Catchmon identity, evolution, element, and capability data each require canonical sources of truth.
59. Previous-game Catchmon gameplay values/mechanics are not automatically imported.
60. The project should not generate additional creature species for MVP before the existing 104 are mechanically integrated.

---

# 209. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- exact number of evolution lines among the 104 Catchmons,
- exact Primary Domain assignment per line,
- exact Secondary Domains,
- exact Catchmon Level cap,
- exact XP curve,
- exact XP rewards,
- exact level milestone bonuses,
- exact evolution thresholds,
- exact evolution resource requirements,
- exact capability magnitudes,
- exact capability registry implementation,
- exact station support capacity,
- exact Shop Floor Catchmon capacity,
- exact Supply assignment structure,
- exact expedition team size,
- exact synergy tag vocabulary,
- exact synergy magnitudes,
- exact element gameplay identities,
- exact rarity distribution,
- exact availability/progression order,
- exact duplicate encounter behavior,
- exact shiny acquisition behavior,
- exact collection milestone rewards,
- exact Catchmon UI,
- exact animation implementation,
- exact 104-line mapping.

These belong to Documents 07–11, Technical Architecture, balancing, and the dedicated roster-mapping artifact.

---

# 210. DEPENDENCY HANDOFF TO DOCUMENT 07

The Catchmon system now defines:

- what Catchmons are useful for,
- how they are assigned,
- how they develop,
- how evolution works conceptually,
- how rarity/elements/synergies behave,
- how Expedition Catchmons can affect external opportunities.

The next document must define:

> **What actually happens when Catchmons leave the shop and explore the world — and how materials, discovery, encounters, and capture work without combat.**

Document 07 must convert the Expedition domain from an abstract capability into a complete loop.

---

# 211. NEXT DOCUMENT

## `07_CATCHMON_SHOP_ACQUISITION_AND_EXPEDITIONS.md`

Document 07 should define:

### Expedition structure
- what an expedition is,
- how it starts,
- team selection,
- duration,
- routes,
- preparation.

### Expedition rewards
- routine materials,
- special components,
- discoveries,
- Catchmon encounters.

### Route access
- region,
- element,
- capability,
- gear requirements.

### Field Gear
- what crafted Field Gear does during expeditions.

### Capture & Discovery Gear
- what crafted capture/discovery products do.

### Encounter generation
- how wild Catchmons are discovered,
- how rarity affects appearance,
- how bad-luck protection works.

### Capture system
- player decision,
- preparation,
- capture chance/guarantee philosophy,
- failure behavior,
- repeat opportunities.

### One-owned-instance model
- how already-owned species are handled,
- how duplicates are prevented from becoming workers.

### Shiny/variant encounter
- how cosmetic variants fit the acquisition system.

### Expedition uncertainty
- what can go wrong,
- what cannot be lost,
- how non-combat risk works.

### Active vs offline
- what resolves while away,
- what requires player interaction on return.

### Expedition/Catchmon synergy
- how team tags, roles, elements, and gear combine.

### First-region onboarding
- how the player learns exploration without system overload.

Only after Document 07 is stable should exact expedition routes, capture items, special components, and encounter tables be built.

---

# 212. DEFINITION OF DONE FOR CATCHMON GAMEPLAY INTEGRATION

Document 06 is ready to hand off when the project can answer:

- What are Catchmons mechanically in Catchmon Shop?
- Why are they not combat units?
- Why is evolution-line-first design better than 104 unrelated bonuses?
- What are the four functional domains?
- How is a Catchmon assigned?
- Why can it only provide one major active duty at a time?
- Why do unassigned Catchmons not stack passive bonuses?
- Does the system need stamina?
- How does Catchmon Level work conceptually?
- What does evolution do?
- Does evolution reset progress?
- What happens to earlier collection entries after evolution?
- Are duplicate units required?
- What is the gameplay role of shiny variants?
- How does rarity affect value without making common Catchmons obsolete?
- How do elements matter without combat counters?
- How do synergies scale to 104 Catchmons?
- Why is tag-based synergy preferred?
- How is Catchmon power budgeted?
- How do we prevent one universal best Catchmon?
- How do Catchmons interact with Workshop, Shop Floor, Supply, and Expedition?
- How will all 104 Catchmons be mapped consistently?
- What canonical data schema is needed?
- Which previous-game mechanics must not leak into the new project?
- What should the prototype test?
- Which decisions are now locked?
- Which details intentionally remain for Documents 07–10 and balancing?

If these answers remain stable, the project can design the acquisition/expedition loop without needing to redefine what Catchmons are.
