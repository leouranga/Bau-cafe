import type { DiscountStrategy } from "./discounts/DiscountStrategy";
import { NoDiscount } from "./discounts/NoDiscount";
import { Observable } from "./observer";
import { billableQuantity } from "./pricing";
import type { CartLine, CartSnapshot, MenuItem } from "./types";


export class Cart extends Observable<CartSnapshot> {
  constructor(discount: DiscountStrategy = new NoDiscount()) {
    super({ lines: [], discount });
  }

  /** Adds one unit of `item`, or one more unit if it's already in the cart. */
  add(item: MenuItem): void {
    const { lines } = this.getSnapshot();
    const existing = lines.find((line) => line.item.id === item.id);

    const nextLines: CartLine[] = existing
      ? lines.map((line) =>
          line.item.id === item.id ? { ...line, quantity: billableQuantity(line.quantity) + 1 } : line,
        )
      : [...lines, { item, quantity: 1 }];

    this.update({ lines: nextLines });
  }

  remove(itemId: string): void {
    this.update({ lines: this.getSnapshot().lines.filter((line) => line.item.id !== itemId) });
  }

  /** Stores the quantity as given (even an invalid one) so the customer can see and fix it. */
  setQuantity(itemId: string, quantity: number): void {
    this.update({
      lines: this.getSnapshot().lines.map((line) => (line.item.id === itemId ? { ...line, quantity } : line)),
    });
  }

  setDiscount(discount: DiscountStrategy): void {
    this.update({ discount });
  }

  /** Empties the cart but keeps the chosen discount. */
  clear(): void {
    this.update({ lines: [] });
  }

  private update(changes: Partial<CartSnapshot>): void {
    this.setState({ ...this.getSnapshot(), ...changes });
  }
}

/** Total number of units in the cart, e.g. 2 lattes + 1 muffin → 3. */
export function countItems(lines: readonly CartLine[]): number {
  return lines.reduce((count, line) => count + billableQuantity(line.quantity), 0);
}
