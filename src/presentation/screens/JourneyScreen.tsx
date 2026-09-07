/*
 * Design owner: docs/rebuild/12_UX_INFORMATION_ARCHITECTURE_AND_MOBILE_FLOW.md
 * §3 Journey Screen ("Primary game screen... the player can spend most
 * active time here"); docs/rebuild/15 Phase R8. Replaces
 * `JourneyPlaceholderScreen.tsx` — the real Journey destination, driven
 * entirely by existing R2-R7 state/commands (no presentation-only
 * gameplay state invented here). The Pixi battle scene (`R9`) mounts
 * inside this screen via `BattleSceneHost`.
 */
import * as React from "react";
import { useNavigate } from "react-router";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import { usePendingAction } from "../hooks/usePendingAction.ts";
import { useJourneyQueries } from "../hooks/useQueries.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { getNearbyJourneyMilestone } from "../../domain/progression/index.ts";
import { BattleSceneHost } from "../scene/battle/BattleSceneHost.tsx";
import {
  Button,
  ElementBadge,
  Panel,
  SectionHead,
  StatusPill,
} from "../components/index.ts";

const OUTCOME_TONE = {
  WIN: "success",
  LOSS: "error",
  TIMEOUT: "warning",
} as const;

export function JourneyScreen(): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const openSheet = useUiStore((s) => s.openSheet);
  const navigate = useNavigate();
  const journeyQueries = useJourneyQueries();
  const { pending, run } = usePendingAction();

  if (!state || !catalog || !config || !journeyQueries) return null;

  const preview = journeyQueries.currentStagePreview(state);
  const nextObjective = journeyQueries.nextObjective(state);
  const leadId = state.loadout.leadCatchmonId;
  const lead = leadId ? state.catchmons.ownedCatchmons[leadId] : undefined;
  const leadSpecies = lead
    ? catalog.catchmonSpecies.get(lead.currentSpeciesId)
    : undefined;
  const leadArt = resolveAssetImageUrl(
    leadSpecies ? catalog.assets.get(leadSpecies.portraitAssetId) : undefined,
  );

  const journeyMilestone = getNearbyJourneyMilestone(
    state.progression,
    config.attemptStageConfig.journeyRankProgressPerRank,
    config.attemptStageConfig.journeyRankCap,
  );
  const journeyRankPct = journeyMilestone.progressRequiredForNextRank
    ? Math.min(
        100,
        Math.round(
          (journeyMilestone.rankProgress /
            journeyMilestone.progressRequiredForNextRank) *
            100,
        ),
      )
    : null;

  const forgeReady =
    state.forge.echoCharges >= config.forgeRelicConfig.echoChargeCost;

  const stableStage = journeyQueries.stableFarmStagePreview(state);

  return (
    <div className="stack">
      <SectionHead
        title="Current Stage"
        action={
          <Button
            size="sm"
            variant={forgeReady ? "primary" : "ghost"}
            onClick={() => {
              navigate("/forge");
            }}
          >
            Forge{forgeReady ? " ready" : ""}
          </Button>
        }
      />

      {!leadId && (
        <Panel title="No Lead assigned" tone="sand">
          <p className="muted">
            Assign a Lead Catchmon before attempting a stage.
          </p>
          <Button
            size="sm"
            onClick={() => {
              openSheet({ kind: "build", initialTab: "lead" });
            }}
          >
            Choose Lead
          </Button>
        </Panel>
      )}

      {preview ? (
        <Panel
          title={preview.region.displayName}
          subtitle={preview.stage.displayName}
        >
          <BattleSceneHost />

          <div className="row row--between">
            <div className="row">
              {leadArt && (
                <img
                  src={leadArt}
                  alt=""
                  className="cs-customer-header__portrait"
                />
              )}
              <span>{leadSpecies?.displayName ?? "No Lead"}</span>
            </div>
            <div className="row">
              <span>{preview.enemy.displayName}</span>
              {preview.enemy.isBoss && (
                <StatusPill tone="premium" icon={null}>
                  Boss
                </StatusPill>
              )}
              {preview.enemy.elementId && (
                <ElementBadge element={preview.enemy.elementId} size="sm" />
              )}
            </div>
          </div>

          {state.journey.lastBattle && (
            <div className="row row--between">
              <span className="muted">Last attempt</span>
              <StatusPill tone={OUTCOME_TONE[state.journey.lastBattle.outcome]}>
                {state.journey.lastBattle.outcome}
              </StatusPill>
            </div>
          )}

          <p className="muted">{nextObjective}</p>

          <Button
            fullWidth
            disabled={!leadId || pending}
            onClick={() => {
              run(() => dispatch("ATTEMPT_STAGE", {}));
            }}
          >
            {preview.enemy.isBoss ? "Challenge Boss" : "Attempt Stage"}
          </Button>
        </Panel>
      ) : (
        <Panel title="Journey complete" tone="sand">
          <p className="muted">{nextObjective}</p>
        </Panel>
      )}

      <Panel title="Journey Rank">
        <div className="row row--between">
          <span>Rank {journeyMilestone.currentRank}</span>
          {journeyMilestone.progressRemaining !== null && (
            <span className="muted">
              {journeyMilestone.progressRemaining} to next rank
            </span>
          )}
        </div>
        {journeyRankPct !== null && (
          <div className="meter" role="presentation">
            <div
              className="meter__fill"
              style={{ width: `${String(journeyRankPct)}%` }}
            />
          </div>
        )}
      </Panel>

      {stableStage && (
        <Panel title="Stable farm checkpoint" tone="sand">
          <p className="muted">
            Offline progress farms {stableStage.displayName} while you are away
            — it will never auto-clear a boss.
          </p>
        </Panel>
      )}

      <div className="row">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            openSheet({ kind: "build" });
          }}
        >
          Build
        </Button>
      </div>
    </div>
  );
}
