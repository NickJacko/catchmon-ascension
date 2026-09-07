// @vitest-environment node
//
// Design owner: docs/rebuild/15 Phase R3 Exit Gate — the required loop:
// Echo Charge -> FORGE_RELIC -> generated Relic -> compare -> EQUIP or
// RECYCLE -> deterministic progress, against the real production catalog.
import { describe, expect, it } from "vitest";
import { CommandId } from "../../../core/ids/index.ts";
import { toSeed } from "../../../core/random/index.ts";
import {
  createAscensionTestCatalog,
  FakeClock,
  TEST_FORGE_RELIC_CONFIG,
  TEST_RECYCLE_RELIC_CONFIG,
} from "../../../test/helpers/index.ts";
import {
  createInitialGameState,
  type GameState,
} from "../../../domain/game-state/index.ts";
import { createCommand } from "../../engine/index.ts";
import { RELIC_ARCHETYPE_CORE_ID } from "../../../content/combat-slice/relicArchetypes.ts";
import { createForgeRelicHandler } from "./forge-relic.ts";
import { equipRelicHandler } from "./equip-relic.ts";
import { createRecycleRelicHandler } from "./recycle-relic.ts";
import { setRelicLockedHandler } from "./set-relic-locked.ts";

const catalog = createAscensionTestCatalog();
const forgeRelic = createForgeRelicHandler(catalog, TEST_FORGE_RELIC_CONFIG);
const recycleRelic = createRecycleRelicHandler(TEST_RECYCLE_RELIC_CONFIG);

function stateWithEchoCharges(charges: number): GameState {
  const state = createInitialGameState(catalog, new FakeClock(0), toSeed(3));
  return { ...state, forge: { ...state.forge, echoCharges: charges } };
}

describe("Rift Forge loop", () => {
  it("fails clearly with INSUFFICIENT_ECHO_CHARGES when the player can't afford a Forge", () => {
    const state = stateWithEchoCharges(0);
    const result = forgeRelic(
      state,
      createCommand(
        CommandId.from("cmd-forge-poor"),
        "FORGE_RELIC",
        { relicArchetypeId: RELIC_ARCHETYPE_CORE_ID },
        new FakeClock(0),
      ),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("INSUFFICIENT_ECHO_CHARGES");
  });

  it("is deterministic — the same command id always forges the same Relic", () => {
    const state = stateWithEchoCharges(1_000);
    const command = createCommand(
      CommandId.from("cmd-forge-deterministic"),
      "FORGE_RELIC",
      { relicArchetypeId: RELIC_ARCHETYPE_CORE_ID },
      new FakeClock(0),
    );
    const first = forgeRelic(state, command);
    const second = forgeRelic(state, command);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.value.events).toEqual(second.value.events);
    }
  });

  it("full loop: forge a Relic, equip it, then recycling a different Relic still grants deterministic Coins + Insight progress even on a bad roll", () => {
    let state = stateWithEchoCharges(1_000);

    const forged = forgeRelic(
      state,
      createCommand(
        CommandId.from("cmd-forge-1"),
        "FORGE_RELIC",
        { relicArchetypeId: RELIC_ARCHETYPE_CORE_ID },
        new FakeClock(0),
      ),
    );
    expect(forged.ok).toBe(true);
    if (!forged.ok) return;
    state = forged.value.nextState;
    expect(state.forge.echoCharges).toBe(
      1_000 - TEST_FORGE_RELIC_CONFIG.echoChargeCost,
    );
    expect(state.forge.totalRelicsForged).toBe(1);

    const [relicId] = state.relicInventory.ownedRelicInstanceIds;
    expect(relicId).toBeDefined();
    if (!relicId) return;

    const equipped = equipRelicHandler(
      state,
      createCommand(
        CommandId.from("cmd-equip-1"),
        "EQUIP_RELIC",
        { relicInstanceId: relicId },
        new FakeClock(0),
      ),
    );
    expect(equipped.ok).toBe(true);
    if (!equipped.ok) return;
    state = equipped.value.nextState;
    expect(state.loadout.relicMatrix.CORE).toBe(relicId);

    // Forge a second Relic and recycle it — a "bad roll" still produces
    // Coins + Forge Insight (Document 04 §7).
    const forgedSecond = forgeRelic(
      state,
      createCommand(
        CommandId.from("cmd-forge-2"),
        "FORGE_RELIC",
        { relicArchetypeId: RELIC_ARCHETYPE_CORE_ID },
        new FakeClock(0),
      ),
    );
    expect(forgedSecond.ok).toBe(true);
    if (!forgedSecond.ok) return;
    state = forgedSecond.value.nextState;
    const secondRelicId = state.relicInventory.ownedRelicInstanceIds.find(
      (id) => id !== relicId,
    );
    expect(secondRelicId).toBeDefined();
    if (!secondRelicId) return;

    const coinsBefore = state.economy.coins;
    const insightBefore = state.forge.forgeInsight;

    const recycled = recycleRelic(
      state,
      createCommand(
        CommandId.from("cmd-recycle-1"),
        "RECYCLE_RELIC",
        { relicInstanceId: secondRelicId },
        new FakeClock(0),
      ),
    );
    expect(recycled.ok).toBe(true);
    if (!recycled.ok) return;
    state = recycled.value.nextState;

    expect(state.economy.coins).toBeGreaterThanOrEqual(coinsBefore);
    expect(state.forge.forgeInsight).toBeGreaterThan(insightBefore);
    expect(secondRelicId in state.relicInventory.relics).toBe(false);
    // The equipped first Relic must be untouched by recycling the second.
    expect(state.loadout.relicMatrix.CORE).toBe(relicId);
  });

  it("a locked Relic cannot be recycled", () => {
    let state = stateWithEchoCharges(1_000);
    const forged = forgeRelic(
      state,
      createCommand(
        CommandId.from("cmd-forge-lock"),
        "FORGE_RELIC",
        { relicArchetypeId: RELIC_ARCHETYPE_CORE_ID },
        new FakeClock(0),
      ),
    );
    expect(forged.ok).toBe(true);
    if (!forged.ok) return;
    state = forged.value.nextState;
    const [relicId] = state.relicInventory.ownedRelicInstanceIds;
    if (!relicId) return;

    const locked = setRelicLockedHandler(
      state,
      createCommand(
        CommandId.from("cmd-lock"),
        "SET_RELIC_LOCKED",
        { relicInstanceId: relicId, locked: true },
        new FakeClock(0),
      ),
    );
    expect(locked.ok).toBe(true);
    if (!locked.ok) return;
    state = locked.value.nextState;

    const recycleAttempt = recycleRelic(
      state,
      createCommand(
        CommandId.from("cmd-recycle-locked"),
        "RECYCLE_RELIC",
        { relicInstanceId: relicId },
        new FakeClock(0),
      ),
    );
    expect(recycleAttempt.ok).toBe(false);
    if (!recycleAttempt.ok)
      expect(recycleAttempt.error.code).toBe("RELIC_LOCKED");
  });
});
