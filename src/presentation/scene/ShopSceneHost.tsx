/**
 * Design owner: Document 15 Task 09.1 (Pixi Shop Scene Host); Document 14
 * §170-171 Direct Pixi Integration ("React owns the canvas host lifecycle
 * ... ShopSceneRenderer owns Pixi application/container lifecycle ...
 * React passes high-level view-model updates ... Pixi emits semantic
 * callbacks"), §178 Safe Areas, §186 Pixi Resolution, §328 Scene Error
 * Boundary.
 *
 * This component owns exactly: the DOM host div, the `ShopSceneRenderer`
 * instance's lifecycle, resize/visibility/reduced-motion observation, and
 * routing semantic taps to the real UI Store/router — the same sheets
 * every DOM row in `ShopScreen` already opens (Document 15 Task 09.4-09.8:
 * "no duplicate ... logic in Pixi"). It never computes gameplay state
 * itself; `buildShopSceneViewModel` (imported only for its pure function,
 * not for any Pixi-facing type leakage) does that from the same
 * `useGameStore` state every DOM screen already reads.
 */
import * as React from "react";
import { useNavigate } from "react-router";
import {
  EXPEDITION_HUB_INFRASTRUCTURE_ID,
  PLAYABLE_DISPLAY_SLOT_IDS,
  PLAYABLE_STATION_IDS,
  SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  VERTICAL_SLICE_STATION_ARCHETYPES,
} from "../../content/vertical-slice/index.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import {
  buildShopSceneViewModel,
  collectSceneImageUrls,
} from "./scene-view-model.ts";
import { deriveSceneEffects } from "./effects/scene-effects.ts";
import { loadCachedTexture } from "./entities/texture-cache.ts";
import {
  ShopSceneRenderer,
  type ShopSceneCallbacks,
} from "./ShopSceneRenderer.ts";
import "./ShopSceneHost.css";

const VIEW_MODEL_OPTIONS = {
  stationIds: PLAYABLE_STATION_IDS,
  stationArchetypes: VERTICAL_SLICE_STATION_ARCHETYPES,
  displaySlotIds: PLAYABLE_DISPLAY_SLOT_IDS,
  displaySlotUnlockRequirements: SLICE_DISPLAY_SLOT_UNLOCK_REQUIREMENTS,
  expeditionHubInfrastructureId: EXPEDITION_HUB_INFRASTRUCTURE_ID,
};

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export function ShopSceneHost(): React.JSX.Element {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const rendererRef = React.useRef<ShopSceneRenderer | null>(null);
  const [initError, setInitError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const lastEvents = useGameStore((s) => s.lastEvents);
  const openSheet = useUiStore((s) => s.openSheet);

  // Mount: create the renderer once. Document 14 §328 — a Pixi init
  // failure shows a safe fallback (the DOM lists below remain fully
  // functional either way) instead of corrupting the screen/state.
  React.useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl) return;
    let cancelled = false;

    const callbacks: ShopSceneCallbacks = {
      onStationSelected: (stationId) => {
        openSheet({ kind: "station", stationId });
      },
      onDisplaySelected: (displaySlotId) => {
        openSheet({ kind: "display", displaySlotId });
      },
      onCustomerSelected: (customerId) => {
        openSheet({ kind: "customer", customerId });
      },
      onCatchmonSelected: (ownedCatchmonId) => {
        openSheet({ kind: "catchmonDetail", ownedCatchmonId });
      },
      onExpeditionHubSelected: () => {
        const hubState = useGameStore.getState().state;
        const owned = hubState?.infrastructure.ownedInfrastructureIds.includes(
          EXPEDITION_HUB_INFRASTRUCTURE_ID,
        );
        if (owned) {
          navigate("/world");
          return;
        }
        document.getElementById("expedition-hub-panel")?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "center",
        });
      },
    };

    const renderer = new ShopSceneRenderer();
    renderer
      .init(hostEl, callbacks)
      .then(() => {
        if (cancelled) {
          renderer.destroy();
          return;
        }
        rendererRef.current = renderer;
        renderer.setReducedMotion(prefersReducedMotion());
        const rect = hostEl.getBoundingClientRect();
        renderer.resize(rect.width, rect.height);
        // Phase 12 hardening: the "structural updates" effect below only
        // runs when `state`/`catalog` change — on first mount it fires in
        // the same commit as this effect, before this `.then()` has had a
        // chance to resolve, so `rendererRef.current` is still null and
        // its update is silently dropped (Pixi/WebGL init is inherently
        // async, never same-tick). Without this, the scene stayed empty
        // until some later, unrelated state change happened to re-run
        // that effect. Read the current store directly (same pattern
        // `onExpeditionHubSelected` above already uses) so the freshly
        // ready renderer gets its first real view model immediately.
        const { state: currentState, catalog: currentCatalog } =
          useGameStore.getState();
        if (currentState && currentCatalog) {
          renderer.update(
            buildShopSceneViewModel(
              currentState,
              currentCatalog,
              VIEW_MODEL_OPTIONS,
            ),
          );
        }
      })
      .catch((error: unknown) => {
        setInitError(error instanceof Error ? error.message : String(error));
      });

    // Phase 12 hardening (Priority Area 3): kick off loading every image
    // the *current* scene needs in parallel with the Pixi/WebGL init
    // above, instead of only starting once each entity's constructor runs
    // after that init resolves and `renderer.update()` builds them. Safe
    // to call redundantly later — `loadCachedTexture` is a shared,
    // URL-keyed cache, so this can only make an in-flight/resolved load
    // available sooner, never duplicate a fetch.
    const { state: initialState, catalog: initialCatalog } =
      useGameStore.getState();
    if (initialState && initialCatalog) {
      const urls = collectSceneImageUrls(
        buildShopSceneViewModel(
          initialState,
          initialCatalog,
          VIEW_MODEL_OPTIONS,
        ),
      );
      for (const url of urls) {
        void loadCachedTexture(url).catch(() => {
          // Phase 12 hardening — see CatchmonEntity.ts's identical comment.
        });
      }
    }

    return () => {
      cancelled = true;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [navigate, openSheet]);

  // Resize observation (Document 14 §177 Responsive Camera). `ResizeObserver`
  // is universal in real browsers but absent from jsdom (no test polyfill
  // exists, deliberately — nothing else in this codebase needed one yet);
  // guard rather than crash, same as the `window.matchMedia?.()` optional
  // chaining below.
  React.useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      rendererRef.current?.resize(
        entry.contentRect.width,
        entry.contentRect.height,
      );
    });
    observer.observe(hostEl);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Pause/resume when hidden (Document 15 Phase 9 Rule 10).
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        rendererRef.current?.pause();
      } else {
        rendererRef.current?.resume();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Reduced-motion preference (Document 15 Phase 9 Rule 10).
  React.useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!media) return;
    const apply = () => {
      rendererRef.current?.setReducedMotion(media.matches);
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
    };
  }, []);

  // Structural updates: rebuild the plain view model from real state and
  // hand it to the renderer — the renderer never reads state itself.
  React.useEffect(() => {
    if (!state || !catalog) return;
    const viewModel = buildShopSceneViewModel(
      state,
      catalog,
      VIEW_MODEL_OPTIONS,
    );
    rendererRef.current?.update(viewModel);
  }, [state, catalog]);

  // Cosmetic VFX from the most recent dispatch (Document 15 Task 09.9).
  React.useEffect(() => {
    if (lastEvents.length === 0) return;
    const effects = deriveSceneEffects(lastEvents);
    rendererRef.current?.playEffects(effects);
  }, [lastEvents]);

  if (initError) {
    return (
      <div className="shop-scene-host shop-scene-host--fallback" role="status">
        <p>Living shop view unavailable. Use the lists below.</p>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className="shop-scene-host"
      role="img"
      aria-label="Living shop scene — a visual overview of your stations, displays, customers, and Catchmons. Use the lists below for full control."
    />
  );
}
