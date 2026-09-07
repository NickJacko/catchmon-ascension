# ADR 0001 — Deterministic PRNG Algorithm

**Status:** Accepted
**Owner doc:** Document 14 §128-136 (Randomness Architecture); Document 15 Task 01.4
**Code:** `src/core/random/`

## Context

Catchmon Shop needs one canonical, deterministic, non-cryptographic random
number generator behind the `RandomSource` port (Document 14 §128), used
for all future gameplay randomness (capture rolls, loot, quality, customer
generation, etc. — none of which are implemented by this task). The game
does not need cryptographic randomness (Document 14 §129).

The algorithm choice is not a trivial detail: once real player saves store
a root seed and a random-event counter (Document 14 §130), the exact
output sequence for a given seed becomes part of what a save reproduces.
This ADR exists specifically because of that reproducibility consequence
(Document 14 §357 — ADRs are for choices like "selected PRNG algorithm").

## Decision

Use a small 32-bit SplitMix-style generator:

- **State:** a single unsigned 32-bit integer.
- **Advance (`nextUint32()`):** add a fixed odd constant (`0x9e3779b9`,
  the same increment SplitMix generators conventionally use) to the state,
  then run the result through a 3-round xor/multiply avalanche mix
  (`core/random/mix32.ts`) using `Math.imul` for correct 32-bit
  multiplication in JavaScript.
- **Why this family:** SplitMix-style generators are simple (a handful of
  lines), have no external dependency, use only standard ECMAScript
  integer/bitwise operations (no `bigint` needed), and are easy to verify
  with hardcoded fixed-vector tests. They are a well-known, widely used
  pattern for exactly this kind of small deterministic game/simulation
  PRNG — not a novel or exotic algorithm.
- **Shared mixing primitive:** the same `mix32` avalanche step is reused
  by the seed-derivation helper (`core/random/seed-derivation.ts`) to
  combine a root seed, an event counter, and an event-context hash into a
  sub-seed (Document 14 §130). One small mixing primitive serves both
  jobs instead of two separate ad hoc hash functions.
- **Event-context hashing:** the event-context string is folded in via
  FNV-1a (32-bit) — a standard, widely published, non-cryptographic
  string hash, verified in this project's tests against FNV-1a's own
  published reference vectors. This keeps context mixing an explicit,
  stable algorithm rather than anything JS-runtime-dependent.
- **Probability rolls:** `nextProbabilityRollBps()` draws an unbiased
  integer in `[0, 9999]` (via rejection sampling, not plain modulo) and
  returns it as a `ProbabilityRollBps` — a distinct branded type from
  `ProbabilityBps` (core/math/probability.ts). `ProbabilityBps` is an
  actual chance/probability, inclusive range `[0, 10000]`; a random roll
  is not itself a probability, so the two are deliberately incompatible
  at compile time (`core/random/probability-roll.ts`). The roll
  deliberately never returns `10000`, so `roll < chance` gives correct
  0%-never / 100%-always boundary behavior with no off-by-one gap.

## Consequences

- **Positive:** deterministic, dependency-free, easy to test exhaustively
  with fixed vectors, fast, and sufficient for game simulation/random
  selection (not for security-sensitive randomness — this is explicitly
  out of scope).
- **Compatibility constraint:** the exact bit-level output of `nextUint32()`
  for a given seed is a compatibility contract from the moment any real
  save persists a root seed and derived outcomes depend on replaying this
  sequence. **Do not casually "improve" `mix32`, the increment constant,
  the FNV-1a context hash, or the rejection-sampling bounds once real
  saves depend on them** — doing so would silently change future
  deterministic outcomes for existing saves. Any future change to this
  algorithm requires an explicit new ADR addressing save/result
  compatibility (migration, versioning, or accepting a compatibility
  break), not a quiet edit to this file's code.
- **Non-goal:** this ADR does not address how a *new* game's root seed is
  first generated (that plausibly wants a nondeterministic source, e.g. a
  platform-provided random value, at save-creation time only). That is
  future work for whichever task first creates a new save, not part of
  Task 01.4's deterministic-stream scope.
