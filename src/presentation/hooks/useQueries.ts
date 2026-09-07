/*
 * Memoizes the query-object factories that need catalog/config injection
 * (`createCraftQueries`, `createExpeditionPlanningQueries`) so screens
 * don't rebuild them every render — the objects themselves hold no
 * gameplay state, only closures over `catalog`/config, so recomputing
 * them is wasteful but never incorrect either way.
 */
import * as React from "react";
import {
  createCraftQueries,
  type CraftQueries,
} from "../../application/queries/craft/index.ts";
import {
  createExpeditionPlanningQueries,
  type ExpeditionPlanningQueries,
} from "../../application/queries/expeditions/index.ts";
import {
  createJourneyQueries,
  type JourneyQueries,
} from "../../application/queries/journey/index.ts";
import {
  createForgeQueries,
  type ForgeQueries,
} from "../../application/queries/forge/index.ts";
import {
  createLoadoutQueries,
  type LoadoutQueries,
} from "../../application/queries/loadout/index.ts";
import { useGameStore } from "../../app/game-store.ts";

export function useCraftQueries(): CraftQueries | null {
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  return React.useMemo(() => {
    if (!catalog || !config) return null;
    return createCraftQueries(
      catalog,
      config.stationArchetypes,
      config.maxQueueSize,
    );
  }, [catalog, config]);
}

export function useExpeditionPlanningQueries(): ExpeditionPlanningQueries | null {
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  return React.useMemo(() => {
    if (!catalog || !config) return null;
    return createExpeditionPlanningQueries(
      catalog,
      config.captureAidProductId,
      config.routeDurationMsByRouteId,
      config.catchmonCapabilityMagnitudes,
    );
  }, [catalog, config]);
}

export function useJourneyQueries(): JourneyQueries | null {
  const catalog = useGameStore((s) => s.catalog);
  return React.useMemo(() => {
    if (!catalog) return null;
    return createJourneyQueries(catalog);
  }, [catalog]);
}

export function useForgeQueries(): ForgeQueries | null {
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  return React.useMemo(() => {
    if (!catalog || !config) return null;
    return createForgeQueries(
      catalog,
      config.leadStatsConfig,
      config.powerWeights,
    );
  }, [catalog, config]);
}

export function useLoadoutQueries(): LoadoutQueries | null {
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  return React.useMemo(() => {
    if (!catalog || !config) return null;
    return createLoadoutQueries(
      catalog,
      config.leadStatsConfig,
      config.powerWeights,
    );
  }, [catalog, config]);
}
