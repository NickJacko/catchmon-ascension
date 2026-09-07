/**
 * Design owner: Document 15 Task 06.2 (Route Definitions)/Task 06.8
 * (Encounter Creation); Document 07 §63 Standard Acquisition Unit
 * ("the entry species of an evolution line"), §65 Single-Stage
 * Catchmons; Document 06 §7 Single-Stage Catchmon Rule. Extended by
 * Ozean Batch A (Aqualume -> Nairowisp, the Ozean Reef Survey route's new
 * capture).
 *
 * Aquaril/Aqualume are NEW capturable lines their respective Discovery
 * Survey routes (`worldContent.ts`) can produce — none of the 6
 * originally-selected slice Catchmons (Task 05.2) can serve this role:
 * all 6 are already owned from game start (Task 05.3), so encountering
 * any of them could only ever exercise the "already-owned encounter" path
 * (Document 07 §89), never a genuine new capture. Both are verified real
 * (genuine lines per `evolution_lines.json`/`canonicalEvolutionLines.ts`,
 * real assets in `reference/catchmons/Common/`) and were never
 * captured/seeded as owned, so Task 06.11's "owned Catchmon creation on
 * success" has something genuine to prove for each region.
 *
 * NO GAMEPLAY ROLE ASSIGNED: unlike the 6 selected Catchmons
 * (`catchmonContent.ts`), Aquaril/Aqualume/Nairowisp get `capabilityIds:
 * []` — deliberately no capability. Document 15 Task 05.2's roster
 * role-assignment work was scoped to the 6 originally-selected Catchmons;
 * extending shop-role design to every capturable wild species is out of
 * this phase's scope (that is a later roster-mapping task, Document 06
 * §104-116's "Full-Roster Mapping Workflow"). `primaryDomain` is still a
 * required schema field on `EvolutionLineDefinition`, so a placeholder
 * domain is set — it has zero functional effect with no capability to
 * back it.
 *
 * ELEMENT (Ozean Batch A): unlike when this file was first written,
 * `elementId` is no longer unresolvable — the approved Canonical Element
 * Assignment (`content/canonical-catchmons/`) now gives every one of the
 * 51 real evolution lines, including Aquaril's and Aqualume's, a real
 * primary Element. Both are resolved here via `resolvePrimaryElementForSpecies`
 * (never hand-typed) so this file can never independently drift from that
 * one canonical mapping. Rarity still follows the audit discipline from
 * `catchmonReferenceAudit.ts`: resolved mechanically from the real source
 * folder (`Common` -> `COMMON`).
 */
import {
  AssetId,
  CatchmonLineId,
  CatchmonSpeciesId,
} from "../../core/ids/index.ts";
import { invariant } from "../../core/assertions/index.ts";
import { type AssetMetadata } from "../../domain/assets/index.ts";
import {
  type CatchmonSpeciesDefinition,
  type EvolutionLineDefinition,
} from "../../domain/catchmons/index.ts";
import { type ElementId } from "../../domain/world/index.ts";
import { resolvePrimaryElementForSpecies } from "../canonical-catchmons/index.ts";
import { nextCanonicalStage } from "./canonicalEvolutionLines.ts";

/**
 * Narrows `resolvePrimaryElementForSpecies`'s `ElementId | undefined` to a
 * required `ElementId` for real canonical species this file registers —
 * fails fast rather than silently writing `elementId: undefined` (which
 * `exactOptionalPropertyTypes` would reject as a type error anyway) if the
 * canonical Element mapping is ever missing an entry it should always have.
 */
function resolveRequiredElement(speciesId: CatchmonSpeciesId): ElementId {
  const elementId = resolvePrimaryElementForSpecies(speciesId);
  invariant(
    elementId !== undefined,
    `No canonical primary Element resolved for "${speciesId}" — should be impossible for a real canonical species/line`,
  );
  return elementId;
}

export const AQUARIL_SPECIES_ID: CatchmonSpeciesId =
  CatchmonSpeciesId.from("Aquaril");
export const AQUARIL_LINE_ID: CatchmonLineId =
  CatchmonLineId.from("aquaril-line");

const AQUARIL_PORTRAIT_ASSET_ID: AssetId = AssetId.from(
  "catchmon-portrait-aquaril",
);

export const AQUARIL_PORTRAIT_ASSET: AssetMetadata = {
  assetId: AQUARIL_PORTRAIT_ASSET_ID,
  category: "catchmon-portrait",
  sourcePath: "reference/catchmons/Common/Aquaril.png",
  runtimePath: "/assets/catchmons/aquaril.png",
  status: "FINAL",
  version: 1,
  // Verified directly from the PNG's IHDR chunk (1024x1024, same as every
  // other registered species portrait) — not assumed.
  width: 1024,
  height: 1024,
  format: "png",
  hasAlpha: true,
  semanticOwnerId: AQUARIL_SPECIES_ID,
  tags: ["catchmon", "portrait", "wild-encounter"],
  preloadClass: "ON_DEMAND",
};

export const AQUARIL_LINE: EvolutionLineDefinition = {
  catchmonLineId: AQUARIL_LINE_ID,
  displayName: "Aquaril Line",
  // Placeholder only — see module doc "NO GAMEPLAY ROLE ASSIGNED".
  primaryDomain: "SUPPLY",
  specializationIdentity: "slice-provisional-unassigned-wild-species",
  synergyTags: [],
  speciesIds: [AQUARIL_SPECIES_ID],
  elementId: resolveRequiredElement(AQUARIL_SPECIES_ID),
};

export const AQUARIL_SPECIES: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: AQUARIL_SPECIES_ID,
  catchmonLineId: AQUARIL_LINE_ID,
  displayName: AQUARIL_SPECIES_ID,
  stageIndex: 0,
  rarity: "COMMON",
  elementId: resolveRequiredElement(AQUARIL_SPECIES_ID),
  capabilityIds: [],
  portraitAssetId: AQUARIL_PORTRAIT_ASSET_ID,
  // evolvesToSpeciesId intentionally absent: verified terminal via
  // nextCanonicalStage below, not hardcoded.
};

// Structural self-check, not a test: fail fast at module load if this
// content ever drifts from the canonical evolution-line data (Task 06.2
// instruction: "do not hardcode new evolution chains inside expedition/
// capture modules" — the actual chain data lives only in
// `canonicalEvolutionLines.ts`; this just asserts consistency with it).
if (nextCanonicalStage(AQUARIL_SPECIES_ID) !== undefined) {
  throw new Error(
    "Aquaril is expected to be a terminal, single-stage line per canonicalEvolutionLines.ts",
  );
}

// ---------------------------------------------------------------------
// Ozean Batch A: Aqualume -> Nairowisp, the Ozean Reef Survey route's new
// capturable line. Two-stage (unlike Aquaril's single stage) — only
// Aqualume (stage 0) is ever offered as an encounter target
// (`worldContent.ts`'s `OZEAN_REEF_SURVEY_ROUTE.encounterPool`); Nairowisp
// is reachable only by evolving an owned Aqualume, exactly like every
// other companion stage in this codebase.
// ---------------------------------------------------------------------

export const AQUALUME_SPECIES_ID: CatchmonSpeciesId =
  CatchmonSpeciesId.from("Aqualume");
export const NAIROWISP_SPECIES_ID: CatchmonSpeciesId =
  CatchmonSpeciesId.from("Nairowisp");
export const AQUALUME_LINE_ID: CatchmonLineId =
  CatchmonLineId.from("aqualume-line");

const AQUALUME_PORTRAIT_ASSET_ID: AssetId = AssetId.from(
  "catchmon-portrait-aqualume",
);
const NAIROWISP_PORTRAIT_ASSET_ID: AssetId = AssetId.from(
  "catchmon-portrait-nairowisp",
);

export const AQUALUME_PORTRAIT_ASSET: AssetMetadata = {
  assetId: AQUALUME_PORTRAIT_ASSET_ID,
  category: "catchmon-portrait",
  sourcePath: "reference/catchmons/Common/Aqualume.png",
  runtimePath: "/assets/catchmons/aqualume.png",
  status: "FINAL",
  version: 1,
  width: 1024,
  height: 1024,
  format: "png",
  hasAlpha: true,
  semanticOwnerId: AQUALUME_SPECIES_ID,
  tags: ["catchmon", "portrait", "wild-encounter"],
  preloadClass: "ON_DEMAND",
};

export const NAIROWISP_PORTRAIT_ASSET: AssetMetadata = {
  assetId: NAIROWISP_PORTRAIT_ASSET_ID,
  category: "catchmon-portrait",
  sourcePath: "reference/catchmons/Common/Nairowisp.png",
  runtimePath: "/assets/catchmons/nairowisp.png",
  status: "FINAL",
  version: 1,
  width: 1024,
  height: 1024,
  format: "png",
  hasAlpha: true,
  semanticOwnerId: NAIROWISP_SPECIES_ID,
  tags: ["catchmon", "portrait", "evolution-target"],
  preloadClass: "ON_DEMAND",
};

export const AQUALUME_PORTRAIT_ASSETS: readonly AssetMetadata[] = [
  AQUALUME_PORTRAIT_ASSET,
  NAIROWISP_PORTRAIT_ASSET,
];

export const AQUALUME_LINE: EvolutionLineDefinition = {
  catchmonLineId: AQUALUME_LINE_ID,
  displayName: "Aqualume Line",
  // Placeholder only — see module doc "NO GAMEPLAY ROLE ASSIGNED".
  primaryDomain: "SUPPLY",
  specializationIdentity: "slice-provisional-unassigned-wild-species",
  synergyTags: [],
  speciesIds: [AQUALUME_SPECIES_ID, NAIROWISP_SPECIES_ID],
  elementId: resolveRequiredElement(AQUALUME_SPECIES_ID),
};

export const AQUALUME_SPECIES: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: AQUALUME_SPECIES_ID,
  catchmonLineId: AQUALUME_LINE_ID,
  displayName: AQUALUME_SPECIES_ID,
  stageIndex: 0,
  rarity: "COMMON",
  elementId: resolveRequiredElement(AQUALUME_SPECIES_ID),
  capabilityIds: [],
  evolvesToSpeciesId: NAIROWISP_SPECIES_ID,
  portraitAssetId: AQUALUME_PORTRAIT_ASSET_ID,
};

export const NAIROWISP_SPECIES: CatchmonSpeciesDefinition = {
  catchmonSpeciesId: NAIROWISP_SPECIES_ID,
  catchmonLineId: AQUALUME_LINE_ID,
  displayName: NAIROWISP_SPECIES_ID,
  stageIndex: 1,
  elementId: resolveRequiredElement(NAIROWISP_SPECIES_ID),
  capabilityIds: [],
  portraitAssetId: NAIROWISP_PORTRAIT_ASSET_ID,
  // evolvesToSpeciesId intentionally absent: verified terminal below.
};

export const AQUALUME_LINE_SPECIES: readonly CatchmonSpeciesDefinition[] = [
  AQUALUME_SPECIES,
  NAIROWISP_SPECIES,
];

// Structural self-check, mirroring Aquaril's above.
if (nextCanonicalStage(AQUALUME_SPECIES_ID)?.speciesName !== "Nairowisp") {
  throw new Error(
    "Aqualume is expected to evolve into Nairowisp per canonicalEvolutionLines.ts",
  );
}
if (nextCanonicalStage(NAIROWISP_SPECIES_ID) !== undefined) {
  throw new Error(
    "Nairowisp is expected to be Aqualume's terminal stage per canonicalEvolutionLines.ts",
  );
}
