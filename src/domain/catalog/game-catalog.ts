/**
 * Design owner: 14 Technical Architecture — §56-57 Canonical Content
 * Registries/Registry Form, §60-61 Registry Integrity/Cross-Registry
 * Validation, §62 Content Boot Failure, §369 Prototype Catalog ("use
 * canonical placeholder/test content through the same registries — do
 * not build separate hardcoded prototype-mode logic").
 *
 * `GameCatalog` is the central read model aggregating one `Registry` per
 * content category defined in Task 01.5. It is built once from an
 * authored content array set via `createGameCatalog`, which fails fast
 * (throws) on any duplicate ID or unknown cross-reference — invalid
 * canonical content must never silently ship or run partially validated.
 *
 * No actual content is authored here (still true of this task) — this
 * only builds the aggregation/validation machinery, tested with
 * synthetic fixtures.
 *
 * `UnlockCondition.subjectId` validation (Phase 12 hardening): only the
 * two condition types `unlock-evaluator.ts`'s `evaluateUnlockCondition`
 * actually implements are cross-checked here —
 * `INFRASTRUCTURE_STATE.subjectId` against the `infrastructure` registry,
 * and `SHOP_RANK.threshold` for completeness. The other six
 * `UnlockConditionType` members (`RECIPE_MASTERY`, `CATCHMON_OWNED`,
 * `CATCHMON_LEVEL`, `REGION_STATE`, `EXPEDITION_MILESTONE`,
 * `COLLECTION_MILESTONE`) have no real evaluator/payload semantics yet
 * (they conservatively evaluate to `false`) — validating their
 * `subjectId` shape now would mean guessing a per-type mapping nothing
 * has approved, exactly what CLAUDE.md's primary rule forbids. They pass
 * through unchecked, deliberately, not by oversight.
 */
import { invariant } from "../../core/assertions/index.ts";
import {
  assertReferencesExist,
  createRegistry,
  type Registry,
} from "../../core/registry/index.ts";
import {
  type AssetId,
  type CapabilityId,
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type ComponentId,
  type CustomerArchetypeId,
  type EnemyId,
  type InfrastructureId,
  type OrderId,
  type ProductId,
  type RecipeId,
  type RegionId,
  type RelicArchetypeId,
  type ResourceId,
  type RouteId,
  type SkillId,
  type StageId,
  type UnlockRuleId,
} from "../../core/ids/index.ts";
import { type AssetMetadata } from "../assets/index.ts";
import {
  type CapabilityDefinition,
  type CatchmonSpeciesDefinition,
  type EvolutionLineDefinition,
} from "../catchmons/index.ts";
import { type EnemyDefinition } from "../combat/index.ts";
import {
  type ComponentDefinition,
  type ProductDefinition,
  type RecipeDefinition,
  type ResourceDefinition,
} from "../crafting/index.ts";
import { type CustomerArchetypeDefinition } from "../customers/index.ts";
import { type RelicArchetypeDefinition } from "../forge/index.ts";
import { type StageDefinition } from "../journey/index.ts";
import { type SkillDefinition } from "../loadout/index.ts";
import { type EverydayOrderDefinition } from "../orders/index.ts";
import { type InfrastructureDefinition } from "../shop-infrastructure/index.ts";
import {
  type UnlockCondition,
  type UnlockRuleDefinition,
} from "../progression/index.ts";
import {
  type ElementDefinition,
  type ElementId,
  type RegionDefinition,
  type RouteDefinition,
} from "../world/index.ts";

export interface GameCatalogContent {
  readonly products: readonly ProductDefinition[];
  readonly recipes: readonly RecipeDefinition[];
  readonly resources: readonly ResourceDefinition[];
  readonly components: readonly ComponentDefinition[];
  readonly catchmonSpecies: readonly CatchmonSpeciesDefinition[];
  readonly catchmonLines: readonly EvolutionLineDefinition[];
  readonly capabilities: readonly CapabilityDefinition[];
  readonly elements: readonly ElementDefinition[];
  readonly regions: readonly RegionDefinition[];
  readonly routes: readonly RouteDefinition[];
  readonly customerArchetypes: readonly CustomerArchetypeDefinition[];
  readonly infrastructure: readonly InfrastructureDefinition[];
  readonly unlockRules: readonly UnlockRuleDefinition[];
  readonly assets: readonly AssetMetadata[];
  /**
   * Optional, defaulting to empty: Task 04.12 added this after most of
   * the codebase's `GameCatalogContent` fixtures already existed, and
   * "an order layer exists" has no bearing on any of those unrelated
   * fixtures (catchmons, world, persistence, ...) — making it required
   * would force every one of them to grow an unrelated `everydayOrders:
   * []` line for no reason (CLAUDE.md's Task Scope Rule).
   */
  readonly everydayOrders?: readonly EverydayOrderDefinition[];
  /**
   * Optional, defaulting to empty, same reasoning as `everydayOrders`
   * above. Added by Task 06.2 (Phase 6): once the catalog can register
   * wild/capturable species (e.g. a Discovery Survey route's
   * `encounterPool`) alongside the player's actual starting roster, "one
   * owned instance per registered species" (the rule prior to this field
   * existing) is no longer correct — a wild species must never be
   * silently owned from game start. This is the explicit, content-
   * authored list of which registered species the player starts owning;
   * `createInitialGameState` reads it directly instead of inferring
   * starters from catalog structure.
   */
  readonly starterCatchmonSpeciesIds?: readonly CatchmonSpeciesId[];
  /** docs/rebuild/15 Phases R2-R5 — optional, same reasoning as `everydayOrders`/`starterCatchmonSpeciesIds` above: existing Shop-era fixtures should not need to grow unrelated empty arrays. */
  readonly enemies?: readonly EnemyDefinition[];
  readonly stages?: readonly StageDefinition[];
  readonly relicArchetypes?: readonly RelicArchetypeDefinition[];
  readonly skills?: readonly SkillDefinition[];
  /** Same pattern/reasoning as `starterCatchmonSpeciesIds` above — explicit, content-authored, not inferred (a real skill catalog will have skills earned later that must not start unlocked). */
  readonly startingUnlockedSkillIds?: readonly SkillId[];
}

export interface GameCatalog {
  readonly products: Registry<ProductId, ProductDefinition>;
  readonly recipes: Registry<RecipeId, RecipeDefinition>;
  readonly resources: Registry<ResourceId, ResourceDefinition>;
  readonly components: Registry<ComponentId, ComponentDefinition>;
  readonly catchmonSpecies: Registry<
    CatchmonSpeciesId,
    CatchmonSpeciesDefinition
  >;
  readonly catchmonLines: Registry<CatchmonLineId, EvolutionLineDefinition>;
  readonly capabilities: Registry<CapabilityId, CapabilityDefinition>;
  readonly elements: Registry<ElementId, ElementDefinition>;
  readonly regions: Registry<RegionId, RegionDefinition>;
  readonly routes: Registry<RouteId, RouteDefinition>;
  readonly customerArchetypes: Registry<
    CustomerArchetypeId,
    CustomerArchetypeDefinition
  >;
  readonly infrastructure: Registry<InfrastructureId, InfrastructureDefinition>;
  readonly unlockRules: Registry<UnlockRuleId, UnlockRuleDefinition>;
  readonly assets: Registry<AssetId, AssetMetadata>;
  readonly everydayOrders: Registry<OrderId, EverydayOrderDefinition>;
  readonly starterCatchmonSpeciesIds: readonly CatchmonSpeciesId[];
  readonly enemies: Registry<EnemyId, EnemyDefinition>;
  readonly stages: Registry<StageId, StageDefinition>;
  readonly relicArchetypes: Registry<
    RelicArchetypeId,
    RelicArchetypeDefinition
  >;
  readonly skills: Registry<SkillId, SkillDefinition>;
  readonly startingUnlockedSkillIds: readonly SkillId[];
}

/**
 * Builds the full `GameCatalog`: one `Registry` per category (each
 * individually duplicate-checked), then cross-reference validation
 * across the well-typed relationships Document 14 §61 names as examples.
 * Throws (invariant) on the first problem found — see module doc for the
 * one relationship deliberately left unchecked.
 */
export function createGameCatalog(content: GameCatalogContent): GameCatalog {
  const products = createRegistry(
    content.products,
    (p) => p.productId,
    "Product",
  );
  const recipes = createRegistry(content.recipes, (r) => r.recipeId, "Recipe");
  const resources = createRegistry(
    content.resources,
    (r) => r.resourceId,
    "Resource",
  );
  const components = createRegistry(
    content.components,
    (c) => c.componentId,
    "Component",
  );
  const catchmonSpecies = createRegistry(
    content.catchmonSpecies,
    (s) => s.catchmonSpeciesId,
    "CatchmonSpecies",
  );
  const catchmonLines = createRegistry(
    content.catchmonLines,
    (l) => l.catchmonLineId,
    "CatchmonLine",
  );
  const capabilities = createRegistry(
    content.capabilities,
    (c) => c.capabilityId,
    "Capability",
  );
  const elements = createRegistry(
    content.elements,
    (e) => e.elementId,
    "Element",
  );
  const regions = createRegistry(content.regions, (r) => r.regionId, "Region");
  const routes = createRegistry(content.routes, (r) => r.routeId, "Route");
  const customerArchetypes = createRegistry(
    content.customerArchetypes,
    (c) => c.customerArchetypeId,
    "CustomerArchetype",
  );
  const infrastructure = createRegistry(
    content.infrastructure,
    (i) => i.infrastructureId,
    "Infrastructure",
  );
  const unlockRules = createRegistry(
    content.unlockRules,
    (u) => u.unlockRuleId,
    "UnlockRule",
  );
  const assets = createRegistry(content.assets, (a) => a.assetId, "Asset");
  const everydayOrders = createRegistry(
    content.everydayOrders ?? [],
    (o) => o.orderId,
    "EverydayOrder",
  );
  const starterCatchmonSpeciesIds = content.starterCatchmonSpeciesIds ?? [];
  const enemies = createRegistry(
    content.enemies ?? [],
    (e) => e.enemyId,
    "Enemy",
  );
  const stages = createRegistry(
    content.stages ?? [],
    (s) => s.stageId,
    "Stage",
  );
  const relicArchetypes = createRegistry(
    content.relicArchetypes ?? [],
    (r) => r.relicArchetypeId,
    "RelicArchetype",
  );
  const skills = createRegistry(
    content.skills ?? [],
    (s) => s.skillId,
    "Skill",
  );
  const startingUnlockedSkillIds = content.startingUnlockedSkillIds ?? [];

  for (const product of content.products) {
    const label = `Product(${product.productId})`;
    assertReferencesExist(
      `${label}.routineInputs`,
      product.routineInputs,
      resources,
    );
    assertReferencesExist(
      `${label}.specialInputs`,
      product.specialInputs,
      components,
    );
    assertReferencesExist(
      `${label}.visualAssetId`,
      [product.visualAssetId],
      assets,
    );
    if (product.craftedInput !== undefined) {
      assertReferencesExist(
        `${label}.craftedInput`,
        [product.craftedInput],
        products,
      );
    }
  }

  for (const recipe of content.recipes) {
    const label = `Recipe(${recipe.recipeId})`;
    assertReferencesExist(
      `${label}.outputProductId`,
      [recipe.outputProductId],
      products,
    );
    assertReferencesExist(
      `${label}.routineInputs`,
      recipe.routineInputs.map((input) => input.resourceId),
      resources,
    );
    assertReferencesExist(
      `${label}.specialInputs`,
      recipe.specialInputs.map((input) => input.componentId),
      components,
    );
    if (recipe.craftedInput !== undefined) {
      assertReferencesExist(
        `${label}.craftedInput`,
        [recipe.craftedInput],
        products,
      );
    }
  }

  for (const resource of content.resources) {
    assertReferencesExist(
      `Resource(${resource.resourceId}).visualAssetId`,
      [resource.visualAssetId],
      assets,
    );
  }

  for (const component of content.components) {
    const label = `Component(${component.componentId})`;
    assertReferencesExist(
      `${label}.visualAssetId`,
      [component.visualAssetId],
      assets,
    );
    if (component.craftedFromRecipeId !== undefined) {
      assertReferencesExist(
        `${label}.craftedFromRecipeId`,
        [component.craftedFromRecipeId],
        recipes,
      );
    }
  }

  for (const line of content.catchmonLines) {
    const label = `EvolutionLine(${line.catchmonLineId})`;
    assertReferencesExist(
      `${label}.speciesIds`,
      line.speciesIds,
      catchmonSpecies,
    );
    if (line.homeRegionId !== undefined) {
      assertReferencesExist(
        `${label}.homeRegionId`,
        [line.homeRegionId],
        regions,
      );
    }
  }

  for (const species of content.catchmonSpecies) {
    const label = `CatchmonSpecies(${species.catchmonSpeciesId})`;
    assertReferencesExist(
      `${label}.catchmonLineId`,
      [species.catchmonLineId],
      catchmonLines,
    );
    assertReferencesExist(
      `${label}.capabilityIds`,
      species.capabilityIds,
      capabilities,
    );
    assertReferencesExist(
      `${label}.portraitAssetId`,
      [species.portraitAssetId],
      assets,
    );
    if (species.evolvesToSpeciesId !== undefined) {
      assertReferencesExist(
        `${label}.evolvesToSpeciesId`,
        [species.evolvesToSpeciesId],
        catchmonSpecies,
      );
    }
  }

  for (const region of content.regions) {
    const label = `Region(${region.regionId})`;
    assertReferencesExist(
      `${label}.homeCatchmonLineIds`,
      region.homeCatchmonLineIds,
      catchmonLines,
    );
    assertReferencesExist(
      `${label}.secondaryCatchmonLineIds`,
      region.secondaryCatchmonLineIds,
      catchmonLines,
    );
    assertReferencesExist(`${label}.routeIds`, region.routeIds, routes);
    assertReferencesExist(`${label}.recipeIds`, region.recipeIds, recipes);
    assertReferencesExist(
      `${label}.unlockRuleId`,
      [region.unlockRuleId],
      unlockRules,
    );
  }

  for (const route of content.routes) {
    const label = `Route(${route.routeId})`;
    assertReferencesExist(`${label}.regionId`, [route.regionId], regions);
    assertReferencesExist(
      `${label}.preferredCapabilities`,
      route.preferredCapabilities,
      capabilities,
    );
    assertReferencesExist(
      `${label}.specialComponentPool`,
      route.specialComponentPool,
      components,
    );
    assertReferencesExist(
      `${label}.encounterPool`,
      route.encounterPool,
      catchmonSpecies,
    );
    assertReferencesExist(
      `${label}.visualEnvironmentId`,
      [route.visualEnvironmentId],
      assets,
    );
  }

  for (const element of content.elements) {
    assertReferencesExist(
      `Element(${element.elementId}).iconAssetId`,
      [element.iconAssetId],
      assets,
    );
  }

  for (const archetype of content.customerArchetypes) {
    assertReferencesExist(
      `CustomerArchetype(${archetype.customerArchetypeId}).portraitAssetId`,
      [archetype.portraitAssetId],
      assets,
    );
  }

  for (const order of content.everydayOrders ?? []) {
    assertReferencesExist(
      `EverydayOrder(${order.orderId}).productId`,
      [order.productId],
      products,
    );
  }

  assertReferencesExist(
    "starterCatchmonSpeciesIds",
    starterCatchmonSpeciesIds,
    catchmonSpecies,
  );

  for (const stage of content.stages ?? []) {
    assertReferencesExist(
      `Stage(${stage.stageId}).enemyId`,
      [stage.enemyId],
      enemies,
    );
  }
  assertReferencesExist(
    "startingUnlockedSkillIds",
    startingUnlockedSkillIds,
    skills,
  );

  // Phase 12 hardening: validate every `UnlockCondition` reachable from
  // canonical content, for the condition types the real evaluator
  // implements (see module doc above). Collected from every place the
  // domain types actually declare an `UnlockCondition`: standalone
  // `UnlockRuleDefinition`s (both the top-level `unlockRules` registry
  // and each infrastructure entry's embedded rule, which is inline
  // content per `infrastructureContent.ts`'s convention and never enters
  // the `unlockRules` registry itself), plus every
  // product/recipe/route's own `unlockRequirements`/`accessRequirements`.
  const allUnlockConditions: {
    readonly label: string;
    readonly condition: UnlockCondition;
  }[] = [];
  const collectRule = (label: string, rule: UnlockRuleDefinition): void => {
    allUnlockConditions.push({
      label: `${label}.primaryCondition`,
      condition: rule.primaryCondition,
    });
    if (rule.secondaryCondition) {
      allUnlockConditions.push({
        label: `${label}.secondaryCondition`,
        condition: rule.secondaryCondition,
      });
    }
  };
  const collectConditions = (
    label: string,
    conditions: readonly UnlockCondition[],
  ): void => {
    conditions.forEach((condition, i) => {
      allUnlockConditions.push({ label: `${label}[${String(i)}]`, condition });
    });
  };

  for (const rule of content.unlockRules) {
    collectRule(`UnlockRule(${rule.unlockRuleId})`, rule);
  }
  for (const infra of content.infrastructure) {
    collectRule(
      `Infrastructure(${infra.infrastructureId}).unlockRule`,
      infra.unlockRule,
    );
  }
  for (const route of content.routes) {
    collectConditions(
      `Route(${route.routeId}).accessRequirements`,
      route.accessRequirements,
    );
    collectConditions(
      `Route(${route.routeId}).unlockRequirements`,
      route.unlockRequirements,
    );
  }
  for (const product of content.products) {
    collectConditions(
      `Product(${product.productId}).unlockRequirements`,
      product.unlockRequirements,
    );
  }
  for (const recipe of content.recipes) {
    collectConditions(
      `Recipe(${recipe.recipeId}).unlockRequirements`,
      recipe.unlockRequirements,
    );
  }

  const infrastructureStateSubjectIds: InfrastructureId[] = [];
  const regionStateSubjectIds: RegionId[] = [];
  for (const { label, condition } of allUnlockConditions) {
    if (condition.type === "SHOP_RANK") {
      invariant(
        condition.threshold !== undefined,
        `${label}: SHOP_RANK condition is missing its required threshold`,
      );
    } else if (condition.type === "INFRASTRUCTURE_STATE") {
      invariant(
        condition.subjectId !== undefined,
        `${label}: INFRASTRUCTURE_STATE condition is missing its required subjectId`,
      );
      infrastructureStateSubjectIds.push(
        condition.subjectId as InfrastructureId,
      );
    } else if (condition.type === "JOURNEY_RANK") {
      invariant(
        condition.threshold !== undefined,
        `${label}: JOURNEY_RANK condition is missing its required threshold`,
      );
    } else if (condition.type === "REGION_STATE") {
      invariant(
        condition.subjectId !== undefined && condition.state !== undefined,
        `${label}: REGION_STATE condition requires both subjectId and state`,
      );
      regionStateSubjectIds.push(condition.subjectId as RegionId);
    }
    // Every other UnlockConditionType has no implemented evaluator yet —
    // deliberately not validated here (see module doc).
  }
  assertReferencesExist(
    "UnlockCondition(REGION_STATE).subjectId",
    regionStateSubjectIds,
    regions,
  );
  assertReferencesExist(
    "UnlockCondition(INFRASTRUCTURE_STATE).subjectId",
    infrastructureStateSubjectIds,
    infrastructure,
  );

  return {
    products,
    recipes,
    resources,
    components,
    catchmonSpecies,
    catchmonLines,
    capabilities,
    elements,
    regions,
    routes,
    customerArchetypes,
    infrastructure,
    unlockRules,
    assets,
    everydayOrders,
    starterCatchmonSpeciesIds,
    enemies,
    stages,
    relicArchetypes,
    skills,
    startingUnlockedSkillIds,
  };
}
