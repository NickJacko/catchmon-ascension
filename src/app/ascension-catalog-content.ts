/**
 * Design owner: docs/rebuild/15 Phases R2-R5.
 *
 * The catalog content Catchmon Ascension actually boots from: Shop's
 * existing `VERTICAL_SLICE_CATALOG_CONTENT` (kept — see docs/rebuild/
 * R1_DEPENDENCY_AUDIT.md, nothing retired yet) plus the new combat-slice
 * content (enemies, stages, Relic archetypes, Skills). No species/lines
 * are re-authored — R5 reuses the same 11-species/6-line vertical-slice
 * roster (`bondSupportBehaviors.ts`'s doc comment explains why).
 */
import { type GameCatalogContent } from "../domain/catalog/index.ts";
import { VERTICAL_SLICE_CATALOG_CONTENT } from "../content/vertical-slice/index.ts";
import {
  COMBAT_SLICE_ENEMIES,
  COMBAT_SLICE_PRODUCTION_ASSETS,
  COMBAT_SLICE_RELIC_ARCHETYPES,
  COMBAT_SLICE_SKILLS,
  COMBAT_SLICE_STAGES,
} from "../content/combat-slice/index.ts";

export const ASCENSION_CATALOG_CONTENT: GameCatalogContent = {
  ...VERTICAL_SLICE_CATALOG_CONTENT,
  enemies: COMBAT_SLICE_ENEMIES,
  stages: COMBAT_SLICE_STAGES,
  relicArchetypes: COMBAT_SLICE_RELIC_ARCHETYPES,
  skills: COMBAT_SLICE_SKILLS,
  // Wave 0A Integration — the six currently-available production battle
  // assets (see `content/combat-slice/productionAssets.ts`), appended to
  // the vertical slice's own asset list rather than replacing it.
  assets: [
    ...VERTICAL_SLICE_CATALOG_CONTENT.assets,
    ...COMBAT_SLICE_PRODUCTION_ASSETS,
  ],
  // Only 3 Signature Skills exist in this slice (one per Battle Path) and
  // no progression-gated unlock flow has been built yet (docs/rebuild/15
  // Phase R4's "do not implement advanced branches yet") — all 3 start
  // unlocked, same simplification `starterCatchmonSpeciesIds` already
  // makes for the starting Catchmon roster.
  startingUnlockedSkillIds: COMBAT_SLICE_SKILLS.map((skill) => skill.skillId),
};
