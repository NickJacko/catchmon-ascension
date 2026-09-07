/**
 * Design owner: Document 15 Phase 11 Task 11.5 — "104 Catchmons" with
 * "mixed 1/2/3-stage evolution lines." 30 single-stage + 25 two-stage + 8
 * three-stage lines = 63 lines / 104 species exactly (`manifest.ts`'s
 * counts). Every species/line/capability ID is generated, not hand-
 * authored — `catchmonContent.ts`'s real `buildLine` helper is
 * deliberately NOT reused here (it is tightly coupled to real canonical
 * evolution-chain reference data and throws on any unknown name).
 *
 * Only the 3 `CapabilityEffectFamily` values with a real evaluator
 * (`domain/catchmons/effects.ts`) are used — `CRAFT_SPEED_TARGETED`,
 * `RECOMMEND_COMPATIBILITY`, `DISCOVERY_BOOST` — cycled one per line, so
 * every capability in this fixture is exercised by real evaluator code,
 * not inert declared-but-unused content.
 */
import {
  type CapabilityDefinition,
  type CatchmonDomain,
  type CatchmonSpeciesDefinition,
  type EvolutionLineDefinition,
} from "../../domain/catchmons/index.ts";
import { AssetId } from "../../core/ids/index.ts";
import { SCALE_PLACEHOLDER_ASSET_ID } from "./assets.ts";
import {
  capabilityIdForIndex,
  elementForIndex,
  lineIdForIndex,
  pad,
  regionIdForIndex,
  SCALE_LINE_COUNT,
  SCALE_PRODUCT_FAMILIES,
  SCALE_REGION_COUNT,
  SCALE_SINGLE_STAGE_LINE_COUNT,
  SCALE_SPECIES_COUNT,
  SCALE_STATION_ARCHETYPES,
  SCALE_THREE_STAGE_LINE_COUNT,
  SCALE_TWO_STAGE_LINE_COUNT,
  speciesIdForIndex,
  SCALE_RARITIES,
} from "./manifest.ts";

const EFFECT_FAMILIES = [
  "CRAFT_SPEED_TARGETED",
  "RECOMMEND_COMPATIBILITY",
  "DISCOVERY_BOOST",
] as const;
const STRENGTH_CLASSES = ["CORE", "DEVELOPED", "SIGNATURE"] as const;
const DOMAINS: readonly CatchmonDomain[] = [
  "WORKSHOP",
  "SHOP_FLOOR",
  "SUPPLY",
  "EXPEDITION",
];

/** `magnitudeConfigRef` keys, one per effect family — reused across every capability of that family, exactly like the Vertical Slice's `PROVISIONAL_CAPABILITY_MAGNITUDES` reuses one key per craft-speed station. Illustrative-only values (Task 11.7: "use provisional slice balance," not new tuning). */
export const SCALE_CAPABILITY_MAGNITUDES: Readonly<Record<string, number>> = {
  "scale-craft-speed": 0.15,
  "scale-recommend-compatibility": 1,
  "scale-discovery-boost": 0.1,
};

interface LineStagePlan {
  readonly lineNumber: number;
  readonly stageCount: 1 | 2 | 3;
}

function buildLinePlan(): readonly LineStagePlan[] {
  const plan: LineStagePlan[] = [];
  let lineNumber = 0;
  for (let i = 0; i < SCALE_SINGLE_STAGE_LINE_COUNT; i += 1) {
    lineNumber += 1;
    plan.push({ lineNumber, stageCount: 1 });
  }
  for (let i = 0; i < SCALE_TWO_STAGE_LINE_COUNT; i += 1) {
    lineNumber += 1;
    plan.push({ lineNumber, stageCount: 2 });
  }
  for (let i = 0; i < SCALE_THREE_STAGE_LINE_COUNT; i += 1) {
    lineNumber += 1;
    plan.push({ lineNumber, stageCount: 3 });
  }
  return plan;
}

const LINE_PLAN = buildLinePlan();

export const SCALE_CAPABILITIES: readonly CapabilityDefinition[] =
  LINE_PLAN.map(({ lineNumber }): CapabilityDefinition => {
    const effectFamily =
      EFFECT_FAMILIES[(lineNumber - 1) % EFFECT_FAMILIES.length]!;
    const target =
      effectFamily === "CRAFT_SPEED_TARGETED"
        ? SCALE_STATION_ARCHETYPES[
            (lineNumber - 1) % SCALE_STATION_ARCHETYPES.length
          ]!
        : effectFamily === "RECOMMEND_COMPATIBILITY"
          ? SCALE_PRODUCT_FAMILIES[
              (lineNumber - 1) % SCALE_PRODUCT_FAMILIES.length
            ]!
          : "scale-fixture-expedition";
    const validDomain: CatchmonDomain =
      effectFamily === "CRAFT_SPEED_TARGETED"
        ? "WORKSHOP"
        : effectFamily === "RECOMMEND_COMPATIBILITY"
          ? "SHOP_FLOOR"
          : "EXPEDITION";
    const magnitudeConfigRef =
      effectFamily === "CRAFT_SPEED_TARGETED"
        ? "scale-craft-speed"
        : effectFamily === "RECOMMEND_COMPATIBILITY"
          ? "scale-recommend-compatibility"
          : "scale-discovery-boost";
    return {
      capabilityId: capabilityIdForIndex(lineNumber),
      displayName: `Scale Fixture Capability ${pad(lineNumber, 3)}`,
      strengthClass:
        STRENGTH_CLASSES[(lineNumber - 1) % STRENGTH_CLASSES.length]!,
      effectFamily,
      validDomain,
      target,
      magnitudeConfigRef,
      presentationTextKey: `scale-fixture-capability-${pad(lineNumber, 3)}`,
    };
  });

interface BuiltLine {
  readonly line: EvolutionLineDefinition;
  readonly species: readonly CatchmonSpeciesDefinition[];
}

let nextSpeciesNumber = 1;

const BUILT_LINES: readonly BuiltLine[] = LINE_PLAN.map(
  ({ lineNumber, stageCount }): BuiltLine => {
    const lineId = lineIdForIndex(lineNumber);
    const elementId = elementForIndex(lineNumber - 1);
    const homeRegionId = regionIdForIndex(
      ((lineNumber - 1) % SCALE_REGION_COUNT) + 1,
    );
    const capabilityId = capabilityIdForIndex(lineNumber);

    const speciesNumbers: number[] = [];
    for (let stage = 0; stage < stageCount; stage += 1) {
      speciesNumbers.push(nextSpeciesNumber);
      nextSpeciesNumber += 1;
    }

    const species: CatchmonSpeciesDefinition[] = speciesNumbers.map(
      (speciesNumber, stageIndex): CatchmonSpeciesDefinition => {
        const isLastStage = stageIndex === speciesNumbers.length - 1;
        const nextSpeciesNumberInLine = speciesNumbers[stageIndex + 1];
        return {
          catchmonSpeciesId: speciesIdForIndex(speciesNumber),
          catchmonLineId: lineId,
          displayName: `Scale Fixture Species ${pad(speciesNumber, 3)}`,
          stageIndex,
          rarity: SCALE_RARITIES[(speciesNumber - 1) % SCALE_RARITIES.length]!,
          elementId,
          capabilityIds: [capabilityId],
          ...(isLastStage
            ? {}
            : {
                evolvesToSpeciesId: speciesIdForIndex(nextSpeciesNumberInLine!),
              }),
          portraitAssetId: SCALE_PLACEHOLDER_ASSET_ID as AssetId,
        };
      },
    );

    const line: EvolutionLineDefinition = {
      catchmonLineId: lineId,
      displayName: `Scale Fixture Line ${pad(lineNumber, 3)}`,
      primaryDomain: DOMAINS[(lineNumber - 1) % DOMAINS.length]!,
      elementId,
      homeRegionId,
      specializationIdentity: `scale-fixture-specialization-${pad(lineNumber, 3)}`,
      synergyTags: [],
      speciesIds: species.map((s) => s.catchmonSpeciesId),
    };

    return { line, species };
  },
);

export const SCALE_CATCHMON_LINES: readonly EvolutionLineDefinition[] =
  BUILT_LINES.map((b) => b.line);
export const SCALE_CATCHMON_SPECIES: readonly CatchmonSpeciesDefinition[] =
  BUILT_LINES.flatMap((b) => b.species);

/**
 * Explicit, content-authored starter roster (never inferred from catalog
 * structure, per `game-state.ts`'s documented Task 06.2 fix) — a
 * deliberate MIX of 3 terminal single-stage species and 3 first-stage
 * species of a multi-stage line, so the scale harness can actually
 * exercise `EVOLVE_CATCHMON` (a single-stage starter has no evolution
 * target at all and would make that command path untestable).
 */
export const SCALE_STARTER_SPECIES_IDS = [
  ...SCALE_CATCHMON_SPECIES.filter(
    (s) => s.stageIndex === 0 && s.evolvesToSpeciesId === undefined,
  ).slice(0, 3),
  ...SCALE_CATCHMON_SPECIES.filter(
    (s) => s.stageIndex === 0 && s.evolvesToSpeciesId !== undefined,
  ).slice(0, 3),
].map((s) => s.catchmonSpeciesId);

if (SCALE_CATCHMON_SPECIES.length !== SCALE_SPECIES_COUNT) {
  throw new Error(
    `scale-fixture catchmons.ts generated ${String(SCALE_CATCHMON_SPECIES.length)} species, expected ${String(SCALE_SPECIES_COUNT)} — generator/manifest drifted apart.`,
  );
}
if (SCALE_CATCHMON_LINES.length !== SCALE_LINE_COUNT) {
  throw new Error(
    `scale-fixture catchmons.ts generated ${String(SCALE_CATCHMON_LINES.length)} lines, expected ${String(SCALE_LINE_COUNT)} — generator/manifest drifted apart.`,
  );
}
