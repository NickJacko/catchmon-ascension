/**
 * Design owner: Document 15 Task 05.9 (Evolution Shell); Document 06
 * §65-69; Document 14 §98 ("Evolution is an explicit command. It:
 * validates requirements, updates current species stage, preserves
 * line/XP progress as defined, emits evolution event, updates collection
 * state. It must be idempotent.").
 *
 * Idempotent by construction: once a Catchmon reaches a terminal stage
 * (no `evolvesToSpeciesId`), `checkEvolutionRequirement` returns
 * `NO_EVOLUTION_TARGET` for every subsequent call — repeating the command
 * after a successful evolution (or against a Catchmon that never had one)
 * fails cleanly rather than re-applying or corrupting state.
 *
 * "Preserves line/XP progress" (§65 "does not reset to level 1 by
 * default"): `level`/`xp` are carried over unchanged onto the new
 * species. "Updates collection state" (§69, "earlier stage remains
 * permanently recorded as discovered"): out of scope here — no Catchdex/
 * discovery-record system exists yet in this codebase to update (that is
 * Document 06 §123 Collection UI / a later task's concern); this command
 * only updates the owned instance's own `currentSpeciesId`.
 */
import { err, ok } from "../../../core/result/index.ts";
import { type OwnedCatchmonId } from "../../../core/ids/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import {
  checkEvolutionRequirement,
  computeEvolutionReadiness,
} from "../../../domain/catchmons/index.ts";
import {
  type GameState,
  type OwnedCatchmonState,
} from "../../../domain/game-state/index.ts";
import { invariant } from "../../../core/assertions/invariant.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type CatchmonEvent } from "./catchmon-events.ts";

export interface EvolveCatchmonPayload {
  readonly ownedCatchmonId: OwnedCatchmonId;
}

export function createEvolveCatchmonHandler(
  catalog: GameCatalog,
  levelRequirement: number,
): CommandHandler<GameState, EvolveCatchmonPayload, CatchmonEvent> {
  return (state, command) => {
    const { ownedCatchmonId } = command.payload;
    const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
    if (!owned) {
      return err({
        code: "CATCHMON_NOT_FOUND",
        message: `No owned Catchmon "${ownedCatchmonId}"`,
      });
    }

    const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
    const check = checkEvolutionRequirement(owned, species, levelRequirement);
    if (!check.ok) {
      return err({
        code: check.error,
        message: `Owned Catchmon "${ownedCatchmonId}" cannot evolve: ${check.error}`,
      });
    }

    invariant(
      species !== undefined && species.evolvesToSpeciesId !== undefined,
      "checkEvolutionRequirement already confirmed a species and its evolution target exist",
    );
    const targetSpeciesId = species.evolvesToSpeciesId;
    const targetSpecies = catalog.catchmonSpecies.get(targetSpeciesId);
    invariant(
      targetSpecies !== undefined,
      `Species "${species.catchmonSpeciesId}"'s evolvesToSpeciesId "${targetSpeciesId}" must reference a real species — should have been caught by createGameCatalog`,
    );

    const nextOwned: OwnedCatchmonState = {
      ...owned,
      currentSpeciesId: targetSpeciesId,
      evolutionReadiness: computeEvolutionReadiness(
        targetSpecies,
        owned.level,
        levelRequirement,
      ),
    };

    const nextState: GameState = {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [ownedCatchmonId]: nextOwned,
        },
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "CATCHMON_EVOLVED",
          ownedCatchmonId,
          fromSpeciesId: owned.currentSpeciesId,
          toSpeciesId: targetSpeciesId,
        },
      ],
    });
  };
}
