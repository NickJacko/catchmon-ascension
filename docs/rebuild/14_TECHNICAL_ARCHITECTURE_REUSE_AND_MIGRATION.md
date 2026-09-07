# 14 — Technical Architecture Reuse & Migration

# 1. Rebuild Strategy

Create a **separate cloned repository/project**.

Do not transform the only working Catchmon Shop copy in place.

Recommended working root:

`catchmon-ascension/`

Original `catchshop/` remains frozen/reference.

# 2. Proven Architecture To Reuse

Preserve where possible:
- strict TypeScript,
- React/Vite/Router,
- Zustand thin bridge,
- Zod,
- Dexie/IndexedDB,
- PixiJS,
- Vitest/RTL/Playwright,
- pnpm / Node 24,
- layer-boundary ESLint,
- branded IDs,
- Result type,
- injected Clock,
- deterministic seeded RNG,
- Game Engine command boundary,
- timestamp reconciliation,
- writer lease / multi-tab safety,
- AssetId / AssetMetadata / resolver,
- canonical Catchmon graph,
- canonical Element map,
- tiered validation workflow,
- scale-harness philosophy.

# 3. Layering Remains

CORE  
↓  
DOMAIN  
↓  
APPLICATION  
↓  
INFRASTRUCTURE  
↓  
PRESENTATION

CONTENT stays data-driven and parallel.

React/Pixi do not own gameplay state.

# 4. Shop Systems To Retire

The clone should retire/archive:
- crafting/product economy,
- display stocking,
- customer sales,
- Momentum sales loop,
- shop infrastructure gameplay,
- Shop Rank as central progression,
- production-station economy,
- customer archetype system.

Do not delete before a dependency audit.

Classify modules:
- KEEP
- ADAPT
- RETIRE

# 5. Systems To Adapt

## Expeditions
Adapt rewards to combat/evolution/Forge progression.

## Regions
Keep generic region/unlock architecture.

## Catchmon ownership/evolution
Strongly reusable.

## Unlock rules
Reuse for systems/world milestones.

## Persistence/reconciliation
Keep and extend.

# 6. New Domain Modules

Recommended:

`src/domain/combat/`
- stats
- battle-state
- effects
- damage
- battle-path

`src/domain/forge/`
- relic
- rarity
- affix
- forge-level
- insight

`src/domain/loadout/`
- relic-matrix
- skills
- support-formation
- build-fit

`src/domain/journey/`
- stages
- bosses
- path-progress

`src/domain/progression/`
- Journey Rank
- research
- mastery

# 7. Representative Commands

- FORGE_RELIC
- EQUIP_RELIC
- RECYCLE_RELIC
- LOCK_RELIC
- SET_FORGE_AUTOMATION
- SELECT_BATTLE_PATH
- SET_SKILL_LOADOUT
- ASSIGN_LEAD_CATCHMON
- ASSIGN_BOND_SUPPORT
- START_BOSS_ATTEMPT
- RECONCILE_JOURNEY
- EVOLVE_CATCHMON
- START_EXPEDITION
- RESOLVE_ENCOUNTER

Names are technical working names.

# 8. New GameState

Expected areas:
- journey,
- combat/loadout,
- forge,
- relic inventory,
- catchmons,
- skills,
- progression,
- world,
- expeditions,
- settings,
- save metadata.

Remove Shop/customer/display state only through the cloned app's deliberate new schema.

# 9. Save Isolation

Catchmon Ascension is a new game, not a Catchmon Shop patch.

Use:
- new IndexedDB database name,
- new save namespace,
- new app identifier.

Do not accidentally read/write old Catchmon Shop saves.

Default: no automatic Shop-save migration.

# 10. Deterministic Combat

Same:
state + config + seed
must produce same battle result.

Never use `Math.random()` in gameplay domain/application code.

# 11. Deterministic Forge

Forge result is derived from:
- command id/seed,
- Forge Level,
- drop config,
- Insight state.

Enables replay/debug/testing and exactly-once behavior.

# 12. Reconciliation

Handles:
- offline farming,
- expeditions,
- cooldown/time-based systems,
- capped progress.

Never loop per elapsed second for long offline windows.

# 13. Pixi Boundary

Pixi renders:
- battle,
- creatures,
- enemies,
- effects,
- backgrounds,
- optional Forge animation.

React renders:
- menus,
- sheets,
- comparisons,
- settings,
- accessible controls.

Scene view models remain pure selectors.

# 14. Test Strategy

Retain:
- `check:fast`
- `check:affected`
- full phase gate

Add:
- deterministic combat tests,
- Forge distribution/property tests,
- offline reconciliation tests,
- exactly-once reward tests,
- Build Fit tests.

# 15. Scale

New scale fixture should eventually model:
- 104 species,
- 17 Regions,
- large Relic/effect catalog,
- many stages,
- skills/builds.

Synthetic content never becomes canon.

# 16. E2E Hook Security

All deterministic browser hooks remain E2E-build-only.

Production build check must prove absence.

# 17. Exit Gate

Technical migration is ready when:
- cloned repo boots under new identity,
- original is untouched,
- new save namespace isolated,
- architecture boundaries pass,
- canonical Catchmon data reused,
- one combat command executes/persists,
- no Shop gameplay is required for boot.
