import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import * as Icons from "./index.tsx";
import { ElementFireIcon, Icon } from "./index.tsx";
import { ELEMENT_ICONS } from "./element-icon-map.ts";

describe("icon adapter", () => {
  it("resolves an existing canonical element icon", () => {
    const { container } = render(<ElementFireIcon />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders every one of the 17 canonical elements via the approved GLYPHS mapping", () => {
    const elements = Object.keys(ELEMENT_ICONS);
    expect(elements).toHaveLength(17);
    for (const element of elements) {
      const ElementIcon = ELEMENT_ICONS[element as keyof typeof ELEMENT_ICONS];
      const { container } = render(<ElementIcon />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  });

  it("renders an approved substitute glyph by name via the generic Icon component", () => {
    const { container } = render(<Icon name="coins" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("sizes the rendered glyph via the `size` prop, not the SVG's original intrinsic size", () => {
    const { container } = render(<Icon name="coins" size={40} />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.style.width).toBe("40px");
    expect(wrapper.style.height).toBe("40px");
  });

  // legacy-leak-allow: funken — asserting the legacy icon is ABSENT, not using it.
  it("does not expose the legacy Funken currency icon", () => {
    expect("CurrencyFunkenIcon" in Icons).toBe(false);
  });

  // legacy-leak-allow: rarity — asserting the legacy rarity-tier icon registry is ABSENT, not using it.
  it("does not expose the legacy rarity-tier icon registry (no counterpart in approved-v1)", () => {
    expect("RARITY_ICONS" in Icons).toBe(false);
    expect("RarityGodIcon" in Icons).toBe(false);
  });
});
