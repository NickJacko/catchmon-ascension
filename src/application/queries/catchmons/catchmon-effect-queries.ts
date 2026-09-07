/**
 * Design owner: Document 15 Task 05.6 (Workshop Catchmon Effect), Task
 * 05.7 (Shop Floor Catchmon Effect); Document 14 §96 Assignment Snapshot
 * Boundary.
 *
 * Resolves "is there a currently-assigned Catchmon whose capability
 * produces this effect right now?" by combining Task 05.5's assignment
 * state with Task 05.4's pure effect evaluators. Kept in `queries/`
 * (reads full `GameState` + `GameCatalog`) rather than `domain/catchmons`
 * (which only ever sees one capability at a time, no state).
 */
import {
  type OwnedCatchmonId,
  type StationId,
} from "../../../core/ids/index.ts";
import {
  type CraftSpeedEffect,
  type DiscoveryBoostEffect,
  type MagnitudeTable,
  type RecommendCompatibilityEffect,
  evaluateCraftSpeedEffect,
  evaluateDiscoveryBoostEffect,
  evaluateRecommendCompatibilityEffect,
} from "../../../domain/catchmons/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";

/**
 * Document 06 §14 Station Specialist, Task 05.6 acceptance: "same recipe
 * produces different derived duration... when eligible Catchmon is
 * assigned." Looks only at the station's *current* `supportCatchmonIds` —
 * callers that need a durable effect for an already-running craft must
 * snapshot this result themselves (Document 14 §96), not re-call this at
 * read time for an in-progress activity.
 */
export function getWorkshopCraftSpeedEffect(
  state: GameState,
  catalog: GameCatalog,
  stationId: StationId,
  magnitudes: MagnitudeTable,
): CraftSpeedEffect | null {
  const station = state.crafting.stations[stationId];
  if (!station) return null;
  for (const ownedCatchmonId of station.supportCatchmonIds) {
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned) continue;
    const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
    if (!species) continue;
    for (const capabilityId of species.capabilityIds) {
      const capability = catalog.capabilities.get(capabilityId);
      if (!capability) continue;
      const effect = evaluateCraftSpeedEffect(
        capability,
        station.archetype,
        magnitudes,
      );
      if (effect) return effect;
    }
  }
  return null;
}

/**
 * Document 06 §40 Expedition — Discovery, Document 07 §23 Expedition Start
 * Snapshot; Document 15 Task 06.3/06.4. Unlike the Workshop/Shop Floor
 * effect lookups above, there is no assignment state to scan yet at
 * planning time — the caller passes the exact candidate Lead directly
 * (Task 06.3's route/loadout preview) or the just-assigned Lead (Task
 * 06.4's start-of-expedition snapshot). Returns `null` for an unknown
 * Catchmon or one with no matching capability, same as the other lookups.
 */
export function getExpeditionDiscoveryBoostEffect(
  state: GameState,
  catalog: GameCatalog,
  ownedCatchmonId: OwnedCatchmonId,
  magnitudes: MagnitudeTable,
): DiscoveryBoostEffect | null {
  const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
  if (!owned) return null;
  const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
  if (!species) return null;
  for (const capabilityId of species.capabilityIds) {
    const capability = catalog.capabilities.get(capabilityId);
    if (!capability) continue;
    const effect = evaluateDiscoveryBoostEffect(capability, magnitudes);
    if (effect) return effect;
  }
  return null;
}

/** Document 06 §25 Recommend Support, Task 05.7 acceptance: "strategic effect is visible in quote/query output." */
export function getShopFloorRecommendCompatibilityEffect(
  state: GameState,
  catalog: GameCatalog,
  magnitudes: MagnitudeTable,
): RecommendCompatibilityEffect | null {
  for (const ownedCatchmonId of state.shop.shopFloorSupportCatchmonIds) {
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned) continue;
    const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
    if (!species) continue;
    for (const capabilityId of species.capabilityIds) {
      const capability = catalog.capabilities.get(capabilityId);
      if (!capability) continue;
      const effect = evaluateRecommendCompatibilityEffect(
        capability,
        magnitudes,
      );
      if (effect) return effect;
    }
  }
  return null;
}
