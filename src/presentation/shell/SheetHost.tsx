/*
 * The one place `useUiStore`'s `activeSheet` is turned into an actual
 * rendered sheet — every screen just calls `openSheet(...)`, never
 * imports a sheet component directly, so there is exactly one mount
 * point (and therefore exactly one open sheet at a time, matching the
 * approved-v1 "sheets rise from the bottom edge" single-sheet pattern).
 */
import * as React from "react";
import { useUiStore } from "../../app/ui-store.ts";
import { CustomerSheet } from "../sheets/CustomerSheet.tsx";
import { DisplaySheet } from "../sheets/DisplaySheet.tsx";
import { StationSheet } from "../sheets/StationSheet.tsx";
import { InventorySheet } from "../sheets/InventorySheet.tsx";
import { CatchmonDetailSheet } from "../sheets/CatchmonDetailSheet.tsx";
import { EvolutionSheet } from "../sheets/EvolutionSheet.tsx";
import { RouteSheet } from "../sheets/RouteSheet.tsx";
import { ExpeditionResultSheet } from "../sheets/ExpeditionResultSheet.tsx";
import { EncounterSheet } from "../sheets/EncounterSheet.tsx";
import { BuildSheet } from "../sheets/BuildSheet.tsx";

export function SheetHost(): React.JSX.Element | null {
  const activeSheet = useUiStore((s) => s.activeSheet);
  if (!activeSheet) return null;

  switch (activeSheet.kind) {
    case "customer":
      return <CustomerSheet customerId={activeSheet.customerId} />;
    case "display":
      return <DisplaySheet displaySlotId={activeSheet.displaySlotId} />;
    case "station":
      return <StationSheet stationId={activeSheet.stationId} />;
    case "inventory":
      return <InventorySheet />;
    case "catchmonDetail":
      return (
        <CatchmonDetailSheet ownedCatchmonId={activeSheet.ownedCatchmonId} />
      );
    case "evolution":
      return (
        <EvolutionSheet
          ownedCatchmonId={activeSheet.ownedCatchmonId}
          fromSpeciesId={activeSheet.fromSpeciesId}
          toSpeciesId={activeSheet.toSpeciesId}
        />
      );
    case "route":
      return <RouteSheet routeId={activeSheet.routeId} />;
    case "expeditionResult":
      return <ExpeditionResultSheet />;
    case "encounter":
      return <EncounterSheet encounterId={activeSheet.encounterId} />;
    case "build":
      return <BuildSheet initialTab={activeSheet.initialTab} />;
    default:
      return null;
  }
}
