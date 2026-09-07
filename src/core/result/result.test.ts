// @vitest-environment node
import { describe, expect, it } from "vitest";
import { err, isErr, isOk, ok, type Result } from "./result.ts";

describe("Result", () => {
  it("ok(...) produces a successful result carrying the value", () => {
    const result = ok(42);
    expect(result).toEqual({ ok: true, value: 42 });
  });

  it("err(...) produces a failed result carrying the error", () => {
    const result = err("INSUFFICIENT_COINS");
    expect(result).toEqual({ ok: false, error: "INSUFFICIENT_COINS" });
  });

  it("discriminates on `ok` so each branch narrows to the correct shape", () => {
    const results: Result<number, string>[] = [ok(1), err("BAD")];

    for (const result of results) {
      if (result.ok) {
        // Narrowed to { ok: true; value: number } — .value exists, .error does not.
        expect(typeof result.value).toBe("number");
      } else {
        // Narrowed to { ok: false; error: string } — .error exists, .value does not.
        expect(typeof result.error).toBe("string");
      }
    }
  });

  it("isOk/isErr type guards agree with the `ok` discriminant", () => {
    const success = ok("done");
    const failure = err("STORAGE_FULL");

    expect(isOk(success)).toBe(true);
    expect(isErr(success)).toBe(false);
    expect(isOk(failure)).toBe(false);
    expect(isErr(failure)).toBe(true);
  });
});
