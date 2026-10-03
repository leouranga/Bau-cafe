import { espresso, latte, line, muffin } from "../__fixtures__/items";
import { DISCOUNTS, HappyHourDiscount, NoDiscount, StaffDiscount, StudentDiscount } from "../discounts";

describe("NoDiscount", () => {
  it("never takes anything off", () => {
    expect(new NoDiscount().calculateDiscount()).toBe(0);
  });
});

describe("StudentDiscount", () => {
  it("takes 10% off the subtotal", () => {
    // 2 × 3.50 + 2.90 = 9.90 → 0.99 off
    expect(new StudentDiscount().calculateDiscount([line(latte, 2), line(muffin)])).toBe(99);
  });

  it("rounds to whole cents", () => {
    const pricey = { ...muffin, price: 345 }; // 10% = 34.5 cents
    expect(new StudentDiscount().calculateDiscount([line(pricey)])).toBe(35);
  });
});

describe("StaffDiscount", () => {
  it("takes 15% off the subtotal", () => {
    // 2 × 3.50 = 7.00 → 1.05 off
    expect(new StaffDiscount().calculateDiscount([line(latte, 2)])).toBe(105);
  });
});

describe("HappyHourDiscount", () => {
  const happyHour = new HappyHourDiscount();

  it("gives nothing for a single drink", () => {
    expect(happyHour.calculateDiscount([line(latte)])).toBe(0);
  });

  it("makes the second of two identical drinks free", () => {
    expect(happyHour.calculateDiscount([line(latte, 2)])).toBe(350);
  });

  it("makes the cheaper drink of a pair free", () => {
    expect(happyHour.calculateDiscount([line(latte), line(espresso)])).toBe(200);
  });

  it("only makes every second drink free", () => {
    // 3 lattes → 1 free
    expect(happyHour.calculateDiscount([line(latte, 3)])).toBe(350);
    // latte, latte, espresso, espresso → one latte + one espresso free
    expect(happyHour.calculateDiscount([line(latte, 2), line(espresso, 2)])).toBe(550);
  });

  it("never discounts food", () => {
    expect(happyHour.calculateDiscount([line(muffin, 4)])).toBe(0);
    expect(happyHour.calculateDiscount([line(latte), line(muffin)])).toBe(0);
  });
});

describe("DISCOUNTS registry", () => {
  it("offers None, Student, Staff and Happy Hour with unique ids", () => {
    const ids = DISCOUNTS.map((discount) => discount.id);
    expect(ids).toEqual(["none", "student", "staff", "happy-hour"]);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
