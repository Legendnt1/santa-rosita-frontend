/**
 * StockBadge component displays the stock availability of a product with color-coded text.
 * - Red for out of stock
 * - Amber for low stock (≤ 5)
 */
interface StockBadgeProps {
  /** Current stock level */
  stock: number;
  /** Localized labels */
  labels: {
    inStock: string;
    outOfStock: string;
    /** Template with `{count}` placeholder, e.g. "Only {count} left" */
    onlyXLeft: string;
  };
}

/**
 * Color-coded stock availability badge.
 * - Red for out of stock
 * - Amber for low stock (≤ 5)
 * - Green for in stock
 */
export function StockBadge({ stock, labels }: StockBadgeProps) {
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
