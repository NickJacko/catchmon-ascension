# 08 — Worlds, Regions & Expeditions

# 1. World Foundation

Reuse the canonical 17 element/region structure.

Every Region eventually needs:
- combat identity,
- resource identity,
- Catchmon encounter identity,
- boss identity,
- build opportunities.

Catchmon Shop commerce framing is no longer automatically authoritative.

# 2. Region Structure

Each Region contains:
- stage Paths,
- normal encounter templates,
- elites,
- bosses,
- Catchmon encounter tables,
- regional materials,
- expedition routes,
- one signature progression hook.

No Region should be a palette swap.

# 3. Region Unlock

Use generic unlock rules:
- Journey/global readiness,
- prior-region milestone,
- optional signature gate.

React never reimplements unlock logic.

# 4. First Two Regions

Recommended rebuild slice:

## Vulkankrater / Fire
Fast offense, burst, Forge acceleration, aggressive boss patterns.

## Ozean / Water
Sustain, continuity, recovery, tempo and reliable resource flow.

These already have canonical groundwork and form a strong contrast test.

# 5. Expeditions

Expeditions survive because the architecture is proven and they complement idle combat.

They are a side loop, not the primary loop.

Rewards can include:
- targeted materials,
- Catchmon discovery,
- evolution items,
- region rewards,
- Forge resources.

# 6. Expedition Intents

Retain the four canonical intents where useful:
- Supply Run
- Discovery Survey
- Component Hunt
- Special Expedition

Their reward content is adapted to the new game.

# 7. Expedition Decisions

An expedition should ask:
- target goal,
- route,
- Catchmon support,
- time/risk tradeoff.

Avoid send-and-forget with zero meaningful choice.

# 8. Encounter Semantics

Keep separate:
- primary Element identity,
- native region lines,
- route-specific encounter pool.

This enables guest species, rare cross-region encounters and events.

# 9. Boss Rewards

Bosses may unlock:
- skill modifiers,
- Forge tiers,
- world access,
- evolution materials,
- guaranteed Relics,
- encounter tables.

# 10. Region Completion

Can include:
- path bosses cleared,
- signature capture,
- exploration milestone,
- optional mastery.

Completion rewards account progress and collection identity.

# 11. Region 3–17 Rule

Before implementation each new region gets a one-page content brief:
- mechanic hook,
- build themes,
- enemies/boss patterns,
- encounter roster,
- resources,
- expedition role,
- art palette.

No mass copy/paste region generation into production.

# 12. Exit Gate

- Fire and Water feel mechanically different,
- region lock is generic,
- encounter pools are data-driven,
- expeditions resolve exactly once,
- reload/offline is safe,
- Region 3 requires content rather than architecture redesign.
