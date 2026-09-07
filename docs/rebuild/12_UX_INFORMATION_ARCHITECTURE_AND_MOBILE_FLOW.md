# 12 — UX, Information Architecture & Mobile Flow

# 1. Goal

Avoid the icon-wall problem common to mature idle RPGs.

The app must remain understandable after months of added systems.

# 2. Primary Navigation

Maximum four permanent bottom tabs:

1. **Journey**
2. **Forge**
3. **Catchmons**
4. **World**

Secondary systems live inside these destinations or a small contextual More surface.

# 3. Journey Screen

Primary game screen.

Contains:
- active battle scene,
- stage/boss progress,
- Lead Catchmon,
- enemy/boss,
- key HP/status,
- Forge-ready indicator,
- current short objective.

The player can spend most active time here.

# 4. Forge Screen

Contains:
- Rift Forge,
- Echo Charges,
- Forge Level,
- current result,
- Relic comparison,
- Insight meter,
- Auto/Filter controls,
- Relic Matrix shortcut.

Reveal is satisfying but fast.

# 5. Catchmons Screen

Contains:
- collection grid,
- owned/discovered states,
- evolution lines,
- Bond,
- Lead/Support assignment,
- filters by Element/rarity/role.

# 6. World Screen

Contains:
- regions,
- stage progression,
- routes,
- expeditions,
- encounter goals.

Locked Regions are readable previews, not misleading active buttons.

# 7. Build Surface

Accessible contextually from Journey/Catchmons.

Contains:
- Battle Path,
- Relic Matrix,
- Skills,
- Bond formation,
- Power / Build Fit.

Prefer a coherent tabbed sheet over several home icons.

# 8. Progressive Disclosure

Before unlock:
- hide system or show quiet preview.

On unlock:
- explain once,
- take one action,
- return to main loop.

No permanent notification-dot clutter.

# 9. Notification Dots

Rules:
- actionable only,
- meaningful only,
- clear when viewed,
- no dot inflation.

A red dot is not a retention strategy.

# 10. Mobile Constraints

- portrait-first,
- ≥44px touch targets,
- no horizontal overflow,
- safe-area support,
- readable at ~390px width,
- no critical hover-only interaction,
- one-thumb core loop.

# 11. Accessibility

Required:
- semantic DOM controls around Pixi gameplay,
- keyboard access on desktop,
- visible focus,
- sheet focus trap/restore,
- reduced motion,
- no color-only state,
- readable contrast,
- meaningful alt text.

# 12. Relic Comparison UX

Every result answers quickly:
- raw Power better?
- Build Fit better?
- which key stats changed?
- new effect?

Detailed comparison is expandable.

# 13. Auto Mode UX

Show explicitly:
- what will recycle,
- what stops automation,
- what is protected.

Aggressive filters require confirmation.

# 14. Natural Stopping Points

The UI may reassure:
- Boss reached,
- Expedition active,
- offline rewards continue,
- next major goal progress.

Leaving should feel safe.

# 15. Exit Gate

- new player knows where to tap,
- four-tab model survives system unlocks,
- Forge decision takes seconds,
- mobile has no clipping,
- accessible controls do not depend on Pixi hit targets alone.
