import { latte, line, muffin } from "../__fixtures__/items";
import { HappyHourDiscount, NoDiscount, StudentDiscount, type DiscountStrategy } from "../discounts";
import { calculateTotals } from "../pricing";

describe("calculateTotals", () => {
  it("is all zeros for an empty cart", () => {
    expect(calculateTotals([], new StudentDiscount())).toEqual({ subtotal: 0, discount: 0, total: 0 });
  });

  it("adds up price × quantity for every line", () => {
    // 2 × 3.50 + 1 × 2.90 = 9.90
    expect(calculateTotals([line(latte, 2), line(muffin)], new NoDiscount())).toEqual({
      subtotal: 990,
      discount: 0,
      total: 990,
    });
  });

  it("subtracts the chosen discount from the subtotal", () => {
    const lines = [line(latte, 2), line(muffin)];

    expect(calculateTotals(lines, new StudentDiscount())).toEqual({ subtotal: 990, discount: 99, total: 891 });
    expect(calculateTotals(lines, new HappyHourDiscount())).toEqual({ subtotal: 990, discount: 350, total: 640 });
  });

  it("never lets a discount push the total below zero", () => {
    const tooGenerous: DiscountStrategy = {
      id: "too-generous",
      label: "Too generous",
      description: "",
      calculateDiscount: () => 10_000,
    };

    expect(calculateTotals([line(muffin)], tooGenerous)).toEqual({ subtotal: 290, discount: 290, total: 0 });
  });

  it("ignores quantities that can't be charged instead of producing negative or NaN totals", () => {
    expect(calculateTotals([line(latte, -3), line(muffin, Number.NaN)], new NoDiscount()).total).toBe(0);
  });
});
