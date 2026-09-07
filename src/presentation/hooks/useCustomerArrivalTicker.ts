/*
 * Design owner: Document 15 Task 08.4 (Shop Operation Screen); confirmed
 * by `isCustomerArrivalEligible`'s own doc comment as "meant to be
 * consulted only from an active session loop (the presentation/app
 * layer, while the shop screen is open)" — this hook is that loop. Mount
 * only while the Shop screen is visible, not at the app root: arrivals
 * should not accrue while the player is on the Catchmons/World screens,
 * matching the "active session" framing (no offline-arrival simulation).
 */
import * as React from "react";
import { isCustomerArrivalEligible } from "../../application/queries/customer/index.ts";
import { toDurationMs } from "../../core/math/index.ts";
import { useGameStore } from "../../app/game-store.ts";

const CHECK_INTERVAL_MS = 1000;

export function useCustomerArrivalTicker(): void {
  const status = useGameStore((s) => s.status);
  const dispatch = useGameStore((s) => s.dispatch);

  React.useEffect(() => {
    if (status !== "ready") return;

    const intervalId = window.setInterval(() => {
      const { state, config, clock } = useGameStore.getState();
      if (!state || !config || !clock) return;
      if (
        isCustomerArrivalEligible(
          state,
          clock.nowMs(),
          toDurationMs(config.minArrivalIntervalMs),
        )
      ) {
        void dispatch("ARRIVE_CUSTOMER", {});
      }
    }, CHECK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status, dispatch]);
}
