# CATCHMON SHOP — 14 TECHNICAL ARCHITECTURE

**Status:** Technical Architecture v1  
**Purpose:** Define how Catchmon Shop should actually be engineered so the approved game systems remain modular, deterministic, save-safe, data-driven, testable, performant on mobile, visually scalable, and practical for Claude Code to implement without inventing design decisions or importing legacy gameplay  
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
- canonical references in `reference/catchmons/` and `reference/design-system/`

**Authority:** This document owns:
- technology stack,
- technical layer boundaries,
- repository/source architecture,
- dependency direction,
- domain-engine architecture,
- command/event architecture,
- canonical registry architecture,
- balance architecture,
- typed-ID architecture,
- numeric representation rules,
- time/offline architecture,
- deterministic randomness architecture,
- inventory reservation architecture,
- save/persistence architecture,
- migration/versioning architecture,
- multi-tab behavior,
- React/UI architecture,
- routing/navigation architecture,
- PixiJS scene architecture,
- asset loading/manifest architecture,
- error/result architecture,
- testing strategy,
- simulation strategy,
- performance architecture,
- logging/telemetry ports,
- deployment assumptions,
- CI quality gates,
- Claude Code implementation guardrails.

**Out of scope:**  
- exact final numeric balance,
- exact content records for all products/resources/components,
- exact 104-Catchmon role mapping,
- exact final asset inventory,
- exact vertical-slice task sequence,
- cloud accounts/save backend,
- multiplayer,
- social systems,
- monetization,
- server-authoritative anti-cheat,
- native mobile application packaging,
- final analytics vendor,
- final hosting vendor.

---

# 1. ARCHITECTURE NORTH STAR

The architecture must support one central rule:

> **Gameplay rules are pure game-domain logic. React, PixiJS, IndexedDB, assets, and browser APIs are adapters around that logic — never the owners of it.**

The project should be able to:

- run economy simulations without rendering,
- resolve an expedition without React,
- test capture RNG without a browser,
- migrate a save without loading the shop scene,
- replace a UI component without changing a formula,
- replace the scene renderer without changing game state.

This is the core technical protection against long-term entropy.

---

# 2. PRIMARY TECHNICAL PRINCIPLES

Catchmon Shop uses the following architecture principles:

1. **TypeScript strict by default**
2. **Headless deterministic domain**
3. **Canonical typed registries**
4. **Centralized balance configuration**
5. **Commands modify durable game state**
6. **Derived values are calculated, not duplicated**
7. **Time is timestamp-based, not tick-based**
8. **Randomness is injected and reproducible**
9. **Persistence is versioned and validated**
10. **React owns UI, not gameplay**
11. **PixiJS owns scene rendering, not gameplay**
12. **Assets are addressed by stable IDs**
13. **Offline progression uses reconciliation, not background simulation**
14. **Every long-lived result is idempotent**
15. **Mobile performance is a first-class requirement**
16. **Legacy mechanics do not enter through convenience imports**
17. **Claude Code receives small owner-doc scopes, not the entire design corpus per task**

---

# 3. CURRENT TOOLING SNAPSHOT — AUGUST 2026

The exact patch versions should be locked at implementation bootstrap rather than permanently frozen inside this architecture document.

The currently verified ecosystem supports the following direction:

- Node.js 24 is an active LTS line.
- React 19.2 is the current React documentation line.
- Vite 8 is the current major family and Vite 8.x is actively supported.
- React Router 8 is current.
- PixiJS 8 is the current maintained PixiJS generation.
- Vitest 4 is current and Vite-native.
- Zod 4 is stable.
- Dexie 4 is the current TypeScript-friendly IndexedDB line.
- Zustand remains a lightweight typed React state solution.

At project bootstrap:

> install current stable compatible patch releases, commit the lockfile, and upgrade deliberately.

Do not use floating dependency ranges in CI.

---

# 4. RECOMMENDED STACK

## Runtime / language

- **Node.js 24 LTS** for local tooling/CI
- **TypeScript**
- **ES modules**

## Application

- **React**
- **Vite**
- **React Router**
- **Zustand** for thin application/UI-facing stores only
- **Zod** for runtime validation
- **Dexie / IndexedDB** for local persistence
- **PixiJS** for the living shop scene

## Styling

- existing `tokens.css`
- plain CSS / CSS Modules
- no second design-token framework

## Testing

- **Vitest**
- **React Testing Library**
- **Playwright** for critical end-to-end flows

## Quality

- TypeScript strict typecheck
- ESLint
- formatting tooling
- content-integrity validation
- production build validation

---

# 5. WHY REACT + VITE

Catchmon Shop is:

- a browser-first application,
- heavily interactive,
- primarily client-side,
- not dependent on server rendering,
- structured around game state rather than document content.

Vite provides:

- fast development,
- mature TypeScript/React integration,
- static production output,
- asset bundling,
- code splitting.

A server-rendered framework is not required for the game itself.

---

# 6. NO SSR REQUIREMENT

Catchmon Shop does not need SSR for the playable application.

Reasons:

- game state is local/persistent,
- most screens depend on client state,
- the living scene is client-rendered,
- SEO is not a gameplay requirement.

Marketing pages can be a separate concern later.

---

# 7. WHY PIXIJS

The main shop contains:

- layered environment art,
- customers,
- Catchmons,
- station activity,
- contact shadows,
- VFX,
- depth sorting,
- responsive 2.5D composition.

PixiJS provides a purpose-built 2D rendering layer without requiring:

- full 3D physics,
- free camera,
- a heavyweight general-purpose game engine.

---

# 8. PIXIJS SCOPE BOUNDARY

PixiJS is used only where spatial scene rendering materially benefits the game.

Primary use:

# MAIN SHOP SCENE

Possible later use:

- region/environment presentation,
- capture/evolution visual sequence,
- selected VFX.

React DOM remains the default for:

- cards,
- sheets,
- buttons,
- lists,
- recipe workspace,
- Catchmon roster,
- Inventory,
- World navigation,
- expedition planning.

---

# 9. NO GAMEPLAY LOGIC IN PIXIJS

A Pixi object must never decide:

- sale value,
- craft time,
- encounter chance,
- Catchmon XP,
- unlock state,
- storage capacity.

Pixi receives a prepared `SceneViewModel`.

It renders state and emits semantic interaction intents.

---

# 10. NO GAMEPLAY LOGIC IN REACT

React components must never calculate canonical formulas such as:

```text
saleValue = baseValue * quality * customerBonus
```

or:

```text
captureChance = base + catchmonBonus + itemBonus
```

React requests derived values from:

- application selectors,
- domain query functions.

---

# 11. LOCAL-FIRST ARCHITECTURE

The initial game is:

# **LOCAL-FIRST / SINGLE-PLAYER / CLIENT-AUTHORITATIVE**

The first production architecture requires no game backend.

Canonical save data lives in browser persistence.

The application can therefore be deployed as a static web application.

---

# 12. WHY NO BACKEND YET

A backend is not currently needed for:

- crafting,
- customers,
- expeditions,
- capture,
- save state,
- offline time,
- collection.

Introducing one now would create:

- auth complexity,
- deployment complexity,
- API versioning,
- cost,
- debugging overhead

without solving a current product requirement.

---

# 13. FUTURE BACKEND BOUNDARY

Potential future features that may justify a backend:

- cloud save,
- accounts,
- cross-device sync,
- multiplayer/social,
- leaderboards,
- live operations,
- monetization validation.

The architecture should expose ports so persistence can later add a remote adapter.

It should not build the remote system now.

---

# 14. LOCAL SAVE TAMPERING

Because the base game is local and non-competitive:

> save-file manipulation is not treated as a security threat requiring obfuscation.

Do not waste development effort encrypting local save values to stop the player changing their own single-player game.

If competitive/server-authoritative features are introduced later, security assumptions change.

---

# 15. HIGH-LEVEL LAYER MODEL

The application uses five major technical layers:

```text
CORE
↓
DOMAIN
↓
APPLICATION
↓
INFRASTRUCTURE
↓
PRESENTATION
```

Content/configuration is a parallel canonical input layer consumed by Domain/Application.

---

# 16. CORE LAYER

`core/` contains reusable primitives with no game-feature knowledge.

Examples:

- branded IDs,
- `Result`,
- `Clock`,
- `RandomSource`,
- fixed-point math,
- assertions,
- timestamps,
- version helpers.

CORE may not import:

- React,
- PixiJS,
- Dexie,
- feature registries.

---

# 17. DOMAIN LAYER

`domain/` contains game rules.

Examples:

- Economy
- Inventory
- Crafting
- Customers
- Catchmons
- Expeditions
- Progression
- World
- Infrastructure
- Orders

DOMAIN:

- is TypeScript-only,
- is headless,
- accepts state + definitions + dependencies,
- returns deterministic results.

---

# 18. APPLICATION LAYER

`application/` orchestrates cross-domain use cases.

Examples:

- Start Craft
- Resolve Customer Sale
- Assign Catchmon
- Start Expedition
- Attempt Capture
- Purchase Infrastructure Upgrade
- Reconcile Offline State

APPLICATION owns:

- command orchestration,
- cross-domain transactions,
- use-case validation,
- durable event generation.

---

# 19. INFRASTRUCTURE LAYER

`infrastructure/` contains browser/platform adapters.

Examples:

- Dexie save repository,
- browser clock,
- asset loader,
- telemetry adapter,
- session coordination,
- platform lifecycle,
- file/cache adapters.

Infrastructure implements interfaces required by application/core.

---

# 20. PRESENTATION LAYER

`presentation/` contains:

- React app,
- routes,
- sheets,
- components,
- Pixi scene,
- animations,
- view models.

Presentation may dispatch application commands.

It may not directly mutate durable game state.

---

# 21. CONTENT LAYER

`content/` contains canonical authored definitions:

- products,
- recipes,
- resources,
- components,
- Catchmons,
- capabilities,
- customers,
- regions,
- routes,
- infrastructure,
- progression milestones,
- balance,
- assets.

Content is:

- data,
- stable IDs,
- declarative configuration.

It is not application code.

---

# 22. DEPENDENCY DIRECTION

Allowed direction:

```text
core ← domain ← application ← presentation
          ↑          ↑
       content   infrastructure
```

More precisely:

- `core` imports nothing from higher layers.
- `domain` imports `core`.
- `content` may import domain/core types.
- `application` imports domain/content/core.
- `infrastructure` imports interfaces/core/application contracts.
- `presentation` imports application selectors/commands and presentation models.

---

# 23. FORBIDDEN DEPENDENCIES

Examples of forbidden imports:

- `domain/crafting` → React
- `domain/catchmons` → PixiJS
- `content/products` → UI components
- `presentation/customer` → Dexie
- `infrastructure/persistence` → Shop component
- `domain/expeditions` → `window`
- `domain/economy` → `Date.now()`

---

# 24. RECOMMENDED SOURCE TREE

```text
src/
├── app/
│   ├── bootstrap/
│   ├── providers/
│   └── router/
│
├── core/
│   ├── ids/
│   ├── math/
│   ├── random/
│   ├── time/
│   ├── result/
│   └── versioning/
│
├── domain/
│   ├── economy/
│   ├── inventory/
│   ├── crafting/
│   ├── customers/
│   ├── orders/
│   ├── catchmons/
│   ├── expeditions/
│   ├── progression/
│   ├── world/
│   └── infrastructure/
│
├── content/
│   ├── balance/
│   ├── products/
│   ├── recipes/
│   ├── resources/
│   ├── components/
│   ├── catchmons/
│   ├── capabilities/
│   ├── customers/
│   ├── regions/
│   ├── routes/
│   ├── infrastructure/
│   ├── progression/
│   └── assets/
│
├── application/
│   ├── engine/
│   ├── commands/
│   ├── queries/
│   ├── selectors/
│   ├── reconciliation/
│   ├── telemetry/
│   └── ports/
│
├── infrastructure/
│   ├── persistence/
│   ├── platform/
│   ├── assets/
│   ├── telemetry/
│   └── session/
│
├── presentation/
│   ├── ui/
│   ├── screens/
│   ├── sheets/
│   ├── navigation/
│   ├── scene/
│   ├── view-models/
│   └── styles/
│
├── test/
│   ├── fixtures/
│   ├── factories/
│   └── helpers/
│
└── main.tsx
```

Exact subdivisions may simplify during vertical slice.

The layer boundaries should not.

---

# 25. FEATURE PUBLIC APIs

Each domain should expose a small public API.

Example:

```text
domain/crafting/
├── model.ts
├── rules.ts
├── queries.ts
├── effects.ts
├── invariants.ts
└── index.ts
```

Other layers import from the domain's public entry point where practical.

Avoid deep cross-feature imports.

---

# 26. BARREL FILE DISCIPLINE

Small domain-level public `index.ts` files are acceptable.

Avoid giant root barrel files that re-export the entire application.

They:

- hide dependency direction,
- increase circular-import risk,
- make Claude imports unpredictable.

---

# 27. TYPESCRIPT MODE

Required:

```text
strict = true
```

Also prefer:

- `noUncheckedIndexedAccess`
- `exactOptionalPropertyTypes`
- `noImplicitOverride`
- `useUnknownInCatchVariables`
- `noFallthroughCasesInSwitch`

Exact config is created during bootstrap.

---

# 28. NO UNJUSTIFIED `any`

`any` is forbidden in normal production code.

Use:

- generics,
- `unknown`,
- discriminated unions,
- validated boundary parsing.

An explicit isolated `any` requires a comment explaining why a third-party API forces it.

---

# 29. BRANDED IDS

Different game IDs should not all be plain interchangeable strings at compile time.

Use lightweight branded IDs.

Conceptual example:

```ts
type Brand<T, B extends string> = T & { readonly __brand: B }

type ProductId = Brand<string, 'ProductId'>
type RecipeId = Brand<string, 'RecipeId'>
type CatchmonSpeciesId = Brand<string, 'CatchmonSpeciesId'>
type CatchmonLineId = Brand<string, 'CatchmonLineId'>
type RegionId = Brand<string, 'RegionId'>
type RouteId = Brand<string, 'RouteId'>
```

This prevents accidentally passing a Route ID where a Recipe ID is expected.

---

# 30. STABLE CONTENT IDS

IDs are semantic persistence boundaries.

Do not rename them casually.

Display names may change independently.

Existing stable legacy IDs may be retained where approved, such as canonical region IDs.

---

# 31. NO BUSINESS LOGIC FROM DISPLAY STRINGS

Never write:

```ts
if (region.name === 'Vulkankrater')
```

or:

```ts
if (catchmon.name === '...')
```

Use stable IDs/capability definitions.

---

# 32. NUMERIC REPRESENTATION — COINS

Coins use:

# safe integer `number`

Rules:

- non-negative integer,
- no fractional Coin storage,
- arithmetic validated to remain under `Number.MAX_SAFE_INTEGER`.

Catchmon Shop deliberately does not target astronomical idle-game values.

If simulations prove safe-integer limits are insufficient, architecture must revisit the numeric type explicitly.

Do not silently switch parts of the game to `bigint`.

---

# 33. NUMERIC REPRESENTATION — PERCENTAGES

Use fixed-point basis points where practical.

Recommended:

```text
0      = 0%
100    = 1%
10000  = 100%
```

This gives 0.01% precision.

Avoid repeated floating-point percentage accumulation.

---

# 34. PROBABILITY REPRESENTATION

Capture/encounter probabilities should use:

# basis points or an equivalent bounded integer probability unit.

A probability helper owns:

- normalization,
- clamping,
- rolling,
- UI conversion.

---

# 35. TIME REPRESENTATION

Durations:

# integer milliseconds.

Absolute timestamps:

# Unix epoch milliseconds UTC.

Never store locale-formatted date strings as game timing truth.

---

# 36. ROUNDING POLICY

Every economic formula must define where rounding occurs.

Recommended default:

- intermediate fixed-point integer math,
- final player-facing currency result rounded once.

Do not allow each component to choose its own rounding.

---

# 37. MONEY MATH UTILITIES

Create canonical utilities such as:

```text
applyBasisPoints()
multiplyAndRound()
clampProbability()
safeAddCoins()
```

UI and feature code must not reimplement the formula.

---

# 38. CANONICAL GAME STATE

Durable gameplay state is represented in one serializable `GameState`.

Conceptual shape:

```text
GameState
├── meta
├── economy
├── inventory
├── shop
├── crafting
├── customers
├── orders
├── catchmons
├── expeditions
├── world
├── progression
└── infrastructure
```

This is a conceptual root, not a requirement for one enormous source file.

---

# 39. GAME STATE META

`meta` should include:

```text
saveId
schemaVersion
createdAtMs
updatedAtMs
lastActiveAtMs
revision
rootRandomSeed
randomEventCounter
contentVersion
```

Additional migration/runtime metadata may be added.

---

# 40. STORED VS DERIVED STATE

Store only facts that must persist.

Do not persist values that can be safely derived.

Examples to derive:

- effective craft speed,
- current sale quote,
- Catchmon route fit,
- current storage percentage,
- final capture chance preview,
- Shop Rank next milestone.

---

# 41. WHY NOT STORE DERIVED VALUES

Duplicated derived data creates:

- stale state,
- migration burden,
- inconsistent formulas,
- hard-to-debug saves.

Canonical inputs + deterministic selectors are safer.

---

# 42. EXCEPTION — SNAPSHOTTED ACTIVITY VALUES

Long-running activities may snapshot relevant calculated values at start.

Examples:

- craft duration,
- expedition duration,
- expedition team capability snapshot,
- reward seed,
- preparation loadout.

This protects activities from:

- mid-run reassignments,
- content balance updates,
- reload exploits.

---

# 43. STATE NORMALIZATION

Large collections should be stored by ID.

Prefer:

```text
Record<Id, EntityState>
```

plus ordered ID arrays where order matters.

Avoid deeply nesting duplicate entity objects.

---

# 44. DOMAIN COMMAND ARCHITECTURE

All durable gameplay mutation occurs through typed commands.

Conceptual examples:

```text
START_CRAFT
CANCEL_CRAFT
STOCK_DISPLAY
RESOLVE_CUSTOMER_SALE
ACCEPT_ORDER
ASSIGN_CATCHMON
START_EXPEDITION
ATTEMPT_CAPTURE
EVOLVE_CATCHMON
PURCHASE_INFRASTRUCTURE
```

---

# 45. COMMAND ENVELOPE

A command should include:

```text
commandId
type
issuedAtMs
payload
```

`commandId` supports debugging/idempotency where relevant.

---

# 46. GAME ENGINE ENTRY POINT

Presentation should call one application boundary.

Conceptual API:

```ts
gameEngine.execute(command)
```

The engine:

1. reconciles stale time-based state,
2. validates command,
3. applies domain rules,
4. emits events,
5. commits next durable state,
6. schedules persistence,
7. exposes updated selectors.

---

# 47. NO DIRECT STORE MUTATION

Forbidden:

```ts
useGameStore.setState(...)
```

from arbitrary React components.

The store is updated only by the Game Engine/application layer.

---

# 48. COMMAND RESULT

A command returns a typed result:

```text
success
nextRevision
domainEvents[]
optionalPresentationHints[]
```

or a typed `GameError`.

---

# 49. DOMAIN EVENTS

Domain events describe what happened.

Examples:

```text
CRAFT_STARTED
CRAFT_COMPLETED
CUSTOMER_SALE_RESOLVED
MOMENTUM_CHANGED
CATCHMON_LEVEL_CHANGED
EXPEDITION_COMPLETED
TRACE_DISCOVERED
CAPTURE_SUCCEEDED
CAPTURE_FAILED
REGION_UNLOCKED
```

---

# 50. NOT FULL EVENT SOURCING

Catchmon Shop does **not** use full event sourcing as its save model.

Canonical save state is a state snapshot.

Domain events are useful for:

- VFX,
- sound,
- telemetry,
- tests,
- contextual notifications.

Critical pending results live in durable state.

---

# 51. WHY NOT EVENT SOURCING

Full event sourcing would add:

- replay complexity,
- event migrations,
- log growth,
- debugging overhead

without a current requirement.

State snapshots + typed events provide enough observability.

---

# 52. PRESENTATION EVENTS VS DURABLE STATE

Do not persist transient UI effects such as:

- coin fly animation,
- button bounce.

Do persist gameplay facts such as:

- pending encounter,
- completed expedition result,
- evolution readiness.

---

# 53. ERROR MODEL

Expected game-rule failures return typed errors.

Examples:

```text
INSUFFICIENT_COINS
MISSING_MATERIALS
STORAGE_FULL
STATION_BUSY
CATCHMON_UNAVAILABLE
ROUTE_LOCKED
INVALID_LOADOUT
CAPTURE_ALREADY_RESOLVED
```

---

# 54. PROGRAMMING ERRORS VS GAME ERRORS

Game errors:

- handled normally,
- shown to player when needed.

Programming/invariant violations:

- throw in development/test,
- log diagnostics,
- should never become normal UX.

---

# 55. RESULT TYPE

Use a small canonical `Result<T, E>` representation.

Do not use exceptions for expected gameplay failures.

---

# 56. CANONICAL CONTENT REGISTRIES

The project requires canonical registries for:

1. products
2. recipes
3. routine resources
4. special components
5. Catchmon species
6. Catchmon evolution lines
7. Catchmon capabilities
8. customers
9. orders/templates where appropriate
10. regions
11. routes
12. infrastructure
13. progression milestones
14. assets
15. balance profiles

---

# 57. REGISTRY FORM

Authored content should use typed TypeScript definitions or validated data modules.

Preferred shape:

```ts
export const productDefinitions = [
  ...
] satisfies readonly ProductDefinition[]
```

Runtime validation/integrity tests validate cross-references.

---

# 58. WHY TYPE-SCRIPTED CONTENT FIRST

For this project, TypeScript-authored content provides:

- editor autocomplete,
- stable IDs,
- Claude Code readability,
- compile-time checking,
- simple refactors.

External JSON/content tooling can be introduced later if content authorship needs change.

---

# 59. ZOD AT TRUST BOUNDARIES

Use Zod for runtime validation of:

- loaded save data,
- migrated save snapshots,
- imported external content if added,
- development registry validation where useful.

Do not parse every internal object through Zod on every frame.

---

# 60. REGISTRY INTEGRITY VALIDATION

Create a dedicated content validation command/test.

It must catch:

- duplicate IDs,
- unknown references,
- missing assets,
- invalid evolution chains,
- unknown element IDs,
- route encounter references to missing species,
- recipe references to missing materials,
- unsupported capability types,
- invalid unlock references.

---

# 61. CROSS-REGISTRY VALIDATION

Examples:

- every recipe output product exists,
- every product recipe ID exists,
- every Catchmon line stage exists,
- every home region exists,
- every route region exists,
- every asset ID referenced exists,
- every Shop Rank unlock target exists.

---

# 62. CONTENT BOOT FAILURE

In development/test:

> invalid canonical content should fail fast.

Do not silently skip malformed records.

In production:

- build validation should prevent invalid content from shipping.

---

# 63. BALANCE ARCHITECTURE

Exact tuning values live centrally.

Recommended structure:

```text
content/balance/
├── economy.ts
├── crafting.ts
├── customers.ts
├── catchmons.ts
├── expeditions.ts
├── progression.ts
└── infrastructure.ts
```

---

# 64. NO MAGIC NUMBERS IN FEATURE LOGIC

Forbidden:

```ts
if (momentum >= 25)
```

inside a customer component if `25` is a balance value.

Use:

```text
BALANCE.customer.premiumPitch.minimumMomentum
```

or a definition-driven value.

---

# 65. BALANCE PROFILES

Reusable rules may reference named profiles.

Examples:

```text
craftTimeProfile: 'quick'
captureDifficultyProfile: 'accessible'
customerPatienceProfile: 'standard'
```

Profiles map to centralized numeric data.

---

# 66. CONTENT VS BALANCE

Content answers:

> what is this thing?

Balance answers:

> what are its numeric parameters?

Do not duplicate exact values across both if they can be referenced.

---

# 67. EFFECT ENGINE

Catchmon capabilities and selected infrastructure effects should use typed reusable effect primitives.

Use discriminated unions.

Conceptual example:

```text
CRAFT_SPEED_TARGETED
CRAFT_QUALITY_TARGETED
MATERIAL_EFFICIENCY_TARGETED
RECIPE_UNLOCK
CUSTOMER_ATTRACTION
DEMAND_INSIGHT
RECOMMEND_COMPATIBILITY
SUPPLY_YIELD_TARGETED
RESOURCE_CONVERSION
EXPEDITION_ROUTE_ACCESS
EXPEDITION_REWARD_WEIGHT
DISCOVERY_BOOST
GEAR_EFFICIENCY
```

---

# 68. EFFECT ENGINE SCOPE

Do not create one giant universal rules-language DSL.

Use:

- a finite typed union,
- domain-specific evaluators.

This preserves type safety and debuggability.

---

# 69. EFFECT AGGREGATION

Each affected domain owns its stacking rules.

Example crafting order:

1. base definition
2. structural eligibility effects
3. flat adjustments if any
4. additive basis-point adjustments
5. approved multiplicative category
6. caps/clamps
7. rounding

Document exact order in code/tests.

---

# 70. GENERIC PERCENT STACKING IS NOT DEFAULT

Do not blindly multiply all active modifiers.

Every effect family defines:

- stacking mode,
- cap,
- conditions.

---

# 71. SIGNATURE EFFECTS

A small number of signature capabilities may require custom evaluator logic.

They should be:

- registered explicitly,
- isolated,
- tested,
- never implemented as name/ID branches in UI.

---

# 72. INVENTORY ARCHITECTURE

Inventory is one canonical system shared by:

- crafting,
- displays,
- orders,
- expeditions,
- capture gear.

Do not let each feature maintain its own quantity copy.

---

# 73. INVENTORY STACK

Conceptual:

```text
itemId
kind
quality?
quantity
```

Products with Quality may require quality-specific stacks.

Routine materials/components do not.

---

# 74. RESERVATION LEDGER

Reserved inventory must use one canonical reservation ledger.

Conceptual:

```text
reservationId
ownerType
ownerId
items[]
createdAtMs
```

---

# 75. RESERVATION OWNER TYPES

Examples:

```text
CRAFT_QUEUE
ORDER
EXPEDITION
DISPLAY
MANUAL
```

Exact classification may adapt.

---

# 76. WHY A CENTRAL RESERVATION LEDGER

Without one ledger:

- expedition thinks an item exists,
- order thinks the same item exists,
- display sells it.

A central ledger prevents double-spending.

---

# 77. INVENTORY AVAILABILITY QUERY

Canonical query:

```text
available = total - reserved
```

All systems use the same inventory service/query.

---

# 78. ATOMIC INVENTORY TRANSACTIONS

Commands that:

- consume materials,
- reserve gear,
- add products,
- move stock

must update inventory atomically with the owning activity.

---

# 79. DISPLAY STOCK MODEL

Display stock must reference canonical product inventory/reservations.

Do not duplicate fake quantities on display objects.

The exact implementation may reserve a quantity to a display or define display allocation metadata.

---

# 80. CRAFTING STATE MODEL

A station state conceptually contains:

```text
stationId
activeCraft?
queuedCraftIds[]
completedOutput?
supportCatchmonIds[]
```

Queued craft entries contain reserved inputs and snapshots.

---

# 81. CRAFT ACTIVITY SNAPSHOT

At craft start, snapshot at least:

- recipe ID,
- start time,
- calculated duration,
- relevant quality roll seed/context,
- support effect snapshot where required,
- reserved/consumed input reference.

---

# 82. CRAFTING TIME IS NOT A COUNTDOWN VARIABLE

Do not decrement:

```text
remainingSeconds--
```

and save it every second.

Store timestamps.

Compute:

```text
remaining = completeAt - now
```

---

# 83. CRAFT QUEUE OFFLINE RECONCILIATION

On reconciliation:

1. determine whether active craft completed,
2. produce protected output,
3. if storage accepts output, continue,
4. start next queued craft at the historical eligible time,
5. repeat only across the bounded queue,
6. stop if blocked.

No per-second simulation required.

---

# 84. STORAGE-BLOCKED CRAFT

If output cannot enter storage:

- result remains protected at station,
- station pauses,
- no product disappears.

This state is persisted.

---

# 85. CUSTOMER ARCHITECTURE

Customer generation and transaction resolution are separate concerns.

Customer state contains:

- archetype,
- request,
- arrival/browse state,
- compatibility context,
- generated ID/seed.

---

# 86. CUSTOMER ARRIVAL IS ACTIVE-PLAY BIASED

Do not simulate an infinite queue of missed customers offline.

While the app/shop session is active:

- schedule arrivals using timestamps.

When returning after absence:

- reconcile bounded existing state,
- resume fresh customer flow.

---

# 87. CUSTOMER OFFLINE POLICY

Default:

- no mass offline transaction simulation,
- no auto-premium selling,
- no hundreds of stored customer requests.

This preserves active selling as core play.

---

# 88. CUSTOMER ARRIVAL RANDOMNESS

Customer generation uses injected deterministic RNG.

Once a customer is generated:

- its request is stored,
- reload does not reroll it.

---

# 89. QUOTE QUERY

Transaction values are calculated by a canonical quote function.

Conceptual:

```text
getCustomerTransactionOptions(gameState, customerId, catalog)
```

It returns:

- Standard outcome,
- Favorable outcome,
- Premium outcome,
- compatible Recommend candidates.

React merely displays it.

---

# 90. SHOP MOMENTUM

Momentum is durable game state.

It persists across:

- reload,
- leaving the Shop tab.

It is not reset merely because the player closed the app unless a future design document explicitly changes that.

---

# 91. CATCHMON STATE MODEL

Catchmon durable data should be split conceptually into:

## canonical species/line definition
content registry.

## owned instance/development state
save state.

This prevents canonical identity duplication.

---

# 92. OWNED CATCHMON STATE

Conceptual:

```text
lineId
currentSpeciesId
level
xp
evolutionState
currentAssignment?
shinyUnlocked?
favorite?
```

Exact fields adapt to final content mapping.

---

# 93. NO DUPLICATED CATCHMON DEFINITION IN SAVE

Save does not store:

- name,
- element color,
- full ability description,
- image URL.

It stores stable IDs and mutable progression.

---

# 94. ASSIGNMENT STATE

Assignment should have one canonical representation.

Conceptual discriminated union:

```text
UNASSIGNED
WORKSHOP { stationId }
SHOP_FLOOR { slotId }
SUPPLY { slotId }
EXPEDITION { expeditionId }
```

---

# 95. ONE-DUTY INVARIANT

The domain must enforce:

> one Catchmon instance cannot occupy multiple functional assignments simultaneously.

The UI is not responsible for enforcing this invariant.

---

# 96. ASSIGNMENT SNAPSHOT BOUNDARY

Long-running activities snapshot needed capability effects at start.

Reassignment later changes future activities only.

---

# 97. CATCHMON XP

XP is awarded by domain events/use cases.

Examples:

- craft completion,
- sale resolution,
- supply cycle,
- expedition completion.

Do not calculate XP inside UI animations.

---

# 98. EVOLUTION

Evolution is an explicit command.

It:

- validates requirements,
- updates current species stage,
- preserves line/XP progress as defined,
- emits evolution event,
- updates collection state.

It must be idempotent.

---

# 99. EXPEDITION STATE MODEL

Conceptual active expedition:

```text
expeditionId
routeId
status
startedAtMs
completesAtMs
leadCatchmonId
supportCatchmonIds[]
loadoutReservationId
snapshot
resultSeed
result?
pendingEncounterId?
```

---

# 100. EXPEDITION START

Start command atomically:

1. validates route/unlocks,
2. validates Catchmon availability,
3. validates loadout,
4. reserves/consumes applicable items,
5. snapshots team/effects,
6. assigns Catchmons to expedition,
7. generates durable expedition ID/seed,
8. stores completion timestamp.

---

# 101. EXPEDITION COMPLETION

Completion is determined from timestamps during reconciliation.

Result generation occurs exactly once.

The generated result is stored durably.

Catchmons are then released from Expedition assignment.

---

# 102. RESULT IDEMPOTENCY

Reloading after completion must not:

- reroll loot,
- generate another encounter,
- award XP twice,
- duplicate materials.

Persist:

- resolution status,
- result,
- random event reference.

---

# 103. PENDING ENCOUNTER

An Encounter Opportunity is durable state.

It persists until:

- capture attempted and resolved,
- player declines,
- another explicitly valid terminal action occurs.

It does not expire due to app close.

---

# 104. CAPTURE COMMAND

`ATTEMPT_CAPTURE`:

1. validates pending encounter,
2. calculates current chance,
3. validates selected reserved aids,
4. consumes used aids atomically,
5. consumes one deterministic random event,
6. resolves success/failure,
7. updates line-specific protection,
8. updates collection/ownership on success,
9. marks encounter resolved.

---

# 105. CAPTURE IDEMPOTENCY

A resolved encounter ID can never be captured again.

Repeated command/network/UI double click must return:

- already resolved,
- no additional consumption,
- no duplicate Catchmon.

---

# 106. WORLD STATE

World save state stores only mutable progress.

Examples:

```text
unlockedRegionIds
routeStates
discoveryStates
traceProgress
encounterProtection
captureProtection
regionMilestones
```

Canonical region data remains in content.

---

# 107. REGION CONTENT VERSIONING

If a region's balance/content changes:

- unlocked status remains,
- active expeditions use their snapshots,
- future expeditions use new definitions.

Do not rewrite history unnecessarily.

---

# 108. PROGRESSION STATE

Shop Rank state conceptually includes:

```text
rank
rankProgress
earnedMilestoneIds
unlockedSystemIds
```

Exact representation may optimize derived unlocks.

---

# 109. UNLOCK ENGINE

Unlock conditions are data-driven.

Supported condition primitives may include:

```text
SHOP_RANK
INFRASTRUCTURE_STATE
RECIPE_MASTERY
CATCHMON_OWNED
CATCHMON_LEVEL
REGION_STATE
EXPEDITION_MILESTONE
COLLECTION_MILESTONE
```

---

# 110. UNLOCK EVALUATOR

One central evaluator answers:

```text
isUnlocked(unlockRuleId, gameState, catalog)
```

UI does not implement gate logic.

---

# 111. UNLOCK CACHING

Derived unlock checks may be memoized if profiling requires it.

Do not persist redundant Boolean unlock states unless:

- the unlock is permanently earned and must survive changed thresholds,
- migration semantics require it.

---

# 112. EARNED UNLOCK PROTECTION

Major unlocked systems should generally remain unlocked even if later balance tuning raises thresholds.

Persist explicit earned milestone/unlock IDs where this protection matters.

---

# 113. INFRASTRUCTURE STATE

Infrastructure save state stores:

- owned/unlocked infrastructure IDs,
- upgrade levels/states,
- active construction activities,
- layout anchor choices where applicable.

Canonical effects/costs live in definitions.

---

# 114. CONSTRUCTION TIME

Construction uses:

- start timestamp,
- completion timestamp,
- snapshot of target upgrade/cost.

No countdown mutation loop.

---

# 115. TIME ARCHITECTURE — CLOCK PORT

Domain/Application code never calls `Date.now()` directly.

Use:

```ts
interface Clock {
  nowMs(): number
}
```

Production:

- browser system clock.

Tests:

- deterministic fake clock.

---

# 116. WHY CLOCK INJECTION MATTERS

It makes possible:

- exact offline tests,
- time travel in simulations,
- deterministic construction tests,
- no flaky timer tests.

---

# 117. RECONCILIATION MODEL

Time-based progression is processed by:

# `reconcileGameState(state, now, catalog)`

or equivalent application service.

It resolves all eligible timestamp-based state to `now`.

---

# 118. RECONCILIATION TRIGGERS

Run reconciliation:

- at app bootstrap,
- when tab becomes active,
- before executing durable gameplay commands,
- periodically while active where visual readiness needs updating.

The periodic active pulse is not the canonical source of truth.

---

# 119. NO PER-SECOND SAVE LOOP

Never:

- mutate durable state every second,
- save countdowns every second.

Timers are derived from timestamps.

---

# 120. ACTIVE VISUAL CLOCK

React may use a lightweight local ticker for:

- timer text,
- progress bars.

That ticker updates view state only.

It does not mutate canonical game state each frame.

---

# 121. OFFLINE CRAFTING

Offline reconciliation may:

- finish active craft,
- progress bounded queued crafts,
- award outputs/XP,
- stop on capacity/block.

---

# 122. OFFLINE SUPPLY

Supply progress may accrue according to:

- elapsed time,
- assignments,
- storage capacity,
- explicit offline caps.

No infinite accumulation.

---

# 123. OFFLINE EXPEDITIONS

Expeditions:

- complete based on timestamp,
- generate result once,
- store result,
- release Catchmons.

They do not auto-chain indefinitely unless future approved automation exists.

---

# 124. OFFLINE CUSTOMERS

Do not simulate every missed customer.

Active selling remains active gameplay.

---

# 125. OFFLINE CONSTRUCTION

Construction completes based on timestamps.

Existing old capability remains usable while construction is underway where the design requires.

---

# 126. OFFLINE CATCHMON XP

Catchmon XP may be awarded from completed supported activities during reconciliation.

It must be awarded once.

---

# 127. SYSTEM CLOCK MANIPULATION

A local-first game cannot perfectly prevent the player changing device time.

Base architecture does not require aggressive anti-cheat.

However:

- save timestamps should be internally coherent,
- negative elapsed time is clamped safely,
- absurd time jumps may be bounded for stability if needed.

Do not punish legitimate timezone/DST changes because all timing uses UTC timestamps.

---

# 128. RANDOMNESS ARCHITECTURE

Randomness is never called through `Math.random()` inside domain code.

Use:

```ts
interface RandomSource {
  nextUint32(): number
  nextProbabilityBps(): number
}
```

or equivalent.

---

# 129. SEEDED RNG

Production uses a deterministic seeded PRNG implementation.

The exact algorithm should be:

- small,
- documented,
- tested with fixed vectors,
- non-cryptographic.

The game does not require cryptographic randomness.

---

# 130. RANDOM EVENT MODEL

Save state contains:

- root random seed,
- monotonic random event counter.

A random gameplay resolution obtains a deterministic sub-seed from:

```text
rootSeed + eventCounter + eventContext
```

then increments the counter as part of the same atomic state commit.

---

# 131. WHY RANDOM EVENT COUNTER

This provides:

- reproducible tests,
- no reload rerolls,
- traceable outcomes,
- deterministic simulation.

---

# 132. LONG ACTIVITY RNG SNAPSHOT

Expeditions/crafts that will later resolve randomness should snapshot a random seed/event ID at start.

This prevents:

- save/reload fishing,
- content-order-dependent rerolls.

---

# 133. RANDOMNESS MUST BE STORED THROUGH RESULT STATE

Once a random result is resolved:

> store the result.

Do not rerun the roll every time a results screen opens.

---

# 134. BAD-LUCK PROTECTION

Protection state is deterministic save state.

Examples:

- component miss count/progress,
- encounter protection,
- capture protection.

RNG calculators consume it.

---

# 135. NO HIDDEN GLOBAL PITY MUTATION

Protection belongs to the relevant entity/profile:

- route/component,
- Catchmon line,
- encounter category.

Do not use one mysterious universal luck variable.

---

# 136. RNG TESTING

Every random domain function needs tests for:

- 0% / 100% edges,
- protection escalation,
- fixed-seed reproducibility,
- no duplicate resolution,
- weight normalization.

---

# 137. PERSISTENCE TECHNOLOGY

Canonical local save uses:

# **IndexedDB through Dexie**

Do not use `localStorage` as the canonical game save.

---

# 138. WHY INDEXEDDB

The game state will include:

- collection,
- activities,
- inventory,
- world state,
- results,
- migrations.

IndexedDB is better suited to:

- structured data,
- larger state,
- transactional writes.

---

# 139. LOCALSTORAGE SCOPE

`localStorage` may be used for small non-critical preferences such as:

- appearance preference,
- last non-sensitive UI hint state.

Do not split canonical gameplay state across IndexedDB and localStorage.

---

# 140. SAVE REPOSITORY PORT

Application depends on:

```ts
interface SaveRepository {
  load(saveId: SaveId): Promise<StoredSave | null>
  commit(snapshot: StoredSave): Promise<void>
  createBackup(snapshot: StoredSave): Promise<void>
}
```

Exact API may adapt.

---

# 141. SAVE ENVELOPE

Persist a validated envelope:

```text
saveId
schemaVersion
appVersion
contentVersion
revision
savedAtMs
gameState
```

Optional integrity metadata may be added.

---

# 142. SAVE REVISION

Every committed durable state increments a monotonic revision.

Persistence must not overwrite a newer revision with an older async write.

---

# 143. SAVE WRITE STRATEGY

Use:

- immediate in-memory state commit,
- debounced persistence for ordinary rapid actions,
- forced flush for critical lifecycle transitions.

---

# 144. PERSISTENCE TRIGGERS

Flush save on:

- meaningful command batch,
- app background/page hide where possible,
- major rare result,
- explicit save lifecycle point,
- periodic low-frequency safety interval.

Do not rely only on page unload.

---

# 145. CRASH RESILIENCE

Maintain at least:

- current snapshot,
- previous known-good backup.

A corrupted latest save should allow fallback to previous valid snapshot.

---

# 146. BACKUP ROTATION

A simple rolling strategy is sufficient.

Example:

```text
current
previous
```

More elaborate history is not required initially.

---

# 147. SAVE VALIDATION

On load:

1. read stored envelope,
2. validate outer schema,
3. run version migrations,
4. validate migrated state,
5. run invariant checks,
6. reconcile time,
7. only then expose state to UI.

---

# 148. SAVE MIGRATIONS

Migrations are explicit sequential functions.

Conceptual:

```text
v1 → v2
v2 → v3
v3 → v4
```

Never have one giant “guess old save shape” function.

---

# 149. MIGRATION RULES

A migration should:

- be deterministic,
- not read React/UI state,
- preserve earned progression,
- be covered by fixture tests,
- fail safely if impossible.

---

# 150. SAVE FIXTURES

Keep representative historical saves in test fixtures.

Every new schema version runs all prior fixtures through migrations.

---

# 151. CONTENT CHANGE VS SAVE MIGRATION

Not every content balance change requires a save schema migration.

Migrate only when durable structure changes.

Content definitions may change independently.

---

# 152. ACTIVE ACTIVITY CONTENT SNAPSHOTS

If balance changes while an activity is running:

- use its snapshotted duration/effects/reward context where necessary.

Future activities use new content.

---

# 153. SAVE RESET BOUNDARY

During development, explicit dev-only save reset tools are allowed.

Production updates must not casually reset player saves.

---

# 154. MULTI-TAB PROBLEM

Two tabs writing the same local save can create:

- duplicate commands,
- stale revision writes,
- confusing timers.

The project needs an explicit session rule.

---

# 155. MULTI-TAB POLICY

Recommended:

# **ONE ACTIVE WRITER TAB PER SAVE**

Additional tabs may:

- show a read-only warning,
- offer “Take over session.”

---

# 156. SESSION COORDINATION

Use browser-native coordination such as:

- `BroadcastChannel`,
- session heartbeat/lease.

Exact implementation may be finalized in vertical slice.

The important invariant:

> two tabs must not both execute durable commands against the same save.

---

# 157. STALE WRITER PROTECTION

Save revision checks prevent stale asynchronous writes from overwriting newer state.

---

# 158. STATE MANAGEMENT — WHY ZUSTAND

Zustand is appropriate for:

- exposing current application state to React,
- selector subscriptions,
- transient UI/session state.

But it must remain a thin adapter.

---

# 159. GAME STORE VS UI STORE

Keep durable and transient concerns separate.

## GAME STORE
mirrors committed canonical GameState/read model.

Updated only by Game Engine.

## UI STORE
contains:
- selected customer,
- open sheet,
- current tab local state,
- filters,
- temporary drafts.

UI Store is not persisted as canonical gameplay.

---

# 160. NO GIANT ACTION STORE

Avoid putting every game rule inside Zustand actions.

Bad:

```text
useGameStore.getState().captureCatchmon()
```

where the store itself calculates probability and consumes items.

Good:

```text
gameEngine.execute(attemptCaptureCommand)
```

then store publishes committed state.

---

# 161. REACT SELECTORS

React components subscribe to minimal derived data.

Example:

```text
useCoins()
useStationViewModel(stationId)
useCustomerTransactionViewModel(customerId)
useCatchmonCardViewModel(catchmonId)
```

Avoid subscribing every component to entire `GameState`.

---

# 162. MEMOIZATION

Memoize expensive derived views where profiling demonstrates value.

Do not premature-cache every selector.

Correctness first.

---

# 163. REACT ROUTING

Use React Router for:

- three primary destinations,
- full-screen workspaces,
- browser-history behavior,
- deep-link-friendly development.

Bottom sheets remain local UI state rather than separate URL routes unless a real deep-link need appears.

---

# 164. PRIMARY ROUTES

Conceptually:

```text
/shop
/catchmons
/world
```

Focused subroutes may include:

```text
/catchmons/:id
/world/:regionId
/world/:regionId/expedition/:routeId
/inventory
/orders
```

Exact route structure may simplify.

---

# 165. BOTTOM-SHEET ROUTING BOUNDARY

Normal:

- customer sheet,
- station quick sheet,
- display sheet

should not necessarily create browser-history entries.

They are contextual interaction state.

---

# 166. BACK BEHAVIOR

UI architecture implements Document 11:

1. close nested interaction,
2. close sheet,
3. return focused workspace,
4. leave primary destination only when appropriate.

---

# 167. PRIMARY TAB STATE PRESERVATION

Keep useful view state for:

- current shop camera/focus,
- Catchmon filters,
- selected World region.

This state belongs to UI store/session memory.

---

# 168. CSS ARCHITECTURE

Use:

- canonical `tokens.css`,
- CSS Modules or carefully scoped CSS,
- semantic class naming.

Do not introduce Tailwind or another token/utility design system by default.

---

# 169. WHY NO TAILWIND BY DEFAULT

The project already has:

- spacing,
- typography,
- colors,
- radius,
- motion tokens.

Adding another design abstraction risks:

- duplicated tokens,
- hardcoded arbitrary values,
- inconsistency.

---

# 170. PIXI SCENE ARCHITECTURE

The shop renderer should be isolated behind a scene adapter.

Conceptual structure:

```text
presentation/scene/
├── ShopSceneHost.tsx
├── ShopSceneRenderer.ts
├── scene-layout.ts
├── scene-view-model.ts
├── entities/
│   ├── CatchmonSprite.ts
│   ├── CustomerSprite.ts
│   ├── StationSprite.ts
│   └── DisplaySprite.ts
├── effects/
└── assets/
```

---

# 171. DIRECT PIXI INTEGRATION

Preferred initial architecture:

- React owns the `<canvas>` host lifecycle.
- `ShopSceneRenderer` owns Pixi application/container lifecycle.
- React passes high-level view-model updates.
- Pixi emits semantic callbacks.

This avoids embedding gameplay state inside renderer objects.

---

# 172. NO PIXI OBJECTS IN GAME STATE

Never persist:

- Sprite,
- Container,
- Texture,
- Point,
- Pixi-specific object.

Game state remains serializable plain data.

---

# 173. SCENE VIEW MODEL

The scene consumes a presentation-only model.

Conceptual:

```text
ShopSceneViewModel
├── shopVisualState
├── stations[]
├── displays[]
├── customers[]
├── catchmons[]
├── expeditionHub
└── readinessMarkers[]
```

Each entry contains only what rendering needs.

---

# 174. SCENE ENTITY ID

Scene entities reference canonical gameplay IDs.

Example:

- station ID,
- customer instance ID,
- owned Catchmon ID.

Renderer-local animation IDs remain separate.

---

# 175. SCENE INTERACTION EVENTS

Pixi emits semantic intents such as:

```text
onStationSelected(stationId)
onCustomerSelected(customerId)
onDisplaySelected(displayId)
onCatchmonSelected(catchmonId)
onExpeditionHubSelected()
```

It does not execute game commands directly.

React/application interaction layer decides what to open/dispatch.

---

# 176. LOGICAL SCENE COORDINATE SPACE

Use a fixed logical design space.

Example:

```text
1920 × 1080 logical units
```

or another chosen aspect-aware space.

All scene anchors are authored in logical coordinates.

Responsive layout maps logical → screen coordinates.

Exact dimensions are implementation tuning.

---

# 177. RESPONSIVE CAMERA

Calculate:

- scale,
- offset,
- safe area,

from viewport.

Do not re-author entity positions independently for every device.

---

# 178. SAFE AREAS

Respect:

- mobile browser chrome,
- notches,
- bottom navigation,
- top HUD.

Critical scene interactions must remain outside obscured zones.

---

# 179. DEPTH SORTING

2.5D entity order should derive from:

- authored layer,
- logical Y position where appropriate.

Do not manually hardcode one z-index for every creature.

---

# 180. HIT AREAS

Interactive Pixi entities use generous hit areas.

They should reflect mobile tap comfort, not exact sprite silhouette.

---

# 181. ACCESSIBLE SCENE ACTIONS

Where practical, important scene interactions should have semantic DOM equivalents/hotspots.

At minimum:

- station,
- display,
- major zone,
- customer action

must have a non-pixel-precision path.

The exact accessibility implementation is validated in vertical slice.

---

# 182. SCENE ANIMATION STATE

Rendering animation is ephemeral.

Examples:

- idle frame,
- reaction animation,
- coin particles.

Do not persist it.

After reload, renderer derives an appropriate current visual state.

---

# 183. ANIMATION COMMANDS

Domain events can trigger presentation events.

Example:

```text
CUSTOMER_SALE_RESOLVED
→ customer reaction
→ coin/momentum effect
```

Presentation consumes them once.

---

# 184. EVENT REPLAY BOUNDARY

Routine VFX events lost due to immediate close/reload do not need replay.

Critical gameplay results are represented in durable state and can show their result screens later.

---

# 185. SCENE PERFORMANCE TARGET

Aim for smooth interaction on mainstream mobile browsers.

Preferred target:

# 60 FPS where feasible

Acceptable graceful degradation:

# 30 FPS under heavier/older devices

Input responsiveness is more important than decorative animation.

---

# 186. PIXI RESOLUTION

Renderer should account for device pixel ratio but cap expensive resolution if needed.

Do not automatically render at extreme DPR on high-density phones without performance testing.

---

# 187. TEXT IN PIXI

Avoid rendering most UI text inside Pixi.

Use DOM for:

- labels,
- buttons,
- sheets,
- accessible text.

Pixi text is reserved for scene-specific visual labels where justified.

---

# 188. ASSET ARCHITECTURE

Runtime code addresses assets via:

# `AssetId`

not hand-built file paths.

---

# 189. ASSET REGISTRY

Canonical asset definitions include:

```text
assetId
category
source/runtime variants
dimensions
alpha
focal point?
anchors?
preload class
```

Content definitions reference asset IDs.

---

# 190. NO STRING-CONCAT PATHS

Forbidden:

```ts
`/assets/catchmons/${catchmonId}.png`
```

unless generated centrally by an asset manifest build process.

Feature code asks the Asset Registry.

---

# 191. VITE ASSET MANIFEST

Use Vite build capabilities such as:

- static imports,
- `import.meta.glob`

to generate runtime asset URL mappings.

The final approach should produce:

- missing-reference build/test errors,
- hashed production URLs.

---

# 192. RESPONSIVE ASSET VARIANTS

The Asset Registry can expose:

- 128,
- 256,
- 512

content variants.

Presentation chooses suitable size based on context.

---

# 193. PRELOAD CLASSES

Assets are classified:

## BOOT
- core UI,
- current shop essentials.

## CURRENT_CONTEXT
- active products/Catchmons/region.

## PREFETCH
- likely next screen.

## ON_DEMAND
- distant regions,
- rare presentation art.

---

# 194. NO FULL CATALOG BOOT LOAD

Do not load:

- all 104 large Catchmon renders,
- all 100 products,
- all 17 full regions

on initial startup.

---

# 195. PIXI ASSET CACHE

Pixi-specific textures may be cached by Asset ID.

Release large context-specific resources where profiling shows memory pressure.

Avoid ad-hoc manual cache keys.

---

# 196. ASSET FAILURE

Missing runtime asset:

Development:
- explicit error + canonical placeholder.

Production:
- safe placeholder + diagnostic telemetry/log.

Never crash the whole save because one art file is missing.

---

# 197. SERVICE WORKER / PWA

PWA/service-worker caching is:

# DEFERRED UNTIL AFTER VERTICAL SLICE

Reason:

- service workers add cache invalidation complexity,
- asset versioning must be stable first.

The game can still be a normal installable-like browser experience later.

---

# 198. SAVE DOES NOT DEPEND ON SERVICE WORKER

Local persistence works through IndexedDB independently.

---

# 199. PLATFORM LIFECYCLE ADAPTER

Create one browser lifecycle service.

It handles:

- visibility change,
- page show,
- page hide,
- online/offline notification if useful,
- viewport changes.

Feature code does not subscribe to `document` independently.

---

# 200. APP BOOT SEQUENCE

Recommended:

1. initialize platform services,
2. load/validate content registries,
3. initialize save repository,
4. acquire active session lease,
5. load save,
6. migrate/validate save,
7. create new save if absent,
8. reconcile to current time,
9. initialize Game Engine/store,
10. mount React,
11. initialize current scene,
12. background-persist reconciled state.

---

# 201. CONTENT BOOT BEFORE SAVE

Content must be valid before applying save IDs against it.

If content integrity fails in development:

> stop boot.

---

# 202. NEW SAVE CREATION

New save creation uses one canonical factory.

Conceptual:

```text
createInitialGameState(catalog, clock, randomSeed)
```

No screen creates default game data.

---

# 203. DEFAULT CONTENT BOUNDARY

Tutorial/starter IDs come from progression/content config.

Do not hardcode starter recipe or Catchmon inside App component.

---

# 204. DEVELOPMENT TOOLS

Provide dev-only utilities for:

- reset save,
- add Coins,
- set Shop Rank,
- unlock region,
- complete timer,
- force encounter,
- set RNG seed,
- inspect state.

These tools accelerate testing.

They must be excluded/disabled from production builds.

---

# 205. DEV TOOLS MUST USE COMMANDS WHERE POSSIBLE

A dev tool can have privileged commands.

Do not manually mutate IndexedDB structures.

This exercises real code paths.

---

# 206. HEADLESS SIMULATION

The domain/application engine must be runnable in Node tests without:

- React,
- Pixi,
- IndexedDB browser APIs.

Use:

- fake clock,
- deterministic RNG,
- in-memory repository/catalog.

---

# 207. ECONOMY SIMULATION

Create simulation tooling capable of:

- scripted player behavior,
- crafting,
- selling,
- upgrading,
- time advance.

Output:

- Coin curves,
- bottlenecks,
- time-to-afford,
- resource pressure.

---

# 208. PROGRESSION SIMULATION

Simulate milestone timeline:

- Rank unlocks,
- station access,
- expedition access,
- first evolution,
- region readiness.

The simulation does not need graphical rendering.

---

# 209. PERSONA SIMULATION

Support behavior profiles such as:

- active optimizer,
- casual returner,
- collector,
- infrastructure-focused,
- inefficient learner.

This implements Document 09's balancing requirement.

---

# 210. UNIT TEST STRATEGY

Unit tests focus on pure rules.

Examples:

- sale quote math,
- Momentum gain/cost,
- recipe validation,
- inventory reservation,
- Catchmon assignment invariants,
- capture chance,
- unlock evaluator,
- modifier stacking.

---

# 211. DOMAIN INTEGRATION TESTS

Test multi-system commands:

- craft consumes materials and reserves queue correctly,
- sale removes stock and adds Coins/Momentum,
- expedition reserves gear and Catchmons,
- capture consumes selected aid and updates collection,
- evolution updates Catchdex/state.

---

# 212. RECONCILIATION TESTS

Critical cases:

- zero elapsed time,
- craft completes exactly at now,
- several queued crafts,
- storage blocks queue,
- expedition completes while offline,
- construction completes,
- long offline duration,
- repeated reconciliation produces no duplicate reward.

---

# 213. SAVE TESTS

Test:

- round trip,
- backup fallback,
- invalid save rejection,
- migration,
- stale revision write,
- schema version transition.

---

# 214. MIGRATION FIXTURE TESTS

Every stored historical schema fixture must:

- load,
- migrate,
- validate,
- preserve required progress.

---

# 215. RNG TESTS

Fixed seed tests should produce fixed expected outcomes.

Do not assert only:

> result is between 0 and 1.

Test deterministic sequence contracts.

---

# 216. CONTENT INTEGRITY TESTS

Run in CI:

- duplicate IDs,
- missing references,
- unsupported values,
- missing assets,
- invalid routes,
- invalid recipe graphs,
- invalid evolution lines.

---

# 217. REACT COMPONENT TESTS

Use React Testing Library for:

- interaction logic,
- visible state,
- disabled reasons,
- bottom-sheet actions,
- accessibility roles.

Do not re-test domain formulas through React tests.

---

# 218. PIXI SCENE TESTING

Do not rely heavily on pixel-perfect snapshots.

Test:

- view-model mapping,
- entity creation/removal,
- semantic interaction events,
- layout coordinate math.

Use visual/manual regression checks for final scene quality.

---

# 219. END-TO-END TESTS

Use Playwright for critical flows:

1. new game → first craft → first sale
2. Momentum → Premium Pitch
3. Catchmon assignment
4. start expedition → advance/reload → result
5. encounter → capture success/failure
6. save reload persistence
7. infrastructure purchase
8. migration smoke test where practical

---

# 220. E2E CLOCK CONTROL

Testing should support deterministic time advancement.

Do not make Playwright wait real minutes for expeditions.

Use test-only clock/dev controls.

---

# 221. CI QUALITY GATES

Every merge/Claude task should pass:

1. formatting/lint
2. TypeScript typecheck
3. unit/integration tests
4. content integrity
5. build
6. relevant E2E smoke where configured

---

# 222. NO “BUILD PASSES” AS ONLY QUALITY BAR

A compiled game can still violate:

- economy invariants,
- content references,
- save migration.

CI must validate domain correctness.

---

# 223. IMPORT BOUNDARY ENFORCEMENT

Use lint rules / project conventions to prevent forbidden layer imports.

For example:

- `domain/**` cannot import `presentation/**`
- `domain/**` cannot import browser-only packages.

This turns architecture from prose into enforcement.

---

# 224. CIRCULAR DEPENDENCY AUDIT

Avoid circular imports among domain systems.

Cross-domain orchestration belongs to application layer.

---

# 225. DOMAIN OWNERSHIP EXAMPLE

Crafting should not import Customer internals.

If selling needs product properties:

- shared product definition,
- application query,
- economy utility.

Do not create crafting ↔ customer circular knowledge.

---

# 226. APPLICATION TRANSACTION MODEL

A cross-domain command should create one coherent next state.

Conceptually:

```text
previous GameState
+
Command
+
Catalog
+
Clock/RNG
↓
CommandResult
↓
next GameState + events
```

Either the complete command succeeds or no durable partial mutation is committed.

---

# 227. NO PARTIAL COMMAND COMMIT

Example:

Start Expedition must not:

- reserve gear,
- then fail Catchmon validation,
- leave gear stuck.

Validation/transaction logic must be atomic.

---

# 228. IMMUTABILITY

Domain transformations should not mutate shared prior state unexpectedly.

Implementation may use:

- explicit immutable updates,
- a controlled immutable-update helper.

The architectural requirement is deterministic state transition behavior.

---

# 229. IMMER BOUNDARY

If Immer is introduced:

- it is an implementation helper,
- it does not become gameplay architecture,
- drafts never escape command execution.

It is optional, not required by this document.

---

# 230. SELECTOR ARCHITECTURE

Queries are split into:

## DOMAIN QUERIES
pure game meaning.

## PRESENTATION SELECTORS
assemble view models.

Example:

Domain:
- `getAvailableInventoryQuantity`
- `getCaptureChance`

Presentation:
- `getCaptureScreenViewModel`.

---

# 231. VIEW MODEL RULE

A view model may contain:

- formatted text-ready values,
- status labels/keys,
- asset IDs,
- enabled/disabled actions.

It must not become a second source of game truth.

---

# 232. FORMATTING

Formatting belongs near presentation.

Examples:

- `1,250 Coins`
- `2h 10m`
- `73.5%`

Domain uses raw canonical units.

---

# 233. LOCALIZATION BOUNDARY

Do not bake player-visible text into game formulas/assets.

At minimum:

- stable IDs,
- separate presentation copy.

A full i18n library may be selected later when localization scope is known.

---

# 234. TELEMETRY ARCHITECTURE

Create a vendor-neutral telemetry port.

Conceptual:

```ts
interface Telemetry {
  track(event: TelemetryEvent): void
}
```

Initial implementation may be no-op/dev console.

---

# 235. TYPED TELEMETRY EVENTS

Events should be typed and minimal.

Examples:

- system unlocked,
- craft started/completed,
- sale action type,
- expedition started/completed,
- capture attempted,
- capture result.

Do not dump full save state.

---

# 236. PRIVACY BOUNDARY

Do not collect unnecessary personal data.

The base game architecture needs gameplay telemetry, not identity tracking.

Final analytics/privacy decisions require explicit product work.

---

# 237. LOGGING

Development logging may include:

- command,
- revision,
- domain event,
- reconciliation summary.

Production logging should be controlled.

Do not log entire saves by default.

---

# 238. COMMAND DEBUG TRACE

A dev tool should be able to display:

```text
revision
command
events
state areas changed
```

This is extremely useful for Claude Code debugging.

---

# 239. PERFORMANCE ARCHITECTURE — PRIMARY RULE

Performance optimization follows measured bottlenecks.

But several structural protections are required from the start.

---

# 240. REACT PERFORMANCE

Avoid:

- entire app rerender on timer tick,
- entire GameState subscriptions,
- inline huge derived calculations.

Use focused selectors.

---

# 241. TIMER PERFORMANCE

One shared visual clock/ticker can drive visible countdown labels.

Do not create a separate interval per station/customer/expedition.

---

# 242. PIXI PERFORMANCE

Use:

- texture reuse,
- limited filters,
- bounded particles,
- sprite/container pooling where measured useful,
- capped DPR.

Avoid expensive blur/filter stacks in normal scene.

---

# 243. ENTITY COUNT

The shop design does not require hundreds of simultaneous scene entities.

Render only:

- visible customers,
- selected visible Catchmons,
- relevant props.

This aligns with Document 08.

---

# 244. CATCHMON VISIBILITY

Do not render all 104 Catchmons in the shop.

Use contextual/assigned/roaming subset.

---

# 245. CUSTOMER VISIBILITY

Only active customers exist visually.

No giant offline backlog.

---

# 246. IMAGE MEMORY

Use appropriately sized runtime variants.

Release/avoid loading:

- distant region backdrops,
- unused large portraits.

---

# 247. CODE SPLITTING

Lazy-load focused application areas where useful:

- Catchdex,
- World detail,
- Inventory,
- dev tools.

Do not over-split tiny components.

---

# 248. MAIN SHOP BOOT PRIORITY

Initial boot should prioritize:

1. shell/UI,
2. current shop scene,
3. current visible Catchmons/customers,
4. immediate station/product assets.

Other content loads later.

---

# 249. PERFORMANCE MEASUREMENT

Vertical slice should measure:

- startup time,
- interaction latency,
- main-thread spikes,
- memory,
- FPS,
- asset transfer.

Use actual mobile devices where possible.

---

# 250. PERFORMANCE BUDGET VALUES

Exact numeric budgets are not locked here.

Document 15 should define vertical-slice acceptance targets based on test hardware.

---

# 251. ACCESSIBILITY ARCHITECTURE

React DOM owns semantic UI.

Use:

- buttons,
- headings,
- labels,
- focus management,
- ARIA only when needed.

Do not rebuild native semantics with divs.

---

# 252. FOCUS MANAGEMENT

When opening a bottom sheet/full-screen workspace:

- move focus appropriately,
- restore focus on close,
- trap focus only for true modal states.

---

# 253. PIXI ACCESSIBILITY BOUNDARY

The shop canvas is visual.

Core interactions need a semantic path through:

- overlay controls,
- equivalent accessible lists/actions,
- or mapped scene hotspots.

The vertical slice should validate the practical approach.

---

# 254. REDUCED MOTION

Use platform preference.

Presentation can switch:

- transition intensity,
- particles,
- camera motion.

Domain logic is unaffected.

---

# 255. RESPONSIVE ARCHITECTURE

Mobile is canonical.

Desktop expands space.

Do not create separate business logic/layout data per platform.

---

# 256. POINTER INPUT

Support:

- touch,
- mouse.

Keyboard enhancements can exist.

Core play cannot require hover.

---

# 257. STATIC DEPLOYMENT

Initial production can deploy as static assets:

```text
index.html
JS/CSS bundles
asset files
```

No game API required.

---

# 258. ENVIRONMENT VARIABLES

Client-side environment variables are public.

Do not put:

- API secrets,
- private tokens

inside Vite client env.

---

# 259. DEPLOYMENT CACHE STRATEGY

Hashed build assets can receive long cache lifetimes.

HTML/app entry should update normally.

Exact hosting headers belong to deployment setup.

---

# 260. NO SERVICE WORKER FIRST

Avoid stale-version debugging until:

- asset manifest,
- save migrations,
- deployment versioning

are proven.

---

# 261. APP VERSION

Expose build/app version for:

- save diagnostics,
- bug reports,
- migration logs.

Do not use version as gameplay content ID.

---

# 262. CONTENT VERSION

Maintain a separate content version when useful.

Purpose:

- identify balance/content pack used,
- activity snapshot diagnostics.

---

# 263. SCHEMA VERSION

Save schema version is independent of:

- app version,
- content version.

This separation is mandatory.

---

# 264. FEATURE FLAGS

Technical feature flags may control unfinished features.

They are not player progression.

Use them for:

- dev rollout,
- incomplete implementation.

Do not use Shop Rank conditions as a substitute for feature readiness.

---

# 265. PRODUCTION FEATURE SAFETY

A progression unlock must not expose an incomplete feature.

Feature flag + progression condition both must allow it.

---

# 266. TEST FEATURE FLAGS

Tests should explicitly set feature configuration.

Do not depend on random environment flags.

---

# 267. CLAUDE CODE — PRIMARY IMPLEMENTATION RULE

Claude Code must implement:

> **approved design through owner documents and canonical architecture — never fill an undefined design gap with invented gameplay.**

If a required design value is open:

- use a centralized provisional value only when implementation requires it,
- mark it clearly,
- report it.

---

# 268. CLAUDE CODE CONTEXT RULE

For each task Claude should read:

1. `CLAUDE.md`
2. `docs/00_PROJECT_INDEX.md`
3. the owner design doc for the task
4. Document 14 relevant technical sections
5. direct dependent code/data only

Do not load 01–14 in full for every change.

---

# 269. CLAUDE TASK SIZE

Tasks should be small enough to:

- understand one feature boundary,
- implement,
- test,
- report.

Avoid prompts such as:

> “Build the entire crafting/customer/expedition game.”

---

# 270. CLAUDE OUTPUT REQUIREMENT

Every implementation task should report:

- files added/changed,
- canonical data introduced,
- tests added,
- design assumptions,
- provisional values,
- unresolved gaps.

---

# 271. NO LEGACY CODE COPY

Do not wholesale copy old Catchmon project feature folders.

Only approved canonical reference content is reusable.

Explicitly prohibited legacy imports include:

- Funken economy,
- old production formulas,
- old skill trees,
- prestige,
- old team limits,
- old spawn logic,
- old catch chance,
- old region thresholds,
- legacy Harvest loop.

---

# 272. LEGACY SOURCE REVIEW RULE

If Claude consults old code to locate canonical content:

> content may be extracted; gameplay behavior is not assumed valid.

Any reused logic requires explicit approval against current documents.

---

# 273. CLAUDE NO-HARDCODING RULE

Claude must not add:

- magic recipe prices,
- inline capture percentages,
- UI-specific Catchmon bonuses,
- string-ID special cases

when a registry/config/effect system should own them.

---

# 274. CLAUDE NO-DUPLICATION RULE

Before adding a:

- type,
- registry,
- constant,
- icon,
- effect,
- formatter,

Claude must search for an existing canonical equivalent.

---

# 275. CLAUDE TEST RULE

A domain/gameplay task is incomplete until deterministic tests cover its new rules.

UI-only tasks require appropriate component/interaction tests where practical.

---

# 276. CLAUDE ASSET RULE

Claude must not invent production art filenames.

Use:

- Asset Registry,
- canonical placeholder.

Report missing approved asset IDs.

---

# 277. CLAUDE MIGRATION RULE

Any durable GameState schema change requires:

- schema-version decision,
- migration if existing saves are expected,
- migration fixture test.

During pre-save prototype phases, schema-reset policy may be explicitly authorized by Document 15.

---

# 278. CLAUDE DEPENDENCY RULE

Do not install a new package because it is convenient.

A new dependency must have a clear architectural reason.

Prefer platform/current stack capabilities first.

---

# 279. DEPENDENCY APPROVAL CHECK

Before adding dependency:

- what problem?
- why existing stack cannot solve cleanly?
- runtime bundle impact?
- maintenance health?
- TypeScript support?
- browser support?

Small helper logic often belongs in project code.

---

# 280. NO FRAMEWORK CREEP

Do not add:

- Redux,
- another state manager,
- another rendering engine,
- another CSS system,
- another schema library

alongside approved equivalents.

---

# 281. CODE STYLE

Prefer:

- descriptive function names,
- small domain modules,
- explicit types,
- discriminated unions,
- pure functions,
- clear guards.

Avoid:

- clever meta-programming,
- huge generic abstractions,
- deeply nested callbacks.

---

# 282. ABSTRACTION RULE

Build abstractions when at least one of these is true:

- canonical reuse is already known,
- a domain boundary requires it,
- duplication exists,
- testing requires injection.

Do not abstract hypothetical future systems.

---

# 283. FILE SIZE RULE

No fixed line limit is necessary.

But a file containing several unrelated responsibilities should be split.

Claude should not create monolithic:

- `game.ts`,
- `store.ts`,
- `utils.ts`

containing the entire product.

---

# 284. `utils.ts` RULE

Prefer domain-specific names:

- `moneyMath.ts`
- `captureProbability.ts`
- `timeMath.ts`

rather than dumping unrelated helpers into generic `utils.ts`.

---

# 285. CONTENT FILE SCALING

Large registries may be split by:

- product family,
- region,
- evolution line group.

A canonical aggregator provides the complete registry.

---

# 286. ID DUPLICATE CHECK

Automated test/build validation must reject duplicate IDs across split content files.

---

# 287. RECIPE GRAPH VALIDATION

Validate:

- no invalid prerequisite references,
- dependency depth constraints where defined,
- no unintended cycles,
- ingredients exist.

---

# 288. EVOLUTION GRAPH VALIDATION

Validate:

- each species belongs to valid line,
- stage ordering,
- no cycles,
- one current progression path unless explicitly branched.

---

# 289. REGION VALIDATION

Validate:

- 17 canonical real element IDs,
- no Bug element,
- stable region references,
- no legacy Funken fields in new active definitions.

---

# 290. LEGACY LEAK TEST

Add content/code search validation where practical for forbidden legacy terms such as:

```text
funken
sparksThreshold
prestige
harvest
```

This is a warning/guardrail, not a naive blanket ban on documentation/reference files.

Active `src/` should not contain legacy gameplay implementations without explicit justification.

---

# 291. SAVE INVARIANT CHECKS

Development/test invariant validation should include:

- non-negative Coins,
- no over-reserved inventory,
- one Catchmon duty,
- no duplicate owned functional line instance,
- no duplicate active expedition ID,
- no resolved encounter remaining active,
- valid content IDs.

---

# 292. PRODUCTION INVARIANT RESPONSE

If production detects repairable invalid state:

- log diagnostic,
- apply narrowly defined repair/migration rule.

Do not silently invent replacement content.

---

# 293. RECOVERY MODE

If save cannot migrate/validate:

- preserve raw backup,
- offer safe error/recovery UX,
- do not overwrite corrupted source immediately.

Exact user-facing recovery UI is later implementation work.

---

# 294. SAVE EXPORT/IMPORT BOUNDARY

A manual save export/import feature may be valuable for local-first backup.

It is:

# optional post-vertical-slice.

If implemented:

- validate imported schema,
- never eval/execute imported data.

---

# 295. SECURITY

The client should follow normal web safety:

- no eval of content,
- no untrusted HTML injection,
- sanitize any future external content,
- no secrets in bundle.

The base game's local content is trusted build-time data.

---

# 296. CONTENT SECURITY POLICY

Generated/user-authored content is not currently part of base architecture.

If added later, it becomes an untrusted boundary requiring validation/sanitization.

---

# 297. BROWSER SUPPORT TARGET

Target modern:

- Chrome/Chromium,
- Safari/iOS Safari,
- Firefox,
- Edge

consistent with current Vite modern browser expectations.

No Internet Explorer support.

---

# 298. IOS SAFARI TESTING

Because the game is mobile-first, iOS Safari is a first-class test target.

Specifically test:

- IndexedDB persistence,
- background/resume,
- canvas/WebGL behavior,
- viewport safe areas,
- touch input.

---

# 299. ANDROID TESTING

Test at least:

- mainstream Android Chrome,
- mid-range hardware,
- high-DPR device.

---

# 300. PIXI FALLBACK BOUNDARY

PixiJS should use its supported renderer path.

The game should degrade effects if rendering capability is constrained.

Do not maintain an entirely separate hand-built Canvas game renderer unless real requirements emerge.

---

# 301. BROWSER BACKGROUND THROTTLING

Do not depend on timers continuing accurately while backgrounded.

Timestamp reconciliation solves this.

---

# 302. OFFLINE NETWORK STATUS

Network offline does not pause local gameplay.

Since the game is client-local:

- crafting/expeditions continue by timestamps.

Asset availability depends on what the browser has loaded/cached until PWA/offline assets are implemented.

---

# 303. CLOUD-SAVE FUTURE PORT

If cloud save is added:

- local `SaveRepository` remains,
- `RemoteSaveRepository` / sync coordinator is added,
- merge/conflict policy becomes a new architecture decision.

Do not pre-build conflict resolution now.

---

# 304. SERVER AUTHORITY FUTURE BOUNDARY

If future competitive/shared economy is added:

- client state can no longer be authoritative,
- economy/capture validation moves server-side.

This is a major architecture revision, not a small feature.

---

# 305. PACKAGE MANAGER

Use one package manager consistently.

Recommended:

# `pnpm`

because it is efficient and lockfile-driven.

If the repository already standardizes on npm before implementation, consistency may outweigh switching.

Do not keep multiple lockfiles.

---

# 306. NODE VERSION PIN

Commit a project Node version indicator such as:

- `.nvmrc`,
- `.node-version`,
- package `engines`.

Recommended bootstrap line:

# Node 24 LTS

unless dependency compatibility at implementation start requires adjustment.

---

# 307. LOCKFILE

Commit the package manager lockfile.

CI uses frozen/locked dependency install.

---

# 308. DEPENDENCY VERSION POLICY

Use stable releases.

Avoid:

- alpha,
- beta,
- unstable APIs

for core architecture unless explicitly justified.

---

# 309. REACT EXPERIMENTAL FEATURES

Do not make the game depend on unstable React features.

Plain client React is sufficient.

---

# 310. ROUTER MODE

Use React Router primarily in client-side SPA/library mode.

Do not introduce React Router server framework mode merely because it exists.

---

# 311. STATE SERIALIZABILITY

Canonical GameState must consist of serializable data:

- objects,
- arrays,
- strings,
- numbers,
- booleans,
- null where schema permits.

Avoid:

- class instances,
- functions,
- DOM nodes,
- Map/Set unless explicitly normalized,
- Pixi objects.

---

# 312. MAP / SET BOUNDARY

Use plain object/record/array in durable save state.

Runtime derived indexes may use `Map`/`Set`.

Do not persist them directly unless serialization is explicitly defined.

---

# 313. DATE OBJECT BOUNDARY

Persist numbers for timestamps.

Do not store JavaScript `Date` objects as game truth.

---

# 314. DATABASE SHAPE

Dexie may store the save envelope as a single canonical snapshot row plus backup rows.

Do not prematurely normalize every domain into separate IndexedDB tables.

---

# 315. WHY SNAPSHOT ROW FIRST

The game command model expects atomic whole-state transitions.

A snapshot:

- simplifies migrations,
- simplifies backups,
- avoids cross-table consistency bugs.

State size is expected to remain manageable.

---

# 316. DATABASE TABLES — INITIAL

Minimal concept:

```text
saves
saveBackups
preferences
```

Potential diagnostics/dev tables only if needed.

---

# 317. DO NOT STORE LARGE ASSETS IN SAVE DB

Images/assets remain application assets/cache.

Save contains IDs only.

---

# 318. SAVE SIZE MONITORING

Development tooling should report serialized save size.

If state begins growing unexpectedly:

- find duplicated/derived data.

---

# 319. EVENT QUEUE SIZE

Presentation event queues should be bounded/ephemeral.

Do not let old VFX events accumulate in save.

---

# 320. PENDING RESULT SIZE

Pending expedition/capture results may persist.

They should contain:

- semantic IDs/quantities,
- seeds/context where necessary,

not duplicated full definition objects.

---

# 321. COMMAND CONCURRENCY

UI should prevent obvious double-submit.

Game Engine must still be safe against it.

Commands execute serially through one queue/mutex in the active client.

---

# 322. ENGINE COMMAND QUEUE

Use one application-level execution queue so async persistence/platform actions do not interleave durable state mutation unpredictably.

---

# 323. PERSISTENCE IS AFTER STATE COMMIT

Game command execution should not block on disk write for every small action unless durability requirements dictate it.

State commit → persistence scheduling.

Critical operations can request immediate flush.

---

# 324. UI OPTIMISTIC BOUNDARY

Because the game is local:

- successful domain command can update UI immediately.

There is no network round-trip.

Do not implement server-style optimistic rollback complexity.

---

# 325. ASYNC COMMANDS

Most gameplay commands should remain synchronous pure transformations after preconditions are loaded.

Browser I/O occurs around engine boundaries.

---

# 326. ASYNC ASSET LOAD

Scene may display canonical placeholder while asset loads.

Gameplay state must not wait for a decorative asset.

---

# 327. ERROR BOUNDARIES

React should use error boundaries around major presentation areas.

A broken optional panel should not destroy the save.

---

# 328. SCENE ERROR BOUNDARY

If Pixi initialization fails:

- report diagnostic,
- show safe fallback/limited shop interaction UI where feasible.

Do not corrupt state.

---

# 329. CONTENT HASH / VALIDATION

Build may generate a content hash/version.

Useful for:

- diagnostics,
- cache,
- active activity snapshot metadata.

Not required as a gameplay mechanic.

---

# 330. REGISTRY IMMUTABILITY

Canonical content definitions should be treated as immutable at runtime.

Do not modify a recipe definition because the player has a Catchmon bonus.

Calculate derived result separately.

---

# 331. MODIFIER TARGETING

Effect evaluators receive:

- definition,
- player state,
- context.

They do not mutate canonical definitions.

---

# 332. VIEW-MODEL ASSET RESOLUTION

Presentation view models may resolve:

- semantic Asset ID,
- current visual variant.

Actual URL/Texture resolution occurs in asset infrastructure/presentation adapter.

---

# 333. QUALITY ART RESOLUTION

A Product instance stores:

- product ID,
- quality.

UI resolves:

- base product asset,
- quality treatment.

Do not store `masterworkProductImageUrl` per item instance.

---

# 334. SHINY ART RESOLUTION

Catchmon owned state stores shiny availability/current appearance.

Asset resolver determines standard/shiny asset.

Gameplay capability remains unchanged.

---

# 335. ELEMENT VISUAL RESOLUTION

Content references `ElementId`.

Presentation resolves:

- token,
- icon,
- region accent.

No raw hex in game state.

---

# 336. CSS TOKEN IMPORT

Canonical design tokens should be imported once at app root.

Feature CSS references variables.

Do not copy token values into component CSS.

---

# 337. MOTION TOKENS

Presentation animation helpers should reference canonical motion tokens.

Do not use arbitrary `transition: 237ms` values scattered across components.

---

# 338. TESTING TOKEN INTEGRITY

A lightweight test/style audit may verify required CSS variables exist.

Do not duplicate theme constants in TypeScript unless mapping is required.

---

# 339. ASSET GENERATED TYPES

Build tooling may generate:

```ts
type AssetId = ...
```

or validated asset registry types.

Avoid manually maintaining hundreds of string literal unions if generation can be reliable.

---

# 340. CONTENT GENERATED TYPES BOUNDARY

Do not generate core domain types from content data.

Domain types remain authored.

Generated helpers may derive ID unions/manifests.

---

# 341. BUILD SCRIPTS

Useful scripts may include:

```text
pnpm dev
pnpm build
pnpm typecheck
pnpm lint
pnpm test
pnpm test:e2e
pnpm validate:content
pnpm validate:assets
pnpm simulate:economy
pnpm simulate:progression
```

Exact naming can be finalized at bootstrap.

---

# 342. ONE-COMMAND QUALITY CHECK

Create a command such as:

```text
pnpm check
```

that runs the normal local quality gate.

Claude should run it after substantive tasks.

---

# 343. FAST TASK TESTING

Claude may run targeted tests during iteration.

Before completion:

- full relevant domain suite,
- typecheck,
- content validation,
- build as appropriate.

---

# 344. TEST LOCATION

Tests may colocate with domain modules:

```text
crafting.rules.test.ts
```

or live in a parallel structure.

Consistency matters more than exact convention.

---

# 345. FIXTURE FACTORIES

Use test factories for:

- GameState,
- product definitions,
- Catchmons,
- routes.

Avoid huge hand-written save objects in every test.

---

# 346. FACTORY DEFAULTS

Factories create valid minimal state.

Tests override only relevant fields.

This makes domain intent clear.

---

# 347. SIMULATION SEEDS

Every simulation output records:

- seed,
- balance/content version,
- persona parameters.

Results can be reproduced.

---

# 348. BALANCE REPORT OUTPUT

Simulation should produce machine-readable tables/CSV/JSON plus human summary.

Do not make balancing dependent on manually reading console spam.

---

# 349. NO RENDERING IN BALANCE SIMULATION

Simulations import domain/application packages only.

If importing a balance simulator pulls React/Pixi:

> dependency boundaries are broken.

---

# 350. PROFILING BUILD

Vertical slice should provide a production-like build for performance profiling.

Development HMR performance is not representative.

---

# 351. DEBUG OVERLAY

A dev-only scene overlay may show:

- FPS,
- visible entity count,
- texture count,
- logical coordinates,
- current revision.

Useful for tuning.

---

# 352. GAME STATE INSPECTOR

Dev-only inspector can show:

- selected slices,
- active activities,
- reservations,
- RNG counter,
- save revision.

Avoid exposing private implementation to production users.

---

# 353. CONTENT INSPECTOR

Dev screen may list:

- registry IDs,
- missing references,
- asset state.

This is particularly helpful for AI-assisted content work.

---

# 354. FEATURE OWNERSHIP COMMENTS

Complex modules should include a short reference to owner doc/section where useful.

Do not paste whole design docs into code comments.

---

# 355. DESIGN DOC REFERENCES

Example:

```text
// Design owner: 07 Acquisition & Expeditions — capture failure protection.
```

This helps future Claude tasks find the right specification.

---

# 356. NO DESIGN DUPLICATION IN CODE COMMENTS

Code comments explain:

- why implementation is unusual,
- invariants,
- technical tradeoff.

They should not become a second design Bible.

---

# 357. ARCHITECTURE DECISION RECORDS

For major implementation choices not already owned by this document, create small ADRs.

Examples:

- exact Pixi integration mode,
- selected PRNG algorithm,
- save compression if added.

Do not create ADRs for trivial choices.

---

# 358. ADR LOCATION

Recommended:

```text
docs/architecture/adr/
```

Each ADR:

- context,
- decision,
- consequences.

---

# 359. TECHNICAL DEBT RULE

Temporary shortcuts must be explicit.

Use:

- TODO with reason/owner,
- task/issue,
- provisional marker.

Do not disguise placeholder architecture as final.

---

# 360. PROVISIONAL BALANCE VALUE RULE

A provisional number must live in:

- central balance config,
- tagged/commented `PROVISIONAL`.

Never inline it in logic.

---

# 361. PROVISIONAL CONTENT RULE

Prototype content IDs should be clearly marked.

When replaced, migrate/reset according to Document 15 phase policy.

---

# 362. VERTICAL-SLICE SCHEMA POLICY

Document 15 should define when save backward compatibility starts being mandatory.

During earliest prototype, controlled save resets may be allowed.

After persistence milestone:

- migrations required.

---

# 363. ARCHITECTURE FREEZE POINT

After vertical slice validates:

- layer model,
- save architecture,
- scene renderer,
- content registry,

major architectural changes require deliberate review.

Before that, targeted refactoring is expected.

---

# 364. TECHNICAL IMPLEMENTATION PHASES

Recommended broad engineering phases:

## T0 — FOUNDATION
tooling, layers, content validation.

## T1 — HEADLESS CORE
state, inventory, economy, crafting.

## T2 — SHOP INTERACTION
customers, Momentum, displays.

## T3 — CATCHMONS
roster, assignment, level shell.

## T4 — WORLD
expeditions, RNG, capture.

## T5 — PERSISTENCE/OFFLINE HARDENING
migrations, idempotency.

## T6 — PIXI SHOP
living scene.

## T7 — VERTICAL SLICE POLISH
UX, art, performance.

Exact task breakdown belongs to Document 15.

---

# 365. WHY HEADLESS BEFORE PIXI

The game should be playable through tests/dev panels before final scene rendering.

This prevents:

- rendering bugs masking game rules,
- UI-first hardcoding,
- expensive visual rework.

---

# 366. WHY PERSISTENCE EARLY ENOUGH

Offline progression is core.

Persistence cannot be bolted on at the end.

But it should follow a stable initial GameState shape rather than precede all domain work.

---

# 367. SCENE AFTER CORE LOOP

The living Pixi shop should be added after:

- crafting,
- customer transactions,
- assignment states

already have working domain APIs.

Then the scene becomes a renderer for proven state.

---

# 368. NO FULL CONTENT BEFORE VERTICAL SLICE

Technical architecture must handle scale.

But implementation uses a small content subset until systems pass.

Do not load 104 gameplay mappings and 17 full regions before core loops work.

---

# 369. PROTOTYPE CATALOG

Use canonical placeholder/test content through the same registries.

Do not build separate hardcoded “prototype mode” logic.

---

# 370. CONTENT SCALE TEST

Before full content production:

- generate synthetic registry volume where needed,
- test list/render/validation performance.

This checks architecture without requiring final art/content.

---

# 371. SHOP SCENE SCALE TEST

Use placeholder entities to simulate expected busy scene:

- customers,
- Catchmons,
- stations,
- displays,
- VFX.

Performance can be tested before full art exists.

---

# 372. SAVE SCALE TEST

Create synthetic near-full progression state and measure:

- serialization time,
- DB write,
- load,
- migration,
- save size.

---

# 373. CONTENT VALIDATION PERFORMANCE

Validation runs:

- at development boot/CI.

Production can use prevalidated bundled content and lightweight checks.

Do not spend significant startup time revalidating thousands of static relations if build already guarantees them.

---

# 374. PRODUCTION BUILD CONTENT ASSERTIONS

Critical build-time generated manifest should only include valid canonical content.

If build validation fails:

> do not ship.

---

# 375. ERROR TELEMETRY FUTURE

A vendor such as Sentry may be added later.

Architecture should keep error reporting behind an adapter.

Do not select a vendor merely for Document 14 completeness.

---

# 376. ANALYTICS FUTURE

Likewise, gameplay analytics vendor remains open.

Typed event vocabulary exists independently.

---

# 377. CLOUD HOSTING FUTURE

Static hosting can use many providers.

The architecture does not depend on one.

---

# 378. DESKTOP PACKAGING FUTURE

If later packaged through Tauri/Electron:

- domain/application architecture remains reusable.

Do not include desktop-shell code now.

---

# 379. NATIVE MOBILE FUTURE

A future native wrapper would be a new platform decision.

The browser/PWA path remains canonical for initial development.

---

# 380. DATA EXPORT FUTURE

Because state is plain serializable data, debugging/export tools are possible later.

This is a benefit of the architecture, not a current feature requirement.

---

# 381. MAIN TECHNICAL RISKS

Primary risks:

1. feature scope causing state-store monolith,
2. UI/Pixi leaking gameplay rules,
3. content registries drifting/duplicating,
4. offline reconciliation double-awarding,
5. RNG rerolls after reload,
6. inventory reservation conflicts,
7. save migrations ignored until late,
8. mobile asset/render memory,
9. all content loaded on boot,
10. Claude adding convenient legacy/hardcoded shortcuts.

---

# 382. RISK MITIGATION — STATE MONOLITH

Mitigate through:

- domain slices/modules,
- command engine,
- public APIs,
- selectors.

One root GameState does not mean one giant implementation file.

---

# 383. RISK MITIGATION — UI LOGIC

Mitigate through:

- headless tests,
- query APIs,
- import boundaries,
- code review.

---

# 384. RISK MITIGATION — OFFLINE DUPLICATION

Mitigate through:

- timestamps,
- statuses,
- activity IDs,
- idempotent reconciliation,
- persisted results.

---

# 385. RISK MITIGATION — RNG RELOAD EXPLOIT

Mitigate through:

- deterministic event seeds,
- stored resolved results,
- monotonic RNG counter.

---

# 386. RISK MITIGATION — INVENTORY CONFLICT

Mitigate through:

- central reservation ledger,
- atomic commands.

---

# 387. RISK MITIGATION — MIGRATIONS

Mitigate through:

- schema version from first persistent milestone,
- fixture tests.

---

# 388. RISK MITIGATION — ASSETS

Mitigate through:

- Asset Registry,
- variants,
- lazy load,
- Golden Samples,
- performance profiling.

---

# 389. RISK MITIGATION — CLAUDE

Mitigate through:

- CLAUDE.md,
- Project Index,
- scoped tasks,
- owner docs,
- tests,
- central registries,
- forbidden dependency/hardcoding rules.

---

# 390. TECHNICAL ANTI-PATTERNS

The following are explicitly prohibited.

---

## ANTI-PATTERN A — REACT AS GAME ENGINE

Business rules live in hooks/components.

Result:
untestable and duplicated logic.

---

## ANTI-PATTERN B — PIXI AS GAME STATE

Sprite objects contain authoritative quantities/timers.

Result:
save/render coupling.

---

## ANTI-PATTERN C — ONE GIANT ZUSTAND STORE WITH RULES

Every feature directly calls `set()`.

Result:
cross-feature mutation chaos.

---

## ANTI-PATTERN D — `Date.now()` EVERYWHERE

Time logic cannot be tested.

Result:
offline bugs.

---

## ANTI-PATTERN E — `Math.random()` EVERYWHERE

Reload rerolls and flaky tests.

Result:
capture/loot inconsistency.

---

## ANTI-PATTERN F — COUNTDOWN SAVE STATE

Remaining seconds decrement constantly.

Result:
background timer failure and write spam.

---

## ANTI-PATTERN G — LOCALSTORAGE SAVE

Entire growing game save stored as one casual string.

Result:
weak transactional/migration handling.

---

## ANTI-PATTERN H — NO SAVE VERSION

Schema evolves informally.

Result:
player data breakage.

---

## ANTI-PATTERN I — FULL EVENT SOURCING

Every click saved as permanent event log.

Result:
complexity without need.

---

## ANTI-PATTERN J — FILE PATH AS CONTENT ID

Gameplay assumes filenames.

Result:
asset refactors break saves/content.

---

## ANTI-PATTERN K — STRING NAME BRANCHING

`if catchmon.name === ...`.

Result:
special-case sprawl.

---

## ANTI-PATTERN L — REGISTRY DUPLICATION

Recipe/product/Catchmon definitions copied into features.

Result:
source-of-truth failure.

---

## ANTI-PATTERN M — FLOAT MODIFIER SOUP

Uncontrolled percentages multiply everywhere.

Result:
balance drift.

---

## ANTI-PATTERN N — SEPARATE INVENTORIES PER FEATURE

Orders/expeditions/displays each track stock.

Result:
double-spending bugs.

---

## ANTI-PATTERN O — EVERY SYSTEM PRELOADS EVERYTHING

Full content loaded at boot.

Result:
mobile startup/memory problems.

---

## ANTI-PATTERN P — BACKEND BEFORE NEED

Accounts/API/cloud built before core loop.

Result:
delayed gameplay iteration.

---

## ANTI-PATTERN Q — TAILWIND TOKEN DUPLICATION

Second styling system conflicts with canonical tokens.

Result:
design drift.

---

## ANTI-PATTERN R — LEGACY COPY-PASTE

Old Funken/prestige/Harvest code enters new source tree.

Result:
new architecture contaminated.

---

## ANTI-PATTERN S — “TEMP” MAGIC NUMBERS

Prototype constants scattered in components.

Result:
they become permanent.

---

## ANTI-PATTERN T — UNTESTED CLAUDE PATCH

Gameplay change with no deterministic tests.

Result:
invisible regressions.

---

# 391. FOUNDATION ACCEPTANCE CRITERIA

Before gameplay implementation proceeds, foundation should provide:

- React/Vite TypeScript app boots,
- strict typecheck,
- test runner,
- layer folders,
- content validation framework,
- GameState factory,
- Clock/RNG interfaces,
- command engine skeleton,
- in-memory test harness.

---

# 392. PERSISTENCE ACCEPTANCE CRITERIA

Persistence is ready when:

- save create/load works,
- schema validation works,
- revisioning works,
- previous backup exists,
- migration fixture exists,
- offline reconciliation is called on load.

---

# 393. RANDOMNESS ACCEPTANCE CRITERIA

RNG architecture is ready when:

- seeded output is reproducible,
- reloading does not reroll stored results,
- event counter persists,
- protection tests pass.

---

# 394. INVENTORY ACCEPTANCE CRITERIA

Inventory is ready when:

- quantities cannot go negative,
- reservations cannot exceed total,
- atomic consume/reserve/release works,
- two systems cannot reserve same units.

---

# 395. CRAFTING ACCEPTANCE CRITERIA

Crafting technical layer is ready when:

- recipe definitions validate,
- materials reserve/consume correctly,
- craft time uses timestamp,
- queue reconciles offline,
- storage block protects output,
- deterministic tests pass.

---

# 396. CUSTOMER ACCEPTANCE CRITERIA

Customer technical layer is ready when:

- active customer generated deterministically,
- quote options come from domain query,
- sale changes inventory/economy atomically,
- no offline backlog simulation,
- reload preserves active request.

---

# 397. CATCHMON ACCEPTANCE CRITERIA

Catchmon technical layer is ready when:

- canonical species/line split exists,
- ownership uses stable IDs,
- one-duty invariant enforced,
- assignment queries work,
- XP/evolution commands tested.

---

# 398. EXPEDITION ACCEPTANCE CRITERIA

Expeditions are ready when:

- team/loadout validates,
- items reserve,
- Catchmons lock assignment,
- timestamp completion reconciles,
- result generates once,
- team releases,
- encounter persists.

---

# 399. CAPTURE ACCEPTANCE CRITERIA

Capture is ready when:

- chance query deterministic,
- aids previewed/consumed correctly,
- failure protection persists,
- success creates one owned instance,
- repeat command cannot duplicate result.

---

# 400. SCENE ACCEPTANCE CRITERIA

Pixi shop layer is ready when:

- renders from view model,
- no domain imports,
- semantic taps work,
- scene responds to state changes,
- mobile performance baseline passes,
- assets resolve by Asset ID.

---

# 401. UX INTEGRATION ACCEPTANCE CRITERIA

The app is architecturally integrated when:

- `/shop`, `/catchmons`, `/world` work,
- sheets use local UI state,
- durable commands use Game Engine,
- browser back is predictable,
- tab state is preserved.

---

# 402. CI ACCEPTANCE CRITERIA

A clean checkout should be able to:

```text
install
typecheck
lint
validate content
test
build
```

without manual secret/config requirements.

---

# 403. CLAUDE CODE ACCEPTANCE CRITERIA

A Claude implementation task is complete only if:

- architecture boundary preserved,
- owner doc followed,
- no design invention hidden,
- tests pass,
- new content registered canonically,
- provisional decisions reported.

---

# 404. LOCKED DECISIONS FROM DOCUMENT 14

The following decisions are considered part of the intended Technical Architecture unless deliberately revised:

1. Catchmon Shop is built as a browser-first TypeScript application.
2. React is the primary DOM/UI framework.
3. Vite is the build/dev tool.
4. React Router is used for primary/full-screen navigation.
5. PixiJS is used for the living 2.5D shop scene rather than making the whole application canvas-based.
6. React DOM remains the primary implementation for cards, sheets, lists, management screens, and accessible controls.
7. The base game is local-first, single-player, and client-authoritative.
8. No game backend is required for the initial product/vertical slice.
9. Cloud save/accounts/social systems are future ports rather than current implementation.
10. Local save tampering is not treated as a high-priority security problem in the non-competitive base game.
11. The codebase uses Core, Domain, Application, Infrastructure, Presentation, and Content boundaries.
12. Domain code has no React, PixiJS, Dexie, DOM, browser-clock, or asset dependencies.
13. Gameplay rules must be runnable headlessly.
14. Durable gameplay mutation occurs through typed commands/use cases.
15. Presentation must not directly mutate canonical GameState.
16. The project uses a canonical serializable root GameState organized by feature slices.
17. Derived values are calculated rather than redundantly persisted.
18. Long-running activities may snapshot relevant computed values at start.
19. Canonical content uses stable typed IDs.
20. Branded IDs are preferred to prevent cross-ID misuse.
21. Coins use safe integer numbers; the game does not assume astronomical idle-game values.
22. Percentages/probabilities use bounded fixed-point integer representation where practical.
23. Durations/timestamps use integer milliseconds / UTC epoch milliseconds.
24. Rounding is centralized and explicit.
25. Canonical registries exist for all major content categories.
26. Authored content is TypeScript-first with runtime/cross-registry validation.
27. Zod is used at untrusted/runtime boundaries such as save loading/migration.
28. Invalid canonical content should fail fast in development/CI.
29. Exact balance values live in centralized balance configuration.
30. No gameplay magic numbers belong in UI/components.
31. Catchmon/infrastructure effects use typed reusable effect primitives rather than generic string rules.
32. The project does not create a fully generic rules DSL.
33. Inventory is one canonical shared system.
34. Inventory reservation uses a central reservation ledger.
35. Crafting, orders, displays, expeditions, and manual reservation cannot independently duplicate stock.
36. Crafting uses timestamp-based activity state rather than saved countdown decrementing.
37. Full storage protects completed craft output and pauses further queue progression where necessary.
38. Active selling does not simulate an infinite offline customer backlog.
39. Customer transaction values come from canonical domain queries.
40. Shop Momentum persists as durable tactical state.
41. Catchmon canonical definitions are separate from owned progression state.
42. Save data stores Catchmon IDs/progression rather than duplicate names/art/definitions.
43. One-duty Catchmon assignment is a domain invariant.
44. Expeditions snapshot team/loadout/effect context at start.
45. Expedition results are generated and persisted exactly once.
46. Encounter Opportunities are durable state.
47. Capture attempts are atomic and idempotent.
48. Capture cannot create duplicate functional ownership through double execution.
49. World save state stores mutable progress only; canonical region content lives in registries.
50. Unlock logic is centralized/data-driven rather than coded in UI.
51. Time-dependent systems use an injected Clock.
52. Offline progression uses reconciliation from timestamps, not background ticks.
53. Reconciliation runs on boot/resume/before commands as needed.
54. Durable game state is not saved every second.
55. Visual countdowns may use a shared presentation ticker without mutating GameState.
56. Offline crafting/supply/expedition/construction resolve through bounded reconciliation.
57. Offline customers are not mass-simulated.
58. Domain randomness never calls `Math.random()` directly.
59. Randomness uses an injected deterministic seeded PRNG.
60. Save state contains a persistent root seed and monotonic random-event counter or equivalent deterministic mechanism.
61. Long-running random activities snapshot a seed/event context.
62. Resolved random outcomes are stored and do not reroll when viewed.
63. Bad-luck protection is explicit durable state.
64. IndexedDB via Dexie is the canonical local save technology.
65. `localStorage` is not the canonical gameplay save.
66. Save snapshots use schema version, revision, saved time, app/content metadata, and validated GameState.
67. Save revisions prevent stale async writes from overwriting newer state.
68. Save persistence uses current + previous known-good backup.
69. Save loading performs validation, migration, invariant checks, and reconciliation before UI exposure.
70. Save migrations are explicit sequential deterministic functions with fixtures.
71. App version, content version, and save schema version are separate concepts.
72. Active long-running activities remain stable across content balance updates through snapshots where required.
73. Only one browser tab may actively write a given save at once.
74. Multi-tab coordination uses browser-native coordination such as BroadcastChannel/lease behavior.
75. Zustand is a thin state-presentation adapter rather than the game-rule engine.
76. Durable Game Store and transient UI Store responsibilities remain separate.
77. React components subscribe through focused selectors/view models rather than full GameState.
78. React Router owns primary navigation; most contextual bottom sheets remain local UI state.
79. Existing `tokens.css` remains the styling source of truth; Tailwind/second token systems are not introduced by default.
80. PixiJS receives a scene view model and emits semantic interaction intents.
81. PixiJS objects are never persisted in game state.
82. The shop scene uses a fixed logical coordinate system with responsive camera mapping.
83. Interactive hit areas are larger than exact visual silhouettes where mobile usability requires.
84. Critical shop interactions require a non-precision semantic interaction path.
85. Assets are referenced by stable Asset IDs rather than feature-built paths.
86. Runtime asset mapping uses a canonical manifest/registry and Vite-compatible loading.
87. The full asset catalog is not loaded at app boot.
88. PWA/service-worker caching is deferred until after vertical-slice architecture is proven.
89. The app uses one browser lifecycle adapter for visibility/resume/page events.
90. App bootstrap validates content before applying a save against it.
91. New Game creation occurs through one canonical state factory.
92. Dev tools may manipulate gameplay only through controlled commands/factories rather than raw DB edits.
93. Headless simulations use the same domain/application engine as the game.
94. Vitest is the primary unit/domain test runner.
95. Critical browser flows receive Playwright end-to-end tests.
96. Time and RNG are controllable in tests.
97. Content-integrity validation runs in CI.
98. Save migrations have historical fixture tests.
99. Layer import boundaries should be lint/enforcement rules where practical.
100. Cross-domain orchestration belongs in Application rather than circular domain imports.
101. Commands are atomic: no partial inventory/economy/assignment commits.
102. Presentation formatting is separate from canonical numeric units.
103. Telemetry/error reporting remain vendor-neutral adapters.
104. Main shop performance targets smooth mobile interaction, aiming for 60 FPS where feasible and graceful degradation.
105. One shared visual ticker is preferred over many timers.
106. iOS Safari and Android Chrome are first-class mobile test targets.
107. Static deployment is sufficient for the base product.
108. No secrets are stored in client environment variables.
109. Service-worker/offline asset caching is not a prerequisite for local offline-time progression.
110. `pnpm` is the recommended package manager unless repo consistency justifies npm; only one lockfile is allowed.
111. Node 24 LTS is the recommended bootstrap runtime line.
112. Stable dependency versions are pinned by the lockfile.
113. Unstable/experimental framework APIs are not required for the core architecture.
114. Canonical GameState uses plain serializable data rather than framework/class instances.
115. Initial Dexie persistence can use whole-save snapshots rather than premature per-domain database normalization.
116. Durable commands execute serially through one active-client command boundary.
117. Assets can load asynchronously without blocking canonical gameplay state.
118. Development tooling should include state/RNG/save/time inspection.
119. Game code may reference owner design documents but must not duplicate the entire design spec in comments.
120. Major implementation deviations may use small ADRs.
121. Temporary/provisional values must be centralized and explicitly marked.
122. Full content production is not required to validate the technical architecture.
123. The headless core should exist before the final Pixi shop scene owns interaction.
124. Persistence/offline mechanics are core architecture and cannot be bolted on at the end.
125. Claude Code must read only relevant owner docs/context for each task.
126. Claude Code must not invent missing gameplay design.
127. Claude Code must not copy old gameplay architecture wholesale.
128. Claude Code must search for canonical types/registries/icons/config before adding duplicates.
129. Claude Code gameplay changes require deterministic tests.
130. Claude Code must not invent production asset filenames when canonical assets are missing.
131. New dependencies require architectural justification.
132. The project does not introduce multiple competing state managers/renderers/schema/design systems.
133. Technical implementation now has enough definition for Document 15 to create the exact Vertical Slice task sequence.

---

# 405. OPEN QUESTIONS DELIBERATELY LEFT FOR DOCUMENT 15 / BOOTSTRAP

This document intentionally leaves open:

- exact package patch versions,
- exact React/Vite/Pixi patch pins,
- exact PRNG algorithm implementation,
- exact logical Pixi scene dimensions,
- exact DPR cap,
- exact mobile performance budgets,
- exact Playwright browser matrix in CI,
- exact ESLint plugin set,
- exact formatting tool configuration,
- exact asset manifest generation implementation,
- exact BroadcastChannel lease timing,
- exact Dexie object-store schema names,
- exact debounce interval for ordinary save persistence,
- exact recovery UX,
- exact localization library,
- exact telemetry vendor,
- exact hosting vendor,
- exact service-worker/PWA implementation,
- exact save export/import feature,
- exact first persistent schema freeze point,
- exact vertical-slice content IDs,
- exact module/task order.

These should be decided at bootstrap/vertical-slice implementation only where real code makes the choice meaningful.

---

# 406. DEPENDENCY HANDOFF TO DOCUMENT 15

Documents 01–14 now define:

- what the game is,
- what every major gameplay system does,
- how progression/world/UX/art/assets work,
- and how the software should be architected.

The final planning question is now:

> **What exactly should Claude Code build first, second, third, and so on to create a working vertical slice without wasting tokens, generating unused systems, or implementing full-game breadth before the core loop is proven?**

Document 15 must become the execution plan.

---

# 407. NEXT DOCUMENT

## `15_CATCHMON_SHOP_VERTICAL_SLICE_IMPLEMENTATION_PLAN.md`

Document 15 should define:

### Phase 0 — repository/bootstrap
- package setup,
- folder structure,
- CLAUDE/project index,
- design-system imports,
- canonical references,
- quality scripts.

### Phase 1 — technical foundation
- IDs,
- Result,
- Clock,
- RNG,
- catalog,
- GameState,
- Game Engine,
- tests.

### Phase 2 — economy/inventory/crafting
- Coins,
- materials,
- reservations,
- stations,
- recipes,
- queue/offline.

### Phase 3 — customer/selling
- display,
- customer generation,
- Standard/Favorable/Premium/Recommend,
- Momentum.

### Phase 4 — Catchmons
- prototype lines,
- assignment,
- capabilities,
- XP.

### Phase 5 — expeditions/capture
- routes,
- team/loadout,
- offline completion,
- encounter,
- protection,
- capture.

### Phase 6 — persistence
- Dexie,
- migrations,
- backups,
- multi-tab,
- reconciliation.

### Phase 7 — React UX
- Shop/Catchmons/World,
- sheets,
- Inventory,
- route planning.

### Phase 8 — Pixi scene
- shop renderer,
- stations,
- customers,
- Catchmons,
- interaction mapping.

### Phase 9 — art/asset integration
- Golden Samples,
- vertical-slice assets,
- VFX.

### Phase 10 — progression/infrastructure
- compressed Shop Rank,
- first upgrades,
- first expansion.

### Phase 11 — hardening
- E2E,
- simulation,
- mobile performance,
- save migration,
- accessibility.

### Phase 12 — vertical-slice acceptance
- exact playable scenario,
- pass/fail criteria,
- only then authorize broader content production.

Document 15 should also define each Claude task with:
- objective,
- docs to read,
- files/modules,
- acceptance tests,
- prohibited scope,
- completion report.

---

# 408. DEFINITION OF DONE FOR TECHNICAL ARCHITECTURE

Document 14 is ready to hand off when the project can answer:

- What stack are we using?
- Why does React not own the game engine?
- Why is PixiJS used only for the spatial shop?
- Does the project need a backend now?
- What are the code layers and dependency directions?
- Where do canonical registries live?
- How are IDs typed?
- How are Coins, percentages, probabilities, and time represented?
- What belongs in GameState?
- What should be derived rather than stored?
- How do commands mutate the game?
- Why are domain events not full event sourcing?
- How are expected gameplay errors handled?
- How do inventory reservations prevent double spending?
- How do crafting queues work offline?
- Why are customers not simulated infinitely offline?
- How are Catchmon definitions separated from progression state?
- How are expedition results guaranteed to resolve once?
- How does capture avoid reload rerolls/double ownership?
- How are unlocks evaluated?
- How is time injected and reconciled?
- How is deterministic RNG seeded/persisted?
- Where is bad-luck protection stored?
- Why is IndexedDB/Dexie used?
- How are saves versioned, backed up, validated, and migrated?
- How are multiple tabs prevented from corrupting a save?
- What is Zustand responsible for?
- What is React Router responsible for?
- How is the Pixi scene connected to GameState without owning it?
- How are assets addressed/loaded?
- Why is PWA caching deferred?
- What tests are required?
- How can economy/progression run headlessly?
- What mobile performance rules exist?
- Which Claude Code shortcuts are explicitly forbidden?
- What does Document 15 now need to sequence?

If these answers remain stable through the first implementation phases, Catchmon Shop has a technical foundation capable of supporting the full game without redesigning its architecture every few features.
