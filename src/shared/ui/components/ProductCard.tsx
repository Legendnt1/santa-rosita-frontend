import type { Product } from '@/modules/catalog/domain/entities/Product';

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
    <article className="flex w-44 shrink-0 flex-col overflow-hidden sm:w-48">
      {/* Product image */}
      <div className="flex aspect-square items-center justify-center rounded-xl bg-white p-4 shadow-sm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Price & stock */}
      <div className="mt-2 px-1">
        <p className="font-semibold text-foreground">
          {product.currency} {product.price.toFixed(2)}
        </p>
        <p className="text-sm text-foreground/60">
          {labels.stock}: {product.stock}
        </p>
      </div>
    </article>
  );
}
