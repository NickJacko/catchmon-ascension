/*
 * Design owner: docs/rebuild/04_RIFT_FORGE_GEAR_AND_LOOT_SYSTEM.md §15 Exit
 * Gate ("Echo Charge -> Forge -> result -> compare -> equip/recycle ->
 * progression reward -> Insight -> Forge Level -> better future
 * distribution... works without any shop-management loop");
 * docs/rebuild/12 §4 Forge Screen; docs/rebuild/15 Phase R8. No final
 * Forge art yet (Document 04 §1 "no magical lamp") — deliberate CSS/
 * `ArtPlaceholder`/`Slot` placeholders throughout, per this phase's own
 * instruction.
 */
import * as React from "react";
import { type RelicInstanceId } from "../../core/ids/index.ts";
import {
  RELIC_MATRIX_SLOTS,
  forgeLevelForTotalForges,
} from "../../domain/forge/index.ts";
import { usePendingAction } from "../hooks/usePendingAction.ts";
import { useForgeQueries } from "../hooks/useQueries.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, Panel, Slot, StatusPill } from "../components/index.ts";

export function ForgeScreen(): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const openSheet = useUiStore((s) => s.openSheet);
  const forgeQueries = useForgeQueries();
  const { pending, run } = usePendingAction();

  const [lastForgedRelicId, setLastForgedRelicId] =
    React.useState<RelicInstanceId | null>(null);

  if (!state || !catalog || !config || !forgeQueries) return null;

  const forgeConfig = config.forgeRelicConfig;
  const forgeLevel = forgeLevelForTotalForges(
    state.forge.totalRelicsForged,
    forgeConfig.forgesPerLevel,
    forgeConfig.forgeLevelCap,
  );
  const insightPct = Math.min(
    100,
    Math.round(
      (state.forge.forgeInsight / forgeConfig.insightGuaranteeThreshold) * 100,
    ),
  );

  const lastForged = lastForgedRelicId
    ? state.relicInventory.relics[lastForgedRelicId]
    : undefined;
  const comparison =
    lastForged && lastForgedRelicId
      ? forgeQueries.relicComparison(state, lastForgedRelicId)
      : null;

  return (
    <div className="stack">
      <div className="row">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            openSheet({ kind: "build", initialTab: "relics" });
          }}
        >
          Relic Matrix
        </Button>
      </div>

      <Panel title="Rift Forge">
        <div className="row row--between">
          <span className="muted">Echo Charges</span>
          <span>{state.forge.echoCharges}</span>
        </div>
        <div className="row row--between">
          <span className="muted">Forge Level</span>
          <span>{forgeLevel}</span>
        </div>
        <div className="row row--between">
          <span className="muted">Forge Insight</span>
          <span>
            {state.forge.forgeInsight} / {forgeConfig.insightGuaranteeThreshold}
          </span>
        </div>
        <div className="meter meter--sm" role="presentation">
          <div
            className="meter__fill"
            style={{ width: `${String(insightPct)}%` }}
          />
        </div>
      </Panel>

      <Panel title="Choose a slot to forge">
        <div className="row">
          {RELIC_MATRIX_SLOTS.map((slot) => {
            const archetype = [...catalog.relicArchetypes.values()].find(
              (candidate) => candidate.slot === slot,
            );
            if (!archetype) return null;
            const affordable =
              state.forge.echoCharges >= forgeConfig.echoChargeCost;
            return (
              <Slot
                key={slot}
                label={`${slot} (${archetype.displayName})`}
                empty
                locked={!affordable}
                onClick={() => {
                  run(async () => {
                    const result = await dispatch("FORGE_RELIC", {
                      relicArchetypeId: archetype.relicArchetypeId,
                    });
                    if (result.ok) {
                      const forgedEvent = result.value.events.find(
                        (
                          event,
                        ): event is Extract<
                          (typeof result.value.events)[number],
                          { kind: "RELIC_FORGED" }
                        > => event.kind === "RELIC_FORGED",
                      );
                      if (forgedEvent) {
                        setLastForgedRelicId(forgedEvent.relicInstanceId);
                      }
                    }
                  });
                }}
              />
            );
          })}
        </div>
        <p className="muted">
          Costs {forgeConfig.echoChargeCost} Echo Charges.
        </p>
      </Panel>

      {lastForged && comparison && (
        <Panel title="Latest Relic" tone="sand">
          <div className="row row--between">
            <span>
              {comparison.archetype.displayName} · {lastForged.rarity}
            </span>
            <StatusPill tone="premium" icon={null}>
              {lastForged.slot}
            </StatusPill>
          </div>
          <div className="row row--between">
            <span className="muted">Power delta</span>
            <span>
              {comparison.powerDelta >= 0 ? "+" : ""}
              {Math.round(comparison.powerDelta)}
            </span>
          </div>
          {comparison.buildFitDeltaBps !== null && (
            <div className="row row--between">
              <span className="muted">Build Fit delta</span>
              <span>
                {comparison.buildFitDeltaBps >= 0 ? "+" : ""}
                {Math.round(comparison.buildFitDeltaBps / 100)}%
              </span>
            </div>
          )}
          <div className="row">
            <Button
              size="sm"
              disabled={comparison.isEquipped || pending}
              onClick={() => {
                run(() =>
                  dispatch("EQUIP_RELIC", {
                    relicInstanceId: lastForged.relicInstanceId,
                  }),
                );
              }}
            >
              {comparison.isEquipped ? "Equipped" : "Equip"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={lastForged.locked || pending}
              onClick={() => {
                run(() =>
                  dispatch("RECYCLE_RELIC", {
                    relicInstanceId: lastForged.relicInstanceId,
                  }),
                );
                setLastForgedRelicId(null);
              }}
            >
              Recycle
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={pending}
              onClick={() => {
                run(() =>
                  dispatch("SET_RELIC_LOCKED", {
                    relicInstanceId: lastForged.relicInstanceId,
                    locked: !lastForged.locked,
                  }),
                );
              }}
            >
              {lastForged.locked ? "Unlock" : "Lock"}
            </Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
