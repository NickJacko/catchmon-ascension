/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §6
 * Result Decision ("Power delta, Build Fit delta, key affix differences,
 * new-effect flag"); docs/rebuild/12 §4 Forge Screen ("Relic comparison"),
 * §12 Relic Comparison UX; docs/rebuild/15 Phase R8.
 *
 * `FORGE_RELIC`/`EQUIP_RELIC` never needed a comparison preview — they
 * just apply a decision already made. R8's Forge screen is where that
 * decision actually gets made, so this is the first place Power/Build Fit
 * get computed for a *hypothetical* loadout (candidate equipped) rather
 * than the real current one — composed entirely from already-existing
 * pure functions (`deriveLeadCombatStats`, `computePowerScore`,
 * `computeBuildFit`), never a second stat-stacking implementation.
 */
import { type RelicInstanceId } from "../../../core/ids/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type RelicArchetypeDefinition } from "../../../domain/forge/index.ts";
import {
  computeBuildFit,
  computePowerScore,
  type PowerWeights,
} from "../../../domain/loadout/index.ts";
import {
  type GameState,
  type RelicInstanceState,
} from "../../../domain/game-state/index.ts";
import {
  deriveLeadCombatStats,
  type LeadStatsConfig,
} from "../combat/lead-stats-query.ts";

export interface RelicComparisonPreview {
  readonly relic: RelicInstanceState;
  readonly archetype: RelicArchetypeDefinition;
  readonly isEquipped: boolean;
  /** The Relic instance currently in this slot, if any and if different from `relic` — what equipping `relic` would displace. */
  readonly replacesRelicInstanceId: RelicInstanceId | undefined;
  readonly powerBefore: number;
  readonly powerAfter: number;
  readonly powerDelta: number;
  /** `null` when no Battle Path is selected yet — Build Fit is Path-relative (Document 05 §8), so there is nothing to compare against without one. */
  readonly buildFitBeforeBps: number | null;
  readonly buildFitAfterBps: number | null;
  readonly buildFitDeltaBps: number | null;
}

export interface ForgeQueries {
  /** `null` when the Relic doesn't exist or no Lead is assigned (nothing real to compare). */
  relicComparison(
    state: GameState,
    relicInstanceId: RelicInstanceId,
  ): RelicComparisonPreview | null;
}

export function createForgeQueries(
  catalog: GameCatalog,
  leadStatsConfig: LeadStatsConfig,
  powerWeights: PowerWeights,
): ForgeQueries {
  return {
    relicComparison(state, relicInstanceId) {
      const relic = state.relicInventory.relics[relicInstanceId];
      if (!relic) return null;
      const archetype = catalog.relicArchetypes.get(relic.relicArchetypeId);
      if (!archetype) return null;

      const statsBefore = deriveLeadCombatStats(
        state,
        catalog,
        leadStatsConfig,
      );
      if (!statsBefore) return null;

      const currentOccupantId = state.loadout.relicMatrix[relic.slot];
      const isEquipped = currentOccupantId === relicInstanceId;

      const stateWithCandidate: GameState = {
        ...state,
        loadout: {
          ...state.loadout,
          relicMatrix: {
            ...state.loadout.relicMatrix,
            [relic.slot]: relicInstanceId,
          },
        },
      };
      const statsAfter =
        deriveLeadCombatStats(stateWithCandidate, catalog, leadStatsConfig) ??
        statsBefore;

      const powerBefore = computePowerScore(statsBefore, powerWeights);
      const powerAfter = computePowerScore(statsAfter, powerWeights);

      const pathId = state.loadout.battlePathId;
      const buildFitBeforeBps = pathId
        ? computeBuildFit(statsBefore, pathId, powerWeights).scoreBps
        : null;
      const buildFitAfterBps = pathId
        ? computeBuildFit(statsAfter, pathId, powerWeights).scoreBps
        : null;

      return {
        relic,
        archetype,
        isEquipped,
        replacesRelicInstanceId: isEquipped ? undefined : currentOccupantId,
        powerBefore,
        powerAfter,
        powerDelta: powerAfter - powerBefore,
        buildFitBeforeBps,
        buildFitAfterBps,
        buildFitDeltaBps:
          buildFitBeforeBps !== null && buildFitAfterBps !== null
            ? buildFitAfterBps - buildFitBeforeBps
            : null,
      };
    },
  };
}
