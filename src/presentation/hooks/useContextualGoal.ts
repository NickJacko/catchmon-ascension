/*
 * Design owner: Document 15 Task 08.20 (Contextual Onboarding) — "minimal
 * just-in-time hints... no giant quest system." Wraps Task 07.6's
 * `getContextualGoal` query with this slice's real introduction-order
 * unlock rules and rank config, the same "inject content, don't invent
 * it" pattern every other Phase 7/8 query hook already follows.
 */
import * as React from "react";
import {
  getContextualGoal,
  type ContextualGoal,
} from "../../application/queries/progression/index.ts";
import {
  PROVISIONAL_RANK_PROGRESS_PER_RANK,
  PROVISIONAL_SHOP_RANK_CAP,
  SLICE_INTRODUCTION_UNLOCK_RULES,
} from "../../content/vertical-slice/index.ts";
import { useGameStore } from "../../app/game-store.ts";

const RANK_CONFIG = {
  progressPerRank: PROVISIONAL_RANK_PROGRESS_PER_RANK,
  rankCap: PROVISIONAL_SHOP_RANK_CAP,
};

export function useContextualGoal(): ContextualGoal | null {
  const state = useGameStore((s) => s.state);
  return React.useMemo(() => {
    if (!state) return null;
    return getContextualGoal(
      state,
      SLICE_INTRODUCTION_UNLOCK_RULES,
      RANK_CONFIG,
    );
  }, [state]);
}
