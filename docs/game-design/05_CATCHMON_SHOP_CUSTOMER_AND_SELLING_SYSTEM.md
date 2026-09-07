# CATCHMON SHOP — 05 CUSTOMER & SELLING SYSTEM

**Status:** Customer & Selling Architecture v1  
**Purpose:** Define how customers enter the shop, form demand, browse, request products, create selling decisions, generate and consume Shop Momentum, produce orders/commissions, and make the shop feel alive without turning active play into repetitive tapping  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  

**Authority:** This document owns:
- customer architecture,
- customer arrival and browsing behavior,
- demand generation,
- request generation,
- product/customer compatibility,
- standard selling interactions,
- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend,
- Shop Momentum interaction at customer level,
- special visitors,
- orders and commissions,
- customer waiting and leave behavior,
- display influence on demand,
- demand visibility,
- customer satisfaction/reputation boundary,
- offline customer behavior,
- customer-session cadence,
- Catchmon shop-floor/customer hooks,
- customer anti-spam rules,
- customer prototype scope.

**Out of scope:**  
- exact sale multipliers,
- exact Momentum costs,
- exact arrival rates,
- exact customer art,
- exact named NPC roster,
- exact product values,
- exact product list,
- exact 104-Catchmon role mapping,
- exact shop floor layout,
- exact progression thresholds,
- exact reputation thresholds,
- exact order reward values,
- monetization,
- social/guild systems,
- live-event customer systems,
- final UI layout,
- final animation/audio style.

---

# 1. WHY THIS DOCUMENT EXISTS

The previous documents establish the core commercial loop:

**CRAFT → STOCK → CUSTOMER → SELLING DECISION → VALUE → REINVEST**

The customer system is therefore not a secondary feature.

It is one of the two active halves of the core game:

1. **production decisions**, and
2. **selling decisions**.

If customer behavior is too simple, the game becomes:

> craft item → customer appears → tap sell.

If customer behavior is too complicated, the game becomes:

> read menus → inspect hidden stats → optimize every individual NPC.

Neither is acceptable.

The target is:

> **fast individual interactions sitting on top of a deeper demand system.**

A normal customer should usually take only a few seconds to understand.

The strategic depth comes from:

- what the player stocked,
- what they crafted,
- what customer mix they attract,
- how they spend Shop Momentum,
- which products they preserve,
- which Catchmons they assign,
- and which objectives they are pursuing.

---

# 2. CUSTOMER DESIGN THESIS

The core thesis is:

> **Customers should react to the shop the player has built rather than behaving as random vending-machine requests.**

The player influences demand before the customer arrives through:

- displayed products,
- product-family mix,
- quality,
- shop infrastructure,
- progression,
- Catchmon support,
- temporary demand,
- orders,
- region/world context.

Then, once a customer is present, the player makes a small tactical decision:

> **take the sale, trade profit for Momentum, spend Momentum for a premium result, redirect demand, or decline.**

This creates two layers:

## Strategic layer

“What kind of demand am I creating?”

## Tactical layer

“How do I resolve this particular customer?”

Both are necessary.

---

# 3. CUSTOMER SYSTEM GOALS

The system must accomplish all of the following.

## 3.1 Make displayed inventory matter

The shop floor should affect what customers want.

## 3.2 Make product families matter

Customers should not treat all merchandise identically.

## 3.3 Give lower-value products long-term purpose

Cheap/fast products can help:
- keep flow active,
- build Momentum,
- fulfill everyday demand,
- clear storage,
- support orders.

## 3.4 Create premium payoff moments

A valuable product and high Momentum should create anticipation.

## 3.5 Create production goals

Customer demand should feed back into what the player wants to craft.

## 3.6 Avoid impossible micromanagement

The player must not need to individually inspect 30 hidden preferences.

## 3.7 Make the shop feel alive

Customers should browse, react, wait, and leave in visually understandable ways.

## 3.8 Support short and long sessions

The customer system must work in 2-minute check-ins and 30-minute engaged sessions.

---

# 4. CUSTOMER LAYERS

Catchmon Shop should distinguish customer behavior by **functional layer**, not by generating hundreds of unique rule sets.

The base architecture contains four customer layers:

1. **Walk-In Customers**
2. **Focused Customers**
3. **Special Visitors**
4. **Commission / Order Clients**

These are gameplay layers.

Individual visual archetypes may exist within them later.

---

# 5. LAYER 1 — WALK-IN CUSTOMERS

Walk-In Customers are the economic heartbeat of the shop.

They should be:

- frequent,
- quick to understand,
- strongly influenced by displayed stock,
- broad in what they will consider,
- low-friction,
- the primary source of everyday sales and Momentum cycling.

A Walk-In Customer is not necessarily a generic person visually.

The gameplay meaning is:

> **ordinary shop traffic.**

---

# 6. WALK-IN CUSTOMER PURPOSE

Walk-ins should support:

- regular Coins,
- regular Shop Momentum,
- fast inventory turnover,
- visible shop activity,
- small sales decisions,
- demand feedback.

They should remain important in late progression.

Late game must not make normal customers irrelevant while the player waits only for rare visitors.

---

# 7. LAYER 2 — FOCUSED CUSTOMERS

Focused Customers arrive with stronger preferences.

Their interests may emphasize:

- a product family,
- a demand tag,
- an element,
- a quality threshold,
- an expedition purpose,
- Catchmon care,
- habitat products,
- premium goods.

Examples of functional personas might later include:

- explorer,
- caretaker,
- collector,
- habitat owner,
- elemental enthusiast,
- traveling researcher.

These names are not yet final archetypes.

---

# 8. FOCUSED CUSTOMER PURPOSE

Focused Customers create more predictable but narrower demand.

They are useful because the player can prepare for them.

Example strategic thought:

> “My current shop setup attracts more explorers, so Field Gear stock is especially useful.”

They therefore reward:

- display composition,
- specialization,
- Catchmon assignment,
- product portfolio planning.

---

# 9. LAYER 3 — SPECIAL VISITORS

Special Visitors are uncommon opportunities.

They should create moments such as:

> “I want to be ready when this customer arrives.”

Possible functional types include:

- premium buyer,
- rare collector,
- visiting specialist,
- regional merchant,
- famous researcher,
- demanding patron.

The exact fiction is deferred.

---

# 10. SPECIAL VISITOR PURPOSE

Special Visitors can:

- request valuable products,
- strongly prefer Fine/Masterwork quality,
- request unusual element-aligned goods,
- exchange special components,
- reveal recipes,
- trigger signature orders,
- create unusually efficient Premium Pitch opportunities.

They are **spikes**, not the economic backbone.

---

# 11. LAYER 4 — COMMISSION / ORDER CLIENTS

Commission clients create explicit production objectives.

Their interaction is not:

> “Do you sell this right now?”

but:

> **“Can you make this for me?”**

They create a bridge between:

- customer system,
- crafting system,
- progression,
- rare materials,
- mastery.

---

# 12. ORDERS VS NORMAL CUSTOMERS

This distinction is locked:

## Normal customer

Demand is resolved from available/displayed stock.

## Order / commission

Demand creates a future production goal.

This avoids normal shop traffic constantly requesting unavailable items.

---

# 13. CUSTOMER ARCHETYPE DATA MODEL

Every functional customer definition should eventually derive from canonical data.

Suggested structure:

```text
customerArchetypeId
displayName / visualRole
customerLayer
preferredFamilies[]
secondaryFamilies[]
preferredDemandTags[]
elementPreferences[]
qualityPreference
valueSensitivity
momentumProfile
browsePatienceProfile
specialRequestRules[]
orderRules[]
catchmonInteractionTags[]
unlockRequirements
visualAssetId
```

Exact implementation names may change.

The important rule:

> **Customer logic must be data-driven rather than scattered through UI conditionals.**

---

# 14. CUSTOMER INSTANCE MODEL

A customer instance is a runtime visitor generated from an archetype.

Suggested runtime state:

```text
customerInstanceId
archetypeId
arrivalTime
browseState
currentInterestSet
requestedProductId?
requestedQuality?
requestValueContext
waitState
transactionState
specialFlags[]
```

Runtime customer state must not mutate canonical archetype data.

---

# 15. CUSTOMER STATE MACHINE

A normal customer follows a readable lifecycle:

`ARRIVE`

↓

`BROWSE`

↓

`FORM INTEREST`

↓

`REQUEST`

↓

`WAIT FOR PLAYER`

↓

`PLAYER DECISION`

↓

`TRANSACTION / DECLINE`

↓

`REACTION`

↓

`LEAVE`

The customer should visually communicate their current state.

---

# 16. ARRIVE

Customers enter through the physical shop space.

Arrival should contribute to the shop feeling alive.

The player does not need to interact immediately at arrival.

Customers first browse unless a special visitor/order flow explicitly bypasses browsing.

---

# 17. BROWSE

During Browse:

- the customer moves through the shop,
- evaluates displayed inventory,
- applies their preferences,
- selects potential interests.

Browsing creates visual life and a short anticipation period.

It must not be so long that active play feels slow.

---

# 18. FORM INTEREST

The system creates a weighted set of eligible products from:

- displayed stock,
- customer preferences,
- current demand modifiers,
- quality,
- element,
- product tags,
- Catchmon/shop effects.

The customer then selects a request candidate.

---

# 19. REQUEST

When a request is formed, the player should quickly understand:

- customer identity/type,
- requested product,
- requested quantity if relevant,
- product quality,
- normal sale value,
- available transaction actions,
- Momentum impact,
- special condition if any.

Normal requests should be readable at a glance.

---

# 20. WAIT FOR PLAYER

A customer remains available for a reasonable period.

Normal customers should not create stressful reflex gameplay.

The player should be able to:

- inspect crafting,
- queue another product,
- resolve another customer,
- briefly leave the app,

without immediately losing ordinary customers.

---

# 21. PLAYER DECISION

The core action framework remains:

1. **Standard Sale**
2. **Favorable Deal**
3. **Premium Pitch**
4. **Recommend**
5. **Decline / Let Go** as a necessary boundary action

The first four are the core commercial actions defined by Document 02.

Decline is not a fifth strategic pillar.

It exists because the player must be able to refuse a bad or unwanted transaction.

---

# 22. TRANSACTION RESOLUTION

A completed transaction updates:

- inventory,
- Coins,
- Shop Momentum,
- customer flow,
- order/progression state where relevant,
- demand telemetry,
- Catchmon-triggered effects where relevant.

The result should be immediate and visually satisfying.

---

# 23. REACTION

Customers should visibly react to transaction type.

Examples:

- standard satisfaction,
- pleased by favorable deal,
- impressed by premium experience,
- redirected interest after recommendation.

This should remain lightweight.

The game does not need branching dialogue trees for every transaction.

---

# 24. LEAVE

After resolution, the customer leaves and frees active capacity.

The departure contributes to visible shop circulation.

---

# 25. DEMAND GENERATION — CORE FORMULA

Demand should not be pure random selection.

Conceptually:

`Request Weight(product, customer)`

is influenced by:

- product is displayed,
- product family compatibility,
- demand-tag compatibility,
- customer preference,
- element compatibility,
- quality,
- temporary demand,
- shop specialization,
- Catchmon effect,
- anti-repetition adjustments.

Exact numeric weights are deferred.

---

# 26. DISPLAY AS PRIMARY REQUEST POOL

For ordinary Walk-In Customers:

> **displayed inventory should form the primary request pool.**

This is one of the most important rules in the customer system.

The player controls ordinary demand primarily by deciding what is visible.

---

# 27. WHY DISPLAY MUST MATTER

If customers can request any owned product equally:

- display placement becomes cosmetic,
- stock strategy disappears,
- crafting-to-selling feedback weakens.

If displayed stock controls demand:

> craft → stock → demand → sell

becomes a real loop.

---

# 28. DISPLAY DOES NOT GUARANTEE SALE

Stocking a product should make it more likely to be requested.

It should not always guarantee the next customer asks for it.

Variation remains useful.

The customer mix and preferences still matter.

---

# 29. DISPLAY FAMILY SIGNAL

The composition of displayed stock should influence the **kind of shop traffic** the player creates.

Example structurally:

- many Provisions → more everyday/quick-interest traffic,
- more Field Gear → greater explorer interest,
- more Elemental Craft → greater premium/specialized interest.

This should be gradual.

One item should not instantly transform the entire customer population.

---

# 30. DISPLAY SPECIALIZATION

Later shop progression may increase the player's ability to intentionally attract:

- family-focused demand,
- premium demand,
- element-focused demand,
- explorer demand,
- habitat demand.

This is a strategic layer.

Exact infrastructure is owned by Document 08/09.

---

# 31. CUSTOMER PREFERENCE MODEL

Customers should not have dozens of hidden personality stats.

The base preference model should remain simple.

A customer archetype may prefer:

- 1–2 primary product families,
- several secondary families,
- optional demand tags,
- optional element,
- optional quality preference.

That is enough to create meaningful variation.

---

# 32. PRIMARY FAMILY PREFERENCE

Products in a customer's primary family receive strong request weight.

This creates predictable identity.

Example:

> explorer-like customer strongly prefers Field Gear and Capture & Discovery Gear.

---

# 33. SECONDARY FAMILY PREFERENCE

Secondary families ensure customers are not overly deterministic.

The player can still sell a broader portfolio.

---

# 34. ELEMENT PREFERENCE

Element preference should be used selectively.

Not every customer needs an element.

Element-focused customers are most useful for:

- region identity,
- Elemental Craft,
- special visitors,
- advanced progression.

---

# 35. QUALITY PREFERENCE

Most normal customers should accept Standard products.

Quality preference grows in importance for:

- premium-focused customers,
- special visitors,
- commissions.

This prevents Fine/Masterwork from becoming required for routine shop flow.

---

# 36. VALUE SENSITIVITY

Customers may conceptually vary in how attractive high-value products are to them.

However, this should not become a hidden wallet simulation.

The player does not need to calculate NPC budgets.

Value sensitivity is an internal demand-shaping tool.

---

# 37. REQUEST QUANTITY

Normal customer requests should usually be:

> **one product unit**

This keeps transactions fast.

Orders/commissions may request multiple units.

Selected provision/bulk interactions may later use small quantities if it creates value.

Multi-unit normal requests are not the default.

---

# 38. NO IMPOSSIBLE REQUEST SPAM

Normal customers should rarely request something the player cannot possibly sell.

Walk-In requests should primarily resolve from displayed stock.

Focused/Special customers may occasionally expose unmet demand.

If they do, the game should clearly distinguish:

> “This is an opportunity signal.”

from:

> “The game randomly generated a useless customer.”

---

# 39. UNMET DEMAND SIGNAL

A limited amount of visible unmet demand is useful.

Example:

> a special visitor wants an advanced Elemental Craft the player has not stocked.

This can teach:

> “I should prepare this next time.”

However, unmet demand should not dominate ordinary shop traffic.

---

# 40. DEMAND MEMORY

The game may maintain recent-demand information.

The player should eventually be able to see signals such as:

- recently popular family,
- frequent unmet demand,
- current high-demand tag,
- special visitor preparation.

This supports production decisions.

Exact UI belongs to Document 11.

---

# 41. ANTI-REPETITION DEMAND

The request generator should avoid obvious repetitive streaks where every customer asks for the same product without a reason.

Potential internal mechanisms:

- recent-request downweighting,
- archetype diversity,
- product-weight smoothing.

This is not meant to eliminate profitable demand waves.

It prevents robotic behavior.

---

# 42. STANDARD SALE

Standard Sale is the default fast transaction.

Conceptually:

`Coins = Base Transaction Value adjusted by approved contextual modifiers`

and

`Momentum Gain = modest`

Purpose:

- steady income,
- steady Momentum,
- low cognitive cost.

The player should be able to resolve routine customers with Standard Sale instantly.

---

# 43. STANDARD SALE QUALITY

Standard Sale must remain economically valid throughout the game.

It should never become:

> “the wrong button used only by beginners.”

Even optimized players need a reason to make ordinary sales.

---

# 44. FAVORABLE DEAL

Favorable Deal deliberately sacrifices immediate Coin value.

Conceptually:

`Coins < Standard Sale`

and

`Momentum Gain > Standard Sale`

Purpose:

- convert low-value stock into tactical leverage,
- clear inventory,
- prepare for premium opportunity,
- give cheap products long-term utility.

---

# 45. FAVORABLE DEAL MUST BE A REAL COST

The reduced Coin value must matter.

If the reduction is negligible, the player will always use Favorable Deal.

If the reduction is excessive, the player will never use it.

Later balancing must target a real tradeoff.

---

# 46. FAVORABLE DEAL MOMENTUM BASIS

Momentum generated by a Favorable Deal must depend meaningfully on the economic context.

It must not enable:

> buy/craft trivial item → infinite cheap Momentum.

Potential determinants include:

- base transaction value,
- product rank,
- customer type,
- current Momentum,
- diminishing returns.

Exact formula is deferred.

---

# 47. PREMIUM PITCH

Premium Pitch spends Shop Momentum for a higher-value transaction.

Conceptually:

`Coins > Standard Sale`

and

`Momentum Cost > 0`

Purpose:

- create payoff moments,
- reward preparation,
- give valuable stock strategic importance.

---

# 48. PREMIUM PITCH SHOULD FEEL DECISIVE

Using Premium Pitch should produce a noticeably stronger sale.

It should not feel like:

> spend a visible resource for +3%.

The result must be satisfying enough to justify the build-up.

Exact multiplier remains a balance variable.

---

# 49. PREMIUM PITCH DETERMINISM

Normal Premium Pitch should be deterministic or clearly guaranteed when available.

Avoid:

> spend Momentum → random negotiation failure.

The decision should be:

> “Is this the transaction I want to invest Momentum in?”

not:

> “Will RNG punish me?”

---

# 50. PREMIUM PITCH ELIGIBILITY

Not every customer/product combination must support identical premium potential.

Eligibility/value may later depend on:

- customer profile,
- product family,
- quality,
- demand,
- special visitor status.

However, the core action should remain understandable.

---

# 51. RECOMMEND

Recommend redirects the customer toward a different compatible **displayed** product.

This is the inventory-control action.

Purpose:

- clear overstock,
- sell higher-value suitable goods,
- protect a requested item,
- exploit quality stock,
- respond to current goals.

---

# 52. RECOMMEND COMPATIBILITY

The player may not recommend any arbitrary product.

A recommended product must satisfy an understandable compatibility rule.

Potential compatibility factors:

- same preferred family,
- secondary preferred family,
- matching demand tag,
- relevant element,
- customer special rule.

This keeps customer identity meaningful.

---

# 53. RECOMMEND COST

Recommend should have a constraint.

The preferred architecture is:

> **Recommend consumes a moderate amount of Shop Momentum.**

This directly connects customer redirection to the active-loop resource.

Alternative/additional constraints may later exist for special cases.

---

# 54. RECOMMEND PREVIEW

Before confirming Recommend, the player should understand:

- which products are eligible,
- their sale value,
- resulting Momentum state.

Do not make recommendation a blind reroll.

---

# 55. RECOMMEND DOES NOT CREATE INVENTORY

Recommendation only selects from eligible available/displayed stock.

It cannot:

- summon an unowned item,
- pull from a craft still in progress,
- bypass stock constraints.

---

# 56. DECLINE

The player may decline a request.

Decline should generally:

- yield no Coins,
- yield no Momentum,
- free customer capacity,
- create no severe penalty.

Purpose:

- preserve valuable stock,
- remove undesirable customer,
- recover from a bad shop-state match.

---

# 57. DECLINE PENALTY BOUNDARY

Normal declines should not destroy reputation.

Otherwise players feel forced to sell strategically important items.

Repeated extreme behavior may affect soft shop metrics later if needed, but that is not part of the core system.

---

# 58. TRANSACTION ACTION SUMMARY

| Action | Coin Outcome | Momentum Outcome | Primary Use |
|---|---:|---:|---|
| Standard Sale | Normal | Small gain | Reliable commerce |
| Favorable Deal | Lower | Strong gain | Build Momentum / clear stock |
| Premium Pitch | Higher | Spend | High-value payoff |
| Recommend | Depends on new product | Spend | Redirect demand |
| Decline | None | None | Preserve stock / free capacity |

Exact values remain open.

---

# 59. SHOP MOMENTUM — CUSTOMER-SIDE RULES

Shop Momentum is the tactical bridge between many ordinary customers and selected high-value decisions.

At customer level:

### Earn primarily from
- Standard Sale,
- Favorable Deal,
- selected satisfying interactions.

### Spend primarily on
- Premium Pitch,
- Recommend.

Document 04 adds:
- Workshop Push.

This creates a three-direction tactical choice:

> **use Momentum to make more money, control demand, or accelerate production.**

---

# 60. MOMENTUM DECISION TRIANGLE

At high Momentum, the player should ask:

### OPTION A — COMMERCE
Premium Pitch now?

### OPTION B — INVENTORY
Recommend this customer?

### OPTION C — PRODUCTION
Workshop Push a bottleneck craft?

This is a key strategic structure.

If one option is always optimal, balancing has failed.

---

# 61. MOMENTUM CAP

Momentum remains capped.

The cap creates a reason to spend.

If the player is near cap:

- continuing to Favorable Deal becomes less efficient,
- a Premium Pitch or Recommend becomes more attractive.

This produces natural cycles.

---

# 62. NO PASSIVE MOMENTUM FARM

Normal offline systems should not accumulate large amounts of Shop Momentum.

Momentum represents active commercial engagement.

Limited restoration or preservation may exist later.

The player's best Momentum strategy should require shop interaction.

---

# 63. MOMENTUM VISIBILITY

During every transaction, the player should see:

- current Momentum,
- action cost/gain,
- resulting Momentum.

The game should never make Momentum arithmetic feel hidden.

---

# 64. CUSTOMER ARRIVAL ARCHITECTURE

Customer arrival should be controlled by:

- shop customer capacity,
- progression,
- displayed stock availability,
- shop attractiveness,
- temporary demand,
- Catchmon effects,
- current active population.

Exact arrival equations are deferred.

---

# 65. ACTIVE CUSTOMER CAPACITY

The shop supports a limited number of simultaneous customers.

Purpose:

- prevent overwhelming interaction load,
- make shop expansion visible,
- create a reason for capacity growth,
- keep the space readable.

More customers is not always better if the player cannot meaningfully process them.

---

# 66. ARRIVAL RATE VS CAPACITY

Arrival rate and active capacity are separate concepts.

### Arrival rate
How quickly new customers enter.

### Capacity
How many can be present/waiting.

Later upgrades may improve one without improving the other.

This creates distinct infrastructure roles.

---

# 67. STOCK AVAILABILITY AND ARRIVAL

If the shop is completely empty:

- customer flow should slow,
- customers may browse and leave,
- the game communicates the need to restock.

It should not produce endless frustrated customer spam.

---

# 68. CUSTOMER PATIENCE

Normal customer patience should be forgiving.

A customer can wait while the player resolves several nearby actions.

Patience is not intended as a reflex challenge.

---

# 69. CUSTOMER WAIT PRIORITY

Customers with active requests should be visually distinguishable from:

- browsing customers,
- special visitors,
- order-related interactions.

The player should immediately understand who needs attention.

---

# 70. LEAVING WITHOUT TRANSACTION

A normal customer may leave if:

- no suitable stock exists,
- waiting state exceeds a generous limit,
- player explicitly declines.

The loss should be an opportunity cost, not a punishment.

---

# 71. NO ANGRY-CUSTOMER PUNISHMENT LOOP

Avoid:

- harsh reputation loss,
- money penalties,
- permanent customer loss,
- cascading negative reviews

because the player did not tap fast enough.

This game should encourage optimization, not anxiety.

---

# 72. CUSTOMER SATISFACTION — DECISION

A per-customer numerical happiness bar is **not part of the initial core system**.

Reason:

- it duplicates transaction outcomes,
- adds UI noise,
- risks turning every sale into meter management.

Customer reactions can be expressed through transaction outcome without another visible resource.

---

# 73. SHOP REPUTATION — BOUNDARY

A long-term Shop Reputation / Shop Level concept may later exist as progression.

However:

> **Reputation should be a progression meter, not a spendable currency.**

Document 09 owns the final progression implementation.

This document only establishes that customer success may contribute to such a meter if needed.

---

# 74. REPUTATION SHOULD NOT PUNISH NORMAL PLAY

If long-term reputation exists, normal declines/missed customers should not routinely subtract it.

Progression should generally move forward.

---

# 75. DEMAND SIGNALS

The player should have some visibility into what is worth producing.

Potential signals:

- currently strong family demand,
- recent customer preference,
- upcoming special visitor,
- active order demand,
- region/season influence later.

The game should not require the player to guess blindly.

---

# 76. DEMAND SIGNAL DEPTH

Early game:

- simple and explicit.

Mid game:

- several competing demand signals.

Late game:

- strategic portfolio planning.

Demand complexity should grow gradually.

---

# 77. TEMPORARY DEMAND

Temporary demand may later create short-lived opportunities.

Examples structurally:

- explorer traffic surge,
- elemental interest,
- habitat demand,
- premium celebration.

Temporary demand should alter request weights.

It should not automatically multiply all sale prices with no decision.

---

# 78. DEMAND EVENTS BOUNDARY

Live/event-specific demand is out of scope.

The base system must work without events.

---

# 79. PRODUCT QUALITY AND CUSTOMERS

Quality should matter more for:

- Focused Customers,
- Special Visitors,
- commissions,
- premium goods.

Walk-In Customers should usually accept Standard.

---

# 80. QUALITY DEMAND RULE

Customers should not generally request:

> “Fine version of exact item”

unless they belong to a customer/order type where quality is meaningful.

This prevents high-quality RNG from blocking routine sales.

---

# 81. MASTERWORK MOMENT

A Masterwork item should create a desirable opportunity.

Potential uses:

- high-value premium transaction,
- special visitor,
- premium commission,
- player-use preservation.

This makes quality emotionally meaningful.

---

# 82. PRODUCT FAMILY CUSTOMER HOOKS

Each product family should have a distinct customer context.

---

## PROVISIONS

Expected customer profile:

- broad demand,
- frequent Walk-In interest,
- quick turnover,
- strong Favorable Deal/Momentum usage.

---

## CARE & COMFORT

Expected profile:

- reliable everyday demand,
- caretaker-focused customers,
- strong regular order compatibility.

---

## WEARABLES

Expected profile:

- preference-driven demand,
- quality-sensitive buyers,
- good balanced premium potential.

---

## FIELD GEAR

Expected profile:

- explorers,
- researchers,
- expedition-focused visitors,
- strong dual-use sell-vs-use tension.

---

## CAPTURE & DISCOVERY GEAR

Expected profile:

- collectors,
- researchers,
- explorers,
- specialized demand,
- direct competition with player retention/use.

---

## ELEMENTAL CRAFT

Expected profile:

- element enthusiasts,
- collectors,
- premium buyers,
- rare/special visitors,
- strong Premium Pitch targets.

---

## HABITAT & ENRICHMENT

Expected profile:

- habitat owners/caretakers,
- commissions,
- larger-volume or high-material orders.

---

# 83. CUSTOMER TYPES MUST NOT MAP 1:1 TO PRODUCT FAMILIES

Avoid:

> one customer type exists only to buy one family.

Good customer identities overlap.

This allows:

- broader recommendation compatibility,
- more natural shop behavior,
- less predictable transactions.

---

# 84. ORDERS — CORE PURPOSE

Orders create explicit production targets.

They should:

- diversify crafting,
- make specific recipes temporarily important,
- encourage planning,
- reward production mastery,
- convert stock into objectives,
- create medium-term session goals.

---

# 85. ORDER TYPES

The initial order architecture contains three functional types.

1. **Everyday Order**
2. **Specialized Order**
3. **Commission**

---

# 86. EVERYDAY ORDER

Characteristics:

- common products,
- modest quantities,
- short completion horizon,
- routine rewards.

Purpose:

- guide early/mid crafting,
- create useful goals.

---

# 87. SPECIALIZED ORDER

Characteristics:

- family/tag/element requirement,
- higher-value products,
- potentially quality requirement,
- medium completion horizon.

Purpose:

- encourage specialization,
- connect demand to progression.

---

# 88. COMMISSION

Characteristics:

- specific requested product(s),
- potentially rare component,
- potentially Fine/Masterwork,
- longer preparation,
- special reward/unlock potential.

Purpose:

- memorable production objective,
- signature-content delivery.

---

# 89. ORDER BOARD CAPACITY

The player should have a limited number of active orders.

This prevents:

- objective overload,
- hoarding dozens of requests,
- accidental completion spam.

Exact capacity is a progression variable.

---

# 90. ORDER ACCEPTANCE

Not every offered order needs to become active automatically.

The player should be able to choose which meaningful orders to pursue.

This creates planning.

---

# 91. ORDER REFRESH / REPLACEMENT

Orders should refresh naturally over time or after resolution.

The base system should not require premium currency to escape bad orders.

Potential options:

- wait for replacement,
- decline one,
- limited free refresh.

Exact cadence is deferred.

---

# 92. ORDER DEADLINES

Core everyday orders should generally **not** have harsh real-time deadlines.

Deadlines may be used for:

- special opportunities,
- events,
- specific commissions.

The default should avoid FOMO pressure.

---

# 93. ORDER REWARDS

Orders may provide:

- Coins,
- progression,
- recipe qualification,
- special components,
- special visitor access,
- mastery bonus.

Normal orders should not become the dominant Coin source.

---

# 94. ORDER COIN BOUNDARY

The economic backbone remains:

> **normal shop sales.**

Orders provide:

> **targeted bonus value.**

If optimized players ignore Walk-In customers because orders pay vastly more, the system is unhealthy.

---

# 95. ORDER PRODUCT RESERVATION

The player should control whether owned products are committed to an order.

The game should not automatically consume high-quality inventory without confirmation.

---

# 96. ORDER PROGRESS VISIBILITY

Crafting entries should eventually show:

> needed for active order.

Customer/order UI should show:

- required product,
- owned amount,
- still needed,
- quality requirement,
- reward.

---

# 97. SPECIAL VISITOR ARCHITECTURE

Special Visitors should have stronger identity than normal customers.

They may:

- appear after conditions are met,
- announce arrival,
- remain longer,
- request unusual stock,
- have unique transaction opportunities.

---

# 98. SPECIAL VISITOR PREPARATION

Some visitors should be telegraphed.

Example structure:

> “A renowned collector is expected soon.”

This creates:

- crafting preparation,
- stock preservation,
- Momentum planning.

The player should sometimes be able to prepare strategically instead of relying on luck.

---

# 99. SURPRISE SPECIAL VISITORS

A smaller subset may appear unexpectedly.

These create delight.

But they should not require impossible preparation.

They should usually have several acceptable products or provide future opportunity if missed.

---

# 100. SPECIAL VISITOR REWARD TYPES

Special visitors may provide:

- unusually strong sale,
- special component,
- recipe discovery,
- region information,
- Catchmon-related opportunity,
- progression milestone.

Use these selectively.

---

# 101. NO SPECIAL-VISITOR DEPENDENCY FOR BASIC PROGRESSION

Core progression must not stall indefinitely waiting for a rare visitor.

If a visitor unlocks essential progress, arrival must be deterministic/protected.

---

# 102. CATCHMON SHOP-FLOOR INTEGRATION

Document 06 owns exact Catchmon roles.

Document 05 defines the customer-facing hook categories.

Catchmons may influence the customer system through:

1. **Attraction**
2. **Affinity**
3. **Service**
4. **Recommendation**
5. **Special Visitor**
6. **Demand Insight**
7. **Signature Interaction**

---

# 103. HOOK A — ATTRACTION

A Catchmon may influence which customer profiles are more likely to visit.

Examples structurally:

- explorer interest,
- element enthusiast interest,
- caretaker traffic.

This is more interesting than generic `+5% customers`.

---

# 104. HOOK B — AFFINITY

A Catchmon may improve demand or transaction opportunity for:

- one product family,
- one element,
- one tag.

This creates themed shop builds.

---

# 105. HOOK C — SERVICE

A Catchmon may improve shop-floor operation.

Potential effect classes:

- customer patience,
- browsing efficiency,
- active capacity support,
- small Momentum interaction.

These should remain bounded.

---

# 106. HOOK D — RECOMMENDATION

A Catchmon may:

- broaden Recommend compatibility,
- reduce Recommend cost in a narrow context,
- reveal a preferred alternative.

This creates active strategic value.

---

# 107. HOOK E — SPECIAL VISITOR

A Catchmon may increase access to or enable a specific type of special visitor.

This is a high-value structural effect.

Use selectively.

---

# 108. HOOK F — DEMAND INSIGHT

A Catchmon may reveal:

- upcoming demand,
- customer preference,
- special request information.

This changes information rather than raw numbers.

---

# 109. HOOK G — SIGNATURE INTERACTION

Selected Catchmons may trigger unique shop-floor events or customer responses.

These should be rare and memorable.

---

# 110. CATCHMON CUSTOMER EFFECT PRIORITY

When mapping the 104 Catchmons later, prioritize:

1. new interaction possibility,
2. new demand pattern,
3. improved information,
4. targeted transaction efficiency,
5. generic arrival/value bonus.

---

# 111. NO CATCHMON CUSTOMER MICROMANAGEMENT

The player should not swap Catchmons before every customer.

Customer-facing assignments should persist long enough to represent a shop setup.

---

# 112. CATCHMON VISIBILITY

If a Catchmon affects shop-floor behavior, it should ideally be visibly present.

This reinforces causality.

---

# 113. CUSTOMER FLOW AND SHORT SESSIONS

The customer system must support the session structures defined in Document 02.

---

# 114. 2-MINUTE CUSTOMER TARGET

A two-minute session should normally allow the player to:

- resolve several ordinary customers,
- build or spend Momentum at least once when state permits,
- make at least one meaningful inventory/selling decision.

Exact customer count is balance-dependent.

The key is:

> the player can experience a complete commerce mini-cycle.

---

# 115. 10-MINUTE CUSTOMER TARGET

A 10-minute session should support repeated cycles of:

- Walk-In sale,
- Favorable Deal,
- Momentum build,
- Premium Pitch or Recommend,
- restock,
- new demand.

At least one special/order-related interaction should commonly be available across the broader session ecosystem, without being mandatory every session.

---

# 116. 30-MINUTE CUSTOMER TARGET

A long session must avoid repetitive identical interactions.

Variation should come from:

- changing stock,
- production completion,
- Focused Customers,
- orders,
- special visitors,
- quality items,
- Momentum choices,
- Catchmon effects.

Do not solve long-session fatigue by simply increasing customer spawn rate.

---

# 117. CUSTOMER DECISION DENSITY

The target feeling is:

> **frequent but not frantic.**

A player should often have something commercial to decide.

They should also have time to:

- craft,
- inspect inventory,
- make upgrades,
- enjoy the shop.

---

# 118. CUSTOMER ANTI-SPAM SYSTEM

Several protections should prevent repetitive tap labor.

Potential architecture:

- limited active capacity,
- browsing delay,
- request batching through visible shop flow,
- generous patience,
- product-family variation,
- quick default actions,
- later quality-of-life automation.

---

# 119. FAST STANDARD SALE

Standard Sale should be executable with minimal interaction.

Potential UX:

- one clear button/tap,
- no confirmation dialog for ordinary low-risk transactions.

Premium/Recommend may require slightly more intent.

---

# 120. NO CONFIRMATION FOR EVERY CUSTOMER

Routine sales should not produce modal confirmation spam.

Confirmations are reserved for:

- rare high-value irreversible use,
- order consumption of special inventory,
- special player-use items where appropriate.

---

# 121. CUSTOMER BATCHING BOUNDARY

The game may later allow limited automation or fast resolution for trivial customers.

However, full “sell all optimally” automation should not be available early.

The active selling game must remain relevant.

---

# 122. OFFLINE CUSTOMER BEHAVIOR — CORE DECISION

Customers do **not** accumulate as an unlimited backlog while the player is offline.

The shop should not reopen with 200 waiting NPCs.

---

# 123. OFFLINE MODEL

The preferred core architecture is:

### While offline
- active customers do not continuously generate optimized sales,
- customer traffic effectively pauses/abstracts after limited handling,
- crafting/material/external timers continue according to their systems.

### On return
- the shop begins with a small readable customer state,
- new traffic resumes quickly.

---

# 124. OPTIONAL FUTURE OFFLINE SALES

Later shop automation may enable limited offline sales.

If implemented:

- only eligible stocked products,
- conservative/standard transaction behavior,
- no automatic Premium Pitch optimization,
- no automatic Recommend optimization,
- bounded by shop automation/capacity,
- lower strategic efficiency than active play.

This remains a later progression feature.

---

# 125. OFFLINE MOMENTUM RULE

Offline automated sales should not create an unlimited Momentum stockpile.

Potential later rule:

- no Momentum from offline automated sales,
- or strongly capped Momentum contribution.

Exact behavior remains open.

---

# 126. RETURN CUSTOMER STATE

Returning players should see:

- the shop visibly active,
- a manageable number of customers,
- immediate opportunity to sell,
- no huge administrative queue.

---

# 127. CUSTOMER VISUAL READABILITY

Even before final art direction, the system requires visual states.

A customer should communicate:

- browsing,
- interested,
- requesting,
- waiting,
- special,
- leaving.

These should be readable without text-heavy UI.

---

# 128. REQUEST VISUAL HIERARCHY

A request should prioritize:

1. product,
2. value,
3. customer preference/special context if relevant,
4. action choices,
5. Momentum change.

Secondary details should not dominate.

---

# 129. SPECIAL VISITOR VISIBILITY

Special Visitors must look/behave distinct enough that the player recognizes:

> “This is not a normal customer.”

The exact art treatment belongs to Document 12.

---

# 130. CUSTOMER QUEUE VISIBILITY

If multiple customers are waiting, the player should be able to see:

- who is waiting,
- what they want,
- whether one is special.

The UI should avoid requiring serial modal dialogs.

---

# 131. NO FULLSCREEN CUSTOMER INTERRUPTION BY DEFAULT

Normal customers should not constantly interrupt the player with fullscreen popups.

The player should initiate resolution from the shop.

Special visitors may justify stronger presentation.

---

# 132. CUSTOMER-AWARE PRODUCTION

The crafting system should surface active demand.

Examples:

- current display stock low,
- active order requires product,
- recent customer demand is high.

This helps the player decide what to craft next.

---

# 133. CUSTOMER-AWARE INVENTORY

Inventory should eventually support demand context.

Potential information:

- displayed,
- requested recently,
- needed for order,
- high-quality,
- reserved.

Exact UX belongs to Document 11.

---

# 134. STOCK RESERVATION

The player may need to preserve items for:

- orders,
- player use,
- special visitors.

A later inventory system should support some form of:

> **Reserve / Do Not Auto-Sell**

This is an important requirement.

Exact implementation is owned by UX/inventory architecture.

---

# 135. RESERVED STOCK RULE

Reserved products should not be selected for:

- automated sales,
- accidental order consumption,
- default recommendation.

The player may still intentionally sell them.

---

# 136. DEMAND AND INVENTORY PRESSURE

Customer demand should help relieve inventory pressure.

Examples:

- Favorable Deal clears excess,
- Recommend redirects toward overstock,
- orders create use for accumulated stock.

This makes customer systems economically functional.

---

# 137. CUSTOMER GENERATION AND EMPTY STOCK

If displayed stock is low:

- request diversity narrows,
- some customers may browse without purchase,
- demand signals remain useful.

The game should communicate:

> restock the shop.

It should not create impossible random requests to fake activity.

---

# 138. CUSTOMER GENERATION AND OVERSTOCK

Overstock should not automatically force demand.

But display emphasis and Recommend should allow the player to actively work through excess.

---

# 139. DEMAND FORECASTING — BOUNDARY

Full predictive dashboards are not required.

The game should expose enough signal for informed decisions without turning into spreadsheet forecasting.

---

# 140. CUSTOMER VALUE CALCULATION

The displayed transaction value should resolve from canonical product/economy data.

Customer logic may apply contextual modifiers.

The UI must not contain pricing formulas.

---

# 141. CUSTOMER VALUE MODIFIERS

Possible approved modifier categories later include:

- transaction action,
- quality,
- customer affinity,
- temporary demand,
- special visitor,
- Catchmon effect.

All modifiers must be centralized and testable.

---

# 142. NO HIDDEN NEGATIVE PRICE SURPRISES

If a customer/context changes value, the player should see the result before confirming.

---

# 143. CUSTOMER RANDOMNESS

Randomness may determine:

- who arrives,
- which compatible product they select,
- special visitor timing within protected rules.

Randomness should not determine:

- whether Standard Sale succeeds,
- whether Premium Pitch arbitrarily fails,
- whether an owned requested item disappears.

---

# 144. PROTECTION FROM BAD CUSTOMER RNG

Long-term progress should not depend on indefinite random customer arrival.

If a specific visitor/order is progression-critical:

- guarantee after threshold,
- trigger deterministically,
- or provide alternative route.

---

# 145. CUSTOMER CONTENT VOLUME DISCIPLINE

The game does not need 100 unique customer archetypes at launch.

A small set of functional archetypes can produce variation through:

- visual variants,
- family preferences,
- element tags,
- progression,
- special rules.

---

# 146. PROTOTYPE CUSTOMER CONTENT

The first core prototype should use:

- 1 Walk-In archetype,
- 1 Focused archetype,
- 1 Special Visitor condition,
- 1 order type,
- 5 products from Document 04,
- all four commercial actions,
- Decline,
- Shop Momentum.

The test is mechanical quality, not content variety.

---

# 147. VERTICAL SLICE CUSTOMER CONTENT

A polished vertical slice should aim for approximately:

- 4–6 Walk-In/Focused functional archetypes,
- 2–3 visually distinct customer roles,
- 1–2 Special Visitor patterns,
- Everyday Orders,
- one Specialized Order,
- one Commission,
- family preferences covering all seven product families,
- at least one element-preference behavior,
- at least one quality-sensitive behavior,
- at least one Catchmon shop-floor effect.

This is enough to test whether demand remains interesting.

---

# 148. FULL CONTENT ENVELOPE

For an initial full game, prefer:

- roughly 10–16 functional customer archetypes,
- visual variants layered on top,
- a curated special-visitor roster,
- reusable order-generation rules.

This is a planning envelope, not a locked count.

Do not create dozens of unique logic classes solely for visual variety.

---

# 149. NAMED NPC BOUNDARY

Recurring named customers may later provide personality and world-building.

They should reuse the same customer engine.

Do not build a separate dialogue/RPG system merely to support them.

---

# 150. CUSTOMER DIALOGUE BOUNDARY

Normal customers need:

- short reactions,
- readable intent,
- flavor.

They do not require long dialogue trees.

Story/dialogue systems can be layered later if justified.

---

# 151. CUSTOMER AUDIO/VISUAL FEEDBACK — FUTURE

Later art/motion work should support:

- arrival,
- browsing,
- request,
- sale,
- favorable reaction,
- premium reaction,
- recommendation,
- leave.

Motion must respect authoritative motion tokens once implemented.

---

# 152. SELLING FEEDBACK

A sale should clearly communicate:

- item left inventory,
- Coins gained,
- Momentum gained/spent,
- quality/premium significance,
- order/progression contribution.

Avoid excessive reward explosions for every cheap sale.

Feedback intensity should scale with importance.

---

# 153. PREMIUM SALE FEEDBACK

Premium Pitch should receive stronger presentation than Standard Sale.

This is one of the core payoff moments.

---

# 154. FAVORABLE DEAL FEEDBACK

Favorable Deal should emphasize:

> Momentum gain

rather than pretending the lower Coin outcome is a failure.

The player should understand the strategic trade.

---

# 155. RECOMMEND FEEDBACK

Recommend should visibly show the customer changing interest.

This makes the action feel like actual selling rather than inventory swapping.

---

# 156. SHOP MOMENTUM FEEDBACK

Momentum changes should be visible but lightweight.

Near-cap state should be readable.

The player should notice:

> “I have leverage available.”

---

# 157. CUSTOMER ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — RANDOM INVENTORY REQUESTS

Customers request any item from storage regardless of display.

Result:

Display becomes cosmetic.

---

## ANTI-PATTERN B — IDENTICAL CUSTOMER LOGIC

Every customer differs only visually.

Result:

Customer content becomes art-only.

---

## ANTI-PATTERN C — ONE OPTIMAL TRANSACTION BUTTON

If Premium Pitch, Favorable Deal, or Standard Sale is always correct, selling strategy collapses.

---

## ANTI-PATTERN D — MOMENTUM FARM SPAM

Cheap items generate disproportionate Momentum.

Result:

Players spam low-value transactions.

---

## ANTI-PATTERN E — RECOMMEND ANYTHING

Customer can be redirected to any product.

Result:

Preferences become meaningless.

---

## ANTI-PATTERN F — CUSTOMER TIMER ANXIETY

Customers leave quickly enough that the player must constantly tap.

Result:

Shop management becomes stress management.

---

## ANTI-PATTERN G — SPECIAL VISITOR ECONOMY DOMINANCE

Normal customers barely matter because special visitors provide most value.

Result:

Core commerce becomes waiting.

---

## ANTI-PATTERN H — ORDER ECONOMY DOMINANCE

Orders become the main income source.

Result:

Walk-In selling loses purpose.

---

## ANTI-PATTERN I — HAPPINESS METER CLUTTER

Every customer has a complex satisfaction bar.

Result:

Routine selling becomes UI management.

---

## ANTI-PATTERN J — IMPOSSIBLE REQUEST SPAM

Most customers ask for unavailable/locked products.

Result:

Traffic feels useless.

---

## ANTI-PATTERN K — FULLSCREEN INTERRUPTION

Every customer opens a modal automatically.

Result:

The player cannot operate the shop naturally.

---

## ANTI-PATTERN L — OFFLINE BACKLOG

Returning player must clear dozens/hundreds of customers.

Result:

Return sessions become administration.

---

## ANTI-PATTERN M — HIDDEN VALUE MODIFIERS

Player does not know why a sale value changed.

Result:

Commercial decisions feel arbitrary.

---

## ANTI-PATTERN N — CATCHMON = +X% CUSTOMER SPEED

All shop-floor Catchmons provide interchangeable throughput bonuses.

Result:

Collection integration loses identity.

---

# 158. CUSTOMER PROTOTYPE — MINIMUM STATE MODEL

The prototype needs:

## Shop state

- 3 display slots,
- 5 products,
- small active customer capacity.

## Customer state

- Walk-In,
- Focused,
- Special condition.

## Actions

- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend,
- Decline.

## Supporting systems

- Momentum,
- inventory,
- product values,
- display influence,
- one Catchmon customer effect,
- one simple order.

---

# 159. PROTOTYPE SCENARIO A — BUILD MOMENTUM

State:

- low Momentum,
- cheap product requested.

Question:

> Does Favorable Deal feel strategically understandable?

---

# 160. PROTOTYPE SCENARIO B — PREMIUM PAYOFF

State:

- high Momentum,
- valuable quality product,
- suitable customer.

Question:

> Does Premium Pitch feel worth saving for?

---

# 161. PROTOTYPE SCENARIO C — RECOMMEND

State:

- customer requests a product the player wants to save,
- compatible overstock exists.

Question:

> Does Recommend create a useful inventory decision?

---

# 162. PROTOTYPE SCENARIO D — DISPLAY CONTROL

State:

- player changes displayed family mix.

Question:

> Does customer demand visibly change enough that the player notices?

---

# 163. PROTOTYPE SCENARIO E — FOCUSED CUSTOMER

State:

- Focused customer enters.

Question:

> Can the player understand their preference without opening a detailed profile?

---

# 164. PROTOTYPE SCENARIO F — ORDER

State:

- simple order requests a product not currently stocked.

Question:

> Does the order create a useful crafting goal instead of feeling like unrelated quest content?

---

# 165. PROTOTYPE SCENARIO G — CATCHMON EFFECT

State:

- one Catchmon modifies customer behavior.

Question:

> Does the effect change what the player stocks/sells?

---

# 166. CUSTOMER PROTOTYPE METRICS

Track:

- customer arrival frequency,
- request-family distribution,
- displayed-stock → request correlation,
- transaction-action distribution,
- Coins by transaction type,
- Momentum generated/spent by action,
- Recommend usage,
- decline rate,
- wait duration,
- leave-without-sale rate,
- order acceptance/completion,
- special visitor success,
- customer interaction time,
- player stock changes after demand signals,
- Catchmon effect on customer behavior.

---

# 167. TRANSACTION ACTION HEALTH TARGET

No core transaction action should be effectively unused.

A healthy test shows:

- Standard Sale is common,
- Favorable Deal is intentionally used,
- Premium Pitch creates targeted payoff,
- Recommend appears situationally,
- Decline remains rare but useful.

Exact percentages are not locked.

---

# 168. DISPLAY HEALTH TARGET

Players should consciously alter displayed stock because they believe it changes demand.

If playtesters treat display as irrelevant decoration, the system has failed.

---

# 169. CUSTOMER COMPREHENSION TARGET

A new player should be able to explain:

> “Customers mostly want what I put out, but different types like different things.”

without reading documentation.

---

# 170. MOMENTUM COMPREHENSION TARGET

A player should be able to explain:

> “I can take cheaper deals to build Momentum, then spend it on better sales, recommendations, or production.”

This is one of the core game-learning goals.

---

# 171. ORDER HEALTH TARGET

Orders should change what players craft without completely overriding free production decisions.

---

# 172. SPECIAL VISITOR HEALTH TARGET

Players should be excited by a Special Visitor but should not feel the entire session was wasted if they did not appear.

---

# 173. CONTENT DEVELOPMENT PIPELINE — CUSTOMERS

When detailed customer content is created:

### STEP 1 — DEFINE FUNCTION

Why does this customer archetype exist?

### STEP 2 — DEFINE PREFERENCE PROFILE

Which families/tags matter?

### STEP 3 — DEFINE ECONOMIC ROLE

What kind of sales does the customer encourage?

### STEP 4 — DEFINE SPECIAL RULE

Only if needed.

### STEP 5 — DEFINE CATCHMON/REGION HOOK

Only if meaningful.

### STEP 6 — DEFINE VISUAL FANTASY

What should the customer look like?

### STEP 7 — CREATE ASSET BRIEF

Only after mechanics are approved.

---

# 174. CUSTOMER ASSET DISCIPLINE

Do not create dozens of customer portraits before functional roles are established.

Visual variants should reuse gameplay archetypes where possible.

This saves:

- art cost,
- logic duplication,
- balance complexity.

---

# 175. CUSTOMER VISUAL VARIANTS

One functional archetype may have multiple visual variants.

Example structurally:

> “Explorer” logic may appear through several different characters.

This makes the world feel populated without creating new rule sets.

---

# 176. CUSTOMER ROLE ICONS — FUTURE

The UI may eventually need compact icons for:

- order,
- premium visitor,
- quality preference,
- element preference,
- special demand.

These should be defined during Asset Taxonomy.

Do not use emoji as production placeholders.

---

# 177. CUSTOMER SYSTEM ↔ PROGRESSION

Progression should gradually unlock:

- more customer variety,
- stronger preference complexity,
- special visitors,
- order types,
- demand specialization,
- additional shop capacity.

Early game should remain simple.

---

# 178. EARLY CUSTOMER EXPERIENCE

Early customer system should contain:

- Walk-In customers,
- displayed-stock requests,
- Standard Sale,
- Favorable Deal,
- Premium Pitch after Momentum introduction,
- Recommend shortly afterward.

Do not introduce:
- quality-sensitive visitors,
- element preference,
- complex commissions

before the basic loop is understood.

---

# 179. MID-GAME CUSTOMER EXPERIENCE

Mid game may add:

- Focused Customers,
- broader display strategy,
- orders,
- quality preference,
- element preference,
- Catchmon customer hooks,
- special visitors.

---

# 180. LATE-GAME CUSTOMER EXPERIENCE

Late game should emphasize:

- portfolio/customer targeting,
- special visitors,
- premium quality goods,
- Catchmon-based shop identity,
- specialized demand,
- advanced commissions.

Late game should not simply mean:

> more customers per minute.

---

# 181. CUSTOMER CAPACITY PROGRESSION

Increasing customer capacity should be meaningful but bounded.

A larger shop should visibly feel busier.

The player should still be able to process interactions comfortably.

---

# 182. ARRIVAL SPEED PROGRESSION

Arrival speed improvements should not create permanent interaction overload.

When traffic rises, quality-of-life systems may also need to improve.

---

# 183. CUSTOMER AUTOMATION BOUNDARY

Later progression may automate:

- trivial Standard Sales,
- specific low-value stocked goods,
- selected customer handling rules.

Automation should be player-configurable where possible.

It must not automatically perform all optimal Favorable/Premium/Recommend decisions.

---

# 184. CUSTOMER RULE AUTOMATION

A future advanced shop might allow rules such as:

> auto-sell Standard-grade Provisions below value threshold.

This is preferable to opaque global automation.

Exact implementation remains future scope.

---

# 185. CUSTOMER SOCIAL SYSTEM BOUNDARY

Friend visits, guild customers, player-to-player orders, etc. are not part of the base system.

If introduced later, they must reuse the core customer/economy architecture.

---

# 186. CUSTOMER LIVE-OPS BOUNDARY

Seasonal visitors and event demand are future extensions.

They must not be required for the base customer loop to remain interesting.

---

# 187. SYSTEM OWNERSHIP BOUNDARIES

To avoid future document conflicts:

### Document 02 owns
- core transaction action existence,
- Shop Momentum core purpose,
- session philosophy.

### Document 03 owns
- economic value architecture,
- Coin/Momentum boundary,
- source/sink principles.

### Document 04 owns
- products,
- product-family tags,
- quality,
- crafting,
- Workshop Push.

### Document 05 owns
- customer behavior,
- demand,
- requests,
- customer-side use of transaction actions,
- orders,
- special visitors.

### Document 06 will own
- exact Catchmon customer/shop-floor role mapping.

### Document 08 will own
- physical customer capacity/shop infrastructure.

### Document 09 will own
- progression/unlock sequencing.

### Document 11 will own
- final customer UI and interaction layout.

---

# 188. LOCKED DECISIONS FROM DOCUMENT 05

The following decisions are considered part of the intended Customer & Selling System unless deliberately revised:

1. Customers react primarily to the shop the player has built rather than requesting random global inventory.
2. Displayed inventory forms the primary request pool for normal Walk-In Customers.
3. The base customer architecture contains four functional layers:
   - Walk-In Customers,
   - Focused Customers,
   - Special Visitors,
   - Commission / Order Clients.
4. Walk-In Customers remain the everyday economic backbone.
5. Focused Customers have stronger product-family/tag preferences.
6. Special Visitors are uncommon opportunity spikes rather than baseline income.
7. Orders create future production objectives instead of acting like normal stock requests.
8. Normal customers follow a readable arrive → browse → request → decision → leave state machine.
9. A normal customer interaction is intended to be understood within seconds.
10. Customer preferences remain compact rather than using dozens of hidden stats.
11. Ordinary requests are primarily based on displayed stock.
12. Display composition influences the broader customer/demand mix over time.
13. Customer requests may additionally respond to family, tags, element, quality, temporary demand, Catchmon effects, and shop specialization.
14. Normal requests usually involve one product unit.
15. Impossible request spam is not allowed.
16. Limited unmet demand may be used intentionally as a production signal.
17. Standard Sale remains a valid core action throughout progression.
18. Favorable Deal trades immediate Coins for increased Shop Momentum.
19. Favorable Deal Momentum generation must not be exploitable through trivial low-value spam.
20. Premium Pitch spends Shop Momentum for a meaningfully higher-value deterministic transaction.
21. Normal Premium Pitch does not use random negotiation failure.
22. Recommend redirects a customer to another compatible displayed product.
23. Recommend does not allow arbitrary-product selection.
24. Recommend uses Shop Momentum as its default constraint.
25. Decline exists as a low-penalty boundary action.
26. Normal declines do not carry severe reputation penalties.
27. Shop Momentum customer-side uses are Premium Pitch and Recommend.
28. Workshop Push remains the production-side Momentum use from Document 04.
29. Momentum therefore creates a commerce/inventory/production decision triangle.
30. Customer arrival rate and active customer capacity are separate system dimensions.
31. Customer patience should be forgiving rather than reflex-based.
32. The game does not use a per-customer visible happiness meter in the base system.
33. Long-term Shop Reputation, if used, is a progression meter rather than a spendable currency.
34. Customer demand should become increasingly visible/predictable as the game grows.
35. Standard quality remains acceptable for ordinary Walk-In commerce.
36. Higher quality matters more for Focused/Special/Commission customers.
37. The initial order architecture contains Everyday Order, Specialized Order, and Commission.
38. Orders are limited in active capacity.
39. Players can choose which meaningful orders to accept.
40. Core everyday orders do not use harsh real-time deadlines by default.
41. Normal customer sales remain the primary Coin source; orders are supplementary objectives/rewards.
42. Special Visitors may be telegraphed to enable preparation.
43. Core progression cannot be indefinitely blocked by random Special Visitor arrival.
44. Catchmons may affect customer Attraction, Affinity, Service, Recommendation, Special Visitors, Demand Insight, and Signature Interactions.
45. Catchmon customer effects should prioritize new interaction/demand possibilities over generic throughput bonuses.
46. Catchmon shop-floor assignment should not require customer-by-customer reassignment.
47. A 2-minute session should allow a complete small commerce cycle.
48. A 10-minute session should support repeated Momentum build/spend cycles.
49. Long-session variety should come from changing demand/state rather than simply higher spawn rate.
50. Standard Sales should be fast and low-friction.
51. Routine customer transactions should not constantly produce fullscreen interruptions.
52. The player should eventually be able to reserve stock from accidental/automated sale.
53. Customer value modifiers must be visible before confirmation.
54. Core customer actions do not depend on random success/failure.
55. Customers do not accumulate as an unlimited offline backlog.
56. Offline systems do not automatically perform optimal Premium Pitch/Recommend decisions.
57. Normal customer automation, if added later, must preserve the strategic selling game.
58. Functional customer archetypes should be data-driven.
59. Visual customer variants may reuse functional archetypes.
60. Customer assets should be generated only after functional customer roles and art direction are approved.

---

# 189. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- exact customer archetype names,
- exact customer visual roster,
- exact arrival rate,
- exact active customer capacity,
- exact browse duration,
- exact patience duration,
- exact request-weight formula,
- exact family preference weights,
- exact element preference weights,
- exact quality preference behavior,
- exact Standard Sale Momentum gain,
- exact Favorable Deal sale reduction,
- exact Favorable Deal Momentum gain,
- exact Premium Pitch cost,
- exact Premium Pitch multiplier,
- exact Recommend cost,
- exact Recommend compatibility scoring,
- exact temporary demand system,
- exact Shop Reputation system,
- exact order capacity,
- exact order refresh cadence,
- exact order rewards,
- exact commission requirements,
- exact special visitor roster,
- exact special visitor frequency,
- exact Catchmon customer effects,
- exact offline automated sales,
- exact customer automation unlocks,
- exact customer UI,
- exact customer visual assets,
- exact animation/audio treatment.

These require later owner documents and balance testing.

---

# 190. DEPENDENCY HANDOFF TO DOCUMENT 06

Documents 02–05 now define the core economic machine:

**Craft products**

↓

**Display products**

↓

**Attract demand**

↓

**Resolve customers**

↓

**Build/spend Momentum**

↓

**Earn Coins**

↓

**Reinvest**

The next critical question is:

> **How do the 104 Catchmons become meaningful parts of this machine without becoming generic stat cards?**

Document 06 must map the existing Catchmon collection onto:

- production,
- customer/shop-floor behavior,
- supply,
- expeditions,
- discovery,
- specialization,
- evolution,
- synergies.

It must preserve the rule:

> **A player should care which Catchmon they obtained because it changes what they can do or how they can play.**

---

# 191. NEXT DOCUMENT

## `06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`

Document 06 should define:

### Canonical roster usage
How the existing 104 Catchmons enter the new project.

### Role architecture
Which gameplay role dimensions exist.

### Assignment model
Where Catchmons can be assigned.

### Production integration
How Catchmons affect the five production-station archetypes and seven product families.

### Customer integration
How Catchmons use the customer hooks defined in Document 05.

### Supply integration
How Catchmons affect routine/special resource access.

### Expedition integration
How Catchmons participate without creating a combat system.

### Evolution
What evolving a Catchmon changes mechanically.

### Level / development boundary
Whether Catchmons level and what leveling is for.

### Element identity
How elements affect Catchmon gameplay without becoming a battle-type chart.

### Synergies
How combinations create meaningful setup choices.

### Uniqueness rule
How 104 Catchmons avoid becoming 104 versions of generic percentage modifiers.

### Rarity boundary
How rarity influences acquisition/value without automatically determining strength.

### Collection progression
How catching new Catchmons affects the shop.

### Duplicate boundary
How the one-catch / duplicate concept works in the new project.

### Visual presence
How assigned Catchmons remain visible in the living shop/world.

### Full-roster mapping framework
A structured schema that can later be used to assign all 104 Catchmons consistently.

Only after this document is stable should individual Catchmon roles be mapped across the complete roster.

---

# 192. DEFINITION OF DONE FOR CUSTOMER & SELLING SYSTEM

Document 05 is ready to hand off when the project can answer:

- Who enters the shop?
- Why do different customers want different things?
- How strongly does displayed stock influence demand?
- How does a customer choose a product?
- What does a normal customer interaction look like?
- How quickly should it resolve?
- What is the difference between Walk-In, Focused, Special, and Commission customers?
- What exactly does Standard Sale accomplish?
- Why would a player choose Favorable Deal?
- Why would a player save Momentum for Premium Pitch?
- How does Recommend work without making preferences irrelevant?
- Why does Decline exist?
- How does Momentum connect selling, inventory, and production?
- How do orders create crafting goals?
- Why do orders not replace normal commerce?
- How do Special Visitors create excitement?
- How are progression-critical visitors protected from bad luck?
- How does product quality influence customers?
- How do Catchmons connect to the customer system?
- How are short sessions supported?
- How does the game avoid customer tap spam?
- What happens to customers while offline?
- How does the player understand demand?
- What customer data must eventually be canonical?
- Which decisions are now locked?
- Which details remain intentionally open for balancing and later documents?

If these answers remain coherent in the vertical-slice prototype, the project can proceed into full Catchmon gameplay integration without redefining the selling engine.
