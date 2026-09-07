/**
 * Design owner: Document 15 Task 05.1 (Canonical Catchmon Reference Audit
 * Adapter); 06 Catchmon Gameplay Integration, 10 World & Element
 * Structure, 13 Asset Taxonomy & Production Plan. Updated post-Phase-5 to
 * integrate the newly provided `reference/catchmons/evolution_lines.json`.
 *
 * A normalization/import adapter for the 6 slice-selected canonical
 * Catchmons (`SELECTED_CATCHMON_SPECIES_IDS`, locked by Task 01.7/05.2).
 * For each one it captures only what is genuinely knowable from
 * `reference/catchmons/` — canonical ID, display name, source rarity-tier
 * folder, canonical evolution-line membership/stage, and a portrait asset
 * reference — and leaves everything else explicitly absent rather than
 * guessed.
 *
 * NOT copied from old gameplay data (Document 15 Task 05.1's own rule):
 * nothing here reads or references any prior-project Catchmon database.
 *
 * RESOLVED (as of the `evolution_lines.json` integration):
 * - `canonicalLineKey`/`canonicalStageIndex` — every one of the 6
 *   selected species has an unambiguous entry in `evolution_lines.json`
 *   (verified against the live file by `canonicalEvolutionLines.test.ts`,
 *   which also asserts the whole 51-line graph now has zero
 *   species-membership collisions post-identity-correction). See
 *   `canonicalEvolutionLines.ts` for the full resolved chains and
 *   `catchmonContent.ts` for how stage data becomes real
 *   `evolvesToSpeciesId` links.
 *
 * UNRESOLVED, on purpose:
 * - `elementId` — no file anywhere in `reference/` or `docs/game-design/`
 *   assigns a real element to any of these 6 species. An earlier pass of
 *   this exact file guessed elements from name etymology (e.g.
 *   "Flamarox" -> fire); that was explicitly identified as fabricating
 *   canonical identity data (CLAUDE.md §8) and reverted. Left absent.
 *   `evolution_lines.json` does not resolve this — it is purely a
 *   line/stage graph, with no element data.
 * - `rarity` — resolved only where the source folder name maps
 *   unambiguously onto the game's five-tier `Rarity` enum (`Common` ->
 *   `COMMON`, `Rare` -> `RARE`, ...). The reference tree also has a
 *   `Starter` folder, which is not one of the five `Rarity` values and is
 *   not asserted to mean any of them (that would be a guess) — species
 *   sourced from `Starter/` keep `sourceFolder: "Starter"` with `rarity`
 *   absent.
 *
 * `catchmonContent.ts`'s domain/capability role assignments are a
 * SEPARATE concern: Document 15 Task 05.2 explicitly allows gameplay-role
 * mapping (domain, capability) to be "provisional slice configuration...
 * stored separately from canonical species identity" even when the full
 * 104-roster mapping doesn't exist yet. That permission covers domain/
 * capability, which are gameplay-role decisions — it does not cover
 * element or evolution, which are canonical identity facts. This file
 * only ever records the latter (resolved or unresolved); it assigns no
 * domain or capability to anything.
 */
import { AssetId, CatchmonSpeciesId } from "../../core/ids/index.ts";
import { type AssetMetadata } from "../../domain/assets/index.ts";
import { type Rarity } from "../../domain/catchmons/index.ts";
import { findCanonicalStage } from "./canonicalEvolutionLines.ts";
import { SELECTED_CATCHMON_SPECIES_IDS } from "./verticalSliceManifest.ts";

/** Maps a literal, observed `reference/catchmons/<folder>/` name onto the game's `Rarity` enum — mechanical, not inferred. `Starter` has no counterpart and is intentionally absent from this map. */
const FOLDER_TO_RARITY: Readonly<Record<string, Rarity>> = {
  Common: "COMMON",
  Rare: "RARE",
  Legendary: "LEGENDARY",
  Mythic: "MYTHIC",
  God: "GOD",
};

/** Mirrors `verticalSliceManifest.ts`'s `UNRESOLVED_CATCHMON_METADATA_FIELDS` convention: named gaps, never a guessed value. Only `elementId` remains unresolved now that `evolution_lines.json` resolves evolution line/stage. */
export const AUDIT_UNRESOLVED_FIELDS = ["elementId"] as const;

export interface CanonicalCatchmonAuditRecord {
  readonly catchmonSpeciesId: CatchmonSpeciesId;
  readonly displayName: string;
  /** The literal `reference/catchmons/<sourceFolder>/` this species' art was found in. */
  readonly sourceFolder: string;
  /** Absent when `sourceFolder` doesn't map onto a known `Rarity` (see module doc). */
  readonly rarity?: Rarity;
  readonly portraitAssetId: AssetId;
  /** This species' real canonical line key, from `evolution_lines.json` (e.g. Flamarox -> "Flaumi"). */
  readonly canonicalLineKey: string;
  /** This species' real, 0-based position within that canonical line. */
  readonly canonicalStageIndex: number;
  /** Always exactly `AUDIT_UNRESOLVED_FIELDS` for this slice — see module doc "UNRESOLVED". */
  readonly unresolvedFields: typeof AUDIT_UNRESOLVED_FIELDS;
}

/**
 * `(speciesId, sourceFolder)` pairs verified directly against the real
 * files in `reference/catchmons/` (see this file's own test, which
 * re-verifies this against the actual asset tree via `import.meta.glob`,
 * the same technique `verticalSliceManifest.test.ts` already uses).
 */
const SOURCE_FOLDERS: Readonly<Record<string, string>> = {
  Flamarox: "Starter",
  Emberynn: "Common",
  Aquilor: "Starter",
  Hydroscythe: "Common",
  Geckon: "Starter",
  Aerorion: "Rare",
};

function buildAuditRecord(
  catchmonSpeciesId: CatchmonSpeciesId,
): CanonicalCatchmonAuditRecord {
  const sourceFolder = SOURCE_FOLDERS[catchmonSpeciesId];
  if (!sourceFolder) {
    throw new Error(
      `No known reference/catchmons/ source folder recorded for "${catchmonSpeciesId}"`,
    );
  }
  const canonicalStage = findCanonicalStage(catchmonSpeciesId);
  if (!canonicalStage) {
    throw new Error(
      `No evolution_lines.json entry recorded for "${catchmonSpeciesId}"`,
    );
  }
  return {
    catchmonSpeciesId,
    displayName: catchmonSpeciesId,
    sourceFolder,
    ...(FOLDER_TO_RARITY[sourceFolder]
      ? { rarity: FOLDER_TO_RARITY[sourceFolder] }
      : {}),
    portraitAssetId: AssetId.from(
      `catchmon-portrait-${catchmonSpeciesId.toLowerCase()}`,
    ),
    canonicalLineKey: canonicalStage.line.lineKey,
    canonicalStageIndex: canonicalStage.stage.stageIndex,
    unresolvedFields: AUDIT_UNRESOLVED_FIELDS,
  };
}

export const CATCHMON_REFERENCE_AUDIT: readonly CanonicalCatchmonAuditRecord[] =
  SELECTED_CATCHMON_SPECIES_IDS.map(buildAuditRecord);

/**
 * One `AssetMetadata` per audited portrait. `status: "FINAL"` — the art
 * itself is real, approved canonical art (not a placeholder drawing) —
 * but `runtimePath` is not yet backed by an actual copy-into-`public/`
 * build step (that is Document 13 asset-pipeline/presentation work, out
 * of scope for this gameplay/domain-focused phase — see the Phase 5
 * report's "remaining technical debt"). `sourcePath` points at the real
 * master file.
 */
export const CATCHMON_PORTRAIT_ASSETS: readonly AssetMetadata[] =
  CATCHMON_REFERENCE_AUDIT.map((record) => ({
    assetId: record.portraitAssetId,
    category: "catchmon-portrait",
    sourcePath: `reference/catchmons/${record.sourceFolder}/${record.catchmonSpeciesId}.png`,
    runtimePath: `/assets/catchmons/${record.catchmonSpeciesId.toLowerCase()}.png`,
    status: "FINAL",
    version: 1,
    // Verified directly from each PNG's IHDR chunk (all six are 1024x1024) —
    // not assumed.
    width: 1024,
    height: 1024,
    format: "png",
    hasAlpha: true,
    semanticOwnerId: record.catchmonSpeciesId,
    tags: ["catchmon", "portrait"],
    preloadClass: "ON_DEMAND",
  }));
