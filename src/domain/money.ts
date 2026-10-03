const CURRENCY_SYMBOL = "$";

/** Formats an amount in cents, e.g. 350 → "$3.50". */
export function formatPrice(cents: number): string {
  return `${CURRENCY_SYMBOL}${(cents / 100).toFixed(2)}`;
}
