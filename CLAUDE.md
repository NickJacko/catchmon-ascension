# CLAUDE.md — CATCHMON SHOP

> ## R0 REPOSITORY IDENTITY NOTICE — CATCHMON ASCENSION
>
> This repository (`catchmon-ascension/`) is a **copy** of the Catchmon Shop
> repository, cloned per `docs/rebuild/15_REBUILD_IMPLEMENTATION_PLAN.md`
> Phase R0, and is being rebuilt into a new, separate game: **Catchmon
> Ascension**. The original Catchmon Shop repository (`catchshop/`) is a
> different folder and remains completely untouched — it is not this
> repository's root, and it is not affected by any work done here.
>
> **Documentation authority in this repository:**
> - `docs/rebuild/01`–`15` (read order in `docs/rebuild/README.md`) are
>   authoritative for Catchmon Ascension's game design.
>   `docs/rebuild/15_REBUILD_IMPLEMENTATION_PLAN.md` is authoritative for
>   implementation sequencing (Phases R0–R13) — it plays the role Section 40
>   below and Document 15 play for Catchmon Shop, but for Ascension.
> - Everything below this notice (this file's Sections 1–40, and
>   `docs/game-design/01`–`15`) describes **Catchmon Shop**, the prior game
>   built in this codebase before the clone. It remains valid as the
>   **technical/engineering foundation** this rebuild reuses (see
>   `docs/rebuild/14_TECHNICAL_ARCHITECTURE_REUSE_AND_MIGRATION.md`) — layering,
>   domain/save/RNG/time rules, test policy, code-quality rules, and the
>   canonical Catchmon/element data all still apply. But its **gameplay
>   intent** (Sections 1, 10–13, and the Shop-specific parts of 2–9) is
>   reference material only, pending the Phase R1 KEEP/ADAPT/RETIRE audit —
>   not the current gameplay authority. Where a Shop game-design document
>   conflicts with a `docs/rebuild` document on gameplay intent,
>   `docs/rebuild` wins for this repository.
> - Section 40's "CURRENT AUTHORIZATION" (Task 00.1/00.2, Vertical Slice
>   Shop implementation) is superseded here by `docs/rebuild/15`'s phase
>   sequence. Do not resume Shop's Task 00.1/00.2 in this repository.
>
> See `docs/00_PROJECT_INDEX.md` for the equivalent navigation note.

Repository root folder:

catchshop/

All repository-relative paths in this project are resolved from `catchshop/`.
Do not assume the root folder is named `Catchmon-Shop`.

*(The root-folder statement above is inherited from Catchmon Shop and describes that original repository. This copy's own root is `catchmon-ascension/` — see the R0 notice above.)*

## 1. PROJECT

Catchmon Shop is a browser-based, mobile-first shop-management and Catchmon-collection game.

Core fantasy:
1. operate and grow a living shop,
2. collect and strategically use Catchmons.

Core loop:
`prepare → craft → stock/display → customer → active sale decision → profit/Momentum → reinvest → better production/world opportunities`

Catchmons are strategic capability pieces. They are not combat units, decorative pets, passive stat cards, or a legacy idle-production system.

Current phase:

> **VERTICAL SLICE IMPLEMENTATION**

Full-game production is **not** authorized yet.

---

# 2. PRIMARY RULE

## DO NOT INVENT MISSING GAME DESIGN.

If a required gameplay decision is not defined by the authoritative design documents:

- do not silently invent it,
- do not derive it from the old Catchmon project,
- do not hide it in UI code,
- do not add a new system because it seems convenient.

If implementation requires a temporary numeric value:

- place it in centralized balance/config,
- mark it `PROVISIONAL`,
- report it in the task completion summary.

If implementation requires a missing structural design decision:

- stop that part of the task,
- report the gap clearly.

---

# 3. SOURCES OF TRUTH

Use sources in this order:

1. `CLAUDE.md`
2. `docs/00_PROJECT_INDEX.md`
3. authoritative owner document(s) in `docs/game-design/`
4. canonical content/reference files
5. current implementation code

Later files do **not** automatically override earlier files unless the Project Index or ownership boundary says they own that domain.

When two documents appear inconsistent:

- check their ownership/scope,
- do not choose one silently,
- report a real unresolved conflict.

---

# 4. DESIGN DOCUMENT OWNERSHIP

Canonical owner documents:

- `01` — Project Foundation & North Star
- `02` — Core Gameplay Engine
- `03` — Economy Architecture
- `04` — Crafting & Product System
- `05` — Customer & Selling System
- `06` — Catchmon Gameplay Integration
- `07` — Acquisition & Expeditions
- `08` — Shop Growth & Infrastructure
- `09` — Progression & Unlock Architecture
- `10` — World & Element Structure
- `11` — UX & Information Architecture
- `12` — Art Direction & Visual Style Bible
- `13` — Asset Taxonomy & Production Plan
- `14` — Technical Architecture
- `15` — Vertical Slice Implementation Plan

For implementation sequencing, Task IDs, scope, acceptance criteria, and task-specific reading requirements:

> **Document 15 is authoritative.**

For software architecture:

> **Document 14 is authoritative.**

---

# 5. CONTEXT DISCIPLINE

Do **not** read all design documents for every task.

For every implementation task:

1. read this file,
2. read `docs/00_PROJECT_INDEX.md`,
3. read the task in Document 15,
4. read only the task's owner documents,
5. read only relevant sections of Document 14,
6. inspect direct source dependencies.

Example:

Crafting task:
- `CLAUDE.md`
- Project Index
- `03`
- `04`
- relevant `14`
- task section in `15`
- relevant crafting/inventory code

Do not load:
- all 15 documents,
- all 104 Catchmons,
- all 17 region data,
- unrelated UI/assets.

Minimize context without sacrificing correctness.

---

# 6. LOCKED / OPEN / OUT-OF-SCOPE

Treat explicit document labels literally.

## LOCKED

Implement as written unless the user explicitly changes the design.

## OPEN

Do not silently decide during unrelated implementation.

Temporary implementation values may only be centralized and explicitly provisional where Document 14/15 permits.

## OUT OF SCOPE

Do not implement.

---

# 7. LEGACY BOUNDARY

The old Catchmon project is **not** an implementation source for the new gameplay architecture.

Legacy gameplay must not leak into the new project.

Do not reintroduce without explicit approval:

- Funken economy,
- `sparksThreshold`,
- Harvest mechanics,
- old passive-production logic,
- old team limits,
- old spawn logic,
- old catch formulas,
- old skill trees,
- prestige/reset systems,
- old progression gates,
- old reaction/progression systems merely because code exists.

Old project/reference content may be consulted only for approved canonical identity data such as:

- Catchmon IDs/names/images,
- evolution identity,
- element identity,
- stable region identity,
- approved design-system references.

If old code contains gameplay behavior:

> it is not authoritative for Catchmon Shop.

---

# 8. CANONICAL CATCHMON RULE

The 104 existing Catchmons are canonical collection/reference content.

Do not:

- rename them casually,
- redesign them,
- invent replacement species,
- invent canonical evolution lines,
- duplicate canonical identity in save state.

Separate:

1. immutable canonical Catchmon/species data,
2. Catchmon Shop gameplay definitions,
3. mutable player-owned state.

If exact canonical identity data is missing:

> report the missing data instead of fabricating it.

---

# 9. CANONICAL WORLD RULE

The real elements are:

- Fire
- Water
- Electric
- Grass
- Earth
- Poison
- Normal
- Ice
- Fairy
- Wind
- Steel
- Psychic
- Light
- Dark
- Ghost
- Dragon
- Cosmic

`Bug` is not a Catchmon Shop element.

Do not import legacy Funken region progression.

---

# 10. CORE PRODUCT RULES

The shop is the primary gameplay engine.

The player-facing commerce loop must remain centered on:

- crafting,
- display/stock,
- customers,
- transaction decisions,
- Coins,
- Shop Momentum,
- reinvestment.

The four core selling actions are:

- Standard Sale
- Favorable Deal
- Premium Pitch
- Recommend

Decline is also a valid boundary action.

Do not add:
- hidden negotiation-failure RNG,
- combat,
- generic tapping mechanics,
- new currencies without explicit design approval.

---

# 11. CATCHMON DESIGN RULE

Catchmons should primarily change:

- what the player can do,
- how a system behaves,
- what opportunities become available,
- how the player specializes.

Preference order:

1. unlock/change possibility,
2. change strategy,
3. improve information,
4. targeted optimization,
5. generic percentage bonus.

Avoid reducing Catchmons to generic throughput modifiers.

No per-customer/per-craft Catchmon micromanagement.

Assignments are strategic and persistent.

---

# 12. ECONOMY RULE

The macro economy uses one main universal spendable currency:

> Coins

Shop Momentum is a tactical shop resource, not a second macro currency.

Materials and special components are resources, not currencies.

Do not add:
- regional currencies,
- blueprint currencies,
- evolution currencies,
- universal capture currencies,
- additional permanent currencies

without explicit design approval.

---

# 13. BALANCE RULE

All numeric tuning belongs in centralized balance/configuration.

Do not hardcode balance values in:

- React components,
- Pixi objects,
- CSS,
- feature-specific convenience functions.

No magic gameplay numbers.

If a value is temporary:

```text
PROVISIONAL
```

must be visible in the central config and reported.

---

# 14. SINGLE SOURCE OF TRUTH

Before adding a new:

- ID type,
- registry,
- constant,
- icon,
- formatter,
- balance value,
- effect primitive,
- content definition,

search for an existing canonical equivalent.

Do not duplicate data across feature files.

Examples:

- product definition lives in product/content registry,
- Catchmon identity lives in canonical Catchmon registry,
- region identity lives in region registry,
- asset location lives in Asset Registry,
- design color lives in canonical tokens.

---

# 15. TECHNICAL ARCHITECTURE

Architecture layers:

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

Canonical content is a parallel data/configuration layer.

Dependency rules from Document 14 are mandatory.

---

# 16. DOMAIN RULE

Domain gameplay logic must:

- be TypeScript-only,
- be deterministic,
- be serializable,
- be testable without browser rendering,
- not import React,
- not import PixiJS,
- not import Dexie,
- not call browser APIs directly.

The game must be runnable headlessly for tests/simulation.

---

# 17. REACT RULE

React owns:

- UI,
- screens,
- cards,
- sheets,
- lists,
- navigation,
- accessible controls.

React does **not** own canonical gameplay rules.

Do not calculate in React:

- sale formulas,
- capture probability,
- craft timing,
- XP progression,
- unlock rules,
- inventory availability.

React consumes application/domain queries and dispatches commands.

---

# 18. PIXIJS RULE

PixiJS owns the living 2.5D Shop scene.

PixiJS does **not** own:

- economy,
- inventory,
- timers,
- capture,
- progression,
- save state.

Pixi receives a presentation `SceneViewModel`.

Pixi emits semantic interactions such as:

```text
station selected
customer selected
display selected
Catchmon selected
Expedition Hub selected
```

No gameplay state is stored in Pixi objects.

---

# 19. STATE MUTATION RULE

Durable gameplay state changes only through the application/Game Engine command boundary.

Do not directly mutate the canonical store from React/Pixi.

Commands must be atomic.

A failed command must not leave partial:

- Coin changes,
- reservations,
- assignments,
- expedition state.

---

# 20. TIME RULE

Domain/Application code must not call `Date.now()` directly.

Use the injected Clock abstraction.

Long-running activities use timestamps.

Do not save countdown values every second.

Offline progression uses reconciliation.

---

# 21. RANDOMNESS RULE

Domain code must not call:

```ts
Math.random()
```

Use the canonical seeded `RandomSource`.

Resolved random results must be durable.

Reloading must not reroll:

- expedition rewards,
- encounters,
- capture results,
- quality outcomes where random.

Bad-luck protection is explicit saved state.

---

# 22. INVENTORY RULE

There is one canonical inventory.

Crafting, Orders, Displays, Expeditions, and Gear do not maintain independent quantity copies.

Reservations use the central reservation ledger.

Never allow double spending.

---

# 23. SAVE RULE

Canonical gameplay persistence uses:

> IndexedDB / Dexie

not `localStorage`.

Save architecture must support:

- schema version,
- revision,
- validation,
- migration,
- backup,
- reconciliation.

GameState must remain plain serializable data.

Do not persist:

- React state,
- Pixi objects,
- DOM objects,
- functions,
- canonical content definitions,
- asset binaries.

---

# 24. SAVE SCHEMA CHANGE RULE

Once the slice reaches the persistence freeze point defined in Document 15:

Any durable GameState schema change requires:

- schema-version consideration,
- migration,
- migration fixture/test.

Do not casually invalidate player saves.

---

# 25. ASSET RULE

Production art is addressed by stable `AssetId`.

Do not construct production asset paths ad hoc in feature code.

Do not invent missing production filenames.

If an approved asset is missing:

- use the canonical project placeholder,
- report the missing Asset ID.

Existing 104 Catchmon images remain canonical.

---

# 26. DESIGN SYSTEM RULE

Reuse canonical:

- `tokens.css`,
- element colors,
- motion tokens,
- shared icons.

Do not:

- create a second spacing system,
- create a second typography system,
- hardcode a hex if a semantic token exists,
- introduce Tailwind by default,
- use emoji as production icons.

Element color is content identity, not general UI action color.

---

# 27. MOBILE-FIRST RULE

Core UX must work comfortably on mobile.

Respect:

- approximately 44×44 px frequent touch targets,
- no hover-required information,
- no precision dragging for core actions,
- no tiny scene-only interaction dependency,
- no desktop-only core workflow.

Desktop may expand layout, not change the game.

---

# 28. DEPENDENCY RULE

Do not install a new package merely for convenience.

Before adding a dependency confirm:

- approved stack does not already solve it,
- browser/platform capability is insufficient,
- bundle/maintenance cost is justified.

Do not add competing:

- state managers,
- renderers,
- schema libraries,
- styling systems.

---

# 29. CODE QUALITY RULES

Prefer:

- strict TypeScript,
- discriminated unions,
- pure functions,
- explicit types,
- small coherent modules,
- domain-specific helper names,
- exhaustive switches,
- deterministic tests.

Avoid:

- `any`,
- giant `game.ts`,
- giant `store.ts`,
- dumping unrelated helpers into `utils.ts`,
- string-name branching,
- hidden side effects.

---

# 30. TEST RULE

Gameplay/domain implementation is incomplete without deterministic tests.

Critical areas require tests for:

- inventory reservation,
- crafting/offline reconciliation,
- customer quote/sale,
- Momentum,
- Catchmon assignment,
- expedition exactly-once resolution,
- capture exactly-once resolution,
- RNG reproducibility,
- save migration,
- unlock logic.

Do not consider “it builds” sufficient.

---

# 31. CONTENT VALIDATION RULE

Canonical registries must validate:

- duplicate IDs,
- unknown references,
- missing assets,
- invalid recipe references,
- invalid Catchmon/evolution references,
- invalid region/route references,
- invalid unlock targets.

Invalid canonical content should fail development/CI rather than silently disappear.

---

# 32. VERTICAL SLICE SCOPE

The current implementation target is the Vertical Slice from Document 15.

It deliberately uses a small content subset.

Do not scale prematurely to:

- all 104 Catchmon gameplay roles,
- all 17 regions,
- 70–100 final products,
- full customer catalog,
- all station visual tiers.

The architecture must support that scale.

The implementation does not need that breadth yet.

---

# 33. CURRENT PLAYABLE SLICE ASSUMPTIONS

Working slice:

- Start Region: Vulkankrater / Fire
- Contrast Preview: Ozean / Water
- 4–8 canonical existing Catchmons
- 2 visually represented station families
- 3 Displays
- 1 Expedition slot
- 2–3 infrastructure upgrades
- 1 visible shop macro expansion

Exact selected Catchmon IDs are determined by the canonical audit task in Document 15.

Do not invent them before that task.

---

# 34. SCALE VALIDATION VS POLISHED SLICE

Do not confuse:

## PLAYABLE POLISHED SLICE
small production-quality content subset.

with:

## HEADLESS SCALE HARNESS
synthetic validation of:
- 4–5 station archetypes,
- 18–28 products,
- all seven product families.

Synthetic scale fixtures are not final content.

---

# 35. IMPLEMENTATION ORDER

Follow Document 15 Task IDs.

Do not skip ahead because a later feature looks more exciting.

Broad order:

```text
Bootstrap
→ Kernel
→ Persistence
→ Economy/Inventory/Crafting
→ Customers/Selling/Momentum
→ Catchmons
→ Expeditions/Capture
→ Progression/Infrastructure
→ React UX
→ Pixi Scene
→ Assets
→ Scale Validation
→ Hardening
→ Exit Gate
```

---

# 36. TASK SCOPE RULE

Implement only the assigned Task ID.

Do not “helpfully” implement future tasks.

If small prerequisite work is unavoidable:

- keep it minimal,
- explain it in completion report.

---

# 37. TASK COMPLETION REPORT

Every Claude Code task ends with:

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

Do not omit provisional assumptions.

---

# 38. CHECKS — THREE-TIER VALIDATION POLICY

The full `pnpm check` stack is expensive (measured: `vitest run` alone is
~350-660s on this repo's 111 test files; full `eslint .` ~90s; full
`prettier --check .` ~50s). Do not pay that cost after every small edit.
Use the cheapest tier that gives real confidence, and escalate the moment
you're unsure it's enough.

## Tier 1 — `pnpm check:fast <file> [file...]`

Run repeatedly while implementing a task. Pass the file(s) you just
touched. Runs: incremental `tsc -b`, the direct `validate-legacy-leaks.ts`
scan, `eslint`/`prettier --check` scoped to exactly those files, and
`vitest related <file> --run` (Vitest's own static-import graph — not a
hand-maintained list, not git-diff-based since this repo has no `.git`).

A widely-imported file (a `domain/*/types.ts`, a content barrel) will make
`related` widen toward much of the suite — that widening is the signal to
stop iterating here and move to Tier 2/3, not a bug in the script.

## Tier 2 — `pnpm check:affected <file> [file...]`

Run after finishing a coherent task group, or after touching shared
architecture: application command infrastructure, `GameState` shape, asset
resolver/metadata, persistence, reconciliation, the shared React shell, the
Pixi renderer/view-model boundary, content registries. Runs: incremental
typecheck, the legacy-leak scan, lint + format scoped to the given files
(this project's custom ESLint rules and Prettier are both per-file — a new
violation can only appear in a touched file, and Tier 3 still sweeps the
whole repo before every phase exit), `vitest related` for the given files,
and a real `vite build`. What distinguishes it from Tier 1: it's meant to
be invoked once with the full file list from a whole completed batch (a
wider `vitest related` net), and it adds the production build.

## Tier 3 — `pnpm check` (full stack, unchanged)

Required before:

- declaring any phase PASS,
- dependency or config changes,
- save-schema/migration changes,
- any change whose regression radius is genuinely unclear,
- Phase 13 exit/release validation.

Never weakened for speed. Never report a phase PASS without this passing
in full.

## Claude Code workflow rule

Do not automatically run the entire `pnpm check` after every small edit.

- During implementation → Tier 1.
- After a meaningful subsystem/batch completion → Tier 2.
- Before reporting a phase complete → Tier 3 (full `pnpm check`) + the
  required E2E set below.
- If a targeted check exposes uncertainty about regression radius →
  escalate straight to Tier 3. Don't keep narrowing.

## E2E policy

Do not run the full Playwright suite after every domain/content edit.

- UI/Pixi/navigation/interaction change → `pnpm test:e2e:scene`
- Shared app boot/persistence/router change → `pnpm test:e2e:bootstrap`
- Progression/economy path change → `pnpm test:e2e:progression`
- Phase exit → `pnpm test:e2e` (the complete required set)

## Reporting

Completion reports must distinguish FAST CHECK / AFFECTED CHECK / FULL
PHASE GATE / E2E explicitly — do not blur them into one "tests passed"
line. Never report a partial or flaky suite count as a successful
baseline: if the full suite fails on worker-startup/infrastructure
grounds, report the failure, rerun once to confirm whether it's
reproducible, and report the real result — never the failed partial count
presented as final.

---

# 39. GIT / CHANGE DISCIPLINE

Keep changes scoped.

Do not mix:

- refactor,
- unrelated formatting,
- content expansion,
- new feature

inside one task unless required.

Never delete or rewrite canonical files because a simpler local implementation is easier.

---

# 40. CURRENT AUTHORIZATION

Authorized now:

> Vertical Slice implementation according to Document 15.

Not authorized:

> Full-game production.

The next implementation action is:

# `TASK 00.1 — IMPLEMENTATION PHASE ACTIVATION`

After that:

# `TASK 00.2 — PACKAGE / TOOLING BOOTSTRAP`

Do not start by asking Claude to “build the game”.
