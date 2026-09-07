/**
 * Design owner: Document 15 Phase 11 Task 11.7 ("Use provisional slice
 * balance") — mirrors `app/game-config.ts`'s `buildGameConfig` shape
 * exactly, reusing every `PROVISIONAL_*` numeric constant directly from
 * `content/vertical-slice/balance.ts` (Phase 11 tests scale, not new
 * balance) and substituting only the catalog-shape-specific fields
 * (station/display/customer/route/infrastructure IDs) with their
 * scale-fixture equivalents.
 */
import { type GameCatalog } from "../../domain/catalog/index.ts";
import {
  type DisplaySlotId,
  type InfrastructureId,
  type ProductId,
} from "../../core/ids/index.ts";
import {
  PROVISIONAL_BASE_CAPTURE_CHANCE,
  PROVISIONAL_CAPTURE_AID_BONUS,
  PROVISIONAL_CAPTURE_CHANCE_CEILING,
  PROVISIONAL_CAPTURE_CHANCE_FLOOR,
  PROVISIONAL_CAPTURE_PROTECTION_BONUS_PER_FAILURE,
  PROVISIONAL_CATCHMON_LEVEL_CAP,
  PROVISIONAL_COMPONENT_HUNT_BONUS_CHANCE,
  PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
  PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
  PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
  PROVISIONAL_MAX_ACTIVE_ORDERS,
  PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
  PROVISIONAL_MAX_QUEUE_SIZE,
  PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
  PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
  PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS,
  PROVISIONAL_OBSERVE_ENCOUNTER_REWARD_QUANTITY,
  PROVISIONAL_RANK_PROGRESS_PER_CAPTURE,
  PROVISIONAL_RANK_PROGRESS_PER_CRAFT_COMPLETION,
  PROVISIONAL_RANK_PROGRESS_PER_EXPEDITION_COMPLETION,
  PROVISIONAL_RANK_PROGRESS_PER_RANK,
  PROVISIONAL_SHOP_RANK_CAP,
  PROVISIONAL_XP_PER_CRAFT_COMPLETION,
  PROVISIONAL_XP_PER_EXPEDITION_COMPLETION,
  PROVISIONAL_XP_PER_LEVEL,
  PROVISIONAL_XP_PER_SALE_RESOLUTION,
} from "../vertical-slice/balance.ts";
import { PROVISIONAL_EXPEDITION_ECHO_CHARGE_REWARD } from "../combat-slice/balance.ts";
import { SCALE_STATION_ARCHETYPE_MAP } from "./stations.ts";
import {
  SCALE_CUSTOMER_ARCHETYPES,
  SCALE_PRIMARY_INFRASTRUCTURE_ID,
} from "./shop.ts";
import { SCALE_CAPABILITY_MAGNITUDES } from "./catchmons.ts";
import { SCALE_PRODUCTS, SCALE_RESOURCES } from "./crafting.ts";
import { SCALE_ROUTES, SCALE_ROUTE_DURATION_MS } from "./world.ts";
import { displaySlotIdForIndex, SCALE_DISPLAY_SLOT_COUNT } from "./manifest.ts";

export const SCALE_DISPLAY_SLOT_IDS: readonly DisplaySlotId[] = Array.from(
  { length: SCALE_DISPLAY_SLOT_COUNT },
  (_, i) => displaySlotIdForIndex(i + 1),
);

/** Gate the last display slot behind the primary scale infrastructure entry — proves the same unlock-requirement wiring the Vertical Slice's 3rd slot exercises, at a different slot count. */
export const SCALE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS: Readonly<
  Record<DisplaySlotId, InfrastructureId>
> = {
  [SCALE_DISPLAY_SLOT_IDS[SCALE_DISPLAY_SLOT_IDS.length - 1]!]:
    SCALE_PRIMARY_INFRASTRUCTURE_ID,
};

const SCALE_SHOP_FLOOR_SUPPORT_SLOT_ID = "scale-shop-floor-slot-01";

function findCaptureAidProductId(): ProductId {
  const candidate = SCALE_PRODUCTS.find(
    (p) =>
      p.family === "CAPTURE_AND_DISCOVERY_GEAR" && p.playerUse !== undefined,
  );
  if (!candidate) {
    throw new Error(
      "scale-fixture gameConfig.ts expected at least one CAPTURE_AND_DISCOVERY_GEAR product with playerUse set",
    );
  }
  return candidate.productId;
}

export function buildScaleGameConfig(catalog: GameCatalog) {
  const resourceOne = catalog.resources.get(SCALE_RESOURCES[0]!.resourceId);
  if (!resourceOne) {
    throw new Error(
      "scale-fixture gameConfig.ts expected SCALE_RESOURCES[0] to exist in the catalog",
    );
  }

  const saleXpConfig = {
    xpPerSaleResolution: PROVISIONAL_XP_PER_SALE_RESOLUTION,
    xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
    levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
  };

  return {
    stationArchetypes: SCALE_STATION_ARCHETYPE_MAP,
    displaySlotIds: SCALE_DISPLAY_SLOT_IDS,
    maxQueueSize: PROVISIONAL_MAX_QUEUE_SIZE,
    catchmonCapabilityMagnitudes: SCALE_CAPABILITY_MAGNITUDES,
    maxWorkshopSupportPerStation: PROVISIONAL_MAX_WORKSHOP_SUPPORT_PER_STATION,
    shopFloorSupportSlotId: SCALE_SHOP_FLOOR_SUPPORT_SLOT_ID,
    maxShopFloorSupportSlots: PROVISIONAL_MAX_SHOP_FLOOR_SUPPORT_SLOTS,
    evolutionLevelRequirement: PROVISIONAL_EVOLUTION_LEVEL_REQUIREMENT,
    displaySlotUnlockRequirements: SCALE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
    customerArchetypes: SCALE_CUSTOMER_ARCHETYPES,
    maxActiveCustomers: PROVISIONAL_MAX_ACTIVE_CUSTOMERS,
    minArrivalIntervalMs: PROVISIONAL_MIN_ARRIVAL_INTERVAL_MS,
    saleXpConfig,
    maxActiveOrders: PROVISIONAL_MAX_ACTIVE_ORDERS,
    expeditionHubInfrastructureId: SCALE_PRIMARY_INFRASTRUCTURE_ID,
    captureAidProductId: findCaptureAidProductId(),
    routeDurationMsByRouteId: SCALE_ROUTE_DURATION_MS,
    maxConcurrentExpeditions: PROVISIONAL_MAX_CONCURRENT_EXPEDITIONS,
    captureChanceConfig: {
      base: PROVISIONAL_BASE_CAPTURE_CHANCE,
      aidBonus: PROVISIONAL_CAPTURE_AID_BONUS,
      protectionBonusPerFailure:
        PROVISIONAL_CAPTURE_PROTECTION_BONUS_PER_FAILURE,
      floor: PROVISIONAL_CAPTURE_CHANCE_FLOOR,
      ceiling: PROVISIONAL_CAPTURE_CHANCE_CEILING,
    },
    captureRankProgressConfig: {
      progressPerCapture: PROVISIONAL_RANK_PROGRESS_PER_CAPTURE,
      progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
      rankCap: PROVISIONAL_SHOP_RANK_CAP,
    },
    observeRewardItemId: resourceOne.itemId,
    observeRewardQuantity: PROVISIONAL_OBSERVE_ENCOUNTER_REWARD_QUANTITY,
    craftXpConfig: {
      xpPerCraftCompletion: PROVISIONAL_XP_PER_CRAFT_COMPLETION,
      xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
      levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
    },
    craftRankProgressConfig: {
      progressPerCraftCompletion:
        PROVISIONAL_RANK_PROGRESS_PER_CRAFT_COMPLETION,
      progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
      rankCap: PROVISIONAL_SHOP_RANK_CAP,
    },
    expeditionRewardConfig: {
      // Mechanical adaptation to the per-route reward shape (Ozean Batch
      // A) — every scale route still grants the exact same resource as
      // before, just expressed as a per-route map instead of one shared
      // field. Not new scale-fixture content.
      routineRewardResourceIdByRouteId: Object.fromEntries(
        SCALE_ROUTES.map((route) => [
          route.routeId,
          SCALE_RESOURCES[0]!.resourceId,
        ]),
      ),
      routineRewardQuantityByRouteId: Object.fromEntries(
        SCALE_ROUTES.map((route) => [route.routeId, 2]),
      ),
      componentHuntBonusChance: PROVISIONAL_COMPONENT_HUNT_BONUS_CHANCE,
      componentHuntProtectionThreshold:
        PROVISIONAL_COMPONENT_HUNT_PROTECTION_THRESHOLD,
      echoChargeRewardPerCompletion: PROVISIONAL_EXPEDITION_ECHO_CHARGE_REWARD,
    },
    expeditionXpConfig: {
      xpPerExpeditionCompletion: PROVISIONAL_XP_PER_EXPEDITION_COMPLETION,
      xpPerLevel: PROVISIONAL_XP_PER_LEVEL,
      levelCap: PROVISIONAL_CATCHMON_LEVEL_CAP,
    },
    expeditionRankProgressConfig: {
      progressPerExpeditionCompletion:
        PROVISIONAL_RANK_PROGRESS_PER_EXPEDITION_COMPLETION,
      progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
      rankCap: PROVISIONAL_SHOP_RANK_CAP,
    },
  };
}

export type ScaleGameConfig = ReturnType<typeof buildScaleGameConfig>;
