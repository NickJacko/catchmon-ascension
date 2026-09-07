/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §5 Stage
 * Structure; docs/rebuild/15 Phase R2. Content-domain types only — no
 * stage records are created here (see `content/combat-slice/stages.ts`
 * for the small vertical-slice stage list).
 */
import {
  type EnemyId,
  type RegionId,
  type StageId,
} from "../../core/ids/index.ts";

/**
 * One checkpoint along a Path (Document 03 §5: "A Path contains: normal
 * encounters, elites, one local boss, a region milestone boss"). `order`
 * is the stage's fixed position, GLOBAL across every region (not reset
 * per region) — the architecture "must not assume a fixed count"
 * (Document 03 §5), so progression is driven by comparing `order` values
 * against a catalog-wide list, not a hardcoded count. `regionId`
 * (docs/rebuild/15 Phase R6) associates each stage with the Region it
 * belongs to, so a Region's own completion milestone (`isRegionBossStage`)
 * can be identified generically, not by a region-specific stage-id
 * branch.
 */
export interface StageDefinition {
  readonly stageId: StageId;
  readonly displayName: string;
  readonly order: number;
  readonly regionId: RegionId;
  readonly enemyId: EnemyId;
  /** True for the boss that completes this stage's Region (Document 03 §5's "region milestone boss") — distinct from `EnemyDefinition.isBoss`, which only says "this enemy is a boss," not "clearing it completes a Region." */
  readonly isRegionCompletionBoss: boolean;
  /** Echo Charges awarded on a WIN (Document 04 §2 "stage progression" as a source). */
  readonly echoChargeReward: number;
  readonly coinReward: number;
}
