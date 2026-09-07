import { describe, expect, it } from "vitest";
import { RelicArchetypeId, RelicInstanceId } from "../../core/ids/index.ts";
import { createRandomSource, toSeed } from "../../core/random/index.ts";
import { toTimestampMs } from "../../core/time/index.ts";
import {
  generateRelic,
  type RelicGenerationConfig,
} from "./relic-generation.ts";
import { type RelicArchetypeDefinition } from "./types.ts";

const ARCHETYPE: RelicArchetypeDefinition = {
  relicArchetypeId: RelicArchetypeId.from("test-core"),
  displayName: "Test Core",
  slot: "CORE",
  mainStatKey: "attack",
  baseMainStatValue: 10,
};

const CONFIG: RelicGenerationConfig = {
  rarityConfig: {
    baseWeights: {
      COMMON: 100,
      UNCOMMON: 60,
      RARE: 30,
      EPIC: 12,
      MYTHIC: 5,
      LEGENDARY: 2,
      ASCENDANT: 1,
    },
    weightGainPerForgeLevelPerTier: 3,
  },
  affixCountByRarity: {
    COMMON: 0,
    UNCOMMON: 1,
    RARE: 2,
    EPIC: 3,
    MYTHIC: 4,
    LEGENDARY: 4,
    ASCENDANT: 5,
  },
  affixBaseValues: {
    CRIT: 400,
    COMBO: 400,
    COUNTER: 400,
    GUARD: 600,
    SKILL_POWER: 4,
    SKILL_HASTE: 500,
    ATTACK_SPEED: 8,
    ELEMENTAL_POWER: 3,
    ACCURACY: 300,
    EVASION: 300,
  },
  mainStatMultiplierByTier: [1, 1.2, 1.5, 2, 2.75, 3.75, 5],
};

const NOW = toTimestampMs(1_000);

describe("generateRelic", () => {
  it("is deterministic — the same seed always produces the same relic", () => {
    const id = RelicInstanceId.from("relic-1");
    const seed = toSeed(42);
    const first = generateRelic(
      createRandomSource(seed),
      id,
      ARCHETYPE,
      1,
      CONFIG,
      NOW,
    );
    const second = generateRelic(
      createRandomSource(seed),
      id,
      ARCHETYPE,
      1,
      CONFIG,
      NOW,
    );
    expect(first).toEqual(second);
  });

  it("a higher Forge Level shifts the rarity distribution upward, observed over many rolls with different seeds", () => {
    const RARITY_INDEX: Readonly<Record<string, number>> = {
      COMMON: 0,
      UNCOMMON: 1,
      RARE: 2,
      EPIC: 3,
      MYTHIC: 4,
      LEGENDARY: 5,
      ASCENDANT: 6,
    };
    const SAMPLE_SIZE = 200;

    function averageRarityIndex(forgeLevel: number): number {
      let total = 0;
      for (let i = 0; i < SAMPLE_SIZE; i += 1) {
        const relic = generateRelic(
          createRandomSource(toSeed(i + 1)),
          RelicInstanceId.from(`sample-${String(i)}`),
          ARCHETYPE,
          forgeLevel,
          CONFIG,
          NOW,
        );
        total += RARITY_INDEX[relic.rarity]!;
      }
      return total / SAMPLE_SIZE;
    }

    expect(averageRarityIndex(80)).toBeGreaterThan(averageRarityIndex(1));
  });

  it("a guaranteed minimum rarity is never undercut", () => {
    for (let i = 0; i < 30; i += 1) {
      const relic = generateRelic(
        createRandomSource(toSeed(i)),
        RelicInstanceId.from(`guaranteed-${String(i)}`),
        ARCHETYPE,
        1,
        CONFIG,
        NOW,
        "LEGENDARY",
      );
      expect(["LEGENDARY", "ASCENDANT"]).toContain(relic.rarity);
    }
  });

  it("main stat value scales up with rarity", () => {
    // "COMMON" is the lowest tier, so it can never act as an effective
    // floor (every natural roll already satisfies "at least COMMON") —
    // a natural low-Forge-Level roll is used instead of a no-op guarantee.
    // ASCENDANT is rare (~0.5% weight at Forge Level 1), so scan a
    // deterministic seed sequence for the first non-ASCENDANT natural roll
    // rather than trusting a single seed not to coincidentally land there.
    let naturalValue: number | undefined;
    for (let seed = 1; seed <= 50 && naturalValue === undefined; seed += 1) {
      const relic = generateRelic(
        createRandomSource(toSeed(seed)),
        RelicInstanceId.from(`r-natural-${String(seed)}`),
        ARCHETYPE,
        1,
        CONFIG,
        NOW,
      );
      if (relic.rarity !== "ASCENDANT") naturalValue = relic.mainStatValue;
    }
    expect(naturalValue).toBeDefined();

    const ascendant = generateRelic(
      createRandomSource(toSeed(1)),
      RelicInstanceId.from("r-ascendant"),
      ARCHETYPE,
      1,
      CONFIG,
      NOW,
      "ASCENDANT",
    );
    expect(ascendant.rarity).toBe("ASCENDANT");
    expect(ascendant.mainStatValue).toBeGreaterThan(naturalValue!);
  });
});
