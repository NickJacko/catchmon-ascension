/*
 * Design owner: Document 15 Task 08.2 (Three-Destination Router), Phase
 * R8 (canonical four-destination IA) — Journey / Forge / Catchmons /
 * World bottom navigation, docs/rebuild/12 §2 "Maximum four permanent
 * bottom tabs." Adapted from approved-v1 ui_kits/shop_app/AppShell.jsx's
 * `TabBar`.
 *
 * R1 neutral shell (docs/rebuild/R1_DEPENDENCY_AUDIT.md §11) replaced the
 * old "Shop" destination with a Journey placeholder; Phase R8 completes
 * the migration by adding the fourth destination (Forge) and pointing
 * Journey at the real screen — Shop's own loop stays reachable at `/shop`
 * directly, just no longer a primary-nav destination.
 */
import * as React from "react";
import { NavLink } from "react-router";
import { Icon, type ApprovedIconName } from "../icons/index.tsx";
import "./BottomTabBar.css";

const DESTINATIONS: readonly {
  readonly to: string;
  readonly label: string;
  readonly icon: ApprovedIconName;
}[] = [
  { to: "/journey", label: "Journey", icon: "zap" },
  { to: "/forge", label: "Forge", icon: "hammer" },
  { to: "/catchmons", label: "Catchmons", icon: "sparkles" },
  { to: "/world", label: "World", icon: "map" },
];

export function BottomTabBar(): React.JSX.Element {
  return (
    <nav className="app-tabbar" aria-label="Primary">
      {DESTINATIONS.map((destination) => (
        <NavLink
          key={destination.to}
          to={destination.to}
          className={({ isActive }) =>
            isActive
              ? "app-tabbar__tab app-tabbar__tab--active"
              : "app-tabbar__tab"
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                name={destination.icon}
                size={20}
                color={isActive ? "var(--cs-walnut-700)" : "var(--cs-ink-300)"}
              />
              <span className="app-tabbar__label">{destination.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
