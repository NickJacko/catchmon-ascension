import { type StageId } from "../../../core/ids/index.ts";
import { type BattleOutcome } from "../../../domain/combat/index.ts";

export type JourneyEvent =
  | {
      readonly kind: "STAGE_ATTEMPTED";
      readonly stageId: StageId;
      readonly outcome: BattleOutcome;
      readonly leadHpRemaining: number;
      readonly enemyHpRemaining: number;
    }
  | {
      /** docs/rebuild/15 Phase R7: offline reconciliation farmed `clears` repeats of the stable farm checkpoint stage while the player was away. */
      readonly kind: "JOURNEY_OFFLINE_PROGRESS";
      readonly stageId: StageId;
      readonly clears: number;
      readonly coinsGained: number;
      readonly echoChargesGained: number;
    };
