// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ProductId } from "../../core/ids/index.ts";
import { productItemId } from "./product-item-id.ts";

describe("productItemId", () => {
  it("is deterministic for the same product and quality", () => {
    const productId = ProductId.from("slice-product-01");
    expect(productItemId(productId, "STANDARD")).toBe(
      productItemId(productId, "STANDARD"),
    );
  });

  it("produces distinct ids for different quality grades of the same product", () => {
    const productId = ProductId.from("slice-product-01");
    const standard = productItemId(productId, "STANDARD");
    const fine = productItemId(productId, "FINE");
    const masterwork = productItemId(productId, "MASTERWORK");

    expect(new Set([standard, fine, masterwork]).size).toBe(3);
  });

  it("produces distinct ids for different products at the same quality", () => {
    const a = productItemId(ProductId.from("slice-product-01"), "STANDARD");
    const b = productItemId(ProductId.from("slice-product-02"), "STANDARD");
    expect(a).not.toBe(b);
  });
});
