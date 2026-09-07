# CATCHMON SHOP — 09 PROGRESSION & UNLOCK ARCHITECTURE

**Status:** Progression & Unlock Architecture v1  
**Purpose:** Define the complete progression spine of Catchmon Shop: which systems exist at each stage, how the player advances through shop growth, recipes, customers, Catchmons, expeditions, regions, mastery, evolution, and specialization, and how new complexity is introduced without grind, reset loops, or early overload  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  
- `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`  
- `06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`  
- `07_CATCHMON_SHOP_ACQUISITION_AND_EXPEDITIONS.md`  
- `08_CATCHMON_SHOP_SHOP_GROWTH_AND_INFRASTRUCTURE.md`  

**Authority:** This document owns:
- the global progression spine,
- the primary account/shop progression meter,
- system introduction order,
- onboarding unlock cadence,
- early/mid/late progression phases,
- infrastructure unlock sequencing,
- recipe progression sequencing,
- customer-system progression,
- Catchmon progression pacing architecture,
- Catchmon Level progression purpose and milestone structure,
- evolution pacing architecture,
- expedition progression,
- region/world access progression,
- specialization timing,
- horizontal-vs-vertical progression balance,
- progression recovery rules,
- anti-grind rules,
- long-term objective structure,
- prestige/reset boundary,
- progression prototype and telemetry requirements.

**Out of scope:**  
- exact numeric Shop Rank XP curve,
- exact Shop Rank count,
- exact Coin costs,
- exact station upgrade costs,
- exact recipe values,
- exact Catchmon XP values,
- exact Catchmon level cap,
- exact evolution level numbers,
- exact region names/order,
- exact region unlock requirements,
- exact encounter odds,
- exact product list,
- exact 104-Catchmon role mapping,
- final tutorial copy,
- final UX,
- final visual progression art,
- monetization,
- live-event progression.

---

# 1. WHY THIS DOCUMENT EXISTS

Documents 01–08 define **what the game contains**.

Document 09 defines:

> **when the player gets it.**

Without a progression architecture, even strong systems can create a bad game.

If everything unlocks immediately:

- the player is overwhelmed,
- systems compete for attention,
- learning becomes impossible,
- rewards lose meaning.

If everything unlocks too slowly:

- the early game feels shallow,
- the player waits for the “real game,”
- progression feels artificially withheld.

If every system uses its own level/currency/bar:

- the game becomes administratively dense.

If progression is only:

> bigger number → bigger number → bigger number,

the game becomes stale.

The target is:

> **a steady sequence of new possibilities layered onto a loop the player already understands.**

---

# 2. PROGRESSION DESIGN THESIS

The progression thesis is:

> **Teach one meaningful decision, let the player use it, then unlock the next layer that changes the decisions available.**

Progression should therefore prioritize:

1. new capabilities,
2. new choices,
3. new strategic relationships,
4. then numerical improvement.

The player should repeatedly feel:

> **“Now I can do something I could not do before.”**

rather than only:

> “My numbers are 12% larger.”

---

# 3. THE PROGRESSION STACK

Catchmon Shop uses **one primary global progression spine** and several specialized progression layers.

## PRIMARY GLOBAL PROGRESSION

# **SHOP RANK**

Working player-facing name.

Shop Rank represents:

- business growth,
- commercial reputation,
- operational capability,
- overall progression through the game.

It is **not a currency**.

It is not spent.

---

# 4. WHY SHOP RANK EXISTS

The game needs one high-level answer to:

> **“How far has my shop progressed?”**

Shop Rank gives the player:

- a clear long-term bar,
- broad feature unlocks,
- infrastructure access,
- progression milestones.

Without it, every unlock would need arbitrary conditions across:

- Coins,
- recipes,
- Catchmons,
- regions,
- infrastructure.

That would become hard to understand.

---

# 5. SHOP RANK DOES NOT REPLACE OTHER PROGRESSION

Shop Rank is the **spine**, not the entire skeleton.

Specialized systems retain their own relevant progression:

- Recipe Mastery,
- station capability,
- Catchmon Level,
- Catchmon evolution,
- region discovery,
- collection progress.

Shop Rank opens doors.

Specialized progression determines how deeply the player develops inside those doors.

---

# 6. SHOP RANK IS NOT SHOP LEVEL + REPUTATION + XP AS THREE SYSTEMS

The base architecture should **not** create:

- Shop Level,
- Reputation Level,
- Merchant Level,
- Account Level

as separate global bars.

One primary meter is enough.

Working semantic model:

> **Shop Rank represents earned reputation and operational growth.**

If the final UI wants the word “Reputation,” that is naming.

It should not become another independent progression layer unless later justified.

---

# 7. SHOP RANK PROGRESS SOURCES

Shop Rank progress should primarily come from meaningful core-game actions.

Potential source classes:

## COMMERCE
- completed customer transactions,
- higher-value transactions,
- special visitor outcomes.

## ORDERS
- completed Everyday/Specialized orders,
- commissions.

## CRAFTSMANSHIP
- first-time recipe milestones,
- mastery milestones.

## COLLECTION
- first capture of a new line,
- evolution milestones.

## WORLD
- first route completion,
- region discoveries,
- special expedition milestones.

Exact contribution values are deferred.

---

# 8. SHOP RANK SHOULD NOT BE FARMED BY ONE TRIVIAL ACTION

Avoid:

> craft cheapest item 10,000 times for optimal Shop Rank.

Progress sources should use:

- diminishing repeat value,
- milestone value,
- value-aware commerce,
- activity diversity.

Routine sales can still contribute.

But major progress should come from meaningful breadth and milestones.

---

# 9. SHOP RANK IS NOT SPENDABLE

The player never asks:

> “Should I spend Shop Rank on this station or save it?”

That is the job of Coins/resources.

Shop Rank is:

> **achievement state / access state.**

---

# 10. SPECIALIZED PROGRESSION LAYERS

The complete base progression model contains:

1. **Shop Rank**
2. **Infrastructure Progression**
3. **Recipe Progression**
4. **Recipe Mastery**
5. **Catchmon Level**
6. **Catchmon Evolution**
7. **Collection Progress**
8. **Expedition / Discovery Progress**
9. **Region / World Access**

These are not all displayed equally at all times.

---

# 11. PROGRESSION COMPLEXITY RULE

A progression layer should only become visible when the player can meaningfully act on it.

Example:

Do not show:

> Mastery 0/100

before Recipe Mastery is unlocked.

Do not show:

> Region 12 locked

on the first screen if the player cannot understand regions yet.

Hidden complexity is preferable to premature UI clutter.

---

# 12. SYSTEM INTRODUCTION PHILOSOPHY

The system order should follow the player's mental model.

The player first learns:

> I make things and sell them.

Then:

> I can manipulate the value of a sale.

Then:

> what I display changes demand.

Then:

> Catchmons improve how my shop works.

Then:

> I can send Catchmons into the world.

Then:

> the world gives me rare inputs and new Catchmons.

Then:

> I can specialize and master.

This order is more important than exact minutes.

---

# 13. PROGRESSION PHASE ARCHITECTURE

The base game is structured into **nine progression phases**.

These are functional phases, not necessarily visible chapter names.

1. **Opening Shop**
2. **Active Commerce**
3. **Operational Growth**
4. **Catchmon Workforce**
5. **World Opening**
6. **Specialization**
7. **Regional Expansion**
8. **Advanced Mastery**
9. **Grand Shop / Collection Endgame**

---

# 14. PHASE 1 — OPENING SHOP

## Player fantasy

> “I own a tiny shop and I can already make and sell useful things.”

## Systems active

- basic Coin economy,
- 1 production station,
- 2–3 recipes,
- small material storage,
- 2–3 displays,
- Walk-In Customers,
- Standard Sale,
- basic Shop Rank progress.

## Systems intentionally hidden

- Favorable Deal,
- Premium Pitch,
- Recommend,
- Recipe Mastery,
- Quality,
- Orders,
- Focused Customers,
- Expeditions,
- Special Components,
- advanced Catchmon assignment,
- synergies,
- region map complexity.

---

# 15. PHASE 1 DESIGN GOAL

The first lesson is only:

> **Make → Display → Sell → Earn → Improve**

The player should understand the shop before learning optimization.

---

# 16. FIRST 60 SECONDS TARGET

A strong first minute should include:

1. obvious craftable product,
2. short craft or ready starting stock,
3. visible customer,
4. Standard Sale,
5. Coins gained,
6. obvious next upgrade/craft.

The player should complete the core commercial loop quickly.

---

# 17. FIRST 5 MINUTES TARGET

Within roughly the first few minutes, the player should experience:

- multiple crafts,
- several customers,
- first infrastructure purchase,
- visible improvement to shop state,
- first meaningful product-choice difference.

The exact minute count is a tuning target.

The important rule is:

> **the game feels alive before it becomes complex.**

---

# 18. PHASE 2 — ACTIVE COMMERCE

## Player fantasy

> “I am not just selling — I am managing how I sell.”

Systems introduced progressively:

1. Shop Momentum
2. Favorable Deal
3. Premium Pitch
4. Recommend

Do not introduce all four in one tutorial popup.

---

# 19. MOMENTUM INTRODUCTION ORDER

Recommended sequence:

### STEP A
Standard Sale generates small Momentum.

Player notices meter.

### STEP B
Favorable Deal unlocks.

Player learns:

> lower Coins now → more Momentum.

### STEP C
Premium Pitch unlocks.

Player learns:

> save Momentum → bigger sale.

### STEP D
Recommend unlocks.

Player learns:

> Momentum can also control inventory/demand.

This teaches the resource as a cycle.

---

# 20. WHY RECOMMEND COMES AFTER PREMIUM PITCH

Premium Pitch has an easier mental model:

> spend resource → more value.

Recommend is more strategic:

> redirect customer to compatible stock.

The player should already understand:

- customer request,
- display,
- Momentum

before learning Recommend.

---

# 21. PHASE 2 SUCCESS CONDITION

The player should be able to explain:

> “I can use cheap/less-profitable deals to build Momentum, then spend it on important sales or recommendations.”

Only then should the game add more customer complexity.

---

# 22. PHASE 3 — OPERATIONAL GROWTH

## Player fantasy

> “My shop is becoming an actual business.”

Systems introduced:

- additional recipes,
- second production station,
- storage pressure,
- infrastructure upgrades,
- Everyday Orders,
- early Display strategy,
- first basic product-family differentiation.

---

# 23. ORDERS INTRODUCTION

Everyday Orders should unlock only after the player already understands:

- crafting,
- product stock,
- customers.

The first order should be simple:

> make/supply a known product.

It should teach:

> customer demand can become a production objective.

---

# 24. NO QUALITY YET IF BASIC PRODUCTION IS STILL NEW

Quality should not unlock merely because enough time passed.

It should unlock when:

- the player has repeated known recipes,
- standard production is comfortable,
- a higher-value outcome would now be meaningful.

---

# 25. RECIPE MASTERY INTRODUCTION

Recipe Mastery should unlock around the point where the player has:

- several recipes,
- repeated crafting,
- a reason to care about favorite products.

The first mastery milestone should arrive quickly enough to demonstrate value.

---

# 26. MASTERY FIRST LESSON

The first mastery reward should be simple and visible.

Example class:

- craft faster,
- improved quality once Quality exists,
- unlock next branch.

Avoid introducing three mastery reward types simultaneously.

---

# 27. PHASE 4 — CATCHMON WORKFORCE

## Player fantasy

> “My Catchmons are not just collection art — they change my shop.”

Systems introduced:

- first functional Catchmon assignment,
- Workshop or Shop Floor role,
- visible Catchmon workplace presence,
- Catchmon Level,
- first simple Catchmon capability,
- second role/domain soon after.

---

# 28. FIRST CATCHMON ASSIGNMENT

The first functional assignment should be extremely clear.

Good shape:

> assign Catchmon to this station → see concrete relevant effect.

Do not begin with:

- four role slots,
- synergy tags,
- secondary domain,
- complex conditions.

---

# 29. CATCHMON LEVEL INTRODUCTION

Catchmon Level should become visible after the player has used a Catchmon enough to understand its role.

The first lesson:

> **using a Catchmon develops it.**

The player should not be asked to distribute skill points.

---

# 30. CATCHMON LEVEL — STRUCTURE

The intended progression architecture uses:

- many small participation increments,
- a small number of meaningful ability milestones,
- evolution milestones.

Exact level cap remains open.

---

# 31. LEVEL MILESTONE MODEL

Rather than every level granting a new effect:

## MOST LEVELS
small/implicit development progress.

## KEY LEVELS
meaningful capability improvement.

## EVOLUTION MILESTONES
major identity development.

This keeps progression readable.

---

# 32. LEVEL CURVE PHILOSOPHY

Catchmon leveling should use:

- fast early development,
- gradually slower later development,
- no extreme exponential grind.

The player should see early attachment/progress quickly.

---

# 33. CATCHMON XP SOURCE WEIGHTING

Catchmons should develop fastest by doing relevant work.

Example:

Workshop Catchmon:

- supported craft completion = meaningful XP.

Shop Floor Catchmon:

- relevant customer resolution = meaningful XP.

Expedition Catchmon:

- route completion/discovery = meaningful XP.

This reinforces identity.

---

# 34. NO AFK LEVEL FARM AS PRIMARY METHOD

Infrastructure may later assist development.

But the fastest/most meaningful development comes from actual use.

---

# 35. PHASE 5 — WORLD OPENING

## Player fantasy

> “My shop is connected to a larger Catchmon world.”

Systems introduced:

- Expedition Hub,
- first Supply Run,
- first Discovery Survey,
- first Field Gear utility,
- first Trace,
- first wild Catchmon encounter,
- first capture.

---

# 36. EXPEDITIONS SHOULD NOT OPEN TOO EARLY

The player should already understand:

- why materials matter,
- why Catchmons matter,
- why crafted Gear matters.

Otherwise expeditions feel like disconnected timers.

---

# 37. FIRST EXPEDITION ORDER

Recommended learning order:

1. Supply Run
2. Discovery Survey
3. Capture encounter
4. Component Hunt
5. Support Catchmon / synergy later

This moves from predictable to uncertain.

---

# 38. WHY SUPPLY RUN FIRST

Supply Run has obvious meaning:

> send Catchmon → get useful materials.

It teaches the expedition interface without rare-RNG complexity.

---

# 39. FIRST DISCOVERY

After basic expedition understanding, introduce:

> Traced Catchmon.

The player learns:

> exploration creates collection opportunities.

---

# 40. FIRST CAPTURE

The first capture opportunity should be:

- forgiving,
- readable,
- meaningful.

The newly captured Catchmon should ideally open a distinct gameplay role.

---

# 41. SPECIAL COMPONENT INTRODUCTION

Special Components should become important only after:

- routine crafting is understood,
- premium/advanced recipes exist,
- Component Hunt has meaning.

Do not introduce rare components as useless inventory before their recipes exist.

---

# 42. PHASE 6 — SPECIALIZATION

## Player fantasy

> “I am choosing what kind of shop I want to run.”

Systems introduced/deepened:

- product-family specialization,
- Focused Customers,
- specialized displays,
- Recipe Quality,
- Specialized Orders,
- Catchmon synergy,
- secondary Catchmon domains,
- advanced station upgrades.

---

# 43. QUALITY INTRODUCTION

Quality unlocks here or slightly earlier depending on playtest.

The player must already understand:

- base product value,
- recipe repetition,
- customer value.

Then Fine/Masterwork creates excitement.

---

# 44. QUALITY FIRST LESSON

The first quality result should be celebrated.

The player learns:

> this is the same product, but a better crafted outcome.

Do not introduce:

- quality-specific inventory sorting,
- quality-specific commissions,
- special visitors

all at once.

---

# 45. QUALITY PROGRESSION ORDER

Recommended:

1. Fine appears.
2. Fine has increased value.
3. Mastery improves Fine chance.
4. selected customers prefer quality.
5. Masterwork appears.
6. premium commissions/special visitors care about Masterwork.

This creates layered learning.

---

# 46. SPECIALIZED CUSTOMERS

Focused Customers should enter when the player can actually prepare different product families.

Their purpose is to reward:

- display strategy,
- product specialization,
- Catchmon setup.

---

# 47. CATCHMON SYNERGY INTRODUCTION

Synergy should unlock only after:

- the player owns several Catchmons,
- multiple active support slots exist,
- primary roles are understood.

The first synergy should be obvious:

> these two work well together because they share/complement a visible tag.

---

# 48. NO SYNERGY SYSTEM AT ONE CATCHMON

Do not show synergy tags in the first minutes if the player owns only one meaningful active Catchmon.

A system should appear when it creates a choice.

---

# 49. PHASE 7 — REGIONAL EXPANSION

## Player fantasy

> “My business reaches new parts of the Catchmon world.”

Systems introduced/deepened:

- additional regions,
- new elements,
- new route pools,
- regional materials,
- regional product packages,
- new Catchmon lines,
- region-specialized customer demand,
- advanced expedition Gear.

---

# 50. REGION UNLOCK DESIGN

Region access should be a **multi-signal milestone**, but not a checklist nightmare.

A normal region unlock should use a small combination such as:

- minimum Shop Rank,
- previous region progression,
- one meaningful world/shop milestone.

Avoid five simultaneous gates.

---

# 51. NO LEGACY FUNKEN THRESHOLD

Do not reuse:

- Funken balance,
- lifetime Funken thresholds

from the old project.

Region progression now belongs to Catchmon Shop's new structure.

---

# 52. REGION UNLOCK SHOULD FEEL EARNED

The player should understand:

> what they need to do next.

Region access should not be:

- hidden RNG,
- mysterious invisible trigger.

---

# 53. REGION UNLOCK SHOULD NOT BE PURE SHOP RANK

Shop Rank alone should not automatically open every region.

The world should also care about:

- expedition/discovery progression,
- relevant milestone.

This keeps world progression connected to world play.

---

# 54. REGION PROGRESSION MODEL

Conceptually, region access should use:

# GLOBAL READINESS
Shop Rank / infrastructure capability.

+

# WORLD READINESS
previous region discovery/expedition milestone.

+

# OPTIONAL SPECIAL REQUIREMENT
for selected signature regions only.

This structure is preferred.

---

# 55. REGION DOES NOT RESET THE ECONOMY

Unlocking a region does not mean:

> throw away old items/materials/Catchmons.

New regions expand:

- recipes,
- resources,
- routes,
- Catchmons,
- demand.

They do not replace the previous world.

---

# 56. PHASE 8 — ADVANCED MASTERY

## Player fantasy

> “My shop is mature; now I optimize combinations, mastery, and rare opportunities.”

Systems emphasized:

- Masterwork crafting,
- advanced Recipe Mastery,
- signature recipes,
- commissions,
- special visitors,
- advanced Catchmon synergies,
- rare components,
- targeted Catchmon hunting,
- advanced expeditions,
- infrastructure specialization.

---

# 57. ADVANCED MASTERY IS NOT JUST HIGHER NUMBERS

Advanced progression should increasingly offer:

- specialized recipe branches,
- rare customer opportunities,
- unique Catchmon capabilities,
- route access,
- information improvements.

It should not become:

> all bonuses +2%.

---

# 58. PHASE 9 — GRAND SHOP / COLLECTION ENDGAME

## Player fantasy

> “I built a legendary Catchmon commerce hub and now pursue completion, mastery, and preferred strategies.”

Long-term objectives include:

- Catchmon collection completion,
- evolution-stage completion,
- Recipe Mastery,
- infrastructure completion,
- signature recipes,
- rare special visitors,
- targeted shiny hunting,
- optimized shop builds,
- advanced region completion.

---

# 59. ENDGAME DOES NOT REQUIRE RESET

The base architecture does **not** use mandatory prestige/reset progression.

This is a locked design direction.

---

# 60. NO PRESTIGE RESET — CORE DECISION

Catchmon Shop does not currently use:

> reset shop → lose infrastructure → gain meta currency → repeat.

Reasons:

- the shop fantasy emphasizes building something persistent,
- Catchmon attachment benefits from permanence,
- infrastructure visual growth should remain meaningful,
- the game already has many long-term progression layers.

A reset loop would undermine the core fantasy.

---

# 61. PRESTIGE MAY ONLY RETURN WITH STRONG PROOF

If later playtesting finds a long-term progression problem, a prestige-like system would require explicit redesign.

It is **not assumed**.

Do not implement legacy prestige logic.

---

# 62. HORIZONTAL VS VERTICAL PROGRESSION

Catchmon Shop needs both.

## VERTICAL
You become better at an existing activity.

Examples:

- faster crafting,
- more storage,
- higher quality chance.

## HORIZONTAL
You gain a new activity/strategy.

Examples:

- new station,
- new customer type,
- new region,
- new Catchmon capability,
- new expedition route.

The game should favor horizontal progression early/mid game.

---

# 63. PROGRESSION MIX TARGET

A healthy progression sequence should frequently alternate:

> vertical improvement

with

> horizontal unlock.

Example:

- upgrade display capacity,
- unlock Focused Customer,
- improve station,
- unlock Discovery Survey,
- improve Catchmon,
- unlock new region.

This prevents monotony.

---

# 64. NO NUMBER-ONLY STRETCHES

Avoid long periods where the only rewards are:

- +5% speed,
- +10 storage,
- +3% value.

Meaningful possibility unlocks should appear regularly.

---

# 65. PRIMARY PROGRESSION GATES

Major systems may use one of four gate classes:

1. **Shop Rank Gate**
2. **Infrastructure Gate**
3. **Mastery / Capability Gate**
4. **World / Collection Gate**

Use the smallest necessary combination.

---

# 66. SHOP RANK GATE

Best for:

- broad system unlocks,
- new infrastructure categories,
- major complexity layers.

Example:

> Shop Rank qualifies player to build Expedition Hub.

---

# 67. INFRASTRUCTURE GATE

Best for:

- capacity/capability dependencies.

Example:

> upgraded Fieldworks Bench required for advanced Gear recipe.

---

# 68. MASTERY / CAPABILITY GATE

Best for:

- deeper specialized content.

Example:

> Mastered recipe unlocks advanced branch.

---

# 69. WORLD / COLLECTION GATE

Best for:

- region-specific recipes,
- Catchmon-enabled routes,
- signature progression.

---

# 70. GATE COUNT RULE

Normal unlocks should use:

> one primary gate

plus at most:

> one meaningful secondary condition.

Avoid:

- Rank 20,
- Station 8,
- Catch 40 species,
- Master 15 recipes,
- own 500k Coins

for a single normal unlock.

---

# 71. COINS ARE NOT A PROGRESSION LEVEL

Coins buy upgrades.

Coins should generally **not** be used as:

> “own X Coins simultaneously to unlock region.”

Spending should not punish progression eligibility.

---

# 72. LIFETIME ECONOMIC METRICS — BOUNDARY

If a progression condition uses economic achievement, prefer:

- total sales milestone,
- completed infrastructure,
- Shop Rank,

rather than current Coin balance.

Do not punish the player for investing.

---

# 73. SHOP RANK MILESTONE REWARDS

Shop Rank should primarily unlock:

- access,
- infrastructure,
- system capability,
- visual milestones.

Avoid paying large piles of Coins simply for ranking up.

Progression should unlock opportunities to earn value.

---

# 74. SHOP RANK REWARD TYPES

Good reward classes:

- new station eligibility,
- display expansion eligibility,
- customer layer,
- Expedition Hub eligibility,
- order type,
- new infrastructure zone,
- new quality/mastery layer.

---

# 75. SHOP RANK SHOULD NOT FULLY AUTO-UNLOCK

Rank can **qualify** a feature.

The player may still need to:

- purchase infrastructure,
- complete a world milestone,
- discover recipe.

This maintains investment decisions.

---

# 76. INFRASTRUCTURE PROGRESSION SPINE

Infrastructure should roughly unfold:

1. starter Sales Floor + Provision Station,
2. first display/storage upgrade,
3. second station,
4. Catchmon support position,
5. order/customer expansion,
6. Expedition Hub,
7. additional stations,
8. specialized displays/storage,
9. expanded Catchmon slots,
10. advanced shop macro expansions.

Exact order will be tuned.

---

# 77. STATION UNLOCK ORDER PRINCIPLE

Stations unlock when their product-family roles become useful.

Do not unlock a station before:

- its material sources,
- customers,
- recipes

make sense.

---

# 78. ALL FIVE STATIONS SHOULD NOT BE EARLY

The starting player should not see:

- five station tabs,
- 35 locked recipes.

Systems appear as the shop expands.

---

# 79. DISPLAY PROGRESSION

Display progression should move from:

- few general slots

toward:

- broader portfolio,
- premium presentation,
- specialization.

Display capacity should grow slowly enough that stocking choices remain meaningful.

---

# 80. STORAGE PROGRESSION

Storage should:

- start slightly constrained,
- expand through useful upgrades,
- remain relevant as resource variety grows.

Do not make early storage so tiny that the player constantly hits caps.

---

# 81. CUSTOMER CAPACITY PROGRESSION

Customer capacity should rise with:

- shop size,
- selling-system familiarity,
- QoL.

Do not create more active customers than the player can comfortably process.

---

# 82. ORDER PROGRESSION

Order progression:

1. Everyday Order
2. more active order capacity
3. Specialized Order
4. Commission
5. Signature Commission

Each layer adds complexity only when crafting breadth supports it.

---

# 83. SPECIAL VISITOR PROGRESSION

Special Visitors should appear after:

- normal/focused customers are understood,
- premium stock exists,
- quality/special products have meaning.

---

# 84. RECIPE PROGRESSION — CORE STRUCTURE

Recipe progression combines:

- Shop Rank qualification,
- station capability,
- prerequisite Mastery,
- region discovery,
- Catchmon capability.

Not every recipe uses every gate.

---

# 85. RECIPE RANK PROGRESSION

Recipe Rank represents production sophistication.

Higher Recipe Rank should unlock gradually across:

- station progression,
- shop progression,
- world access.

Recipe Rank should not equal player level directly.

---

# 86. CORE RECIPES

Core recipes should remain accessible with:

- simple requirements,
- routine materials.

They keep the shop functioning.

---

# 87. ADVANCED RECIPES

Advanced recipes should increasingly rely on:

- special components,
- Mastery,
- region access,
- Catchmon capability.

---

# 88. SIGNATURE RECIPES

Signature recipes are milestone content.

Their unlock may combine:

- discovery,
- Catchmon line,
- region,
- special visitor,
- commission.

They should not be random rare drops with no protection.

---

# 89. RECIPE MASTERY PACING

Mastery should have:

- quick first milestone,
- meaningful middle milestone,
- longer optional final mastery.

The player should understand its value early.

---

# 90. MASTERY SHOULD NOT BLOCK BREADTH

The player should not need to Master every recipe to unlock the next region.

Mastery gates should be:

- local,
- thematic,
- limited.

---

# 91. QUALITY PROGRESSION

Quality should become more relevant over time.

Early:
- Standard mostly.

Then:
- Fine occasionally.

Later:
- Masterwork becomes achievable through mastery/specialization.

Quality should not create immediate inventory complexity.

---

# 92. CATCHMON LEVEL ARCHITECTURE — LOCKED SHAPE

Catchmon Level uses:

- fast early gains,
- slower long-term development,
- milestone-based capability improvement.

Exact numeric level cap remains open for balancing.

---

# 93. RECOMMENDED LEVEL-STRUCTURE SHAPE

The final system should likely use a **moderate visible level range**, not hundreds/thousands of levels.

Reason:

- capability milestones should remain memorable,
- player should understand progress,
- 104 Catchmons already create breadth.

Exact cap remains deferred.

---

# 94. CATCHMON LEVEL MILESTONE TYPES

Potential milestone classes:

## EARLY
Core capability improvement.

## MID
Developed capability / stronger specialization.

## EVOLUTION
Visual + mechanical development.

## LATE
Signature capability / mastery-style improvement.

Not every line needs identical milestone count.

---

# 95. EVOLUTION PACING

Evolution should not happen:

- immediately after capture,
- only after extreme grind.

The player should have time to:

- learn base-stage identity,
- use it,
- become attached.

Then evolution creates a meaningful upgrade.

---

# 96. EVOLUTION REQUIREMENT MODEL

Preferred architecture:

# PRIMARY REQUIREMENT
Catchmon development/Level milestone.

+

# OPTIONAL THEMATIC REQUIREMENT
one of:
- region material,
- use milestone,
- discovery,
- crafted evolution-support item.

Avoid multiple simultaneous arbitrary requirements.

---

# 97. EVOLUTION RESOURCE BOUNDARY

Evolution may use a crafted/material requirement.

It should not introduce:

> universal Evolution Currency

by default.

Use meaningful world/material content instead.

---

# 98. EVOLUTION AND RARITY

Higher rarity may influence:

- development pacing,
- special requirement complexity.

It should not make rare Catchmons absurdly harder to use.

---

# 99. EVOLUTION AND COLLECTION

Evolution contributes to:

- Catchdex completion,
- long-term goals,
- Shop Rank milestones where appropriate.

This gives development account-level meaning without duplicate farming.

---

# 100. COLLECTION PROGRESSION

Collection should produce:

- capability breadth,
- optional milestone rewards,
- completion goals.

It should not become a mandatory percentage gate for all systems.

---

# 101. COLLECTION MILESTONE REWARDS

Good classes:

- visual trophies,
- special shop cosmetic,
- small infrastructure convenience,
- special expedition clue,
- non-essential recipe opportunity.

Avoid huge global economy multipliers.

---

# 102. EXPEDITION PROGRESSION

Expedition progression should unlock:

- new route intents,
- more concurrent capacity,
- Support slots,
- preparation options,
- better route information,
- targeting tools,
- new regions.

---

# 103. EXPEDITION SLOT PACING

The player should first learn:

> one route, one team, one result.

Additional slots arrive after:

- route decisions are understood,
- enough Catchmons exist to create opportunity cost.

---

# 104. SUPPORT SLOT PACING

Support Catchmons unlock after the player understands:

- Lead role,
- primary expedition fit.

Then Supports teach:

- synergy,
- specialization.

---

# 105. TARGETED HUNTING PROGRESSION

Early:
- general Discovery Survey.

Mid:
- traces reveal likely routes.

Later:
- targeted Gear/Catchmon setup improves encounter weight.

Endgame:
- specialized hunting of remaining rare/shiny targets.

This moves from mystery toward agency.

---

# 106. REGION PROGRESSION — WORLD READINESS

A region should become available when the player has demonstrated enough of the previous world loop.

Possible world-readiness signals:

- complete key route,
- discover/capture a region-linked Catchmon,
- obtain a regional component,
- complete regional milestone.

Exact region identities belong to Document 10.

---

# 107. REGION ACCESS SHOULD NOT FORCE FULL COMPLETION

The player should not need:

> 100% Catchdex of region

to move forward.

Completion is a long-term optional objective.

---

# 108. REGION ACCESS SHOULD NOT MAKE OLD REGION DEAD

Older regions remain valuable for:

- Catchmons,
- materials,
- short routes,
- specific recipes,
- variants.

---

# 109. PROGRESSION BRANCHING

Mid/late progression should offer branching priorities.

Examples:

- invest in production capacity,
- invest in expedition capacity,
- develop Catchmon roster,
- unlock advanced recipe branch,
- expand display/customer specialization.

The game should support different player styles.

---

# 110. BRANCHING WITHOUT SOFTLOCK

Choices should create:

> opportunity cost

not:

> irreversible bad account.

The player can return and develop another branch later.

---

# 111. SPECIALIZATION — CORE MODEL

Specialization should emerge from accumulated choices:

- station upgrades,
- active Catchmons,
- recipes,
- displays,
- customer mix.

It should not require choosing one permanent class like:

> “You are now forever a Provision Merchant.”

---

# 112. SOFT SPECIALIZATION

The intended model is:

> **soft specialization**

The player can become very good at a strategy while retaining access to the full collection/game.

---

# 113. SPECIALIZATION SWITCHING

Changing strategy may require:

- Catchmon reassignment,
- display changes,
- different recipes,
- infrastructure investment.

It should not require paid respec.

---

# 114. LONG-TERM GOAL LADDER

The game should maintain goals at multiple horizons.

## IMMEDIATE
next craft / sale.

## SHORT
next upgrade / order.

## MEDIUM
station / Catchmon milestone.

## LONG
new region / major expansion.

## VERY LONG
collection/mastery/endgame objective.

---

# 115. PROGRESSION SHOULD ALWAYS SURFACE A NEXT GOAL

The player should generally see:

> one or more desirable achievable objectives.

Avoid states where the player asks:

> “What am I even supposed to do now?”

---

# 116. GOAL VISIBILITY

The UI should later support a small number of contextual goals.

Do not show a 30-item quest checklist.

---

# 117. MILESTONE TYPES

Useful milestone categories:

- Shop Rank,
- infrastructure,
- recipe,
- Catchmon,
- expedition,
- region,
- collection.

Milestones should celebrate meaningful system changes.

---

# 118. NO CLAIM-BUTTON MILESTONE ECONOMY

Milestone rewards should resolve automatically or be presented without requiring the player to tap through dozens of claim buttons.

---

# 119. ANTI-GRIND PRINCIPLE

A progression requirement should ask:

> “Have you meaningfully engaged with this system?”

not:

> “Have you repeated the same trivial action 500 times?”

---

# 120. REPETITION THRESHOLD DISCIPLINE

When repeated actions are required:

- thresholds should align with natural use,
- progress should occur while pursuing other goals.

Example:

Recipe Mastery from crafting useful products.

Not:

> craft 200 junk items purely for XP.

---

# 121. NO DEAD PROGRESSION WALL

The player should always retain at least one productive path toward the next major objective.

No major progression should require:

- one rare random drop with no protection,
- one customer who may never spawn,
- current Coin balance the player accidentally spent.

---

# 122. RECOVERY PATHS

If a player made inefficient decisions:

- basic crafting remains viable,
- Coins remain earnable,
- lower recipes remain useful,
- Catchmon assignments can be changed,
- infrastructure is not permanently misplaced,
- routes remain available.

The game is recoverable.

---

# 123. NO IRREVERSIBLE BUILD TRAPS

The player should not permanently lose access to a good progression path because they upgraded:

- wrong station,
- wrong display,
- wrong Catchmon.

Efficiency can vary.

Viability remains.

---

# 124. BAD-LUCK PROTECTION AS PROGRESSION SUPPORT

Rare:

- components,
- encounters,
- captures

already use protection from Document 07.

These protections are important to progression architecture.

No core progression milestone should depend on infinite RNG.

---

# 125. RETURNING PLAYER PROGRESSION

A returning player should see:

- completed crafts,
- expedition result,
- useful next purchase,
- visible Shop Rank/goal progress.

Offline time should create possibilities, not only a currency pile.

---

# 126. CASUAL PLAYER COMPATIBILITY

A casual player should be able to progress through:

- shorter sessions,
- offline timers,
- slower optimization.

They should not need perfect active-play efficiency.

---

# 127. ACTIVE PLAYER ADVANTAGE

Active players progress faster through:

- better sales decisions,
- Momentum usage,
- targeted crafting,
- demand response,
- expedition planning.

The advantage comes from decision quality, not tap volume.

---

# 128. NO RAPID-TAP XP FARM

Shop Rank/Catchmon XP should not reward raw tap count.

Actions should resolve meaningful states.

---

# 129. FIRST SESSION SYSTEM BUDGET

A first session should not expose more than a small number of novel concepts.

Recommended concept order:

1. Coins
2. crafting
3. display
4. customer
5. infrastructure
6. Momentum

Catchmon complexity may begin later in the same extended session or next session depending on pacing.

---

# 130. FIRST 30 MINUTES — TARGET ARCHITECTURE

A strong first ~30-minute experience may contain:

- core shop loop,
- Momentum,
- first upgrade decisions,
- first simple order,
- first Catchmon functional assignment,
- visible Shop Rank progression.

It should **not** need to include every advanced system.

---

# 131. FIRST FEW SESSIONS — TARGET

Across the first few meaningful sessions, introduce:

- second station/product family,
- Recipe Mastery,
- Catchmon Level,
- Expedition Hub,
- first expedition,
- first discovery/capture.

This should feel like the world is opening.

---

# 132. FIRST MAJOR MILESTONE

The first major “chapter-like” milestone should be:

> **the moment the shop connects to the external Catchmon world.**

This can be represented by Expedition Hub/world access.

It changes the game structurally.

---

# 133. SECOND MAJOR MILESTONE

A later major milestone should be:

> **specialization / second-region expansion.**

By then the player understands:

- shop,
- Catchmons,
- world,
- crafting/customer interplay.

---

# 134. EARLY GAME DEFINITION

Early game is not a strict hour count.

Functionally, Early Game ends when the player has:

- stable core shop loop,
- several product families,
- active Catchmon roles,
- expedition access,
- first capture,
- first meaningful infrastructure expansion.

---

# 135. MID GAME DEFINITION

Mid Game begins when the player starts managing:

- multiple stations,
- Focused Customers,
- Quality,
- Mastery,
- multiple Catchmons,
- multiple route types,
- additional regions.

---

# 136. LATE GAME DEFINITION

Late Game begins when:

- most core systems are unlocked,
- progression shifts toward specialization,
- signature content,
- advanced collection,
- mastery,
- infrastructure completion.

---

# 137. ENDGAME DEFINITION

Endgame is not:

> “nothing left except infinite numbers.”

It contains goals such as:

- Catchdex completion,
- all evolution stages,
- signature recipes,
- Masterwork goals,
- rare variants,
- shop specialization builds,
- major visual infrastructure completion.

---

# 138. ENDGAME ECONOMY BOUNDARY

Do not solve endgame by:

- multiplying costs by 1,000,000,
- adding endless stat levels.

Use:

- breadth,
- mastery,
- collection,
- signature goals,
- optimization.

---

# 139. SHOP RANK CAP BOUNDARY

The exact rank cap is not defined here.

Shop Rank may:

- have a finite meaningful main progression,
- later continue through prestige-like cosmetic ranks if needed.

But the base game should not require infinite rank scaling.

---

# 140. PROGRESSION NUMBERS SHOULD HAVE HUMAN-SCALE MEANING

Avoid rank systems with:

- Rank 1–9999

unless there is a strong reason.

Milestones should remain memorable.

---

# 141. SHOP RANK NAMING — OPEN

Working name:

> Shop Rank

Potential final naming may be:

- Shop Reputation,
- Merchant Rank,
- Shop Tier.

Final terminology belongs to UX/narrative naming.

The architecture remains one primary non-spendable global progression meter.

---

# 142. PROGRESSION UI PRIORITY

Final UX belongs to Document 11.

This architecture requires the UI to prioritize:

1. current Shop Rank / next broad milestone,
2. current contextual goal,
3. local system progress where relevant.

Do not show every progression bar simultaneously.

---

# 143. CONTEXTUAL PROGRESSION

When crafting:

- show Recipe Mastery.

When viewing Catchmon:

- show Catchmon Level/evolution.

When exploring:

- show discovery/region progress.

This keeps complexity contextual.

---

# 144. LOCKED CONTENT PREVIEW

Locked future content should be shown selectively.

Useful:

> next station unlock preview.

Bad:

> show 70 grayed-out recipes and 16 locked regions from minute one.

---

# 145. TEASING FUTURE SYSTEMS

Future unlocks can be teased through:

- shop expansion silhouette,
- world-map hint,
- customer comment,
- locked station anchor.

Teasing should create curiosity without UI clutter.

---

# 146. TUTORIAL PHILOSOPHY

Tutorialization should be **action-driven**.

Teach:

> when the player first needs the system.

Avoid long up-front explanation.

---

# 147. NO TUTORIAL ENCYCLOPEDIA

Do not explain:

- quality,
- expeditions,
- synergies,
- special visitors

before they are active.

---

# 148. FIRST-USE GUIDANCE

Each major new system should have:

- one clear initial objective,
- one visible success,
- one short explanation.

Then let the player use it.

---

# 149. PROGRESSION QUEST BOUNDARY

A small onboarding/objective system may guide players.

But Catchmon Shop should not become:

> quest marker simulator.

Objectives should point toward natural system engagement.

---

# 150. DAILY QUEST BOUNDARY

Daily quests are not required for base progression.

If added later:

- they must not become mandatory progression currency sources,
- they should support normal play.

---

# 151. LOGIN REWARD BOUNDARY

Login streaks are not part of the core progression architecture.

Progress should come from playing systems.

---

# 152. PROGRESSION REWARD ECONOMY

Unlocks should frequently be their own reward.

Example:

> new station unlocked

is more meaningful than:

> +500 Coins.

Use currency rewards selectively.

---

# 153. SHOP RANK XP — ECONOMIC NORMALIZATION

If Shop Rank progress comes from transaction value, it should be normalized to avoid late-game inflation making early ranks trivial.

Potential techniques:

- logarithmic/value bands,
- capped contribution,
- rank-relative scaling.

Exact formula is deferred.

---

# 154. FIRST-TIME MILESTONE VALUE

First-time achievements may provide stronger Rank progress than repeated routine actions.

Examples:

- first Mastery,
- first capture,
- first Special Visitor,
- first region unlock.

This rewards breadth.

---

# 155. REPEATABLE ACTIVITY VALUE

Routine activity still contributes gradually.

The player should not feel:

> “normal sales no longer matter.”

But repeat XP efficiency should prevent trivial farming.

---

# 156. PROGRESSION TELEMETRY

Future telemetry must measure:

- time to first sale,
- time to Momentum,
- time to first infrastructure upgrade,
- time to first order,
- time to first Catchmon assignment,
- time to first expedition,
- time to first trace,
- time to first capture,
- time to first Quality result,
- time to first evolution,
- time to first new region,
- Shop Rank progression rate,
- time spent waiting for next goal,
- abandoned/unused systems,
- bottleneck cause.

---

# 157. PROGRESSION FUNNEL

The development team should track whether players:

1. understand crafting,
2. understand selling,
3. use Momentum,
4. invest in infrastructure,
5. use Catchmons,
6. start expeditions,
7. capture new Catchmons,
8. specialize.

A large drop between stages indicates design/tutorial friction.

---

# 158. UNLOCK UTILIZATION METRIC

Unlocking a system is not enough.

Track:

> **how soon does the player use it?**

If a system unlocks and remains unused for a long time:

- it may unlock too early,
- be poorly explained,
- have weak value.

---

# 159. OVERLOAD METRIC

Potential overload signals:

- many unvisited new screens,
- unused currencies/resources,
- abandoned tutorials,
- excessive time in menus after unlock burst.

Progression should respond by spacing systems.

---

# 160. PROGRESSION HEALTH TARGET — EARLY

Early progression should create a meaningful new capability frequently enough that the game feels expansive.

Avoid long early savings walls.

---

# 161. PROGRESSION HEALTH TARGET — MID

Mid progression should create competing goals.

The player should regularly choose between:

- infrastructure,
- recipe,
- Catchmon,
- expedition,
- region preparation.

---

# 162. PROGRESSION HEALTH TARGET — LATE

Late progression should increasingly reward:

- mastery,
- specialization,
- completion,
- optimization.

It should not rely on extremely long passive timers.

---

# 163. EVOLUTION HEALTH TARGET

The player should typically have:

- enough time to learn a Catchmon before evolution,
- a visible path toward evolution,
- a satisfying mechanical change when it occurs.

---

# 164. REGION HEALTH TARGET

A new region should feel like:

> a new strategic content package

not:

> same game with larger numbers.

---

# 165. SHOP RANK HEALTH TARGET

The player should understand:

> why Shop Rank increased

and

> what the next major Rank milestone opens.

---

# 166. PROGRESSION ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — EVERYTHING AT ONCE

Too many systems unlock in first session.

Result:

Player cannot form mental model.

---

## ANTI-PATTERN B — GLOBAL LEVEL SPRAWL

Shop Level, Player Level, Reputation Level, Merchant Rank all exist.

Result:

Progress becomes unreadable.

---

## ANTI-PATTERN C — CURRENT-COIN GATES

Player must hold large balance to unlock content.

Result:

Spending punishes progression.

---

## ANTI-PATTERN D — FIVE-CONDITION UNLOCK

Normal content requires many simultaneous gates.

Result:

Progression feels bureaucratic.

---

## ANTI-PATTERN E — MASTERY GRIND WALL

Player must Master every recipe.

Result:

System becomes repetition tax.

---

## ANTI-PATTERN F — RARITY PROGRESSION HOSTAGE

Critical mechanics require one rare Catchmon.

Result:

RNG blocks game progression.

---

## ANTI-PATTERN G — REGION RESET

New world invalidates old content.

Result:

game breadth shrinks.

---

## ANTI-PATTERN H — PRESTIGE LEAK

Old reset mechanics return because previous game used them.

Result:

persistent-shop fantasy breaks.

---

## ANTI-PATTERN I — QUALITY TOO EARLY

Player manages three grades before understanding base products.

Result:

inventory complexity overwhelms.

---

## ANTI-PATTERN J — EXPEDITIONS TOO EARLY

World timers unlock before the shop matters.

Result:

external loop feels disconnected.

---

## ANTI-PATTERN K — SYNERGY TOO EARLY

Tag combinations appear before the player has roster choice.

Result:

system is abstract noise.

---

## ANTI-PATTERN L — NUMBER-ONLY LATE GAME

All later progress is percentage upgrades.

Result:

strategy stops expanding.

---

## ANTI-PATTERN M — ENDLESS LEVELS

Ranks/levels exist mainly to inflate numbers forever.

Result:

milestones lose meaning.

---

## ANTI-PATTERN N — DAILY-QUEST DEPENDENCY

Progression requires chores unrelated to player's preferred strategy.

Result:

game becomes obligation.

---

## ANTI-PATTERN O — IRREVERSIBLE SPECIALIZATION

Player permanently locks account into one shop build.

Result:

experimentation punished.

---

## ANTI-PATTERN P — CLAIM REWARD SPAM

Progression produces many manual reward boxes.

Result:

advancement becomes UI administration.

---

# 167. PROGRESSION PROTOTYPE SCOPE

The initial prototype should test only a compressed subset.

Recommended:

- 5–7 simulated Shop Rank milestones,
- 2 production station states,
- 3 display/storage upgrades,
- Momentum unlock sequence,
- 1 order unlock,
- 2 Catchmon role unlocks,
- 1 expedition unlock,
- 1 capture,
- 1 simulated evolution milestone.

No need for full regions.

---

# 168. PROTOTYPE SCENARIO A — CORE UNLOCK ORDER

Test:

Craft/Sell → Momentum → Upgrade → Order.

Question:

> Does each new system arrive after the previous one is understood?

---

# 169. PROTOTYPE SCENARIO B — CATCHMON INTRODUCTION

Unlock a functional Catchmon.

Question:

> Does it feel like a meaningful expansion rather than another bonus card?

---

# 170. PROTOTYPE SCENARIO C — EXPEDITION INTRODUCTION

Unlock world loop.

Question:

> Does the player understand why they want to leave the shop now?

---

# 171. PROTOTYPE SCENARIO D — QUALITY DELAY

Compare Quality introduced early vs after Mastery.

Question:

> Which timing produces better comprehension/excitement?

---

# 172. PROTOTYPE SCENARIO E — BRANCH CHOICE

Give player enough Coins for:

- station upgrade OR expedition capacity.

Question:

> Do both feel reasonable?

---

# 173. PROTOTYPE SCENARIO F — EVOLUTION

Provide a visible evolution goal.

Question:

> Does it motivate continued use without feeling like grind?

---

# 174. VERTICAL SLICE PROGRESSION TARGET

A polished vertical slice should demonstrate:

- clear Shop Rank,
- core selling unlock sequence,
- infrastructure investment,
- several recipe ranks,
- first Mastery,
- first Quality,
- first Catchmon assignment,
- Catchmon Level,
- expedition unlock,
- first capture,
- one visible shop macro expansion.

It does not need full endgame.

---

# 175. PROGRESSION BALANCE TOOL REQUIREMENT

Before full content production, create a progression model/simulation that tracks:

- expected income,
- Shop Rank rate,
- upgrade costs,
- unlock milestones,
- crafting availability,
- expedition cadence,
- Catchmon development.

This is separate from the economic source/sink simulation but should integrate with it.

---

# 176. PROGRESSION TIMELINE MODEL

Balance should maintain an expected timeline table such as:

```text
Milestone
Expected active time
Expected elapsed time
Required systems
Required average Coins
Primary learning goal
```

Exact values will be determined later.

---

# 177. PLAYER-PERSONA PROGRESSION TESTING

Test at least:

## ACTIVE OPTIMIZER
Strong Momentum use, frequent sessions.

## CASUAL RETURNER
Short sessions, offline reliance.

## COLLECTOR
Prioritizes Catchmons/expeditions.

## SHOP BUILDER
Prioritizes infrastructure/crafting.

## INEFFICIENT LEARNER
Makes suboptimal investments.

All should remain viable.

---

# 178. CATCH-UP DESIGN

Catch-up is primarily systemic:

- earlier recipes stay useful,
- basic income remains viable,
- low-level Catchmons develop quickly,
- earlier routes remain accessible,
- no missed seasonal requirement in base progression.

Do not require artificial “catch-up currency.”

---

# 179. NEWLY ACQUIRED LATE CATCHMON DEVELOPMENT

A Catchmon obtained late should not require the same long early-game time to become usable.

Potential architecture:

- fast early levels,
- account progression modifiers,
- participation scaling.

Exact implementation is deferred.

The principle is:

> new catches should become strategically usable quickly.

---

# 180. NO COLLECTION LEVEL GAP PUNISHMENT

The player should not catch a rare exciting Catchmon and then discover:

> “It is useless for three weeks until leveled.”

Base capability should matter immediately.

---

# 181. NEW RECIPE CATCH-UP

Newly unlocked recipes should become usable immediately.

Mastery makes them better.

Mastery should not be required before the recipe feels viable.

---

# 182. NEW REGION CATCH-UP

When a region unlocks:

- at least one route,
- one meaningful material,
- one product opportunity,
- one Catchmon target

should become understandable quickly.

Do not unlock a region containing 30 unexplained systems.

---

# 183. PROGRESSION CONTENT PACKAGE

Every major progression milestone should ideally connect several systems.

Example:

> New Region unlock

may bring:

- route,
- material,
- 2–4 recipes,
- Catchmon lines,
- customer interest.

This creates coherent expansion.

---

# 184. NO EMPTY UNLOCKS

Avoid:

> unlock “Advanced Commerce” but nothing immediately changes.

Every visible unlock should provide something actionable.

---

# 185. PROGRESSION VERSIONING

Design docs should distinguish:

- intended progression order,
- exact balance tuning.

Future numeric balancing can change without rewriting the architecture.

---

# 186. CANONICAL PROGRESSION DATA

When implemented, unlocks should live in canonical typed data.

Suggested conceptual structures:

```text
shopRankMilestones[]
systemUnlockDefinitions[]
infrastructureUnlocks[]
recipeUnlockRules[]
catchmonDevelopmentProfiles[]
regionUnlockRules[]
```

Exact architecture belongs to Document 14.

---

# 187. UNLOCK CONDITION MODEL

A generic unlock condition system may support:

```text
SHOP_RANK
INFRASTRUCTURE_STATE
RECIPE_MASTERY
CATCHMON_OWNED
CATCHMON_LEVEL
REGION_STATE
EXPEDITION_MILESTONE
COLLECTION_MILESTONE
```

Do not implement one-off condition branches in UI.

---

# 188. CONDITION COMPOSITION

Normal unlock definitions should use:

- one primary condition,
- optional secondary condition.

A generic engine can technically support more.

Game design should still avoid over-composition.

---

# 189. NO UI-OWNED UNLOCK LOGIC

Screens should ask:

> isSystemUnlocked(id)

or equivalent domain API.

They should not hardcode:

> if rank >= 7 && station >= 2...

---

# 190. PROGRESSION SAVE STATE

Technical architecture must eventually persist:

- Shop Rank/progress,
- system unlocks,
- infrastructure states,
- recipe/mastery states,
- Catchmon levels/evolution,
- collection,
- expedition/world milestones,
- region access.

Exact schema belongs to Document 14.

---

# 191. PROGRESSION MIGRATION

Future updates may alter thresholds.

Save migration must preserve:

- earned unlocks,
- owned Catchmons,
- completed milestones.

Players should not lose unlocked systems because balance changed.

---

# 192. CONTENT UNLOCK VS FEATURE FLAG

Technical feature flags are not progression.

Progression data controls player access only after a feature is production-ready.

Do not expose unfinished systems because an unlock condition becomes true.

---

# 193. SYSTEM OWNERSHIP BOUNDARIES

To prevent future conflicts:

### Document 02 owns
- core loop and session philosophy.

### Document 03 owns
- economic affordability and source/sink balance.

### Document 04 owns
- Recipe Rank/Mastery/Quality mechanics.

### Document 05 owns
- customer/order layers.

### Document 06 owns
- Catchmon role/development/evolution meaning.

### Document 07 owns
- expedition/discovery/capture execution.

### Document 08 owns
- infrastructure capabilities.

### Document 09 owns
- when these systems unlock and how progression layers relate.

### Document 10 will own
- exact region/world identities and their content packages.

### Document 11 will own
- progression presentation/tutorial/navigation UX.

---

# 194. LOCKED DECISIONS FROM DOCUMENT 09

The following decisions are considered part of the intended Progression & Unlock Architecture unless deliberately revised:

1. Catchmon Shop uses one primary global progression spine under the working name **Shop Rank**.
2. Shop Rank is non-spendable.
3. Shop Rank represents overall business/reputation/operational growth rather than creating separate Shop Level, Reputation Level, Merchant Level systems.
4. Shop Rank opens broad progression doors but does not replace specialized progression.
5. Specialized progression includes infrastructure, recipes, Recipe Mastery, Catchmon Level, evolution, collection, expedition/discovery, and region access.
6. A progression system should only become visible when the player can meaningfully interact with it.
7. Systems are introduced one layer at a time rather than unlocked in bulk.
8. The intended functional progression phases are Opening Shop, Active Commerce, Operational Growth, Catchmon Workforce, World Opening, Specialization, Regional Expansion, Advanced Mastery, and Grand Shop/Collection Endgame.
9. The first player lesson is Make → Display → Sell → Earn → Improve.
10. The first minute should reach a complete commercial loop.
11. Shop Momentum is introduced before its advanced uses.
12. Favorable Deal should be introduced before Premium Pitch/Recommend are fully layered.
13. Recommend comes after the player understands customer requests, displays, and Momentum.
14. Everyday Orders unlock after basic crafting/customer play is understood.
15. Recipe Mastery unlocks when recipe repetition has meaning.
16. Quality should not be introduced before base products/crafting are understood.
17. Functional Catchmon assignment is introduced before advanced Catchmon synergy.
18. Catchmon Level becomes visible after the player understands Catchmon functional use.
19. Catchmon XP is earned primarily from meaningful relevant participation.
20. Catchmon leveling uses fast early development and meaningful milestone improvements rather than every level requiring a new mechanic.
21. Expeditions unlock only after the shop/material/Catchmon relationship has meaning.
22. Expedition onboarding should begin with predictable Supply Run behavior before more complex discovery/capture layers.
23. Special Components should not become important before advanced recipes and Component Hunts give them purpose.
24. Quality, Focused Customers, and synergies belong to a later specialization layer rather than the opening game.
25. Region expansion occurs after the shop and world loops are both understood.
26. Region unlocks use a small combination of global readiness and world readiness rather than legacy Funken thresholds.
27. Region access should not depend solely on current Coin balance.
28. Current Coin balance should generally not be used as a progression gate.
29. Shop Rank alone should not automatically unlock every region.
30. New regions expand the game rather than reset or replace earlier content.
31. Advanced progression should emphasize mastery/specialization/signature possibilities rather than only higher percentages.
32. Catchmon Shop does **not** use mandatory prestige/reset progression.
33. Legacy prestige logic must not be imported.
34. Progression uses both horizontal and vertical growth.
35. Early/mid progression should favor frequent horizontal capability unlocks.
36. Major systems use Shop Rank, Infrastructure, Mastery/Capability, or World/Collection gates.
37. Normal unlocks should usually use one primary gate plus at most one meaningful secondary condition.
38. Shop Rank rewards should primarily unlock capabilities/access rather than large currency payouts.
39. Shop Rank may qualify infrastructure that still requires investment.
40. All five production stations are not exposed at the start.
41. Display, storage, customer capacity, and expedition capacity unlock gradually.
42. Order progression follows Everyday → Specialized → Commission → Signature patterns.
43. Special Visitors appear only when premium/special stock has meaning.
44. Recipe progression may combine rank, station, mastery, region, and Catchmon gates selectively.
45. Mastery gates remain local/thematic rather than requiring all recipes.
46. Catchmon Level uses a moderate meaningful visible range rather than assumed infinite levels.
47. Evolution is tied primarily to Catchmon development plus at most one meaningful thematic requirement.
48. A universal Evolution Currency is not assumed.
49. Collection milestones remain supplementary and should not create huge global multipliers.
50. Expedition Support slots and targeted hunting unlock after basic expedition comprehension.
51. Region access should not require 100% regional completion.
52. Mid/late progression supports soft specialization rather than permanent class lock-in.
53. Players can change specialization strategy without paid respec.
54. The game should maintain immediate, short, medium, long, and very-long goal horizons.
55. Progression should generally surface at least one desirable next objective.
56. Progression rewards should avoid claim-button spam.
57. Requirements should reflect meaningful engagement rather than repetitive trivial grinding.
58. Core progression cannot depend on unbounded RNG.
59. Inefficient player decisions must remain recoverable.
60. Active play accelerates progression through decision quality, not tap volume.
61. First-session system complexity is intentionally limited.
62. Early game ends only after the player understands both shop and initial world/Catchmon loops.
63. Late/endgame progression emphasizes mastery, collection, signature content, and optimization rather than infinite numeric scaling.
64. Shop Rank does not require an infinite rank ladder.
65. Locked future content should be previewed selectively rather than displaying all locked systems immediately.
66. Tutorialization is action-driven and just-in-time.
67. Daily quests/login streaks are not required for base progression.
68. Shop Rank progress should use value/milestone normalization to prevent trivial farming and late inflation.
69. First-time milestones may contribute meaningful global progression.
70. Routine core activity should still contribute gradually.
71. Progression telemetry must track time-to-key-system milestones and actual unlock utilization.
72. Newly acquired late Catchmons should become useful quickly and should not require extreme catch-up grinding.
73. Newly unlocked recipes must be viable before mastery.
74. Major region unlocks should arrive as coherent content packages.
75. Visible unlocks should provide immediate actionable value.
76. Unlock conditions require canonical data-driven definitions.
77. UI components must not own progression formulas/gates.
78. Save migrations must preserve already-earned unlocks across balance changes.
79. Full production implementation should not begin from progression documents alone; Technical Architecture and Vertical Slice Plan still own implementation authorization.
80. Exact numeric curves remain intentionally deferred to balancing and Technical Architecture.

---

# 195. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- final Shop Rank name,
- exact Shop Rank count/cap,
- exact Rank XP formula,
- exact Rank XP source weights,
- exact Rank milestone numbers,
- exact time targets,
- exact station unlock ranks,
- exact infrastructure unlock requirements,
- exact Recipe Rank count,
- exact Mastery thresholds,
- exact Quality unlock milestone,
- exact Catchmon level cap,
- exact Catchmon XP curve,
- exact evolution level thresholds,
- exact evolution materials/requirements,
- exact expedition slot unlocks,
- exact Support-slot progression,
- exact region order,
- exact region readiness milestones,
- exact collection milestone rewards,
- exact long-term/endgame milestone counts,
- exact tutorial wording,
- exact objective/quest presentation,
- exact progression UI.

These belong to Documents 10–11, balancing, roster mapping, Technical Architecture, and playtesting.

---

# 196. DEPENDENCY HANDOFF TO DOCUMENT 10

Documents 01–09 now define:

- the full shop loop,
- economy,
- products,
- customers,
- Catchmons,
- expeditions,
- infrastructure,
- and the order in which complexity appears.

The next unresolved system is:

> **What makes each of the 17 Catchmon worlds/elements mechanically and thematically distinct, and how do those regions expand the shop rather than simply recolor it?**

Document 10 must define the world/element identity framework.

---

# 197. NEXT DOCUMENT

## `10_CATCHMON_SHOP_WORLD_AND_ELEMENT_STRUCTURE.md`

Document 10 should define:

### Canonical world structure
- relationship between region and element,
- whether the 17 existing region identities are retained,
- canonical naming boundary.

### Element gameplay identity
For every element:
- resource identity,
- recipe tendencies,
- Catchmon capabilities,
- customer/demand tendencies,
- expedition environment.

### Region content package
Each region should introduce:
- material/resource opportunities,
- 2–4 meaningful recipe additions,
- encounter pool,
- expedition routes,
- selected customer demand,
- Catchmon role opportunities.

### Region progression
Use the readiness architecture from Document 09.

### Cross-region economy
- old regions remain relevant,
- materials/recipes combine across worlds.

### Element color semantics
Reuse canonical design-system colors.

### No 17×everything multiplication
Curated regional specialization rather than full product-family duplication.

### World map structure
Functional relationships only; final UX belongs to Document 11.

Only after Document 10 is stable should the full 104-Catchmon role mapping and detailed regional content plan be finalized.

---

# 198. DEFINITION OF DONE FOR PROGRESSION & UNLOCK ARCHITECTURE

Document 09 is ready to hand off when the project can answer:

- What is the one primary global progression meter?
- Why is it not a currency?
- Which specialized progression systems remain?
- What does the player learn first?
- When does Momentum appear?
- When do Orders appear?
- When does Recipe Mastery appear?
- When does Quality appear?
- When do Catchmons become functional?
- When does Catchmon Level become visible?
- When do Expeditions unlock?
- What should the first expedition teach?
- When do Special Components matter?
- When do Focused Customers and synergies appear?
- How do regions unlock?
- Why are legacy Funken thresholds rejected?
- How do horizontal and vertical progression alternate?
- How many gates should normal unlocks use?
- How does Recipe progression work?
- How does Catchmon leveling/evolution fit?
- Does the game use Prestige?
- How does specialization remain reversible?
- How does the game avoid grind walls?
- How are suboptimal players protected from softlocks?
- What does early/mid/late/endgame mean functionally?
- What telemetry validates progression pacing?
- Which values remain intentionally open for balancing?
- What must Document 10 define next?

If these answers remain coherent, the project can define all 17 world/element identities without needing to revisit the core progression spine.
