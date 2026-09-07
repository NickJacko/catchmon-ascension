// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { CommandId, SaveId } from "../../core/ids/index.ts";
import { FakeClock } from "../../test/helpers/index.ts";
import { createCommand } from "./command.ts";
import { createInMemorySaveRepository } from "./save-repository.ts";
import {
  GameEngine,
  type CommandHandler,
  type CommandOutcome,
} from "./game-engine.ts";

/**
 * Synthetic-only fixtures proving the Task 01.9 acceptance criterion
 * ("a test command can transform a test state deterministically") — no
 * real gameplay command is defined here (see game-engine.ts's header).
 */
interface TestState {
  readonly counter: number;
}

type IncrementPayload = { readonly amount: number };
type TestEvent = { readonly kind: "COUNTER_INCREMENTED"; readonly by: number };

const INCREMENT: CommandHandler<TestState, IncrementPayload, TestEvent> = (
  state,
  command,
) => {
  const outcome: CommandOutcome<TestState, TestEvent> = {
    nextState: { counter: state.counter + command.payload.amount },
    events: [{ kind: "COUNTER_INCREMENTED", by: command.payload.amount }],
  };
  return { ok: true, value: outcome };
};

const REJECT_NEGATIVE: CommandHandler<
  TestState,
  IncrementPayload,
  TestEvent
> = (state, command) => {
  if (command.payload.amount < 0) {
    return {
      ok: false,
      error: { code: "NEGATIVE_AMOUNT", message: "amount must be >= 0" },
    };
  }
  return {
    ok: true,
    value: {
      nextState: { counter: state.counter + command.payload.amount },
      events: [],
    },
  };
};

function createTestEngine() {
  return new GameEngine<TestState, TestEvent>(
    { counter: 0 },
    {
      saveId: SaveId.from("test-save"),
      schemaVersion: 1,
      saveRepository: createInMemorySaveRepository<TestState>(),
      clock: new FakeClock(0),
    },
  );
}

describe("GameEngine", () => {
  it("transforms a test state deterministically via a registered test command", async () => {
    const engine = createTestEngine();
    engine.registerHandler("INCREMENT", INCREMENT);
    const clock = new FakeClock(1000);

    const command = createCommand(
      CommandId.from("cmd-1"),
      "INCREMENT",
      { amount: 5 },
      clock,
    );
    const result = await engine.execute(command);

    expect(result).toEqual({
      ok: true,
      value: {
        nextRevision: 1,
        events: [{ kind: "COUNTER_INCREMENTED", by: 5 }],
        persisted: true,
      },
    });
    expect(engine.getState()).toEqual({ counter: 5 });
    expect(engine.getRevision()).toBe(1);
  });

  it("does not mutate state on a failed command (Document 14 §227)", async () => {
    const engine = createTestEngine();
    engine.registerHandler("REJECT_NEGATIVE", REJECT_NEGATIVE);
    const clock = new FakeClock(0);

    const result = await engine.execute(
      createCommand(
        CommandId.from("cmd-1"),
        "REJECT_NEGATIVE",
        { amount: -1 },
        clock,
      ),
    );

    expect(result.ok).toBe(false);
    expect(engine.getState()).toEqual({ counter: 0 });
    expect(engine.getRevision()).toBe(0);
  });

  it("surfaces persisted:false (without rolling back the applied command) when saveRepository.commit throws (Phase 12 hardening)", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);
    const engine = new GameEngine<TestState, TestEvent>(
      { counter: 0 },
      {
        saveId: SaveId.from("test-save"),
        schemaVersion: 1,
        saveRepository: {
          load: () => Promise.resolve(null),
          commit: () => Promise.reject(new Error("quota exceeded")),
          createBackup: () => Promise.resolve(),
        },
        clock: new FakeClock(0),
      },
    );
    engine.registerHandler("INCREMENT", INCREMENT);

    const result = await engine.execute(
      createCommand(
        CommandId.from("cmd-1"),
        "INCREMENT",
        { amount: 5 },
        new FakeClock(0),
      ),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        nextRevision: 1,
        events: [{ kind: "COUNTER_INCREMENTED", by: 5 }],
        persisted: false,
      },
    });
    // The command's own in-memory effect is not rolled back just because
    // the disk write behind it failed — only durability is at risk.
    expect(engine.getState()).toEqual({ counter: 5 });
    expect(engine.getRevision()).toBe(1);
    expect(consoleErrorSpy).toHaveBeenCalledOnce();
    consoleErrorSpy.mockRestore();
  });

  it("returns a typed error for an unregistered command type", async () => {
    const engine = createTestEngine();
    const clock = new FakeClock(0);

    const result = await engine.execute(
      createCommand(CommandId.from("cmd-1"), "NO_SUCH_COMMAND", {}, clock),
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_COMMAND_TYPE");
    }
  });

  it("executes overlapping calls serially, in order, with no interleaving", async () => {
    const engine = createTestEngine();
    engine.registerHandler("INCREMENT", INCREMENT);
    const clock = new FakeClock(0);

    const results = await Promise.all([
      engine.execute(
        createCommand(
          CommandId.from("cmd-1"),
          "INCREMENT",
          { amount: 1 },
          clock,
        ),
      ),
      engine.execute(
        createCommand(
          CommandId.from("cmd-2"),
          "INCREMENT",
          { amount: 10 },
          clock,
        ),
      ),
      engine.execute(
        createCommand(
          CommandId.from("cmd-3"),
          "INCREMENT",
          { amount: 100 },
          clock,
        ),
      ),
    ]);

    expect(engine.getState()).toEqual({ counter: 111 });
    expect(engine.getRevision()).toBe(3);
    expect(results.map((r) => (r.ok ? r.value.nextRevision : -1))).toEqual([
      1, 2, 3,
    ]);
  });

  it("notifies subscribers with the committed state and revision after a successful command", async () => {
    const engine = createTestEngine();
    engine.registerHandler("INCREMENT", INCREMENT);
    const clock = new FakeClock(0);

    const seen: { state: TestState; revision: number }[] = [];
    const unsubscribe = engine.subscribe((state, revision) => {
      seen.push({ state, revision });
    });

    await engine.execute(
      createCommand(CommandId.from("cmd-1"), "INCREMENT", { amount: 3 }, clock),
    );
    unsubscribe();
    await engine.execute(
      createCommand(CommandId.from("cmd-2"), "INCREMENT", { amount: 4 }, clock),
    );

    expect(seen).toEqual([{ state: { counter: 3 }, revision: 1 }]);
    expect(engine.getState()).toEqual({ counter: 7 });
  });

  it("persists each successful command's snapshot via the SaveRepository port", async () => {
    const saveRepository = createInMemorySaveRepository<TestState>();
    const saveId = SaveId.from("test-save");
    const engine = new GameEngine<TestState, TestEvent>(
      { counter: 0 },
      { saveId, schemaVersion: 1, saveRepository, clock: new FakeClock(5000) },
    );
    engine.registerHandler("INCREMENT", INCREMENT);

    await engine.execute(
      createCommand(
        CommandId.from("cmd-1"),
        "INCREMENT",
        { amount: 9 },
        new FakeClock(0),
      ),
    );

    const stored = await saveRepository.load(saveId);
    expect(stored).toEqual({
      saveId,
      schemaVersion: 1,
      revision: 1,
      savedAtMs: 5000,
      state: { counter: 9 },
    });
  });
});
