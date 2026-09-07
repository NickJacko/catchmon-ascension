/*
 * Design owner: Mobile Dev Flow task §8 (PWA Update Behavior) — a
 * conservative update strategy: a new build's service worker installs in
 * the background but never auto-activates/auto-reloads mid-session
 * (`registerType: "prompt"`, `vite.config.ts`). This banner is the only
 * thing that ever calls `updateServiceWorker()`, and only on an explicit
 * tap — matching `SaveStatusBanner.tsx`'s exact "small banner, no giant
 * new system" shape, mounted next to it in `AppShell`.
 *
 * Not mounted at all inside the Capacitor native shell (see
 * `AppShell.tsx`) — `useRegisterSW` calls `navigator.serviceWorker
 * .register(...)` as soon as it runs, so the only reliable way to
 * guarantee "no service worker inside Capacitor" (task §10) is to never
 * call the hook there, not to call it and ignore its result.
 */
import * as React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Button, StatusPill } from "../components/index.ts";
import "./SaveStatusBanner.css";

export function PwaUpdateBanner(): React.JSX.Element | null {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="app-save-status-banner">
      <StatusPill tone="info">Update available</StatusPill>
      <div className="row">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setNeedRefresh(false);
          }}
        >
          Later
        </Button>
        <Button
          size="sm"
          onClick={() => {
            void updateServiceWorker();
          }}
        >
          Restart to update
        </Button>
      </div>
    </div>
  );
}
