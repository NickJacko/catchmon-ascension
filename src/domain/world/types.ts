/**
 * Design owner: 10 World & Element Structure — §220 Canonical World Data
 * Model, §221 Canonical Element Data Model, §222 Element/Region
 * Relationship; 07 Acquisition & Expeditions — §13 Route Architecture,
 * §15 Route Access vs. Preference, §168 Regional Route Package.
 *
 * Content-domain types only — no region/route/element records are
 * created here (that is later content-authoring work).
 */
import {
  type AssetId,
  type CapabilityId,
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type ComponentId,
  type RecipeId,
  type RegionId,
  type RouteId,
  type UnlockRuleId,
} from "../../core/ids/index.ts";
import { type UnlockCondition } from "../progression/index.ts";

/**
 * The 17 canonical real elements (CLAUDE.md §9 Canonical World Rule).
 * `Bug` is explicitly not a Catchmon Shop element and must never appear
 * here. A closed string-literal union, not a `Brand`/registry-backed ID —
 * unlike authored content (Product, Region, ...), this set is fixed and
 * does not grow through content authoring.
 */
export type ElementId =
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "earth"
  | "poison"
  | "normal"
  | "ice"
  | "fairy"
  | "wind"
  | "steel"
  | "psychic"
  | "light"
  | "dark"
  | "ghost"
  | "dragon"
  | "cosmic";

export const ELEMENT_IDS: readonly ElementId[] = [
  "fire",
  "water",
  "electric",
  "grass",
  "earth",
  "poison",
  "normal",
  "ice",
  "fairy",
  "wind",
  "steel",
  "psychic",
  "light",
  "dark",
  "ghost",
  "dragon",
  "cosmic",
] as const;

/**
 * Document 10 §221. `colorTokenRef` names a canonical CSS custom property
 * (e.g. `"--color-element-fire"`) — never a raw hex value (Document 10's
 * own explicit rule; also CLAUDE.md §26 Design System Rule). The
 * `*Tendencies` fields are open string tags; their exact structured shape
 * is not yet defined by the read design docs.
 */
export interface ElementDefinition {
  readonly elementId: ElementId;
  readonly displayName: string;
  readonly colorTokenRef: string;
  readonly iconAssetId: AssetId;
  readonly economicIdentityId: string;
  readonly resourceTendencies: readonly string[];
  readonly craftingTendencies: readonly string[];
  readonly commerceTendencies: readonly string[];
  readonly expeditionTendencies: readonly string[];
  readonly capabilityTendencies: readonly string[];
}

/**
 * Document 10 §220. One primary home region per canonical element
 * (Document 10 §222) — `elementId` is that region's home element, not a
 * list, even though a region may later contain cross-element content.
 */
export interface RegionDefinition {
  readonly regionId: RegionId;
  readonly displayName: string;
  readonly elementId: ElementId;
  readonly progressionBand: string;
  readonly economicIdentityId: string;
  readonly resourceProfileId: string;
  readonly productEmphasis: readonly string[];
  readonly customerDemandProfileId: string;
  readonly expeditionProfileId: string;
  readonly regionalHookId: string;
  readonly homeCatchmonLineIds: readonly CatchmonLineId[];
  readonly secondaryCatchmonLineIds: readonly CatchmonLineId[];
  readonly routeIds: readonly RouteId[];
  readonly recipeIds: readonly RecipeId[];
  readonly unlockRuleId: UnlockRuleId;
  readonly visualThemeId: string;
}

/**
 * The regional route package vocabulary (Document 10 §168). "Special
 * Expedition" is explicitly optional per region, not every route needs
 * to unlock simultaneously.
 */
export type ExpeditionIntent =
  "SUPPLY_RUN" | "DISCOVERY_SURVEY" | "COMPONENT_HUNT" | "SPECIAL_EXPEDITION";

/**
 * Document 07 §13 Route Architecture. `accessRequirements` are hard gates
 * (Document 07 §15); `preferredCapabilities`/`preferredElements`/
 * `preferredSynergyTags` are soft preferences, not requirements — a route
 * without them should still be runnable, just with different efficiency.
 */
export interface RouteDefinition {
  readonly routeId: RouteId;
  readonly displayName: string;
  readonly regionId: RegionId;
  readonly expeditionIntent: ExpeditionIntent;
  readonly durationBand: string;
  readonly accessRequirements: readonly UnlockCondition[];
  readonly preferredCapabilities: readonly CapabilityId[];
  readonly preferredElements: readonly ElementId[];
  readonly preferredSynergyTags: readonly string[];
  readonly teamProfile: string;
  readonly preparationProfile: string;
  readonly guaranteedRewards: readonly string[];
  readonly bonusRewardPools: readonly string[];
  readonly specialComponentPool: readonly ComponentId[];
  readonly encounterPool: readonly CatchmonSpeciesId[];
  readonly discoveryProfile: string;
  readonly protectionProfile: string;
  readonly unlockRequirements: readonly UnlockCondition[];
  readonly visualEnvironmentId: AssetId;
}
