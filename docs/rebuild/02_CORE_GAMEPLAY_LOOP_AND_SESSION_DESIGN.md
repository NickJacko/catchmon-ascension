# 02 — Core Gameplay Loop & Session Design

# 1. Canonical Core Loop

> **Auto-battle → earn Echo Charges → Forge Relic → compare → equip or recycle → gain power/resources → push stage/boss → unlock new opportunities → repeat**

No later system may replace this loop. Later systems deepen, contextualize or automate it.

# 2. 10–30 Second Loop

1. Lead Catchmon auto-fights enemies.
2. Enemies/stage progress generate Echo Charges and Coins.
3. Rift Forge becomes ready.
4. Player reveals one or more Relics.
5. Each Relic gets a fast recommendation: Upgrade / Sidegrade / Build-Specific / Recycle.
6. Player equips, stores or recycles.
7. Recycling grants progress immediately.
8. Battle continues without a separate loading flow.

The player should rarely wait for the game to become interactive again.

# 3. 2–5 Minute Loop

Typical short goals:
- next boss,
- improve one Relic slot,
- one Forge level,
- one skill upgrade,
- Bond threshold,
- Catchmon evolution progress,
- change support formation,
- expedition result.

The UI surfaces one recommended objective without forcing it.

# 4. 15–30 Minute Session Loop

A longer active session should naturally include:
- several stage pushes,
- multiple Forge decisions,
- at least one build comparison,
- a boss checkpoint,
- a Catchmon/progression interaction,
- one optional side activity,
- a satisfying stopping point.

# 5. Return / Offline Loop

While offline:
- farming continues at the last stable farm checkpoint,
- rewards accumulate from elapsed time up to a generous cap,
- Echo Charges accumulate,
- rare progression resources are not silently consumed unless the player explicitly opts into automation.

On return:
1. summarize gains,
2. show the strongest actionable improvement,
3. claim-all,
4. return immediately to Journey.

No login-popup gauntlet.

# 6. Boss Loop

Normal enemies are mostly automatic. Bosses are the main friction points.

On boss failure the game should identify likely improvement routes:
- more damage,
- more survivability,
- stronger Build Fit,
- different Bond Support,
- different skill timing,
- better elemental setup.

Never reduce the feedback to “increase Power.”

The player can:
- farm,
- retry,
- change loadout,
- or leave and return later.

# 7. Transparent “Almost There” Progress

Use visible partial progress:
- Forge Insight 74/100,
- Bond 8/10,
- boss best remaining HP 12%,
- Skill Mastery 420/500,
- Region discovery 7/10.

Near-completion tension is valid; hiding required progress is not.

# 8. Early Onboarding Cadence

## Minute 0–2
- choose starter,
- first battle,
- first Forge,
- equip/recycle decision.

## Minute 2–5
- Forge level-up,
- first boss,
- first Bond Support introduction.

## Minute 5–10
- Battle Path preview,
- smart item comparison,
- first discovery/capture.

## Minute 10–20
- Battle Path choice,
- skill slot,
- first affix decision.

## Minute 20–40
- first region transition,
- first expedition,
- evolution progress.

Exact timing is provisional; sequence is the design constraint.

# 9. Progressive Automation

Forge automation progression:

1. one Relic at a time / manual,
2. rarity auto-recycle,
3. affix filters,
4. multi-forge batch,
5. build-aware filters,
6. optional offline processing.

Automation always stops for:
- newly discovered unique effects,
- first important collection copy,
- unusually high Build Fit,
- player-protected categories.

# 10. Failure Design

Failure must create information.

After a boss loss show:
- damage source,
- damage dealt/taken split,
- Build Fit,
- best attempt,
- at most three useful actions.

Do not surface unrelated shops/offers.

# 11. Session Health Rules

- Streaks never erase accumulated progress.
- Missing a day never permanently weakens the account.
- Event rewards have catch-up paths where possible.
- Essential daily rewards fit into a short session.
- Long sessions are supported but not required.
- No paid random power rewards.
- No fake near-miss animations.

# 12. Exit Gate

A fresh player can:

fresh save
→ auto-battle
→ earn Forge charge
→ reveal Relic
→ equip/recycle
→ visibly improve
→ beat boss
→ unlock next stage
→ go offline
→ return and continue

with no Catchmon Shop crafting/sales systems required.
