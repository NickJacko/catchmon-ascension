/**
 * Design owner: Document 15 Task 06.1 (Region Definitions), Task 06.2
 * (Route Definitions); Document 07 §13 Route Architecture, §15 Route
 * Access vs. Preference, §161 Minimum Expedition Prototype; Document 10
 * §1 Canonical Region/Element Identity. Extended by Ozean Batch A
 * (Document 09 §50-54 Region Progression Model, §106 World Readiness;
 * Document 10 §23-29 Water/Ozean identity).
 *
 * REGION IDs: `START_REGION_ID`/`PREVIEW_REGION_ID` are defined in
 * `verticalSliceManifest.ts` (the single reserved-ID source for the
 * slice) and just re-exported here for convenience — see that file's own
 * doc comment for the Document 10 §1 canonical-ID correction
 * (`"vulkankrater"` -> `grasland`) this task made.
 *
 * ELEMENT BOUNDARY: a region's `elementId` (Fire for Vulkankrater/
 * `grasland`, Water for Ozean) is REGION identity, resolved directly from
 * Document 10 §1's canonical table — always was, unchanged here. What HAS
 * changed (Ozean Batch A): Catchmon SPECIES element is no longer
 * unresolved (see the approved Canonical Element Assignment,
 * `content/canonical-catchmons/`), so `homeCatchmonLineIds` can now
 * honestly list the lines that are BOTH genuinely integrated into this
 * slice's catalog AND canonically Water — Aquilor/Hydravian's line
 * (Plipsy), Hydroscythe's line (Driftoss), Aquaril's line, and Aqualume's
 * line. This is deliberately NOT "every canonical Water line" (Koivya,
 * Glissalune, Abyssirex remain unintegrated — see
 * `expeditionEncounterContent.ts`) and NOT a claim that these species may
 * only ever appear in Ozean (primary Element identity and region-home
 * membership are kept as two distinct facts, per the Ozean Batch A
 * instruction).
 *
 * Everything else on `RegionDefinition` (economicIdentityId,
 * resourceProfileId, customerDemandProfileId, expeditionProfileId,
 * regionalHookId, visualThemeId, progressionBand) is an inert content-
 * identity reference string, not consumed by any Phase 6 mechanic —
 * populated with clearly-labeled provisional placeholders rather than
 * left as a type error, per CLAUDE.md §13's "temporary value must be
 * visible as PROVISIONAL". `RegionDefinition.routeIds` is left empty on
 * BOTH regions (matching Vulkankrater's own pre-existing convention even
 * though it has 3 real routes) — it is validated-if-present but not
 * otherwise consumed; the real route/region relationship is each
 * `RouteDefinition.regionId` field.
 */
import { AssetId, RouteId, UnlockRuleId } from "../../core/ids/index.ts";
import {
  type RegionDefinition,
  type RouteDefinition,
} from "../../domain/world/index.ts";
import { type UnlockRuleDefinition } from "../../domain/progression/index.ts";
import { REGION_COMPLETED_MILESTONE } from "../../domain/journey/index.ts";
import {
  PROVISIONAL_COMPONENT_HUNT_DURATION_MS,
  PROVISIONAL_DISCOVERY_SURVEY_DURATION_MS,
  PROVISIONAL_SUPPLY_RUN_DURATION_MS,
} from "./balance.ts";
// docs/rebuild/15 Phase R6: Ozean's Global/Journey-readiness threshold now
// reads Ascension's own Journey Rank curve, not Shop's
// `PROVISIONAL_UNLOCK_THRESHOLD_OZEAN_REGION` (still defined in this
// file's own `balance.ts` for Shop's now-unrelated content, unused here).
import { PROVISIONAL_JOURNEY_RANK_THRESHOLD_OZEAN } from "../combat-slice/balance.ts";
import {
  OZEAN_COMPONENT_LUMINOUS_PEARL_ID,
  SLICE_COMPONENT_A_ID,
  SLICE_PLACEHOLDER_ITEM_ASSET_ID,
} from "./craftingContent.ts";
import {
  AQUILOR_LINE_ID,
  AQUILOR_SPECIES_ID,
  GECKON_SPECIES_ID,
  HYDROSCYTHE_LINE_ID,
} from "./catchmonContent.ts";
import {
  AQUALUME_LINE_ID,
  AQUALUME_SPECIES_ID,
  AQUARIL_LINE_ID,
  AQUARIL_SPECIES_ID,
} from "./expeditionEncounterContent.ts";
import { PREVIEW_REGION_ID, START_REGION_ID } from "./verticalSliceManifest.ts";

/**
 * Route IDs, declared before the unlock rules/regions below because
 * Ozean's real unlock rule references `DISCOVERY_SURVEY_ROUTE_ID` as its
 * World Readiness `EXPEDITION_MILESTONE` subject — full `RouteDefinition`
 * content (which also needs the regions/rules to exist first, for
 * `regionId` cross-references) follows further down this file.
 */
export const SUPPLY_RUN_ROUTE_ID: RouteId = RouteId.from(
  "slice-vulkankrater-supply-run",
);
export const DISCOVERY_SURVEY_ROUTE_ID: RouteId = RouteId.from(
  "slice-vulkankrater-discovery-survey",
);
export const COMPONENT_HUNT_ROUTE_ID: RouteId = RouteId.from(
  "slice-vulkankrater-component-hunt",
);
export const OZEAN_TIDAL_SHALLOWS_ROUTE_ID: RouteId = RouteId.from(
  "ozean-tidal-shallows",
);
export const OZEAN_REEF_SURVEY_ROUTE_ID: RouteId =
  RouteId.from("ozean-reef-survey");
export const OZEAN_TIDEPOOL_HUNT_ROUTE_ID: RouteId = RouteId.from(
  "ozean-tidepool-hunt",
);

/**
 * PROVISIONAL, migrated docs/rebuild/15 Phase R6 (docs/rebuild/
 * R1_DEPENDENCY_AUDIT.md §7.2's locked target: "global/Journey readiness +
 * prior-region milestone → region unlock"). This rule exists so
 * `RegionDefinition.unlockRuleId` has a real, cross-reference-valid
 * target; Vulkankrater is actually unlocked from game start (`JOURNEY_RANK
 * >= 1` is trivially true from a fresh game) — this is real evaluated
 * content, not a bypass (see `createInitialGameState`'s
 * `buildInitialUnlockedRegionIds`). No longer references `SHOP_RANK` —
 * Ascension world progression does not depend on Shop Rank (see
 * `OZEAN_UNLOCK_RULE_ID` below for the same migration on Ozean's own,
 * previously two-signal-SHOP_RANK, rule).
 */
export const SLICE_ALWAYS_UNLOCKED_RULE_ID: UnlockRuleId = UnlockRuleId.from(
  "slice-always-unlocked",
);

/**
 * Ozean's real two-signal unlock rule, migrated docs/rebuild/15 Phase R6
 * off Shop Rank entirely (Document 09 §54 Region Progression Model —
 * "GLOBAL READINESS + WORLD READINESS", re-targeted at Ascension's own
 * Journey progression per docs/rebuild/08 §3):
 * - Global/Journey readiness: a Journey Rank threshold, evaluated
 *   generically via `JOURNEY_RANK` against `state.progression.journeyRank`
 *   (`unlock-evaluator.ts`) — fed only by real Journey milestones
 *   (`ATTEMPT_STAGE`'s stage/boss wins), never by Shop transactions.
 * - Prior-region milestone: Vulkankrater's own completion
 *   (`REGION_COMPLETED_MILESTONE`, written by `ATTEMPT_STAGE` when its
 *   `isRegionCompletionBoss` stage is cleared), evaluated generically via
 *   `REGION_STATE` against `world.regionMilestones[START_REGION_ID]` —
 *   not a region-specific boolean; any future region can reference any
 *   prior region's own completion the same way.
 * No third/special-region gate: Ozean is not a signature region.
 */
export const OZEAN_UNLOCK_RULE_ID: UnlockRuleId = UnlockRuleId.from(
  "ozean-region-unlock",
);

export const SLICE_UNLOCK_RULES: readonly UnlockRuleDefinition[] = [
  {
    unlockRuleId: SLICE_ALWAYS_UNLOCKED_RULE_ID,
    displayName: "Always Available (Provisional)",
    primaryCondition: { type: "JOURNEY_RANK", threshold: 1 },
  },
  {
    unlockRuleId: OZEAN_UNLOCK_RULE_ID,
    displayName: "Ozean Region (Provisional)",
    primaryCondition: {
      type: "JOURNEY_RANK",
      threshold: PROVISIONAL_JOURNEY_RANK_THRESHOLD_OZEAN,
    },
    secondaryCondition: {
      type: "REGION_STATE",
      subjectId: START_REGION_ID,
      state: REGION_COMPLETED_MILESTONE,
    },
  },
];

export const VULKANKRATER_REGION: RegionDefinition = {
  regionId: START_REGION_ID,
  displayName: "Vulkankrater",
  elementId: "fire",
  progressionBand: "slice-provisional-starting-band",
  economicIdentityId: "slice-provisional-economic-identity",
  resourceProfileId: "slice-provisional-resource-profile",
  productEmphasis: [],
  customerDemandProfileId: "slice-provisional-demand-profile",
  expeditionProfileId: "slice-provisional-expedition-profile",
  regionalHookId: "slice-provisional-regional-hook",
  // Deliberately empty — see module doc "ELEMENT BOUNDARY".
  homeCatchmonLineIds: [],
  secondaryCatchmonLineIds: [],
  routeIds: [],
  recipeIds: [],
  unlockRuleId: SLICE_ALWAYS_UNLOCKED_RULE_ID,
  visualThemeId: "slice-provisional-visual-theme",
};

export const OZEAN_REGION: RegionDefinition = {
  regionId: PREVIEW_REGION_ID,
  displayName: "Ozean",
  elementId: "water",
  progressionBand: "slice-provisional-second-region-band",
  economicIdentityId: "slice-provisional-economic-identity",
  resourceProfileId: "slice-provisional-resource-profile",
  productEmphasis: [],
  customerDemandProfileId: "slice-provisional-demand-profile",
  expeditionProfileId: "slice-provisional-expedition-profile",
  regionalHookId: "slice-provisional-regional-hook",
  // Ozean Batch A: the lines that are BOTH genuinely integrated into this
  // slice's catalog AND canonically Water — see module doc "ELEMENT
  // BOUNDARY" for why this is not "every canonical Water line".
  homeCatchmonLineIds: [
    AQUILOR_LINE_ID,
    HYDROSCYTHE_LINE_ID,
    AQUARIL_LINE_ID,
    AQUALUME_LINE_ID,
  ],
  secondaryCatchmonLineIds: [],
  routeIds: [],
  recipeIds: [],
  // Ozean Batch A: a real two-signal unlock rule — no longer preview-only
  // (see module doc's `OZEAN_UNLOCK_RULE_ID`/`SLICE_UNLOCK_RULES`).
  unlockRuleId: OZEAN_UNLOCK_RULE_ID,
  visualThemeId: "slice-provisional-visual-theme",
};

export const SLICE_REGIONS: readonly RegionDefinition[] = [
  VULKANKRATER_REGION,
  OZEAN_REGION,
];

/**
 * Route content: exactly the 3 "minimum expedition prototype" routes
 * (Document 07 §161-164) — Supply Run, Discovery Survey, Component Hunt —
 * per region. Ozean Batch A adds Ozean's own matching 3, the same
 * repeatable minimum-route template Document 07 §161 already established
 * for Vulkankrater. No hard `accessRequirements`/`unlockRequirements` on
 * any of them (Document 07 §16-17: normal routes should have "simple
 * progression access") — preferences over hard gates; ROUTE access itself
 * is gated at the region level (`OZEAN_UNLOCK_RULE_ID` above), not
 * per-route.
 */
const PLACEHOLDER_ENVIRONMENT_ASSET_ID: AssetId =
  SLICE_PLACEHOLDER_ITEM_ASSET_ID;

export const SUPPLY_RUN_ROUTE: RouteDefinition = {
  routeId: SUPPLY_RUN_ROUTE_ID,
  displayName: "Vulkankrater Supply Run (Provisional)",
  regionId: START_REGION_ID,
  expeditionIntent: "SUPPLY_RUN",
  durationBand: `${String(PROVISIONAL_SUPPLY_RUN_DURATION_MS)}ms-provisional`,
  accessRequirements: [],
  preferredCapabilities: [],
  preferredElements: [],
  preferredSynergyTags: [],
  teamProfile: "slice-provisional-team-profile",
  preparationProfile: "slice-provisional-preparation-profile",
  guaranteedRewards: ["slice-routine-materials"],
  bonusRewardPools: [],
  specialComponentPool: [],
  // Document 07 §5-6: Supply Run prioritizes predictable materials, no encounters.
  encounterPool: [],
  discoveryProfile: "slice-provisional-no-discovery",
  protectionProfile: "slice-provisional-no-protection",
  unlockRequirements: [],
  visualEnvironmentId: PLACEHOLDER_ENVIRONMENT_ASSET_ID,
};

export const DISCOVERY_SURVEY_ROUTE: RouteDefinition = {
  routeId: DISCOVERY_SURVEY_ROUTE_ID,
  displayName: "Vulkankrater Discovery Survey (Provisional)",
  regionId: START_REGION_ID,
  expeditionIntent: "DISCOVERY_SURVEY",
  durationBand: `${String(PROVISIONAL_DISCOVERY_SURVEY_DURATION_MS)}ms-provisional`,
  accessRequirements: [],
  preferredCapabilities: [],
  preferredElements: [],
  preferredSynergyTags: [],
  teamProfile: "slice-provisional-team-profile",
  preparationProfile: "slice-provisional-preparation-profile",
  guaranteedRewards: ["slice-regional-value", "slice-discovery-progress"],
  bonusRewardPools: [],
  specialComponentPool: [],
  // Document 07 §161/§169: one already-owned line (Geckon — a genuine
  // line-entry species per Document 07 §63) plus one new/capturable line
  // (Aquaril — single-stage, its own line entry per §65).
  encounterPool: [GECKON_SPECIES_ID, AQUARIL_SPECIES_ID],
  discoveryProfile: "slice-provisional-discovery-profile",
  protectionProfile: "slice-provisional-encounter-protection",
  unlockRequirements: [],
  visualEnvironmentId: PLACEHOLDER_ENVIRONMENT_ASSET_ID,
};

export const COMPONENT_HUNT_ROUTE: RouteDefinition = {
  routeId: COMPONENT_HUNT_ROUTE_ID,
  displayName: "Vulkankrater Component Hunt (Provisional)",
  regionId: START_REGION_ID,
  expeditionIntent: "COMPONENT_HUNT",
  durationBand: `${String(PROVISIONAL_COMPONENT_HUNT_DURATION_MS)}ms-provisional`,
  accessRequirements: [],
  preferredCapabilities: [],
  preferredElements: [],
  preferredSynergyTags: [],
  teamProfile: "slice-provisional-team-profile",
  preparationProfile: "slice-provisional-preparation-profile",
  guaranteedRewards: ["slice-routine-materials"],
  bonusRewardPools: ["slice-special-component-bonus"],
  specialComponentPool: [SLICE_COMPONENT_A_ID],
  encounterPool: [],
  discoveryProfile: "slice-provisional-no-discovery",
  protectionProfile: "slice-provisional-component-protection",
  unlockRequirements: [],
  visualEnvironmentId: PLACEHOLDER_ENVIRONMENT_ASSET_ID,
};

/**
 * Ozean Batch A: Ozean Tidal Shallows (approved Ozean content proposal
 * §2). Same shape as Vulkankrater's own Supply Run — predictable
 * materials, no encounters (Document 07 §5-6). Its guaranteed reward
 * genuinely resolves to Reef Kelp (`app/game-config.ts`'s
 * `routineRewardResourceIdByRouteId`), not the Vulkankrater-shared
 * resource — see `craftingContent.ts`'s Reef Kelp/Cleansing Brine doc
 * comment.
 */
export const OZEAN_TIDAL_SHALLOWS_ROUTE: RouteDefinition = {
  routeId: OZEAN_TIDAL_SHALLOWS_ROUTE_ID,
  displayName: "Ozean Tidal Shallows (Provisional)",
  regionId: PREVIEW_REGION_ID,
  expeditionIntent: "SUPPLY_RUN",
  durationBand: `${String(PROVISIONAL_SUPPLY_RUN_DURATION_MS)}ms-provisional`,
  accessRequirements: [],
  preferredCapabilities: [],
  preferredElements: ["water"],
  preferredSynergyTags: [],
  teamProfile: "slice-provisional-team-profile",
  preparationProfile: "slice-provisional-preparation-profile",
  guaranteedRewards: ["slice-routine-materials"],
  bonusRewardPools: [],
  specialComponentPool: [],
  encounterPool: [],
  discoveryProfile: "slice-provisional-no-discovery",
  protectionProfile: "slice-provisional-no-protection",
  unlockRequirements: [],
  visualEnvironmentId: PLACEHOLDER_ENVIRONMENT_ASSET_ID,
};

/**
 * Ozean Batch A: Ozean Reef Survey (approved Ozean content proposal §2/§3
 * — "Reef Survey must provide Aqualume as the new initial Ozean
 * capture"). Mirrors Vulkankrater's Discovery Survey pairing exactly: one
 * already-owned line plus one genuinely new capturable line.
 *
 * ALREADY-OWNED ENCOUNTER CHOICE — VERIFIED, NOT ASSUMED: this task
 * required checking the real starting roster before picking one, rather
 * than assuming Aquilor. `catalogContent.ts`'s
 * `starterCatchmonSpeciesIds: SELECTED_CATCHMON_SPECIES_IDS` is the one
 * explicit, content-authored source `createInitialGameState`'s
 * `buildInitialOwnedCatchmons` reads (Task 06.2's own fix explicitly
 * rejects inferring starters from line/stage structure) — and it lists
 * Aquilor (and Hydroscythe) directly. Since owned Catchmons are never
 * removed by any later progression, and Ozean's own unlock rule requires
 * Shop Rank progress beyond game start anyway, Aquilor is guaranteed
 * already owned by the time Ozean — let alone this route — is reachable.
 * Aquilor is used here (rather than Hydroscythe) for the same reason
 * `catchmonContent.ts` gave it the EXPEDITION domain: a discovery-themed
 * route pairing best with the one Water line already built around
 * discovery.
 */
export const OZEAN_REEF_SURVEY_ROUTE: RouteDefinition = {
  routeId: OZEAN_REEF_SURVEY_ROUTE_ID,
  displayName: "Ozean Reef Survey (Provisional)",
  regionId: PREVIEW_REGION_ID,
  expeditionIntent: "DISCOVERY_SURVEY",
  durationBand: `${String(PROVISIONAL_DISCOVERY_SURVEY_DURATION_MS)}ms-provisional`,
  accessRequirements: [],
  preferredCapabilities: [],
  preferredElements: ["water"],
  preferredSynergyTags: [],
  teamProfile: "slice-provisional-team-profile",
  preparationProfile: "slice-provisional-preparation-profile",
  guaranteedRewards: ["slice-regional-value", "slice-discovery-progress"],
  bonusRewardPools: [],
  specialComponentPool: [],
  encounterPool: [AQUILOR_SPECIES_ID, AQUALUME_SPECIES_ID],
  discoveryProfile: "slice-provisional-discovery-profile",
  protectionProfile: "slice-provisional-encounter-protection",
  unlockRequirements: [],
  visualEnvironmentId: PLACEHOLDER_ENVIRONMENT_ASSET_ID,
};

/**
 * Ozean Batch A: Ozean Tidepool Hunt (approved Ozean content proposal
 * §2/§4). Same shape as Vulkankrater's Component Hunt; its special
 * component is Luminous Pearl (`craftingContent.ts`), already functional
 * through the existing generic per-route bonus-roll mechanism.
 */
export const OZEAN_TIDEPOOL_HUNT_ROUTE: RouteDefinition = {
  routeId: OZEAN_TIDEPOOL_HUNT_ROUTE_ID,
  displayName: "Ozean Tidepool Hunt (Provisional)",
  regionId: PREVIEW_REGION_ID,
  expeditionIntent: "COMPONENT_HUNT",
  durationBand: `${String(PROVISIONAL_COMPONENT_HUNT_DURATION_MS)}ms-provisional`,
  accessRequirements: [],
  preferredCapabilities: [],
  preferredElements: ["water"],
  preferredSynergyTags: [],
  teamProfile: "slice-provisional-team-profile",
  preparationProfile: "slice-provisional-preparation-profile",
  guaranteedRewards: ["slice-routine-materials"],
  bonusRewardPools: ["ozean-special-component-bonus"],
  specialComponentPool: [OZEAN_COMPONENT_LUMINOUS_PEARL_ID],
  encounterPool: [],
  discoveryProfile: "slice-provisional-no-discovery",
  protectionProfile: "slice-provisional-component-protection",
  unlockRequirements: [],
  visualEnvironmentId: PLACEHOLDER_ENVIRONMENT_ASSET_ID,
};

export const SLICE_ROUTES: readonly RouteDefinition[] = [
  SUPPLY_RUN_ROUTE,
  DISCOVERY_SURVEY_ROUTE,
  COMPONENT_HUNT_ROUTE,
  OZEAN_TIDAL_SHALLOWS_ROUTE,
  OZEAN_REEF_SURVEY_ROUTE,
  OZEAN_TIDEPOOL_HUNT_ROUTE,
];

/**
 * `RouteDefinition.durationBand` (above) is a human-readable content label,
 * not a numeric value — Document 14 does not attach a real duration field
 * to route content directly. This is the one real `RouteId -> ms` lookup
 * Task 06.3's planning queries and Task 06.4's start command resolve
 * actual completion timestamps from; each entry is the same
 * `PROVISIONAL_*_DURATION_MS` constant already embedded in that route's
 * `durationBand` label above, so the two can never silently drift apart.
 * Ozean's 3 routes reuse the exact same per-intent duration constants as
 * their Vulkankrater counterparts (Batch A foundation; not yet tuned
 * separately).
 */
export const SLICE_ROUTE_DURATION_MS: Readonly<Record<RouteId, number>> = {
  [SUPPLY_RUN_ROUTE_ID]: PROVISIONAL_SUPPLY_RUN_DURATION_MS,
  [DISCOVERY_SURVEY_ROUTE_ID]: PROVISIONAL_DISCOVERY_SURVEY_DURATION_MS,
  [COMPONENT_HUNT_ROUTE_ID]: PROVISIONAL_COMPONENT_HUNT_DURATION_MS,
  [OZEAN_TIDAL_SHALLOWS_ROUTE_ID]: PROVISIONAL_SUPPLY_RUN_DURATION_MS,
  [OZEAN_REEF_SURVEY_ROUTE_ID]: PROVISIONAL_DISCOVERY_SURVEY_DURATION_MS,
  [OZEAN_TIDEPOOL_HUNT_ROUTE_ID]: PROVISIONAL_COMPONENT_HUNT_DURATION_MS,
};
