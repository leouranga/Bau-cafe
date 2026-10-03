import { PercentageDiscount } from "./PercentageDiscount";

export class StaffDiscount extends PercentageDiscount {
  constructor() {
    super("staff", "Staff", "15% off your whole order.", 0.15);
  }
}
