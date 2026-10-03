import { PercentageDiscount } from "./PercentageDiscount";

export class StudentDiscount extends PercentageDiscount {
  constructor() {
    super("student", "Student", "10% off your whole order.", 0.1);
  }
}
