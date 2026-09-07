/**
 * Design owner: 14 Technical Architecture — §44 Domain Command
 * Architecture, §45 Command Envelope.
 *
 * Generic over `TType`/`TPayload` deliberately: this is Task 01.9's
 * skeleton, proven with a synthetic test command (see game-engine.test.ts)
 * — no real gameplay command (START_CRAFT, RESOLVE_CUSTOMER_SALE, ...) is
 * defined here. Those belong to whichever later task implements each one.
 */
import { type CommandId } from "../../core/ids/index.ts";
import { type Clock, type TimestampMs } from "../../core/time/index.ts";

export interface Command<TType extends string, TPayload> {
  readonly commandId: CommandId;
  readonly type: TType;
  readonly issuedAtMs: TimestampMs;
  readonly payload: TPayload;
}

/**
 * The one place a `Command` envelope is stamped with an issue timestamp
 * — via the injected `Clock`, never `Date.now()` (Document 14 §115).
 * `commandId` is supplied by the caller (Document 14 §45: "supports
 * debugging/idempotency where relevant") rather than generated here,
 * since no ID-generation scheme beyond the existing branded-ID
 * boundaries has been introduced.
 */
export function createCommand<TType extends string, TPayload>(
  commandId: CommandId,
  type: TType,
  payload: TPayload,
  clock: Clock,
): Command<TType, TPayload> {
  return { commandId, type, issuedAtMs: clock.nowMs(), payload };
}
