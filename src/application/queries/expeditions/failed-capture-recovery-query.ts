/**
 * Design owner: Document 15 Task 06.12 (Failed-Capture Recovery Query);
 * Document 07 §82-89.
 *
 * Presentation-ready facts about a resolved FAILED capture attempt — what
 * was consumed, that discovery progress is retained (never regresses),
 * current protection progress, and how the target can be pursued again.
 * Pure read over `GameState`; no calculation presentation should redo
 * itself (mirrors Task 06.9's "no UI calculation" rule).
 */
import {
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type EncounterId,
} from "../../../core/ids/index.ts";
import { type DiscoveryStatus } from "../../../domain/world/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";

export interface FailedCaptureRecovery {
  readonly encounterId: EncounterId;
  readonly targetLineId: CatchmonLineId;
  readonly targetSpeciesId: CatchmonSpeciesId;
  /** Whether this specific attempt actually consumed a reserved Capture Aid. */
  readonly captureAidConsumed: boolean;
  /** Document 07: discovery status is retained/forward-only — a failed capture never regresses it back toward UNKNOWN. */
  readonly retainedDiscoveryStatus: DiscoveryStatus;
  /** The line's current consecutive-failure count, already including this attempt. */
  readonly consecutiveFailures: number;
  /**
   * Always `true` in this slice: capture protection is a durable per-line
   * counter (Document 07 §82-83, "not spendable/transferable"), so the
   * target can always be pursued again via a future Discovery Survey —
   * there is no permanent lockout on failure.
   */
  readonly canPursueAgain: boolean;
}

/**
 * Returns `null` for an unknown encounter, an encounter that isn't
 * resolved yet, or one whose resolution wasn't `FAILED` — this query only
 * answers the specific "what do I do after a failed capture" question.
 */
export function getFailedCaptureRecovery(
  state: GameState,
  encounterId: EncounterId,
): FailedCaptureRecovery | null {
  const encounter = state.world.encounterOpportunities[encounterId];
  if (!encounter || encounter.status !== "RESOLVED") return null;
  if (encounter.resolution !== "FAILED") return null;

  return {
    encounterId,
    targetLineId: encounter.targetLineId,
    targetSpeciesId: encounter.targetSpeciesId,
    captureAidConsumed: encounter.captureAidUsed ?? false,
    retainedDiscoveryStatus:
      state.world.discoveryStates[encounter.targetLineId] ?? "UNKNOWN",
    consecutiveFailures:
      state.world.captureProtection[encounter.targetLineId] ?? 0,
    canPursueAgain: true,
  };
}
