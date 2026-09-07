/**
 * Shared module-level `Texture` cache keyed by URL (Document 14 §195: never
 * re-decode the same image per entity/per update). Originally inlined only
 * in `CatchmonEntity`; Phase 10 needed the identical pattern in every other
 * spatial/customer entity, so it moved here rather than being copy-pasted
 * (CLAUDE.md §14 Single Source of Truth).
 *
 * Phase 12 hardening: a rejected load (network failure, 404, corrupt
 * image) used to be cached forever — the failed promise stayed in the map,
 * so a transient failure meant that URL could never load for the rest of
 * the session, even across a later re-render that would otherwise retry.
 * A rejection now evicts its own cache entry before re-throwing, so the
 * next caller genuinely retries instead of replaying the same failure.
 */
import { Assets, type Texture } from "pixi.js";

const textureCache = new Map<string, Promise<Texture>>();

export function loadCachedTexture(url: string): Promise<Texture> {
  const existing = textureCache.get(url);
  if (existing) return existing;
  const promise = Assets.load<Texture>(url).catch((error: unknown) => {
    textureCache.delete(url);
    throw error;
  });
  textureCache.set(url, promise);
  return promise;
}
