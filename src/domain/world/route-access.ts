/**
 * Design owner: Document 07 §15 Route Access vs. Preference; Document 15
 * Task 06.3/06.4.
 *
 * The one place "can this route currently be attempted?" is decided — both
 * the planning-query preview (Task 06.3) and the `START_EXPEDITION` command
 * (Task 06.4) call this rather than each re-deriving the rule, so a route
 * is never previewed as available and then rejected at start (or vice
 * versa). No live unlock evaluator exists yet (Document 09/Phase 7
 * territory) — every slice route's `accessRequirements` is empty, which is
 * trivially satisfied; a route that ever declares real requirements is
 * conservatively reported blocked rather than guessing an evaluation.
 */
import { type RegionId } from "../../core/ids/index.ts";
import { type RouteDefinition } from "./types.ts";

export type RouteAccessBlockedReason =
  "REGION_LOCKED" | "ACCESS_REQUIREMENTS_UNRESOLVED";

/** Returns `null` when the route is accessible, or the reason it is blocked. */
export function checkRouteAccess(
  route: RouteDefinition,
  unlockedRegionIds: readonly RegionId[],
): RouteAccessBlockedReason | null {
  if (!unlockedRegionIds.includes(route.regionId)) {
    return "REGION_LOCKED";
  }
  if (route.accessRequirements.length > 0) {
    return "ACCESS_REQUIREMENTS_UNRESOLVED";
  }
  return null;
}
