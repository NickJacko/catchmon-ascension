/**
 * Design owner: Document 15 Task 08.1 (Application Providers / Stores) —
 * "thin Zustand Game Store bridge... No game formulas in stores."
 *
 * This store holds exactly three things: the boot status, the latest
 * `GameState` snapshot (read-only from React's perspective — updated only
 * by `GameEngine.subscribe`), and a `dispatch` function that constructs a
 * `Command` envelope and calls `engine.execute()`. It contains no
 * gameplay rule, no derived-state calculation beyond what a query already
 * computes — every screen composes this store's `state`/`catalog` with a
 * real `application/queries/*` function, never its own logic.
 */
import { create } from "zustand";
import { CommandId } from "../core/ids/index.ts";
import { err } from "../core/result/index.ts";
import { createCommand, type GameEngine } from "../application/engine/index.ts";
import { type GameCatalog } from "../domain/catalog/index.ts";
import { type GameState } from "../domain/game-state/index.ts";
import { type Clock } from "../core/time/index.ts";
import {
  createBrowserLifecycle,
  createWriterLease,
  randomUUID,
  type WriterLease,
  type WriterLeaseStatus,
} from "../infrastructure/platform/index.ts";
import { bootGame, SLICE_SAVE_ID } from "./boot.ts";
import { type AppGameEvent } from "./game-events.ts";
import { type GameConfig } from "./game-config.ts";

export type BootStatus = "booting" | "ready" | "error";

/**
 * `createCommand`'s own doc comment (`application/engine/command.ts`)
 * already establishes that `commandId` is "supplied by the caller...
 * rather than generated here" — this is that caller, and it is the one
 * place in the app that decides how. Kept swappable (module-level,
 * reassignable) rather than hardcoding `crypto.randomUUID()` inline, the
 * same injection shape already used for `Clock` — production never calls
 * `setNextCommandIdForTests`, so normal play is always genuinely random.
 */
let generateCommandId: () => CommandId = () => CommandId.from(randomUUID());

/**
 * Test-only seam (Document 15 Task 12.6 gap closure — deterministic
 * capture E2E coverage). Overrides exactly the *next* dispatch's command
 * ID, then reverts to the real random generator on its own — a test that
 * sets this, clicks the real "Attempt Capture" button, and moves on
 * cannot leave every later dispatch in the same page non-random by
 * accident. `attempt-capture.ts` derives its roll seed from
 * `rootRandomSeed` + `randomEventCounter` + this ID, all three already
 * fully controllable from outside the app (the first two via a seeded
 * save fixture, this one here) — so a specific roll outcome becomes
 * reproducible without touching capture probabilities, without a
 * test-only gameplay branch, and without mocking the command's result:
 * the real command still executes through the real engine and real
 * domain handler.
 */
export function setNextCommandIdForTests(id: CommandId): void {
  const restore = generateCommandId;
  generateCommandId = () => {
    generateCommandId = restore;
    return id;
  };
}

/** Resolves once `lease` reports a definite role (`WRITER`/`READ_ONLY`), skipping the wait entirely if it has already left `ACQUIRING` by the time this is called. */
function waitForResolvedLeaseStatus(
  lease: WriterLease,
): Promise<WriterLeaseStatus> {
  const current = lease.getStatus();
  if (current !== "ACQUIRING") {
    return Promise.resolve(current);
  }
  return new Promise((resolve) => {
    const unsubscribe = lease.subscribe((status) => {
      unsubscribe();
      resolve(status);
    });
  });
}

interface GameStore {
  readonly status: BootStatus;
  readonly error?: string;
  readonly state?: GameState;
  readonly catalog?: GameCatalog;
  readonly config?: GameConfig;
  readonly engine?: GameEngine<GameState, AppGameEvent>;
  readonly clock?: Clock;
  /**
   * The event batch from the most recently *successful* dispatch — a
   * side channel for cosmetic VFX only (Document 15 Task 09.9 Scene
   * Event Bridge), never gameplay-authoritative. `state` above remains
   * the single owner of durable truth; this only lets the Pixi scene
   * react to *what just changed* without diffing state itself. A new
   * array reference on every dispatch (including an empty one), so a
   * `useEffect` keyed on it fires exactly once per dispatch.
   */
  readonly lastEvents: readonly AppGameEvent[];
  /**
   * Phase 12 hardening: `true` once a dispatch's domain effect applied but
   * `GameEngine`'s persistence write behind it failed (see
   * `CommandResult.persisted`). Cleared by the next dispatch that persists
   * successfully — its snapshot already carries every prior in-memory
   * change, so a later successful write resolves the risk window. Purely
   * informational: never blocks or rolls back gameplay.
   */
  readonly lastPersistFailed: boolean;
  /**
   * Document 15 Task 12.1 (Multi-Tab Writer Lease). "ACQUIRING" briefly
   * after boot while this tab negotiates with any other open tab over
   * `BroadcastChannel`; "WRITER" is the normal single-tab state that
   * permits `dispatch()`; "READ_ONLY" means another tab already holds the
   * lease — `dispatch()` refuses every command until `requestWriterTakeover`
   * succeeds, so two tabs can never silently act as simultaneous writers
   * against the same save.
   */
  readonly writerStatus: WriterLeaseStatus;
  requestWriterTakeover(): void;
  boot(): Promise<void>;
  dispatch<TPayload>(
    type: string,
    payload: TPayload,
  ): ReturnType<GameEngine<GameState, AppGameEvent>["execute"]>;
}

export const useGameStore = create<GameStore>((set, get) => ({
  status: "booting",
  lastEvents: [],
  lastPersistFailed: false,
  writerStatus: "WRITER",
  requestWriterTakeover() {
    // Replaced with a real lease-bound implementation once boot() creates
    // the lease; a no-op default keeps this callable pre-boot without an
    // optional-chaining check at every call site.
  },

  async boot() {
    try {
      const { engine, catalog, config, clock } = await bootGame();
      engine.subscribe((nextState) => {
        set({ state: nextState });
      });

      /*
       * Document 15 Task 12.1 — same "src/app/ bridges infrastructure to
       * the store" reasoning as the lifecycle subscription below. Created
       * and awaited to its first real resolution (WRITER or READ_ONLY)
       * *before* `status` flips to "ready": otherwise the app becomes
       * interactive while the lease is still "ACQUIRING" (its
       * `claimWindowMs`, ~150ms), during which `dispatch()`'s writer-lease
       * gate below would silently refuse every command — a real, if
       * narrow, window where a normal solo player's very first tap after
       * load/reload could be dropped. Booting ~150ms slower (still inside
       * the existing "booting" screen) is the correct trade, not a UI
       * fix — the boot sequence should not call itself "ready" while a
       * prerequisite for `dispatch()` to function is still pending.
       */
      const writerLease = createWriterLease(SLICE_SAVE_ID);
      const initialWriterStatus = await waitForResolvedLeaseStatus(writerLease);

      set({
        status: "ready",
        engine,
        catalog,
        config,
        clock,
        state: engine.getState(),
        writerStatus: initialWriterStatus,
        requestWriterTakeover() {
          writerLease.requestTakeover();
        },
      });
      writerLease.subscribe((writerStatus) => {
        set({ writerStatus });
      });

      /*
       * "Reconcile on resume" (Document 14 §117-118) — lives here, not in
       * a presentation hook, because subscribing to `BrowserLifecycle`
       * requires importing `infrastructure/platform`, which
       * `src/presentation/**` is forbidden from doing (ESLint
       * architecture boundary). `src/app/` is the one layer allowed to
       * bridge the two.
       */
      const lifecycle = createBrowserLifecycle();
      lifecycle.subscribe((event) => {
        if (event.kind === "VISIBLE" || event.kind === "PAGE_SHOW") {
          void get().dispatch("RECONCILE", { reason: "FOCUS" });
        }
      });
    } catch (bootError) {
      set({
        status: "error",
        error:
          bootError instanceof Error ? bootError.message : String(bootError),
      });
    }
  },

  async dispatch(type, payload) {
    const { engine, clock, writerStatus } = get();
    if (!engine || !clock) {
      throw new Error("dispatch() called before the game finished booting");
    }
    if (writerStatus !== "WRITER") {
      // Document 15 Task 12.1: this tab does not hold the writer lease
      // (another tab does, or negotiation is still in progress) — refuse
      // rather than risk two tabs committing divergent revisions for the
      // same save. `SaveStatusBanner`'s writer-lease variant is the
      // player-facing surface for this state and offers "Use game here".
      return err({
        code: "NOT_ACTIVE_WRITER",
        message:
          "This tab is read-only because another tab has this save open.",
      });
    }
    const command = createCommand(generateCommandId(), type, payload, clock);
    const result = await engine.execute(command);
    if (result.ok) {
      set({
        lastEvents: result.value.events,
        lastPersistFailed: !result.value.persisted,
      });
    }
    return result;
  },
}));
