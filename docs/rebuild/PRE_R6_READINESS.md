# Pre-R6 Readiness Audit

**Status:** Audit only — R6 (World / Stage Integration) has **not** been implemented. This document answers exactly what R6 must migrate, verified against the repository as it stands after the R2–R5 campaign (docs/rebuild/R1_DEPENDENCY_AUDIT.md §12).

---

## 1. `START_EXPEDITION`'s remaining Shop Infrastructure dependency

**Unchanged, verified still present.** `application/commands/expeditions/start-expedition.ts` still validates `state.infrastructure.ownedInfrastructureIds.includes(expeditionHubInfrastructureId)` before allowing an expedition to start — R2–R5 did not touch this file, by design (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.1 explicitly deferred it to R6). No other expedition file reads `infrastructure` — the dependency remains isolated to this one check, exactly as before.

## 2. Ozean's remaining `SHOP_RANK` dependency

**Unchanged, verified still present.** `content/vertical-slice/worldContent.ts`'s Ozean unlock rule still composes a primary `SHOP_RANK` condition with a secondary `EXPEDITION_MILESTONE` condition. `domain/progression/unlock-evaluator.ts` is still condition-type-agnostic — the dependency remains purely a content-layer fact (one rule definition), not a domain/application coupling.

## 3. Current Journey progression state now available from R2–R4

New, real, populated state R6 can condition on (none of this existed before this campaign):

| Field | What it holds |
|---|---|
| `state.journey.currentStageIndex` | Position in the ordered `catalog.stages` list (`domain/journey/stage-progression.ts`'s `orderedStages`). |
| `state.journey.clearedStageIds` | Every stage the player has WON at least once. |
| `state.journey.lastBattle` | `{stageId, outcome, resolvedAtMs}` — the most recent `ATTEMPT_STAGE` result. |
| `state.forge.echoCharges` / `totalRelicsForged` / `forgeInsight` | Real Rift Forge progression (R3). |
| `state.loadout.battlePathId` / `equippedSkillIds` / `relicMatrix` | Real build state (R4). |
| `state.loadout.leadCatchmonId` / `bondSupportCatchmonIds` | Real combat Catchmon assignment (R5), synced against `OwnedCatchmonState.currentAssignment`'s `LEAD`/`BOND_SUPPORT` kinds. |
| `OwnedCatchmonState.bondLevel` / `bondProgress` | Real Bond progression (R5), via `domain/catchmons/bond.ts`. |
| `state.progression.rank` / `rankProgress` | Unchanged Shop Rank mechanism (`domain/progression/shop-rank.ts`) — not yet renamed/repurposed as Journey Rank; see §4. |

**None of `journey`/`forge`/`loadout` currently drives any unlock condition anywhere** — R2–R5 built these as a parallel combat progression track, deliberately not yet wired into `UnlockConditionType`/region-access at all (that wiring is R6's job, per the locked target models).

## 4. What generic condition can replace `SHOP_RANK` in R6

**Not decided here — this is the one open design question this audit will not fill in** (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.2's locked target: "global/Journey readiness + prior-world milestone → region unlock"). What R2–R5 now makes concrete, without inventing the missing piece:

- A literal drop-in replacement condition type (e.g. `JOURNEY_RANK`, mirroring `SHOP_RANK`'s exact shape — `{type, threshold}`) is now trivial to implement mechanically: `domain/progression/shop-rank.ts`'s `rankForProgress`/`applyRankProgress` curve already exists and needs only a rename/rebind, not new math. `evaluateUnlockCondition` (`domain/progression/unlock-evaluator.ts`) would need exactly one new `case` branch reading `state.progression.rank` (or a renamed field) the same way its existing `SHOP_RANK` branch does today.
- Whether "Journey readiness" should instead read `state.journey.clearedStageIds.length`, `state.progression.rank`, or a composite of both is a real design decision **not answered by any read doc** — docs/rebuild/08 §3 says only "Journey/global readiness," not which field. Do not invent this in R6 without a design source; ask, or treat `progression.rank` (renamed) as the default continuation of the existing mechanism until told otherwise.
- **Do not invent final thresholds** (explicit instruction) — whatever condition type is chosen, its numeric threshold stays `PROVISIONAL` and centralized, exactly like every other value in `content/combat-slice/balance.ts`.

## 5. What Journey/system milestone should replace Expedition Hub ownership

Locked target (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.1): "system/Journey milestone + region/route access → expedition availability." Concretely available now, without inventing the missing piece:

- **Candidate milestone signals that now genuinely exist** to gate on: `state.journey.clearedStageIds.length >= N` (cleared at least N stages), `state.journey.currentStageIndex >= N`, or a specific stage's presence in `clearedStageIds` (e.g. "cleared the Region 1 boss stage"). All three are real, populated fields today — R6 does not need to invent new state to express any of them, only decide which one Doc 08 actually means and add the corresponding `UnlockConditionType` (or reuse `EXPEDITION_MILESTONE`, already declared but not implemented — see §6).
- **Not decided here**: which exact signal, and its exact threshold. Same "do not invent" boundary as §4.
- **Migration seam is still exactly one line**: `start-expedition.ts`'s single `infrastructure.ownedInfrastructureIds.includes(...)` check, unchanged in shape or location since R1.

## 6. Which existing expedition/capture systems can now be reused unchanged

**Everything** — this is the strongest confirmation this audit can give. R2–R5 did not touch any expedition or capture file. Re-verified still true and still generic:
- `domain/expeditions/{capture-chance,encounter-selection,rewards}.ts` — pure formulas, zero `GameState` reads.
- `application/commands/expeditions/{attempt-capture,decline-encounter,observe-encounter}.ts` — structurally generic lifecycle handlers.
- `application/reconciliation/expedition-reconciliation-pass.ts` — generic, replay-safe.
- `world.discoveryStates`/`captureProtection`/`encounterOpportunities` — generic discovery-state-machine primitives.

Only `start-expedition.ts`'s one ownership check (§1) and reward *typing* (routine-material rewards → something Echo-Charge/Essence/Relic-flavored, per docs/rebuild/09 §2) need R6 attention. Capture/discovery need **no changes at all** to keep working once expeditions are reachable via the new gate.

## 7. Which legacy state fields can finally disappear during R6

None of these were removed by R2–R5 (deliberately deferred, see docs/rebuild/R1_DEPENDENCY_AUDIT.md §12.2/§12.3) — R6 is not blocked on removing them (expeditions/world only *read* `infrastructure`/`progression`, they don't require the rest of Shop's slices to exist), but once R6 re-points the two gates:

- `GameState.orders` — already inert (Everyday Orders retired this campaign); safe to remove from the schema entirely whenever a save-schema-adjacent cleanup is scheduled (not R6-blocking).
- `GameState.infrastructure`'s **Expedition Hub entry specifically** becomes removable once `start-expedition.ts` no longer reads it — the rest of `infrastructure` (Display Expansion, the generic `InfrastructureRuntimeState` shape) stays if Shop's display/crafting clusters are still present (per §12.3, not yet retired).
- **Not removable during R6**: `GameState.customers`/`shop`/`crafting` — still live (Customer/Sale/Momentum/Display retirement is the documented next batch, §12.3; crafting/products are not scheduled for retirement at all yet). R6 should not touch these.
- `progression`'s `SHOP_RANK`-flavored unlock rules in `content/vertical-slice/progressionContent.ts` (9 rules) become removable/replaceable once Ozean's rule (and any other `SHOP_RANK`-gated content) is repointed — but the `progression` GameState slice itself stays (it becomes Journey Rank's home, per §4).

## 8. Can `/journey` replace the temporary placeholder in R8 without architectural changes?

**Yes.** Verified: `src/App.tsx`'s `/journey` route and `presentation/screens/JourneyPlaceholderScreen.tsx` are the only pieces involved — the route, the bottom-tab-bar entry (`BottomTabBar.tsx`), and `TopBar.tsx`'s title-map entry are all already wired to `/journey` (R0/R1 neutral shell). R8 replaces only the **component** `JourneyPlaceholderScreen.tsx` renders (or swaps in a new component at the same route) — no router, tab-bar, or shell change is needed. The real Journey screen will naturally have live data to render immediately: `state.journey`, `state.loadout`, `state.forge` are all real and populated by this campaign's commands, so R8's Journey screen is a presentation task consuming already-correct state, not a state-design task.

---

## Summary — R6's actual task list

1. Design decision (not code): pick the exact Journey-readiness signal(s) for §4/§5 — read docs/rebuild/08 in full first, ask if still ambiguous.
2. Add the chosen `UnlockConditionType` value(s) to `domain/progression/types.ts` + one `evaluateUnlockCondition` branch each.
3. Swap `start-expedition.ts`'s one ownership check for the new unlock-rule evaluation.
4. Re-author Ozean's (and any future region's) unlock rule content to use the new condition instead of `SHOP_RANK`.
5. Re-type expedition rewards toward Echo Charges/Essence/Relic-adjacent rewards per docs/rebuild/09 §2 (optional for R6 itself — could stay routine-material-flavored if R6 scopes narrowly to "region unlock," deferring reward re-typing to R7+).
6. Leave capture/discovery/encounter systems untouched (§6).
7. Do not remove `GameState.customers`/`shop`/`crafting` (§7) — out of scope for R6.
