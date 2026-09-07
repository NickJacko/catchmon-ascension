/**
 * Design owner: Document 15 Task 05.2 (Slice Catchmon Selection Lock),
 * Task 05.4 (Typed Capability Effect Primitives), Task 05.9 (Evolution
 * Shell); 06 Catchmon Gameplay Integration §5-12 (Line-First Design, Four
 * Domains), §7 (Single-Stage Catchmon Rule), §13-43 (per-domain
 * capability families), §61-69 (Capability Tiers, Evolution). Updated
 * post-Phase-5 to integrate `reference/catchmons/evolution_lines.json`
 * (see `canonicalEvolutionLines.ts`/`catchmonReferenceAudit.ts`).
 *
 * PROVISIONAL SLICE ROLE CONFIGURATION — explicitly separate from
 * canonical identity (Document 15 Task 05.2: "gameplay role mapping can
 * be provisional slice configuration if the final 104 mapping is not yet
 * authored... it must be stored separately from canonical species
 * identity"). Domain, capability, and specialization for every species
 * below (including the added evolution-target companions) are slice-only
 * decisions made to exercise the engine, not a claim about real,
 * eventual canonical design. Canonical facts (real evolution line/stage,
 * or their absence) live in `catchmonReferenceAudit.ts`/
 * `canonicalEvolutionLines.ts` — this file only consumes them.
 *
 * REAL evolution chains (no longer single-stage placeholders) now that
 * `evolution_lines.json` resolves them:
 * - Flamarox  (Flaumi line, stage 1) -> Flameron  (stage 2, terminal)
 * - Emberynn  (Magmarock line, stage 1) -> Pyrocore  (stage 2, terminal)
 * - Aquilor   (Plipsy line, stage 1) -> Hydravian  (stage 2, terminal)
 * - Geckon    (Geckon line, stage 0) -> Reptorax (stage 1) -> Dracogold (stage 2, terminal)
 * - Hydroscythe (Driftoss line, stage 1) — terminal; predecessor
 *   "Driftoss" is not registered in this slice (no Supply Run/Discovery
 *   content calls for it yet — see `canonicalEvolutionLines.ts`'s
 *   `DRIFTOSS_LINE`)
 * - Aerorion  (Skyrion line, stage 1) — terminal; predecessor "Skyrion"
 *   has a real asset but is not registered (no forward evolution needs it)
 *
 * Companion stages (Flameron, Pyrocore, Hydravian, Reptorax, Dracogold)
 * are registered ONLY because they are real, necessary evolution targets
 * of a selected slice Catchmon — they are not independently "selected"
 * playable roster entries (`SELECTED_CATCHMON_SPECIES_IDS` stays exactly
 * the original 6; Document 06 §69: evolving changes which stage the
 * existing owned instance represents, it does not add a new roster slot).
 * Each reuses its predecessor's exact capability (Document 06 §63:
 * "Developed Capability deepens the line's role... should not replace the
 * core role with a different one") — no new capability content is
 * invented for them.
 *
 * Role/domain spread (all provisional):
 * - Flamarox/Flameron  — WORKSHOP  / Provision Station craft-speed specialist
 * - Geckon/Reptorax/Dracogold — WORKSHOP / Fieldworks Bench craft-speed specialist
 *   (two Workshop lines targeting different stations is the "one
 *   additional strategic contrast" Task 05.2 asks for)
 * - Emberynn/Pyrocore  — SHOP_FLOOR / Recommend-compatibility support (Elemental Craft)
 * - Aerorion  — SHOP_FLOOR / Demand-insight support (second Shop Floor
 *   contrast; left unassigned in the starting roster — see game-state.ts —
 *   to also demonstrate the Unassigned/Roaming state, Document 06 §47)
 * - Aquilor/Hydravian  — EXPEDITION / Discovery-boost support (consumed by
 *   Phase 6: `getExpeditionDiscoveryBoostEffect` resolves it at
 *   `START_EXPEDITION` time and snapshots it onto `ExpeditionState.
 *   leadDiscoveryBoostBonus`, then onto any Encounter Opportunity the
 *   expedition creates — see `expedition-reconciliation-pass.ts`)
 * - Hydroscythe — SUPPLY / Material-efficiency support (content-complete;
 *   no live Supply system exists yet — still Document 08 territory)
 *
 * "Varied visual sizes" still cannot be verified or claimed:
 * `evolution_lines.json` is purely a line/stage graph with no size data.
 * "At least two elements" (Task 05.2) IS now verifiable — Ozean Batch A's
 * approved Canonical Element Assignment resolves a real primary Element
 * for all 51 lines, including all 6 selected here (fire: Flamarox/
 * Emberynn; dragon: Geckon; wind: Aerorion; water: Aquilor/Hydroscythe —
 * already 4 distinct elements). Every `elementId` below is resolved via
 * `resolvePrimaryElementForSpecies` (never hand-typed), so this file can
 * never independently drift from that one canonical mapping.
 */
import {
  AssetId,
  CapabilityId,
  CatchmonLineId,
  CatchmonSpeciesId,
} from "../../core/ids/index.ts";
import { invariant } from "../../core/assertions/index.ts";
import { type AssetMetadata } from "../../domain/assets/index.ts";
import {
  type CapabilityDefinition,
  type CatchmonSpeciesDefinition,
  type EvolutionLineDefinition,
} from "../../domain/catchmons/index.ts";
import { type ElementId } from "../../domain/world/index.ts";
import { resolvePrimaryElementForSpecies } from "../canonical-catchmons/index.ts";
import { nextCanonicalStage } from "./canonicalEvolutionLines.ts";
import { CATCHMON_REFERENCE_AUDIT } from "./catchmonReferenceAudit.ts";
import { SLICE_RESOURCE_A_ID } from "./craftingContent.ts";

/** Same fail-fast narrowing idiom as `expeditionEncounterContent.ts`'s `resolveRequiredElement` — see that file's doc comment for why this can never legitimately be `undefined` for a real registered species. */
function resolveRequiredElement(speciesId: string): ElementId {
  const elementId = resolvePrimaryElementForSpecies(speciesId);
  invariant(
    elementId !== undefined,
    `No canonical primary Element resolved for "${speciesId}" — should be impossible for a real canonical species/line`,
  );
  return elementId;
}

function auditRecordFor(catchmonSpeciesId: string) {
  const record = CATCHMON_REFERENCE_AUDIT.find(
    (r) => r.catchmonSpeciesId === catchmonSpeciesId,
  );
  if (!record) {
    throw new Error(`No audit record for "${catchmonSpeciesId}"`);
  }
  return record;
}

/**
 * Evolution-target companion stages: real canonical species, verified to
 * exist as real assets in `reference/catchmons/`, registered only because
 * a selected slice Catchmon really evolves into them. Not part of the
 * selection audit (`catchmonReferenceAudit.ts`) since they are not
 * independently selected roster entries — see module doc.
 */
const COMPANION_SOURCE_FOLDERS: Readonly<Record<string, string>> = {
  Flameron: "Starter",
  Pyrocore: "Common",
  Hydravian: "Starter",
  Reptorax: "Starter",
  Dracogold: "Starter",
};

function companionPortraitAsset(speciesName: string): {
  readonly portraitAssetId: AssetId;
  readonly asset: AssetMetadata;
} {
  const sourceFolder = COMPANION_SOURCE_FOLDERS[speciesName];
  if (!sourceFolder) {
    throw new Error(
      `No known reference/catchmons/ source folder recorded for companion "${speciesName}"`,
    );
  }
  const assetId = AssetId.from(
    `catchmon-portrait-${speciesName.toLowerCase()}`,
  );
  return {
    portraitAssetId: assetId,
    asset: {
      assetId,
      category: "catchmon-portrait",
      sourcePath: `reference/catchmons/${sourceFolder}/${speciesName}.png`,
      runtimePath: `/assets/catchmons/${speciesName.toLowerCase()}.png`,
      status: "FINAL",
      version: 1,
      // Verified directly from each PNG's IHDR chunk (all five are
      // 1024x1024, same as the 6 selected species) — not assumed.
      width: 1024,
      height: 1024,
      format: "png",
      hasAlpha: true,
      semanticOwnerId: speciesName,
      tags: ["catchmon", "portrait", "evolution-target"],
      preloadClass: "ON_DEMAND",
    },
  };
}

export const FLAMAROX_CAPABILITY_ID: CapabilityId = CapabilityId.from(
  "flamarox-provision-craft-speed",
);
export const GECKON_CAPABILITY_ID: CapabilityId = CapabilityId.from(
  "geckon-fieldworks-craft-speed",
);
export const EMBERYNN_CAPABILITY_ID: CapabilityId = CapabilityId.from(
  "emberynn-recommend-compatibility",
);
export const AERORION_CAPABILITY_ID: CapabilityId = CapabilityId.from(
  "aerorion-demand-insight",
);
export const AQUILOR_CAPABILITY_ID: CapabilityId = CapabilityId.from(
  "aquilor-discovery-boost",
);
export const HYDROSCYTHE_CAPABILITY_ID: CapabilityId = CapabilityId.from(
  "hydroscythe-material-efficiency",
);

export const SLICE_CATCHMON_CAPABILITIES: readonly CapabilityDefinition[] = [
  {
    capabilityId: FLAMAROX_CAPABILITY_ID,
    displayName: "Provision Station Craft Speed (Provisional)",
    strengthClass: "CORE",
    effectFamily: "CRAFT_SPEED_TARGETED",
    validDomain: "WORKSHOP",
    target: "PROVISION_STATION",
    magnitudeConfigRef: "slice-craft-speed-provision-station",
    presentationTextKey: "slice.catchmon.flamarox.core",
  },
  {
    capabilityId: GECKON_CAPABILITY_ID,
    displayName: "Fieldworks Bench Craft Speed (Provisional)",
    strengthClass: "CORE",
    effectFamily: "CRAFT_SPEED_TARGETED",
    validDomain: "WORKSHOP",
    target: "FIELDWORKS_BENCH",
    magnitudeConfigRef: "slice-craft-speed-fieldworks-bench",
    presentationTextKey: "slice.catchmon.geckon.core",
  },
  {
    capabilityId: EMBERYNN_CAPABILITY_ID,
    displayName: "Elemental Craft Recommend Support (Provisional)",
    strengthClass: "CORE",
    effectFamily: "RECOMMEND_COMPATIBILITY",
    validDomain: "SHOP_FLOOR",
    target: "ELEMENTAL_CRAFT",
    magnitudeConfigRef: "slice-recommend-compatibility-elemental-craft",
    presentationTextKey: "slice.catchmon.emberynn.core",
  },
  {
    capabilityId: AERORION_CAPABILITY_ID,
    displayName: "Shop Floor Demand Insight (Provisional)",
    strengthClass: "CORE",
    effectFamily: "DEMAND_INSIGHT",
    validDomain: "SHOP_FLOOR",
    target: "shop-floor",
    magnitudeConfigRef: "slice-demand-insight",
    presentationTextKey: "slice.catchmon.aerorion.core",
  },
  {
    capabilityId: AQUILOR_CAPABILITY_ID,
    displayName: "Expedition Discovery Boost (Provisional)",
    strengthClass: "CORE",
    effectFamily: "DISCOVERY_BOOST",
    validDomain: "EXPEDITION",
    // Not a route reference: `evaluateDiscoveryBoostEffect` (Document 15
    // Task 05.4/06.4) never reads `target` — the boost applies to any
    // expedition the Lead is snapshotted onto, not a specific route. An
    // earlier draft (before real Phase 6 routes existed) placed a
    // placeholder `RouteId` string here; normalized to a plain descriptive
    // label instead, matching the AERORION_CAPABILITY_ID precedent above
    // (`target: "shop-floor"`) for effect families that don't consume
    // `target` as a real ID lookup.
    target: "expedition-discovery",
    magnitudeConfigRef: "slice-discovery-boost",
    presentationTextKey: "slice.catchmon.aquilor.core",
  },
  {
    capabilityId: HYDROSCYTHE_CAPABILITY_ID,
    displayName: "Routine Material Efficiency (Provisional)",
    strengthClass: "CORE",
    effectFamily: "MATERIAL_EFFICIENCY_TARGETED",
    validDomain: "SUPPLY",
    target: SLICE_RESOURCE_A_ID,
    magnitudeConfigRef: "slice-material-efficiency",
    presentationTextKey: "slice.catchmon.hydroscythe.core",
  },
];

interface BuiltLine {
  readonly line: EvolutionLineDefinition;
  readonly species: readonly CatchmonSpeciesDefinition[];
  readonly companionAssets: readonly AssetMetadata[];
  /** The slice-selected species' own definition (a member of `species`). */
  readonly selectedSpecies: CatchmonSpeciesDefinition;
}

/**
 * Builds one real evolution line starting from a slice-selected species:
 * the selected species itself, plus every real further stage
 * (`evolution_lines.json`, via `nextCanonicalStage`) as newly-registered
 * companion species — each reusing the SAME capability (Document 06 §63).
 * A species with no further stage (Hydroscythe, Aerorion) yields a
 * single-member line, same as the pre-integration shape.
 */
function buildLine(
  selectedSpeciesId: string,
  primaryDomain: EvolutionLineDefinition["primaryDomain"],
  specializationIdentity: string,
  synergyTags: readonly string[],
  capabilityId: CapabilityId,
): BuiltLine {
  const audit = auditRecordFor(selectedSpeciesId);
  const catchmonLineId = CatchmonLineId.from(
    `${audit.canonicalLineKey.toLowerCase()}-line`,
  );

  const species: CatchmonSpeciesDefinition[] = [];
  const companionAssets: AssetMetadata[] = [];

  const lineElementId = resolveRequiredElement(selectedSpeciesId);

  const selectedSpecies: CatchmonSpeciesDefinition = {
    catchmonSpeciesId: CatchmonSpeciesId.from(selectedSpeciesId),
    catchmonLineId,
    displayName: selectedSpeciesId,
    stageIndex: audit.canonicalStageIndex,
    ...(audit.rarity ? { rarity: audit.rarity } : {}),
    elementId: lineElementId,
    capabilityIds: [capabilityId],
    portraitAssetId: audit.portraitAssetId,
  };
  species.push(selectedSpecies);

  // Walk forward through the real canonical chain (Geckon's line needs 2
  // hops: Geckon -> Reptorax -> Dracogold). `precedingIndex` is the array
  // index of the stage that needs its `evolvesToSpeciesId` filled in once
  // the next stage is built, so each stage is only ever written once.
  let precedingIndex = 0;
  let nextStage = nextCanonicalStage(selectedSpeciesId);
  while (nextStage) {
    const { portraitAssetId, asset } = companionPortraitAsset(
      nextStage.speciesName,
    );
    companionAssets.push(asset);
    const companion: CatchmonSpeciesDefinition = {
      catchmonSpeciesId: CatchmonSpeciesId.from(nextStage.speciesName),
      catchmonLineId,
      displayName: nextStage.speciesName,
      stageIndex: nextStage.stageIndex,
      // Evolution lines are element-stable (Canonical Element Assignment
      // task) — a companion stage shares its line's one resolved element,
      // not a separately re-resolved value.
      elementId: lineElementId,
      capabilityIds: [capabilityId],
      portraitAssetId,
      // rarity: not audited for companion stages — Document 06 §75-76 "no
      // rarity power ladder" means the omission has no gameplay effect;
      // adding it would require the same folder-mapping discipline the
      // selection audit uses, which is out of this integration's scope
      // for non-selected stages.
    };
    species.push(companion);
    species[precedingIndex] = {
      ...species[precedingIndex]!,
      evolvesToSpeciesId: companion.catchmonSpeciesId,
    };
    precedingIndex = species.length - 1;
    nextStage = nextCanonicalStage(nextStage.speciesName);
  }

  return {
    line: {
      catchmonLineId,
      displayName: `${audit.canonicalLineKey} Line`,
      primaryDomain,
      specializationIdentity,
      synergyTags,
      speciesIds: species.map((s) => s.catchmonSpeciesId),
      elementId: lineElementId,
    },
    species,
    companionAssets,
    selectedSpecies: species[0]!,
  };
}

const flamarox = buildLine(
  "Flamarox",
  "WORKSHOP",
  "Provision Station Specialist (Provisional)",
  ["slice-workshop"],
  FLAMAROX_CAPABILITY_ID,
);
const geckon = buildLine(
  "Geckon",
  "WORKSHOP",
  "Fieldworks Bench Specialist (Provisional)",
  ["slice-workshop"],
  GECKON_CAPABILITY_ID,
);
const emberynn = buildLine(
  "Emberynn",
  "SHOP_FLOOR",
  "Recommend Support Specialist (Provisional)",
  ["slice-shop-floor"],
  EMBERYNN_CAPABILITY_ID,
);
const aerorion = buildLine(
  "Aerorion",
  "SHOP_FLOOR",
  "Demand Insight Specialist (Provisional)",
  ["slice-shop-floor"],
  AERORION_CAPABILITY_ID,
);
const aquilor = buildLine(
  "Aquilor",
  "EXPEDITION",
  "Discovery Specialist (Provisional)",
  ["slice-expedition"],
  AQUILOR_CAPABILITY_ID,
);
const hydroscythe = buildLine(
  "Hydroscythe",
  "SUPPLY",
  "Material Efficiency Specialist (Provisional)",
  ["slice-supply"],
  HYDROSCYTHE_CAPABILITY_ID,
);

const ALL_BUILT_LINES: readonly BuiltLine[] = [
  flamarox,
  geckon,
  emberynn,
  aerorion,
  aquilor,
  hydroscythe,
];

export const SLICE_CATCHMON_LINES: readonly EvolutionLineDefinition[] =
  ALL_BUILT_LINES.map((built) => built.line);

export const SLICE_CATCHMON_SPECIES: readonly CatchmonSpeciesDefinition[] =
  ALL_BUILT_LINES.flatMap((built) => built.species);

/** Evolution-target companion portraits — merge into the catalog's asset list alongside `CATCHMON_PORTRAIT_ASSETS`. */
export const CATCHMON_EVOLUTION_TARGET_ASSETS: readonly AssetMetadata[] =
  ALL_BUILT_LINES.flatMap((built) => built.companionAssets);

export const FLAMAROX_SPECIES_ID = flamarox.selectedSpecies.catchmonSpeciesId;
export const GECKON_SPECIES_ID = geckon.selectedSpecies.catchmonSpeciesId;
export const EMBERYNN_SPECIES_ID = emberynn.selectedSpecies.catchmonSpeciesId;
export const AERORION_SPECIES_ID = aerorion.selectedSpecies.catchmonSpeciesId;
export const AQUILOR_SPECIES_ID = aquilor.selectedSpecies.catchmonSpeciesId;
export const HYDROSCYTHE_SPECIES_ID =
  hydroscythe.selectedSpecies.catchmonSpeciesId;

export const FLAMERON_SPECIES_ID = CatchmonSpeciesId.from("Flameron");
export const PYROCORE_SPECIES_ID = CatchmonSpeciesId.from("Pyrocore");
export const HYDRAVIAN_SPECIES_ID = CatchmonSpeciesId.from("Hydravian");
export const REPTORAX_SPECIES_ID = CatchmonSpeciesId.from("Reptorax");
export const DRACOGOLD_SPECIES_ID = CatchmonSpeciesId.from("Dracogold");

/**
 * Ozean Batch A: the two already-integrated Water-element lines' real
 * `CatchmonLineId`s, for `worldContent.ts`'s `OZEAN_REGION.
 * homeCatchmonLineIds` — re-exported rather than re-derived, so that file
 * never needs to reconstruct `buildLine`'s `"<lineKey>-line"` naming
 * convention itself (Single Source of Truth, CLAUDE.md §14).
 */
export const AQUILOR_LINE_ID = aquilor.line.catchmonLineId;
export const HYDROSCYTHE_LINE_ID = hydroscythe.line.catchmonLineId;
