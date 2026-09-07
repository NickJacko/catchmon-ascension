/**
 * Design owner: 08 Shop Growth & Infrastructure §10-14 Display Capacity,
 * §45-51 Zone 5 Expedition Hub, §85-90 Construction Timing (Task 07.3
 * Infrastructure Purchase Engine, Task 07.4 Construction Timestamp
 * Support — Document 08 now actually read, extending the Task 01.5-era
 * minimal placeholder below). Document 09 §76 Infrastructure Progression
 * Spine and §187 Unlock Condition Model (`INFRASTRUCTURE_STATE`) confirm
 * Infrastructure is a real, gated content category.
 *
 * Content-domain type only — no infrastructure records are created here.
 *
 * This module lives at `domain/shop-infrastructure/`, not
 * `domain/infrastructure/`: it is a shop-content concept (a purchasable
 * station/display/storage upgrade) that is conceptually unrelated to the
 * software "infrastructure" architecture layer (`src/infrastructure/`),
 * but the two names collided under the "**" + "/infrastructure/**"
 * import-boundary glob (Task 00.3's ESLint rule matches any path
 * containing that literal segment, not just the top-level layer) — this
 * name avoids the collision rather than fighting it with a fragile glob
 * (Task 01.6 fix; see eslint.config.js history).
 */
import { type InfrastructureId } from "../../core/ids/index.ts";
import { type Coins } from "../../core/math/index.ts";
import { type UnlockRuleDefinition } from "../progression/index.ts";

/**
 * Extended by Task 07.3/07.4 with exactly the fields this slice's real
 * purchase engine needs — `coinCost` (Document 08 §93-95 "Infrastructure
 * Cost Shape," exact numbers deferred/PROVISIONAL) and the optional
 * `constructionDurationMs` (§85-86: "major infrastructure upgrades may use
 * construction timers... small functional upgrades do not all need
 * timers" — absent means instant, per Task 07.4's explicit "architecture
 * can exist with instant provisional slice upgrade" allowance). Still
 * deliberately minimal beyond that: no capacity/placement/visual fields,
 * since this slice's two upgrades gate a boolean capability
 * (`ownedInfrastructureIds.includes(...)`) rather than a numeric capacity
 * curve Document 08 leaves unspecified.
 */
export interface InfrastructureDefinition {
  readonly infrastructureId: InfrastructureId;
  readonly displayName: string;
  readonly unlockRule: UnlockRuleDefinition;
  readonly coinCost: Coins;
  /** Absent = instant purchase (Task 07.4's "instant provisional slice upgrade" branch). */
  readonly constructionDurationMs?: number;
}
