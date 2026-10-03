import { latte, muffin } from "../__fixtures__/items";
import { Cart, countItems } from "../cart";
import { StudentDiscount } from "../discounts";

describe("Cart", () => {
  it("starts empty with no discount", () => {
    const { lines, discount } = new Cart().getSnapshot();
    expect(lines).toEqual([]);
    expect(discount.id).toBe("none");
  });

  it("adds a new item with quantity 1 and increments it when added again", () => {
    const cart = new Cart();
    cart.add(latte);
    cart.add(muffin);
    cart.add(latte);

    expect(cart.getSnapshot().lines).toEqual([
      { item: latte, quantity: 2 },
      { item: muffin, quantity: 1 },
    ]);
  });

  it("removes an item", () => {
    const cart = new Cart();
    cart.add(latte);
    cart.add(muffin);
    cart.remove(latte.id);

    expect(cart.getSnapshot().lines).toEqual([{ item: muffin, quantity: 1 }]);
  });

  it("stores a changed quantity as given, leaving validation to placeOrder", () => {
    const cart = new Cart();
    cart.add(latte);
    cart.setQuantity(latte.id, 12);

    expect(cart.getSnapshot().lines[0].quantity).toBe(12);
  });

  it("clears the lines but keeps the chosen discount", () => {
    const cart = new Cart();
    const student = new StudentDiscount();
    cart.add(latte);
    cart.setDiscount(student);
    cart.clear();

    expect(cart.getSnapshot()).toEqual({ lines: [], discount: student });
  });

  it("notifies every observer with a new snapshot on each change", () => {
    const cart = new Cart();
    const totalObserver = jest.fn();
    const summaryObserver = jest.fn();
    cart.subscribe(totalObserver);
    cart.subscribe(summaryObserver);

    const before = cart.getSnapshot();
    cart.add(latte);
    cart.setDiscount(new StudentDiscount());

    expect(totalObserver).toHaveBeenCalledTimes(2);
    expect(summaryObserver).toHaveBeenCalledTimes(2);
    expect(totalObserver).toHaveBeenLastCalledWith(cart.getSnapshot());
    // Snapshots are immutable: a change creates a new object instead of editing the old one.
    expect(cart.getSnapshot()).not.toBe(before);
    expect(before.lines).toEqual([]);
  });

  it("stops notifying an observer after it unsubscribes", () => {
    const cart = new Cart();
    const observer = jest.fn();
    const unsubscribe = cart.subscribe(observer);

    cart.add(latte);
    unsubscribe();
    cart.add(muffin);

    expect(observer).toHaveBeenCalledTimes(1);
  });
});

describe("countItems", () => {
  it("counts units, not lines", () => {
    expect(countItems([{ item: latte, quantity: 2 }, { item: muffin, quantity: 1 }])).toBe(3);
  });
});
