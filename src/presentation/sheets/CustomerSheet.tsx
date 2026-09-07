/*
 * Design owner: Document 15 Task 08.5 (Customer Transaction Sheet) —
 * "request, final values, Standard, Favorable, Premium, Recommend,
 * Decline, disabled reasons. Use Game Engine commands only." Every button
 * below dispatches a real command; every displayed value comes from
 * `getCustomerTransactionOptions` (Task 04.4's quote engine) — this
 * component computes nothing itself.
 */
import * as React from "react";
import { type CustomerId } from "../../core/ids/index.ts";
import { getCustomerTransactionOptions } from "../../application/queries/customer/index.ts";
import { useGameStore } from "../../app/game-store.ts";
import { useUiStore } from "../../app/ui-store.ts";
import { Button, Sheet, StatusPill } from "../components/index.ts";
import { resolveAssetImageUrl } from "../assets/resolve-asset.ts";

const DISABLED_REASON_LABEL: Record<string, string> = {
  CUSTOMER_NOT_FOUND: "Customer is no longer here",
  NO_REQUEST: "No request to sell against",
  OUT_OF_STOCK: "Out of stock",
  INSUFFICIENT_MOMENTUM: "Not enough Momentum",
};

export interface CustomerSheetProps {
  readonly customerId: CustomerId;
}

export function CustomerSheet({
  customerId,
}: CustomerSheetProps): React.JSX.Element | null {
  const state = useGameStore((s) => s.state);
  const catalog = useGameStore((s) => s.catalog);
  const config = useGameStore((s) => s.config);
  const dispatch = useGameStore((s) => s.dispatch);
  const closeSheet = useUiStore((s) => s.closeSheet);

  if (!state || !catalog || !config) return null;
  const customer = state.customers.customers[customerId];
  if (!customer) return null;

  const options = getCustomerTransactionOptions(
    state,
    customerId,
    catalog,
    config.displaySlotIds,
    config.catchmonCapabilityMagnitudes,
  );

  const requestedProduct =
    customer.requestedProductId !== undefined
      ? catalog.products.get(customer.requestedProductId)
      : undefined;

  const archetype = catalog.customerArchetypes.get(customer.archetypeId);
  const portraitUrl = resolveAssetImageUrl(
    archetype ? catalog.assets.get(archetype.portraitAssetId) : undefined,
  );

  const act = (type: string, payload: unknown) => {
    void dispatch(type, payload);
  };

  return (
    <Sheet title="Customer" onClose={closeSheet}>
      <div className="cs-customer-header">
        {portraitUrl && (
          <img
            src={portraitUrl}
            alt=""
            className="cs-customer-header__portrait"
          />
        )}
        <div className="stack stack--tight">
          {archetype && (
            <span className="cs-customer-header__name">
              {archetype.displayName}
            </span>
          )}
          <p className="cs-customer-request">
            {requestedProduct
              ? `Wants ${requestedProduct.displayName} (${customer.requestedQuality ?? "STANDARD"})`
              : "Just browsing — no specific request"}
          </p>
        </div>
      </div>

      <div className="cs-customer-actions">
        <ActionRow
          label="Standard Sale"
          outcome={options.standardSale}
          onAct={() => {
            act("STANDARD_SALE", { customerId });
            closeSheet();
          }}
        />
        <ActionRow
          label="Favorable Deal"
          outcome={options.favorableDeal}
          onAct={() => {
            act("FAVORABLE_DEAL", { customerId });
            closeSheet();
          }}
        />
        <ActionRow
          label="Premium Pitch"
          outcome={options.premiumPitch}
          onAct={() => {
            act("PREMIUM_PITCH", { customerId });
            closeSheet();
          }}
        />
      </div>

      {options.recommendCandidates.length > 0 && (
        <div className="cs-customer-recommend">
          <h3 className="cs-customer-recommend__title">Recommend instead</h3>
          {options.recommendCandidates.map((candidate) => {
            const product = catalog.products.get(candidate.productId);
            return (
              <ActionRow
                key={`${candidate.productId}-${candidate.quality}`}
                label={product?.displayName ?? candidate.productId}
                outcome={candidate.outcome}
                onAct={() => {
                  act("RECOMMEND", {
                    customerId,
                    productId: candidate.productId,
                    quality: candidate.quality,
                  });
                  closeSheet();
                }}
              />
            );
          })}
        </div>
      )}

      <Button
        variant="ghost"
        fullWidth
        onClick={() => {
          act("DECLINE", { customerId });
          closeSheet();
        }}
      >
        Decline
      </Button>
    </Sheet>
  );
}

function ActionRow({
  label,
  outcome,
  onAct,
}: {
  readonly label: string;
  readonly outcome: {
    readonly eligible: boolean;
    readonly disabledReason?: string;
    readonly finalCoins: number;
    readonly momentumDelta: number;
  };
  readonly onAct: () => void;
}): React.JSX.Element {
  return (
    <div className="cs-action-row">
      <div className="cs-action-row__info">
        <span className="cs-action-row__label">{label}</span>
        <span className="cs-action-row__value">
          {outcome.finalCoins} coins · {outcome.momentumDelta >= 0 ? "+" : ""}
          {outcome.momentumDelta} momentum
        </span>
        {!outcome.eligible && outcome.disabledReason && (
          <StatusPill tone="warning">
            {DISABLED_REASON_LABEL[outcome.disabledReason] ??
              outcome.disabledReason}
          </StatusPill>
        )}
      </div>
      <Button
        size="sm"
        variant="secondary"
        disabled={!outcome.eligible}
        onClick={onAct}
      >
        {label}
      </Button>
    </div>
  );
}
