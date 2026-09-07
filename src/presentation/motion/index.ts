/*
 * Adapter — not a token source.
 *
 * Canonical source: reference/design-system/approved-v1/tokens/motion.css
 * (FOUNDATION LOCKED, read-only).
 *
 * Root cause of the previous break: the old canonical file this adapter
 * pointed at (`reference/design-system/motionTokens.ts`, a JS mirror of
 * duration/easing constants) no longer exists. approved-v1 does not ship
 * an equivalent JS module — motion values are approved only as CSS custom
 * properties in `tokens/motion.css`. Since some presentation code (JS-
 * driven animation, e.g. a future Reanimated/Framer Motion config) cannot
 * read a CSS custom property directly, this file re-declares the same
 * values as a small JS object, copied verbatim (byte-identical) from
 * `motion.css` — not invented, not retuned. If the two ever appear to
 * disagree, `motion.css` is authoritative (it is FOUNDATION LOCKED; this
 * file is not) — update this mirror to match it, never the reverse.
 *
 * `DURATION`/`EASING` have no real caller anywhere in `src/` yet (grep
 * confirmed only this module and its own test referenced them before this
 * fix) — Phase 8/9 is expected to be the first real consumer. Key names
 * mirror `motion.css`'s own custom-property suffixes (`--dur-fast` ->
 * `DURATION.fast`, `--ease-out` -> `EASING.out`, etc.) rather than the old
 * adapter's unknown former shape, since nothing here needs to match a
 * legacy naming scheme.
 */

export const DURATION = {
  instant: 90,
  fast: 140,
  base: 220,
  slow: 360,
  vfx: 900,
  vfxMax: 2000,
} as const;

export const EASING = {
  out: "cubic-bezier(.2,.8,.25,1)",
  inOut: "cubic-bezier(.4,0,.2,1)",
  overshoot: "cubic-bezier(.34,1.56,.44,1)",
  anticipate: "cubic-bezier(.6,-0.28,.36,1.2)",
} as const;
