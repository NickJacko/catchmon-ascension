// @vitest-environment node
import { describe, expect, it } from "vitest";
import { DURATION, EASING } from "./index.ts";
import canonicalMotionCss from "../../../reference/design-system/approved-v1/tokens/motion.css?raw";

describe("motion tokens adapter", () => {
  it("matches the approved motion.css durations exactly (drift guard, not a redefinition source)", () => {
    expect(canonicalMotionCss).toContain(
      `--dur-instant:${String(DURATION.instant)}ms;`,
    );
    expect(canonicalMotionCss).toContain(
      `--dur-fast:${String(DURATION.fast)}ms;`,
    );
    expect(canonicalMotionCss).toContain(
      `--dur-base:${String(DURATION.base)}ms;`,
    );
    expect(canonicalMotionCss).toContain(
      `--dur-slow:${String(DURATION.slow)}ms;`,
    );
    expect(canonicalMotionCss).toContain(
      `--dur-vfx:${String(DURATION.vfx)}ms;`,
    );
    expect(canonicalMotionCss).toContain(
      `--dur-vfx-max:${String(DURATION.vfxMax)}ms;`,
    );
  });

  it("matches the approved motion.css easing curves exactly (drift guard, not a redefinition source)", () => {
    expect(canonicalMotionCss).toContain(`--ease-out:${EASING.out};`);
    expect(canonicalMotionCss).toContain(`--ease-in-out:${EASING.inOut};`);
    expect(canonicalMotionCss).toContain(
      `--ease-overshoot:${EASING.overshoot};`,
    );
    expect(canonicalMotionCss).toContain(
      `--ease-anticipate:${EASING.anticipate};`,
    );
  });
});
