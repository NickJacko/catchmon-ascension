// @vitest-environment node
import { describe, expect, it } from "vitest";
import { advanceDiscoveryStatus, nextDiscoveryStatus } from "./discovery.ts";

describe("advanceDiscoveryStatus", () => {
  it("allows every legal forward single-step transition", () => {
    expect(advanceDiscoveryStatus("UNKNOWN", "TRACED")).toEqual({
      ok: true,
      value: "TRACED",
    });
    expect(advanceDiscoveryStatus("TRACED", "ENCOUNTERED")).toEqual({
      ok: true,
      value: "ENCOUNTERED",
    });
    expect(advanceDiscoveryStatus("ENCOUNTERED", "OWNED")).toEqual({
      ok: true,
      value: "OWNED",
    });
  });

  it("allows a forward multi-step jump (e.g. UNKNOWN straight to ENCOUNTERED)", () => {
    expect(advanceDiscoveryStatus("UNKNOWN", "ENCOUNTERED")).toEqual({
      ok: true,
      value: "ENCOUNTERED",
    });
  });

  it("allows re-applying the same status (idempotent no-op)", () => {
    expect(advanceDiscoveryStatus("ENCOUNTERED", "ENCOUNTERED")).toEqual({
      ok: true,
      value: "ENCOUNTERED",
    });
  });

  it("rejects every backwards transition", () => {
    expect(advanceDiscoveryStatus("OWNED", "ENCOUNTERED")).toEqual({
      ok: false,
      error: "BACKWARDS_TRANSITION",
    });
    expect(advanceDiscoveryStatus("TRACED", "UNKNOWN")).toEqual({
      ok: false,
      error: "BACKWARDS_TRANSITION",
    });
    expect(advanceDiscoveryStatus("OWNED", "UNKNOWN")).toEqual({
      ok: false,
      error: "BACKWARDS_TRANSITION",
    });
  });
});

describe("nextDiscoveryStatus", () => {
  it("returns the next legal status in sequence", () => {
    expect(nextDiscoveryStatus("UNKNOWN")).toBe("TRACED");
    expect(nextDiscoveryStatus("TRACED")).toBe("ENCOUNTERED");
    expect(nextDiscoveryStatus("ENCOUNTERED")).toBe("OWNED");
  });

  it("returns undefined once already OWNED (terminal)", () => {
    expect(nextDiscoveryStatus("OWNED")).toBeUndefined();
  });
});
