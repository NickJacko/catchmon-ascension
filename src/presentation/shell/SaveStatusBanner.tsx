/*
 * Design owner: Document 14 §144-146 Persistence Triggers / Crash
 * Resilience; Document 15 Task 12.1 Multi-Tab Writer Lease. Phase 12
 * hardening — until now, neither a `saveRepository.commit()` failure
 * (IndexedDB quota, blocked, unavailable) nor a second tab silently taking
 * over as writer had any user-facing signal at all. Mounted once in
 * `AppShell` next to `GoalBanner`, same "small banner, no giant new
 * system" shape. The two states are mutually exclusive in practice —
 * `game-store.ts`'s `dispatch()` refuses every command while read-only, so
 * `lastPersistFailed` can never become true in that state — but the
 * writer-lease message is checked first since it's the more actionable one
 * (it has a fix; a transient persist failure does not).
 */
import * as React from "react";
import { useGameStore } from "../../app/game-store.ts";
import { Button, StatusPill } from "../components/index.ts";
import "./SaveStatusBanner.css";

export function SaveStatusBanner(): React.JSX.Element | null {
  const writerStatus = useGameStore((s) => s.writerStatus);
  const requestWriterTakeover = useGameStore((s) => s.requestWriterTakeover);
  const lastPersistFailed = useGameStore((s) => s.lastPersistFailed);

  if (writerStatus === "READ_ONLY") {
    return (
      <div className="app-save-status-banner">
        <StatusPill tone="warning">
          Read-only — this save is open in another tab
        </StatusPill>
        <Button size="sm" variant="secondary" onClick={requestWriterTakeover}>
          Use game here
        </Button>
      </div>
    );
  }

  if (lastPersistFailed) {
    return (
      <div className="app-save-status-banner">
        <StatusPill tone="error">
          Not saved — check your connection or storage space
        </StatusPill>
      </div>
    );
  }

  return null;
}
