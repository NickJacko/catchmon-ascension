# 15 — Catchmon Ascension Rebuild Implementation Plan

# 1. Objective

Rebuild the copied Catchmon Shop project into the first playable Catchmon Ascension vertical slice **without throwing away the proven engineering foundation**.

Do not implement the full 104-Catchmon / 17-Region game in one wave.

# 2. New Vertical Slice

Prove:
- auto-battle,
- stage progression,
- bosses,
- Rift Forge,
- Relic compare/equip/recycle,
- Forge Level + Insight,
- 3 Battle Paths,
- skills/loadout,
- Lead + Bond Supports,
- capture/ownership/evolution,
- 2 Regions,
- offline/reload safety,
- mobile-first UX,
- scalable architecture.

Suggested content:
- Vulkankrater + Ozean,
- 8–12 real Catchmons,
- 3 Battle Paths,
- 8 Relic Matrix slots,
- small affix/effect pool,
- 2–4 bosses,
- a small expedition set.

# 3. Phase R0 — Repository Clone & Safety

Tasks:
- copy/fork `catchshop/` to new root,
- change package/app identifiers,
- new IndexedDB name,
- new save namespace,
- preserve Git history if useful,
- mark old repo reference/read-only,
- add these docs,
- verify old project unchanged.

Exit:
both projects build independently.

# 4. Phase R1 — Dependency Audit / Shop Retirement Map

Classify major modules:
- KEEP
- ADAPT
- RETIRE

Do not delete first and discover dependencies afterward.

Keep engine, persistence, lease, RNG/Clock, assets, Catchmon canon, world/unlock infrastructure and validation tooling.

Exit:
new app boots with a neutral shell while Shop loop is no longer required.

# 5. Phase R2 — Journey & Combat Kernel

Headless implementation:
- combat stats,
- Lead Catchmon,
- enemy definition,
- deterministic basic-attack loop,
- stages,
- bosses,
- battle result,
- progression state.

No polished UI.

Exit:
deterministic headless combat/boss tests pass.

# 6. Phase R3 — Rift Forge Kernel

Implement:
- Echo Charges,
- Relic Matrix slots,
- Relic generation,
- rarity,
- affixes,
- equip,
- recycle,
- Forge Level,
- Forge Insight,
- deterministic RNG.

Exit:
battle feeds Forge; Forge upgrades can change battle outcome.

# 7. Phase R4 — Battle Paths & Build Fit

Implement:
- Breaker,
- Warden,
- Weaver,
- stat conversions,
- minimal skills,
- Build Fit,
- loadout state.

Exit:
three Paths create visibly different outcomes against the same boss.

# 8. Phase R5 — Catchmon Combat Integration

Adapt canonical ownership:
- Lead assignment,
- 3 Bond Supports,
- support behaviors,
- Bond,
- evolution combat effects.

Start with 8–12 real species.

Exit:
Catchmon composition can change boss outcome without changing Relic rarity.

# 9. Phase R6 — World / Stage Integration

Implement:
- Vulkankrater stages,
- Ozean stages,
- bosses,
- region unlock,
- encounters/capture,
- adapted expeditions.

Exit:
player can finish Region 1 and enter Region 2.

# 10. Phase R7 — Offline & Reconciliation

Implement/verify:
- stable farm checkpoint,
- offline aggregation,
- capped accumulation,
- expeditions,
- exactly-once rewards,
- reload safety.

Do not simulate every attack offline.

Exit:
long offline duration reconciles quickly and deterministically.

# 11. Phase R8 — React UX

Build four-tab IA:

Journey / Forge / Catchmons / World.

Implement:
- HUD,
- Relic comparison,
- Matrix,
- Battle Path,
- skills,
- roster,
- world navigation.

Accessibility from the start.

Exit:
full vertical loop is usable without developer tools.

# 12. Phase R9 — Pixi Battle Scene

Implement:
- background,
- Lead sprite,
- enemy/boss,
- HP/status,
- basic attack visuals,
- minimal VFX,
- pure scene view model.

No domain logic in Pixi.

Exit:
real state visibly drives battle scene.

# 13. Phase R10 — Progressive Automation

Implement:
- rarity filters,
- affix filters,
- batch Forge,
- stop-on-upgrade,
- later optional offline Forge.

Automation unlocks through progression.

Exit:
high-volume Forge no longer requires repetitive manual tapping.

# 14. Phase R11 — Engagement / Meta Layer

Implement only needed systems:
- Journey Rank,
- starter Research branch,
- Skill Mastery,
- collection goals.

Do not add social/liveops yet.

Exit:
midgame has deterministic routes beyond random Relics.

# 15. Phase R12 — Production Art & Performance

First art wave:
- original Rift Forge,
- battle golden sample,
- Vulkankrater background,
- Ozean background,
- Lead Catchmon runtime assets,
- Relic UI assets,
- core VFX.

WebP-first runtime direction.

Exit:
mobile cold load acceptable; visual identity clearly original.

# 16. Phase R13 — Scale / Hardening / Exit Gate

Validate:
- 104-species architecture,
- 17 Regions,
- large stage catalog,
- large Relic/effect catalog,
- persistence size,
- deterministic simulation,
- mobile,
- WebKit/Chromium smoke,
- writer lease,
- production hook isolation,
- accessibility.

Run final scale, full check, E2E and real-browser walkthrough.

# 17. Final Player Journey

Fresh save
→ choose starter
→ auto-battle
→ earn Echo Charge
→ Forge first Relic
→ equip/recycle
→ improve Forge
→ beat first boss
→ choose Battle Path
→ assign Bond Support
→ discover/capture Catchmon
→ evolve/progress
→ fail later boss
→ optimize build
→ beat it
→ finish Vulkankrater
→ unlock Ozean
→ go offline
→ return
→ continue safely.

# 18. Rebuild Rules

Throughout:
- no competitor code/assets/UI/text copying,
- docs are authoritative,
- reuse proven architecture,
- remove Shop systems only after dependency audit,
- no 104-species production dump in first rebuild,
- no paid loot-box mechanics,
- no prestige reset,
- no feature-count inflation,
- every system needs a distinct player decision.

# 19. Validation Workflow

Task:
targeted fast checks.

Batch:
affected checks.

Phase exit:
one full gate + relevant E2E.

Do not run the entire suite after every edit.

# 20. Rebuild Completion Definition

The rebuild foundation is complete when:

1. Catchmon Shop still exists separately and works.
2. Catchmon Ascension has its own save/app identity.
3. Shop/customer/crafting loop is no longer the core gameplay.
4. Combat + Forge is the new core.
5. Catchmons/evolution/Elements remain canonical.
6. player can progress through two Regions.
7. failure invites build adjustment rather than payment.
8. game is visually/structurally distinct from Legend of Mushroom.
9. architecture scales to 104 Catchmons / 17 Regions.
10. the new vertical slice passes automated and browser acceptance.
