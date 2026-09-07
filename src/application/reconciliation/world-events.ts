import { type RegionId } from "../../core/ids/index.ts";

/** Document 14 §49's shared domain-event vocabulary, extended for World/Region facts (Ozean Batch A) — not a parallel event system. */
export type WorldEvent = {
  readonly kind: "REGION_UNLOCKED";
  readonly regionId: RegionId;
};
