/**
 * Design owner: Document 15 Task 05.5 (Catchmon Assignment Engine); 06
 * Catchmon Gameplay Integration §44-52 (Functional Assignments, One
 * Active Functional Duty, Functional Capacity, Persistent Assignment,
 * Effect Snapshotting); 14 Technical Architecture §94-96.
 *
 * `OwnedCatchmonState.currentAssignment` is the single canonical
 * representation of where a Catchmon is on duty (Document 14 §94) — this
 * command is the only place that changes it. Because it is a single
 * field (not a list), "one duty at a time" (§45) holds automatically:
 * setting a new assignment always replaces the old one. Reassignment is
 * "safe" (§50-51) in that it never retroactively touches an
 * already-snapshotted effect on an in-progress craft (Document 14 §96) —
 * this command only ever changes forward-looking state
 * (`currentAssignment` and the synced support-list caches), never a
 * `CraftActivitySnapshot` that already captured its effect at start.
 *
 * Eligibility (§44): a Catchmon may only be assigned to a domain its
 * current species has at least one capability for (Task 05.4's
 * `getEligibleDomains`). UNASSIGNED is always allowed. Capacity (§49) is
 * enforced only where a real capacity-tracking structure exists yet
 * (Workshop stations' `supportCatchmonIds`, the one slice Shop Floor
 * slot) — Supply/Expedition have no live capacity system in this phase
 * (Document 08/Phase 6 territory) and are accepted structurally without a
 * capacity ceiling; Expedition additionally requires the referenced
 * `expeditionId` to actually exist, which none do until Phase 6, so it is
 * correctly unreachable for now, not a gap.
 */
import { err, ok } from "../../../core/result/index.ts";
import {
  type OwnedCatchmonId,
  type StationId,
} from "../../../core/ids/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type StationArchetype } from "../../../domain/crafting/index.ts";
import {
  type CatchmonAssignment,
  type GameState,
  type OwnedCatchmonState,
  type StationState,
} from "../../../domain/game-state/index.ts";
import { getOrInitStation } from "../craft/craft-helpers.ts";
import { isEligibleForDomain } from "../../queries/catchmons/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type CatchmonEvent } from "./catchmon-events.ts";

export interface AssignCatchmonPayload {
  readonly ownedCatchmonId: OwnedCatchmonId;
  readonly assignment: CatchmonAssignment;
}

function removeFromCurrentAssignment(
  state: GameState,
  owned: OwnedCatchmonState,
): GameState {
  const current = owned.currentAssignment;
  if (current.kind === "WORKSHOP") {
    const station = state.crafting.stations[current.stationId];
    if (!station) return state;
    return {
      ...state,
      crafting: {
        stations: {
          ...state.crafting.stations,
          [current.stationId]: {
            ...station,
            supportCatchmonIds: station.supportCatchmonIds.filter(
              (id) => id !== owned.ownedCatchmonId,
            ),
          },
        },
      },
    };
  }
  if (current.kind === "SHOP_FLOOR") {
    return {
      ...state,
      shop: {
        ...state.shop,
        shopFloorSupportCatchmonIds:
          state.shop.shopFloorSupportCatchmonIds.filter(
            (id) => id !== owned.ownedCatchmonId,
          ),
      },
    };
  }
  return state;
}

export function createAssignCatchmonHandler(
  catalog: GameCatalog,
  stationArchetypes: Readonly<Record<StationId, StationArchetype>>,
  maxWorkshopSupportPerStation: number,
  shopFloorSupportSlotId: string,
  maxShopFloorSupportSlots: number,
): CommandHandler<GameState, AssignCatchmonPayload, CatchmonEvent> {
  return (state, command) => {
    const { ownedCatchmonId, assignment } = command.payload;
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned) {
      return err({
        code: "CATCHMON_NOT_FOUND",
        message: `No owned Catchmon "${ownedCatchmonId}"`,
      });
    }

    // docs/rebuild/15 Phase R5 (docs/rebuild/R1_DEPENDENCY_AUDIT.md §7.3):
    // LEAD/BOND_SUPPORT are additive `CatchmonAssignment` kinds, not Shop
    // functional domains — this command stays scoped to
    // WORKSHOP/SHOP_FLOOR/SUPPLY/EXPEDITION, exactly as before. Assigning
    // Lead/Bond Support goes through ASSIGN_LEAD_CATCHMON/
    // ASSIGN_BOND_SUPPORT instead.
    if (assignment.kind === "LEAD" || assignment.kind === "BOND_SUPPORT") {
      return err({
        code: "WRONG_COMMAND_FOR_ASSIGNMENT_KIND",
        message: `Use ASSIGN_LEAD_CATCHMON/ASSIGN_BOND_SUPPORT to assign "${assignment.kind}", not ASSIGN_CATCHMON`,
      });
    }

    if (assignment.kind !== "UNASSIGNED") {
      if (
        !isEligibleForDomain(catalog, owned.currentSpeciesId, assignment.kind)
      ) {
        return err({
          code: "CATCHMON_NOT_ELIGIBLE",
          message: `Owned Catchmon "${ownedCatchmonId}" has no capability valid for ${assignment.kind}`,
        });
      }
    }

    let stateAfterRemoval = removeFromCurrentAssignment(state, owned);

    if (assignment.kind === "WORKSHOP") {
      const archetype = stationArchetypes[assignment.stationId];
      if (!archetype) {
        return err({
          code: "STATION_NOT_RECOGNIZED",
          message: `Station "${assignment.stationId}" is not a recognized station`,
        });
      }
      const station = getOrInitStation(
        stateAfterRemoval.crafting.stations,
        assignment.stationId,
        archetype,
      );
      if (station.supportCatchmonIds.length >= maxWorkshopSupportPerStation) {
        return err({
          code: "WORKSHOP_SUPPORT_FULL",
          message: `Station "${assignment.stationId}" already has the maximum ${String(maxWorkshopSupportPerStation)} supporting Catchmon(s)`,
        });
      }
      const nextStation: StationState = {
        ...station,
        supportCatchmonIds: [...station.supportCatchmonIds, ownedCatchmonId],
      };
      stateAfterRemoval = {
        ...stateAfterRemoval,
        crafting: {
          stations: {
            ...stateAfterRemoval.crafting.stations,
            [assignment.stationId]: nextStation,
          },
        },
      };
    } else if (assignment.kind === "SHOP_FLOOR") {
      if (assignment.slotId !== shopFloorSupportSlotId) {
        return err({
          code: "SHOP_FLOOR_SLOT_NOT_RECOGNIZED",
          message: `"${assignment.slotId}" is not a recognized Shop Floor support slot`,
        });
      }
      if (
        stateAfterRemoval.shop.shopFloorSupportCatchmonIds.length >=
        maxShopFloorSupportSlots
      ) {
        return err({
          code: "SHOP_FLOOR_SUPPORT_FULL",
          message: `Shop Floor support is already at the maximum ${String(maxShopFloorSupportSlots)} slot(s)`,
        });
      }
      stateAfterRemoval = {
        ...stateAfterRemoval,
        shop: {
          ...stateAfterRemoval.shop,
          shopFloorSupportCatchmonIds: [
            ...stateAfterRemoval.shop.shopFloorSupportCatchmonIds,
            ownedCatchmonId,
          ],
        },
      };
    } else if (assignment.kind === "EXPEDITION") {
      if (!stateAfterRemoval.expeditions.expeditions[assignment.expeditionId]) {
        return err({
          code: "EXPEDITION_NOT_FOUND",
          message: `No active expedition "${assignment.expeditionId}"`,
        });
      }
    }

    const nextOwned: OwnedCatchmonState = {
      ...owned,
      currentAssignment: assignment,
    };
    const nextState: GameState = {
      ...stateAfterRemoval,
      catchmons: {
        ...stateAfterRemoval.catchmons,
        ownedCatchmons: {
          ...stateAfterRemoval.catchmons.ownedCatchmons,
          [ownedCatchmonId]: nextOwned,
        },
      },
    };

    return ok({
      nextState,
      events: [{ kind: "CATCHMON_ASSIGNED", ownedCatchmonId, assignment }],
    });
  };
}
