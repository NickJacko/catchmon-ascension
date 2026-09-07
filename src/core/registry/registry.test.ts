// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { createRegistry } from "./registry.ts";

interface Fixture {
  id: string;
  value: number;
}

describe("createRegistry", () => {
  it("indexes items by ID and supports get/has/values/ids", () => {
    const registry = createRegistry<string, Fixture>(
      [
        { id: "a", value: 1 },
        { id: "b", value: 2 },
      ],
      (item) => item.id,
      "Fixture",
    );

    expect(registry.size).toBe(2);
    expect(registry.get("a")).toEqual({ id: "a", value: 1 });
    expect(registry.has("b")).toBe(true);
    expect(registry.has("c")).toBe(false);
    expect(registry.values()).toHaveLength(2);
    expect(registry.ids()).toEqual(["a", "b"]);
  });

  it("builds an empty registry from an empty array", () => {
    const registry = createRegistry<string, Fixture>(
      [],
      (item) => item.id,
      "Fixture",
    );
    expect(registry.size).toBe(0);
    expect(registry.get("anything")).toBeUndefined();
  });

  it("rejects a duplicate ID (fails fast, does not silently keep 'last one wins')", () => {
    expect(() =>
      createRegistry<string, Fixture>(
        [
          { id: "a", value: 1 },
          { id: "a", value: 2 },
        ],
        (item) => item.id,
        "Fixture",
      ),
    ).toThrow(InvariantViolationError);
  });

  it("includes the offending ID and registry label in the error message", () => {
    expect(() =>
      createRegistry<string, Fixture>(
        [
          { id: "dup", value: 1 },
          { id: "dup", value: 2 },
        ],
        (item) => item.id,
        "Product",
      ),
    ).toThrow(/Product registry has a duplicate ID: "dup"/);
  });
});
