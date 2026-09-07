/**
 * Design owner: 14 Technical Architecture — §46 Game Engine Entry Point,
 * §47 No Direct Store Mutation, §48 Command Result, §49 Domain Events,
 * §50-52 Not Full Event Sourcing, §226 Application Transaction Model,
 * §227 No Partial Command Commit, §228 Immutability.
 *
 * `GameEngine<TState, TEvent>` is generic on purpose: Task 01.9 is a
 * skeleton proving the command -> handler -> result -> next state ->
 * events -> persistence -> publication mechanism, not a wiring of real
 * gameplay commands (START_CRAFT, RESOLVE_CUSTOMER_SALE, ...) — those
 * belong to whichever later task actually implements each rule. See
 * game-engine.test.ts for the synthetic "test command transforms a test
 * state deterministically" proof.
 *
 * Immer is not introduced (Document 14 §229 marks it optional, not
 * required); handlers do plain immutable object construction, matching
 * §228's "explicit immutable updates" option and CLAUDE.md's rule against
 * adding a dependency for convenience alone.
 */
import { type SaveId } from "../../core/ids/index.ts";
import { type Clock } from "../../core/time/index.ts";
import { err, ok, type Result } from "../../core/result/index.ts";
import { type Command } from "./command.ts";
import { type SaveRepository, type StoredSave } from "./save-repository.ts";

/** Document 14 §53-54: expected, typed failures — not thrown. */
export interface CommandError {
  readonly code: string;
  readonly message: string;
}

/** What a handler produces on success: the next state plus any domain events. */
export interface CommandOutcome<TState, TEvent> {
  readonly nextState: TState;
  readonly events: readonly TEvent[];
}

/**
 * A pure function: `(state, command) -> Result<outcome, error>`. No I/O, no
 * Date.now()/Math.random() (guarded by the application ESLint block) —
 * anything nondeterministic a handler needs must arrive via the command
 * payload or a future context parameter, not be read ad hoc.
 */
export type CommandHandler<TState, TPayload, TEvent> = (
  state: TState,
  command: Command<string, TPayload>,
) => Result<CommandOutcome<TState, TEvent>, CommandError>;

/** Document 14 §48, the success shape (the failure shape is `CommandError` via `Result`). */
export interface CommandResult<TEvent> {
  readonly nextRevision: number;
  readonly events: readonly TEvent[];
  /**
   * Phase 12 hardening: `false` when `saveRepository.commit()` threw for
   * this command. The command itself still applied — its domain mutation
   * already happened and is not rolled back (Document 14 §227 concerns
   * the handler's atomicity, not whether the disk write behind it
   * succeeded) — but the caller should know progress may not survive a
   * reload until a later command persists successfully.
   */
  readonly persisted: boolean;
}

export type GameEngineListener<TState> = (
  state: TState,
  revision: number,
) => void;

export interface GameEngineOptions<TState> {
  readonly saveId: SaveId;
  readonly schemaVersion: number;
  readonly saveRepository: SaveRepository<TState>;
  readonly clock: Clock;
  /**
   * The revision already reflected by `initialState` (Document 14 §142
   * Save Revision hardening). Defaults to `0` for a genuinely brand-new
   * save. A loaded/migrated existing save MUST pass its real persisted
   * revision here — otherwise this engine's local counter restarts at 0
   * on every boot while `saveRepository.commit()`'s stale-write guard
   * still compares against the much higher revision already on disk,
   * silently rejecting every persist after a reload until the local
   * counter organically climbs back past the old value (a real bug this
   * option exists to close, not a hypothetical one).
   */
  readonly initialRevision?: number;
}

/**
 * Serial command engine over a generic `TState`. "Serial" is enforced
 * even under overlapping/unawaited callers by chaining every `execute()`
 * onto an internal queue — no two commands ever run interleaved
 * (Document 14 §227: a command must not leave partial state behind for a
 * concurrently-running command to observe).
 */
export class GameEngine<TState, TEvent> {
  private state: TState;
  private revision: number;
  private readonly handlers = new Map<
    string,
    CommandHandler<TState, unknown, TEvent>
  >();
  private readonly listeners = new Set<GameEngineListener<TState>>();
  private readonly saveId: SaveId;
  private readonly schemaVersion: number;
  private readonly saveRepository: SaveRepository<TState>;
  private readonly clock: Clock;
  private queue: Promise<unknown> = Promise.resolve();

  constructor(initialState: TState, options: GameEngineOptions<TState>) {
    this.state = initialState;
    this.revision = options.initialRevision ?? 0;
    this.saveId = options.saveId;
    this.schemaVersion = options.schemaVersion;
    this.saveRepository = options.saveRepository;
    this.clock = options.clock;
  }

  registerHandler<TPayload>(
    type: string,
    handler: CommandHandler<TState, TPayload, TEvent>,
  ): void {
    this.handlers.set(type, handler as CommandHandler<TState, unknown, TEvent>);
  }

  getState(): TState {
    return this.state;
  }

  getRevision(): number {
    return this.revision;
  }

  /** Document 14 §46 step 7: exposes updated state to subscribers (e.g. selectors) after commit. */
  subscribe(listener: GameEngineListener<TState>): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Queues `command` for serial execution and resolves once it has run.
   * On success the engine's in-memory state and revision have already
   * been committed and subscribers notified before this promise settles;
   * persistence (via `saveRepository.commit`) is awaited too, matching
   * Document 14 §143's "forced flush" mode rather than debounced
   * write-behind, which this skeleton does not implement.
   */
  execute<TPayload>(
    command: Command<string, TPayload>,
  ): Promise<Result<CommandResult<TEvent>, CommandError>> {
    const run = this.queue.then(() => this.executeNow(command));
    this.queue = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }

  private async executeNow<TPayload>(
    command: Command<string, TPayload>,
  ): Promise<Result<CommandResult<TEvent>, CommandError>> {
    const handler = this.handlers.get(command.type);
    if (!handler) {
      return err({
        code: "UNKNOWN_COMMAND_TYPE",
        message: `No handler registered for command type "${command.type}"`,
      });
    }

    const outcome = handler(this.state, command as Command<string, unknown>);
    if (!outcome.ok) {
      // Document 14 §227: no mutation has happened yet, so failure here is
      // already atomic — nothing to roll back.
      return err(outcome.error);
    }

    this.state = outcome.value.nextState;
    this.revision += 1;
    const revision = this.revision;

    for (const listener of this.listeners) {
      listener(this.state, revision);
    }

    const snapshot: StoredSave<TState> = {
      saveId: this.saveId,
      schemaVersion: this.schemaVersion,
      revision,
      savedAtMs: this.clock.nowMs(),
      state: this.state,
    };
    let persisted = true;
    try {
      await this.saveRepository.commit(snapshot);
    } catch (error) {
      // Phase 12 hardening: a write failure (quota exceeded, IndexedDB
      // blocked/unavailable, ...) must not become an unhandled rejection
      // that silently drops the persistence attempt while the player's
      // in-memory game continues as if nothing happened.
      persisted = false;
      console.error(
        `GameEngine: failed to persist revision ${String(revision)} for save "${String(this.saveId)}"`,
        error,
      );
    }

    return ok({
      nextRevision: revision,
      events: outcome.value.events,
      persisted,
    });
  }
}
