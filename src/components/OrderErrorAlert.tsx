import type { Cart } from "@/domain/cart";
import type { OrderError, OrderErrorCode } from "@/domain/placeOrder";
import type { CartSnapshot } from "@/domain/types";
import { useObservable } from "@/hooks/useObservable";

/** A rejected "Place order" click, plus the cart it was about. */
export interface FailedAttempt {
  readonly error: OrderError;
  readonly cart: CartSnapshot;
}

const ERROR_COPY: Record<OrderErrorCode, { title: string; hint: string }> = {
  EMPTY_CART: {
    title: "Your cart is empty",
    hint: "Add at least one item from the menu, then place your order.",
  },
  INVALID_QUANTITY: {
    title: "Please check your quantities",
    hint: "Each item needs a whole-number quantity from 1 to 10.",
  },
  OUT_OF_STOCK: {
    title: "Something in your cart is out of stock",
    hint: "Remove the out-of-stock items to continue.",
  },
};

export default function OrderErrorAlert({ cart, attempt }: { cart: Cart; attempt: FailedAttempt }) {
  const current = useObservable(cart);
  if (current !== attempt.cart) {
    return null;
  }

  const { code, items } = attempt.error;
  const { title, hint } = ERROR_COPY[code];

  return (
    <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
      <p className="font-semibold">{title}</p>
      <p className="mt-1">{hint}</p>
      {items.length > 0 && (
        <p className="mt-1">
          Affected: <strong>{items.map((item) => item.name).join(", ")}</strong>
        </p>
      )}
      <p className="mt-2 font-mono text-xs text-red-700">Error code: {code}</p>
    </div>
  );
}
