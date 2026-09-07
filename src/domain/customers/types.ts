/**
 * Design owner: 05 Customer & Selling System §4 Customer Layers, §13
 * Customer Archetype Data Model, §31-33 Customer Preference Model.
 *
 * Extended by Document 15 Task 04.2 from Task 01.5's identity-only stub
 * (which deliberately deferred browsing/demand fields until Document 05
 * was read). Kept to the subset Task 04.2's "deterministic request
 * generation" actually needs — §13's fuller list (demand tags, element
 * preferences, value sensitivity, Momentum/browse-patience profiles,
 * special-request/order rules, Catchmon interaction tags) is explicitly
 * "may later exist" content, not required for a minimal slice archetype,
 * and is not invented here.
 *
 * Content-domain type only — no customer archetypes are created here.
 */
import {
  type AssetId,
  type CustomerArchetypeId,
} from "../../core/ids/index.ts";
import { type ProductFamily, type QualityGrade } from "../crafting/index.ts";

/** Document 05 §4: the four customer gameplay layers. */
export type CustomerLayer =
  "WALK_IN" | "FOCUSED" | "SPECIAL_VISITOR" | "COMMISSION_CLIENT";

export interface CustomerArchetypeDefinition {
  readonly customerArchetypeId: CustomerArchetypeId;
  readonly displayName: string;
  readonly customerLayer: CustomerLayer;
  /** Document 05 §32: strong request weight. */
  readonly preferredFamilies: readonly ProductFamily[];
  /** Document 05 §33: ensures customers are not overly deterministic. */
  readonly secondaryFamilies: readonly ProductFamily[];
  /** Document 05 §35: most normal customers accept Standard; unset means no preference. */
  readonly qualityPreference?: QualityGrade;
  readonly portraitAssetId: AssetId;
}
