/*
 * Design owner: Document 15 Task 08.2 (Three-Destination Router), Task
 * 08.3 (Shared HUD / Utility). Adapted from approved-v1 ui_kits/shop_app/
 * AppShell.jsx's overall layout (sticky TopBar, scrolling content, sticky
 * TabBar) — split into its own TopBar/BottomTabBar modules here instead of
 * one page-scoped IIFE, since this is a real multi-route app, not a single
 * static HTML export.
 */
import * as React from "react";
import { Capacitor } from "@capacitor/core";
import { Outlet } from "react-router";
import { TopBar } from "./TopBar.tsx";
import { BottomTabBar } from "./BottomTabBar.tsx";
import { SheetHost } from "./SheetHost.tsx";
import { GoalBanner } from "./GoalBanner.tsx";
import { SaveStatusBanner } from "./SaveStatusBanner.tsx";
import { PwaUpdateBanner } from "./PwaUpdateBanner.tsx";
import { useReconciliationTicker } from "../hooks/useReconciliationTicker.ts";
import "./AppShell.css";

export function AppShell(): React.JSX.Element {
  useReconciliationTicker();

  return (
    <div className="app-shell-root">
      <TopBar />
      <SaveStatusBanner />
      {/* Not mounted at all inside the Capacitor native shell — see
          `PwaUpdateBanner.tsx`'s doc comment for why this must be a
          conditional mount, not a conditional inside the hook. */}
      {!Capacitor.isNativePlatform() && <PwaUpdateBanner />}
      <GoalBanner />
      <main className="app-shell-content">
        <Outlet />
      </main>
      <BottomTabBar />
      <SheetHost />
    </div>
  );
}
