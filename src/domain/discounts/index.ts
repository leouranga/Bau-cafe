import type { DiscountStrategy } from "./DiscountStrategy";
import { HappyHourDiscount } from "./HappyHourDiscount";
import { NoDiscount } from "./NoDiscount";
import { StaffDiscount } from "./StaffDiscount";
import { StudentDiscount } from "./StudentDiscount";

export type { DiscountStrategy } from "./DiscountStrategy";
export { HappyHourDiscount, NoDiscount, StaffDiscount, StudentDiscount };

/**
 * Every discount the customer can choose, in the order they appear in the picker.
 *
 * SOLID (O): to add a discount, write a new class that implements `DiscountStrategy` and add
 * it to this list. The cart, pricing, `placeOrder` and the UI don't need to change.
 */
export const DISCOUNTS: readonly DiscountStrategy[] = [
  new NoDiscount(),
  new StudentDiscount(),
  new StaffDiscount(),
  new HappyHourDiscount(),
];
