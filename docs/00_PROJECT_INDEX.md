# Catchmon Shop — Project Index

**Status:** Active  
**Purpose:** Navigation and source-of-truth index for Catchmon Shop  
**Current Phase:** Vertical Slice Implementation

---

> ## R0 NOTICE — CATCHMON ASCENSION
>
> This copied repository (`catchmon-ascension/`) is being rebuilt into a new,
> separate game: **Catchmon Ascension**. `docs/rebuild/01`–`15` (read order in
> `docs/rebuild/README.md`) are authoritative for Ascension's game design.
> `docs/rebuild/15_REBUILD_IMPLEMENTATION_PLAN.md` is authoritative for
> implementation sequencing (Phases R0–R13) — the role this index's Section 13
> and Document 15 play below, but for Ascension.
>
> Everything below this notice documents **Catchmon Shop**, the prior game in
> this codebase, and remains the reference/engineering-foundation index —
> layering, canonical Catchmon/element data, and the reused technical
> architecture (`docs/rebuild/14`) still apply — until the Phase R1
> KEEP/ADAPT/RETIRE audit reclassifies each module. Where a Shop document
> conflicts with a `docs/rebuild` document on gameplay intent, `docs/rebuild`
> wins for this repository. See `CLAUDE.md`'s matching R0 notice.

---

# 1. PURPOSE

This file is the navigation entry point for the Catchmon Shop repository.

Its purpose is to help contributors and AI coding agents determine:

- which documents are authoritative,
- which document owns a specific system,
- which references must be used,
- what should be read for a given task,
- and which systems are intentionally not yet authorized for implementation.

This file does **not** duplicate detailed game-design decisions.

Use it to locate the correct source of truth.

---

# 2. CURRENT PROJECT PHASE

The project is currently in:

> **VERTICAL SLICE IMPLEMENTATION**

All fifteen authoritative game-design documents (01–15) are complete and approved (see Section 12).

Full-game production is **not** authorized.

Current priorities:

1. Implement the Vertical Slice exactly as scoped by Document 15, following its Task ID sequencing.
2. Preserve canonical Catchmon data and approved design-system sources.
3. Avoid premature content or asset production beyond the Vertical Slice scope.
4. Avoid introducing undefined mechanics.
5. Do not skip ahead to full-game production before the Vertical Slice Exit Gate.

Full-game production implementation will be authorized later, only after the Vertical Slice reaches its Exit Gate (see Document 15).

---

# 3. GLOBAL PROJECT RULES

Always read:

`../CLAUDE.md`

before performing implementation or repository-wide design work.

Important principles include:

- do not invent missing game-design decisions,
- do not reintroduce obsolete mechanics from the previous Catchmon game,
- do not duplicate canonical data,
- do not create new currencies, progression systems, product families, or major mechanics without authoritative specification,
- read only the documents relevant to the current task,
- keep tunable balance values centralized,
- reuse the established design system instead of creating a parallel one.

---

# 4. AUTHORITATIVE GAME-DESIGN DOCUMENTS

Authoritative game-design documents live in:

`docs/game-design/`

Each document owns a defined part of the game.

A later document number does **not** automatically override an earlier document.

If two documents genuinely conflict, the conflict must be resolved explicitly.

---

## 01 — Project Foundation & North Star

**File**

`game-design/01_CATCHMON_SHOP_PROJECT_FOUNDATION_AND_NORTH_STAR.md`

**Owns**

- project identity,
- working game concept,
- core fantasy,
- central design thesis,
- design pillars,
- primary player promise,
- inspiration boundaries,
- major non-goals,
- project-level design guardrails,
- decision hierarchy,
- content discipline,
- North-Star player moments,
- first-session quality bar,
- long-term quality bar,
- project-wide locked/open distinction.

**Read when working on**

- major new features,
- project-wide direction,
- product positioning,
- feature approval/rejection,
- questions about whether a mechanic belongs in Catchmon Shop.

---

## 02 — Core Gameplay Engine

**File**

`game-design/02_CATCHMON_SHOP_CORE_GAMEPLAY_ENGINE.md`

**Owns**

- minute-to-minute core loop,
- prepare → craft → stock → customer → transaction → react → reinvest,
- production / presentation / customer interaction relationship,
- Standard Sale,
- Favorable Deal,
- Premium Pitch,
- Recommend,
- Shop Momentum,
- Workshop-active gameplay philosophy,
- active vs. passive play,
- session structure,
- 2-minute, 10-minute, and 30-minute play patterns,
- first-30-seconds return experience,
- core-loop prototype requirements,
- customer-flow requirements at engine level,
- Catchmon touchpoints at engine level.

**Read when working on**

- core gameplay,
- selling interactions,
- Shop Momentum,
- session pacing,
- active/passive behavior,
- prototype loop,
- anything affecting the main shop interaction cycle.

---

## 03 — Economy Architecture

**File**

`game-design/03_CATCHMON_SHOP_ECONOMY_ARCHITECTURE.md`

**Owns**

- main macro currency architecture,
- Coins as working main-currency concept,
- Shop Momentum economic boundary,
- routine materials,
- special components,
- sources and sinks,
- economic value flow,
- investment competition,
- economic bottlenecks,
- storage economy,
- offline economy,
- active vs. passive economic advantage,
- inflation control,
- time-to-afford,
- upgrade payback,
- recipe viability principles,
- economic simulation requirements,
- recovery-floor principles,
- Catchmon economic boundaries.

**Read when working on**

- currencies,
- resource flows,
- upgrade costs,
- economic balance,
- storage,
- material supply,
- offline accumulation,
- economic simulation,
- inflation,
- any mechanic that creates or destroys economic value.

---

## 04 — Crafting & Product System

**File**

`game-design/04_CATCHMON_SHOP_CRAFTING_AND_PRODUCT_SYSTEM.md`

**Owns**

- product-family architecture,
- seven top-level product families,
- five production-station archetypes,
- recipe architecture,
- recipe progression,
- crafting queues,
- material reservation,
- craft cancellation,
- crafting completion behavior,
- Recipe Rank,
- Recipe Mastery,
- product quality,
- Standard / Fine / Masterwork working quality grades,
- Workshop Push,
- dual-use products,
- product-role tags,
- element-aligned recipes,
- region crafting packages,
- signature-recipe boundaries,
- Catchmon crafting hooks,
- crafting prototype scope,
- product content-volume discipline.

**Read when working on**

- crafting,
- recipes,
- products,
- production stations,
- crafting queues,
- recipe mastery,
- product quality,
- product catalog structure,
- product/crafting Catchmon effects.

---

# 5. ADDITIONAL AUTHORITATIVE GAME-DESIGN DOCUMENTS (05–15)

The following documents are complete and approved (COMPLETE v1, see Section 12) and are authoritative within their declared ownership scope, per Section 4 of `CLAUDE.md`.

Document 14 is authoritative for software architecture. Document 15 is authoritative for implementation sequencing, Task IDs, scope, and acceptance criteria.

The ownership summaries below are index-level pointers, not a substitute for reading the owner document itself.

---

## 05 — Customer & Selling System

**File**

`game-design/05_CATCHMON_SHOP_CUSTOMER_AND_SELLING_SYSTEM.md`

Owns:

- customer types,
- browsing behavior,
- demand generation,
- product requests,
- transaction flow,
- Standard Sale / Favorable Deal / Premium Pitch / Recommend details,
- Shop Momentum customer interactions,
- special visitors,
- orders and commissions,
- display influence,
- customer waiting/leave behavior,
- offline customer behavior,
- Catchmon customer/shop-floor hooks.

---

## 06 — Catchmon Gameplay Integration

**File**

`game-design/06_CATCHMON_SHOP_CATCHMON_GAMEPLAY_INTEGRATION.md`

Owns:

- role taxonomy for the 104 Catchmons,
- Catchmon shop roles,
- production roles,
- supply roles,
- customer roles,
- expedition roles,
- Catchmon assignment,
- Catchmon synergies,
- evolution gameplay integration,
- element interaction,
- roster differentiation,
- rules preventing generic percentage-only design.

---

## 07 — Acquisition & Expeditions

**File**

`game-design/07_CATCHMON_SHOP_ACQUISITION_AND_EXPEDITIONS.md`

Owns:

- external resource acquisition,
- expedition structure,
- discovery,
- Catchmon encounters,
- capture preparation,
- capture system,
- Field Gear utility,
- Capture & Discovery Gear utility,
- special components,
- expedition timing,
- reward structure,
- failure/protection rules.

---

## 08 — Shop Growth & Infrastructure

**File**

`game-design/08_CATCHMON_SHOP_SHOP_GROWTH_AND_INFRASTRUCTURE.md`

Owns:

- shop expansion,
- physical production infrastructure,
- production-station placement/representation,
- storage,
- display capacity,
- customer capacity,
- Catchmon support infrastructure,
- visible shop transformation,
- infrastructure upgrades.

---

## 09 — Progression & Unlock Architecture

**File**

`game-design/09_CATCHMON_SHOP_PROGRESSION_AND_UNLOCK_ARCHITECTURE.md`

Owns:

- progression phases,
- unlock order,
- shop progression,
- recipe progression dependencies,
- world access,
- long-term goals,
- specialization,
- mastery relationships,
- Catchmon progression relationship,
- major milestone architecture.

---

## 10 — World & Element Structure

**File**

`game-design/10_CATCHMON_SHOP_WORLD_AND_ELEMENT_STRUCTURE.md`

Owns:

- world/region structure,
- element distribution,
- region identity,
- region economic specialization,
- material/recipe relationships,
- Catchmon-region relationships,
- world unlock structure,
- curated regional content packages.

---

## 11 — UX & Information Architecture

**File**

`game-design/11_CATCHMON_SHOP_UX_AND_INFORMATION_ARCHITECTURE.md`

Owns:

- screen architecture,
- main-shop screen,
- navigation,
- crafting flow,
- customer interaction flow,
- Catchmon management flow,
- expedition flow,
- inventory,
- hierarchy,
- mobile-first UX,
- information density,
- interaction states.

---

## 12 — Art Direction & Visual Style Bible

**File**

`game-design/12_CATCHMON_SHOP_ART_DIRECTION_AND_VISUAL_STYLE_BIBLE.md`

Owns:

- final visual target,
- shape language,
- material language,
- perspective,
- lighting,
- product icon style,
- building/station style,
- environmental style,
- Catchmon presentation,
- UI visual hierarchy,
- relationship to existing design-system tokens.

---

## 13 — Asset Taxonomy & Production Plan

**File**

`game-design/13_CATCHMON_SHOP_ASSET_TAXONOMY_AND_PRODUCTION_PLAN.md`

Owns:

- full asset inventory,
- icon categories,
- symbols,
- resource assets,
- product assets,
- building/station assets,
- props,
- badges,
- frames,
- technical asset specifications,
- naming conventions,
- export formats,
- generation order,
- asset reuse rules.

No large-scale asset generation should begin before this document is approved.

---

## 14 — Technical Architecture

**File**

`game-design/14_CATCHMON_SHOP_TECHNICAL_ARCHITECTURE.md`

**Authoritative for software architecture** (see `CLAUDE.md` Section 4).

Owns:

- application framework,
- directory architecture,
- game-state model,
- state management,
- persistence,
- save format,
- migrations,
- time simulation,
- economy engine,
- crafting engine,
- customer simulation,
- Catchmon registries,
- canonical data registries,
- testing architecture,
- deterministic domain logic,
- performance boundaries.

This document will authorize production-oriented technical implementation.

---

## 15 — Vertical Slice Implementation Plan

**File**

`game-design/15_CATCHMON_SHOP_VERTICAL_SLICE_IMPLEMENTATION_PLAN.md`

**Authoritative for implementation sequencing, Task IDs, scope, and acceptance criteria** (see `CLAUDE.md` Section 4).

Owns:

- exact prototype/vertical-slice scope,
- implementation phases,
- task ordering,
- acceptance criteria,
- test requirements,
- content placeholders,
- feature boundaries,
- definition of done.

Production implementation should follow this plan rather than attempting to build the entire game at once.

---

# 6. REFERENCE DATA

Reference data is separate from game-design documents.

It should contain canonical reusable information, not obsolete gameplay logic.

---

## Catchmons

**Location**

`../reference/catchmons/`

**Intended canonical content**

- Catchmon IDs,
- names,
- element,
- evolution line,
- evolution stage,
- rarity if still canonical,
- visual asset references,
- approved lore/descriptions where applicable.

Do not import previous-game mechanics merely because they are stored near Catchmon data.

Do not duplicate Catchmon metadata in new gameplay registries.

---

## Design System

**Primary reference**

`../reference/design-system/design-system-source.md`

Additional authoritative design-system sources may include:

- `tokens.css`
- `element-farbkompass.md`
- `motionTokens.ts`
- `regions.ts`
- shared SVG icon sources.

Read these only when styling, UI, motion, element-color, region-visual, or icon work is relevant.

Do not create a second token/color/icon system.

---

# 7. READING RULE — TOKEN DISCIPLINE

Do **not** load all project documentation for every task.

Use targeted context.

---

## For a crafting task

Read primarily:

1. `CLAUDE.md`
2. this Project Index
3. `02_CORE_GAMEPLAY_ENGINE`
4. `03_ECONOMY_ARCHITECTURE` if economic behavior is relevant
5. `04_CRAFTING_AND_PRODUCT_SYSTEM`
6. relevant source code

---

## For an economy task

Read primarily:

1. `CLAUDE.md`
2. this Project Index
3. `02_CORE_GAMEPLAY_ENGINE` where necessary
4. `03_ECONOMY_ARCHITECTURE`
5. the specific dependent design document
6. relevant source code/data

---

## For a Catchmon task

Read primarily:

1. `CLAUDE.md`
2. this Project Index
3. the owner gameplay document
4. `reference/catchmons/`
5. only directly affected systems.

Do not load all 104 Catchmons into context unless the task actually requires full-roster analysis.

---

## For a visual/UI task

Read primarily:

1. `CLAUDE.md`
2. this Project Index
3. the relevant UX/gameplay document
4. `reference/design-system/DESIGN_SYSTEM_SOURCES.md`
5. only the referenced token/icon/motion files required.

---

## For a single bug

Prefer:

1. relevant code,
2. related tests,
3. owning design section.

Do not reread the complete game design unless the bug involves an architectural ambiguity.

---

# 8. AUTHORITY RULES

When determining what is correct:

## Highest authority for gameplay intent

Approved numbered game-design documents within their declared ownership scope.

## Highest authority for canonical content

Canonical data registries/files.

## Highest authority for visual tokens

The design-system sources referenced by `DESIGN_SYSTEM_SOURCES.md`.

## Highest authority for implemented behavior

The approved specification, not accidental legacy code.

Existing code does not override an explicit current design decision.

---

# 9. LOCKED / OPEN / OUT-OF-SCOPE RULE

Every numbered design document may contain:

- locked decisions,
- open questions,
- out-of-scope areas.

Treat these literally.

### Locked
Safe to design/implement according to the specification.

### Open
Not finalized.

Do not silently finalize.

### Out of scope
Do not introduce while working on another system.

---

# 10. LEGACY BOUNDARY

The new Catchmon Shop project may reuse approved:

- Catchmon identities,
- Catchmon visuals,
- elements,
- evolution relationships,
- selected lore,
- design tokens,
- motion tokens,
- region metadata,
- shared icons.

The new project does **not** automatically reuse previous-game:

- Funken economy,
- prestige,
- harvest systems,
- old skill trees,
- old spawn systems,
- old team mechanics,
- old production values,
- old progression formulas,
- old capture formulas.

Legacy gameplay must be explicitly re-approved before use.

---

# 11. IMPLEMENTATION AUTHORIZATION

Current status:

> **VERTICAL SLICE IMPLEMENTATION AUTHORIZED**
> **FULL-GAME PRODUCTION IMPLEMENTATION NOT AUTHORIZED**

Documents 14 (Technical Architecture) and 15 (Vertical Slice Implementation Plan) are approved (COMPLETE v1, see Section 12).

Vertical Slice implementation proceeds strictly according to Document 15's Task IDs and sequencing, per `CLAUDE.md` Section 40.

Do not treat Vertical Slice implementation work as authorization to build the full game.

Full-game production implementation begins only after:

1. the Vertical Slice reaches its Exit Gate (Document 15),
2. explicit authorization is given to scale beyond the Vertical Slice content subset.

---

# 12. CURRENT DOCUMENT COMPLETION

| Document | Status |
|---|---|
| 01 Project Foundation & North Star | COMPLETE v1 |
| 02 Core Gameplay Engine | COMPLETE v1 |
| 03 Economy Architecture | COMPLETE v1 |
| 04 Crafting & Product System | COMPLETE v1 |
| 05 Customer & Selling System | COMPLETE v1 |
| 06 Catchmon Gameplay Integration | COMPLETE v1 |
| 07 Acquisition & Expeditions | COMPLETE v1 |
| 08 Shop Growth & Infrastructure | COMPLETE v1 |
| 09 Progression & Unlock Architecture | COMPLETE v1 |
| 10 World & Element Structure | COMPLETE v1 |
| 11 UX & Information Architecture | COMPLETE v1 |
| 12 Art Direction & Visual Style Bible | COMPLETE v1 |
| 13 Asset Taxonomy & Production Plan | COMPLETE v1 |
| 14 Technical Architecture | COMPLETE v1 |
| 15 Vertical Slice Implementation Plan | COMPLETE v1 |

---

# 13. NEXT ACTION

All fifteen game-design documents (01–15) are COMPLETE v1 (see Section 12). No further game-design document is required before implementation.

The next action is Vertical Slice implementation per Document 15's Task ID sequence, beginning with:

> **Task 00.1 — Implementation Phase Activation**

followed by:

> **Task 00.2 — Package / Tooling Bootstrap**

per `CLAUDE.md` Section 40.

---

# 14. CORE NAVIGATION PRINCIPLE

When starting any task:

> **Find the owner document first.**

Then read only:

- its relevant sections,
- required dependencies,
- relevant canonical data,
- relevant implementation files.

Do not solve context uncertainty by loading the entire repository.

That rule exists both for architectural clarity and token efficiency.
