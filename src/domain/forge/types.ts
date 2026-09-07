/**
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md;
 * docs/rebuild/15 Phase R3. Content-domain types only — runtime Relic
 * *instances* live in `domain/game-state/slices.ts`'s `RelicInstanceState`
 * (Document 04 §4: "GameState stores IDs/state, not duplicated full
 * definitions").
 */
import { type RelicArchetypeId } from "../../core/ids/index.ts";
import { type CombatStats } from "../combat/types.ts";

/** Document 04 §3's eight working slots. Names are canonical per that document (§3: "Names can be polished later; the matrix concept is canonical"). */
export type RelicMatrixSlot =
  "CORE" | "CREST" | "FANG" | "SHELL" | "STEP" | "FOCUS" | "CHARM" | "ECHO";

export const RELIC_MATRIX_SLOTS: readonly RelicMatrixSlot[] = [
  "CORE",
  "CREST",
  "FANG",
  "SHELL",
  "STEP",
  "FOCUS",
  "CHARM",
  "ECHO",
];

/** Document 04 §5's working ladder, weakest to strongest. */
export type RelicRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "EPIC"
  | "MYTHIC"
  | "LEGENDARY"
  | "ASCENDANT";

export const RELIC_RARITY_ORDER: readonly RelicRarity[] = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "EPIC",
  "MYTHIC",
  "LEGENDARY",
  "ASCENDANT",
];

/**
 * Document 04 §11's initial affix families — ten of the eleven listed
 * ("Recovery" omitted: no recovery/lifesteal `CombatStats` field exists
 * yet to attach it to; a documented, deliberate scope reduction, not an
 * oversight). Each maps 1:1 onto an existing `CombatStats` field so an
 * affix's effect is "add this much to that stat," never a bespoke formula.
 */
export type AffixType =
  | "CRIT"
  | "COMBO"
  | "COUNTER"
  | "GUARD"
  | "SKILL_POWER"
  | "SKILL_HASTE"
  | "ATTACK_SPEED"
  | "ELEMENTAL_POWER"
  | "ACCURACY"
  | "EVASION";

export const AFFIX_TYPES: readonly AffixType[] = [
  "CRIT",
  "COMBO",
  "COUNTER",
  "GUARD",
  "SKILL_POWER",
  "SKILL_HASTE",
  "ATTACK_SPEED",
  "ELEMENTAL_POWER",
  "ACCURACY",
  "EVASION",
];

export interface RelicAffix {
  readonly type: AffixType;
  readonly value: number;
}

/** Document 04 §4: slot + thematic identity + which stat this archetype's main line boosts. */
export interface RelicArchetypeDefinition {
  readonly relicArchetypeId: RelicArchetypeId;
  readonly displayName: string;
  readonly slot: RelicMatrixSlot;
  readonly mainStatKey: keyof CombatStats;
  /** The main-stat value at COMMON rarity — scaled up by rarity in `relic-generation.ts`. */
  readonly baseMainStatValue: number;
}
