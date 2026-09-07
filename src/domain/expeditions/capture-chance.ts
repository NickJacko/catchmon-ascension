/**
 * Design owner: Document 15 Task 06.9 (Capture Chance Query); Document 07
 * §74, §82-83, §135-138 Capture Chance inputs/floor/ceiling/protection.
 *
 * Pure formula only — no `GameState`/`GameCatalog` reads (same rule as
 * every other `domain/expeditions` module here); resolving the real
 * per-encounter/per-line inputs is the caller's job (Task 06.9's
 * application-layer query wrapper). "No UI calculation" (Document 15):
 * this is the one and only place the final visible probability is
 * computed — presentation only ever displays the returned value.
 */
import {
  BASIS_POINTS_PER_WHOLE,
  type BasisPoints,
} from "../../core/math/basis-points.ts";
import {
  toProbabilityBps,
  type ProbabilityBps,
} from "../../core/math/probability.ts";
import { roundToInteger } from "../../core/math/integer.ts";

export interface CaptureChanceInputs {
  readonly base: ProbabilityBps;
  /** Present only when the Capture Aid is actually being used for this attempt. */
  readonly aidBonus?: BasisPoints;
  /** Document 07 §82-83: a simple per-line consecutive-failure counter, reset to 0 on success. */
  readonly captureProtectionFailures: number;
  readonly protectionBonusPerFailure: BasisPoints;
  /**
   * Document 07 §23 Expedition Start Snapshot: the Lead's `DISCOVERY_BOOST`
   * magnitude as already snapshotted onto the Encounter Opportunity
   * (`EncounterOpportunityState.discoveryBoostBonus`) — a plain fraction
   * (e.g. `0.1` = 10%), matching `domain/catchmons/effects.ts`'s existing
   * `DiscoveryBoostEffect.boostMagnitude` convention. Converted to basis
   * points here, at the one boundary where a fraction-typed effect
   * magnitude meets this module's basis-point capture-chance formula —
   * not a wider unit migration of the shared `MagnitudeTable` contract,
   * which other effect families (craft speed, recommend compatibility)
   * still consume as plain fractions/multipliers.
   */
  readonly leadDiscoveryBoostBonus: number;
  readonly floor: ProbabilityBps;
  readonly ceiling: ProbabilityBps;
}

/** `clamp(base + aidBonus? + protectionFailures * protectionBonusPerFailure + discoveryBoost, floor, ceiling)`. */
export function computeCaptureChance(
  inputs: CaptureChanceInputs,
): ProbabilityBps {
  const discoveryBoostBps = roundToInteger(
    inputs.leadDiscoveryBoostBonus * BASIS_POINTS_PER_WHOLE,
  );
  const total =
    inputs.base +
    (inputs.aidBonus ?? 0) +
    inputs.captureProtectionFailures * inputs.protectionBonusPerFailure +
    discoveryBoostBps;
  const clamped = Math.min(Math.max(total, inputs.floor), inputs.ceiling);
  return toProbabilityBps(clamped);
}
