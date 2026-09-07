# 01 — Foundation, Vision & Differentiation

## Status

**Project:** Catchmon Ascension  
**Status:** Rebuild specification v1  
**Working title:** `Catchmon Ascension` is a codename and can be renamed later.  
**Source project:** the completed Catchmon Shop project is copied/forked. The original project remains untouched and serves as a proven technical foundation.

# 1. Product Vision

Catchmon Ascension is a **mobile-first idle RPG + creature collector** built around the existing 104 Catchmons, 51 evolution lines and 17 elemental regions.

The player fantasy is:

> **Grow one lead Catchmon from a small creature into a build-defining champion, collect and bond with many other Catchmons, continuously improve a powerful loadout, and push through an almost frictionless chain of stages, bosses and worlds.**

The game must be playable in two modes:

1. **Hands-off:** auto-battle, offline progress, smart auto-forging and short check-ins.
2. **Hands-on:** gear decisions, build optimization, boss attempts, Catchmon composition, skill timing, expeditions and progression choices.

The player should always feel that there is:
- a small improvement available now,
- a meaningful target a few minutes away,
- a system or world milestone on the horizon,
- and a long-term collection/build goal worth returning for.

# 2. Research Baseline: What Works in Legend of Mushroom

The rebuild takes structural inspiration from successful idle-RPG design patterns, especially these observed strengths:

- A very simple central reward loop: obtain a random equipment result, compare it, keep or recycle it, immediately gain progress, repeat.
- Auto-battle and offline progression keep the game moving when the player is not actively playing.
- Higher generator/lamp levels improve reward quality and automation, creating visible meta-progression around the reward source itself.
- Class/build decisions grow in importance after the initial simple onboarding.
- New progression systems are staggered instead of being dumped onto the player immediately.
- Guild/social systems, events and competitive modes create long-tail goals.
- Automation gradually replaces repetitive manual interactions.

These are **genre/mechanical observations**, not assets, code, UI, writing or content to be copied.

# 3. What Catchmon Ascension Improves

## 3.1 Progression walls

A common weakness in idle RPGs is an extremely generous first phase followed by a sharp slowdown.

**Rule:** Progress may slow, but every wall must expose at least two visible ways forward:
- deterministic accumulation,
- build optimization,
- collection/evolution,
- alternate activity,
- or a short wait with predictable payoff.

## 3.2 Currency and system overload

Layering many currencies and menus can create perceived depth without meaningful decisions.

**Rule:** Every progression system must answer a unique player question. If two systems merely increase power in the same way, merge them.

## 3.3 Pay-to-win / spending pressure

Paid chance-based power progression can create short-term revenue but undermines trust and can create gambling-like risk.

**Rule:** Core progression must remain satisfying without payment. Paid random power rewards are outside the default design.

## 3.4 Reward-processing fatigue

A high-volume random gear loop is satisfying early and tedious later.

**Rule:** Manual interaction introduces the system. Smart filters, batch processing and automation arrive before repetition becomes a chore.

## 3.5 Misleading power score

A single Power number can hide whether stats actually fit the build.

**Rule:** Display both:
- **Power** — broad overall strength.
- **Build Fit** — how well stats/effects support the chosen combat path.

## 3.6 Icon/menu overload

**Rule:** No more than four permanent bottom-navigation destinations. New systems live contextually under them.

# 4. Clean-Room Differentiation

The game may use familiar idle-RPG mechanics, but its expression must be original.

## Never copy

- mushroom protagonists, genie/lamp identity or narrative,
- competitor UI layout, icon placement or visual trade dress,
- named classes, companions, currencies, events, relics or mounts,
- exact progression numbers, drop tables, unlock days or event schedules,
- art, audio, animations, copywriting, screenshots, source code or data,
- specific live-event structures merely reskinned with Catchmon names.

## Deliberate differentiation

Catchmon Ascension is built around:
- 104 existing original Catchmons,
- 17 elemental worlds,
- Catchmon evolution lines,
- a **Rift Forge / Relic Matrix** reward fantasy instead of a lamp,
- **Battle Paths** instead of copied class trees,
- **Bond Support Catchmons** instead of a direct companion clone,
- region-based Catchmon acquisition rather than paid companion gacha,
- a smaller, clearer economy,
- milestone-driven system unlocks rather than server-age feature dumping,
- transparent deterministic safety nets around random rewards.

This is a clean-room product direction, not a guarantee against every possible IP claim. Commercial release should still receive normal legal/trademark review.

# 5. Core Design Pillars

## A — Constant Forward Motion
Battle keeps moving. Offline time has value. A failed boss is a visible target, not a dead end.

## B — High-Frequency Meaningful Rewards
The player regularly receives Rift Forge results and makes fast keep/recycle decisions.

## C — Catchmons Matter
Species, element, evolution, Bond Role and support composition materially affect builds.

## D — Build Discovery
Players discover combinations among attacks, skills, support Catchmons, Relic affixes and elemental effects.

## E — Layered Goals
At any time there should be a 10–30 second, 2–5 minute, session-length, multi-session and collection goal.

## F — Automation Without Removing Decisions
Automation removes repetitive execution, not strategy.

## G — Trustworthy Engagement
Retention comes from mastery, progress, collection and anticipation — not punishment for absence or obscured odds.

# 6. Non-Goals

The rebuild is not:
- Catchmon Shop with battles bolted on,
- a direct clone of another mobile game,
- a traditional turn-based monster battler,
- an action game requiring constant reflex control,
- a prestige-reset incremental,
- a shop-management game,
- a paid loot-box economy,
- a project that launches all 17 worlds and all 104 Catchmons in the first implementation batch.

# 7. High-Level Player Fantasy

The player starts with a small Catchmon and a damaged **Rift Forge**.

Fighting through unstable elemental paths yields **Echo Charges**. Charges power the Forge, producing randomized Relics. Each Relic can be equipped, stored, protected or recycled. Recycling advances deterministic progression, so a bad roll still moves the account forward.

Better Forge levels unlock stronger rarity bands, richer affixes, batch forging, smart auto rules and high-end Relic effects.

Along the journey the player captures Catchmons, evolves them, assigns a lead, builds a support formation, chooses a Battle Path, unlocks skills, challenges bosses and opens new elemental worlds.

The loop is intentionally simple at minute one and strategically deep later.

# 8. Success Definition

The rebuild succeeds when:

1. A new player understands the main loop within 60 seconds.
2. The first Forge result happens almost immediately.
3. The game works one-handed on mobile.
4. Auto-battle never makes active play pointless.
5. A player can explain why a Relic is good for their build.
6. Catchmon collection changes gameplay, not only completion percentage.
7. A failed boss creates a clear next plan.
8. Returning after hours offline feels rewarding, not mandatory.
9. The UI remains understandable as systems unlock.
10. The game remains recognizably Catchmon Ascension when compared side-by-side with other idle RPGs.
