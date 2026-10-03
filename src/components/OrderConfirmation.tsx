import { formatPrice } from "@/domain/money";
import type { Order } from "@/domain/placeOrder";
import TotalsList from "./TotalsList";

interface OrderConfirmationProps {
  order: Order;
  onNewOrder: () => void;
}

export default function OrderConfirmation({ order, onNewOrder }: OrderConfirmationProps) {
  return (
    <section
      aria-labelledby="confirmation-heading"
      className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-emerald-300"
    >
      <p role="status" className="text-sm font-semibold text-emerald-700">
        Order placed at {order.placedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>
      <h2 id="confirmation-heading" className="mt-1 text-2xl font-bold">
        Order {order.orderNumber}
      </h2>
      <p className="text-sm text-stone-500">Show this number at the counter to collect your order.</p>

      <ul className="mt-4 divide-y divide-stone-100 border-y border-stone-100 text-sm">
        {order.lines.map((line) => (
          <li key={line.itemId} className="flex justify-between gap-3 py-2">
            <span>
              {line.quantity} × {line.name}
            </span>
            <span className="tabular-nums">{formatPrice(line.lineTotal)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4">
        <TotalsList totals={order} discountLabel={order.discountLabel} />
      </div>

      <button
        type="button"
        onClick={onNewOrder}
        className="mt-5 w-full rounded-full bg-amber-700 px-5 py-3 font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
      >
        Start a new order
      </button>
    </section>
  );
}
