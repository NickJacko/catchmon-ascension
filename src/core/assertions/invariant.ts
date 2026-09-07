/**
 * Programming/invariant failures (Document 14 §54) — impossible internal
 * states, not expected gameplay failures. These throw in development/test
 * and must never become normal player-facing UX; use Result<T, E> for
 * expected, typed gameplay failures instead.
 */
export class InvariantViolationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvariantViolationError";
  }
}

/**
 * Asserts an internal invariant. Failure means the program reached a
 * state that should be impossible given correct code — not a normal
 * gameplay outcome a player can trigger.
 */
export function invariant(
  condition: boolean,
  message: string,
): asserts condition {
  if (!condition) {
    throw new InvariantViolationError(message);
  }
}

/**
 * Exhaustiveness helper for discriminated unions (Document 15 Task 01.1).
 * TypeScript narrows `value` to `never` once every union member has been
 * handled in a switch/if-chain; reaching this function at runtime means a
 * new union member was added without updating every consumer.
 */
export function assertNever(value: never): never {
  throw new InvariantViolationError(
    `Unreachable case reached: ${JSON.stringify(value)}`,
  );
}
