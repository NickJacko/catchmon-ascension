# CATCHMON SHOP — 07 ACQUISITION & EXPEDITIONS

**Status:** Acquisition & Expedition Architecture v1  
**Purpose:** Define the complete non-combat world loop through which players send Catchmons beyond the shop, acquire routine and rare resources, discover routes and opportunities, encounter wild Catchmons, and capture new evolution lines using crafted preparation without turning the system into combat, harsh RNG, or a second disconnected game  
**Depends on:**  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  
- `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`  
- `06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`  
- canonical Catchmon identities/assets in `reference/catchmons/`  
- canonical region/element references in `reference/design-system/`  

**Authority:** This document owns:
- the expedition gameplay loop,
- expedition route architecture,
- expedition intent/types,
- expedition team architecture,
- Lead/Support model,
- expedition preparation/loadout,
- Field Gear utility,
- Capture & Discovery Gear utility,
- expedition timing,
- guaranteed and probabilistic reward structure,
- expedition result protection,
- route requirements and preferences,
- encounter generation,
- discovery state,
- capture opportunity structure,
- capture preparation,
- capture attempt behavior,
- capture failure protection,
- repeat encounter behavior,
- already-owned encounter behavior,
- shiny/variant acquisition boundary,
- standard acquisition of evolution lines,
- expedition offline behavior,
- expedition anti-friction rules,
- expedition prototype scope.

**Out of scope:**  
- exact expedition routes,
- exact route names,
- exact duration values,
- exact reward quantities,
- exact component drop rates,
- exact encounter odds,
- exact capture percentages,
- exact pity thresholds,
- exact expedition slot count,
- exact expedition team size,
- exact Gear product list,
- exact 104-Catchmon expedition-role mapping,
- exact region unlock order,
- exact Catchmon Level requirements,
- exact world map UX,
- final expedition visual presentation,
- exact environment assets,
- monetization,
- live-event expeditions,
- social expeditions,
- PvP,
- combat.

---

# 1. WHY THIS DOCUMENT EXISTS

Catchmon Shop needs a second major gameplay loop outside the shop.

The shop creates value through:

**SUPPLY → CRAFT → DISPLAY → CUSTOMER → SELL → REINVEST**

But several important systems require an external world:

- special components,
- regional materials,
- discovery,
- Catchmon encounters,
- Capture & Discovery Gear,
- Field Gear,
- Expedition-domain Catchmons,
- world progression.

If these external systems are only passive timers, the world feels fake.

If they become combat encounters, the project changes genre.

If they generate large amounts of Coins directly, the shop loses economic importance.

If they require constant active play, they undermine mobile return pacing.

Therefore the expedition loop must create:

> **strategic preparation before departure, meaningful waiting while away, and satisfying decisions/results on return.**

---

# 2. EXPEDITION DESIGN THESIS

The core expedition thesis is:

> **The player chooses where to go, which Catchmons are suited to the opportunity, and which crafted preparation is worth committing; the expedition then resolves over time into resources, discoveries, and possible Catchmon encounters without combat.**

The expedition itself is not a hidden battle simulation.

Catchmon choice changes:

- access,
- duration,
- reward profile,
- discovery,
- information,
- gear efficiency,
- capture opportunity.

The player should think:

> **“What am I trying to get from this expedition, and what setup gives me the best route toward that goal?”**

not:

> “Which team has the highest Power number?”

---

# 3. THE COMPLETE WORLD LOOP

The intended world loop is:

## STEP 1 — CHOOSE GOAL

The player decides what they currently want:

- routine materials,
- a special component,
- a discovery opportunity,
- a Catchmon encounter,
- a specific regional outcome.

↓

## STEP 2 — CHOOSE ROUTE

The player selects an available expedition route.

The route communicates:

- region,
- intent,
- duration band,
- core reward profile,
- special opportunities,
- encounter profile,
- requirements,
- preferred capabilities.

↓

## STEP 3 — BUILD TEAM

The player selects:

- one Lead Catchmon,
- optional Support Catchmons according to unlocked capacity.

↓

## STEP 4 — PREPARE LOADOUT

The player may commit useful crafted goods such as:

- Provisions,
- Field Gear,
- Capture & Discovery Gear.

↓

## STEP 5 — START EXPEDITION

The chosen Catchmons become unavailable for other functional assignments.

Required items are reserved or consumed according to their utility mode.

↓

## STEP 6 — EXPEDITION RUNS OVER TIME

The expedition progresses without requiring combat input.

The player may leave the game.

↓

## STEP 7 — EXPEDITION RETURNS

At completion:

- the Catchmons return,
- the route result is safely stored,
- the team becomes available,
- resources and discoveries are ready for resolution.

↓

## STEP 8 — REVIEW RESULTS

The player sees:

- guaranteed rewards,
- bonus rewards,
- discoveries,
- route information,
- any Encounter Opportunity.

↓

## STEP 9 — RESOLVE ENCOUNTER IF PRESENT

If a wild Catchmon was found:

- view the encounter,
- review capture conditions,
- decide whether to use reserved Capture Gear,
- attempt or decline.

↓

## STEP 10 — FEED RESULTS BACK INTO SHOP

Materials become:

- recipes,
- valuable goods,
- capture preparation,
- progression.

New Catchmons become:

- new capabilities,
- new assignments,
- new synergies.

↓

**RETURN TO SHOP / START NEXT EXPEDITION**

---

# 4. EXPEDITIONS ARE GOAL-DRIVEN

The world loop should not ask:

> “Which generic quest gives the most loot?”

Routes should communicate different purposes.

The initial architecture contains four recurring **Expedition Intents**:

1. **Supply Run**
2. **Component Hunt**
3. **Discovery Survey**
4. **Special Expedition**

These are functional categories.

Final thematic names may differ.

---

# 5. INTENT A — SUPPLY RUN

## Purpose

Supply Runs focus on predictable material acquisition.

They should generally offer:

- reliable routine materials,
- region-associated resources,
- lower variance,
- shorter-to-medium duration,
- modest encounter opportunity.

They are useful when:

> **the shop needs inputs.**

---

# 6. SUPPLY RUN ECONOMIC ROLE

Supply Runs support production without replacing normal routine-resource infrastructure.

They are especially useful for:

- targeted material shortages,
- region-specific inputs,
- active specialization,
- overflow from expedition-capable Catchmons.

They should not become the only source of basic materials.

---

# 7. INTENT B — COMPONENT HUNT

## Purpose

Component Hunts focus on special components.

They should generally offer:

- lower guaranteed volume,
- higher special-component opportunity,
- medium-to-long duration,
- stronger team/gear specialization,
- some discovery potential.

They are useful when:

> **the player is preparing advanced/premium crafting.**

---

# 8. COMPONENT HUNT ECONOMIC ROLE

Component Hunts create anticipation.

They connect:

**world scarcity**

→ **advanced product**

→ **premium shop transaction**

The world supplies valuable inputs.

The shop remains where those inputs become wealth.

---

# 9. INTENT C — DISCOVERY SURVEY

## Purpose

Discovery Surveys focus on:

- route information,
- wild Catchmon encounters,
- hidden opportunities,
- unusual regional outcomes.

They should generally have:

- lower material efficiency than dedicated Supply Runs,
- stronger discovery weighting,
- stronger interaction with Capture & Discovery Gear,
- strong Expedition-domain Catchmon relevance.

They are useful when:

> **the player is hunting for new collection possibilities.**

---

# 10. DISCOVERY SURVEY DOES NOT GUARANTEE CAPTURE

The route's job is to create encounter opportunities.

The capture system remains a separate player decision.

This preserves:

- preparation,
- anticipation,
- uncertainty,
- collection excitement.

---

# 11. INTENT D — SPECIAL EXPEDITION

Special Expeditions are curated opportunities tied to:

- major discoveries,
- signature recipes,
- special components,
- rare Catchmons,
- region milestones,
- story/world events.

They may use unique requirements.

They are not the repeating economic backbone.

---

# 12. SPECIAL EXPEDITION PROTECTION

If a Special Expedition is required for major progression:

- its availability must be deterministic or protected,
- failure must not permanently remove progression,
- critical rewards must have guaranteed paths.

---

# 13. ROUTE ARCHITECTURE

An expedition route is a canonical data definition.

Suggested structure:

```text
routeId
displayName
regionId
expeditionIntent
durationBand
accessRequirements[]
preferredCapabilities[]
preferredElements[]
preferredSynergyTags[]
teamProfile
preparationProfile
guaranteedRewards[]
bonusRewardPools[]
specialComponentPool[]
encounterPool[]
discoveryProfile
protectionProfile
unlockRequirements
visualEnvironmentId
```

Exact implementation names may change.

---

# 14. ROUTES ARE NOT RANDOMLY GENERATED BY DEFAULT

Core routes should be authored and understandable.

The player should learn:

> “This route is good for X.”

Procedural variation may modify outcomes later.

It should not erase route identity.

---

# 15. ROUTE ACCESS VS ROUTE PREFERENCE

This distinction is critical.

## ACCESS REQUIREMENT

A hard gate.

Examples:

- region unlocked,
- specific structural Catchmon capability,
- required Field Gear,
- major progression milestone.

Without it, the route cannot start.

## PREFERENCE

A soft advantage.

Examples:

- Water-aligned Catchmon,
- Scout tag,
- Discovery specialist.

Without it, the expedition can still run but with different efficiency/outcomes.

Use preferences more often than hard requirements.

---

# 16. HARD REQUIREMENT DISCIPLINE

Routes should not require five simultaneous conditions.

A normal route should have:

- simple progression access,
- perhaps one meaningful special requirement.

Hard requirements are primarily for:

- terrain access,
- signature routes,
- late special content.

---

# 17. NO POWER-GATE ROUTES

Avoid:

> Team Power 8,500 required.

Routes should instead care about:

- capability,
- element/region fit,
- team role,
- gear,
- progression.

This reinforces Catchmon identity.

---

# 18. EXPEDITION TEAM ARCHITECTURE

Every expedition team contains:

# ONE LEAD CATCHMON

and

# ZERO OR MORE SUPPORT CATCHMONS

according to unlocked expedition capacity.

The exact number of Support slots is deferred.

---

# 19. WHY A LEAD EXISTS

The Lead gives the team a clear identity.

The Lead may determine:

- primary route specialization,
- key capability,
- main discovery/reward influence,
- eligibility for a structural route requirement.

This makes team-building readable.

---

# 20. SUPPORT CATCHMONS

Support Catchmons contribute:

- secondary capabilities,
- synergy tags,
- element fit,
- reward specialization,
- gear efficiency.

Supports should improve or reshape a strategy rather than simply stack raw power.

---

# 21. TEAM SIZE BOUNDARY

The expedition team should remain small.

The intended design space is:

> **one Lead plus a small number of Supports**

rather than:

> 20-Catchmon expedition squads.

Exact slot counts are owned by progression/infrastructure design.

---

# 22. ONE DUTY RULE APPLIES

Catchmons on expedition cannot simultaneously:

- support production,
- work Shop Floor,
- run Supply assignment.

This is the assignment opportunity cost defined in Document 06.

---

# 23. EXPEDITION START SNAPSHOT

At expedition start, the system records:

- team,
- relevant capabilities,
- synergy state,
- preparation loadout,
- route context.

Reassigning or evolving a Catchmon elsewhere cannot retroactively duplicate its expedition benefits.

Exact technical snapshotting belongs to Document 14.

---

# 24. NO EXPEDITION STAMINA

Expeditions do not require a universal stamina/energy meter.

The cost is already:

- Catchmon availability,
- time,
- preparation,
- opportunity cost.

Adding another meter is unnecessary in the base design.

---

# 25. NO INJURY SYSTEM BY DEFAULT

Catchmons do not return:

- injured,
- unusable,
- requiring medical timers

after normal expeditions.

The world loop is adventurous, not punitive.

---

# 26. EXPEDITION PREPARATION

Preparation converts crafted shop products into external-world utility.

The initial preparation architecture contains three categories:

1. **Provisions**
2. **Field Gear**
3. **Capture & Discovery Gear**

This directly connects Document 04 to the world loop.

---

# 27. PREPARATION IS OPTIONAL FOR NORMAL ROUTES

Normal expeditions should usually be startable without a perfect loadout.

Preparation provides:

- efficiency,
- access,
- specialization,
- better discovery/capture opportunity.

Special routes may require specific preparation.

---

# 28. PREPARATION SLOT BOUNDARY

Expeditions have limited preparation capacity.

Exact slot count is deferred.

The key rule is:

> **the player cannot bring every useful item at once.**

Loadout creates opportunity cost.

---

# 29. PROVISIONS — EXPEDITION FUNCTION

Provisions may provide effects such as:

- moderate duration reduction,
- improved routine reward consistency,
- support for longer routes,
- targeted regional bonus.

Most expedition Provisions are expected to be consumable.

---

# 30. PROVISIONS ARE NOT MANDATORY TAX

Every normal expedition should not require a consumable food fee.

Provisions should be:

> useful preparation

rather than:

> mandatory ticket.

---

# 31. FIELD GEAR — EXPEDITION FUNCTION

Field Gear may provide:

- route access,
- terrain capability,
- reward specialization,
- component protection,
- duration efficiency,
- support for a specific region/environment.

Field Gear is often more durable and strategic than Provisions.

---

# 32. CAPTURE & DISCOVERY GEAR — EXPEDITION FUNCTION

Capture & Discovery Gear may influence:

- encounter generation,
- rare-trace discovery,
- encounter information,
- capture preparation,
- capture chance,
- failed-attempt protection,
- shiny/variant detection.

This family directly connects crafting to collection.

---

# 33. UTILITY MODES

Player-use products may use one of two utility modes:

## CONSUMABLE

Used up when its defined effect is triggered.

## REUSABLE

Assigned for an expedition and returned afterward.

The base system does **not** require durability loss on reusable gear.

---

# 34. NO DURABILITY GRIND BY DEFAULT

Reusable expedition gear should not routinely lose:

- durability,
- charges,
- repair condition

unless a later system proves that this creates meaningful gameplay.

Crafting value already comes from:

- selling gear,
- making consumables,
- unlocking better gear,
- making multiple loadout options.

---

# 35. ITEM RESERVATION

Items committed to an expedition are reserved.

Reserved items cannot simultaneously be:

- sold,
- used on another expedition,
- consumed by an order.

This prevents double-use.

---

# 36. CONSUMPTION TIMING

Consumption timing should match the item's function.

Examples:

### Expedition Provision
Consumed when expedition begins.

### Route-access consumable
Consumed when route begins or access is used.

### Capture Aid
Reserved before departure, but consumed only if the player chooses to use it during an encounter.

### Reusable Field Gear
Returns after expedition.

This prevents unnecessary waste.

---

# 37. CAPTURE GEAR PREPARATION RULE

The core system rewards preparation.

Capture aids used for an encounter must normally have been:

> **reserved in the expedition loadout before departure.**

The player cannot always return from a route, see a rare Catchmon, craft the perfect counter-item, and then retroactively add it.

This preserves pre-expedition strategy.

---

# 38. WHY CAPTURE GEAR IS RESERVED, NOT IMMEDIATELY CONSUMED

If no encounter occurs:

- reserved Capture Gear returns,
- the player does not lose an expensive capture item for nothing.

This keeps Discovery Surveys exciting rather than punitive.

---

# 39. EXPEDITION DURATION

Routes use duration bands rather than one escalating timer model.

Conceptual bands:

- QUICK
- SHORT
- MEDIUM
- LONG
- SPECIAL

Exact durations are balancing variables.

---

# 40. DIFFERENT INTENTS CAN SHARE DURATION BANDS

A Discovery Survey is not automatically longer than a Supply Run.

Duration depends on route design.

This prevents route intent from becoming a disguised tier system.

---

# 41. SHORT EXPEDITIONS REMAIN RELEVANT

Late progression should still contain useful short routes.

The world loop must support:

- active sessions,
- short returns,
- long offline intervals.

Late game should not become:

> every expedition takes eight hours.

---

# 42. NO MANUAL TRAVEL TAPPING

Once an expedition starts, the player does not need to:

- repeatedly tap progress,
- play combat encounters,
- keep the app open.

The meaningful active decisions occur:

- before departure,
- on return,
- at encounter resolution.

---

# 43. NO PREMIUM SPEED-UP ASSUMPTION

The base expedition architecture does not require:

- premium currency speed-ups,
- ads to finish timers,
- pay-to-skip.

Monetization is outside current scope.

---

# 44. SHOP MOMENTUM BOUNDARY

Shop Momentum is not a universal expedition acceleration currency.

The core system does **not** spend Shop Momentum to:

- finish expeditions,
- reroll expedition rewards,
- buy encounters.

Momentum belongs primarily to the active shop loop.

This preserves system identity.

---

# 45. EXPEDITION REWARD ARCHITECTURE

Each normal expedition result contains multiple layers.

## LAYER A — GUARANTEED CORE REWARD

The player receives something useful for completing the route.

## LAYER B — BONUS REWARD OPPORTUNITY

Team/gear/route conditions may produce additional value.

## LAYER C — DISCOVERY OUTCOME

Information, traces, hidden route knowledge, or encounter opportunity.

## LAYER D — SPECIAL OUTCOME

Rare component, signature discovery, variant opportunity, etc.

Not every expedition must trigger all layers.

---

# 46. NO TOTAL FAILURE

A completed normal expedition should not return:

> “Failed. You got nothing.”

There should be a guaranteed useful baseline.

Uncertainty affects:

- how good the result is,
- which bonus outcome appears,
- whether a rare discovery occurs.

---

# 47. GUARANTEED CORE REWARD

The guaranteed reward should align with expedition intent.

Examples structurally:

### Supply Run
Routine materials.

### Component Hunt
Some relevant baseline material plus progress/opportunity toward component reward.

### Discovery Survey
Some regional value plus discovery progress/opportunity.

---

# 48. BONUS REWARD POOLS

Bonus pools may contain:

- additional routine resources,
- special components,
- regional items,
- discovery events,
- crafted-input materials.

Catchmon/gear effects may shift weighting.

---

# 49. REWARD SPECIALIZATION

A Catchmon should often influence:

> **what kind of result becomes more likely**

rather than:

> “all rewards +20%.”

Examples:

- more special-component weighting,
- more discovery weighting,
- more routine-material consistency.

---

# 50. SPECIAL COMPONENT PROTECTION

Rare components must not rely on unbounded bad luck.

The system should maintain internal bad-luck protection for relevant rare outcomes.

Possible technical forms:

- increasing internal chance after misses,
- guaranteed reward after a protected number of eligible runs,
- progress counter.

The exact implementation is deferred.

---

# 51. PROTECTION STATE IS NOT A CURRENCY

Bad-luck protection is:

- route/component state,
- not spendable,
- not tradable,
- not another inventory token.

The player may see qualitative progress.

It should not create another economy.

---

# 52. RESULT STORAGE

When an expedition completes:

- its result is protected,
- it cannot be lost because the player was offline,
- the team returns automatically.

The player does not need to claim the result before the Catchmons can be used again.

---

# 53. TEAM RETURNS AUTOMATICALLY

At timer completion:

- Catchmons become available for new assignments,
- expedition results remain safely stored.

This prevents “claim before you can play again” friction.

---

# 54. NO AUTO-REPEAT BY DEFAULT

Expeditions do not automatically restart forever in the base system.

Why:

- team/loadout choice should matter,
- results should influence the next decision,
- unlimited auto-repeat would create passive accumulation.

Later automation may be considered as progression.

---

# 55. RESULT BACKLOG BOUNDARY

Because expeditions do not auto-repeat, unattended results cannot grow infinitely from one slot.

Completed results remain protected until reviewed.

The system should still present them compactly.

---

# 56. RESOURCE OVERFLOW PROTECTION

Expedition rewards should not silently disappear because normal storage is full.

A completed expedition can temporarily hold its reward until the player transfers/resolves it.

The game should clearly communicate storage pressure.

---

# 57. NO EXPEDITION CRATE ECONOMY

Protected result holding is not intended to become a new permanent storage system to optimize.

It exists only to prevent reward loss.

---

# 58. DISCOVERY ARCHITECTURE

Discovery has several distinct states.

For a Catchmon evolution line, the conceptual progression is:

# UNKNOWN

The player has no confirmed knowledge of the line.

↓

# TRACED

The player has discovered evidence that the line exists in a route/region.

↓

# ENCOUNTERED

The player has seen the Catchmon directly.

↓

# OWNED

The player has successfully captured the line-entry Catchmon.

↓

# EVOLVED / COMPLETED STAGES

Later evolution stages are recorded through development.

The exact UI naming may differ.

---

# 59. WHY TRACED EXISTS

Traces create progress without giving away the encounter immediately.

A Discovery Survey may return:

> evidence of a species

without:

> guaranteed capture opportunity.

This creates anticipation and useful bad-luck protection.

---

# 60. TRACE PROGRESS IS NOT A SPENDABLE RESOURCE

Trace/discovery progress is:

- route/species state,
- not currency,
- not bought/sold,
- not inventory.

It exists to make repeated discovery attempts feel progressive.

---

# 61. DISCOVERY INFORMATION

As a species moves from Unknown → Traced → Encountered, the game may reveal more information such as:

- element,
- silhouette,
- preferred route,
- preparation hints,
- approximate rarity/difficulty.

This creates collection mystery without requiring external guides.

---

# 62. ENCOUNTER POOLS

Each route may have an encounter pool.

An encounter entry should eventually define:

```text
lineEntrySpeciesId
eligibilityConditions[]
baseEncounterWeight
rarityProfile
time/routeConditions[]
preferredDiscoveryCapabilities[]
captureDifficultyProfile
variantProfile
protectionProfile
```

Exact values are deferred.

---

# 63. STANDARD ACQUISITION UNIT — EVOLUTION LINE ENTRY

The default capture target is the **entry species of an evolution line**.

Usually:

> the base evolution stage.

Later stages are primarily obtained through evolution.

This gives evolution meaningful ownership progression.

---

# 64. EVOLVED WILD ENCOUNTER EXCEPTIONS

Special content may occasionally feature an evolved wild Catchmon.

This should be a deliberate exception.

It should not make normal evolution irrelevant.

---

# 65. SINGLE-STAGE CATCHMONS

Single-stage Catchmons are captured directly because they are their own line entry.

They do not require artificial evolution.

---

# 66. ENCOUNTER WEIGHT — NEW COLLECTION BIAS

When unowned eligible lines remain available on a route, encounter generation should generally bias toward meaningful collection progress.

Already-owned species should not crowd out new discoveries indefinitely.

This bias should remain controlled rather than guaranteeing a new species every run.

---

# 67. OWNED ENCOUNTER DOWNWEIGHTING

After a line is owned:

- its standard encounter weight may decrease,
- new unowned lines become relatively more important.

Owned encounters can still matter for:

- shiny/variant opportunities,
- observation rewards,
- route flavor,
- special interactions.

---

# 68. ENCOUNTER BAD-LUCK PROTECTION

Repeated eligible Discovery Surveys without encountering a target should improve future opportunity through protected internal state.

The exact formula may:

- increase encounter weight,
- guarantee trace progress,
- guarantee encounter after a threshold.

No species should remain theoretically eligible but practically invisible forever.

---

# 69. RARITY AND ENCOUNTERS

Rarity influences:

- how quickly a line is discovered,
- how often it appears,
- how much preparation may matter,
- presentation.

Rarity does not change the line's fundamental gameplay power rules from Document 06.

---

# 70. ENCOUNTER OPPORTUNITY

When an expedition finds a wild Catchmon, it creates an:

# **ENCOUNTER OPPORTUNITY**

This is a protected result state.

The player resolves it after the expedition.

---

# 71. NO REAL-TIME ENCOUNTER EXPIRY

A rare encounter found while the player is offline should not disappear because they did not open the game fast enough.

Encounter Opportunities remain available until resolved.

This avoids FOMO/reflex pressure.

---

# 72. ENCOUNTER PRESENTATION

An Encounter Opportunity should communicate:

- Catchmon identity/silhouette depending on discovery state,
- element,
- rarity/difficulty information where known,
- current capture chance,
- relevant team effects,
- available reserved Capture Gear,
- expected consequence of attempt/failure.

The player should not need to guess what affects capture.

---

# 73. CAPTURE DESIGN THESIS

Capture should be:

> **a short, understandable payoff decision built on expedition preparation.**

It should not become:

- a twitch minigame,
- combat,
- hidden probability,
- premium-currency rerolling,
- duplicate farming.

---

# 74. CAPTURE INPUTS

The final capture chance/result may depend on:

1. species/line capture difficulty,
2. expedition discovery state,
3. Lead/Support Catchmon capture/discovery capabilities,
4. reserved Capture & Discovery Gear,
5. relevant route/element conditions,
6. bad-luck protection from previous failed captures.

Exact formula is deferred.

---

# 75. CAPTURE CHANCE MUST BE VISIBLE

Before attempting capture, the player should see the resulting chance or a comparably precise readable indication.

Avoid:

> “Good chance” while hiding major probability changes.

The player needs enough information to choose whether to consume gear.

---

# 76. NO CAPTURE POWER SCORE

Do not collapse capture into:

> Team Power vs Catchmon Power.

Capture is about:

- preparation,
- discovery,
- capability fit,
- encounter difficulty.

---

# 77. CAPTURE DECISION

At encounter resolution, the player can:

1. **Attempt without consuming optional Capture Aid**
2. **Use one or more eligible reserved aids within loadout rules**
3. **Decline / Observe and let the encounter go**

Exact number of selectable aids is deferred.

---

# 78. CAPTURE AID PREVIEW

Before confirming an aid, the player sees:

- how it changes capture chance,
- whether it is consumed,
- any special protection effect.

No blind consumable use.

---

# 79. CAPTURE ATTEMPT IS DETERMINISTIC IN CONSEQUENCE, PROBABILISTIC IN RESULT

If the player attempts:

- eligible consumed items are consumed,
- the attempt resolves once,
- success/failure is clear.

There is no rapid multi-tap retry sequence.

---

# 80. NO INSTANT RETRY PURCHASE

After a failed capture:

- no Coin payment instantly rerolls,
- no Shop Momentum reroll,
- no assumed premium-currency retry.

The player returns to the expedition/discovery loop for another opportunity.

---

# 81. CAPTURE FAILURE MUST CREATE PROGRESS

Failure should not reset the player to zero.

A failed capture should:

- permanently record the species as Encountered,
- improve future protected capture state,
- reveal more information if applicable,
- preserve the line as a known target.

This turns failure into:

> **partial progress**

rather than pure loss.

---

# 82. CAPTURE PROTECTION STATE

Repeated failed captures of the same line should improve future success through internal protection.

Possible forms:

- increasing minimum chance,
- additive protected bonus,
- guaranteed success after a threshold.

Exact behavior is a balance decision.

---

# 83. CAPTURE PROTECTION IS NOT FARMABLE CURRENCY

The protection belongs to:

> that line / encounter history.

It cannot be:

- transferred,
- spent elsewhere,
- sold,
- converted.

---

# 84. NO PERMANENT MISS

Failing a rare encounter does not permanently remove the Catchmon from the account.

The line remains available through future eligible routes.

---

# 85. CAPTURE DECLINE

The player may decline an encounter.

Reasons:

- preserve capture aid,
- low current chance,
- already-owned species,
- strategic choice.

Declining:

- does not consume optional aids,
- does not create major punishment,
- may still record Encountered state if first seen.

---

# 86. WHY DECLINE EXISTS

The player should control scarce crafted preparation.

A rare Capture Aid should not be auto-consumed simply because a Catchmon appeared.

---

# 87. CAPTURE SUCCESS

On success:

- the line-entry Catchmon becomes owned,
- it becomes available for assignment after resolution,
- its Catchdex/collection state updates,
- future evolution becomes possible,
- future duplicate handling switches to owned behavior.

The capture should be a major reward moment.

---

# 88. ONE FUNCTIONAL OWNED INSTANCE

Successful capture does not create a system of multiple identical workers.

The ownership rule from Document 06 remains:

> one functional owned instance for the evolution-line state.

---

# 89. ALREADY-OWNED ENCOUNTERS

If an already-owned line is encountered, the player does **not** capture another functional copy.

Instead, the encounter may resolve through one or more of:

- observation/discovery reward,
- regional material,
- special component,
- shiny/variant opportunity,
- signature interaction.

Exact reward profile is deferred.

---

# 90. OWNED ENCOUNTER SHOULD NOT FEEL LIKE A DEAD ROLL

An already-owned encounter should have some value.

But it should remain less desirable than discovering a genuinely new line when unowned lines remain.

---

# 91. NO DUPLICATE UPGRADE MATERIAL BY DEFAULT

Owned encounters should not primarily drop:

> species shards needed to power up the same Catchmon.

This would recreate duplicate-fusion progression indirectly.

The base development system uses participation, Level, and evolution.

---

# 92. SHINY / VARIANT ENCOUNTERS

Shiny/variant status may appear during encounter generation.

It is:

- rare,
- visually exciting,
- collection/cosmetic prestige.

It does not create stronger gameplay stats.

---

# 93. SHINY BEFORE OWNERSHIP

If the player's first successful capture of a line is shiny:

- the line becomes owned,
- the shiny visual variant is unlocked,
- gameplay capability is identical to the standard variant.

---

# 94. SHINY AFTER OWNERSHIP

If an already-owned line appears shiny:

- successful variant resolution unlocks the shiny appearance,
- it does not add another worker copy.

The exact interaction may reuse the capture framework.

---

# 95. SHINY PROTECTION BOUNDARY

Shiny acquisition may have separate long-horizon protection later.

It is not required for normal progression.

Therefore protection can be looser than standard line acquisition.

---

# 96. CAPTURE & DISCOVERY GEAR ROLES

Capture/Discovery products should serve distinct roles.

Potential functional categories:

## TRACKING
Improves trace/encounter opportunity.

## IDENTIFICATION
Reveals encounter information.

## APPROACH
Improves capture chance.

## STABILIZATION
Protects against bad-luck/failure consequences.

## SPECIALIZED LURE
Biases toward a specific element/family/route profile.

These are functional roles, not final item categories/names.

---

# 97. NO ONE BEST CAPTURE ITEM

Avoid a linear sequence where:

> latest Capture Item is always superior in every encounter.

Different gear should support:

- different elements,
- rarity levels,
- discovery vs capture,
- route conditions,
- consumable vs reusable strategy.

---

# 98. FIELD GEAR ROLES

Field Gear may serve:

## ACCESS
Enables terrain/route.

## EFFICIENCY
Improves duration.

## EXTRACTION
Improves material reward profile.

## PROTECTION
Preserves special outcomes/consumables.

## OBSERVATION
Supports discovery information.

This gives Field Gear meaning beyond `+loot`.

---

# 99. GEAR + CATCHMON INTERACTION

Catchmons can improve specific Gear utility.

Examples structurally:

- Scout Catchmon improves Tracking Gear,
- aquatic specialist improves Water-route Field Gear,
- precise Catchmon improves reusable observation device.

This creates crafting/collection synergy.

---

# 100. NO GEAR SLOT PUZZLE OVERLOAD

Loadout should remain understandable on mobile.

Avoid:

- helmet slot,
- chest slot,
- tool slot,
- boot slot,
- charm slot,
- six consumable slots

for expedition Catchmons.

Preparation should be a small strategic selection.

---

# 101. EXPEDITION SYNERGY

Tag-based synergy from Document 06 applies to expedition teams.

A route may reward:

- shared tag,
- complementary tags,
- element/region fit.

Synergy should change:

- access,
- reward profile,
- discovery,
- efficiency.

---

# 102. EXPEDITION SYNERGY DOES NOT REQUIRE EXACT PAIRS

The main system uses tags/capabilities.

Rare signature pair interactions are exceptions.

---

# 103. ROUTE PREFERENCE FEEDBACK

Before starting, the game should indicate:

- strong fit,
- useful fit,
- neutral fit,
- missing hard requirement.

The player should understand why a team is suitable.

---

# 104. NO HIDDEN “BAD TEAM” FAILURE

A non-ideal but eligible team should not simply fail.

It may:

- take longer,
- receive a different reward profile,
- discover less,
- miss optional bonuses.

The expedition still returns useful value.

---

# 105. ROUTE PREVIEW

Before departure, the player should be able to preview:

- duration,
- guaranteed reward category,
- likely bonus categories,
- encounter possibility,
- route requirements,
- preferred capabilities,
- loadout slots,
- relevant Catchmon synergies.

Exact quantities/odds may be partially hidden if discovery fantasy requires it.

But the route's purpose must remain readable.

---

# 106. INFORMATION REVEAL

Some route information may begin partially unknown.

Repeated exploration, Catchmon abilities, or Discovery Gear may reveal:

- reward pools,
- encounter pool silhouettes,
- special component hints.

This creates exploration without requiring hidden mechanics forever.

---

# 107. NO EXTERNAL-WIKI REQUIREMENT

The game should eventually expose enough route and capture information that the player can make informed choices in-game.

Mystery is good.

Permanent opacity is not.

---

# 108. EXPEDITION SLOT ARCHITECTURE

The player has limited concurrent expedition capacity.

Exact slot count is deferred.

Expedition slots create:

- strategic choice,
- progression value,
- return cadence.

---

# 109. SLOT VS TEAM AVAILABILITY

Starting an expedition consumes:

- one expedition slot,
- the selected Catchmons' assignment availability.

Both constraints matter.

---

# 110. NO UNLIMITED PARALLEL EXPEDITIONS

Owning many Catchmons does not allow sending every unassigned Catchmon simultaneously.

Infrastructure/progression limits world throughput.

---

# 111. EXPEDITION QUEUE BOUNDARY

The base system does not require a large expedition queue.

The player chooses the next route after results.

This preserves responsive decision-making.

Later automation may add limited planning.

---

# 112. EXPEDITION AUTOMATION BOUNDARY

Later progression may allow:

- repeat one simple Supply Run,
- preconfigured team/loadout,
- conservative auto-relaunch.

If added, it should:

- be bounded,
- avoid auto-resolving rare encounters,
- not consume scarce Capture Gear without player rules,
- not optimize everything automatically.

---

# 113. RARE ENCOUNTERS ALWAYS WAIT FOR PLAYER

Automation must not automatically:

- spend rare capture aids,
- dismiss rare encounters,
- attempt capture using hidden logic.

Important encounters remain protected until player resolution.

---

# 114. OFFLINE EXPEDITION BEHAVIOR

Expedition timers progress while the player is offline.

At completion:

- team returns,
- result is stored,
- encounter opportunity is stored,
- no value is lost.

This makes expeditions a natural return hook.

---

# 115. OFFLINE DOES NOT CHAIN INFINITE RUNS

Without explicit later automation:

- one expedition completes,
- it does not automatically restart.

Therefore offline value remains bounded.

---

# 116. RETURN EXPERIENCE

A returning player with completed expeditions should quickly see:

1. expedition returned,
2. key reward,
3. special discovery/encounter if present,
4. team available,
5. next route decision.

The result should not be buried under generic notification spam.

---

# 117. RESULT PRESENTATION INTENSITY

Feedback intensity should scale with outcome.

### Routine Supply Return
Compact.

### Special Component
Stronger.

### New Trace
Distinct.

### New Catchmon Encounter
Major reveal.

### Successful Capture
High-impact collection moment.

---

# 118. FIRST EXPEDITION ONBOARDING

The first expedition should teach:

1. choose route,
2. assign Catchmon,
3. optional simple preparation,
4. wait,
5. receive useful result.

Do not introduce capture complexity on the very first click unless pacing supports it.

---

# 119. FIRST DISCOVERY EXPERIENCE

Soon afterward, the player should find:

- a trace,
- silhouette,
- or clear indication of an uncaught Catchmon.

This establishes:

> the world contains things worth searching for.

---

# 120. FIRST CAPTURE EXPERIENCE

The first capture should teach:

- encounter found through expedition,
- capture chance visible,
- optional prepared Gear helps,
- success gives a genuinely useful new Catchmon.

The first acquisition should be forgiving enough to demonstrate the system rather than punish.

---

# 121. EARLY EXPEDITION COMPLEXITY

Early game should expose:

- one region,
- few routes,
- one Lead slot,
- limited preparation,
- simple reward profiles.

Do not begin with:

- five routes,
- three Support slots,
- multiple gear categories,
- rare-component pity,
- complex synergy.

Complexity unlocks gradually.

---

# 122. MID-GAME EXPEDITION COMPLEXITY

Mid game may add:

- Support slots,
- more intents,
- route preferences,
- special components,
- stronger Discovery Surveys,
- more Gear choices,
- element/region interactions,
- special routes.

---

# 123. LATE-GAME EXPEDITION COMPLEXITY

Late game should emphasize:

- team specialization,
- targeted rare-component hunting,
- advanced discovery,
- signature routes,
- difficult-to-find Catchmons,
- synergy,
- premium preparation choices.

It should not become:

> longer timers and lower probabilities only.

---

# 124. ROUTE PROGRESSION

Routes should grow horizontally as well as vertically.

Progression may unlock:

- new regions,
- new route intents,
- hidden variants,
- special routes,
- better preparation options.

Do not simply replace every old route with a numerically superior route.

---

# 125. OLD ROUTE RELEVANCE

Earlier routes can remain useful because they may offer:

- specific materials,
- specific Catchmons,
- short duration,
- unique component,
- special variant opportunities.

---

# 126. REGIONAL IDENTITY

Document 10 will define exact world/element identities.

Document 07 requires each region to eventually have:

- distinct route purposes,
- distinct resource profile,
- distinct encounter pool,
- meaningful element/terrain context.

Regions should not be reward-table recolors.

---

# 127. REGION ACCESS BOUNDARY

Exact region unlock logic belongs to Documents 09/10.

Do not reuse legacy Funken thresholds from old `regions.ts`.

The old file is reference-only for approved identities such as region/element metadata until new progression is finalized.

---

# 128. EXPEDITION ECONOMY BOUNDARY

Expeditions primarily generate:

- materials,
- components,
- discoveries,
- Catchmon opportunities.

They should not become the main direct Coin generator.

---

# 129. RAW COIN REWARD

Normal expedition routes should not routinely return large Coin rewards.

Small incidental Coins may exist later if fantasy requires it.

The shop remains the primary commercial engine.

---

# 130. RESOURCE TRANSFORMATION LOOP

The desired flow is:

**EXPEDITION**

→ material/component

→ **CRAFT**

→ product

→ **CUSTOMER**

→ Coins

This preserves the economic fantasy.

---

# 131. DUAL-USE TENSION

Field/Capture products create the choice:

> sell this now

or

> reserve/use it for an expedition.

This is one of the strongest links between the two major loops.

---

# 132. EXPEDITION COST BOUNDARY

Normal routes do not require a generic Coin entry fee by default.

Their opportunity cost already includes:

- time,
- Catchmon assignment,
- optional preparation.

Special routes may require crafted keys/items if meaningful.

---

# 133. NO “EXPEDITION TICKET” CURRENCY BY DEFAULT

Do not create a universal expedition token merely to limit runs.

Capacity and time already provide limitation.

---

# 134. DISCOVERY / CAPTURE DOES NOT USE PREMIUM CURRENCY

The base system does not buy:

- encounter chances,
- capture rerolls,
- guaranteed rare species

with a premium currency.

Monetization remains out of scope.

---

# 135. CAPTURE DIFFICULTY BANDS

Exact numbers are open.

Species may conceptually use difficulty bands such as:

- ACCESSIBLE
- STANDARD
- CHALLENGING
- RARE
- SIGNATURE

These are balance categories.

They should not be confused with rarity.

---

# 136. DIFFICULTY VS RARITY

Rarity answers:

> how often/opportunistically is this Catchmon encountered?

Capture Difficulty answers:

> once encountered, how much preparation/protection is needed?

These should be separable.

A rare Catchmon could be easy to capture once found.

A common but elusive species could be harder to approach.

---

# 137. CAPTURE CHANCE FLOOR

Eligible encounters should normally have a non-zero viable capture path even without perfect Gear.

Exact floors are balancing decisions.

The player should not discover after the fact:

> “This encounter was literally impossible.”

Hard capture requirements should be clearly communicated before the expedition.

---

# 138. CAPTURE CHANCE CEILING

Excellent preparation may allow very high or guaranteed capture chance in appropriate contexts.

Guarantee should usually require:

- strong preparation,
- accumulated protection,
- special capability,
- progression.

This rewards planning.

---

# 139. NO 100% PURCHASE BUTTON

Guaranteed capture should emerge from system mastery/protection.

It should not simply be:

> pay X Coins after encounter.

---

# 140. FAILED CAPTURE CONSUMABLE LOSS

If the player deliberately uses a consumable capture aid:

- it may be consumed even on failure.

This creates meaningful risk.

However, failure protection ensures the attempt still contributes to future success.

---

# 141. REUSABLE CAPTURE GEAR

Reusable observation/tracking gear returns regardless of capture result.

This creates long-term expedition investment without durability grind.

---

# 142. FAILURE TRANSPARENCY

After failure, show:

- what was consumed,
- what discovery/protection progress increased,
- how future attempts improved if applicable.

The player should not feel robbed.

---

# 143. ENCOUNTER HISTORY

The game may record:

- first trace,
- first encounter,
- capture attempts,
- successful capture,
- shiny discovery.

This supports collection storytelling.

Exact Catchdex UX belongs to Document 11.

---

# 144. TARGETED HUNTING

As progression advances, players should gain better ways to hunt a desired Catchmon.

Potential tools:

- route choice,
- Discovery Gear,
- element-targeted lure,
- Catchmon capability,
- trace information.

Targeted hunting should reduce randomness without removing discovery excitement.

---

# 145. NO GLOBAL “SELECT ANY CATCHMON” FARM

The player should not simply choose:

> spawn Catchmon #73

from a menu once enough Coins are paid.

Route ecology and discovery retain meaning.

---

# 146. TRACE-BASED TARGETING

Once a line is Traced, later expedition preparation may improve its encounter weighting.

This gives the player a path from:

> random discovery

to

> intentional hunt.

---

# 147. RARE HUNT PROTECTION

When the player deliberately targets a traced rare line through eligible routes:

- repeated misses should progressively increase meaningful opportunity.

This avoids endless low-percentage frustration.

---

# 148. COLLECTION COMPLETION PHILOSOPHY

Completing the 104-stage Catchdex should require:

- exploration,
- capture,
- evolution,
- specialization.

It should not require:

- duplicate grinding,
- premium purchases,
- impossible RNG.

---

# 149. EVOLUTION STAGES AND CATCHDEX

Later stages count toward the 104-stage collection through evolution.

This makes development part of collection completion.

The world does not need to independently spawn every evolved form.

---

# 150. SPECIAL CATCHMON ACQUISITION

A small number of signature/special Catchmons may require:

- special expedition,
- route puzzle,
- collection milestone,
- crafted signature preparation,
- unique discovery chain.

These should be curated.

---

# 151. SPECIAL ACQUISITION MUST STILL FOLLOW CORE PRINCIPLES

Even special Catchmons should avoid:

- combat bosses,
- permanent miss,
- duplicate sacrifice,
- premium paywall.

---

# 152. EXPEDITION EVENT SYSTEM — BOUNDARY

Routes may later produce occasional non-combat events such as:

- forked path,
- resource cache,
- weather condition,
- unusual trace.

The base architecture does not require interactive event chains.

If added, events should resolve quickly.

---

# 153. NO CHOOSE-YOUR-OWN-ADVENTURE OVERLOAD

The game should not interrupt every expedition with five text decisions while the player is away.

The primary decision remains preparation.

---

# 154. WEATHER / CONDITION BOUNDARY

Regional conditions may later modify:

- preferred elements,
- Gear usefulness,
- encounter pool.

Exact dynamic systems belong to Document 10 or future live systems.

---

# 155. EXPEDITION INFORMATION MODEL

The player should be able to understand:

### Route
What it is good for.

### Team
Why selected Catchmons fit.

### Gear
What each prepared item changes.

### Time
How long it takes.

### Rewards
What categories are likely/guaranteed.

### Encounter
What is known about discovery possibility.

No external calculator should be required.

---

# 156. ROUTE CARD PRIORITY

Final UX aside, a route choice needs to surface:

1. route identity,
2. intent,
3. duration,
4. major rewards,
5. encounter potential,
6. requirements,
7. current team fit.

---

# 157. TEAM-SELECTION PRIORITY

Catchmon selection should surface:

- Primary Domain,
- expedition-relevant capability,
- element/region fit,
- synergy tags,
- availability.

Do not display unrelated Workshop stats in the primary expedition selection view.

---

# 158. GEAR-SELECTION PRIORITY

Preparation UI should surface:

- eligible items,
- effect,
- consumable/reusable status,
- reservation/consumption timing.

---

# 159. RESULTS PRIORITY

Results should surface:

1. new discovery/encounter,
2. special component,
3. core materials,
4. bonus details.

Do not bury a new Catchmon trace under 12 small resource rows.

---

# 160. EXPEDITION ANTI-PATTERNS

The following are explicit warning signs.

---

## ANTI-PATTERN A — HIDDEN COMBAT

Expedition success is effectively attack/defense math with different names.

Result:

The game drifts into a battler.

---

## ANTI-PATTERN B — TEAM POWER NUMBER

All Catchmon choice collapses to one score.

Result:

Roles and synergies become irrelevant.

---

## ANTI-PATTERN C — TOTAL FAILURE

Long expedition returns nothing.

Result:

Timers become punishment.

---

## ANTI-PATTERN D — MANDATORY CONSUMABLE TAX

Every route requires several disposable crafted items.

Result:

World loop becomes upkeep.

---

## ANTI-PATTERN E — INFINITE OFFLINE AUTO-RUN

Expeditions repeat while away indefinitely.

Result:

Passive accumulation dominates.

---

## ANTI-PATTERN F — REAL-TIME RARE ENCOUNTER

Rare Catchmon disappears because player was offline.

Result:

FOMO/anxiety.

---

## ANTI-PATTERN G — PAY TO RETRY

Failed capture immediately offers Coin/premium reroll.

Result:

Preparation/protection loses meaning.

---

## ANTI-PATTERN H — PURE RNG FAILURE

Capture fails and nothing improves.

Result:

Rare encounters feel unfair.

---

## ANTI-PATTERN I — DUPLICATE WORKERS

Owned species can be captured repeatedly and stacked.

Result:

104 curated Catchmons become worker farming.

---

## ANTI-PATTERN J — SHINY POWER

Shiny gives stronger expedition/shop stats.

Result:

Cosmetic rarity becomes mandatory.

---

## ANTI-PATTERN K — EXPEDITION COIN FARM

Best income comes directly from routes.

Result:

Shop selling becomes secondary.

---

## ANTI-PATTERN L — ONE BEST GEAR

Newest Capture Tool is always optimal.

Result:

Preparation loses strategy.

---

## ANTI-PATTERN M — TOO MANY LOADOUT SLOTS

Every expedition needs complex equipment management.

Result:

Mobile usability suffers.

---

## ANTI-PATTERN N — OLD ROUTE OBSOLESCENCE

New region makes every previous route useless.

Result:

World content shrinks over progression.

---

## ANTI-PATTERN O — NO TARGETING

Player can never improve odds of finding a desired Catchmon.

Result:

Collection completion becomes RNG grind.

---

## ANTI-PATTERN P — PERFECT TARGET SELECTION

Player can simply choose exact Catchmon encounter from a menu.

Result:

Discovery fantasy disappears.

---

# 161. MINIMUM EXPEDITION PROTOTYPE

The first prototype should contain:

- 1 region,
- 3 routes:
  - Supply Run,
  - Component Hunt,
  - Discovery Survey,
- 1 expedition slot,
- 1 Lead Catchmon slot,
- optional simulated Support,
- 2 routine materials,
- 1 special component,
- 2 expedition-relevant Gear items,
- 2 encounterable Catchmon lines,
- one already-owned line case,
- visible capture chance,
- one capture aid,
- bad-luck protection state.

The goal is to validate the loop, not the world breadth.

---

# 162. PROTOTYPE ROUTE A — SUPPLY

Test:

- predictable reward,
- simple Catchmon fit,
- short duration.

Question:

> Does this feel useful without replacing routine supply systems?

---

# 163. PROTOTYPE ROUTE B — COMPONENT

Test:

- guaranteed baseline,
- rare component opportunity,
- protection after misses.

Question:

> Does scarcity create anticipation without frustration?

---

# 164. PROTOTYPE ROUTE C — DISCOVERY

Test:

- trace generation,
- encounter opportunity,
- Capture Gear reservation,
- capture attempt.

Question:

> Does finding a Catchmon feel like the payoff of preparation?

---

# 165. PROTOTYPE CAPTURE SCENARIO A — NO GEAR

Encounter an accessible Catchmon with no optional capture aid.

Question:

> Is the base chance understandable and viable?

---

# 166. PROTOTYPE CAPTURE SCENARIO B — WITH GEAR

Use a reserved Capture Aid.

Question:

> Does the player understand the value of crafting/bringing it?

---

# 167. PROTOTYPE CAPTURE SCENARIO C — FAILURE

Force a failed capture.

Question:

> Does the player understand what progress was retained?

---

# 168. PROTOTYPE CAPTURE SCENARIO D — REPEAT

Encounter the same uncaught line again after failure.

Question:

> Does protection make the second opportunity feel meaningfully better?

---

# 169. PROTOTYPE OWNED ENCOUNTER

Encounter an already-owned line.

Question:

> Does the outcome still have value without creating a duplicate worker?

---

# 170. PROTOTYPE TEAM CHOICE

Offer two Catchmons:

- one better for discovery,
- one better for materials.

Question:

> Does the player choose based on expedition goal rather than generic strength?

---

# 171. PROTOTYPE GEAR CHOICE

Offer:

- reusable tracking gear,
- consumable capture aid.

Question:

> Does preparation create real tradeoffs without excessive inventory management?

---

# 172. EXPEDITION PROTOTYPE METRICS

Track:

- route choice distribution,
- route idle time,
- expedition completion rate,
- team composition,
- Lead usage,
- preparation item usage,
- consumable use,
- reusable Gear assignment,
- reward outcomes,
- component protection progress,
- trace frequency,
- encounter frequency,
- new-vs-owned encounter ratio,
- capture attempt rate,
- capture aid use,
- capture success/failure,
- failure protection progression,
- repeat target behavior,
- time from trace → encounter → capture,
- expedition-driven crafting behavior.

---

# 173. TEAM DIVERSITY HEALTH TARGET

Players should use different Catchmons for:

- Supply,
- Component,
- Discovery goals.

If the same Lead is always optimal, role design needs revision.

---

# 174. GEAR HEALTH TARGET

Players should sometimes:

- use Gear,
- save Gear,
- sell Gear.

If one choice dominates all the time, dual-use balance failed.

---

# 175. CAPTURE FAILURE HEALTH TARGET

A failed capture should create disappointment followed by:

> “Next time I am closer / better prepared.”

not:

> “That was a complete waste.”

---

# 176. DISCOVERY HEALTH TARGET

Players should gradually move from:

> unknown possibilities

to

> intentional hunting.

The system must support both mystery and agency.

---

# 177. RARE COMPONENT HEALTH TARGET

Rare components should feel valuable enough that receiving one changes crafting plans.

They should not feel so rare that advanced recipes are never used.

---

# 178. RETURN-SESSION HEALTH TARGET

Completed expeditions should create:

- a satisfying result,
- a useful next decision,
- no claim-gate friction.

---

# 179. EXPEDITION CONTENT DEVELOPMENT PIPELINE

When creating a real route:

### STEP 1 — DEFINE PLAYER GOAL
Why would the player choose this route?

### STEP 2 — DEFINE REGION/FANTASY
What place is being explored?

### STEP 3 — DEFINE INTENT
Supply, Component, Discovery, or Special.

### STEP 4 — DEFINE GUARANTEED VALUE
What useful baseline always returns?

### STEP 5 — DEFINE OPTIONAL VALUE
What bonus outcome creates excitement?

### STEP 6 — DEFINE TEAM FIT
Which capabilities/elements/tags matter?

### STEP 7 — DEFINE PREPARATION FIT
Which crafted products are useful?

### STEP 8 — DEFINE ENCOUNTER POOL
Which line-entry Catchmons belong here?

### STEP 9 — DEFINE PROTECTION
How is bad luck bounded?

### STEP 10 — DEFINE VISUAL ASSET BRIEF
Only after mechanics are approved.

---

# 180. ENCOUNTER CONTENT DEVELOPMENT PIPELINE

For each encounterable line:

### STEP 1
Confirm canonical line-entry species.

### STEP 2
Assign region/route ecology.

### STEP 3
Assign rarity profile.

### STEP 4
Assign capture difficulty profile.

### STEP 5
Assign useful Discovery Gear hooks.

### STEP 6
Assign bad-luck protection profile.

### STEP 7
Check progression availability.

### STEP 8
Check that similar lines do not share identical acquisition paths unnecessarily.

---

# 181. ACQUISITION DISTRIBUTION AUDIT

Before finalizing all Catchmons, audit:

- early routes contain useful lines,
- all four Catchmon domains become available progressively,
- all elements gain reasonable discovery paths,
- rare lines are distributed across regions/intents,
- essential economic roles are not trapped behind extreme rarity.

---

# 182. ROUTE ENCOUNTER COVERAGE AUDIT

Each route should have:

- coherent encounter pool,
- enough variation,
- not so many species that targeted hunting becomes impossible.

---

# 183. WORLD COMPLETION AUDIT

Document 10 should later verify each region contains:

- meaningful material identity,
- expedition reasons,
- Catchmon discovery identity,
- recipe/economy relationship.

---

# 184. PROTECTION AUDIT

For every rare:

- component,
- Catchmon encounter,
- critical discovery

define how repeated bad luck is bounded.

Nothing progression-critical should rely on an uncapped low-probability roll.

---

# 185. CANONICAL EXPEDITION DATA SOURCE

When implemented, routes, reward pools, and encounter pools require canonical registries.

Do not hardcode route logic independently in:

- UI,
- timer engine,
- rewards,
- Catchdex.

---

# 186. CANONICAL CAPTURE DATA SOURCE

Species capture difficulty/protection profile must have one canonical owner.

Do not duplicate capture odds across:

- encounter UI,
- expedition data,
- Catchmon detail,
- tests.

---

# 187. BALANCE CONFIGURATION

Exact values such as:

- durations,
- reward quantities,
- encounter weights,
- capture probabilities,
- pity increments

must be centralized in balance/configuration data.

Gameplay logic consumes them.

---

# 188. DETERMINISTIC TESTABILITY

Random expedition/capture logic should be testable through injected/se seeded randomness.

Important behaviors to test:

- guaranteed rewards,
- protection progression,
- encounter eligibility,
- owned-line handling,
- Capture Aid consumption,
- success/failure state transitions.

Exact technical pattern belongs to Document 14.

---

# 189. NO RANDOMNESS IN UI COMPONENTS

UI must display outcomes/state.

It must not generate:

- loot rolls,
- encounter rolls,
- capture rolls.

Domain engines own randomness.

---

# 190. RESULT IDEMPOTENCY

An expedition result must not be claimable twice.

An encounter must not resolve twice.

A capture success must not create two owned instances.

This is a future technical acceptance requirement.

---

# 191. EXPEDITION SAVE-SAFETY

Because routes run across offline time, save/persistence must eventually support:

- start timestamp,
- completion timestamp,
- team snapshot,
- reserved items,
- route version,
- protected result state,
- pending encounter.

Document 14 will own exact persistence.

---

# 192. CONTENT VERSIONING BOUNDARY

If route balance changes while an expedition is already running, the game should use a consistent resolved rule.

The technical architecture may snapshot relevant route values/version at start.

Do not let a mid-run content patch corrupt results.

---

# 193. EXPEDITION + ART CONSEQUENCE

Future asset needs likely include:

- route/region thumbnails,
- expedition intent icons,
- preparation-slot icons,
- trace/discovery symbols,
- encounter states,
- result rarity emphasis,
- capture action icons.

These should be defined in Documents 12/13.

Do not generate them yet.

---

# 194. EXPEDITION + CATCHMON IMAGE CONSEQUENCE

Existing 104 Catchmon images should be reused for:

- encounter reveal,
- team selection,
- Catchdex,
- capture result.

Do not regenerate creatures for this system unless a later art decision explicitly requires adaptation.

---

# 195. NO MAP ASSET EXPLOSION YET

The project does not need dozens of fully rendered regions before the expedition loop is proven.

Prototype routes can use minimal placeholder environments.

---

# 196. SYSTEM OWNERSHIP BOUNDARIES

To prevent future conflicts:

### Document 03 owns
- resource economic classes,
- special-component macro role.

### Document 04 owns
- Field Gear / Capture Gear as crafted product families,
- utility-mode possibility.

### Document 06 owns
- Catchmon Expedition-domain capabilities,
- assignment,
- Level/evolution.

### Document 07 owns
- expedition execution,
- route/reward/discovery/capture behavior,
- duplicate encounter resolution.

### Document 08 will own
- physical/infrastructure expedition capacity.

### Document 09 will own
- unlock order,
- pacing,
- Catchmon Level/evolution thresholds.

### Document 10 will own
- region/element identities,
- exact world relationships.

### Document 11 will own
- final map/expedition/capture UX.

---

# 197. LOCKED DECISIONS FROM DOCUMENT 07

The following decisions are considered part of the intended Acquisition & Expedition System unless deliberately revised:

1. Expeditions are the main non-combat external-world loop.
2. Expeditions focus on strategic preparation, time, results, discovery, and capture rather than combat.
3. The recurring expedition architecture contains Supply Run, Component Hunt, Discovery Survey, and Special Expedition intents.
4. Supply Runs prioritize predictable routine/regional materials.
5. Component Hunts prioritize special-component opportunities.
6. Discovery Surveys prioritize traces, encounters, and collection progress.
7. Special Expeditions are curated and not the ordinary economic backbone.
8. Routes are authored canonical definitions rather than fully random generated quests by default.
9. Route hard requirements and route preferences are distinct.
10. Preferences are preferred over excessive hard gating.
11. Routes do not use a generic Team Power requirement.
12. Expedition teams use one Lead Catchmon plus a small number of optional Support Catchmons.
13. Exact Support capacity remains progression-controlled.
14. Expedition Catchmons obey the one-functional-duty rule.
15. Expedition setup is snapshotted at start where necessary.
16. Expeditions do not use a universal Catchmon stamina system.
17. Normal expeditions do not use an injury/recovery punishment system.
18. Expedition preparation is built around Provisions, Field Gear, and Capture & Discovery Gear.
19. Normal routes are not all gated by mandatory consumable preparation.
20. Expeditions have limited preparation capacity.
21. Player-use products support Consumable and Reusable utility modes.
22. Reusable expedition Gear has no durability grind by default.
23. Expedition items are reserved while committed.
24. Consumption timing follows item purpose.
25. Capture Aids must normally be reserved before expedition departure.
26. Reserved Capture Aids are not consumed if no encounter occurs.
27. Expedition routes use multiple duration bands.
28. Useful short routes remain relevant in later progression.
29. Expeditions do not require manual travel tapping or combat input while running.
30. Shop Momentum is not a universal expedition speed-up/reroll currency.
31. Every normal completed expedition returns a guaranteed useful baseline.
32. Expeditions may additionally produce bonus, discovery, and special outcomes.
33. Rare components receive bounded bad-luck protection.
34. Bad-luck protection state is not a spendable currency.
35. Expedition results are protected from loss while offline.
36. Catchmons return automatically at expedition completion and become available before manual result review.
37. Expeditions do not auto-repeat indefinitely by default.
38. Resource overflow from expedition results is protected rather than silently destroyed.
39. Discovery state conceptually progresses Unknown → Traced → Encountered → Owned.
40. Trace/discovery progress is not a spendable resource.
41. Routes contain canonical encounter pools.
42. Standard acquisition targets the entry species of an evolution line, usually the base stage.
43. Later evolution stages are primarily obtained through evolution rather than repeated wild capture.
44. Evolved wild encounters are special exceptions.
45. Single-stage Catchmons are captured directly.
46. Encounter generation should generally bias toward meaningful new collection progress while unowned eligible lines remain.
47. Already-owned lines are downweighted relative to unowned targets where appropriate.
48. Encounter generation uses bad-luck protection for repeated eligible misses.
49. Encounter Opportunities are protected result states.
50. Rare encounters do not expire because the player was offline.
51. Capture is a short preparation-based decision, not combat or a twitch minigame.
52. Capture outcome considers species difficulty, discovery state, Catchmon capabilities, reserved Gear, route context, and protection state.
53. Capture chance/result must be readable before committing scarce Gear.
54. Capture does not use a generic team Power score.
55. The player may attempt, use eligible reserved aid(s), or decline.
56. Capture Aids show their effect and consumption behavior before confirmation.
57. Capture attempts resolve once; there is no rapid retry tapping.
58. Failed captures cannot be instantly rerolled with Coins or Shop Momentum.
59. Capture failure permanently records the species as Encountered.
60. Capture failure increases future protected success opportunity.
61. Capture protection is line-specific state, not a currency.
62. Failing a rare encounter never permanently removes the line from future acquisition.
63. Declining an encounter does not consume optional Capture Aids or create major punishment.
64. Capture success creates one functional owned line-entry Catchmon.
65. Already-owned encounters do not create additional worker copies.
66. Already-owned encounters may still provide observation/material/variant value.
67. Duplicate encounters do not primarily provide species shards for power-up.
68. Shiny/variant encounters are cosmetic/collection prestige and do not provide stronger gameplay stats.
69. A shiny first capture may unlock ownership and the shiny visual simultaneously.
70. A shiny encounter after ownership unlocks the visual variant rather than a second worker.
71. Capture & Discovery Gear should support different strategic roles rather than one universal best item.
72. Field Gear should support access, efficiency, extraction, protection, and observation roles.
73. Expedition loadout complexity remains intentionally small/mobile-friendly.
74. Tag-based Catchmon synergy applies to expedition teams.
75. A non-ideal but eligible team still receives useful expedition results.
76. Route preview communicates purpose, duration, rewards, requirements, encounter potential, and team fit.
77. The game should progressively reveal enough world information to avoid external-guide dependency.
78. The player has limited concurrent expedition capacity.
79. Owning many Catchmons does not allow unlimited parallel expeditions.
80. Rare encounter/capture decisions are never auto-resolved by basic automation.
81. Expedition timers progress offline.
82. Offline expedition completion safely stores result and encounter.
83. One expedition does not chain infinitely while offline without explicit future automation.
84. Expeditions primarily generate materials/components/discovery rather than becoming the main Coin source.
85. Normal routes do not require a generic Coin entry fee by default.
86. The system does not introduce a universal Expedition Ticket currency by default.
87. Discovery/capture does not assume premium-currency purchase/rerolls.
88. Rarity and Capture Difficulty are separate concepts.
89. Eligible encounters should have a viable non-zero capture path unless a hard requirement was clearly communicated beforehand.
90. Excellent preparation/protection may eventually reach very high or guaranteed capture chance.
91. There is no generic post-encounter “pay Coins for 100% capture” button.
92. Consumable Capture Aids may be lost on failed attempts, but failure protection preserves progress.
93. Targeted hunting becomes increasingly possible through routes, traces, Gear, and Catchmon capabilities.
94. The player cannot simply select any uncaught Catchmon from a menu for a guaranteed spawn.
95. Collection completion combines exploration, capture, and evolution rather than duplicate grinding.
96. Progression-critical rare outcomes require bounded protection.
97. Route/reward/encounter/capture data require canonical sources of truth.
98. Random outcome logic must live in deterministic/testable domain systems rather than UI components.
99. Expedition results and captures must be idempotent.
100. Large-scale expedition/environment asset production remains blocked until later world/art/asset documents are approved.

---

# 198. OPEN QUESTIONS DELIBERATELY LEFT FOR LATER

This document intentionally leaves open:

- exact expedition slot count,
- exact Support Catchmon count,
- exact route duration values,
- exact route list,
- exact region route distribution,
- exact guaranteed reward quantities,
- exact bonus reward probabilities,
- exact special-component protection formula,
- exact Trace generation formula,
- exact encounter weights,
- exact new-species bias,
- exact encounter protection thresholds,
- exact capture chance formula,
- exact capture difficulty bands/names,
- exact capture protection increments,
- exact number of usable Capture Aids per encounter,
- exact Capture Gear product definitions,
- exact Field Gear product definitions,
- exact reusable-vs-consumable product mapping,
- exact Gear effects,
- exact route access requirements,
- exact route preferences,
- exact expedition synergy values,
- exact already-owned encounter reward profile,
- exact shiny encounter rates/protection,
- exact special Catchmon acquisition chains,
- exact automation unlocks,
- exact route information-reveal system,
- exact Catchdex discovery presentation,
- exact expedition UI,
- exact map structure,
- exact world environment art.

These belong to Documents 08–11, roster mapping, balancing, Technical Architecture, and later content production.

---

# 199. DEPENDENCY HANDOFF TO DOCUMENT 08

Documents 02–07 now define the core playable loops:

## SHOP LOOP

Craft → Display → Customer → Sell → Reinvest

## WORLD LOOP

Prepare → Team → Expedition → Rewards/Discovery → Encounter → Capture → Return

The next question is:

> **What physical shop/infrastructure does the player build to support these systems, and how does the shop visibly grow from a small starting space into a large Catchmon commerce hub?**

Document 08 must translate abstract capacities such as:

- production stations,
- display slots,
- storage,
- customer capacity,
- Catchmon assignment capacity,
- expedition capacity

into a coherent growth/infrastructure model.

---

# 200. NEXT DOCUMENT

## `08_CATCHMON_SHOP_SHOP_GROWTH_AND_INFRASTRUCTURE.md`

Document 08 should define:

### Physical shop model
- what the main shop actually contains,
- whether expansion uses rooms, plots, zones, or modules.

### Production infrastructure
- how the five station archetypes physically exist,
- how stations upgrade,
- how production capacity expands.

### Display infrastructure
- display slots,
- merchandising,
- stocking capacity,
- customer-demand influence.

### Storage infrastructure
- material storage,
- product storage,
- special-component handling.

### Customer infrastructure
- active customer capacity,
- arrival support,
- special visitor space.

### Catchmon infrastructure
- Workshop support,
- Shop Floor support,
- Supply assignments,
- resting/roaming representation.

### Expedition infrastructure
- expedition slots,
- preparation/loadout support,
- return/result handling.

### Visual growth
- how upgrades visibly change the shop.

### Expansion pacing
- how infrastructure competes for Coins without creating one mandatory order.

### Building/station boundary
- which systems are stations, rooms, modules, props, or separate buildings.

### Decoration boundary
- where aesthetic customization fits without becoming pay-to-progress.

Only after Document 08 is stable should the project lock building/room asset requirements.

---

# 201. DEFINITION OF DONE FOR ACQUISITION & EXPEDITIONS

Document 07 is ready to hand off when the project can answer:

- What is an expedition?
- Why does it exist economically?
- What are the four expedition intents?
- What does the player choose before departure?
- What is the Lead/Support model?
- Why are route requirements different from preferences?
- How do Provisions, Field Gear, and Capture Gear work?
- Which items are consumable vs reusable?
- When are Capture Aids consumed?
- What happens while the player is offline?
- Can a normal expedition completely fail?
- How are rare components protected from bad luck?
- How are results protected when storage is full?
- When do Catchmons become available again?
- Does the system auto-repeat?
- How does Unknown → Traced → Encountered → Owned work?
- Which evolution stage is normally captured?
- How are already-owned encounters handled?
- How are shiny variants handled?
- What determines capture opportunity/chance?
- What happens after a failed capture?
- Can the player instantly buy a retry?
- How does targeted hunting become possible?
- Why does the system avoid a team Power score?
- How do expedition teams use Catchmon roles/synergies?
- How does the world feed the shop rather than replace it?
- Which data requires canonical registries?
- Which design decisions are now locked?
- Which details intentionally remain for Documents 08–10, balancing, and content mapping?

If these answers remain coherent during prototyping, the project can move into Shop Growth & Infrastructure without needing to redefine the external-world loop.
