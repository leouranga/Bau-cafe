import type { Cart } from "@/domain/cart";
import CartSummary from "./CartSummary";

export default function Header({ cart }: { cart: Cart }) {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold tracking-widest text-amber-700 uppercase">BAU Café</p>
          <h1 className="text-xl font-bold">Order ahead, skip the queue</h1>
        </div>
        <CartSummary cart={cart} />
      </div>
    </header>
  );
}
