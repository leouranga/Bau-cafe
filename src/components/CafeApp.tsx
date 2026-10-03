"use client";

import { useState } from "react";
import { Cart } from "@/domain/cart";
import { MENU } from "@/domain/menu";
import { placeOrder, type Order } from "@/domain/placeOrder";
import type { MenuItem } from "@/domain/types";
import CartPanel from "./CartPanel";
import Header from "./Header";
import Menu from "./Menu";
import OrderConfirmation from "./OrderConfirmation";
import type { FailedAttempt } from "./OrderErrorAlert";

export default function CafeApp() {
  const [cart] = useState(() => new Cart());
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [failedAttempt, setFailedAttempt] = useState<FailedAttempt | null>(null);

  function handleAdd(item: MenuItem) {
    setPlacedOrder(null);
    cart.add(item);
  }

  function handlePlaceOrder() {
    const snapshot = cart.getSnapshot();
    const result = placeOrder(snapshot);

    if (result.ok) {
      setFailedAttempt(null);
      setPlacedOrder(result.order);
      cart.clear();
    } else {
      setFailedAttempt({ error: result.error, cart: snapshot });
    }
  }

  return (
    <>
      <Header cart={cart} />
      <main className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Menu items={MENU} onAdd={handleAdd} />
        <aside id="order" className="scroll-mt-4 lg:sticky lg:top-6 lg:self-start">
          {placedOrder ? (
            <OrderConfirmation order={placedOrder} onNewOrder={() => setPlacedOrder(null)} />
          ) : (
            <CartPanel cart={cart} failedAttempt={failedAttempt} onPlaceOrder={handlePlaceOrder} />
          )}
        </aside>
      </main>
    </>
  );
}
