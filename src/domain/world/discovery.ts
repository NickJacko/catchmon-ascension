/**
 * Design owner: Document 15 Task 06.7 (Discovery State Machine); Document
 * 07 §58 Discovery Architecture ("UNKNOWN -> TRACED -> ENCOUNTERED ->
 * OWNED"), §60 ("trace progress is not a spendable resource").
 *
 * Discovery status is per evolution LINE (Document 07 §63: the standard
 * acquisition unit is the line-entry species), not per species stage —
 * `CatchmonLineId` is the key used everywhere this module and its callers
 * track discovery/trace/protection state.
 */
import { type Result, err, ok } from "../../core/result/index.ts";

export type DiscoveryStatus = "UNKNOWN" | "TRACED" | "ENCOUNTERED" | "OWNED";

const FORWARD_ORDER: readonly DiscoveryStatus[] = [
  "UNKNOWN",
  "TRACED",
  "ENCOUNTERED",
  "OWNED",
];

export type IllegalDiscoveryTransitionReason =
  "BACKWARDS_TRANSITION" | "NOT_A_SINGLE_STEP";

/**
 * Advances `current` to `target`, allowed only strictly forward
 * (Document 15 Task 06.7: "no backwards accidental transition"). A
 * status may also be re-applied to itself (advancing to the same status
 * is a no-op success) since callers resolving an already-owned encounter
 * should not have to special-case "already there".
 */
export function advanceDiscoveryStatus(
  current: DiscoveryStatus,
  target: DiscoveryStatus,
): Result<DiscoveryStatus, IllegalDiscoveryTransitionReason> {
  const currentIndex = FORWARD_ORDER.indexOf(current);
  const targetIndex = FORWARD_ORDER.indexOf(target);
  if (targetIndex < currentIndex) {
    return err("BACKWARDS_TRANSITION");
  }
  return ok(target);
}

/** The next status one legal step forward from `current` (undefined once already OWNED — there is nothing further in this state machine). */
export function nextDiscoveryStatus(
  current: DiscoveryStatus,
): DiscoveryStatus | undefined {
  const currentIndex = FORWARD_ORDER.indexOf(current);
  return FORWARD_ORDER[currentIndex + 1];
}
