/**
 * Design owner: Document 15 Task 08.1 (Application Providers / Stores);
 * Document 14 §44-52 Domain Command Architecture / Game Engine.
 *
 * The one composition point that registers every real command handler
 * built across Phases 3-7 onto a live `GameEngine`. No gameplay rule is
 * (re)implemented here — this only wires already-tested factories to
 * their command-type string, using the one shared `GameConfig` (see
 * `game-config.ts`) so every handler's PROVISIONAL config traces back to
 * `content/vertical-slice/balance.ts`.
 */
import { type GameCatalog } from "../domain/catalog/index.ts";
import { type GameState } from "../domain/game-state/index.ts";
import { type GameEngine } from "../application/engine/index.ts";
import {
  createAssignCatchmonHandler,
  createEvolveCatchmonHandler,
} from "../application/commands/catchmons/index.ts";
import {
  cancelQueuedCraftHandler,
  createQueueCraftHandler,
  createStartCraftHandler,
  workshopPushHandler,
} from "../application/commands/craft/index.ts";
import { createArriveCustomerHandler } from "../application/commands/customer/index.ts";
import {
  clearDisplaySlotHandler,
  createAssignDisplayProductHandler,
} from "../application/commands/display/index.ts";
import {
  createAttemptCaptureHandler,
  createDeclineEncounterHandler,
  createObserveEncounterHandler,
  createStartExpeditionHandler,
} from "../application/commands/expeditions/index.ts";
import {
  createForgeRelicHandler,
  createRecycleRelicHandler,
  equipRelicHandler,
  setRelicLockedHandler,
} from "../application/commands/forge/index.ts";
import { createAttemptStageHandler } from "../application/commands/journey/index.ts";
import {
  assignBondSupportHandler,
  assignLeadCatchmonHandler,
  createSetSkillLoadoutHandler,
  selectBattlePathHandler,
} from "../application/commands/loadout/index.ts";
import {
  createFavorableDealHandler,
  createPremiumPitchHandler,
  createRecommendHandler,
  createStandardSaleHandler,
  declineHandler,
} from "../application/commands/sale/index.ts";
import { createPurchaseInfrastructureHandler } from "../application/commands/shop-infrastructure/index.ts";
import { type AppGameEvent } from "./game-events.ts";
import { type GameConfig } from "./game-config.ts";
import { createReconcileHandler } from "./reconcile-command.ts";
import { buildReconciliationPasses } from "./reconciliation-passes.ts";

export function registerAllCommands(
  engine: GameEngine<GameState, AppGameEvent>,
  catalog: GameCatalog,
  config: GameConfig,
): void {
  engine.registerHandler(
    "RECONCILE",
    createReconcileHandler(catalog, buildReconciliationPasses(config)),
  );
  engine.registerHandler(
    "START_CRAFT",
    createStartCraftHandler(
      catalog,
      config.stationArchetypes,
      config.catchmonCapabilityMagnitudes,
    ),
  );
  engine.registerHandler(
    "QUEUE_CRAFT",
    createQueueCraftHandler(
      catalog,
      config.stationArchetypes,
      config.maxQueueSize,
    ),
  );
  engine.registerHandler("CANCEL_QUEUED_CRAFT", cancelQueuedCraftHandler);
  engine.registerHandler("WORKSHOP_PUSH", workshopPushHandler);

  engine.registerHandler(
    "ASSIGN_CATCHMON",
    createAssignCatchmonHandler(
      catalog,
      config.stationArchetypes,
      config.maxWorkshopSupportPerStation,
      config.shopFloorSupportSlotId,
      config.maxShopFloorSupportSlots,
    ),
  );
  engine.registerHandler(
    "EVOLVE_CATCHMON",
    createEvolveCatchmonHandler(catalog, config.evolutionLevelRequirement),
  );

  engine.registerHandler(
    "ASSIGN_DISPLAY_PRODUCT",
    createAssignDisplayProductHandler(
      catalog,
      config.displaySlotUnlockRequirements,
    ),
  );
  engine.registerHandler("CLEAR_DISPLAY_SLOT", clearDisplaySlotHandler);

  engine.registerHandler(
    "ARRIVE_CUSTOMER",
    createArriveCustomerHandler(
      catalog,
      config.customerArchetypes,
      config.displaySlotIds,
      config.maxActiveCustomers,
    ),
  );

  engine.registerHandler(
    "STANDARD_SALE",
    createStandardSaleHandler(
      catalog,
      config.displaySlotIds,
      config.saleXpConfig,
    ),
  );
  engine.registerHandler(
    "FAVORABLE_DEAL",
    createFavorableDealHandler(
      catalog,
      config.displaySlotIds,
      config.saleXpConfig,
    ),
  );
  engine.registerHandler(
    "PREMIUM_PITCH",
    createPremiumPitchHandler(
      catalog,
      config.displaySlotIds,
      config.saleXpConfig,
    ),
  );
  engine.registerHandler(
    "RECOMMEND",
    createRecommendHandler(
      catalog,
      config.displaySlotIds,
      config.catchmonCapabilityMagnitudes,
      config.saleXpConfig,
    ),
  );
  engine.registerHandler("DECLINE", declineHandler);

  // ACCEPT_ORDER/COMPLETE_ORDER retired (docs/rebuild/15 Phase R5
  // retirement batch — Everyday Orders had no KEEP/ADAPT dependents; see
  // docs/rebuild/R1_DEPENDENCY_AUDIT.md §5 update).

  engine.registerHandler(
    "START_EXPEDITION",
    createStartExpeditionHandler(
      catalog,
      config.captureAidProductId,
      config.routeDurationMsByRouteId,
      config.maxConcurrentExpeditions,
      config.catchmonCapabilityMagnitudes,
    ),
  );
  engine.registerHandler(
    "ATTEMPT_CAPTURE",
    createAttemptCaptureHandler(
      catalog,
      config.captureChanceConfig,
      config.captureRankProgressConfig,
    ),
  );
  engine.registerHandler("DECLINE_ENCOUNTER", createDeclineEncounterHandler());
  engine.registerHandler(
    "OBSERVE_ENCOUNTER",
    createObserveEncounterHandler(
      config.observeRewardItemId,
      config.observeRewardQuantity,
    ),
  );

  engine.registerHandler(
    "PURCHASE_INFRASTRUCTURE",
    createPurchaseInfrastructureHandler(catalog),
  );

  // ---- docs/rebuild/15 Phases R2-R5 ----
  engine.registerHandler(
    "ATTEMPT_STAGE",
    createAttemptStageHandler(catalog, {
      ...config.attemptStageConfig,
      leadStatsConfig: config.leadStatsConfig,
    }),
  );
  engine.registerHandler(
    "FORGE_RELIC",
    createForgeRelicHandler(catalog, config.forgeRelicConfig),
  );
  engine.registerHandler("EQUIP_RELIC", equipRelicHandler);
  engine.registerHandler(
    "RECYCLE_RELIC",
    createRecycleRelicHandler(config.recycleRelicConfig),
  );
  engine.registerHandler("SET_RELIC_LOCKED", setRelicLockedHandler);
  engine.registerHandler("ASSIGN_LEAD_CATCHMON", assignLeadCatchmonHandler);
  engine.registerHandler("ASSIGN_BOND_SUPPORT", assignBondSupportHandler);
  engine.registerHandler("SELECT_BATTLE_PATH", selectBattlePathHandler);
  engine.registerHandler(
    "SET_SKILL_LOADOUT",
    createSetSkillLoadoutHandler(config.maxEquippedSkills),
  );
}
