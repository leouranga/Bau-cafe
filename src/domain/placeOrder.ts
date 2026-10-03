import { calculateTotals, lineTotal } from "./pricing";
import type { CartLine, CartSnapshot, MenuItem } from "./types";



export const MIN_QUANTITY = 1;
export const MAX_QUANTITY = 10;

export type OrderErrorCode = "EMPTY_CART" | "INVALID_QUANTITY" | "OUT_OF_STOCK";

export interface OrderError {
  readonly code: OrderErrorCode;
  readonly message: string;
  /** The items that caused the error (empty for EMPTY_CART). */
  readonly items: readonly MenuItem[];
}

export interface OrderLine {
  readonly itemId: string;
  readonly name: string;
  readonly unitPrice: number;
  readonly quantity: number;
  readonly lineTotal: number;
}

export interface Order {
  readonly orderNumber: string;
  readonly lines: readonly OrderLine[];
  readonly discountLabel: string;
  readonly subtotal: number;
  readonly discount: number;
  readonly total: number;
  readonly placedAt: Date;
}

export type PlaceOrderResult =
  | { readonly ok: true; readonly order: Order }
  | { readonly ok: false; readonly error: OrderError };

export interface PlaceOrderDeps {
  nextOrderNumber: () => string;
  now: () => Date;
}

/** Returns a generator that hands out "#1001", "#1002", … */
export function createOrderNumberGenerator(start = 1001): () => string {
  let next = start;
  return () => `#${next++}`;
}

const defaultDeps: PlaceOrderDeps = {
  nextOrderNumber: createOrderNumberGenerator(),
  now: () => new Date(),
};

export function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= MIN_QUANTITY && quantity <= MAX_QUANTITY;
}


export function placeOrder(cart: CartSnapshot, deps: Partial<PlaceOrderDeps> = {}): PlaceOrderResult {
  const { nextOrderNumber, now } = { ...defaultDeps, ...deps };

  const error = findError(cart.lines);
  if (error) {
    return { ok: false, error };
  }

  const totals = calculateTotals(cart.lines, cart.discount);

  return {
    ok: true,
    order: {
      orderNumber: nextOrderNumber(),
      lines: cart.lines.map((line) => ({
        itemId: line.item.id,
        name: line.item.name,
        unitPrice: line.item.price,
        quantity: line.quantity,
        lineTotal: lineTotal(line),
      })),
      discountLabel: cart.discount.label,
      ...totals,
      placedAt: now(),
    },
  };
}

function findError(lines: readonly CartLine[]): OrderError | null {
  if (lines.length === 0) {
    return { code: "EMPTY_CART", message: "Your cart is empty.", items: [] };
  }

  const invalid = lines.filter((line) => !isValidQuantity(line.quantity)).map((line) => line.item);
  if (invalid.length > 0) {
    return {
      code: "INVALID_QUANTITY",
      message: `Quantity must be a whole number from ${MIN_QUANTITY} to ${MAX_QUANTITY}: ${names(invalid)}.`,
      items: invalid,
    };
  }

  const outOfStock = lines.filter((line) => !line.item.inStock).map((line) => line.item);
  if (outOfStock.length > 0) {
    return {
      code: "OUT_OF_STOCK",
      message: `Out of stock: ${names(outOfStock)}.`,
      items: outOfStock,
    };
  }

  return null;
}

function names(items: readonly MenuItem[]): string {
  return items.map((item) => item.name).join(", ");
}
