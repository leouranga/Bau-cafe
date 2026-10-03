import { billableQuantity } from "../pricing";
import type { CartLine } from "../types";
import type { DiscountStrategy } from "./DiscountStrategy";

/**
 * Happy Hour: every second drink is free.
 *
 * All drink units are lined up from most to least expensive and every 2nd unit is free,
 * so in each pair the cheaper drink is the free one. Food is never discounted.
 *
 * Examples: 2 lattes → 1 latte free. Latte + espresso → espresso free. 3 drinks → 1 free.
 */
export class HappyHourDiscount implements DiscountStrategy {
  readonly id = "happy-hour";
  readonly label = "Happy Hour";
  readonly description = "Second drink free (the cheaper one in each pair).";

  calculateDiscount(lines: readonly CartLine[]): number {
    const drinkUnitPrices = lines
      .filter((line) => line.item.category === "drink")
      .flatMap((line) => Array<number>(billableQuantity(line.quantity)).fill(line.item.price))
      .sort((a, b) => b - a);

    return drinkUnitPrices.reduce((free, price, index) => (index % 2 === 1 ? free + price : free), 0);
  }
}
