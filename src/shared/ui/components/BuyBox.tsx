import type { Product } from "@/modules/catalog/domain/entities/Product";

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
  labels: BuyBoxProps["labels"];
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
        {labels.onlyXLeft.replace("{count}", String(stock))}
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
  const deliveryText = labels.delivery.replace("{date}", product.deliveryDate);
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
            {labels.youSave}: {product.currency} {savingsAmount.toFixed(2)} (
            {savingsPercent}%)
          </p>
        )}
      </div>

      {/* ── Delivery ─────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 border-t border-border/30 pt-3">
        <p className="text-sm text-card-foreground">
          <svg className="mr-1 inline h-3.5 w-3.5 text-emerald-500">
            <use href="/assets/icons/icons.svg#check" />
          </svg>
          {deliveryText}
        </p>
        <p className="flex items-center gap-1 text-xs text-foreground-muted">
          <svg className="h-3.5 w-3.5">
            <use href="/assets/icons/icons.svg#map-pin" />
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
              (_, i) => i + 1,
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
          <svg className="h-3.5 w-3.5 text-foreground-muted/70">
            <use href="/assets/icons/icons.svg#lock" />
          </svg>
          {labels.secureTransaction}
        </p>
        <p>
          <span className="text-foreground-muted/70">{labels.soldBy}</span>{" "}
          <span className="font-medium text-primary">{labels.storeName}</span>
        </p>
        <p className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-foreground-muted/70">
            <use href="/assets/icons/icons.svg#refresh" />
          </svg>
          {labels.returnPolicy}
        </p>
      </div>
    </div>
  );
}
