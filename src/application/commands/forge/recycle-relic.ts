/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §7
 * Recycling ("a bad roll still progresses the account"), §9 Forge Insight;
 * docs/rebuild/15 Phase R3. A locked Relic (Document 04 §4 "protected
 * flag") cannot be recycled. Recycling an equipped Relic auto-unequips it
 * first — a deliberate simplification over requiring a separate unequip
 * step, avoiding a dangling `loadout.relicMatrix` reference in one atomic
 * command rather than two.
 */
import { err, ok } from "../../../core/result/index.ts";
import { safeAddCoins, toCoins } from "../../../core/math/index.ts";
import { applyRecycleInsight } from "../../../domain/forge/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ForgeEvent } from "./forge-events.ts";
import { type RelicInstanceId } from "../../../core/ids/index.ts";

export interface RecycleRelicPayload {
  readonly relicInstanceId: RelicInstanceId;
}

export interface RecycleRelicConfig {
  readonly coinsByRarity: Readonly<Record<string, number>>;
  readonly insightGainPerRecycle: number;
}

export function createRecycleRelicHandler(
  config: RecycleRelicConfig,
): CommandHandler<GameState, RecycleRelicPayload, ForgeEvent> {
  return (state, command) => {
    const { relicInstanceId } = command.payload;
    const relic = state.relicInventory.relics[relicInstanceId];
    if (!relic) {
      return err({
        code: "RELIC_NOT_FOUND",
        message: `No owned Relic "${relicInstanceId}"`,
      });
    }
    if (relic.locked) {
      return err({
        code: "RELIC_LOCKED",
        message: `Relic "${relicInstanceId}" is locked and cannot be recycled`,
      });
    }

    const coinsGranted = config.coinsByRarity[relic.rarity] ?? 0;

    const nextRelics = { ...state.relicInventory.relics };
    delete nextRelics[relicInstanceId];

    const wasEquipped =
      state.loadout.relicMatrix[relic.slot] === relicInstanceId;
    const nextRelicMatrix = { ...state.loadout.relicMatrix };
    if (wasEquipped) {
      delete nextRelicMatrix[relic.slot];
    }

    const nextState: GameState = {
      ...state,
      economy: {
        coins: safeAddCoins(state.economy.coins, toCoins(coinsGranted)),
      },
      forge: {
        ...state.forge,
        forgeInsight: applyRecycleInsight(
          state.forge.forgeInsight,
          config.insightGainPerRecycle,
        ),
      },
      relicInventory: {
        ownedRelicInstanceIds:
          state.relicInventory.ownedRelicInstanceIds.filter(
            (id) => id !== relicInstanceId,
          ),
        relics: nextRelics,
      },
      loadout: { ...state.loadout, relicMatrix: nextRelicMatrix },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "RELIC_RECYCLED",
          relicInstanceId,
          rarity: relic.rarity,
          coinsGranted,
        },
      ],
    });
  };
}
