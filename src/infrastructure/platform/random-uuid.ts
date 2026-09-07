/**
 * Design owner: Mobile Dev Flow task — `pnpm dev:mobile` deliberately
 * serves the app over plain `http://<lan-ip>` (no local HTTPS on this
 * project; see docs/rebuild/MOBILE_APP_TESTING.md). `crypto.randomUUID()`
 * is spec-restricted to secure contexts (`https:` or `localhost`) — a LAN
 * IP over `http:` does not qualify, so `crypto.randomUUID` is simply
 * `undefined` there, and every caller that called it directly
 * (`game-store.ts`'s command-id generator, `writer-lease.ts`'s tab-id
 * generator) crashed outright ("crypto.randomUUID is not a function"),
 * breaking save load entirely on a real device over LAN HTTP.
 *
 * `crypto.getRandomValues()` carries no such restriction (it predates the
 * secure-context requirement and was never folded into it) — this falls
 * back to assembling a real RFC 4122 v4 UUID from it whenever
 * `randomUUID` itself isn't available, so ID generation behaves
 * identically (still genuinely random, still a real v4 UUID) regardless
 * of which context it runs in. The one place this constructs an ID from
 * scratch rather than calling `crypto.randomUUID()` inline.
 */
export function randomUUID(): string {
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  // Fixed-size array just allocated above — indices 6/8 always exist;
  // `noUncheckedIndexedAccess` can't see that statically.
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40; // version 4
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80; // variant 10xx
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}
