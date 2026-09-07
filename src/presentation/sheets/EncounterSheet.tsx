/*
 * Design owner: Document 15 Task 08.18 (Encounter / Capture Screen) —
 * "Catchmon, state, capture chance, aid selection, preview, attempt,
 * success/failure. No Coin retry." An already-owned target routes to
 * OBSERVE_ENCOUNTER (Document 07 §89) instead of a capture roll.
 */
import * as React from "react";
import { type EncounterId } from "../../core/ids/index.ts";
import {
  getFailedCaptureRecovery,
  previewCaptureChance,
} from "../../application/queries/expeditions/index.ts";
import { toPercentageNumber } from "../../core/math/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import { usePendingAction } from "../hooks/usePendingAction.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import {
  Button,
  CatchmonCard,
  Sheet,
  StatusPill,
} from "../components/index.ts";

export interface EncounterSheetProps {
  readonly encounterId: EncounterId;
}

export function EncounterSheet({
  encounterId,
}: EncounterSheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const [useAid, setUseAid] = React.useState(true);
  const { pending, run } = usePendingAction();

  if (!state || !catalog || !config) return null;
  const encounter = state.world.encounterOpportunities[encounterId];
  if (!encounter) return null;

  const species = catalog.catchmonSpecies.get(encounter.targetSpeciesId);
  const alreadyOwned =
    state.world.discoveryStates[encounter.targetLineId] === "OWNED";
  const expedition = state.expeditions.expeditions[encounter.expeditionId];
  const aidReserved = expedition?.loadoutReservationId !== undefined;

  const chance = previewCaptureChance(
    state,
    encounterId,
    useAid && aidReserved,
    config.captureChanceConfig,
  );

  const recovery =
    encounter.status === "RESOLVED" && encounter.resolution === "FAILED"
      ? getFailedCaptureRecovery(state, encounterId)
      : null;

  return (
    <Sheet title="Encounter" onClose={closeSheet}>
      <div className="stack">
        <CatchmonCard
          name={species?.displayName ?? encounter.targetSpeciesId}
          art={resolveAssetImageUrl(
            species ? catalog.assets.get(species.portraitAssetId) : undefined,
          )}
        />

        {encounter.status === "RESOLVED" ? (
          <div className="stack">
            <StatusPill
              tone={encounter.resolution === "CAPTURED" ? "success" : "neutral"}
            >
              {encounter.resolution}
            </StatusPill>
            {recovery && (
              <p className="muted">
                Protection progress: {recovery.consecutiveFailures} failed
                attempt(s).
                {recovery.canPursueAgain
                  ? " This line can still be pursued again on a future survey."
                  : ""}
              </p>
            )}
          </div>
        ) : alreadyOwned ? (
          <div className="stack">
            <p className="muted">
              Already owned — observing yields a small reward.
            </p>
            <Button
              fullWidth
              onClick={() => {
                void dispatch("OBSERVE_ENCOUNTER", { encounterId });
                closeSheet();
              }}
            >
              Observe
            </Button>
          </div>
        ) : (
          <div className="stack">
            {aidReserved && (
              <label className="row">
                <input
                  type="checkbox"
                  checked={useAid}
                  onChange={(event) => {
                    setUseAid(event.target.checked);
                  }}
                />
                Use Capture Aid
              </label>
            )}
            {chance !== null && (
              <StatusPill tone="info">
                Capture chance {Math.round(toPercentageNumber(chance))}%
              </StatusPill>
            )}
            <div className="row">
              <Button
                fullWidth
                disabled={pending}
                onClick={() => {
                  run(() =>
                    dispatch("ATTEMPT_CAPTURE", {
                      encounterId,
                      useAid: useAid && aidReserved,
                    }),
                  );
                }}
              >
                Attempt Capture
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  void dispatch("DECLINE_ENCOUNTER", { encounterId });
                  closeSheet();
                }}
              >
                Decline
              </Button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}
