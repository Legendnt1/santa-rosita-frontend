import type { Product } from '@/modules/catalog/domain/entities/Product';

/**
 * Props for the BuyBox server component.
 */
interface BuyBoxProps {
  /** Product data */
  product: Product;
  /** Localized PDP labels */
  labels: {
    inStock: string;
    outOfStock: string;
    onlyXLeft: string;
    price: string;
    listPrice: string;
    youSave: string;
    quantity: string;
    addToCart: string;
    buyNow: string;
    deliverTo: string;
    delivery: string;
    secureTransaction: string;
    soldBy: string;
    storeName: string;
    returnPolicy: string;
  };
}

/**
 * Renders the stock availability badge.
 */
function StockBadge({
  stock,
  labels,
}: {
  stock: number;
  labels: BuyBoxProps['labels'];
}) {
  if (stock <= 0) {
    return (
      <span className="text-sm font-semibold text-accent">
        {labels.outOfStock}
      </span>
    );
  }

  if (stock <= 5) {
    return (
      <span className="text-sm font-semibold text-amber-600">
        {labels.onlyXLeft.replace('{count}', String(stock))}
      </span>
    );
  }

  return (
    <span className="text-sm font-semibold text-emerald-600">
      {labels.inStock}
    </span>
  );
}

/**
 * Amazon-inspired Buy Box — right-column panel on the PDP.
 * Shows price, stock, delivery info, and action buttons.
 *
 * @remarks
 * "Add to Cart" and "Buy Now" are rendered but **disabled** for Phase 1.
 * React 19 Server Component — zero client JS.
 */
export function BuyBox({ product, labels }: BuyBoxProps) {
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined;
  const isOutOfStock = product.stock <= 0;
  const deliveryText = labels.delivery.replace('{date}', product.deliveryDate);
  const savingsAmount = hasDiscount
    ? product.price - product.discountPrice!
    : 0;
  const savingsPercent = hasDiscount
    ? Math.round((savingsAmount / product.price) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm sm:p-5">
      {/* ── Price ────────────────────────────────────────── */}
      <div>
        {hasDiscount && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs text-foreground-muted">
              {labels.listPrice}:
            </span>
            <span className="text-sm text-foreground-muted line-through">
              {product.currency} {product.price.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-card-foreground sm:text-3xl">
            {product.currency} {effectivePrice.toFixed(2)}
          </span>
        </div>
        {hasDiscount && (
          <p className="mt-1 text-sm text-emerald-600">
            {labels.youSave}: {product.currency} {savingsAmount.toFixed(2)} ({savingsPercent}%)
          </p>
        )}
      </div>

      {/* ── Delivery ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 border-t border-border/30 pt-3">
        <p className="text-sm text-card-foreground">
          <svg className="mr-1 inline h-3.5 w-3.5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
          {deliveryText}
        </p>
        <p className="flex items-center gap-1 text-xs text-foreground-muted">
          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433a19.695 19.695 0 002.592-1.88C16.006 14.684 18 12.027 18 8.999c0-4.152-3.06-6.998-8-6.998C5.06 2 2 4.847 2 9c0 3.027 1.994 5.684 3.836 7.468a19.695 19.695 0 002.592 1.88 12.28 12.28 0 00.757.433c.108.057.2.104.281.14l.018.009.006.002z" clipRule="evenodd" />
          </svg>
          {labels.deliverTo}
        </p>
      </div>

      {/* ── Stock ────────────────────────────────────────── */}
      <div className="border-t border-border/30 pt-3">
        <StockBadge stock={product.stock} labels={labels} />
      </div>

      {/* ── Quantity selector ────────────────────────────── */}
      {!isOutOfStock && (
        <div className="flex items-center gap-2">
          <label
            htmlFor="qty-select"
            className="text-sm font-medium text-card-foreground"
          >
            {labels.quantity}:
          </label>
          <select
            id="qty-select"
            defaultValue="1"
            disabled
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {Array.from(
              { length: Math.min(product.stock, 10) },
              (_, i) => i + 1
            ).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* ── Action buttons ───────────────────────────────── */}
      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {labels.addToCart}
        </button>
        <button
          type="button"
          disabled
          className="w-full rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {labels.buyNow}
        </button>
      </div>

      {/* ── Trust signals ────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 border-t border-border/30 pt-3 text-xs text-foreground-muted">
        <p className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-foreground-muted/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
          </svg>
          {labels.secureTransaction}
        </p>
        <p>
          <span className="text-foreground-muted/70">{labels.soldBy}</span>{' '}
          <span className="font-medium text-primary">{labels.storeName}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-foreground-muted/70" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.28a.75.75 0 00-.75.75v3.955a.75.75 0 001.5 0v-2.134l.228.228a7 7 0 0011.72-3.138.75.75 0 00-1.449-.39 5.5 5.5 0 00-.217.074zm1.107-8.14a.75.75 0 01.164.526v3.955a.75.75 0 01-1.5 0V5.63l-.228.228a7 7 0 01-11.72 3.138.75.75 0 011.449.39 5.5 5.5 0 009.418-2.54l.312.311h-2.433a.75.75 0 010-1.5h3.953a.75.75 0 01.586.276z" clipRule="evenodd" />
          </svg>
          {labels.returnPolicy}
        </p>
      </div>
    </div>
  );
}
