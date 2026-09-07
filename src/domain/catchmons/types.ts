/**
 * Design owner: 06 Catchmon Gameplay Integration — §5 Line-First Design
 * Rule, §8-11 Core Functional Domains, §62-64 Capability Strength
 * Classes, §65-69 Evolution, §75 Rarity, §119-120 Capability Registry.
 *
 * Content-domain types only — no species/line/capability records are
 * created here, and no attempt is made to normalize all 104 Catchmons
 * (that is later content-authoring work, explicitly out of scope here).
 */
import {
  type AssetId,
  type CapabilityId,
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type RegionId,
} from "../../core/ids/index.ts";
import { type ElementId } from "../world/types.ts";

/**
 * The four core functional domains every evolution line is designed
 * around (Document 06 §8). A "fifth generic passive domain" is
 * deliberately avoided per the design doc.
 */
export type CatchmonDomain =
  "WORKSHOP" | "SHOP_FLOOR" | "SUPPLY" | "EXPEDITION";

/**
 * Canonical rarity tiers, matching the existing shared icon registry
 * (`reference/design-system/index.tsx`'s `RARITY_ICONS`) — five tiers,
 * no "epic" (removed from the asset taxonomy; see `tokens.css`'s own
 * provenance comment). Rarity does not determine economic strength
 * (Document 06 §75-76 "No Rarity Power Ladder").
 */
export type Rarity = "COMMON" | "RARE" | "LEGENDARY" | "MYTHIC" | "GOD";

/**
 * A capability's development stage within its line (Document 06 §62-64):
 * Core (available early, defines "what is this Catchmon useful for"),
 * Developed (deepens the same role), Signature (curated, memorable,
 * structural — not every line has one).
 */
export type CapabilityStrengthClass = "CORE" | "DEVELOPED" | "SIGNATURE";

/**
 * Reusable capability effect families (Document 06 §120) — the principle
 * is "reuse effect primitives; do not write 104 bespoke engines." Exact
 * effect *behavior* belongs to a future effect-engine task; this is only
 * the closed vocabulary of effect kinds a capability may declare.
 */
export type CapabilityEffectFamily =
  | "CRAFT_SPEED_TARGETED"
  | "CRAFT_QUALITY_TARGETED"
  | "MATERIAL_EFFICIENCY_TARGETED"
  | "RECIPE_UNLOCK"
  | "CUSTOMER_ATTRACTION"
  | "DEMAND_INSIGHT"
  | "RECOMMEND_COMPATIBILITY"
  | "SUPPLY_YIELD_TARGETED"
  | "RESOURCE_CONVERSION"
  | "EXPEDITION_ROUTE_ACCESS"
  | "EXPEDITION_REWARD_WEIGHT"
  | "DISCOVERY_BOOST"
  | "GEAR_EFFICIENCY";

/**
 * Document 06 §119 Capability Registry: a capability references effect
 * type, valid domain, target, condition, magnitude/config reference, and
 * a presentation text key — not an embedded formula.
 */
export interface CapabilityDefinition {
  readonly capabilityId: CapabilityId;
  readonly displayName: string;
  readonly strengthClass: CapabilityStrengthClass;
  readonly effectFamily: CapabilityEffectFamily;
  readonly validDomain: CatchmonDomain;
  readonly target: string;
  readonly condition?: string;
  readonly magnitudeConfigRef: string;
  readonly presentationTextKey: string;
}

/**
 * Document 06 §5 Line-First Design Rule: an evolution line owns one core
 * gameplay fantasy, one primary domain, an optional secondary domain,
 * a specialization identity, a synergy identity, and an element/region
 * relationship — evolution stages (`CatchmonSpeciesDefinition`) develop
 * that same identity, they do not each invent a new one.
 */
export interface EvolutionLineDefinition {
  readonly catchmonLineId: CatchmonLineId;
  readonly displayName: string;
  readonly primaryDomain: CatchmonDomain;
  readonly secondaryDomain?: CatchmonDomain;
  /**
   * Optional as of Task 05.1 (Canonical Catchmon Reference Audit): no
   * source anywhere in `reference/` or `docs/game-design/` assigns a real
   * element to any of the Vertical Slice's selected canonical Catchmons —
   * an earlier pass guessed elements from name etymology and that was
   * explicitly rejected (see `catchmonReferenceAudit.ts`). CLAUDE.md §8
   * forbids fabricating canonical identity data, so this field is now
   * absent-when-unknown rather than forced. Future content authoring that
   * *does* have real element data should still always set it.
   */
  readonly elementId?: ElementId;
  readonly homeRegionId?: RegionId;
  readonly specializationIdentity: string;
  readonly synergyTags: readonly string[];
  readonly speciesIds: readonly CatchmonSpeciesId[];
}

/**
 * One stage within an evolution line. `stageIndex` is 0-based (base
 * stage = 0); Document 06 §68 frames base/middle/final as a framework,
 * not a requirement that every line has exactly three stages.
 */
export interface CatchmonSpeciesDefinition {
  readonly catchmonSpeciesId: CatchmonSpeciesId;
  readonly catchmonLineId: CatchmonLineId;
  readonly displayName: string;
  readonly stageIndex: number;
  /**
   * Optional as of Task 05.1: `reference/catchmons/` sorts species into
   * six folders (Common/Rare/Legendary/Mythic/God/Starter), and five map
   * directly onto this five-value `Rarity` enum by name — but `Starter`
   * does not, and nothing establishes what rarity (if any) a
   * `Starter`-folder species should carry. Species sourced from `Starter/`
   * leave this absent rather than guessing "COMMON" (CLAUDE.md §8).
   */
  readonly rarity?: Rarity;
  /** Optional — see `EvolutionLineDefinition.elementId`'s doc comment. */
  readonly elementId?: ElementId;
  readonly capabilityIds: readonly CapabilityId[];
  readonly evolvesToSpeciesId?: CatchmonSpeciesId;
  readonly portraitAssetId: AssetId;
}
