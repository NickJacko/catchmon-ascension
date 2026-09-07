/**
 * Canonical initial ID types (Document 15 Task 01.1; Document 14 §29-30).
 *
 * Each ID is declared as `export type X = Brand<...>` alongside
 * `export const X = createIdFactory<X>(...)` sharing the same name — types
 * and values live in separate namespaces in TypeScript, so `X` can be used
 * both as a type annotation (`function f(id: ProductId)`) and as the
 * factory (`ProductId.from('soup')`).
 *
 * These are semantic persistence boundaries (Document 14 §30) — content IDs,
 * once real content exists, should not be renamed casually. No content
 * records are created here; that belongs to later registry tasks.
 */
import { type Brand, createIdFactory } from "./brand.ts";

export type ProductId = Brand<string, "ProductId">;
export const ProductId = createIdFactory<ProductId>("ProductId");

export type RecipeId = Brand<string, "RecipeId">;
export const RecipeId = createIdFactory<RecipeId>("RecipeId");

export type ItemId = Brand<string, "ItemId">;
export const ItemId = createIdFactory<ItemId>("ItemId");

export type StationId = Brand<string, "StationId">;
export const StationId = createIdFactory<StationId>("StationId");

export type CatchmonSpeciesId = Brand<string, "CatchmonSpeciesId">;
export const CatchmonSpeciesId =
  createIdFactory<CatchmonSpeciesId>("CatchmonSpeciesId");

export type CatchmonLineId = Brand<string, "CatchmonLineId">;
export const CatchmonLineId = createIdFactory<CatchmonLineId>("CatchmonLineId");

export type OwnedCatchmonId = Brand<string, "OwnedCatchmonId">;
export const OwnedCatchmonId =
  createIdFactory<OwnedCatchmonId>("OwnedCatchmonId");

export type RegionId = Brand<string, "RegionId">;
export const RegionId = createIdFactory<RegionId>("RegionId");

export type RouteId = Brand<string, "RouteId">;
export const RouteId = createIdFactory<RouteId>("RouteId");

export type AssetId = Brand<string, "AssetId">;
export const AssetId = createIdFactory<AssetId>("AssetId");

export type CustomerId = Brand<string, "CustomerId">;
export const CustomerId = createIdFactory<CustomerId>("CustomerId");

export type ExpeditionId = Brand<string, "ExpeditionId">;
export const ExpeditionId = createIdFactory<ExpeditionId>("ExpeditionId");

export type ReservationId = Brand<string, "ReservationId">;
export const ReservationId = createIdFactory<ReservationId>("ReservationId");

export type InfrastructureId = Brand<string, "InfrastructureId">;
export const InfrastructureId =
  createIdFactory<InfrastructureId>("InfrastructureId");

export type UnlockRuleId = Brand<string, "UnlockRuleId">;
export const UnlockRuleId = createIdFactory<UnlockRuleId>("UnlockRuleId");

/**
 * Content-definition identity for a routine material (Document 14 §56
 * registry #3). Distinct from `ItemId`, which addresses an inventory
 * stack slot rather than a canonical material definition.
 */
export type ResourceId = Brand<string, "ResourceId">;
export const ResourceId = createIdFactory<ResourceId>("ResourceId");

/**
 * Content-definition identity for a special component (Document 14 §56
 * registry #4). Distinct from `ItemId` for the same reason as `ResourceId`.
 */
export type ComponentId = Brand<string, "ComponentId">;
export const ComponentId = createIdFactory<ComponentId>("ComponentId");

/** Content-definition identity for a Catchmon capability (Document 06 §119 Capability Registry). */
export type CapabilityId = Brand<string, "CapabilityId">;
export const CapabilityId = createIdFactory<CapabilityId>("CapabilityId");

/**
 * Content-definition identity for a canonical customer archetype/template
 * (Document 13 §129). Distinct from `CustomerId`, which identifies a
 * runtime customer instance generated from an archetype during play.
 */
export type CustomerArchetypeId = Brand<string, "CustomerArchetypeId">;
export const CustomerArchetypeId = createIdFactory<CustomerArchetypeId>(
  "CustomerArchetypeId",
);

/** Save envelope identity (Document 14 §141 Save Envelope). */
export type SaveId = Brand<string, "SaveId">;
export const SaveId = createIdFactory<SaveId>("SaveId");

/** Command envelope identity, for debugging/idempotency (Document 14 §45). */
export type CommandId = Brand<string, "CommandId">;
export const CommandId = createIdFactory<CommandId>("CommandId");

/** Shop-floor display slot identity (Document 14 §79 Display Stock Model; Document 15 Task 04.1). */
export type DisplaySlotId = Brand<string, "DisplaySlotId">;
export const DisplaySlotId = createIdFactory<DisplaySlotId>("DisplaySlotId");

/** Content-definition identity for an order template (Document 05 §85-93; Document 15 Task 04.12 Everyday Order — the only order type implemented so far). */
export type OrderId = Brand<string, "OrderId">;
export const OrderId = createIdFactory<OrderId>("OrderId");

/** Runtime identity for a durable Encounter Opportunity (Document 07 §70; Document 15 Task 06.8). Distinct from `CatchmonSpeciesId`/`CatchmonLineId` — an encounter is an event instance, not a content definition. */
export type EncounterId = Brand<string, "EncounterId">;
export const EncounterId = createIdFactory<EncounterId>("EncounterId");

// ---- Ascension rebuild (docs/rebuild/15 Phases R2-R5) ----

/** Content-definition identity for a Journey stage/checkpoint (Document 03 §5 Stage Structure; docs/rebuild/15 Phase R2). */
export type StageId = Brand<string, "StageId">;
export const StageId = createIdFactory<StageId>("StageId");

/** Content-definition identity for an enemy/boss template (Document 03 §6-7). A boss is an `EnemyDefinition` with `isBoss: true`, not a separate registry — Document 03 does not require bosses to be structurally distinct content. */
export type EnemyId = Brand<string, "EnemyId">;
export const EnemyId = createIdFactory<EnemyId>("EnemyId");

/** Content-definition identity for a Relic archetype (Document 04 §4: slot + thematic identity). Distinct from `RelicInstanceId`, which identifies one rolled, owned instance. */
export type RelicArchetypeId = Brand<string, "RelicArchetypeId">;
export const RelicArchetypeId =
  createIdFactory<RelicArchetypeId>("RelicArchetypeId");

/** Runtime identity for one rolled, owned Relic (Document 04 §4 "GameState stores IDs/state, not duplicated full definitions"). */
export type RelicInstanceId = Brand<string, "RelicInstanceId">;
export const RelicInstanceId =
  createIdFactory<RelicInstanceId>("RelicInstanceId");

/** Content-definition identity for a Skill (Document 05 §4 Skill Loadout). */
export type SkillId = Brand<string, "SkillId">;
export const SkillId = createIdFactory<SkillId>("SkillId");
