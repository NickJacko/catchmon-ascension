/**
 * Adapter — not a token source (same pattern as `presentation/motion/
 * index.ts` and `presentation/icons/index.tsx`). Canonical source:
 * `reference/design-system/approved-v1/tokens/*.css` (FOUNDATION LOCKED,
 * read-only).
 *
 * Pixi's `Graphics.fill()` needs a numeric 0xRRGGBB, not a CSS custom
 * property. Rather than hand-copying hex literals (which could silently
 * drift from the canonical file, exactly the risk `motion/index.ts`'s own
 * header warns about), this resolves each token from the *live* computed
 * style of `document.documentElement` — the same cascade the DOM/CSS
 * already uses, including any `[data-theme]`/dark-mode override — so the
 * scene can never disagree with the CSS that's actually rendering next to
 * it. Resolved once per token per document (cheap, tiny fixed set) and
 * cached; call `clearSceneTokenCache()` if the theme changes at runtime.
 */

const cache = new Map<string, number>();

function parseCssColorToHexNumber(cssColor: string): number | null {
  const trimmed = cssColor.trim();
  const hexMatch = /^#([0-9a-fA-F]{6})$/.exec(trimmed);
  if (hexMatch) {
    return parseInt(hexMatch[1]!, 16);
  }
  const rgbMatch = /^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(trimmed);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return (Number(r) << 16) + (Number(g) << 8) + Number(b);
  }
  return null;
}

/** Resolves a `--token-name` (with or without the leading `--`) to a Pixi-ready 0xRRGGBB number. Falls back to `fallback` if the token is unset/unparseable (e.g. in a non-browser test environment) rather than throwing — this is cosmetic fill color, not gameplay data. */
export function resolveSceneColor(tokenName: string, fallback: number): number {
  const name = tokenName.startsWith("--") ? tokenName : `--${tokenName}`;
  const cached = cache.get(name);
  if (cached !== undefined) return cached;

  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parsed = raw ? parseCssColorToHexNumber(raw) : null;
  const resolved = parsed ?? fallback;
  cache.set(name, resolved);
  return resolved;
}

export function clearSceneTokenCache(): void {
  cache.clear();
}
