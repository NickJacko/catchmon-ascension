/*
 * Design owner: Document 15 Task 08.2 (Three-Destination Router), Task
 * 08.1 (Boot Gate) — Document 14 §200's 12-step App Boot Sequence must
 * complete (`useGameStore().boot()`) before any screen mounts; React
 * itself never reads/writes gameplay state directly, only `useGameStore`.
 */
import * as React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { useGameStore } from "./app/game-store.ts";
import { AppShell } from "./presentation/shell/AppShell.tsx";
import { JourneyScreen } from "./presentation/screens/JourneyScreen.tsx";
import { ForgeScreen } from "./presentation/screens/ForgeScreen.tsx";
import { ShopScreen } from "./presentation/screens/ShopScreen.tsx";
import { CatchmonsScreen } from "./presentation/screens/CatchmonsScreen.tsx";
import { WorldScreen } from "./presentation/screens/WorldScreen.tsx";
import "./App.css";

function App(): React.JSX.Element {
  const status = useGameStore((s) => s.status);
  const error = useGameStore((s) => s.error);
  const boot = useGameStore((s) => s.boot);

  React.useEffect(() => {
    void boot();
    // `boot` is a stable Zustand action reference, so this still runs
    // exactly once at app start despite being a listed dependency.
  }, [boot]);

  if (status === "booting") {
    return (
      <div className="app-boot-gate">
        <p>Loading Catchmon Ascension…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="app-boot-gate app-boot-gate--error">
        <p>Could not load your save.</p>
        {error && <p className="app-boot-gate__detail">{error}</p>}
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/journey" element={<JourneyScreen />} />
          <Route path="/forge" element={<ForgeScreen />} />
          {/* Retained but no longer a primary-nav destination (R1 neutral
              shell, docs/rebuild/R1_DEPENDENCY_AUDIT.md §11) — Shop's
              crafting/selling/customer loop still exists in the codebase
              for controlled retirement, reachable directly at /shop. */}
          <Route path="/shop" element={<ShopScreen />} />
          <Route path="/catchmons" element={<CatchmonsScreen />} />
          <Route path="/world" element={<WorldScreen />} />
          <Route index element={<Navigate to="/journey" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
