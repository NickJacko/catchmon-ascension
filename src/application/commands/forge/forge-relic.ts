/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §2 Echo
 * Charges, §6 Result Decision, §8-9 Forge Level/Insight; docs/rebuild/15
 * Phase R3. The player chooses which Relic Matrix slot's archetype to
 * forge (Document 04 §3's eight working slots) — spends Echo Charges,
 * consumes an Insight guarantee if one has accrued, rolls a fresh
 * deterministic Relic, and advances Forge Level's underlying counter.
 */
import {
  RelicInstanceId,
  type RelicArchetypeId,
} from "../../../core/ids/index.ts";
import {
  createRandomSource,
  deriveSubSeed,
  nextRandomEventCounter,
} from "../../../core/random/index.ts";
import { err, ok } from "../../../core/result/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import {
  consumeInsightGuaranteeIfReady,
  forgeLevelForTotalForges,
  generateRelic,
  type RelicGenerationConfig,
  type RelicRarity,
} from "../../../domain/forge/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type CommandHandler } from "../../engine/index.ts";
import { type ForgeEvent } from "./forge-events.ts";

export interface ForgeRelicPayload {
  readonly relicArchetypeId: RelicArchetypeId;
}

export interface ForgeRelicConfig {
  readonly echoChargeCost: number;
  readonly forgesPerLevel: number;
  readonly forgeLevelCap: number;
  readonly insightGuaranteeThreshold: number;
  readonly insightGuaranteedMinimumRarity: RelicRarity;
  readonly relicGenerationConfig: RelicGenerationConfig;
}

export function createForgeRelicHandler(
  catalog: GameCatalog,
  config: ForgeRelicConfig,
): CommandHandler<GameState, ForgeRelicPayload, ForgeEvent> {
  return (state, command) => {
    const archetype = catalog.relicArchetypes.get(
      command.payload.relicArchetypeId,
    );
    if (!archetype) {
      return err({
        code: "RELIC_ARCHETYPE_NOT_FOUND",
        message: `Unknown Relic archetype "${command.payload.relicArchetypeId}"`,
      });
    }
    if (state.forge.echoCharges < config.echoChargeCost) {
      return err({
        code: "INSUFFICIENT_ECHO_CHARGES",
        message: `Forging requires ${String(config.echoChargeCost)} Echo Charges, have ${String(state.forge.echoCharges)}`,
      });
    }

    const forgeLevel = forgeLevelForTotalForges(
      state.forge.totalRelicsForged,
      config.forgesPerLevel,
      config.forgeLevelCap,
    );
    const insight = consumeInsightGuaranteeIfReady(
      state.forge.forgeInsight,
      config.insightGuaranteeThreshold,
      config.insightGuaranteedMinimumRarity,
    );

    const rollSeed = deriveSubSeed(
      state.meta.rootRandomSeed,
      state.meta.randomEventCounter,
      `FORGE_RELIC:${command.commandId}`,
    );
    const relicInstanceId = RelicInstanceId.from(`relic-${command.commandId}`);
    const relic = generateRelic(
      createRandomSource(rollSeed),
      relicInstanceId,
      archetype,
      forgeLevel,
      config.relicGenerationConfig,
      command.issuedAtMs,
      insight.guaranteedMinimumRarity,
    );

    const nextState: GameState = {
      ...state,
      meta: {
        ...state.meta,
        randomEventCounter: nextRandomEventCounter(
          state.meta.randomEventCounter,
        ),
      },
      forge: {
        echoCharges: state.forge.echoCharges - config.echoChargeCost,
        totalRelicsForged: state.forge.totalRelicsForged + 1,
        forgeInsight: insight.nextInsight,
      },
      relicInventory: {
        ownedRelicInstanceIds: [
          ...state.relicInventory.ownedRelicInstanceIds,
          relicInstanceId,
        ],
        relics: { ...state.relicInventory.relics, [relicInstanceId]: relic },
      },
    };

    return ok({
      nextState,
      events: [
        {
          kind: "RELIC_FORGED",
          relicInstanceId,
          rarity: relic.rarity,
          slot: relic.slot,
          forgeLevel,
        },
      ],
    });
  };
}
