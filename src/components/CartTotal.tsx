import type { Cart } from "@/domain/cart";
import { calculateTotals } from "@/domain/pricing";
import { useObservable } from "@/hooks/useObservable";
import TotalsList from "./TotalsList";

export default function CartTotal({ cart }: { cart: Cart }) {
  const { lines, discount } = useObservable(cart);

  return (
    <div className="mt-5 border-t border-stone-200 pt-4" aria-live="polite">
      <TotalsList totals={calculateTotals(lines, discount)} discountLabel={discount.label} />
    </div>
  );
}
