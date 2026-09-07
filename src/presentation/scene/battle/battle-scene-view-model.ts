/**
 * Design owner: docs/rebuild/15 Phase R9 §8 (Scene Layers), §9 (Lead), §10
 * (Enemies/Bosses). A pure, headlessly-testable selector — the ONLY file
 * in `presentation/scene/battle/` allowed to import domain/application,
 * matching `scene-view-model.ts`'s own contract exactly. As of Wave 0A
 * Integration it also imports the content-layer's
 * `content/combat-slice/productionAssets.ts` lookup maps — the same
 * established precedent `scene-view-model.ts` already uses for
 * `STATION_ASSET_IDS_BY_ARCHETYPE` — to resolve species/enemy/region ->
 * `AssetId` generically.
 *
 * Reads whatever `state.journey.currentStageIndex` +
 * `catalog.stages`/`catalog.enemies` resolve to, generically, then looks
 * the resolved `enemyId`/`regionId`/`catchmonSpeciesId` up in a content-
 * owned `Map` — never an `if enemyId === EMBER_WISP_ENEMY_ID` branch here
 * or in the renderer (R9 §10's explicit instruction). An enemy/species/
 * region absent from those maps (no production battle art yet) simply
 * resolves `undefined`, which renders the entity's existing placeholder.
 */
import { type ElementId } from "../../../domain/world/index.ts";
import { currentStage, orderedStages } from "../../../domain/journey/index.ts";
import { type GameCatalog } from "../../../domain/catalog/index.ts";
import { type GameState } from "../../../domain/game-state/index.ts";
import { type AssetPivot } from "../../../domain/assets/index.ts";
import { resolveAssetImageUrl } from "../../assets/resolve-asset.ts";
import {
  ENEMY_BATTLE_IDLE_ASSET_ID_BY_ENEMY,
  LEAD_BATTLE_IDLE_ASSET_ID_BY_SPECIES,
  REGION_BATTLE_BACKGROUND_ASSET_ID_BY_REGION,
} from "../../../content/combat-slice/productionAssets.ts";
import {
  deriveLeadCombatStats,
  type LeadStatsConfig,
} from "../../../application/queries/combat/lead-stats-query.ts";

export interface SceneCombatantView {
  readonly id: string;
  readonly role: "LEAD" | "ENEMY";
  readonly displayName: string;
  /** `undefined` renders the entity's placeholder geometry (Document 13/POST_R7_ASSET_AUDIT: not every species/enemy has battle art yet). */
  readonly portraitUrl?: string | undefined;
  /** The portrait's bottom-contact point, fraction of its own canvas — `undefined` (no production battle art, or art with no authored pivot) falls back to a generic bottom-center anchor in `CombatantEntity`. */
  readonly pivot?: AssetPivot | undefined;
  readonly elementId?: ElementId | undefined;
  readonly isBoss: boolean;
  readonly hpMax: number;
}

export interface BattleSceneViewModel {
  readonly regionDisplayName: string;
  readonly regionElementId?: ElementId | undefined;
  /** The current region's real battle-arena background art — `undefined` falls back to the renderer's element-tinted flat fill (Wave 0A: only Vulkankrater has one so far). */
  readonly backgroundUrl?: string | undefined;
  /** `null` when no Lead is assigned yet — the renderer shows an empty stage-left slot. */
  readonly lead: SceneCombatantView | null;
  /** `null` once every authored stage is cleared (Document 03 §5). */
  readonly enemy: SceneCombatantView | null;
}

export interface BattleSceneViewModelOptions {
  readonly leadStatsConfig: LeadStatsConfig;
}

export function buildBattleSceneViewModel(
  state: GameState,
  catalog: GameCatalog,
  options: BattleSceneViewModelOptions,
): BattleSceneViewModel {
  const stages = orderedStages(catalog.stages.values());
  const stage = currentStage(stages, state.journey.currentStageIndex);
  const enemyDef = stage ? catalog.enemies.get(stage.enemyId) : undefined;
  const region = stage ? catalog.regions.get(stage.regionId) : undefined;

  const leadId = state.loadout.leadCatchmonId;
  const leadOwned = leadId ? state.catchmons.ownedCatchmons[leadId] : undefined;
  const leadSpecies = leadOwned
    ? catalog.catchmonSpecies.get(leadOwned.currentSpeciesId)
    : undefined;
  const leadStats = deriveLeadCombatStats(
    state,
    catalog,
    options.leadStatsConfig,
  );

  const leadBattleAssetId = leadSpecies
    ? LEAD_BATTLE_IDLE_ASSET_ID_BY_SPECIES.get(leadSpecies.catchmonSpeciesId)
    : undefined;
  // A species with dedicated battle-idle art (Wave 0A: Flamarox only) uses
  // it; every other species falls back to its existing canonical roster
  // portrait, unchanged from pre-Wave-0A behavior.
  const leadAsset = leadSpecies
    ? catalog.assets.get(leadBattleAssetId ?? leadSpecies.portraitAssetId)
    : undefined;

  const lead: SceneCombatantView | null =
    leadOwned && leadSpecies && leadStats
      ? {
          id: leadOwned.ownedCatchmonId,
          role: "LEAD",
          displayName: leadSpecies.displayName,
          portraitUrl: resolveAssetImageUrl(leadAsset),
          pivot: leadBattleAssetId ? leadAsset?.pivot : undefined,
          elementId: leadSpecies.elementId,
          isBoss: false,
          hpMax: leadStats.hp,
        }
      : null;

  const enemyBattleAssetId = enemyDef
    ? ENEMY_BATTLE_IDLE_ASSET_ID_BY_ENEMY.get(enemyDef.enemyId)
    : undefined;
  const enemyAsset = enemyBattleAssetId
    ? catalog.assets.get(enemyBattleAssetId)
    : undefined;

  const enemy: SceneCombatantView | null = enemyDef
    ? {
        id: enemyDef.enemyId,
        role: "ENEMY",
        displayName: enemyDef.displayName,
        portraitUrl: resolveAssetImageUrl(enemyAsset),
        pivot: enemyAsset?.pivot,
        elementId: enemyDef.elementId,
        isBoss: enemyDef.isBoss,
        hpMax: enemyDef.stats.hp,
      }
    : null;

  const backgroundAssetId = stage
    ? REGION_BATTLE_BACKGROUND_ASSET_ID_BY_REGION.get(stage.regionId)
    : undefined;
  const backgroundUrl = backgroundAssetId
    ? resolveAssetImageUrl(catalog.assets.get(backgroundAssetId))
    : undefined;

  return {
    regionDisplayName: region?.displayName ?? "",
    regionElementId: region?.elementId,
    backgroundUrl,
    lead,
    enemy,
  };
}

/** Mirrors `collectSceneImageUrls`'s "current-context only" preloading contract (CLAUDE.md §10 Preload/Cache) — only the URLs the current scene actually needs: the Lead's, the current enemy's (Wave 0A: Ember Wisp/Vulkan Warden), and the current region's battle background, whichever of those currently resolve to real art. */
export function collectBattleSceneImageUrls(
  viewModel: BattleSceneViewModel,
): readonly string[] {
  return [
    viewModel.lead?.portraitUrl,
    viewModel.enemy?.portraitUrl,
    viewModel.backgroundUrl,
  ].filter((url): url is string => url !== undefined);
}
