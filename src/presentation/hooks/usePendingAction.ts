/**
 * Phase 12 hardening (Priority Area 6, Interaction Hardening). `GameEngine
 * .execute()` already serializes commands (no interleaving), but nothing
 * previously stopped a second tap on a sheet's action button — or a
 * different button in the same sheet — from queuing an unintended
 * duplicate command before the first dispatch's result re-renders the UI.
 * `run` ignores any call while a previous one from this hook instance is
 * still in flight; `pending` lets the caller disable/style its buttons
 * meanwhile. Scoped per-sheet (one hook instance per sheet component), not
 * global, matching the audit's narrow finding (StationSheet, CatchmonDetail
 * Sheet's assign buttons, EncounterSheet's Attempt Capture).
 */
import * as React from "react";

export interface PendingAction {
  readonly pending: boolean;
  readonly run: (action: () => Promise<unknown>) => void;
}

export function usePendingAction(): PendingAction {
  const pendingRef = React.useRef(false);
  const [pending, setPending] = React.useState(false);

  const run = React.useCallback((action: () => Promise<unknown>) => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    void action().finally(() => {
      pendingRef.current = false;
      setPending(false);
    });
  }, []);

  return { pending, run };
}
