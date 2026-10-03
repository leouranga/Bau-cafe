import { formatPrice } from "@/domain/money";
import type { MenuItem } from "@/domain/types";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-semibold">{item.name}</h4>
        <span className="font-semibold tabular-nums">{formatPrice(item.price)}</span>
      </div>
      <p className="mt-1 flex-1 text-sm text-stone-600">{item.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        {item.inStock ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
            In stock
          </span>
        ) : (
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-800">Out of stock</span>
        )}
        {/* Out-of-stock items can still be added; placeOrder then reports OUT_OF_STOCK. */}
        <button
          type="button"
          onClick={() => onAdd(item)}
          aria-label={`Add ${item.name}`}
          className="rounded-full bg-amber-700 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-amber-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
        >
          Add
        </button>
      </div>
    </article>
  );
}
