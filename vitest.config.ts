import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // `vite-plugin-pwa`'s virtual module doesn't exist under Vitest
      // (this config deliberately doesn't load `VitePWA()` — see
      // `src/test/mocks/pwa-register-stub.ts`'s doc comment).
      "virtual:pwa-register/react": fileURLToPath(
        new URL("./src/test/mocks/pwa-register-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/setupTests.ts"],
    exclude: ["node_modules/**", "e2e/**"],
    pool: "threads",
    fileParallelism: false,
    css: true,
  },
});
