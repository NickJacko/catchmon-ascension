/**
 * Design owner: Document 15 Task 05.9 (Evolution Shell); Document 06
 * §65-69 (Evolution Core Rule, No Evolution Reset Loop, Evolution
 * Requirements, Evolution Identity, Evolution and Collection Record);
 * Document 14 §98 ("Evolution is an explicit command... must be
 * idempotent").
 *
 * Originally architecture/tests only: at Task 05.9, none of the 6 real
 * selected Catchmons had a real `evolvesToSpeciesId` (no canonical
 * evolution relationship was known for any of them). The later canonical
 * evolution-reference integration (`reference/catchmons/evolution_lines
 * .json`, see `canonicalEvolutionLines.ts`) resolved real multi-stage
 * chains for 4 of the 6 (Flamarox, Emberynn, Aquilor, Geckon) — this
 * module's logic is unchanged by that; it was already correct for real
 * multi-stage content, only its test fixtures needed to stay synthetic
 * where real data still doesn't exist (Hydroscythe/Aerorion are
 * confirmed genuinely terminal, not unresolved).
 */
import { err, ok, type Result } from "../../core/result/index.ts";
import {
  type EvolutionReadiness,
  type OwnedCatchmonState,
} from "../game-state/index.ts";
import { type CatchmonSpeciesDefinition } from "./types.ts";

export type EvolutionBlockedReason =
  "SPECIES_NOT_FOUND" | "NO_EVOLUTION_TARGET" | "LEVEL_REQUIREMENT_NOT_MET";

/**
 * Document 06 §67: "exact evolution requirements remain open... potential
 * requirement classes include: Catchmon Level milestone." Only the Level-
 * milestone class is implemented (the one requirement class Task 05.8
 * already gives this codebase real data for) — shop/world progression,
 * element-specific materials, discovery conditions, and signature items
 * are all real Document 06 possibilities that are not implemented, since
 * no read document specifies which applies to which line.
 */
export function checkEvolutionRequirement(
  owned: OwnedCatchmonState,
  species: CatchmonSpeciesDefinition | undefined,
  levelRequirement: number,
): Result<true, EvolutionBlockedReason> {
  if (!species) return err("SPECIES_NOT_FOUND");
  if (species.evolvesToSpeciesId === undefined)
    return err("NO_EVOLUTION_TARGET");
  if (owned.level < levelRequirement) return err("LEVEL_REQUIREMENT_NOT_MET");
  return ok(true);
}

/**
 * A species with no further `evolvesToSpeciesId` is a terminal stage —
 * `EVOLVED` here means "fully evolved, nothing further to reach", not
 * merely "has evolved once". Used both to seed a freshly-owned Catchmon's
 * initial readiness and to recompute it right after an evolution
 * succeeds, for the *new* current species.
 */
export function computeEvolutionReadiness(
  species: CatchmonSpeciesDefinition | undefined,
  ownedLevel: number,
  levelRequirement: number,
): EvolutionReadiness {
  if (!species || species.evolvesToSpeciesId === undefined) return "EVOLVED";
  return ownedLevel >= levelRequirement ? "READY" : "NOT_READY";
}
