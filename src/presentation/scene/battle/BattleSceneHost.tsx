/**
 * Design owner: docs/rebuild/15 Phase R9 §7-8. Mirrors `ShopSceneHost.tsx`'s
 * lifecycle contract (mount renderer once, observe resize/visibility/
 * reduced-motion, push structural updates, play cosmetic VFX from the most
 * recent dispatch) — simplified where the battle scene genuinely differs:
 * it has no tap targets of its own (Document 14 §170's "Pixi emits
 * semantic callbacks" doesn't apply here — every real interaction, Attempt
 * Stage included, stays a DOM control in `JourneyScreen.tsx`, per Document
 * 12 §11 "accessible controls do not depend on Pixi hit targets alone").
 */
import * as React from "react";
import { useGameStore } from "../../../app/game-store.ts";
import {
  buildBattleSceneViewModel,
  collectBattleSceneImageUrls,
} from "./battle-scene-view-model.ts";
import { deriveBattleSceneEffects } from "./effects/battle-scene-effects.ts";
import { loadCachedTexture } from "../entities/texture-cache.ts";
import { BattleSceneRenderer } from "./BattleSceneRenderer.ts";
import "./BattleSceneHost.css";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

export function BattleSceneHost(): React.JSX.Element {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const rendererRef = React.useRef<BattleSceneRenderer | null>(null);
  const [initError, setInitError] = React.useState<string | null>(null);

  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const lastEvents = useGameStore((s) => s.lastEvents);

  React.useEffect(() => {
    const hostEl = hostRef.current;
    if (!hostEl || !config) return;
    let cancelled = false;

    const renderer = new BattleSceneRenderer();
    renderer
      .init(hostEl)
      .then(() => {
        if (cancelled) {
          renderer.destroy();
          return;
        }
        rendererRef.current = renderer;
        renderer.setReducedMotion(prefersReducedMotion());
        const rect = hostEl.getBoundingClientRect();
        renderer.resize(rect.width, rect.height);
        const { state: currentState, catalog: currentCatalog } =
          useGameStore.getState();
        if (currentState && currentCatalog) {
          renderer.update(
            buildBattleSceneViewModel(currentState, currentCatalog, {
              leadStatsConfig: config.leadStatsConfig,
            }),
          );
        }
      })
      .catch((error: unknown) => {
        setInitError(error instanceof Error ? error.message : String(error));
      });

    const { state: initialState, catalog: initialCatalog } =
      useGameStore.getState();
    if (initialState && initialCatalog) {
      const urls = collectBattleSceneImageUrls(
        buildBattleSceneViewModel(initialState, initialCatalog, {
          leadStatsConfig: config.leadStatsConfig,
        }),
      );
      for (const url of urls) {
        void loadCachedTexture(url).catch(() => {
          // Load failure evicts its own cache entry (texture-cache.ts) — a later retry can succeed.
        });
      }
    }

    return () => {
      cancelled = true;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, [config]);

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

  React.useEffect(() => {
    if (!state || !catalog || !config) return;
    const viewModel = buildBattleSceneViewModel(state, catalog, {
      leadStatsConfig: config.leadStatsConfig,
    });
    rendererRef.current?.update(viewModel);
  }, [state, catalog, config]);

  React.useEffect(() => {
    if (lastEvents.length === 0) return;
    const effects = deriveBattleSceneEffects(lastEvents);
    rendererRef.current?.playEffects(effects);
  }, [lastEvents]);

  if (initError) {
    return (
      <div
        className="battle-scene-host battle-scene-host--fallback"
        role="status"
      >
        <p>Battle view unavailable. Use the controls below to fight.</p>
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      className="battle-scene-host"
      role="img"
      aria-label="Battle scene — your Lead Catchmon facing the current stage's enemy. Use the controls below to fight."
    />
  );
}
