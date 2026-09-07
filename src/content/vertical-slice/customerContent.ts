/**
 * Design owner: Document 15 Task 04.2; 05 Customer & Selling System §146
 * Prototype Customer Content ("1 Walk-In archetype, 1 Focused archetype,
 * 1 Special Visitor condition").
 *
 * Three minimal slice archetypes — working names only, per the same
 * "no claim of final naming" discipline as Task 03.3's product content.
 * The Special Visitor here has no `qualityPreference`: Phase 4 does not
 * roll product quality (Phase 3 established output is always STANDARD),
 * so a hard Fine/Masterwork preference would make this archetype's
 * request generation never resolvable against real slice inventory —
 * not an invented restriction, just not exercised until quality rolling
 * exists.
 */
import { CustomerArchetypeId } from "../../core/ids/index.ts";
import { type CustomerArchetypeDefinition } from "../../domain/customers/index.ts";
import {
  CUSTOMER_EVERYDAY_BUYER_ASSET_ID,
  CUSTOMER_EXPLORER_BUYER_ASSET_ID,
  CUSTOMER_SPECIAL_VISITOR_ASSET_ID,
} from "./productionAssets.ts";

export const SLICE_WALK_IN_ARCHETYPE_ID: CustomerArchetypeId =
  CustomerArchetypeId.from("slice-walk-in-everyday-buyer");
export const SLICE_FOCUSED_ARCHETYPE_ID: CustomerArchetypeId =
  CustomerArchetypeId.from("slice-focused-explorer-buyer");
export const SLICE_SPECIAL_VISITOR_ARCHETYPE_ID: CustomerArchetypeId =
  CustomerArchetypeId.from("slice-special-visitor-placeholder");

export const SLICE_CUSTOMER_ARCHETYPES: readonly CustomerArchetypeDefinition[] =
  [
    {
      customerArchetypeId: SLICE_WALK_IN_ARCHETYPE_ID,
      displayName: "Everyday Buyer",
      customerLayer: "WALK_IN",
      preferredFamilies: ["PROVISIONS"],
      secondaryFamilies: ["FIELD_GEAR", "CAPTURE_AND_DISCOVERY_GEAR"],
      portraitAssetId: CUSTOMER_EVERYDAY_BUYER_ASSET_ID,
    },
    {
      customerArchetypeId: SLICE_FOCUSED_ARCHETYPE_ID,
      displayName: "Explorer Buyer",
      customerLayer: "FOCUSED",
      preferredFamilies: ["FIELD_GEAR", "CAPTURE_AND_DISCOVERY_GEAR"],
      secondaryFamilies: ["PROVISIONS"],
      portraitAssetId: CUSTOMER_EXPLORER_BUYER_ASSET_ID,
    },
    {
      // Document 05 §83: "customer types must not map 1:1 to product
      // families... good customer identities overlap" — PROVISIONS is
      // included as a secondary interest so this archetype is not
      // exclusively tied to the slice's one premium product.
      customerArchetypeId: SLICE_SPECIAL_VISITOR_ARCHETYPE_ID,
      displayName: "Special Visitor (Placeholder)",
      customerLayer: "SPECIAL_VISITOR",
      preferredFamilies: ["ELEMENTAL_CRAFT"],
      secondaryFamilies: [
        "FIELD_GEAR",
        "CAPTURE_AND_DISCOVERY_GEAR",
        "PROVISIONS",
      ],
      portraitAssetId: CUSTOMER_SPECIAL_VISITOR_ASSET_ID,
    },
  ];
