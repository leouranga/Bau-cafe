import type { Cart } from "@/domain/cart";
import CartLines from "./CartLines";
import CartTotal from "./CartTotal";
import DiscountPicker from "./DiscountPicker";
import OrderErrorAlert, { type FailedAttempt } from "./OrderErrorAlert";

interface CartPanelProps {
  cart: Cart;
  failedAttempt: FailedAttempt | null;
  onPlaceOrder: () => void;
}

export default function CartPanel({ cart, failedAttempt, onPlaceOrder }: CartPanelProps) {
  return (
    <section aria-labelledby="cart-heading" className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <h2 id="cart-heading" className="text-lg font-bold">
        Your order
      </h2>
      <CartLines cart={cart} />
      <DiscountPicker cart={cart} />
      <CartTotal cart={cart} />
      {failedAttempt && <OrderErrorAlert cart={cart} attempt={failedAttempt} />}
      {/* Always enabled, so an empty cart shows the EMPTY_CART error instead of a dead button. */}
      <button
        type="button"
        onClick={onPlaceOrder}
        className="mt-5 w-full rounded-full bg-stone-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
      >
        Place order
      </button>
    </section>
  );
}
