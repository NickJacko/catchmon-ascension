// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  createBrowserLifecycle,
  type LifecycleEvent,
} from "./browser-lifecycle.ts";

/**
 * `EventTarget` is a global in both Node and jsdom; using it directly as
 * the injected `document`/`window` fake keeps this test independent of a
 * real DOM (Document 14 §116's Clock-injection principle, applied here).
 */
function createFakeDocument(): EventTarget & {
  visibilityState: DocumentVisibilityState;
} {
  const target = new EventTarget() as EventTarget & {
    visibilityState: DocumentVisibilityState;
  };
  target.visibilityState = "visible";
  return target;
}

function createFakeWindow(): EventTarget {
  return new EventTarget();
}

describe("createBrowserLifecycle", () => {
  it("emits VISIBLE/HIDDEN based on document.visibilityState on visibilitychange", () => {
    const fakeDocument = createFakeDocument();
    const fakeWindow = createFakeWindow();
    const lifecycle = createBrowserLifecycle({
      document: fakeDocument,
      window: fakeWindow,
    });

    const events: LifecycleEvent[] = [];
    lifecycle.subscribe((event) => events.push(event));

    fakeDocument.visibilityState = "hidden";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));
    fakeDocument.visibilityState = "visible";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));

    expect(events).toEqual([{ kind: "HIDDEN" }, { kind: "VISIBLE" }]);
    lifecycle.dispose();
  });

  it("emits PAGE_SHOW/PAGE_HIDE with the event's persisted flag", () => {
    const fakeDocument = createFakeDocument();
    const fakeWindow = createFakeWindow();
    const lifecycle = createBrowserLifecycle({
      document: fakeDocument,
      window: fakeWindow,
    });

    const events: LifecycleEvent[] = [];
    lifecycle.subscribe((event) => events.push(event));

    fakeWindow.dispatchEvent(
      Object.assign(new Event("pageshow"), { persisted: true }),
    );
    fakeWindow.dispatchEvent(
      Object.assign(new Event("pagehide"), { persisted: false }),
    );

    expect(events).toEqual([
      { kind: "PAGE_SHOW", persisted: true },
      { kind: "PAGE_HIDE", persisted: false },
    ]);
    lifecycle.dispose();
  });

  it("stops notifying an unsubscribed listener", () => {
    const fakeDocument = createFakeDocument();
    const fakeWindow = createFakeWindow();
    const lifecycle = createBrowserLifecycle({
      document: fakeDocument,
      window: fakeWindow,
    });

    const events: LifecycleEvent[] = [];
    const unsubscribe = lifecycle.subscribe((event) => events.push(event));
    unsubscribe();

    fakeDocument.visibilityState = "hidden";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));

    expect(events).toEqual([]);
    lifecycle.dispose();
  });

  it("dispose() detaches listeners so further events are not observed", () => {
    const fakeDocument = createFakeDocument();
    const fakeWindow = createFakeWindow();
    const lifecycle = createBrowserLifecycle({
      document: fakeDocument,
      window: fakeWindow,
    });

    const events: LifecycleEvent[] = [];
    lifecycle.subscribe((event) => events.push(event));
    lifecycle.dispose();

    fakeDocument.visibilityState = "hidden";
    fakeDocument.dispatchEvent(new Event("visibilitychange"));

    expect(events).toEqual([]);
  });
});
