/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §5 Stage
 * Structure; docs/rebuild/08_WORLD_REGIONS_AND_EXPEDITIONS.md §4 First Two
 * Regions; docs/rebuild/15 Phases R2/R6. A small synthetic Path per
 * Region (3 normal + 1 boss each) — real 10-20-checkpoint content per
 * Region is explicit later work. `order` is global across both Regions
 * (Vulkankrater first, then Ozean) — `domain/journey/stage-progression.ts`
 * advances through this one ordered list regardless of Region boundary,
 * exactly matching Document 03 §5's "architecture must not assume a fixed
 * count" per Region.
 */
import { StageId } from "../../core/ids/index.ts";
import { type StageDefinition } from "../../domain/journey/index.ts";
import {
  PREVIEW_REGION_ID,
  START_REGION_ID,
} from "../vertical-slice/verticalSliceManifest.ts";
import { PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST } from "./balance.ts";
import {
  ABYSSAL_WARDEN_ENEMY_ID,
  CINDER_HOUND_ENEMY_ID,
  EMBER_WISP_ENEMY_ID,
  MAGMA_SENTRY_ENEMY_ID,
  REEF_GUARDIAN_ENEMY_ID,
  TIDAL_SOVEREIGN_BOSS_ID,
  TIDE_SPRITE_ENEMY_ID,
  VULKAN_WARDEN_BOSS_ID,
} from "./enemies.ts";

// ---- Vulkankrater / Fire (order 0-3) ----
export const STAGE_1_ID = StageId.from("vulkankrater-stage-1");
export const STAGE_2_ID = StageId.from("vulkankrater-stage-2");
export const STAGE_3_ID = StageId.from("vulkankrater-stage-3");
export const STAGE_4_BOSS_ID = StageId.from("vulkankrater-stage-4-boss");

// ---- Ozean / Water (order 4-7) ----
export const STAGE_5_ID = StageId.from("ozean-stage-5");
export const STAGE_6_ID = StageId.from("ozean-stage-6");
export const STAGE_7_ID = StageId.from("ozean-stage-7");
export const STAGE_8_BOSS_ID = StageId.from("ozean-stage-8-boss");

/** PROVISIONAL: each normal stage awards enough Echo Charges for roughly one Forge (docs/rebuild/02 §2's 10-30s loop). */
export const COMBAT_SLICE_STAGES: readonly StageDefinition[] = [
  {
    stageId: STAGE_1_ID,
    displayName: "Ashen Approach",
    order: 0,
    regionId: START_REGION_ID,
    enemyId: EMBER_WISP_ENEMY_ID,
    isRegionCompletionBoss: false,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST,
    coinReward: 20,
  },
  {
    stageId: STAGE_2_ID,
    displayName: "Smoldering Trail",
    order: 1,
    regionId: START_REGION_ID,
    enemyId: CINDER_HOUND_ENEMY_ID,
    isRegionCompletionBoss: false,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST,
    coinReward: 30,
  },
  {
    stageId: STAGE_3_ID,
    displayName: "Sentry Gate",
    order: 2,
    regionId: START_REGION_ID,
    enemyId: MAGMA_SENTRY_ENEMY_ID,
    isRegionCompletionBoss: false,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST * 2,
    coinReward: 45,
  },
  {
    stageId: STAGE_4_BOSS_ID,
    displayName: "Vulkan Warden",
    order: 3,
    regionId: START_REGION_ID,
    enemyId: VULKAN_WARDEN_BOSS_ID,
    isRegionCompletionBoss: true,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST * 4,
    coinReward: 120,
  },
  {
    stageId: STAGE_5_ID,
    displayName: "Tidal Shallows Approach",
    order: 4,
    regionId: PREVIEW_REGION_ID,
    enemyId: TIDE_SPRITE_ENEMY_ID,
    isRegionCompletionBoss: false,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST * 2,
    coinReward: 50,
  },
  {
    stageId: STAGE_6_ID,
    displayName: "Reef Line",
    order: 5,
    regionId: PREVIEW_REGION_ID,
    enemyId: REEF_GUARDIAN_ENEMY_ID,
    isRegionCompletionBoss: false,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST * 2,
    coinReward: 65,
  },
  {
    stageId: STAGE_7_ID,
    displayName: "Abyssal Gate",
    order: 6,
    regionId: PREVIEW_REGION_ID,
    enemyId: ABYSSAL_WARDEN_ENEMY_ID,
    isRegionCompletionBoss: false,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST * 3,
    coinReward: 85,
  },
  {
    stageId: STAGE_8_BOSS_ID,
    displayName: "Tidal Sovereign",
    order: 7,
    regionId: PREVIEW_REGION_ID,
    enemyId: TIDAL_SOVEREIGN_BOSS_ID,
    isRegionCompletionBoss: true,
    echoChargeReward: PROVISIONAL_FORGE_RELIC_ECHO_CHARGE_COST * 6,
    coinReward: 200,
  },
];
