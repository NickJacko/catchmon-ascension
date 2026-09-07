# R1 — Dependency Audit / Shop Retirement Map

**Status: R1 FULLY CLOSED.** Initial audit completed read-only; this closure update locks the two previously-open target-gating decisions (§7.1, §7.2 — now targets with a documented, deferred migration seam rather than open questions) and implements Doc 15's literal R1 exit criterion, a neutral Ascension shell (§11), so the app no longer boots into Shop's gameplay loop by default.
**Produced against baseline:** R0 PASS (project identity = Catchmon Ascension, persistence/save namespace isolated, `pnpm check` green).
**Method:** Full inventory of `src/domain/`, `src/application/`, `src/infrastructure/`, `src/presentation/`, `src/app/`, `src/core/`, `src/content/`, `e2e/`, `scripts/`, cross-referenced against `CLAUDE.md`, `docs/00_PROJECT_INDEX.md`, `docs/rebuild/07_META_PROGRESSION_AND_ACCOUNT_SYSTEMS.md`, `docs/rebuild/08_WORLD_REGIONS_AND_EXPEDITIONS.md`, `docs/rebuild/09_ECONOMY_CURRENCIES_AND_REWARD_PACING.md`, `docs/rebuild/14_TECHNICAL_ARCHITECTURE_REUSE_AND_MIGRATION.md`, and `docs/rebuild/15_REBUILD_IMPLEMENTATION_PLAN.md`.
**This document is now the authoritative migration map for R1→R2+.** Nothing described here has been deleted yet — the two locked target decisions below are *targets with a deferred, isolated migration seam*, not implemented replacements; the legacy gates they describe remain exactly as-is in code until R6. Retirement happens in later phases, in the order recommended in §8, and only once each dependent has a migration path.

---

## 1. KEEP — survives essentially unchanged

Verified against real imports, not assumed. Each item lists the actual file(s).

### 1.1 Core primitives (`src/core/`)
- **Branded IDs / registry**: `core/ids/brand.ts` (`Brand`, `createIdFactory`), `core/registry/registry.ts`, `core/registry/cross-reference.ts` — fully generic. *Caveat:* `core/ids/ids.ts` (the one file that declares concrete ID types) mixes generic types (`RegionId`, `RouteId`, `AssetId`, `CatchmonSpeciesId`, `CatchmonLineId`, `CapabilityId`, `ExpeditionId`, `EncounterId`, `SaveId`, `CommandId`, `UnlockRuleId`, `ReservationId`, `InfrastructureId`, `ItemId`, `ComponentId`, `ResourceId`, `OwnedCatchmonId`) with Shop-specific ones (`ProductId`, `RecipeId`, `StationId`, `CustomerId`, `CustomerArchetypeId`, `DisplaySlotId`, `OrderId`). See §7.4.
- **Result type**: `core/result/result.ts` — generic.
- **Clock**: `core/time/clock.ts`, `core/time/timestamp.ts`, `core/time/time-math.ts` — generic port + branded timestamp + arithmetic. `infrastructure/platform/system-clock.ts` is the one production adapter allowed to call `Date.now()`.
- **Deterministic RNG**: `core/random/random-source.ts` (port), `core/random/deterministic-rng.ts` (SplitMix32-style, ADR 0001), `core/random/seed.ts`, `core/random/seed-derivation.ts`, `core/random/mix32.ts`, `core/random/event-counter.ts`, `core/random/probability-roll.ts`, `core/random/random-range.ts` — fully generic, no gameplay coupling.
- **Numeric primitives**: `core/math/integer.ts` (incl. `Coins` branded type — name matches Doc 09's confirmed currency, see §1.2), `core/math/basis-points.ts`, `core/math/duration.ts`, `core/math/probability.ts` — generic.
- **Assertions**: `core/assertions/invariant.ts` — generic.

**Domain-purity verified**: a repo-wide search of `src/domain/**/*.ts` for `from "react"`, `from "pixi"`, `from "dexie"`, `Date.now(`, `Math.random(` returned **zero matches**. Domain code is 100% pure, deterministic TypeScript — no CLAUDE.md §16 violations found anywhere.

### 1.2 Game Engine command boundary (`src/application/engine/`)
`game-engine.ts` (`GameEngine<TState, TEvent>`), `command.ts` (`Command` envelope, `createCommand` stamps `issuedAtMs` from injected `Clock`), `save-repository.ts` (`SaveRepository<TState>` port). **Confirmed 100% generic** — the engine is a `Map<string, CommandHandler>` keyed by command-type string; it contains zero Shop/Catchmon/craft references. Every gameplay concept enters only through `src/app/register-commands.ts`'s `registerAllCommands()` call, which is composition-layer code, not engine code. This is the single most reusable piece of architecture in the repository — R2's new commands (`FORGE_RELIC`, `START_BOSS_ATTEMPT`, etc., per Doc 14 §7) plug into the exact same boundary with zero engine changes.

### 1.3 Persistence (`src/infrastructure/persistence/`)
`dexie-save-repository.ts`, `catchmon-ascension-database.ts` (renamed in R0), `migrations/migration-pipeline.ts`, `save-envelope.ts`'s envelope-level fields (`saveId`/`schemaVersion`/`appVersion`/`contentVersion`/`revision`/`savedAtMs`) — confirmed generic, operates on `StoredSave<GameState>` without knowing what's inside `gameState`. *Caveat:* `save-envelope.ts`'s `gameStateShapeSchema` (Zod) hardcodes the current 12 top-level `GameState` slice **names** (not their internal shape, just presence) — this must be updated in the same change as any GameState slice rename/removal. See §7.5 (dangerous dependency).

### 1.4 Save validation / backup / writer lease
`migrations/migration-test-harness.ts`, `writer-lease.ts` (`BroadcastChannel`-based multi-tab election, renamed channel prefix in R0), `browser-lifecycle.ts` — all confirmed generic, parameterized by `saveId`/callbacks, no gameplay knowledge.

### 1.5 Reconciliation architecture (`src/application/reconciliation/`)
`reconcile-game-state.ts` (the `ReconciliationPass` contract + fold-over-passes engine, including its `CLOCK_MOVED_BACKWARDS` backwards-clock guard) — confirmed generic. Two of its four concrete passes are also generic/reusable, see §2.5.

### 1.6 Unlock-rule architecture
`domain/progression/unlock-evaluator.ts` — the condition-composition engine (primary + optional secondary, ANDed) is generic. *Caveat:* only 3 of 8 declared `UnlockConditionType` values are actually implemented today (`SHOP_RANK`, `INFRASTRUCTURE_STATE`, `EXPEDITION_MILESTONE`); the other 5 conservatively evaluate `false` (a deliberate CLAUDE.md-compliant choice, not a bug). Ascension will need **new** condition types not yet invented anywhere (e.g. a Journey-Rank equivalent, Forge Level, Battle Path selection) — see §9 R2+ prerequisites. Do not invent these values now.

### 1.7 AssetId / AssetMetadata / resolver
`domain/assets/types.ts` (`AssetMetadata`, `AssetPreloadClass`, `AssetPivot`), `domain/assets/validate-pivot.ts` — fully generic. `presentation/assets/resolve-asset.ts`'s two-strategy resolution **mechanism** (glob-match by filename, or `runtimePath` fallback) is generic; its strategy #2 fallback source is currently wired to Shop-vertical-slice content (`content/vertical-slice/productionAssets.ts`) — that wiring is ADAPT, not the mechanism itself.

### 1.8 Canonical Catchmon data
Verified directly, not assumed:
- `reference/catchmons/evolution_lines.json` — **51 evolution lines**, confirmed by direct key count.
- `reference/catchmons/element_mapping.json` — **51 lines → 17 distinct `ElementId` values**, confirmed.
- `reference/catchmons/{Common,Rare,Legendary,Mythic,God,Starter}/*.png` — species portrait count: Common 75 + Rare 8 + Legendary 2 + Mythic 9 + God 1 + Starter 9 = **104 species**, confirmed.
- `src/content/canonical-catchmons/canonicalCatchmonGraph.ts` + `canonicalElementMap.ts` + `resolveCatchmonElement.ts` — typed loaders over the JSON above; genuinely reusable regardless of genre since they just index source-of-truth data.
- `domain/world/types.ts`'s `ElementId` union (17 canonical elements) matches `element_mapping.json`'s value set exactly. `Bug` correctly does not appear.

**Architecturally significant finding**: the *engine* (domain types in `domain/catchmons`, `domain/catalog`) is fully separated from the *content* (which 104 creatures exist) — `domain/catchmons/types.ts`'s own module doc says "no attempt is made to normalize all 104 Catchmons... that is later content-authoring work." Only 11 of the 104 species (the 6 vertical-slice starters + their 5 real evolution targets) are currently promoted to playable `CatchmonSpeciesDefinition` content in `content/vertical-slice/catchmonContent.ts`. The other 93 are indexed by identity/element only. This means Doc 15's "8–12 real Catchmons" target for the Ascension slice can reuse the same content-authoring pattern already proven here.

### 1.9 Ownership/evolution primitives (generic parts)
`domain/catchmons/xp-ledger.ts` (`levelForXp`/`applyXp`, flat centralized curve, no hardcoded values), `domain/catchmons/evolution.ts` (`checkEvolutionRequirement`/`computeEvolutionReadiness`, pure level-gated state machine) — both fully generic. `domain/inventory/inventory-ledger.ts` (item-type-agnostic reservation ledger: `getTotalQuantity`/`getReservedQuantity`/`getAvailableQuantity`/`addToInventory`/`reserveInventory`/`releaseReservation`/`consumeReservation`) — one of the most portable modules in the repo, entirely agnostic to what an `ItemId` actually represents.

### 1.10 React/Pixi architecture boundaries
- Design-system components: `Button`, `Panel`, `StatusPill`, `Tabs`, `SectionHead`, `Sheet`, `ArtPlaceholder` (`presentation/components/`) — pure, reusable regardless of game genre.
- `ElementBadge` — game-specific but genre-appropriate (renders a Catchmon element), needed for combat too.
- Icon system: `presentation/icons/index.tsx` (name-driven `<Icon name="..."/>` adapter over 36 bundled SVGs) + `element-icon-map.ts` (17 element icons) — generic delivery mechanism.
- Shell pattern: `AppShell.tsx` (TopBar + banners + `<Outlet/>` + BottomTabBar + SheetHost), `SheetHost.tsx` (single-mount-point switch over `activeSheet.kind`), `SaveStatusBanner.tsx` (writer-lease/persist-failure banner — fully generic engine concern) — the *pattern* is reusable; the concrete route/sheet lists are ADAPT (§4).
- Pixi scene scaffolding: `ShopSceneRenderer.ts`'s host/layer/lifecycle/effects/texture-cache machinery, and the `scene-view-model.ts` architectural role (**the one file allowed to import domain/application**, producing a plain, headless-testable view-model that the renderer and every entity class consume — never `GameState`/`GameCatalog` directly) — this adapter pattern is exactly what Doc 15 R9 needs for the battle scene, and is confirmed already enforced by header-comment convention in the current code.
- Generic hooks: `useNow` (1s ticker), `usePendingAction` (double-tap guard), `useReconciliationTicker` (mounted once at app root), `useQueries` (memoizes query-object factories) — `presentation/hooks/`.
- Motion tokens (`presentation/motion/index.ts`) and design tokens (`presentation/styles/tokens.css`) — the "approved-v1" design system, reused per CLAUDE.md §26.

### 1.11 Testing tiers / E2E isolation
`scripts/check-fast.mjs`, `scripts/check-affected.mjs`, the three-tier `pnpm check` policy itself — fully reusable, genre-agnostic. E2E specs `bootstrap.spec.ts`, `save-migration.spec.ts`, `writer-lease.spec.ts` test generic infrastructure (boot smoke test, save/migration pipeline, multi-tab lease) and should transfer to Ascension with only UI-text-assertion updates once the new shell exists. `scripts/verify-e2e-hooks-absent.mjs` (E2E-hook production-build isolation) — generic.

### 1.12 Scale-validation philosophy
`scripts/scale-harness.ts` — the harness mechanism (drives real command handlers/reconciliation/persistence against synthetic content, asserts real invariants, no pass/fail micro-benchmarks) is genre-agnostic tooling; only the synthetic content it currently drives (`src/content/scale-fixture/`) is Shop-flavored and will need a new Ascension-flavored fixture once R13 needs it. **Doc-accuracy finding**: CLAUDE.md's "HEADLESS SCALE HARNESS" section states "18–28 products," but the actual `scale-fixture/manifest.ts` targets **98 products** (7 families × 14 each) — confirmed via `scale-harness.ts`'s own doc comment ("~104 Catchmons... ~98 products/recipes"). This is a stale number in CLAUDE.md, not a code defect; worth a future doc correction, not an R1 blocker.

---

## 2. ADAPT — architecture reusable, gameplay semantics must change

For each: what's reusable / what's Shop-specific / what Ascension needs instead / dependency risks.

### 2.1 World / Regions (`domain/world/`, `content/vertical-slice/worldContent.ts`)
- **Reusable**: `ElementId`/`ElementDefinition` (canonical, KEEP — see §1.8), `RegionDefinition`/`RouteDefinition` shape, `discovery.ts`'s `DiscoveryStatus` state machine (UNKNOWN→TRACED→ENCOUNTERED→OWNED), `route-access.ts`'s region-lock gate. `region-unlock-reconciliation-pass.ts` (generic: checks each catalog region's `unlockRuleId` against `isUnlockRuleSatisfied`).
- **Shop-specific**: `ExpeditionIntent` union (`SUPPLY_RUN`/`DISCOVERY_SURVEY`/`COMPONENT_HUNT`/`SPECIAL_EXPEDITION`) is shop-flavored; current content has 2 regions (Vulkankrater/Ozean — **these region choices survive**, per Doc 15 §2's own "Suggested content: Vulkankrater + Ozean"), 6 routes with shop-supply-run framing.
- **Needed instead**: journey/stage-flavored route intents (per Doc 14 §6's `domain/journey/` module — stages, bosses, path-progress), region unlock rules re-authored off Journey Rank instead of Shop Rank (see §7.2, dangerous dependency).
- **Dependency risk**: Ozean's current unlock rule mixes a `SHOP_RANK` condition with an `EXPEDITION_MILESTONE` condition (a "2-signal rule"). This cannot retire silently — see §7.2.

### 2.2 Expeditions (`domain/expeditions/`, `application/commands/expeditions/`, `application/queries/expeditions/`)
- **Reusable**: `capture-chance.ts` (clamped weighted-probability formula), `encounter-selection.ts` (RNG-biased target pick), `rewards.ts` (guaranteed + pity-protected bonus roll) — all pure formulas with zero `GameState` reads, genuinely generic RNG-application patterns. Commands `START_EXPEDITION`/`ATTEMPT_CAPTURE`/`DECLINE_ENCOUNTER`/`OBSERVE_ENCOUNTER` are structurally generic (timed away-mission → result lifecycle). `expedition-reconciliation-pass.ts` (generic, replay-safe via snapshotted `resultSeed`) — KEEP-tier mechanism.
- **Shop-specific**: `START_EXPEDITION`'s reward shape (`rewards.ts`'s "routine reward" + "special component bonus") is craft-material-flavored; `START_EXPEDITION` currently **validates Expedition Hub ownership** (an `infrastructure` read) before allowing a start.
- **Needed instead**: rewards re-typed toward Echo Charges/Essence/combat-XP per Doc 09 §2; expedition gating re-pointed at something Ascension-appropriate (Journey Rank? always available? a stage-completion gate?) instead of Shop infrastructure ownership.
- **Dependency risk — HIGH**: this is the audit's most important finding. See §7.1.

### 2.3 Encounter / Capture (`domain/expeditions/capture-chance.ts`, `encounter-selection.ts`, commands `ATTEMPT_CAPTURE`/`DECLINE_ENCOUNTER`/`OBSERVE_ENCOUNTER`, `world.discoveryStates`/`captureProtection`/`encounterOpportunities`)
- **Reusable**: the entire capture-chance/pity-protection/discovery-state-machine mechanism — this is precisely what Doc 15's "capture/ownership/evolution" vertical-slice pillar needs, and it already exists working end-to-end (confirmed by `e2e/deterministic-capture.spec.ts` and `e2e/expedition-and-capture.spec.ts`).
- **Shop-specific**: none structurally — capture is already one of the least Shop-coupled systems in the codebase. Only its current *trigger context* (post-expedition, gated on Shop infrastructure) is Shop-specific.
- **Needed instead**: per Doc 15 §17's player journey ("discover/capture Catchmon" sits between combat/boss beats), capture likely stays expedition-triggered — low rework needed here relative to other systems.
- **Dependency risk**: shares §7.1's Expedition Hub gating risk (capture only reachable via `START_EXPEDITION`).

### 2.4 Catchmon ownership/progression/evolution (`domain/catchmons/`, `GameState.catchmons`, commands `ASSIGN_CATCHMON`/`EVOLVE_CATCHMON`)
- **Reusable**: `xp-ledger.ts`/`evolution.ts` (KEEP, §1.9), `GameState.catchmons` slice shape (`ownedCatchmonIds` + `ownedCatchmons: Record<OwnedCatchmonId, {lineId, currentSpeciesId, level, xp, evolutionReadiness, currentAssignment, shinyUnlocked?, favorite?}>`), `EVOLVE_CATCHMON` command (idempotent species-stage advance, preserves level/XP) — directly reusable for Doc 15's "capture/ownership/evolution" pillar.
- **Shop-specific**: `ASSIGN_CATCHMON`'s `CatchmonAssignment` union bakes `WORKSHOP`/`SHOP_FLOOR` assignment-kind literals directly into the **domain type**, alongside the generic `EXPEDITION`/`UNASSIGNED`. `domain/catchmons/types.ts`'s `CatchmonDomain` (WORKSHOP/SHOP_FLOOR/SUPPLY/EXPEDITION) and effect-family vocabulary (craft speed, Recommend compatibility, customer attraction — `domain/catchmons/effects.ts`) are shop-loop-coupled.
- **Needed instead**: per Doc 01/06, assignment kinds become **Lead** + **3 Bond Supports** + Unassigned (replacing Workshop/Shop-Floor/Expedition/Unassigned); effect families become combat-flavored (stat boosts, elemental synergy, support behaviors) replacing craft-speed/recommend-compatibility.
- **Dependency risk — MEDIUM**: because the Shop-specific assignment kinds live in the domain type (not just a command handler), this can't be quietly deleted — it must be *widened/replaced* in the same change that introduces Lead/Bond Support kinds, or every already-created Catchmon-Ascension save (post-R2, pre-ship) needs a schema migration. See §7.3.

### 2.5 Progression / unlock rules (`domain/progression/`)
- **Reusable**: `unlock-evaluator.ts`'s condition-composition engine (KEEP, §1.6); `shop-rank.ts`'s rank-curve math (`rankForProgress`/`applyRankProgress`/`getNearbyMilestone`) is structurally **identical** to `xp-ledger.ts`'s level curve — a "flat centralized curve → apply progress → nearby milestone" primitive. Doc 14 §6 lists a new `domain/progression/` module for "Journey Rank" — `shop-rank.ts`'s math is the direct reuse template, needing a rename/repurpose, not a rewrite.
- **Shop-specific**: the name "Shop Rank" itself, and its role as the gate for all 9 of `content/vertical-slice/progressionContent.ts`'s introduction-order unlock rules (Standard Sale, Momentum, Favorable Deal, Premium Pitch, Recommend, First Order, Catchmon Assignment, Expedition Hub Intro, First World Route — all Shop-flavored milestones).
- **Needed instead**: a "Journey Rank" progression content set gating Ascension's actual milestones (per Doc 15 §17: starter choice, first Forge result, first boss, Battle Path choice, Bond Support assignment, region unlock), plus new `UnlockConditionType` values not yet declared anywhere (Forge Level, Battle Path selected, boss defeated, Relic rarity owned, etc.) — **do not invent these values now**; they're an explicit open design gap for R2+ (see §9).
- **Dependency risk**: LOW mechanically (pure rename/content swap), but blocked on §7.2's region-unlock coupling until resolved.

### 2.6 GameState (full audit in §5)

### 2.7 Reconciliation passes (mixed — see §5 KEEP/ADAPT/REMOVE split; `expedition-reconciliation-pass.ts` and `region-unlock-reconciliation-pass.ts` are ADAPT/KEEP, `craft-queue-reconciliation-pass.ts` and `infrastructure-construction-reconciliation-pass.ts` are RETIRE-adjacent, see §3.6/§3.7)

### 2.8 Scene/view-model infrastructure
- **Reusable**: `ShopSceneRenderer.ts`'s host/layer/lifecycle/effects/texture-cache scaffolding (§1.10); `scene-view-model.ts`'s **architectural role** as the sole domain/application-importing file in the scene layer.
- **Shop-specific**: `scene-view-model.ts`'s concrete builder functions (stations/displays/customers/expeditionHub) and all 5 entity classes (`StationEntity`, `DisplayEntity`, `CustomerEntity`, `CatchmonEntity`, `ExpeditionHubEntity`).
- **Needed instead**: a new `scene-view-model.ts` for the battle scene (Doc 15 R9: background, Lead sprite, enemy/boss, HP/status, basic-attack visuals) and new entity classes. `CatchmonEntity` is very likely directly reusable (renders a Catchmon sprite regardless of context — Doc 15 R9 explicitly wants a "Lead sprite"). `ExpeditionHubEntity`'s pattern (a single hardcoded special-building entity keyed by ownership state) is a plausible reuse template for a future Rift Forge entity, even though its content retires.
- **Dependency risk**: LOW — this whole subsystem only has one consumer (`ShopScreen.tsx` via `ShopSceneHost.tsx`), so it can be replaced wholesale once R9 is ready, with no other system depending on it.

### 2.9 AppShell / navigation
- **Reusable**: `AppShell.tsx`/`SheetHost.tsx`/`GoalBanner.tsx`/`SaveStatusBanner.tsx` structural pattern (§1.10).
- **Shop-specific**: `BottomTabBar.tsx`'s `DESTINATIONS` array is a **hardcoded 3-item list** (`/shop`, `/catchmons`, `/world`), not data-driven. `TopBar.tsx`'s `TITLES` map is similarly hardcoded, plus a Shop-route-conditional Momentum chip. `ui-store.ts`'s `activeSheet` union hardcodes all 9 current sheet kinds; its `ShopTab`/`CatchmonsTab`/`WorldTab` enums are Shop-specific tab vocabularies.
- **Needed instead**: Doc 15 R8's four-tab IA (Journey / Forge / Catchmons / World) — `BottomTabBar` needs a 4-item array, `TopBar` needs a 4-entry title map and the Momentum chip removed, `ui-store.ts` needs new sheet kinds (e.g. relic compare, Battle Path select, skill loadout) replacing the 9 Shop ones. `CatchmonsTab`/`WorldTab` enums likely survive close to as-is (roster/catchdex, map/region); `ShopTab` retires entirely.
- **Dependency risk**: LOW — these are small, mechanically simple config-shaped changes once the new screens exist to point at.

---

## 3. RETIRE — Shop gameplay that should not remain part of Ascension's core

For each: incoming/outgoing dependencies, persisted `GameState` fields, command handlers, queries, React/Pixi surfaces, tests, content registries, and whether a reusable (KEEP/ADAPT) system currently imports it.

### 3.1 Customer selling loop
- **Domain**: `domain/customers/types.ts` (`CustomerLayer`, `CustomerArchetypeDefinition`).
- **Persisted state**: `GameState.customers` (`activeCustomerIds`, `customers: Record<CustomerId, CustomerRuntimeState>`, `lastArrivalAtMs`).
- **Commands**: `ARRIVE_CUSTOMER` (`application/commands/customer/arrive-customer.ts`).
- **Queries**: `customer/customer-arrival-service.ts` (`isCustomerArrivalEligible`), `customer/transaction-quote-engine.ts` (`getCustomerTransactionOptions` — also computes sale-tier eligibility, shared by all 4 sale commands, see §3.2).
- **React**: `CustomerSheet.tsx`; `presentation/hooks/useCustomerArrivalTicker.ts`.
- **Pixi**: `CustomerEntity` (scene).
- **Content**: `content/vertical-slice/customerContent.ts` (3 archetypes: Everyday Buyer/Explorer Buyer/Special Visitor), `GameCatalog.customerArchetypes` registry field.
- **Tests**: `e2e/new-game-sale.spec.ts`, `e2e/momentum-loop.spec.ts` exercise this loop directly.
- **Incoming dependents (systems that read customer state)**: none outside this cluster — confirmed no KEEP/ADAPT command or query reads `GameState.customers`.
- **Outgoing dependencies (what this cluster reads)**: `shop.displaySlots`/`inventory` (for arrival's request generation), `catchmons` (Shop-Floor-assigned Catchmon's Recommend-compatibility effect, read-only).
- **Safe to retire once**: nothing — no KEEP/ADAPT system depends on it. First candidate for retirement.

### 3.2 Standard/Favorable/Premium/Recommend sale actions + Decline
- **Commands**: `application/commands/sale/{standard-sale,favorable-deal,premium-pitch,recommend,decline}.ts`.
- **Persisted state**: writes `inventory`, `economy.coins`, `shop.momentum`, `customers`.
- **Queries**: `customer/transaction-quote-engine.ts` (shared quote logic for all 4 tiers).
- **React**: `CustomerSheet.tsx`'s action buttons.
- **Content**: none dedicated (uses product/quality data from crafting content, see §3.3).
- **Incoming dependents**: none.
- **Safe to retire once**: bundled with §3.1 (same UI surface, same trigger).

### 3.3 Momentum commerce loop
- **Domain**: `domain/shop/momentum-ledger.ts` (`gainMomentum`/`spendMomentum`, capped/floored).
- **Persisted state**: `GameState.shop.momentum`.
- **Commands**: consumed by sale commands (§3.2) and `WORKSHOP_PUSH` (§3.6, spends Momentum to shave craft time).
- **React**: `TopBar.tsx`'s conditional Momentum chip (`onShop && <CurrencyChip kind="momentum".../>`), `CurrencyChip`'s `"momentum"` kind.
- **Incoming dependents**: `WORKSHOP_PUSH` (crafting, itself RETIRE — §3.6) is the only cross-cluster consumer. No KEEP/ADAPT system reads Momentum.
- **Note**: Doc 09 (Ascension's economy doc) defines **no** secondary capped-meter currency analogous to Momentum — Ascension's currencies are Coins, Echo Charges, Essence (and optionally Guild Credits later), none of which are "spend to accelerate an in-progress timer." Momentum retires with no direct 1:1 replacement identified; `momentum-ledger.ts`'s underlying "capped/floored secondary meter" *pattern* could theoretically be reused if a future Ascension system needs one, but nothing in the read docs calls for it yet — do not invent a replacement.

### 3.4 Products / recipes
- **Domain**: `domain/crafting/types.ts` (`ProductFamily` [7 values], `StationArchetype` [5 values], `QualityGrade`, `ProductDefinition`, `RecipeDefinition`, `ResourceDefinition`, `ComponentDefinition`).
- **Persisted state**: implicitly via `inventory.stacks` keyed by `productItemId()` (§3.9 nuance) and `GameState.crafting`.
- **Content**: `content/vertical-slice/craftingContent.ts` (4 resources, 2 components, 5 products/recipes across 2 stations).
- **Registries**: `GameCatalog.products`/`recipes`/`resources`/`components`.
- **Incoming dependents**: `domain/inventory/product-item-id.ts` (`productItemId(productId, quality)`) is a thin shop-flavored touchpoint on top of the otherwise-generic inventory ledger (§1.9) — it retires with products, but the ledger itself (KEEP) is unaffected.
- **Safe to retire once**: §3.6 (crafting commands/reconciliation) and §3.5 (display) are gone, since both consume product/recipe data.

### 3.5 Display stocking
- **Persisted state**: `GameState.shop.displaySlots`.
- **Commands**: `ASSIGN_DISPLAY_PRODUCT`, `CLEAR_DISPLAY_SLOT` (`application/commands/display/`).
- **Queries**: `display/display-queries.ts` (`getDisplaySlotView`, `getDisplayedProducts`).
- **React**: `DisplaySheet.tsx`.
- **Pixi**: `DisplayEntity`.
- **Component note**: `Slot.tsx` (the generic display-slot/station-slot visual primitive — art/label/locked/empty/tier/selected) is used by both Display and Station UI today, but its *component code* is genre-agnostic UI (not Shop-coupled beyond its current call sites). **Recommend keeping `Slot.tsx` itself** — flag it as a strong reuse candidate for Rift Forge's 8 Relic Matrix slots (Doc 15 §2) rather than deleting it; only its Shop call-sites (DisplaySheet, StationSheet, ShopScreen tabs) retire.
- **Content**: `verticalSliceManifest.ts`'s 3 reserved display-slot IDs.
- **Incoming dependents**: `customer/arrive-customer.ts` and `customer/transaction-quote-engine.ts` read `shop.displaySlots` (§3.1/§3.2, already retiring together).
- **Safe to retire once**: bundled with §3.1/§3.2 — display and customer-selling are tightly coupled (customers only request what's displayed).

### 3.6 Production crafting (stations as Shop gameplay)
- **Persisted state**: `GameState.crafting.stations`.
- **Commands**: `START_CRAFT`, `QUEUE_CRAFT`, `CANCEL_QUEUED_CRAFT`, `WORKSHOP_PUSH`.
- **Queries**: `craft/craft-queries.ts` (`CraftQueries` — can-craft checks, ETA, queue view, recipe preview).
- **Reconciliation**: `craft-queue-reconciliation-pass.ts` (delivers overdue crafts, promotes queue, awards Workshop-Catchmon XP + craft-completion Shop Rank progress).
- **React**: `StationSheet.tsx`.
- **Pixi**: `StationEntity`.
- **Content**: `content/vertical-slice/stations.ts` (3 station-archetype assignments), `verticalSliceManifest.ts`'s 3 station IDs.
- **Incoming dependents**: **`craft-queue-reconciliation-pass.ts` awards Shop Rank progress** (`progression`, ADAPT/KEEP) on craft completion — this is a one-way write from a RETIRE system into a KEEP/ADAPT system. Once crafting retires, `progression`'s rank-progress *sources* need re-pointing at Ascension-appropriate events (combat/Forge activity per Doc 09 §2's "battles, recycling, offline rewards, expeditions" — for Coins — and separately whatever drives Journey Rank). Not a blocker (progression doesn't *read from* crafting, it's only credited by it), but note it when re-authoring progression content.
- **Outgoing dependencies**: reads `catchmons` (Workshop-assigned Catchmon's craft-speed effect, `catchmon-effect-queries.ts`'s `getWorkshopCraftSpeedEffect` — one of two Shop-coupled functions in that otherwise-generic-ish file, alongside `getShopFloorRecommendCompatibilityEffect`; the third function in the same file, `getExpeditionDiscoveryBoostEffect`, is generic and stays — **do not delete the whole file**, only the two Shop-coupled exports).
- **Safe to retire once**: §3.4 (products/recipes) retires alongside it — they're inseparable.

### 3.7 Shop infrastructure/economy
- **Domain**: `domain/shop-infrastructure/types.ts` (`InfrastructureDefinition`: `infrastructureId`, `unlockRule`, `coinCost`, optional `constructionDurationMs`), `shop-macro-stage.ts` (`deriveShopMacroStage` — STARTER/EXPANDED visual stage derived from infrastructure ownership count).
- **Persisted state**: `GameState.infrastructure` (`ownedInfrastructureIds`, `upgradeLevels`, `activeConstructions`).
- **Commands**: `PURCHASE_INFRASTRUCTURE`.
- **Reconciliation**: `infrastructure-construction-reconciliation-pass.ts` (timestamp-only, promotes completed constructions).
- **Content**: `content/vertical-slice/infrastructureContent.ts` (2 upgrades: Expedition Hub, Display Expansion).
- **Incoming dependents — CRITICAL**: `START_EXPEDITION` (ADAPT/KEEP, §2.2) currently validates Expedition Hub ownership before allowing a start. **This is the single most important cross-cutting risk found in this audit** — see §7.1. Do not retire this cluster's content until that dependency is resolved.
- **Reuse note**: `InfrastructureDefinition`'s shape (unlock-gated purchase with an optional construction timer) is a plausible template for Doc 14 §6's "Forge Level" concept, and `ConstructionActivity`'s timer pattern likewise. Content retires; the shape is a candidate ADAPT template, not a pure throwaway.

### 3.8 Customer archetypes
Covered under §3.1 — `domain/customers/types.ts`'s `CustomerArchetypeDefinition`, `content/vertical-slice/customerContent.ts`, `GameCatalog.customerArchetypes`.

### 3.9 Shop Rank as the central progression spine
- This is **not** a pure retirement — see §2.5 (ADAPT). What retires is Shop Rank's specific **role and content**: the `SHOP_RANK` unlock-condition-type's 9 Shop-flavored gated rules in `progressionContent.ts`, and the name "Shop Rank" itself. The underlying `shop-rank.ts` math survives, renamed, as Journey Rank's engine.
- **Everyday Orders** (not explicitly named in the RETIRE candidate list but confirmed Shop-selling-loop content): `domain/orders/types.ts` (`EverydayOrderDefinition`), `GameState.orders`, commands `ACCEPT_ORDER`/`COMPLETE_ORDER`, query `orders/order-queries.ts`, the `OrderBoard` sub-component in `ShopScreen.tsx`, content `content/vertical-slice/orderContent.ts` (2 orders). **Incoming dependents**: `COMPLETE_ORDER` credits `economy.coins` and `progression` rank progress — same one-way-write note as §3.6. No KEEP/ADAPT system reads order state. Safe to retire independently of everything else — fully isolated cluster.

### 3.10 Shop-specific Pixi scene entities
`StationEntity`, `DisplayEntity`, `CustomerEntity`, `ExpeditionHubEntity` retire as content/behavior (their imports, texture keys, and view-model builder functions in `scene-view-model.ts` are Shop-specific). `CatchmonEntity` does **not** retire — it renders Catchmons generically and Doc 15 R9 explicitly wants Lead-sprite rendering, so it moves to ADAPT (§2.8). `ExpeditionHubEntity`'s single-special-building *pattern* is a reuse template even though its content retires.

---

## 4. Presentation migration map (current 3-tab IA → future Journey / Forge / Catchmons / World)

| Current | Verdict | Notes |
|---|---|---|
| `ShopScreen.tsx` | **RETIRE** (content); layout pattern ADAPT | Pixi-scene-host + side-panel + sub-tabs layout pattern reusable for the future Journey screen (battle scene + HUD); none of its Displays/Stations/Orders sub-tab content carries over. |
| `CatchmonsScreen.tsx` | **KEEP/ADAPT** — strong reuse | Roster + Catchdex structure maps almost directly onto Doc 15 R8's "Catchmons" tab (roster, skills). Minimal rework expected. |
| `WorldScreen.tsx` | **KEEP/ADAPT** — strong reuse | Region map + route list + expedition-timer panel maps directly onto Doc 15 R8's "World" tab. Only content/intent labels change. |
| *(none — net new)* | **NEW** | "Forge" screen has no current equivalent. Closest reusable *interaction patterns*: `StationSheet.tsx`'s queue/selection interaction, `InventorySheet.tsx`'s browsing pattern — not the screens themselves. |
| `BottomTabBar.tsx` | **ADAPT** | Hardcoded 3-item `DESTINATIONS` array → 4-item Journey/Forge/Catchmons/World array. |
| `TopBar.tsx` | **ADAPT** | Hardcoded `TITLES` map extends to 4 routes; Momentum-chip conditional removed. |
| `AppShell.tsx`, `SheetHost.tsx`, `GoalBanner.tsx`, `SaveStatusBanner.tsx` | **KEEP** (pattern) | Structural pattern reusable as-is. |
| `ui-store.ts`'s `activeSheet` union | **ADAPT** | 9 Shop sheet kinds → new Forge/Combat sheet kinds (relic compare, Battle Path select, skill loadout, etc. — not yet designed, do not invent now). |
| `CatchmonDetailSheet.tsx`, `EvolutionSheet.tsx` | **KEEP/ADAPT** | Strong reuse — evolution mechanic survives near-verbatim. |
| `EncounterSheet.tsx` | **ADAPT** | Capture mechanic survives; reward/wording flavor changes. |
| `RouteSheet.tsx` | **ADAPT** | Expedition planning (Lead selection, aid toggle, Start) survives; gate condition changes (§7.1). |
| `CustomerSheet.tsx`, `DisplaySheet.tsx`, `StationSheet.tsx` | **RETIRE** | No Ascension equivalent. |
| `ExpeditionResultSheet.tsx`, `InventorySheet.tsx` | **ADAPT** (partial) | Structure reusable, content (routine material / component rewards) needs re-typing toward Echo Charges/Relics/Essence. |
| `Button`, `Panel`, `StatusPill`, `Tabs`, `SectionHead`, `Sheet`, `ArtPlaceholder` | **KEEP** | Pure design system. |
| `ElementBadge`, `CatchmonCard` | **KEEP/ADAPT** | Needed for combat too; `CatchmonCard` may need Power/Build-Fit stat additions later (Doc 01 §3.5), not now. |
| `CurrencyChip` | **ADAPT** | Drop `"momentum"` kind; add new currency kinds (Echo Charges, Essence) when R3 needs them. |
| `ProductCard` | **RETIRE** | No product concept in Ascension. |
| `Slot` | **ADAPT** — do not delete | Strong reuse candidate for Relic Matrix slots (§3.5). |
| Icons, motion tokens, design tokens, `shared.css` | **KEEP** | Genre-agnostic design system. |
| `useNow`, `usePendingAction`, `useReconciliationTicker`, `useQueries` | **KEEP** | Generic engine-integration hooks. |
| `useContextualGoal` | **ADAPT** | The "one selector: current primary goal" *pattern* directly matches Doc 01 pillar E ("Layered Goals") — strong reuse of pattern, Shop-flavored goal computation retires with its content. |
| `useCustomerArrivalTicker` | **RETIRE** | No Ascension equivalent. |
| `ShopSceneRenderer.ts` scaffolding | **KEEP** | Host/layer/lifecycle/effects/texture-cache machinery genre-agnostic. |
| `scene-view-model.ts` | **RETIRE** (content) / **KEEP** (architectural role) | New view-model needed for the battle scene; the "only file allowed to import domain/application" convention stays. |
| `CatchmonEntity` | **KEEP/ADAPT** | Lead-sprite rendering, per Doc 15 R9. |
| `StationEntity`, `DisplayEntity`, `CustomerEntity` | **RETIRE** | No Ascension equivalent. |
| `ExpeditionHubEntity` | **RETIRE** (content) | Single-special-building pattern is a reuse template for a future Forge/boss entity. |

---

## 5. GameState audit

### 5.1 Current decomposition — KEEP / ADAPT / REMOVE

`GameState` has 12 top-level fields (`domain/game-state/game-state.ts` + `slices.ts` + `meta.ts`). The **state-container mechanism itself** (normalized `Record<Id, X>` + parallel ID-array slices, activity snapshotting so later balance changes don't retroactively alter in-progress activities, sparse absence-as-default maps, structural-invariant validation via `validateGameState`) is this project's single most reusable architectural asset — **KEEP** regardless of what happens to individual slices.

| Field | Verdict | Notes |
|---|---|---|
| `meta` | **KEEP** | Save identity/versioning (`saveId`, `schemaVersion`, timestamps, `revision`, `rootRandomSeed`, `randomEventCounter`, `contentVersion`) — fully generic, unchanged. |
| `economy` | **KEEP** | `{coins: Coins}`. Doc 09 confirms **Coins is Ascension's universal currency too** (different sources/sinks — battles/recycling/offline/expeditions instead of sales — same ledger shape). `domain/economy/coin-ledger.ts` survives verbatim. |
| `inventory` | **KEEP (mechanism) / ADAPT (content)** | The reservation-ledger mechanism (§1.9) is 100% reusable; the specific `ItemId` catalog it holds shifts from products/materials/components toward Relic-adjacent/gear items. `product-item-id.ts`'s quality-scoped-ID helper retires with products. |
| `shop` | **REMOVE** | `momentum`, `displaySlots`, `shopFloorSupportCatchmonIds` — no Ascension equivalent (Doc 09 has no Momentum-analog currency; Bond Support assignment is a new mechanic under a future `combat`/`loadout` slice, not a straight carry-over of `shopFloorSupportCatchmonIds`). |
| `crafting` | **REMOVE** | Station/queue state — no Ascension equivalent (Rift Forge is a single-building instant/roll mechanic per Doc 04, not a multi-station craft queue). |
| `customers` | **REMOVE** | No Ascension equivalent. |
| `orders` | **REMOVE** | No Ascension equivalent. |
| `catchmons` | **KEEP (mechanism) / ADAPT (assignment vocab)** | Ownership/level/xp/evolution-readiness shape survives; `currentAssignment` union's `WORKSHOP`/`SHOP_FLOOR` literals need replacing with Lead/Bond-Support-flavored kinds (§7.3). |
| `expeditions` | **KEEP (mechanism) / ADAPT (rewards)** | Structure survives; reward shape re-types toward Doc 09's currencies. |
| `world` | **KEEP (mechanism) / ADAPT (content + intents)** | `unlockedRegionIds`/`routeStates`/`discoveryStates`/protection counters/`encounterOpportunities` all survive; `ExpeditionIntent` vocabulary and route-purpose framing adapt from shop-supply to journey/stage framing. |
| `progression` | **KEEP (mechanism) / ADAPT (naming + conditions)** | Rank/rankProgress/milestones/unlocked-systems shape survives; renames to Journey Rank, needs new `UnlockConditionType` values (open design gap, §9). |
| `infrastructure` | **REMOVE (content) / template for `forge`** | Expedition Hub / Display Expansion don't carry over as content, but `InfrastructureDefinition`'s unlock-gated-purchase-with-optional-timer shape is a plausible reuse template for Forge Level upgrades. |

### 5.2 Proposed future Ascension GameState areas (per Doc 14 §8 — not implemented yet)

| Future area | Relationship to current state |
|---|---|
| `journey` | **Net new.** No current equivalent — stages/bosses/path-progress (Doc 14 §6's `domain/journey/`). |
| `combat` / `loadout` | **Net new.** No current equivalent — stats, battle-state, effects, damage, Battle Path, relic-matrix, skills, support-formation, Build Fit. |
| `forge` | **Net new**, with a reuse template: `infrastructure`'s unlock-gated-purchase-with-timer shape and `shop-rank.ts`'s curve math (for Forge Level/Insight) are both plausible starting points, not blank-slate work. |
| `relicInventory` | **Net new — open design question, not to invent now.** May build on the generic `inventory-ledger.ts` reservation engine if Relics are stackable-ish, or may need a bespoke non-stacking "unique instance" ledger since Relics are individually rolled (unlike craft materials). Flag for R3 design, not R1/R2. |
| `catchmons` | **Carries forward, KEEP mechanism / ADAPT assignment vocab** (§5.1). |
| `skills` | **Net new.** No current equivalent (Doc 14 §6's `domain/loadout/skills`). |
| `progression` | **Carries forward, ADAPT** (§5.1) — Journey Rank replaces Shop Rank. |
| `world` | **Carries forward, KEEP mechanism / ADAPT content** (§5.1). |
| `expeditions` | **Carries forward, KEEP mechanism / ADAPT rewards** (§5.1). |
| `settings` | **Net new.** No current equivalent at all — low-risk, generic (accessibility/sound toggles). |
| save metadata | **= current `meta`, KEEP** (§5.1). |

`economy` isn't in Doc 14's list by name but Doc 09 confirms Coins persists — recommend keeping it as its own slice (or folding into wherever currencies are centralized) rather than treating it as removed; this is a low-risk naming decision, not a design gap.

### 5.3 Safe-removal note

**All of `shop`, `crafting`, `customers`, `orders`, and `infrastructure`'s content can disappear with zero migration risk.** Two independent reasons:
1. R0 gave Ascension its own IndexedDB database name and save id, fully isolated from Catchmon Shop (confirmed in R0's report) — there is no obligation to read or upgrade a Catchmon Shop save.
2. `infrastructure/persistence/migrations/migration-pipeline.ts`'s `MIGRATIONS` array is **currently empty** — only a v1 baseline fixture exists. Ascension has not yet shipped any real player save under its own schema either. Removing/renaming `GameState` fields today requires **zero** migration-writing, only updating `save-envelope.ts`'s `gameStateShapeSchema` field list in the same change (§7.5) — and even that only matters once real saves exist under the current shape (CLAUDE.md §24's "persistence freeze point" has not been declared for Ascension; this is free/low-risk restructuring for now, but the discipline should be re-applied the moment any real save is at stake).

---

## 6. Command / Query audit

### 6.1 Commands (21 handlers + `RECONCILE` = 22 registered types, `src/app/register-commands.ts`)

| Command | Verdict | Note |
|---|---|---|
| `START_CRAFT`, `QUEUE_CRAFT`, `CANCEL_QUEUED_CRAFT`, `WORKSHOP_PUSH` | **RETIRE** | §3.6, §3.3. |
| `ASSIGN_DISPLAY_PRODUCT`, `CLEAR_DISPLAY_SLOT` | **RETIRE** | §3.5. |
| `ARRIVE_CUSTOMER` | **RETIRE** | §3.1. |
| `STANDARD_SALE`, `FAVORABLE_DEAL`, `PREMIUM_PITCH`, `RECOMMEND`, `DECLINE` | **RETIRE** | §3.2. |
| `ACCEPT_ORDER`, `COMPLETE_ORDER` | **RETIRE** | §3.9. |
| `PURCHASE_INFRASTRUCTURE` | **RETIRE (content) / ADAPT (name+shape)** | §3.7 — generic name and shape, Shop-specific gating/targets. |
| `ASSIGN_CATCHMON` | **ADAPT** | Generic command name/plumbing; two of its four assignment-kind literals (`WORKSHOP`/`SHOP_FLOOR`) are Shop-specific and baked into the **domain type**, not just this handler — flagged clearly per the task's "highlight anything currently named generically but actually coupled to Shop semantics" instruction. See §7.3. |
| `EVOLVE_CATCHMON` | **KEEP** | Fully generic, no Shop coupling. |
| `START_EXPEDITION` | **ADAPT** | Generic lifecycle; currently gates on Shop infrastructure ownership — see §7.1 (the audit's top risk). |
| `ATTEMPT_CAPTURE`, `DECLINE_ENCOUNTER`, `OBSERVE_ENCOUNTER` | **KEEP/ADAPT** | Structurally generic; reward flavor adapts per Doc 09. |
| `RECONCILE` | **KEEP (mechanism) / ADAPT (composed pass list)** | Generic name and wrapper; `buildReconciliationPasses()`'s concrete list is Shop-specific-content-in-a-generic-wrapper. |

### 6.2 Queries (11 files, 7 family directories)

| Family | Verdict | Note |
|---|---|---|
| `craft/craft-queries.ts` | **RETIRE** | §3.6. |
| `display/display-queries.ts` | **RETIRE** | §3.5. |
| `customer/customer-arrival-service.ts`, `customer/transaction-quote-engine.ts` | **RETIRE** | §3.1/§3.2. |
| `orders/order-queries.ts` | **RETIRE** | §3.9. |
| `catchmons/catchmon-queries.ts` (`getEligibleDomains`, `isEligibleForDomain`) | **ADAPT** | Pure/catalog-only today; `CatchmonDomain`'s 4 values (WORKSHOP/SHOP_FLOOR/SUPPLY/EXPEDITION) need replacing with combat-flavored domains. |
| `catchmons/catchmon-effect-queries.ts` | **SPLIT — do not delete wholesale** | `getWorkshopCraftSpeedEffect` and `getShopFloorRecommendCompatibilityEffect` RETIRE with crafting/customers; `getExpeditionDiscoveryBoostEffect` is generic and **stays** (§3.6 flags this explicitly). |
| `expeditions/expedition-queries.ts`, `expeditions/capture-queries.ts`, `expeditions/failed-capture-recovery-query.ts` | **KEEP/ADAPT** | Structurally generic, content/reward flavor adapts. |
| `progression/contextual-goal-query.ts` | **ADAPT** | Generic "one selector" pattern; Shop Rank-specific goal computation adapts to Journey Rank. |

### 6.3 Reconciliation passes

| Pass | Verdict |
|---|---|
| `craft-queue-reconciliation-pass.ts` | **RETIRE** (with §3.6) |
| `infrastructure-construction-reconciliation-pass.ts` | **RETIRE** (with §3.7) |
| `expedition-reconciliation-pass.ts` | **KEEP/ADAPT** |
| `region-unlock-reconciliation-pass.ts` | **KEEP/ADAPT** (blocked on §7.2 until unlock rules are re-authored) |

---

## 7. Dangerous dependencies discovered

Ranked by severity. **None of these block R1** (an audit produces no code changes); they are things R2+ must resolve *before* the corresponding RETIRE cluster is actually deleted.

### 7.1 CRITICAL, TARGET LOCKED / IMPLEMENTATION DEFERRED TO R6 — Expeditions (KEEP/ADAPT) currently hard-depend on Shop Infrastructure (RETIRE) ownership
`application/commands/expeditions/start-expedition.ts` validates that the player owns the Expedition Hub (`infrastructure.ownedInfrastructureIds`) before allowing `START_EXPEDITION` to succeed. Expeditions are one of the systems this audit recommends keeping/adapting almost unchanged (§2.2) — but as written today, they cannot function once `infrastructure`/Shop-infrastructure content retires.

**Locked target model** (per user direction, matching Doc 08 §3's "Region Unlock: Journey/global readiness + prior-region milestone + optional signature gate" applied to expedition availability specifically):

> **system/Journey milestone + region/route access → expedition availability**

The old Expedition-Hub-ownership gate is legacy Shop behavior and is not the target model. **No final numbers, no new `UnlockConditionType` values, and no expedition redesign are decided or implemented now** — only the target shape above is locked.

**Migration seam (exact, isolated, verified)**: the legacy gate lives in exactly one place — the single ownership check inside `start-expedition.ts`. No other expedition file reads `infrastructure` at all: `domain/expeditions/*` (capture-chance/encounter-selection/rewards), `application/queries/expeditions/*`, and `application/reconciliation/expedition-reconciliation-pass.ts` are all already infrastructure-agnostic (confirmed in §2.2/§2.3). This means the eventual R6 change is small and mechanical: swap that one ownership check for a call into the existing generic `isUnlockRuleSatisfied` evaluator (§1.6) against a new rule composed of a Journey-milestone-equivalent condition (named/typed in R6, once Journey/world progression exists) plus the route's own region-access check (`route-access.ts`, already generic, already unchanged by this seam). **Until R6**: the legacy Expedition-Hub-ownership check stays exactly as written, and Shop-infrastructure content (Expedition Hub, Display Expansion) is *not* deleted — it remains registered and purchasable via the still-reachable `/shop` route (§11), so expeditions keep working exactly as before throughout the transition. This satisfies "keep the legacy dependency isolated until then" without touching expedition logic now.

### 7.2 HIGH, TARGET LOCKED / IMPLEMENTATION DEFERRED TO R6 — World region-unlock rules (KEEP/ADAPT) currently reference `SHOP_RANK` (RETIRE-adjacent)
Ozean's current unlock rule is a "2-signal rule" mixing a `SHOP_RANK` condition with an `EXPEDITION_MILESTONE` condition (confirmed by the content/e2e inventory and `e2e/ozean-region-unlock.spec.ts`).

**Locked target model** (per user direction, verified verbatim against Doc 08 §3: "Use generic unlock rules: Journey/global readiness, prior-region milestone, optional signature gate"):

> **global/Journey readiness + prior-world milestone → region unlock**

**No final Journey Rank numbers and no new `UnlockConditionType` vocabulary are decided or implemented now** — only the target shape above is locked, to be implemented in R6 once Journey/world progression actually exists (Doc 07 §3 confirms Journey Rank draws from "stages, bosses, region milestones, collection milestones," none of which exist until R2–R6 build them).

**Migration seam (exact, isolated, verified)**: `domain/progression/unlock-evaluator.ts` (§1.6) is condition-type-agnostic — it evaluates whatever `UnlockCondition` object a rule declares and has no knowledge that one of today's inputs happens to be `SHOP_RANK`. The seam is therefore entirely in the **content layer**, not domain/application: `content/vertical-slice/worldContent.ts`'s Ozean unlock-rule definition is the *only* place this dependency exists. The R6 change is a content-only swap — replace the primary `SHOP_RANK` condition with a new Journey-readiness condition type (added to `UnlockConditionType` in R6, per §1.6/§9's "do not invent now" rule), keeping the existing generic `EXPEDITION_MILESTONE` secondary condition (or a "prior-world milestone" condition) as-is, matching the locked target model exactly. **Until R6**: Ozean's unlock rule stays exactly as written (still gated on `SHOP_RANK`), and Shop Rank content is *not* retired — `region-unlock-reconciliation-pass.ts` (KEEP/ADAPT) continues to work unchanged.

### 7.3 MEDIUM — Shop-specific literals baked into the `catchmons` domain type, not just a command handler
`ASSIGN_CATCHMON`'s `CatchmonAssignment` union includes `WORKSHOP`/`SHOP_FLOOR` as literal values in the **domain type** (`domain/catchmons/types.ts`-adjacent, referenced by `GameState.catchmons`), not merely in the command's own logic. Retiring these requires *widening/replacing* the type in the same change that introduces Lead/Bond-Support assignment kinds — deleting the Shop kinds without adding replacements would leave `ASSIGN_CATCHMON` unable to represent any assignment at all for a combat-context Catchmon. Do this as one atomic change, not a delete-then-add sequence.

### 7.4 LOW / cosmetic — `core/ids/ids.ts` mixes Shop-specific ID type names into the otherwise-generic `src/core/` layer
`ProductId`, `RecipeId`, `StationId`, `CustomerId`, `CustomerArchetypeId`, `DisplaySlotId`, `OrderId` are declared in `core/ids/ids.ts` alongside genuinely generic ones. This is not a functional coupling risk (the branding *mechanism* and `Registry`/cross-reference validator are agnostic to which ID types exist) — it's an architectural-cleanliness note. Safe to prune these specific type declarations once their owning RETIRE clusters (§3) are actually deleted, but not before (their commands/content still reference them until then).

### 7.5 LOW / procedural — `save-envelope.ts`'s `gameStateShapeSchema` hardcodes the current top-level slice names
Whenever a `GameState` top-level field is renamed or removed (R2+), this Zod schema (`infrastructure/persistence/save-envelope.ts`) must be updated in the **same commit**, or save validation will reject saves that no longer have a field the schema still requires. Currently low-risk (no real player saves exist yet under any Ascension schema — §5.3), but this is exactly the kind of change that's easy to forget mid-refactor. Flagging it now so it's not rediscovered as a bug later.

### 7.6 Informational — `progression`/`economy` receive one-way credits from RETIRE clusters
`craft-queue-reconciliation-pass.ts` and `COMPLETE_ORDER` both credit `progression` rank-progress (and `COMPLETE_ORDER` credits `economy.coins`) on completion. This isn't a blocking dependency (progression/economy don't *read from* the retiring clusters, only receive occasional writes), but when crafting/orders retire, whatever new Ascension events are supposed to drive Coins/Journey-Rank progress (battles, recycling, offline rewards, expeditions per Doc 09 §2) need to actually exist before those meters would otherwise stop moving. Relevant to R2's combat-kernel design, not an R1 blocker.

---

## 8. Recommended retirement order

**Principle applied**: replace-then-retire, not retire-then-replace — matching Doc 15's own phase order (R2–R7 build the new domain/backend systems and R8–R9 build their UI *before* anything Shop-specific is deleted). Nothing below should happen before its replacement exists and is wired end-to-end. Within that constraint, prefer small batches over one giant deletion, per the task's own instruction.

1. **Resolve §7.1 and §7.2 as design decisions first** (not code changes) — what gates expedition access, and what Ozean's unlock rule becomes — before any Shop-infrastructure or Shop-Rank content is touched. These are prerequisites to sequencing, not sequencing steps themselves.
2. **Isolated, zero-incoming-dependency clusters — safe to delete first, whenever their UI is no longer needed**: Everyday Orders (§3.9 — fully isolated, only writes outward to `progression`/`economy`), then Customer selling loop + sale commands + Momentum (§3.1/§3.2/§3.3 — tightly coupled to each other, retire as one batch, only writes outward to `catchmons`/`inventory`).
3. **Crafting + Display** (§3.4/§3.5/§3.6 — retire together, since display depends on product data and customers depend on display) — but only after confirming `catchmon-effect-queries.ts`'s `getExpeditionDiscoveryBoostEffect` export is preserved (§6.2 split) and `craft-queue-reconciliation-pass.ts`'s Shop-Rank credit is no longer the only thing feeding rank progress (§7.6).
4. **Shop Infrastructure** (§3.7) — only after §7.1 is resolved (expeditions re-gated on something else) and the new Forge/journey systems exist to take over `InfrastructureDefinition`'s reusable shape if desired.
5. **Shop Rank → Journey Rank rename/content swap** (§2.5) — only after §7.2 is resolved (region-unlock rules re-authored).
6. **`CatchmonAssignment` widening** (§7.3) — do this as part of R5 (Catchmon Combat Integration) when Lead/Bond-Support kinds are actually introduced, in the same change, not before and not as a separate cleanup pass.
7. **Presentation/Pixi retirement** (§4) — naturally sequenced by Doc 15 R8 (React UX) and R9 (Pixi Battle Scene): the new screens/scene must exist and be wired to the router/tab bar *before* `ShopScreen`/`StationSheet`/`DisplaySheet`/`CustomerSheet`/`StationEntity`/`DisplayEntity`/`CustomerEntity`/`ExpeditionHubEntity` are deleted, so the app is never left without a working screen for a given tab.
8. **`core/ids/ids.ts` pruning** (§7.4) — last, purely cosmetic, once every RETIRE cluster above is actually gone and nothing references those ID types anymore.

Doc 15 R1's own terse exit line ("new app boots with a neutral shell while Shop loop is no longer required") **is now met** — see §11. §7.1 and §7.2 are now locked-target/deferred-implementation items (not open questions) per the migration seams documented there; step 1 above is complete for the *decision*, the *implementation* of those seams remains correctly deferred to R6 as directed.

### 8.1 Exact modules intentionally deferred to R5/R6/R8

Named explicitly so a future session doesn't need to rediscover them:

| Deferred to | Module(s) | What's deferred |
|---|---|---|
| **R5** (Catchmon Combat Integration) | `domain/catchmons/types.ts`'s `CatchmonAssignment` union (§7.3) | Widening `WORKSHOP`/`SHOP_FLOOR` to Lead/Bond-Support kinds — do this atomically with R5's real Lead/Bond-Support introduction, not as a standalone cleanup. |
| **R6** (World / Stage Integration) | `application/commands/expeditions/start-expedition.ts`'s ownership check (§7.1) | Swap the Expedition-Hub-ownership condition for the locked target model (system/Journey milestone + region/route access). Isolated to this one file's one check. |
| **R6** (World / Stage Integration) | `content/vertical-slice/worldContent.ts`'s Ozean unlock rule (§7.2) | Swap the `SHOP_RANK` primary condition for the locked target model (global/Journey readiness + prior-world milestone). Content-only change, no domain/application code touched. |
| **R6** (World / Stage Integration) | `domain/progression/unlock-evaluator.ts`'s `UnlockConditionType` union (§1.6, §7.2) | Add whatever new condition type(s) the R6 Journey-readiness rule needs — not invented now. |
| **R8** (React UX) | `BottomTabBar.tsx`, `TopBar.tsx`, `ui-store.ts`'s `activeSheet`/tab enums (§2.9, §4) | Grow from the current interim 3-tab (Journey-placeholder/Catchmons/World) shell to the real 4-tab Journey/Forge/Catchmons/World IA once Forge exists. |
| **R8/R9** | `ShopScreen.tsx` and its sub-tabs, all Shop sheets/entities (§3, §4) | Actual deletion — only once their replacement screens/scene exist and are wired into the tab bar (§8 steps 2–7 below, unchanged). |

---

## 9. R2 prerequisites

1. **Read `docs/rebuild/02_CORE_GAMEPLAY_LOOP_AND_SESSION_DESIGN.md` and `docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md` in full before starting R2** — this audit did not need to (context discipline, CLAUDE.md §5), but R2 ("Journey & Combat Kernel") is their owning implementation phase.
2. **§7.1 is target-locked, implementation deferred to R6** — do not implement the expedition-gating swap during R2; the legacy Expedition-Hub-ownership check stays as-is until then (§8.1).
3. **§7.2 is target-locked, implementation deferred to R6** — do not implement the Ozean unlock-rule swap during R2; it stays gated on `SHOP_RANK` until then (§8.1).
4. **Do not invent new `UnlockConditionType` values or Journey-Rank milestone content yet** — real gaps exist (§1.6, §2.5) but are explicit open design work for R6+ (§8.1), not to be filled in during R2 without a design source.
5. **R2 should build against the neutral shell** (§11) — `/journey`'s placeholder content is expected to be replaced by R2/R8's real Journey screen; the route itself, `JourneyPlaceholderScreen.tsx`'s file, and the bottom-tab-bar wiring are the integration points to build on, not to be reinvented.

---

## 10. Files changed to produce the original audit (read-only phase)

None. That phase was read-only: four parallel codebase inventories plus direct verification of `reference/catchmons/*.json` line/element counts, followed by this document.

---

## 11. Neutral shell (R1 exit criterion)

Doc 15's literal R1 exit line — "new app boots with a neutral shell while Shop loop is no longer required" — is implemented here, minimally, per the closure task's explicit constraints (smallest necessary shell; no broad deletion pass; no Journey/Forge final UX; no combat; no Rift Forge).

### 11.1 What changed

- **New file** `src/presentation/screens/JourneyPlaceholderScreen.tsx` — a static placeholder screen (a `Panel` + `StatusPill` + two lines of copy explaining the rebuild is in progress). No gameplay logic, no `GameState` reads beyond what `AppShell`/`GoalBanner` already do globally. Explicitly documented in its own header comment as *not* Doc 15 R8's real Journey screen.
- **`src/App.tsx`**: added a `/journey` route rendering the placeholder; changed the index-route redirect from `/shop` to `/journey`. The `/shop` route **is not removed** — `ShopScreen` still renders there, fully functional, reachable by direct navigation.
- **`src/presentation/shell/BottomTabBar.tsx`**: the 3-item `DESTINATIONS` array's first entry changed from `{to:"/shop", label:"Shop", icon:"store"}` to `{to:"/journey", label:"Journey", icon:"zap"}`. Catchmons/World entries unchanged.
- **`src/presentation/shell/TopBar.tsx`**: added a `"/journey": "Journey"` entry to the `TITLES` map. The existing `/shop` entry and the Shop-route-conditional Momentum chip are both left in place (still correct for the still-reachable `/shop` route; touching them wasn't required for the neutral-shell criterion and would have been unnecessary scope).
- **`src/App.test.tsx`**: updated the boot assertion to expect the "Journey" heading (not "Shop") after boot, and added an explicit assertion that no "Shop" link appears in the default primary nav.
- **`e2e/bootstrap.spec.ts`**: updated to assert the neutral-shell landing (Journey heading, Catchmons/World nav links, no Shop nav link), then separately navigates to `/shop` directly and confirms the Shop screen still renders there — proving Shop is reachable-but-not-default, not deleted.

### 11.2 What did not change (deliberately)

- No Shop gameplay file was deleted or had its logic touched — `ShopScreen.tsx`, all Shop sheets, all Shop commands/queries/domain modules, all Shop content registries are untouched.
- `ui-store.ts`'s `ShopTab`/ `activeSheet` sheet-kind unions are untouched — Shop's own internal UI state still works exactly as before when the `/shop` route is visited directly.
- No combat, Forge, journey/stage, or Battle Path logic was added — the placeholder screen has zero domain logic.
- The other 9 Shop-flow E2E specs (`new-game-sale`, `momentum-loop`, `living-shop-scene`, `fresh-save-progression`, `expedition-and-capture`, `ozean-region-unlock`, `deterministic-capture`, `save-migration`, `writer-lease`) were **not** updated. Most of them `page.goto("/")` and then interact with Shop-screen UI, which no longer loads by default — they are expected to fail if run as-is until they're updated to navigate to `/shop` first. This was an explicit scope boundary from the closure task ("run only the minimal relevant browser smoke/E2E needed to prove the neutral shell boots without the Shop loop") — fixing all nine is deferred, not silently skipped; tracked below as a remaining prerequisite.

### 11.3 Is Shop gameplay still required for boot?

**No.** `bootGame()` (`src/app/boot.ts`) itself was never Shop-coupled at the boot-sequence level — it builds the catalog, opens the database, loads/reconciles/creates the save, and constructs the engine regardless of which screen the router lands on afterward. What made Shop "required" before this change was purely the router's index-redirect target (`/shop`) and the tab bar's default-active tab, both presentation-layer decisions — now fixed. The engine, catalog, and full Shop domain/command registration still initialize on every boot (by design — no broad deletion pass; `register-commands.ts` is untouched), so Shop *code* still runs during boot, but no Shop *screen or interaction* is required to reach a usable app state.

### 11.4 Remaining known gap

The 9 Shop-flow E2E specs listed in §11.2 need a one-line `page.goto("/shop")` (or an in-page navigation click) added before their existing Shop-screen interactions, to keep passing against the new default route. This is intentionally deferred — not part of this closure's scope — and should be picked up opportunistically whenever each spec's underlying system is touched during its own RETIRE-cluster work (§8), or as a small standalone cleanup before R8 if it becomes a maintenance burden sooner.

### 11.5 Files changed in this closure update

- `src/presentation/screens/JourneyPlaceholderScreen.tsx` (new)
- `src/App.tsx`
- `src/App.test.tsx`
- `src/presentation/shell/BottomTabBar.tsx`
- `src/presentation/shell/TopBar.tsx`
- `e2e/bootstrap.spec.ts`
- `docs/rebuild/R1_DEPENDENCY_AUDIT.md` (this document)

### 11.6 Checks run for this closure

- **Tier 1** (`check:fast`, scoped to the files above): typecheck, legacy-leak scan, lint, format, `vitest related` — all green (one iteration needed a Prettier auto-format pass and a duplicate-heading test fix — see below).
- **Tier 3 / full phase gate** (`pnpm check`, required because boot/router behavior changed): typecheck, lint, format, legacy-leak scan, full test suite, production build, E2E-hook-absence check — all green.
- **E2E smoke** (`playwright test e2e/bootstrap.spec.ts`, the minimal spec scoped to prove the neutral shell): **passed** — confirms `/` lands on the "Journey" heading with Catchmons/World nav links and no default "Shop" nav link, and that `/shop` remains directly reachable with the Shop screen intact. (First run against this spec hit a stale `vite preview` process left listening on port 4173 from an earlier session, serving an old build — killed it and reran against a fresh build before treating the result as valid.)
- One real bug caught and fixed during Tier 1 iteration: `JourneyPlaceholderScreen`'s `Panel` title duplicated `TopBar`'s page-title text ("Journey" appeared as both an `h1` and an `h2`), which made `getByRole("heading", {name: "Journey"})` ambiguous in `App.test.tsx`. Fixed by renaming the panel's own title to "Rebuild in progress" so the page has exactly one "Journey" heading (the `TopBar`'s).

---

## 12. R2–R5 Campaign Update (Combat Kernel, Rift Forge, Battle Paths, Catchmon Combat Integration)

### 12.1 §7.1/§7.2 status — still target-locked, still deferred to R6, now with real Journey/Forge state to attach to

R2–R5 built the actual `journey`/`loadout`/`forge`/`relicInventory`/`skills` `GameState` areas and `domain/journey`, `domain/combat`, `domain/forge`, `domain/loadout` (§14 §5/§6 areas this audit's §5.2 table only *proposed* before). This does not change the §7.1/§7.2 decision — both remain correctly deferred to R6 exactly as locked in §7.1/§7.2 above — but it does mean R6 no longer has to invent the Journey-side half of the target models from nothing: `journey.currentStageIndex`/`clearedStageIds` and `progression.rank` (soon to be renamed Journey Rank) are real, populated fields R6 can condition on immediately. See `docs/rebuild/PRE_R6_READINESS.md` for the precise seam.

### 12.2 Retirement executed this batch: Everyday Orders

Fully retired — confirmed fully isolated (zero KEEP/ADAPT dependents) exactly as §3.9/§8 step 2 predicted:
- Deleted: `domain/orders/{types.test.ts}` (kept `types.ts`/`index.ts` as a type-only module — see below), `application/commands/orders/`, `application/queries/orders/`, `content/vertical-slice/orderContent.ts`.
- Edited: `app/register-commands.ts` (removed `ACCEPT_ORDER`/`COMPLETE_ORDER`), `app/game-events.ts` (removed `OrderEvent`), `app/game-config.ts` (removed `maxActiveOrders`), `content/vertical-slice/{index.ts,catalogContent.ts}` (removed order-content wiring), `presentation/screens/ShopScreen.tsx` (removed the Orders tab + `OrderBoard`), `app/ui-store.ts` (removed `"orders"` from `ShopTab`), `application/dev-harness/shop-loop-dev-harness.ts` + its test (removed the Everyday-Order proof step — the rest of the Phase-4 shop-loop proof is untouched and still passes).
- **Kept as a type-only module**: `domain/orders/types.ts`'s `EverydayOrderDefinition` — still referenced by `GameCatalog`'s generic `everydayOrders` registry category (now always empty for Ascension content) and by `content/scale-fixture/shop.ts`'s separate, still-active synthetic scale-validation content (not live gameplay). Deleting it outright broke both; restoring just the type (no commands/queries) was the correct fix, not a sign the retirement was unsafe.
- `GameState.orders` (the slice) was **not** removed — it stays present but permanently empty now that nothing writes to it (no commands populate it beyond `createInitialGameState`'s now-empty catalog-driven seed). Removing the slice itself would require another save-schema-adjacent change (§7.5's dangerous dependency); deferred, consistent with "prefer small future cleanup batches."
- Verified via `vitest related` across every touched file: 57 test files / 312 tests, all green.

### 12.3 Retirement assessed but deferred: Customer selling loop, Sale actions, Momentum, Display stocking

Re-verified against the current codebase (not just re-quoting §3.1-3.3/§3.5's original assessment): still **zero KEEP/ADAPT dependents** — no domain/application file outside this cluster imports its commands, queries, or domain types. This confirms §3's original audit was accurate.

**Why this batch did not delete it anyway**, despite qualifying as a "good candidate": real dependents *within Shop's own scaffolding* exist and must move together, not be silently orphaned:
- `application/dev-harness/shop-loop-dev-harness.ts` (+ its test) exercises `ARRIVE_CUSTOMER` and all four sale actions as the core of what it proves ("craft → stock → customer → sell → Coins/Momentum") — unlike the Everyday-Order step (one self-contained loop iteration removable in isolation), the sale/customer flow *is* this harness's entire subject. Retiring it means retiring or substantially rewriting the harness, not trimming one step.
- `presentation/sheets/CustomerSheet.tsx`, `presentation/scene/entities/CustomerEntity.ts`/`DisplayEntity.ts`, `presentation/hooks/useCustomerArrivalTicker.ts`, `TopBar.tsx`'s Momentum chip, and `ShopScreen.tsx`'s Customers list/Displays tab all need coordinated removal in the same change, per §4's presentation migration map.
- `GameConfig`'s `saleXpConfig`/`maxActiveCustomers`/`minArrivalIntervalMs`/`customerArchetypes`/`displaySlotUnlockRequirements` would all become dead config simultaneously.

Given the campaign instruction to **be conservative** (stated twice) and this campaign's primary deliverable being R2–R5 itself, attempting this larger, multi-surface removal in the same batch was judged higher-risk than value at this point — not because the dependency analysis is uncertain, but because the removal's *blast radius* (command+domain+content+presentation+dev-harness, ~25 files) is large enough that doing it carefully deserves its own focused pass. **Exact file list for that next pass** (so it doesn't need re-discovery):
- Delete: `domain/customers/`, `domain/shop/momentum-ledger.ts`(+test), `application/commands/customer/`, `application/commands/sale/`, `application/commands/display/`, `application/queries/customer/`, `application/queries/display/`, `content/vertical-slice/customerContent.ts`, `presentation/sheets/{CustomerSheet,DisplaySheet}.tsx`, `presentation/scene/entities/{CustomerEntity,DisplayEntity}.ts`, `presentation/hooks/useCustomerArrivalTicker.ts`.
- Edit: `app/register-commands.ts`, `app/game-events.ts`, `app/game-config.ts`, `content/vertical-slice/{index.ts,catalogContent.ts}`, `presentation/screens/ShopScreen.tsx` (remove entirely or reduce to just Stations, since Displays/Customers retire too), `presentation/shell/TopBar.tsx` (remove Momentum chip/`CurrencyChip`'s `"momentum"` kind), `app/ui-store.ts` (`ShopTab`'s remaining `"displays"` value, `activeSheet`'s `customer`/`display` kinds), `presentation/scene/scene-view-model.ts` (drop customer/display view-model builders), `application/dev-harness/shop-loop-dev-harness.ts` (retire the whole file + test — nothing it proves survives once sale/customer/display are gone), `domain/inventory/product-item-id.ts` callers (unaffected — that module stays, only its Shop-only *caller* retires with products, which are NOT retiring this round).
- **Still correctly blocked from full completion** by §7.1 (crafting/products are *not* retiring this round, and products/recipes/stations have real dependents — Workshop-assigned Catchmons, `craft-queue-reconciliation-pass.ts` — so `StationSheet.tsx`/`StationEntity`/crafting stay exactly as before).

### 12.4 `CatchmonAssignment` widening confirmed additive, safe

§7.3/§8's plan held exactly as designed: `LEAD`/`BOND_SUPPORT` were added to the union without touching `WORKSHOP`/`SHOP_FLOOR`/`SUPPLY`; the existing `ASSIGN_CATCHMON` handler (Shop's) was given one small guard rejecting the two new kinds with a clear redirect error, rather than being taught to understand them — Shop's crafting/display assignment flows are untouched and still pass their existing tests. No hybrid/invalid assignment state is representable (verified in `loadout-assignment.test.ts` via `validateGameState` after every transition). `core/ids/ids.ts`'s Shop-specific ID types (§7.4) were **not** touched — correct, since crafting/display still use them.
