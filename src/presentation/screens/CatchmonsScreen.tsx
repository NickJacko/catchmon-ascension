/*
 * Design owner: Document 15 Task 08.11 (Catchmon Roster) + Task 08.12
 * (Catchdex) — "Roster: owned Catchmon, role/domain, assignment, level.
 * Catchdex: Unknown/Traced/Encountered/Owned, slice-relevant lines only
 * (not all 104)." `catalog.catchmonLines` already only contains the
 * slice's own line registrations (Task 05.x content), so no extra
 * filtering against `SELECTED_CATCHMON_SPECIES_IDS` is needed to honor
 * that scope limit.
 */
import * as React from "react";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore, type CatchmonsTab } from "../../app/ui-store.ts";
import {
  CatchmonCard,
  SectionHead,
  StatusPill,
  Tabs,
} from "../components/index.ts";

const TABS: readonly { readonly id: CatchmonsTab; readonly label: string }[] = [
  { id: "roster", label: "Roster" },
  { id: "catchdex", label: "Catchdex" },
];

export function CatchmonsScreen(): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const catchmonsTab = useUiStore((s) => s.catchmonsTab);
  const setCatchmonsTab = useUiStore((s) => s.setCatchmonsTab);
  const openSheet = useUiStore((s) => s.openSheet);

  if (!state || !catalog) return null;

  return (
    <div className="stack">
      <Tabs
        items={TABS}
        value={catchmonsTab}
        onChange={(id) => {
          setCatchmonsTab(id as CatchmonsTab);
        }}
        aria-label="Catchmon sections"
      />

      {catchmonsTab === "roster" && (
        <section>
          <SectionHead title="Roster" />
          {state.catchmons.ownedCatchmonIds.length === 0 && (
            <p className="empty-state">No Catchmons yet.</p>
          )}
          <div className="grid-cards grid-cards--3">
            {state.catchmons.ownedCatchmonIds.map((ownedCatchmonId) => {
              const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
              if (!owned) return null;
              const species = catalog.catchmonSpecies.get(
                owned.currentSpeciesId,
              );
              const line = catalog.catchmonLines.get(owned.lineId);
              const elementId = species?.elementId ?? line?.elementId;
              const duty =
                owned.currentAssignment.kind === "LEAD"
                  ? "Lead"
                  : owned.currentAssignment.kind === "BOND_SUPPORT"
                    ? `Bond ${owned.currentAssignment.slotIndex + 1}`
                    : owned.currentAssignment.kind === "EXPEDITION"
                      ? "Expedition"
                      : owned.currentAssignment.kind === "UNASSIGNED"
                        ? "Unassigned"
                        : owned.currentAssignment.kind;
              return (
                <CatchmonCard
                  key={ownedCatchmonId}
                  name={species?.displayName ?? owned.currentSpeciesId}
                  art={resolveAssetImageUrl(
                    species
                      ? catalog.assets.get(species.portraitAssetId)
                      : undefined,
                  )}
                  {...(elementId ? { element: elementId } : {})}
                  caption={`Lv.${owned.level} · ${duty}`}
                  onClick={() => {
                    openSheet({ kind: "catchmonDetail", ownedCatchmonId });
                  }}
                />
              );
            })}
          </div>
        </section>
      )}

      {catchmonsTab === "catchdex" && (
        <section>
          <SectionHead title="Catchdex" />
          <div className="grid-cards grid-cards--3">
            {Array.from(catalog.catchmonLines.values()).map((line) => {
              const status =
                state.world.discoveryStates[line.catchmonLineId] ?? "UNKNOWN";
              const representativeSpeciesId = line.speciesIds[0];
              const species = representativeSpeciesId
                ? catalog.catchmonSpecies.get(representativeSpeciesId)
                : undefined;
              const discovered = status === "OWNED";
              return (
                <CatchmonCard
                  key={line.catchmonLineId}
                  name={species?.displayName ?? line.displayName}
                  art={
                    discovered
                      ? resolveAssetImageUrl(
                          species
                            ? catalog.assets.get(species.portraitAssetId)
                            : undefined,
                        )
                      : undefined
                  }
                  discovered={discovered}
                  caption={
                    <StatusPill tone="neutral" icon={null}>
                      {status}
                    </StatusPill>
                  }
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
