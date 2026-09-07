/*
 * Design owner: Document 15 Task 08.13 (Catchmon Detail / Assignment),
 * Phase R8 (docs/rebuild/12 §5 Catchmons Screen — "Bond, Lead/Support
 * assignment"). Phase R8 replaced this sheet's Shop-era WORKSHOP/
 * SHOP_FLOOR/SUPPLY reassignment (Everyday Orders/crafting semantics,
 * out of scope for normal Ascension UI) with Lead/Bond Support assignment
 * — Ascension's own real functional duties (`ASSIGN_LEAD_CATCHMON`/
 * `ASSIGN_BOND_SUPPORT`, docs/rebuild/15 Phases R2-R5). Expedition
 * assignment still only ever happens through the Route Sheet's own Lead
 * picker (Task 08.16) — not duplicated here.
 */
import * as React from "react";
import { type ElementId } from "../../domain/world/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import { usePendingAction } from "../hooks/usePendingAction.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import {
  Button,
  CatchmonCard,
  ElementBadge,
  Sheet,
} from "../components/index.ts";
import { type OwnedCatchmonId } from "../../core/ids/index.ts";

export interface CatchmonDetailSheetProps {
  readonly ownedCatchmonId: OwnedCatchmonId;
}

const BOND_SLOTS = [0, 1, 2] as const;

export function CatchmonDetailSheet({
  ownedCatchmonId,
}: CatchmonDetailSheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const openSheet = useUiStore((s) => s.openSheet);
  const { pending, run } = usePendingAction();

  if (!state || !catalog || !config) return null;
  const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
  if (!owned) return null;
  const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
  const line = catalog.catchmonLines.get(owned.lineId);
  const elementId: ElementId | undefined =
    species?.elementId ?? line?.elementId;
  const art = resolveAssetImageUrl(
    species ? catalog.assets.get(species.portraitAssetId) : undefined,
  );

  const isLead = state.loadout.leadCatchmonId === ownedCatchmonId;
  const bondSlotIndex =
    owned.currentAssignment.kind === "BOND_SUPPORT"
      ? owned.currentAssignment.slotIndex
      : undefined;
  const bondProgressConfig = config.attemptStageConfig;
  const bondProgressPct =
    owned.bondLevel !== undefined &&
    owned.bondLevel < bondProgressConfig.bondLevelCap
      ? Math.round(
          (((owned.bondProgress ?? 0) %
            bondProgressConfig.bondProgressPerBondLevel) /
            bondProgressConfig.bondProgressPerBondLevel) *
            100,
        )
      : null;

  return (
    <Sheet
      title={species?.displayName ?? owned.currentSpeciesId}
      onClose={closeSheet}
    >
      <div className="stack">
        <CatchmonCard
          name={species?.displayName ?? owned.currentSpeciesId}
          art={art}
          {...(elementId ? { element: elementId } : {})}
        />

        <div className="row row--between">
          <span className="muted">Level {owned.level}</span>
          {elementId && <ElementBadge element={elementId} size="sm" />}
        </div>

        {line && <p className="muted">{line.specializationIdentity}</p>}

        {owned.bondLevel !== undefined && (
          <div>
            <div className="row row--between">
              <span className="muted">Bond</span>
              <span>{owned.bondLevel}</span>
            </div>
            {bondProgressPct !== null && (
              <div className="meter meter--sm" role="presentation">
                <div
                  className="meter__fill"
                  style={{ width: `${String(bondProgressPct)}%` }}
                />
              </div>
            )}
          </div>
        )}

        <div>
          <h3 className="cs-customer-recommend__title">Journey duty</h3>
          <p className="muted">Currently: {owned.currentAssignment.kind}</p>
          <div className="row">
            <Button
              size="sm"
              variant={isLead ? "primary" : "secondary"}
              disabled={isLead || pending}
              onClick={() => {
                run(() =>
                  dispatch("ASSIGN_LEAD_CATCHMON", { ownedCatchmonId }),
                );
              }}
            >
              Set as Lead
            </Button>
            {BOND_SLOTS.map((slotIndex) => (
              <Button
                key={slotIndex}
                size="sm"
                variant={bondSlotIndex === slotIndex ? "primary" : "ghost"}
                disabled={bondSlotIndex === slotIndex || pending}
                onClick={() => {
                  run(() =>
                    dispatch("ASSIGN_BOND_SUPPORT", {
                      ownedCatchmonId,
                      slotIndex,
                    }),
                  );
                }}
              >
                Bond {slotIndex + 1}
              </Button>
            ))}
          </div>
          <p className="muted">
            Expeditions are assigned from a route&apos;s own Lead picker
            (World).
          </p>
        </div>

        {owned.evolutionReadiness === "READY" &&
          species?.evolvesToSpeciesId && (
            <Button
              fullWidth
              onClick={() => {
                const toSpeciesId = species.evolvesToSpeciesId!;
                closeSheet();
                openSheet({
                  kind: "evolution",
                  ownedCatchmonId,
                  fromSpeciesId: owned.currentSpeciesId,
                  toSpeciesId,
                });
              }}
            >
              Ready to evolve
            </Button>
          )}
      </div>
    </Sheet>
  );
}
