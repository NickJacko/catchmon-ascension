// @vitest-environment node
import { describe, expect, it } from "vitest";
import { mix32 } from "./mix32.ts";

describe("mix32", () => {
  it("is a pure function: the same input always produces the same output", () => {
    expect(mix32(12345)).toBe(mix32(12345));
  });

  it("different inputs produce different outputs (spot check, not a proof)", () => {
    expect(mix32(0)).not.toBe(mix32(1));
    expect(mix32(1)).not.toBe(mix32(2));
  });

  it("always returns a value within the uint32 range", () => {
    for (const input of [0, 1, 0x7fffffff, 0x80000000, 0xffffffff]) {
      const output = mix32(input);
      expect(Number.isInteger(output)).toBe(true);
      expect(output).toBeGreaterThanOrEqual(0);
      expect(output).toBeLessThanOrEqual(0xffffffff);
    }
  });
});
