/*
 * Fixture: mirrors the real exception pattern used in
 * src/presentation/icons/index.ts — a comment that documents *excluding*
 * a legacy concept must not itself be treated as a violation.
 *
 * legacy-leak-allow: funken — naming the excluded legacy currency so the
 * exclusion itself is documented, not implementing/using it.
 * We deliberately do not implement Funken anywhere in this project.
 */
export const NOTE = "documented exclusion example";
