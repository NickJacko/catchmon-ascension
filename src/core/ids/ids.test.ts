// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ProductId, RouteId } from "./ids.ts";

describe("branded ID factories (runtime)", () => {
  it("wraps a trusted string value as the branded ID", () => {
    const id = ProductId.from("campfire-soup");
    // Branding is a compile-time-only phantom property — at runtime this
    // is still exactly the plain string that was passed in.
    expect(id).toBe("campfire-soup");
  });

  it("rejects the empty string at the trusted boundary", () => {
    expect(() => ProductId.from("")).toThrow(/empty string/);
  });

  it("different ID factories produce independently usable values", () => {
    const product = ProductId.from("campfire-soup");
    const route = RouteId.from("vulkankrater-to-ozean");
    expect(product).not.toBe(route as unknown);
  });
});

describe("branded ID types (compile-time)", () => {
  it("proves incompatible branded IDs are not interchangeable", () => {
    const product = ProductId.from("campfire-soup");
    expect(RouteId.from("vulkankrater-to-ozean")).toBe("vulkankrater-to-ozean");

    // Positive control: same-branded assignment must typecheck cleanly.
    const sameProduct: ProductId = product;
    expect(sameProduct).toBe(product);

    // @ts-expect-error — a ProductId must not be assignable to RouteId,
    // even though both are strings at runtime. If branding were broken,
    // this line would compile and `pnpm typecheck` would fail on the
    // resulting "unused @ts-expect-error directive" error instead.
    const mismatched: RouteId = product;
    // @ts-expect-error — a raw string literal must not satisfy a branded
    // ID type without going through its `.from(...)` factory.
    const rawString: ProductId = "not-a-real-id";

    expect(mismatched).toBe(product);
    expect(rawString).toBe("not-a-real-id");
  });
});
