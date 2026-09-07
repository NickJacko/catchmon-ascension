/**
 * Design owner: docs/rebuild/06_CATCHMON_COLLECTION_BOND_AND_EVOLUTION.md
 * §8 Bond Support Design; docs/rebuild/15 Phase R5.
 *
 * Maps each of the six existing vertical-slice evolution lines (already
 * canonical — see `content/vertical-slice/catchmonContent.ts`) to a
 * distinct Bond Support behavior, each targeting a different `CombatStats`
 * field (`domain/catchmons/support-behavior.ts`) — reusing the already-
 * proven 11-species/6-line roster rather than authoring a new one (docs/
 * rebuild/R1_DEPENDENCY_AUDIT.md §1.8: "Doc 15's '8-12 real Catchmons'
 * target... can reuse the same content-authoring pattern already proven
 * here"). Keyed by line ID (not species ID) — Document 06 §8 "each line
 * should eventually receive one meaningful support identity," and a line's
 * identity should not change across its own evolution stages.
 */
import { type CatchmonLineId } from "../../core/ids/index.ts";
import { type BondSupportBehaviorId } from "../../domain/catchmons/index.ts";
import {
  AERORION_SPECIES_ID,
  AQUILOR_SPECIES_ID,
  EMBERYNN_SPECIES_ID,
  FLAMAROX_SPECIES_ID,
  GECKON_SPECIES_ID,
  HYDROSCYTHE_SPECIES_ID,
  SLICE_CATCHMON_SPECIES,
} from "../vertical-slice/catchmonContent.ts";

function lineIdForSpecies(speciesId: string): CatchmonLineId {
  const species = SLICE_CATCHMON_SPECIES.find(
    (s) => s.catchmonSpeciesId === speciesId,
  );
  if (!species) {
    throw new Error(
      `No vertical-slice species registered for "${speciesId}" — cannot resolve its line for Bond Support behavior mapping`,
    );
  }
  return species.catchmonLineId;
}

export const COMBAT_SLICE_BOND_SUPPORT_BEHAVIORS: Readonly<
  Record<CatchmonLineId, BondSupportBehaviorId>
> = {
  [lineIdForSpecies(FLAMAROX_SPECIES_ID)]: "ASSIST_STRIKE",
  [lineIdForSpecies(GECKON_SPECIES_ID)]: "COUNTER_TRIGGER",
  [lineIdForSpecies(EMBERYNN_SPECIES_ID)]: "CRIT_MARK",
  [lineIdForSpecies(AERORION_SPECIES_ID)]: "ELEMENTAL_PRIMER",
  [lineIdForSpecies(AQUILOR_SPECIES_ID)]: "ECHO_GENERATION",
  [lineIdForSpecies(HYDROSCYTHE_SPECIES_ID)]: "BARRIER",
};
