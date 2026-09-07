/*
 * Adapter — not an icon source.
 *
 * Canonical source: reference/design-system/approved-v1/ (FOUNDATION LOCKED,
 * read-only — see CLAUDE.md and the design-system integration report).
 *
 * Root cause of the previous break: the old canonical file this adapter
 * pointed at (`reference/design-system/index.tsx`, a single flat file with
 * ~30 fixed icon components) no longer exists — it was replaced by the
 * approved-v1 export, which defines icons completely differently: one
 * generic `<Icon name="glyph-name" />` component (`components/core/
 * Icon.jsx`/`.d.ts`) backed by 36 approved Lucide-substitute SVGs in
 * `assets/icons/*.svg` (documented in `guidelines/icons-substituted.card
 * .html`: "Lucide stands in until Catchmon Shop icon masters are
 * produced... custom SVG masters drop into assets/icons/ under the same
 * glyph names; no consuming component changes").
 *
 * This adapter does NOT copy `Icon.jsx` verbatim (CLAUDE.md: "do not
 * blindly copy prototype code into production"). `Icon.jsx` fetches each
 * glyph's markup at runtime from a CDN (`unpkg.com/lucide-static`) with a
 * `window.CATCHMON_ICON_BASE`/`CATCHMON_ICON_URLS` escape hatch meant for
 * the designer's standalone HTML export workspace — not appropriate for a
 * bundled production app (network dependency, no offline support,
 * `dangerouslySetInnerHTML` of externally-fetched content). Instead, the
 * same 36 approved SVG files are statically bundled at build time via
 * Vite's `import.meta.glob` (`?raw`) and inlined synchronously — same
 * glyph set, same "swap the file, keep the name" substitution rule, same
 * `currentColor`-recoloring technique (each SVG already has
 * `stroke="currentColor"`), just resolved locally instead of over the
 * network.
 *
 * Old contract -> approved-v1 mapping:
 * - `IconProps` kept (name/size/color/label/style), matching approved-v1's
 *   `Icon.d.ts` shape.
 * - Generic `Icon` component added: the approved-v1 component vocabulary
 *   (`CurrencyChip`, `ElementBadge`, `ProductCard`, ...) is built entirely
 *   around `<Icon name="..." />`, not fixed per-concept components — this
 *   is the real canonical pattern Phase 8 will consume.
 * - `ElementFireIcon`/`ElementWaterIcon`/... (all 17 canonical elements)
 *   and `ELEMENT_ICONS` are kept/completed: grounded directly in
 *   `components/shop/ElementBadge.jsx`'s `GLYPHS` map, which now covers
 *   all 17 canonical elements (the old adapter only had 4). This also
 *   means the one real caller (`src/App.tsx`'s `<ElementFireIcon size={32}
 *   aria-hidden="true" />`) needed no changes at all.
 * - Dropped, not remapped: `NavWorldIcon`/`NavDevelopmentIcon`/...,
 *   `IconBack`/`IconClose`/`IconUpgrade`/`IconResonance`/`IconTracking`/
 *   `IconCatchTraining`, `AbilityYieldIcon`/`AbilityCritIcon`/... ,
 *   `StatusSleepIcon`/`StatusWildSpawnIcon`, and the entire
 *   `Rarity*Icon`/`RARITY_ICONS` family. None of these have any
 *   counterpart in approved-v1 (which defines no rarity-tier, ability-
 *   effect, capture/spawn, or fixed nav-icon components at all), had zero
 *   real callers in `src/` before this fix, and several encode forbidden
 *   legacy gameplay concepts (rarity tiers, "catch training", "wild
 *   spawn") per CLAUDE.md §7/§8/§11 — Catchmons here are strategic
 *   capability pieces, not combat/rarity/capture-effect pieces. Re-adding
 *   any of them requires an explicit, approved design decision, not a
 *   presentation-layer guess.
 * - `CurrencyFunkenIcon`/`NavPrestigeIcon`: still not exposed. legacy-leak-allow: funken
 *   — naming the excluded legacy icon so the exclusion itself is
 *   documented, not implementing/using it. legacy-leak-allow: prestige —
 *   naming the excluded legacy icon so the exclusion itself is documented,
 *   not implementing/using it. Both remain forbidden legacy systems;
 *   approved-v1 doesn't define them either.
 */
import * as React from "react";

const RAW_GLYPHS = import.meta.glob<string>(
  "../../../reference/design-system/approved-v1/assets/icons/*.svg",
  { eager: true, query: "?raw", import: "default" },
);

/** The exact 36 approved Lucide-substitute glyphs (`guidelines/icons-substituted.card.html`). */
export type ApprovedIconName =
  | "check"
  | "chevron-left"
  | "chevron-right"
  | "circle"
  | "clock"
  | "coins"
  | "droplet"
  | "eye"
  | "flame"
  | "flask-conical"
  | "gem"
  | "ghost"
  | "hammer"
  | "hand-heart"
  | "heart"
  | "hourglass"
  | "image"
  | "info"
  | "leaf"
  | "lock"
  | "map"
  | "moon"
  | "mountain"
  | "orbit"
  | "package"
  | "plus"
  | "settings"
  | "shield"
  | "snowflake"
  | "sparkle"
  | "sparkles"
  | "store"
  | "sun"
  | "triangle-alert"
  | "wind"
  | "zap";

function glyphMarkup(name: ApprovedIconName): string {
  const entry = Object.entries(RAW_GLYPHS).find(([path]) =>
    path.endsWith(`/${name}.svg`),
  );
  if (!entry) {
    throw new Error(
      `Missing approved icon glyph "${name}" in reference/design-system/approved-v1/assets/icons/`,
    );
  }
  // Strip the SVG's fixed intrinsic width/height so the wrapper's `size`
  // controls rendered size — the same technique approved-v1's own
  // `Icon.jsx` uses on its fetched markup.
  return entry[1]
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "");
}

export interface IconProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  readonly size?: number;
  readonly color?: string;
  readonly label?: string;
}

/** Renders one approved substitute glyph by name — the canonical approved-v1 pattern (`Icon.d.ts`). */
export function Icon({
  name,
  size = 24,
  color = "currentColor",
  label,
  style,
  ...rest
}: IconProps & { readonly name: ApprovedIconName }): React.JSX.Element {
  return (
    <span
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: glyphMarkup(name) }}
      style={{
        display: "inline-flex",
        flex: "0 0 auto",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color,
        ...style,
      }}
      {...rest}
    />
  );
}

// Document 10 canonical elements <-> approved-v1 ElementBadge.jsx GLYPHS map.
// Each defined as a direct component (not via a shared factory call) so
// every export in this file is a plain component, keeping the module a
// clean React Fast Refresh boundary — the lookup-by-element-name map
// (`ELEMENT_ICONS`) lives in `./element-icon-map.ts` instead, since a
// non-component object export in this same file would break that.
export const ElementFireIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="flame" {...props} />
);
export const ElementWaterIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="droplet" {...props} />
);
export const ElementElectricIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="zap" {...props} />
);
export const ElementGrassIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="leaf" {...props} />
);
export const ElementEarthIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="mountain" {...props} />
);
export const ElementPoisonIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="flask-conical" {...props} />
);
export const ElementNormalIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="circle" {...props} />
);
export const ElementIceIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="snowflake" {...props} />
);
export const ElementFairyIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="sparkle" {...props} />
);
export const ElementWindIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="wind" {...props} />
);
export const ElementSteelIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="shield" {...props} />
);
export const ElementPsychicIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="eye" {...props} />
);
export const ElementLightIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="sun" {...props} />
);
export const ElementDarkIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="moon" {...props} />
);
export const ElementGhostIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="ghost" {...props} />
);
export const ElementDragonIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="gem" {...props} />
);
export const ElementCosmicIcon = (props: IconProps): React.JSX.Element => (
  <Icon name="orbit" {...props} />
);
