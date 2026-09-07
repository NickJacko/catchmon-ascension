# CATCHMON SHOP — 04 CRAFTING & PRODUCT SYSTEM

**Status:** Crafting & Product Architecture v1  
**Purpose:** Define the product universe, recipe structure, production-station architecture, crafting cadence, recipe progression, mastery/quality boundaries, dual-use goods, and Catchmon integration hooks that make the shop economy varied without turning the game into a factory simulator  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  

**Authority:** This document owns:
- top-level product-family architecture,
- functional production-station families,
- recipe data structure,
- crafting queue behavior,
- product progression principles,
- routine/special input composition,
- product economic identities,
- recipe mastery architecture,
- craft-quality architecture,
- dual-use product rules,
- element-aligned recipe rules,
- production/Catchmon integration hooks,
- initial content-volume discipline.

**Out of scope:**  
- exact final item names,
- exact material names,
- exact recipe quantities,
- exact craft durations,
- exact sale prices,
- exact Momentum costs,
- exact 104-Catchmon role mapping,
- exact Catchmon capture formula,
- expedition encounter design,
- customer archetype design,
- physical building placement,
- final progression curve,
- final UI layouts,
- final art style,
- individual icon generation,
- monetization,
- live-ops recipe additions.

---

# 1. WHY THIS DOCUMENT EXISTS

Documents 01–03 establish:

1. the shop is the primary gameplay engine,
2. the player repeatedly crafts, stocks, sells, and reinvests,
3. the economy uses one main macro currency plus materials and special components,
4. Catchmons must change how the shop works,
5. the game must avoid a dominant “always craft the highest item” solution.

Document 04 now defines the content architecture that makes those principles playable.

The central problem is:

> **What should the player actually craft, why would different products be useful in different situations, and how can a large recipe catalog remain understandable and strategically relevant?**

This document intentionally defines **families and systems before individual product content**.

The project should not generate 100 attractive icons and then try to invent gameplay reasons for them.

Gameplay role comes first.

Asset production comes later.

---

# 2. CRAFTING DESIGN THESIS

The crafting system should create a repeating decision:

> **“Given my materials, station capacity, current stock, customer opportunities, goals, and Catchmon setup — what is the best thing for me to make next?”**

There should rarely be one universal answer.

Different products should be attractive because they serve different jobs:

- fast turnover,
- Momentum generation,
- reliable everyday profit,
- premium high-value sales,
- special orders,
- expedition preparation,
- Catchmon acquisition,
- element specialization,
- storage clearing,
- mastery,
- or strategic progression.

Therefore the product catalog is not merely content.

It is the **decision vocabulary of the shop**.

---

# 3. CATCHMON-NATIVE PRODUCT FANTASY

Catchmon Shop should not reproduce a fantasy weapon-and-armor store with Catchmon branding layered on top.

The product universe should naturally belong in a society where people:

- care for Catchmons,
- travel with Catchmons,
- discover wild Catchmons,
- study elements,
- build habitats,
- prepare expeditions,
- collect specialized gear,
- and visit merchants for practical and prestigious goods.

The store fantasy is:

> **the best place in the world to buy useful, delightful, specialized goods for life with Catchmons.**

This creates a distinct identity from a conventional RPG equipment shop.

---

# 4. PRODUCT UNIVERSE — TOP-LEVEL ARCHITECTURE

The initial product universe contains **seven top-level product families**.

These families are not arbitrary content categories.

Each has a different gameplay and economic job.

| # | Product Family | Primary Economic Job | Core Fantasy |
|---|---|---|---|
| 1 | Provisions | Fast turnover / Momentum building | Food, treats, drinks, travel consumables |
| 2 | Care & Comfort | Reliable everyday demand | Grooming, recovery, comfort, care goods |
| 3 | Wearables | Balanced margin / broad specialization | Bands, packs, protective and expressive wear |
| 4 | Field Gear | Expedition preparation / dual-use | Travel, scouting, weather, exploration tools |
| 5 | Capture & Discovery Gear | Collection-loop bridge / dual-use | Lures, trackers, encounter and discovery tools |
| 6 | Elemental Craft | Premium value / element specialization | Charms, resonators, relic-like crafted goods |
| 7 | Habitat & Enrichment | Large orders / high-material conversion | Habitat goods, toys, nests, environmental items |

The names are working system names.

Final thematic naming can change later without changing their economic roles.

---

# 5. WHY SEVEN FAMILIES

Seven families are enough to create breadth without making the catalog impossible to learn.

They collectively cover:

- consumables,
- everyday necessities,
- wearable goods,
- exploration utility,
- capture utility,
- premium fantasy merchandise,
- large lifestyle/habitat products.

This avoids two bad extremes.

## Too few families

If everything is only:

- food,
- tools,
- magic,

the shop quickly feels repetitive.

## Too many families

If the player sees 15–20 product types immediately, category identity disappears and content production explodes.

Seven is therefore the initial architectural ceiling for major families.

Subfamilies may exist inside them.

A new eighth family should only be introduced if it creates a new economic/job role that cannot fit the existing seven.

---

# 6. FAMILY 1 — PROVISIONS

## Purpose

Provisions are the **fastest, most reliable production family**.

They keep the shop moving.

They are expected to include functional archetypes such as:

- treats,
- travel food,
- restorative snacks,
- drinks,
- special blends,
- simple prepared supplies.

Exact products are not defined here.

---

## Economic identity

Provisions should generally lean toward:

- short craft times,
- low-to-medium material cost,
- high unit turnover,
- broad customer demand,
- lower sale value per unit,
- strong usefulness for building Shop Momentum,
- low dependence on rare components in the routine line.

They are the economic equivalent of:

> **“I can always make something useful.”**

---

## Strategic role

Provisions are valuable when the player:

- needs stock quickly,
- needs Momentum,
- wants to keep customer flow active,
- has limited Coins,
- wants to use abundant routine resources,
- needs a short craft between larger crafts.

They remain useful at later progression through improved recipes and specialized demand rather than becoming tutorial-only products.

---

## Advanced progression

Higher progression may introduce:

- element-aligned provisions,
- expedition provisions,
- premium celebration goods,
- special Catchmon-preference products,
- high-quality crafted consumables.

The family must retain at least some short-cycle recipes even in late progression.

---

# 7. FAMILY 2 — CARE & COMFORT

## Purpose

Care & Comfort represents daily products used to keep Catchmons comfortable, clean, rested, and well cared for.

Functional archetypes may include:

- grooming goods,
- wraps,
- care kits,
- comfort items,
- resting accessories,
- cleaning/care products.

---

## Economic identity

Care & Comfort should generally provide:

- dependable everyday demand,
- medium-low craft time,
- medium material intensity,
- moderate stable margins,
- strong order compatibility,
- good cross-element relevance.

This is the **stable backbone family**.

---

## Strategic role

Care & Comfort is attractive when:

- the player wants reliable sales,
- customer demand is broad,
- they want less volatility than premium crafting,
- they are completing orders,
- a Catchmon setup supports care-related production.

---

## Design distinction from Provisions

Provisions are primarily about:

**consumption and turnover.**

Care & Comfort is primarily about:

**durable or semi-durable everyday utility.**

They should not collapse into one generic “consumables” category.

---

# 8. FAMILY 3 — WEARABLES

## Purpose

Wearables give the shop a strong visual merchandise category and create opportunities for expressive, functional, element-aligned products.

Functional archetypes may include:

- bands,
- collars,
- harnesses,
- packs,
- protective wear,
- decorative accessories,
- travel wear.

No product should imply combat equipment by default.

---

## Economic identity

Wearables should generally occupy the **balanced middle**:

- medium craft time,
- medium-to-high sale value,
- broad but somewhat preference-driven demand,
- strong visual collectability,
- good potential for craft-quality value,
- strong Catchmon/element specialization opportunities.

---

## Strategic role

Wearables are attractive when:

- the player wants good value without rare-component commitment,
- a customer category has a specific preference,
- an element or Catchmon synergy improves the family,
- the player is targeting Fine/Masterwork output,
- the player wants visually prestigious stock.

---

# 9. FAMILY 4 — FIELD GEAR

## Purpose

Field Gear connects the shop directly to exploration.

Functional archetypes may include:

- travel packs,
- scout equipment,
- environmental protection,
- navigation tools,
- camping supplies,
- expedition support devices.

---

## Economic identity

Field Gear should generally lean toward:

- medium craft times,
- medium-high material use,
- medium-high sale value,
- stronger dependence on specialized materials than everyday goods,
- meaningful demand from explorer-type customers,
- direct player utility.

---

# 10. FIELD GEAR IS A DUAL-USE FAMILY

Field Gear can be:

1. **sold to customers**, or
2. **retained and consumed/assigned for expedition-related utility**.

This creates an important economic decision:

> **“Do I sell this valuable item now, or use it to improve an external opportunity?”**

This trade creates a natural bridge between shop and world systems.

The exact expedition effects are owned by Document 07.

---

# 11. FAMILY 5 — CAPTURE & DISCOVERY GEAR

## Purpose

This family creates the most direct connection between commerce and the Catchmon collection loop.

Functional archetypes may include:

- lures,
- tracking devices,
- observation tools,
- calming tools,
- encounter kits,
- discovery markers,
- resonance detectors,
- capture-support devices.

The final visual language must be original and must not imitate iconic capture objects from existing creature-collection franchises.

---

## Economic identity

Capture & Discovery Gear should generally have:

- medium-to-long craft times,
- moderate-to-high value,
- selective customer demand,
- stronger dependency on special or element-linked inputs at higher progression,
- direct utility for Catchmon discovery/capture.

---

# 12. CAPTURE GEAR IS A DUAL-USE FAMILY

Like Field Gear, Capture & Discovery Gear can create a sell-vs-use decision.

The player may:

- sell a valuable tool,
- consume it to improve a discovery attempt,
- save it for a rare Catchmon opportunity,
- craft several in preparation for a region.

This realizes the economy principle established in Document 03:

> **commercial progression should support collection progression without simply buying Catchmons with Coins.**

---

# 13. CAPTURE GEAR BOUNDARY

This family should not create a giant consumable tax around every encounter.

Normal Catchmon acquisition must remain understandable and exciting.

Capture products should:

- improve opportunity,
- enable specialized approaches,
- increase preparation depth,
- create strategic advantages.

They should not make catching impossible without maintaining dozens of consumables.

The dedicated capture document will define exact dependency.

---

# 14. FAMILY 6 — ELEMENTAL CRAFT

## Purpose

Elemental Craft represents the premium magical/technical craftsmanship of the Catchmon world.

Functional archetypes may include:

- charms,
- resonators,
- crystals-in-housing,
- focus devices,
- decorative elemental objects,
- rare crafted relics,
- precision elemental instruments.

---

## Economic identity

Elemental Craft should generally represent:

- slower production,
- high sale value,
- higher special-component demand,
- lower everyday volume,
- strong premium-sale suitability,
- strong element-specific demand,
- high relevance for rare customers,
- high potential for quality/mastery payoff.

This is the core **premium merchandise family**.

---

## Strategic role

Elemental Craft is attractive when:

- the player has scarce components to convert into wealth,
- Shop Momentum is high,
- a special customer is available,
- an element-specialized Catchmon setup is active,
- the player wants a high-value craft during a longer offline window.

---

# 15. ELEMENTAL CRAFT BOUNDARY

The existence of 17 elemental/world identities must **not** automatically create:

> 17 variants of every elemental product.

Elemental content must be curated.

A recipe receives an element tag only when the element meaningfully affects:

- fantasy,
- inputs,
- customer demand,
- Catchmon synergy,
- source region,
- or utility.

Elemental color may never be used as empty recolor content.

---

# 16. FAMILY 7 — HABITAT & ENRICHMENT

## Purpose

Habitat & Enrichment covers larger lifestyle products related to where Catchmons live, rest, play, and interact.

Functional archetypes may include:

- nests,
- perches,
- toys,
- play structures,
- habitat modules,
- decorative environmental objects,
- specialized resting goods.

---

## Economic identity

This family should generally lean toward:

- high routine-material consumption,
- medium-to-long craft time,
- medium-high sale values,
- stronger order/commission demand,
- lower unit turnover,
- strong material-conversion role.

This creates a different economy from premium Elemental Craft.

Elemental Craft converts **scarcity** into value.

Habitat & Enrichment often converts **volume** into value.

---

# 17. STRATEGIC ROLE OF HABITAT & ENRICHMENT

The family is attractive when:

- routine material storage is near capacity,
- a large order is available,
- the player wants to convert abundant inputs,
- a customer segment creates demand,
- a Catchmon or region specializes habitat production.

It helps prevent an economy where excess routine materials become useless.

---

# 18. PRODUCT FAMILY ECONOMIC MATRIX

The following matrix is architectural rather than numeric.

| Family | Craft Tempo | Typical Value | Routine Input | Special Input | Demand | Momentum Role | Player Use |
|---|---|---|---|---|---|---|---|
| Provisions | Fast | Low–Mid | Low–Mid | Low | Broad | Strong builder | Optional later |
| Care & Comfort | Fast–Medium | Mid | Mid | Low | Broad | Stable | Optional later |
| Wearables | Medium | Mid–High | Mid | Low–Mid | Broad/Preference | Balanced | Limited/Optional |
| Field Gear | Medium | Mid–High | Mid–High | Mid | Explorer-focused | Balanced | **Yes** |
| Capture & Discovery | Medium–Long | Mid–High | Mid | Mid–High | Specialized | Selective | **Yes** |
| Elemental Craft | Long | High | Mid | High | Specialized | Premium target | Limited/Optional |
| Habitat & Enrichment | Medium–Long | Mid–High | High | Low–Mid | Order-heavy | Variable | Mostly commercial |

This matrix should guide later numerical balancing.

If future balance makes all seven families occupy the same economic profile, the family architecture has failed.

---

# 19. PRODUCT SUBFAMILIES

Each top-level family may contain subfamilies.

Example structure:

`Product Family → Subfamily → Recipe`

A subfamily exists only when it helps the player understand:

- function,
- station behavior,
- customer preference,
- recipe progression,
- Catchmon synergy.

Do not create subfamilies only to organize database rows.

---

# 20. PRODUCT DATA MODEL — REQUIRED FIELDS

Every final product definition should eventually contain canonical gameplay data.

At minimum:

```text
productId
displayName
family
subfamily
recipeRank
stationType
routineInputs[]
specialInputs[]
craftedInput?          // optional
craftDuration
outputQuantity
baseTransactionValue
displayCategory
demandTags[]
elementAffinity?       // optional
regionAffinity?        // optional
playerUse?             // optional
utilityEffectId?       // optional
masteryProfile
qualityEligible
unlockRequirements
catchmonHooks[]
visualAssetId
```

Exact implementation names may differ.

The important rule is:

> **Product identity, balance, and visuals must resolve from canonical data rather than duplicated hardcoded UI definitions.**

---

# 21. RECIPE INPUT ARCHITECTURE

Recipes must remain readable on mobile.

The system should not become an ingredient spreadsheet.

---

## 21.1 ROUTINE RECIPES

A normal recipe should usually use:

- 1–3 routine material types,
- no special component,
- one station.

This keeps frequent crafting understandable.

---

## 21.2 ADVANCED RECIPES

An advanced recipe may use:

- 2–3 routine material types,
- 1 special component type,
- one station,
- optional progression/Catchmon requirement.

---

## 21.3 APEX / SIGNATURE RECIPES

Selected rare recipes may use:

- multiple routine inputs,
- 1–2 special component types,
- optional crafted component,
- high station capability,
- element/Catchmon requirement.

These should be uncommon.

Apex complexity must remain readable.

---

# 22. MAXIMUM INGREDIENT COMPLEXITY RULE

The normal game should avoid recipes requiring:

> six different small materials + two intermediates + three currencies.

As an architectural rule:

- ordinary recipes should usually show no more than 3 input rows,
- advanced recipes should usually show no more than 4,
- only exceptional signature recipes may exceed this.

Quantity scaling provides economic depth without requiring excessive ingredient variety.

---

# 23. MULTI-STAGE CRAFTING BOUNDARY

Catchmon Shop is a shop-management game.

It is not intended to become a factory-chain simulator.

Therefore:

## Default

Most sellable products are crafted directly from materials.

## Advanced exception

Some recipes may consume **one crafted component**.

## Hard guardrail

Long mandatory chains such as:

`raw → refined A → part B → assembly C → subassembly D → product`

should not become normal gameplay.

The default maximum production dependency depth should be:

> **two crafting steps**

unless a dedicated future system proves that deeper chains create enough value to justify the complexity.

---

# 24. WHY LIMITED CRAFT CHAINS MATTER

Long production chains create:

- invisible bottlenecks,
- queue micromanagement,
- difficulty understanding true value,
- excessive inventory categories,
- frustrating offline stalls.

Limited chains preserve:

- clarity,
- short-session play,
- meaningful station choice,
- high-value advanced crafting without factory-game complexity.

---

# 25. CRAFTED COMPONENTS

If crafted components exist, they are **items**, not currencies.

They should:

- have a clear functional identity,
- be used by multiple related recipes where possible,
- be produced intentionally,
- be visually distinguishable from final merchandise.

They should not exist solely to add one more timer between raw material and product.

---

# 26. PRODUCTION STATION ARCHITECTURE

The seven product families are produced through **five functional station archetypes**.

This is intentionally fewer than the number of product families.

A station can support related production families.

---

# 27. STATION A — PROVISION STATION

**Primary family:** Provisions

Working fantasy:

- kitchen,
- mixing counter,
- preparation counter,
- culinary workshop.

Core role:

- rapid production,
- high turnover,
- frequent completion moments.

This station should remain one of the most active throughout the game.

---

# 28. STATION B — CARE ATELIER

**Primary families:**
- Care & Comfort
- Wearables

Working fantasy:

- textile/care workbench,
- grooming and craft atelier,
- sewing/material station.

Core role:

- reliable medium-frequency production,
- broad commercial stock,
- quality-focused crafting.

---

# 29. STATION C — FIELDWORKS BENCH

**Primary families:**
- Field Gear
- Capture & Discovery Gear

Working fantasy:

- compact technical workshop,
- exploration gear bench,
- precision gadget station.

Core role:

- dual-use products,
- external-world preparation,
- medium/high strategic value.

This station is one of the main bridges between shop and Catchmon acquisition.

---

# 30. STATION D — RESONANCE LAB

**Primary family:** Elemental Craft

Working fantasy:

- magical/technical resonance station,
- elemental precision lab,
- crystal/energy workshop.

Core role:

- premium crafting,
- special-component conversion,
- element-specific production.

The exact visual fantasy will be decided in the Art Direction phase.

---

# 31. STATION E — HABITAT WORKSHOP

**Primary family:** Habitat & Enrichment

Working fantasy:

- larger materials bench,
- habitat fabrication workshop,
- enrichment construction space.

Core role:

- high-volume material conversion,
- larger commissions,
- long-form production.

---

# 32. STATION COUNT GUARDRAIL

Five station archetypes is the initial architecture.

Do not create a new station because one late-game recipe has a different theme.

A new station should only be added if it creates:

- a distinct production decision,
- a distinct capacity bottleneck,
- a distinct visual/fantasy role,
- enough recipes to justify ongoing relevance.

This reduces UI, balancing, building, and asset complexity.

---

# 33. STATION CAPABILITY VS. BUILDING SYSTEM

This document defines **functional production stations**.

Document 08 will decide how they exist physically.

Possible later representations include:

- separate work areas,
- upgradeable modules,
- dedicated rooms,
- larger buildings,
- integrated shop stations.

Do not assume one station archetype automatically equals one standalone building.

---

# 34. STATION CAPABILITY

Each station has a progression state that controls what it can produce.

Conceptually, station capability may affect:

- recipe eligibility,
- queue capacity,
- active production capacity,
- base craft efficiency,
- Catchmon support options.

Exact upgrade levels and costs belong to Documents 08 and 09.

---

# 35. LIMITED CONCURRENT PRODUCTION

Production capacity must remain constrained.

A station should not automatically craft unlimited products in parallel.

The game may later allow:

- additional active slots,
- improved queues,
- parallel copies,
- or additional station capacity.

But these are progression rewards.

---

# 36. CRAFT QUEUE MODEL

The queue exists to remove unnecessary babysitting while preserving prioritization.

Each production slot should conceptually support:

1. one active craft,
2. a limited number of queued crafts behind it.

The exact queue size is a balance/progression variable.

---

# 37. MATERIAL RESERVATION

When a craft is placed into a queue:

> **its required materials are reserved.**

This prevents a queued plan from silently becoming invalid because the same resources were consumed elsewhere.

Reserved materials:

- cannot be double-spent,
- remain visible as committed,
- return if the queued craft is cancelled.

---

# 38. CANCELLATION RULE

The player may cancel a queued or active craft.

Default player-friendly rule:

- reserved/material inputs are returned,
- elapsed crafting time is lost,
- no additional punishment is applied.

Special event/commission exceptions would require explicit design.

The player should not fear experimenting with the production queue.

---

# 39. QUEUE REORDERING

Queued crafts may be reordered before they become active.

This supports:

- responding to customer demand,
- preparing special orders,
- reacting to a new Catchmon opportunity.

Reordering should not require premium resources.

---

# 40. AUTOMATIC QUEUE CONTINUATION

When an active craft finishes:

- the product resolves into protected output/inventory state,
- the next valid queued craft begins automatically.

The game should not require the player to tap “claim” before production can continue.

This is critical for offline progress and reduces administrative interaction.

---

# 41. CRAFT COMPLETION FEEDBACK

Automatic continuation does **not** mean craft completion should feel invisible.

The player should still receive:

- a visible ready/completed state,
- satisfying product presentation,
- quality result if relevant,
- mastery progress,
- goal/order progress.

The system separates:

> **feedback**

from:

> **mandatory claim friction.**

---

# 42. FULL INVENTORY PROTECTION

If product storage is full when a craft completes:

- the product must not be destroyed,
- the result remains in protected station output,
- additional production may pause if necessary,
- the player receives a clear storage warning.

No valuable product should vanish because the player was offline.

---

# 43. CRAFTING FAILURE

Normal crafting does **not** fail.

There is no baseline chance to:

- destroy inputs,
- produce nothing,
- lose a rare component.

Randomness can improve an outcome through quality.

It should not routinely punish crafting.

---

# 44. OUTPUT QUANTITY

Different product families may produce different unit quantities per craft.

Examples structurally:

- durable goods commonly output one unit,
- provisions may output a small batch,
- select small consumables may output multiple units.

Batch size is part of product balance.

The player should always understand:

> inputs → duration → output quantity.

---

# 45. PRODUCT STACKING

Identical products of the same craft quality should stack.

The game should not create individual serialized copies with random stats.

This keeps inventory manageable.

---

# 46. NO RANDOM AFFIX SYSTEM

Products should not roll random:

- attack stats,
- defense stats,
- modifier prefixes,
- suffixes,
- dozens of procedural properties.

Catchmon Shop is not an equipment-loot RPG.

Product differentiation should come from:

- recipe identity,
- family,
- element,
- utility,
- craft quality,
- mastery,
- customer demand.

---

# 47. RECIPE PROGRESSION ARCHITECTURE

Recipes should not exist as one giant flat list.

Each product family has a **progression graph**.

The graph contains:

- core recipes,
- branch recipes,
- advanced recipes,
- element-aligned recipes,
- signature recipes.

This creates more structure than a simple Tier 1 → Tier 2 → Tier 3 line.

---

# 48. CORE RECIPES

Core recipes establish a family's basic economic behavior.

They should be:

- easy to understand,
- broadly useful,
- based mostly on routine materials,
- part of normal shop operation.

Each family should retain relevant core-line products throughout progression.

---

# 49. BRANCH RECIPES

Branch recipes introduce different economic strategies inside a family.

Example roles:

- faster / lower value,
- slower / higher value,
- lower material use,
- higher Momentum suitability,
- better special-order demand,
- stronger element interaction.

A branch should represent a choice of **economic shape**, not merely another visual skin.

---

# 50. ADVANCED RECIPES

Advanced recipes increase:

- value,
- specialization,
- input complexity,
- special-component use,
- customer targeting.

They should still connect to the family's established identity.

---

# 51. ELEMENT-ALIGNED RECIPES

Element-aligned recipes connect product content to the Catchmon/world structure.

They may require:

- element-associated materials,
- region access,
- an appropriate Catchmon capability,
- station progression.

They may influence:

- demand,
- premium value,
- special customer interest,
- expedition utility,
- Catchmon synergy.

---

# 52. SIGNATURE RECIPES

Signature recipes are rare, memorable crafts connected to:

- a Catchmon or Catchmon line,
- a world/region,
- a special discovery,
- a major progression milestone,
- a rare customer/order.

Signature does **not** mean:

> every one of the 104 Catchmons automatically needs a unique product.

Signature recipes must be curated around meaningful gameplay.

This protects content and asset scope.

---

# 53. NO AUTOMATIC 17×7 CONTENT MULTIPLICATION

The game has many elemental/world identities.

The project must not automatically create:

`17 elements × 7 families × several tiers`

as mandatory unique content.

That creates hundreds of low-value recolors.

Instead:

> **each region/element introduces a curated set of recipes where that element creates a meaningful fantasy or mechanic.**

A region may contribute strongly to two or three families and barely touch others.

This makes regions feel distinct.

---

# 54. RECIPE RANKS

Recipes need a broad progression indicator for:

- unlock ordering,
- station eligibility,
- balancing,
- customer demand.

Working term:

# **RECIPE RANK**

Recipe Rank is not the same as rarity or quality.

It represents approximate production sophistication/progression.

Exact rank count is not locked here.

---

# 55. RECIPE RANK DOES NOT DETERMINE EVERYTHING

A higher-rank recipe is generally more advanced.

However:

- it should not automatically have the best profit per minute,
- it should not make lower-rank products unsellable,
- it may require scarcer materials,
- it may be better suited to premium transactions,
- it may occupy a different strategic niche.

This preserves catalog relevance.

---

# 56. RECIPE UNLOCK METHODS

Recipes can become available through several structural mechanisms.

Use a limited mix.

---

## A. SHOP PROGRESSION

The shop reaches a required capability/progression milestone.

Best for:

- core recipes,
- normal family expansion.

---

## B. STATION CAPABILITY

The relevant station becomes capable of producing the recipe.

Best for:

- advanced production.

---

## C. RECIPE MASTERY

Mastering a prerequisite recipe reveals or qualifies the next branch.

Best for:

- craftsmanship progression.

---

## D. REGION / WORLD DISCOVERY

The player reaches a world or discovers its production knowledge/materials.

Best for:

- element-aligned recipes.

---

## E. CATCHMON CAPABILITY

A Catchmon or Catchmon capability enables a specific recipe or branch.

Best for:

- collection/shop integration.

---

## F. SPECIAL DISCOVERY / ORDER

A rare event, customer, expedition, or progression milestone reveals a signature recipe.

Best for:

- memorable content.

---

# 57. RECIPE UNLOCK CURRENCY RULE

Do not introduce a universal “Blueprint Currency” by default.

Recipe unlocks may use:

- progression state,
- Coins,
- mastery,
- discrete discoveries,
- region access,
- Catchmon access.

If fragments or plans later exist, they should be actual content objects with a clear source/use rather than another generic currency.

---

# 58. BUYING AN UNLOCK

Some recipes may require Coins once their conditions are satisfied.

This creates investment competition.

The sequence becomes:

> qualify for recipe → decide whether it is worth purchasing now.

Not every recipe needs a Coin purchase.

Free milestone unlocks help maintain pacing.

---

# 59. RECIPE MASTERY — PURPOSE

Repeated crafting should have long-term value.

Working system:

# **RECIPE MASTERY**

Mastery is a progression meter attached to a recipe.

It is **not a spendable currency**.

The purposes of Mastery are:

- reward use of favorite recipes,
- make old recipes improve over time,
- support recipe progression,
- create collection-like craftsmanship goals,
- improve crafting satisfaction.

---

# 60. MASTERY STRUCTURE

Each recipe progresses through a small number of clear mastery milestones.

Recommended initial architecture:

### KNOWN

Recipe unlocked.

### PRACTICED

First mastery milestone.

### REFINED

Second mastery milestone.

### MASTERED

Final standard mastery milestone.

Exact naming can change.

The important rule is:

> **few meaningful milestones, not a 100-level bar per recipe.**

---

# 61. MASTERY PROGRESS

Mastery progress is earned primarily by crafting the recipe.

Potential modifiers may include:

- special order completion,
- high-quality output,
- Catchmon specialization.

Exact formulas are deferred.

The basic behavior must remain understandable:

> craft recipe → become better at recipe.

---

# 62. MASTERY REWARDS — ARCHITECTURAL PROFILE

Mastery rewards should use a consistent profile.

A possible structure:

## PRACTICED

Improves **production tempo**.

Example class:
- reduced craft duration.

## REFINED

Improves **crafting outcome**.

Example class:
- improved Fine/Masterwork probability,
- modest routine-material efficiency,
- family-specific efficiency.

## MASTERED

Provides a **structural reward**.

Examples:
- qualifies for an advanced branch,
- unlocks special order eligibility,
- unlocks signature interaction,
- improves final product identity.

Exact values and which reward belongs to each family can be balanced later.

The key is that mastery should not be only three small percentage bonuses.

---

# 63. MASTERY DOES NOT REQUIRE EVERY RECIPE

Progression should never require the player to master the entire catalog before advancing.

Mastery should:

- reward depth,
- unlock selected branches,
- create optional long-term goals.

Mandatory mastery chains should remain short and visible.

---

# 64. FAMILY MASTERY

A later system may also track broad family mastery.

This remains **open**.

If implemented, family mastery should summarize sustained specialization without creating a new spendable currency.

Document 09 may own this.

---

# 65. CRAFT QUALITY — DECISION

Craft quality **is part of the intended system**, but it should unlock after the player understands basic crafting.

It must remain lightweight.

Working grades:

1. **STANDARD**
2. **FINE**
3. **MASTERWORK**

Final names can change.

---

# 66. WHY QUALITY EXISTS

Quality adds:

- excitement to craft completion,
- premium inventory moments,
- value to mastery,
- value to Catchmon specialization,
- special-customer targeting,
- reasons to keep crafting known recipes.

It creates positive variance without craft failure.

---

# 67. QUALITY PRINCIPLES

Quality should:

- never produce worse than Standard,
- use only a few grades,
- remain easy to recognize,
- modify value meaningfully but not absurdly,
- avoid random stat affixes,
- not require a unique item icon for every grade,
- be influenced by understandable systems.

---

# 68. QUALITY SOURCES

Quality probability may eventually be influenced by:

- recipe mastery,
- station capability,
- Catchmon support,
- special temporary effects,
- selected ingredients.

Exact formula is deferred.

The player should be able to understand why their quality chance improved.

---

# 69. QUALITY ECONOMIC ROLE

Fine and Masterwork products may:

- sell for more Coins,
- be especially attractive to special customers,
- complete premium orders,
- gain more Momentum efficiency in selected contexts,
- provide stronger player-use utility if appropriate.

Quality should not multiply every reward system simultaneously.

---

# 70. QUALITY INVENTORY HANDLING

Different quality grades are separate inventory sub-stacks of the same product.

They reuse:

- the same base product icon,
- the same product identity.

Quality is communicated through:

- frame,
- treatment,
- badge,
- subtle effect.

This prevents asset multiplication.

---

# 71. QUALITY ASSET RULE

Do **not** generate three separate full item illustrations for:

- Standard,
- Fine,
- Masterwork.

Create one canonical product asset.

Quality presentation belongs to reusable UI treatment.

This rule is important for later asset planning.

---

# 72. QUALITY RNG PROTECTION

Because quality is a bonus rather than a progression gate:

- bad quality luck should not block normal progression,
- Standard items remain economically useful,
- rare Masterwork requirements should be optional or protected.

If a required objective needs quality, later systems should provide a deterministic or pity route.

---

# 73. NO ITEM BREAKING

Products do not randomly break during:

- crafting,
- sales,
- display.

If player-use gear later has consumption/durability, that is a separate utility-system decision.

Commercial inventory does not need an equipment degradation economy.

---

# 74. CRAFT TEMPO ARCHITECTURE

Crafting should span multiple time horizons.

The game needs:

- frequent completions,
- medium planning,
- offline-return crafts,
- rare long crafts.

However, progression must not simply make every craft longer.

---

# 75. CRAFT DURATION BANDS

Exact values are a later balance task.

Conceptually, recipes occupy bands:

### QUICK

Supports active play and frequent shop restocking.

### SHORT

Completes during a normal engaged session.

### MEDIUM

Supports session-to-session planning.

### LONG

Creates an offline return hook.

### SPECIAL

Reserved for premium/signature crafts and major preparation.

A family may contain several bands.

---

# 76. LATE-GAME SHORT-CRAFT RULE

Every major progression phase should retain some useful QUICK/SHORT recipes.

Late game must not become:

> “Every worthwhile craft now takes six hours.”

Higher progression should add long premium opportunities **alongside** active-cycle recipes.

This protects the 10- and 30-minute session loops defined in Document 02.

---

# 77. CRAFT TIME VS. VALUE

Longer craft time can justify higher total value.

But it should not always guarantee higher value per production minute.

A long recipe may be attractive because:

- it uses rare components,
- it enables a premium sale,
- it works well offline,
- it fulfills an order,
- it benefits from a Catchmon,
- it converts material overflow.

Short recipes remain viable for turnover and Momentum.

---

# 78. CRAFT TIME COMPRESSION

Production speed bonuses must be controlled.

Possible sources:

- mastery,
- station progression,
- Catchmon support,
- Shop Momentum Workshop Push.

Multiple sources must not reduce long crafts to near-zero duration through uncontrolled multiplication.

Later balancing should define:

- additive/multiplicative categories,
- minimum craft-time floors,
- diminishing behavior where needed.

---

# 79. SHOP MOMENTUM → WORKSHOP PUSH

Document 02 reserves a Momentum-based production interaction.

Document 04 defines its function:

# **WORKSHOP PUSH**

The player can spend Shop Momentum to advance one active craft.

Purpose:

- connect active selling directly back into production,
- let engaged players smooth short-term bottlenecks,
- create another decision for Momentum.

---

# 80. WORKSHOP PUSH RULES

Workshop Push should:

- target one active craft/station,
- visibly reduce remaining production time,
- use a bounded effect,
- be useful across multiple craft durations,
- never become the main way all products are manufactured.

Exact Momentum cost and time reduction are balancing variables.

---

# 81. WORKSHOP PUSH ANTI-SPAM

The system should avoid:

> sell tiny items → spam 30 pushes → instantly finish a multi-hour premium craft.

Possible balancing tools include:

- Momentum cap,
- cost scaling,
- craft-duration-dependent efficiency,
- per-craft push limits,
- diminishing effect.

The final formula is deferred.

---

# 82. DUAL-USE PRODUCT ARCHITECTURE

Some crafted goods have value outside customer sale.

This is a major Catchmon Shop differentiator.

Working output classes:

## COMMERCIAL

Primarily made to sell.

## DUAL-USE

Can be sold or used by the player in another system.

## COMMISSION

Produced primarily for an order/specific recipient.

## CRAFTED COMPONENT

Used in another recipe.

Most products should remain Commercial.

Dual-use products should be strategically important but controlled.

---

# 83. SELL-VS-USE DECISION

For a dual-use item, the player should understand:

### Sell
Gain immediate Coins and potentially Momentum.

### Use
Gain external opportunity/value.

This creates meaningful opportunity cost without another abstract currency.

---

# 84. DUAL-USE BALANCE RULE

Player use must be attractive enough that it is a real choice.

But if utility value is always vastly greater than sale value:

> nobody sells the item.

If sale value is always vastly greater:

> nobody uses it.

Later economy simulations must estimate both values.

---

# 85. PRODUCTION FAMILY ↔ CUSTOMER HOOKS

Document 05 will own customer behavior.

Document 04 reserves demand tags on products.

Products can carry tags such as:

- everyday,
- explorer,
- collector,
- premium,
- habitat,
- care,
- element affinity,
- region affinity,
- special order.

Customers should react to these tags.

Product tags must come from canonical product data.

---

# 86. DISPLAY IDENTITY

Each family should have a recognizable visual merchandising identity.

This matters because displayed products influence demand.

The player should learn visually:

> “This part of my shop is stocked for explorers.”

or:

> “I am preparing premium elemental merchandise.”

The exact shelving/display system belongs to Documents 05, 08, and 11.

---

# 87. DISPLAY FOOTPRINT BOUNDARY

The project should **not** initially assign complex physical sizes to every item.

Avoid inventory Tetris.

Habitat products may visually feel larger, but the core display system should begin with simple slot/category logic.

Physical footprint complexity requires separate proof before introduction.

---

# 88. CATCHMON INTEGRATION — CRAFTING HOOKS

Document 06 will map the 104 Catchmons.

This document defines the allowed crafting-effect families.

A Catchmon may influence crafting through one or more of the following hooks.

---

# 89. HOOK A — STATION SPECIALIST

The Catchmon improves a station or part of its production behavior.

Examples of effect classes:

- tempo,
- routine efficiency,
- quality,
- queue utility.

This should be targeted rather than universal.

---

# 90. HOOK B — FAMILY SPECIALIST

The Catchmon improves one product family.

Example:

> stronger at Field Gear than at all crafting.

This encourages roster choice.

---

# 91. HOOK C — ELEMENT SPECIALIST

The Catchmon interacts with recipes sharing its element or a designed affinity.

Element semantics must use the established Catchmon element system.

---

# 92. HOOK D — RECIPE ENABLER

The Catchmon unlocks or enables a recipe/branch.

This is a high-value structural effect.

It should be used selectively.

---

# 93. HOOK E — INPUT TRANSFORMER

The Catchmon changes material economics.

Examples:

- substitutes part of one routine input,
- improves yield from one material family,
- reduces a specific bottleneck.

This can create more strategy than a generic speed bonus.

---

# 94. HOOK F — QUALITY CATALYST

The Catchmon increases the chance of Fine/Masterwork output in a targeted context.

Good for craftsmanship-focused Catchmons.

---

# 95. HOOK G — SIGNATURE INTERACTION

A Catchmon enables a unique or rare crafting behavior.

Examples:

- signature recipe,
- alternate output,
- unusual element combination,
- family transformation.

These should be memorable and rare.

---

# 96. CATCHMON EFFECT PRIORITY

When designing the 104 Catchmons later, prefer this hierarchy:

1. **new possibility**
2. **changed strategy**
3. **targeted optimization**
4. **generic percentage bonus**

Generic modifiers remain useful for balance.

They should not define the whole collection.

---

# 97. NO CONSTANT REASSIGNMENT

A player should not feel compelled to move Catchmons between stations before every craft.

Catchmon assignment should usually be:

- strategic,
- medium-duration,
- persistent until changed.

A small number of important reassignment decisions is preferable to craft-by-craft micromanagement.

---

# 98. CATCHMON SUPPORT CAPACITY

Production stations must expose a **Catchmon Support Hook**.

The exact number of assigned Catchmons per station is not locked here.

Document 06/08 will define:

- assignment capacity,
- role slots,
- whether multiple Catchmons cooperate,
- how synergies work.

---

# 99. ELEMENT INTEGRATION

Products may be:

## NEUTRAL

No element affinity.

## ELEMENT-ALIGNED

Associated with one element.

## RARE HYBRID

Associated with a meaningful designed combination.

Hybrid content should be uncommon and intentional.

---

# 100. ELEMENT COLOR RULE

When elemental recipes are visualized later:

- use the authoritative existing element color for that element,
- do not invent alternative element palettes,
- do not borrow another element color for visual variety.

Element tagging must be semantic, not decorative.

---

# 101. ELEMENTAL RECIPE PURPOSE

An element tag should affect at least one meaningful system:

- ingredient source,
- Catchmon affinity,
- customer demand,
- region unlock,
- player utility,
- special order,
- recipe behavior.

If an element tag changes only icon color, the recipe likely does not deserve to exist.

---

# 102. REGION CONTENT PACKAGE

Each future region/world should introduce a **curated crafting package** rather than a complete reskin of the catalog.

A region package may contain:

- selected new routine/special materials,
- 2–4 meaningful new recipes,
- one product-family emphasis,
- one or more Catchmon crafting hooks,
- optional signature content.

Exact counts remain tuning targets, not hard requirements.

---

# 103. REGION FAMILY EMPHASIS

Different regions should favor different product families.

For example structurally:

- one region may strongly support Provisions + Habitat,
- another Field Gear + Elemental Craft,
- another Wearables + Capture Gear.

This helps regions feel economically distinct.

---

# 104. CROSS-REGION RELEVANCE

A region's recipes should remain usable outside that region.

The game should not create isolated mini-economies where every world invalidates the previous one.

Later content can use:

- cross-region orders,
- customer preferences,
- hybrid recipes,
- mastery,
- Catchmon synergies.

---

# 105. PRODUCT PROGRESSION WITHOUT OBSOLESCENCE

Older products need not remain equally profitable forever.

They should remain **situationally useful**.

Possible reasons:

- fast craft time,
- low material cost,
- favorable-deal efficiency,
- order demand,
- mastery,
- Catchmon synergy,
- customer preference,
- ingredient availability.

This preserves catalog depth.

---

# 106. NO UNIVERSAL “BEST RECIPE”

The system should be considered unhealthy if one product is simultaneously:

- best Coins per minute,
- best Coins per material,
- best Momentum use,
- easiest to sell,
- easiest to craft,
- best mastery progress,
- best order product.

Recipe roles must intentionally trade strengths.

---

# 107. PRODUCT ROLE TAGS

For balance and design review, each product should have one or more internal role tags.

Possible internal roles:

- TURNOVER
- MOMENTUM_BUILDER
- BALANCED
- PREMIUM_TARGET
- MATERIAL_SINK
- SPECIAL_COMPONENT_CONVERTER
- ORDER_FOCUSED
- DUAL_USE_EXPEDITION
- DUAL_USE_CAPTURE
- QUALITY_TARGET
- ELEMENT_SPECIALIST
- MASTERY_BRIDGE

These are internal design tags.

They do not necessarily appear to players.

---

# 108. ROLE COVERAGE RULE

Every progression band should provide multiple product roles.

Do not create:

- early game = only fast products,
- late game = only premium slow products.

The player needs a portfolio at every stage.

---

# 109. CUSTOMER VALUE VS. CRAFT VALUE

A product can be economically attractive for different reasons.

Examples:

### High craft efficiency
Good to produce.

### High customer compatibility
Easy to sell.

### High Premium Pitch efficiency
Good Momentum target.

### Strong special-order demand
Good objective product.

### Strong player-use value
Good to keep.

This multi-dimensional value prevents solved production.

---

# 110. RECIPE MASTER LIST REQUIREMENT

Once exact products are designed, maintain one canonical recipe registry/table.

It should contain:

- all product IDs,
- product family,
- station,
- progression rank,
- inputs,
- outputs,
- unlock rules,
- base values,
- craft duration,
- mastery profile,
- quality eligibility,
- demand tags,
- player utility,
- asset reference.

Do not maintain separate contradictory spreadsheets and code lists.

---

# 111. PRODUCT NAMING RULE — FUTURE

Final product names should communicate enough function that the player can learn the catalog.

Naming can be imaginative, but should not become opaque.

A useful pattern is:

> fantasy identity + understandable object/function

The naming system will be defined when actual item content is generated.

---

# 112. PRODUCT ICON RULE — FUTURE

Each unique product should normally have:

- one canonical item icon,
- transparent background,
- readable silhouette,
- consistent perspective/light,
- no quality-specific duplicate illustration.

Elemental variants only require distinct icons if the product is actually a distinct recipe/item.

Do not mass-generate icons yet.

---

# 113. PRODUCT VISUAL SILHOUETTE

Later art direction should ensure families remain distinguishable at small sizes.

Examples of visual tendencies:

- Provisions → containers/food silhouettes,
- Wearables → wearable form,
- Field Gear → practical tool/device,
- Elemental Craft → premium focal shape,
- Habitat → larger playful/home form.

Exact visual language belongs to Document 12.

---

# 114. CONTENT VOLUME DISCIPLINE

The system needs enough content to sustain progression.

It does not need hundreds of products immediately.

Development should scale through proven content stages.

---

# 115. PROTOTYPE CONTENT TARGET

For the smallest core-loop prototype:

- 3 product families represented,
- 2 production stations,
- 5 total recipes,
- 2 routine materials,
- 1 special component,
- at least:
  - one fast-turnover product,
  - one balanced product,
  - one premium product,
  - one dual-use product.

The prototype validates roles, not catalog breadth.

---

# 116. VERTICAL SLICE CONTENT TARGET

A polished vertical slice should aim for approximately:

- all 7 top-level families represented,
- 4–5 station archetypes,
- 18–28 unique products,
- several recipe ranks,
- one complete region/element content package,
- at least one signature recipe,
- several dual-use products,
- Mastery active on a subset,
- craft quality active.

This is enough to test whether the architecture scales.

---

# 117. INITIAL FULL CONTENT ENVELOPE

Before live expansion, a reasonable planning envelope is:

- approximately **70–100 distinct products**,
- distributed across all seven families,
- including neutral, region-aligned, advanced, and curated signature content.

This is a **scope envelope**, not a locked final count.

The project should only exceed it when playtesting proves additional catalog breadth adds meaningful strategy.

---

# 118. SIGNATURE CONTENT LIMIT

Do not plan 104 unique signature product icons solely because 104 Catchmons exist.

Catchmons can become meaningful through:

- station effects,
- recipe-family effects,
- resource effects,
- quality,
- synergies,
- discovery,
- player utility.

Signature recipes are only one tool.

This saves large amounts of design and art work.

---

# 119. CONTENT ADDITION TEST

Before adding a new product, answer:

1. Which family does it belong to?
2. What economic role does it fill?
3. What makes it different from an existing recipe?
4. Which inputs does it make relevant?
5. Which customers or goals care about it?
6. Does a Catchmon/element/region interact with it?
7. Why does it need a unique icon?
8. Does it increase meaningful choice or only catalog size?

If these cannot be answered, the product should not yet be added.

---

# 120. MASTERWORK / QUALITY CONTENT TEST

A new product should not exist solely because the team wants a more impressive high-tier visual.

If the only difference is:

> same recipe role, bigger value, longer timer,

consider improving an existing product progression branch instead.

---

# 121. SPECIAL ORDER CRAFTS

Some recipes may exist primarily for orders/commissions.

These can add variety without permanently occupying normal display demand.

Rules:

- commission recipes should be clearly marked,
- they should not flood the normal catalog,
- they should reuse existing material logic where possible,
- they may create unusual family combinations.

Document 05 will define order systems.

---

# 122. LIMITED-TIME RECIPES

Event/live recipes are outside core scope.

If added later:

- they should use the same recipe data model,
- they should not require a separate crafting engine,
- they should avoid permanently breaking base economy balance.

Core architecture must not depend on them.

---

# 123. RECIPE DISCOVERY EXPERIENCE

Unlocking a recipe should feel like obtaining a new economic possibility.

The reveal should communicate:

- what family it belongs to,
- what station uses it,
- what it is good for,
- key materials,
- how it changes the player's options.

The player should not receive five new recipes at once without context.

---

# 124. RECIPE PREVIEW

Before purchasing/unlocking an available recipe, the player should be able to preview enough information to make an investment decision.

At minimum:

- family,
- station,
- approximate value,
- craft duration,
- main inputs,
- special requirement,
- utility role.

No blind recipe purchases.

---

# 125. CRAFTING UI INFORMATION HIERARCHY

Detailed UI belongs to Document 11.

Crafting architecture requires each recipe card/entry to prioritize:

1. product identity,
2. can/cannot craft,
3. required inputs,
4. duration,
5. output,
6. economic/utility role,
7. mastery/quality where relevant.

Avoid showing twelve secondary stats in the main crafting choice.

---

# 126. “CAN CRAFT” CLARITY

The player should quickly understand why a recipe cannot start.

Potential blocking states:

- insufficient routine material,
- missing special component,
- station requirement,
- recipe locked,
- Catchmon requirement,
- queue/capacity full.

The UI should identify the primary blocker directly.

---

# 127. FAVORITES / PINNING

As catalog size grows, players should eventually be able to:

- favorite recipes,
- pin frequent crafts,
- access recent crafts,
- filter by family/role.

These are UX requirements for later stages.

---

# 128. SMART CRAFTING FILTERS

Potential later filters:

- can craft now,
- family,
- element,
- duration,
- demand,
- order needed,
- player-use,
- mastery incomplete,
- Catchmon boosted.

Filtering should derive from canonical recipe data.

---

# 129. CRAFTING AND ORDERS

Orders should be allowed to change production priorities.

The crafting UI should eventually surface:

> this product is currently needed for an order.

This gives recipes temporary situational value.

---

# 130. CRAFTING AND DISPLAY STOCK

The player should eventually be able to see stock context while choosing a craft.

Useful context:

- inventory amount,
- displayed amount,
- current demand signal.

This closes the decision loop:

> production ↔ stock ↔ customer.

---

# 131. CRAFTING AND CATCHMON STATUS

When a Catchmon materially changes a recipe, the effect should be visible at decision time.

The player should not need to remember hidden passive modifiers.

Example information concept:

> “Boosted by assigned Catchmon.”

Exact UI later.

---

# 132. CRAFTING AND MATERIAL FORECASTING

The game may later show:

- what material will become the next bottleneck,
- how long until replenishment,
- whether queued crafts have reserved materials.

This supports planning without spreadsheet work.

---

# 133. NO FALSE PRECISION REQUIREMENT

The UI does not need to show advanced internal shadow values or mathematical efficiency scores to normal players.

Those belong to balancing tools.

Players should learn strategic differences through readable product roles and outcomes.

---

# 134. PRODUCTION AUDIO/VISUAL FEEDBACK — FUTURE REQUIREMENT

Each station family should eventually feel active through:

- motion,
- small process animations,
- sound,
- Catchmon presence,
- completion feedback.

The shop should visually communicate production.

Exact effects belong to the art/motion phase and must reuse authoritative motion tokens where applicable.

---

# 135. CATCHMON VISIBILITY AT STATIONS

If a Catchmon is assigned to production support, it should ideally be visible or represented near that station.

This reinforces:

> the Catchmon is doing something,

instead of:

> a portrait in a hidden menu gives +8%.

The exact 3D/2D representation is later.

---

# 136. CRAFTING ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — HIGHEST RANK ALWAYS WINS

If all lower products become irrational immediately after unlocking a new rank, catalog depth collapses.

---

## ANTI-PATTERN B — SEVEN FAMILIES, SAME ECONOMY

If every family has the same:

- duration,
- value,
- resource cost,
- demand,

the family system is cosmetic.

---

## ANTI-PATTERN C — 17 ELEMENT RECOLORS

Creating every recipe in every element without functional difference creates asset bloat, not content.

---

## ANTI-PATTERN D — FACTORY CHAIN CREEP

If advanced crafting requires multiple layers of intermediates and constant queue coordination, the game loses its mobile shop focus.

---

## ANTI-PATTERN E — QUALITY CLUTTER

If quality creates five grades, random affixes, separate icons, and excessive inventory fragmentation, it has exceeded its purpose.

---

## ANTI-PATTERN F — MASTERY GRIND WALL

If progression requires hundreds of repetitions of every recipe, mastery becomes chore content.

---

## ANTI-PATTERN G — CATCHMON SWAP MACRO

If optimal crafting requires changing Catchmon assignment before every queue action, the collection system creates friction.

---

## ANTI-PATTERN H — DUAL-USE FAKE CHOICE

If a dual-use item is always obviously better to sell or always obviously better to consume, its strategic role failed.

---

## ANTI-PATTERN I — LONG-TIMER LATE GAME

If late progression eliminates short useful crafts, active sessions collapse.

---

## ANTI-PATTERN J — CLAIM BUTTON FACTORY

If every craft requires manual claiming to keep the queue moving, offline/mobile convenience is damaged.

---

## ANTI-PATTERN K — CONTENT BEFORE ROLE

If a new item exists because its icon looks cool but has no distinct economic function, asset creation is driving design backward.

---

# 137. CRAFTING PROTOTYPE — REQUIRED CONTENT

The first prototype should include five recipes with intentionally different roles.

Conceptual set:

### Product A
Fast provision.
- quick craft,
- cheap,
- broad demand,
- good Momentum builder.

### Product B
Reliable care product.
- balanced craft,
- balanced value.

### Product C
Wearable or field product.
- medium duration,
- higher value,
- good standard sale.

### Product D
Dual-use discovery/field tool.
- sell or consume externally.

### Product E
Premium elemental craft.
- special component,
- long craft,
- high Premium Pitch value.

Do not spend time finalizing names/art during first engine validation.

---

# 138. PROTOTYPE STATIONS

Prototype needs only:

- Provision Station,
- one combined Workshop representing later Care/Field/Element functionality.

The five final station archetypes do not need implementation before core-loop validation.

---

# 139. PROTOTYPE MASTERY

Prototype Mastery can be simplified to:

- one recipe reaches one visible milestone,
- milestone reduces craft time or improves quality.

The test is:

> does repeated crafting feel meaningfully rewarding?

---

# 140. PROTOTYPE QUALITY

Prototype quality needs only:

- Standard,
- one improved grade.

Full three-grade system can follow after base crafting proves fun.

---

# 141. PROTOTYPE DUAL-USE TEST

At least one crafted item must present:

> sell now vs. use for external opportunity.

The test should observe which side players choose and why.

---

# 142. PROTOTYPE METRICS

Track:

- recipe chosen per station,
- repeat-craft frequency,
- stock by family,
- craft cancellations,
- queue utilization,
- craft idle time,
- material bottlenecks,
- product sale rate,
- quality outcomes,
- mastery progression,
- sell-vs-use rate,
- Workshop Push usage,
- Catchmon-influenced recipe selection.

---

# 143. VERTICAL SLICE QUESTIONS

Before expanding to 70–100 products, verify:

1. Can players explain the difference between the seven families?
2. Do they use more than one family voluntarily?
3. Do short and long crafts coexist well?
4. Does the queue reduce friction?
5. Do product roles create real decisions?
6. Does quality add excitement without clutter?
7. Does mastery make known recipes more interesting?
8. Does dual-use create actual tension?
9. Are element recipes meaningfully different?
10. Does at least one Catchmon change production strategy?
11. Does active selling meaningfully feed Workshop Push?
12. Does the system still work in a two-minute session?
13. Can the player understand why they are crafting something?

If several answers are “no,” do not solve the problem by adding more recipes.

---

# 144. PRODUCT CONTENT DEVELOPMENT PIPELINE

Once architecture is validated, detailed product content should be created in this order:

### STEP 1 — DEFINE ROLE SLOT

Example:
- Provisions / Momentum Builder / Rank X.

### STEP 2 — DEFINE ECONOMIC PROFILE

Determine:
- duration band,
- value band,
- input intensity,
- demand role,
- utility role.

### STEP 3 — DEFINE WORLD/FANTASY FUNCTION

What is the object actually for?

### STEP 4 — DEFINE INPUT LOGIC

Which material families make sense?

### STEP 5 — DEFINE CATCHMON / ELEMENT HOOK

Only where meaningful.

### STEP 6 — NAME PRODUCT

Naming follows function.

### STEP 7 — WRITE VISUAL ASSET BRIEF

Only now should icon generation begin.

This order is mandatory for high-volume content.

---

# 145. ASSET BRIEF FIELDS — FUTURE

Each product icon brief should eventually derive from structured data.

Suggested fields:

```text
productId
productName
family
subfamily
objectFunction
shapeLanguage
primaryMaterial
secondaryMaterial
elementAffinity
rarity/prestigeContext
iconPerspective
requiredReadableFeatures
forbiddenVisualConfusions
assetFilename
```

Art style fields will be supplied by Document 12/13.

---

# 146. NO ICON GENERATION YET

Document 04 establishes what kinds of product assets will eventually exist.

It does **not** authorize mass icon production yet.

Before icon generation, the project still needs:

- Document 05 Customer & Selling,
- Document 06 Catchmon Integration,
- Document 07 Acquisition & Expeditions,
- Document 08 Shop Infrastructure,
- Document 09 Progression,
- Document 10 World/Element mapping,
- Document 12 Art Direction,
- Document 13 Asset Taxonomy.

This prevents expensive visual rework.

---

# 147. EXTERNAL REFERENCE BOUNDARY

Contemporary shop-crafting games demonstrate that a crafting loop can remain extensible through:

- categorized recipe lines,
- escalating resource requirements,
- special high-tier materials,
- production-time tradeoffs,
- mastery/progression around recipes.

Catchmon Shop uses those high-level lessons only.

It deliberately avoids copying:

- another game's item categories,
- exact tier counts,
- worker structure,
- item names,
- recipes,
- numbers,
- quality nomenclature,
- UI presentation.

The product universe and mechanical roles in this document are Catchmon-native.

---

# 148. LOCKED DECISIONS FROM DOCUMENT 04

The following decisions are considered part of the intended Crafting & Product System unless deliberately revised:

1. Catchmon Shop uses a Catchmon-native product universe rather than fantasy weapons/armor as the core catalog.
2. The initial architecture contains seven top-level product families:
   - Provisions,
   - Care & Comfort,
   - Wearables,
   - Field Gear,
   - Capture & Discovery Gear,
   - Elemental Craft,
   - Habitat & Enrichment.
3. Each product family has a distinct economic/job identity.
4. Provisions are the primary fast-turnover / Momentum-building family.
5. Care & Comfort provides stable everyday commercial demand.
6. Wearables provide balanced value and strong quality/element specialization potential.
7. Field Gear is a core dual-use expedition family.
8. Capture & Discovery Gear is a core dual-use collection/capture family.
9. Elemental Craft is the primary premium/special-component family.
10. Habitat & Enrichment is a high-routine-material / order-oriented conversion family.
11. The seven product families map to five functional production station archetypes:
    - Provision Station,
    - Care Atelier,
    - Fieldworks Bench,
    - Resonance Lab,
    - Habitat Workshop.
12. Station archetype does not automatically equal physical standalone building.
13. Production remains capacity-constrained.
14. Stations support limited queues.
15. Materials are reserved when a craft is queued.
16. Cancelling a craft returns materials; elapsed time is lost.
17. Queued crafts may be reordered.
18. Queues continue automatically after craft completion.
19. Manual claim is not required to let the next queued craft begin.
20. Completed items are protected from destruction when product storage is full.
21. Normal crafting has no failure/destruction chance.
22. Identical products of identical quality stack.
23. Products do not use random RPG affixes.
24. Most recipes craft directly from materials.
25. Advanced recipes may use one crafted intermediate.
26. Normal production dependency depth should not exceed two crafting steps.
27. Ordinary recipes usually use 1–3 input types.
28. Advanced recipes usually use no more than four visible input rows.
29. Recipe progression is a graph containing core, branch, advanced, element-aligned, and signature recipes.
30. Higher Recipe Rank does not automatically invalidate lower-rank products.
31. Elemental content is curated rather than generated as 17 variants of every product.
32. Signature recipes are curated and are not required one-per-Catchmon.
33. Recipe unlocks may come from shop progress, station capability, mastery, region discovery, Catchmon capability, or special discovery.
34. A generic blueprint currency is not required by default.
35. Recipe Mastery is a non-spendable progression meter.
36. Mastery uses a small number of meaningful milestones rather than a large level grind.
37. Mastery may unlock structural recipe progression.
38. Craft Quality is part of the intended system but should unlock after basic crafting is understood.
39. The intended quality structure is lightweight: Standard / Fine / Masterwork as working grades.
40. Quality never produces worse-than-standard results.
41. Quality does not introduce random stat affixes.
42. One canonical product illustration is reused across quality grades.
43. Quality is communicated through reusable UI treatment.
44. Useful quick/short recipes remain available in later progression.
45. Late game must not consist exclusively of long craft timers.
46. Shop Momentum can be spent on **Workshop Push** to advance an active craft.
47. Workshop Push is bounded and cannot become the primary manufacturing method.
48. Dual-use goods create a deliberate sell-vs-use decision.
49. Catchmon crafting effects should prioritize new possibilities and strategy changes over generic percentages.
50. Catchmon assignment should be persistent enough to avoid craft-by-craft reassignment.
51. Products may be Neutral, Element-Aligned, or rarely Hybrid.
52. Element tags must have mechanical/semantic meaning.
53. Each region/world should introduce a curated crafting package rather than a full catalog reskin.
54. Older products should retain situational usefulness.
55. Internal product-role tags should guide balance.
56. A first vertical slice should validate the architecture before full catalog production.
57. A reasonable initial full-content planning envelope is approximately 70–100 distinct products, subject to playtest evidence.
58. The game should not create 104 signature product icons merely to match the 104 Catchmons.
59. Product content must be defined role-first, then fantasy, then visual asset.
60. Mass product-icon generation remains blocked until later system and art-direction documents are complete.

---

# 149. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- final names of the seven product families,
- final names/visual identities of stations,
- exact product list,
- exact number of recipes,
- exact Recipe Rank count,
- exact resource names,
- exact material quantities,
- exact craft durations,
- exact output quantities,
- exact base transaction values,
- exact Mastery thresholds,
- exact Mastery bonuses,
- exact quality probability formula,
- exact Fine/Masterwork value multipliers,
- exact Workshop Push cost/effect,
- exact station slot counts,
- exact queue lengths,
- exact station upgrade levels,
- exact Catchmon support slot count,
- exact Catchmon-to-recipe mapping,
- exact player-use effects,
- exact capture-item dependency,
- exact region recipe packages,
- exact special-order recipes,
- exact signature recipes,
- exact product asset style.

These belong to later owner documents and balancing work.

---

# 150. DEPENDENCY HANDOFF TO DOCUMENT 05

The product architecture now tells the customer system what it must support.

Customers must be able to create differentiated demand for:

- fast everyday products,
- stable care goods,
- preference-driven wearables,
- explorer Field Gear,
- Capture & Discovery tools,
- premium Elemental Craft,
- large Habitat/Enrichment goods,
- specific elements,
- quality grades,
- orders,
- special/signature products.

The customer system must also support the four transaction actions already defined in Document 02:

- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend.

Therefore Document 05 must answer:

> **Who comes into the shop, why do they want different products, and how does the player turn customer behavior into an active commercial game rather than a stream of identical sale buttons?**

---

# 151. NEXT DOCUMENT

## `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`

Document 05 should define:

### Customer architecture
What functional customer types exist?

### Demand generation
How do:
- displayed inventory,
- product family,
- quality,
- element,
- progression,
- customer preference

combine into requests?

### Browsing behavior
How customers enter, browse, request, wait, and leave.

### Transaction system
Exact functional relationship between:
- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend.

### Shop Momentum
How customer actions generate/spend Momentum at a systemic level.

### Special visitors
How rare/high-value customers create excitement without invalidating normal customers.

### Orders / commissions
How targeted demand creates short- and medium-term production goals.

### Customer satisfaction boundary
Whether a satisfaction/reputation layer is needed and what it accomplishes.

### Demand visibility
How much information the player sees before committing production.

### Display influence
How stocked products shape normal customer requests.

### Catchmon shop-floor hooks
Where Catchmons can influence customers without mapping all 104 yet.

### Active-play cadence
How many customer decisions occur during 2-, 10-, and 30-minute sessions.

### Anti-spam rules
How to prevent customer interaction from becoming repetitive tapping.

### Offline customer behavior
What happens to customers while the player is away.

Only after Customer & Selling is stable should the project map exact Catchmon roles onto production and shop-floor systems.

---

# 152. DEFINITION OF DONE FOR CRAFTING & PRODUCT SYSTEM

Document 04 is ready to hand off when the project can answer all of the following:

- What kinds of goods does Catchmon Shop sell?
- Why does this product universe feel native to Catchmons?
- What are the seven top-level product families?
- What strategic/economic role does each family serve?
- Which families are dual-use?
- How many functional production station types are needed?
- Why are there fewer stations than product families?
- How does the craft queue behave?
- When are materials reserved?
- What happens when a craft is cancelled?
- What happens if storage is full?
- Can crafting fail?
- How complex may recipe inputs become?
- How deep may production chains become?
- How do recipes progress?
- What is Recipe Rank?
- How are recipes unlocked?
- What is Recipe Mastery for?
- Does product quality exist?
- How many quality grades are intended?
- How does quality avoid asset explosion?
- How does active selling feed crafting?
- How do Catchmons connect to production?
- How do element/world recipes avoid combinatorial explosion?
- Why do lower-rank products remain relevant?
- How much product content should a prototype, vertical slice, and initial full game contain?
- When are item icons allowed to be generated?
- Which decisions are now locked?
- Which details remain intentionally deferred?

If those answers remain coherent during prototyping, the project can move into Customer & Selling without needing to redefine the product economy.
