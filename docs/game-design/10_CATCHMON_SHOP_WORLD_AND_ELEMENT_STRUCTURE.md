# CATCHMON SHOP — 10 WORLD & ELEMENT STRUCTURE

**Status:** World & Element Architecture v1  
**Purpose:** Define how the 17 canonical Catchmon elements and their home regions become mechanically distinct economic, crafting, customer, expedition, discovery, and Catchmon ecosystems without becoming combat types, simple recolors, isolated mini-economies, or 17 copies of the same progression package  
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
- canonical Catchmon data in `reference/catchmons/`  
- canonical element/region/design references in `reference/design-system/`

**Authority:** This document owns:
- the relationship between element and home region,
- the retained 17-region identity framework,
- regional gameplay identity,
- element gameplay identity outside combat,
- regional resource tendencies,
- regional product-family tendencies,
- regional customer/demand tendencies,
- regional expedition tendencies,
- regional Catchmon capability tendencies,
- regional content-package structure,
- cross-region economy rules,
- cross-region recipe rules,
- world-progression topology principles,
- region-relevance rules,
- world-content scope discipline,
- world/element canonical-data requirements,
- world/element prototype and audit requirements.

**Out of scope:**  
- exact final region unlock order,
- exact Shop Rank requirements,
- exact region unlock numbers,
- exact material names,
- exact special-component names,
- exact recipe names,
- exact route names,
- exact encounter pools,
- exact Catchmon-to-region mapping where canonical data is not yet normalized,
- exact 104-Catchmon role mapping,
- exact region map UX,
- exact environment art,
- exact background implementation,
- exact weather system,
- exact narrative/story structure,
- monetization,
- live-event regions.

---

# 1. SOURCE STATUS — WHAT IS CANONICAL VS WHAT IS NEW

This document intentionally separates **existing Catchmon identity data** from **new Catchmon Shop gameplay design**.

## Existing canonical/reference identity

The current Catchmon source material defines 17 real elements/home-region identities:

| Region ID | Region Name | Element |
|---|---|---|
| `grasland` | Vulkankrater | Fire |
| `ozean` | Ozean | Water |
| `blitzfeld` | Blitzfeld | Electric |
| `wildwuchs` | Wildwuchs | Grass |
| `erdwall` | Erdwall | Earth |
| `giftsumpf` | Giftsumpf | Poison |
| `graufeld` | Graufeld | Normal |
| `frostgrat` | Frostgrat | Ice |
| `feenhain` | Feenhain | Fairy |
| `windkamm` | Windkamm | Wind |
| `erzader` | Erzader | Steel |
| `traumfeld` | Traumfeld | Psychic |
| `lichtung` | Lichtung | Light |
| `schattenriss` | Schattenriss | Dark |
| `nebelmoor` | Nebelmoor | Ghost |
| `drachenschlund` | Drachenschlund | Dragon |
| `sternenkuppel` | Sternenkuppel | Cosmic |

These identities are retained as the **current Catchmon Shop world baseline** unless a later explicit content decision changes a name.

The old region file also contains legacy Funken-based unlock thresholds.

Those thresholds are **not part of Catchmon Shop**.

Document 09 explicitly replaces legacy progression with the new Shop Rank + World Readiness architecture.

---

# 2. IMPORTANT ELEMENT SOURCE BOUNDARY

The design references establish:

- the 17 canonical real elements above,
- canonical element colors/tokens,
- region-accent mappings,
- Ghost and Cosmic as real elements,
- no real `Bug` element.

`Bug` must not be introduced as an eighteenth element merely because an old color-reference table once contained a Bug color set.

Secondary creature/fantasy tags may still use words such as insect/chitin where appropriate.

They are not elements.

---

# 3. WORLD DESIGN THESIS

The central world thesis is:

> **Every region should change what is attractive to craft, gather, sell, explore, and assign — without creating a separate economy or a new rules engine.**

A region is not merely:

- a background,
- an element color,
- six new Catchmons,
- larger numbers.

A strong region creates a recognizable strategic package.

The player should gradually learn:

> **“When I go to this region, I know what kind of opportunities and problems it is good for.”**

---

# 4. ELEMENT DESIGN THESIS

Elements in Catchmon Shop represent:

> **economic and environmental identities, not combat effectiveness.**

An element may influence:

- material ecology,
- crafting style,
- product-family emphasis,
- customer demand,
- Catchmon capability tendency,
- expedition environment,
- discovery behavior,
- synergy.

Elements do **not** require:

- damage,
- resistance,
- weakness,
- Fire > Grass,
- Water > Fire,
- battle type charts.

---

# 5. FIVE-AXIS ELEMENT IDENTITY MODEL

Every element/region is defined across five gameplay axes.

## AXIS A — RESOURCE ECOLOGY

What kinds of material opportunities does the region emphasize?

## AXIS B — CRAFTING EXPRESSION

Which product roles/families naturally benefit from the region?

## AXIS C — COMMERCE & DEMAND

What kinds of customers or demand behaviors become more relevant?

## AXIS D — EXPEDITION EXPRESSION

What makes exploring the region strategically different?

## AXIS E — CATCHMON CAPABILITY TENDENCY

What kinds of Catchmon roles naturally fit the element?

These are **tendencies**, not hard class restrictions.

---

# 6. ELEMENTS ARE NOT CLASSES

A Fire Catchmon is not automatically a Workshop Catchmon.

A Water Catchmon is not automatically Supply.

A Psychic Catchmon is not automatically Shop Floor.

Element provides a design signal.

The actual Catchmon role is determined by:

- canonical fantasy,
- evolution line,
- roster balance,
- domain needs.

This prevents 104-Catchmon design from becoming predictable.

---

# 7. REGIONAL CONTENT PACKAGE

Every region should eventually introduce a curated package containing some combination of:

1. **regional resource opportunity**
2. **special-component identity**
3. **2–4 meaningful recipes**
4. **2–4 useful expedition routes/route variants**
5. **Catchmon encounter pool**
6. **one or more customer/demand expressions**
7. **Catchmon capability opportunities**
8. **one memorable regional hook**

Exact content counts are tuning envelopes, not mandatory quotas.

---

# 8. NO 17×EVERYTHING MULTIPLICATION

Do **not** create:

- 17 versions of every material,
- 17 versions of every recipe,
- 17 versions of every customer,
- 17 versions of every station,
- 17 currencies.

Regional identity is created through **curated emphasis**, not combinatorial duplication.

---

# 9. NO REGION CURRENCY

Each region does **not** get a spendable token.

Forbidden default pattern:

- Fire Coins,
- Water Coins,
- Grass Coins,
- Cosmic Coins.

The macro economy remains:

- Coins,
- materials,
- special components,
- progression state.

Regional differentiation should come from content and opportunity.

---

# 10. RESOURCE DESIGN BOUNDARY

Regions may introduce:

## ROUTINE RESOURCE EMPHASIS

Common material families that are useful across multiple recipes/regions.

## SPECIAL COMPONENTS

Scarcer regional or element-associated components.

The exact material taxonomy is deferred until detailed content production.

The key rule:

> **not every region needs an entirely isolated resource set.**

---

# 11. CROSS-REGION MATERIALS

Some materials should appear in multiple regions with different availability.

This creates:

- alternative supply routes,
- regional preferences,
- economic flexibility.

A material may be:

- common in one region,
- secondary in another,
- unavailable in a third.

---

# 12. REGION-SPECIFIC COMPONENTS

Special components may be much more region-specific.

They can create reasons to revisit a region for:

- advanced recipes,
- commissions,
- signature content.

But they should not require the player to maintain 50 microscopic material stacks.

---

# 13. CROSS-REGION RECIPES

Advanced recipes should increasingly combine knowledge/resources from more than one region.

This creates a world that becomes more interconnected over progression.

Example structural pattern:

> current-region special component  
> + earlier-region routine input  
> → new advanced product.

This keeps older regions economically relevant.

---

# 14. OLD REGION RELEVANCE RULE

Unlocking Region B never means Region A is obsolete.

Earlier regions retain value through:

- materials,
- Catchmons,
- special components,
- short expeditions,
- recipe inputs,
- commissions,
- variant hunting.

---

# 15. REGION IDENTITY MATRIX — SUMMARY

| Element | Region | Core Economic Identity | Strong Product Tendencies | Expedition Identity |
|---|---|---|---|---|
| Fire | Vulkankrater | Transformation / intensity | Provisions, Elemental Craft | heat, conversion, volatile opportunity |
| Water | Ozean | Flow / care / preservation | Care, Provisions, Field Gear | supply consistency, aquatic access |
| Electric | Blitzfeld | Tempo / precision / systems | Field Gear, Elemental Craft | speed, detection, technical routes |
| Grass | Wildwuchs | Growth / abundance / renewal | Provisions, Habitat, Care | routine resources, regrowth |
| Earth | Erdwall | Stability / mass / construction | Habitat, Field Gear | bulk extraction, heavy routes |
| Poison | Giftsumpf | Extraction / chemistry / rare reagents | Capture Gear, Care, Elemental Craft | specialized components, detection |
| Normal | Graufeld | Reliability / flexibility / everyday trade | Care, Wearables, Provisions | broad resources, adaptable teams |
| Ice | Frostgrat | Preservation / precision / control | Care, Provisions, Elemental Craft | preservation, timing, harsh terrain |
| Fairy | Feenhain | Delight / presentation / social value | Wearables, Care, Habitat | charm, rare social/discovery opportunities |
| Wind | Windkamm | Mobility / scouting / logistics | Field Gear, Wearables | route speed, scouting, access |
| Steel | Erzader | Durability / tools / reusable utility | Field Gear, Habitat, Wearables | extraction, reusable gear, structural access |
| Psychic | Traumfeld | Information / forecasting / insight | Elemental Craft, Capture Gear | prediction, discovery information |
| Light | Lichtung | Clarity / quality / trust | Care, Wearables, Elemental Craft | visibility, quality, reliable special outcomes |
| Dark | Schattenriss | Subtlety / selective opportunity / hidden value | Wearables, Capture Gear, Elemental Craft | hidden routes, rare/night opportunities |
| Ghost | Nebelmoor | Traces / memory / elusive discovery | Capture Gear, Care, Elemental Craft | trace discovery, observation, elusive encounters |
| Dragon | Drachenschlund | Mastery / prestige / difficult craftsmanship | Elemental Craft, Field Gear, Habitat | advanced challenges, signature components |
| Cosmic | Sternenkuppel | Anomaly / synthesis / cross-region possibility | Elemental Craft, Capture Gear, premium hybrids | rare anomalies, cross-region discovery |

This matrix is a **design compass**, not an exact recipe allocation.

---

# 16. FIRE — VULKANKRATER

## Core identity

**Transformation, heat, intensity, rapid conversion.**

Fire should feel active and productive without becoming the generic “damage element.”

The economic fantasy is:

> **turning raw things into something immediately useful or valuable.**

---

# 17. FIRE — RESOURCE ECOLOGY

Fire-region opportunities should tend toward:

- heat-formed resources,
- volcanic/mineral inputs,
- combustible/aromatic organic inputs,
- transformation-friendly components.

Exact names are deferred.

Fire resources should often feel:

- energetic,
- processed,
- high-impact.

---

# 18. FIRE — CRAFTING EXPRESSION

Strong tendencies:

### PROVISIONS
Cooking, roasting, warming, energetic preparation.

### ELEMENTAL CRAFT
Heat/resonance-based premium goods.

Secondary opportunities:

- Field Gear for heat environments,
- selected Habitat goods.

Fire should support both:

- fast useful production,
- premium transformation.

---

# 19. FIRE — COMMERCE & DEMAND

Fire-associated demand may favor:

- energetic everyday goods,
- bold premium products,
- visually striking merchandise.

Customer behavior may lean toward:

- faster turnover,
- strong premium moments.

Do not create an automatic global sale-value bonus.

---

# 20. FIRE — EXPEDITIONS

Vulkankrater routes may emphasize:

- heat conditions,
- mineral/thermal resources,
- short high-yield opportunities,
- specialized protection/access.

Field Gear may matter for:

- heat resistance,
- extraction,
- route access.

No environmental damage/HP system is required.

---

# 21. FIRE — CATCHMON TENDENCIES

Fire Catchmons may naturally fit:

- Workshop transformation,
- Provisions,
- Elemental Craft,
- expedition access/efficiency.

But individual lines remain free to occupy other domains.

---

# 22. FIRE — REGIONAL HOOK

Working regional design hook:

> **Conversion Opportunity**

The region should often reward turning a specific input/opportunity into another form efficiently.

This can appear through:

- recipes,
- Catchmon capabilities,
- expedition rewards.

Exact mechanic is deferred.

---

# 23. WATER — OZEAN

## Core identity

**Flow, care, replenishment, preservation.**

Water's economy should feel:

- dependable,
- adaptable,
- sustaining.

---

# 24. WATER — RESOURCE ECOLOGY

Water opportunities may emphasize:

- fluid/organic inputs,
- aquatic materials,
- cleaning/preservation resources,
- renewable supply.

The region should provide reliable supply value without becoming the best source of every routine material.

---

# 25. WATER — CRAFTING EXPRESSION

Strong tendencies:

### CARE & COMFORT
Cleaning, recovery, grooming, soothing goods.

### PROVISIONS
Drinks, preserved/fresh products.

### FIELD GEAR
Aquatic/travel equipment.

Secondary:
- selected Wearables.

---

# 26. WATER — COMMERCE & DEMAND

Water-associated commerce may emphasize:

- reliable everyday demand,
- caretaker/explorer customers,
- stable Standard Sales.

Water should not just mean “lower prices / more quantity.”

---

# 27. WATER — EXPEDITIONS

Ozean routes can emphasize:

- consistent supply,
- aquatic access,
- route choice,
- preparation-dependent exploration.

Water Catchmons/Field Gear can improve:

- access,
- route efficiency,
- material consistency.

---

# 28. WATER — CATCHMON TENDENCIES

Natural tendencies:

- Supply,
- Care-oriented Workshop,
- Expedition access,
- resource consistency.

---

# 29. WATER — REGIONAL HOOK

Working hook:

> **Flow / Continuity**

Water systems can reduce friction between repeated activities.

Examples:
- stable supply chains,
- efficient route continuity,
- preservation.

Do not implement unlimited automation merely because the theme is “flow.”

---

# 30. ELECTRIC — BLITZFELD

## Core identity

**Tempo, precision, detection, system efficiency.**

Electric should feel like a region of:

- responsive technology,
- fast information,
- precise timing.

Not raw combat speed.

---

# 31. ELECTRIC — RESOURCE ECOLOGY

Electric opportunities may emphasize:

- conductive materials,
- energy-reactive components,
- technical parts,
- precision resources.

---

# 32. ELECTRIC — CRAFTING EXPRESSION

Strong tendencies:

### FIELD GEAR
Tracking, technical equipment, expedition devices.

### ELEMENTAL CRAFT
Resonance/energy devices.

Secondary:
- Capture & Discovery Gear.

---

# 33. ELECTRIC — COMMERCE & DEMAND

Electric-associated customers may favor:

- technical goods,
- fast utility,
- newer/high-function products.

Potential shop effects can involve:

- demand information,
- transaction tempo,
- Recommend support.

Avoid generic “all customers faster.”

---

# 34. ELECTRIC — EXPEDITIONS

Blitzfeld routes may emphasize:

- detection,
- fast route completion,
- dynamic paths,
- equipment dependency.

Electric fits particularly well with:

- Tracking Gear,
- route information,
- technical access.

---

# 35. ELECTRIC — CATCHMON TENDENCIES

Natural tendencies:

- Workshop workflow,
- Fieldworks Bench,
- Shop Floor information,
- Expedition tempo/detection.

---

# 36. ELECTRIC — REGIONAL HOOK

Working hook:

> **Signal**

Electric content should often improve:

- detection,
- timing,
- responsiveness.

Information can be as valuable as raw efficiency.

---

# 37. GRASS — WILDWUCHS

## Core identity

**Growth, abundance, renewal, organic supply.**

Grass should represent:

> **sustainable material abundance**

rather than the generic “nature element.”

---

# 38. GRASS — RESOURCE ECOLOGY

Grass opportunities may emphasize:

- organic routine materials,
- fibers,
- herbs/plants,
- renewable inputs,
- habitat materials.

---

# 39. GRASS — CRAFTING EXPRESSION

Strong tendencies:

### PROVISIONS
Organic food/treats.

### HABITAT & ENRICHMENT
Natural habitat goods.

### CARE & COMFORT
Plant-based care products.

---

# 40. GRASS — COMMERCE & DEMAND

Grass-associated demand can emphasize:

- everyday volume,
- care,
- habitat,
- sustainable utility.

This region is well suited to material-sink and steady-demand strategies.

---

# 41. GRASS — EXPEDITIONS

Wildwuchs routes should support:

- predictable routine resources,
- regrowth,
- discovery hidden in dense environment.

Discovery does not need to be extremely rare.

---

# 42. GRASS — CATCHMON TENDENCIES

Natural tendencies:

- Supply,
- Habitat Workshop,
- Provisions,
- Care.

---

# 43. GRASS — REGIONAL HOOK

Working hook:

> **Renewal**

The region may make renewable/routine resources especially strategically flexible.

Do not create manual farming.

---

# 44. EARTH — ERDWALL

## Core identity

**Stability, structure, bulk material, construction.**

Earth should feel:

- grounded,
- durable,
- high-volume.

---

# 45. EARTH — RESOURCE ECOLOGY

Earth opportunities may emphasize:

- stone/mineral materials,
- dense structural inputs,
- bulk routine resources,
- construction-related components.

---

# 46. EARTH — CRAFTING EXPRESSION

Strong tendencies:

### HABITAT & ENRICHMENT
Large structural goods.

### FIELD GEAR
Rugged exploration gear.

Secondary:
- selected Wearables/Elemental Craft.

---

# 47. EARTH — COMMERCE & DEMAND

Earth commerce can emphasize:

- larger orders,
- high routine-material conversion,
- practical durable goods.

---

# 48. EARTH — EXPEDITIONS

Erdwall routes may emphasize:

- extraction,
- heavy/bulk reward,
- route access through structural capability,
- slower but dependable outcomes.

Avoid simply making every Earth route long.

---

# 49. EARTH — CATCHMON TENDENCIES

Natural tendencies:

- Supply,
- Habitat Workshop,
- Field Gear,
- capacity/structural support.

---

# 50. EARTH — REGIONAL HOOK

Working hook:

> **Foundation**

Earth-related progression often improves:

- stability,
- capacity,
- bulk conversion.

It should not replace infrastructure upgrades globally.

---

# 51. POISON — GIFTSUMPF

## Core identity

**Extraction, chemistry, controlled risk, specialized reagents.**

Poison is not a damage-over-time element.

Its economy is about:

> **handling difficult materials intelligently.**

---

# 52. POISON — RESOURCE ECOLOGY

Poison opportunities may emphasize:

- reactive organic inputs,
- rare reagents,
- difficult-to-extract components,
- preservation/neutralization materials.

---

# 53. POISON — CRAFTING EXPRESSION

Strong tendencies:

### CAPTURE & DISCOVERY GEAR
Calming, tracking, analysis, specialized approach tools.

### CARE & COMFORT
Protective/cleansing specialist products.

### ELEMENTAL CRAFT
Rare reagent conversion.

---

# 54. POISON — COMMERCE & DEMAND

Demand may be:

- more specialized,
- less broad,
- valuable for explorers/researchers/caretakers.

The region should create niche commercial opportunities.

---

# 55. POISON — EXPEDITIONS

Giftsumpf routes may emphasize:

- component hunting,
- environmental detection,
- specialized Gear,
- extraction.

No HP/poison meter is needed.

Poor preparation should mean:

- less efficient route,
- inaccessible bonus,
- lower opportunity,

not Catchmon injury.

---

# 56. POISON — CATCHMON TENDENCIES

Natural tendencies:

- Supply special components,
- Capture Gear,
- expedition detection,
- resource conversion.

---

# 57. POISON — REGIONAL HOOK

Working hook:

> **Refinement**

Poison-region strategy often turns difficult inputs into high-value specialist outputs.

---

# 58. NORMAL — GRAUFELD

## Core identity

**Reliability, flexibility, ordinary life, adaptable commerce.**

Normal should not feel like:

> “the boring non-element.”

It represents:

> **the broad everyday systems that make a shop work.**

---

# 59. NORMAL — RESOURCE ECOLOGY

Normal opportunities may emphasize:

- broadly useful materials,
- multi-recipe inputs,
- dependable supply.

---

# 60. NORMAL — CRAFTING EXPRESSION

Strong tendencies:

### CARE & COMFORT
### WEARABLES
### PROVISIONS

Normal products should often be:

- broadly demanded,
- reliable,
- adaptable.

---

# 61. NORMAL — COMMERCE & DEMAND

Graufeld is a natural region for:

- Walk-In customers,
- broad demand,
- Standard Sale value,
- flexible Recommend compatibility.

This does not mean it has the highest raw sales.

---

# 62. NORMAL — EXPEDITIONS

Graufeld routes may be:

- readable,
- broad,
- lower specialization,
- good for mixed teams.

It can act as a useful learning/bridge region depending on final progression order.

---

# 63. NORMAL — CATCHMON TENDENCIES

Normal Catchmons can be:

- flexible dual-domain helpers,
- reliable specialists,
- broad compatibility units.

They should trade peak specialization for flexibility.

---

# 64. NORMAL — REGIONAL HOOK

Working hook:

> **Adaptability**

Normal-region content should frequently offer multiple viable uses rather than peak output.

---

# 65. ICE — FROSTGRAT

## Core identity

**Preservation, precision, timing, controlled scarcity.**

Ice is not Water with a lighter blue.

---

# 66. ICE — RESOURCE ECOLOGY

Ice opportunities may emphasize:

- preserved organic materials,
- crystalline/frozen components,
- temperature-sensitive resources.

---

# 67. ICE — CRAFTING EXPRESSION

Strong tendencies:

### CARE & COMFORT
Preservation/cooling/soothing.

### PROVISIONS
Preserved/special products.

### ELEMENTAL CRAFT
Precision crystalline goods.

---

# 68. ICE — COMMERCE & DEMAND

Ice can support:

- quality-focused goods,
- preserved premium products,
- selective demand.

---

# 69. ICE — EXPEDITIONS

Frostgrat routes may emphasize:

- preparation,
- preservation,
- precise timing,
- difficult terrain.

“Difficult” means preparation opportunities, not injury punishment.

---

# 70. ICE — CATCHMON TENDENCIES

Natural tendencies:

- quality,
- preservation,
- component protection,
- expedition reliability.

---

# 71. ICE — REGIONAL HOOK

Working hook:

> **Preserve**

Ice-related systems can protect:

- quality,
- resources,
- opportunity

from loss/decay-like pressures.

The game still does not use universal resource decay.

---

# 72. FAIRY — FEENHAIN

## Core identity

**Delight, presentation, social attraction, expressive value.**

Fairy should not become “pink magic.”

Its economic identity is:

> **making goods and spaces desirable beyond raw utility.**

---

# 73. FAIRY — RESOURCE ECOLOGY

Fairy opportunities may emphasize:

- decorative natural inputs,
- delicate components,
- sensory/presentation materials.

---

# 74. FAIRY — CRAFTING EXPRESSION

Strong tendencies:

### WEARABLES
### CARE & COMFORT
### HABITAT & ENRICHMENT

Secondary:
- selected premium Elemental Craft.

---

# 75. FAIRY — COMMERCE & DEMAND

Feenhain is a strong home for:

- Focused Customers,
- quality/presentation preference,
- social attraction,
- premium display behavior.

Do not turn this into universal price inflation.

---

# 76. FAIRY — EXPEDITIONS

Routes may emphasize:

- unusual discoveries,
- social/sensory cues,
- rare attractive materials,
- hidden habitat opportunities.

---

# 77. FAIRY — CATCHMON TENDENCIES

Natural tendencies:

- Shop Floor attraction,
- quality,
- Wearables,
- Habitat,
- special visitor interactions.

---

# 78. FAIRY — REGIONAL HOOK

Working hook:

> **Appeal**

Fairy mechanics often alter:

- what customers notice,
- what becomes desirable,
- presentation value.

---

# 79. WIND — WINDKAMM

## Core identity

**Mobility, scouting, logistics, lightness.**

Wind is about:

> **getting information or goods where they need to go efficiently.**

---

# 80. WIND — RESOURCE ECOLOGY

Wind opportunities may emphasize:

- lightweight materials,
- fibers,
- aerial/route-specific components.

---

# 81. WIND — CRAFTING EXPRESSION

Strong tendencies:

### FIELD GEAR
### WEARABLES

Secondary:
- Capture & Discovery Gear.

---

# 82. WIND — COMMERCE & DEMAND

Wind-related demand may emphasize:

- travelers,
- explorers,
- mobile utility.

---

# 83. WIND — EXPEDITIONS

Windkamm is naturally suited to:

- route speed,
- scouting,
- path access,
- information.

Wind should not simply make every expedition globally shorter.

Benefits remain route/context-specific.

---

# 84. WIND — CATCHMON TENDENCIES

Natural tendencies:

- Expedition,
- Field Gear,
- route access,
- scouting/demand insight hybrids.

---

# 85. WIND — REGIONAL HOOK

Working hook:

> **Mobility**

Wind changes:

- route options,
- tempo,
- accessibility.

---

# 86. STEEL — ERZADER

## Core identity

**Durability, tools, precision construction, reusable utility.**

Steel should feel technologically practical.

---

# 87. STEEL — RESOURCE ECOLOGY

Steel opportunities may emphasize:

- metallic inputs,
- structural components,
- durable technical parts.

---

# 88. STEEL — CRAFTING EXPRESSION

Strong tendencies:

### FIELD GEAR
### HABITAT & ENRICHMENT
### WEARABLES

Steel is especially appropriate for reusable expedition equipment.

---

# 89. STEEL — COMMERCE & DEMAND

Customers may value:

- durability,
- practical high-value goods,
- explorer utility.

---

# 90. STEEL — EXPEDITIONS

Erzader may emphasize:

- extraction,
- reusable gear,
- structural access,
- component recovery.

---

# 91. STEEL — CATCHMON TENDENCIES

Natural tendencies:

- Fieldworks Bench,
- reusable Gear,
- Supply extraction,
- infrastructure-adjacent support.

Catchmons should not replace actual infrastructure progression.

---

# 92. STEEL — REGIONAL HOOK

Working hook:

> **Durability**

Steel-region strategy often rewards reusable investment over consumable throughput.

---

# 93. PSYCHIC — TRAUMFELD

## Core identity

**Information, forecasting, insight, intentionality.**

Psychic should not mean psychic damage.

Its economy is:

> **knowing more before committing.**

---

# 94. PSYCHIC — RESOURCE ECOLOGY

Psychic resources may emphasize:

- resonance/sensory materials,
- unusual information-linked components,
- rare perception-oriented inputs.

Exact material fantasy comes later.

---

# 95. PSYCHIC — CRAFTING EXPRESSION

Strong tendencies:

### ELEMENTAL CRAFT
### CAPTURE & DISCOVERY GEAR

Secondary:
- specialized Wearables/Care.

---

# 96. PSYCHIC — COMMERCE & DEMAND

Traumfeld naturally supports:

- Demand Insight,
- customer preference visibility,
- recommendation information,
- special visitor preparation.

Information should not remove all uncertainty.

---

# 97. PSYCHIC — EXPEDITIONS

Psychic expedition identity:

- route preview,
- encounter information,
- trace interpretation,
- reward prediction.

---

# 98. PSYCHIC — CATCHMON TENDENCIES

Natural tendencies:

- Shop Floor insight,
- Expedition discovery,
- Capture information,
- Elemental Craft.

---

# 99. PSYCHIC — REGIONAL HOOK

Working hook:

> **Foreknowledge**

Psychic systems improve decision quality before commitment.

---

# 100. LIGHT — LICHTUNG

## Core identity

**Clarity, quality, trust, revelation.**

Light is not simply “good” and Dark is not simply “evil.”

Light's economic identity is:

> **making value visible and dependable.**

---

# 101. LIGHT — RESOURCE ECOLOGY

Light opportunities may emphasize:

- luminous/clarifying materials,
- high-purity components,
- quality-sensitive inputs.

---

# 102. LIGHT — CRAFTING EXPRESSION

Strong tendencies:

### CARE & COMFORT
### WEARABLES
### ELEMENTAL CRAFT

Especially suitable for:

- quality,
- premium presentation,
- precision finishing.

---

# 103. LIGHT — COMMERCE & DEMAND

Light-associated commerce may emphasize:

- trust,
- clear premium value,
- quality-sensitive customers,
- reliable special outcomes.

---

# 104. LIGHT — EXPEDITIONS

Lichtung routes may emphasize:

- visibility,
- information revelation,
- protection from ambiguous outcomes,
- quality materials.

---

# 105. LIGHT — CATCHMON TENDENCIES

Natural tendencies:

- quality,
- customer trust/clarity,
- discovery reveal,
- care.

---

# 106. LIGHT — REGIONAL HOOK

Working hook:

> **Reveal**

Light mechanics often turn hidden/uncertain information into clear opportunity.

This overlaps with Psychic only superficially:

- Psychic forecasts,
- Light reveals/clarifies.

---

# 107. DARK — SCHATTENRISS

## Core identity

**Subtlety, selective opportunity, hidden value, specialization.**

Dark is not criminality or evil.

Its economy is:

> **finding value that broad everyday commerce does not immediately see.**

---

# 108. DARK — RESOURCE ECOLOGY

Dark opportunities may emphasize:

- rare low-visibility resources,
- nocturnal/hidden materials,
- unusual specialist components.

---

# 109. DARK — CRAFTING EXPRESSION

Strong tendencies:

### CAPTURE & DISCOVERY GEAR
### WEARABLES
### ELEMENTAL CRAFT

Products may favor:

- specialist customers,
- rare opportunities,
- selective premium demand.

---

# 110. DARK — COMMERCE & DEMAND

Schattenriss may support:

- narrower but stronger preference matches,
- unusual Special Visitors,
- selective Recommend/Premium opportunities.

No illicit-market system is assumed.

---

# 111. DARK — EXPEDITIONS

Dark expedition identity:

- hidden routes,
- low-visibility discovery,
- rare encounter targeting,
- nocturnal conditions.

---

# 112. DARK — CATCHMON TENDENCIES

Natural tendencies:

- targeted demand,
- hidden discovery,
- rare opportunity,
- specialist Gear.

---

# 113. DARK — REGIONAL HOOK

Working hook:

> **Hidden Opportunity**

Dark systems reward identifying high-value narrow opportunities.

---

# 114. GHOST — NEBELMOOR

## Core identity

**Traces, memory, elusive presence, observation.**

Ghost is mechanically distinct from Dark.

Dark is hidden opportunity.

Ghost is:

> **evidence of something that is no longer fully present.**

---

# 115. GHOST — RESOURCE ECOLOGY

Ghost opportunities may emphasize:

- ephemeral/resonant materials,
- preserved traces,
- unusual low-volume components.

Exact material names remain open.

---

# 116. GHOST — CRAFTING EXPRESSION

Strong tendencies:

### CAPTURE & DISCOVERY GEAR
### ELEMENTAL CRAFT

Secondary:
- Care products with calming/memory themes.

---

# 117. GHOST — COMMERCE & DEMAND

Nebelmoor may support:

- collectors,
- researchers,
- rare special visitors,
- unusual commissions.

---

# 118. GHOST — EXPEDITIONS

Ghost is one of the strongest discovery identities.

Routes may emphasize:

- Trace state,
- elusive encounters,
- observation,
- route memory.

---

# 119. GHOST — CATCHMON TENDENCIES

Natural tendencies:

- Discovery,
- Trace protection,
- encounter insight,
- specialist Capture Gear.

---

# 120. GHOST — REGIONAL HOOK

Working hook:

> **Trace**

Nebelmoor is the ideal region for deepening the Unknown → Traced → Encountered system.

It should not become the only region where traces matter.

---

# 121. DRAGON — DRACHENSCHLUND

## Core identity

**Mastery, prestige, difficult craftsmanship, legacy.**

Dragon is not “highest attack.”

Its role is:

> **high-investment capabilities that reward developed systems.**

---

# 122. DRAGON — RESOURCE ECOLOGY

Dragon opportunities may emphasize:

- durable rare components,
- heat/pressure-formed materials,
- high-value specialist inputs.

---

# 123. DRAGON — CRAFTING EXPRESSION

Strong tendencies:

### ELEMENTAL CRAFT
### FIELD GEAR
### HABITAT & ENRICHMENT

Dragon content is appropriate for:

- signature recipes,
- difficult commissions,
- Masterwork targets.

---

# 124. DRAGON — COMMERCE & DEMAND

Drachenschlund may support:

- collectors,
- premium customers,
- signature commissions.

It should not simply have the highest prices.

---

# 125. DRAGON — EXPEDITIONS

Dragon routes may be:

- advanced,
- capability-intensive,
- rich in signature components,
- strongly preparation-sensitive.

They still guarantee useful baseline rewards.

---

# 126. DRAGON — CATCHMON TENDENCIES

Natural tendencies:

- strong specialist capability,
- signature interactions,
- advanced Workshop/Expedition roles.

Rarity/power discipline still applies.

---

# 127. DRAGON — REGIONAL HOOK

Working hook:

> **Mastery Test**

Dragon-region opportunities should reward developed systems:

- good Gear,
- mature Catchmons,
- advanced crafting.

Not combat power.

---

# 128. COSMIC — STERNENKUPPEL

## Core identity

**Anomaly, synthesis, cross-region possibility, late discovery.**

Cosmic should feel strange and advanced without being:

> “everything, but stronger.”

---

# 129. COSMIC — RESOURCE ECOLOGY

Cosmic opportunities may emphasize:

- anomalous rare components,
- cross-region synthesis materials,
- unusual resonance inputs.

Routine material volume should not be its main identity.

---

# 130. COSMIC — CRAFTING EXPRESSION

Strong tendencies:

### ELEMENTAL CRAFT
### CAPTURE & DISCOVERY GEAR

Secondary:
- rare hybrid products across families.

Cosmic is a natural home for **curated cross-region recipes**.

---

# 131. COSMIC — COMMERCE & DEMAND

Sternenkuppel may support:

- rare collectors,
- highly specialized visitors,
- signature commissions,
- unusual cross-element demand.

---

# 132. COSMIC — EXPEDITIONS

Cosmic routes may emphasize:

- anomalies,
- unusual route conditions,
- rare discovery,
- cross-region information,
- difficult targeted hunts.

---

# 133. COSMIC — CATCHMON TENDENCIES

Natural tendencies:

- unusual cross-domain roles,
- discovery,
- recipe/capability synthesis,
- signature effects.

Flexible Cosmic Catchmons must pay a specialization cost.

---

# 134. COSMIC — REGIONAL HOOK

Working hook:

> **Synthesis**

Cosmic can connect previously separate systems/resources.

It should not invalidate earlier elements.

---

# 135. ELEMENT IDENTITY COLLISION AUDIT

Several elements have nearby themes.

They must remain distinct.

---

# 136. WATER VS ICE

## Water
Flow, replenishment, care, continuity.

## Ice
Preservation, precision, controlled timing.

If both simply give “better Care products,” differentiation has failed.

---

# 137. EARTH VS STEEL

## Earth
Bulk, stability, raw structure.

## Steel
Durability, tools, reusable precision.

Earth is material mass.

Steel is engineered utility.

---

# 138. PSYCHIC VS LIGHT

## Psychic
Forecasting and inference before outcome.

## Light
Clarity/revelation of existing information/value.

Psychic predicts.

Light reveals.

---

# 139. DARK VS GHOST

## Dark
Hidden/selective opportunities.

## Ghost
Traces/elusive presence/history.

Dark searches the unseen.

Ghost follows evidence left behind.

---

# 140. FIRE VS ELECTRIC

## Fire
Transformation/intensity.

## Electric
Signal/tempo/precision.

Do not reduce both to “faster production.”

---

# 141. GRASS VS WATER

## Grass
Renewable abundance/growth.

## Water
Flow/replenishment/care.

Do not make both generic Supply boosters.

---

# 142. FAIRY VS LIGHT

## Fairy
Appeal, social attraction, presentation.

## Light
Clarity, quality, trust.

Fairy changes desire.

Light changes confidence/visibility.

---

# 143. DRAGON VS COSMIC

## Dragon
Mastery and high-investment excellence.

## Cosmic
Anomaly and synthesis.

Dragon rewards developed expertise.

Cosmic connects unusual systems.

---

# 144. REGION PROGRESSION TOPOLOGY

The 17 regions should **not** be forced into a simple permanent:

`1 → 2 → 3 → ... → 17`

corridor unless playtesting proves that is better.

The preferred architecture is:

# **PROGRESSION BANDS WITH CONTROLLED CHOICE**

The player reaches readiness milestones and gains access to a small set of regional options.

This supports soft specialization.

---

# 145. WHY NOT FULLY LINEAR

A fixed 17-region sequence would:

- reduce player choice,
- make preferred elements potentially very late,
- create strict content obsolescence,
- make replay/strategy more uniform.

---

# 146. WHY NOT FULLY OPEN

Unlocking all 17 after the tutorial would:

- overwhelm,
- destroy progression,
- make route/resource balancing difficult.

The game needs staged access.

---

# 147. PROGRESSION BAND MODEL

Conceptually:

## FOUNDATION BAND
Simple, readable region identities.

## DEVELOPING BAND
Introduces stronger specialization.

## ADVANCED BAND
Requires mature shop/world systems.

## MASTERY BAND
Signature/complex regions.

Exact regional placement inside bands remains open until:

- Catchmon roster mapping,
- recipe/resource content,
- progression simulation.

---

# 148. WORKING START REGION

The existing canonical region data identifies **Vulkankrater / Fire** as the current starting region.

Catchmon Shop retains Vulkankrater as the **working starting-region assumption**.

This remains subject to onboarding playtest before final content lock.

No old Funken threshold is retained.

---

# 149. START-REGION REQUIREMENTS

The starting region should support:

- simple routine resources,
- first recipes,
- first expedition,
- understandable first Catchmon encounters.

If final Fire content cannot support this cleanly, the starting-region decision may be revisited explicitly.

---

# 150. CHOICE BAND REQUIREMENT

When the player chooses between regions, each option must communicate:

- what resources it favors,
- what product opportunities it supports,
- what Catchmons are discoverable,
- what expedition behavior is distinctive.

The choice should be strategic, not cosmetic.

---

# 151. REGION CHOICE IS NOT PERMANENT

Choosing one region first does not lock the others forever.

This is sequencing choice, not class selection.

---

# 152. WORLD READINESS GATE

Following Document 09, normal region access uses:

## GLOBAL READINESS
Shop Rank / infrastructure capability.

+

## WORLD READINESS
relevant expedition/discovery milestone.

Optional special requirement only where meaningful.

---

# 153. NO 100% COMPLETION GATE

The player does not need:

- all recipes,
- all Catchmons,
- all routes

from a region to move on.

Regional completion remains a long-term goal.

---

# 154. REGIONAL COMPLETION

A region may later track completion across:

- discovered routes,
- Catchmon collection,
- signature recipe,
- special component,
- mastery objective.

Exact completion UI belongs later.

---

# 155. REGIONAL COMPLETION REWARDS

Good rewards include:

- cosmetic trophy,
- special visitor,
- signature recipe opportunity,
- collection prestige,
- targeted hunting convenience.

Avoid giant permanent global multipliers.

---

# 156. CROSS-REGION CUSTOMER SYSTEM

Customers should not exist only inside the region map.

Regional progression can influence the main shop through:

- visiting regional customer profiles,
- temporary regional demand,
- element preference,
- special visitors.

The main shop remains central.

---

# 157. REGIONAL DEMAND SHOULD TRAVEL HOME

Unlocking a region should change the shop.

Example:

> after discovering a new region, customers interested in its goods begin appearing.

This makes world progression feed the shop loop.

---

# 158. CROSS-REGION CATCHMON SYSTEM

Catchmons from a region may specialize in that environment.

But they must remain useful outside their home region.

A region-affinity Catchmon can have:

- stronger local benefit,
- still-valuable core capability globally.

---

# 159. NO REGION-LOCKED WORKERS

Avoid:

> Fire Catchmon only works while Fire region is active.

The player's collection supports the shop globally.

---

# 160. CROSS-REGION EXPEDITIONS

The player should eventually maintain reasons to run:

- current-region routes,
- earlier-region routes,
- targeted Catchmon routes,
- special-component routes.

This creates an expedition portfolio.

---

# 161. REGION ACTIVE STATE BOUNDARY

The game does not need a single global:

> “currently active region”

that disables other regions.

Players should be able to choose available expedition destinations independently.

The shop may visually feature one selected/featured region for presentation.

That is not a hard economic lock.

---

# 162. REGION-SPECIFIC STATION BOUNDARY

Do not create 17 region-specific production stations.

The existing five station archetypes are universal.

Regions add:

- recipes,
- inputs,
- Catchmon interactions.

Not new crafting engines.

---

# 163. REGION-SPECIFIC DISPLAY BOUNDARY

Do not require one permanent display unit per element.

Displays remain generic/specializable.

Regional merchandise can use the same system.

---

# 164. REGION-SPECIFIC STORAGE BOUNDARY

Do not create 17 storage buildings.

Regional materials use the canonical inventory/storage architecture.

---

# 165. REGION-SPECIFIC CURRENCY BOUNDARY

Again:

> no regional currencies by default.

This is important enough to repeat because 17 worlds can otherwise create currency explosion very quickly.

---

# 166. REGIONAL RECIPE PACKAGE

A strong region recipe package should include a mix such as:

- one accessible recipe,
- one product-family specialty,
- one advanced/special-component recipe,
- optional signature recipe later.

Not every region needs all seven families.

---

# 167. REGIONAL PRODUCT-FAMILY DISTRIBUTION

Across all 17 regions, ensure:

- every product family receives meaningful support,
- no family depends on only one region,
- Elemental Craft does not monopolize late regions,
- Provisions/Care/Habitat remain relevant.

---

# 168. REGIONAL ROUTE PACKAGE

A region should generally support more than one expedition purpose.

Typical package may include:

- Supply Run,
- Discovery Survey,
- Component Hunt,
- optional Special Expedition.

Not every route needs to unlock simultaneously.

---

# 169. REGIONAL ENCOUNTER POOL

Encounter pools should be:

- coherent,
- targetable,
- small enough for player agency.

Do not place every Catchmon of an element into one enormous pool by default.

---

# 170. CATCHMON HOME REGION

Every Catchmon line should eventually have:

- canonical home region,
- canonical element,
- encounter/acquisition path.

A line may appear in secondary regions if fantasy supports it.

---

# 171. SECONDARY HABITAT RULE

Secondary habitats can:

- improve targeted hunting options,
- create world ecology,
- prevent one route bottleneck.

But the home region remains the primary identity.

---

# 172. ROSTER DISTRIBUTION AUDIT

Before locking world progression:

- normalize all 104 Catchmons,
- group evolution lines,
- map canonical elements,
- map home regions,
- count accessible capabilities by region/progression band.

This prevents progression from accidentally locking all Supply or Shop Floor specialists late.

---

# 173. ELEMENT ROLE DISTRIBUTION AUDIT

For each element, review:

- Workshop representation,
- Shop Floor representation,
- Supply representation,
- Expedition representation.

An element does not need equal counts.

But it should not become mechanically one-note.

---

# 174. RESOURCE AUDIT

For each region:

- which routine resource families appear?
- which special components appear?
- which recipes consume them?
- where else can they be acquired?

No orphan materials.

---

# 175. RECIPE AUDIT

For every regional recipe:

- why is it regional?
- what product role does it serve?
- what older/newer content does it connect to?

No recipe exists only as an element recolor.

---

# 176. CUSTOMER AUDIT

For every regional demand rule:

- does it create a new commercial decision?
- can the player prepare for it?
- does it use existing customer architecture?

No dedicated mini customer-engine per region.

---

# 177. EXPEDITION AUDIT

For every region:

- at least one understandable route purpose,
- at least one discovery reason,
- meaningful Catchmon/Gear fit.

No region is only a background with loot multipliers.

---

# 178. ELEMENT COLOR SEMANTICS

Element colors are canonical design-system data.

Implementation must:

- reference existing tokens,
- not duplicate hex constants,
- distinguish element color from general CTA/action color,
- maintain contrast.

The element color is semantic.

It does not own every surface in the region.

---

# 179. REGION ACCENT SEMANTICS

Region accents may affect:

- ambient background,
- frames,
- map accents,
- environmental glow.

They should not override:

- success/error colors,
- rarity meaning,
- CTA hierarchy,
- other semantic UI colors.

---

# 180. CTA COLOR PROTECTION

Existing design references reserve the main CTA green for global actions.

Grass/Poison regional palettes must remain visually distinguishable from CTA semantics.

This is an important implementation constraint.

---

# 181. COOL-COLOR COLLISION

The design references explicitly identify close visual neighborhoods among:

- Water,
- Ice,
- Steel,
- Wind.

Art Direction must test them side-by-side.

Mechanical differentiation is equally important.

Do not rely on color alone to communicate element.

---

# 182. ELEMENT ICONS

The project will likely need one canonical icon/symbol per real element.

Before generating new ones:

- inspect existing shared icons/assets,
- preserve canonical meaning,
- use Document 13 for final asset inventory.

No Bug element icon.

---

# 183. REGION VISUAL IDENTITY

Each region should eventually combine:

- element color,
- environment silhouette,
- material language,
- light/atmosphere,
- motion character.

Do not communicate region only through hue shifts.

---

# 184. ENVIRONMENT SHAPE LANGUAGE

Art Direction should distinguish:

- Vulkankrater through volcanic/angular forms,
- Ozean through fluid/layered forms,
- Erdwall through mass/strata,
- Windkamm through vertical/open movement,
- etc.

Exact art is deferred.

This document only requires non-color differentiation.

---

# 185. REGION BACKGROUND ASSET DISCIPLINE

Do not generate dozens of environments before:

- progression bands,
- route package,
- Art Direction,
- asset taxonomy

are approved.

Mechanics come first.

---

# 186. WORLD MAP TOPOLOGY — UX REQUIREMENT

Document 11 will choose final presentation.

The system needs a map/navigation model capable of:

- showing unlocked regions,
- showing a small number of next choices,
- revisiting earlier regions,
- showing readiness/progress,
- not presenting 17 equal buttons from minute one.

---

# 187. MAP DOES NOT DEFINE PROGRESSION

The world map visual should represent progression data.

It should not hardcode region order independently.

Canonical region-unlock data remains the source of truth.

---

# 188. WORLD STORY BOUNDARY

Regions may later contain:

- short lore,
- recurring characters,
- special expeditions.

The base world structure does not require a large linear narrative campaign.

Gameplay identity comes first.

---

# 189. REGIONAL SPECIAL VISITORS

Selected regions may introduce:

- regional researchers,
- collectors,
- specialists.

They should reuse Document 05 customer systems.

---

# 190. REGIONAL COMMISSIONS

A region may enable commissions using:

- regional component,
- regional recipe,
- quality goal.

These are effective cross-loop milestones.

---

# 191. REGIONAL SIGNATURE RECIPE

Not every region requires one at first unlock.

A signature recipe may act as:

- deeper completion reward,
- Catchmon capability interaction,
- special visitor/commission reward.

---

# 192. REGIONAL SIGNATURE CATCHMON

A region may contain especially memorable rare lines.

But normal progression should not imply:

> exactly one legendary boss Catchmon per world.

The roster's real canonical distribution should drive this.

---

# 193. REGION DIFFICULTY BOUNDARY

Later regions may require more developed systems.

But “difficulty” should mean:

- more complex preparation,
- narrower opportunity,
- higher special-component requirements,
- stronger team fit.

Not:

- combat stats,
- brutal fail rates,
- timer inflation only.

---

# 194. WORLD PROGRESSION AND SHOP TRANSFORMATION

New regions should gradually affect the shop visually through:

- merchandise,
- Catchmons,
- trophies,
- customers,
- ambient accents.

The main shop should feel increasingly connected to the larger world.

---

# 195. NO SEPARATE REGIONAL SHOPS BY DEFAULT

The player owns one primary evolving shop.

The game does not require:

- one Fire shop,
- one Water shop,
- 17 separate businesses.

This would fragment the core fantasy and multiply infrastructure complexity.

---

# 196. OPTIONAL OUTPOST BOUNDARY

Regional outposts are not part of the base architecture.

If ever introduced, they require a separate justification.

Do not implement them while building core world progression.

---

# 197. REGION CONTENT SCALING

When adding a new region during development:

### FIRST
mechanical identity.

### SECOND
resource/recipe/route package.

### THIRD
Catchmon mapping.

### FOURTH
customer/world integration.

### FIFTH
visual asset production.

Never begin with background art alone.

---

# 198. REGION DEVELOPMENT PIPELINE

For every region:

## STEP 1 — CONFIRM CANONICAL IDENTITY
Region ID, name, element.

## STEP 2 — DEFINE ECONOMIC SENTENCE
Example:
> “This region rewards durable reusable equipment strategies.”

## STEP 3 — DEFINE RESOURCE ECOLOGY
Routine emphasis + special component role.

## STEP 4 — DEFINE CRAFTING EXPRESSION
2–3 strong product-family relationships.

## STEP 5 — DEFINE CUSTOMER EXPRESSION
Demand/customer tendency.

## STEP 6 — DEFINE EXPEDITION EXPRESSION
Route/environment identity.

## STEP 7 — DEFINE CATCHMON TENDENCY
Without forcing every species into one domain.

## STEP 8 — DEFINE REGIONAL HOOK
One memorable mechanic/strategic theme.

## STEP 9 — CHECK CROSS-REGION LINKS
Why revisit earlier worlds?

## STEP 10 — CHECK DUPLICATION
Does another region already do the same thing?

## STEP 11 — LOCK CONTENT PACKAGE
Routes/resources/recipes/encounters.

## STEP 12 — CREATE ASSET BRIEF
Only then.

---

# 199. WORLD CONTENT MATRIX

Before final content production, maintain a matrix with rows for all 17 regions and columns for:

- element,
- progression band,
- routine resource emphasis,
- special component role,
- product-family emphasis,
- customer tendency,
- expedition intent emphasis,
- Catchmon role distribution,
- regional hook,
- cross-region dependency,
- signature content,
- asset status.

This becomes a core content-planning artifact.

---

# 200. REGION SIMILARITY AUDIT

For every pair of regions, ask:

> Could we swap their names/colors without changing gameplay?

If yes:

their identities are not distinct enough.

---

# 201. REGION VALUE AUDIT

Every unlocked region must provide at least one reason to revisit it after the next region unlocks.

---

# 202. WORLD CHOICE AUDIT

When multiple regions are available, each should represent:

- a meaningful strategic preference,
- not a hidden correct answer.

---

# 203. ELEMENT COMPREHENSION TARGET

A player should gradually be able to associate elements with broad gameplay identity.

Examples:

> “Wind is great for routes/scouting.”

> “Psychic gives me better information.”

> “Earth is useful for big material-heavy crafting.”

The player should not need to memorize 17 modifier tables.

---

# 204. NO ELEMENT BONUS ENCYCLOPEDIA

Do not create a screen listing:

- Fire +7.5% A,
- Water +6% B,
- Grass +4% C

as the primary identity.

Element meaning should emerge from:

- content,
- Catchmons,
- routes,
- products.

---

# 205. WORLD ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — 17 RECOLORS

Same resources/routes/recipes with changed colors.

Result:

World breadth is fake.

---

## ANTI-PATTERN B — 17 CURRENCIES

Every region introduces a token.

Result:

Economy becomes unreadable.

---

## ANTI-PATTERN C — 17 STATIONS

Each element needs its own crafting building.

Result:

Infrastructure explodes.

---

## ANTI-PATTERN D — FULL LINEAR CORRIDOR

Player must progress through all 17 in one rigid order.

Result:

specialization/choice shrink.

---

## ANTI-PATTERN E — FULL OPEN MAP

All regions visible/playable immediately.

Result:

overload/progression collapse.

---

## ANTI-PATTERN F — REGION RESET

New world invalidates old products/materials.

Result:

content becomes disposable.

---

## ANTI-PATTERN G — ELEMENT = COMBAT TYPE

World mechanics drift toward strength/weakness charts.

Result:

non-combat identity collapses.

---

## ANTI-PATTERN H — ELEMENT = PERCENT BONUS

Every element is a modifier line.

Result:

fantasy becomes spreadsheet.

---

## ANTI-PATTERN I — ELEMENT = CATCHMON CLASS

All Fire Catchmons are Workshop, all Wind are Expedition, etc.

Result:

roster becomes predictable and restrictive.

---

## ANTI-PATTERN J — EVERY REGION HAS EVERYTHING

Every region adds all seven product families, all route types, all customer types.

Result:

identity becomes diluted.

---

## ANTI-PATTERN K — ONE MATERIAL PER REGION ONLY

Resources never cross boundaries.

Result:

17 isolated mini-economies.

---

## ANTI-PATTERN L — REGION-LOCKED CATCHMON UTILITY

Catchmon only useful in home region.

Result:

collection value collapses outside local content.

---

## ANTI-PATTERN M — LATE REGION = BIGGER NUMBERS

Only difference is higher price/cost/timer.

Result:

progression loses strategic novelty.

---

## ANTI-PATTERN N — COLOR-ONLY READABILITY

Player identifies world solely through hue.

Result:

accessibility and identity suffer.

---

## ANTI-PATTERN O — LEGACY FUNKEN LEAK

Old `sparksThreshold` values return.

Result:

new progression architecture is bypassed.

---

## ANTI-PATTERN P — BUG ELEMENT RESURRECTION

An obsolete reference-table row becomes a new region.

Result:

canonical roster/world taxonomy is corrupted.

---

# 206. PROTOTYPE WORLD SCOPE

The first prototype does **not** need 17 worlds.

Use:

- 1 starting region,
- 1 contrasting second region or simulated unlock,
- 2 distinct resource profiles,
- 2 distinct expedition identities,
- 2 distinct customer/product effects.

The test is:

> **does a new region feel mechanically different?**

---

# 207. PROTOTYPE REGION A

Use the working starting region:

# VULKANKRATER / FIRE

Demonstrate:

- clear production/resource identity,
- early Catchmon encounter,
- simple expedition.

---

# 208. PROTOTYPE REGION B

Choose a mechanically contrasting element.

Strong candidates for testing include:

- Water,
- Wind,
- Psychic,
- Earth.

The goal is not final progression order.

The goal is contrast.

---

# 209. PROTOTYPE TEST — RECIPE CONTRAST

Question:

> Does entering Region B create different crafting priorities rather than simply higher Recipe Rank?

---

# 210. PROTOTYPE TEST — EXPEDITION CONTRAST

Question:

> Does Region B encourage different Catchmon/Gear selection?

---

# 211. PROTOTYPE TEST — SHOP CONTRAST

Question:

> Does Region B change customer demand or display strategy back at the main shop?

---

# 212. PROTOTYPE TEST — OLD REGION RELEVANCE

After Region B unlocks:

> does the player still have a reason to run Region A?

If no, cross-region design is insufficient.

---

# 213. WORLD TELEMETRY

Later track:

- region unlock order,
- region selection frequency,
- time spent per region,
- revisit frequency,
- route usage,
- resources by region,
- recipes crafted after region unlock,
- customer-demand change,
- Catchmon acquisition by region,
- cross-region recipe usage,
- abandoned regions,
- targeted hunt destinations.

---

# 214. REGION REVISIT HEALTH TARGET

Earlier regions should maintain non-trivial usage after later unlocks.

Exact target percentage is a balancing question.

---

# 215. CHOICE HEALTH TARGET

Where progression offers multiple regional choices:

- different player personas should choose differently,
- no option should be universally correct.

---

# 216. CONTENT DENSITY HEALTH TARGET

A region should contain enough new content to feel important.

It should not dump so much content that the player cannot understand what changed.

---

# 217. ELEMENT ROLE HEALTH TARGET

Elements should influence several systems without each requiring its own rules engine.

---

# 218. CROSS-REGION ECONOMY HEALTH TARGET

Later recipes/commissions should regularly create reasons to combine:

- older resources,
- newer resources,
- different Catchmon capabilities.

---

# 219. WORLD ART HEALTH TARGET

A grayscale screenshot or silhouette-level view should still provide some regional distinction beyond color once final art exists.

---

# 220. CANONICAL WORLD DATA MODEL

When implemented, a region definition should conceptually contain:

```text
regionId
displayName
elementId
progressionBand
economicIdentityId
resourceProfileId
productEmphasis[]
customerDemandProfileId
expeditionProfileId
regionalHookId
homeCatchmonLineIds[]
secondaryCatchmonLineIds[]
routeIds[]
recipeIds[]
unlockRuleId
visualThemeId
```

Exact TypeScript structure belongs to Document 14.

---

# 221. CANONICAL ELEMENT DATA MODEL

Element definitions should conceptually contain:

```text
elementId
displayName
colorTokenRef
iconAssetId
economicIdentityId
resourceTendencies[]
craftingTendencies[]
commerceTendencies[]
expeditionTendencies[]
capabilityTendencies[]
```

Do not store raw hex values in gameplay definitions.

---

# 222. ELEMENT ↔ REGION RELATIONSHIP

The current architecture assumes:

> **one primary home region per canonical element.**

This matches the 17-region identity baseline.

A region may still contain Catchmons/materials with cross-element relationships later.

---

# 223. STABLE IDS

Existing internal region IDs may be retained even where display names differ historically.

Do not rename stable IDs merely for cosmetic cleanliness without migration justification.

Example:

`grasland` may remain the stable internal ID while the display name is Vulkankrater.

---

# 224. LEGACY DATA MIGRATION BOUNDARY

When new technical architecture begins:

- do not copy the old RegionDefinition wholesale,
- create a new Catchmon Shop region model,
- migrate only approved identity fields.

Do not migrate:
- old resourceId,
- sparksThreshold,
- old progression checks.

---

# 225. REGION UNLOCK RULE DATA

New unlock rules should reference the canonical progression condition system from Document 09.

Conceptual examples:

```text
shopRank
requiredInfrastructure
previousWorldMilestone
expeditionMilestone
optionalSpecialRequirement
```

Exact rules remain content/balance work.

---

# 226. WORLD SAVE STATE

Future save data should track:

- unlocked regions,
- region discovery state,
- route discovery/completion,
- regional Catchmon discovery,
- regional completion milestones.

It should not need to save duplicate element-color data.

---

# 227. WORLD VERSIONING

If regional content changes in updates:

- unlocked regions remain unlocked,
- completed milestones remain protected where possible,
- stable region IDs preserve save compatibility.

---

# 228. CONTENT SOURCE OF TRUTH

Do not duplicate region content maps in:

- world map UI,
- expedition code,
- recipe code,
- Catchdex.

Use canonical IDs and registries.

---

# 229. TOKEN-EFFICIENT CLAUDE RULE

When Claude works on one region:

Read:

1. relevant sections of Document 10,
2. canonical region definition,
3. relevant recipes/routes/Catchmons,
4. design tokens only if visual work is involved.

Do not load all 17 region content and all 104 Catchmons for a single-region UI fix.

---

# 230. FULL-ROSTER HANDOFF

After Document 10 is approved, the project has enough architecture to begin:

# `06A_CATCHMON_ROSTER_ROLE_MAPPING.md`

because we now know:

- four Catchmon domains,
- expedition behavior,
- region/element identities,
- progression requirements.

The 104 Catchmons can then be mapped without guessing what an element or region is supposed to mean.

---

# 231. CONTENT HANDOFF

The detailed content phase should eventually create:

- regional material taxonomy,
- region recipes,
- route definitions,
- encounter pools,
- customer profiles,
- Catchmon role mapping.

Those should remain separate content artifacts from this architecture document.

---

# 232. SYSTEM OWNERSHIP BOUNDARIES

To prevent conflicts:

### Document 03 owns
- macro resource/economic rules.

### Document 04 owns
- product families/recipe architecture.

### Document 05 owns
- customer engine.

### Document 06 owns
- Catchmon capability architecture.

### Document 07 owns
- expedition/capture engine.

### Document 08 owns
- physical shop infrastructure.

### Document 09 owns
- progression/gating architecture.

### Document 10 owns
- 17-region/element gameplay identity and regional content-package rules.

### Document 11 will own
- world map/navigation/region UI.

### Document 12 will own
- final region art direction.

### Document 13 will own
- exact world/element asset production list.

---

# 233. LOCKED DECISIONS FROM DOCUMENT 10

The following decisions are considered part of the intended World & Element Structure unless deliberately revised:

1. Catchmon Shop uses the 17 real canonical element identities: Fire, Water, Electric, Grass, Earth, Poison, Normal, Ice, Fairy, Wind, Steel, Psychic, Light, Dark, Ghost, Dragon, Cosmic.
2. `Bug` is not a canonical Catchmon element and must not become an eighteenth region.
3. The current 17 region identity baseline is retained:
   - Vulkankrater / Fire,
   - Ozean / Water,
   - Blitzfeld / Electric,
   - Wildwuchs / Grass,
   - Erdwall / Earth,
   - Giftsumpf / Poison,
   - Graufeld / Normal,
   - Frostgrat / Ice,
   - Feenhain / Fairy,
   - Windkamm / Wind,
   - Erzader / Steel,
   - Traumfeld / Psychic,
   - Lichtung / Light,
   - Schattenriss / Dark,
   - Nebelmoor / Ghost,
   - Drachenschlund / Dragon,
   - Sternenkuppel / Cosmic.
4. Existing internal stable region IDs may remain even where display naming evolved historically.
5. Old Funken/sparksThreshold progression from the legacy region file is not part of Catchmon Shop.
6. Elements represent economic/environmental identities rather than combat strengths/weaknesses.
7. The world does not use a combat type-effectiveness chart.
8. Each region is designed across Resource Ecology, Crafting Expression, Commerce/Demand, Expedition Expression, and Catchmon Capability Tendency.
9. Element tendencies do not force every Catchmon of that element into the same functional domain.
10. Every region introduces a curated content package rather than a full copy of all game systems.
11. The game does not create 17 regional currencies by default.
12. The game does not create 17 region-specific crafting stations.
13. The game does not create 17 separate shops.
14. Routine resource families should cross regional boundaries where useful.
15. Special components may be more region-specific.
16. Advanced recipes should increasingly create cross-region dependencies.
17. Unlocking a new region must not invalidate older regions.
18. Every region should retain at least one meaningful long-term revisit reason.
19. Regional recipes are curated and do not automatically create one variant of every product family.
20. Regional expedition packages should usually support more than one player goal.
21. Encounter pools should remain coherent and targetable rather than enormous.
22. Catchmon lines should have a primary home region and may optionally have secondary habitats.
23. Catchmons remain useful outside their home region.
24. The preferred world progression architecture uses staged progression bands with controlled regional choice rather than a rigid 17-step corridor.
25. All 17 regions are not open at the start.
26. Regional choices are sequencing choices rather than permanent account locks.
27. The existing Vulkankrater/Fire region remains the working starting-region assumption pending onboarding validation.
28. Normal region access combines Global Readiness and World Readiness with only limited optional special gating.
29. Region access does not require 100% regional completion.
30. Regional completion is a long-term optional mastery/collection objective.
31. New regions should affect the central shop through customers, products, Catchmons, trophies, and demand.
32. The main shop remains the central commerce space rather than creating one independent shop per region.
33. There is no mandatory single “active region” that disables all other available destinations.
34. Region-specific content uses the existing five production-station architecture.
35. Region-specific content uses the existing storage/display/customer engines.
36. Fire/Vulkankrater's design compass is Transformation / intensity.
37. Water/Ozean's design compass is Flow / care / preservation.
38. Electric/Blitzfeld's design compass is Tempo / precision / signal.
39. Grass/Wildwuchs's design compass is Growth / abundance / renewal.
40. Earth/Erdwall's design compass is Stability / mass / foundation.
41. Poison/Giftsumpf's design compass is Extraction / chemistry / refinement.
42. Normal/Graufeld's design compass is Reliability / flexibility / adaptability.
43. Ice/Frostgrat's design compass is Preservation / precision / control.
44. Fairy/Feenhain's design compass is Delight / presentation / appeal.
45. Wind/Windkamm's design compass is Mobility / scouting / logistics.
46. Steel/Erzader's design compass is Durability / tools / reusable utility.
47. Psychic/Traumfeld's design compass is Information / forecasting / insight.
48. Light/Lichtung's design compass is Clarity / quality / revelation.
49. Dark/Schattenriss's design compass is Subtlety / hidden/selective opportunity.
50. Ghost/Nebelmoor's design compass is Traces / memory / elusive discovery.
51. Dragon/Drachenschlund's design compass is Mastery / prestige / difficult craftsmanship.
52. Cosmic/Sternenkuppel's design compass is Anomaly / synthesis / cross-region possibility.
53. Nearby thematic elements must pass explicit collision audits.
54. Element colors and region accents must reference the canonical design-system tokens.
55. Element color must not overwrite unrelated UI semantics such as CTA, success, error, or rarity.
56. Region identity must remain readable beyond color alone.
57. The world map will reflect canonical progression data rather than owning unlock logic.
58. Detailed region assets are not produced before progression, UX, Art Direction, and Asset Taxonomy are approved.
59. Canonical world/element data must be registry/data-driven.
60. The full 104-Catchmon role mapping should begin only after the world/element architecture is stable.

---

# 234. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- final region unlock order,
- exact progression bands,
- which regions are offered as choices in each band,
- final confirmation of Vulkankrater as launch starting region,
- exact routine material taxonomy,
- exact regional material names,
- exact special-component names,
- exact regional recipe lists,
- exact regional customer archetypes,
- exact route lists,
- exact encounter pools,
- exact home-region mapping for every Catchmon line,
- exact secondary habitats,
- exact region completion model,
- exact region-completion rewards,
- exact special visitor mapping,
- exact signature recipe mapping,
- exact regional Catchmon rarity distribution,
- exact world map layout,
- exact environmental art,
- exact region icons,
- exact element icons if existing assets are insufficient,
- exact dynamic weather/condition systems.

These belong to roster mapping, content production, Documents 11–14, and balancing.

---

# 235. DEPENDENCY HANDOFF TO DOCUMENT 11

Documents 01–10 now define the complete high-level game system:

- core loop,
- economy,
- products,
- customers,
- Catchmons,
- expeditions,
- infrastructure,
- progression,
- 17 worlds/elements.

The next question is:

> **How does a player actually see, understand, navigate, and operate all of this on a mobile-first screen without the game becoming a wall of menus?**

Document 11 must turn the architecture into a coherent information and interaction system.

---

# 236. NEXT DOCUMENT

## `11_CATCHMON_SHOP_UX_AND_INFORMATION_ARCHITECTURE.md`

Document 11 should define:

### Main shop screen
- what is always visible,
- what is spatial,
- what is contextual.

### Navigation
- top-level destinations,
- bottom navigation / contextual navigation,
- back-stack behavior.

### Customer interaction
- request presentation,
- transaction actions,
- Momentum visibility.

### Crafting UX
- station access,
- recipe list,
- queues,
- mastery/quality.

### Catchmon UX
- roster,
- assignment,
- Level/evolution,
- capability visibility,
- synergy.

### Expedition UX
- world map,
- region choice,
- route selection,
- team/loadout,
- results,
- encounters/capture.

### Progression UX
- Shop Rank,
- next milestone,
- locked content preview,
- goals.

### Inventory
- materials,
- products,
- reserved stock,
- special components.

### Information hierarchy
- what appears on main screen,
- what appears in bottom sheet,
- what requires a full screen.

### Mobile interaction standards
- touch targets,
- density,
- gestures,
- no precision placement.

### Notification hierarchy
- ready crafts,
- customers,
- expeditions,
- rare encounters,
- upgrades.

Only after Document 11 is stable should the final Art Direction and Asset Taxonomy be locked.

---

# 237. DEFINITION OF DONE FOR WORLD & ELEMENT STRUCTURE

Document 10 is ready to hand off when the project can answer:

- What are the 17 canonical elements?
- Which home region belongs to each element?
- Which legacy region data is reusable?
- Which legacy progression data is explicitly rejected?
- Is Bug an element?
- What does an element mean without combat?
- How is every region differentiated across resources, crafting, customers, expeditions, and Catchmons?
- What is the high-level economic identity of each of the 17 elements?
- How are nearby element identities kept distinct?
- Do regions introduce new currencies?
- Do regions introduce new stations?
- How do regional resources cross boundaries?
- How do advanced recipes keep old regions relevant?
- How are regional Catchmon pools structured?
- How does region progression balance structure with player choice?
- Is the world fully linear?
- Is the world fully open?
- What is the current starting-region assumption?
- How does regional progression affect the main shop?
- How do Catchmons remain useful outside their home region?
- How is regional completion treated?
- How are element colors sourced and protected semantically?
- What content/audit pipeline is required before building all 17 regions?
- Why can the full 104-Catchmon mapping now begin after the remaining UX architecture?
- Which details intentionally remain open for content, UX, art, and balancing?

If these answers remain coherent during prototype and roster mapping, the project can move into UX & Information Architecture without needing to redefine what the 17 worlds are supposed to mean.
