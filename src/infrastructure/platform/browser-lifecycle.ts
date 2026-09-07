/**
 * Design owner: 14 Technical Architecture — §199 Platform Lifecycle
 * Adapter ("Create one browser lifecycle service ... Feature code does
 * not subscribe to `document` independently").
 *
 * This is the one place `document`/`window` listeners for visibility and
 * page show/hide are attached. Actually wiring "reconcile on resume" /
 * "flush save on hide" (§199's stated purpose) is App Boot Sequence work
 * (Document 14 §200) — a later, not-yet-authorized task; this task only
 * builds the adapter service itself, matching Task 02.6's own scope
 * ("implement one platform service for: visibility change, page hide/
 * show, resume, viewport hooks where needed").
 *
 * Domain/Application never import this module directly (ESLint blocks
 * `window`/`document` there) — only a future App-layer bootstrap should
 * depend on it.
 *
 * Native Mobile Shell addition: inside a Capacitor WebView,
 * `document.visibilityState`/`pageshow`/`pagehide` generally still fire
 * correctly across an OS-level app switch, but Capacitor's own guidance
 * is to also listen to `@capacitor/app`'s native `appStateChange` event
 * for a more reliable foreground/background signal on Android/iOS. This
 * is intentionally a NARROW addition — it emits into the exact same
 * `LifecycleEvent` vocabulary (`VISIBLE`/`HIDDEN`) the DOM listeners
 * already produce, so every existing subscriber (e.g. `app/game-store.ts`'s
 * "reconcile on resume") picks it up with zero changes, and no second
 * offline-progress/reconciliation system is created. On the web build
 * (no native shell), `Capacitor.isNativePlatform()` is `false` and this
 * is a no-op.
 */
import { Capacitor } from "@capacitor/core";
import { App as CapacitorApp } from "@capacitor/app";

export type LifecycleEvent =
  | { readonly kind: "VISIBLE" }
  | { readonly kind: "HIDDEN" }
  | { readonly kind: "PAGE_SHOW"; readonly persisted: boolean }
  | { readonly kind: "PAGE_HIDE"; readonly persisted: boolean };

export type LifecycleListener = (event: LifecycleEvent) => void;

export interface BrowserLifecycle {
  subscribe(listener: LifecycleListener): () => void;
  /** Removes every attached DOM listener. Intended for test teardown / hot-reload. */
  dispose(): void;
}

/**
 * `target` defaults to the real `document`/`window`, but is injectable so
 * tests can drive it without a real DOM (Document 14 §116: the same
 * injection principle as `Clock`, applied to platform events instead of
 * time).
 */
export function createBrowserLifecycle(
  target: {
    readonly document: Pick<
      Document,
      "addEventListener" | "removeEventListener" | "visibilityState"
    >;
    readonly window: Pick<Window, "addEventListener" | "removeEventListener">;
  } = { document, window },
): BrowserLifecycle {
  const listeners = new Set<LifecycleListener>();
  const emit = (event: LifecycleEvent): void => {
    for (const listener of listeners) {
      listener(event);
    }
  };

  const handleVisibilityChange = (): void => {
    emit({
      kind:
        target.document.visibilityState === "visible" ? "VISIBLE" : "HIDDEN",
    });
  };
  const handlePageShow = (event: Event): void => {
    emit({
      kind: "PAGE_SHOW",
      persisted: (event as PageTransitionEvent).persisted,
    });
  };
  const handlePageHide = (event: Event): void => {
    emit({
      kind: "PAGE_HIDE",
      persisted: (event as PageTransitionEvent).persisted,
    });
  };

  target.document.addEventListener("visibilitychange", handleVisibilityChange);
  target.window.addEventListener("pageshow", handlePageShow);
  target.window.addEventListener("pagehide", handlePageHide);

  // Native Mobile Shell: supplements the DOM listeners above with
  // Capacitor's native foreground/background signal, only inside an
  // actual native shell (no-op on the web build).
  let nativeListenerHandle: Promise<{ remove: () => Promise<void> }> | null =
    null;
  if (Capacitor.isNativePlatform()) {
    nativeListenerHandle = CapacitorApp.addListener(
      "appStateChange",
      (state) => {
        emit({ kind: state.isActive ? "VISIBLE" : "HIDDEN" });
      },
    );
  }

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose() {
      target.document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
      target.window.removeEventListener("pageshow", handlePageShow);
      target.window.removeEventListener("pagehide", handlePageHide);
      void nativeListenerHandle?.then((handle) => handle.remove());
      listeners.clear();
    },
  };
}
