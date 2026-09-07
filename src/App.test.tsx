// @vitest-environment jsdom
import "fake-indexeddb/auto";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import App from "./App.tsx";

afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("boots the real Game Engine and lands on the neutral Journey shell, without requiring the Shop screen", async () => {
    render(<App />);

    expect(screen.getByText(/Loading Catchmon Ascension/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Journey" }),
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole("link", { name: /Catchmons/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /World/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^Shop$/i }),
    ).not.toBeInTheDocument();
  });
});
