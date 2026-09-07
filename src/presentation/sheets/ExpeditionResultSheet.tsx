/*
 * Design owner: Document 15 Task 08.17 (Expedition Result Screen) —
 * "Prioritize: 1. Encounter/Trace 2. Component 3. routine material. No
 * loot explosion." Shows the most recently completed expedition's durable
 * `ExpeditionResult`.
 */
import * as React from "react";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, Sheet, StatusPill } from "../components/index.ts";

export function ExpeditionResultSheet(): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const openSheet = useUiStore((s) => s.openSheet);
  if (!state || !catalog) return null;

  const completed = Object.values(state.expeditions.expeditions)
    .filter(
      (expedition) => expedition.status === "COMPLETED" && expedition.result,
    )
    .sort((a, b) => b.result!.resolvedAtMs - a.result!.resolvedAtMs);
  const latest = completed[0];
  const result = latest?.result;

  if (!result) {
    return (
      <Sheet title="Expedition Result" onClose={closeSheet}>
        <p className="empty-state">No completed expeditions yet.</p>
      </Sheet>
    );
  }

  const encounter = result.encounterId
    ? state.world.encounterOpportunities[result.encounterId]
    : undefined;

  return (
    <Sheet title="Expedition Result" onClose={closeSheet}>
      <div className="stack">
        {encounter && (
          <div className="row row--between">
            <StatusPill tone="premium">Encounter</StatusPill>
            <span>
              {
                catalog.catchmonSpecies.get(encounter.targetSpeciesId)
                  ?.displayName
              }
            </span>
          </div>
        )}
        {result.bonusComponentGranted && (
          <div className="row row--between">
            <StatusPill tone="success">Component</StatusPill>
            <span>
              {
                catalog.components.get(result.bonusComponentGranted)
                  ?.displayName
              }
            </span>
          </div>
        )}
        {result.routineRewards.map((reward) => (
          <div key={reward.itemId} className="row row--between">
            <span className="muted">Materials</span>
            <span>×{reward.quantity}</span>
          </div>
        ))}

        {encounter && encounter.status === "PENDING" && (
          <Button
            fullWidth
            onClick={() => {
              closeSheet();
              openSheet({
                kind: "encounter",
                encounterId: encounter.encounterId,
              });
            }}
          >
            View Encounter
          </Button>
        )}
      </div>
    </Sheet>
  );
}
