# 04 — Rift Forge, Relic Matrix & Loot System

# 1. Purpose

The Rift Forge is the high-frequency reward engine.

It uses the satisfying generate → evaluate → keep/recycle → improve structure while giving it an original Catchmon-specific fantasy and deterministic safety nets.

There is no magical lamp.

# 2. Echo Charges

**Echo Charges** power the Rift Forge.

Sources:
- stage progression,
- farming,
- bosses,
- expeditions,
- achievements,
- selected events.

Baseline design: Echo Charges are earned through play; paid randomized Forge outcomes are not part of the core.

# 3. Relic Matrix

Catchmons use an abstract **Relic Matrix** rather than humanoid armor.

Eight working slots:
1. Core
2. Crest
3. Fang
4. Shell
5. Step
6. Focus
7. Charm
8. Echo

Names can be polished later; the matrix concept is canonical.

# 4. Relic Data

A Relic contains:
- RelicId
- slot
- rarity
- level band
- main stat
- affixes
- optional unique effect
- source metadata
- protected flag
- collection discovery flag

GameState stores IDs/state, not duplicated full definitions.

# 5. Rarity

Working ladder:
- Common
- Uncommon
- Rare
- Epic
- Mythic
- Legendary
- Ascendant

Rarity controls affix count/range, unique-effect access and recycle value.

Rarity alone must not guarantee superiority over a lower-rarity item with much better Build Fit.

# 6. Result Decision

For each result calculate:
- Power delta,
- Build Fit delta,
- key affix differences,
- new-effect flag.

Actions:
- Equip
- Store
- Recycle
- Lock

# 7. Recycling

A bad roll still progresses the account.

Recycle grants some combination of:
- Coins,
- Journey/Lead EXP,
- Forge Insight,
- advanced essence where appropriate.

# 8. Forge Level

Forge Level improves:
- rarity distribution,
- affix quality,
- batch size,
- auto-filter capability,
- unique-effect access.

It uses deterministic upgrade resources.

# 9. Forge Insight / Safety Net

Non-kept rolls add **Forge Insight**.

At thresholds it may:
- guarantee a minimum rarity,
- guarantee a new collection entry,
- offer a choice among several strong candidates.

Exact values remain provisional.

# 10. Smart Automation

Automation tiers:
- Rarity Filter
- Affix Filter
- Build Fit Filter
- Batch Forge
- Auto-Recycle
- Stop-on-Upgrade
- Offline Processing

Always stop for:
- new unique effect,
- first important collection copy,
- unusually strong Build Fit,
- protected categories.

# 11. Affixes

Initial useful families:
- Crit
- Combo
- Counter
- Guard
- Skill Power
- Skill Haste
- Attack Speed
- Elemental Power
- Recovery
- Accuracy
- Evasion

Avoid dozens of low-impact affixes.

# 12. Unique Effects

Effects should change behavior.

Examples:
- every third Combo charges Signature Skill,
- prevented Guard damage empowers next Counter,
- elemental skill hits extend Bond Assist window,
- critical skill hits generate Echo,
- first low-HP event triggers a support save.

Prefer behavior over endless +X% damage.

# 13. No Fake Near-Miss

The Forge may build anticipation but must not:
- falsely show an almost-won rarity,
- hide relevant odds,
- alter odds under Auto mode,
- misrepresent pity progress.

# 14. Codex

Discovered Relics/effects fill a Codex.

Codex rewards are small, deterministic and collection-focused. The player does not need to keep every physical item forever.

# 15. Exit Gate

Echo Charge
→ Forge
→ result
→ compare
→ equip/recycle
→ progression reward
→ Insight
→ Forge Level
→ better future result distribution

works without any shop-management loop.
