import { type RelicInstanceId } from "../../../core/ids/index.ts";
import {
  type RelicMatrixSlot,
  type RelicRarity,
} from "../../../domain/forge/index.ts";

export type ForgeEvent =
  | {
      readonly kind: "RELIC_FORGED";
      readonly relicInstanceId: RelicInstanceId;
      readonly rarity: RelicRarity;
      readonly slot: RelicMatrixSlot;
      readonly forgeLevel: number;
    }
  | {
      readonly kind: "RELIC_EQUIPPED";
      readonly relicInstanceId: RelicInstanceId;
      readonly slot: RelicMatrixSlot;
      readonly replacedRelicInstanceId?: RelicInstanceId;
    }
  | {
      readonly kind: "RELIC_RECYCLED";
      readonly relicInstanceId: RelicInstanceId;
      readonly rarity: RelicRarity;
      readonly coinsGranted: number;
    }
  | {
      readonly kind: "RELIC_LOCK_SET";
      readonly relicInstanceId: RelicInstanceId;
      readonly locked: boolean;
    };
