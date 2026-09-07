# 06 — Catchmon Collection, Bond & Evolution

# 1. Canonical Roster

Reuse the approved Catchmon foundation:
- 104 species,
- 51 evolution lines,
- 17 primary Elements,
- existing rarity/art data,
- corrected canonical identities,
- canonical `element_mapping.json`.

Never turn the synthetic scale fixture into production canon.

# 2. Roles in the New Game

Catchmons participate as:

## Lead
The primary battle creature.

## Bond Support
One of up to three support slots.

## Collection
Owned but not currently assigned.

The former worker/shop assignment fantasy does not survive by default.

# 3. Acquisition

Catchmons are primarily acquired through gameplay:
- region encounters,
- discovery stages,
- expeditions,
- milestone encounters,
- boss-linked discoveries,
- special long-term objectives.

No baseline paid creature gacha.

# 4. Discovery Protection

Random encounter selection is backed by transparent deterministic protection.

Examples:
- capture chance rises after failures,
- rare encounter meter advances,
- targeted research increases one line's appearance weight.

The system may create anticipation but not infinite bad-luck states.

# 5. Evolution

Evolution is a major emotional payoff.

Requirements can combine:
- Catchmon level,
- Bond level,
- world milestone,
- evolution material,
- species mastery.

Evolution does not reset the Catchmon to level 1.

# 6. Evolution Benefits

Evolution can:
- improve base profile,
- upgrade Signature Skill,
- change Bond Support behavior,
- unlock advanced species trait,
- unlock new visual identity.

# 7. Bond

Bond represents player familiarity with a Catchmon.

Bond grows through:
- active use,
- bosses,
- expeditions,
- species objectives.

Bond unlocks:
- lore/collection entries,
- support behavior,
- evolution requirements,
- cosmetic/badge rewards.

# 8. Bond Support Design

Each line should eventually receive one meaningful support identity.

Useful verbs:
- Assist Strike
- Barrier
- Rescue
- Echo Generation
- Cooldown Push
- Crit Mark
- Elemental Primer
- Counter Trigger
- Expedition Utility

Avoid generic “+3% Attack to all.”

# 9. Element Semantics

`primaryElementId` means:
- thematic identity,
- default affinity,
- synergy eligibility.

It does not mean:
- only one possible region,
- encounter pool equals element membership,
- dual types exist.

# 10. Rarity

Existing rarity informs encounter pacing and milestone importance, not automatic combat superiority.

A Common Catchmon can remain build-relevant through:
- support niche,
- skill synergy,
- evolution,
- elemental interaction.

# 11. Duplicate Handling

The base design does not require duplicates.

If earned duplicate encounters ever occur:
- convert to deterministic Bond/Essence progress,
- cap duplicate value,
- never build an endless paid duplicate ladder.

# 12. Collection Goals

Long-term goals:
- species discovered,
- lines completed,
- element collections,
- Bond milestones,
- region collections,
- rare signatures.

Collection rewards support combat but do not dominate it.

# 13. Initial Production Roster

Do not integrate all 104 immediately.

First rebuild slice target:
- 8–12 species,
- several evolution lines,
- at least 4 Elements,
- one single-stage species,
- one rare/milestone capture.

Then expand region by region.

# 14. Exit Gate

discover
→ encounter
→ capture
→ own
→ assign Lead/Support
→ gain Bond
→ evolve
→ change combat behavior

works through the canonical roster architecture.
