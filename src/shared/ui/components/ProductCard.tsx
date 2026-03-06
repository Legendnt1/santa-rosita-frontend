import type { Product } from '@/modules/catalog/domain/entities/Product';
import { formatPrice } from '@/shared/utils/price';

/**
 * Props for the ProductCard server component.
 * Receives a domain Product and localized label strings.
 */
interface ProductCardProps {
  /** The product entity to render */
  product: Product;
  /** Localized labels injected from the parent */
  labels: {
    /** Abbreviated stock label (e.g. "C", "Qty", "数量") */
    stock: string;
  };
}

/**
 * Displays a single product card with image, price, and stock info.
 * React 19 Server Component — renders on the server with zero client JS.
 *
 * @remarks
 * Uses Tailwind 4 utility classes and CSS custom properties
 * defined in globals.css (font-family via `--font-sans`).
 */
export function ProductCard({ product, labels }: ProductCardProps) {
  return (
    <article className="flex w-full shrink-0 flex-col overflow-hidden sm:w-44 md:w-48">
      {/* Product image */}
      <div className="flex aspect-square items-center justify-center rounded-lg bg-white p-3 shadow-sm sm:rounded-xl sm:p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Price & stock */}
      <div className="mt-1.5 px-0.5 sm:mt-2 sm:px-1">
        <p className="text-sm font-semibold text-foreground sm:text-base">
          {formatPrice(product.currency, product.price)}
        </p>
        <p className="text-xs text-foreground/60 sm:text-sm">
          {labels.stock}: {product.stock}
        </p>
      </div>
    </article>
  );
}
