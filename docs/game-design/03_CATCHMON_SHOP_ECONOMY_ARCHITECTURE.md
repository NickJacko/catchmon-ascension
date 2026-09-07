# CATCHMON SHOP — 03 ECONOMY ARCHITECTURE

**Status:** Economy Architecture v1  
**Purpose:** Define how value enters, moves through, compounds within, and exits the Catchmon Shop economy without prematurely defining the final item/resource catalog or exact balance values  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  

**Authority:** This document owns the macro-economic structure, currency hierarchy, resource classes, source/sink architecture, value-flow rules, economic pacing principles, inflation control, offline-economic behavior, investment competition, and the economic boundaries between shop progression and Catchmon progression  

**Out of scope:** Exact product names, exact recipe lists, exact resource names, exact numeric values, final crafting times, final sale prices, exact Catchmon bonuses, expedition encounter design, building catalog, customer archetype catalog, final progression curve, monetization, live-ops economy, UI layouts, final iconography

---

# 1. WHY THIS DOCUMENT EXISTS

Document 02 defines the active shop engine:

**prepare → craft → stock → customer → transaction decision → resolve → react → reinvest**

That loop only works long-term if the underlying economy creates meaningful choices.

A bad economy can destroy a good interaction loop.

Examples:

- If money is never scarce, reinvestment decisions become meaningless.
- If money is always scarce, progression feels blocked.
- If one item has the best value per minute, crafting becomes solved.
- If routine materials are too restrictive, the player cannot operate the shop.
- If rare materials are too common, expeditions lose meaning.
- If every new system introduces another currency, the game becomes unreadable.
- If offline accumulation is too strong, active shop operation becomes unnecessary.
- If offline accumulation is too weak, mobile return play feels unrewarding.
- If higher tiers simply add zeros to every number, progression loses texture.

Therefore this document defines the **economic architecture before content is filled into it**.

The key question is:

> **What economic structure lets the player constantly make useful decisions while ensuring that every major progression step still feels valuable?**

---

# 2. ECONOMY DESIGN THESIS

The economy should be built around a simple principle:

> **The player converts time, materials, shop capacity, and strategic attention into products; converts products into spendable wealth; and converts wealth back into greater capacity, access, specialization, and collection opportunity.**

The economy must support two simultaneous experiences:

## Short-horizon economy

The player asks:

- What can I craft now?
- Which stock should I sell?
- Is this sale worth using Momentum on?
- Which bottleneck should I solve next?

## Long-horizon economy

The player asks:

- What should I invest in?
- Which production branch should I develop?
- Which Catchmon capability would help my strategy?
- Which rare component should I save?
- What upgrade gets me closer to the next structural unlock?

A healthy economy must make both levels relevant.

---

# 3. ECONOMIC VALUE FLOW

The intended macro flow is:

**ROUTINE INPUTS**

+

**SPECIAL COMPONENTS**

+

**PRODUCTION CAPACITY / TIME**

↓

**PRODUCTS**

↓

**CUSTOMER TRANSACTIONS**

↓

**MAIN CURRENCY**

↓

**REINVESTMENT**

↓

**MORE CAPACITY / ACCESS / SPECIALIZATION**

↓

**BETTER ECONOMIC OPPORTUNITIES**

↓

back into:

**INPUTS → PRODUCTS → SALES**

Catchmons intersect this flow by changing:

- input access,
- production possibilities,
- production efficiency,
- shop/customer opportunity,
- specialization,
- and selected progression gates.

Catchmons must not sit outside the economy as a separate collectible-only layer.

---

# 4. ECONOMIC LAYERS

The base economy should contain **as few conceptual value layers as possible**.

For the core game, the intended layers are:

## LAYER A — MAIN CURRENCY

One universal spendable currency for normal economic reinvestment.

Working name in design documentation:

# **COINS**

This is only a working thematic name.

The final in-world name and icon can be selected later.

Coins represent commercial wealth produced primarily by running the shop.

---

## LAYER B — ROUTINE MATERIALS

Frequently replenished crafting inputs that keep the shop operational.

They are **resources**, not currencies.

They are consumed by recipes and managed through capacity, replenishment, acquisition, and specialization.

---

## LAYER C — SPECIAL COMPONENTS

Scarcer inputs that gate advanced or high-value crafting.

They are primarily tied to external opportunities such as:

- expeditions,
- special discoveries,
- rare customers,
- Catchmon-enabled acquisition,
- milestone systems,
- and later event structures.

They are **resources**, not universal currencies.

---

## LAYER D — SHOP MOMENTUM

Defined in Document 02.

Momentum is a short-horizon tactical resource.

It is deliberately separate from the macro economy.

Momentum is:

- earned mainly through active selling,
- capped,
- spent tactically,
- not used for permanent upgrades,
- not accumulated as long-term wealth,
- not traded into every other system.

---

## LAYER E — PROGRESSION METERS

Examples may eventually include:

- shop level,
- reputation,
- recipe mastery,
- collection completion,
- world access,
- specialization progress.

These are **progression states**, not spendable currencies unless a later document explicitly proves that spending behavior is necessary.

The default rule is:

> **If a number exists only to represent progress, do not turn it into a currency.**

---

# 5. CURRENCY MINIMALISM RULE

The core game should not introduce a new currency whenever a new system is added.

Before creating any additional spendable currency, a later system must answer:

1. Why can Coins not serve this purpose?
2. Why can a normal material not serve this purpose?
3. Why can progression gating not serve this purpose?
4. What distinct player decision does the new currency create?
5. What source/sink cycle prevents it from becoming clutter?

If those questions cannot be answered convincingly, the new currency should not exist.

---

# 6. MAIN CURRENCY — COINS

Coins are the macroeconomic backbone.

They should be understandable from the first session:

> **Sell useful products → earn Coins → improve your business.**

---

## 6.1 PRIMARY SOURCES

The main source of Coins should be commerce.

Core sources:

- standard sales,
- premium sales,
- special customer transactions,
- fulfilled orders,
- selected milestone rewards.

Secondary sources may later exist, but they should not outgrow shop sales.

The game should avoid reaching a state where the player earns more money from:

- login rewards,
- quests,
- event claims,
- arbitrary achievement chests,
- or passive generators

than from actually operating the shop.

The commercial fantasy must remain economically true.

---

## 6.2 PRIMARY SINKS

Coins should regularly compete across several desirable investment categories.

Core sink families:

### Shop capacity

Examples:

- expansion,
- display capacity,
- storage,
- customer capacity.

### Production capability

Examples:

- stations,
- production slots,
- queue capacity,
- station upgrades.

### Access / progression

Examples:

- recipe access,
- infrastructure prerequisites,
- region-linked economic access,
- system unlocks.

### Catchmon-support infrastructure

Examples:

- assignment capacity,
- utility facilities,
- expedition preparation,
- development-related infrastructure.

### Convenience / optimization

Examples:

- inventory improvements,
- supply capacity,
- selected quality-of-life systems.

Exact content belongs to later documents.

The structural requirement is:

> **Coins must have multiple attractive uses at the same time.**

---

# 7. INVESTMENT COMPETITION

A strong reinvestment economy creates tension between valid goals.

The player should sometimes ask:

> “Do I expand my shop or improve production?”

or:

> “Do I unlock the next recipe branch or strengthen the station I already use?”

or:

> “Do I spend now on shop efficiency or save for a Catchmon-related opportunity?”

This is healthier than a progression path where every upgrade is purchased in one fixed mandatory order.

---

## 7.1 INVESTMENT CATEGORIES MUST NOT BE STRICTLY LINEAR

Not every economic improvement should simply be:

`Upgrade 1 → Upgrade 2 → Upgrade 3 → Upgrade 4`

Later systems should allow some branching.

Examples of economic direction may include:

- more capacity,
- faster throughput,
- higher-value specialization,
- broader product range,
- stronger customer targeting,
- improved material access,
- Catchmon-linked specialization.

The exact specialization system remains open.

---

## 7.2 NO PERMANENTLY WRONG EARLY INVESTMENTS

The economy should allow optimization without creating irreversible early traps.

A player should be able to make a suboptimal purchase without damaging the account for days.

Potential protections:

- low early opportunity cost,
- eventually useful upgrades,
- accessible alternative income paths,
- transparent upgrade effects,
- delayed high-stakes specialization until the player understands the game.

---

# 8. RESOURCE ARCHITECTURE

Materials are not one homogeneous pool.

The game needs different scarcity behaviors.

The base architecture contains two major classes:

# ROUTINE MATERIALS

and

# SPECIAL COMPONENTS

---

# 9. ROUTINE MATERIALS

Routine materials exist to sustain regular crafting.

Their economic job is not primarily to stop the player.

Their job is to create:

- production planning,
- short-term bottlenecks,
- Catchmon/resource specialization,
- storage decisions,
- recipe tradeoffs,
- and return cadence.

---

## 9.1 ROUTINE MATERIAL PRINCIPLES

Routine materials should:

- replenish predictably enough to support normal play,
- have understandable sources,
- be consumed by multiple recipes,
- create occasional local scarcity,
- recover from scarcity without long punishment,
- remain relevant beyond only the tutorial,
- and interact with capacity or specialization.

---

## 9.2 ROUTINE MATERIAL REPLENISHMENT

Exact sources are deferred, but the economy should support a hybrid model.

Routine resources may enter through:

- passive/local regeneration,
- suppliers,
- Catchmon activity,
- short acquisition tasks,
- shop-linked infrastructure,
- region access,
- or combinations of these.

The important rule:

> **Routine production must not require every normal crafting input to come from long expeditions.**

---

## 9.3 STORAGE CAPS

Routine materials should normally have capacity limits.

Capacity serves several functions:

- makes storage upgrades meaningful,
- prevents infinite offline accumulation,
- creates return value,
- allows Catchmons/infrastructure to improve practical throughput,
- keeps low-tier materials economically relevant.

However, caps should not be so restrictive that the player constantly wastes resources while actively playing.

---

## 9.4 LOW-TIER MATERIAL RELEVANCE

As the game progresses, older routine materials should not instantly become useless.

Possible later mechanisms:

- advanced recipes still consume basic inputs,
- mixed-tier recipes,
- refinement chains,
- large-volume orders,
- Catchmon-specialized recipes,
- mastery objectives,
- customer category demand.

This should be used selectively.

The goal is not to force endless farming of tutorial resources.

The goal is to prevent an economy made of disconnected obsolete tiers.

---

# 10. SPECIAL COMPONENTS

Special components create anticipation and value concentration.

They should be required for:

- advanced recipes,
- valuable product classes,
- milestone crafts,
- rare orders,
- selected progression gates,
- and special Catchmon-related opportunities.

---

## 10.1 SPECIAL COMPONENT PRINCIPLES

Special components should:

- have clearly different acquisition behavior from routine materials,
- be scarce enough that using them is a decision,
- not be required for every ordinary craft,
- create preparation goals,
- connect the shop to the external world,
- preserve excitement when obtained.

---

## 10.2 SPECIAL COMPONENT SOURCES

Potential structural sources include:

- expeditions,
- rare discoveries,
- Catchmon-specific acquisition,
- special customers,
- milestone rewards,
- advanced regional systems,
- events.

No exact source distribution is locked here.

---

## 10.3 ANTI-HOARDING DESIGN

Rare materials naturally create hoarding behavior.

Hoarding is acceptable if it reflects real choice.

It becomes unhealthy when the player never feels safe using anything.

Later content should reduce permanent-hoard fear through:

- predictable reacquisition paths,
- understandable rarity tiers,
- visible future uses,
- limited but reliable sources,
- and avoiding surprise recipe requirements that consume old rare materials without warning.

---

# 11. PRODUCTS AS VALUE CONVERSION

Products convert resources and time into sellable value.

The core economic formula is conceptually:

`Product Value = Input Value + Production Opportunity Cost + Progression/Access Value + Demand/Utility Premium`

The exact formula will not be numeric in this document.

The key principle is:

> **A product's value must reflect more than its tier number.**

---

# 12. PRODUCT ECONOMIC DIMENSIONS

A healthy crafting economy should compare products across multiple dimensions.

Future balancing should consider at least:

## SALE VALUE

How much revenue one unit can generate.

## PRODUCTION TIME

How long capacity is occupied.

## ROUTINE MATERIAL COST

How much normal supply is consumed.

## SPECIAL COMPONENT COST

Whether the product consumes scarce external resources.

## DEMAND RELIABILITY

How easy it is to sell under ordinary shop conditions.

## MOMENTUM INTERACTION

Whether the product is attractive for favorable deals, premium sales, or recommendation.

## GOAL / MASTERY VALUE

Whether crafting contributes to other progression.

These dimensions prevent a single “highest tier = always best” answer.

---

# 13. VALUE PER SLOT-TIME

Production capacity is a scarce economic asset.

Therefore one useful balancing concept is:

`Gross Value per Production Minute`

However, this must **not** become the only optimization metric.

If one recipe has the highest gross value per production minute and no meaningful downside, all alternatives become economically dead.

To prevent this, later recipes may differ through:

- material intensity,
- special component use,
- demand,
- Momentum suitability,
- mastery,
- order demand,
- Catchmon bonuses,
- storage constraints,
- category specialization.

---

# 14. ECONOMIC VIABILITY BANDS

The game should avoid both extremes:

## PERFECT BALANCE

Every recipe produces mathematically identical value.

This feels artificial and removes discovery.

## DOMINANT RECIPE

One recipe outperforms all alternatives in nearly every context.

This destroys choice.

Instead, recipes should live in **viability bands**.

Different recipes may be best for:

- fast turnover,
- high-value premium sales,
- cheap Momentum building,
- low-material consumption,
- mastery,
- orders,
- Catchmon synergy,
- rare-component conversion.

This creates strategy without requiring perfect numerical parity.

---

# 15. PRODUCT VALUE ESCALATION

Later tiers must become meaningfully more valuable.

However, value escalation should be controlled.

The economy should not rely solely on exponentially larger numbers.

Higher progression should increase value through combinations of:

- stronger products,
- better customer opportunity,
- increased capacity,
- specialization,
- access to rare inputs,
- improved production chains,
- better transaction efficiency.

Numbers will grow, but structural power must grow too.

---

# 16. SALE PRICE ARCHITECTURE

A product should have a readable baseline transaction value.

The core transaction engine then modifies that baseline.

Conceptually:

## Standard Sale

`Sale = Base Transaction Value`

## Favorable Deal

`Sale < Base Transaction Value`

while generating additional Momentum.

## Premium Pitch

`Sale > Base Transaction Value`

while consuming Momentum.

## Recommend

Changes which compatible product becomes the transaction target.

Exact multipliers and costs are deferred to balancing.

---

# 17. PREMIUM SALE BOUNDARY

Premium sales must feel powerful but must not make standard commerce irrelevant.

Therefore:

- Premium Pitch requires Momentum.
- Momentum generation has an opportunity cost.
- Premium Pitch should not be available on every transaction.
- Premium value should scale in a controlled way.
- The player should care which transaction receives the premium treatment.

A healthy loop is:

> **many ordinary/favorable decisions → one satisfying premium payoff**

not:

> **premium everything forever**

---

# 18. FAVORABLE-DEAL BOUNDARY

A Favorable Deal trades immediate Coins for Momentum.

This is economically interesting only if:

- the sacrificed value matters,
- the gained Momentum matters,
- the next premium opportunity is valuable enough,
- and the player cannot exploit trivial stock for unlimited Momentum without constraint.

Potential future constraints may include:

- product-relative Momentum gain,
- customer-relative value,
- diminishing return on extremely cheap items,
- category interaction,
- Momentum cap.

Exact formulas are deferred.

The principle is locked:

> **Momentum generation must be proportional enough to economic value that low-value spam cannot dominate.**

---

# 19. SHOP MOMENTUM ECONOMIC SEPARATION

Momentum must not become money.

The following conversions should be avoided by default:

- Coins → Momentum with no constraint,
- Momentum → permanent upgrade currency,
- Momentum → rare component,
- Momentum → Catchmon acquisition currency,
- offline generation of unlimited Momentum.

Momentum is a **shop-operation resource**.

Its value comes from tactical timing.

---

# 20. THE ECONOMIC ROLE OF ORDERS

Orders can later create targeted demand.

Economically, orders should serve several functions:

- give temporary value to specific products,
- encourage diversification,
- create medium-term goals,
- convert overstock into purpose,
- provide predictable reward targets.

Orders should not become the dominant source of Coins if normal customer commerce is supposed to be the main fantasy.

A healthy relationship is:

> customer sales = economic backbone  
> orders = targeted objectives / opportunity spikes

---

# 21. THE ECONOMIC ROLE OF SPECIAL CUSTOMERS

Special customers can create high-value moments.

They may:

- demand specific categories,
- offer unusual transaction terms,
- consume rare products,
- provide special components or unlock progress,
- create premium opportunities.

Economically, they should be **spikes**, not the baseline.

If normal customers feel irrelevant while waiting for special customers, the core loop has failed.

---

# 22. CATCHMON ECONOMIC INTEGRATION — STRUCTURAL RULES

Document 06 will define exact Catchmon roles.

This document defines how Catchmons are allowed to influence the economy.

---

## 22.1 CATCHMONS MAY MODIFY OPPORTUNITY

Examples:

- access to a resource source,
- access to an expedition,
- access to a product family,
- access to a customer interaction,
- access to a production specialty.

This is often stronger than a flat percentage bonus.

---

## 22.2 CATCHMONS MAY MODIFY EFFICIENCY

Examples:

- reduce routine material consumption,
- improve station throughput,
- improve supply recovery,
- increase specific category effectiveness,
- improve special component acquisition.

Efficiency bonuses must remain bounded.

They should not create runaway compounding where one Catchmon becomes mandatory for every player.

---

## 22.3 CATCHMONS MAY MODIFY ECONOMIC SHAPE

The most interesting effects change strategy.

Examples:

- makes short crafts more attractive,
- improves one product category's customer demand,
- converts one bottleneck into another,
- unlocks a special production branch,
- enhances certain combinations.

This should be prioritized over generic `+X% Coins`.

---

## 22.4 CATCHMONS SHOULD NOT PRINT FREE MONEY WITHOUT INTERACTION

Passive currency generation may exist in limited forms, but Catchmons should not primarily become idle coin generators.

Their economic value should remain linked to the systems they participate in.

---

# 23. COLLECTION ECONOMY BOUNDARY

The game must avoid turning the 104 Catchmons into a shop catalog that players simply buy with Coins.

Core principle:

> **Normal macroeconomic wealth should support Catchmon acquisition, but should not replace Catchmon discovery and capture.**

Coins may help through:

- preparation,
- crafted supplies,
- infrastructure,
- expedition readiness,
- recovery,
- utility upgrades.

But the actual collection should preserve its own gameplay identity.

---

# 24. CAPTURE SUPPLIES AS PRODUCTS, NOT CURRENCIES

If catching later uses bait, tools, lures, traps, charms, or similar preparation, the default economic interpretation should be:

> **These are crafted or acquired items.**

They should not automatically become another abstract “Capture Token” currency.

This keeps the shop loop connected to collection:

**shop produces preparation → preparation enables collection → collection improves shop**

The exact catch system remains for later documents.

---

# 25. EXPEDITION ECONOMY BOUNDARY

Expeditions should primarily contribute:

- special components,
- uncommon inputs,
- discovery opportunities,
- Catchmon access,
- progression-specific materials.

They should not primarily return large piles of Coins.

Otherwise the external system would compete directly with the shop as the best income source.

The shop should remain the place where value is monetized.

A useful economic pattern is:

> **world gives materials/opportunity → shop converts them into wealth**

---

# 26. RESOURCE → PRODUCT → MONEY CONVERSION

The game should emphasize transformation.

A rare component should generally become more economically meaningful when the player:

- combines it with routine materials,
- occupies production capacity,
- makes a product,
- presents/sells it well.

This preserves the craft-and-sell fantasy.

Directly selling raw rare components may be allowed later, but should generally be less efficient than using them well.

---

# 27. ECONOMIC BOTTLENECK MODEL

The game should not have one universal bottleneck forever.

Healthy progression rotates bottlenecks.

Possible bottlenecks:

- routine materials,
- special components,
- production capacity,
- storage,
- display capacity,
- customer throughput,
- Coins,
- recipe access,
- Catchmon capability.

The player should periodically solve one bottleneck only to reveal a new strategic constraint.

This creates progression.

---

# 28. BOTTLENECK ROTATION

A typical progression pattern might feel like:

### Early

“I need more routine supply.”

↓

### Later

“I have materials but not enough production capacity.”

↓

### Later

“I can produce, but I need stronger customer value.”

↓

### Later

“I need special components.”

↓

### Later

“I need a Catchmon capability or specialization.”

↓

### Later

“I need to optimize my shop portfolio.”

This is structurally healthier than simply increasing every timer and cost.

---

# 29. STORAGE ECONOMY

Storage is an important economic regulator.

It can apply to:

- materials,
- products,
- special components.

Storage should create useful constraints without becoming inventory-cleaning labor.

---

## 29.1 MATERIAL STORAGE

Caps passive accumulation and gives supply upgrades value.

---

## 29.2 PRODUCT STORAGE

Prevents unlimited pre-crafting of everything.

Encourages:

- sales,
- stocking decisions,
- category prioritization.

---

## 29.3 SPECIAL COMPONENT STORAGE

Should be treated carefully.

Rare components should not routinely be destroyed because a cap was silently reached.

If capped, the game must communicate this clearly and provide enough room to prevent accidental loss during normal play.

---

# 30. INVENTORY PRESSURE

Inventory pressure is useful if it creates:

- clearing stock,
- recommendation decisions,
- favorable deals,
- product mix decisions.

It becomes harmful if it creates constant housekeeping.

Therefore later UX/economy design should support:

- clear category visibility,
- storage upgrades,
- predictable product stack rules,
- efficient selling,
- optional automation later.

---

# 31. SOURCE/SINK BALANCE

For every spendable currency or scarce resource, later balancing must define:

## SOURCES

Where it enters.

## SINKS

Where it leaves.

## VELOCITY

How quickly it moves.

## STOCK

How much players typically hold.

## PRESSURE

Whether players want to spend or save.

No resource should be introduced without this full loop.

---

# 32. COIN SOURCE/SINK TARGET

Coins should generally feel:

- plentiful enough to make purchases frequently,
- scarce enough that not everything can be purchased immediately,
- recoverable through normal shop operation,
- valuable across all major progression phases.

The player should often be able to afford **something useful**, but not **everything desired**.

That is the core tension.

---

# 33. NO NEGATIVE DEBT LOOP

The game should not require debt or negative currency to function.

Players may be temporarily low on Coins.

They should always have an accessible route to recover through:

- routine crafting,
- customer sales,
- low-cost products,
- existing stock.

The economy must not allow an ordinary player to soft-lock by spending everything.

---

# 34. RECOVERY FLOOR

At least one basic economic loop should remain accessible at very low wealth.

Conceptually:

> routine input → basic craft → normal sale → positive Coins

This “recovery floor” protects the account economy.

The exact recipe is deferred.

---

# 35. EARLY-GAME ECONOMY

Early game should teach the economic model, not overwhelm with scarcity.

The player should quickly understand:

- products cost materials,
- products take production capacity,
- selling creates Coins,
- Coins improve the shop,
- Momentum is separate from Coins,
- Catchmons can alter economic opportunity.

---

## 35.1 EARLY-GAME RESOURCE COUNT

The tutorial should expose only a small number of resource concepts at once.

Do not begin with:

- ten routine materials,
- five special components,
- three currencies,
- multiple refinement tiers.

Complexity should expand as the player gains reasons to care.

---

## 35.2 EARLY-GAME SPENDING

Early upgrades should arrive frequently enough to establish:

> sell → afford → improve → feel difference

The first upgrades should be understandable and visibly useful.

---

## 35.3 EARLY-GAME SCARCITY

Scarcity should be gentle.

The player should experience a bottleneck and learn to solve it, but should not spend the first hour waiting for basic inputs.

---

# 36. MID-GAME ECONOMY

Mid game should introduce meaningful competition.

The player begins to manage:

- more recipes,
- more resource types,
- several production categories,
- special components,
- multiple upgrade targets,
- Catchmon specialization.

The main challenge shifts from:

> “Can I make something?”

to:

> **“What is the best use of my current capacity and opportunity?”**

---

# 37. LATE-GAME ECONOMY

Late game should prioritize portfolio strategy rather than simple scarcity.

The player may manage:

- multiple profitable product families,
- advanced customer opportunities,
- specialized Catchmon configurations,
- rare component pipelines,
- mastery goals,
- expensive structural upgrades.

Late game should avoid turning every system into long waits.

The active shop economy must remain relevant.

---

# 38. ECONOMIC SCALING PHILOSOPHY

The game will need numerical growth.

However, economic scaling should combine:

## BASE VALUE GROWTH

Higher progression increases typical product and upgrade values.

## CAPACITY GROWTH

More simultaneous economic activity.

## EFFICIENCY GROWTH

Better use of time/materials.

## ACCESS GROWTH

New opportunities become available.

## SPECIALIZATION GROWTH

The player becomes unusually effective in selected areas.

This creates richer progression than value inflation alone.

---

# 39. CONTROLLED EXPONENTIALITY

Upgrade costs and product values may use exponential or near-exponential growth where appropriate.

But the economy should avoid uncontrolled escalation.

Later balancing should monitor:

- income growth,
- sink growth,
- time-to-afford,
- value per active minute,
- offline accumulation,
- special component availability.

The key player-facing metric is not the absolute number.

It is:

> **How long does the next meaningful improvement feel away?**

---

# 40. TIME-TO-AFFORD AS A PRIMARY BALANCE VARIABLE

For major purchases, later balancing should reason in terms of **time-to-afford under normal play**, not only price.

Conceptually:

`Time to Afford = Remaining Cost / Expected Net Income Rate`

Expected Net Income Rate must reflect the relevant progression stage and realistic player behavior.

This helps prevent arbitrary prices.

---

# 41. UPGRADE PAYBACK

Economic upgrades should have understandable value.

A useful balancing concept is:

`Payback Time = Upgrade Cost / Additional Economic Value Generated`

Not every upgrade needs identical payback.

Different upgrade categories may serve different purposes.

But payback should be checked to detect:

- trap upgrades,
- mandatory upgrades,
- upgrades that never recover their cost,
- upgrades that are so strong they invalidate alternatives.

---

# 42. PRODUCTION ECONOMICS

For each recipe, later balancing should model:

`Expected Contribution = Expected Sale Revenue - Opportunity Cost of Inputs`

and

`Contribution per Slot-Time = Expected Contribution / Production Duration`

But this model must also consider:

- special component scarcity,
- Momentum strategy,
- demand,
- mastery,
- orders,
- Catchmon synergies.

Economic analysis should support gameplay design, not replace it.

---

# 43. MATERIAL SHADOW VALUE

Routine materials may not have direct Coin prices, but they still have economic value.

Their implicit value is based on:

- replenishment rate,
- storage cap,
- competing recipe demand,
- Catchmon specialization,
- opportunity cost.

Later simulation should assign internal **shadow values** to materials for balancing.

These values do not need to be exposed to players.

---

# 44. SPECIAL COMPONENT SHADOW VALUE

Rare components need especially careful valuation.

Their internal value should account for:

- acquisition frequency,
- expedition time,
- risk/uncertainty if any,
- alternative recipe uses,
- progression gating,
- Catchmon opportunity.

This prevents rare recipes from accidentally being less attractive than routine recipes.

---

# 45. ECONOMIC RANDOMNESS

Randomness may exist in:

- rare drops,
- special customers,
- discovery,
- bonuses,
- product quality if later approved.

But core economic viability should not depend on extreme luck.

The player should be able to plan.

Use randomness to create:

- excitement,
- variation,
- opportunities.

Do not use it to hide unstable balance.

---

# 46. RNG PROTECTION PRINCIPLE

If rare economic progress depends on random drops, later systems should consider protection such as:

- pity/progress accumulation,
- guaranteed milestone rewards,
- crafting fragments,
- selectable reward tracks,
- increasing odds.

Exact methods are deferred.

The structural rule is:

> **Long-term economic progress should not be indefinitely blocked by bad luck.**

---

# 47. OFFLINE ECONOMY

Offline progress must support return play without replacing active shop play.

The economy therefore separates:

## WHAT MAY ACCUMULATE

and

## WHAT SHOULD NOT FULLY AUTO-RESOLVE

---

# 48. OFFLINE-ELIGIBLE VALUE

Potentially offline-progressing systems include:

- crafting timers,
- routine material replenishment to storage cap,
- expeditions,
- infrastructure timers,
- Catchmon recovery,
- later scheduled production if automation has been unlocked.

Exact rules belong to their owner documents.

---

# 49. OFFLINE-LIMITED VALUE

The following should not automatically produce the player's optimal economic result while offline:

- premium sales,
- recommendation strategy,
- Momentum cycles,
- customer portfolio decisions,
- high-value transaction timing.

Otherwise the best economy would be:

> close the game and let it optimize itself.

---

# 50. NO INFINITE OFFLINE CUSTOMER BACKLOG

Customers should not accumulate indefinitely while the player is away.

A return should not present 200 waiting sales.

Potential later solutions:

- customer flow pauses after active capacity is filled,
- offline sales are limited and low-efficiency,
- only selected automated transactions occur after progression unlocks.

The exact implementation is deferred.

---

# 51. OFFLINE CAP PHILOSOPHY

Offline accumulation should generally be capped by:

- storage,
- queue length,
- expedition duration,
- automation rules.

This makes infrastructure matter.

It also prevents multi-day absence from destabilizing the economy.

---

# 52. RETURN VALUE

A returning player should usually gain value from absence.

But the main reward is:

> **useful states are ready**

rather than:

> “Here is a huge pile of money for not playing.”

Good return states:

- crafts complete,
- materials replenished,
- expedition completed,
- upgrade finished,
- special opportunity ready.

---

# 53. ACTIVE PLAY ECONOMIC ADVANTAGE

Active play should outperform passive play through decision quality, not brute-force tapping.

Examples:

- premium transaction timing,
- better stock mix,
- efficient Momentum cycling,
- responsive production changes,
- special customer handling,
- goal-aware crafting.

The player should feel:

> **“Playing well makes my shop better.”**

not:

> “Playing longer means tapping more.”

---

# 54. ECONOMIC PACING TARGETS

This document does not lock exact seconds or prices.

It does lock relative pacing.

## FREQUENT PAYOFFS

The player should regularly complete small transactions and crafts.

## REGULAR PURCHASES

Early/mid progression should frequently offer an affordable useful investment.

## VISIBLE SAVING GOALS

Larger upgrades should be far enough away to create anticipation but close enough to feel reachable.

## MULTIPLE HORIZONS

At least one useful goal should typically exist at:

- short session horizon,
- several-session horizon,
- longer progression horizon.

---

# 55. ECONOMIC GOAL LADDER

A healthy player state looks like:

### Immediate

“I can complete this sale.”

### Short

“I need two more crafts for this order.”

### Medium

“I am close to a new station upgrade.”

### Long

“I am saving toward a major shop capability.”

### Strategic

“I want the Catchmon/resource setup that makes this product branch strong.”

This prevents the economy from feeling either trivial or impossibly distant.

---

# 56. CATCH-UP / RECOVERY PRINCIPLE

Players who make inefficient choices or return after a long absence should not be permanently behind the intended economic curve.

Potential later mechanisms:

- low-tier upgrade cost compression,
- milestone support,
- predictable basic income routes,
- broad usefulness of old assets,
- no harsh decay.

The game is not a competitive financial simulator by default.

---

# 57. ECONOMIC DECAY

Permanent resource decay should not be part of the core economy.

Avoid:

- Coins disappearing,
- inventory rotting by default,
- routine components expiring,
- progress decaying for inactivity.

Temporary demand and opportunity can expire.

Owned economic value should normally remain stable.

---

# 58. SELLING RAW MATERIALS

The default economy should encourage crafting before sale.

Therefore raw materials should either:

- not be directly sellable,
- or sell for meaningfully less than their transformed potential.

This preserves:

> gather/acquire → craft → sell

as the value chain.

---

# 59. BUYING MATERIALS

A later market/supplier system may allow purchasing some routine inputs.

If implemented, it should solve:

- temporary bottlenecks,
- specialization,
- convenience.

It should not make material acquisition systems irrelevant.

A purchase price should represent a trade:

> **Coins now in exchange for production continuity.**

---

# 60. PLAYER-TO-PLAYER MARKET BOUNDARY

A player market is not assumed in the core economy.

If considered later, it requires a dedicated economy analysis because it can dramatically affect:

- scarcity,
- inflation,
- progression,
- bots/abuse,
- recipe value,
- Catchmon acquisition,
- live balancing.

This document does not authorize a player market by default.

---

# 61. MONETIZATION BOUNDARY

Monetization remains outside the current design scope.

Therefore the base economy must be fun and stable **without requiring a premium currency**.

If monetization is considered later:

- it must not retroactively distort the core source/sink architecture,
- premium currency must not become necessary to resolve deliberately created economic pain,
- the non-paying economy must remain coherent.

---

# 62. ECONOMIC TELEMETRY REQUIREMENTS

When implemented, the game should log enough data to understand economic health.

At minimum:

- Coins earned by source,
- Coins spent by sink,
- average Coin stock by progression band,
- material acquisition by source,
- material consumption by recipe/category,
- special component acquisition/use,
- production slot utilization,
- recipe usage,
- average sale values,
- transaction-action distribution,
- Momentum earned/spent,
- storage-cap waste,
- time-to-afford major upgrades,
- upgrade purchase order,
- offline value generated,
- active vs. passive income share.

Without these data, balancing becomes guesswork.

---

# 63. ECONOMY SIMULATION REQUIREMENT

Before large-scale content is finalized, the economy should be simulated.

A simple simulation should model:

- progression band,
- routine material income,
- production capacity,
- craft durations,
- product value,
- customer throughput,
- transaction modifiers,
- Coin income,
- upgrade costs,
- special component scarcity,
- offline windows.

The goal is not to perfectly predict players.

The goal is to catch structural failures before content production.

---

# 64. ECONOMIC TEST PERSONAS

Simulation and playtesting should consider different behaviors.

## ACTIVE OPTIMIZER

Plays often and uses Momentum efficiently.

## CASUAL RETURN PLAYER

Checks several times per day.

## LONG-SESSION PLAYER

Plays extended sessions and rotates loops.

## INEFFICIENT / LEARNING PLAYER

Crafts imperfectly and spends loosely.

## HOARDER

Avoids rare materials and large purchases.

The economy must remain functional for all of them.

---

# 65. TARGET ECONOMIC RELATIONSHIP — ACTIVE VS. CASUAL

The active optimizer should progress faster.

But the gap should come from:

- better decisions,
- more efficient capacity use,
- smarter sales,
- stronger Momentum use.

Not from:

- mandatory hourly check-ins,
- punishing missed windows,
- impossible catch-up.

The casual player should still perceive steady progression.

---

# 66. ECONOMIC COMPLEXITY BUDGET

Every new economic concept consumes player attention.

Therefore each progression phase should limit the number of simultaneously relevant new concepts.

Before introducing:

- a new material class,
- a new currency,
- a new cost dimension,
- a new production dependency,

the game should ensure the previous layer is understood.

---

# 67. RESOURCES SHOULD HAVE IDENTITIES

When exact resources are later designed, they should not differ only by color.

A resource should ideally have a structural identity through:

- where it comes from,
- which product families use it,
- which Catchmons interact with it,
- which progression phase it belongs to,
- whether it is routine or special.

This will later support meaningful icon design.

---

# 68. RESOURCE FAMILY LIMIT

The game should prefer a small number of coherent resource families over dozens of isolated ingredients.

Document 04 may define product categories.

Later resource content should be organized around those categories.

The goal:

> **recognizable production logic**

rather than:

> recipe requires three arbitrary icons because crafting games do that.

---

# 69. ECONOMY ↔ ART ASSET CONSEQUENCE

This document deliberately does not generate asset requirements yet.

However, it establishes future asset categories.

Once exact content is defined, visual production will need to distinguish:

- main currency,
- routine material resources,
- special components,
- products,
- Momentum,
- progression meters.

These categories must be visually distinct enough that players understand their economic function.

No icons should be mass-generated from this section yet.

---

# 70. ECONOMIC UI CONSEQUENCE

The final UX should avoid displaying every economic variable at all times.

The player should always see what is relevant to the current decision.

Examples:

### Customer interaction
Show sale value and Momentum effect.

### Crafting
Show material cost, duration, output.

### Upgrade
Show Coin cost and effect.

### Expedition
Show relevant special-component opportunity.

The economy can be deep without creating a permanent dashboard.

---

# 71. CORE ECONOMIC ANTI-PATTERNS

The following are structural warning signs.

---

## ANTI-PATTERN A — CURRENCY EXPLOSION

Every feature creates its own token.

Result:

The player stops understanding value.

---

## ANTI-PATTERN B — TOP-TIER DOMINANCE

One recipe has the best profit, efficiency, demand, and progression value.

Result:

The crafting system is solved.

---

## ANTI-PATTERN C — ROUTINE RESOURCE STARVATION

Normal crafting constantly waits for external timers.

Result:

The shop engine stalls.

---

## ANTI-PATTERN D — RARE RESOURCE IRRELEVANCE

Special components are so abundant that the player never thinks about using them.

Result:

External acquisition loses excitement.

---

## ANTI-PATTERN E — PERMANENT HOARDING FEAR

The player refuses to use rare components because future demand is unknowable.

Result:

Rewards become unusable inventory.

---

## ANTI-PATTERN F — PASSIVE MONEY DOMINANCE

Offline/passive systems earn more than active commerce.

Result:

The shop fantasy becomes economically false.

---

## ANTI-PATTERN G — INFLATION WITHOUT PROGRESSION

Values become millions/billions while decisions stay identical.

Result:

Numbers grow; game does not.

---

## ANTI-PATTERN H — CLAIM-REWARD ECONOMY

Most wealth enters from milestones, login boxes, quests, events.

Result:

Operating the shop feels secondary.

---

## ANTI-PATTERN I — SOFT-LOCK BY SPENDING

The player can spend all Coins and lose access to a profitable basic loop.

Result:

Economy becomes hostile.

---

## ANTI-PATTERN J — UNBOUNDED MULTIPLICATIVE STACKING

Catchmons, upgrades, mastery, events, and bonuses multiply each other without caps or diminishing structure.

Result:

Runaway balance and mandatory meta builds.

---

# 72. MULTIPLIER DISCIPLINE

Percentage modifiers should be architected carefully.

Later systems should distinguish between:

## ADDITIVE BONUSES

Safer for stacking multiple effects.

## MULTIPLICATIVE BONUSES

Use sparingly for major structural effects.

## CAPACITY BONUSES

Increase parallel activity.

## ACCESS BONUSES

Unlock new opportunity rather than inflating existing numbers.

Whenever possible, prefer **access and shape changes** over stacking another multiplier.

---

# 73. DIMINISHING RETURNS

Selected scalable systems may need diminishing returns.

Candidates:

- production speed,
- material efficiency,
- customer arrival,
- price bonuses,
- Momentum generation.

Diminishing returns are not mandatory everywhere.

They are a tool to keep stacking interesting without allowing one stat to dominate.

---

# 74. ECONOMIC SPECIALIZATION

Long-term progression should eventually let players build economically distinct shops.

Potential axes include:

- high turnover,
- premium luxury products,
- resource efficiency,
- specialized product category,
- rare-component conversion,
- customer-focused commerce,
- Catchmon-centered production.

Exact specialization belongs to later progression/Catchmon documents.

Economically, the rule is:

> **Specialization should make something unusually strong while preserving opportunity cost elsewhere.**

---

# 75. SPECIALIZATION MUST NOT LOCK COLLECTION

A player specializing economically should not permanently lose access to large portions of the 104 Catchmons.

Specialization may change:

- speed,
- efficiency,
- route,
- priority.

It should not ordinarily make collection completion impossible.

---

# 76. ECONOMIC MILESTONES

Major progression milestones should ideally correspond to economic capability changes.

Examples of structural milestone types:

- new production capacity,
- new supply class,
- special component access,
- new customer layer,
- Catchmon assignment expansion,
- new region-linked economy.

Milestones should not be only:

> +25% Coins.

---

# 77. PRESTIGE / RESET BOUNDARY

A prestige/reset economy is not assumed.

If later proposed, it must prove that:

- resetting adds meaningful strategic replay,
- the shop fantasy survives the reset,
- collection value is handled carefully,
- permanent bonuses do not create runaway multipliers.

Prestige should not be included merely because the previous Catchmon concept used it.

---

# 78. ECONOMIC CONTENT ORDER

When detailed content begins, it should be built in dependency order.

Recommended sequence:

### Step 1
Define product families and their gameplay roles.

### Step 2
Define routine material families that support those products.

### Step 3
Define special-component families that create advanced opportunities.

### Step 4
Define recipe progression within product families.

### Step 5
Define sale-value bands and production-time bands.

### Step 6
Define upgrade cost bands.

### Step 7
Define Catchmon economic interactions.

### Step 8
Run simulation.

### Step 9
Only then produce the full icon/resource asset list.

This prevents visual/content work from locking a broken economy.

---

# 79. MINIMUM ECONOMY PROTOTYPE

The prototype defined in Document 02 can validate the economic architecture with very little content.

Use:

- 1 main currency,
- 2 routine materials,
- 1 special component,
- 3–5 products,
- 2 production slots,
- 3 display slots,
- 1 Momentum meter,
- 1 shop upgrade,
- 1 Catchmon economic effect.

The prototype should test whether the economy already creates competition.

---

# 80. MINIMUM PROTOTYPE ECONOMIC STATES

The prototype should be capable of producing:

## State A — Coin-rich / material-poor

The player has money but needs supply.

## State B — material-rich / capacity-poor

The player has inputs but production is occupied.

## State C — inventory-rich / customer-limited

The player needs to sell intelligently.

## State D — Momentum-rich / premium opportunity

The player chooses where to cash in tactical leverage.

## State E — special-component opportunity

The player decides whether to use or save a scarce component.

## State F — investment choice

At least two upgrades are desirable at once.

If the prototype never creates these states, the architecture is not yet doing enough work.

---

# 81. ECONOMIC PROTOTYPE QUESTIONS

During testing, ask:

1. Do players understand Coins vs. Momentum?
2. Do they experience meaningful material scarcity without shop shutdown?
3. Do they ever choose a lower-value product for strategic reasons?
4. Do they save for upgrades intentionally?
5. Do they understand why a rare component matters?
6. Can they recover when low on Coins?
7. Does active shop play feel economically superior to passive waiting?
8. Does one recipe dominate?
9. Do upgrades create visible economic change?
10. Does the Catchmon effect change behavior rather than only a stat number?

---

# 82. ECONOMIC BALANCE DASHBOARD — FUTURE REQUIREMENT

When simulation begins, maintain a balance table containing at least:

- progression tier/band,
- recipe,
- routine input costs,
- special input costs,
- craft duration,
- base sale value,
- value per slot-time,
- expected demand,
- Momentum behavior,
- expected active income,
- expected passive input rate,
- upgrade costs,
- expected time-to-afford,
- Catchmon modifiers.

This should eventually become the numerical source of truth.

Do not scatter balance numbers across code and design documents.

---

# 83. SOURCE-OF-TRUTH RULE FOR ECONOMIC VALUES

Once actual balancing begins, exact numeric values must live in one canonical data source.

Documentation should explain logic and reference the source.

It should not duplicate large balance tables into multiple documents.

This mirrors the existing project principle of avoiding duplicated design tokens and color constants.

---

# 84. LOCKED DECISIONS FROM DOCUMENT 03

The following decisions are now considered part of the economy architecture unless deliberately revised:

1. The base macro economy uses one primary spendable currency under the working name **Coins**.
2. Coins are earned primarily through shop commerce.
3. Coins are spent across multiple competing permanent/structural investment categories.
4. Shop Momentum remains a separate capped tactical resource and is not a permanent macro currency.
5. Routine materials are resources, not currencies.
6. Special components are scarce resources, not universal currencies.
7. Progress meters should not become currencies by default.
8. Routine materials must support regular crafting cadence.
9. Routine material accumulation may be bounded by storage.
10. Special components create advanced crafting and progression opportunities.
11. Normal shop operation should not depend on rare components for every craft.
12. Products convert materials + capacity/time into sellable value.
13. Recipe viability must depend on multiple dimensions, not only highest sale price.
14. No single recipe should dominate all economic contexts.
15. Premium sales spend Momentum and should be selective payoff moments.
16. Favorable deals trade immediate Coins for Momentum.
17. Momentum generation must not be exploitable through trivial low-value spam.
18. Catchmons may modify economic opportunity, efficiency, and strategic shape.
19. Catchmons should not primarily function as passive Coin generators.
20. Normal Coins may support Catchmon acquisition preparation but should not replace discovery/capture.
21. Capture preparation should default toward crafted/acquired items rather than another abstract currency.
22. Expeditions should primarily return materials/opportunities rather than becoming the main Coin source.
23. The shop should remain the primary place where world resources are monetized.
24. The economy should rotate bottlenecks across progression.
25. Storage acts as a controlled economic constraint and offline cap.
26. A basic recovery craft/sale loop must remain accessible to prevent soft-lock.
27. Active play gains advantage mainly through better decisions, not mandatory tapping frequency.
28. Offline progress may complete production/supply/external timers but should not fully automate optimal customer commerce.
29. Customers should not accumulate as an infinite offline backlog.
30. The base economy must remain functional without a premium currency.
31. Economic growth combines value, capacity, efficiency, access, and specialization.
32. Time-to-afford and upgrade payback are core balancing concepts.
33. Rare economic progression should receive protection from indefinite bad-luck blocking.
34. Permanent owned economic value should not normally decay because the player is inactive.
35. Raw materials should generally create more value through crafting than direct sale.
36. New currencies require explicit justification.
37. Numeric economic balance will eventually be maintained in one canonical source of truth.
38. Full asset generation remains blocked until detailed product/resource content is defined and validated.

---

# 85. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- final name and visual identity of the main currency,
- exact number of routine resource families,
- exact number of special-component families,
- exact material names,
- exact product categories,
- exact recipe counts,
- exact sale values,
- exact crafting times,
- exact Coin reward curves,
- exact upgrade cost curves,
- exact storage capacities,
- exact Momentum formulas,
- exact offline caps,
- exact material regeneration model,
- exact supplier model,
- exact expedition rewards,
- exact Catchmon resource roles,
- exact Catchmon economic modifiers,
- exact specialization system,
- exact order rewards,
- exact customer demand equations,
- exact player-market decision,
- exact monetization model,
- prestige/reset system.

These belong to later owner documents.

---

# 86. DEPENDENCY HANDOFF TO DOCUMENT 04

The economy architecture now tells the crafting system what it must accomplish.

Document 04 must define a product system where:

- products are economically distinct,
- different product families create different reasons to craft,
- routine materials keep production moving,
- special components create valuable advanced crafts,
- higher tiers do not automatically invalidate lower tiers,
- production capacity creates meaningful opportunity cost,
- product progression connects to customers and Catchmons,
- the product catalog remains learnable.

Therefore Document 04 should not begin by inventing 100 random items.

It should first define:

> **What kinds of products exist, what economic/job role each family serves, how recipes progress, and why the player would choose one family over another.**

---

# 87. NEXT DOCUMENT

## `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`

The next document should define:

### Product-family architecture
What major families exist and why?

### Recipe structure
What constitutes a recipe?

### Tier progression
How do recipes progress without becoming simple reskins?

### Routine vs. special inputs
How are the two resource classes represented in recipes?

### Production stations
Which functional station families are required?

### Production slots / queues
How capacity is organized conceptually.

### Product value identities
Which families support:
- fast turnover,
- high premium value,
- Momentum building,
- special orders,
- Catchmon synergy,
- advanced components.

### Unlock structure
How new recipes become available.

### Mastery boundary
Whether repeated crafting creates progression and what purpose it serves.

### Quality boundary
Whether product quality exists, and if so, what decision it creates.

### Catchmon integration points
Where Catchmons alter production without assigning all 104 yet.

### Content-volume discipline
How many product families/tiers are enough before the system becomes bloated.

Only after the product architecture is stable should exact resources, recipe names, item icons, and crafting stations be finalized.

---

# 88. DEFINITION OF DONE FOR ECONOMY ARCHITECTURE

Document 03 is ready to hand off when the project can answer:

- What is the main currency?
- Why is there only one base macro currency?
- What is the difference between Coins and Momentum?
- What are routine materials for?
- What are special components for?
- How does value move from world → shop → money → progression?
- What are the major Coin sources?
- What are the major Coin sinks?
- Why does the player have competing investments?
- How do we stop one recipe from becoming universally optimal?
- How do we stop basic material scarcity from shutting down the core loop?
- How do we keep rare materials exciting?
- How do Catchmons influence economic opportunity without becoming passive money printers?
- What can progress offline?
- What should remain actively played?
- How is infinite offline accumulation controlled?
- How does a broke player recover?
- How will inflation be monitored?
- Which balance variables need simulation?
- Which economy decisions are now locked?
- Which details intentionally remain for Document 04 and later?

If these answers remain coherent, the project can move into the actual product and crafting architecture without inventing content blindly.
