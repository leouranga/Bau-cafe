import { formatPrice } from "@/domain/money";
import { MAX_QUANTITY, MIN_QUANTITY, isValidQuantity } from "@/domain/placeOrder";
import { billableQuantity, lineTotal } from "@/domain/pricing";
import type { CartLine } from "@/domain/types";

interface CartLineRowProps {
  line: CartLine;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

const stepButton =
  "flex size-8 items-center justify-center rounded-full border border-stone-300 text-lg leading-none hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40";

export default function CartLineRow({ line, onQuantityChange, onRemove }: CartLineRowProps) {
  const { item, quantity } = line;
  const current = billableQuantity(quantity);
  const inputId = `quantity-${item.id}`;
  const hintId = `hint-${item.id}`;

  const hints = [
    !isValidQuantity(quantity) && `Quantity must be a whole number from ${MIN_QUANTITY} to ${MAX_QUANTITY}.`,
    !item.inStock && "Out of stock. Remove it to place your order.",
  ].filter((hint): hint is string => Boolean(hint));

  return (
    <li className="py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-stone-500">{formatPrice(item.price)} each</p>
        </div>
        <p className="font-semibold tabular-nums">{formatPrice(lineTotal(line))}</p>
      </div>

      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={`One less ${item.name}`}
            onClick={() => onQuantityChange(current - 1)}
            disabled={current <= MIN_QUANTITY}
            className={stepButton}
          >
            −
          </button>
          <label htmlFor={inputId} className="sr-only">
            Quantity of {item.name}
          </label>
          <input
            id={inputId}
            type="number"
            inputMode="numeric"
            min={MIN_QUANTITY}
            max={MAX_QUANTITY}
            step={1}
            value={Number.isNaN(quantity) ? "" : quantity}
            onChange={(event) => onQuantityChange(event.target.valueAsNumber)}
            aria-invalid={!isValidQuantity(quantity)}
            aria-describedby={hints.length > 0 ? hintId : undefined}
            className="h-8 w-14 rounded-lg border border-stone-300 text-center tabular-nums aria-[invalid=true]:border-red-500 aria-[invalid=true]:bg-red-50"
          />
          <button
            type="button"
            aria-label={`One more ${item.name}`}
            onClick={() => onQuantityChange(current + 1)}
            className={stepButton}
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-sm text-stone-500 underline underline-offset-2 hover:text-red-700"
        >
          Remove
        </button>
      </div>

      {hints.length > 0 && (
        <ul id={hintId} className="mt-2 space-y-0.5 text-sm text-red-700">
          {hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      )}
    </li>
  );
}
