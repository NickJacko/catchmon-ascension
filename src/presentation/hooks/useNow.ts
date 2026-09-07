/*
 * A presentation-only "current time, refreshed every second" tick — used
 * purely to re-render a countdown label (craft timer, expedition timer,
 * construction timer). Never used to decide *whether* something has
 * completed (that is always re-derived from real command/reconciliation
 * results, never guessed client-side from this ticking clock).
 */
import * as React from "react";

export function useNow(intervalMs = 1000): number {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
    }, intervalMs);
    return () => {
      window.clearInterval(id);
    };
  }, [intervalMs]);
  return now;
}

/** Formats a millisecond duration as `1h 58m` / `3m 12s` / `12s`, matching the design system's "exact in chips" numeric convention. */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${String(hours)}h ${String(minutes)}m`;
  if (minutes > 0) return `${String(minutes)}m ${String(seconds)}s`;
  return `${String(seconds)}s`;
}
