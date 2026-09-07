/**
 * Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md;
 * docs/rebuild/15 Phase R4. Content-domain types only.
 */
import { type SkillId } from "../../core/ids/index.ts";
import { type BattlePathId, type StatDelta } from "../combat/types.ts";

/**
 * Document 05 §4-5: a skill is authored as a flat stat-modifier bundle
 * applied while equipped — a deliberate PROVISIONAL simplification (real
 * mastery/branch-modifier behavior-change mechanics, Document 05 §5, are
 * explicit future work, not built here: "do not implement advanced
 * branches yet," Phase R4 instruction). `pathId` records which Path a
 * skill is thematically associated with for presentation only; nothing
 * in `application/commands/loadout` currently restricts equipping a skill
 * outside its associated Path (Document 05 §2 "Paths can be switched with
 * low friction... no irreversible beginner trap" — the same open spirit
 * extends to skill choice for this minimal slice).
 */
export interface SkillDefinition {
  readonly skillId: SkillId;
  readonly displayName: string;
  readonly pathId: BattlePathId;
  readonly isSignature: boolean;
  readonly statBonus: StatDelta;
}

/** Document 05 §8: advisory only, never a hidden authority. */
export interface BuildFitResult {
  /** 0-10000 basis points — how concentrated the loadout's stat investment is in the current Path's primary stats, independent of total Power (see `build-fit.ts`). */
  readonly scoreBps: number;
  readonly notes: readonly string[];
}
