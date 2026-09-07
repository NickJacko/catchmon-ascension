/*
 * Design owner: Document 15 Task 08.7 (Quick Station Sheet) + Task 08.8
 * (Recipe Workspace, folded in here rather than as a separate global
 * destination — Document 15 does not require Recipe selection to exist
 * anywhere except from a station) — "current craft, timer, queue, ready
 * output, recent/quick recipes, assigned Catchmon, Workshop Push."
 */
import * as React from "react";
import { type StationId } from "../../core/ids/index.ts";
import { useCraftQueries } from "../hooks/useQueries.ts";
import { useNow, formatDuration } from "../hooks/useNow.ts";
import { usePendingAction } from "../hooks/usePendingAction.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, Sheet, StatusPill } from "../components/index.ts";
import { isEligibleForDomain } from "../../application/queries/catchmons/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import "./StationSheet.css";

export interface StationSheetProps {
  readonly stationId: StationId;
}

export function StationSheet({
  stationId,
}: StationSheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const craftQueries = useCraftQueries();
  const now = useNow();
  const { pending, run } = usePendingAction();

  if (!state || !catalog || !craftQueries) return null;

  const station = state.crafting.stations[stationId];
  const queue = craftQueries.currentQueue(state, stationId);
  const recipes = Array.from(catalog.recipes.values()).filter(
    (recipe) => !station || recipe.stationType === station.archetype,
  );

  const supportOwned = (station?.supportCatchmonIds ?? [])
    .map((id) => state.catchmons.ownedCatchmons[id])
    .filter((owned) => owned !== undefined);

  const unassignedEligible = Object.values(
    state.catchmons.ownedCatchmons,
  ).filter(
    (owned) =>
      owned.currentAssignment.kind === "UNASSIGNED" &&
      isEligibleForDomain(catalog, owned.currentSpeciesId, "WORKSHOP"),
  );

  return (
    <Sheet title="Station" onClose={closeSheet}>
      <div className="stack">
        {queue.active ? (
          <div className="station-active-craft">
            <div className="row row--between">
              <span>
                {catalog.recipes.get(queue.active.recipeId)?.displayName}
              </span>
              <StatusPill tone="info">
                {formatDuration(queue.active.completesAtMs - now)}
              </StatusPill>
            </div>
            <Button
              size="sm"
              variant="secondary"
              disabled={pending}
              onClick={() => {
                run(() => dispatch("WORKSHOP_PUSH", { stationId }));
              }}
            >
              Workshop Push
            </Button>
          </div>
        ) : (
          <p className="muted">No active craft.</p>
        )}

        {queue.queued.length > 0 && (
          <div>
            <h3 className="cs-customer-recommend__title">Queue</h3>
            {queue.queued.map((queued) => (
              <div key={queued.craftId} className="row row--between">
                <span>{catalog.recipes.get(queued.recipeId)?.displayName}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={pending}
                  onClick={() => {
                    run(() =>
                      dispatch("CANCEL_QUEUED_CRAFT", {
                        stationId,
                        craftId: queued.craftId,
                      }),
                    );
                  }}
                >
                  Cancel
                </Button>
              </div>
            ))}
          </div>
        )}

        <div>
          <h3 className="cs-customer-recommend__title">Recipes</h3>
          {recipes.length === 0 && (
            // Ozean Batch A (Care Atelier foundation check): the Living
            // Shop Scene canvas can open this sheet for ANY registered
            // station, including one with zero recipes yet (Care Atelier,
            // pre-Batch-B) — an empty list under this header with no
            // explanation would look broken rather than "not built yet".
            <p className="muted">No recipes available yet.</p>
          )}
          {recipes.map((recipe) => {
            const preview = craftQueries.productOutputPreview(recipe.recipeId);
            const missing = craftQueries.missingIngredients(
              state,
              recipe.recipeId,
            );
            const canCraft = craftQueries.canCraft(
              state,
              stationId,
              recipe.recipeId,
            );
            const outputProduct = catalog.products.get(recipe.outputProductId);
            const outputArt = resolveAssetImageUrl(
              outputProduct
                ? catalog.assets.get(outputProduct.visualAssetId)
                : undefined,
            );
            return (
              <div key={recipe.recipeId} className="row row--between">
                <div className="row">
                  {outputArt && (
                    <img
                      src={outputArt}
                      alt=""
                      className="station-sheet__recipe-icon"
                    />
                  )}
                  <div className="stack stack--tight">
                    <span>{preview?.displayName ?? recipe.displayName}</span>
                    {missing.length > 0 && (
                      <span className="muted">Missing materials</span>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!canCraft || pending}
                  onClick={() => {
                    const type = queue.active ? "QUEUE_CRAFT" : "START_CRAFT";
                    run(() =>
                      dispatch(type, {
                        stationId,
                        recipeId: recipe.recipeId,
                      }),
                    );
                  }}
                >
                  {queue.active ? "Queue" : "Craft"}
                </Button>
              </div>
            );
          })}
        </div>

        <div>
          <h3 className="cs-customer-recommend__title">Assigned Catchmon</h3>
          {supportOwned.length === 0 && <p className="muted">None assigned.</p>}
          {supportOwned.map((owned) => (
            <div key={owned.ownedCatchmonId} className="row row--between">
              <span>
                {
                  catalog.catchmonSpecies.get(owned.currentSpeciesId)
                    ?.displayName
                }
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={pending}
                onClick={() => {
                  run(() =>
                    dispatch("ASSIGN_CATCHMON", {
                      ownedCatchmonId: owned.ownedCatchmonId,
                      assignment: { kind: "UNASSIGNED" },
                    }),
                  );
                }}
              >
                Unassign
              </Button>
            </div>
          ))}
          {unassignedEligible.map((owned) => (
            <div key={owned.ownedCatchmonId} className="row row--between">
              <span>
                {
                  catalog.catchmonSpecies.get(owned.currentSpeciesId)
                    ?.displayName
                }
              </span>
              <Button
                size="sm"
                variant="secondary"
                disabled={pending}
                onClick={() => {
                  run(() =>
                    dispatch("ASSIGN_CATCHMON", {
                      ownedCatchmonId: owned.ownedCatchmonId,
                      assignment: { kind: "WORKSHOP", stationId },
                    }),
                  );
                }}
              >
                Assign here
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
