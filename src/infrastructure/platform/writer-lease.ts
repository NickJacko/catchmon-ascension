/**
 * Design owner: Document 15 Task 12.1 (Multi-Tab Writer Lease); follows the
 * same injectable-adapter shape as `browser-lifecycle.ts` (Document 14 §199
 * Platform Lifecycle Adapter), applied to `BroadcastChannel` instead of
 * `document`/`window`.
 *
 * Doc 15 Task 12.1, verbatim: "Implement: one active writer, BroadcastChannel
 * /lease, takeover flow, stale revision safety. Test with two tabs." Two
 * tabs open on the same save must not both act as an authoritative writer —
 * `GameEngine`'s in-memory revision counter is per-tab-instance, so two tabs
 * each executing commands would each believe they alone own e.g. revision 7,
 * and their commits would silently race in Dexie. This module does not
 * replace `dexie-save-repository.ts`'s existing stale-revision guard
 * (Document 14 §142, `commit()`'s `existing.revision >= snapshot.revision`
 * check) — that guard remains the storage-layer safety net for the rare
 * takeover-race edge case; this module's job is to prevent the everyday
 * case of two tabs ever trying to write concurrently in the first place.
 *
 * Deliberately NOT a general multi-tab sync/multiplayer system: no state
 * replication, no cross-tab command relay, no shared live state. A
 * read-only tab simply cannot dispatch commands until it takes over.
 *
 * Protocol (simple leader-election-over-broadcast, sufficient for a
 * handful of tabs, not a distributed-systems-grade consensus algorithm):
 * - A new tab broadcasts CLAIM and waits `claimWindowMs` for a reply.
 * - The active writer answers any CLAIM with WRITER_ALIVE (so a new tab
 *   doesn't have to wait out its full claim window) and also re-announces
 *   WRITER_ALIVE on a `heartbeatMs` interval (so a tab that was mid-claim
 *   before the writer existed still learns about it).
 * - If two tabs' claims race and both become WRITER before hearing about
 *   each other, each WRITER_ALIVE they exchange is resolved by a
 *   deterministic tie-break (lower `tabId` wins) so exactly one remains
 *   writer.
 * - `requestTakeover()` asks the current writer to relinquish; the writer
 *   answers with RELEASE and drops to read-only; every read-only tab that
 *   observes a RELEASE re-enters the claim protocol (the same convergence
 *   above then elects the next writer).
 */
import { randomUUID } from "./random-uuid.ts";

export type WriterLeaseStatus = "ACQUIRING" | "WRITER" | "READ_ONLY";

export type WriterLeaseListener = (status: WriterLeaseStatus) => void;

export interface WriterLease {
  getStatus(): WriterLeaseStatus;
  subscribe(listener: WriterLeaseListener): () => void;
  /** No-op if this lease already holds the WRITER role. Otherwise asks the current writer to relinquish. */
  requestTakeover(): void;
  /** Releases the lease (if held) and closes the channel. Test/unmount teardown. */
  dispose(): void;
}

/** The minimal `BroadcastChannel` surface this module needs — injectable for deterministic tests (Document 14 §116's Clock-injection principle, applied to the channel transport instead of time). */
export interface LeaseChannel {
  postMessage(message: unknown): void;
  addEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent) => void,
  ): void;
  close(): void;
}

type LeaseMessage =
  | { readonly type: "CLAIM"; readonly tabId: string }
  | { readonly type: "WRITER_ALIVE"; readonly tabId: string }
  | { readonly type: "TAKEOVER_REQUEST"; readonly tabId: string }
  | { readonly type: "RELEASE"; readonly tabId: string };

export interface WriterLeaseOptions {
  /** How long a newly-claiming tab waits for a WRITER_ALIVE reply before assuming the writer role. */
  readonly claimWindowMs?: number;
  /** How often the active writer re-announces itself. */
  readonly heartbeatMs?: number;
  readonly createChannel?: (name: string) => LeaseChannel;
  readonly generateTabId?: () => string;
}

const DEFAULT_CLAIM_WINDOW_MS = 150;
const DEFAULT_HEARTBEAT_MS = 1000;

function isLeaseMessage(data: unknown): data is LeaseMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    "tabId" in data
  );
}

export function createWriterLease(
  saveId: string,
  options: WriterLeaseOptions = {},
): WriterLease {
  const claimWindowMs = options.claimWindowMs ?? DEFAULT_CLAIM_WINDOW_MS;
  const heartbeatMs = options.heartbeatMs ?? DEFAULT_HEARTBEAT_MS;
  const createChannel =
    options.createChannel ??
    ((name: string) => new BroadcastChannel(name) as unknown as LeaseChannel);
  const generateTabId = options.generateTabId ?? (() => randomUUID());

  const tabId = generateTabId();
  const channel = createChannel(`catchmon-ascension-writer-lease:${saveId}`);
  const listeners = new Set<WriterLeaseListener>();

  let status: WriterLeaseStatus = "ACQUIRING";
  let claimTimer: ReturnType<typeof setTimeout> | undefined;
  let heartbeatTimer: ReturnType<typeof setInterval> | undefined;

  const setStatus = (next: WriterLeaseStatus): void => {
    if (status === next) return;
    status = next;
    for (const listener of listeners) listener(status);
  };

  const send = (message: LeaseMessage): void => {
    channel.postMessage(message);
  };

  const stopClaimTimer = (): void => {
    if (claimTimer !== undefined) {
      clearTimeout(claimTimer);
      claimTimer = undefined;
    }
  };
  const stopHeartbeat = (): void => {
    if (heartbeatTimer !== undefined) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = undefined;
    }
  };

  const becomeWriter = (): void => {
    stopClaimTimer();
    setStatus("WRITER");
    send({ type: "WRITER_ALIVE", tabId });
    heartbeatTimer = setInterval(() => {
      send({ type: "WRITER_ALIVE", tabId });
    }, heartbeatMs);
  };

  const becomeReadOnly = (): void => {
    stopClaimTimer();
    stopHeartbeat();
    setStatus("READ_ONLY");
  };

  const startClaim = (): void => {
    stopHeartbeat();
    setStatus("ACQUIRING");
    send({ type: "CLAIM", tabId });
    claimTimer = setTimeout(becomeWriter, claimWindowMs);
  };

  const handleMessage = (event: MessageEvent): void => {
    const message: unknown = event.data;
    if (!isLeaseMessage(message) || message.tabId === tabId) return;

    switch (message.type) {
      case "CLAIM":
        if (status === "WRITER") {
          send({ type: "WRITER_ALIVE", tabId });
        }
        break;
      case "WRITER_ALIVE":
        if (status === "WRITER") {
          // Two tabs both became writer before hearing about each other —
          // deterministic tie-break: the lower tabId keeps the role.
          if (message.tabId < tabId) {
            becomeReadOnly();
          }
        } else if (status === "ACQUIRING") {
          becomeReadOnly();
        }
        break;
      case "TAKEOVER_REQUEST":
        if (status === "WRITER") {
          stopHeartbeat();
          send({ type: "RELEASE", tabId });
          setStatus("READ_ONLY");
        }
        break;
      case "RELEASE":
        if (status === "READ_ONLY") {
          startClaim();
        }
        break;
    }
  };

  channel.addEventListener("message", handleMessage);
  startClaim();

  return {
    getStatus: () => status,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    requestTakeover() {
      if (status === "WRITER") return;
      send({ type: "TAKEOVER_REQUEST", tabId });
    },
    dispose() {
      stopClaimTimer();
      if (status === "WRITER") {
        send({ type: "RELEASE", tabId });
      }
      stopHeartbeat();
      channel.removeEventListener("message", handleMessage);
      channel.close();
      listeners.clear();
    },
  };
}
