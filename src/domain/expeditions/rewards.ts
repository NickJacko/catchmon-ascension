/**
 * Design owner: Document 15 Task 06.6 (Routine + Special Rewards);
 * Document 07 §45-48 Guaranteed Core Reward / Bonus Reward Pool / Special
 * Component Protection.
 *
 * Pure functions only — no `GameState`/`GameCatalog` reads, no I/O
 * (matches `domain/catchmons/effects.ts`'s own rule: resolving *which*
 * item/rate applies to a given route is the caller's job, this module only
 * answers "given these exact inputs, what reward results?"). Never
 * produces a Coins line (Document 07 §128-129 / CLAUDE.md's expedition
 * scope: expeditions are not a second Coin economy).
 */
import { type ItemId } from "../../core/ids/index.ts";
import { type ProbabilityBps } from "../../core/math/probability.ts";
import { rollSucceeds, type RandomSource } from "../../core/random/index.ts";
import { type ExpeditionRewardLine } from "../game-state/index.ts";

/** Document 07 §47: every route's guaranteed core reward — always delivered, never rolled. */
export function resolveRoutineReward(
  itemId: ItemId,
  quantity: number,
): readonly ExpeditionRewardLine[] {
  return [{ itemId, quantity }];
}

export interface SpecialComponentBonusResult {
  readonly granted: boolean;
  /** The `consecutiveMisses` counter to persist for this route's next attempt (Document 07 §50 protection). */
  readonly nextConsecutiveMisses: number;
}

/**
 * Document 07 §48-50: a deterministic weighted roll for a route's optional
 * special-component bonus, with a "guaranteed after N consecutive misses"
 * floor so bad luck cannot compound indefinitely. `consecutiveMisses`
 * tracks misses since the last grant (or since the route was first run);
 * once it reaches `protectionThreshold`, this call is unconditionally
 * granted and the counter resets to 0 — otherwise a normal weighted roll
 * against `chance` decides it, incrementing the counter on a miss.
 */
export function resolveSpecialComponentBonus(
  rng: RandomSource,
  chance: ProbabilityBps,
  protectionThreshold: number,
  consecutiveMisses: number,
): SpecialComponentBonusResult {
  const protectionTriggered = consecutiveMisses >= protectionThreshold;
  const granted = protectionTriggered || rollSucceeds(rng, chance);
  return {
    granted,
    nextConsecutiveMisses: granted ? 0 : consecutiveMisses + 1,
  };
}
