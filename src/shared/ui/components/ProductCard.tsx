import Image from "next/image";
import Link from "next/link";
import { ViewTransition } from "react";
import type { Product } from "@/modules/catalog/domain/entities/Product";
import { formatPrice } from "@/shared/utils/price";

interface ProductCardProps {
  /** The product entity to render */
  product: Product;
  /** Current locale for PDP link building */
  locale: string;
  /** Localized stock labels */
  labels: {
    inStock: string;
    /** Template with `{count}` placeholder, e.g. "Only {count} left" */
    lowStock: string;
    outOfStock: string;
  };
}

/**
 * Resolves a semantic stock bucket and its pill color token.
 * 0 → danger, 1–5 → warning, 6+ → success.
 */
function getStockState(
  stock: number,
  labels: ProductCardProps["labels"],
): { label: string; className: string } {
  if (stock <= 0) {
    return { label: labels.outOfStock, className: "stock-pill-out" };
  }
  if (stock <= 5) {
    return {
      label: labels.lowStock.replace("{count}", String(stock)),
      className: "stock-pill-low",
    };
  }
  return { label: labels.inStock, className: "stock-pill-ok" };
}

/**
 * Displays a single product card with image, price, and semantic stock
 * availability. The whole card is a link to the Product Detail Page so the
 * user can tap anywhere to open it — a usability expectation for e-commerce
 * grids, especially for older buyers who may not aim for a small title link.
 *
 * @remarks
 * Image surface uses `--card` (not hardcoded white) so dark mode does not
 * create jarring bright patches. Stock is rendered as a color-coded pill
 * (green / amber / red) instead of plain "Qty: N" text — users scan stock
 * much faster with semantic color than with numbers alone.
 */
export function ProductCard({ product, locale, labels }: ProductCardProps) {
  const stockState = getStockState(product.stock, labels);
  const hasDiscount =
    typeof product.discountPrice === "number" &&
    product.discountPrice < product.price;

  return (
    <Link
      href={`/${locale}/catalog/product/${product.id}`}
      transitionTypes={["nav-forward"]}
      className="group animate-fade-in-up flex w-full shrink-0 flex-col rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-44 md:w-48"
    >
      <ViewTransition name={`product-image-${product.id}`} share="morph" default="none">
        <div className="product-image-tile p-3 sm:p-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 192px, (min-width: 640px) 176px, 50vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.04] sm:p-4"
          />
        </div>
      </ViewTransition>

      <div className="mt-2.5 flex flex-1 flex-col gap-1.5 px-0.5 sm:px-1">
        <p className="line-clamp-2 min-h-[2.5em] text-xs font-semibold leading-snug text-foreground sm:text-[13px]">
          {product.name}
        </p>

        {/* Price row: big price + reserved strikethrough slot so cards with
            and without a discount keep the same vertical rhythm. */}
        <div className="flex items-baseline gap-2">
          <span className="text-base font-extrabold tracking-tight text-foreground sm:text-lg">
            {formatPrice(
              product.currency,
              hasDiscount ? product.discountPrice! : product.price,
            )}
          </span>
          <span
            aria-hidden={!hasDiscount}
            className={`text-[11px] font-medium text-foreground-muted line-through sm:text-xs ${
              hasDiscount ? "" : "invisible"
            }`}
          >
            {formatPrice(product.currency, product.price)}
          </span>
        </div>

        {/* `mt-auto` anchors the pill to the card's bottom edge so pills
            across sibling cards share the same baseline. */}
        <span
          className={`stock-pill ${stockState.className} mt-auto self-start`}
        >
          {stockState.label}
        </span>
      </div>
    </Link>
  );
}
