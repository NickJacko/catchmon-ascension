/*
 * Design owner: docs/rebuild/05_BUILD_ARCHETYPES_SKILLS_AND_LOADOUTS.md §7
 * Loadouts, §8 Build Fit; docs/rebuild/12_UX_INFORMATION_ARCHITECTURE_AND_MOBILE_FLOW.md
 * §7 Build Surface ("contextual... a coherent tabbed sheet over several
 * home icons"); docs/rebuild/15 Phase R8. Battle Path / Relic Matrix /
 * Skills / Lead+Bond, all driven by real commands
 * (SELECT_BATTLE_PATH/EQUIP_RELIC/SET_SKILL_LOADOUT/ASSIGN_LEAD_CATCHMON/
 * ASSIGN_BOND_SUPPORT) — no presentation-only build state.
 */
import * as React from "react";
import { RELIC_MATRIX_SLOTS } from "../../domain/forge/index.ts";
import { usePendingAction } from "../hooks/usePendingAction.ts";
import { useForgeQueries, useLoadoutQueries } from "../hooks/useQueries.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore, type BuildTab } from "../../app/ui-store.ts";
import { Button, Sheet, Slot, StatusPill } from "../components/index.ts";

const BATTLE_PATHS = ["BREAKER", "WARDEN", "WEAVER"] as const;
const BOND_SLOTS = [0, 1, 2] as const;

const TABS: readonly { readonly id: BuildTab; readonly label: string }[] = [
  { id: "path", label: "Path" },
  { id: "relics", label: "Relics" },
  { id: "skills", label: "Skills" },
  { id: "lead", label: "Lead & Bond" },
];

export interface BuildSheetProps {
  readonly initialTab?: BuildTab | undefined;
}

export function BuildSheet({
  initialTab,
}: BuildSheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);
  const loadoutQueries = useLoadoutQueries();
  const forgeQueries = useForgeQueries();
  const { pending, run } = usePendingAction();

  const [tab, setTab] = React.useState<BuildTab>(initialTab ?? "path");
  const [expandedSlot, setExpandedSlot] = React.useState<string | null>(null);

  if (!state || !catalog || !config || !loadoutQueries || !forgeQueries) {
    return null;
  }

  const summary = loadoutQueries.summary(state);

  return (
    <Sheet title="Build" onClose={closeSheet}>
      <div className="stack">
        <div role="tablist" className="ds-tabs" aria-label="Build sections">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => {
                setTab(item.id);
              }}
              className={
                tab === item.id
                  ? "ds-tabs__tab ds-tabs__tab--active"
                  : "ds-tabs__tab"
              }
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="row row--between">
          <span className="muted">Power</span>
          <span>{summary.power ?? "—"}</span>
        </div>
        {summary.buildFit && (
          <div className="row row--between">
            <span className="muted">Build Fit</span>
            <span>{Math.round(summary.buildFit.scoreBps / 100)}%</span>
          </div>
        )}

        {tab === "path" && (
          <div className="stack">
            {BATTLE_PATHS.map((pathId) => (
              <Button
                key={pathId}
                variant={
                  state.loadout.battlePathId === pathId
                    ? "primary"
                    : "secondary"
                }
                disabled={pending}
                onClick={() => {
                  run(() =>
                    dispatch("SELECT_BATTLE_PATH", { battlePathId: pathId }),
                  );
                }}
              >
                {pathId}
              </Button>
            ))}
          </div>
        )}

        {tab === "relics" && (
          <div className="stack">
            <div className="row">
              {RELIC_MATRIX_SLOTS.map((slot) => {
                const equippedId = state.loadout.relicMatrix[slot];
                const equipped = equippedId
                  ? state.relicInventory.relics[equippedId]
                  : undefined;
                return (
                  <Slot
                    key={slot}
                    label={slot}
                    empty={!equipped}
                    selected={expandedSlot === slot}
                    onClick={() => {
                      setExpandedSlot(expandedSlot === slot ? null : slot);
                    }}
                  />
                );
              })}
            </div>

            {expandedSlot && (
              <div className="stack stack--tight">
                <span className="muted">{expandedSlot} candidates</span>
                {state.relicInventory.ownedRelicInstanceIds
                  .map((id) => state.relicInventory.relics[id])
                  .filter((relic) => relic?.slot === expandedSlot)
                  .map((relic) => {
                    if (!relic) return null;
                    const comparison = forgeQueries.relicComparison(
                      state,
                      relic.relicInstanceId,
                    );
                    return (
                      <div
                        key={relic.relicInstanceId}
                        className="cs-action-row"
                      >
                        <div className="cs-action-row__info">
                          <span className="cs-action-row__label">
                            {relic.rarity} · {relic.mainStatValue}
                          </span>
                          {comparison && (
                            <span className="cs-action-row__value">
                              Power {comparison.powerDelta >= 0 ? "+" : ""}
                              {Math.round(comparison.powerDelta)}
                            </span>
                          )}
                        </div>
                        <div className="row">
                          {relic.locked && (
                            <StatusPill tone="neutral">Locked</StatusPill>
                          )}
                          <Button
                            size="sm"
                            variant={
                              comparison?.isEquipped ? "ghost" : "primary"
                            }
                            disabled={comparison?.isEquipped || pending}
                            onClick={() => {
                              run(() =>
                                dispatch("EQUIP_RELIC", {
                                  relicInstanceId: relic.relicInstanceId,
                                }),
                              );
                            }}
                          >
                            {comparison?.isEquipped ? "Equipped" : "Equip"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={relic.locked || pending}
                            onClick={() => {
                              run(() =>
                                dispatch("RECYCLE_RELIC", {
                                  relicInstanceId: relic.relicInstanceId,
                                }),
                              );
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
                                  relicInstanceId: relic.relicInstanceId,
                                  locked: !relic.locked,
                                }),
                              );
                            }}
                          >
                            {relic.locked ? "Unlock" : "Lock"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                {!state.relicInventory.ownedRelicInstanceIds.some(
                  (id) =>
                    state.relicInventory.relics[id]?.slot === expandedSlot,
                ) && (
                  <p className="empty-state">No Relics for this slot yet.</p>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "skills" && (
          <div className="stack stack--tight">
            <span className="muted">
              {state.loadout.equippedSkillIds.length} /{" "}
              {config.maxEquippedSkills} equipped
            </span>
            {state.skills.unlockedSkillIds.map((skillId) => {
              const skill = catalog.skills.get(skillId);
              if (!skill) return null;
              const isEquipped =
                state.loadout.equippedSkillIds.includes(skillId);
              const atCap =
                state.loadout.equippedSkillIds.length >=
                config.maxEquippedSkills;
              return (
                <div key={skillId} className="cs-action-row">
                  <div className="cs-action-row__info">
                    <span className="cs-action-row__label">
                      {skill.displayName}
                    </span>
                    <span className="cs-action-row__value">
                      {skill.pathId}
                      {skill.isSignature ? " · Signature" : ""}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant={isEquipped ? "ghost" : "secondary"}
                    disabled={pending || (!isEquipped && atCap)}
                    onClick={() => {
                      const nextIds = isEquipped
                        ? state.loadout.equippedSkillIds.filter(
                            (id) => id !== skillId,
                          )
                        : [...state.loadout.equippedSkillIds, skillId];
                      run(() =>
                        dispatch("SET_SKILL_LOADOUT", { skillIds: nextIds }),
                      );
                    }}
                  >
                    {isEquipped ? "Unequip" : "Equip"}
                  </Button>
                </div>
              );
            })}
            {state.skills.unlockedSkillIds.length === 0 && (
              <p className="empty-state">No skills unlocked yet.</p>
            )}
          </div>
        )}

        {tab === "lead" && (
          <div className="stack stack--tight">
            {state.catchmons.ownedCatchmonIds.map((ownedCatchmonId) => {
              const owned = state.catchmons.ownedCatchmons[ownedCatchmonId];
              if (!owned) return null;
              const species = catalog.catchmonSpecies.get(
                owned.currentSpeciesId,
              );
              const isLead = state.loadout.leadCatchmonId === ownedCatchmonId;
              const bondSlotIndex =
                state.loadout.bondSupportCatchmonIds.includes(ownedCatchmonId)
                  ? owned.currentAssignment.kind === "BOND_SUPPORT"
                    ? owned.currentAssignment.slotIndex
                    : undefined
                  : undefined;
              return (
                <div key={ownedCatchmonId} className="cs-action-row">
                  <div className="cs-action-row__info">
                    <span className="cs-action-row__label">
                      {species?.displayName ?? owned.currentSpeciesId}
                    </span>
                    <span className="cs-action-row__value">
                      Lv.{owned.level}
                      {owned.bondLevel ? ` · Bond ${owned.bondLevel}` : ""}
                    </span>
                  </div>
                  <div className="row">
                    <Button
                      size="sm"
                      variant={isLead ? "primary" : "secondary"}
                      disabled={isLead || pending}
                      onClick={() => {
                        run(() =>
                          dispatch("ASSIGN_LEAD_CATCHMON", { ownedCatchmonId }),
                        );
                      }}
                    >
                      Lead
                    </Button>
                    {BOND_SLOTS.map((slotIndex) => (
                      <Button
                        key={slotIndex}
                        size="sm"
                        variant={
                          bondSlotIndex === slotIndex ? "primary" : "ghost"
                        }
                        disabled={bondSlotIndex === slotIndex || pending}
                        onClick={() => {
                          run(() =>
                            dispatch("ASSIGN_BOND_SUPPORT", {
                              ownedCatchmonId,
                              slotIndex,
                            }),
                          );
                        }}
                      >
                        {slotIndex + 1}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Sheet>
  );
}
