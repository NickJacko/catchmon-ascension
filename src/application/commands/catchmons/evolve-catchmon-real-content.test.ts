// @vitest-environment node
//
// Design owner: post-Phase-5 integration of `reference/catchmons/
// evolution_lines.json`. Task 05.9's evolution shell was originally
// architecture/tests-only against a synthetic fixture because no real
// evolution data existed for any of the 6 selected Catchmons. Now that
// `evolution_lines.json` resolves real, unambiguous chains for 4 of the
// 6 (Flamarox, Emberynn, Aquilor, Geckon), this proves the SAME command
// evolves a REAL owned Catchmon into a REAL, catalog-registered next
// stage — the synthetic-fixture test (`evolve-catchmon.test.ts`) is kept
// alongside this one since it still independently validates the generic
// mechanism/idempotency in isolation from any specific content.
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import { FakeClock } from "../../../test/helpers/index.ts";
import { createGameCatalog } from "../../../domain/catalog/index.ts";
import {
  createInitialGameState,
  deriveInitialOwnedCatchmonId,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../engine/index.ts";
import {
  DRACOGOLD_SPECIES_ID,
  FLAMAROX_SPECIES_ID,
  FLAMERON_SPECIES_ID,
  GECKON_SPECIES_ID,
  HYDROSCYTHE_SPECIES_ID,
  PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
  REPTORAX_SPECIES_ID,
  VERTICAL_SLICE_CATALOG_CONTENT,
} from "../../../content/vertical-slice/index.ts";
import { createEvolveCatchmonHandler } from "./evolve-catchmon.ts";

const catalog = createGameCatalog(VERTICAL_SLICE_CATALOG_CONTENT);
const evolveCatchmon = createEvolveCatchmonHandler(
  catalog,
  PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
);

function stateWithFlamaroxAtLevel(level: number) {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
  const ownedId = deriveInitialOwnedCatchmonId(FLAMAROX_SPECIES_ID);
  const owned = state.catchmons.ownedCatchmons[ownedId]!;
  return {
    ownedId,
    state: {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [ownedId]: { ...owned, level },
        },
      },
    },
  };
}

describe("EVOLVE_CATCHMON against real vertical-slice content", () => {
  it("evolves the real owned Flamarox into the real, catalog-registered Flameron", () => {
    const { ownedId, state } = stateWithFlamaroxAtLevel(
      PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
    );
    const result = evolveCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-evolve"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: ownedId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const evolved = result.value.nextState.catchmons.ownedCatchmons[ownedId]!;
    expect(evolved.currentSpeciesId).toBe(FLAMERON_SPECIES_ID);
    expect(evolved.evolutionReadiness).toBe("EVOLVED");
    expect(catalog.catchmonSpecies.get(FLAMERON_SPECIES_ID)).toBeDefined();
  });

  it("fails with LEVEL_REQUIREMENT_NOT_MET below the real provisional threshold", () => {
    const { ownedId, state } = stateWithFlamaroxAtLevel(1);
    const result = evolveCatchmon(
      state,
      createCommand(
        CommandId.from("cmd-evolve"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: ownedId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("LEVEL_REQUIREMENT_NOT_MET");
  });

  it("fails with NO_EVOLUTION_TARGET for a genuinely terminal real species (Hydroscythe)", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const ownedId = deriveInitialOwnedCatchmonId(HYDROSCYTHE_SPECIES_ID);
    const owned = state.catchmons.ownedCatchmons[ownedId]!;
    const leveled = {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [ownedId]: {
            ...owned,
            level: PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
          },
        },
      },
    };
    const result = evolveCatchmon(
      leveled,
      createCommand(
        CommandId.from("cmd-evolve"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: ownedId },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("NO_EVOLUTION_TARGET");
  });

  it("evolves Geckon two real hops in sequence: Geckon -> Reptorax -> Dracogold", () => {
    const state = createInitialGameState(catalog, new FakeClock(0), toSeed(1));
    const ownedId = deriveInitialOwnedCatchmonId(GECKON_SPECIES_ID);
    const owned = state.catchmons.ownedCatchmons[ownedId]!;
    const leveled = {
      ...state,
      catchmons: {
        ...state.catchmons,
        ownedCatchmons: {
          ...state.catchmons.ownedCatchmons,
          [ownedId]: {
            ...owned,
            level: PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
          },
        },
      },
    };

    const first = evolveCatchmon(
      leveled,
      createCommand(
        CommandId.from("cmd-evolve-1"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: ownedId },
        new FakeClock(0),
      ),
    );
    expect(first.ok).toBe(true);
    if (!first.ok) return;
    expect(
      first.value.nextState.catchmons.ownedCatchmons[ownedId]!.currentSpeciesId,
    ).toBe(REPTORAX_SPECIES_ID);

    const second = evolveCatchmon(
      first.value.nextState,
      createCommand(
        CommandId.from("cmd-evolve-2"),
        "EVOLVE_CATCHMON",
        { ownedCatchmonId: ownedId },
        new FakeClock(0),
      ),
    );
    expect(second.ok).toBe(true);
    if (!second.ok) return;
    const final = second.value.nextState.catchmons.ownedCatchmons[ownedId]!;
    expect(final.currentSpeciesId).toBe(DRACOGOLD_SPECIES_ID);
    expect(final.evolutionReadiness).toBe("EVOLVED");
  });
});
