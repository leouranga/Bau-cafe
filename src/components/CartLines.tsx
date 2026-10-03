import type { Cart } from "@/domain/cart";
import { useObservable } from "@/hooks/useObservable";
import CartLineRow from "./CartLineRow";

export default function CartLines({ cart }: { cart: Cart }) {
  const { lines } = useObservable(cart);

  if (lines.length === 0) {
    return (
      <p className="mt-3 rounded-xl border border-dashed border-stone-300 p-4 text-center text-sm text-stone-500">
        Your cart is empty. Add something from the menu.
      </p>
    );
  }

  return (
    <ul className="mt-2 divide-y divide-stone-100">
      {lines.map((line) => (
        <CartLineRow
          key={line.item.id}
          line={line}
          onQuantityChange={(quantity) => cart.setQuantity(line.item.id, quantity)}
          onRemove={() => cart.remove(line.item.id)}
        />
      ))}
    </ul>
  );
}
