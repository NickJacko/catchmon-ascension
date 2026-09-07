import { describe, expect, it } from "vitest";
import {
  type CustomerId,
  type InfrastructureId,
  type StationId,
} from "../../../core/ids/index.ts";
import { deriveSceneEffects } from "./scene-effects.ts";

const customerId = "customer-1" as CustomerId;
const stationId = "station-1" as StationId;
const infrastructureId = "infra-1" as InfrastructureId;

describe("deriveSceneEffects", () => {
  it("maps a resolved sale to a SALE + positive CUSTOMER_REACTION effect", () => {
    const effects = deriveSceneEffects([
      {
        kind: "STANDARD_SALE_RESOLVED",
        customerId,
        productId: "p" as never,
        quality: "STANDARD",
        coinsEarned: 4 as never,
        momentumDelta: 2,
      },
    ]);
    expect(effects).toEqual([
      { kind: "SALE", customerId },
      { kind: "CUSTOMER_REACTION", customerId, positive: true },
    ]);
  });

  it("maps a decline to a negative CUSTOMER_REACTION effect only", () => {
    const effects = deriveSceneEffects([
      { kind: "CUSTOMER_DECLINED", customerId },
    ]);
    expect(effects).toEqual([
      { kind: "CUSTOMER_REACTION", customerId, positive: false },
    ]);
  });

  it("maps a completed craft to a CRAFT_READY effect", () => {
    const effects = deriveSceneEffects([
      {
        kind: "CRAFT_COMPLETED",
        stationId,
        recipeId: "r" as never,
        outputProductId: "p" as never,
        outputQuantity: 2,
        completesAtMs: 0 as never,
      },
    ]);
    expect(effects).toEqual([{ kind: "CRAFT_READY", stationId }]);
  });

  it("maps both purchase and construction-completion to an UPGRADE effect", () => {
    expect(
      deriveSceneEffects([
        { kind: "INFRASTRUCTURE_PURCHASED", infrastructureId },
      ]),
    ).toEqual([{ kind: "UPGRADE", infrastructureId }]);
    expect(
      deriveSceneEffects([
        { kind: "INFRASTRUCTURE_CONSTRUCTION_COMPLETED", infrastructureId },
      ]),
    ).toEqual([{ kind: "UPGRADE", infrastructureId }]);
  });

  it("maps a completed expedition to an EXPEDITION_RETURN effect", () => {
    const effects = deriveSceneEffects([
      {
        kind: "EXPEDITION_COMPLETED",
        expeditionId: "e" as never,
        routeId: "r" as never,
        leadCatchmonId: "c" as never,
        result: {} as never,
      },
    ]);
    expect(effects).toEqual([{ kind: "EXPEDITION_RETURN" }]);
  });

  it("ignores event kinds with no scene effect (empty array, not a crash)", () => {
    expect(deriveSceneEffects([{ kind: "CRAFT_STARTED" } as never])).toEqual(
      [],
    );
    expect(deriveSceneEffects([])).toEqual([]);
  });
});
