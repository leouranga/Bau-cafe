import type { Cart } from "@/domain/cart";
import { DISCOUNTS } from "@/domain/discounts";
import { useObservable } from "@/hooks/useObservable";

export default function DiscountPicker({ cart }: { cart: Cart }) {
  const { discount: selected } = useObservable(cart);

  return (
    <fieldset className="mt-5">
      <legend className="text-sm font-semibold">Discount</legend>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {DISCOUNTS.map((discount) => {
          const checked = discount.id === selected.id;
          return (
            <label
              key={discount.id}
              className={`flex cursor-pointer items-start gap-2 rounded-xl border p-3 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-amber-700 ${
                checked ? "border-amber-600 bg-amber-50" : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="discount"
                value={discount.id}
                checked={checked}
                onChange={() => cart.setDiscount(discount)}
                className="mt-0.5 accent-amber-700"
              />
              <span>
                <span className="block font-medium">{discount.label}</span>
                <span className="block text-xs text-stone-500">{discount.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
