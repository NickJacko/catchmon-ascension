/**
 * Canonical Result<T, E> (Document 14 §55). Expected, typed gameplay
 * failures (INSUFFICIENT_COINS, STORAGE_FULL, ...) are returned as values
 * through this type — never thrown. Throwing is reserved for
 * programming/invariant violations (see core/assertions).
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(
  result: Result<T, E>,
): result is { ok: true; value: T } {
  return result.ok;
}

export function isErr<T, E>(
  result: Result<T, E>,
): result is { ok: false; error: E } {
  return !result.ok;
}
