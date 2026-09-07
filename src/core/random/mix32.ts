/**
 * The 32-bit avalanche-mix step shared by the deterministic PRNG
 * (deterministic-rng.ts) and the seed-derivation hash (seed-derivation.ts)
 * — see ADR 0001 for the algorithm and why the two jobs deliberately
 * share this one mixing primitive instead of each having their own.
 *
 * A pure function of its input: same `input` always produces the same
 * output, using only standard, precisely-specified ECMAScript integer
 * bitwise/`Math.imul` operations — never anything JS-runtime-dependent
 * (object hashing, iteration order, etc.).
 */
export function mix32(input: number): number {
  let t = input >>> 0;
  t = Math.imul(t ^ (t >>> 16), 0x21f0aaad);
  t = Math.imul(t ^ (t >>> 15), 0x735a2d97);
  return (t ^ (t >>> 15)) >>> 0;
}
