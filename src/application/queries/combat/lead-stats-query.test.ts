// @vitest-environment node
//
// Design owner: docs/rebuild/15 Phases R4/R5 Exit Gates. Proves, against
// the real production catalog: the three Battle Paths behave materially
// differently against the same boss; changing the Lead changes combat;
// adding/removing Bond Support changes combat via genuinely different
// per-behavior stat targets (not a generic flat card); evolution changes
// combat output; and none of this mutates canonical Catchmon identity.
import { describe, expect, it } from "vitest";
import { toSeed, createRandomSource } from "../../../core/random/index.ts";
import {
  type CatchmonSpeciesId,
  type OwnedCatchmonId,
} from "../../../core/ids/index.ts";
import {
  createAscensionTestCatalog,
  FakeClock,
  TEST_LEAD_STATS_CONFIG,
} from "../../../test/helpers/index.ts";
import { simulateBattle } from "../../../domain/combat/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { VULKAN_WARDEN_BOSS_ID } from "../../../content/combat-slice/enemies.ts";
import {
  AERORION_SPECIES_ID,
  AQUILOR_SPECIES_ID,
  EMBERYNN_SPECIES_ID,
  FLAMAROX_SPECIES_ID,
  FLAMERON_SPECIES_ID,
} from "../../../content/vertical-slice/catchmonContent.ts";
import { deriveLeadCombatStats } from "./lead-stats-query.ts";

const catalog = createAscensionTestCatalog();
const config = { leadStatsConfig: TEST_LEAD_STATS_CONFIG };
const boss = catalog.enemies.get(VULKAN_WARDEN_BOSS_ID)!;

function baseState(): GameState {
  return createInitialGameState(catalog, new FakeClock(0), toSeed(11));
}

function findOwnedIdForSpecies(
  state: GameState,
  speciesId: CatchmonSpeciesId,
): OwnedCatchmonId {
  const id = state.catchmons.ownedCatchmonIds.find(
    (ownedId) =>
      state.catchmons.ownedCatchmons[ownedId]!.currentSpeciesId === speciesId,
  );
  if (!id)
    throw new Error(`No starter owned Catchmon for species ${speciesId}`);
  return id;
}

function withLead(
  state: GameState,
  ownedCatchmonId: OwnedCatchmonId,
): GameState {
  const owned = state.catchmons.ownedCatchmons[ownedCatchmonId]!;
  return {
    ...state,
    loadout: { ...state.loadout, leadCatchmonId: owned.ownedCatchmonId },
    catchmons: {
      ...state.catchmons,
      ownedCatchmons: {
        ...state.catchmons.ownedCatchmons,
        [owned.ownedCatchmonId]: {
          ...owned,
          currentAssignment: { kind: "LEAD" },
        },
      },
    },
  };
}

describe("deriveLeadCombatStats — canonical identity untouched", () => {
  it("never mutates the canonical species/line catalog", () => {
    const speciesBefore = JSON.parse(
      JSON.stringify(catalog.catchmonSpecies.get(FLAMAROX_SPECIES_ID)),
    );
    const state = withLead(
      baseState(),
      findOwnedIdForSpecies(baseState(), FLAMAROX_SPECIES_ID),
    );
    deriveLeadCombatStats(state, catalog, config.leadStatsConfig);
    expect(catalog.catchmonSpecies.get(FLAMAROX_SPECIES_ID)).toEqual(
      speciesBefore,
    );
  });
});

describe("Battle Path differentiation (docs/rebuild/15 Phase R4 exit gate)", () => {
  it("Breaker, Warden and Weaver produce materially different battle outcomes against the same boss", () => {
    const state = withLead(
      baseState(),
      findOwnedIdForSpecies(baseState(), FLAMAROX_SPECIES_ID),
    );
    const seed = toSeed(55);

    const results = (["BREAKER", "WARDEN", "WEAVER"] as const).map((pathId) => {
      const pathState: GameState = {
        ...state,
        loadout: { ...state.loadout, battlePathId: pathId },
      };
      const stats = deriveLeadCombatStats(
        pathState,
        catalog,
        config.leadStatsConfig,
      )!;
      const result = simulateBattle(
        stats,
        boss.stats,
        createRandomSource(seed),
        { maxRounds: 100 },
      );
      if (!result.ok) throw new Error("expected a valid battle result");
      return { pathId, ...result.value };
    });

    // Materially different: not all three produce the identical damage
    // profile against the identical boss with the identical seed.
    const damageDealtValues = results.map((r) => r.totalDamageDealt);
    const uniqueDamageValues = new Set(damageDealtValues);
    expect(uniqueDamageValues.size).toBeGreaterThan(1);

    const roundsValues = results.map((r) => r.rounds);
    expect(
      new Set(roundsValues).size + uniqueDamageValues.size,
    ).toBeGreaterThan(2);
  });
});

describe("Lead / Bond Support / Evolution combat effects (docs/rebuild/15 Phase R5 exit gate)", () => {
  it("changing the Lead changes the derived combat stats", () => {
    const state = baseState();
    const flamaroxOwnedId = findOwnedIdForSpecies(state, FLAMAROX_SPECIES_ID);
    const aquilorOwnedId = findOwnedIdForSpecies(state, AQUILOR_SPECIES_ID);
    const flamaroxOwned = state.catchmons.ownedCatchmons[flamaroxOwnedId]!;
    const aquilorOwned = state.catchmons.ownedCatchmons[aquilorOwnedId]!;

    // Give them different levels so the effect is unambiguous.
    const leveledFlamarox: GameState = {
      ...state,
      loadout: { ...state.loadout, leadCatchmonId: flamaroxOwnedId },
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [flamaroxOwnedId]: {
            ...flamaroxOwned,
            level: 20,
            currentAssignment: { kind: "LEAD" },
          },
        },
      },
    };
    const leveledAquilor: GameState = {
      ...state,
      loadout: { ...state.loadout, leadCatchmonId: aquilorOwnedId },
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [aquilorOwnedId]: {
            ...aquilorOwned,
            level: 5,
            currentAssignment: { kind: "LEAD" },
          },
        },
      },
    };

    const statsA = deriveLeadCombatStats(
      leveledFlamarox,
      catalog,
      config.leadStatsConfig,
    )!;
    const statsB = deriveLeadCombatStats(
      leveledAquilor,
      catalog,
      config.leadStatsConfig,
    )!;
    expect(statsA.attack).not.toBe(statsB.attack);
    expect(statsA.hp).not.toBe(statsB.hp);
  });

  it("adding a Bond Support changes stats, and different behaviors target different stats (not a generic flat card)", () => {
    const state = baseState();
    const leadId = findOwnedIdForSpecies(state, FLAMAROX_SPECIES_ID);
    const withLeadState = withLead(state, leadId);

    const withoutSupport = deriveLeadCombatStats(
      withLeadState,
      catalog,
      config.leadStatsConfig,
    )!;

    const emberynnId = findOwnedIdForSpecies(state, EMBERYNN_SPECIES_ID); // CRIT_MARK -> critChanceBps
    const aerorionId = findOwnedIdForSpecies(state, AERORION_SPECIES_ID); // ELEMENTAL_PRIMER -> elementalPower

    function withSupport(supportId: OwnedCatchmonId): GameState {
      const owned = withLeadState.catchmons.ownedCatchmons[supportId]!;
      return {
        ...withLeadState,
        loadout: {
          ...withLeadState.loadout,
          bondSupportCatchmonIds: [owned.ownedCatchmonId],
        },
        catchmons: {
          ...withLeadState.catchmons,
          ownedCatchmons: {
            ...withLeadState.catchmons.ownedCatchmons,
            [owned.ownedCatchmonId]: {
              ...owned,
              currentAssignment: { kind: "BOND_SUPPORT", slotIndex: 0 },
              bondLevel: 3,
            },
          },
        },
      };
    }

    const withCritSupport = deriveLeadCombatStats(
      withSupport(emberynnId),
      catalog,
      config.leadStatsConfig,
    )!;
    const withElementalSupport = deriveLeadCombatStats(
      withSupport(aerorionId),
      catalog,
      config.leadStatsConfig,
    )!;

    // Adding support changes stats at all.
    expect(withCritSupport.critChanceBps).toBeGreaterThan(
      withoutSupport.critChanceBps,
    );
    expect(withElementalSupport.elementalPower).toBeGreaterThan(
      withoutSupport.elementalPower,
    );

    // Different behaviors hit different stats — not the same generic bump.
    expect(withCritSupport.critChanceBps).toBeGreaterThan(
      withElementalSupport.critChanceBps,
    );
    expect(withElementalSupport.elementalPower).toBeGreaterThan(
      withCritSupport.elementalPower,
    );
  });

  it("evolving the Lead changes derived combat stats", () => {
    const state = baseState();
    const ownedId = findOwnedIdForSpecies(state, FLAMAROX_SPECIES_ID);
    const withLeadState = withLead(state, ownedId);
    const owned = withLeadState.catchmons.ownedCatchmons[ownedId]!;

    const baseStats = deriveLeadCombatStats(
      withLeadState,
      catalog,
      config.leadStatsConfig,
    )!;

    const evolvedState: GameState = {
      ...withLeadState,
      catchmons: {
        ...withLeadState.catchmons,
        ownedCatchmons: {
          ...withLeadState.catchmons.ownedCatchmons,
          [ownedId]: { ...owned, currentSpeciesId: FLAMERON_SPECIES_ID },
        },
      },
    };
    const evolvedStats = deriveLeadCombatStats(
      evolvedState,
      catalog,
      config.leadStatsConfig,
    )!;

    expect(evolvedStats.attack).toBeGreaterThan(baseStats.attack);
    expect(evolvedStats.hp).toBeGreaterThan(baseStats.hp);
  });
});
