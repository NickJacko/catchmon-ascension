/**
 * Design owner: Document 15 Task 03.3 (Early Slice Resource/Product
 * Content); station archetypes owned by 04 Crafting & Product System
 * §26-32. Extended by Ozean Batch A (Care Atelier foundation).
 *
 * Formalizes the station-archetype choice already recorded in
 * `verticalSliceManifest.ts`'s comment on `PLAYABLE_STATION_IDS`
 * (PROVISION_STATION for "slice-provision-station-01", FIELDWORKS_BENCH
 * for "slice-fieldworks-bench-01", CARE_ATELIER for
 * "ozean-care-atelier-01") into typed content. No `StationId` content
 * registry exists (Document 14 §56 lists no such registry — a station is
 * GameState-runtime, `StationState`, not canonical content); this map is
 * what a station-runtime factory/craft command resolves a `StationId`
 * against to know what it can produce.
 *
 * Per Document 04 §138 ("Prototype Stations: Provision Station + one
 * combined Workshop representing later Care/Field/Element functionality"),
 * FIELDWORKS_BENCH here also stands in for the family diversity later
 * split across Care Atelier/Resonance Lab/Habitat Workshop — that is why
 * slice products from several families all route through it.
 *
 * CARE ATELIER (Ozean Batch A): registered as a real, resolvable station
 * archetype — its own genuine production decision (Care & Comfort +
 * Wearables, Document 04 §28), not a Fieldworks-Bench stand-in — but with
 * no products/recipes routed through it yet (Batch B's job). No station
 * art exists yet either; `resolveAssetImageUrl`'s established
 * placeholder/fallback path already renders a placeholder for any
 * non-`FINAL` asset, so an art-less station is inert-but-valid, exactly
 * like Reef Kelp/Cleansing Brine/Luminous Pearl's placeholder icons.
 */
import { invariant } from "../../core/assertions/invariant.ts";
import { type StationId } from "../../core/ids/index.ts";
import { type StationArchetype } from "../../domain/crafting/index.ts";
import { PLAYABLE_STATION_IDS } from "./verticalSliceManifest.ts";

const provisionStationId = PLAYABLE_STATION_IDS[0];
const fieldworksBenchId = PLAYABLE_STATION_IDS[1];
const careAtelierId = PLAYABLE_STATION_IDS[2];
invariant(
  provisionStationId !== undefined &&
    fieldworksBenchId !== undefined &&
    careAtelierId !== undefined,
  "PLAYABLE_STATION_IDS must contain exactly the 3 reserved slice station IDs",
);

export const VERTICAL_SLICE_STATION_ARCHETYPES: Readonly<
  Record<StationId, StationArchetype>
> = {
  [provisionStationId]: "PROVISION_STATION",
  [fieldworksBenchId]: "FIELDWORKS_BENCH",
  [careAtelierId]: "CARE_ATELIER",
};
