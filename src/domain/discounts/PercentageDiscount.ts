import { calculateSubtotal } from "../pricing";
import type { CartLine } from "../types";
import type { DiscountStrategy } from "./DiscountStrategy";

/** Reusable base for "X% off the whole order" rules (Student, Staff, …). */
export class PercentageDiscount implements DiscountStrategy {
  constructor(
    readonly id: string,
    readonly label: string,
    readonly description: string,
    /** Fraction of the subtotal to take off, e.g. 0.1 for 10%. */
    private readonly rate: number,
  ) {}

  calculateDiscount(lines: readonly CartLine[]): number {
    // Round to whole cents.
    return Math.round(calculateSubtotal(lines) * this.rate);
  }
}
