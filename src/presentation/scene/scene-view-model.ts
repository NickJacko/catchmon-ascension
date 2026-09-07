/**
 * Design owner: Document 15 Task 09.2 (Shop Scene View Model); Document 14
 * §173 Scene View Model, §174 Scene Entity ID, §400 Scene Acceptance
 * Criteria.
 *
 * A pure, headlessly-testable selector: `GameState` + `GameCatalog` ->
 * plain presentation data. This is the ONLY file in `presentation/scene/`
 * allowed to import domain/application — `ShopSceneRenderer.ts` and every
 * `entities/*` file consume only the types exported here (plus Pixi and
 * `core/ids`), never `GameState` itself, matching Document 14 §400's "no
 * domain imports" criterion for the renderer proper. Every entry keeps
 * its real canonical gameplay ID (§174) so a tap can route straight back
 * to a real command/sheet without a second lookup table.
 */
import {
  type AssetId,
  type CustomerArchetypeId,
  type CustomerId,
  type DisplaySlotId,
  type InfrastructureId,
  type OwnedCatchmonId,
  type ProductId,
  type CatchmonSpeciesId,
  type StationId,
} from "../../core/ids/index.ts";
import { type TimestampMs } from "../../core/time/index.ts";
import { type GameCatalog } from "../../domain/catalog/index.ts";
import {
  type CustomerBrowseStatus,
  type GameState,
} from "../../domain/game-state/index.ts";
import { type StationArchetype } from "../../domain/crafting/index.ts";
import {
  deriveShopMacroStage,
  type ShopMacroStage,
} from "../../domain/shop-infrastructure/index.ts";
import { isUnlockRuleSatisfied } from "../../domain/progression/index.ts";
import { getDisplaySlotView } from "../../application/queries/display/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import {
  DISPLAY_FURNITURE_BASE_ID,
  DISPLAY_FURNITURE_SHADOW_ID,
  ENV_SHOP_KEY_FLOOR_ASSET_ID,
  ENV_SHOP_KEY_WALL_ASSET_ID,
  EXPEDITION_HUB_BASE_ASSET_ID,
  EXPEDITION_HUB_SHADOW_ASSET_ID,
  STATION_ASSET_IDS_BY_ARCHETYPE,
  type StationAssetIds,
} from "../../content/vertical-slice/productionAssets.ts";

/** Base/shadow image URLs + floor-contact pivot for one spatial scene object — the same shape reused for stations, display furniture, and the Expedition Hub so `ShopSceneRenderer`/entities consume one pattern (Phase 10 §14: base art + code-driven overlays, not per-object bespoke fields). `undefined` fields mean "no real art yet, render the existing placeholder." */
export interface SceneSpatialArt {
  readonly baseUrl?: string;
  readonly shadowUrl?: string;
  readonly pivot?: { readonly x: number; readonly y: number };
}

function buildSpatialArt(
  catalog: GameCatalog,
  baseAssetId: AssetId,
  shadowAssetId: AssetId,
): SceneSpatialArt {
  const baseAsset = catalog.assets.get(baseAssetId);
  const baseUrl = resolveAssetImageUrl(baseAsset);
  const shadowUrl = resolveAssetImageUrl(catalog.assets.get(shadowAssetId));
  return {
    ...(baseUrl ? { baseUrl } : {}),
    ...(shadowUrl ? { shadowUrl } : {}),
    ...(baseAsset?.pivot ? { pivot: baseAsset.pivot } : {}),
  };
}

export interface SceneStationView {
  readonly stationId: StationId;
  readonly archetype: StationArchetype;
  readonly isCrafting: boolean;
  readonly craftStartedAtMs?: TimestampMs | undefined;
  readonly craftCompletesAtMs?: TimestampMs | undefined;
  readonly queuedCount: number;
  readonly assignedCatchmonIds: readonly OwnedCatchmonId[];
  readonly art?: SceneSpatialArt | undefined;
}

export interface SceneDisplayView {
  readonly displaySlotId: DisplaySlotId;
  readonly locked: boolean;
  readonly productId?: ProductId | undefined;
  readonly quantity: number;
  readonly productImageUrl?: string | undefined;
  readonly art?: SceneSpatialArt | undefined;
}

export interface SceneCustomerView {
  readonly customerId: CustomerId;
  readonly archetypeId: CustomerArchetypeId;
  readonly status: CustomerBrowseStatus;
  readonly hasRequest: boolean;
  readonly portraitUrl?: string | undefined;
}

export type CatchmonSceneZone = "WORKSHOP" | "SHOP_FLOOR";

export interface SceneCatchmonView {
  readonly ownedCatchmonId: OwnedCatchmonId;
  readonly speciesId: CatchmonSpeciesId;
  readonly zone: CatchmonSceneZone;
  readonly stationId?: StationId;
  readonly portraitUrl?: string;
}

export type ExpeditionHubVisualState =
  "LOCKED" | "AVAILABLE" | "UNDER_CONSTRUCTION" | "OWNED";

export interface SceneExpeditionHubView {
  readonly state: ExpeditionHubVisualState;
  readonly hasActiveExpedition: boolean;
  readonly hasUnviewedResult: boolean;
  readonly art?: SceneSpatialArt | undefined;
}

export interface SceneEnvironmentView {
  readonly wallUrl?: string | undefined;
  readonly floorUrl?: string | undefined;
}

export interface ShopSceneViewModel {
  readonly macroStage: ShopMacroStage;
  readonly environment: SceneEnvironmentView;
  readonly stations: readonly SceneStationView[];
  readonly displays: readonly SceneDisplayView[];
  readonly customers: readonly SceneCustomerView[];
  readonly catchmons: readonly SceneCatchmonView[];
  readonly expeditionHub: SceneExpeditionHubView;
}

export interface ShopSceneViewModelOptions {
  readonly stationIds: readonly StationId[];
  /** Static archetype-by-ID map (content config) — a station's runtime `StationState` is lazily created on first use, so this is the fallback for a station that has never been interacted with yet. */
  readonly stationArchetypes: Readonly<Record<StationId, StationArchetype>>;
  readonly displaySlotIds: readonly DisplaySlotId[];
  readonly displaySlotUnlockRequirements: Readonly<
    Record<DisplaySlotId, InfrastructureId>
  >;
  readonly expeditionHubInfrastructureId: InfrastructureId;
}

/** Only the two station archetypes actually content-authored in this slice (CLAUDE.md §32) have real art; a hypothetical third archetype falls back to `undefined` art, which entities render as their existing placeholder. */
function buildStationArt(
  catalog: GameCatalog,
  archetype: StationArchetype,
  isCrafting: boolean,
): SceneSpatialArt | undefined {
  const byArchetype = (
    STATION_ASSET_IDS_BY_ARCHETYPE as Readonly<
      Partial<Record<StationArchetype, StationAssetIds>>
    >
  )[archetype];
  if (!byArchetype) return undefined;
  const stateAssetIds = isCrafting ? byArchetype.active : byArchetype.idle;
  return buildSpatialArt(catalog, stateAssetIds.base, stateAssetIds.shadow);
}

function buildStationView(
  state: GameState,
  catalog: GameCatalog,
  stationId: StationId,
  stationArchetypes: Readonly<Record<StationId, StationArchetype>>,
): SceneStationView | null {
  const station = state.crafting.stations[stationId];
  const archetype = station?.archetype ?? stationArchetypes[stationId];
  if (!archetype) return null;
  const assignedCatchmonIds = Object.values(state.catchmons.ownedCatchmons)
    .filter(
      (owned) =>
        owned.currentAssignment.kind === "WORKSHOP" &&
        owned.currentAssignment.stationId === stationId,
    )
    .map((owned) => owned.ownedCatchmonId);
  const isCrafting = station?.activeCraft !== undefined;

  return {
    stationId,
    archetype,
    isCrafting,
    craftStartedAtMs: station?.activeCraft?.startedAtMs,
    craftCompletesAtMs: station?.activeCraft?.completesAtMs,
    queuedCount: station?.queuedCrafts.length ?? 0,
    assignedCatchmonIds,
    art: buildStationArt(catalog, archetype, isCrafting),
  };
}

function buildDisplayView(
  state: GameState,
  catalog: GameCatalog,
  displaySlotId: DisplaySlotId,
  unlockRequirements: Readonly<Record<DisplaySlotId, InfrastructureId>>,
): SceneDisplayView {
  const requiredInfrastructureId = unlockRequirements[displaySlotId];
  const locked = Boolean(
    requiredInfrastructureId &&
    !state.infrastructure.ownedInfrastructureIds.includes(
      requiredInfrastructureId,
    ),
  );
  const view = getDisplaySlotView(state, displaySlotId);
  const product = view?.productId
    ? catalog.products.get(view.productId)
    : undefined;
  const productImageUrl = resolveAssetImageUrl(
    product ? catalog.assets.get(product.visualAssetId) : undefined,
  );
  return {
    displaySlotId,
    locked,
    productId: view?.productId,
    quantity: view?.availableQuantity ?? 0,
    productImageUrl,
    art: buildSpatialArt(
      catalog,
      DISPLAY_FURNITURE_BASE_ID,
      DISPLAY_FURNITURE_SHADOW_ID,
    ),
  };
}

function buildCustomerViews(
  state: GameState,
  catalog: GameCatalog,
): readonly SceneCustomerView[] {
  return state.customers.activeCustomerIds.map((customerId) => {
    const customer = state.customers.customers[customerId]!;
    const archetype = catalog.customerArchetypes.get(customer.archetypeId);
    const portraitUrl = resolveAssetImageUrl(
      archetype ? catalog.assets.get(archetype.portraitAssetId) : undefined,
    );
    return {
      customerId,
      archetypeId: customer.archetypeId,
      status: customer.status,
      hasRequest: customer.requestedProductId !== undefined,
      portraitUrl,
    };
  });
}

/** Only WORKSHOP/SHOP_FLOOR assignments are spatial in this slice's shop scene — Document 15 Task 09.7 "assignment-aware location," not a fabricated position for Supply/Expedition/Unassigned Catchmons. */
function buildCatchmonViews(
  state: GameState,
  catalog: GameCatalog,
): readonly SceneCatchmonView[] {
  const views: SceneCatchmonView[] = [];
  for (const owned of Object.values(state.catchmons.ownedCatchmons)) {
    const assignment = owned.currentAssignment;
    if (assignment.kind !== "WORKSHOP" && assignment.kind !== "SHOP_FLOOR") {
      continue;
    }
    const species = catalog.catchmonSpecies.get(owned.currentSpeciesId);
    const portraitUrl = resolveAssetImageUrl(
      species ? catalog.assets.get(species.portraitAssetId) : undefined,
    );
    views.push({
      ownedCatchmonId: owned.ownedCatchmonId,
      speciesId: owned.currentSpeciesId,
      zone: assignment.kind,
      ...(assignment.kind === "WORKSHOP"
        ? { stationId: assignment.stationId }
        : {}),
      ...(portraitUrl ? { portraitUrl } : {}),
    });
  }
  return views;
}

function buildExpeditionHubView(
  state: GameState,
  catalog: GameCatalog,
  expeditionHubInfrastructureId: InfrastructureId,
): SceneExpeditionHubView {
  const hasActiveExpedition = state.expeditions.activeExpeditionIds.some(
    (id) => state.expeditions.expeditions[id]?.status === "IN_PROGRESS",
  );
  const hasUnviewedResult = Object.values(state.expeditions.expeditions).some(
    (expedition) => expedition.status === "COMPLETED" && expedition.result,
  );
  const art = buildSpatialArt(
    catalog,
    EXPEDITION_HUB_BASE_ASSET_ID,
    EXPEDITION_HUB_SHADOW_ASSET_ID,
  );

  if (
    state.infrastructure.ownedInfrastructureIds.includes(
      expeditionHubInfrastructureId,
    )
  ) {
    return { state: "OWNED", hasActiveExpedition, hasUnviewedResult, art };
  }
  if (
    state.infrastructure.activeConstructions.some(
      (activity) => activity.infrastructureId === expeditionHubInfrastructureId,
    )
  ) {
    return {
      state: "UNDER_CONSTRUCTION",
      hasActiveExpedition,
      hasUnviewedResult,
      art,
    };
  }
  const definition = catalog.infrastructure.get(expeditionHubInfrastructureId);
  const available = definition
    ? isUnlockRuleSatisfied(definition.unlockRule, state)
    : false;
  return {
    state: available ? "AVAILABLE" : "LOCKED",
    hasActiveExpedition,
    hasUnviewedResult,
    art,
  };
}

function buildEnvironmentView(catalog: GameCatalog): SceneEnvironmentView {
  return {
    wallUrl: resolveAssetImageUrl(
      catalog.assets.get(ENV_SHOP_KEY_WALL_ASSET_ID),
    ),
    floorUrl: resolveAssetImageUrl(
      catalog.assets.get(ENV_SHOP_KEY_FLOOR_ASSET_ID),
    ),
  };
}

export function buildShopSceneViewModel(
  state: GameState,
  catalog: GameCatalog,
  options: ShopSceneViewModelOptions,
): ShopSceneViewModel {
  const stations = options.stationIds
    .map((stationId) =>
      buildStationView(state, catalog, stationId, options.stationArchetypes),
    )
    .filter((view): view is SceneStationView => view !== null);

  const displays = options.displaySlotIds.map((displaySlotId) =>
    buildDisplayView(
      state,
      catalog,
      displaySlotId,
      options.displaySlotUnlockRequirements,
    ),
  );

  return {
    macroStage: deriveShopMacroStage(state),
    environment: buildEnvironmentView(catalog),
    stations,
    displays,
    customers: buildCustomerViews(state, catalog),
    catchmons: buildCatchmonViews(state, catalog),
    expeditionHub: buildExpeditionHubView(
      state,
      catalog,
      options.expeditionHubInfrastructureId,
    ),
  };
}

/**
 * Phase 12 hardening (Priority Area 3, Performance/Asset Loading): every
 * production art URL the *current* scene actually needs, for the host to
 * kick off loading as early as possible — in parallel with
 * `ShopSceneRenderer`'s own async Pixi/WebGL init, instead of only
 * starting once each entity's constructor runs after that init resolves.
 * Deliberately scoped to what `viewModel` already resolved for the
 * player's current shop (never the full future catalog — Document 15
 * Phase 12's explicit "current-context only" boundary).
 */
export function collectSceneImageUrls(
  viewModel: ShopSceneViewModel,
): readonly string[] {
  const urls: string[] = [];
  const addSpatialArt = (art: SceneSpatialArt | undefined): void => {
    if (art?.baseUrl) urls.push(art.baseUrl);
    if (art?.shadowUrl) urls.push(art.shadowUrl);
  };

  if (viewModel.environment.wallUrl) urls.push(viewModel.environment.wallUrl);
  if (viewModel.environment.floorUrl) {
    urls.push(viewModel.environment.floorUrl);
  }
  for (const station of viewModel.stations) addSpatialArt(station.art);
  for (const display of viewModel.displays) {
    addSpatialArt(display.art);
    if (display.productImageUrl) urls.push(display.productImageUrl);
  }
  for (const customer of viewModel.customers) {
    if (customer.portraitUrl) urls.push(customer.portraitUrl);
  }
  for (const catchmon of viewModel.catchmons) {
    if (catchmon.portraitUrl) urls.push(catchmon.portraitUrl);
  }
  addSpatialArt(viewModel.expeditionHub.art);

  return urls;
}
