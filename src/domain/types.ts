import type { DiscountStrategy } from "./discounts/DiscountStrategy";

export type Category = "drink" | "food";

export interface MenuItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  /** Price in cents (integer) so totals never suffer from floating-point rounding. */
  readonly price: number;
  readonly category: Category;
  readonly inStock: boolean;
}

export interface CartLine {
  readonly item: MenuItem;
  /** Stored exactly as the customer entered it; `placeOrder` decides whether it is valid. */
  readonly quantity: number;
}

/** An immutable picture of the cart at one moment. A new one is created on every change. */
export interface CartSnapshot {
  readonly lines: readonly CartLine[];
  readonly discount: DiscountStrategy;
}

/** All amounts are in cents. */
export interface Totals {
  readonly subtotal: number;
  readonly discount: number;
  readonly total: number;
}
