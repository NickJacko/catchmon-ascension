/**
 * Design owner: Document 15 Phase 11 (Scale Validation) — "17
 * worlds/elements where structurally applicable." One `RegionDefinition`
 * per canonical `ElementId` (real, locked identity — CLAUDE.md §9), each
 * with `SCALE_ROUTES_PER_REGION` synthetic routes cycling through every
 * `ExpeditionIntent`. Cross-references to lines/recipes are computed by
 * shared index arithmetic (`i % SCALE_REGION_COUNT === regionIndex`)
 * rather than importing `crafting.ts`/`catchmons.ts` directly, so none of
 * the scale-fixture content modules depend on each other — only
 * `catalogContent.ts` assembles them, exactly like the Vertical Slice's
 * `catalogContent.ts` does for its hand-authored files.
 */
import { type ElementId } from "../../domain/world/index.ts";
import {
  type ElementDefinition,
  type RegionDefinition,
  type RouteDefinition,
  ELEMENT_IDS,
} from "../../domain/world/index.ts";
import { type UnlockRuleDefinition } from "../../domain/progression/index.ts";
import { type CatchmonLineId, type RouteId } from "../../core/ids/index.ts";
import { SCALE_PLACEHOLDER_ASSET_ID } from "./assets.ts";
import {
  componentIdForIndex,
  lineIdForIndex,
  pad,
  regionIdForIndex,
  routeIdForIndex,
  SCALE_LINE_COUNT,
  SCALE_REGION_COUNT,
  SCALE_ROUTES_PER_REGION,
  speciesIdForIndex,
  unlockRuleIdForIndex,
} from "./manifest.ts";

// ---- Elements (real canonical identity, not synthetic) ----

export const SCALE_ELEMENTS: readonly ElementDefinition[] = ELEMENT_IDS.map(
  (elementId): ElementDefinition => ({
    elementId,
    displayName: `Scale Fixture Element (${elementId})`,
    colorTokenRef: `--color-element-${elementId}`,
    iconAssetId: SCALE_PLACEHOLDER_ASSET_ID,
    economicIdentityId: `scale-economic-identity-${elementId}`,
    resourceTendencies: [`scale-resource-tendency-${elementId}`],
    craftingTendencies: [`scale-crafting-tendency-${elementId}`],
    commerceTendencies: [`scale-commerce-tendency-${elementId}`],
    expeditionTendencies: [`scale-expedition-tendency-${elementId}`],
    capabilityTendencies: [`scale-capability-tendency-${elementId}`],
  }),
);

/** One shared "unlocked once Shop Rank >= 1" rule, per region for a distinct `UnlockRuleId` — mirrors the Vertical Slice's "always available" pattern, just one instance per region rather than one shared instance, to also exercise a larger `unlockRules` registry. */
export const SCALE_UNLOCK_RULES: readonly UnlockRuleDefinition[] = Array.from(
  { length: SCALE_REGION_COUNT },
  (_, i): UnlockRuleDefinition => ({
    unlockRuleId: unlockRuleIdForIndex(i + 1),
    displayName: `Scale Fixture Region Unlock ${pad(i + 1)}`,
    primaryCondition: { type: "SHOP_RANK", threshold: 1 },
  }),
);

function homeLinesForRegion(regionIndex: number): readonly CatchmonLineId[] {
  const ids: CatchmonLineId[] = [];
  for (let lineIndex = 1; lineIndex <= SCALE_LINE_COUNT; lineIndex += 1) {
    if ((lineIndex - 1) % SCALE_REGION_COUNT === regionIndex) {
      ids.push(lineIdForIndex(lineIndex));
    }
  }
  return ids;
}

export const SCALE_REGIONS: readonly RegionDefinition[] = ELEMENT_IDS.map(
  (elementId: ElementId, regionIndex): RegionDefinition => {
    const regionNumber = regionIndex + 1;
    return {
      regionId: regionIdForIndex(regionNumber),
      displayName: `Scale Fixture Region ${pad(regionNumber)} (${elementId})`,
      elementId,
      progressionBand: `scale-progression-band-${pad(regionNumber)}`,
      economicIdentityId: `scale-region-economic-identity-${pad(regionNumber)}`,
      resourceProfileId: `scale-region-resource-profile-${pad(regionNumber)}`,
      productEmphasis: [],
      customerDemandProfileId: `scale-region-demand-profile-${pad(regionNumber)}`,
      expeditionProfileId: `scale-region-expedition-profile-${pad(regionNumber)}`,
      regionalHookId: `scale-region-hook-${pad(regionNumber)}`,
      homeCatchmonLineIds: homeLinesForRegion(regionIndex),
      secondaryCatchmonLineIds: [],
      routeIds: Array.from({ length: SCALE_ROUTES_PER_REGION }, (_, r) =>
        routeIdForIndex(regionNumber, r + 1),
      ),
      recipeIds: [],
      unlockRuleId: unlockRuleIdForIndex(regionNumber),
      visualThemeId: `scale-region-visual-theme-${pad(regionNumber)}`,
    };
  },
);

const EXPEDITION_INTENTS = [
  "SUPPLY_RUN",
  "DISCOVERY_SURVEY",
  "COMPONENT_HUNT",
  "SPECIAL_EXPEDITION",
] as const;

export const SCALE_ROUTES: readonly RouteDefinition[] = SCALE_REGIONS.flatMap(
  (region, regionIndex) => {
    const regionNumber = regionIndex + 1;
    return Array.from(
      { length: SCALE_ROUTES_PER_REGION },
      (_, routeOffset): RouteDefinition => {
        const routeNumber = routeOffset + 1;
        const intent =
          EXPEDITION_INTENTS[
            (regionIndex + routeOffset) % EXPEDITION_INTENTS.length
          ]!;
        // Component Hunt routes get a real multi-entry pool (>1) so the
        // reconciliation pass's deterministic pool pick (Phase 11 audit
        // fix) is actually exercised at scale, not just a single-entry
        // pool like the Vertical Slice's one Component Hunt route.
        const specialComponentPool =
          intent === "COMPONENT_HUNT"
            ? [
                componentIdForIndex(((regionIndex * 2 + routeOffset) % 6) + 1),
                componentIdForIndex(
                  ((regionIndex * 2 + routeOffset + 3) % 6) + 1,
                ),
              ]
            : [];
        const encounterPool =
          intent === "DISCOVERY_SURVEY"
            ? [
                speciesIdForIndex(
                  ((regionIndex * 2 + routeOffset) % SCALE_LINE_COUNT) + 1,
                ),
              ]
            : [];
        return {
          routeId: routeIdForIndex(regionNumber, routeNumber),
          displayName: `Scale Fixture Route ${pad(regionNumber)}-${pad(routeNumber)} (${intent})`,
          regionId: region.regionId,
          expeditionIntent: intent,
          durationBand: "scale-fixture-duration-band",
          accessRequirements: [],
          preferredCapabilities: [],
          preferredElements: [region.elementId],
          preferredSynergyTags: [],
          teamProfile: "scale-fixture-team-profile",
          preparationProfile: "scale-fixture-preparation-profile",
          guaranteedRewards: ["scale-fixture-routine-materials"],
          bonusRewardPools:
            specialComponentPool.length > 0
              ? ["scale-fixture-special-component-bonus"]
              : [],
          specialComponentPool,
          encounterPool,
          discoveryProfile:
            intent === "DISCOVERY_SURVEY"
              ? "scale-fixture-discovery-profile"
              : "scale-fixture-no-discovery",
          protectionProfile: "scale-fixture-protection-profile",
          unlockRequirements: [],
          visualEnvironmentId: SCALE_PLACEHOLDER_ASSET_ID,
        };
      },
    );
  },
);

/** `RouteDefinition.durationBand` is a label, not a number (Document 07) — real completion timestamps come from this lookup, exactly like `content/vertical-slice/worldContent.ts`'s `SLICE_ROUTE_DURATION_MS`. One flat duration for every scale route: Phase 11 tests structural scale, not per-intent duration balance. */
export const SCALE_ROUTE_DURATION_MS: Readonly<Record<RouteId, number>> =
  Object.fromEntries(SCALE_ROUTES.map((route) => [route.routeId, 20_000]));
