# CATCHMON SHOP — 02 CORE GAMEPLAY ENGINE

**Status:** Core Engine v1  
**Purpose:** Define the minute-to-minute, session-to-session gameplay engine that makes operating the Catchmon shop intrinsically satisfying  
**Depends on:** `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
**Authority:** This document owns the active shop loop, player action cadence, customer transaction structure, crafting/shop feedback loop, active-vs-passive play model, session structure, and the minimum touchpoints through which Catchmons enter the core loop  
**Out of scope:** Exact currencies and values, final item/resource catalogs, exact Catchmon role taxonomy, full expedition design, building catalog, progression curves, monetization, live ops, final UI layout, final art direction, asset production

---

# 1. WHY THIS DOCUMENT EXISTS

The foundation document defines **what game Catchmon Shop is**.

This document defines **what the player actually does**.

The game cannot move into detailed economy, content production, building design, icon generation, or Catchmon role assignment until the central interaction engine is strong enough to answer:

> **Why is operating the shop fun even before long-term progression is considered?**

The target is not merely a functioning economy.

The target is a repeatable interaction engine capable of producing:

- anticipation,
- short-term decisions,
- satisfying transactions,
- visible progress,
- useful optimization,
- low-friction return sessions,
- meaningful production planning,
- and frequent “one more thing” moments.

This document therefore focuses on the relationship between:

**CRAFTING**

↕  

**INVENTORY / DISPLAY**

↕

**CUSTOMERS**

↕

**SELLING DECISIONS**

↕

**SHOP MOMENTUM**

↕

**REINVESTMENT**

while Catchmons intersect these systems as meaningful strategic modifiers and unlocks.

---

# 2. CORE ENGINE STATEMENT

The primary gameplay engine is:

> **The player continuously prepares products, chooses what the shop presents, reacts to customer demand, turns ordinary sales into strategically valuable transactions, uses the resulting profit and shop momentum to keep production moving, and reinvests into a stronger shop and stronger Catchmon-enabled possibilities.**

The player should not feel like a passive owner watching timers.

The player should feel like:

> **“I am actively running this shop.”**

---

# 3. THE CORE LOOP

At the highest level:

## STEP 1 — PREPARE

The player decides what the workshop should produce next.

Inputs include:

- current material availability,
- stock levels,
- customer demand,
- active goals,
- profitable opportunities,
- Catchmon bonuses,
- current production bottlenecks,
- and upcoming unlock targets.

↓

## STEP 2 — CRAFT

Production stations work over time.

The player maintains a limited production pipeline rather than crafting everything instantly.

Completed products become inventory.

↓

## STEP 3 — STOCK / PRESENT

The player chooses which products are actively offered in the shop.

Displayed stock influences what ordinary customers are likely to request.

This gives inventory placement a gameplay purpose.

↓

## STEP 4 — ATTRACT / RECEIVE CUSTOMERS

Customers enter the shop with readable needs or preferences.

The shop state influences:

- which customer types arrive,
- what they are interested in,
- which products they request,
- and how valuable the opportunity can become.

↓

## STEP 5 — MAKE A SALES DECISION

A customer interaction is not an automatic “sell” button.

The player chooses how to resolve it.

Possible functional choices include:

- make a standard sale,
- deliberately give a favorable deal,
- invest accumulated Shop Momentum into a premium sale,
- recommend a different suitable product,
- decline or postpone the transaction,
- or respond to a special request.

↓

## STEP 6 — RESOLVE

The sale changes multiple states:

- inventory,
- money,
- Shop Momentum,
- demand information,
- customer flow,
- progression,
- and potentially Catchmon-related effects.

↓

## STEP 7 — REACT

The player uses the result to make another decision:

- queue a replacement craft,
- restock a rack,
- use Momentum elsewhere,
- change the displayed product mix,
- pursue a goal,
- invest in an upgrade,
- or prepare for an external opportunity.

↓

## STEP 8 — REINVEST / EXPAND

Accumulated profit and progression open stronger possibilities.

These should feed back into:

- production,
- capacity,
- customer opportunities,
- recipes,
- shop development,
- Catchmon utility,
- resource access,
- and future collection opportunities.

↓

**RETURN TO STEP 1**

---

# 4. THE CRITICAL DESIGN RULE: NO DEAD LINK IN THE LOOP

Each major system must affect at least one neighboring system.

A weak loop would look like:

> Craft items → wait → press sell → receive money → buy upgrade.

The intended engine is:

> Crafting decisions affect stock.  
> Stock affects customer opportunities.  
> Customer decisions affect profit and Momentum.  
> Momentum affects selling and production tempo.  
> Profit affects capacity and future options.  
> Catchmons alter several points in the loop.  
> New options create new crafting and selling decisions.

This cross-linking is what creates depth without requiring hundreds of unrelated features.

---

# 5. THE FIVE PLAYER DECISION LAYERS

The active shop loop should repeatedly create decisions in five categories.

---

## 5.1 PRODUCTION DECISION

> **What should I make next?**

This should never be answered only by:

> “Always craft the highest unlocked item.”

The decision can eventually depend on:

- expected demand,
- available materials,
- production duration,
- profit potential,
- inventory gaps,
- customer objectives,
- current Catchmon assignments,
- mastery goals,
- special orders,
- rare components,
- and upcoming unlocks.

The detailed product economy belongs to later documents.

This document locks the need for **multiple valid production motives**.

---

## 5.2 INVENTORY / PRESENTATION DECISION

> **What do I want customers to see?**

Inventory should have two meaningful states:

### Stored inventory

Owned products that are not actively presented.

### Displayed inventory

Products currently exposed to normal shop traffic.

Displayed products should meaningfully influence customer behavior.

Therefore the player is not only deciding:

> “What do I own?”

but also:

> **“What kind of business am I running right now?”**

This creates room for temporary strategies:

- clear cheap stock,
- focus on one category,
- prepare for a high-value customer,
- push a Catchmon-supported product family,
- preserve rare products,
- or stock broadly for stable traffic.

---

## 5.3 TRANSACTION DECISION

> **How do I want to handle this customer?**

Every normal transaction should be resolvable quickly.

The interaction must be understandable within seconds.

The core transaction framework contains four functional actions.

The final names and visual presentation are open.

### A. STANDARD SALE

The customer receives the requested product at its normal transaction value.

Purpose:

- fast,
- safe,
- default,
- produces regular profit,
- contributes a modest amount of Shop Momentum.

This is the baseline action.

---

### B. FAVORABLE DEAL

The player deliberately accepts lower immediate value in exchange for a larger gain in Shop Momentum.

Purpose:

- turn low-value stock into future leverage,
- recover Momentum,
- clear inventory,
- create a meaningful reason not to maximize every individual sale.

The key decision is:

> **“Do I want money now, or leverage for a better transaction later?”**

---

### C. PREMIUM PITCH

The player spends Shop Momentum to substantially improve the value of a transaction.

Purpose:

- convert accumulated Momentum into high-value sales,
- create satisfying payoff moments,
- reward preparation,
- make expensive items exciting to sell.

The action should be deterministic or highly readable.

The core loop should not depend on frustrating hidden negotiation failure chances.

---

### D. RECOMMEND

The player redirects the customer toward another compatible displayed product.

Purpose:

- manage inventory,
- exploit a better margin,
- serve demand with substitute products,
- clear targeted stock,
- take advantage of Catchmon/shop synergies.

Recommendation should require either:

- Shop Momentum,
- a customer compatibility condition,
- a limited action,
- or another meaningful constraint.

It must not become a free universal “choose any item to sell” button.

---

# 6. SHOP MOMENTUM — THE ACTIVE LOOP RESOURCE

The core engine requires a short-horizon resource that links many small customer interactions to larger satisfying decisions.

Working name:

# **SHOP MOMENTUM**

The final thematic name may change later.

Shop Momentum is **not** intended to be the main economy currency.

It exists to make active shop operation mechanically interesting.

---

## 6.1 HOW MOMENTUM IS EARNED

Momentum should primarily come from good customer service and deliberate transaction choices.

Possible sources include:

- standard sales,
- favorable deals,
- satisfying exact customer requests,
- streaks of successful service,
- special customer interactions,
- certain Catchmon support effects.

Exact values belong to balancing.

---

## 6.2 HOW MOMENTUM IS SPENT

Momentum should create immediate tactical power.

Core uses:

### Premium Pitch

Increase the value of an important sale.

### Recommend

Redirect a customer to another compatible product.

### Workshop Push

Convert active shop success into production tempo.

The exact implementation may later be:

- reduce remaining craft time,
- advance one station,
- trigger a short production burst,
- or empower a Catchmon-station interaction.

The function is locked:

> **Successful active selling must be able to feed back into production speed or production opportunity.**

This closes the shop loop.

Additional Momentum uses may be designed later, but should not dilute its identity.

---

## 6.3 MOMENTUM RULES

The following principles are locked:

- Momentum has a cap.
- It is earned mainly through active shop operation.
- It is spent on tactical advantages, not permanent upgrades.
- The player should regularly move between low and high Momentum states.
- High Momentum should create anticipation for a valuable opportunity.
- Low Momentum should not make the game unplayable.
- Leaving the game should not erase all accumulated Momentum as punishment.
- Momentum must not become another grind currency with dozens of shops and sinks.

It is a **decision resource**, not a meta currency.

---

# 7. WHY SHOP MOMENTUM MATTERS

Without Momentum:

- the player would usually want the highest-value sale,
- customer interactions would become repetitive,
- low-tier products would quickly become meaningless,
- and active play would struggle to influence production.

With Momentum:

a cheap item can be useful because it builds leverage.

A valuable item can become a target transaction.

A customer who wants the “wrong” item can create a decision.

A completed sale can accelerate the next production cycle.

Therefore individual transactions become parts of a larger plan.

---

# 8. THE TRANSACTION RHYTHM

Normal customer interactions should be intentionally short.

The player should usually understand the opportunity almost immediately.

A normal customer interaction should communicate:

1. what the customer wants,
2. what product is involved,
3. the base transaction value,
4. the player's relevant options,
5. the Momentum impact,
6. any unusually important modifier.

The player should not need to open a detailed stat sheet for routine transactions.

---

# 9. CUSTOMER FLOW

Customers are the heartbeat of active play.

The shop must visually feel occupied without becoming a tap-spam queue.

---

## 9.1 CUSTOMER ARRIVAL

Customer arrival rate should depend structurally on factors such as:

- shop capacity,
- shop attractiveness,
- displayed stock,
- progression,
- temporary effects,
- and future specialization.

Exact equations belong to later balancing.

---

## 9.2 CUSTOMER CAPACITY

The shop should support a limited number of active customers.

This creates:

- visible life,
- pacing,
- a reason to expand,
- and a natural ceiling on interaction overload.

Customers should not instantly disappear merely because the player does not tap them within seconds.

The game should avoid punishing normal attention shifts.

---

## 9.3 CUSTOMER REQUESTS

Normal customers should primarily request products connected to:

- displayed inventory,
- their preferences,
- current demand,
- and available progression.

This makes stocking decisions meaningful.

A customer may occasionally create a request the player cannot satisfy, but repeated impossible requests must be avoided.

---

## 9.4 CUSTOMER TYPES

This document does not define the final customer taxonomy.

However, the engine should eventually support at least three functional levels:

### Walk-in customers

Frequent, quick, core transaction loop.

### Order / request customers

Provide short- or medium-term production targets.

### Special / high-value visitors

Occasional spikes that create excitement and preparation.

The exact names, frequency, rewards, visuals, and unlock conditions belong to the dedicated customer system.

---

# 10. CRAFTING ENGINE — CORE REQUIREMENTS

Crafting must be more than a timer list.

The player should feel that production is a pipeline they manage.

---

## 10.1 LIMITED ACTIVE PRODUCTION

The player has limited concurrent production capacity.

This can be represented later through:

- crafting slots,
- stations,
- workers,
- Catchmon assignments,
- or a hybrid.

What is locked is:

> **Production capacity is constrained enough that choosing what occupies it matters.**

If everything can be crafted simultaneously, the production decision loses meaning.

---

## 10.2 QUEUEING

The player should be able to prepare upcoming production without excessive micromanagement.

The precise queue rules may change by progression.

The UX goal is:

> active decisions without constant babysitting.

---

## 10.3 CRAFT COMPLETION

Completed products should create a satisfying ready state.

They should become:

- inventory,
- stock candidates,
- order progress,
- mastery progress,
- or future crafting inputs depending on later system design.

Craft completion should naturally create the next decision:

> **“What do I make now?”**

---

# 11. MATERIAL CADENCE

The core loop cannot rely exclusively on long external expeditions for normal crafting.

Otherwise the active shop would repeatedly stall.

Therefore materials should eventually be divided structurally into at least two functional groups.

---

## 11.1 ROUTINE INPUTS

Common inputs needed for regular shop operation.

These must replenish or be obtainable frequently enough to support normal crafting cadence.

The exact system could involve:

- local supply,
- regeneration,
- shop infrastructure,
- Catchmon gathering,
- suppliers,
- or another later economy mechanism.

---

## 11.2 SPECIAL COMPONENTS

Less common inputs used for:

- valuable products,
- advanced products,
- special orders,
- progression gates,
- or rare crafting.

These may rely more strongly on:

- expeditions,
- discoveries,
- special customers,
- events,
- Catchmons,
- or external world systems.

---

## 11.3 LOCKED CADENCE PRINCIPLE

Routine production should rarely be completely blocked because every material source is on a long timer.

Special production may intentionally create anticipation.

This creates two tempos:

> **Always something useful to make.**

and

> **Something special worth waiting for.**

---

# 12. DISPLAY / STOCKING ENGINE

Displaying products is the bridge between crafting and customers.

It must therefore have more purpose than decoration.

---

## 12.1 DISPLAY CAPACITY

The shop has limited active display capacity.

Expansion later increases or specializes it.

---

## 12.2 DISPLAYED PRODUCT SIGNAL

Displayed products signal what the shop currently sells.

They should influence:

- request probability,
- customer targeting,
- demand fulfillment,
- visual shop identity,
- and potentially future bonuses.

---

## 12.3 AUTO-RESTOCK QUALITY OF LIFE

The engine should support convenient restocking once the player understands the system.

Potential later tools include:

- auto-restock from inventory,
- reserve minimum stock,
- favorite product slots,
- category stocking rules.

These should be progression or UX tools, not mandatory first-minute complexity.

---

# 13. THE CORE FEEDBACK TRIANGLE

The central engine can be understood as three linked states:

# PRODUCTION

“What will I have?”

↕

# PRESENTATION

“What am I trying to sell?”

↕

# CUSTOMER RESPONSE

“What opportunity is the shop giving me?”

The player constantly adjusts one based on the other two.

This triangle must remain visible in later system design.

---

# 14. CATCHMON TOUCHPOINTS IN THE CORE ENGINE

The full Catchmon integration belongs to Document 06.

However, the core engine must reserve meaningful attachment points now.

Catchmons should be able to influence the core loop in multiple distinct ways.

The exact roster mapping remains open.

---

## 14.1 PRODUCTION TOUCHPOINT

A Catchmon may:

- support a station,
- improve a product family,
- change crafting tempo,
- improve material efficiency,
- enable a special interaction,
- or unlock a production capability.

---

## 14.2 SHOP-FLOOR TOUCHPOINT

A Catchmon may:

- support customer flow,
- influence certain customer preferences,
- improve specific transaction types,
- create shop events,
- or provide visible functional activity.

---

## 14.3 SUPPLY TOUCHPOINT

A Catchmon may:

- gather,
- scout,
- explore,
- improve expedition access,
- specialize material acquisition,
- or reveal unusual opportunities.

---

## 14.4 SYNERGY TOUCHPOINT

Two or more Catchmons may create combinations that affect:

- production,
- supply,
- customer behavior,
- or specialization.

This allows the collection to create strategy rather than just additive bonuses.

---

## 14.5 IMPORTANT LIMIT

The player must not be forced to manually move dozens of Catchmons every few minutes.

Catchmon assignment should create strategic setup decisions, not constant roster administration.

---

# 15. ACTIVE PLAY VS. PASSIVE PROGRESS

Catchmon Shop is not intended to be a pure idle game.

However, timers and mobile return play are valuable.

The engine therefore needs a deliberate division.

---

## 15.1 WHAT SHOULD PROGRESS WHILE AWAY

Depending on unlocked systems, the following may complete or recover offline:

- active crafts,
- routine material supply,
- expeditions,
- Catchmon rest/recovery if such a system exists,
- building upgrades,
- certain long-term tasks.

The exact systems will be defined later.

---

## 15.2 WHAT SHOULD REMAIN MEANINGFULLY ACTIVE

The best-value shop operation should remain primarily interactive.

In particular:

- premium sales,
- customer redirection,
- strategic Momentum use,
- display decisions,
- production reprioritization,
- key reinvestment decisions.

The game should not automatically perform the player's best commercial decisions while they are away.

---

## 15.3 OPTIONAL FUTURE AUTOMATION

Later progression may unlock limited automation.

If so, automation should:

- remove repetitive chores,
- operate at lower efficiency or under player-defined rules,
- preserve meaningful strategic decisions,
- and feel like earned shop sophistication.

Automation must not invalidate the core shop fantasy.

---

# 16. SESSION ENTRY — THE FIRST 30 SECONDS

Returning to the game should immediately present useful state changes.

A strong return sequence might contain:

- one or more completed crafts,
- restocked routine resources,
- an expedition or external task ready,
- customers available,
- a visible current goal,
- and enough context to start the next production decision.

The desired first-30-second pattern is:

### 1. SEE SOMETHING READY

“Something happened while I was away.”

### 2. CLAIM / RESOLVE IT

“Good, I got value.”

### 3. START SOMETHING NEW

“My shop is moving again.”

### 4. MAKE ONE ACTIVE DECISION

“I am actually operating the business.”

The player should not need to clear ten unrelated notification screens before seeing the shop.

---

# 17. THE 2-MINUTE SESSION

A player with two minutes should still have a complete satisfying visit.

Target experience:

### 0:00–0:20

See shop state and collect finished production.

### 0:20–0:50

Restock key displays and queue new crafts.

### 0:50–1:30

Resolve several customer interactions.

Build or spend Momentum.

### 1:30–1:50

Resolve one ready external/Catchmon-related result if available.

### 1:50–2:00

Leave production and a clear next objective running.

The session should feel like:

> **“I improved my position.”**

not:

> “I only collected timers.”

---

# 18. THE 10-MINUTE SESSION

A 10-minute session is the core engaged mobile play pattern.

The player should be able to cycle repeatedly between:

- customer interactions,
- production completions,
- restocking,
- Momentum decisions,
- inventory adaptation,
- short objectives,
- upgrades,
- and occasional Catchmon/external interactions.

A representative session:

1. collect completed crafts,
2. inspect current inventory pressure,
3. queue 2–4 useful crafts,
4. handle customer wave,
5. intentionally build Momentum,
6. spend Momentum on a valuable transaction,
7. restock displays,
8. use shop success to advance production,
9. complete an order or goal,
10. purchase or start one meaningful improvement,
11. assign or resolve one Catchmon-related opportunity,
12. leave with the next cycle prepared.

The player should experience at least one **payoff moment**, not only maintenance.

---

# 19. THE 30-MINUTE SESSION

A longer engaged player must not run out of meaningful activity after the first few minutes.

The engine should support continued play through overlapping cycles.

Potential 30-minute structure:

### Micro loop

Customers and sales.

### Short loop

Crafting and restocking.

### Tactical loop

Momentum build/spend cycles.

### Objective loop

Orders, mastery targets, unlock requirements, or preparation goals.

### Strategic loop

Shop upgrades, Catchmon assignments, specialization choices.

### External loop

Expedition results, discoveries, rare components, Catchmon opportunities.

The player can move between loops whenever one is waiting.

This is essential.

No single timer should determine whether the player is “allowed” to continue playing.

---

# 20. LOOP CADENCE BY TIME HORIZON

The complete game should eventually operate across multiple time horizons.

---

## 10–30 SECONDS — MICRO DECISION

Examples:

- serve customer,
- choose transaction action,
- restock,
- claim craft,
- start next craft.

Goal:

**constant responsiveness**

---

## 1–5 MINUTES — SMALL PAYOFF

Examples:

- Momentum cycle,
- short craft completion,
- complete simple customer objective,
- stock refresh,
- small upgrade threshold.

Goal:

**frequent satisfaction**

---

## 10–30 MINUTES — SESSION GOAL

Examples:

- finish a useful production batch,
- complete an order chain,
- acquire needed materials,
- afford an expansion,
- prepare for a special visitor.

Goal:

**session-level accomplishment**

---

## HOURS — RETURN HOOK

Examples:

- advanced craft,
- expedition,
- upgrade,
- rare opportunity preparation.

Goal:

**reason to return**

---

## DAYS — PROGRESSION ARC

Examples:

- unlock product family,
- obtain Catchmon,
- develop a specialization,
- expand shop capability,
- reach new world access.

Goal:

**meaningful structural progression**

---

## WEEKS+ — COLLECTION / MASTERY ARC

Examples:

- complete collection groups,
- evolve important Catchmons,
- master product families,
- optimize advanced shop strategies,
- pursue rare discoveries.

Goal:

**long-term identity and ownership**

---

# 21. “ONE MORE ACTION” ENGINE

The game should intentionally chain completion into another attractive action.

A good completion should reveal or enable the next thing.

Examples:

### Craft completes
→ inventory can be stocked  
→ customer wants it  
→ sale creates Momentum  
→ Momentum enables premium sale  
→ premium sale funds upgrade  
→ upgrade opens new craft

or:

### Expedition completes
→ rare component obtained  
→ special product becomes craftable  
→ product attracts special customer  
→ special sale advances Catchmon goal

The important principle:

> **Rewards should create decisions, not only numbers.**

---

# 22. PLAYER ATTENTION MANAGEMENT

The shop must feel lively without becoming stressful.

Therefore:

- not every system should demand attention simultaneously,
- routine states should resolve quickly,
- important opportunities should stand out,
- the game should avoid red notification spam,
- missed ordinary customers should not create severe punishment,
- players should be able to pause mentally and inspect the shop,
- long-term planning should happen between bursts of transactions.

The intended feeling is:

> **busy and satisfying**

not:

> frantic and exhausting.

---

# 23. FAILURE / FRICTION PHILOSOPHY

Core commerce should produce optimization pressure, not harsh punishment.

Avoid as default:

- random craft destruction,
- customers permanently lost from brief inactivity,
- hidden negotiation failure that destroys expensive products,
- severe resource loss from ordinary mistakes,
- mandatory rapid tapping,
- irreversible early build traps.

Meaningful tradeoffs should come from opportunity cost:

- I used Momentum here instead of there.
- I crafted this instead of that.
- I displayed these products.
- I assigned this Catchmon to this role.
- I invested in this upgrade first.

This allows strategy without making the game hostile.

---

# 24. INFORMATION THE PLAYER MUST ALWAYS UNDERSTAND

During the core loop, the player should be able to quickly understand:

### Production
- what is crafting,
- how long remains,
- what can be crafted next.

### Inventory
- what is low,
- what is overstocked,
- what is displayed.

### Customer
- what they want,
- what the sale is worth,
- what the available interaction choices do.

### Momentum
- current amount,
- how an action changes it,
- what powerful action it enables.

### Goal
- what meaningful next target is within reach.

### Catchmon impact
- when a Catchmon is currently helping,
- what meaningful effect it provides.

The player should not need external calculation to understand ordinary decisions.

---

# 25. ENGINE STATE MODEL

For implementation and later prototyping, the core game can be understood as several continuously interacting state machines.

---

## STATE A — PRODUCTION

`IDLE → QUEUED → CRAFTING → READY → COLLECTED → IDLE`

---

## STATE B — DISPLAY SLOT

`EMPTY → STOCKED → RESERVED/REQUESTED → SOLD → EMPTY`

or

`STOCKED → AUTO-RESTOCKED`

when later quality-of-life systems allow it.

---

## STATE C — CUSTOMER

`ARRIVE → BROWSE → REQUEST → PLAYER DECISION → TRANSACTION/DECLINE → LEAVE`

Special customers may branch later.

---

## STATE D — MOMENTUM

`EARN → ACCUMULATE → CAP/PREPARE → SPEND → REBUILD`

The desired gameplay rhythm is cyclical rather than “always stay full”.

---

## STATE E — CATCHMON ASSIGNMENT

At core level:

`AVAILABLE → ASSIGNED → PROVIDING FUNCTION → REASSIGNED / EXTERNAL TASK → RETURN`

The detailed rules belong to Document 06.

---

# 26. MAIN SHOP SCREEN REQUIREMENT

The final UX is not designed here.

However, the core engine imposes one product requirement:

> **The main shop screen must expose enough of the core loop that operating the shop feels spatial and alive rather than like navigating independent menus.**

The player should ideally be able to perceive from the main shop state:

- customers,
- displayed inventory,
- relevant Catchmons,
- production readiness,
- important shop activity,
- and progression in the physical space.

Supporting screens will still exist.

But the shop itself must remain the emotional home of the game.

---

# 27. NO-MENU-FIRST RULE

A later UX proposal should be rejected if most play becomes:

> open production menu  
> close  
> open customer menu  
> close  
> open Catchmon menu  
> close  
> open inventory menu  
> close

The player will need management screens.

But the primary loop should feel anchored to one coherent place.

---

# 28. EARLY-GAME ENGINE

The first playable version should intentionally begin with a reduced form of the complete engine.

Initial systems should prove:

1. craft,
2. stock,
3. receive customer,
4. sell,
5. build/spend Momentum,
6. reinvest,
7. use one Catchmon meaningfully.

Do not introduce every later system immediately.

---

## 28.1 EARLY PLAYER LESSON ORDER

Recommended conceptual teaching order:

### Lesson 1 — Make

“Start producing a product.”

### Lesson 2 — Sell

“A customer wants what you made.”

### Lesson 3 — Restock

“You need to keep the shop supplied.”

### Lesson 4 — Momentum

“Not every transaction should be handled the same way.”

### Lesson 5 — Reinvest

“Profit improves your ability to operate.”

### Lesson 6 — Catchmon Impact

“This Catchmon changes something useful in your shop.”

### Lesson 7 — External Opportunity

“The shop and collection connect to a larger world.”

This order establishes the core fantasy before adding complexity.

---

# 29. MID-GAME ENGINE EVOLUTION

As the game grows, progression should not merely increase craft times and prices.

The core engine should gain new dimensions such as:

- more differentiated customer demand,
- broader product portfolios,
- multiple production bottlenecks,
- stronger Momentum decisions,
- specialized Catchmon configurations,
- advanced order types,
- rare components,
- meaningful display strategies,
- competing short-term goals,
- and specialization.

Each new layer should attach to the existing loop.

---

# 30. LATE-GAME ENGINE EVOLUTION

Late game should focus increasingly on:

- portfolio optimization,
- valuable customer targeting,
- advanced Catchmon synergies,
- rare production chains,
- mastery,
- collection completion,
- large shop identity,
- and strategic specialization.

The game should avoid transforming late game into:

> “the same shop, but every timer is 12 hours.”

Longer timers may exist, but they must coexist with active short-loop content.

---

# 31. CONTENT SHOULD NOT BREAK THE ENGINE

Later documents will define many content types.

Every new content system must answer:

> **Which part of the core engine does this improve?**

Examples:

### New product family
Changes production and customer decisions.

### New Catchmon
Changes production, supply, shop, or synergy strategy.

### New building
Changes capacity or introduces a new meaningful interaction.

### New region
Changes supply, discovery, and available product possibilities.

### New rarity
Changes acquisition or investment decisions.

If a system sits entirely outside the engine, its value must be questioned.

---

# 32. CORE ANTI-PATTERNS

The following should be treated as warning signs.

---

## ANTI-PATTERN A — CRAFT THE HIGHEST ITEM FOREVER

If the best decision is always to craft the highest-tier item, production strategy has failed.

---

## ANTI-PATTERN B — ALWAYS PREMIUM-PITCH THE MOST EXPENSIVE ITEM

If Momentum has one universally optimal use, transaction strategy has failed.

Costs and opportunities must create context.

---

## ANTI-PATTERN C — DISPLAY DOES NOT MATTER

If customers request random inventory regardless of display, the shop floor loses strategic purpose.

---

## ANTI-PATTERN D — CATCHMON = +5%

If most Catchmons only provide interchangeable percentage bonuses, collection design has failed.

---

## ANTI-PATTERN E — TOO MANY CLAIM BUTTONS

If returning to the game means clearing many rewards before making a decision, the loop becomes administrative.

---

## ANTI-PATTERN F — IDLE WALL

If every meaningful action becomes blocked by timers simultaneously, the active engine has failed.

---

## ANTI-PATTERN G — TRANSACTION SPAM

If optimal play requires rapidly tapping dozens of identical customers, the active loop has become labor.

---

# 33. PROTOTYPE QUALITY TARGETS

These are **design validation targets**, not final balance values.

A first playable core-loop prototype should aim for:

### Immediate comprehension
The player can identify the main shop action within a few seconds.

### Early first sale
The player completes a real transaction within roughly the first minute of a new game.

### Frequent decision cadence
During active play, the player usually receives a meaningful decision or payoff every approximately 10–30 seconds.

### No early hard idle
The first 10 minutes should not contain a period where every meaningful system is waiting and the player has nothing useful to decide.

### Visible cause and effect
After a sale, craft completion, Catchmon assignment, or upgrade, the player can understand what changed.

### Short-session closure
A two-minute session can end with productive states running.

### Long-session continuity
A 30-minute session can remain active by rotating between overlapping loops rather than demanding artificial minigames.

These targets should be validated through playtesting rather than assumed correct.

---

# 34. CORE LOOP PROTOTYPE — MINIMUM PLAYABLE ENGINE

Before building the full game, the smallest prototype capable of validating this document should contain only:

## Content

- 3–5 placeholder product recipes,
- 2 routine material types,
- 1 special component type,
- 2 production slots/stations,
- 3 display slots,
- 1 inventory,
- 1 basic customer archetype,
- 1 special customer condition,
- 1 Momentum meter,
- 4 transaction actions,
- 1 simple shop upgrade,
- 1 Catchmon with a meaningful production/shop effect.

## Required interactions

- start craft,
- craft completes,
- collect item,
- stock item,
- customer arrives,
- customer requests item,
- standard sale,
- favorable deal,
- premium pitch,
- recommendation,
- Momentum gain/spend,
- inventory decreases,
- money increases,
- production can be tactically advanced,
- shop upgrade purchased,
- Catchmon effect is visible.

## Prototype question

Do not ask:

> “Does it already look like the final game?”

Ask:

> **“Is operating this tiny shop already enjoyable when almost no content exists?”**

If the answer is no, more content must not be used to hide the problem.

---

# 35. PROTOTYPE TEST SCENARIOS

The prototype should deliberately test the following situations.

---

## Scenario A — Low Momentum, cheap stock

Does the player understand why a favorable deal can be useful?

---

## Scenario B — High Momentum, valuable customer

Does spending Momentum feel like a satisfying payoff?

---

## Scenario C — Overstock

Can recommendation/display decisions help solve the problem?

---

## Scenario D — Production bottleneck

Can active shop success help the player get production moving again?

---

## Scenario E — Catchmon assignment

Does adding one Catchmon create a noticeable strategic difference?

---

## Scenario F — Return after absence

Does the player immediately have something useful to resolve and restart?

---

# 36. CORE METRICS TO OBSERVE IN TESTING

Do not optimize only for retention metrics before the game is enjoyable.

For core-loop tests, observe:

### Decision diversity
How often do players choose different transaction actions?

### Production diversity
Do players craft more than one “obvious” product?

### Momentum cycling
Do players naturally earn and spend Momentum, or hoard it forever?

### Display relevance
Do players consciously change what is displayed?

### Dead time
How often is there nothing meaningful to do?

### Administrative burden
How much time is spent merely claiming/restocking versus deciding?

### Catchmon salience
Can players explain what their assigned Catchmon changed?

### Session exit state
Do players intentionally set something up before leaving?

---

# 37. LOCKED DECISIONS FROM DOCUMENT 02

The following decisions are now considered part of the intended core engine unless deliberately revised:

1. The shop is the primary interactive gameplay space.
2. The core engine is `prepare → craft → stock → customer → transaction decision → resolve → react → reinvest`.
3. Crafting uses constrained production capacity.
4. Stored inventory and actively displayed inventory are meaningfully different.
5. Displayed products influence ordinary customer demand.
6. Normal customer interactions require a player decision rather than automatic sale.
7. The core transaction framework contains:
   - Standard Sale,
   - Favorable Deal,
   - Premium Pitch,
   - Recommend.
8. A capped tactical active-play resource exists under the working name **Shop Momentum**.
9. Favorable transactions can trade immediate profit for Momentum.
10. Premium sales spend Momentum for greater immediate value.
11. Recommendation can redirect compatible demand under a constraint.
12. Active shop success can feed back into production tempo through a Momentum-based function.
13. Routine materials must support regular production cadence.
14. Special components may support longer anticipation loops.
15. Core premium commercial decisions remain primarily active rather than fully automated offline.
16. Offline progress may complete timers and resource/external tasks.
17. Catchmons must have reserved touchpoints in production, shop, supply, and synergy systems.
18. Catchmon management must avoid constant manual reassignment.
19. The core loop must support satisfying 2-minute, 10-minute, and 30-minute sessions.
20. The main shop screen must remain the emotional and functional center of the game.
21. The first prototype must validate the shop engine with minimal content before full content production begins.

---

# 38. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document does **not** decide:

- the final thematic name for Shop Momentum,
- Momentum cap and formulas,
- exact premium-sale multiplier,
- exact favorable-deal reduction,
- exact recommendation rules,
- exact production acceleration mechanic,
- exact customer arrival equations,
- exact customer archetypes,
- exact materials,
- exact crafting times,
- exact product families,
- exact product quality system,
- exact mastery system,
- exact worker/station structure,
- exact Catchmon bonuses,
- exact expedition structure,
- exact offline caps,
- exact automation rules,
- exact currencies,
- exact shop upgrade costs,
- exact visual shop layout.

These require their own owner documents.

---

# 39. DEPENDENCY HANDOFF TO DOCUMENT 03

The core engine now creates requirements that the economy must satisfy.

The economy architecture must be able to support:

- frequent routine crafting,
- meaningful expensive products,
- favorable short-term deals,
- premium transaction payoffs,
- investment into shop growth,
- special components,
- multiple progression horizons,
- and Catchmon-linked opportunity without overwhelming currency count.

Therefore the next document should not begin by inventing 30 resources.

It should first define:

> **How value flows through the entire game.**

---

# 40. NEXT DOCUMENT

## `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`

The next document should define the structural economy before individual items are named.

It must answer:

### Value model
What kinds of value exist?

### Main currency
What is the primary transactional currency and what are its major sources/sinks?

### Routine resources
How do normal production inputs enter and leave the economy?

### Special components
How are high-value inputs controlled?

### Shop Momentum boundary
Why Momentum is not a permanent currency and how it stays separate from the macro economy.

### Inflation control
How does the game avoid every number becoming meaningless?

### Early/mid/late economy
How does the economic structure expand without currency clutter?

### Reinvestment
What categories compete for the player's money?

### Catchmon economy link
How does collection progression affect economic opportunity without turning Catchmons into purchasable stat sticks?

### Return economy
What accumulates while the player is away, and what intentionally does not?

Only after Economy Architecture is stable should the project define exact recipe families, items, resource icons, and production content.

---

# 41. DEFINITION OF DONE FOR CORE GAMEPLAY ENGINE

Document 02 is ready to hand off when the project can answer all of these questions clearly:

- What does the player do during ordinary active play?
- Why is crafting a decision instead of a timer?
- Why does stocking matter?
- Why are customers interactive?
- Why is every sale not handled the same way?
- What is Shop Momentum for?
- How does selling feed back into crafting?
- How can two minutes of play feel useful?
- How can 30 minutes remain engaging?
- What progresses offline?
- What stays intentionally active?
- Where do Catchmons connect to the core engine?
- What prevents Catchmons from becoming passive stat cards?
- What is the smallest prototype capable of validating the loop?
- Which details are deliberately deferred to later documents?

If these answers remain stable during prototyping, the project can proceed into the economic architecture without redefining its core game.
