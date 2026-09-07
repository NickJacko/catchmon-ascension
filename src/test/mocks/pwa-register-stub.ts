/**
 * Test-only stand-in for the `virtual:pwa-register/react` module
 * `vite-plugin-pwa` synthesizes at build/dev time — that virtual module
 * does not exist under Vitest (`vitest.config.ts` intentionally does not
 * load the `VitePWA()` plugin; running the real Workbox/service-worker
 * pipeline on every unit-test run would be slow and is not what a unit
 * test is for). Aliased in `vitest.config.ts`'s `resolve.alias` so any
 * component importing the real specifier (`PwaUpdateBanner.tsx`) gets
 * this inert stub instead — same shape as the real `useRegisterSW`
 * (`vite-plugin-pwa/react.d.ts`), doing nothing.
 */
export function useRegisterSW(): {
  needRefresh: [boolean, (value: boolean) => void];
  offlineReady: [boolean, (value: boolean) => void];
  updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
} {
  return {
    needRefresh: [false, () => {}],
    offlineReady: [false, () => {}],
    updateServiceWorker: async () => {},
  };
}
