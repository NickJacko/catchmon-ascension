/**
 * Design owner: Document 15 Task 07.5 (Visible Shop Macro State); Document
 * 08 §68-72 Shop Visual Growth / Shop Transformation Stages, §69 "visual
 * growth must follow functional growth."
 *
 * Document 08 §71 describes four conceptual stages (STARTER/ESTABLISHED/
 * SPECIALIZED/GRAND), but Task 07.5 locks this slice to exactly two:
 * `STARTER`/`EXPANDED` — Document 15 is authoritative for implementation
 * scope, so this does not invent the other two. `EXPANDED` is derived from
 * owning at least one purchased infrastructure upgrade (Task 07.3) rather
 * than a separate Shop Rank threshold Document 08 does not specify: §69's
 * own rule is that visual growth follows *functional* growth, and
 * infrastructure ownership is the one real functional-growth milestone
 * this slice has. Pixi integration ("what STARTER/EXPANDED actually look
 * like") is explicitly out of scope here (Task 07.5: "Pixi integration
 * comes later").
 */
import { type GameState } from "../game-state/index.ts";

export type ShopMacroStage = "STARTER" | "EXPANDED";

export function deriveShopMacroStage(state: GameState): ShopMacroStage {
  return state.infrastructure.ownedInfrastructureIds.length > 0
    ? "EXPANDED"
    : "STARTER";
}
