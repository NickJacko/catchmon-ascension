/**
 * Design owner: docs/rebuild/15 Phase R9 §11 (Battle Motion). Mirrors
 * `scene-effects.ts`'s pure event->effect mapping exactly. `ATTEMPT_STAGE`
 * resolves an entire battle in one deterministic call (no persisted
 * round-by-round log — `journey.lastBattle` only keeps outcome +
 * timestamp) — the one `STAGE_ATTEMPTED` event this maps carries the
 * battle's final `leadHpRemaining`/`enemyHpRemaining`, which is enough to
 * drive a restrained "clash, HP settles, outcome" motion sequence without
 * inventing a per-round replay this phase's data doesn't have.
 */
import { type BattleOutcome } from "../../../../domain/combat/index.ts";
import { type AppGameEvent } from "../../../../app/game-events.ts";

export interface BattleClashEffect {
  readonly kind: "CLASH";
  readonly outcome: BattleOutcome;
  readonly leadHpRemaining: number;
  readonly enemyHpRemaining: number;
}

export type BattleSceneEffect = BattleClashEffect;

export function deriveBattleSceneEffects(
  events: readonly AppGameEvent[],
): readonly BattleSceneEffect[] {
  const effects: BattleSceneEffect[] = [];
  for (const event of events) {
    if (event.kind === "STAGE_ATTEMPTED") {
      effects.push({
        kind: "CLASH",
        outcome: event.outcome,
        leadHpRemaining: event.leadHpRemaining,
        enemyHpRemaining: event.enemyHpRemaining,
      });
    }
  }
  return effects;
}
