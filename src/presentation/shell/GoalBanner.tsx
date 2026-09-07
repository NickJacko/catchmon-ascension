/*
 * Design owner: Document 15 Task 08.20 (Contextual Onboarding) — "a small
 * banner/hint... no giant quest system." Mounted once in `AppShell`, so
 * every screen shows the same single current goal rather than each
 * screen inventing its own onboarding copy.
 */
import * as React from "react";
import { useContextualGoal } from "../hooks/useContextualGoal.ts";
import { StatusPill } from "../components/index.ts";
import "./GoalBanner.css";

export function GoalBanner(): React.JSX.Element | null {
  const goal = useContextualGoal();
  if (!goal) return null;

  return (
    <div className="app-goal-banner">
      <StatusPill tone="info">{goal.currentPrimaryGoal}</StatusPill>
    </div>
  );
}
