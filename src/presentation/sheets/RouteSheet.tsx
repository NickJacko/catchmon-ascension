/*
 * Design owner: Document 15 Task 08.15 (Region / Route Workspace) + Task
 * 08.16 (Expedition Planning Screen), combined into one sheet — this
 * slice's minimal "1 expedition slot, 3 routes" scope (CLAUDE.md §33)
 * does not need two separate screens to show a route's own summary and
 * then plan against it; splitting them would fragment one short flow for
 * no functional gain. Implements: region identity, route duration/reward
 * category/encounter potential, Lead selection with duty-eligibility and
 * discovery-boost fit, Capture Aid toggle when applicable, reserve state,
 * Start.
 */
import * as React from "react";
import { type OwnedCatchmonId, type RouteId } from "../../core/ids/index.ts";
import { isEligibleForDomain } from "../../application/queries/catchmons/index.ts";
import { EXPEDITIONS_SYSTEM_MILESTONE } from "../../domain/journey/index.ts";
import { useExpeditionPlanningQueries } from "../hooks/useQueries.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, Sheet, StatusPill } from "../components/index.ts";

export interface RouteSheetProps {
  readonly routeId: RouteId;
}

export function RouteSheet({
  routeId,
}: RouteSheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const queries = useExpeditionPlanningQueries();
  const [leadId, setLeadId] = React.useState<OwnedCatchmonId | undefined>(
    undefined,
  );
  const [bringCaptureAid, setBringCaptureAid] = React.useState(false);

  if (!state || !catalog || !config || !queries) return null;
  const route = catalog.routes.get(routeId);
  if (!route) return null;
  const region = catalog.regions.get(route.regionId);
  // Phase R6: START_EXPEDITION's real gate is the Journey system milestone
  // (first Region completion), not Expedition Hub ownership — this must
  // mirror that domain check exactly, or the button can disable/enable on
  // a condition the command itself no longer enforces (see
  // `start-expedition.ts`'s own doc comment for the migration).
  const expeditionsUnlocked = state.progression.unlockedSystemIds.includes(
    EXPEDITIONS_SYSTEM_MILESTONE,
  );

  const preview = queries.expeditionPreview(routeId);
  const loadout = queries.loadoutCompatibility(state, routeId);
  const availability = queries
    .availableRoutes(state)
    .find((entry) => entry.routeId === routeId);

  const eligibleLeads = Object.values(state.catchmons.ownedCatchmons).filter(
    (owned) =>
      owned.currentAssignment.kind === "UNASSIGNED" &&
      isEligibleForDomain(catalog, owned.currentSpeciesId, "EXPEDITION"),
  );

  const fit = leadId ? queries.routeFit(state, routeId, leadId) : null;

  return (
    <Sheet title={route.displayName} onClose={closeSheet}>
      <div className="stack">
        <p className="muted">
          {region?.displayName} · {region?.elementId}
        </p>

        {!expeditionsUnlocked && (
          <StatusPill tone="warning">
            Expeditions unlock after completing your first Region&apos;s Journey
          </StatusPill>
        )}
        {expeditionsUnlocked && !availability?.available && (
          <StatusPill tone="warning">Route not currently accessible</StatusPill>
        )}

        {preview && (
          <div className="row row--between">
            <span className="muted">Duration</span>
            <span>{Math.round(preview.durationMs / 1000)}s</span>
          </div>
        )}
        {preview && (
          <div className="row row--between">
            <span className="muted">Rewards</span>
            <span>
              {[
                ...preview.guaranteedRewardTags,
                ...preview.bonusRewardPoolTags,
              ].join(", ")}
            </span>
          </div>
        )}
        {preview?.hasEncounterChance && (
          <StatusPill tone="info">Discovery chance</StatusPill>
        )}

        <div>
          <h3 className="cs-customer-recommend__title">Lead</h3>
          {eligibleLeads.length === 0 && (
            <p className="muted">No eligible, unassigned Catchmon.</p>
          )}
          {eligibleLeads.map((owned) => (
            <label key={owned.ownedCatchmonId} className="row">
              <input
                type="radio"
                name="lead"
                checked={leadId === owned.ownedCatchmonId}
                onChange={() => {
                  setLeadId(owned.ownedCatchmonId);
                }}
              />
              {catalog.catchmonSpecies.get(owned.currentSpeciesId)?.displayName}
            </label>
          ))}
          {fit && fit.discoveryBoostBonus > 0 && (
            <StatusPill tone="success">Discovery boost</StatusPill>
          )}
        </div>

        {loadout?.captureAidApplicable && (
          <label className="row">
            <input
              type="checkbox"
              checked={bringCaptureAid}
              disabled={loadout.captureAidAvailableQuantity < 1}
              onChange={(event) => {
                setBringCaptureAid(event.target.checked);
              }}
            />
            Bring Capture Aid ({loadout.captureAidAvailableQuantity} available)
          </label>
        )}

        <Button
          fullWidth
          disabled={!expeditionsUnlocked || !availability?.available || !leadId}
          onClick={() => {
            void dispatch("START_EXPEDITION", {
              routeId,
              leadCatchmonId: leadId,
              bringCaptureAid,
            });
            closeSheet();
          }}
        >
          Start Expedition
        </Button>
      </div>
    </Sheet>
  );
}
