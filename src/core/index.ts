/**
 * Core layer public entry point (Document 14 §16, §26 Barrel File
 * Discipline). Deliberately small — seven sub-namespaces, not a barrel
 * for the whole application.
 */
export * from "./ids/index.ts";
export * from "./result/index.ts";
export * from "./assertions/index.ts";
export * from "./math/index.ts";
export * from "./time/index.ts";
export * from "./random/index.ts";
export * from "./registry/index.ts";
