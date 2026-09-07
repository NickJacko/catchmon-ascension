// @vitest-environment node
import { describe, expect, it } from "vitest";
import { randomUUID } from "./random-uuid.ts";

const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

describe("randomUUID", () => {
  it("returns a real v4 UUID when crypto.randomUUID is available", () => {
    expect(randomUUID()).toMatch(UUID_V4_PATTERN);
  });

  it("returns distinct values across calls", () => {
    expect(randomUUID()).not.toBe(randomUUID());
  });

  it("falls back to a getRandomValues-built v4 UUID when crypto.randomUUID is unavailable — the exact failure mode of an insecure-context LAN dev URL (pnpm dev:mobile)", () => {
    const original = crypto.randomUUID;
    // @ts-expect-error — simulating the real insecure-context browser
    // environment, where `crypto.randomUUID` genuinely does not exist.
    crypto.randomUUID = undefined;
    try {
      expect(typeof crypto.randomUUID).toBe("undefined");
      expect(randomUUID()).toMatch(UUID_V4_PATTERN);
    } finally {
      crypto.randomUUID = original;
    }
  });
});
