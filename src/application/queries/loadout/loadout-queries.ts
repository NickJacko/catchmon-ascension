/**
 * Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §8
 * Build Fit; docs/rebuild/12 §7 Build Surface ("Power / Build Fit");
 * docs/rebuild/15 Phase R8. The Build sheet's "current loadout" summary —
 * composes the same `deriveLeadCombatStats`/`computePowerScore`/
 * `computeBuildFit` chain `forge-queries.ts`'s comparison preview uses,
 * just against the real current loadout instead of a hypothetical one.
 */
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import {
  computeBuildFit,
  computePowerScore,
  type BuildFitResult,
  type PowerWeights,
} from "../../../domain/loadout/index.ts";
import { type CombatStats } from "../../../domain/combat/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import {
  deriveLeadCombatStats,
  type LeadStatsConfig,
} from "../combat/lead-stats-query.ts";

export interface LoadoutSummary {
  /** `null` when no Lead is assigned. */
  readonly stats: CombatStats | null;
  readonly power: number | null;
  /** `null` when no Lead is assigned, or no Battle Path is selected yet. */
  readonly buildFit: BuildFitResult | null;
}

export interface LoadoutQueries {
  summary(state: GameState): LoadoutSummary;
}

export function createLoadoutQueries(
  catalog: GameCatalog,
  leadStatsConfig: LeadStatsConfig,
  powerWeights: PowerWeights,
): LoadoutQueries {
  return {
    summary(state) {
      const stats = deriveLeadCombatStats(state, catalog, leadStatsConfig);
      if (!stats) return { stats: null, power: null, buildFit: null };
      const power = computePowerScore(stats, powerWeights);
      const buildFit = state.loadout.battlePathId
        ? computeBuildFit(stats, state.loadout.battlePathId, powerWeights)
        : null;
      return { stats, power, buildFit };
    },
  };
}
