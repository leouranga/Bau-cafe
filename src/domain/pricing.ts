import type { DiscountStrategy } from "./discounts/DiscountStrategy";
import type { CartLine, Totals } from "./types";


export function billableQuantity(quantity: number): number {
  return Number.isFinite(quantity) ? Math.max(0, Math.floor(quantity)) : 0;
}

export function lineTotal(line: CartLine): number {
  return line.item.price * billableQuantity(line.quantity);
}

export function calculateSubtotal(lines: readonly CartLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}


export function calculateTotals(lines: readonly CartLine[], discountStrategy: DiscountStrategy): Totals {
  const subtotal = calculateSubtotal(lines);
  const discount = Math.min(subtotal, Math.max(0, discountStrategy.calculateDiscount(lines)));
  return { subtotal, discount, total: subtotal - discount };
}
