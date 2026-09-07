import {
  type CatchmonSpeciesId,
  type OwnedCatchmonId,
} from "../../../core/ids/index.ts";
import { type CatchmonAssignment } from "../../../domain/game-state/index.ts";

export type CatchmonEvent =
  | {
      readonly kind: "CATCHMON_ASSIGNED";
      readonly ownedCatchmonId: OwnedCatchmonId;
      readonly assignment: CatchmonAssignment;
    }
  | {
      readonly kind: "CATCHMON_EVOLVED";
      readonly ownedCatchmonId: OwnedCatchmonId;
      readonly fromSpeciesId: CatchmonSpeciesId;
      readonly toSpeciesId: CatchmonSpeciesId;
    };
