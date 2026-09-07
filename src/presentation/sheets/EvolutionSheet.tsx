/*
 * Design owner: Document 15 Task 08.19 (Evolution Presentation) —
 * "focused screen/overlay, before/after, capability change, return to
 * detail." Safely supported for 4 of the 6 selected species (Flamarox,
 * Emberynn, Aquilor, Geckon) — their real canonical evolution chains,
 * resolved by the evolution-reference integration workstream — so this
 * task is not gated.
 */
import * as React from "react";
import {
  type CatchmonSpeciesId,
  type OwnedCatchmonId,
} from "../../core/ids/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, CatchmonCard, Sheet } from "../components/index.ts";

export interface EvolutionSheetProps {
  readonly ownedCatchmonId: OwnedCatchmonId;
  readonly fromSpeciesId: CatchmonSpeciesId;
  readonly toSpeciesId: CatchmonSpeciesId;
}

export function EvolutionSheet({
  ownedCatchmonId,
  fromSpeciesId,
  toSpeciesId,
}: EvolutionSheetProps): React.JSX.Element | null {
  const catalog = useGameStore((s) => s.catalog);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const openSheet = useUiStore((s) => s.openSheet);
  if (!catalog) return null;

  const fromSpecies = catalog.catchmonSpecies.get(fromSpeciesId);
  const toSpecies = catalog.catchmonSpecies.get(toSpeciesId);
  const fromCapabilities = (fromSpecies?.capabilityIds ?? [])
    .map((id) => catalog.capabilities.get(id)?.displayName)
    .filter(Boolean);
  const toCapabilities = (toSpecies?.capabilityIds ?? [])
    .map((id) => catalog.capabilities.get(id)?.displayName)
    .filter(Boolean);

  return (
    <Sheet title="Evolution" onClose={closeSheet}>
      <div className="stack">
        <div className="row row--between">
          <CatchmonCard
            name={fromSpecies?.displayName ?? fromSpeciesId}
            art={resolveAssetImageUrl(
              fromSpecies
                ? catalog.assets.get(fromSpecies.portraitAssetId)
                : undefined,
            )}
          />
          <CatchmonCard
            name={toSpecies?.displayName ?? toSpeciesId}
            art={resolveAssetImageUrl(
              toSpecies
                ? catalog.assets.get(toSpecies.portraitAssetId)
                : undefined,
            )}
            glow
          />
        </div>

        {toCapabilities.length > 0 && (
          <p className="muted">
            Capability: {fromCapabilities.join(", ") || "—"} →{" "}
            {toCapabilities.join(", ")}
          </p>
        )}

        <Button
          fullWidth
          onClick={() => {
            void dispatch("EVOLVE_CATCHMON", { ownedCatchmonId });
            closeSheet();
            openSheet({ kind: "catchmonDetail", ownedCatchmonId });
          }}
        >
          Evolve
        </Button>
      </div>
    </Sheet>
  );
}
