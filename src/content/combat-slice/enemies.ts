/**
 * Design owner: docs/rebuild/03_COMBAT_STAGE_AND_BOSS_SYSTEM.md §6-7,
 * §11 Element Model; docs/rebuild/08_WORLD_REGIONS_AND_EXPEDITIONS.md §4
 * First Two Regions; docs/rebuild/15 Phases R2/R6. A small synthetic
 * enemy/boss set — real per-Region encounter content is explicit later
 * work (Document 03 §5 "First playable build target: 2 Regions, 10-20
 * checkpoints each"; this is a vertical slice proving the architecture,
 * not that content).
 *
 * Vulkankrater (Fire) enemies favor Attack/Crit/Combo/Speed — burst,
 * offense, fast pressure (Doc 08 §4). Ozean (Water) enemies favor HP/
 * Guard/Counter/ElementalResistance instead — sustain, continuity,
 * reliable flow: no "regen" stat exists in `CombatStats` (docs/rebuild/15
 * Phase R2's deliberate minimal stat set), so "sustain" is expressed as
 * high effective HP (raw HP + Guard damage reduction) rather than an
 * invented recovery mechanic.
 */
import { EnemyId } from "../../core/ids/index.ts";
import { toBasisPoints, toProbabilityBps } from "../../core/math/index.ts";
import { type EnemyDefinition } from "../../domain/combat/index.ts";

export const EMBER_WISP_ENEMY_ID = EnemyId.from("ember-wisp");
export const CINDER_HOUND_ENEMY_ID = EnemyId.from("cinder-hound");
export const MAGMA_SENTRY_ENEMY_ID = EnemyId.from("magma-sentry");
export const VULKAN_WARDEN_BOSS_ID = EnemyId.from("vulkan-warden-boss");

export const TIDE_SPRITE_ENEMY_ID = EnemyId.from("tide-sprite");
export const REEF_GUARDIAN_ENEMY_ID = EnemyId.from("reef-guardian");
export const ABYSSAL_WARDEN_ENEMY_ID = EnemyId.from("abyssal-warden");
export const TIDAL_SOVEREIGN_BOSS_ID = EnemyId.from("tidal-sovereign-boss");

export const COMBAT_SLICE_ENEMIES: readonly EnemyDefinition[] = [
  // ---- Vulkankrater / Fire — burst, offense, fast pressure ----
  {
    enemyId: EMBER_WISP_ENEMY_ID,
    displayName: "Ember Wisp",
    isBoss: false,
    elementId: "fire",
    stats: {
      hp: 90,
      attack: 16,
      defense: 4,
      attackSpeed: 90,
      critChanceBps: toProbabilityBps(300),
      critDamageBps: toBasisPoints(15_000),
      comboChanceBps: toProbabilityBps(0),
      counterChanceBps: toProbabilityBps(0),
      guardBps: toBasisPoints(0),
      evasionBps: toProbabilityBps(600),
      accuracyBps: toProbabilityBps(9_000),
      skillPower: 6,
      skillHasteBps: toBasisPoints(0),
      elementalPower: 4,
      elementalResistance: 2,
    },
  },
  {
    enemyId: CINDER_HOUND_ENEMY_ID,
    displayName: "Cinder Hound",
    isBoss: false,
    elementId: "fire",
    stats: {
      hp: 140,
      attack: 22,
      defense: 8,
      attackSpeed: 120,
      critChanceBps: toProbabilityBps(600),
      critDamageBps: toBasisPoints(15_000),
      comboChanceBps: toProbabilityBps(1_000),
      counterChanceBps: toProbabilityBps(0),
      guardBps: toBasisPoints(0),
      evasionBps: toProbabilityBps(400),
      accuracyBps: toProbabilityBps(9_200),
      skillPower: 8,
      skillHasteBps: toBasisPoints(0),
      elementalPower: 5,
      elementalResistance: 3,
    },
  },
  {
    enemyId: MAGMA_SENTRY_ENEMY_ID,
    displayName: "Magma Sentry",
    isBoss: false,
    elementId: "fire",
    stats: {
      hp: 220,
      attack: 26,
      defense: 16,
      attackSpeed: 80,
      critChanceBps: toProbabilityBps(300),
      critDamageBps: toBasisPoints(15_000),
      comboChanceBps: toProbabilityBps(0),
      counterChanceBps: toProbabilityBps(1_000),
      guardBps: toBasisPoints(2_000),
      evasionBps: toProbabilityBps(200),
      accuracyBps: toProbabilityBps(9_000),
      skillPower: 10,
      skillHasteBps: toBasisPoints(0),
      elementalPower: 6,
      elementalResistance: 6,
    },
  },
  {
    enemyId: VULKAN_WARDEN_BOSS_ID,
    displayName: "Vulkan Warden",
    isBoss: true,
    bossArchetype: "SUSTAIN_CHECK",
    elementId: "fire",
    stats: {
      hp: 520,
      attack: 34,
      defense: 20,
      attackSpeed: 100,
      critChanceBps: toProbabilityBps(500),
      critDamageBps: toBasisPoints(16_000),
      comboChanceBps: toProbabilityBps(1_000),
      counterChanceBps: toProbabilityBps(1_500),
      guardBps: toBasisPoints(3_000),
      evasionBps: toProbabilityBps(300),
      accuracyBps: toProbabilityBps(9_400),
      skillPower: 16,
      skillHasteBps: toBasisPoints(1_000),
      elementalPower: 10,
      elementalResistance: 8,
    },
  },

  // ---- Ozean / Water — sustain, continuity, recovery, tempo ----
  {
    enemyId: TIDE_SPRITE_ENEMY_ID,
    displayName: "Tide Sprite",
    isBoss: false,
    elementId: "water",
    stats: {
      hp: 160,
      attack: 14,
      defense: 10,
      attackSpeed: 100,
      critChanceBps: toProbabilityBps(200),
      critDamageBps: toBasisPoints(15_000),
      comboChanceBps: toProbabilityBps(0),
      counterChanceBps: toProbabilityBps(1_000),
      guardBps: toBasisPoints(1_500),
      evasionBps: toProbabilityBps(500),
      accuracyBps: toProbabilityBps(9_000),
      skillPower: 6,
      skillHasteBps: toBasisPoints(500),
      elementalPower: 5,
      elementalResistance: 6,
    },
  },
  {
    enemyId: REEF_GUARDIAN_ENEMY_ID,
    displayName: "Reef Guardian",
    isBoss: false,
    elementId: "water",
    stats: {
      hp: 260,
      attack: 18,
      defense: 18,
      attackSpeed: 85,
      critChanceBps: toProbabilityBps(200),
      critDamageBps: toBasisPoints(15_000),
      comboChanceBps: toProbabilityBps(0),
      counterChanceBps: toProbabilityBps(1_800),
      guardBps: toBasisPoints(2_800),
      evasionBps: toProbabilityBps(300),
      accuracyBps: toProbabilityBps(8_800),
      skillPower: 8,
      skillHasteBps: toBasisPoints(500),
      elementalPower: 6,
      elementalResistance: 9,
    },
  },
  {
    enemyId: ABYSSAL_WARDEN_ENEMY_ID,
    displayName: "Abyssal Warden",
    isBoss: false,
    elementId: "water",
    stats: {
      hp: 320,
      attack: 22,
      defense: 22,
      attackSpeed: 90,
      critChanceBps: toProbabilityBps(300),
      critDamageBps: toBasisPoints(15_000),
      comboChanceBps: toProbabilityBps(500),
      counterChanceBps: toProbabilityBps(2_000),
      guardBps: toBasisPoints(3_200),
      evasionBps: toProbabilityBps(300),
      accuracyBps: toProbabilityBps(9_000),
      skillPower: 12,
      skillHasteBps: toBasisPoints(1_000),
      elementalPower: 8,
      elementalResistance: 10,
    },
  },
  {
    enemyId: TIDAL_SOVEREIGN_BOSS_ID,
    displayName: "Tidal Sovereign",
    isBoss: true,
    bossArchetype: "MULTI_HIT_COUNTER_CHECK",
    elementId: "water",
    stats: {
      hp: 780,
      attack: 30,
      defense: 28,
      attackSpeed: 95,
      critChanceBps: toProbabilityBps(400),
      critDamageBps: toBasisPoints(15_500),
      comboChanceBps: toProbabilityBps(1_000),
      counterChanceBps: toProbabilityBps(2_500),
      guardBps: toBasisPoints(4_000),
      evasionBps: toProbabilityBps(400),
      accuracyBps: toProbabilityBps(9_200),
      skillPower: 18,
      skillHasteBps: toBasisPoints(1_500),
      elementalPower: 14,
      elementalResistance: 14,
    },
  },
];
