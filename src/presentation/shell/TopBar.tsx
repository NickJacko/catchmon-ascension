/*
 * Design owner: Document 15 Task 08.3 (Shared HUD / Utility) — "Coins,
 * Shop Rank compact state, Inventory access, appropriate Momentum display
 * on Shop. No currency clutter." Adapted from approved-v1 ui_kits/
 * shop_app/AppShell.jsx's `TopBar`.
 */
import * as React from "react";
import { useLocation } from "react-router";
import { CurrencyChip, StatusPill } from "../components/index.ts";
import { Icon } from "../icons/index.tsx";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import "./TopBar.css";

const TITLES: Record<string, string> = {
  "/journey": "Journey",
  "/forge": "Forge",
  "/shop": "Shop",
  "/catchmons": "Catchmons",
  "/world": "World",
};

export function TopBar(): React.JSX.Element | null {
  const location = useLocation();
  const state = useGameStore((s) => s.state);
  const openSheet = useUiStore((s) => s.openSheet);
  if (!state) return null;

  const onShop = location.pathname.startsWith("/shop");
  const title =
    Object.entries(TITLES).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ?? "Catchmon Ascension";

  return (
    <header className="app-topbar">
      <h1 className="app-topbar__title">{title}</h1>
      <div className="app-topbar__chips">
        {/* Phase R8: the persistent HUD now surfaces Journey Rank, not
            Shop Rank — Journey Rank is Ascension's real player-facing
            progression meter (docs/rebuild/07 §3); Shop Rank still exists
            internally for Shop's own retained unlock rules but is no
            longer shown as if it were Ascension progression. */}
        <StatusPill tone="neutral" icon={null}>
          Rank {state.progression.journeyRank}
        </StatusPill>
        {onShop && (
          <CurrencyChip
            kind="momentum"
            amount={state.shop.momentum}
            size="sm"
          />
        )}
        <CurrencyChip kind="coin" amount={state.economy.coins} size="sm" />
        <button
          type="button"
          className="app-topbar__icon-button"
          aria-label="Inventory"
          onClick={() => {
            openSheet({ kind: "inventory" });
          }}
        >
          <Icon name="package" size={20} color="var(--cs-walnut-700)" />
        </button>
      </div>
    </header>
  );
}
