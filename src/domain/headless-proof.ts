// Architecture scaffold proof for Task 00.3 — not a real domain feature.
// Demonstrates that domain/ code is plain, deterministic TypeScript with
// zero React/PixiJS/Dexie/DOM dependencies. Remove or replace once the
// first real domain module (see Document 15 task sequence) lands.

export function sumNonNegativeIntegers(values: readonly number[]): number {
  return values.reduce((total, value) => {
    if (!Number.isInteger(value) || value < 0) {
      throw new RangeError(
        `Expected a non-negative integer, received ${String(value)}`,
      );
    }
    return total + value;
  }, 0);
}
