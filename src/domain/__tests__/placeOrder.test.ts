import { espresso, latte, line, muffin, soldOutTea } from "../__fixtures__/items";
import { HappyHourDiscount, NoDiscount } from "../discounts";
import { createOrderNumberGenerator, placeOrder } from "../placeOrder";
import type { CartLine } from "../types";

const noDiscount = new NoDiscount();
const cartOf = (...lines: CartLine[]) => ({ lines, discount: noDiscount });

describe("placeOrder: errors", () => {
  it("returns EMPTY_CART when there is nothing in the cart", () => {
    const result = placeOrder(cartOf());

    expect(result).toEqual({
      ok: false,
      error: { code: "EMPTY_CART", message: "Your cart is empty.", items: [] },
    });
  });

  it.each([0, 11, -1, 2.5, Number.NaN])("returns INVALID_QUANTITY for a quantity of %p", (quantity) => {
    const result = placeOrder(cartOf(line(muffin), line(latte, quantity)));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("INVALID_QUANTITY");
      expect(result.error.items).toEqual([latte]);
    }
  });

  it("returns OUT_OF_STOCK and names the item", () => {
    const result = placeOrder(cartOf(line(latte), line(soldOutTea)));

    expect(result).toEqual({
      ok: false,
      error: { code: "OUT_OF_STOCK", message: "Out of stock: Iced Tea.", items: [soldOutTea] },
    });
  });

  it("reports INVALID_QUANTITY before OUT_OF_STOCK", () => {
    const result = placeOrder(cartOf(line(latte, 11), line(soldOutTea)));

    expect(!result.ok && result.error.code).toBe("INVALID_QUANTITY");
  });
});

describe("placeOrder: success", () => {
  const deps = {
    nextOrderNumber: () => "#4242",
    now: () => new Date("2026-10-02T09:30:00Z"),
  };

  it("accepts the boundary quantities 1 and 10", () => {
    expect(placeOrder(cartOf(line(latte, 1), line(muffin, 10)), deps).ok).toBe(true);
  });

  it("returns an order number and a full summary", () => {
    const cart = { lines: [line(latte, 2), line(espresso), line(muffin)], discount: new HappyHourDiscount() };

    const result = placeOrder(cart, deps);

    expect(result).toEqual({
      ok: true,
      order: {
        orderNumber: "#4242",
        lines: [
          { itemId: "latte", name: "Latte", unitPrice: 350, quantity: 2, lineTotal: 700 },
          { itemId: "espresso", name: "Espresso", unitPrice: 200, quantity: 1, lineTotal: 200 },
          { itemId: "muffin", name: "Muffin", unitPrice: 290, quantity: 1, lineTotal: 290 },
        ],
        discountLabel: "Happy Hour",
        subtotal: 1190,
        discount: 350, // latte, latte, espresso → the second latte is free
        total: 840,
        placedAt: new Date("2026-10-02T09:30:00Z"),
      },
    });
  });
});

describe("createOrderNumberGenerator", () => {
  it("hands out increasing order numbers", () => {
    const next = createOrderNumberGenerator(7);
    expect([next(), next(), next()]).toEqual(["#7", "#8", "#9"]);
  });
});
