export type { Clock } from "./clock.ts";
export { EPOCH_ZERO_MS, type TimestampMs, toTimestampMs } from "./timestamp.ts";
export {
  addDurationToTimestamp,
  elapsedBetween,
  type NegativeElapsedError,
} from "./time-math.ts";
