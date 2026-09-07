/**
 * Design owner: Document 15 Task 06.9 (Capture Chance Query); Document 07
 * §74, §82-83, §135-138.
 *
 * State-aware wrapper around `domain/expeditions/capture-chance.ts`'s pure
 * formula — resolves the real per-encounter/per-line inputs from
 * `GameState` (Document 07 §82-83's per-line `captureProtection` counter,
 * the encounter's already-snapshotted `discoveryBoostBonus`) and hands
 * them to the pure computer. "No UI calculation" (Document 15 Task 06.9):
 * presentation must call this, never re-derive the formula itself.
 */
import { type EncounterId } from "../../../core/ids/index.ts";
import { type BasisPoints } from "../../../core/math/basis-points.ts";
import { type ProbabilityBps } from "../../../core/math/probability.ts";
import { computeCaptureChance } from "../../../domain/expeditions/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";

export interface CaptureChanceConfig {
  readonly base: ProbabilityBps;
  readonly aidBonus: BasisPoints;
  readonly protectionBonusPerFailure: BasisPoints;
  readonly floor: ProbabilityBps;
  readonly ceiling: ProbabilityBps;
}

/**
 * Returns `null` only for an unknown `encounterId` — every other input
 * (protection count, discovery boost) has a well-defined default (`0`) per
 * this codebase's sparse-map absence-as-default convention.
 */
export function previewCaptureChance(
  state: GameState,
  encounterId: EncounterId,
  useAid: boolean,
  config: CaptureChanceConfig,
): ProbabilityBps | null {
  const encounter = state.world.encounterOpportunities[encounterId];
  if (!encounter) return null;

  const captureProtectionFailures =
    state.world.captureProtection[encounter.targetLineId] ?? 0;

  return computeCaptureChance({
    base: config.base,
    ...(useAid ? { aidBonus: config.aidBonus } : {}),
    captureProtectionFailures,
    protectionBonusPerFailure: config.protectionBonusPerFailure,
    leadDiscoveryBoostBonus: encounter.discoveryBoostBonus,
    floor: config.floor,
    ceiling: config.ceiling,
  });
}
