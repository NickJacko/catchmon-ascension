// @vitest-environment node
import { afterEach, describe, expect, it } from "vitest";
import { createWriterLease, type WriterLease } from "./writer-lease.ts";

/**
 * Real `BroadcastChannel` (a Node/browser global) is used directly rather
 * than mocked — two `createWriterLease` instances sharing the same
 * `saveId` genuinely communicate over it, which is the closest a unit test
 * can get to "test with two tabs" (Document 15 Task 12.1) without an
 * actual multi-tab browser harness. Claim/heartbeat windows are shrunk via
 * options so the suite stays fast; the protocol logic itself is unchanged
 * from real usage.
 */

const SAVE_ID = "writer-lease-test-save";
const CLAIM_WINDOW_MS = 20;
const HEARTBEAT_MS = 30;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const openLeases: WriterLease[] = [];

function openLease(tabId: string): WriterLease {
  const lease = createWriterLease(SAVE_ID, {
    claimWindowMs: CLAIM_WINDOW_MS,
    heartbeatMs: HEARTBEAT_MS,
    generateTabId: () => tabId,
  });
  openLeases.push(lease);
  return lease;
}

afterEach(() => {
  while (openLeases.length > 0) {
    openLeases.pop()?.dispose();
  }
});

describe("createWriterLease", () => {
  it("a lone tab becomes the writer once its claim window elapses", async () => {
    const tabA = openLease("tab-a");
    expect(tabA.getStatus()).toBe("ACQUIRING");

    await wait(CLAIM_WINDOW_MS + 20);

    expect(tabA.getStatus()).toBe("WRITER");
  });

  it("exactly one tab is ever the writer: a second tab opened after the first becomes read-only", async () => {
    const tabA = openLease("tab-a");
    await wait(CLAIM_WINDOW_MS + 20);
    expect(tabA.getStatus()).toBe("WRITER");

    const tabB = openLease("tab-b");
    await wait(CLAIM_WINDOW_MS + 20);

    expect(tabA.getStatus()).toBe("WRITER");
    expect(tabB.getStatus()).toBe("READ_ONLY");
  });

  it("two tabs claiming at the same time converge to exactly one writer (stale-revision-safety precondition)", async () => {
    const tabLower = openLease("tab-1");
    const tabHigher = openLease("tab-2");

    await wait(CLAIM_WINDOW_MS + 20);

    const statuses = [tabLower.getStatus(), tabHigher.getStatus()].sort();
    expect(statuses).toEqual(["READ_ONLY", "WRITER"]);
    // Deterministic tie-break: the lower tabId wins a simultaneous claim.
    expect(tabLower.getStatus()).toBe("WRITER");
    expect(tabHigher.getStatus()).toBe("READ_ONLY");
  });

  it("requestTakeover() moves the writer role: the requester becomes writer, the previous writer becomes read-only", async () => {
    const tabA = openLease("tab-a");
    await wait(CLAIM_WINDOW_MS + 20);
    const tabB = openLease("tab-b");
    await wait(CLAIM_WINDOW_MS + 20);
    expect(tabA.getStatus()).toBe("WRITER");
    expect(tabB.getStatus()).toBe("READ_ONLY");

    tabB.requestTakeover();
    await wait(CLAIM_WINDOW_MS + 20);

    expect(tabB.getStatus()).toBe("WRITER");
    expect(tabA.getStatus()).toBe("READ_ONLY");
  });

  it("requestTakeover() is a no-op when this lease already holds the writer role", async () => {
    const tabA = openLease("tab-a");
    await wait(CLAIM_WINDOW_MS + 20);
    expect(tabA.getStatus()).toBe("WRITER");

    tabA.requestTakeover();
    await wait(10);

    expect(tabA.getStatus()).toBe("WRITER");
  });

  it("disposing the writer releases the lease so a waiting read-only tab can take over", async () => {
    const tabA = openLease("tab-a");
    await wait(CLAIM_WINDOW_MS + 20);
    const tabB = openLease("tab-b");
    await wait(CLAIM_WINDOW_MS + 20);
    expect(tabA.getStatus()).toBe("WRITER");
    expect(tabB.getStatus()).toBe("READ_ONLY");

    tabA.dispose();
    openLeases.splice(openLeases.indexOf(tabA), 1);
    await wait(CLAIM_WINDOW_MS + 20);

    expect(tabB.getStatus()).toBe("WRITER");
  });

  it("notifies subscribers on every status transition", async () => {
    const tabA = openLease("tab-a");
    const seen: string[] = [];
    const unsubscribe = tabA.subscribe((status) => {
      seen.push(status);
    });

    await wait(CLAIM_WINDOW_MS + 20);
    unsubscribe();

    expect(seen).toEqual(["WRITER"]);
  });
});
