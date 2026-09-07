/**
 * Design owner: Document 15 Task 09.9 (Scene Event Bridge) — "map
 * domain/application events to visual effects: sale, craft ready,
 * customer reaction, upgrade, expedition return. Routine lost VFX are
 * not durable state." A pure mapping function: `AppGameEvent[]` (the
 * batch `game-store.ts` already receives from a real `dispatch()`/
 * `RECONCILE` — nothing new dispatched here) -> a small list of transient
 * `SceneEffect`s. Never persisted; if the tab reloads mid-animation the
 * effect is simply gone (Document 14 §184 Event Replay Boundary — the
 * durable result is already in real state, only the celebratory VFX is
 * lost, which is explicitly acceptable).
 */
import {
  type CustomerId,
  type InfrastructureId,
  type StationId,
} from "../../../core/ids/index.ts";
import { type AppGameEvent } from "../../../app/game-events.ts";

export type SceneEffect =
  | { readonly kind: "SALE"; readonly customerId: CustomerId }
  | {
      readonly kind: "CUSTOMER_REACTION";
      readonly customerId: CustomerId;
      readonly positive: boolean;
    }
  | { readonly kind: "CRAFT_READY"; readonly stationId: StationId }
  | { readonly kind: "UPGRADE"; readonly infrastructureId: InfrastructureId }
  | { readonly kind: "EXPEDITION_RETURN" };

export function deriveSceneEffects(
  events: readonly AppGameEvent[],
): readonly SceneEffect[] {
  const effects: SceneEffect[] = [];
  for (const event of events) {
    switch (event.kind) {
      case "STANDARD_SALE_RESOLVED":
      case "FAVORABLE_DEAL_RESOLVED":
      case "PREMIUM_PITCH_RESOLVED":
      case "RECOMMEND_RESOLVED":
        effects.push({ kind: "SALE", customerId: event.customerId });
        effects.push({
          kind: "CUSTOMER_REACTION",
          customerId: event.customerId,
          positive: true,
        });
        break;
      case "CUSTOMER_DECLINED":
        effects.push({
          kind: "CUSTOMER_REACTION",
          customerId: event.customerId,
          positive: false,
        });
        break;
      case "CRAFT_COMPLETED":
        effects.push({ kind: "CRAFT_READY", stationId: event.stationId });
        break;
      case "INFRASTRUCTURE_PURCHASED":
      case "INFRASTRUCTURE_CONSTRUCTION_COMPLETED":
        effects.push({
          kind: "UPGRADE",
          infrastructureId: event.infrastructureId,
        });
        break;
      case "EXPEDITION_COMPLETED":
        effects.push({ kind: "EXPEDITION_RETURN" });
        break;
      default:
        break;
    }
  }
  return effects;
}
