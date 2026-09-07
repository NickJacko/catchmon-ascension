/**
 * Design owner: Document 15 Task 08.1 ("UI Store"), Task 08.2 ("Preserve
 * local tab context where practical").
 *
 * Purely ephemeral, presentation-only state — which sheet is open, which
 * sub-tab is selected within a destination. Never gameplay state: nothing
 * here is read by any command/query, and none of it is persisted to the
 * save. Kept in its own store, separate from `game-store.ts`, so the
 * distinction in Document 15's own task wording ("Game Store" vs. "UI
 * Store") stays real in the code, not just in the task title.
 */
import { create } from "zustand";
import {
  type CatchmonSpeciesId,
  type CustomerId,
  type DisplaySlotId,
  type EncounterId,
  type OwnedCatchmonId,
  type RouteId,
  type StationId,
} from "../core/ids/index.ts";

export type ActiveSheet =
  | { readonly kind: "customer"; readonly customerId: CustomerId }
  | { readonly kind: "display"; readonly displaySlotId: DisplaySlotId }
  | { readonly kind: "station"; readonly stationId: StationId }
  | { readonly kind: "inventory" }
  | {
      readonly kind: "catchmonDetail";
      readonly ownedCatchmonId: OwnedCatchmonId;
    }
  | {
      readonly kind: "evolution";
      readonly ownedCatchmonId: OwnedCatchmonId;
      readonly fromSpeciesId: CatchmonSpeciesId;
      readonly toSpeciesId: CatchmonSpeciesId;
    }
  | { readonly kind: "route"; readonly routeId: RouteId }
  | { readonly kind: "expeditionResult" }
  | { readonly kind: "encounter"; readonly encounterId: EncounterId }
  | { readonly kind: "build"; readonly initialTab?: BuildTab };

export type ShopTab = "displays" | "stations" | "inventory";
export type CatchmonsTab = "roster" | "catchdex";
export type WorldTab = "map" | "region";
/** docs/rebuild/12 §7 Build Surface: "Battle Path, Relic Matrix, Skills, Bond formation, Power / Build Fit" — a coherent tabbed sheet, not several home icons. */
export type BuildTab = "path" | "relics" | "skills" | "lead";

interface UiStore {
  readonly activeSheet: ActiveSheet | null;
  openSheet(sheet: ActiveSheet): void;
  closeSheet(): void;

  readonly shopTab: ShopTab;
  setShopTab(tab: ShopTab): void;

  readonly catchmonsTab: CatchmonsTab;
  setCatchmonsTab(tab: CatchmonsTab): void;

  readonly worldTab: WorldTab;
  setWorldTab(tab: WorldTab): void;
}

export const useUiStore = create<UiStore>((set) => ({
  activeSheet: null,
  openSheet: (sheet) => {
    set({ activeSheet: sheet });
  },
  closeSheet: () => {
    set({ activeSheet: null });
  },

  shopTab: "displays",
  setShopTab: (tab) => {
    set({ shopTab: tab });
  },

  catchmonsTab: "roster",
  setCatchmonsTab: (tab) => {
    set({ catchmonsTab: tab });
  },

  worldTab: "map",
  setWorldTab: (tab) => {
    set({ worldTab: tab });
  },
}));
