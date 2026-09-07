/**
 * Design owner: 14 Technical Architecture — §150 Save Fixtures ("Keep
 * representative historical saves in test fixtures. Every new schema
 * version runs all prior fixtures through migrations").
 *
 * Deliberately a hand-specified literal, NOT built by calling
 * `createInitialGameState()` here. A fixture generated from the live
 * factory would silently track any future shape change instead of
 * representing a frozen historical save — the first time a v2 migration
 * is added, this file must still describe exactly what a v1 save looked
 * like, unaffected by whatever v1's factory becomes.
 *
 * docs/rebuild/15 Phases R2-R5: `journey`/`loadout`/`forge`/
 * `relicInventory`/`skills` were added to `GameState` here, with their
 * empty defaults, WITHOUT bumping `GAME_STATE_SCHEMA_VERSION` — no real
 * schema-versioning mechanism exists yet to represent an envelope typed
 * to an *older* `GameState` shape than the current one (`Migration.migrate`
 * is typed `SaveEnvelope -> SaveEnvelope`, i.e. always the current shape;
 * building a genuinely versioned type system is a real, separate
 * architecture task, not invented here). Per
 * docs/rebuild/R1_DEPENDENCY_AUDIT.md §5.3, no real Ascension save has
 * shipped under any schema yet, so this is still free, pre-launch
 * restructuring — "v1" simply grew new always-present fields, exactly as
 * `createInitialGameState` now produces them. `MIGRATIONS` stays empty;
 * this fixture's job (proving a *frozen literal* survives migration +
 * `validateGameState` unchanged) still holds.
 */
import { SaveId } from "../../../../core/ids/index.ts";
import { toCoins } from "../../../../core/math/index.ts";
import {
  INITIAL_RANDOM_EVENT_COUNTER,
  toSeed,
} from "../../../../core/random/index.ts";
import { toTimestampMs } from "../../../../core/time/index.ts";
import { APP_VERSION, type SaveEnvelope } from "../../save-envelope.ts";

export function createV1BaselineFixture(): SaveEnvelope {
  const saveId = SaveId.from("save-v1-baseline-fixture");

  return {
    saveId,
    schemaVersion: 1,
    appVersion: APP_VERSION,
    contentVersion: 1,
    revision: 3,
    savedAtMs: 1_700_000_050_000,
    gameState: {
      meta: {
        saveId,
        schemaVersion: 1,
        createdAtMs: toTimestampMs(1_700_000_000_000),
        updatedAtMs: toTimestampMs(1_700_000_050_000),
        lastActiveAtMs: toTimestampMs(1_700_000_050_000),
        revision: 3,
        rootRandomSeed: toSeed(12345),
        randomEventCounter: INITIAL_RANDOM_EVENT_COUNTER,
        contentVersion: 1,
      },
      economy: { coins: toCoins(120) },
      inventory: { stacks: {}, reservations: {} },
      shop: { momentum: 5, displaySlots: {}, shopFloorSupportCatchmonIds: [] },
      crafting: { stations: {} },
      customers: { activeCustomerIds: [], customers: {} },
      orders: { activeOrderIds: [], orders: {} },
      catchmons: { ownedCatchmonIds: [], ownedCatchmons: {} },
      expeditions: { activeExpeditionIds: [], expeditions: {} },
      world: {
        unlockedRegionIds: [],
        routeStates: {},
        discoveryStates: {},
        traceProgress: {},
        encounterProtection: {},
        captureProtection: {},
        regionMilestones: {},
        encounterOpportunities: {},
        componentHuntBonusProtection: {},
      },
      progression: {
        rank: 1,
        rankProgress: 0,
        journeyRank: 1,
        journeyRankProgress: 0,
        earnedMilestoneIds: [],
        unlockedSystemIds: [],
      },
      infrastructure: {
        ownedInfrastructureIds: [],
        upgradeLevels: {},
        activeConstructions: [],
      },
      journey: {
        currentStageIndex: 0,
        clearedStageIds: [],
        stableFarmStageIndex: -1,
      },
      loadout: {
        bondSupportCatchmonIds: [],
        equippedSkillIds: [],
        relicMatrix: {},
      },
      forge: { echoCharges: 0, totalRelicsForged: 0, forgeInsight: 0 },
      relicInventory: { ownedRelicInstanceIds: [], relics: {} },
      skills: { unlockedSkillIds: [] },
    },
  } satisfies SaveEnvelope;
}
