/**
 * Design owner: Document 15 Phase 11 — "multiple stations." Builds the
 * `StationId -> StationArchetype` map every craft command/query factory
 * takes as a parameter (there is no catalog registry for stations — see
 * `content/vertical-slice/stations.ts`'s real precedent). Deliberately a
 * LOOP, not the Vertical Slice's `PLAYABLE_STATION_IDS[0]`/`[1]` array-
 * index pattern (Phase 11 architecture audit finding: that pattern is
 * legitimate for exactly 2 stations but must not be copied at scale).
 */
import { type StationId } from "../../core/ids/index.ts";
import { type StationArchetype } from "../../domain/crafting/index.ts";
import {
  SCALE_STATIONS_PER_ARCHETYPE,
  SCALE_STATION_ARCHETYPES,
  SCALE_STATION_COUNT,
  stationIdForIndex,
} from "./manifest.ts";

export const SCALE_STATION_IDS: readonly StationId[] = Array.from(
  { length: SCALE_STATION_COUNT },
  (_, i) => stationIdForIndex(i + 1),
);

export const SCALE_STATION_ARCHETYPE_MAP: Readonly<
  Record<StationId, StationArchetype>
> = Object.fromEntries(
  SCALE_STATION_IDS.map((stationId, index0) => [
    stationId,
    SCALE_STATION_ARCHETYPES[
      Math.floor(index0 / SCALE_STATIONS_PER_ARCHETYPE)
    ]!,
  ]),
);
