/**
 * Design owner: docs/rebuild/08_WORLD_REGIONS_AND_EXPEDITIONS.md §3 Region
 * Unlock ("prior-region milestone"); docs/rebuild/07 §7 Unlock Philosophy
 * ("Expeditions: first region completion"); docs/rebuild/15 Phase R6.
 *
 * Two generic milestone string constants, shared by every producer/
 * consumer so the identifiers can never accidentally drift apart across
 * files (CLAUDE.md §14 Single Source of Truth). Neither is region-specific
 * — any Region's completion writes the same `REGION_COMPLETED` string into
 * *that* Region's own `world.regionMilestones[regionId]` entry
 * (`REGION_STATE` unlock conditions then reference a specific `regionId`
 * + this milestone, not a region-specific milestone name).
 */

/** Written to `world.regionMilestones[regionId]` when that Region's completion boss (`StageDefinition.isRegionCompletionBoss`) is cleared. */
export const REGION_COMPLETED_MILESTONE = "REGION_COMPLETED";

/** Written to `progression.unlockedSystemIds` on the first Region completion of any kind (docs/rebuild/07 §7's unlock sequence) — read by `START_EXPEDITION` instead of Shop Infrastructure ownership. */
export const EXPEDITIONS_SYSTEM_MILESTONE = "EXPEDITIONS";
