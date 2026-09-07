import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { setNextCommandIdForTests } from "./app/game-store.ts";
import { CommandId } from "./core/ids/index.ts";
import {
  createRandomSource,
  deriveSubSeed,
  rollSucceeds,
  toRandomEventCounter,
  toSeed,
} from "./core/random/index.ts";
import { toProbabilityBps } from "./core/math/probability.ts";
import "./presentation/styles/tokens.css";
import "./presentation/shared.css";
import "./index.css";

declare global {
  interface Window {
    /**
     * E2E-only seam (Document 15 Task 12.6) — see `game-store.ts`'s
     * `setNextCommandIdForTests` doc comment for what this does and why.
     * Attached only when `VITE_E2E_TEST_HOOKS=true` (`.env.e2e`, loaded
     * only via `vite build --mode e2e` — `playwright.config.ts`'s
     * `webServer` command uses this mode; a normal `vite build`/`vite dev`
     * never loads `.env.e2e` and never attaches this). Absent from
     * `window` entirely in a normal build/dev run, not just inert.
     */
    __e2eSetNextCommandId__?: (id: string) => void;
    /**
     * E2E-only seam (Document 15 Task 12.6) — calls the *real* production
     * `deriveSubSeed`/`rollSucceeds` (the same functions
     * `attempt-capture.ts` calls) to find a command-id string that
     * produces `desiredOutcome` at the given `rootSeed`/`counter`/
     * `chanceBps`. Lets an E2E test compute a deterministic capture
     * command id against whatever the app's real, observed state
     * actually is, without duplicating the RNG algorithm in test code or
     * importing across the `src`/`e2e` TypeScript project boundary. Same
     * `VITE_E2E_TEST_HOOKS` gate as `__e2eSetNextCommandId__` above.
     */
    __e2eFindCaptureCommandId__?: (
      rootSeed: number,
      counter: number,
      chanceBps: number,
      desiredOutcome: boolean,
    ) => string | null;
  }
}

if (import.meta.env.VITE_E2E_TEST_HOOKS === "true") {
  window.__e2eSetNextCommandId__ = (id: string) => {
    setNextCommandIdForTests(CommandId.from(id));
  };
  window.__e2eFindCaptureCommandId__ = (
    rootSeed,
    counter,
    chanceBps,
    desiredOutcome,
  ) => {
    const seed = toSeed(rootSeed);
    const eventCounter = toRandomEventCounter(counter);
    const chance = toProbabilityBps(chanceBps);
    for (let i = 0; i < 1000; i += 1) {
      const candidate = `e2e-fixed-capture-${String(i)}`;
      const rollSeed = deriveSubSeed(
        seed,
        eventCounter,
        `ATTEMPT_CAPTURE:${candidate}`,
      );
      if (
        rollSucceeds(createRandomSource(rollSeed), chance) === desiredOutcome
      ) {
        return candidate;
      }
    }
    return null;
  };
}

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
