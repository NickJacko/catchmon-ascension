/*
 * Design owner: Document 15 Task 08.4 (Shop Operation Screen) — "Displays,
 * Stations, active Customers, Expedition Hub state, Orders. Every action
 * opens a real sheet or dispatches a real command." Folds Task 08.10
 * (Orders Workspace) in as a fourth tab — Document 15 does not require it
 * as its own destination, and this slice's "1 simple order layer" (Task
 * 04.12) does not need a fifth navigation stop of its own.
 */
import * as React from "react";
import { useNavigate } from "react-router";
import {
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_STATION_IDS,
} from "../../content/vertical-slice/index.ts";
import { getDisplaySlotView } from "../../application/queries/display/index.ts";
import { isUnlockRuleSatisfied } from "../../domain/progression/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";
import { useCraftQueries } from "../hooks/useQueries.ts";
import { useCustomerArrivalTicker } from "../hooks/useCustomerArrivalTicker.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore, type ShopTab } from "../../app/ui-store.ts";
import { ShopSceneHost } from "../scene/ShopSceneHost.tsx";
import {
  Button,
  Panel,
  SectionHead,
  Slot,
  StatusPill,
  Tabs,
} from "../components/index.ts";
import "./ShopScreen.css";

const TABS: readonly {
  readonly id: ShopTab;
  readonly label: string;
  readonly icon: "store" | "hammer";
}[] = [
  { id: "displays", label: "Displays", icon: "store" },
  { id: "stations", label: "Stations", icon: "hammer" },
];

export function ShopScreen(): React.JSX.Element | null {
  useCustomerArrivalTicker();
  const navigate = useNavigate();

  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const dispatch = useGameStore((s) => s.dispatch);
  const craftQueries = useCraftQueries();
  const shopTab = useUiStore((s) => s.shopTab);
  const setShopTab = useUiStore((s) => s.setShopTab);
  const openSheet = useUiStore((s) => s.openSheet);

  if (!state || !catalog || !craftQueries) return null;

  const expeditionHub = catalog.infrastructure.get(
    EXPEDITION_HUB_INFRASTRUCTURE_ID,
  );
  const hubOwned = state.infrastructure.ownedInfrastructureIds.includes(
    EXPEDITION_HUB_INFRASTRUCTURE_ID,
  );
  const hubConstruction = state.infrastructure.activeConstructions.find(
    (activity) =>
      activity.infrastructureId === EXPEDITION_HUB_INFRASTRUCTURE_ID,
  );
  const hubUnlockable = expeditionHub
    ? isUnlockRuleSatisfied(expeditionHub.unlockRule, state)
    : false;
  const hubAffordable = expeditionHub
    ? state.economy.coins >= expeditionHub.coinCost
    : false;

  return (
    <div className="shop-screen">
      <ShopSceneHost />

      <Panel id="expedition-hub-panel" title="Expedition Hub">
        {hubOwned ? (
          // Phase 12 hardening: the Pixi Living Shop's Expedition Hub tap
          // navigates straight to World once owned (`ShopSceneHost`'s
          // `onExpeditionHubSelected`); this panel previously had no DOM
          // equivalent for that specific action — a keyboard user could
          // still reach World via the bottom tab bar, but had no direct
          // "jump from here" control matching the tappable Pixi entity.
          <div className="row row--between">
            <StatusPill tone="success">Owned</StatusPill>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                navigate("/world");
              }}
            >
              Go to World
            </Button>
          </div>
        ) : hubConstruction ? (
          <StatusPill tone="warning">Under construction</StatusPill>
        ) : (
          <div className="row row--between">
            <span className="muted">
              {!hubUnlockable
                ? "Not yet unlocked"
                : !hubAffordable
                  ? `Need ${expeditionHub?.coinCost} coins`
                  : `Cost: ${expeditionHub?.coinCost} coins`}
            </span>
            <Button
              size="sm"
              disabled={!hubUnlockable || !hubAffordable || !expeditionHub}
              onClick={() => {
                if (expeditionHub) {
                  void dispatch("PURCHASE_INFRASTRUCTURE", {
                    infrastructureId: expeditionHub.infrastructureId,
                  });
                }
              }}
            >
              Build
            </Button>
          </div>
        )}
      </Panel>

      <Tabs
        items={TABS}
        value={shopTab}
        onChange={(id) => {
          setShopTab(id as ShopTab);
        }}
        aria-label="Shop sections"
      />

      {shopTab === "displays" && (
        <section>
          <SectionHead title="Displays" />
          <div className="shop-screen__slot-row">
            {PLAYABLE_DISPLAY_SLOT_IDS.map((displaySlotId) => {
              const view = getDisplaySlotView(state, displaySlotId);
              const product = view
                ? catalog.products.get(view.productId)
                : undefined;
              const art = resolveAssetImageUrl(
                product ? catalog.assets.get(product.visualAssetId) : undefined,
              );
              return (
                <Slot
                  key={displaySlotId}
                  label={product?.displayName ?? "Empty display"}
                  {...(art ? { art } : {})}
                  onClick={() => {
                    openSheet({ kind: "display", displaySlotId });
                  }}
                />
              );
            })}
          </div>
        </section>
      )}

      {shopTab === "stations" && (
        <section>
          <SectionHead title="Stations" />
          <div className="stack">
            {PLAYABLE_STATION_IDS.map((stationId) => {
              const stationState = state.crafting.stations[stationId];
              const queue = craftQueries.currentQueue(state, stationId);
              // Ozean Batch A (Care Atelier foundation check): a
              // registered station archetype with zero recipes yet (Care
              // Atelier, pre-Batch-B) must not present as a normal
              // "Idle, tap to craft" row — that would be a misleading
              // usable-looking empty surface. Reuses the real recipe
              // catalog, not a new lock mechanism or a placeholder recipe.
              const hasRecipes = craftQueries.stationHasAvailableRecipes(
                state,
                stationId,
              );
              return (
                <button
                  key={stationId}
                  type="button"
                  className="shop-screen__station-row"
                  disabled={!hasRecipes}
                  onClick={() => {
                    if (!hasRecipes) return;
                    openSheet({ kind: "station", stationId });
                  }}
                >
                  <span>{stationState?.archetype ?? "Station"}</span>
                  {!hasRecipes ? (
                    <StatusPill tone="neutral" icon={null}>
                      Coming soon
                    </StatusPill>
                  ) : queue.active ? (
                    <StatusPill tone="info">Crafting</StatusPill>
                  ) : (
                    <StatusPill tone="neutral" icon={null}>
                      Idle
                    </StatusPill>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <SectionHead title="Customers" />
        {state.customers.activeCustomerIds.length === 0 && (
          <p className="empty-state">No customers right now.</p>
        )}
        <div className="stack">
          {state.customers.activeCustomerIds.map((customerId) => {
            const customer = state.customers.customers[customerId];
            const requested =
              customer?.requestedProductId !== undefined
                ? catalog.products.get(customer.requestedProductId)?.displayName
                : "Browsing";
            return (
              <button
                key={customerId}
                type="button"
                className="shop-screen__station-row"
                onClick={() => {
                  openSheet({ kind: "customer", customerId });
                }}
              >
                <span>{requested}</span>
                <StatusPill tone="neutral" icon={null}>
                  {customer?.status}
                </StatusPill>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
