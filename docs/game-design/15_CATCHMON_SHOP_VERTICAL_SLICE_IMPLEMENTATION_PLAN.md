# CATCHMON SHOP — 15 VERTICAL SLICE IMPLEMENTATION PLAN

**Status:** Implementation Plan v1 — READY FOR EXECUTION  
**Purpose:** Convert Documents 01–14 into the exact implementation sequence Claude Code should execute to produce a complete, production-representative Catchmon Shop vertical slice without building full-game breadth too early, inventing missing design, importing legacy mechanics, or wasting context/tokens  
**Execution authority:** After this document is accepted, Claude Code may begin implementation **only within the scope defined here**. Full-game content production remains blocked until the Vertical Slice Exit Gate passes.  
**Depends on:**  
- `CLAUDE.md`  
- `docs/00_PROJECT_INDEX.md`  
- `01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`  
- `02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`  
- `03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`  
- `04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`  
- `05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`  
- `06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`  
- `07_CATCHMON_SHOP_ACQUISITION_AND_EXPEDITIONS.md`  
- `08_CATCHMON_SHOP_SHOP_GROWTH_AND_INFRASTRUCTURE.md`  
- `09_CATCHMON_SHOP_PROGRESSION_AND_UNLOCK_ARCHITECTURE.md`  
- `10_CATCHMON_SHOP_WORLD_AND_ELEMENT_STRUCTURE.md`  
- `11_CATCHMON_SHOP_UX_AND_INFORMATION_ARCHITECTURE.md`  
- `12_CATCHMON_SHOP_ART_DIRECTION_AND_VISUAL_STYLE_BIBLE.md`  
- `13_CATCHMON_SHOP_ASSET_TAXONOMY_AND_PRODUCTION_PLAN.md`  
- `14_CATCHMON_SHOP_TECHNICAL_ARCHITECTURE.md`

---

# 1. WHAT THIS DOCUMENT CHANGES

Documents 01–14 define the game and architecture.

Document 15 changes the project from:

> **DESIGN / SPECIFICATION**

to:

> **CONTROLLED VERTICAL-SLICE IMPLEMENTATION**

This is the first document that explicitly authorizes Claude Code to create the new application source tree and begin implementing gameplay.

It does **not** authorize Claude Code to:

- build the complete 104-Catchmon gameplay mapping,
- build all 17 production regions,
- create the 70–100 product catalog,
- generate all final assets,
- add social systems,
- add monetization,
- add prestige,
- import old gameplay architecture.

---

# 2. VERTICAL SLICE MISSION

The vertical slice must prove one complete Catchmon Shop experience:

> **Operate a small living shop → craft → stock → actively sell → make an infrastructure decision → use Catchmons strategically → prepare an expedition → return with resources/discovery → encounter and capture a Catchmon → return to a visibly improved shop → save/reload/offline progression still works.**

If this loop is not satisfying, the project must improve the loop before producing full-game breadth.

---

# 3. THE SLICE MUST PROVE THE GAME, NOT THE CONTENT COUNT

The implementation goal is not:

> “We have implemented 104 Catchmons and 17 regions.”

The goal is:

> “The final architecture, interaction model, economy relationships, Catchmon integration, world loop, persistence, and visual presentation all work together in one small but believable game.”

---

# 4. TWO VALIDATION TRACKS — IMPORTANT SOURCE-SCOPE CLARIFICATION

The existing design documents intentionally contain two different vertical-slice scopes.

## DOCUMENT 04 — CRAFTING SCALE TARGET

Document 04 defines a crafting-system scale validation target of approximately:

- all seven product families represented,
- 4–5 station archetypes,
- 18–28 unique products,
- several Recipe Ranks,
- one region package,
- signature/dual-use content,
- Mastery and Quality.

Its stated purpose is to test whether the crafting architecture scales.

## DOCUMENTS 08 / 13 — POLISHED SHOP SLICE

Documents 08 and 13 define a smaller physical/asset slice with:

- two visually represented station families,
- small Sales Floor,
- storage,
- Catchmon support,
- one expedition slot/Hub,
- one visible shop expansion.

## DOCUMENT 15 DOES NOT SILENTLY REPLACE EITHER SCOPE

Instead, implementation uses:

### TRACK A — PLAYABLE POLISHED SLICE
The actual player-facing slice.  
Two station families are physically represented and fully polished.

### TRACK B — HEADLESS CONTENT-SCALE HARNESS
A data/simulation validation proving that the same architecture can support:
- 4–5 station archetypes,
- 18–28 products,
- all seven product families.

Track B does **not** require all those station families to be visually present in the polished Shop scene.

If later product testing shows all 4–5 stations must be player-facing inside the final slice, that becomes an explicit content/UX revision rather than an accidental scope expansion.

---

# 5. PLAYABLE SLICE CONTENT BUDGET

The initial player-facing implementation should use only enough real/slice content to exercise every core relationship.

## START REGION

**Vulkankrater / Fire**

This follows Document 10's working starting-region assumption.

No legacy Funken unlock values are used.

## SECOND REGION

Use one contrasting region only as a limited preview / next-step proof.

Recommended implementation choice:

**Ozean / Water**

Reason:
- visually distinct from Fire,
- economically distinct,
- easy to understand,
- useful for testing region switching and cross-region structure.

This does **not** lock Ozean as the final second region of the full game.

## CATCHMONS

Playable slice:
- approximately 4–8 canonical existing Catchmons,
- selected from `reference/catchmons/`,
- enough to test different sizes/elements/domains,
- at least one evolution-capable line if canonical data supports it.

**Claude must not invent Catchmon names or identities.**

The exact IDs are selected during the Slice Content Manifest task after auditing the canonical 104 references.

## PLAYER-FACING STATIONS

- Provision Station
- Fieldworks Bench

These create a strong bridge between:
- normal shop production,
- Provisions,
- Field Gear,
- expedition preparation.

## PROTOTYPE PRODUCTS

Early implementation:
- 5 provisional/slice products.

Later slice content lock:
- expand only to the approved player-facing subset.

## SCALE HARNESS PRODUCTS

Synthetic/content-validation definitions:
- 18–28 products,
- all seven families,
- 4–5 station archetypes.

These may use explicit `vs_scale_*` IDs and placeholder assets until content is approved.

## MATERIALS

Playable:
- 4–8 routine materials by the polished slice,
- 2–4 special components.

Earliest prototype:
- 2 routine materials,
- 1 special component.

## CUSTOMERS

Polished slice:
- 3 normal functional/visual archetypes,
- 1 Special Visitor.

## DISPLAYS

- 3 active Display slots.

## EXPEDITIONS

- 1 concurrent Expedition slot.
- Supply Run.
- Discovery Survey.
- one Component Hunt or equivalent specialized route after initial expedition learning.

## SHOP GROWTH

- 2–3 meaningful infrastructure upgrades.
- 1 visible macro shop improvement.

---

# 6. VERTICAL SLICE PLAYABLE JOURNEY

The final acceptance build must support a coherent journey similar to:

```text
NEW GAME
↓
Starter Shop loads
↓
Craft first Provision
↓
Stock Display
↓
Customer requests product
↓
Standard Sale
↓
Earn Coins + Shop Rank progress
↓
Learn Momentum
↓
Favorable Deal
↓
Premium Pitch
↓
Recommend
↓
Buy useful shop upgrade
↓
Assign first Catchmon
↓
Catchmon visibly changes shop/crafting behavior
↓
Unlock Expedition Hub
↓
Craft / prepare Field Gear
↓
Open World
↓
Select Vulkankrater route
↓
Choose Lead
↓
Prepare loadout
↓
Start Expedition
↓
Close/reload/advance time
↓
Expedition resolves exactly once
↓
Receive resources / Trace / Encounter
↓
Capture screen
↓
Use Capture Aid or attempt directly
↓
Success or protected failure
↓
Return to shop
↓
New Catchmon / world result affects future choices
↓
Shop visibly expands
```

The precise tutorial pacing is tuned later.

The system relationships must exist.

---

# 7. IMPLEMENTATION PHILOSOPHY

Build in this order:

> **INVARIANTS → HEADLESS RULES → PERSISTENCE → DOM UX → SPATIAL SCENE → FINAL ASSETS → POLISH**

Never reverse this into:

> art scene → buttons → hidden business logic.

---

# 8. IMPLEMENTATION RULE — ONE TASK, ONE COHERENT RESPONSIBILITY

Each Claude task below should generally be issued separately.

Claude should not receive:

> “Implement Phase 0 through Phase 5.”

Instead:

> Task 02.3 only.

This improves:
- context accuracy,
- token efficiency,
- test coverage,
- rollback safety.

---

# 9. REQUIRED CLAUDE TASK HEADER

Every Claude Code prompt should begin with:

```text
TASK ID:
OBJECTIVE:

READ FIRST:
1. CLAUDE.md
2. docs/00_PROJECT_INDEX.md
3. <listed owner documents/sections>
4. relevant existing code only

DO NOT:
- expand scope
- invent missing gameplay
- import legacy gameplay
- duplicate canonical data
- add dependencies without architectural need

WHEN COMPLETE:
- run required checks
- report files changed
- report tests
- report provisional assumptions
- report design gaps
```

---

# 10. REQUIRED COMPLETION REPORT

Claude must end every task with:

```text
IMPLEMENTED
- ...

FILES
- ...

TESTS
- ...

CANONICAL DATA ADDED/CHANGED
- ...

PROVISIONAL VALUES
- ...

DESIGN GAPS / BLOCKERS
- ...

OUT OF SCOPE LEFT UNCHANGED
- ...
```

This keeps future context cheap and auditable.

---

# 11. GLOBAL STOP CONDITIONS

Claude must stop the current task and report instead of inventing if:

- required Catchmon ID cannot be found,
- design documents conflict materially,
- a formula requires an unapproved rule,
- a new currency appears necessary,
- a legacy mechanic seems required,
- an asset path is unknown,
- a canonical registry owner is unclear,
- implementing the task would require broad architectural changes.

Temporary implementation values are allowed only where Document 14 permits:
- centrally configured,
- explicitly `PROVISIONAL`,
- not hidden in UI code.

---

# 12. PHASE MAP

```text
PHASE 0  — Repository Bootstrap
PHASE 1  — Technical Kernel
PHASE 2  — Persistence & Time Foundation
PHASE 3  — Economy / Inventory / Crafting
PHASE 4  — Selling / Customers / Momentum
PHASE 5  — Catchmon Integration
PHASE 6  — World / Expeditions / Capture
PHASE 7  — Progression / Infrastructure
PHASE 8  — React UX
PHASE 9  — Pixi Living Shop
PHASE 10 — Assets / Art Integration
PHASE 11 — Scale Validation
PHASE 12 — Hardening / Mobile / Accessibility
PHASE 13 — Vertical Slice Exit Gate
```

---

# 13. IMPLEMENTATION MILESTONES

## M0 — BOOTS
Application installs, checks, builds.

## M1 — HEADLESS SHOP
Craft/sell loop works through tests/dev harness.

## M2 — DURABLE SHOP
Save/reload/offline works.

## M3 — CATCHMON SHOP
Assignment/effects work.

## M4 — WORLD LOOP
Expedition/capture works.

## M5 — DOM PLAYABLE
Whole loop playable through React.

## M6 — LIVING SHOP
Pixi scene drives spatial Shop interaction.

## M7 — VISUAL SLICE
Golden assets integrated.

## M8 — SCALE PROVEN
Content architecture passes 18–28-product / 4–5-station harness.

## M9 — EXIT GATE
Slice is stable enough to authorize broader production.

---

# 14. PHASE 0 — REPOSITORY BOOTSTRAP

Goal:

> Create a clean technical foundation without implementing gameplay.

No gameplay feature is considered complete in Phase 0.

---

# 15. TASK 00.1 — IMPLEMENTATION PHASE ACTIVATION

**Objective:** Mark the repository as entering controlled Vertical Slice implementation.

**Read:**
- `CLAUDE.md`
- `docs/00_PROJECT_INDEX.md`
- Document 15 only.

**Actions:**
- add Document 15 to Project Index,
- set current phase to `VERTICAL SLICE IMPLEMENTATION`,
- state that full-game production is not authorized,
- ensure docs 01–15 are indexed,
- correct any known Project Index relative-path mistakes if still present.

**Expected files:**
- `docs/00_PROJECT_INDEX.md`

**Acceptance:**
- Claude can identify current phase from index.
- Document ownership remains explicit.

**Do not:**
- modify game design.
- create source code.

---

# 16. TASK 00.2 — PACKAGE / TOOLING BOOTSTRAP

**Objective:** Create the approved TypeScript web application skeleton.

**Read:**
- Document 14 sections: stack, package manager, TypeScript mode, CI scripts.

**Create:**
- `package.json`
- lockfile
- `tsconfig*.json`
- Vite configuration
- React bootstrap
- ESLint/format config
- minimal test config
- minimal Playwright config if practical now
- Node version pin

**Approved stack:**
- Node 24 LTS line
- TypeScript
- React
- Vite
- React Router
- Zustand
- Zod
- Dexie
- PixiJS
- Vitest
- React Testing Library
- Playwright

**Acceptance commands:**
```text
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

**Do not:**
- implement game rules,
- install Tailwind,
- install Redux,
- install second schema/state/rendering frameworks.

---

# 17. TASK 00.3 — SOURCE LAYER SCAFFOLD

**Objective:** Create architecture folders and enforce dependency intent.

**Read:**
- Document 14: layer model, source tree, forbidden dependencies.

**Create scaffold:**
```text
src/core/
src/domain/
src/content/
src/application/
src/infrastructure/
src/presentation/
src/app/
src/test/
```

Also:
- small public entry points where justified,
- import-boundary lint configuration if feasible.

**Acceptance:**
- app still boots,
- domain can compile without browser imports,
- test demonstrates a pure domain module can run in Vitest.

**Do not:**
- create giant `game.ts`,
- create giant Zustand game logic store.

---

# 18. TASK 00.4 — DESIGN SYSTEM WIRING

**Objective:** Wire canonical design references into the new app without copying values.

**Read:**
- `reference/design-system/`
- Document 11 relevant UI rules
- Document 12 token/icon rules
- Document 14 CSS architecture.

**Actions:**
- expose/copy approved token sources into active app location only as required,
- document provenance,
- import global tokens once,
- create minimal app shell using tokens,
- connect existing shared icons through one canonical adapter/registry.

**Acceptance:**
- no hardcoded replacement palette,
- no duplicate spacing system,
- no emoji production icon,
- app shell renders with canonical tokens.

---

# 19. TASK 00.5 — LEGACY LEAK GUARD

**Objective:** Add automated protection against accidental old-system reintroduction.

**Read:**
- `CLAUDE.md`
- Document 14 legacy leak sections.

**Create:**
- lightweight script/test checking active `src/` for suspicious prohibited legacy terms/paths,
- allow explicit technical/reference exceptions only where documented.

**Watch terms:**
```text
funken
sparksThreshold
harvest
prestige
```

**Acceptance:**
- guard fails on an intentionally inserted prohibited active-gameplay fixture,
- docs/reference files are not naively treated as active implementation.

---

# 20. PHASE 0 EXIT GATE

Do not begin gameplay implementation until:

- clean install succeeds,
- typecheck succeeds,
- lint succeeds,
- tests succeed,
- build succeeds,
- architecture folders exist,
- design tokens are wired,
- legacy guard exists.

---

# 21. PHASE 1 — TECHNICAL KERNEL

Goal:

> Build the headless primitives every later system depends on.

---

# 22. TASK 01.1 — BRANDED IDS + RESULT + ASSERTIONS

**Read:**
- Document 14: branded IDs, error model, Result type.

**Implement:**
- `Brand`
- canonical initial ID types
- `Result<T,E>`
- invariant/assert helpers
- safe exhaustive-switch helper

**Initial IDs:**
- ProductId
- RecipeId
- ItemId
- StationId
- CatchmonSpeciesId
- CatchmonLineId
- OwnedCatchmonId if needed
- RegionId
- RouteId
- AssetId
- CustomerId
- ExpeditionId
- ReservationId
- InfrastructureId
- UnlockRuleId

**Tests:**
- runtime helper tests where applicable,
- compile-time intent preserved through TypeScript.

**Do not:**
- encode actual content yet.

---

# 23. TASK 01.2 — FIXED-POINT / MONEY / PROBABILITY MATH

**Read:**
- Document 14 numeric representation.
- Document 03 economy principles.

**Implement canonical helpers:**
- safe Coin add/subtract
- basis-point apply
- probability clamp
- fixed rounding
- duration helpers

**Tests:**
- 0%
- 100%
- rounding boundaries
- safe negative rejection
- large safe integers

**Do not:**
- insert actual product prices.

---

# 24. TASK 01.3 — CLOCK ABSTRACTION

**Implement:**
```text
Clock
SystemClock
FakeClock
```

**Tests:**
- deterministic time advance.

**Rule:**
No domain/application code introduced from this point onward may call `Date.now()` directly.

---

# 25. TASK 01.4 — SEEDED RNG

**Objective:** Lock one reproducible non-cryptographic PRNG implementation.

**Read:**
- Document 14 RNG architecture.

**Implement:**
- `RandomSource`
- chosen documented seeded PRNG
- random event sub-seed derivation
- basis-point roll helper
- fixed-vector tests

**Requirement:**
Create a short ADR for the selected PRNG algorithm because this affects save reproducibility.

**Tests:**
- identical seed = identical sequence,
- different event counter changes sequence,
- probability edge cases.

---

# 26. TASK 01.5 — CONTENT DOMAIN TYPES

**Objective:** Define schema types before creating content.

**Read:**
- Documents 04, 06, 07, 09, 10, 13, 14 relevant registry sections.

**Define minimal types for:**
- Element
- Product
- Recipe
- Resource
- Component
- Catchmon Species
- Evolution Line
- Capability
- Region
- Route
- Customer Archetype
- Infrastructure
- Asset metadata

**Do not:**
- create all final rows,
- invent 104 capabilities.

---

# 27. TASK 01.6 — CATALOG / REGISTRY INFRASTRUCTURE

**Implement:**
- typed registries,
- duplicate-ID validation,
- cross-reference validation,
- central `GameCatalog` read model.

**Tests:**
- duplicate rejected,
- unknown references rejected.

---

# 28. TASK 01.7 — SLICE CONTENT MANIFEST

**Objective:** Create one explicit file that controls which canonical/synthetic content belongs to the vertical slice.

**Important:** This prevents Claude from opportunistically using random Catchmons or content.

**Create conceptually:**
```text
content/vertical-slice/verticalSliceManifest.ts
```

Manifest includes:
- start region ID,
- preview region ID,
- selected Catchmon IDs,
- playable station IDs,
- playable product IDs,
- playable route IDs,
- feature flags.

**Catchmon selection process:**
1. inspect canonical 104 reference,
2. select 4–8 real IDs,
3. record why each is selected,
4. do not alter canonical identity.

If exact gameplay capability for a selected Catchmon is not yet approved:
- reference the Catchmon,
- use a clearly provisional slice-only capability mapping,
- record it separately,
- do not mutate canonical species identity.

**Acceptance:**
All slice breadth flows through this manifest.

---

# 29. TASK 01.8 — GAMESTATE V1 FACTORY

**Read:**
- Document 14 GameState sections.
- Document 09 progression.
- Documents 02–08 mutable-state needs.

**Implement:**
- serializable GameState v1
- state slice interfaces
- metadata
- initial-state factory
- invariant validator

**Initial factory must receive:**
- catalog
- clock
- root seed

**Do not:**
- hardcode starter content inside React.

---

# 30. TASK 01.9 — COMMAND ENGINE SKELETON

**Implement:**
- typed command envelope
- serial command execution
- command result
- domain event collection
- no-op/in-memory persistence port
- committed state publication

**Acceptance:**
A test command can transform a test state deterministically.

---

# 31. PHASE 1 EXIT GATE

Must prove:

- pure domain code runs without DOM,
- IDs are typed,
- time is injectable,
- RNG is reproducible,
- GameState serializes,
- content validates,
- commands transform state atomically.

---

# 32. PHASE 2 — PERSISTENCE & TIME FOUNDATION

Goal:

> Make durable state and offline reconciliation architectural realities before too much gameplay depends on ad-hoc state.

---

# 33. TASK 02.1 — DEXIE SAVE REPOSITORY

**Read:**
- Document 14 persistence sections.

**Implement:**
- Dexie DB,
- save table,
- backup table,
- preferences only if needed,
- `SaveRepository` adapter.

**Do not:**
- split every domain into separate tables.

---

# 34. TASK 02.2 — SAVE ENVELOPE + ZOD VALIDATION

**Implement:**
- schemaVersion
- appVersion
- contentVersion
- revision
- savedAt
- GameState payload
- Zod load validation

**Tests:**
- valid save round-trip,
- malformed save rejected.

---

# 35. TASK 02.3 — MIGRATION PIPELINE V1

**Implement:**
- sequential migration framework,
- first fixture,
- migration test harness.

Even if only v1 exists now, structure must exist before durable expansion.

---

# 36. TASK 02.4 — BACKUP + STALE WRITE PROTECTION

**Implement:**
- current snapshot,
- previous known-good snapshot,
- monotonic revision check,
- stale async commit rejection.

**Tests:**
- older write cannot overwrite newer revision,
- fallback backup loads after corrupted current fixture.

---

# 37. TASK 02.5 — RECONCILIATION FRAMEWORK

**Implement:**
```text
reconcileGameState(state, now, catalog)
```

At first it may have no feature-specific work.

It must provide:
- deterministic pass ordering,
- idempotency expectation,
- reconciliation report/events.

---

# 38. TASK 02.6 — BROWSER LIFECYCLE ADAPTER

**Implement one platform service for:**
- visibility change,
- page hide/show,
- resume,
- viewport hooks where needed.

Use it to:
- reconcile on resume,
- flush save where appropriate.

No feature subscribes to browser lifecycle independently.

---

# 39. PHASE 2 EXIT GATE

Must prove:

```text
create save
→ persist
→ reload
→ validate
→ reconcile
→ expose identical logical state
```

with no React dependency in the save/reconciliation engine.

---

# 40. PHASE 3 — ECONOMY / INVENTORY / CRAFTING

Goal:

> Produce the first meaningful headless Catchmon Shop loop.

---

# 41. TASK 03.1 — COIN ECONOMY STATE

**Read:**
- Document 03.
- Document 14 economy architecture.

**Implement:**
- Coin state,
- atomic debit/credit,
- typed insufficient-funds errors.

**Values:**
Use central provisional balance values only where required.

---

# 42. TASK 03.2 — INVENTORY + RESERVATION LEDGER

**Read:**
- Documents 03, 04, 07, 11, 14.

**Implement:**
- inventory stacks,
- product quality stacks,
- reservation ledger,
- available quantity queries,
- atomic reserve/release/consume/add.

**Tests:**
- double reservation blocked,
- quantity never negative,
- reservation owner isolation,
- release restores availability.

---

# 43. TASK 03.3 — EARLY SLICE RESOURCE / PRODUCT CONTENT

**Objective:** Create only the minimal headless product dataset needed to exercise crafting.

**Create provisional slice content:**
- 2 routine materials,
- 1 special component definition,
- 5 product/recipe definitions,
- 2 station definitions.

**Rules:**
- `vs_`/explicit provisional IDs allowed,
- all values centralized,
- no claim of final product naming,
- no mass content.

**Read:**
- Documents 03–04.
- Document 15 slice scope.

---

# 44. TASK 03.4 — STATION / CRAFT COMMANDS

**Implement commands:**
- Start Craft
- Queue Craft
- Cancel queued craft
- collect/protect completed output as required

**Rules:**
- inputs reserve/consume correctly,
- one active craft,
- bounded queue,
- station capability validated.

---

# 45. TASK 03.5 — CRAFT TIMESTAMP MODEL

**Implement:**
- startedAt
- completesAt
- snapshotted duration
- support-effect snapshot placeholder.

No countdown mutation.

---

# 46. TASK 03.6 — OFFLINE CRAFT QUEUE RECONCILIATION

**Implement:**
- complete active craft,
- historical queue progression,
- storage blocking,
- protected output,
- idempotent repeated reconciliation.

**Tests:**
- one craft,
- multiple queue entries,
- exact boundary timestamp,
- full storage,
- repeated reconciliation.

---

# 47. TASK 03.7 — RECIPE / CRAFT QUERIES

Implement canonical queries:
- canCraft
- missingIngredients
- estimatedCompletion
- currentQueue
- product output preview
- mastery placeholder hook where needed.

React will later consume these.

---

# 48. TASK 03.8 — CRAFTING DEV HARNESS

Create a dev-only/headless harness showing:

- inventory,
- recipes,
- queue,
- fake time advance.

Purpose:
prove crafting without final UI.

---

# 49. PHASE 3 EXIT GATE — M1 HEADLESS SHOP PRODUCTION

Must support headlessly:

```text
materials
→ craft
→ time advance
→ product output
```

through actual Game Engine commands and reconciliation.

No UI math.

---

# 50. PHASE 4 — SELLING / CUSTOMERS / MOMENTUM

Goal:

> Complete the active shop-commerce half of the core loop.

---

# 51. TASK 04.1 — DISPLAY ALLOCATION

**Read:**
- Documents 02, 05, 08, 11, 14.

**Implement:**
- 3 slice Display slots,
- stock/assignment rules,
- display inventory reservation/allocation,
- change product,
- stock visibility.

**Do not:**
- implement physical Pixi display yet.

---

# 52. TASK 04.2 — CUSTOMER ARCHETYPE + INSTANCE STATE

**Implement:**
- minimal slice archetypes,
- active customer instance,
- deterministic request generation,
- persisted generated request.

Earliest slice may use:
- Everyday buyer,
- Explorer/Focused buyer,
- one Special Visitor placeholder profile.

---

# 53. TASK 04.3 — ACTIVE CUSTOMER ARRIVAL SERVICE

**Implement:**
- active-session arrival scheduling from timestamps,
- bounded customer capacity,
- no offline backlog generation.

**Tests:**
- no duplicate arrivals after reload,
- no mass catch-up customers.

---

# 54. TASK 04.4 — TRANSACTION QUOTE ENGINE

**Implement one canonical query returning:**
- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend candidates.

It must include:
- final Coins,
- Momentum gain/cost,
- eligibility,
- disabled reason.

---

# 55. TASK 04.5 — STANDARD SALE

**Implement command:**
- validate request,
- consume display/product stock,
- credit Coins,
- award initial Shop Rank hook,
- resolve customer,
- emit domain event.

---

# 56. TASK 04.6 — SHOP MOMENTUM

**Implement:**
- durable capped Momentum,
- gain/spend helpers,
- central balance,
- no Coin conversion,
- no close-app reset.

---

# 57. TASK 04.7 — FAVORABLE DEAL

Implement:
- lower immediate Coins,
- meaningfully higher Momentum,
- value-aware anti-cheap-item exploit scaling.

Exact numeric tuning remains provisional/central.

---

# 58. TASK 04.8 — PREMIUM PITCH

Implement:
- Momentum cost,
- deterministic improved sale value,
- readable eligibility,
- no hidden failure roll.

---

# 59. TASK 04.9 — RECOMMEND

Implement:
- only compatible displayed alternatives,
- configurable compatibility rules,
- no arbitrary inventory redirect,
- final quote before command.

---

# 60. TASK 04.10 — DECLINE / CUSTOMER EXIT

Implement:
- opportunity-cost-only resolution,
- no harsh reputation punishment unless explicitly defined later.

---

# 61. TASK 04.11 — WORKSHOP PUSH

Connect Momentum to active craft:
- spend Momentum,
- advance active craft,
- bounded by design,
- timestamp-safe.

---

# 62. TASK 04.12 — SIMPLE EVERYDAY ORDER

**Read:**
- Documents 05 and 09.

Implement one simple order layer:
- available order,
- accept,
- requested product/quantity,
- completion,
- reward.

No complex commission system yet.

---

# 63. PHASE 4 EXIT GATE — COMPLETE HEADLESS SHOP LOOP

Through dev harness/tests:

```text
craft
→ stock
→ customer
→ Standard/Favorable/Premium/Recommend
→ Coins/Momentum
→ reinvest hook
```

must work.

This is the first major gameplay checkpoint.

If this loop is not strategically understandable:

> do not move complexity forward to World systems to “make it more fun.”

Fix the shop loop first.

---

# 64. PHASE 5 — CATCHMON GAMEPLAY INTEGRATION

Goal:

> Prove Catchmons materially alter the shop without becoming generic stat cards.

---

# 65. TASK 05.1 — CANONICAL CATCHMON REFERENCE AUDIT ADAPTER

**Read:**
- canonical 104 references,
- Documents 06, 10, 13.

Create a normalization/import adapter for the selected slice Catchmons.

Do not copy old gameplay data.

For each selected slice Catchmon capture:
- canonical ID,
- name,
- element,
- evolution line/stage if known,
- asset reference.

---

# 66. TASK 05.2 — SLICE CATCHMON SELECTION LOCK

Update the Vertical Slice Manifest with 4–8 actual canonical Catchmon IDs.

Selection criteria:
- at least two elements,
- varied visual sizes,
- supports Workshop,
- supports Shop Floor,
- supports Expedition,
- one additional strategic contrast,
- evolution representation if possible.

**Important:**
Gameplay role mapping can be provisional slice configuration if the final 104 mapping is not yet authored.

It must be stored separately from canonical species identity.

---

# 67. TASK 05.3 — OWNED CATCHMON STATE

Implement:
- owned identity/progression state,
- current stage,
- level/xp,
- favorite if desired,
- current assignment.

No duplicated canonical definitions in save.

---

# 68. TASK 05.4 — TYPED CAPABILITY EFFECT PRIMITIVES

Implement only the effect primitives actually needed by the selected slice Catchmons.

Likely examples:
- targeted craft speed,
- customer/Momentum interaction,
- expedition discovery/reward support.

Do not implement every hypothetical capability from Document 06.

---

# 69. TASK 05.5 — CATCHMON ASSIGNMENT ENGINE

Implement:
- Unassigned,
- Workshop,
- Shop Floor,
- Supply if needed in slice,
- Expedition.

Enforce:
- one duty at a time,
- eligibility,
- safe reassignment.

---

# 70. TASK 05.6 — WORKSHOP CATCHMON EFFECT

Connect one selected Catchmon to crafting through canonical effect evaluation.

Acceptance:
- same recipe produces different derived duration/opportunity when eligible Catchmon is assigned,
- base recipe definition remains unchanged.

---

# 71. TASK 05.7 — SHOP FLOOR CATCHMON EFFECT

Connect one selected Catchmon to customers/Momentum/Recommend or another approved shop-floor hook.

Acceptance:
- strategic effect is visible in quote/query output,
- not a passive free-money printer.

---

# 72. TASK 05.8 — CATCHMON XP

Implement:
- relevant activity XP events,
- fast early progression profile,
- central provisional curve,
- no manual skill points.

---

# 73. TASK 05.9 — EVOLUTION SHELL

Implement only if a selected canonical line supports evolution.

Needs:
- requirement query,
- evolution command,
- stage update,
- collection update,
- capability transition hook.

If the selected Catchmons do not provide safe canonical evolution data:
- keep evolution architecture/tests,
- do not invent a fake canonical evolution.

---

# 74. PHASE 5 EXIT GATE — M3 CATCHMON SHOP

Must prove:

- Catchmons are canonical entities,
- one can be assigned,
- shop strategy changes,
- XP develops through use,
- assignment is not duplicated,
- no old team system exists.

---

# 75. PHASE 6 — WORLD / EXPEDITIONS / DISCOVERY / CAPTURE

Goal:

> Complete the external loop and connect it back to the shop.

---

# 76. TASK 06.1 — REGION DEFINITIONS FOR SLICE

**Read:**
- Documents 07, 09, 10.
- canonical region identity reference.

Implement:
- Vulkankrater active definition,
- Ozean limited preview definition,
- no legacy Funken fields.

Use only the needed new Catchmon Shop fields.

---

# 77. TASK 06.2 — ROUTE DEFINITIONS

Create minimal route content:
- Vulkankrater Supply Run,
- Vulkankrater Discovery Survey,
- one Component Hunt or advanced route,
- optional Ozean preview route.

All numeric values:
- central provisional balance.

---

# 78. TASK 06.3 — EXPEDITION PLANNING QUERIES

Implement:
- available routes,
- Lead eligibility,
- Support eligibility,
- route fit,
- loadout compatibility,
- preparation slots,
- duration/reward preview.

No universal team Power score.

---

# 79. TASK 06.4 — EXPEDITION START COMMAND

Atomic:
- validate route,
- validate Lead/Supports,
- reserve/consume loadout,
- assign Catchmons,
- snapshot effects,
- set completion timestamp,
- snapshot result seed.

---

# 80. TASK 06.5 — EXPEDITION RECONCILIATION

Implement exactly-once completion.

Must:
- resolve elapsed route,
- create durable result,
- release Catchmons,
- award XP once,
- preserve result.

---

# 81. TASK 06.6 — ROUTINE + SPECIAL REWARDS

Implement:
- routine materials,
- special component opportunity,
- deterministic weighted result,
- bad-luck protection only where approved/needed.

No direct huge Coin payout.

---

# 82. TASK 06.7 — DISCOVERY STATE MACHINE

Implement:
```text
UNKNOWN
→ TRACED
→ ENCOUNTERED
→ OWNED
```

Evolution stages remain connected to owned progression.

Tests:
- legal transitions,
- no backwards accidental transition.

---

# 83. TASK 06.8 — ENCOUNTER CREATION

An expedition can create one durable Encounter Opportunity.

Store:
- encounter ID,
- target Catchmon line/species,
- capture context,
- protection context,
- resolved flag/state.

Reload must not reroll species.

---

# 84. TASK 06.9 — CAPTURE CHANCE QUERY

Implement:
- base difficulty profile,
- selected Catchmon/team effects,
- Capture Aid preview,
- protection,
- clamp.

Return final visible probability.

No UI calculation.

---

# 85. TASK 06.10 — CAPTURE AID RESERVATION / CONSUMPTION

Implement:
- aid reserved with expedition/loadout,
- consumed only when actually used,
- unused aid released/retained as approved.

---

# 86. TASK 06.11 — CAPTURE RESOLUTION

Implement:
- deterministic random event,
- success,
- failure,
- protection update,
- owned Catchmon creation on success,
- no duplicate worker,
- exactly-once encounter resolution.

---

# 87. TASK 06.12 — FAILED-CAPTURE RECOVERY QUERY

Return presentation-ready facts:
- what was consumed,
- retained Encountered state,
- protection progress,
- how target can be pursued again.

---

# 88. PHASE 6 EXIT GATE — M4 WORLD LOOP

Headlessly prove:

```text
prepare
→ expedition
→ offline time
→ result exactly once
→ trace/encounter
→ capture
→ collection update
→ new Catchmon available
```

Reload at every major boundary during tests.

---

# 89. PHASE 7 — PROGRESSION / INFRASTRUCTURE

Goal:

> Make the slice feel like a growing game rather than a disconnected sandbox.

---

# 90. TASK 07.1 — SHOP RANK CORE

Implement:
- one non-spendable global Shop Rank progression state,
- normalized contribution hooks,
- nearby milestone query.

Do not create Reputation + Merchant Level duplicates.

---

# 91. TASK 07.2 — SLICE UNLOCK RULES

Data-drive the slice introduction order:

- Standard Sale
- Momentum
- Favorable Deal
- Premium Pitch
- Recommend
- first Order
- Catchmon assignment
- Expedition Hub
- first World route

Exact thresholds:
- provisional central config.

---

# 92. TASK 07.3 — INFRASTRUCTURE PURCHASE ENGINE

Implement 2–3 slice upgrades such as:
- display capacity/state,
- production capability/slot,
- storage,
- Expedition Hub unlock.

Use actual approved slice needs.

Do not implement the full infrastructure catalog.

---

# 93. TASK 07.4 — CONSTRUCTION TIMESTAMP SUPPORT

If one slice upgrade uses construction time:
- snapshot,
- timestamp,
- offline completion,
- existing functionality retained.

If testing does not need construction time yet:
- architecture can exist with instant provisional slice upgrade.

Do not invent builder slots.

---

# 94. TASK 07.5 — VISIBLE SHOP MACRO STATE

Game state derives a shop visual stage:

```text
STARTER
EXPANDED
```

from approved progression/infrastructure milestone.

Pixi integration comes later.

---

# 95. TASK 07.6 — CONTEXTUAL GOAL QUERY

Implement one selector exposing:
- current primary goal,
- next meaningful milestone.

No giant quest system.

---

# 96. PHASE 7 EXIT GATE

Player state can meaningfully move from:

> starter shop

to:

> expanded shop with Catchmon + World capability.

---

# 97. PHASE 8 — REACT UX

Goal:

> Make the whole vertical slice playable without depending on Pixi polish.

This is intentionally before the final living scene.

---

# 98. TASK 08.1 — APPLICATION PROVIDERS / STORES

Implement:
- Game Engine provider/service,
- thin Zustand Game Store bridge,
- UI Store,
- selector hooks.

No game formulas in stores.

---

# 99. TASK 08.2 — THREE-DESTINATION ROUTER

Implement primary destinations:

```text
/shop
/catchmons
/world
```

Bottom navigation:
- Shop
- Catchmons
- World

Preserve local tab context where practical.

---

# 100. TASK 08.3 — SHARED HUD / UTILITY

Implement:
- Coins,
- Shop Rank compact state,
- Inventory access,
- appropriate Momentum display on Shop.

No currency clutter.

---

# 101. TASK 08.4 — DOM SHOP OPERATION SCREEN

Before Pixi, implement a functional spatial-ish/zone-card fallback exposing:
- Displays,
- Stations,
- Customers,
- Expedition Hub state.

Purpose:
complete gameplay before scene renderer.

---

# 102. TASK 08.5 — CUSTOMER TRANSACTION SHEET

Implement per Document 11:
- request,
- final values,
- Standard,
- Favorable,
- Premium,
- Recommend,
- Decline,
- disabled reasons.

Use Game Engine commands only.

---

# 103. TASK 08.6 — DISPLAY SHEET

Implement:
- current product,
- stock,
- change product,
- restock/allocation,
- demand hint where available.

---

# 104. TASK 08.7 — QUICK STATION SHEET

Implement:
- current craft,
- timer,
- queue,
- ready output,
- recent/quick recipes,
- assigned Catchmon,
- Workshop Push.

---

# 105. TASK 08.8 — RECIPE WORKSPACE

Implement:
- craftable/locked,
- time,
- key inputs,
- family,
- mastery/quality hooks,
- filtering needed by slice.

Do not build the entire final catalog UI.

---

# 106. TASK 08.9 — INVENTORY WORKSPACE

Implement:
- Products,
- Materials,
- Components,
- Gear/use items,
- reserved state,
- source/use links where slice data supports them.

---

# 107. TASK 08.10 — ORDERS WORKSPACE

Implement simple:
- available,
- active,
- progress,
- completion.

No deep Commission UX yet.

---

# 108. TASK 08.11 — CATCHMON ROSTER

Implement:
- owned Roster,
- role/domain,
- assignment,
- level,
- element,
- canonical art.

No universal Power score.

---

# 109. TASK 08.12 — CATCHDEX MODE

Implement slice-visible discovery states:
- Unknown/Traced/Encountered/Owned.

Do not require all 104 detailed entries if the full canonical registry is not normalized yet.

Architecture must support eventual scale.

---

# 110. TASK 08.13 — CATCHMON DETAIL / ASSIGNMENT

Implement:
- core capability,
- current assignment,
- assign/reassign,
- XP/next milestone,
- evolution state if implemented.

---

# 111. TASK 08.14 — WORLD MAP DOM VERSION

Implement:
- Vulkankrater,
- Ozean preview,
- active/result markers,
- no 17-button grid.

This is functional UX before final world art.

---

# 112. TASK 08.15 — REGION / ROUTE WORKSPACE

Implement:
- region identity summary,
- routes,
- duration,
- reward category,
- encounter potential,
- fit.

---

# 113. TASK 08.16 — EXPEDITION PLANNING SCREEN

Implement:
- route,
- Lead,
- Supports,
- Gear,
- reserve state,
- final review,
- Start.

---

# 114. TASK 08.17 — EXPEDITION RESULT SCREEN

Prioritize:
1. Encounter/Trace
2. Component
3. routine material.

No loot explosion.

---

# 115. TASK 08.18 — ENCOUNTER / CAPTURE SCREEN

Implement:
- Catchmon,
- state,
- capture chance,
- aid selection,
- preview,
- attempt,
- success/failure.

No Coin retry.

---

# 116. TASK 08.19 — EVOLUTION PRESENTATION

If evolution is active:
- focused screen/overlay,
- before/after,
- capability change,
- return to detail.

If not safely supported by selected canonical content:
- leave this task gated.

---

# 117. TASK 08.20 — CONTEXTUAL ONBOARDING

Implement only the slice's just-in-time tutorial steps.

No tutorial encyclopedia.

---

# 118. PHASE 8 EXIT GATE — M5 DOM PLAYABLE

A tester must be able to complete the entire slice loop through React DOM without PixiJS.

This is a crucial stop gate.

If gameplay is not understandable here:

> do not use a prettier scene to hide UX/gameplay problems.

---

# 119. PHASE 9 — PIXI LIVING SHOP

Goal:

> Replace the functional Shop fallback presentation with the approved living 2.5D shop while keeping all existing domain/UI behavior.

---

# 120. TASK 09.1 — PIXI SHOP SCENE HOST

Implement:
- React canvas host,
- Pixi lifecycle adapter,
- logical coordinate space,
- responsive scaling,
- DPR cap configuration.

No game state inside Pixi.

---

# 121. TASK 09.2 — SHOP SCENE VIEW MODEL

Create pure presentation selector mapping:
- shop visual stage,
- stations,
- displays,
- customers,
- Catchmons,
- Hub,
- readiness markers.

Test it headlessly.

---

# 122. TASK 09.3 — PLACEHOLDER ENVIRONMENT LAYERS

Use neutral placeholder assets/shapes to prove:
- background,
- midground,
- foreground,
- zone placement,
- mobile hit areas.

No final art required.

---

# 123. TASK 09.4 — STATION SCENE ENTITIES

Render:
- Provision Station,
- Fieldworks Bench,
- active/ready state.

Tap emits semantic station selection.

It opens the same existing Quick Station Sheet.

---

# 124. TASK 09.5 — DISPLAY SCENE ENTITIES

Render 3 Displays.

Tap opens existing Display Sheet.

No duplicate display logic in Pixi.

---

# 125. TASK 09.6 — CUSTOMER SCENE ENTITIES

Render active customer instances.

Tap customer opens existing transaction sheet.

Customer scene entity only needs:
- visual state,
- position,
- reaction hooks.

---

# 126. TASK 09.7 — CATCHMON SCENE ENTITIES

Render selected assigned/roaming Catchmons with:
- canonical image,
- normalized scale,
- contact shadow,
- simple idle motion,
- assignment-aware location.

No all-104 rendering.

---

# 127. TASK 09.8 — EXPEDITION HUB ENTITY

Render:
- locked,
- available,
- active,
- result-ready states.

Tap routes to existing World/Hub context.

---

# 128. TASK 09.9 — SCENE EVENT BRIDGE

Map domain/application events to visual effects:
- sale,
- craft ready,
- customer reaction,
- upgrade,
- expedition return.

Routine lost VFX are not durable state.

---

# 129. TASK 09.10 — INTERACTION ACCESSIBILITY FALLBACK

Ensure core scene actions remain reachable without precision canvas tapping.

Possible approach:
- semantic DOM overlays/hotspots,
- accessibility action list,
- robust expanded hit areas.

Validate against Document 11/14 constraints.

---

# 130. PHASE 9 EXIT GATE — M6 LIVING SHOP

The Pixi scene must be a renderer/interface over the existing game.

Proof:

- turning Pixi off still leaves game state correct,
- no business formula lives in Pixi,
- scene taps open existing React workflows,
- mobile interaction is comfortable.

---

# 131. PHASE 10 — ASSETS / ART INTEGRATION

Goal:

> Turn the functional slice into the approved visual direction without triggering full asset production.

---

# 132. TASK 10.1 — ASSET MANIFEST / REGISTRY

Implement:
- AssetId registry,
- Vite-compatible asset resolution,
- placeholder,
- missing-asset validation,
- preload class metadata.

No feature-built paths.

---

# 133. TASK 10.2 — EXISTING ICON AUDIT INTEGRATION

Audit existing canonical icons and create a report:

```text
REUSE
ADAPT
MISSING
```

Do not recreate usable icons.

---

# 134. TASK 10.3 — CATCHMON NORMALIZATION PIPELINE

For slice Catchmons only first:
- clean/normalize source references,
- portrait,
- thumbnail,
- in-world variant metadata,
- focal/ground anchors.

Do not alter creature identity.

---

# 135. TASK 10.4 — GOLDEN SHOP SCENE INTEGRATION

Integrate approved starter-shop Golden Sample/module set.

Check:
- perspective,
- hit areas,
- safe areas,
- contrast,
- scene scale.

---

# 136. TASK 10.5 — GOLDEN STATION INTEGRATION

Integrate polished:
- Provision Station,
- Fieldworks Bench,
- their major relevant states.

Do not generate all 5 station tier sets.

---

# 137. TASK 10.6 — GOLDEN CUSTOMER INTEGRATION

Integrate:
- 3 normal visual archetypes,
- 1 special visitor.

Use shared animation model.

---

# 138. TASK 10.7 — PRODUCT / MATERIAL ICON INTEGRATION

Integrate only approved vertical-slice asset set.

Target for polished slice follows Document 13:
- 18–28 product icons if approved content assets are ready,
- 4–8 routine materials,
- 2–4 components.

If content IDs/assets are not yet approved:
- use canonical placeholders,
- do **not** let Claude invent final products.

---

# 139. TASK 10.8 — REGION VISUAL INTEGRATION

Integrate:
- Vulkankrater production visual,
- Ozean contrast preview.

Full 17-region batch remains blocked.

---

# 140. TASK 10.9 — QUALITY / RARITY / SHINY TREATMENTS

Implement reusable treatments.

Verify:
- Quality ≠ Catchmon Rarity,
- Shiny ≠ power,
- element accent ≠ quality.

---

# 141. TASK 10.10 — CORE VFX

Polish reusable systems for:
- sale,
- Momentum,
- craft completion,
- Fine/Masterwork,
- expedition return,
- Trace,
- capture success/failure,
- evolution if active,
- infrastructure upgrade.

Do not build one VFX per content item.

---

# 142. TASK 10.11 — REDUCED MOTION

Implement reduced-motion variants for high-impact presentation.

---

# 143. PHASE 10 EXIT GATE — M7 VISUAL SLICE

Side-by-side visual review must answer yes:

- Catchmons look grounded,
- UI and scene look like one game,
- products read at mobile size,
- station states read,
- Vulkankrater identity is clear,
- element/UI semantics do not collide,
- actionable state remains more prominent than decoration.

---

# 144. PHASE 11 — SCALE VALIDATION

Goal:

> Prove the architecture can handle intended crafting/content scale without requiring full art/world implementation.

This phase directly satisfies Document 04's larger crafting vertical-slice validation target.

---

# 145. TASK 11.1 — SCALE CONTENT FIXTURE

Create a non-production content fixture containing:

- all 7 product families,
- 4–5 station archetypes,
- 18–28 products,
- several Recipe Ranks,
- dual-use examples,
- mastery/quality metadata,
- one region package.

Use:
- explicit synthetic/test IDs where final content does not exist,
- placeholder assets,
- no claim that these are final products.

---

# 146. TASK 11.2 — RECIPE GRAPH SCALE VALIDATION

Run:
- registry validation,
- recipe graph validation,
- dependency depth validation,
- source/use validation.

No orphan materials.

---

# 147. TASK 11.3 — CRAFTING UI SCALE TEST

Using synthetic data, verify Recipe Workspace remains usable with:
- 18–28 products,
- filters,
- locked/unlocked,
- mastery/quality.

This may be dev-only.

---

# 148. TASK 11.4 — CONTENT PERFORMANCE TEST

Measure:
- catalog boot/validation,
- selectors,
- recipe filtering,
- Inventory views.

18–28 is small, but this tests architecture before 70–100.

---

# 149. TASK 11.5 — SYNTHETIC FULL-CONTENT STRESS FIXTURE

Generate development-only synthetic scale approximating:

- 104 Catchmons,
- 100 products,
- 17 regions,
- route/asset references.

Purpose:
- measure registry/state/UI loading behavior.

Do not create final gameplay content.

---

# 150. TASK 11.6 — ECONOMY SIMULATION

Implement/run seeded simulation for:
- craft,
- sell,
- upgrade,
- time advance.

Output:
- Coin progression,
- time-to-afford,
- inventory bottlenecks,
- Momentum usage.

No UI.

---

# 151. TASK 11.7 — PROGRESSION PERSONA SIMULATION

Run:
- Active Optimizer
- Casual Returner
- Collector
- Shop Builder
- Inefficient Learner

Output:
- milestone timeline,
- blockers,
- softlock risk.

Use provisional slice balance.

---

# 152. PHASE 11 EXIT GATE — M8 SCALE PROVEN

Do not authorize 70–100 real product production until:

- catalog handles scale,
- recipe UI handles scale,
- simulation shows no structural dead end,
- content validation catches broken references,
- no architecture rewrite is required to move from 5 → 28 → 100 products.

---

# 153. PHASE 12 — HARDENING / MOBILE / ACCESSIBILITY

Goal:

> Make the slice reliable enough to judge the product rather than prototype roughness.

---

# 154. TASK 12.1 — MULTI-TAB WRITER LEASE

Implement:
- one active writer,
- BroadcastChannel/lease,
- takeover flow,
- stale revision safety.

Test with two tabs.

---

# 155. TASK 12.2 — SAVE RECOVERY UX

Implement basic safe handling:
- current save invalid,
- previous backup valid,
- fallback,
- diagnostic state.

Never overwrite raw corrupted source before backup.

---

# 156. TASK 12.3 — E2E NEW GAME → SALE

Playwright:
- start fresh,
- craft,
- display,
- Standard Sale,
- persistence.

---

# 157. TASK 12.4 — E2E MOMENTUM LOOP

Test:
- Favorable Deal,
- Momentum,
- Premium Pitch,
- Recommend.

---

# 158. TASK 12.5 — E2E EXPEDITION / RELOAD

Test:
- start expedition,
- reload,
- advance controlled time,
- result resolves once,
- no duplicate reward.

---

# 159. TASK 12.6 — E2E CAPTURE

Test deterministic:
- failure path,
- protection state,
- success path,
- no duplicate ownership.

---

# 160. TASK 12.7 — E2E SAVE MIGRATION

Use fixture:
- old schema,
- load,
- migrate,
- continue playing.

---

# 161. TASK 12.8 — MOBILE INTERACTION PASS

Test actual or representative mobile viewport for:
- 44×44 targets,
- bottom navigation,
- customer sheet,
- recipe screen,
- expedition planning,
- Capture.

---

# 162. TASK 12.9 — IOS SAFARI PASS

Validate:
- IndexedDB,
- suspend/resume,
- Pixi rendering,
- safe areas,
- touch.

---

# 163. TASK 12.10 — ANDROID MID-RANGE PASS

Validate:
- scene FPS,
- memory,
- asset load,
- interaction latency.

---

# 164. TASK 12.11 — PERFORMANCE PROFILE

Measure production build:
- startup,
- JS bundle,
- asset transfer,
- FPS,
- memory,
- long tasks.

Record baseline.

Do not optimize blindly.

---

# 165. TASK 12.12 — PIXI DEGRADATION PASS

If needed:
- cap DPR,
- reduce particles,
- reduce filters,
- reduce background animations.

Never reduce input responsiveness first.

---

# 166. TASK 12.13 — ACCESSIBILITY PASS

Check:
- semantic buttons,
- focus restoration,
- keyboard path for core DOM controls,
- no color-only critical states,
- reduced motion,
- canvas fallback/access path.

---

# 167. TASK 12.14 — ERROR / EMPTY / LOCKED STATES

Verify:
- no materials,
- no compatible Catchmon,
- storage full,
- route locked,
- insufficient Coins,
- insufficient Momentum,
- no order,
- missing asset placeholder.

Every empty/error state tells the player what they can do next where appropriate.

---

# 168. TASK 12.15 — LEGACY / ARCHITECTURE AUDIT

Search active source for:
- legacy mechanics,
- `Math.random()`,
- direct `Date.now()` in domain/application,
- raw asset path construction,
- UI formulas,
- hardcoded Catchmon names,
- duplicate design tokens.

Fix violations before exit.

---

# 169. PHASE 12 EXIT GATE

All critical slice flows must:
- work after reload,
- work after offline duration,
- preserve exactly-once rewards,
- remain usable on mobile,
- pass architecture audit.

---

# 170. PHASE 13 — VERTICAL SLICE EXIT GATE

The slice is not complete because every task checkbox is green.

It is complete only if the product questions below are answered positively.

---

# 171. EXIT GATE A — CORE LOOP

A fresh player can understand:

```text
Craft
→ Display
→ Customer
→ Sale Decision
→ Reinvest
```

without reading external documentation.

---

# 172. EXIT GATE B — SELLING MATTERS

The four actions feel meaningfully different:

- Standard Sale
- Favorable Deal
- Premium Pitch
- Recommend

If players always click the same action:
- balance/system needs revision before scaling.

---

# 173. EXIT GATE C — MOMENTUM LOOP

Momentum has:
- clear sources,
- desirable sinks,
- tactical scarcity,
- no cheap-item exploit.

---

# 174. EXIT GATE D — CRAFTING

Crafting has:
- meaningful choice,
- queue convenience,
- no claim-button chore,
- readable time/value/material relationships.

---

# 175. EXIT GATE E — CATCHMON PURPOSE

A tester can explain:

> why two Catchmons lead to different strategies.

If Catchmons feel like:
- cosmetic pets,
- generic +5% cards,

the slice fails the game's core differentiator.

---

# 176. EXIT GATE F — WORLD CONNECTION

Expeditions feel like a reason to leave the shop because they provide:
- materials,
- discovery,
- Catchmon access.

They do not feel like a disconnected timer menu.

---

# 177. EXIT GATE G — CAPTURE

The player understands before attempting:
- chance,
- aid effect,
- possible consumption.

Failure still communicates progress.

Success communicates:
- gameplay value of the new Catchmon.

---

# 178. EXIT GATE H — SHOP GROWTH

Before/after screenshots clearly show:
- visible business growth.

The player feels:
> “My shop improved.”

Not only:
> “slot count increased.”

---

# 179. EXIT GATE I — WORLD IDENTITY

Vulkankrater and Ozean preview do not feel like:
- same world,
- different color.

---

# 180. EXIT GATE J — UX

The three-destination mental model holds:

```text
Shop
Catchmons
World
```

A player should not need to ask:
> “Which of seven menus contains this?”

---

# 181. EXIT GATE K — OFFLINE / SAVE

Critical correctness:

- no lost rare result,
- no duplicated result,
- no broken assignment,
- no reset after refresh,
- no timer exploit from normal reload.

---

# 182. EXIT GATE L — PERFORMANCE

The main Shop remains responsive on target mobile devices.

Decorative quality may scale down.

Interaction may not.

---

# 183. EXIT GATE M — ARCHITECTURE

The project can answer yes:

- Can economy simulate without React?
- Can expedition resolve without Pixi?
- Can save migrate without UI?
- Can a product be added through registry rather than feature code?
- Can a Catchmon capability be added without editing its card component?
- Can a region be added without editing World Map logic?

If no:
architecture is not ready for full content.

---

# 184. EXIT GATE N — SCALE

The synthetic / headless content harness proves:

- 4–5 station archetypes,
- 18–28 products,
- all seven product families

do not require architecture changes.

---

# 185. EXIT GATE O — ASSET PIPELINE

Golden Samples prove:
- one game style,
- correct camera/perspective,
- mobile readability,
- consistent Asset IDs,
- safe runtime sizes.

---

# 186. WHAT HAPPENS AFTER THE EXIT GATE

Only after all mandatory gates pass may the project authorize:

1. full 104 Catchmon role mapping,
2. final product catalog,
3. material/component content lock,
4. 17-region content packages,
5. broader asset generation,
6. full progression balancing,
7. production roadmap beyond the slice.

---

# 187. WHAT DOES NOT HAPPEN AUTOMATICALLY

Passing the Vertical Slice does not automatically authorize:

- multiplayer,
- cloud accounts,
- monetization,
- events,
- prestige,
- social systems,
- native app conversion.

Those require explicit new design decisions.

---

# 188. CLAUDE TASK DEPENDENCY SUMMARY

Recommended dependency chain:

```text
00.x
↓
01.1–01.9
↓
02.1–02.6
↓
03.x
↓
04.x
↓
05.x
↓
06.x
↓
07.x
↓
08.x
↓
09.x
↓
10.x
↓
11.x
↓
12.x
↓
13 Exit Gate
```

Some art/audit work can happen earlier.

Gameplay dependencies should not be bypassed.

---

# 189. SAFE PARALLEL WORK

After Phase 0, the following can proceed alongside headless code without changing gameplay architecture:

- existing Catchmon asset audit,
- existing icon audit,
- Golden Product briefs,
- Golden Region briefs,
- Golden Station brief,
- placeholder asset preparation.

Do not let asset production force gameplay rules.

---

# 190. UNSAFE PARALLEL WORK

Do not mass-produce while core architecture is unvalidated:

- 100 final product icons,
- 17 complete environments,
- all customer variants,
- 25 station states,
- 104 custom work animations.

---

# 191. CLAUDE CONTEXT MATRIX

Use this to minimize tokens.

| Task family | Mandatory design docs |
|---|---|
| Bootstrap / architecture | 14, 15 |
| Economy | 03, 14, 15 |
| Crafting | 03, 04, 14, 15 |
| Customers / selling | 02, 05, 14, 15 |
| Catchmons | 06, 14, 15 + canonical Catchmon reference |
| Expeditions / capture | 07, 10 where region needed, 14, 15 |
| Progression | 09, 14, 15 |
| Infrastructure | 08, 09, 14, 15 |
| UX | 11, 14, 15 |
| Pixi scene | 08, 11, 12, 14, 15 |
| Assets | 12, 13, 14, 15 |
| Scale simulation | 03, 04, 09, 14, 15 |

Do not read unrelated documents unless a direct dependency appears.

---

# 192. TASK PROMPT — COPYABLE TEMPLATE

Use this pattern for each Claude Code task:

```text
You are implementing TASK <ID> from
docs/game-design/15_CATCHMON_SHOP_VERTICAL_SLICE_IMPLEMENTATION_PLAN.md.

OBJECTIVE
<copy task objective>

READ FIRST
- CLAUDE.md
- docs/00_PROJECT_INDEX.md
- <owner docs>
- relevant sections of 14 Technical Architecture
- only direct existing source dependencies

IMPLEMENT ONLY THIS TASK.

HARD RULES
- Do not invent missing gameplay design.
- Do not import legacy Catchmon gameplay.
- Do not add magic balance values outside centralized provisional balance config.
- Do not add duplicate canonical registries/types/icons.
- Domain logic must remain deterministic and UI-independent.
- Do not add dependencies unless this task explicitly requires an approved dependency.
- If a required decision is missing, report it rather than broadening scope.

TESTS
<copy task tests>

ACCEPTANCE
<copy task acceptance>

WHEN DONE, REPORT
IMPLEMENTED
FILES
TESTS
CANONICAL DATA ADDED/CHANGED
PROVISIONAL VALUES
DESIGN GAPS/BLOCKERS
OUT-OF-SCOPE LEFT UNCHANGED
```

---

# 193. FIRST CLAUDE CODE PROMPT

After this document is added to the repo, the **first** implementation prompt should be Task 00.1, not:

> “Build Catchmon Shop.”

Then Task 00.2.

Then continue in sequence.

---

# 194. WHEN TO COMMIT

Recommended commit discipline:

- one coherent Claude task per commit or small task group,
- green checks before commit,
- descriptive messages.

Examples:

```text
chore: bootstrap vertical slice tooling
feat(core): add deterministic clock and rng
feat(crafting): add timestamp-based craft queue
feat(selling): add transaction quote engine
```

Do not make one giant “vertical slice” commit.

---

# 195. BRANCH STRATEGY

Keep it simple.

Recommended:

- `main` = stable,
- one current vertical-slice feature branch or short-lived task branches.

Avoid elaborate GitFlow.

---

# 196. REFACTOR POLICY DURING SLICE

Refactor when:
- architecture boundary is already wrong,
- repeated workaround appears,
- tests reveal structural problem.

Do not refactor for hypothetical future elegance while a slice task remains unproven.

---

# 197. PROVISIONAL CONTENT POLICY

Prototype content may be replaced.

Architecture may not silently depend on its names.

Use:
- stable slice IDs,
- explicit provisional marker,
- registries.

---

# 198. PROVISIONAL BALANCE POLICY

During the slice:
- exact values can move frequently.

All balance values must remain:
- central,
- searchable,
- simulation-friendly.

No “temporary” inline numbers.

---

# 199. SAVE COMPATIBILITY POLICY BY PHASE

## PHASES 0–3
Controlled dev save reset may be allowed if schema is not yet declared stable.

## AFTER PHASE 3 / FIRST PERSISTENT PLAYABLE SAVE
Prefer migrations for meaningful structural changes.

## AFTER VERTICAL SLICE EXTERNAL TESTING
Save migrations are mandatory.

Document exact freeze point in Project Index when reached.

---

# 200. CONTENT FREEZE POLICY

Do not freeze all game content during slice.

Freeze only:
- technical IDs needed by implemented slice,
- approved canonical Catchmon identity,
- stable architectural semantics.

---

# 201. BUG PRIORITY DURING SLICE

Priority order:

1. save corruption / duplicate rewards,
2. invariant violations,
3. game-blocking flow,
4. broken economic loop,
5. mobile interaction,
6. visual issues,
7. cosmetic polish.

---

# 202. DESIGN CHANGE POLICY

If testing reveals a design issue:

- change the owning design document first,
- update Project Index if authority changes,
- then update implementation.

Do not let code become the silent new game design.

---

# 203. ARCHITECTURE CHANGE POLICY

If an implementation task requires violating Document 14:

1. stop,
2. explain why,
3. create deliberate architecture revision/ADR,
4. update Document 14 if decision changes,
5. then implement.

---

# 204. DEPENDENCY ADDITION POLICY

Only approved current stack dependencies are expected initially.

Any new library must be justified in task report.

Do not add a package for:
- simple formatting,
- tiny math,
- basic state utilities

that can be safely implemented in-house.

---

# 205. ART DEPENDENCY POLICY

Gameplay implementation must not be blocked by missing final art.

Use:
- canonical placeholder,
- Asset ID,
- correct dimensions/layout expectation.

Art can swap later without game-rule changes.

---

# 206. VERTICAL SLICE TEST DATA POLICY

Tests use:
- small fixture definitions,
- stable deterministic IDs,
- seeded RNG,
- fake clock.

Do not import the entire production registry for every unit test.

---

# 207. FULL REGISTRY INTEGRATION TEST POLICY

Separate tests validate complete loaded slice/scale catalog.

Unit tests remain small.

---

# 208. TARGETED PERFORMANCE POLICY

Do not optimize all code early.

But never introduce known expensive architecture such as:
- full-state React subscriptions,
- all-assets boot preload,
- per-entity intervals,
- all-104 scene rendering.

---

# 209. TELEMETRY DURING SLICE

Vendor may remain no-op.

But typed event hooks should capture enough to later measure:
- sale-action distribution,
- craft usage,
- expedition usage,
- capture outcome,
- unlock usage.

---

# 210. VERTICAL SLICE USER TEST QUESTIONS

After a tester session, ask:

1. What were you trying to do in the shop?
2. Did you understand why you would use Favorable Deal?
3. Did Premium Pitch feel worth saving Momentum for?
4. Did Recommend ever solve a real stock/customer problem?
5. What did your Catchmon actually do for you?
6. Why did you go on an expedition?
7. Did you understand the capture chance before trying?
8. Did a failed capture still feel like progress?
9. What would you upgrade next?
10. What do you want to unlock next?

Avoid asking only:
> “Did you like it?”

---

# 211. QUANTITATIVE SLICE METRICS

Track in development/test if telemetry is available:

- time to first craft,
- time to first sale,
- sale action distribution,
- Momentum earned/spent,
- first upgrade,
- first Catchmon assignment,
- first expedition,
- first encounter,
- capture attempts,
- time spent per primary destination,
- navigation hops,
- craft queue utilization,
- storage-cap events.

---

# 212. NO SUCCESS BY SESSION LENGTH ALONE

A long play session does not prove the loop is good.

Look for:
- voluntary different actions,
- intentional planning,
- meaningful upgrade choice,
- return motivation.

---

# 213. VERTICAL SLICE PERFORMANCE TEST SCENE

Create a stress configuration roughly representing a busy intended shop:

- 3 active customers,
- several Catchmons,
- 2 active/ready stations,
- 3 displays,
- Hub state,
- routine VFX.

This is enough to validate current visual architecture.

Do not use 104 Catchmons as a stress test for normal play.

---

# 214. VERTICAL SLICE SAVE STRESS STATE

Synthetic near-slice-complete state should include:

- full Inventory variety,
- active craft,
- queued craft,
- active expedition,
- pending result,
- several owned Catchmons,
- Shop Rank,
- infrastructure,
- reservations.

Round-trip repeatedly.

---

# 215. VERTICAL SLICE RANDOMNESS TEST MATRIX

At minimum test:

| System | Required deterministic test |
|---|---|
| Customer generation | same seed/context = same generated request |
| Expedition loot | stored result does not reroll |
| Encounter | same stored encounter remains after reload |
| Capture | same command resolves once |
| Protection | repeated failure increases approved protection deterministically |
| Quality if RNG-driven | reload cannot reroll completed result |

---

# 216. VERTICAL SLICE INVENTORY CONFLICT MATRIX

Test:

- item reserved to expedition cannot be sold,
- item reserved to order/display obeys approved ownership model,
- crafting cannot consume already reserved stock,
- cancellation releases correctly,
- failed command leaves ledger unchanged.

---

# 217. VERTICAL SLICE TIME MATRIX

Test:

- foreground active time,
- tab switch,
- browser background,
- app reload,
- exact completion boundary,
- long offline gap,
- negative clock delta handling.

---

# 218. ACCEPTED TECHNICAL DEBT AT EXIT

Possible acceptable deferred items:

- full PWA caching,
- cloud save,
- final analytics vendor,
- complete localization,
- all 17 production region assets,
- all 104 gameplay mappings,
- final full content balance.

Not acceptable debt:

- gameplay in React,
- unseeded RNG,
- unversioned save,
- duplicated inventory,
- hardcoded asset paths,
- legacy systems,
- missing idempotency.

---

# 219. FULL-GAME AUTHORIZATION CHECKLIST

After Exit Gate, before scaling content, explicitly authorize each:

```text
[ ] Full Catchmon role mapping
[ ] Product catalog expansion
[ ] Material taxonomy lock
[ ] Special-component catalog
[ ] Additional station visual states
[ ] Additional customer archetypes
[ ] Remaining 15 region content packages
[ ] Full region art batch
[ ] Long-term balance pass
```

Do not treat the entire list as one automatic “go.”

---

# 220. RECOMMENDED POST-SLICE DOCUMENTS

After the Vertical Slice, likely next artifacts are:

- `06A_CATCHMON_ROSTER_ROLE_MAPPING.md`
- `13A_CATCHMON_SHOP_ASSET_INVENTORY`
- regional content matrices
- product/content registry plan
- global balance simulation report
- full-production roadmap

These are **after validation**, not prerequisites for starting Task 00.1.

---

# 221. LOCKED DECISIONS FROM DOCUMENT 15

1. Documents 01–14 are sufficient to begin controlled implementation.
2. Claude Code is now authorized to build only the Vertical Slice defined here.
3. Claude must not receive one giant “build the whole game” task.
4. Implementation is divided into small auditable tasks with explicit owner-doc context.
5. The playable polished slice and the broader crafting scale validation are separate tracks.
6. The polished shop initially represents two station families physically.
7. Crafting scale validation must separately prove 4–5 station archetypes and 18–28 products across all seven families.
8. Vulkankrater / Fire is the working playable starting region.
9. Ozean / Water is the recommended contrast-preview region for the slice, not a locked final full-game second region.
10. The slice uses approximately 4–8 actual canonical existing Catchmons rather than implementing all 104.
11. Exact slice Catchmon IDs must be selected from canonical references; Claude may not invent them.
12. Slice-only gameplay role mappings may be provisional when final 104 mapping does not yet exist, but must be stored separately from canonical identity.
13. Early headless crafting begins with only five provisional products, two routine materials, one component, and two stations.
14. Full/synthetic scale content comes later through the same registries.
15. Three Display slots are sufficient for the initial polished slice.
16. One concurrent Expedition slot is sufficient.
17. The slice must contain Supply, Discovery, and capture interaction.
18. The slice must demonstrate 2–3 infrastructure upgrades and one visible macro shop improvement.
19. Technical implementation follows invariants → headless rules → persistence → DOM UX → Pixi scene → final asset integration.
20. React DOM must make the full loop playable before Pixi polish is allowed to become a dependency.
21. Pixi is introduced only after domain/UI flows already work.
22. Final art is not allowed to block gameplay implementation.
23. Every production asset is referenced through Asset IDs/placeholders.
24. Full mass asset generation remains blocked during core slice implementation.
25. Save/persistence infrastructure is introduced before the game becomes deeply feature-coupled.
26. Crafting and offline progression use timestamps and reconciliation from the first real implementation.
27. Customer selling must be proven before World complexity is used to compensate for a weak shop loop.
28. Catchmon gameplay must demonstrably change strategy before expeditions are considered enough to validate the differentiator.
29. World/expedition/capture must be tested headlessly before final UX/presentation.
30. Shop Rank and infrastructure are implemented only to the extent needed to create a coherent growth arc.
31. No separate Reputation/Account-level systems are introduced.
32. DOM versions of Shop/World interactions are deliberately built before the final spatial renderer.
33. The app uses exactly Shop, Catchmons, and World as primary destinations.
34. The Pixi scene is a renderer and semantic interaction surface, not a game engine.
35. The first asset work is audit/Golden integration rather than full production.
36. Documents 04 and 08/13 scope differences are handled through separate scale and polished-scene validation rather than silently overriding one source.
37. Full product/catalog scaling is blocked until the scale harness passes.
38. Synthetic scale fixtures may use explicit non-production IDs/placeholders.
39. Synthetic scale fixtures must not be mistaken for approved final content.
40. The Vertical Slice must run seeded economy/progression simulations before full content authorization.
41. Multi-tab save writing must be hardened before the slice exit gate.
42. Critical E2E flows include craft/sale, Momentum, expedition/reload, capture, and persistence.
43. Mobile/iOS Safari/Android validation are first-class slice hardening tasks.
44. Reduced motion and non-color-only state semantics are required before exit.
45. Performance is measured on production builds rather than inferred from dev mode.
46. Architecture audit explicitly checks for direct `Math.random`, direct domain `Date.now`, UI formulas, raw asset paths, and legacy mechanics.
47. A passing build alone is not Vertical Slice completion.
48. The Slice Exit Gate includes gameplay, strategic, UX, persistence, scale, visual, and architecture criteria.
49. Full 104-Catchmon gameplay mapping remains blocked until the slice proves the Catchmon role architecture.
50. Full 17-region production remains blocked until the slice proves world identity and asset pipeline.
51. Full 70–100 product production remains blocked until crafting scale validation passes.
52. After exit, each major full-content production track still requires explicit authorization.
53. Design changes discovered during implementation must update the owning design document before code silently becomes the new specification.
54. Architecture changes discovered during implementation require deliberate revision/ADR rather than quiet boundary violations.
55. The next actual action after adding this document is **Claude Code Task 00.1**, followed by Task 00.2 — not additional prerequisite game-design planning.

---

# 222. OPEN ITEMS THAT DO NOT BLOCK STARTING IMPLEMENTATION

The following remain intentionally unresolved but do **not** block Phase 0:

- exact final product names,
- exact final full-game prices,
- exact final Shop Rank thresholds,
- exact final Catchmon Level curve,
- exact selected 4–8 Catchmon IDs,
- exact final second-region order,
- exact full customer roster,
- exact 17-region route catalog,
- exact final Golden assets,
- final performance thresholds,
- final analytics vendor,
- cloud save,
- PWA caching.

They become decisions only at the tasks that genuinely require them.

---

# 223. IMPLEMENTATION START DECISION

With Documents 01–15 present, the project has enough specification to begin.

The correct next action is:

# **BEGIN CLAUDE CODE TASK 00.1**

Then continue sequentially through the implementation plan.

Do **not** create more broad design documents before implementation unless a specific task exposes a real design gap.

---

# 224. DEFINITION OF DONE FOR DOCUMENT 15

Document 15 is complete when the project can answer:

- What exactly is the playable slice?
- What is deliberately excluded?
- Which region starts the slice?
- How many Catchmons are actually needed?
- Why are there two station-scope validation tracks?
- What does Claude implement first?
- What does every task read?
- What output/report is required?
- When is persistence introduced?
- When is Pixi introduced?
- When can assets be generated?
- How are design gaps handled?
- What tests protect RNG/offline/save?
- How is content scale validated without full production?
- What defines a successful slice?
- What specifically blocks 104/17-world/100-product production?
- At what point is Claude Code officially allowed to start?

The answer to the final question is now:

> **Immediately after this document is added to the repo, beginning with Task 00.1.**



---

# 225. MASTER EXECUTION CHECKLIST

## PHASE 0 — BOOTSTRAP
- [ ] 00.1 Implementation phase activation
- [ ] 00.2 Package/tooling bootstrap
- [ ] 00.3 Layer scaffold
- [ ] 00.4 Design-system wiring
- [ ] 00.5 Legacy leak guard
- [ ] Phase 0 Exit Gate

## PHASE 1 — KERNEL
- [ ] 01.1 Branded IDs / Result
- [ ] 01.2 Money/fixed-point math
- [ ] 01.3 Clock
- [ ] 01.4 Seeded RNG
- [ ] 01.5 Content domain types
- [ ] 01.6 Catalog/registry
- [ ] 01.7 Slice Content Manifest
- [ ] 01.8 GameState factory
- [ ] 01.9 Command Engine
- [ ] Phase 1 Exit Gate

## PHASE 2 — PERSISTENCE
- [ ] 02.1 Dexie Save Repository
- [ ] 02.2 Save envelope/Zod
- [ ] 02.3 Migration pipeline
- [ ] 02.4 Backup/revision
- [ ] 02.5 Reconciliation framework
- [ ] 02.6 Browser lifecycle
- [ ] Phase 2 Exit Gate

## PHASE 3 — CRAFTING
- [ ] 03.1 Coin economy
- [ ] 03.2 Inventory/reservation
- [ ] 03.3 Slice content
- [ ] 03.4 Station/craft commands
- [ ] 03.5 Craft timestamp
- [ ] 03.6 Offline queue
- [ ] 03.7 Craft queries
- [ ] 03.8 Dev harness
- [ ] Phase 3 Exit Gate

## PHASE 4 — SELLING
- [ ] 04.1 Displays
- [ ] 04.2 Customer model
- [ ] 04.3 Arrival service
- [ ] 04.4 Quote engine
- [ ] 04.5 Standard Sale
- [ ] 04.6 Momentum
- [ ] 04.7 Favorable Deal
- [ ] 04.8 Premium Pitch
- [ ] 04.9 Recommend
- [ ] 04.10 Decline
- [ ] 04.11 Workshop Push
- [ ] 04.12 Everyday Order
- [ ] Phase 4 Exit Gate

## PHASE 5 — CATCHMONS
- [ ] 05.1 Canonical adapter
- [ ] 05.2 Slice selection
- [ ] 05.3 Owned Catchmon state
- [ ] 05.4 Effect primitives
- [ ] 05.5 Assignment
- [ ] 05.6 Workshop effect
- [ ] 05.7 Shop Floor effect
- [ ] 05.8 XP
- [ ] 05.9 Evolution shell
- [ ] Phase 5 Exit Gate

## PHASE 6 — WORLD
- [ ] 06.1 Regions
- [ ] 06.2 Routes
- [ ] 06.3 Planning queries
- [ ] 06.4 Start Expedition
- [ ] 06.5 Reconcile Expedition
- [ ] 06.6 Rewards
- [ ] 06.7 Discovery states
- [ ] 06.8 Encounter
- [ ] 06.9 Capture chance
- [ ] 06.10 Capture-aid reservation
- [ ] 06.11 Capture resolution
- [ ] 06.12 Failure recovery query
- [ ] Phase 6 Exit Gate

## PHASE 7 — PROGRESSION / INFRASTRUCTURE
- [ ] 07.1 Shop Rank
- [ ] 07.2 Slice unlock rules
- [ ] 07.3 Infrastructure upgrades
- [ ] 07.4 Construction support
- [ ] 07.5 Shop macro state
- [ ] 07.6 Contextual goals
- [ ] Phase 7 Exit Gate

## PHASE 8 — REACT UX
- [ ] 08.1 Providers/stores
- [ ] 08.2 Three-destination router
- [ ] 08.3 HUD
- [ ] 08.4 DOM Shop
- [ ] 08.5 Customer sheet
- [ ] 08.6 Display sheet
- [ ] 08.7 Station sheet
- [ ] 08.8 Recipe workspace
- [ ] 08.9 Inventory
- [ ] 08.10 Orders
- [ ] 08.11 Catchmon Roster
- [ ] 08.12 Catchdex
- [ ] 08.13 Catchmon Detail
- [ ] 08.14 World Map
- [ ] 08.15 Region/Route
- [ ] 08.16 Expedition planning
- [ ] 08.17 Results
- [ ] 08.18 Capture
- [ ] 08.19 Evolution presentation
- [ ] 08.20 Onboarding
- [ ] Phase 8 Exit Gate

## PHASE 9 — PIXI SHOP
- [ ] 09.1 Scene host
- [ ] 09.2 View model
- [ ] 09.3 Environment layers
- [ ] 09.4 Stations
- [ ] 09.5 Displays
- [ ] 09.6 Customers
- [ ] 09.7 Catchmons
- [ ] 09.8 Expedition Hub
- [ ] 09.9 Event bridge
- [ ] 09.10 Accessibility fallback
- [ ] Phase 9 Exit Gate

## PHASE 10 — ART / ASSETS
- [ ] 10.1 Asset registry
- [ ] 10.2 Icon audit
- [ ] 10.3 Catchmon normalization
- [ ] 10.4 Shop Golden scene
- [ ] 10.5 Station assets
- [ ] 10.6 Customers
- [ ] 10.7 Products/materials
- [ ] 10.8 Regions
- [ ] 10.9 Quality/Rarity/Shiny
- [ ] 10.10 VFX
- [ ] 10.11 Reduced Motion
- [ ] Phase 10 Exit Gate

## PHASE 11 — SCALE
- [ ] 11.1 Scale content fixture
- [ ] 11.2 Recipe graph validation
- [ ] 11.3 UI scale test
- [ ] 11.4 Content performance
- [ ] 11.5 Synthetic full-content stress
- [ ] 11.6 Economy simulation
- [ ] 11.7 Persona progression simulation
- [ ] Phase 11 Exit Gate

## PHASE 12 — HARDENING
- [ ] 12.1 Multi-tab lease
- [ ] 12.2 Save recovery
- [ ] 12.3 E2E new game/sale
- [ ] 12.4 E2E Momentum
- [ ] 12.5 E2E Expedition/reload
- [ ] 12.6 E2E Capture
- [ ] 12.7 E2E migration
- [ ] 12.8 Mobile interaction
- [ ] 12.9 iOS Safari
- [ ] 12.10 Android
- [ ] 12.11 Performance
- [ ] 12.12 Pixi degradation
- [ ] 12.13 Accessibility
- [ ] 12.14 States/errors
- [ ] 12.15 Architecture audit
- [ ] Phase 12 Exit Gate

## PHASE 13 — FINAL
- [ ] Core Loop Gate
- [ ] Selling Gate
- [ ] Momentum Gate
- [ ] Crafting Gate
- [ ] Catchmon Purpose Gate
- [ ] World Gate
- [ ] Capture Gate
- [ ] Shop Growth Gate
- [ ] World Identity Gate
- [ ] UX Gate
- [ ] Save/Offline Gate
- [ ] Performance Gate
- [ ] Architecture Gate
- [ ] Scale Gate
- [ ] Asset Pipeline Gate
- [ ] Full-production authorization decision



---

# 226. FAST CLAUDE CONTEXT REFERENCES BY PHASE

These are not substitutes for the detailed task-specific owner-doc list above.  
They are a default context ceiling.

## PHASE 0
Read:
- CLAUDE
- Project Index
- 14
- 15

## PHASE 1
Read:
- 14
- 15
- specific domain owner only where types require semantics

## PHASE 2
Read:
- 14
- 15
- relevant offline rules from 04 / 07 / 08 only when implementing their reconciliation hooks

## PHASE 3
Read:
- 03
- 04
- 14
- 15

## PHASE 4
Read:
- 02
- 05
- 14
- 15

## PHASE 5
Read:
- 06
- canonical Catchmon reference
- 14
- 15

## PHASE 6
Read:
- 07
- 10
- 14
- 15

## PHASE 7
Read:
- 08
- 09
- 14
- 15

## PHASE 8
Read:
- 11
- relevant feature owner
- 14
- 15

## PHASE 9
Read:
- 08
- 11
- 12
- 14
- 15

## PHASE 10
Read:
- 12
- 13
- 14
- 15

## PHASE 11
Read:
- 03
- 04
- 09
- 14
- 15

## PHASE 12
Read:
- 11
- 14
- 15
- specific owner doc for failing behavior only

This context discipline is mandatory for token efficiency.
