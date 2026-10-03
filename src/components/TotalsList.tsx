import { formatPrice } from "@/domain/money";
import type { Totals } from "@/domain/types";

interface TotalsListProps {
  totals: Totals;
  discountLabel: string;
}

export default function TotalsList({ totals, discountLabel }: TotalsListProps) {
  return (
    <dl className="space-y-1 text-sm tabular-nums">
      <div className="flex justify-between">
        <dt className="text-stone-600">Subtotal</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-stone-600">Discount ({discountLabel})</dt>
        <dd className={totals.discount > 0 ? "text-emerald-700" : undefined}>−{formatPrice(totals.discount)}</dd>
      </div>
      <div className="flex justify-between pt-1 text-base font-bold">
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
