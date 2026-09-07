/**
 * Design owner: Document 15 Task 05.4 (Typed Capability Effect
 * Primitives); Document 06 §119-122 (Capability Registry, Capability
 * Effect Families, Data-Driven First — "reuse effect primitives; do not
 * write 104 bespoke engines").
 *
 * Pure, stateless effect evaluators — one per `CapabilityEffectFamily`
 * actually needed by the 6 selected slice Catchmons (Document 15: "do not
 * implement every hypothetical capability from Document 06"). Each takes
 * a `CapabilityDefinition` plus whatever context that family needs and
 * returns `null` when the capability doesn't match that family/domain, or
 * a small typed result otherwise. No `GameState`/`GameCatalog` reads here
 * — resolving *which* owned Catchmon/capability applies is the caller's
 * job (Task 05.5's assignment queries, Task 05.6/05.7's craft/quote
 * wiring); this module only answers "given this exact capability, what
 * effect does it produce?".
 *
 * Magnitudes are never embedded in a capability (Document 06 §119:
 * "magnitude/config reference, not an embedded formula") — every
 * evaluator looks its number up from the caller-supplied
 * `magnitudeConfigRef` table (`PROVISIONAL_CAPABILITY_MAGNITUDES` in
 * production).
 */
import { type CapabilityId } from "../../core/ids/index.ts";
import {
  type ProductFamily,
  type StationArchetype,
} from "../crafting/index.ts";
import { type CapabilityDefinition } from "./types.ts";

export type MagnitudeTable = Readonly<Record<string, number>>;

function magnitudeFor(
  capability: CapabilityDefinition,
  magnitudes: MagnitudeTable,
): number | null {
  return magnitudes[capability.magnitudeConfigRef] ?? null;
}

export interface CraftSpeedEffect {
  readonly capabilityId: CapabilityId;
  /** Multiply the base craft duration by this (e.g. 0.85 = 15% faster). Always in (0, 1]. */
  readonly durationMultiplier: number;
}

/**
 * Document 06 §14 Station Specialist: a Workshop capability whose
 * `target` names the station's archetype. Returns `null` for any
 * capability that isn't a `CRAFT_SPEED_TARGETED` Workshop capability
 * targeting this exact station archetype (Task 05.6: "base recipe
 * definition remains unchanged" — this never touches the recipe, only
 * proposes a multiplier for the caller to apply to the derived duration).
 */
export function evaluateCraftSpeedEffect(
  capability: CapabilityDefinition,
  stationArchetype: StationArchetype,
  magnitudes: MagnitudeTable,
): CraftSpeedEffect | null {
  if (
    capability.effectFamily !== "CRAFT_SPEED_TARGETED" ||
    capability.validDomain !== "WORKSHOP" ||
    capability.target !== stationArchetype
  ) {
    return null;
  }
  const magnitude = magnitudeFor(capability, magnitudes);
  if (magnitude === null || magnitude <= 0 || magnitude >= 1) {
    return null;
  }
  return {
    capabilityId: capability.capabilityId,
    durationMultiplier: 1 - magnitude,
  };
}

export interface RecommendCompatibilityEffect {
  readonly capabilityId: CapabilityId;
  readonly extraCompatibleFamily: ProductFamily;
}

/**
 * Document 06 §25 Recommend Support: a Shop Floor capability that widens
 * which product families count as Recommend-compatible (Document 05 §52
 * "customer special rule" compatibility factor) — `target` names the
 * extra family it unlocks.
 */
export function evaluateRecommendCompatibilityEffect(
  capability: CapabilityDefinition,
  magnitudes: MagnitudeTable,
): RecommendCompatibilityEffect | null {
  if (
    capability.effectFamily !== "RECOMMEND_COMPATIBILITY" ||
    capability.validDomain !== "SHOP_FLOOR"
  ) {
    return null;
  }
  const magnitude = magnitudeFor(capability, magnitudes);
  if (magnitude === null || magnitude <= 0) {
    return null;
  }
  return {
    capabilityId: capability.capabilityId,
    extraCompatibleFamily: capability.target as ProductFamily,
  };
}

export interface DiscoveryBoostEffect {
  readonly capabilityId: CapabilityId;
  /** Additive boost to a discovery/reward weight; exact consumption belongs to Phase 6 (Expeditions). */
  readonly boostMagnitude: number;
}

/**
 * Document 06 §40 Expedition — Discovery. Not consumed by any live system
 * yet (Expeditions are Phase 6) — this evaluator exists so the capability
 * is content-complete and testable now, per Task 05.4's "expedition
 * discovery/reward support" example.
 */
export function evaluateDiscoveryBoostEffect(
  capability: CapabilityDefinition,
  magnitudes: MagnitudeTable,
): DiscoveryBoostEffect | null {
  if (
    capability.effectFamily !== "DISCOVERY_BOOST" ||
    capability.validDomain !== "EXPEDITION"
  ) {
    return null;
  }
  const magnitude = magnitudeFor(capability, magnitudes);
  if (magnitude === null || magnitude <= 0) {
    return null;
  }
  return { capabilityId: capability.capabilityId, boostMagnitude: magnitude };
}
