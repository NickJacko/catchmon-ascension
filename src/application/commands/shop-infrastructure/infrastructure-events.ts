import { type InfrastructureId } from "../../../core/ids/index.ts";
import { type TimestampMs } from "../../../core/time/index.ts";

export type InfrastructureEvent =
  | {
      readonly kind: "INFRASTRUCTURE_PURCHASED";
      readonly infrastructureId: InfrastructureId;
    }
  | {
      readonly kind: "INFRASTRUCTURE_CONSTRUCTION_STARTED";
      readonly infrastructureId: InfrastructureId;
      readonly startedAtMs: TimestampMs;
      readonly completesAtMs: TimestampMs;
    }
  | {
      readonly kind: "INFRASTRUCTURE_CONSTRUCTION_COMPLETED";
      readonly infrastructureId: InfrastructureId;
    };
