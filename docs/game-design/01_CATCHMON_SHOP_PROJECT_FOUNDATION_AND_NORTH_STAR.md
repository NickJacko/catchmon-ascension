# CATCHMON SHOP — 01 PROJECT FOUNDATION & NORTH STAR

**Status:** Foundation v1  
**Purpose:** Authoritative project charter for the new Catchmon shop-management game  
**Scope:** Product identity, core fantasy, design pillars, boundaries, source-of-truth rules, and decision discipline  
**Out of scope:** Detailed economy, crafting recipes, buildings, progression curves, UI layouts, asset lists, balancing, monetization, live ops

---

## 1. WHY THIS DOCUMENT EXISTS

This document is the first source of truth for the new Catchmon project.

Its job is **not** to design every system. Its job is to make sure that every later system is designed for the same game.

Every later design document must be checked against this foundation before a mechanic, asset family, UI pattern, progression layer, or content system is accepted.

If a later idea conflicts with this document, one of two things must happen:

1. the later idea is changed, or
2. this foundation is deliberately revised and versioned.

The project must never drift through dozens of small, undocumented exceptions.

---

# 2. WORKING PROJECT IDENTITY

## Working title

**Catchmon Shop**

This is a working title only.

A final commercial name will be defined later when the product fantasy, world identity, tone, and visual language are mature enough to judge naming properly.

The working title should therefore be used consistently in project files until a dedicated naming phase replaces it.

---

# 3. HIGH-CONCEPT STATEMENT

> **Catchmon Shop is a mobile-first shop-management and creature-collection game in which players craft and sell valuable goods, negotiate with customers, expand an increasingly impressive shop, and use collected Catchmons to unlock, improve, and specialize the economic systems that power the business.**

The game combines two fantasies:

### Fantasy A — The Shopkeeper

The player wants to:

- manufacture increasingly desirable products,
- keep production flowing,
- choose what to sell and when,
- make satisfying high-value sales,
- reinvest profits,
- unlock better production possibilities,
- improve the physical shop,
- and watch a small business grow into an exceptional fantasy commerce hub.

### Fantasy B — The Catchmon Collector

The player wants to:

- discover Catchmons,
- catch them,
- complete the collection,
- develop favorite Catchmons,
- understand what each Catchmon is good at,
- build useful combinations,
- unlock new possibilities through the collection,
- and feel that every meaningful catch changes what can be done in the game.

Neither fantasy is secondary.

The shop must not feel like a wrapper around a creature collector.

The Catchmons must not feel like decorative mascots attached to a shop simulator.

The product succeeds only if both fantasies reinforce each other.

---

# 4. THE CENTRAL DESIGN THESIS

The fundamental design thesis is:

> **The shop is the active gameplay engine. Catchmons are the strategic collection layer that changes and expands that engine.**

This distinction is critical.

The game is **not** primarily:

- a passive idle game,
- a settlement builder,
- a creature battler,
- a traditional RPG,
- a farming game,
- or a menu-based collection app.

The player should repeatedly return because there are meaningful things to **make, sell, optimize, unlock, collect, assign, improve, and prepare**.

The shop is therefore not merely a visual home screen.

It is the economic and interaction center of the game.

---

# 5. CORE EXPERIENCE LOOP — FOUNDATION LEVEL

The detailed loop will be designed in a dedicated document.

At foundation level, the intended relationship is:

**Acquire materials / opportunities**

→ **Craft products**

→ **Display and sell products**

→ **Interact with customer demand and selling decisions**

→ **Earn currency and progression**

→ **Reinvest into shop, production, recipes, capacity, and collection**

→ **Use Catchmons to access or improve new opportunities**

→ **Obtain stronger or rarer inputs and possibilities**

→ **Craft more valuable or more specialized products**

→ repeat

The Catchmon loop must intersect this loop instead of running beside it.

At least one of the following should normally be true when a meaningful Catchmon is obtained or improved:

- a new production possibility becomes available,
- an existing production chain becomes more efficient,
- a new resource source becomes practical,
- an expedition or acquisition opportunity becomes viable,
- a recipe family becomes stronger,
- a new shop strategy becomes possible,
- a new synergy becomes available,
- or a previous bottleneck can be solved differently.

A Catchmon that changes nothing except a collection counter is insufficient as a standard design pattern.

---

# 6. PRIMARY PLAYER PROMISE

The game should repeatedly create the feeling:

> **“One more useful sale, one more upgrade, one more recipe, one more Catchmon, and my whole shop gets better.”**

This is more important than maximizing raw system count.

The player should frequently see an achievable next improvement.

At the same time, the game needs enough long-term depth that obtaining the next improvement can change the player's strategy rather than simply increasing a number.

---

# 7. DESIGN PILLARS

These pillars are mandatory evaluation criteria for later systems.

---

## PILLAR 1 — THE SHOP MUST BE FUN TO OPERATE

The shop cannot be a passive income generator with decorative customers.

The player needs recurring decisions connected to commerce.

Future systems may include concepts such as:

- what to craft,
- what to stock,
- what to hold,
- what to sell,
- whom to sell to,
- when to use a selling advantage,
- which production queue deserves priority,
- which resource bottleneck to solve,
- and which expansion creates the best next step.

The exact mechanics are deliberately not locked here.

What is locked is the requirement that **shop operation itself must provide gameplay**.

---

## PILLAR 2 — CATCHMONS MUST HAVE SYSTEMIC VALUE

The existing roster of **104 Catchmons** is one of the project's strongest reusable foundations.

The collection must not be reduced to portraits, rarity, and passive stat bonuses.

Catchmons should eventually have understandable roles inside the larger economy.

Possible dimensions include:

- production,
- exploration,
- acquisition,
- specialization,
- shop support,
- crafting affinity,
- resource affinity,
- customer interaction,
- unique utility,
- evolution,
- and multi-Catchmon synergy.

The exact role taxonomy will be defined later.

The principle is already fixed:

> **A player should care which Catchmon they caught, not only how rare it is.**

---

## PILLAR 3 — PROGRESSION MUST CHANGE THE GAME, NOT ONLY THE NUMBERS

A new tier should ideally unlock a new decision, dependency, interaction, specialization, or content family.

Progression should avoid becoming only:

- +10% production,
- +20% value,
- longer timers,
- larger prices,
- and visually reskinned versions of the same loop.

Numerical scaling will exist, but it must support structural progression.

Later phases must therefore distinguish between:

### Vertical progression
Numbers become stronger.

and

### Horizontal progression
The player gains new possibilities.

Both are needed.

---

## PILLAR 4 — THE COLLECTION AND ECONOMY MUST FEED EACH OTHER

The strongest long-term structure is circular:

**Shop progression helps collection progression.**

and

**Collection progression helps shop progression.**

Examples of the relationship may later include:

- shop upgrades enabling better Catchmon acquisition,
- Catchmons improving access to rare materials,
- rare materials enabling valuable products,
- valuable products funding new collection infrastructure,
- collection milestones unlocking special economic options.

The project should avoid two independent progression tracks that barely interact.

---

## PILLAR 5 — THE WORLD MUST FEEL ALIVE

Even though the shop is the central engine, the game should not feel like a spreadsheet with fantasy art.

Players should gradually see:

- customers arriving and leaving,
- products being used or displayed,
- Catchmons occupying meaningful places,
- shop stations becoming active,
- upgrades changing the environment,
- expeditions or returns creating visible events,
- rare events interrupting routine,
- and the business becoming visually more impressive.

Visual growth is part of progression.

---

## PILLAR 6 — CLARITY BEFORE COMPLEXITY

The finished game may become deep.

The first minutes must not feel deep.

Every system should be introduced when the player has a reason to care about it.

Avoid:

- five currencies visible at the start,
- unexplained role icons,
- multiple overlapping upgrade trees,
- dozens of material types before they matter,
- redundant resource tiers,
- and systems that exist only because similar games have them.

The player should be able to answer:

1. What can I do?
2. Why should I do it?
3. What do I get?
4. What becomes possible next?

---

## PILLAR 7 — MOBILE-FIRST DOES NOT MEAN SHALLOW

The product is mobile-first.

Therefore:

- major actions need clear hierarchy,
- interactions must work comfortably on touch,
- important information must remain readable at small sizes,
- repetitive actions should not require unnecessary precision,
- screens should avoid desktop-dashboard density,
- and major decisions should be understandable without opening five nested menus.

Depth should come from interacting systems, not from UI friction.

---

# 8. INSPIRATION BOUNDARY

Shop Titans is an important reference for the desired **shop-management gameplay engine**, particularly the idea of a repeating commerce loop in which production, selling, reinvestment, unlocks, and external acquisition systems reinforce each other.

However, Catchmon Shop must not be designed as a reskin.

The project should extract **design principles**, not reproduce protected expression, specific content, exact UI, names, numerical structures, art, progression tables, or distinctive implementation details.

For every borrowed design idea, the later design process should ask:

> **What is the Catchmon-native version of this mechanic?**

A mechanic should survive because it strengthens Catchmon Shop, not because another game contains it.

---

# 9. WHAT THE GAME IS NOT

These exclusions prevent feature drift.

## No combat-first design

Catchmons are not being created primarily to participate in a traditional battle system.

Combat should not be introduced casually as a solution for progression.

If combat is ever proposed later, it requires a deliberate foundation-level reconsideration.

---

## No pure idle economy

Offline progression may eventually exist.

Automation may eventually exist.

Timers may exist.

But the core experience must not collapse into:

> open app → collect accumulated currency → buy upgrade → close app.

---

## No giant generic skill tree by default

A traditional universal skill tree is not assumed to exist.

Progression should first attempt to come from:

- shop development,
- recipes,
- Catchmons,
- specializations,
- production infrastructure,
- collection milestones,
- and system interactions.

A skill tree may only be added later if it solves a specific design need that these systems cannot solve elegantly.

---

## No meaningless collection inflation

The project already has 104 Catchmons.

The immediate goal is **not** to increase that number.

The goal is to make the existing roster valuable enough that players remember and care about individual Catchmons.

---

## No asset generation before system need is understood

Do not mass-generate:

- buildings,
- item icons,
- resource icons,
- badges,
- currencies,
- crafting stations,
- decorative props,
- or new symbols

before their gameplay function and visual family have been defined.

Assets should be generated from an approved asset specification, not used to invent the design retroactively.

---

# 10. EXISTING REUSABLE FOUNDATION

The new project does not start with nothing.

The following existing material is intentionally treated as reusable input:

## 10.1 The 104 Catchmons

The existing Catchmon roster should be preserved as a major content asset.

Later documents will determine:

- role taxonomy,
- element interactions,
- rarity philosophy,
- evolution,
- progression,
- acquisition,
- specialization,
- synergies,
- and how every Catchmon participates in the shop economy.

No role assignments are locked by this foundation document.

---

## 10.2 Existing Catchmon design-system sources

The current project already defines authoritative design-system sources.

Later visual work must build on them instead of creating a parallel token system.

The currently declared authoritative locations include:

- `src/ui/tokens.css`
- `docs/reference/element-farbkompass.md`
- `src/systems/animation/motionTokens.ts`
- `src/data/world/regions.ts`
- `src/ui/icons/`

These sources govern existing global tokens, element colors, motion values, region metadata, and shared icons.

This foundation intentionally does **not** duplicate those values.

---

# 11. DESIGN-SYSTEM GUARDRAILS

The existing design-system source establishes several rules that remain binding when the new project's visual phase begins.

## Reuse before invention

Before adding a new token, icon, color, spacing value, or motion value, first determine whether an authoritative equivalent already exists.

## No duplicate element color system

Each Catchmon element should use its own established semantic element color.

A different element color must not be borrowed purely for visual effect.

## No duplicate spacing / typography system

The new project must not create a second unrelated spacing or typography language if the existing design system already provides the needed foundation.

## Existing icons first

Shared production UI should reuse suitable icons from the existing SVG set before introducing a new equivalent.

Game-specific icons may be added later when there is a documented semantic need.

## Mobile readability

Touch targets, contrast, and small-screen readability remain mandatory constraints.

## Dark / light compatibility

Shared chrome and reusable UI components must be checked against the relevant supported backgrounds and themes.

---

# 12. DECISION HIERARCHY

When two design ideas compete, evaluate them in this order:

### 1. Does it strengthen the core shop-management loop?

If not, it is probably not core.

### 2. Does it make Catchmons more meaningful?

If it reduces Catchmons to passive bonuses or decoration, reconsider it.

### 3. Does it create a useful decision?

If the system has only one obviously correct action, its complexity may be unnecessary.

### 4. Does it improve progression?

Prefer mechanics that unlock possibilities over mechanics that only inflate values.

### 5. Can the player understand it?

Depth that cannot be communicated cleanly is not finished design.

### 6. Does it strengthen the world fantasy?

Prefer mechanics that can be represented visibly in the shop or world.

### 7. Is the implementation/content cost justified?

A system that needs hundreds of assets or variants must provide proportionate value.

---

# 13. CONTENT DISCIPLINE

Every future content type must justify its existence.

Before adding a new:

- currency,
- material,
- recipe family,
- building,
- Catchmon role,
- rarity,
- upgrade dimension,
- status,
- icon,
- customer type,
- expedition type,
- or progression system,

the design should answer:

1. What player decision does this create?
2. Which existing system does it interact with?
3. What new possibility does it unlock?
4. Why can an existing content type not serve the same purpose?
5. How does the player understand its value?
6. How expensive is it to produce and maintain?

If these questions cannot be answered, the content should not yet be added.

---

# 14. NORTH-STAR PLAYER MOMENTS

Later systems should collectively create moments such as these.

These are emotional targets, not finalized mechanics.

---

## Moment A — The satisfying sale

A customer wants something valuable.

The player realizes they can turn the transaction into a much better sale through a limited strategic resource, preparation, timing, or customer understanding.

The sale lands.

The reward is visibly meaningful.

The player immediately knows what they want to invest it into.

---

## Moment B — The important catch

A Catchmon appears that the player has wanted for a reason beyond rarity.

Catching it unlocks or improves a strategy the player has been preparing.

The player thinks:

> “Now I can finally do that.”

---

## Moment C — The production breakthrough

The player solves a bottleneck through a better combination of:

- Catchmons,
- stations,
- recipes,
- materials,
- capacity,
- or specialization.

The shop becomes noticeably smoother or more profitable.

---

## Moment D — The visible transformation

The player returns to the main shop and can clearly see that their business has changed.

New stations, products, Catchmons, displays, customers, decoration, and scale communicate progression without requiring a stats screen.

---

## Moment E — The tempting next objective

After completing something meaningful, the player immediately sees another achievable target.

Not ten mandatory targets.

One or two compelling ones.

---

# 15. FIRST-SESSION QUALITY BAR

The detailed onboarding will be designed later.

At foundation level, the first session should establish these ideas quickly:

1. **I own this shop.**
2. **I can make something.**
3. **Customers actually buy what I make.**
4. **Selling well helps me improve the shop.**
5. **Catchmons matter to how my business works.**
6. **There is something exciting I can unlock next.**

The first session should not attempt to teach the entire game.

Its goal is to make the player understand the fantasy and want the next unlock.

---

# 16. LONG-TERM QUALITY BAR

The long-term game should be capable of supporting players who enjoy:

- collection completion,
- optimization,
- economic planning,
- aesthetic progression,
- specialization,
- mastery,
- rare discoveries,
- long-term unlock goals,
- and recurring short sessions.

The player should eventually be able to develop a recognizable playstyle rather than following exactly the same optimal path as everyone else.

How specialization works is deliberately deferred.

---

# 17. LOCKED VS. OPEN

This section prevents accidental overcommitment.

## LOCKED FOR THE CURRENT FOUNDATION

The following decisions are considered accepted until deliberately revised:

- The project is a separate new Catchmon game direction.
- The working title is **Catchmon Shop**.
- The shop is the primary gameplay engine.
- The project is mobile-first.
- The existing 104 Catchmons are a core reusable content foundation.
- Catchmons must have systemic gameplay value.
- Crafting and selling are central to the intended economy.
- Progression should combine vertical and horizontal growth.
- Collection progression and economic progression must reinforce each other.
- The world/shop should visually communicate growth.
- The game is not primarily combat-driven.
- The game is not intended to be a pure passive idle loop.
- Existing authoritative Catchmon design-system sources must be reused.
- Asset production should follow system definition rather than precede it.

---

## OPEN — TO BE DESIGNED LATER

The following are intentionally **not** decided by this document:

- final commercial title,
- exact currencies,
- exact materials,
- exact recipes,
- exact crafting categories,
- exact customer negotiation mechanics,
- exact Catchmon roles,
- expedition structure,
- Catchmon acquisition structure,
- Catchmon leveling,
- evolution rules,
- rarity implementation,
- shop floor layout,
- building taxonomy,
- item tiers,
- recipe mastery,
- offline progress,
- automation,
- guild/social systems,
- marketplace,
- monetization,
- live events,
- prestige/reset systems,
- world progression,
- final art style,
- final icon language,
- asset production specifications.

These topics require their own documents.

---

# 18. DOCUMENT GOVERNANCE

Every future design document should begin with:

- document title,
- version/status,
- purpose,
- what it is allowed to decide,
- what is outside its scope,
- dependencies,
- decisions locked by the document,
- open questions left for later.

This avoids a common problem in large design projects:

one document silently designing a system that another document is supposed to own.

---

# 19. PROPOSED DOCUMENT SEQUENCE

The following sequence is the current planning order.

Names may be refined when each document begins, but the dependency logic should remain stable.

### 01 — Project Foundation & North Star
**This document.**

Defines what game is being built and the rules every later phase must respect.

### 02 — Core Gameplay Engine
Define the minute-to-minute and session-to-session shop loop.

### 03 — Economy Architecture
Define currencies, sources, sinks, value movement, and economic layers at a structural level.

### 04 — Crafting & Product System
Define recipe logic, item families, queues, quality/mastery candidates, and product progression.

### 05 — Customer & Selling System
Define customer behavior, demand, negotiation, selling decisions, and shop interaction.

### 06 — Catchmon Gameplay Integration
Define how the 104 Catchmons interact with production, shop systems, exploration, roles, and progression.

### 07 — Acquisition & Expedition System
Define how external resources and Catchmon discovery work.

### 08 — Shop Growth & Infrastructure
Define stations, expansion, capacity, physical shop progression, and visual growth.

### 09 — Progression & Unlock Architecture
Define the order and logic through which systems, worlds, content, and long-term goals unlock.

### 10 — World & Element Structure
Map the existing elements/world identity onto the new game structure.

### 11 — UX & Information Architecture
Define screens, navigation, hierarchy, mobile flows, and main-shop interaction structure.

### 12 — Art Direction & Visual Style Bible
Define the precise visual target without violating existing design-system sources.

### 13 — Asset Taxonomy & Production Plan
Only here should the complete icon, symbol, resource, product, building, prop, frame, badge, and environmental asset requirements be frozen.

### 14+ — Content, Balance, Onboarding, Retention, Social, Live Ops, Technical Architecture
Designed after the core product architecture is stable.

---

# 20. DEFINITION OF DONE FOR FOUNDATION

This document is complete enough to move forward when the following statements are true:

- Everyone can describe the product in one or two sentences.
- Everyone understands that the **shop** is the gameplay engine.
- Everyone understands that the **Catchmons must alter the gameplay engine**.
- The team knows which major topics are intentionally still open.
- Future ideas can be accepted or rejected using the design pillars.
- Existing design-system authority is preserved.
- No one should need to invent items, buildings, currencies, or icons yet.
- The next document can focus entirely on the **Core Gameplay Engine** without having to redefine the product.

---

# 21. NEXT DOCUMENT

## `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`

The next document should answer one question extremely thoroughly:

> **What does the player actually do, minute by minute and session by session, and why is that loop satisfying enough to carry the game?**

It should define the shop engine before the project defines detailed content.

It should specifically resolve:

- the active craft → stock/display → customer → sell → reinvest loop,
- the role of time and queues,
- the player's selling decisions,
- the cadence of customer interaction,
- how active and passive play coexist,
- what creates the “one more action” feeling,
- what a 2-minute, 10-minute, and 30-minute session look like,
- and where Catchmons touch the loop without yet designing their complete role system.

Only after that engine works conceptually should the project move into detailed economy and content design.
