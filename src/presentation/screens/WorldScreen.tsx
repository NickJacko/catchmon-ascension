/*
 * Design owner: Document 15 Task 08.14 (World Map) folding in Region /
 * Route access — CLAUDE.md §33's "Start Region: Vulkankrater / Fire,
 * Contrast Preview: Ozean / Water" slice scope. Extended by Ozean Batch A
 * closure: Ozean now has 3 real routes, gated behind a real two-signal
 * unlock rule (`worldContent.ts`'s `OZEAN_UNLOCK_RULE_ID`), so "does this
 * region have any routes at all" is no longer the same question as "can
 * the player actually enter it right now" — a region card must check
 * `state.world.unlockedRegionIds` (the one domain-computed source of
 * truth, produced by `createInitialGameState`/`regionUnlockReconciliationPass`)
 * before offering normal "View Routes" behavior. This reads that already-
 * computed array; it does not re-evaluate any `UnlockCondition` itself —
 * the actual authority stays `isUnlockRuleSatisfied`/the reconciliation
 * pass, not this component.
 */
import * as React from "react";
import { type RegionId } from "../../core/ids/index.ts";
import { useNow, formatDuration } from "../hooks/useNow.ts";
import { useJourneyQueries } from "../hooks/useQueries.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { REGION_COMPLETED_MILESTONE } from "../../domain/journey/index.ts";
import { Button, Panel, SectionHead, StatusPill } from "../components/index.ts";

export function WorldScreen(): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const openSheet = useUiStore((s) => s.openSheet);
  const worldTab = useUiStore((s) => s.worldTab);
  const setWorldTab = useUiStore((s) => s.setWorldTab);
  const now = useNow();
  const journeyQueries = useJourneyQueries();
  const [selectedRegionId, setSelectedRegionId] =
    React.useState<RegionId | null>(null);

  if (!state || !catalog || !journeyQueries) return null;
  const stageList = journeyQueries.stageList(state);

  const enterRegion = (regionId: RegionId) => {
    setSelectedRegionId(regionId);
    setWorldTab("region");
  };
  const backToMap = () => {
    setSelectedRegionId(null);
    setWorldTab("map");
  };

  const regions = Array.from(catalog.regions.values());
  const routes = Array.from(catalog.routes.values());
  const selectedRegion = selectedRegionId
    ? catalog.regions.get(selectedRegionId)
    : undefined;

  const activeExpedition = state.expeditions.activeExpeditionIds
    .map((id) => state.expeditions.expeditions[id])
    .find((expedition) => expedition?.status === "IN_PROGRESS");

  const unviewedResult = Object.values(state.expeditions.expeditions).find(
    (expedition) => expedition.status === "COMPLETED" && expedition.result,
  );

  if (worldTab === "region" && selectedRegion) {
    const regionRoutes = routes.filter(
      (route) => route.regionId === selectedRegion.regionId,
    );
    return (
      <div className="stack">
        <Button variant="ghost" size="sm" onClick={backToMap}>
          ← World Map
        </Button>
        <SectionHead title={selectedRegion.displayName} />
        <div className="stack">
          {regionRoutes.map((route) => (
            <button
              key={route.routeId}
              type="button"
              className="row row--between"
              onClick={() => {
                openSheet({ kind: "route", routeId: route.routeId });
              }}
            >
              <span>{route.displayName}</span>
              <StatusPill tone="neutral" icon={null}>
                {route.expeditionIntent}
              </StatusPill>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="stack">
      <SectionHead title="World Map" />

      {activeExpedition && (
        <Panel title="Expedition in progress" tone="sand">
          <StatusPill tone="info">
            {formatDuration(Math.max(0, activeExpedition.completesAtMs - now))}{" "}
            remaining
          </StatusPill>
        </Panel>
      )}

      {!activeExpedition && unviewedResult && (
        <Button
          fullWidth
          onClick={() => {
            openSheet({ kind: "expeditionResult" });
          }}
        >
          View Expedition Result
        </Button>
      )}

      <div className="grid-cards">
        {regions.map((region) => {
          const hasRoutes = routes.some(
            (route) => route.regionId === region.regionId,
          );
          const isUnlocked = state.world.unlockedRegionIds.includes(
            region.regionId,
          );
          const regionStages = stageList.filter(
            (entry) => entry.stage.regionId === region.regionId,
          );
          const regionCompleted = (
            state.world.regionMilestones[region.regionId] ?? []
          ).includes(REGION_COMPLETED_MILESTONE);
          const clearedCount = regionStages.filter(
            (entry) => entry.status === "CLEARED",
          ).length;
          return (
            <Panel
              key={region.regionId}
              title={region.displayName}
              subtitle={region.elementId}
            >
              {regionStages.length > 0 && (
                <div className="row row--between">
                  <span className="muted">Journey</span>
                  {regionCompleted ? (
                    <StatusPill tone="success">Complete</StatusPill>
                  ) : (
                    <span className="muted">
                      {clearedCount} / {regionStages.length} stages
                    </span>
                  )}
                </div>
              )}
              {hasRoutes && isUnlocked ? (
                <Button
                  size="sm"
                  onClick={() => {
                    enterRegion(region.regionId);
                  }}
                >
                  View Routes
                </Button>
              ) : (
                <StatusPill tone="neutral" icon={null}>
                  {hasRoutes ? "Locked" : "Preview only"}
                </StatusPill>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
