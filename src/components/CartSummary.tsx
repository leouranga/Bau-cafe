import { countItems, type Cart } from "@/domain/cart";
import { formatPrice } from "@/domain/money";
import { calculateTotals } from "@/domain/pricing";
import { useObservable } from "@/hooks/useObservable";

export default function CartSummary({ cart }: { cart: Cart }) {
  const { lines, discount } = useObservable(cart);
  const count = countItems(lines);
  const { total } = calculateTotals(lines, discount);

  return (
    <a
      href="#order"
      className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-900 tabular-nums hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
    >
      {count} {count === 1 ? "item" : "items"} · {formatPrice(total)}
    </a>
  );
}
