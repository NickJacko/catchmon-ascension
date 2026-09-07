import { type OwnedCatchmonId, type SkillId } from "../../../core/ids/index.ts";
import { type BattlePathId } from "../../../domain/combat/index.ts";

export type LoadoutEvent =
  | {
      readonly kind: "LEAD_ASSIGNED";
      readonly ownedCatchmonId: OwnedCatchmonId;
    }
  | {
      readonly kind: "BOND_SUPPORT_ASSIGNED";
      readonly ownedCatchmonId: OwnedCatchmonId;
      readonly slotIndex: 0 | 1 | 2;
    }
  | {
      readonly kind: "BATTLE_PATH_SELECTED";
      readonly battlePathId: BattlePathId;
    }
  | {
      readonly kind: "SKILL_LOADOUT_SET";
      readonly skillIds: readonly SkillId[];
    };
