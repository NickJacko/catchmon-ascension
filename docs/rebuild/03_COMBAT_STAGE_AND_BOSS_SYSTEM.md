# 03 — Combat, Stages & Boss System

# 1. Combat Fantasy

Combat is **real-time, mostly automatic, readable and fast**.

The player manages the build; the Catchmons execute it.

# 2. Combat Formation

Canonical initial formation:
- **1 Lead Catchmon**
- **up to 3 Bond Support Catchmons**

Only the Lead is the primary on-field unit in the first production stage.

Bond Supports influence battle through triggered assists, defensive saves, charge generation, elemental setup, skill modification or tempo effects. They are not generic +5% cards.

# 3. Core Combat Stats

Initial model:
- HP
- Attack
- Defense
- Attack Speed
- Critical Chance
- Critical Damage
- Skill Power
- Skill Haste
- Combo Chance
- Counter Chance
- Guard
- Evasion
- Accuracy
- Elemental Power
- Elemental Resistance

All percentages use integer basis points internally.

# 4. Battle Paths

## Breaker
Fast offense, basic-attack chains, critical/combo pressure.

## Warden
Counterattacks, guard, survival and damage conversion.

## Weaver
Skills, elemental effects, cooldown manipulation and tempo control.

Species are not permanently locked to one Path.

# 5. Stage Structure

Each Region contains multiple Paths.

A Path contains:
- normal encounters,
- elites,
- one local boss,
- a region milestone boss.

The architecture must not assume a fixed count.

First playable build target:
- 2 Regions,
- 10–20 meaningful stage checkpoints each,
- reusable normal templates,
- distinct bosses.

# 6. Normal Encounters

Normal enemies exist to:
- demonstrate build behavior,
- generate Forge resources,
- pace progression,
- make power gains visible.

A stage auto-advances until:
- boss reached,
- player loses,
- auto-progress disabled,
- or a real progression gate occurs.

# 7. Boss Archetypes

Bosses are build checks, not only HP walls.

Useful archetypes:
- Burst Check
- Sustain Check
- Skill Check
- Multi-hit / Counter Check
- Accuracy / Evasion Check
- Elemental Resistance Check
- Tempo Check

Each boss should support more than one viable response.

# 8. Manual Influence

Default skills can auto-cast.

Optional manual controls:
- trigger Signature Skill,
- hold one skill for timing,
- trigger one Bond Assist.

Manual play may improve difficult attempts without becoming mandatory for farming.

# 9. Determinism

Combat must be deterministic from:
- state,
- combat config,
- seed.

No hidden browser-timing dependency.

This supports tests, offline simulation and debugging.

# 10. Offline Combat

Do not simulate every attack for hours.

Offline inputs:
- last stable farm stage,
- build snapshot,
- elapsed time,
- offline efficiency,
- cap.

Outputs:
- routine defeats,
- Coins,
- Echo Charges,
- routine region resources.

Bosses are not silently auto-cleared offline in v1.

# 11. Element Model

Retain all 17 canonical Elements.

Element identity affects:
- species identity,
- region identity,
- selected skill/relic synergies,
- selected bosses.

Do not build a universal 17×17 type chart in v1. Prefer authored synergies and smaller interaction families.

# 12. Power / Build Fit / Forecast

UI exposes:

## Power
Broad total strength.

## Build Fit
How well stats/effects support the current Battle Path.

## Encounter Forecast
Contextual estimate for current boss/stage.

This keeps strategy from collapsing into one number.

# 13. Exit Gate

- Lead auto-fights.
- 3 Paths produce materially different outcomes.
- Bond Supports affect battle.
- same seed reproduces outcome.
- stages auto-progress.
- boss failure is explainable.
- a loadout change can turn a loss into a win.
- offline farming does not run per-second simulation.
