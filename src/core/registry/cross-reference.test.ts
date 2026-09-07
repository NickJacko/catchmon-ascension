// @vitest-environment node
import { describe, expect, it } from "vitest";
import { InvariantViolationError } from "../assertions/invariant.ts";
import { assertReferencesExist } from "./cross-reference.ts";
import { createRegistry } from "./registry.ts";

describe("assertReferencesExist", () => {
  const targetRegistry = createRegistry<string, { id: string }>(
    [{ id: "product-a" }, { id: "product-b" }],
    (item) => item.id,
    "Product",
  );

  it("does not throw when every reference resolves", () => {
    expect(() => {
      assertReferencesExist(
        "Recipe.outputProductId",
        ["product-a"],
        targetRegistry,
      );
    }).not.toThrow();
  });

  it("does not throw for an empty reference list", () => {
    expect(() => {
      assertReferencesExist("Recipe.routineInputs", [], targetRegistry);
    }).not.toThrow();
  });

  it("rejects an unknown reference", () => {
    expect(() => {
      assertReferencesExist(
        "Recipe.outputProductId",
        ["missing-product"],
        targetRegistry,
      );
    }).toThrow(InvariantViolationError);
  });

  it("reports every unknown ID and the target registry label", () => {
    expect(() => {
      assertReferencesExist(
        "Recipe.routineInputs",
        ["product-a", "missing-one", "missing-two"],
        targetRegistry,
      );
    }).toThrow(
      /Recipe\.routineInputs references unknown Product ID\(s\): missing-one, missing-two/,
    );
  });
});
