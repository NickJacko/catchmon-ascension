/*
 * Design owner: Document 14 §117-118 Reconciliation Triggers ("app
 * foreground, screen focus, explicit player action... not only offline
 * resume"). Mounted once, at the app root — periodically dispatches the
 * real `RECONCILE` command (see `app/reconcile-command.ts`) so a
 * completed craft/expedition/construction is actually delivered into
 * state rather than a timer just visually reaching zero. "Reconcile on
 * resume" (the tab becoming visible again) is wired separately in
 * `app/game-store.ts`'s `boot()` — presentation code may not import
 * `infrastructure/platform` directly (ESLint architecture boundary), so
 * the `BrowserLifecycle` subscription lives in the one layer allowed to
 * touch it.
 */
import * as React from "react";
import { useGameStore } from "../../app/game-store.ts";

const TICK_INTERVAL_MS = 3000;

export function useReconciliationTicker(): void {
  const status = useGameStore((s) => s.status);
  const dispatch = useGameStore((s) => s.dispatch);

  React.useEffect(() => {
    if (status !== "ready") return;

    const intervalId = window.setInterval(() => {
      void dispatch("RECONCILE", { reason: "TICK" });
    }, TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status, dispatch]);
}
