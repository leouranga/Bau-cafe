import type { CartLine } from "../types";

/**
 * Pattern: Strategy. Every discount rule implements this one interface.
 *
 * The cart, the pricing code and the UI only talk to `DiscountStrategy`, so any rule can be
 * swapped in at runtime (SOLID (L): every implementation must be usable wherever this
 * interface is expected).
 */
export interface DiscountStrategy {
  /** Stable identifier, e.g. "student". */
  readonly id: string;
  /** Short name shown in the discount picker, e.g. "Student". */
  readonly label: string;
  /** One-line explanation shown under the label. */
  readonly description: string;
  /** Returns the amount to take off the order, in cents. Never negative. */
  calculateDiscount(lines: readonly CartLine[]): number;
}
