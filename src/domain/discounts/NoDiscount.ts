import type { DiscountStrategy } from "./DiscountStrategy";

export class NoDiscount implements DiscountStrategy {
  readonly id = "none";
  readonly label = "None";
  readonly description = "Pay the full price.";

  calculateDiscount(): number {
    return 0;
  }
}
