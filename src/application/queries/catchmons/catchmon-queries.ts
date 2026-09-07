/**
 * Design owner: Document 15 Task 05.5 (Catchmon Assignment Engine); 06
 * Catchmon Gameplay Integration §44 Functional Assignments, §49
 * Functional Capacity.
 */
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type CatchmonDomain } from "../../../domain/catchmons/index.ts";
import { type CatchmonSpeciesId } from "../../../core/ids/index.ts";

/** The set of domains this species' capabilities make it eligible for (Document 06 §44). */
export function getEligibleDomains(
  catalog: GameCatalog,
  catchmonSpeciesId: CatchmonSpeciesId,
): ReadonlySet<CatchmonDomain> {
  const species = catalog.catchmonSpecies.get(catchmonSpeciesId);
  const domains = new Set<CatchmonDomain>();
  if (!species) return domains;
  for (const capabilityId of species.capabilityIds) {
    const capability = catalog.capabilities.get(capabilityId);
    if (capability) domains.add(capability.validDomain);
  }
  return domains;
}

export function isEligibleForDomain(
  catalog: GameCatalog,
  catchmonSpeciesId: CatchmonSpeciesId,
  domain: CatchmonDomain,
): boolean {
  return getEligibleDomains(catalog, catchmonSpeciesId).has(domain);
}
