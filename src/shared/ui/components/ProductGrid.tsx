import type { Product } from "@/modules/catalog/domain/entities/Product";
import Link from "next/link";

/**
 * Props for the ProductGrid server component.
 */
interface ProductGridProps {
  /** Filtered products to display */
  products: Product[];
  /** Localized labels */
  labels: {
    noResults: string;
    clearFilters: string;
    reviews: string;
    delivery: string;
    outOfStock: string;
    addToCart: string;
    stock: string;
  };
  /** Current locale */
  locale: string;
  /** Current category slug for the clear-filters link */
  categorySlug: string;
}

/**
 * Star rating display for product cards.
 */
function StarRating({
  rating,
  reviewCount,
  reviewsLabel,
}: {
  rating: number;
  reviewCount: number;
  reviewsLabel: string;
}) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
  const text = reviewsLabel.replace("{count}", String(reviewCount));

  return (
    <div className="flex items-center gap-1">
      <span
        className="flex items-center"
        aria-label={`${rating} out of 5 stars`}
      >
        {Array.from({ length: fullStars }, (_, i) => (
          <svg
            key={`f${i}`}
            className="h-3.5 w-3.5 text-amber-400"
          >
            <use href="/assets/icons/icons.svg#star-full" />
          </svg>
        ))}
        {hasHalf && (
          <svg className="h-3.5 w-3.5 text-amber-400">
            <use href="/assets/icons/icons.svg#star-half" />
          </svg>
        )}
        {Array.from({ length: emptyStars }, (_, i) => (
          <svg
            key={`e${i}`}
            className="h-3.5 w-3.5 text-foreground-muted/25"
          >
            <use href="/assets/icons/icons.svg#star-empty" />
          </svg>
        ))}
      </span>
      <span className="text-xs text-foreground-muted">({text})</span>
    </div>
  );
}

/**
 * High-density product card for the listing grid.
 * Shows image, price (with optional discount), rating, brand, and delivery info.
 */
function ListingProductCard({
  product,
  labels,
  locale,
}: {
  product: Product;
  labels: ProductGridProps["labels"];
  locale: string;
}) {
  const effectivePrice = product.discountPrice ?? product.price;
  const hasDiscount = product.discountPrice !== undefined;
  const isOutOfStock = product.stock <= 0;
  const deliveryText = labels.delivery.replace("{date}", product.deliveryDate);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md">
      {/* Product image */}
      <div className="relative flex aspect-square items-center justify-center bg-white p-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Discount badge */}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-md bg-accent px-2 py-0.5 text-[10px] font-bold text-accent-foreground">
            -
            {Math.round(
              ((product.price - product.discountPrice!) / product.price) * 100,
            )}
            %
          </span>
        )}

        {/* Out of stock overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
            <span className="rounded-md bg-foreground/80 px-3 py-1 text-xs font-bold text-white">
              {labels.outOfStock}
            </span>
          </div>
        )}
      </div>

      {/* Product details */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {/* Brand */}
        <span className="text-[10px] font-medium tracking-wider text-primary uppercase">
          {product.brand}
        </span>

        {/* Name */}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-card-foreground">
          <a
            href={`/${locale}/catalog/product/${product.id}`}
            className="transition-colors hover:text-primary"
          >
            {product.name}
          </a>
        </h3>

        {/* Rating */}
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          reviewsLabel={labels.reviews}
        />

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-bold text-base text-card-foreground">
            {product.currency} {effectivePrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-foreground-muted line-through">
              {product.currency} {product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Delivery info */}
        {!isOutOfStock && (
          <p className="text-[11px] text-foreground-muted">
            <svg
              className="mr-0.5 inline h-3 w-3 text-emerald-500"
            >
              <use href="/assets/icons/icons.svg#check"
              />
            </svg>
            {deliveryText}
          </p>
        )}

        {/* Add to cart button */}
        <button
          type="button"
          disabled={isOutOfStock}
          className="mt-2 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {labels.addToCart}
        </button>
      </div>
    </article>
  );
}

/**
 * Renders a responsive grid of product listing cards.
 * Shows an empty state when no products match the current filters.
 * React 19 Server Component.
 */
export function ProductGrid({
  products,
  labels,
  locale,
  categorySlug,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-card/50 px-6 py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-foreground-muted/30"
        >
          <use href="/assets/icons/icons.svg#search" />
        </svg>
        <p className="text-sm text-foreground-muted">{labels.noResults}</p>
        <Link
          href={`/${locale}/catalog/${categorySlug}`}
          className="mt-3 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {labels.clearFilters}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ListingProductCard
          key={product.id}
          product={product}
          labels={labels}
          locale={locale}
        />
      ))}
    </div>
  );
}
