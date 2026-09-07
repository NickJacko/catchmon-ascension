import {
  type CatchmonLineId,
  type CatchmonSpeciesId,
  type EncounterId,
  type ExpeditionId,
  type OwnedCatchmonId,
  type RouteId,
} from "../../../core/ids/index.ts";
import { type TimestampMs } from "../../../core/time/index.ts";
import { type ExpeditionResult } from "../../../domain/game-state/index.ts";

export type ExpeditionEvent =
  | {
      readonly kind: "EXPEDITION_STARTED";
      readonly expeditionId: ExpeditionId;
      readonly routeId: RouteId;
      readonly leadCatchmonId: OwnedCatchmonId;
      readonly startedAtMs: TimestampMs;
      readonly completesAtMs: TimestampMs;
    }
  | {
      readonly kind: "EXPEDITION_COMPLETED";
      readonly expeditionId: ExpeditionId;
      readonly routeId: RouteId;
      readonly leadCatchmonId: OwnedCatchmonId;
      readonly result: ExpeditionResult;
    }
  | {
      readonly kind: "ENCOUNTER_CREATED";
      readonly encounterId: EncounterId;
      readonly expeditionId: ExpeditionId;
      readonly targetLineId: CatchmonLineId;
      readonly targetSpeciesId: CatchmonSpeciesId;
    }
  | {
      readonly kind: "CAPTURE_ATTEMPTED";
      readonly encounterId: EncounterId;
      readonly succeeded: boolean;
      readonly targetSpeciesId: CatchmonSpeciesId;
      readonly newOwnedCatchmonId?: OwnedCatchmonId;
    }
  | {
      readonly kind: "ENCOUNTER_DECLINED";
      readonly encounterId: EncounterId;
    }
  | {
      readonly kind: "ENCOUNTER_OBSERVED";
      readonly encounterId: EncounterId;
      readonly targetSpeciesId: CatchmonSpeciesId;
    };
