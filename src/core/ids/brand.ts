/**
 * Lightweight nominal typing for IDs (Document 14 §29 Branded IDs).
 *
 * A `Brand<string, 'ProductId'>` is still a `string` at runtime, but the
 * phantom `__brand` property makes it structurally incompatible with a
 * differently-branded string at compile time — a `RouteId` cannot be
 * passed where a `ProductId` is expected, even though both are strings.
 */
export type Brand<T, B extends string> = T & { readonly __brand: B };

/**
 * The only place a raw string is cast into a branded ID. Everything else
 * should go through the `.from(...)` factory each ID type exports (see
 * ids.ts) rather than writing `value as SomeId` at arbitrary call sites.
 */
function unsafeBrand<Id extends Brand<string, string>>(value: string): Id {
  return value as Id;
}

export interface IdFactory<Id extends Brand<string, string>> {
  /**
   * The single trusted boundary for turning a plain string (from content
   * authoring or a validated application input) into this branded ID.
   * Only rejects the obviously-invalid empty string — this is a boundary
   * mechanism, not a content validation framework.
   */
  from(value: string): Id;
}

export function createIdFactory<Id extends Brand<string, string>>(
  label: string,
): IdFactory<Id> {
  return {
    from(value: string): Id {
      if (value.length === 0) {
        throw new Error(`${label}.from(...) received an empty string`);
      }
      return unsafeBrand<Id>(value);
    },
  };
}
