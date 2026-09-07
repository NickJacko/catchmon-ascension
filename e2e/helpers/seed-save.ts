import { type Page } from "@playwright/test";

/**
 * Shared save-seeding infrastructure — originally written for
 * `save-migration.spec.ts` (Document 15 Task 12.7), extracted here once a
 * second spec (`deterministic-capture.spec.ts`, Task 12.6) needed the same
 * "write a `SaveEnvelope` directly into the real IndexedDB store the app
 * itself reads from" technique, to avoid duplicating the ambient
 * IndexedDB shim below across files (`declare global` interfaces with the
 * same name must stay textually identical everywhere they appear in the
 * same TS program, or the compiler rejects the merge).
 */

export const SLICE_SAVE_ID = "catchmon-ascension-vertical-slice";

/**
 * `e2e/**` type-checks under `tsconfig.node.json` (`lib: ["ES2022"]`, no
 * DOM) since these files run as Playwright's Node-side test driver — but
 * the function bodies passed to `page.evaluate` below actually execute
 * inside the real browser page, where `indexedDB` genuinely exists. This
 * is a minimal ambient shim for exactly the IndexedDB surface used here,
 * not a general DOM-lib substitute.
 */
declare global {
  interface MinimalIDBRequest {
    result: unknown;
    onsuccess: (() => void) | null;
    onerror: (() => void) | null;
  }
  interface MinimalIDBObjectStore {
    put(value: unknown): void;
    get(key: string): MinimalIDBRequest;
  }
  interface MinimalIDBTransaction {
    objectStore(name: string): MinimalIDBObjectStore;
    oncomplete: (() => void) | null;
    onerror: (() => void) | null;
  }
  interface MinimalIDBDatabase {
    objectStoreNames: { contains(name: string): boolean };
    createObjectStore(name: string, options: { keyPath: string }): void;
    transaction(
      storeNames: string,
      mode: "readwrite" | "readonly",
    ): MinimalIDBTransaction;
    close(): void;
  }
  interface MinimalIDBOpenDBRequest {
    result: MinimalIDBDatabase;
    error: { message?: string; name?: string } | null;
    onupgradeneeded: (() => void) | null;
    onerror: (() => void) | null;
    onsuccess: (() => void) | null;
    onblocked: (() => void) | null;
  }
  var indexedDB: {
    open(name: string, version: number): MinimalIDBOpenDBRequest;
  };
}

/** Writes directly into the same Dexie-managed `saves` object store `app/boot.ts` reads from — matching `CatchmonAscensionDatabase`'s `saves: "saveId"` schema (`catchmon-ascension-database.ts`). Runs inside the page via `page.evaluate` so Playwright awaits the async IndexedDB transaction before the test continues — avoids the race an `addInitScript`-based seed would have against the app's own boot-time DB open. */
export async function seedSaveFixture(
  page: Page,
  envelope: unknown,
): Promise<void> {
  await page.evaluate((envelopeToStore) => {
    return new Promise<void>((resolve, reject) => {
      // Dexie's `.version(1)` schema declaration (`catchmon-ascension-database.ts`)
      // maps to real IndexedDB version 10, not 1 — Dexie multiplies its own
      // version numbers by 10 internally.
      const openRequest = indexedDB.open("catchmon-ascension", 10);
      openRequest.onupgradeneeded = () => {
        const db = openRequest.result;
        if (!db.objectStoreNames.contains("saves")) {
          db.createObjectStore("saves", { keyPath: "saveId" });
        }
        if (!db.objectStoreNames.contains("saveBackups")) {
          db.createObjectStore("saveBackups", { keyPath: "saveId" });
        }
      };
      openRequest.onerror = () => {
        reject(
          new Error(
            `Failed to open catchmon-ascension database for seeding: ${openRequest.error?.name ?? "?"} ${openRequest.error?.message ?? "?"}`,
          ),
        );
      };
      openRequest.onblocked = () => {
        reject(
          new Error("catchmon-ascension database open request was blocked"),
        );
      };
      openRequest.onsuccess = () => {
        const db = openRequest.result;
        const tx = db.transaction("saves", "readwrite");
        tx.objectStore("saves").put(envelopeToStore);
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(new Error("Failed to write seeded save fixture"));
        };
      };
    });
  }, envelope);
}

/**
 * Reads back the currently-persisted save envelope for `saveId` — used by
 * `deterministic-capture.spec.ts` to observe the *real* `randomEventCounter`
 * after boot/reconciliation (which reliably advances it past whatever the
 * seed set) rather than assuming a fixed value.
 */
export interface SavedEnvelope {
  readonly gameState: {
    readonly meta: { readonly randomEventCounter: number };
    /** Optional — only `deterministic-capture.spec.ts` needs `meta` alone; `ozean-region-unlock.spec.ts` also reads these to verify unlock/reward persistence. */
    readonly world?: { readonly unlockedRegionIds: readonly string[] };
    readonly inventory?: {
      readonly stacks: Readonly<Record<string, { readonly quantity: number }>>;
    };
  };
}

export async function readSavedEnvelope(
  page: Page,
  saveId: string,
): Promise<SavedEnvelope | undefined> {
  return page.evaluate((id) => {
    return new Promise<SavedEnvelope | undefined>((resolve, reject) => {
      const openRequest = indexedDB.open("catchmon-ascension", 10);
      openRequest.onsuccess = () => {
        const db = openRequest.result;
        const tx = db.transaction("saves", "readonly");
        const getRequest = tx.objectStore("saves").get(id);
        getRequest.onsuccess = () => {
          db.close();
          resolve(getRequest.result as SavedEnvelope | undefined);
        };
        getRequest.onerror = () => {
          db.close();
          reject(new Error("Failed to read saved envelope"));
        };
      };
      openRequest.onerror = () => {
        reject(
          new Error("Failed to open catchmon-ascension database for reading"),
        );
      };
    });
  }, saveId);
}
